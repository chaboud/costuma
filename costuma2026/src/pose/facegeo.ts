// The face read from the mesh's own shape, not from the model's expression scores (founder, 2026-11-01: "the face
// should be more responsive to actual deformation of the mesh"). The blendshape scores are a learned guess per
// expression — sluggish, saturating, and blind to how far a lip actually moved; the 478 points are where the lips, lids,
// brows and irises are. So: measure the face in a frame on the rigid upper face (the outer eye corners across, the
// forehead over the nose tip up), in units of the outer-eye-corner span, and read each expression as how far its
// points have moved from the person's own resting face.
//
// The resting face starts as the person's first reading (the mouth shut and the eyes open as MediaPipe's canonical face
// model has them: mediapipe/modules/face_geometry/data/canonical_face_model.obj, Apache 2.0; the numbers below measured
// on it in this frame) and adapts: slowly on everything (expressions come and go; the face stays), quickly upward on
// the eyes' opening (blinks are brief, so the open eye is the most common large value). The gains — how far a movement reads as "all the way" — are
// assumed from typical faces, not measured on live ones.
import { NEUTRAL_FACE, type FaceState } from '../characters/build';

/** the face's shape this frame, in outer-eye-corner spans, in its own frame (x the person's left, y up) */
export interface FaceGeo {
  /** the inner lips apart */
  gap: number;
  /** the mouth's corners apart */
  width: number;
  /** each mouth corner's height over the upper lip's inner middle */
  cornerL: number; cornerR: number;
  /** each eye's opening (lid to lid) over its width */
  apL: number; apR: number;
  /** each brow's inner and outer end over its eye's middle */
  browInL: number; browInR: number; browOutL: number; browOutR: number;
  /** each iris across its eye (-1 inner corner .. 1 outer) and up from the corners' line (over the eye's width) */
  irisXL: number; irisXR: number; irisYL: number; irisYR: number;
  /** the chin across the face */
  chinX: number;
}

/** the canonical face measured in the same frame (scripts: computed from canonical_face_model.obj, 2026-11-01) */
export const CANONICAL: FaceGeo = {
  gap: 0.065, width: 0.552, cornerL: -0.005, cornerR: -0.005, apL: 0.235, apR: 0.235,
  browInL: 0.193, browInR: 0.193, browOutL: 0.196, browOutR: 0.196, irisXL: 0, irisXR: 0, irisYL: 0, irisYR: 0, chinX: 0,
};

type P = { x: number; y: number; z: number };
const sub = (a: number[], b: number[]) => [a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!];
const dot = (a: number[], b: number[]) => a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!;
const scale = (a: number[], k: number) => [a[0]! * k, a[1]! * k, a[2]! * k];
const len = (a: number[]) => Math.sqrt(dot(a, a));
const cross = (a: number[], b: number[]) => [a[1]! * b[2]! - a[2]! * b[1]!, a[2]! * b[0]! - a[0]! * b[2]!, a[0]! * b[1]! - a[1]! * b[0]!];

/**
 * The face's shape from its mesh (MediaPipe's 478 points: x, y in 0..1 of a W×H picture, y down; z depth in the units of
 * x, smaller nearer). Null if the mesh is too small or degenerate.
 */
/** the face's own frame: a point of the mesh in it (outer-eye-corner spans; x the person's left, y up, z out of the
 *  face), or null if the mesh is too small or degenerate */
export function faceFrame(pts: P[], W: number, H: number): ((i: number) => number[]) | null {
  if (pts.length < 468) return null;
  // in pixels, y up, z toward the camera: a right-handed frame like the canonical model's
  const v = (i: number) => [pts[i]!.x * W, -pts[i]!.y * H, -pts[i]!.z * W];
  const rOut = v(33), lOut = v(263);
  const s = len(sub(lOut, rOut));
  if (s < 8) return null;
  const o = scale([rOut[0]! + lOut[0]!, rOut[1]! + lOut[1]!, rOut[2]! + lOut[2]!], 0.5);
  const x = scale(sub(lOut, rOut), 1 / s);
  let y = sub(v(10), v(1));
  y = sub(y, scale(x, dot(y, x)));
  const ly = len(y);
  if (ly < 1e-6) return null;
  y = scale(y, 1 / ly);
  const z = cross(x, y);
  return (i: number) => { const d = sub(v(i), o); return [dot(d, x) / s, dot(d, y) / s, dot(d, z) / s]; };
}

export function faceGeometry(pts: P[], W: number, H: number): FaceGeo | null {
  const L = faceFrame(pts, W, H);
  if (!L) return null;
  const l13 = L(13), l14 = L(14);
  const eyeL = [L(263), L(362)], eyeR = [L(33), L(133)];
  const midL = [(eyeL[0]![0]! + eyeL[1]![0]!) / 2, (eyeL[0]![1]! + eyeL[1]![1]!) / 2];
  const midR = [(eyeR[0]![0]! + eyeR[1]![0]!) / 2, (eyeR[0]![1]! + eyeR[1]![1]!) / 2];
  const wL = Math.abs(eyeL[0]![0]! - eyeL[1]![0]!), wR = Math.abs(eyeR[0]![0]! - eyeR[1]![0]!);
  // the irises (points 468–477, when the mesh has them): whichever centre is nearer each eye
  let irisXL = 0, irisXR = 0, irisYL = 0, irisYR = 0;
  if (pts.length >= 478 && wL > 1e-4 && wR > 1e-4) {
    const a = L(468), b = L(473);
    const dA = Math.hypot(a[0]! - midL[0]!, a[1]! - midL[1]!), dB = Math.hypot(b[0]! - midL[0]!, b[1]! - midL[1]!);
    const iL = dA < dB ? a : b, iR = dA < dB ? b : a;
    // across: -1 at the inner corner, +1 at the outer (the left eye's outer corner is toward +x, the right's toward -x)
    irisXL = ((iL[0]! - eyeL[1]![0]!) / (eyeL[0]![0]! - eyeL[1]![0]!) - 0.5) * 2;
    irisXR = ((iR[0]! - eyeR[1]![0]!) / (eyeR[0]![0]! - eyeR[1]![0]!) - 0.5) * 2;
    irisYL = (iL[1]! - midL[1]!) / wL;
    irisYR = (iR[1]! - midR[1]!) / wR;
  }
  return {
    gap: l13[1]! - l14[1]!,
    width: L(291)[0]! - L(61)[0]!,
    cornerL: L(291)[1]! - l13[1]!, cornerR: L(61)[1]! - l13[1]!,
    apL: wL > 1e-4 ? (L(386)[1]! - L(374)[1]!) / wL : CANONICAL.apL,
    apR: wR > 1e-4 ? (L(159)[1]! - L(145)[1]!) / wR : CANONICAL.apR,
    browInL: L(336)[1]! - midL[1]!, browInR: L(107)[1]! - midR[1]!, browOutL: L(300)[1]! - midL[1]!, browOutR: L(70)[1]! - midR[1]!,
    irisXL, irisXR, irisYL, irisYR,
    chinX: L(152)[0]!,
  };
}

export const GEO_TUNE = {
  /** seconds: the resting face follows the person this slowly; the eyes' opening this fast upward (blinks are brief) */
  tauRest: 6, tauOpenEye: 2.5, tauShutEye: 20,
  /** the mouth's rest: learnt shut quickly, open slowly (a mouth breather levels out, a yawn does not) */
  tauMouthShut: 1.5, tauMouthOpen: 25,
  /** how far each movement reads as all the way (outer-eye-corner spans; assumed from typical faces) */
  gapFull: 0.42, cornerFull: 0.06, browFull: 0.06, browDownFull: 0.045, lookFull: 0.35, lookYFull: 0.1, chinFull: 0.08,
  /** an eye this much closed (1 - opening over its resting opening) starts to read as a blink, and this much is shut */
  blinkFrom: 0.3, blinkTo: 0.8,
};

/** 0..1 by a smooth step (a ramp with no corners: the expressions drive motion) */
const smooth01 = (x: number) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
const clamp01 = smooth01;
/** -1..1, easing into the ends (tanh): a gaze or a sideways jaw never meets a wall */
const clamp1 = (x: number) => Math.tanh(x);
const toward = (a: number, b: number, dt: number, tau: number) => a + (b - a) * (1 - Math.exp(-dt / tau));
type Keys = keyof FaceGeo;

/** One person's resting face, and their expressions read against it. */
export class FaceCalib {
  readonly rest: FaceGeo = { ...CANONICAL };
  private primed = false;

  /** learn the resting face from a reading `dt` seconds after the last */
  update(g: FaceGeo, dt: number): void {
    // the first reading is the person's rest, near enough: faces differ more than expressions do at a glance (a
    // portrait's brows sat 0.13 over the eyes against the canonical 0.19, which would read as a full scowl until
    // learnt). Not the mouth (it rests shut) or a blinking eye (rests open); a smile in it is still read by the scores.
    if (!this.primed) {
      for (const k of Object.keys(this.rest) as Keys[]) this.rest[k] = g[k];
      this.rest.gap = Math.min(g.gap, CANONICAL.gap);
      this.rest.apL = Math.max(g.apL, CANONICAL.apL * 0.7); this.rest.apR = Math.max(g.apR, CANONICAL.apR * 0.7);
      this.primed = true;
      return;
    }
    const T = GEO_TUNE;
    for (const k of Object.keys(this.rest) as Keys[]) {
      if (k === 'apL' || k === 'apR') {
        // an eye nearly as open as its rest teaches fast; a closing one barely (a blink or a squint is not the rest) —
        // the rate a curve of how open it is, not a switch
        const open = smooth01((g[k] / Math.max(1e-3, this.rest[k]) - 0.65) / 0.3);
        this.rest[k] = toward(this.rest[k], g[k], dt, T.tauShutEye + (T.tauOpenEye - T.tauShutEye) * open);
      } else if (k === 'gap') {
        // the mouth rests shut: learnt downward quickly, upward slowly, the rate a curve of which way and how far
        const shutting = smooth01(0.5 - (g.gap - this.rest.gap) / 0.08);
        this.rest.gap = toward(this.rest.gap, g.gap, dt, T.tauMouthOpen + (T.tauMouthShut - T.tauMouthOpen) * shutting);
      } else this.rest[k] = toward(this.rest[k], g[k], dt, T.tauRest);
    }
  }

  /**
   * The expressions this shape makes against the rest. `scores`: the model's blendshape reading of the same face, used
   * only where the mesh says nothing (a puffed cheek, a wrinkled nose).
   */
  express(g: FaceGeo, scores: FaceState): FaceState {
    // relative throughout (founder: "If someone has resting bitch face, it'll level out. If they hold a scowl, it'll
    // level out. The changes will surface"): every channel against the learnt rest; the scores only for what the mesh
    // cannot say (a puffed cheek, a wrinkled nose)
    const T = GEO_TUNE, r = this.rest;
    const jaw = clamp01((g.gap - r.gap) / T.gapFull);
    const close = (ap: number, rest: number) => 1 - ap / Math.max(1e-3, rest);
    const cL = close(g.apL, r.apL), cR = close(g.apR, r.apR);
    const blink = (c: number) => clamp01((c - T.blinkFrom) / (T.blinkTo - T.blinkFrom));
    const smileL = clamp01((g.cornerL - r.cornerL) / T.cornerFull), smileR = clamp01((g.cornerR - r.cornerR) / T.cornerFull);
    const down = clamp01(-((g.cornerL - r.cornerL) + (g.cornerR - r.cornerR)) / 2 / T.cornerFull) * (1 - jaw);
    const narrow = clamp01((0.9 - g.width / Math.max(1e-3, r.width)) / 0.25);
    const shut = 1 - clamp01((g.gap - r.gap) / 0.12);
    return {
      ...NEUTRAL_FACE,
      puff: scores.puff, sneer: scores.sneer,
      jaw,
      blinkL: blink(cL), blinkR: blink(cR),
      squintL: clamp01(cL / 0.45), squintR: clamp01(cR / 0.45),
      wideL: clamp01(-cL / 0.35), wideR: clamp01(-cR / 0.35),
      smileL, smileR, smile: (smileL + smileR) / 2,
      frown: down,
      pucker: narrow * shut, funnel: narrow * (1 - shut),
      browUp: clamp01(((g.browInL - r.browInL) + (g.browInR - r.browInR)) / 2 / T.browFull),
      browDownL: clamp01(-(g.browInL - r.browInL) / T.browDownFull),
      browDownR: clamp01(-(g.browInR - r.browInR) / T.browDownFull),
      browOuterL: clamp01((g.browOutL - r.browOutL) / T.browFull),
      browOuterR: clamp01((g.browOutR - r.browOutR) / T.browFull),
      // toward the person's left: the left iris toward its outer corner, the right toward its inner
      lookX: clamp1(((g.irisXL - r.irisXL) - (g.irisXR - r.irisXR)) / 2 / T.lookFull),
      lookY: clamp1(((g.irisYL - r.irisYL) + (g.irisYR - r.irisYR)) / 2 / T.lookYFull),
      jawSide: clamp1((g.chinX - r.chinX) / T.chinFull),
    };
  }
}

/**
 * The points whose movement is carried onto a costume's face (render/facemap.ts): the mesh's index, where it rests on
 * the canonical face in the frame above (computed from canonical_face_model.obj, 2026-11-01), and what it is. `jaw`:
 * its up-and-down is the jaw's (a costume with a jaw bone opens by it, so the surface must not open again); `mouth`: its
 * rest is learnt slowly (founder: a mouth breather "is more absolute").
 */
export const CONTROLS: { i: number; at: [number, number, number]; name: string; jaw?: boolean; mouth?: boolean }[] = [
  { i: 61, at: [-0.2762, -0.7887, -0.1204], name: 'mouthR', mouth: true },
  { i: 291, at: [0.2762, -0.7887, -0.1204], name: 'mouthL', mouth: true },
  { i: 0, at: [0, -0.7463, 0.0932], name: 'lipTop', mouth: true },
  { i: 37, at: [-0.08, -0.7346, 0.0849], name: 'lipUpR', mouth: true },
  { i: 267, at: [0.08, -0.7346, 0.0849], name: 'lipUpL', mouth: true },
  { i: 17, at: [0, -0.941, -0.0213], name: 'lipBot', mouth: true, jaw: true },
  { i: 84, at: [-0.0787, -0.9302, -0.0281], name: 'lipLoR', mouth: true, jaw: true },
  { i: 314, at: [0.0787, -0.9302, -0.0281], name: 'lipLoL', mouth: true, jaw: true },
  { i: 205, at: [-0.4311, -0.4831, -0.0402], name: 'cheekR' },
  { i: 425, at: [0.4311, -0.4831, -0.0402], name: 'cheekL' },
  { i: 50, at: [-0.5359, -0.373, -0.0763], name: 'cheekHiR' },
  { i: 280, at: [0.5359, -0.373, -0.0763], name: 'cheekHiL' },
  { i: 64, at: [-0.1791, -0.4982, 0.1107], name: 'alaR' },
  { i: 294, at: [0.1791, -0.4982, 0.1107], name: 'alaL' },
  { i: 107, at: [-0.157, 0.1784, 0.3098], name: 'browInR' },
  { i: 105, at: [-0.4483, 0.2179, 0.2221], name: 'browMidR' },
  { i: 70, at: [-0.6434, 0.1821, 0.0176], name: 'browOutR' },
  { i: 336, at: [0.157, 0.1784, 0.3098], name: 'browInL' },
  { i: 334, at: [0.4483, 0.2179, 0.2221], name: 'browMidL' },
  { i: 300, at: [0.6434, 0.1821, 0.0176], name: 'browOutL' },
  { i: 152, at: [0, -1.3303, -0.2954], name: 'chin', mouth: true, jaw: true },
  { i: 172, at: [-0.6681, -0.8223, -0.7114], name: 'jawR', jaw: true },
  { i: 397, at: [0.6681, -0.8223, -0.7114], name: 'jawL', jaw: true },
];

export const TRANSFER_TUNE = {
  /** seconds: a control's rest follows the face (a held expression levels out), the mouth's more slowly; the movement
   *  shown is smoothed this much */
  tauRest: 6, tauMouthRest: 25, tauMove: 0.05,
};

/**
 * One person's face as movement (founder, 2026-11-01: "Our face mesh should apply/map to boned faces. Not expression
 * triggers. Mappings ... Performance transfer"): where each control point is against where it rests, in the face's own
 * frame and units, relative and smoothed ("Just do relative plus smoothing").
 */
export class FaceMotion {
  readonly rest = new Float32Array(CONTROLS.length * 3);
  /** each control's movement, smoothed (x, y, z per control, outer-eye-corner spans) */
  readonly move = new Float32Array(CONTROLS.length * 3);
  private primed = false;

  update(pts: P[], W: number, H: number, dt: number): boolean {
    const L = faceFrame(pts, W, H);
    if (!L) return false;
    const T = TRANSFER_TUNE, kMove = 1 - Math.exp(-dt / T.tauMove);
    CONTROLS.forEach((c, k) => {
      const p = L(c.i);
      for (let a = 0; a < 3; a++) {
        const j = k * 3 + a, x = p[a]!;
        if (!this.primed) this.rest[j] = x;
        else this.rest[j] = this.rest[j]! + (x - this.rest[j]!) * (1 - Math.exp(-dt / (c.mouth ? T.tauMouthRest : T.tauRest)));
        this.move[j] = this.move[j]! + (x - this.rest[j]! - this.move[j]!) * kMove;
      }
    });
    this.primed = true;
    return true;
  }

  /** a still face: the movement eases back to none (the face model lost it) */
  relax(dt: number): void {
    const k = 1 - Math.exp(-dt / 0.2);
    for (let j = 0; j < this.move.length; j++) this.move[j] = this.move[j]! * (1 - k);
  }
}
