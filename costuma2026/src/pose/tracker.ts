// People across frames. MediaPipe's multi-pose results come in no fixed order, so each detection is matched to a track
// by where its torso is (greedy, nearest first, within a torso's length); the TRACK's id is the identity — nothing is
// keyed by position (costuma 2024's flicker came from keying state by a position bucket). Smoothing is EMA, the house
// smoother (One-Euro was tried in 2024 and rejected), with time constants per channel because depth is the noisiest.
// A track fades in when found and out when lost, so a costume never pops (Strollzilla ADR-0018: smooth, always smooth).
import type { LM } from './landmarks';
import { L, N_LANDMARKS } from './landmarks';
import { bodyLengths, solveTranslation, type Intrinsics } from './solve';
import type { FaceTrack } from './face';

/** `mask`: the person's cut-out (0..1 per pixel, the detection input's size), when asked for */
export interface Detection { image: LM[]; world: LM[]; mask?: { data: Float32Array; w: number; h: number } }

export interface Track {
  id: number;
  born: number;
  seen: number;
  image: LM[];
  world: LM[];
  /** hip centre in camera space, metres (three's axes) */
  T: { x: number; y: number; z: number };
  len: ReturnType<typeof bodyLengths>;
  /** 0..1, fades in when found (once confirmed) and out when lost */
  presence: number;
  /** frames this track has been found in: under TUNE.confirm it is not shown, and lost it is dropped at once */
  hits: number;
  lost: boolean;
  /** the detection this track took this frame, if any (its mask, in party mode) */
  det: Detection | null;
  /** the face (pose/face.ts attachFaces): eyes, mouth, expressions */
  face?: FaceTrack;
}

export const TUNE = {
  /** seconds: world landmarks (shape), image landmarks (what is left after the shared shake), depth, body lengths */
  tauWorld: 0.045, tauImage: 0.035, tauZ: 0.14, tauLen: 1.5,
  /** visibility decides pose-or-rest per limb: slow, or a limb at the frame's edge flickers between the two */
  tauVis: 0.25,
  /**
   * the torso and the face (shoulders, hips, the head's points) smoothed harder than the limbs: they turn slower, and
   * their jitter is what shows on a big costume. Measured on a noisy still replayed at 30 fps (scripts/jitter-sim):
   * raw pelvis 1.13°, head 1.19°; at the limbs' 45 ms they keep 0.78° / 0.71°, at 90 ms 0.56° / 0.51°
   */
  tauCore: 0.09,
  fadeIn: 0.22, fadeOut: 0.35, forgetAfter: 0.6,
  /** frames a new person must be found in before they show: a one-frame false find (a coat, a poster) never flashes a
   *  costume (founder, 2026-11-01: "some acquisition issues") — ~0.1 s at 30 fps, under the fade-in anyway */
  confirm: 3,
  /** a detection joins a track within this many of the track's torso lengths (in the image) */
  matchRadius: 1.3,
};

const center = (im: LM[]): { x: number; y: number; s: number } => {
  const ids = [L.shL, L.shR, L.hipL, L.hipR];
  let x = 0, y = 0, n = 0;
  for (const i of ids) { const p = im[i]!; x += p.x; y += p.y; n++; }
  x /= n; y /= n;
  const sx = (im[L.shL]!.x + im[L.shR]!.x) / 2 - (im[L.hipL]!.x + im[L.hipR]!.x) / 2;
  const sy = (im[L.shL]!.y + im[L.shR]!.y) / 2 - (im[L.hipL]!.y + im[L.hipR]!.y) / 2;
  const shw = Math.hypot(im[L.shL]!.x - im[L.shR]!.x, im[L.shL]!.y - im[L.shR]!.y);
  return { x, y, s: Math.max(Math.hypot(sx, sy), shw, 0.04) };
};

const ema = (a: number, b: number, k: number) => a + (b - a) * k;
const kOf = (dt: number, tau: number) => 1 - Math.exp(-dt / Math.max(tau, 1e-4));

const CORE = new Set<number>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, L.shL, L.shR, L.hipL, L.hipR]);
function blendLM(out: LM[], inp: LM[], k: number, kv: number, kCore = k): void {
  for (let i = 0; i < N_LANDMARKS; i++) {
    const o = out[i]!, p = inp[i]!, kk = CORE.has(i) ? kCore : k;
    o.x = ema(o.x, p.x, kk); o.y = ema(o.y, p.y, kk); o.z = ema(o.z, p.z, kk); o.v = ema(o.v, p.v, kv);
  }
}
const copyLM = (a: LM[]): LM[] => a.map((p) => ({ ...p }));

/** the points the shared shift is read from: the torso and the face, steady and usually seen */
const STEADY = [L.nose, L.eyeL, L.eyeR, L.earL, L.earR, L.shL, L.shR, L.hipL, L.hipR];
/** move every smoothed point by how far the steady ones moved together (visibility-weighted mean of their change) */
function shiftTogether(out: LM[], inp: LM[]): void {
  let dx = 0, dy = 0, w = 0;
  for (const i of STEADY) {
    const o = out[i]!, p = inp[i]!, k = Math.min(o.v, p.v);
    if (k < 0.5) continue;
    dx += (p.x - o.x) * k; dy += (p.y - o.y) * k; w += k;
  }
  if (w < 1.5) return;
  dx /= w; dy /= w;
  for (const o of out) { o.x += dx; o.y += dy; }
}

export class Tracker {
  /** the people the rest of the app sees: confirmed (TUNE.confirm frames found), fading in, present or fading out */
  tracks: Track[] = [];
  /** every track, the unconfirmed ones too */
  private all: Track[] = [];
  private nextId = 1;
  private last = -1;

  /** `now` in ms. Returns the tracks (lost ones still fading out included). */
  update(dets: Detection[], now: number, K: Intrinsics): Track[] {
    const dt = this.last < 0 ? 1 / 30 : Math.min(0.25, Math.max(0.001, (now - this.last) / 1000));
    this.last = now;
    // a detection we cannot place is no detection
    const placed = dets.map((d) => ({ d, T: solveTranslation(d.world, d.image, K), c: center(d.image) })).filter((p) => p.T);
    const live = this.all.filter((t) => !t.lost || t.presence > 0);
    const pairs: { ti: number; di: number; cost: number }[] = [];
    live.forEach((t, ti) => {
      const tc = center(t.image);
      placed.forEach((p, di) => {
        const cost = Math.hypot(tc.x - p.c.x, tc.y - p.c.y) / tc.s;
        if (cost < TUNE.matchRadius) pairs.push({ ti, di, cost });
      });
    });
    pairs.sort((a, b) => a.cost - b.cost);
    const usedT = new Set<number>(), usedD = new Set<number>();
    for (const pr of pairs) {
      if (usedT.has(pr.ti) || usedD.has(pr.di)) continue;
      usedT.add(pr.ti); usedD.add(pr.di);
      const t = live[pr.ti]!, p = placed[pr.di]!;
      // a track coming back from lost snaps rather than gliding across the frame
      const snap = t.lost;
      const kv = snap ? 1 : kOf(dt, TUNE.tauVis);
      blendLM(t.world, p.d.world, snap ? 1 : kOf(dt, TUNE.tauWorld), kv, snap ? 1 : kOf(dt, TUNE.tauCore));
      // what moves together is followed at once, what jitters alone is smoothed: a hand-held camera shakes the whole
      // person in the frame, and an EMA on that lags it (measured: the costume trembled 1.6 px against the person
      // under a simulated tremor, 0.7 px unsmoothed). The torso's shared shift moves every smoothed point first; only
      // what is left over — each point's own noise — goes through the EMA.
      if (!snap) shiftTogether(t.image, p.d.image);
      blendLM(t.image, p.d.image, snap ? 1 : kOf(dt, TUNE.tauImage), kv);
      // the hips from the smoothed shape and the smoothed (shake-following) picture; their depth smoothed again on its
      // own, keeping where they land on screen (x and y scale with depth along the same ray)
      const Ts = solveTranslation(t.world, t.image, K) ?? p.T!;
      if (snap) t.T = { ...Ts };
      else {
        const z = ema(t.T.z, Ts.z, kOf(dt, TUNE.tauZ)), r = z / Ts.z;
        t.T = { x: Ts.x * r, y: Ts.y * r, z };
      }
      const nl = bodyLengths(t.world), kl = kOf(dt, TUNE.tauLen);
      for (const key of Object.keys(nl) as (keyof typeof nl)[]) t.len[key] = ema(t.len[key], nl[key], kl);
      t.seen = now;
      t.lost = false;
      t.det = p.d;
      t.hits++;
    }
    placed.forEach((p, di) => {
      if (usedD.has(di)) return;
      const world = copyLM(p.d.world);
      this.all.push({ id: this.nextId++, born: now, seen: now, image: copyLM(p.d.image), world, T: { ...p.T! }, len: bodyLengths(world), presence: 0, hits: 1, lost: false, det: p.d });
    });
    for (const t of this.all) {
      if (t.seen !== now) { t.lost = true; t.det = null; }
      const confirmed = t.hits >= TUNE.confirm;
      t.presence = t.lost ? Math.max(0, t.presence - dt / TUNE.fadeOut) : confirmed ? Math.min(1, t.presence + dt / TUNE.fadeIn) : 0;
    }
    this.all = this.all.filter((t) => !(t.lost && t.hits < TUNE.confirm) && !(t.lost && t.presence <= 0 && now - t.seen > TUNE.forgetAfter * 1000));
    this.tracks = this.all.filter((t) => t.hits >= TUNE.confirm);
    return this.tracks;
  }

  clear(): void { this.tracks = []; this.all = []; this.last = -1; }
}
