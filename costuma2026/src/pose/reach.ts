// Limbs that land on the person's (founder, 2026-11-01: "once reprojected, things like arm and leg bones should roughly
// align (within skeletal constraints of the character). Classic error minimization targeting problem. Right now the
// costumes are misaligned at close distances to the camera"). The retarget turns each bone toward the person's 3D
// segment, but the costume's bones are its own lengths and start from its own shoulders and hips, and the 3D is the
// model's weakest guess in depth: close to the camera, where perspective is strong, a costume's hand could sit a hand's
// width off the person's.
//
// So after the retarget each limb bone is aimed at the picture: its far end must lie on the camera's ray through the
// person's joint, at the bone's own length from where it starts — the ray met by a sphere. Of the two meetings (the
// depth the picture cannot tell), the one nearer the 3D pose's guess; a ray beyond the bone's reach, the bone points at
// its nearest point. Down the chain (upper arm, then forearm with the moved elbow), each weighed by how visible its
// joints are. Exact, a few dot products a bone; and the place where a character's own joint limits can go.
import * as THREE from 'three';
import type { Rig } from './rig';
import type { Intrinsics } from './solve';
import type { LM } from './landmarks';
import { L } from './landmarks';

export const REACH_TUNE = {
  /** how much of the turn toward the picture to take (1: all of it) */
  strength: 1,
  /** visibility from which a joint counts, and fully */
  visFrom: 0.5, visTo: 0.8,
  /** at most this turn (radians) away from the retarget in a frame: a garbage landmark cannot fling a limb */
  maxTurn: THREE.MathUtils.degToRad(120),
};

/** each limb: its bones from the body outward, the landmark each bone's far end should land on, and where it starts */
const CHAINS: { bones: [string, string]; ends: [number, number]; start: number }[] = [
  { bones: ['armL', 'forearmL'], ends: [L.elL, L.wrL], start: L.shL },
  { bones: ['armR', 'forearmR'], ends: [L.elR, L.wrR], start: L.shR },
  { bones: ['thighL', 'shinL'], ends: [L.knL, L.anL], start: L.hipL },
  { bones: ['thighR', 'shinR'], ends: [L.knR, L.anR], start: L.hipR },
];

const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const _m = new THREE.Matrix4(), _inv = new THREE.Matrix4(), _q = new THREE.Quaternion(), _qp = new THREE.Quaternion();
const _s = new THREE.Vector3(), _p = new THREE.Vector3();

/**
 * Aim `rig`'s limbs at the picture. `root`: the costume's root (its position the person's hips in camera space, its scale
 * the costume's; no rotation); `image`: the person's points (0..1, y down); `K` the camera. Call after the retarget, with
 * the root placed. Returns each bone's remaining miss in pixels (for tests and the debug view).
 */
export function reachLimbs(rig: Rig, root: THREE.Object3D, image: LM[], K: Intrinsics, out?: Record<string, { reach: boolean; turn: number }>): Record<string, number> {
  const T = REACH_TUNE, miss: Record<string, number> = {};
  root.updateMatrixWorld(true);
  _inv.copy(root.matrixWorld).invert();
  const s = root.scale.x, pos = root.position;
  // the camera's centre in the root's frame (the root carries no turn: camera axes, its scale)
  const C = new THREE.Vector3(-pos.x / s, -pos.y / s, -pos.z / s);
  /** a bone's start and its parent's turn, in the root's frame */
  const frame = (b: THREE.Bone) => {
    _m.multiplyMatrices(_inv, b.matrixWorld);
    const o = new THREE.Vector3().setFromMatrixPosition(_m);
    _m.multiplyMatrices(_inv, (b.parent as THREE.Object3D).matrixWorld);
    _m.decompose(_p, _qp, _s);
    return { o, parent: _qp.clone() };
  };
  /** where a bone ends now, in the root's frame: its child's start, or its own segment */
  const tipOf = (name: string, child: string | null) => {
    const b = rig.bones.get(name)!;
    if (child && rig.bones.get(child)) { _m.multiplyMatrices(_inv, rig.bones.get(child)!.matrixWorld); return new THREE.Vector3().setFromMatrixPosition(_m); }
    const r = rig.rest.get(name)!;
    const local = r.dir.clone().multiplyScalar(rig.len.get(name) ?? 1);
    _m.multiplyMatrices(_inv, b.matrixWorld);
    return local.applyMatrix4(_m);
  };
  for (const ch of CHAINS) {
    for (let k = 0; k < 2; k++) {
      const name = ch.bones[k]!, b = rig.bones.get(name);
      if (!b || !b.parent) continue;
      const end = image[ch.ends[k]!]!, from = image[k === 0 ? ch.start : ch.ends[0]!]!;
      const w = T.strength * smooth(T.visFrom, T.visTo, end.v) * smooth(T.visFrom, T.visTo, from.v);
      const { o, parent } = frame(b);
      const tip = tipOf(name, k === 0 ? ch.bones[1]! : null);
      const len = tip.distanceTo(o);
      if (len < 1e-6) continue;
      // the ray through the person's joint, in the root's frame
      const d = new THREE.Vector3((end.x * K.w - K.cx) / K.f, -(end.y * K.h - K.cy) / K.f, -1).normalize();
      const m = C.clone().sub(o), dm = d.dot(m), disc = dm * dm - m.lengthSq() + len * len;
      let target: THREE.Vector3;
      if (disc >= 0) {
        const a = C.clone().addScaledVector(d, -dm + Math.sqrt(disc)), c = C.clone().addScaledVector(d, -dm - Math.sqrt(disc));
        target = a.distanceToSquared(tip) <= c.distanceToSquared(tip) ? a : c;
      } else target = C.clone().addScaledVector(d, -dm);
      // the miss before (for the record): the end's distance from the ray, in pixels at its depth
      const proj = (p: THREE.Vector3) => { const q = p.clone().multiplyScalar(s).add(pos); return [K.cx + (K.f * q.x) / -q.z, K.cy - (K.f * q.y) / -q.z]; };
      if (w > 0) {
        const cur = tip.clone().sub(o).normalize(), want = target.clone().sub(o).normalize();
        _q.setFromUnitVectors(cur, want);
        const ang = 2 * Math.acos(Math.min(1, Math.abs(_q.w)));
        if (out) out[name] = { reach: disc >= 0, turn: THREE.MathUtils.radToDeg(ang) };
        const take = w * Math.min(1, ang > 1e-6 ? T.maxTurn / ang : 1);
        // (slerpQuaternions copies its first argument into the result first: the result must not be the second)
        const turn = new THREE.Quaternion().slerpQuaternions(new THREE.Quaternion(), _q, take);
        // the turn in the root's frame, carried into the bone's own: local' = parent⁻¹ · turn · parent · local
        b.quaternion.premultiply(parent.clone().invert().multiply(turn).multiply(parent));
        b.updateMatrixWorld(true);
      }
      const now = tipOf(name, k === 0 ? ch.bones[1]! : null), [u1, v1] = proj(now);
      miss[name] = Math.hypot(u1! - end.x * K.w, v1! - end.y * K.h);
    }
  }
  return miss;
}
