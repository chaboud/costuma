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
  /** in a torso shot, the model's forward/back lean is kept at this share while within `keepWithin` of upright, fading
   *  to none by twice that (a curve, never a cut: founder, "no booleans in motion") */
  keep: 0.5, keepWithin: THREE.MathUtils.degToRad(30),
  /** a torso this far from up starts to count as flat, and this far fully */
  flatFrom: THREE.MathUtils.degToRad(35), flatTo: THREE.MathUtils.degToRad(60),
  /** seconds: a flat body the picture agrees with is believed this slowly (a dive to the floor shows a moment late, a
   *  one-off flip never) */
  holdS: 0.35,
  /** the picture says upright: the torso on screen near the screen's up (fully within the first angle, not at all past
   *  the second), and as long on screen as an upright one (not at all under the first share, fully over the second) */
  screenUpFrom: THREE.MathUtils.degToRad(25), screenUpTo: THREE.MathUtils.degToRad(50), screenLenFrom: 0.5, screenLenTo: 0.8,
};

/** what the check did, for the debug readout and the tests */
export type UprightVerdict = 'kept' | 'torso shot' | 'stood up' | 'holding' | 'accepted';

const V = (p: LM) => new THREE.Vector3(p.x, p.y, p.z);
const mid = (a: LM, b: LM) => V(a).add(V(b)).multiplyScalar(0.5);
const LOWER = [L.hipL, L.hipR, L.knL, L.knR, L.anL, L.anR, L.heelL, L.heelR, L.toeL, L.toeR];
/** a smooth step from 0 at a to 1 at b (either way round) */
const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
/** the direction `frac` of the way from `a` to `b` (both unit), turned, never cut across */
const turnToward = (a: THREE.Vector3, b: THREE.Vector3, frac: number) => {
  const q = new THREE.Quaternion().setFromUnitVectors(a, b);
  return a.clone().applyQuaternion(new THREE.Quaternion().slerpQuaternions(new THREE.Quaternion(), q, frac));
};

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
  const k = keep * (1 - sstep(within, within * 2, Math.abs(ang)));
  return u.applyAxisAngle(s, ang * k);
}

/** a track's memory for the check: how much a flat body the picture agrees with is believed (0..1), and when last seen */
export interface UprightState { belief: number; at: number }

/**
 * Check one detection's 3D pose against `up` (camera axes). `len`: the person's torso length (metres) if known;
 * `image`: its picture (0..1, y down) and `K`'s focal length and the depth of the hips (`depth`, metres) to say what an
 * upright torso would look like on screen. Returns the pose to use (a new array when changed) and what was done.
 */
export function upright(world: LM[], image: LM[], up: THREE.Vector3, opts: { len?: number; f?: number; aspect?: number; depth?: number; now: number; state: UprightState }): { world: LM[]; verdict: UprightVerdict } {
  const T = UPRIGHT_TUNE, st = opts.state;
  const dt = st.at < 0 ? 1 / 30 : Math.min(0.25, Math.max(0, (opts.now - st.at) / 1000));
  st.at = opts.now;
  const sh = mid(world[L.shL]!, world[L.shR]!), hip = mid(world[L.hipL]!, world[L.hipR]!);
  const t0 = sh.clone().sub(hip);
  if (t0.lengthSq() < 1e-8) return { world, verdict: 'kept' };
  const modelLen = t0.length(), len = opts.len && opts.len > 0.2 ? opts.len : modelLen;
  const model = t0.clone().normalize();
  // how seen the hips are (unseen, the torso shot is hung from its shoulders after smoothing: anchorTorsoShot)
  const seen = sstep(0.3, 0.7, Math.min(image[L.hipL]!.v, image[L.hipR]!.v));
  const flat = sstep(T.flatFrom, T.flatTo, model.angleTo(up));
  // does the picture show it upright? On screen (y down), the torso from the hips to the shoulders, against the
  // screen's up ((up.x, -up.y) in image axes), and its length against an upright torso's there
  const a = opts.aspect ?? 1;
  const onScreen = new THREE.Vector2(((image[L.shL]!.x + image[L.shR]!.x) / 2 - (image[L.hipL]!.x + image[L.hipR]!.x) / 2) * a,
    (image[L.shL]!.y + image[L.shR]!.y) / 2 - (image[L.hipL]!.y + image[L.hipR]!.y) / 2);
  const su = new THREE.Vector2(up.x, -up.y);
  const screenAngle = su.lengthSq() > 1e-6 && onScreen.lengthSq() > 1e-10 ? Math.acos(Math.max(-1, Math.min(1, su.normalize().dot(onScreen.clone().normalize())))) : Math.PI;
  const expect = opts.f && opts.depth ? (len * opts.f) / opts.depth : 0;
  const longEnough = expect ? sstep(T.screenLenFrom, T.screenLenTo, onScreen.length() / expect) : 1;
  const pictureUp = (1 - sstep(T.screenUpFrom, T.screenUpTo, screenAngle)) * longEnough;
  // a flat body the picture agrees with is believed over time; anything else lets the belief go
  const agree = seen * flat * (1 - pictureUp);
  st.belief += (agree - st.belief) * (1 - Math.exp(-dt / T.holdS));
  // how far to stand it up: a flat body the picture contradicts, all the way; one it agrees with, by as much as it is
  // not yet believed; an upright one, not at all — every factor a curve
  const w = seen * flat * (pictureUp + (1 - pictureUp) * (1 - st.belief));
  const verdict: UprightVerdict = w > 0.5 ? (pictureUp > 0.5 ? 'stood up' : 'holding') : seen < 0.5 ? 'torso shot' : flat > 0.5 ? 'accepted' : 'kept';
  if (w <= 0) return { world, verdict };
  const dir = uprightDir(world, up, model, T.keep, T.keepWithin);
  if (!dir) return { world, verdict };
  // the hips are seen: a depth flip tipped the whole body, so the whole body turns back about the hips (turning only
  // the lower body, as a torso shot's hanging does, left the arms tipped: 61° of error on injected flips)
  const q = new THREE.Quaternion().setFromUnitVectors(model, turnToward(model, dir, w));
  return { world: world.map((p) => { const v = V(p).applyQuaternion(q); return { x: v.x, y: v.y, z: v.z, v: p.v }; }), verdict };
}


/**
 * A torso shot's pose hung from its shoulders (see the header): `world` the smoothed pose, `hipVis` how visible its hips
 * are (smoothed), `len` the person's torso length. Fully anchored with the hips unseen, the model's own pose with them
 * well in view, blended between (point by point: both are about their hips) so nothing jumps as someone steps back.
 */
export function anchorTorsoShot(world: LM[], up: THREE.Vector3, len: number, hipVis: number): LM[] {
  const k = 1 - sstep(0.3, 0.7, hipVis);
  const sh = mid(world[L.shL]!, world[L.shR]!), hip = mid(world[L.hipL]!, world[L.hipR]!);
  const t0 = sh.sub(hip), modelLen = t0.length();
  if (k <= 0 || modelLen < 1e-4) return world.map((p) => ({ ...p }));
  const model = t0.normalize();
  const dir = uprightDir(world, up, model, UPRIGHT_TUNE.keep, UPRIGHT_TUNE.keepWithin);
  if (!dir) return world.map((p) => ({ ...p }));
  // turned toward hanging from the shoulders by how unseen the hips are (a turn, never a blend of positions: a blend
  // across a big angle shortens the body midway)
  return reanchor(world, turnToward(model, dir, k), modelLen + ((len > 0.2 ? len : modelLen) - modelLen) * k);
}
