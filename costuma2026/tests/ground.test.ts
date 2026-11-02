import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { Ground } from '../src/pose/ground';
import { Tracker } from '../src/pose/tracker';
import { bodyLengths, guessIntrinsics, project } from '../src/pose/solve';
import { BODY_TUNE } from '../src/pose/body';
import { synthPerson } from '../src/pose/synth';
import type { Detection } from '../src/pose/tracker';

const K = guessIntrinsics(720, 1280);

/** the same scene seen by a camera turned by q⁻¹: every point (and the hips) turned by q, the image re-projected */
function turned(d: Detection, T: THREE.Vector3, q: THREE.Quaternion): Detection {
  const Tq = T.clone().applyQuaternion(q);
  const world = d.world.map((p) => { const v = new THREE.Vector3(p.x, p.y, p.z).applyQuaternion(q); return { x: v.x, y: v.y, z: v.z, v: p.v }; });
  const image = world.map((p) => { const c = project({ x: p.x + Tq.x, y: p.y + Tq.y, z: p.z + Tq.z }, K); return { x: c.x, y: c.y, z: 0, v: p.v }; });
  return { world, image };
}

function settle(g: Ground, dets: () => Detection[], motion: THREE.Vector3 | null = null) {
  const tr = new Tracker();
  let t = 0;
  for (let i = 0; i < 300; i++) { tr.update(dets(), (t += 33), K); g.update(tr.tracks, motion, 0.033); }
  return tr;
}

describe('ground', () => {
  it('a level camera: up is up, the floor under the heels', () => {
    const g = new Ground(), T = new THREE.Vector3(0.2, -0.2, -3);
    settle(g, () => [synthPerson({ T }, K)]);
    expect(g.n.angleTo(new THREE.Vector3(0, 1, 0))).toBeLessThan(THREE.MathUtils.degToRad(3));
    expect(g.h).toBeCloseTo(-0.2 - 0.89 - 0.02, 1);
    expect(g.fromFeet).toBe(true);
  });
  it('a camera pitched 20° down: the floor tilts with it', () => {
    const g = new Ground(), T = new THREE.Vector3(0, -0.4, -3.2);
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(20));
    settle(g, () => [turned(synthPerson({ T }, K), T, q)]);
    expect(g.n.angleTo(new THREE.Vector3(0, 1, 0).applyQuaternion(q))).toBeLessThan(THREE.MathUtils.degToRad(3));
    // the heels lie on the plane
    const heel = new THREE.Vector3(0, -0.89 - 0.04 + 0.04, -0.05).add(T).applyQuaternion(q);
    expect(Math.abs(g.height(heel))).toBeLessThan(0.06);
  });
  it('feet out of frame: the hips less the legs', () => {
    const g = new Ground(), T = new THREE.Vector3(0, 0, -2.5);
    const d = synthPerson({ T, legsVis: 0 }, K);
    settle(g, () => [d]);
    expect(g.fromFeet).toBe(false);
    // the hips stand their legs' length above the floor, wherever up leans: legs never seen are people's usual shares
    // of the torso (pose/body.ts), plus the ankle
    const { parts } = BODY_TUNE, torso = bodyLengths(d.world).torso, legs = (parts.thigh.share + parts.shin.share) * torso + 0.08;
    expect(Math.abs(g.height(T) - legs)).toBeLessThan(0.03);
  });
  it('takes the phone\'s gravity when it agrees with the people, not when it does not', () => {
    const T = new THREE.Vector3(0, -0.2, -3);
    const near = new THREE.Vector3(0.05, 1, 0).normalize(), off = new THREE.Vector3(1, 0, 0);
    const a = new Ground(); settle(a, () => [synthPerson({ T }, K)], near);
    expect(a.source).toBe('motion');
    const b = new Ground(); settle(b, () => [synthPerson({ T }, K)], off);
    expect(b.source).toBe('body');
    expect(b.n.angleTo(new THREE.Vector3(0, 1, 0))).toBeLessThan(THREE.MathUtils.degToRad(3));
  });
  it('the floor axes: back away from the camera, side to the right, both on the plane', () => {
    const g = new Ground();
    g.n.set(0, 1, 0.3).normalize();
    const { back, side } = g.axes();
    expect(back.dot(g.n)).toBeCloseTo(0, 6); expect(side.dot(g.n)).toBeCloseTo(0, 6);
    expect(back.z).toBeLessThan(0); expect(side.x).toBeGreaterThan(0.99);
  });
});
