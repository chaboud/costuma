// From MediaPipe's two answers to a placed body: world landmarks give the shape in metres about the hips, image
// landmarks say where it falls in the frame. Solving for the translation that projects the one onto the other puts the
// hips in camera space (a linear least-squares in three unknowns), and from there the character is drawn through a
// camera with the same intrinsics, so it lands on the person whatever the focal length guess: a wrong guess changes
// depth and perspective strength, not alignment.
import type { LM } from './landmarks';
import { L } from './landmarks';

export interface Intrinsics { f: number; cx: number; cy: number; w: number; h: number }

/** a focal length guess for a phone or laptop camera: the long side spans ~2·atan(1/(2·k)) */
export function guessIntrinsics(w: number, h: number, k = 0.85): Intrinsics {
  return { f: k * Math.max(w, h), cx: w / 2, cy: h / 2, w, h };
}

/**
 * Translation T (camera space, three's axes; camera at the origin looking down -z) such that world[i] + T projects to
 * image[i]. Weighted by the landmarks' visibility; null when too few are visible or the answer is behind the camera.
 */
export function solveTranslation(world: LM[], image: LM[], K: Intrinsics, minVis = 0.5): { x: number; y: number; z: number } | null {
  // normal equations of: Tx + un·Tz = -un·Pz - Px ; Ty + vn·Tz = -vn·Pz - Py
  let a11 = 0, a13 = 0, a22 = 0, a23 = 0, a33 = 0, b1 = 0, b2 = 0, b3 = 0, n = 0;
  for (let i = 0; i < world.length && i < image.length; i++) {
    const p = world[i]!, q = image[i]!;
    const w = Math.min(p.v, q.v);
    if (w < minVis) continue;
    const un = (q.x * K.w - K.cx) / K.f, vn = (K.cy - q.y * K.h) / K.f;
    const r1 = -un * p.z - p.x, r2 = -vn * p.z - p.y;
    // row1 = [1, 0, un], row2 = [0, 1, vn]
    a11 += w; a13 += w * un; a33 += w * un * un; b1 += w * r1; b3 += w * un * r1;
    a22 += w; a23 += w * vn; a33 += w * vn * vn; b2 += w * r2; b3 += w * vn * r2;
    n++;
  }
  if (n < 4) return null;
  // solve [[a11,0,a13],[0,a22,a23],[a13,a23,a33]] T = b by eliminating Tx, Ty
  const s33 = a33 - (a13 * a13) / a11 - (a23 * a23) / a22;
  const s3 = b3 - (a13 * b1) / a11 - (a23 * b2) / a22;
  if (Math.abs(s33) < 1e-9) return null;
  const z = s3 / s33;
  const x = (b1 - a13 * z) / a11, y = (b2 - a23 * z) / a22;
  if (!(z < -0.2) || !isFinite(x) || !isFinite(y)) return null;
  return { x, y, z };
}

/** project a camera-space point to normalized image coordinates (0..1, y down) */
export function project(p: { x: number; y: number; z: number }, K: Intrinsics): { x: number; y: number } {
  const d = -p.z;
  return { x: (K.cx + (K.f * p.x) / d) / K.w, y: (K.cy - (K.f * p.y) / d) / K.h };
}

const mid = (a: LM, b: LM): LM => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2, v: Math.min(a.v, b.v) });
export const midpoint = mid;
const dist = (a: LM, b: LM) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

/** the wearer's segment lengths in metres (world landmarks), for fitting a costume's limbs */
export function bodyLengths(w: LM[]): { torso: number; upperArm: number; forearm: number; thigh: number; shin: number; neck: number } {
  const torso = dist(mid(w[L.shL]!, w[L.shR]!), mid(w[L.hipL]!, w[L.hipR]!));
  const upperArm = (dist(w[L.shL]!, w[L.elL]!) + dist(w[L.shR]!, w[L.elR]!)) / 2;
  const forearm = (dist(w[L.elL]!, w[L.wrL]!) + dist(w[L.elR]!, w[L.wrR]!)) / 2;
  const thigh = (dist(w[L.hipL]!, w[L.knL]!) + dist(w[L.hipR]!, w[L.knR]!)) / 2;
  const shin = (dist(w[L.knL]!, w[L.anL]!) + dist(w[L.knR]!, w[L.anR]!)) / 2;
  // MediaPipe's shoulders sit on top of the shoulders, so this is short (~0.15 m): it is what the head is placed by
  const neck = dist(mid(w[L.shL]!, w[L.shR]!), mid(w[L.earL]!, w[L.earR]!));
  return { torso, upperArm, forearm, thigh, shin, neck };
}
