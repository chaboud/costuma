// People across frames. MediaPipe's multi-pose results come in no fixed order, so each detection is matched to a track
// by where its torso is (greedy, nearest first, within a torso's length); the TRACK's id is the identity — nothing is
// keyed by position (costuma 2024's flicker came from keying state by a position bucket). Smoothing is EMA, the house
// smoother (One-Euro was tried in 2024 and rejected), with time constants per channel because depth is the noisiest.
// A track fades in when found and out when lost, so a costume never pops (Strollzilla ADR-0018: smooth, always smooth).
import type { LM } from './landmarks';
import { L, N_LANDMARKS } from './landmarks';
import * as THREE from 'three';
import { bodyLengths, solveTranslation, type Intrinsics } from './solve';
import type { FaceTrack } from './face';
import { CVBank } from './kalman';
import { anchorTorsoShot, upright, type UprightState, type UprightVerdict } from './upright';

/** `mask`: the person's cut-out (0..1 per pixel, the detection input's size), when asked for */
export interface Detection { image: LM[]; world: LM[]; mask?: { data: Float32Array; w: number; h: number } }

export interface Track {
  id: number;
  born: number;
  seen: number;
  image: LM[];
  /** the 3D pose the rest of the app uses: the smoothed one, hung from the shoulders in a torso shot (upright.ts) */
  world: LM[];
  /** the smoothed 3D pose in the model's own frame (what the smoothing works on), and as held (what is shown) */
  wsm: LM[];
  wh: LM[];
  /** the smoothed picture (what the smoothing works on); `image` is it as held */
  ism: LM[];
  /** the hips' depth smoothed, and as held (shown) */
  zs?: number;
  zh?: number;
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
  /** the upright check's memory and its last verdict (pose/upright.ts) */
  up: UprightState;
  verdict: UprightVerdict;
  /** the Kalman filters: the picture's points (x, y), the 3D points (x, y, z), the hips' depth */
  kf: { image: CVBank; world: CVBank; z: CVBank } | null;
}

export const TUNE = {
  /**
   * seconds: world landmarks (shape), image landmarks (what is left after the shared shake), depth, body lengths.
   * 1.5× the first settings (2026-11-01): replayed over five recorded clips (torso shots hand-held and still, a selfie,
   * a street with three people walking; scripts/kalman-tune.test.ts) it kept the error against what the person did
   * (×1.02) with 31 % less jerk and 24 % smaller frame-to-frame jumps
   */
  tauWorld: 0.068, tauImage: 0.053, tauZ: 0.21, tauLen: 1.5,
  /** visibility decides pose-or-rest per limb: slow, or a limb at the frame's edge flickers between the two */
  tauVis: 0.25,
  /**
   * the torso and the face (shoulders, hips, the head's points) smoothed harder than the limbs: they turn slower, and
   * their jitter is what shows on a big costume. Measured on a noisy still replayed at 30 fps (scripts/jitter-sim):
   * raw pelvis 1.13°, head 1.19°; at the limbs' 45 ms they keep 0.78° / 0.71°, at 90 ms 0.56° / 0.51°; now 135 ms
   */
  tauCore: 0.135,
  fadeIn: 0.22, fadeOut: 0.35, forgetAfter: 0.6,
  /** frames a new person must be found in before they show: a one-frame false find (a coat, a poster) never flashes a
   *  costume (founder, 2026-11-01: "some acquisition issues") — ~0.1 s at 30 fps, under the fade-in anyway */
  confirm: 3,
  /** a detection joins a track within this many of the track's torso lengths (in the image) */
  matchRadius: 1.3,
  /** stand guessed bodies up (pose/upright.ts) */
  upright: true,
  /**
   * 'ema' or 'kalman' (constant velocity, gated, per coordinate: pose/kalman.ts) for the points. The Kalman filter
   * predicts, so on a steady move it has no lag where an EMA lags speed × tau (checked on a synthetic ramp: 0.1 cm
   * against 3.8), but on the recorded clips no setting of it beat the EMA slowed to the same jerk (best: error ×1.12 at
   * jerk ×0.68, against ×1.02 at ×0.69), and on the hips' depth it doubled the size's frame-to-frame jumps (29 → 56 cm
   * on the street): MediaPipe's errors wander over several frames (it tracks from its last answer), and a filter that
   * estimates velocity reads the wander as motion. Kept for footage it might suit (dance, unrecorded); off.
   */
  filter: 'ema' as 'kalman' | 'ema',
  /**
   * The hold after the smoothing (hold()): on, and its bands — the 3D points (metres; depth ×`holdZ`), the picture's
   * points (a share of the shoulders' width on screen), each for the torso-and-face and for the limbs; the hips' depth
   * (a share of it) — and its creep and follow (seconds). The bands are the model's measured noise. Replayed on a still
   * torso clip, frame-to-frame movement: arms 1.9–2.1° → 0.4–0.7°, chest turn 0.70 → 0.36°, head 0.49 → 0.31°, size
   * 0.23 → 0.07 cm; on the street clip (people walking) the error barely moved (chest 18 → 21°) where slowing the EMA
   * twice over for the same stillness cost far more (18 → 29°)
   */
  hold: true,
  holdWorldCore: 0.008, holdWorldLimb: 0.013, holdZ: 1.5, holdImageCore: 0.007, holdImageLimb: 0.028, holdDepth: 0.015,
  holdCreep: 1.2, holdFollow: 0.02,
  /**
   * The Kalman filters' noise. `r*`: a reading's standard deviation (the picture in image widths/heights, 3D and depth
   * in metres), divided by its visibility; `q*`: how hard a point may accelerate (spectral density, units²/s³). The
   * torso and face (core) are let accelerate less than the limbs. Tuned on recorded clips replayed through the tracker
   * (scripts/stability-sim.test.ts).
   */
  rImage: 0.004, qImageCore: 0.4, qImageLimb: 6,
  rWorld: 0.02, rWorldZ: 0.04, qWorldCore: 0.6, qWorldLimb: 12,
  rDepth: 0.03, qDepth: 1,
  gate: 4,
  /** with 'ema' for the points, the hips' depth through its Kalman filter anyway (measured worse: see `filter`) */
  kalmanDepth: false,
  /** slide each person's 3D placement onto the smoothed picture's torso (pinToPicture) */
  pin: true,
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
const copyInto = (out: LM[], a: LM[]): void => { for (let i = 0; i < a.length; i++) { const o = out[i]!, p = a[i]!; o.x = p.x; o.y = p.y; o.z = p.z; o.v = p.v; } };

/** the points the shared shift is read from: the torso and the face, steady and usually seen */
const STEADY = [L.nose, L.eyeL, L.eyeR, L.earL, L.earR, L.shL, L.shR, L.hipL, L.hipR];
/** move every smoothed point by how far the steady ones moved together (visibility-weighted mean of their change);
 *  returns the shift */
function shiftTogether(out: LM[], inp: LM[]): { dx: number; dy: number } {
  let dx = 0, dy = 0, w = 0;
  for (const i of STEADY) {
    const o = out[i]!, p = inp[i]!, k = Math.min(o.v, p.v);
    if (k < 0.5) continue;
    dx += (p.x - o.x) * k; dy += (p.y - o.y) * k; w += k;
  }
  if (w < 1.5) return { dx: 0, dy: 0 };
  dx /= w; dy /= w;
  for (const o of out) { o.x += dx; o.y += dy; }
  return { dx, dy };
}

const AXES = ['x', 'y', 'z'] as const;
/** Kalman-filter `inp` into `out` through `bank` (`dims` 2: the picture, 3: the 3D points); visibility by EMA */
function filterLM(bank: CVBank, out: LM[], inp: LM[], dims: 2 | 3, dt: number, kv: number): void {
  const T = TUNE;
  for (let i = 0; i < N_LANDMARKS; i++) {
    const o = out[i]!, p = inp[i]!, core = CORE.has(i);
    const vis = Math.max(0.15, Math.min(1, p.v));
    for (let a = 0; a < dims; a++) {
      const r = dims === 2 ? T.rImage : a === 2 ? T.rWorldZ : T.rWorld;
      const q = dims === 2 ? (core ? T.qImageCore : T.qImageLimb) : (core ? T.qWorldCore : T.qWorldLimb);
      o[AXES[a]!] = bank.step(i * dims + a, p[AXES[a]!], dt, q, (r / vis) ** 2, T.gate);
    }
    o.v = ema(o.v, p.v, kv);
  }
}
/**
 * The fader's hold (founder, 2026-11-01: "a smoothing that considers the scale of difference to allow
 * tremble/inaccuracy to not cause jumpiness but allows major changes ... like a PID on a motorized fader"): after the
 * smoothing, each point's shown position moves only once the smoothed one has left a band round it (`band`, sized from
 * the model's measured noise for that kind of point), and then at once, trailing by the band; inside it, it creeps to
 * centre (`holdCreep` s). A still person holds still; a move gets through. Tried first on the raw readings with one noise
 * for every point: it did nothing (best jerk ×1.01) — the limbs are 3× the torso's noise (measured on the still clips:
 * 3D 1.3 against 0.8 cm, picture 2.8 against 0.7 % of the shoulders), and the noise wanders over frames.
 */
function hold(x: number, z: number, dt: number, band: number): number {
  const e = z - x, a = Math.abs(e);
  if (a <= band) return x + e * (1 - Math.exp(-dt / TUNE.holdCreep));
  // past the band: the motor drives the excess, at once
  const excess = e - Math.sign(e) * band;
  return x + excess * (1 - Math.exp(-dt / TUNE.holdFollow)) + Math.sign(e) * band * (1 - Math.exp(-dt / TUNE.holdCreep));
}
/** hold `out` (shown) against `inp` (smoothed): `band(i, axis)` each coordinate's band */
function holdLM(out: LM[], inp: LM[], dims: 2 | 3, dt: number, band: (i: number, a: number) => number): void {
  for (let i = 0; i < N_LANDMARKS; i++) {
    const o = out[i]!, p = inp[i]!, vis = Math.max(0.25, Math.min(1, p.v));
    for (let a = 0; a < dims; a++) o[AXES[a]!] = hold(o[AXES[a]!], p[AXES[a]!], dt, band(i, a) / vis);
    o.v = p.v;
  }
}
function resetBank(bank: CVBank, lm: LM[], dims: 2 | 3): void {
  for (let i = 0; i < N_LANDMARKS; i++) for (let a = 0; a < dims; a++) {
    const r = dims === 2 ? TUNE.rImage : a === 2 ? TUNE.rWorldZ : TUNE.rWorld;
    bank.reset(i * dims + a, lm[i]![AXES[a]!], r * r);
  }
}
const UP = new THREE.Vector3(0, 1, 0);

const TORSO = [L.shL, L.shR, L.hipL, L.hipR];
/**
 * Slide the hips sideways, at their depth, until the torso lands on the smoothed picture's torso: the 3D solve fits
 * every visible point at once and its depth wobbles, which put the costume's shoulders 2–4× jumpier on screen than the
 * smoothed picture's own (measured on three torso clips: 16 against 6 px, 21 against 11, 20 against 5 px RMS second
 * difference). The picture is the better witness of where things are on screen; the 3D keeps the depth and the shape.
 * Each torso point weighs by its visibility (a torso shot pins on the shoulders).
 */
function pinToPicture(t: Track, K: Intrinsics): void {
  let du = 0, dv = 0, w = 0;
  for (const i of TORSO) {
    const im = t.image[i]!, wp = t.world[i]!, k = Math.max(0, Math.min(1, (im.v - 0.4) / 0.4));
    if (k <= 0) continue;
    const z = -(t.T.z + wp.z);
    if (z <= 0.05) continue;
    const u = K.cx + (K.f * (t.T.x + wp.x)) / z, v = K.cy - (K.f * (t.T.y + wp.y)) / z;
    du += (im.x * K.w - u) * k; dv += (im.y * K.h - v) * k; w += k;
  }
  if (w < 0.5) return;
  const depth = -t.T.z;
  t.T = { x: t.T.x + ((du / w) * depth) / K.f, y: t.T.y - ((dv / w) * depth) / K.f, z: t.T.z };
}

export class Tracker {
  /** the people the rest of the app sees: confirmed (TUNE.confirm frames found), fading in, present or fading out */
  tracks: Track[] = [];
  /** every track, the unconfirmed ones too */
  private all: Track[] = [];
  private nextId = 1;
  private last = -1;

  /** the smoothed pose as the app gets it: hung from the shoulders while the hips are out of the picture */
  private shaped(wsm: LM[], image: LM[], len: number, up: THREE.Vector3): LM[] {
    if (!TUNE.upright) return copyLM(wsm);
    return anchorTorsoShot(wsm, up, len, Math.min(image[L.hipL]!.v, image[L.hipR]!.v));
  }

  /** a detection's 3D pose, stood up where it is a guess (pose/upright.ts) */
  private check(t: { up: UprightState; len?: Track['len'] }, d: Detection, T: { z: number }, K: Intrinsics, up: THREE.Vector3, now: number): { world: LM[]; verdict: UprightVerdict } {
    if (!TUNE.upright) return { world: d.world, verdict: 'kept' };
    return upright(d.world, d.image, up, { len: t.len?.torso, f: K.f / K.h, aspect: K.w / K.h, depth: -T.z, now, state: t.up });
  }

  /** `now` in ms; `up` the floor's up in camera axes (the phone's gravity, ground.ts). Returns the tracks (lost ones
   *  still fading out included). */
  update(dets: Detection[], now: number, K: Intrinsics, up: THREE.Vector3 = UP): Track[] {
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
      // the depth for "what an upright torso looks like on screen": the track's, not this detection's (a flip moves it)
      const chk = this.check(t, p.d, t.T, K, up, now);
      t.verdict = chk.verdict;
      let shift = { dx: 0, dy: 0 };
      if (TUNE.filter === 'kalman') {
        const fresh = !t.kf;
        const kf = t.kf ??= { image: new CVBank(N_LANDMARKS * 2), world: new CVBank(N_LANDMARKS * 3), z: new CVBank(1) };
        if (snap || fresh) { resetBank(kf.world, chk.world, 3); resetBank(kf.image, p.d.image, 2); kf.z.reset(0, t.T.z, TUNE.rDepth ** 2); }
        filterLM(kf.world, t.wsm, chk.world, 3, dt, kv);
        // the hand-held shake (below) moves the picture's filters too, so their predictions start from where it put them
        if (!snap) { shift = shiftTogether(t.ism, p.d.image); for (let i = 0; i < N_LANDMARKS; i++) { kf.image.shift(i * 2, shift.dx); kf.image.shift(i * 2 + 1, shift.dy); } }
        filterLM(kf.image, t.ism, p.d.image, 2, dt, kv);
      } else {
        blendLM(t.wsm, chk.world, snap ? 1 : kOf(dt, TUNE.tauWorld), kv, snap ? 1 : kOf(dt, TUNE.tauCore));
        // what moves together is followed at once, what jitters alone is smoothed: a hand-held camera shakes the whole
        // person in the frame, and an EMA on that lags it (measured: the costume trembled 1.6 px against the person
        // under a simulated tremor, 0.7 px unsmoothed). The torso's shared shift moves every smoothed point first; only
        // what is left over — each point's own noise — goes through the EMA.
        if (!snap) shift = shiftTogether(t.ism, p.d.image);
        blendLM(t.ism, p.d.image, snap ? 1 : kOf(dt, TUNE.tauImage), kv);
      }
      // what is shown: held against the smoothed (the shake passes straight through: it moved the person)
      if (TUNE.hold && !snap) {
        for (const o of t.image) { o.x += shift.dx; o.y += shift.dy; }
        const shoulders = Math.hypot(t.ism[L.shL]!.x - t.ism[L.shR]!.x, (t.ism[L.shL]!.y - t.ism[L.shR]!.y) * K.h / K.w) || 0.05;
        holdLM(t.wh, t.wsm, 3, dt, (i, a) => (CORE.has(i) ? TUNE.holdWorldCore : TUNE.holdWorldLimb) * (a === 2 ? TUNE.holdZ : 1));
        holdLM(t.image, t.ism, 2, dt, (i, a) => (CORE.has(i) ? TUNE.holdImageCore : TUNE.holdImageLimb) * shoulders * (a === 1 ? K.w / K.h : 1));
      } else { copyInto(t.wh, t.wsm); copyInto(t.image, t.ism); }
      t.world = this.shaped(t.wh, t.image, t.len.torso, up);
      if (TUNE.upright && Math.min(t.image[L.hipL]!.v, t.image[L.hipR]!.v) < 0.7 && t.verdict === 'kept') t.verdict = 'torso shot';
      // the hips from the smoothed shape and the smoothed (shake-following) picture; their depth smoothed again on its
      // own, keeping where they land on screen (x and y scale with depth along the same ray)
      const Ts = solveTranslation(t.world, t.image, K) ?? p.T!;
      if (snap) { t.T = { ...Ts }; t.zs = t.zh = Ts.z; t.kf?.z.reset(0, Ts.z, TUNE.rDepth ** 2); }
      else {
        if ((TUNE.filter === 'kalman' || TUNE.kalmanDepth) && !t.kf) { t.kf = { image: new CVBank(N_LANDMARKS * 2), world: new CVBank(N_LANDMARKS * 3), z: new CVBank(1) }; t.kf.z.reset(0, t.T.z, TUNE.rDepth ** 2); }
        const z = (TUNE.filter === 'kalman' || TUNE.kalmanDepth) && t.kf ? t.kf.z.step(0, Ts.z, dt, TUNE.qDepth, TUNE.rDepth ** 2, TUNE.gate)
          : ema(t.zs ?? t.T.z, Ts.z, kOf(dt, TUNE.tauZ));
        // the depth shown: held like the points (a still person's costume does not breathe in size)
        t.zh = TUNE.hold && t.zh !== undefined ? hold(t.zh, z, dt, TUNE.holdDepth * Math.abs(z)) : z;
        t.zs = z;
        const r = t.zh / Ts.z;
        t.T = { x: Ts.x * r, y: Ts.y * r, z: t.zh };
      }
      if (TUNE.pin) pinToPicture(t, K);
      // the person's lengths from the model's own pose (the anchored torso is the measured one, by construction)
      const nl = bodyLengths(t.wsm), kl = kOf(dt, TUNE.tauLen);
      for (const key of Object.keys(nl) as (keyof typeof nl)[]) t.len[key] = ema(t.len[key], nl[key], kl);
      t.seen = now;
      t.lost = false;
      t.det = p.d;
      t.hits++;
    }
    placed.forEach((p, di) => {
      if (usedD.has(di)) return;
      const state: UprightState = { flatSince: null };
      const chk = this.check({ up: state }, p.d, p.T!, K, up, now);
      const wsm = copyLM(chk.world), image = copyLM(p.d.image), len = bodyLengths(wsm), wh = copyLM(wsm), ism = copyLM(image);
      const world = this.shaped(wsm, image, len.torso, up);
      const T0 = solveTranslation(world, image, K) ?? p.T!;
      let kf: Track['kf'] = null;
      if (TUNE.filter === 'kalman') {
        kf = { image: new CVBank(N_LANDMARKS * 2), world: new CVBank(N_LANDMARKS * 3), z: new CVBank(1) };
        resetBank(kf.world, wsm, 3); resetBank(kf.image, image, 2); kf.z.reset(0, T0.z, TUNE.rDepth ** 2);
      }
      this.all.push({ id: this.nextId++, born: now, seen: now, image, world, wsm, wh, ism, T: { ...T0 }, len, presence: 0, hits: 1, lost: false, det: p.d, up: state, verdict: chk.verdict, kf });
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
