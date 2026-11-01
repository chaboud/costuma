// Faces: MediaPipe FaceLandmarker (478 points, 52 blendshapes and the face's 3D turn) beside the pose model, for what a
// body pose cannot say — where the head really points, the mouth, the eyes (blinks, gaze), the brows, a smile — and
// where exactly the eyes and the mouth are (googly eyes, render/googly.ts; mouth magic, render/breath.ts).
//
// Each person's face is read from a crop round their head, where the pose model says it is, not from the whole frame:
// the face model's detector sees the frame at 128 px, and on the full frame it lost a face smaller than ~140 px of 1280
// (a person ~1 m off); on a crop it read faces down to 46 px (~3 m), as far as the pose model itself found the person
// (measured on a portrait shrunk in a 1280×720 frame, scripts/face-probe.mjs, 2026-10-31). The crop also says whose
// face it is.
//
// The head's turn comes from the face mesh's transformation matrix when it is read (rolls measured within 1–2° of the
// truth; the pose model's ear-and-nose head was 7° off at rest, 13° off mirrored, and read near-profile heads as
// 19–31°). Turned too far for the face model (a profile), the pose model's head takes over, corrected by what the face
// last said about it, the correction relaxing over seconds: never a jump.
//
// Readings are smoothed by EMA (the house smoother): quick for the jaw and blinks (a mouth snapping open must show),
// slower for the rest. A person whose face is not read keeps eyes and a mouth from the pose model's own face points.
import * as THREE from 'three';
import type { FaceLandmarker as FL } from '@mediapipe/tasks-vision';
import type { Track } from './tracker';
import type { Intrinsics } from './solve';
import { L } from './landmarks';
import { poseFromLandmarks } from './rig';
import { NEUTRAL_FACE, type FaceState } from '../characters/build';
import { FaceCalib, FaceMotion, faceGeometry, type FaceGeo } from './facegeo';

export interface FaceDet {
  /** the face mesh in the frame's image coordinates (0..1, y down) */
  pts: { x: number; y: number; z: number }[];
  shapes: Map<string, number>;
  /** the head's turn in camera axes (x right, y up, z toward the camera), the costume head's frame: x its left, y up,
   *  z forward */
  rot: THREE.Quaternion | null;
}

interface Read extends FaceState {
  /** the mesh's own shape (pose/facegeo.ts): what the expressions are read from */
  geo: FaceGeo | null;
  eyes: { x: number; y: number; r: number }[];
  mouth: { x: number; y: number; w: number };
  nose: { x: number; y: number };
  probe: { x: number; y: number }[];
}

/** a person's face, smoothed: image coordinates (0..1, y down) and expressions */
export interface FaceTrack extends FaceState {
  /** the person's left and right eye: centre and radius (radius as a share of the image width) */
  eyes: { x: number; y: number; r: number }[];
  mouth: { x: number; y: number; w: number };
  /** where to read how the face is lit (render/envlight.ts): forehead, chin, the person's left cheek, right cheek, nose
   *  — only from a read face */
  probe?: { x: number; y: number }[];
  /** whether the face model read this face lately (else: the pose model's face points only) */
  read: boolean;
  seen: number;
  /** the head's turn for the costume (camera axes, the head bone's frame), and how much to trust it over the body's
   *  own guess (0..1: 1 while the face is read) */
  head: THREE.Quaternion;
  headW: number;
  /** the face mesh's turn, smoothed; what the pose model gets wrong about this head; trust in the face */
  turn: THREE.Quaternion | null;
  bias: THREE.Quaternion;
  trust: number;
  /** the last reading and where the pose's nose was then (carried along between readings) */
  last: { read: Read; nose: { x: number; y: number }; at: number } | null;
  /** this person's resting face, which their expressions are read against (pose/facegeo.ts) */
  calib: FaceCalib | null;
  /** the face as movement, carried onto the costume's face (pose/facegeo.ts FaceMotion, render/facemap.ts) */
  motion: FaceMotion | null;
}

export const FACE_TUNE = {
  tauJaw: 0.05, tauBlink: 0.04, tauLook: 0.06, tauShape: 0.1, tauPlace: 0.05,
  /** the face mesh's turn; trust in it rising and falling; the pose model's correction learnt, and let go */
  tauTurn: 0.07, tauTrust: 0.25, tauBias: 0.6, tauBiasRelax: 2.5,
  forgetMs: 400,
  /** read the expressions from the mesh's shape (pose/facegeo.ts); false: the model's blendshape scores alone */
  mesh: true,
  /** faces read a frame (more people take turns); the crop's side over the head's size, and its pixels */
  perFrame: 2, crop: 2.4, cropPx: 320,
  /** past this many milliseconds of face reading in a frame, the next person waits for the next frame */
  budgetMs: 12,
};

const ID = new THREE.Quaternion();
const BACK = new THREE.Vector3(0, 0, -1);

export class FaceTracker {
  private lm: FL | null = null;
  inferMs = 0;
  private readonly canvas = document.createElement('canvas');
  private readonly ctx: CanvasRenderingContext2D;
  private readonly tried = new Map<number, number>();
  private n = 0;
  private readonly M = new THREE.Matrix4();
  private readonly v1 = new THREE.Vector3();
  private readonly v2 = new THREE.Vector3();

  constructor() {
    this.canvas.width = this.canvas.height = FACE_TUNE.cropPx;
    this.ctx = this.canvas.getContext('2d')!;
  }

  async load(): Promise<void> {
    const base = import.meta.env.BASE_URL;
    const vision = await import('@mediapipe/tasks-vision');
    const fileset = await vision.FilesetResolver.forVisionTasks(`${base}mediapipe`);
    const make = (delegate: 'GPU' | 'CPU') => vision.FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: `${base}models/face_landmarker.task`, delegate },
      runningMode: 'IMAGE', numFaces: 1, outputFaceBlendshapes: true, outputFacialTransformationMatrixes: true,
      minFaceDetectionConfidence: 0.4, minFacePresenceConfidence: 0.4,
    });
    try { this.lm = await make('GPU'); } catch { this.lm = await make('CPU'); }
  }

  /**
   * Each tracked person's face, from a crop round their head: up to FACE_TUNE.perFrame people a frame, the longest
   * waiting first. `K` is in the source's pixels.
   */
  detect(src: HTMLVideoElement | HTMLCanvasElement, tracks: Track[], K: Intrinsics): Map<number, FaceDet> {
    const out = new Map<number, FaceDet>();
    if (!this.lm) return out;
    this.n++;
    const live = tracks.filter((t) => !t.lost && t.presence > 0.2)
      .sort((a, b) => (this.tried.get(a.id) ?? -1) - (this.tried.get(b.id) ?? -1));
    const t0 = performance.now();
    const C = FACE_TUNE.cropPx, g = this.ctx;
    for (const t of live.slice(0, FACE_TUNE.perFrame)) {
      if (out.size && performance.now() - t0 > FACE_TUNE.budgetMs) break;
      this.tried.set(t.id, this.n);
      const box = headBox(t, K.w, K.h);
      if (!box) continue;
      g.fillStyle = '#000';
      g.fillRect(0, 0, C, C);
      g.drawImage(src, box.x, box.y, box.s, box.s, 0, 0, C, C);
      const r = this.lm.detect(this.canvas);
      const pts = r.faceLandmarks[0];
      // a face away from the crop's middle is someone else's (a head beside theirs)
      if (!pts || Math.hypot(pts[1]!.x - 0.5, pts[1]!.y - 0.5) > 0.3) continue;
      const shapes = new Map<string, number>();
      for (const c of r.faceBlendshapes[0]?.categories ?? []) shapes.set(c.categoryName, c.score);
      let rot: THREE.Quaternion | null = null;
      const m = r.facialTransformationMatrixes?.[0];
      if (m?.data?.length === 16) {
        // the crop's turn is as seen by a camera looking straight at the crop; turned by the ray to the crop's centre,
        // it is as our camera sees it (a face high in the frame looking at the lens is turned down)
        this.M.fromArray(m.data);
        const q = new THREE.Quaternion();
        this.M.decompose(this.v1, q, this.v2);
        const ray = new THREE.Vector3((box.x + box.s / 2 - K.cx) / K.f, -(box.y + box.s / 2 - K.cy) / K.f, -1).normalize();
        rot = new THREE.Quaternion().setFromUnitVectors(BACK, ray).multiply(q);
      }
      out.set(t.id, { pts: pts.map((p) => ({ x: (box.x + p.x * box.s) / K.w, y: (box.y + p.y * box.s) / K.h, z: (p.z * box.s) / K.w })), shapes, rot });
    }
    for (const id of this.tried.keys()) if (!tracks.some((t) => t.id === id)) this.tried.delete(id);
    this.inferMs = performance.now() - t0;
    return out;
  }

  close(): void { this.lm?.close(); this.lm = null; }
}

/** the square round a person's head, in source pixels, from the pose model's face points */
function headBox(t: Track, W: number, H: number): { x: number; y: number; s: number } | null {
  const im = t.image;
  const px = (i: number) => ({ x: im[i]!.x * W, y: im[i]!.y * H });
  const ids = [L.nose, L.eyeL, L.eyeR, L.earL, L.earR];
  let cx = 0, cy = 0;
  for (const i of ids) { const p = px(i); cx += p.x / ids.length; cy += p.y / ids.length; }
  const d = (a: number, b: number) => { const p = px(a), q = px(b); return Math.hypot(p.x - q.x, p.y - q.y); };
  const s = FACE_TUNE.crop * Math.max(d(L.earL, L.earR), d(L.nose, L.earL), d(L.nose, L.earR), 0.35 * d(L.shL, L.shR));
  return s > 24 && Number.isFinite(cx + cy) ? { x: cx - s / 2, y: cy - s / 2, s } : null;
}

const ema = (a: number, b: number, dt: number, tau: number) => a + (b - a) * (1 - Math.exp(-dt / tau));
const clamp1 = (x: number) => Math.max(-1, Math.min(1, x));
const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const dist = (a: { x: number; y: number }, b: { x: number; y: number }, aspect: number) => Math.hypot((a.x - b.x) * aspect, a.y - b.y);

/** what a face reading says, in image coordinates: the eyes from their corners, the mouth from its inner lips, and every
 *  expression the costumes use */
function readFace(f: FaceDet, K: Intrinsics): Read {
  const p = f.pts, aspect = K.w / K.h;
  // the face mesh's "left" eye is the person's left (263/362), its "right" the person's right (33/133); the
  // blendshapes' Left is the person's left too (measured: an eye painted shut on a photo read 0.57 against 0.24)
  const eye = (outer: number, inner: number) => { const c = mid(p[outer]!, p[inner]!); return { ...c, r: dist(p[outer]!, p[inner]!, aspect) * 0.62 / aspect }; };
  const s = (k: string) => f.shapes.get(k) ?? 0;
  // the gains: the model's scores seldom reach 1 for the whole movement (assumed from its demos, not measured here)
  return {
    geo: faceGeometry(p, K.w, K.h),
    eyes: [eye(263, 362), eye(33, 133)],
    mouth: { ...mid(p[13]!, p[14]!), w: dist(p[61]!, p[291]!, aspect) / aspect },
    nose: p[1]!,
    probe: [p[151]!, p[152]!, p[425]!, p[205]!, p[1]!].map((q) => ({ x: q.x, y: q.y })),
    jaw: Math.min(1, s('jawOpen') * 1.4), blinkL: s('eyeBlinkLeft'), blinkR: s('eyeBlinkRight'),
    smileL: s('mouthSmileLeft'), smileR: s('mouthSmileRight'), smile: (s('mouthSmileLeft') + s('mouthSmileRight')) / 2,
    frown: (s('mouthFrownLeft') + s('mouthFrownRight')) / 2, pucker: s('mouthPucker'), funnel: s('mouthFunnel'),
    browUp: s('browInnerUp'), browDownL: s('browDownLeft'), browDownR: s('browDownRight'),
    browOuterL: s('browOuterUpLeft'), browOuterR: s('browOuterUpRight'),
    squintL: s('eyeSquintLeft'), squintR: s('eyeSquintRight'), wideL: s('eyeWideLeft'), wideR: s('eyeWideRight'),
    // the left eye looking out and the right looking in both look toward the person's left
    lookX: clamp1(((s('eyeLookOutLeft') - s('eyeLookInLeft')) + (s('eyeLookInRight') - s('eyeLookOutRight'))) * 0.8),
    lookY: clamp1(((s('eyeLookUpLeft') + s('eyeLookUpRight')) - (s('eyeLookDownLeft') + s('eyeLookDownRight'))) * 0.8),
    jawSide: clamp1((s('jawLeft') - s('jawRight')) * 2),
    puff: s('cheekPuff'), sneer: (s('noseSneerLeft') + s('noseSneerRight')) / 2,
  };
}

/** a face from the pose model alone: its eye points and mouth corners (no expressions) */
function poseFace(t: Track, aspect: number) {
  const im = t.image;
  const eyeR = dist(im[L.eyeL]!, im[L.eyeR]!, aspect) * 0.3 / aspect;
  return {
    eyes: [{ x: im[L.eyeL]!.x, y: im[L.eyeL]!.y, r: eyeR }, { x: im[L.eyeR]!.x, y: im[L.eyeR]!.y, r: eyeR }],
    mouth: { ...mid(im[L.mouthL]!, im[L.mouthR]!), w: dist(im[L.mouthL]!, im[L.mouthR]!, aspect) / aspect },
  };
}

/** a reading moved by (dx, dy): the last one carried along with the pose's nose */
function carried(r: Read, dx: number, dy: number): Read {
  return { ...r, eyes: r.eyes.map((e) => ({ ...e, x: e.x + dx, y: e.y + dy })), mouth: { ...r.mouth, x: r.mouth.x + dx, y: r.mouth.y + dy },
    nose: { x: r.nose.x + dx, y: r.nose.y + dy }, probe: r.probe.map((q) => ({ x: q.x + dx, y: q.y + dy })) };
}

const KEYS = Object.keys(NEUTRAL_FACE) as (keyof FaceState)[];
const TAU = (k: keyof FaceState): number => k === 'jaw' ? FACE_TUNE.tauJaw : k === 'blinkL' || k === 'blinkR' ? FACE_TUNE.tauBlink
  : k === 'lookX' || k === 'lookY' ? FACE_TUNE.tauLook : FACE_TUNE.tauShape;

/**
 * Faces onto people (`faces` by track id, this frame's readings), smoothed. Every live person ends with a face (read,
 * carried from a reading a moment ago, or from the pose), so googly eyes never blink out when the face model loses one,
 * and a head (`face.head`) the costume can turn by.
 */
export function attachFaces(tracks: Track[], faces: Map<number, FaceDet> | null, K: Intrinsics, now: number, dt: number): void {
  const aspect = K.w / K.h;
  for (const t of tracks) {
    if (t.lost) continue;
    const det = faces?.get(t.id) ?? null;
    const nose = t.image[L.nose]!;
    let ft = t.face;
    const f = det ? readFace(det, K) : null;
    // not read this frame (another person's turn): the last reading carried along by the pose's nose, until it is old
    const recent = !f && ft?.last && now - ft.last.at < FACE_TUNE.forgetMs ? carried(ft.last.read, nose.x - ft.last.nose.x, nose.y - ft.last.nose.y) : null;
    const known = f ?? recent;
    const fresh = known ?? poseFace(t, aspect);
    const bodyHead = poseFromLandmarks(t.world).head;
    if (!ft) {
      ft = t.face = { ...NEUTRAL_FACE, eyes: fresh.eyes.map((e) => ({ ...e })), mouth: { ...fresh.mouth }, read: !!f, seen: now,
        head: bodyHead.clone(), headW: 0, turn: null, bias: new THREE.Quaternion(), trust: 0, last: null, calib: null, motion: null };
    }
    // the face as movement, for the costume's face (a reading moves it; none relaxes it)
    if (det) { ft.motion ??= new FaceMotion(); ft.motion.update(det.pts, K.w, K.h, dt); }
    else if (!recent) ft.motion?.relax(dt);
    // the expressions from the mesh's shape against this person's resting face (the scores fill in what it cannot say)
    if (f?.geo && FACE_TUNE.mesh) {
      const calib = ft.calib ??= new FaceCalib();
      calib.update(f.geo, dt);
      Object.assign(f, calib.express(f.geo, f));
    }
    // where: what the eyes and mouth do together (a hand-held camera shaking the face) is followed at once; what each
    // does alone glides (a read face and the pose's points differ by a little: never a jump between them)
    {
      const pts = [...fresh.eyes, fresh.mouth], old = [...ft.eyes, ft.mouth];
      let dx = 0, dy = 0;
      pts.forEach((p, i) => { dx += p.x - old[i]!.x; dy += p.y - old[i]!.y; });
      dx /= pts.length; dy /= pts.length;
      for (const o of old) { o.x += dx; o.y += dy; }
    }
    fresh.eyes.forEach((e, i) => { const o = ft!.eyes[i]!; o.x = ema(o.x, e.x, dt, FACE_TUNE.tauPlace); o.y = ema(o.y, e.y, dt, FACE_TUNE.tauPlace); o.r = ema(o.r, e.r, dt, FACE_TUNE.tauPlace * 3); });
    ft.mouth.x = ema(ft.mouth.x, fresh.mouth.x, dt, FACE_TUNE.tauPlace); ft.mouth.y = ema(ft.mouth.y, fresh.mouth.y, dt, FACE_TUNE.tauPlace);
    ft.mouth.w = ema(ft.mouth.w, fresh.mouth.w, dt, FACE_TUNE.tauPlace * 3);
    // what: expressions from a read face; unread, they relax to rest
    const g: FaceState = known ?? NEUTRAL_FACE;
    for (const k of KEYS) ft[k] = ema(ft[k], g[k], dt, TAU(k));
    if (f) {
      if (!ft.probe) ft.probe = f.probe.map((q) => ({ ...q }));
      else f.probe.forEach((q, i) => { const o = ft!.probe![i]!; o.x = ema(o.x, q.x, dt, FACE_TUNE.tauPlace); o.y = ema(o.y, q.y, dt, FACE_TUNE.tauPlace); });
      ft.read = true; ft.seen = now;
      ft.last = { read: f, nose: { x: nose.x, y: nose.y }, at: now };
    } else if (!recent && now - ft.seen > FACE_TUNE.forgetMs) { ft.read = false; ft.probe = undefined; }
    // the head: the face mesh's turn while it is read; otherwise the body's, corrected by what the face last said
    if (det?.rot) {
      if (!ft.turn) ft.turn = det.rot.clone();
      else ft.turn.slerp(det.rot, 1 - Math.exp(-dt / FACE_TUNE.tauTurn));
      ft.bias.slerp(ft.turn.clone().multiply(bodyHead.clone().invert()), 1 - Math.exp(-dt / FACE_TUNE.tauBias));
      ft.trust = ema(ft.trust, 1, dt, FACE_TUNE.tauTrust);
    } else if (!recent) {
      ft.trust = ema(ft.trust, 0, dt, FACE_TUNE.tauTrust);
      ft.bias.slerp(ID, 1 - Math.exp(-dt / FACE_TUNE.tauBiasRelax));
    }
    const fromBody = ft.bias.clone().multiply(bodyHead);
    ft.head.copy(ft.turn && ft.trust > 1e-3 ? fromBody.slerp(ft.turn, ft.trust) : fromBody);
    ft.headW = ft.trust;
  }
}
