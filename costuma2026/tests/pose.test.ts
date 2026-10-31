import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { guessIntrinsics, solveTranslation } from '../src/pose/solve';
import { synthPerson } from '../src/pose/synth';
import { Rig, poseFromLandmarks, LIMBS, type Limb } from '../src/pose/rig';
import { skeleton } from '../src/characters/build';
import { ROSTER } from '../src/characters/roster';
import { ROSTER_IDS } from '../src/characters/ids';
import { Tracker } from '../src/pose/tracker';
import { L } from '../src/pose/landmarks';

const K = guessIntrinsics(720, 1280);

describe('solveTranslation', () => {
  it('puts the hips back where they were', () => {
    for (const T of [{ x: 0, y: 0, z: -3 }, { x: 0.8, y: -0.4, z: -2.2 }, { x: -1.1, y: 0.3, z: -5 }]) {
      const d = synthPerson({ T, yaw: 0.4, head: [0.3, 0] }, K);
      const s = solveTranslation(d.world, d.image, K)!;
      expect(s.x).toBeCloseTo(T.x, 4); expect(s.y).toBeCloseTo(T.y, 4); expect(s.z).toBeCloseTo(T.z, 4);
    }
  });
  it('refuses with too few visible points', () => {
    const d = synthPerson({ T: { x: 0, y: 0, z: -3 }, legsVis: 0 }, K);
    for (const p of d.world) p.v = 0.1;
    expect(solveTranslation(d.world, d.image, K)).toBeNull();
  });
});

describe('retargeting, on every character', () => {
  const poses: Record<string, Partial<Record<Limb, [number, number, number]>>> = {
    cheer: { armL: [0.3, 1, 0], forearmL: [0.1, 1, 0], armR: [-0.3, 1, 0], forearmR: [-0.1, 1, 0] },
    forward: { armL: [0.1, 0, 1], forearmL: [0, 0.4, 1], armR: [-0.2, -0.2, 1], forearmR: [-0.3, 0.8, 0.4] },
    squat: { thighL: [0.3, -0.4, 1], shinL: [0, -1, -0.2], thighR: [-0.3, -0.4, 1], shinR: [0, -1, -0.2] },
    across: { armL: [-0.6, -0.3, 0.7], forearmL: [-1, 0.2, 0.1] },
  };
  for (const def of ROSTER) {
    it(`${def.id}: bones point where the person's segments do`, () => {
      const { bones } = skeleton(def.segs);
      const rig = new Rig(def.segs, bones);
      for (const [name, dir] of Object.entries(poses)) for (const yaw of [0, 0.7, -2.5]) {
        const d = synthPerson({ T: { x: 0, y: 0, z: -3 }, yaw, dir }, K);
        const p = poseFromLandmarks(d.world);
        rig.apply(p);
        for (const limb of LIMBS) {
          if (limb.startsWith('foot')) continue;
          const want = p.dir[limb], got = rig.dirOf(limb);
          const ang = THREE.MathUtils.radToDeg(want.angleTo(got));
          expect(ang, `${def.id} ${name} yaw ${yaw} ${limb}`).toBeLessThan(1);
        }
      }
    });
  }
  it('a missing limb hangs at rest instead', () => {
    const def = ROSTER[0]!;
    const { bones } = skeleton(def.segs);
    const rig = new Rig(def.segs, bones);
    const d = synthPerson({ T: { x: 0, y: 0, z: -3 }, dir: { thighL: [0.5, -0.2, 1] }, legsVis: 0 }, K);
    rig.apply(poseFromLandmarks(d.world));
    expect(bones.get('thighL')!.quaternion.angleTo(new THREE.Quaternion())).toBeLessThan(1e-6);
  });
});

describe('neck fit', () => {
  it('puts each character\'s head centre where the person\'s ears are, above the shoulders', () => {
    for (const def of ROSTER) {
      const { bones, root } = skeleton(def.segs);
      const rig = new Rig(def.segs, bones);
      const target = 1.4;
      rig.setNeck(rig.neckFit(target));
      root.updateMatrixWorld(true);
      const hd = def.segs.find((s) => s.name === 'head')!;
      // the head's centre in its own bone frame is half its segment along from its joint
      const c = new THREE.Vector3((hd.b[0] - hd.a[0]) / 2, (hd.b[1] - hd.a[1]) / 2, (hd.b[2] - hd.a[2]) / 2).applyMatrix4(bones.get('head')!.matrixWorld);
      const shY = (def.segs.find((s) => s.name === 'armL')!.a[1] + def.segs.find((s) => s.name === 'armR')!.a[1]) / 2;
      expect(c.y - shY, def.id).toBeCloseTo(target, 5);
    }
  });
});

describe('tracker', () => {
  it('keeps identities when the detections come in a different order', () => {
    const tr = new Tracker();
    const a = (x: number) => synthPerson({ T: { x, y: 0, z: -3 }, scale: 1 }, K);
    let t = 0;
    tr.update([a(-0.8), a(0.8)], (t += 33), K);
    const idLeft = tr.tracks.find((k) => k.T.x < 0)!.id, idRight = tr.tracks.find((k) => k.T.x > 0)!.id;
    for (let i = 0; i < 20; i++) {
      const dets = i % 2 ? [a(-0.8 + i * 0.01), a(0.8 - i * 0.01)] : [a(0.8 - i * 0.01), a(-0.8 + i * 0.01)];
      tr.update(dets, (t += 33), K);
    }
    expect(tr.tracks.length).toBe(2);
    expect(tr.tracks.find((k) => k.T.x < 0)!.id).toBe(idLeft);
    expect(tr.tracks.find((k) => k.T.x > 0)!.id).toBe(idRight);
    expect(tr.tracks.every((k) => k.presence === 1)).toBe(true);
  });
  it('fades out a person who leaves, and forgets them', () => {
    const tr = new Tracker();
    const p = synthPerson({ T: { x: 0, y: 0, z: -3 } }, K);
    let t = 0;
    for (let i = 0; i < 15; i++) tr.update([p], (t += 33), K);
    expect(tr.tracks[0]!.presence).toBe(1);
    tr.update([], (t += 100), K);
    expect(tr.tracks[0]!.lost).toBe(true);
    expect(tr.tracks[0]!.presence).toBeGreaterThan(0);
    for (let i = 0; i < 40; i++) tr.update([], (t += 33), K);
    expect(tr.tracks.length).toBe(0);
  });
  it('smooths depth more than position', () => {
    const tr = new Tracker();
    let t = 0;
    tr.update([synthPerson({ T: { x: 0, y: 0, z: -3 } }, K)], (t += 33), K);
    tr.update([synthPerson({ T: { x: 0.1, y: 0, z: -3.5 } }, K)], (t += 33), K);
    const k = tr.tracks[0]!;
    const fx = k.T.x / 0.1, fz = (-3 - k.T.z) / 0.5;
    expect(fz).toBeGreaterThan(0);
    expect(fx).toBeGreaterThan(fz * 1.5);
    expect(k.image[L.nose]!.x).toBeGreaterThan(0);
  });
});

describe('roster', () => {
  it('ids.ts matches roster.ts', () => { expect(ROSTER.map((d) => d.id)).toEqual(ROSTER_IDS); });
});
