// People across frames. MediaPipe's multi-pose results come in no fixed order, so each detection is matched to a track
// by where its torso is (greedy, nearest first, within a torso's length); the TRACK's id is the identity — nothing is
// keyed by position (costuma 2024's flicker came from keying state by a position bucket). Smoothing is EMA, the house
// smoother (One-Euro was tried in 2024 and rejected), with time constants per channel because depth is the noisiest.
// A track fades in when found and out when lost, so a costume never pops (Strollzilla ADR-0018: smooth, always smooth).
import type { LM } from './landmarks';
import { L, N_LANDMARKS } from './landmarks';
import { bodyLengths, solveTranslation, type Intrinsics } from './solve';

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
  /** 0..1, fades in when found and out when lost */
  presence: number;
  lost: boolean;
  /** the detection this track took this frame, if any (its mask, in party mode) */
  det: Detection | null;
}

export const TUNE = {
  /** seconds: world landmarks (shape), image landmarks, lateral position, depth, body lengths */
  tauWorld: 0.045, tauImage: 0.035, tauXY: 0.05, tauZ: 0.14, tauLen: 1.5,
  fadeIn: 0.22, fadeOut: 0.35, forgetAfter: 0.6,
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

function blendLM(out: LM[], inp: LM[], k: number): void {
  for (let i = 0; i < N_LANDMARKS; i++) {
    const o = out[i]!, p = inp[i]!;
    o.x = ema(o.x, p.x, k); o.y = ema(o.y, p.y, k); o.z = ema(o.z, p.z, k); o.v = ema(o.v, p.v, Math.min(1, k * 1.5));
  }
}
const copyLM = (a: LM[]): LM[] => a.map((p) => ({ ...p }));

export class Tracker {
  tracks: Track[] = [];
  private nextId = 1;
  private last = -1;

  /** `now` in ms. Returns the tracks (lost ones still fading out included). */
  update(dets: Detection[], now: number, K: Intrinsics): Track[] {
    const dt = this.last < 0 ? 1 / 30 : Math.min(0.25, Math.max(0.001, (now - this.last) / 1000));
    this.last = now;
    // a detection we cannot place is no detection
    const placed = dets.map((d) => ({ d, T: solveTranslation(d.world, d.image, K), c: center(d.image) })).filter((p) => p.T);
    const live = this.tracks.filter((t) => !t.lost || t.presence > 0);
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
      blendLM(t.world, p.d.world, snap ? 1 : kOf(dt, TUNE.tauWorld));
      blendLM(t.image, p.d.image, snap ? 1 : kOf(dt, TUNE.tauImage));
      const kxy = snap ? 1 : kOf(dt, TUNE.tauXY), kz = snap ? 1 : kOf(dt, TUNE.tauZ);
      t.T = { x: ema(t.T.x, p.T!.x, kxy), y: ema(t.T.y, p.T!.y, kxy), z: ema(t.T.z, p.T!.z, kz) };
      const nl = bodyLengths(t.world), kl = kOf(dt, TUNE.tauLen);
      for (const key of Object.keys(nl) as (keyof typeof nl)[]) t.len[key] = ema(t.len[key], nl[key], kl);
      t.seen = now;
      t.lost = false;
      t.det = p.d;
    }
    placed.forEach((p, di) => {
      if (usedD.has(di)) return;
      const world = copyLM(p.d.world);
      this.tracks.push({ id: this.nextId++, born: now, seen: now, image: copyLM(p.d.image), world, T: { ...p.T! }, len: bodyLengths(world), presence: 0, lost: false, det: p.d });
    });
    for (const t of this.tracks) {
      if (t.seen !== now) { t.lost = true; t.det = null; }
      t.presence = t.lost ? Math.max(0, t.presence - dt / TUNE.fadeOut) : Math.min(1, t.presence + dt / TUNE.fadeIn);
    }
    this.tracks = this.tracks.filter((t) => !(t.lost && t.presence <= 0 && now - t.seen > TUNE.forgetAfter * 1000));
    return this.tracks;
  }

  clear(): void { this.tracks = []; this.last = -1; }
}
