// A person's size from whatever of them is seen (founder, 2026-11-02: "We can estimate body length from other points
// (e.g., shoulders, arms, face markers). Full body is best, but they're all priors for an estimator… someone sitting
// close or in selfie mode probably isn't full body. We want to gracefully degrade… It's extrapolation with a partial
// fit").
//
// One number per person: their torso (the shoulders' middle to the hips' middle, MediaPipe's world landmarks), as a
// log, with its variance — a one-dimensional Kalman filter. Every part the picture shows (the torso itself, the neck,
// the shoulders' and hips' width, the ears' span, each upper arm, forearm, thigh and shin) is a reading of
// it through that part's share of the torso, weighed by how well it is seen (visibility, which seen.ts makes zero
// outside the frame) and by how much that share varies between people. The shares and their spread were measured on
// ~300 detections per part where both the part and the torso were clearly seen (three street walkers, a man and two
// seated people in a photo, a dozen COCO photos: ~20 people); the frame-to-frame noise of a seen torso is 0.4–2 %. (Not
// the eyes: the model's 3D puts their outer corners ~3 cm apart, 0.069 of the torso in every source — its own
// convention, a short segment with 17 % spread — where the ears and the neck say the same of the head's scale.)
//
// The model's own guess of a hidden torso is one more reading, as far as the hips are unseen. A person's own shares are learned only while their torso is seen beside the part (the torso is the reference: a
// share means nothing without it), shrunk toward the measured one by how little has been seen. So a full-body view
// teaches the fit this person's face and shoulders, and a selfie afterwards keeps their size from them; a selfie from
// the start sizes them by people's usual shares. Every length the app uses — the costume's size, the torso a torso shot
// hangs from, the limbs and neck the costumes fit to, the legs the floor stands under — comes out of the fit, seen or
// not: the unseen ones extrapolated. What persists is a person's proportions; the size itself follows the model's 3D
// scale, which moves with the framing (see `drift`).
import type { LM } from './landmarks';
import { L } from './landmarks';

type End = number[];
interface Part { sides: [End, End][]; share: number; sd: number }
const P = (ends: [End, End]) => [ends];
export const BODY_TUNE = {
  parts: {
    /** the reference: its own share is 1; sd is a seen torso's reading noise and model bias (assumed, from the
     *  0.4–2 % measured frame to frame) */
    torso: { sides: P([[L.shL, L.shR], [L.hipL, L.hipR]]), share: 1, sd: 0.03 },
    neck: { sides: P([[L.shL, L.shR], [L.earL, L.earR]]), share: 0.387, sd: 0.108 },
    shoulders: { sides: P([[L.shL], [L.shR]]), share: 0.668, sd: 0.156 },
    hips: { sides: P([[L.hipL], [L.hipR]]), share: 0.444, sd: 0.197 },
    ears: { sides: P([[L.earL], [L.earR]]), share: 0.311, sd: 0.173 },
    upperArm: { sides: [[[L.shL], [L.elL]], [[L.shR], [L.elR]]], share: 0.522, sd: 0.229 },
    forearm: { sides: [[[L.elL], [L.wrL]], [[L.elR], [L.wrR]]], share: 0.453, sd: 0.201 },
    thigh: { sides: [[[L.hipL], [L.knL]], [[L.hipR], [L.knR]]], share: 0.799, sd: 0.1 },
    shin: { sides: [[[L.knL], [L.anL]], [[L.knR], [L.anR]]], share: 0.772, sd: 0.097 },
  } satisfies Record<string, Part>,
  /** the model's own guess of a torso whose hips it cannot see: one more reading, while the shoulders are seen and as far
   *  as the hips are not, and as far as the size is not known from a seen torso (measured on one man zoomed from whole to
   *  a chest shot: 2–5 % short of his seen torso; its spread assumed) */
  guess: { share: 0.97, sd: 0.08 },
  /** a part counts from when its ends are this visible, fully from the second */
  visFrom: 0.5, visTo: 0.85,
  /** the size's drift a second (log). Not only noise: the model's own 3D scale moves with the framing (one man zoomed
   *  from whole to a chest shot: his shoulders 3 %, neck and ears 7 % smaller), and the depth is solved in that scale,
   *  so the size must follow it for the costume to keep its fit on screen. Swept on recordings: 0.01 → the costume's
   *  shoulders 5.5 % wider than his after the zoom, 0.03 → 3.6 % (no better at 0.05 or 0.1); size moving 0.06 % a frame
   *  on torso clips, 0.4 on a street of small walkers (0.01: 0.03, 0.24) */
  drift: 0.03,
  /** a frame's readings are not independent of the last (the model sees nearly the same picture): a floor on a
   *  frame's variance (log) */
  floor: 0.03,
  /** seconds of seeing a part beside the torso worth as much as the measured share; and how long one is remembered */
  prior: 0.25, forget: 30,
};
export type BodyPart = keyof typeof BODY_TUNE.parts;
const PARTS = Object.keys(BODY_TUNE.parts) as BodyPart[];

const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const at = (w: LM[], e: End) => e.length === 1 ? w[e[0]!]! : { x: (w[e[0]!]!.x + w[e[1]!]!.x) / 2, y: (w[e[0]!]!.y + w[e[1]!]!.y) / 2, z: (w[e[0]!]!.z + w[e[1]!]!.z) / 2 };
const seenOf = (image: LM[], e: End) => Math.min(...e.map((i) => image[i]!.v));

/** a person's fit: their torso (log metres) and its variance; per part, what has been learned of their own share */
export interface BodyFit { logS: number; P: number; A: Record<BodyPart, number>; B: Record<BodyPart, number> }

export function newBodyFit(): BodyFit {
  const z = () => Object.fromEntries(PARTS.map((k) => [k, 0])) as Record<BodyPart, number>;
  return { logS: NaN, P: 1, A: z(), B: z() };
}

/** a part's own share for this person (log, against the measured one) */
const own = (f: BodyFit, part: BodyPart) => (part === 'torso' ? 0 : f.A[part] / (f.B[part] + BODY_TUNE.prior));

/** a part's length for this person: their size times their share of it (seen or not) */
export function lengthOf(f: BodyFit, part: BodyPart): number {
  return Math.exp(f.logS + own(f, part)) * BODY_TUNE.parts[part].share;
}

/** how much of the size the picture holds this frame and what it says, for the readout and tests */
export interface BodyReading { weight: number; parts: Partial<Record<BodyPart, number>> }

/**
 * One frame: `world` the 3D pose (metres), `image` its picture (visibility; zero outside the frame), `dt` seconds.
 * Updates the fit and returns what was read.
 */
export function fitBody(f: BodyFit, world: LM[], image: LM[], dt: number): BodyReading {
  const T = BODY_TUNE, reads: { part: BodyPart; x: number; v: number }[] = [];
  let W = 0, Z = 0, torso = 0, torsoV = 0;
  const parts: Partial<Record<BodyPart, number>> = {};
  for (const part of PARTS) {
    const def = T.parts[part];
    for (const [a, b] of def.sides) {
      const v = sstep(T.visFrom, T.visTo, Math.min(seenOf(image, a), seenOf(image, b)));
      if (v <= 0) continue;
      const pa = at(world, a), pb = at(world, b), m = Math.hypot(pa.x - pb.x, pa.y - pb.y, pa.z - pb.z);
      if (m < 1e-4) continue;
      // this part's reading of the torso, through the share this person is believed to have
      const x = Math.log(m / def.share), w = v / (def.sd * def.sd);
      W += w; Z += w * (x - own(f, part));
      parts[part] = (parts[part] ?? 0) + v;
      if (part === 'torso') { torso = m; torsoV = v; } else reads.push({ part, x, v });
    }
  }
  // the model's guess of the hidden torso (hung from the shoulders it sees), as far as the hips are not seen
  {
    const sh = sstep(T.visFrom, T.visTo, Math.min(image[L.shL]!.v, image[L.shR]!.v));
    const hips = sstep(T.visFrom, T.visTo, Math.min(image[L.hipL]!.v, image[L.hipR]!.v));
    const pa = at(world, [L.shL, L.shR]), pb = at(world, [L.hipL, L.hipR]), m = Math.hypot(pa.x - pb.x, pa.y - pb.y, pa.z - pb.z);
    // only as far as the size is not already known from a seen torso (a full view then a selfie: counted every frame,
    // its bias dragged the known size 8 % in three seconds)
    const known = f.B.torso / (f.B.torso + T.prior);
    const v = sh * (1 - hips) * (1 - known);
    if (v > 0 && m > 1e-4) { const w = v / (T.guess.sd * T.guess.sd); W += w; Z += w * Math.log(m / T.guess.share); }
  }
  // the size: predicted (it drifts a little), then corrected by this frame's readings
  f.P += T.drift * T.drift * dt;
  if (W > 0) {
    const z = Z / W, R = 1 / W + T.floor * T.floor;
    if (!Number.isFinite(f.logS)) { f.logS = z; f.P = R; } else {
      const K = f.P / (f.P + R);
      f.logS += K * (z - f.logS);
      f.P *= 1 - K;
    }
  }
  // this person's own shares: only against a seen torso (the reference), as fast as both are seen
  const keep = Math.exp(-dt / T.forget);
  for (const part of PARTS) { f.A[part] *= keep; f.B[part] *= keep; }
  if (torsoV > 0) {
    const lt = Math.log(torso);
    f.B.torso += torsoV * dt; // how long the torso itself has been seen (its own share is 1: `own` ignores A, B)
    for (const r of reads) {
      const k = r.v * torsoV * dt;
      f.A[r.part] += k * (r.x - lt);
      f.B[r.part] += k;
    }
  }
  return { weight: W, parts };
}

/** the lengths the app reads (solve.ts bodyLengths' shape), from the fit */
export function bodyFromFit(f: BodyFit): { torso: number; upperArm: number; forearm: number; thigh: number; shin: number; neck: number } {
  return { torso: lengthOf(f, 'torso'), upperArm: lengthOf(f, 'upperArm'), forearm: lengthOf(f, 'forearm'), thigh: lengthOf(f, 'thigh'), shin: lengthOf(f, 'shin'), neck: lengthOf(f, 'neck') };
}
