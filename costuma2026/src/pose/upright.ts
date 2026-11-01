// People stand up. The pose model is good at where joints are in the picture and weak at their depth, and worst at the
// hips when they are out of frame: in a torso shot it guesses them, and the guess wanders (measured on torso clips of
// a portrait with hand-held drift: the solved hips jumped 44–87 px frame to frame, and the costume hangs from them) and
// can tip the whole body toward or away from the camera — a "horizontal human" (founder, 2026-11-01: "much more likely
// that somebody's actually standing and doing sort of dance moves than they are like supermanning across the space";
// "a big source of horizontal humans is torso shots").
//
// So each pose is checked against up (the floor's normal: the phone's gravity, or the people's own long-run upright):
//  - hips unseen (`anchorTorsoShot`, on the smoothed pose — anchored frame by frame from the raw shoulders it added 5 %
//    jitter to the head on screen): the torso is taken from what is seen — square to the shoulder line, as upright as
//    the shoulders allow, keeping a little of the model's own lean only while it is a small one — and the hips are put
//    one of the person's measured torso lengths below the shoulders, the legs carried with them. The costume then hangs
//    from the shoulders the camera sees, and a guessed body cannot fall over. Blended in as the hips leave the picture.
//  - hips seen (`upright`, on each raw detection, before smoothing, so a flip never reaches the smoothing): the picture
//    is believed. A torso far from upright whose picture says upright (shoulders above the hips
//    on screen, about as far apart as an upright torso would be) is a depth guess gone wrong and is stood up; one the
//    picture agrees with (a bow, a floor move) is accepted after it has lasted `holdS` — a dive to the floor shows a
//    moment late, a one-off flip never.
import * as THREE from 'three';
import type { LM } from './landmarks';
import { L } from './landmarks';

export const UPRIGHT_TUNE = {
  /** hips at least this visible (MediaPipe's visibility; out of frame reads ~0–0.3) count as seen */
  hipSeen: 0.5,
  /** in a torso shot, the model's forward/back lean is kept at this share while within `keepWithin` of upright */
  keep: 0.5, keepWithin: THREE.MathUtils.degToRad(30),
  /** hips seen: a torso further than this from up is "flat" */
  flat: THREE.MathUtils.degToRad(50),
  /** a flat torso the picture agrees with is accepted after this many seconds of it */
  holdS: 0.35,
  /** the picture says upright: the torso on screen within this of the screen's up, at least this share of an upright
   *  torso's length on screen */
  screenUp: THREE.MathUtils.degToRad(35), screenLen: 0.7,
};

/** what the check did, for the debug readout and the tests */
export type UprightVerdict = 'kept' | 'torso shot' | 'stood up' | 'holding' | 'accepted';

const V = (p: LM) => new THREE.Vector3(p.x, p.y, p.z);
const mid = (a: LM, b: LM) => V(a).add(V(b)).multiplyScalar(0.5);
const LOWER = [L.hipL, L.hipR, L.knL, L.knR, L.anL, L.anR, L.heelL, L.heelR, L.toeL, L.toeR];

/**
 * Re-place the lower body so the torso runs along `dir` (unit, world) at `len` below the shoulders, legs carried
 * rigidly, then re-centre on the new hips (world landmarks are about the hips: the rig and the stage assume it).
 */
function reanchor(w: LM[], dir: THREE.Vector3, len: number): LM[] {
  const sh = mid(w[L.shL]!, w[L.shR]!), hip = mid(w[L.hipL]!, w[L.hipR]!);
  const t0 = sh.clone().sub(hip);
  const R = new THREE.Quaternion().setFromUnitVectors(t0.clone().normalize(), dir);
  const newHip = sh.clone().addScaledVector(dir, -len);
  // where the old hips land after the turn about the shoulders; the rest of the lower body moves with them
  const turnedHip = hip.clone().sub(sh).applyQuaternion(R).add(sh);
  const shift = newHip.clone().sub(turnedHip);
  const out = w.map((p) => ({ ...p }));
  for (const i of LOWER) {
    const p = V(w[i]!).sub(sh).applyQuaternion(R).add(sh).add(shift);
    out[i] = { x: p.x, y: p.y, z: p.z, v: w[i]!.v };
  }
  for (const p of out) { p.x -= newHip.x; p.y -= newHip.y; p.z -= newHip.z; }
  return out;
}

/** the direction square to the shoulder line nearest `up`, turned toward `model` about the shoulder line by `keep` of
 *  their angle while that is within `within` (else none of it) */
function uprightDir(w: LM[], up: THREE.Vector3, model: THREE.Vector3, keep: number, within: number): THREE.Vector3 | null {
  const s = V(w[L.shL]!).sub(V(w[L.shR]!));
  if (s.lengthSq() < 1e-8) return null;
  s.normalize();
  const u = up.clone().addScaledVector(s, -up.dot(s));
  if (u.lengthSq() < 0.05) return null; // the shoulders themselves stand on end: no "upright" square to them
  u.normalize();
  // the model's lean about the shoulder line, from u
  const m = model.clone().addScaledVector(s, -model.dot(s));
  if (m.lengthSq() < 1e-8) return u;
  m.normalize();
  const ang = Math.atan2(new THREE.Vector3().crossVectors(u, m).dot(s), u.dot(m));
  const k = Math.abs(ang) <= within ? keep : 0;
  return u.applyAxisAngle(s, ang * k);
}

export interface UprightState { flatSince: number | null }

/**
 * Check one detection's 3D pose against `up` (camera axes). `len`: the person's torso length (metres) if known;
 * `image`: its picture (0..1, y down) and `K`'s focal length and the depth of the hips (`depth`, metres) to say what an
 * upright torso would look like on screen. Returns the pose to use (a new array when changed) and what was done.
 */
export function upright(world: LM[], image: LM[], up: THREE.Vector3, opts: { len?: number; f?: number; aspect?: number; depth?: number; now: number; state: UprightState }): { world: LM[]; verdict: UprightVerdict } {
  const T = UPRIGHT_TUNE;
  const sh = mid(world[L.shL]!, world[L.shR]!), hip = mid(world[L.hipL]!, world[L.hipR]!);
  const t0 = sh.clone().sub(hip);
  const len = opts.len && opts.len > 0.2 ? opts.len : t0.length();
  if (t0.lengthSq() < 1e-8) return { world, verdict: 'kept' };
  const model = t0.clone().normalize();
  const hipsSeen = Math.min(image[L.hipL]!.v, image[L.hipR]!.v) >= T.hipSeen;
  // hips unseen: left to anchorTorsoShot, after smoothing
  if (!hipsSeen) { opts.state.flatSince = null; return { world, verdict: 'torso shot' }; }
  const tilt = model.angleTo(up);
  if (tilt <= T.flat) { opts.state.flatSince = null; return { world, verdict: 'kept' }; }
  // flat in 3D: does the picture agree? On screen (y down), the torso from the hips to the shoulders
  const a = opts.aspect ?? 1;
  const ix = ((image[L.shL]!.x + image[L.shR]!.x) / 2 - (image[L.hipL]!.x + image[L.hipR]!.x) / 2) * a;
  const iy = (image[L.shL]!.y + image[L.shR]!.y) / 2 - (image[L.hipL]!.y + image[L.hipR]!.y) / 2;
  // the screen's up is up as the camera sees it: (up.x, -up.y) in image axes
  const su = new THREE.Vector2(up.x, -up.y);
  const onScreen = new THREE.Vector2(ix, iy);
  const screenAngle = su.lengthSq() > 1e-6 && onScreen.lengthSq() > 1e-10 ? Math.acos(Math.max(-1, Math.min(1, su.normalize().dot(onScreen.clone().normalize())))) : Math.PI;
  // an upright torso's length on screen (image heights): len · f / depth over the image height (f in pixels of height)
  const expect = opts.f && opts.depth ? (len * opts.f) / opts.depth : 0;
  const pictureUpright = screenAngle < T.screenUp && (!expect || onScreen.length() >= T.screenLen * expect);
  if (pictureUpright) {
    opts.state.flatSince = null;
    const dir = uprightDir(world, up, model, T.keep, T.keepWithin);
    return dir ? { world: reanchor(world, dir, len), verdict: 'stood up' } : { world, verdict: 'kept' };
  }
  if (opts.state.flatSince === null) opts.state.flatSince = opts.now;
  if (opts.now - opts.state.flatSince < T.holdS * 1000) {
    // not yet: the torso held at the edge of flat, toward where the model says
    const axis = new THREE.Vector3().crossVectors(up, model);
    if (axis.lengthSq() < 1e-8) return { world, verdict: 'holding' };
    const dir = up.clone().applyAxisAngle(axis.normalize(), T.flat);
    return { world: reanchor(world, dir, len), verdict: 'holding' };
  }
  return { world, verdict: 'accepted' };
}

const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/**
 * A torso shot's pose hung from its shoulders (see the header): `world` the smoothed pose, `hipVis` how visible its hips
 * are (smoothed), `len` the person's torso length. Fully anchored with the hips unseen, the model's own pose with them
 * well in view, blended between (point by point: both are about their hips) so nothing jumps as someone steps back.
 */
export function anchorTorsoShot(world: LM[], up: THREE.Vector3, len: number, hipVis: number): LM[] {
  const w = smooth(0.3, 0.7, hipVis);
  if (w >= 1) return world.map((p) => ({ ...p }));
  const sh = mid(world[L.shL]!, world[L.shR]!), hip = mid(world[L.hipL]!, world[L.hipR]!);
  const t0 = sh.sub(hip);
  if (t0.lengthSq() < 1e-8) return world.map((p) => ({ ...p }));
  const dir = uprightDir(world, up, t0.normalize(), UPRIGHT_TUNE.keep, UPRIGHT_TUNE.keepWithin);
  if (!dir) return world.map((p) => ({ ...p }));
  const a = reanchor(world, dir, len > 0.2 ? len : t0.length());
  if (w <= 0) return a;
  return a.map((p, i) => { const q = world[i]!; return { x: p.x + (q.x - p.x) * w, y: p.y + (q.y - p.y) * w, z: p.z + (q.z - p.z) * w, v: q.v }; });
}
