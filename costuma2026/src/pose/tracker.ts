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
  /** the hips' depth smoothed, and as held (shown); the motor's velocities (the 3D points, the picture's, the depth) */
  zs?: number;
  zh?: number;
  vel?: { world: Float64Array; image: Float64Array; z: number };
  /** the shared shift's motor: where the shake has taken the person, where the shown has followed, its velocity */
  cm?: { tx: number; ty: number; x: number; y: number; vx: number; vy: number };
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
   * The motor after the smoothing (motor()): on, and its bands — the 3D points (metres; depth ×`holdZ`), the picture's
   * points (a share of the shoulders' width on screen), each for the torso-and-face and for the limbs; the hips' depth
   * (a share of it) — and its creep and follow (seconds). The bands are the model's measured noise. Replayed on a still
   * torso clip, frame-to-frame movement: arms 1.9–2.1° → 0.4–0.7°, chest turn 0.70 → 0.36°, head 0.49 → 0.31°, size
   * 0.23 → 0.07 cm; on the street clip (people walking) the error barely moved (chest 18 → 21°) where slowing the EMA
   * twice over for the same stillness cost far more (18 → 29°)
   */
  hold: true,
  holdWorldCore: 0.008, holdWorldLimb: 0.013, holdZ: 1.5, holdImageCore: 0.007, holdImageLimb: 0.028, holdDepth: 0.015,
  /** the motor's stiffness (rad/s) for the torso-and-face and the limbs, and its faint pull inside the band */
  motorCore: 10, motorLimb: 14, motorCreep: 2.5, motorBoost: 2,
  /** the shared shift's motor (rad/s): stiff, so a hand-held shake is followed nearly at once */
  motorShake: 30,
  /** the smoothing setting's scales (settings → Smoothing): on the EMA's times, the bands, the motor's stiffness */
  smoothTau: 1, smoothBand: 1, smoothW: 1,
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
 * A fader's motor (founder: "I was just relating it to motorized faders, dude. To get rid of tremble"): the shown value
 * has a position and a velocity, driven toward the smoothed reading by a pull that grows as a curve of the error (a
 * cube inside the model's noise, the error itself well past it), damped by its own velocity (critically: it arrives
 * without overshoot), with a faint linear pull (`motorCreep`) that settles the last offset over a second or two. Starts
 * and stops are smooth (the velocity never jumps); a tremble the size of the noise barely moves it; a real move drives
 * it at once. `w` (rad/s) is how stiff the motor is. Returns the new position and velocity.
 */
function motor(x: number, v: number, r: number, dt: number, band: number, w: number): [number, number] {
  const n = Math.max(1, Math.ceil((dt * w * (1 + TUNE.motorBoost)) / 0.35)), h = dt / n, wc = TUNE.motorCreep;
  for (let k = 0; k < n; k++) {
    // the pull is a curve of the error, never a threshold (founder: "The dead [band] shouldn't be a threshold. It
    // should be a curve behavior. Smooth. Always smooth ... no booleans in motion"): e·m²/(1+m²), m the error in bands —
    // a cube (e³/b²) inside the noise, the error itself well past it, every derivative continuous between
    const e = r - x, m2 = band > 0 ? (e * e) / (band * band) : 1e9, out = (e * m2) / (1 + m2);
    // and stiffer the further off, by a curve too: half the boost at four bands, most of it by eight
    const wk = w * (1 + (TUNE.motorBoost * m2) / (m2 + 16));
    const a = wk * wk * out + wc * wc * e - 2 * wk * v;
    v += a * h;
    x += v * h;
  }
  return [x, v];
}
/** the motor for every point: `vel` its velocities (per coordinate), `band` and stiffness per point */
function motorLM(out: LM[], inp: LM[], vel: Float64Array, dims: 2 | 3, dt: number, band: (i: number, a: number) => number): void {
  for (let i = 0; i < N_LANDMARKS; i++) {
    const o = out[i]!, p = inp[i]!, vis = Math.max(0.25, Math.min(1, p.v)), w = CORE.has(i) ? TUNE.motorCore : TUNE.motorLimb;
    for (let a = 0; a < dims; a++) {
      const j = i * dims + a;
      const [x, v] = motor(o[AXES[a]!], vel[j]!, p[AXES[a]!], dt, band(i, a) / vis, w * TUNE.smoothW);
      o[AXES[a]!] = x; vel[j] = v;
    }
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

/**
 * The smoothing setting (settings → Smoothing, 0 snappy .. 1 steady): one knob over the EMA's times, the motors' knees
 * (the band their pull curves up through) and their stiffness together. Replayed (scripts/stability-sim.test.ts) at the
 * middle setting: a still torso's arms move ~0.16° a frame (the EMA alone: 2.0°), its position 1.1 px (3.2), at the
 * cost of lag on fast moves (a walking street's chest turn: 15.7° error → ~25°).
 */
export function setSmoothing(s: number): void {
  const k = Math.max(0, Math.min(1, s)), lerp = (a: number, b: number) => a + (b - a) * k;
  TUNE.smoothW = lerp(2.4, 0.8);
  TUNE.smoothBand = lerp(1.5, 4.5);
  TUNE.smoothTau = lerp(0.8, 1.2);
}

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
    const im = t.image[i]!, wp = t.world[i]!, sv = Math.max(0, Math.min(1, (im.v - 0.4) / 0.4)), k = sv * sv * (3 - 2 * sv);
    if (k <= 0) continue;
    const z = -(t.T.z + wp.z);
    if (z <= 0.05) continue;
    const u = K.cx + (K.f * (t.T.x + wp.x)) / z, v = K.cy - (K.f * (t.T.y + wp.y)) / z;
    du += (im.x * K.w - u) * k; dv += (im.y * K.h - v) * k; w += k;
  }
  if (w <= 1e-6) return;
  // a torso barely seen pins barely: the pull eases in with how much of it is seen (no switch)
  const sw = Math.min(1, Math.max(0, (w - 0.25) / 0.75)), take = sw * sw * (3 - 2 * sw);
  const depth = -t.T.z;
  t.T = { x: t.T.x + ((du / w) * depth * take) / K.f, y: t.T.y - ((dv / w) * depth * take) / K.f, z: t.T.z };
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
      // a track coming back from lost snaps rather than gliding across the frame — only while it is faded out
      // enough not to be seen doing it; still showing, it glides (no jumps on screen)
      const snap = t.lost && t.presence < 0.05;
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
        blendLM(t.wsm, chk.world, snap ? 1 : kOf(dt, TUNE.tauWorld * TUNE.smoothTau), kv, snap ? 1 : kOf(dt, TUNE.tauCore * TUNE.smoothTau));
        // what moves together is followed at once, what jitters alone is smoothed: a hand-held camera shakes the whole
        // person in the frame, and an EMA on that lags it (measured: the costume trembled 1.6 px against the person
        // under a simulated tremor, 0.7 px unsmoothed). The torso's shared shift moves every smoothed point first; only
        // what is left over — each point's own noise — goes through the EMA.
        if (!snap) shift = shiftTogether(t.ism, p.d.image);
        blendLM(t.ism, p.d.image, snap ? 1 : kOf(dt, TUNE.tauImage * TUNE.smoothTau), kv);
      }
      // what is shown: held against the smoothed (the shake passes straight through: it moved the person)
      if (TUNE.hold && !snap) {
        // the shared shift: a hand-held camera's shake is followed (the person moved in the picture), the model's own
        // whole-body jitter is not — through a stiff motor with a band the size of the torso's noise (follow 'motor')
        let sdx = shift.dx, sdy = shift.dy;
        {
          const c = t.cm ??= { tx: 0, ty: 0, x: 0, y: 0, vx: 0, vy: 0 };
          const sw = Math.hypot(t.ism[L.shL]!.x - t.ism[L.shR]!.x, (t.ism[L.shL]!.y - t.ism[L.shR]!.y) * K.h / K.w) || 0.05;
          const band = TUNE.holdImageCore * sw * TUNE.smoothBand, x0 = c.x, y0 = c.y;
          c.tx += shift.dx; c.ty += shift.dy;
          [c.x, c.vx] = motor(c.x, c.vx, c.tx, dt, band, TUNE.motorShake * TUNE.smoothW);
          [c.y, c.vy] = motor(c.y, c.vy, c.ty, dt, band * K.w / K.h, TUNE.motorShake * TUNE.smoothW);
          sdx = c.x - x0; sdy = c.y - y0;
          // the smoothed picture keeps the person where they are; the shown follows by the motor
          for (const o of t.image) { o.x += sdx; o.y += sdy; }
        }
        const shoulders = Math.hypot(t.ism[L.shL]!.x - t.ism[L.shR]!.x, (t.ism[L.shL]!.y - t.ism[L.shR]!.y) * K.h / K.w) || 0.05;
        const bw = (i: number, a: number) => (CORE.has(i) ? TUNE.holdWorldCore : TUNE.holdWorldLimb) * (a === 2 ? TUNE.holdZ : 1) * TUNE.smoothBand;
        const bi = (i: number, a: number) => (CORE.has(i) ? TUNE.holdImageCore : TUNE.holdImageLimb) * shoulders * (a === 1 ? K.w / K.h : 1) * TUNE.smoothBand;
        const vel = t.vel ??= { world: new Float64Array(N_LANDMARKS * 3), image: new Float64Array(N_LANDMARKS * 2), z: 0 };
        motorLM(t.wh, t.wsm, vel.world, 3, dt, bw);
        motorLM(t.image, t.ism, vel.image, 2, dt, bi);
      } else { copyInto(t.wh, t.wsm); copyInto(t.image, t.ism); if (t.vel) { t.vel.world.fill(0); t.vel.image.fill(0); t.vel.z = 0; } }
      t.world = this.shaped(t.wh, t.image, t.len.torso, up);
      if (TUNE.upright && Math.min(t.image[L.hipL]!.v, t.image[L.hipR]!.v) < 0.7 && t.verdict === 'kept') t.verdict = 'torso shot';
      // the hips from the smoothed shape and the smoothed (shake-following) picture; their depth smoothed again on its
      // own, keeping where they land on screen (x and y scale with depth along the same ray)
      const Ts = solveTranslation(t.world, t.image, K) ?? p.T!;
      if (snap) { t.T = { ...Ts }; t.zs = t.zh = Ts.z; t.kf?.z.reset(0, Ts.z, TUNE.rDepth ** 2); }
      else {
        if ((TUNE.filter === 'kalman' || TUNE.kalmanDepth) && !t.kf) { t.kf = { image: new CVBank(N_LANDMARKS * 2), world: new CVBank(N_LANDMARKS * 3), z: new CVBank(1) }; t.kf.z.reset(0, t.T.z, TUNE.rDepth ** 2); }
        const z = (TUNE.filter === 'kalman' || TUNE.kalmanDepth) && t.kf ? t.kf.z.step(0, Ts.z, dt, TUNE.qDepth, TUNE.rDepth ** 2, TUNE.gate)
          : ema(t.zs ?? t.T.z, Ts.z, kOf(dt, TUNE.tauZ * TUNE.smoothTau));
        // the depth shown: held like the points (a still person's costume does not breathe in size)
        if (TUNE.hold && t.zh !== undefined) {
          const vel = t.vel ??= { world: new Float64Array(N_LANDMARKS * 3), image: new Float64Array(N_LANDMARKS * 2), z: 0 };
          [t.zh, vel.z] = motor(t.zh, vel.z, z, dt, TUNE.holdDepth * Math.abs(z) * TUNE.smoothBand, TUNE.motorCore * TUNE.smoothW);
        } else t.zh = z;
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
      const state: UprightState = { belief: 0, at: -1 };
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
