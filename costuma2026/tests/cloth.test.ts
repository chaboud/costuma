import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { ClothSway, type ClothPart } from '../src/characters/cloth';

/** a costume of one bone and one skinned sheet on it (model units = metres here: the root unscaled) */
function rig(): { root: THREE.Group; cloth: ClothSway } {
  const root = new THREE.Group();
  const bone = new THREE.Bone();
  bone.name = 'pelvis';
  root.add(bone);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 1, 0, 0.3, 0, 0, -0.3, 0, 0], 3));
  geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 4));
  geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], 4));
  const mesh = new THREE.SkinnedMesh(geo, new THREE.MeshStandardMaterial());
  mesh.name = 'skirt';
  root.add(mesh);
  root.updateMatrixWorld(true);
  mesh.bind(new THREE.Skeleton([bone]));
  const part: ClothPart = { meshes: ['skirt'], bone: 'pelvis', cx: 0, cz: 0, top: 1, hem: 0, rx: 0.3, rz: 0.3, hz: 1.3, damping: 0.25, drag: 0.8, max: 0.1, lift: 0.3 };
  return { root, cloth: new ClothSway(root, [part]) };
}
/** the hem's mean swing (bind units) */
const mean = (c: ClothSway) => {
  const sw = (c as unknown as { parts: { sway: THREE.Vector3[] }[] }).parts[0]!.sway;
  return sw.reduce((a, s) => a.add(s), new THREE.Vector3()).divideScalar(sw.length);
};

describe('cloth swings with the body', () => {
  it('trails a move, swings past when it stops, and settles', () => {
    const { root, cloth } = rig();
    const dt = 1 / 30;
    cloth.update(root, dt);
    // walk right at 1 m/s for half a second
    let trail = 0;
    for (let i = 0; i < 15; i++) { root.position.x += dt; cloth.update(root, dt); trail = Math.min(trail, mean(cloth).x); }
    expect(trail).toBeLessThan(-0.01);
    // stop: the hem swings on past the body, then settles
    let past = 0;
    const after: number[] = [];
    for (let i = 0; i < 90; i++) { cloth.update(root, dt); past = Math.max(past, mean(cloth).x); after.push(Math.abs(mean(cloth).x)); }
    expect(past).toBeGreaterThan(0.005);
    expect(after.at(-1)!).toBeLessThan(0.05 * Math.max(...after));
  });

  it('a turn leaves the hem behind it', () => {
    const { root, cloth } = rig();
    const dt = 1 / 30;
    cloth.update(root, dt);
    // turn left (about up) at 3 rad/s: the front particle (k = 0, +z) moves toward +x, so it lags toward -x
    for (let i = 0; i < 6; i++) { root.rotation.y += 3 * dt; cloth.update(root, dt); }
    const front = (cloth as unknown as { parts: { sway: THREE.Vector3[] }[] }).parts[0]!.sway[0]!;
    expect(front.x).toBeLessThan(-0.005);
  });

  it('never past its limit, and a long frame does not blow it up', () => {
    const { root, cloth } = rig();
    cloth.update(root, 1 / 30);
    let worst = 0;
    for (let i = 0; i < 60; i++) {
      root.position.x += i % 2 ? 0.4 : -0.4; // a violent shake
      cloth.update(root, i === 30 ? 0.5 : 1 / 30);
      worst = Math.max(worst, ...cloth.swing());
      expect(cloth.swing().every(Number.isFinite)).toBe(true);
    }
    expect(worst).toBeLessThanOrEqual(0.1 + 1e-9);
    expect(worst).toBeGreaterThan(0.03);
  });
});
