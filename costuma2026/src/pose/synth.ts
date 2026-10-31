// A person made of numbers: MediaPipe-shaped detections (world landmarks in metres about the hips, image landmarks
// projected through the same intrinsics) from a few joint directions. Tests use it to check the solve and the
// retargeter end to end; ?test=1&synth=N drives the app with N of them, so the costumes can be judged with no camera.
import * as THREE from 'three';
import type { LM } from './landmarks';
import { L, N_LANDMARKS } from './landmarks';
import type { Detection } from './tracker';
import { project, type Intrinsics } from './solve';
import type { Limb } from './rig';

export interface SynthPose {
  /** where the hip centre is in camera space (metres; z negative) */
  T: { x: number; y: number; z: number };
  /** the body's turn about the vertical (radians; 0 faces the camera) */
  yaw?: number;
  /** limb directions in the body's frame (x its left, y up, z its forward); missing: hanging, straight legs */
  dir?: Partial<Record<Limb, [number, number, number]>>;
  /** head turn (yaw, pitch) radians */
  head?: [number, number];
  /** metres: the person's size */
  scale?: number;
  /** visibility for the lower body (0 when only the top half is in frame) */
  legsVis?: number;
}

const DEFAULT_DIR: Record<Limb, [number, number, number]> = {
  armL: [0.2, -1, 0], forearmL: [0.15, -1, 0.1], armR: [-0.2, -1, 0], forearmR: [-0.15, -1, 0.1],
  thighL: [0.05, -1, 0], shinL: [0, -1, 0], footL: [0, -0.15, 1], thighR: [-0.05, -1, 0], shinR: [0, -1, 0], footR: [0, -0.15, 1],
};

export function synthPerson(p: SynthPose, K: Intrinsics): Detection {
  const s = p.scale ?? 1;
  const d = (k: Limb) => new THREE.Vector3(...(p.dir?.[k] ?? DEFAULT_DIR[k])).normalize();
  const pts: THREE.Vector3[] = Array.from({ length: N_LANDMARKS }, () => new THREE.Vector3());
  const set = (i: number, v: THREE.Vector3) => pts[i]!.copy(v);
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).multiplyScalar(s);
  set(L.hipL, V(0.1, 0, 0)); set(L.hipR, V(-0.1, 0, 0));
  set(L.shL, V(0.19, 0.52, -0.02)); set(L.shR, V(-0.19, 0.52, -0.02));
  // the head, turned about the neck
  const hq = new THREE.Quaternion().setFromEuler(new THREE.Euler(p.head?.[1] ?? 0, p.head?.[0] ?? 0, 0, 'YXZ'));
  const neck = V(0, 0.6, -0.02);
  const H = (x: number, y: number, z: number) => V(x, y, z).applyQuaternion(hq).add(neck);
  set(L.nose, H(0, 0.1, 0.11)); set(L.eyeL, H(0.032, 0.135, 0.09)); set(L.eyeR, H(-0.032, 0.135, 0.09));
  set(L.eyeInL, H(0.018, 0.135, 0.095)); set(L.eyeInR, H(-0.018, 0.135, 0.095)); set(L.eyeOutL, H(0.05, 0.135, 0.08)); set(L.eyeOutR, H(-0.05, 0.135, 0.08));
  set(L.earL, H(0.075, 0.12, 0.0)); set(L.earR, H(-0.075, 0.12, 0.0)); set(L.mouthL, H(0.024, 0.06, 0.095)); set(L.mouthR, H(-0.024, 0.06, 0.095));
  for (const side of ['L', 'R'] as const) {
    const sh = pts[side === 'L' ? L.shL : L.shR]!, hip = pts[side === 'L' ? L.hipL : L.hipR]!;
    const el = sh.clone().addScaledVector(d(`arm${side}`), 0.29 * s), wr = el.clone().addScaledVector(d(`forearm${side}`), 0.26 * s);
    set(side === 'L' ? L.elL : L.elR, el); set(side === 'L' ? L.wrL : L.wrR, wr);
    const hand = wr.clone().addScaledVector(d(`forearm${side}`), 0.08 * s);
    set(side === 'L' ? L.indexL : L.indexR, hand.clone().add(V(0, 0, 0.02))); set(side === 'L' ? L.pinkyL : L.pinkyR, hand.clone().add(V(0, 0, -0.02)));
    set(side === 'L' ? L.thumbL : L.thumbR, wr.clone().addScaledVector(d(`forearm${side}`), 0.04 * s).add(V(0, 0, 0.04)));
    const kn = hip.clone().addScaledVector(d(`thigh${side}`), 0.43 * s), an = kn.clone().addScaledVector(d(`shin${side}`), 0.42 * s);
    set(side === 'L' ? L.knL : L.knR, kn); set(side === 'L' ? L.anL : L.anR, an);
    const heel = an.clone().add(V(0, -0.04, -0.05));
    set(side === 'L' ? L.heelL : L.heelR, heel); set(side === 'L' ? L.toeL : L.toeR, heel.clone().addScaledVector(d(`foot${side}`), 0.24 * s));
  }
  const yq = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), p.yaw ?? 0);
  const legs = new Set<number>([L.knL, L.knR, L.anL, L.anR, L.heelL, L.heelR, L.toeL, L.toeR]);
  const world: LM[] = [], image: LM[] = [];
  for (let i = 0; i < N_LANDMARKS; i++) {
    const w = pts[i]!.clone().applyQuaternion(yq);
    const v = legs.has(i) ? (p.legsVis ?? 0.98) : 0.98;
    world.push({ x: w.x, y: w.y, z: w.z, v });
    const c = project({ x: w.x + p.T.x, y: w.y + p.T.y, z: w.z + p.T.z }, K);
    image.push({ x: c.x, y: c.y, z: 0, v });
  }
  return { world, image };
}

/** a few people dancing about, for ?synth=N: time-varying poses */
export function synthCrowd(n: number, t: number, K: Intrinsics): Detection[] {
  const out: Detection[] = [];
  for (let i = 0; i < n; i++) {
    const ph = t * 1.3 + i * 2.1;
    const x = (i - (n - 1) / 2) * 0.9 + Math.sin(t * 0.4 + i) * 0.15;
    const wave = Math.sin(ph);
    out.push(synthPerson({
      T: { x, y: -0.1 + 0.03 * Math.sin(ph * 2), z: -3.0 - i * 0.6 },
      yaw: Math.sin(t * 0.5 + i) * 0.5,
      head: [Math.sin(t * 0.7 + i) * 0.4, Math.sin(t * 0.9) * 0.15],
      dir: {
        armR: [-1, 0.3 + 0.5 * wave, 0.1], forearmR: [-0.3, 1, 0.1 + 0.3 * wave],
        armL: [0.5 + 0.4 * Math.cos(ph), -0.8 + 0.6 * Math.cos(ph * 0.5), 0.3], forearmL: [0.2, -0.3, 1],
        thighL: [0.12, -1, 0.25 * Math.max(0, wave)], shinL: [0.05, -1, -0.2 * Math.max(0, wave)],
      },
      scale: 1 - i * 0.08,
    }, K));
  }
  return out;
}
