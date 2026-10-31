// Faces: MediaPipe FaceLandmarker (478 points and 52 blendshapes per face) next to the pose model, for what a body
// pose cannot say — a mouth opening, eyes blinking, where exactly the eyes are (googly eyes, render/googly.ts), where
// the mouth is (mouth magic, render/breath.ts). Each face joins the tracked person whose pose nose is nearest; its
// readings are smoothed by EMA (the house smoother) with a quick clock for the jaw (a mouth snapping open must show)
// and a slower one for where the eyes are. A person whose face the face model cannot read (too far, turned away) still
// has eyes and a mouth from the pose model's own face points; only the expressions are missing.
import type { FaceLandmarker as FL } from '@mediapipe/tasks-vision';
import type { Track } from './tracker';
import { L } from './landmarks';
import type { FaceState } from '../characters/build';

export interface FaceDet { pts: { x: number; y: number; z: number }[]; shapes: Map<string, number> }

/** a person's face, smoothed: image coordinates (0..1, y down) and expressions (0..1) */
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
}

export const FACE_TUNE = { tauJaw: 0.05, tauBlink: 0.04, tauShape: 0.1, tauPlace: 0.05, forgetMs: 400 };

export class FaceTracker {
  private lm: FL | null = null;
  private lastTs = -1;
  inferMs = 0;

  async load(numFaces: number): Promise<void> {
    const base = import.meta.env.BASE_URL;
    const vision = await import('@mediapipe/tasks-vision');
    const fileset = await vision.FilesetResolver.forVisionTasks(`${base}mediapipe`);
    const make = (delegate: 'GPU' | 'CPU') => vision.FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: `${base}models/face_landmarker.task`, delegate },
      runningMode: 'VIDEO', numFaces, outputFaceBlendshapes: true,
      minFaceDetectionConfidence: 0.4, minFacePresenceConfidence: 0.4, minTrackingConfidence: 0.4,
    });
    try { this.lm = await make('GPU'); } catch { this.lm = await make('CPU'); }
  }

  async setFaces(n: number): Promise<void> { await this.lm?.setOptions({ numFaces: n }); }

  detect(src: HTMLVideoElement | HTMLCanvasElement, ts: number): FaceDet[] {
    if (!this.lm) return [];
    if (ts <= this.lastTs) ts = this.lastTs + 1;
    this.lastTs = ts;
    const t0 = performance.now();
    const r = this.lm.detectForVideo(src, ts);
    this.inferMs = performance.now() - t0;
    return r.faceLandmarks.map((pts, i) => {
      const shapes = new Map<string, number>();
      for (const c of r.faceBlendshapes[i]?.categories ?? []) shapes.set(c.categoryName, c.score);
      return { pts, shapes };
    });
  }

  close(): void { this.lm?.close(); this.lm = null; }
}

const ema = (a: number, b: number, dt: number, tau: number) => a + (b - a) * (1 - Math.exp(-dt / tau));
const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const dist = (a: { x: number; y: number }, b: { x: number; y: number }, aspect: number) => Math.hypot((a.x - b.x) * aspect, a.y - b.y);

/** what a face reading says, in image coordinates: the eyes from their corners, the mouth from its inner lips */
function readFace(f: FaceDet, aspect: number) {
  const p = f.pts;
  // the face mesh's "left" eye is the person's left (263/362), its "right" the person's right (33/133)
  const eye = (outer: number, inner: number) => { const c = mid(p[outer]!, p[inner]!); return { ...c, r: dist(p[outer]!, p[inner]!, aspect) * 0.62 / aspect }; };
  const s = (k: string) => f.shapes.get(k) ?? 0;
  return {
    eyes: [eye(263, 362), eye(33, 133)],
    mouth: { ...mid(p[13]!, p[14]!), w: dist(p[61]!, p[291]!, aspect) / aspect },
    nose: p[1]!,
    probe: [p[151]!, p[152]!, p[425]!, p[205]!, p[1]!].map((q) => ({ x: q.x, y: q.y })),
    jaw: Math.min(1, s('jawOpen') * 1.4), blinkL: s('eyeBlinkLeft'), blinkR: s('eyeBlinkRight'),
    smile: (s('mouthSmileLeft') + s('mouthSmileRight')) / 2, pucker: s('mouthPucker'), browUp: s('browInnerUp'),
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

/**
 * Faces onto people: each face to the nearest unclaimed pose nose (within a face's width or two); smoothed. Every live
 * person ends with a face (read, or from the pose), so googly eyes never blink out when the face model loses one.
 */
export function attachFaces(tracks: Track[], faces: FaceDet[] | null, aspect: number, now: number, dt: number): void {
  const read = (faces ?? []).map((f) => readFace(f, aspect));
  const taken = new Set<number>();
  for (const t of tracks) {
    if (t.lost) continue;
    const nose = t.image[L.nose]!;
    let best = -1, bd = Infinity;
    read.forEach((f, i) => {
      if (taken.has(i)) return;
      const d = dist(f.nose, nose, aspect), w = Math.max(f.mouth.w * 3, 0.03);
      if (d < w * 1.5 && d < bd) { bd = d; best = i; }
    });
    const f = best >= 0 ? read[best]! : null;
    if (best >= 0) taken.add(best);
    const fresh = f ?? poseFace(t, aspect);
    let ft = t.face;
    if (!ft) {
      ft = t.face = { jaw: 0, blinkL: 0, blinkR: 0, smile: 0, pucker: 0, browUp: 0, eyes: fresh.eyes.map((e) => ({ ...e })), mouth: { ...fresh.mouth }, read: !!f, seen: now };
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
    const g = f ?? { jaw: 0, blinkL: 0, blinkR: 0, smile: 0, pucker: 0, browUp: 0 };
    ft.jaw = ema(ft.jaw, g.jaw, dt, FACE_TUNE.tauJaw);
    ft.blinkL = ema(ft.blinkL, g.blinkL, dt, FACE_TUNE.tauBlink); ft.blinkR = ema(ft.blinkR, g.blinkR, dt, FACE_TUNE.tauBlink);
    ft.smile = ema(ft.smile, g.smile, dt, FACE_TUNE.tauShape); ft.pucker = ema(ft.pucker, g.pucker, dt, FACE_TUNE.tauShape);
    ft.browUp = ema(ft.browUp, g.browUp, dt, FACE_TUNE.tauShape);
    if (f) {
      if (!ft.probe) ft.probe = f.probe.map((q) => ({ ...q }));
      else f.probe.forEach((q, i) => { const o = ft!.probe![i]!; o.x = ema(o.x, q.x, dt, FACE_TUNE.tauPlace); o.y = ema(o.y, q.y, dt, FACE_TUNE.tauPlace); });
      ft.read = true; ft.seen = now;
    } else if (now - ft.seen > FACE_TUNE.forgetMs) { ft.read = false; ft.probe = undefined; }
  }
}
