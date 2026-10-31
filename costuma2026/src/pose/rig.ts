// Retargeting: a body pose read off the world landmarks, applied to any character on the house rig's bone names
// (pelvis, spine1, spine2, neck, head, jaw, tail1-4, thigh/shin/foot L/R, arm/forearm L/R).
//
// Every rest pose is different (a wolf's digitigrade legs, a mech's wide shoulders, a bird's wings), so nothing assumes
// one: each bone's swing is computed from a *canonical* direction in its parent's frame (an arm out sideways, a thigh
// straight down, a shin along its thigh) to the target, after a fixed rotation from the bone's own rest direction to
// that canonical one. The canonical directions are chosen so the shortest arc never meets its singularity in a pose a
// person can make: an arm's is sideways, 90° from both hanging and raised; a leg's straight down.
import * as THREE from 'three';
import type { LM } from './landmarks';
import { L } from './landmarks';
import type { Seg } from '../characters/sdf';

export type Limb = 'armL' | 'forearmL' | 'armR' | 'forearmR' | 'thighL' | 'shinL' | 'footL' | 'thighR' | 'shinR' | 'footR';
export const LIMBS: Limb[] = ['armL', 'forearmL', 'armR', 'forearmR', 'thighL', 'shinL', 'footL', 'thighR', 'shinR', 'footR'];

/** A pose in the character root's frame (camera axes: x right, y up, z toward the camera). */
export interface BodyPose {
  pelvis: THREE.Quaternion;
  chest: THREE.Quaternion;
  head: THREE.Quaternion;
  headVis: number;
  neck: THREE.Vector3;
  dir: Record<Limb, THREE.Vector3>;
  vis: Record<Limb, number>;
}

/** where a person's nose points relative to their ear line when looking level (radians, nose below the ears) */
export const HEAD_PITCH = 0.32;

const V = (p: LM) => new THREE.Vector3(p.x, p.y, p.z);
const X_AXIS = new THREE.Vector3(1, 0, 0), Y_AXIS = new THREE.Vector3(0, 1, 0);
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/** rotation whose +x is `xAxis` and +y as near `yHint` as orthogonality allows (z = x × y: forward) */
export function basisXY(xAxis: THREE.Vector3, yHint: THREE.Vector3): THREE.Quaternion {
  const y = yHint.clone().normalize();
  const z = new THREE.Vector3().crossVectors(xAxis, y).normalize();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}
/** rotation whose +z is `zAxis`-ish and +x is `xAxis` (y = z × x) */
function basisXZ(xAxis: THREE.Vector3, zHint: THREE.Vector3): THREE.Quaternion {
  const x = xAxis.clone().normalize();
  const y = new THREE.Vector3().crossVectors(zHint, x).normalize();
  const z = new THREE.Vector3().crossVectors(x, y).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}

export function poseFromLandmarks(w: LM[]): BodyPose {
  const p = (i: number) => V(w[i]!);
  const vis = (...ids: number[]) => Math.min(...ids.map((i) => w[i]!.v));
  const hipL = p(L.hipL), hipR = p(L.hipR), shL = p(L.shL), shR = p(L.shR);
  const hipMid = hipL.clone().add(hipR).multiplyScalar(0.5), shMid = shL.clone().add(shR).multiplyScalar(0.5);
  const up = shMid.clone().sub(hipMid);
  const pelvis = basisXY(hipL.clone().sub(hipR), up);
  const chest = basisXY(shL.clone().sub(shR), up);
  // the head: the ear line across it, the nose forward, pitched up by the nose's natural drop
  const earL = p(L.earL), earR = p(L.earR), nose = p(L.nose);
  const earMid = earL.clone().add(earR).multiplyScalar(0.5);
  const head = basisXZ(earL.clone().sub(earR), nose.clone().sub(earMid));
  head.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -HEAD_PITCH));
  const seg = (a: number, b: number) => p(b).sub(p(a)).normalize();
  const dir: Record<Limb, THREE.Vector3> = {
    armL: seg(L.shL, L.elL), forearmL: seg(L.elL, L.wrL), armR: seg(L.shR, L.elR), forearmR: seg(L.elR, L.wrR),
    thighL: seg(L.hipL, L.knL), shinL: seg(L.knL, L.anL), footL: seg(L.heelL, L.toeL),
    thighR: seg(L.hipR, L.knR), shinR: seg(L.knR, L.anR), footR: seg(L.heelR, L.toeR),
  };
  const v: Record<Limb, number> = {
    armL: vis(L.shL, L.elL), forearmL: vis(L.elL, L.wrL), armR: vis(L.shR, L.elR), forearmR: vis(L.elR, L.wrR),
    thighL: vis(L.hipL, L.knL), shinL: vis(L.knL, L.anL), footL: vis(L.heelL, L.toeL),
    thighR: vis(L.hipR, L.knR), shinR: vis(L.knR, L.anR), footR: vis(L.heelR, L.toeR),
  };
  return { pelvis, chest, head, headVis: vis(L.earL, L.earR, L.nose), neck: earMid.sub(shMid).normalize(), dir, vis: v };
}

/** canonical direction of each swung bone, in its parent's frame (see the header) */
const CANON: Record<string, THREE.Vector3> = {
  armL: new THREE.Vector3(1, 0, 0), armR: new THREE.Vector3(-1, 0, 0),
  thighL: new THREE.Vector3(0, -1, 0), thighR: new THREE.Vector3(0, -1, 0),
  neck: new THREE.Vector3(0, 1, 0),
};
const CHILD_OF: Record<string, string> = { forearmL: 'armL', forearmR: 'armR', shinL: 'thighL', shinR: 'thighR', footL: 'shinL', footR: 'shinR' };

export class Rig {
  readonly bones: Map<string, THREE.Bone>;
  readonly rest = new Map<string, { dir: THREE.Vector3; offset: THREE.Vector3; pre: THREE.Quaternion; canon: THREE.Vector3 }>();
  /** model-space orientation of each bone after the last apply */
  private readonly qm = new Map<string, THREE.Quaternion>();
  readonly hipRest: THREE.Vector3;
  readonly pelvisA: THREE.Vector3;
  readonly torso: number;
  readonly len = new Map<string, number>();
  private readonly segs: Seg[];

  constructor(segs: Seg[], bones: Map<string, THREE.Bone>) {
    this.segs = segs;
    this.bones = bones;
    const get = (n: string) => segs.find((s) => s.name === n)!;
    for (const s of segs) {
      const d = new THREE.Vector3(s.b[0] - s.a[0], s.b[1] - s.a[1], s.b[2] - s.a[2]);
      this.len.set(s.name, d.length());
      d.lengthSq() > 1e-9 ? d.normalize() : d.set(0, 1, 0);
      const par = s.parent ? get(s.parent) : null;
      const offset = par ? new THREE.Vector3(s.a[0] - par.a[0], s.a[1] - par.a[1], s.a[2] - par.a[2]) : new THREE.Vector3(...s.a);
      // a child limb's canonical direction is its parent bone's rest direction: a straight joint
      let canon = CANON[s.name];
      if (!canon && CHILD_OF[s.name]) {
        const ps = get(CHILD_OF[s.name]!);
        canon = new THREE.Vector3(ps.b[0] - ps.a[0], ps.b[1] - ps.a[1], ps.b[2] - ps.a[2]).normalize();
        // a foot points along the ground, not down the shin
        if (s.name.startsWith('foot')) canon = d.clone();
      }
      canon ??= d.clone();
      this.rest.set(s.name, { dir: d, offset, pre: new THREE.Quaternion().setFromUnitVectors(d, canon), canon });
    }
    this.pelvisA = new THREE.Vector3(...get('pelvis').a);
    const tl = get('thighL').a, tr = get('thighR').a, al = get('armL').a, ar = get('armR').a;
    this.hipRest = new THREE.Vector3((tl[0] + tr[0]) / 2, (tl[1] + tr[1]) / 2, (tl[2] + tr[2]) / 2);
    const sh = new THREE.Vector3((al[0] + ar[0]) / 2, (al[1] + ar[1]) / 2, (al[2] + ar[2]) / 2);
    this.torso = sh.distanceTo(this.hipRest);
  }

  /** stretch a bone's child toward the wearer's proportion: `k` scales the child's rest offset */
  setLength(bone: string, k: number): void {
    const child = this.segs.find((s) => s.parent === bone && !s.name.startsWith('tail') && s.name !== 'jaw');
    if (!child) return;
    const b = this.bones.get(child.name)!, r = this.rest.get(child.name)!;
    b.position.copy(r.offset).multiplyScalar(k);
  }

  /**
   * The neck's squash (or stretch) that puts the head's centre `personNeck` (model units) above the shoulders' midpoint,
   * as MediaPipe measures a person (shoulder landmarks to the ears). Characters carry their heads higher above their
   * shoulder joints than MediaPipe's shoulders sit below a person's ears: unfitted, every head floated ~15 cm over the
   * wearer's (measured on a real photo, 2026-10-31).
   */
  neckFit(personNeck: number): number {
    const g = (n: string) => this.segs.find((s) => s.name === n)!;
    const s2 = g('spine2'), nk = g('neck'), hd = g('head');
    const shY = (g('armL').a[1] + g('armR').a[1]) / 2 - s2.a[1];
    const span = nk.a[1] - s2.a[1] + (hd.a[1] - nk.a[1]);
    const c = (hd.a[1] + hd.b[1]) / 2 - hd.a[1];
    return span > 1e-3 ? (shY + personNeck - c) / span : 1;
  }
  /** move the neck's base and the head along their rest offsets by `k` (1 = as modelled) */
  setNeck(k: number): void {
    for (const n of ['neck', 'head']) {
      const b = this.bones.get(n), r = this.rest.get(n);
      if (b && r) b.position.copy(r.offset).multiplyScalar(k);
    }
  }

  private swing(name: string, parentQm: THREE.Quaternion, target: THREE.Vector3, w: number): THREE.Quaternion {
    const r = this.rest.get(name)!;
    const local = target.clone().applyQuaternion(parentQm.clone().invert()).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(r.canon, local).multiply(r.pre);
    if (w < 1) q.slerp(new THREE.Quaternion(), 1 - Math.max(0, w));
    return q;
  }

  /** seconds: the bones' turns glide this much toward their targets (0: none); set per apply by its dt */
  private glide = 0;
  private readonly primed = new Set<string>();
  private set(name: string, local: THREE.Quaternion, parentQm: THREE.Quaternion | null): THREE.Quaternion {
    const b = this.bones.get(name);
    if (b) {
      // outputs smoothed a little too (~25 ms): what the input filter leaves as a flicker does not reach the costume
      if (this.glide > 0 && this.primed.has(name)) local = b.quaternion.clone().slerp(local, this.glide);
      b.quaternion.copy(local);
      this.primed.add(name);
    }
    const m = parentQm ? parentQm.clone().multiply(local) : local.clone();
    this.qm.set(name, m);
    return m;
  }

  /** pose the bones; `t` seconds drives the idle sway (tail); `dt` > 0 glides the turns (~25 ms) */
  apply(p: BodyPose, t = 0, tailAmp = 0, dt = 0): void {
    this.glide = dt > 0 ? 1 - Math.exp(-dt / 0.025) : 0;
    const pel = this.set('pelvis', p.pelvis, null);
    // the pelvis pivots at its own joint; place it so the hip centre sits at the root's origin
    const hipOff = this.hipRest.clone().sub(this.pelvisA).applyQuaternion(p.pelvis);
    this.bones.get('pelvis')!.position.copy(hipOff.negate());
    const mid = p.pelvis.clone().slerp(p.chest, 0.5);
    const s1 = this.set('spine1', pel.clone().invert().multiply(mid), pel);
    const s2 = this.set('spine2', s1.clone().invert().multiply(p.chest), s1);
    const hv = smooth(0.3, 0.7, p.headVis);
    const nk = this.set('neck', this.swing('neck', s2, p.neck, hv * 0.6), s2);
    const headLocal = nk.clone().invert().multiply(p.head);
    if (hv < 1) headLocal.slerp(new THREE.Quaternion(), 1 - hv);
    this.set('head', headLocal, nk);
    for (const side of ['L', 'R'] as const) {
      const arm = this.set('arm' + side, this.swing('arm' + side, s2, p.dir[`arm${side}`], smooth(0.35, 0.7, p.vis[`arm${side}`])), s2);
      this.set('forearm' + side, this.swing('forearm' + side, arm, p.dir[`forearm${side}`], smooth(0.35, 0.7, p.vis[`forearm${side}`])), arm);
      const th = this.set('thigh' + side, this.swing('thigh' + side, pel, p.dir[`thigh${side}`], smooth(0.4, 0.75, p.vis[`thigh${side}`])), pel);
      const sh = this.set('shin' + side, this.swing('shin' + side, th, p.dir[`shin${side}`], smooth(0.4, 0.75, p.vis[`shin${side}`])), th);
      this.set('foot' + side, this.swing('foot' + side, sh, p.dir[`foot${side}`], smooth(0.5, 0.8, p.vis[`foot${side}`])), sh);
    }
    let prev = pel;
    for (let i = 1; i <= 4; i++) {
      const name = 'tail' + i;
      if (!this.bones.has(name)) break;
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.sin(t * 2.1 - i * 0.7) * tailAmp, Math.sin(t * 1.3 - i * 0.5) * tailAmp * 0.3));
      prev = this.set(name, q, i === 1 ? this.qm.get(this.segs.find((s) => s.name === 'tail1')?.parent ?? 'pelvis') ?? pel : prev);
    }
  }

  /** open the jaw by `angle` radians about its own x (positive: its tip goes down), and swing it sideways by `side`
   *  (-1..1, + toward the character's left: a turn about its up); call after apply() */
  setJaw(angle: number, side = 0): void {
    const j = this.bones.get('jaw');
    if (!j) return;
    j.quaternion.setFromAxisAngle(Y_AXIS, side * 0.16).multiply(new THREE.Quaternion().setFromAxisAngle(X_AXIS, angle));
  }

  /** a bone's model-space direction after the last apply (tests) */
  dirOf(name: string): THREE.Vector3 {
    return this.rest.get(name)!.dir.clone().applyQuaternion(this.qm.get(name)!);
  }
}

/** A pose to show a character off without a camera: rest, arms out, a wave, a squat (lab, tests, thumbnails). */
export function demoPose(kind: string): BodyPose {
  const I = new THREE.Quaternion();
  const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).normalize();
  const one = { armL: 1, forearmL: 1, armR: 1, forearmR: 1, thighL: 1, shinL: 1, footL: 1, thighR: 1, shinR: 1, footR: 1 };
  const base: BodyPose = {
    pelvis: I.clone(), chest: I.clone(), head: I.clone(), headVis: 1, neck: v(0, 1, 0),
    dir: { armL: v(0.25, -1, 0), forearmL: v(0.2, -1, 0.15), armR: v(-0.25, -1, 0), forearmR: v(-0.2, -1, 0.15),
      thighL: v(0.08, -1, 0), shinL: v(0, -1, -0.05), footL: v(0, -0.3, 1), thighR: v(-0.08, -1, 0), shinR: v(0, -1, -0.05), footR: v(0, -0.3, 1) },
    vis: { ...one },
  };
  if (kind === 'tpose') { base.dir.armL = v(1, 0, 0); base.dir.forearmL = v(1, 0, 0); base.dir.armR = v(-1, 0, 0); base.dir.forearmR = v(-1, 0, 0); }
  if (kind === 'wave') {
    base.dir.armR = v(-1, 0.35, 0.1); base.dir.forearmR = v(-0.2, 1, 0.1);
    base.dir.armL = v(0.5, -1, 0.3); base.dir.forearmL = v(-0.4, 0.1, 1);
    base.head = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, -0.3, 0.15));
    base.chest = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.15, 0.05));
  }
  if (kind === 'cheer') { base.dir.armL = v(0.6, 1, 0.1); base.dir.forearmL = v(0.2, 1, 0); base.dir.armR = v(-0.6, 1, 0.1); base.dir.forearmR = v(-0.2, 1, 0); }
  if (kind === 'squat') {
    base.dir.thighL = v(0.35, -0.5, 1); base.dir.shinL = v(0.1, -1, -0.15); base.dir.thighR = v(-0.35, -0.5, 1); base.dir.shinR = v(-0.1, -1, -0.15);
    base.dir.armL = v(0.2, -0.2, 1); base.dir.forearmL = v(0.1, 0, 1); base.dir.armR = v(-0.2, -0.2, 1); base.dir.forearmR = v(-0.1, 0, 1);
  }
  if (kind === 'turn') { base.pelvis = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.6, 0)); base.chest = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.9, 0)); base.head = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 1.1, 0)); }
  return base;
}
