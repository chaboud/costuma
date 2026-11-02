// Hands: MediaPipe HandLandmarker (21 points a hand) beside the pose model, for what a body pose cannot say — which way
// the hand faces (its palm, the wrist's bend and twist) and how far each finger is curled (founder, 2026-11-02: "Some
// of our characters have hands.. we should be doing hand tracking"; sign-language clips as the test material).
//
// Each hand is read from a crop round its wrist, where the pose model says it is, as the face is read from a crop round
// the head (pose/face.ts): the crop says whose hand it is and which, and finds a far person's small hands. Measured
// headless on two WLASL sign clips, one NSL clip and a yoga still (scripts/hand-probe.mjs, 2026-11-02): the crop found a
// hand on every frame whose wrist the pose model read as visible on the near clips, its wrist within 0.05 of the crop's
// side of the pose model's at the median (0.07 at the 90th percentile); on the still, arms out and the hands small, the
// crops found both hands and the whole frame neither. The model's handedness is not used (on the still it called both
// hands right); the crop already says which.
//
// A hand is a frame (x across the knuckles from the little finger to the index, y from the wrist to the middle knuckle,
// z = x × y: out of the back of the left hand, the palm of the right) in camera axes, and five curls (0 straight, 1 a
// fist). Read, it is smoothed by slerp and EMA (the house smoother); between readings (the hands take turns) it rides
// the forearm; unread for a while it eases onto the pose model's own hand points (its index and little-finger tips:
// which way the hand points, trusted less; its twist stays as it was), and with none of those, the costume's wrist goes
// straight (rest). Every weight is
// a curve (founder: "no booleans in motion").
import * as THREE from 'three';
import type { HandLandmarker as HL } from '@mediapipe/tasks-vision';
import type { Track } from './tracker';
import type { Intrinsics } from './solve';
import { L, type LM } from './landmarks';

/** HandLandmarker's 21 points */
export const H = {
  wrist: 0, thumbCmc: 1, thumbMcp: 2, thumbIp: 3, thumbTip: 4, indexMcp: 5, indexPip: 6, indexDip: 7, indexTip: 8,
  middleMcp: 9, middlePip: 10, middleDip: 11, middleTip: 12, ringMcp: 13, ringPip: 14, ringDip: 15, ringTip: 16,
  pinkyMcp: 17, pinkyPip: 18, pinkyDip: 19, pinkyTip: 20,
} as const;
/** each finger's chain, the wrist first: thumb, index, middle, ring, little */
export const FINGERS: number[][] = [[0, 1, 2, 3, 4], [0, 5, 6, 7, 8], [0, 9, 10, 11, 12], [0, 13, 14, 15, 16], [0, 17, 18, 19, 20]];
/** the bones the debug view draws */
export const HAND_BONES: [number, number][] = [...FINGERS.flatMap((f) => f.slice(1).map((p, i) => [f[i]!, p] as [number, number])), [5, 9], [9, 13], [13, 17]];

export type Side = 'L' | 'R';
type P3 = { x: number; y: number; z: number };

export interface HandDet {
  side: Side;
  /** the points in the frame's image coordinates (0..1, y down; z as x's scale) */
  pts: P3[];
  /** the points in metres about the hand's middle, camera axes (x right, y up, z toward the camera), turned to the
   *  camera's view of the crop */
  world: P3[];
  score: number;
}

export interface HandState {
  /** the hand's frame in camera axes: x across (little finger → index), y along (wrist → middle knuckle) */
  q: THREE.Quaternion;
  /** how far each finger is curled: thumb, index, middle, ring, little (0 straight, 1 a fist) */
  curl: number[];
  /** how much the hand model's reading stands (0..1), against the pose model's hand points */
  trust: number;
  /** how much to pose the hand at all (0: the costume's wrist straight) */
  w: number;
  /** the smoothed points (image, 0..1), for the debug view; null unread */
  pts: { x: number; y: number }[] | null;
  /** when last read (ms); the last reading's frame and the forearm's direction then (carried with the forearm) */
  seen: number;
  last: { q: THREE.Quaternion; fore: THREE.Vector3 } | null;
}

export const HAND_TUNE = {
  /** crops read a frame (the hands take turns), and the ms past which the next waits for the next frame */
  perFrame: 2, budgetMs: 10,
  /** the crop: its side over the forearm, the knuckles' reach, the shoulders, the torso (the largest wins); its middle
   *  this share of its side past the wrist toward the knuckles; its pixels */
  crop: { fore: 1.4, knuck: 4, shoulders: 0.9, torso: 0.6, min: 40, ahead: 0.25, px: 256 },
  /** a reading whose wrist lies further than this share of the crop from the pose model's is someone else's hand */
  accept: 0.25,
  /** a wrist the pose model reads less visible than this is not read (it is behind something, or out of the frame) */
  visFrom: 0.4,
  /** seconds: the frame and curls follow a reading; trust rises and falls; a reading is carried this long (ms) */
  tauTurn: 0.06, tauCurl: 0.08, tauTrust: 0.2, forgetMs: 500,
  /** the pose model's hand points: trusted at most this much, from these visibilities */
  poseTrust: 0.5, poseVisFrom: 0.5, poseVisTo: 0.85,
  /** a relaxed hand's curls (no reading: the fingers ease back to it) */
  rest: [0.15, 0.2, 0.2, 0.25, 0.3],
  /** a finger's total bend (degrees, its joints together) that reads as a fist; the thumb's */
  fist: 230, thumbFist: 110,
};

const BACK = new THREE.Vector3(0, 0, -1);
const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const V = (p: P3) => new THREE.Vector3(p.x, p.y, p.z);

/** the square round a hand, in source pixels, from the pose model's points (null: too small or not finite) */
export function handBox(im: LM[], side: Side, W: number, H: number): { x: number; y: number; s: number } | null {
  const C = HAND_TUNE.crop;
  const [wr, el, ix, pk] = side === 'L' ? [L.wrL, L.elL, L.indexL, L.pinkyL] : [L.wrR, L.elR, L.indexR, L.pinkyR];
  const P = (i: number) => ({ x: im[i]!.x * W, y: im[i]!.y * H });
  const d = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);
  const w = P(wr), e = P(el), k = { x: (P(ix).x + P(pk).x) / 2, y: (P(ix).y + P(pk).y) / 2 };
  const shM = { x: (P(L.shL).x + P(L.shR).x) / 2, y: (P(L.shL).y + P(L.shR).y) / 2 };
  const hipM = { x: (P(L.hipL).x + P(L.hipR).x) / 2, y: (P(L.hipL).y + P(L.hipR).y) / 2 };
  const fore = d(w, e), knuck = d(w, k);
  const s = Math.max(C.fore * fore, C.knuck * knuck, C.shoulders * d(P(L.shL), P(L.shR)), C.torso * d(shM, hipM), C.min);
  // the hand's middle: past the wrist toward the knuckles, or along the forearm where those are bunched on the wrist
  const kn = sstep(0.1, 0.25, knuck / Math.max(1e-6, fore));
  let dx = (k.x - w.x) / Math.max(1e-6, knuck) * kn + (w.x - e.x) / Math.max(1e-6, fore) * (1 - kn);
  let dy = (k.y - w.y) / Math.max(1e-6, knuck) * kn + (w.y - e.y) / Math.max(1e-6, fore) * (1 - kn);
  const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
  const cx = w.x + dx * s * C.ahead, cy = w.y + dy * s * C.ahead;
  return s > 24 && Number.isFinite(cx + cy + s) ? { x: cx - s / 2, y: cy - s / 2, s } : null;
}

/** a hand's frame from its points (metres, camera axes): x across the knuckles (little → index), y wrist → middle knuckle */
export function handFrame(w: P3[]): THREE.Quaternion {
  const y = V(w[H.middleMcp]!).sub(V(w[H.wrist]!)).normalize();
  const x = V(w[H.indexMcp]!).sub(V(w[H.pinkyMcp]!));
  x.addScaledVector(y, -x.dot(y));
  if (x.lengthSq() < 1e-10) x.set(1, 0, 0).addScaledVector(y, -y.x);
  x.normalize();
  const z = new THREE.Vector3().crossVectors(x, y);
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

/**
 * Each finger's curl from its points: the bends at its joints together, over a fist's (0 straight, 1 a fist). A finger's
 * bends are taken square to the knuckles' line, from the hand's own direction at the knuckle: a spread finger is not a
 * bent one. The thumb's from its second joint (its base swings more than it bends), as they come.
 */
export function handCurls(w: P3[]): number[] {
  const T = HAND_TUNE;
  const q = handFrame(w), X = new THREE.Vector3(1, 0, 0).applyQuaternion(q), Y = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
  const flat = (v: THREE.Vector3) => v.addScaledVector(X, -v.dot(X));
  return FINGERS.map((f, i) => {
    let bend = 0;
    for (let j = i === 0 ? 2 : 1; j < f.length - 1; j++) {
      let a = V(w[f[j]!]!).sub(V(w[f[j - 1]!]!)), b = V(w[f[j + 1]!]!).sub(V(w[f[j]!]!));
      if (i > 0) { a = j === 1 ? Y.clone() : flat(a); b = flat(b); }
      if (a.lengthSq() > 1e-12 && b.lengthSq() > 1e-12) bend += a.angleTo(b);
    }
    return Math.min(1, Math.max(0, THREE.MathUtils.radToDeg(bend) / (i === 0 ? T.thumbFist : T.fist)));
  });
}

/** a frame from the pose model's own hand points (its index, little-finger and thumb tips by the wrist): rough */
export function poseHandFrame(world: LM[], side: Side): { q: THREE.Quaternion; v: number } {
  const [wr, ix, pk] = side === 'L' ? [L.wrL, L.indexL, L.pinkyL] : [L.wrR, L.indexR, L.pinkyR];
  const W = world;
  const mid = V(W[ix]!).add(V(W[pk]!)).multiplyScalar(0.5);
  const y = mid.sub(V(W[wr]!));
  const x = V(W[ix]!).sub(V(W[pk]!));
  const ok = y.lengthSq() > 1e-8 && x.lengthSq() > 1e-8;
  if (!ok) return { q: new THREE.Quaternion(), v: 0 };
  y.normalize();
  x.addScaledVector(y, -x.dot(y));
  if (x.lengthSq() < 1e-10) return { q: new THREE.Quaternion(), v: 0 };
  x.normalize();
  const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, new THREE.Vector3().crossVectors(x, y)));
  return { q, v: Math.min(W[wr]!.v, W[ix]!.v, W[pk]!.v) };
}

export class HandTracker {
  private lm: HL | null = null;
  inferMs = 0;
  /** crops read last frame (debug) */
  boxes: { id: number; side: Side; x: number; y: number; s: number; found: boolean }[] = [];
  private readonly canvas = document.createElement('canvas');
  private readonly ctx: CanvasRenderingContext2D;
  private readonly tried = new Map<string, number>();
  private n = 0;

  constructor() {
    this.canvas.width = this.canvas.height = HAND_TUNE.crop.px;
    this.ctx = this.canvas.getContext('2d')!;
  }

  async load(): Promise<void> {
    const base = import.meta.env.BASE_URL;
    const vision = await import('@mediapipe/tasks-vision');
    const fileset = await vision.FilesetResolver.forVisionTasks(`${base}mediapipe`);
    const make = (delegate: 'GPU' | 'CPU') => vision.HandLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: `${base}models/hand_landmarker.task`, delegate },
      runningMode: 'IMAGE', numHands: 1, minHandDetectionConfidence: 0.4, minHandPresenceConfidence: 0.4,
    });
    try { this.lm = await make('GPU'); } catch { this.lm = await make('CPU'); }
  }

  /**
   * Hands from crops round the wrists of `tracks` that `want` (the costumes with hands): up to HAND_TUNE.perFrame a
   * frame, the longest waiting first. `K` is in the source's pixels. Keyed by track id, then side.
   */
  detect(src: HTMLVideoElement | HTMLCanvasElement, tracks: Track[], K: Intrinsics, want: (t: Track) => boolean = () => true): Map<number, Partial<Record<Side, HandDet>>> {
    const out = new Map<number, Partial<Record<Side, HandDet>>>();
    this.boxes = [];
    if (!this.lm) return out;
    this.n++;
    const T = HAND_TUNE, C = T.crop.px, g = this.ctx;
    const cands: { t: Track; side: Side; key: string }[] = [];
    for (const t of tracks) {
      if (t.lost || t.presence < 0.2 || !want(t)) continue;
      for (const side of ['L', 'R'] as const) {
        const wr = t.image[side === 'L' ? L.wrL : L.wrR]!;
        if (wr.v < T.visFrom) continue;
        cands.push({ t, side, key: `${t.id}${side}` });
      }
    }
    cands.sort((a, b) => (this.tried.get(a.key) ?? -1) - (this.tried.get(b.key) ?? -1));
    const t0 = performance.now();
    let n = 0;
    for (const c of cands) {
      if (n >= T.perFrame || (n && performance.now() - t0 > T.budgetMs)) break;
      this.tried.set(c.key, this.n);
      const box = handBox(c.t.image, c.side, K.w, K.h);
      if (!box) continue;
      n++;
      g.fillStyle = '#000';
      g.fillRect(0, 0, C, C);
      g.drawImage(src, box.x, box.y, box.s, box.s, 0, 0, C, C);
      const r = this.lm.detect(this.canvas);
      const pts = r.landmarks[0], wpts = r.worldLandmarks[0];
      const wr = c.t.image[c.side === 'L' ? L.wrL : L.wrR]!;
      const found = !!pts && !!wpts && Math.hypot(box.x + pts[0]!.x * box.s - wr.x * K.w, box.y + pts[0]!.y * box.s - wr.y * K.h) < T.accept * box.s;
      this.boxes.push({ id: c.t.id, side: c.side, ...box, found });
      if (!found) continue;
      // the crop's view turned to ours: a hand high in the frame, seen square in its crop, is tilted to our camera
      const ray = new THREE.Vector3((box.x + box.s / 2 - K.cx) / K.f, -(box.y + box.s / 2 - K.cy) / K.f, -1).normalize();
      const turn = new THREE.Quaternion().setFromUnitVectors(BACK, ray);
      const world = wpts!.map((p) => { const v = new THREE.Vector3(p.x, -p.y, -p.z).applyQuaternion(turn); return { x: v.x, y: v.y, z: v.z }; });
      const det: HandDet = {
        side: c.side, world, score: r.handedness?.[0]?.[0]?.score ?? 1,
        pts: pts!.map((p) => ({ x: (box.x + p.x * box.s) / K.w, y: (box.y + p.y * box.s) / K.h, z: (p.z * box.s) / K.w })),
      };
      const o = out.get(c.t.id) ?? {};
      o[c.side] = det;
      out.set(c.t.id, o);
    }
    for (const k of this.tried.keys()) { const id = Number(k.slice(0, -1)); if (!tracks.some((t) => t.id === id)) this.tried.delete(k); }
    this.inferMs = performance.now() - t0;
    return out;
  }

  close(): void { this.lm?.close(); this.lm = null; }
}

const ema = (a: number, b: number, dt: number, tau: number) => a + (b - a) * (1 - Math.exp(-dt / tau));

/**
 * Hands onto people (`hands` by track id, this frame's readings), smoothed. Every live person ends with both hands: read,
 * carried with the forearm from a reading a moment ago, or from the pose model's hand points; `w` says how much of it
 * to show.
 */
export function attachHands(tracks: Track[], hands: Map<number, Partial<Record<Side, HandDet>>> | null, now: number, dt: number): void {
  const T = HAND_TUNE;
  for (const t of tracks) {
    if (t.lost) continue;
    const hs = (t.hands ??= { L: newHand(), R: newHand() });
    for (const side of ['L', 'R'] as const) {
      const h = hs[side], det = hands?.get(t.id)?.[side] ?? null;
      const [el, wr] = side === 'L' ? [L.elL, L.wrL] : [L.elR, L.wrR];
      const fore = V(t.world[wr]!).sub(V(t.world[el]!));
      if (fore.lengthSq() > 1e-10) fore.normalize(); else fore.set(0, -1, 0);
      // the reading, or the last one carried with the forearm's turn since, or none
      let read: THREE.Quaternion | null = null, curl: number[] | null = null;
      if (det) {
        read = handFrame(det.world);
        curl = handCurls(det.world);
        h.last = { q: read.clone(), fore: fore.clone() };
        h.seen = now;
        const pts = det.pts.map((p) => ({ x: p.x, y: p.y }));
        if (!h.pts) h.pts = pts;
        else h.pts.forEach((p, i) => { p.x = ema(p.x, pts[i]!.x, dt, T.tauTurn); p.y = ema(p.y, pts[i]!.y, dt, T.tauTurn); });
      } else if (h.last && now - h.seen < T.forgetMs) {
        read = new THREE.Quaternion().setFromUnitVectors(h.last.fore, fore).multiply(h.last.q);
      } else h.pts = null;
      // trust in the hand model: rises while it reads (or a reading is fresh), falls after
      h.trust = ema(h.trust, read ? 1 : 0, dt, T.tauTrust);
      // what the pose model says (rough), under it: which way the hand points, its twist kept as the hand last had it
      // (the pose model's index and little-finger tips say little of the twist: on a sign clip their frame was 90°
      // off the hand model's between readings)
      const pf = poseHandFrame(t.world, side);
      const pv = T.poseTrust * sstep(T.poseVisFrom, T.poseVisTo, Math.min(pf.v, t.image[wr]!.v));
      if (pv > 0 && h.w > 1e-3) pf.q.copy(withAlong(h.q, new THREE.Vector3(0, 1, 0).applyQuaternion(pf.q)));
      // the target frame: the reading where trusted, the pose's frame under it; the smoothed frame follows it
      const target = read ? (pv > 0 ? pf.q.clone().slerp(read, Math.min(1, h.trust / Math.max(1e-6, h.trust + pv * (1 - h.trust)))) : read)
        : pv > 0 ? pf.q : null;
      if (target) {
        if (h.w <= 1e-3) h.q.copy(target);
        else h.q.slerp(target, 1 - Math.exp(-dt / T.tauTurn));
      }
      h.w = ema(h.w, target ? Math.max(h.trust, pv) : 0, dt, T.tauTrust);
      const want = curl ?? (read ? null : T.rest);
      if (want) h.curl.forEach((c, i) => { h.curl[i] = ema(c, want[i]!, dt, T.tauCurl); });
    }
  }
}

/** the picture's points with each wrist moved to the hand model's, as far as it is trusted (for the reach: the costume's
 *  forearm then lands on the wrist the hand model found, finer than the pose model's) */
export function handWrists(image: LM[], hands: { L: HandState; R: HandState }): LM[] {
  let out: LM[] | null = null;
  for (const side of ['L', 'R'] as const) {
    const h = hands[side], p = h.pts?.[H.wrist];
    if (!p || h.trust < 1e-3) continue;
    out ??= image.slice();
    const i = side === 'L' ? L.wrL : L.wrR, o = image[i]!, k = h.trust;
    out[i] = { ...o, x: o.x + (p.x - o.x) * k, y: o.y + (p.y - o.y) * k, v: Math.max(o.v, 0.9 * k) };
  }
  return out ?? image;
}

/** the frame `q` swung (the shortest way) so its along is `y` */
function withAlong(q: THREE.Quaternion, y: THREE.Vector3): THREE.Quaternion {
  const from = new THREE.Vector3(0, 1, 0).applyQuaternion(q);
  return new THREE.Quaternion().setFromUnitVectors(from, y.clone().normalize()).multiply(q);
}

function newHand(): HandState {
  return { q: new THREE.Quaternion(), curl: [...HAND_TUNE.rest], trust: 0, w: 0, pts: null, seen: -Infinity, last: null };
}
