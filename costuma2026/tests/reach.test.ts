import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { guessIntrinsics, solveTranslation } from '../src/pose/solve';
import { synthPerson } from '../src/pose/synth';
import { Rig, poseFromLandmarks } from '../src/pose/rig';
import { skeleton } from '../src/characters/build';
import { ROSTER } from '../src/characters/roster';
import { reachLimbs, REACH_TUNE } from '../src/pose/reach';

const K = guessIntrinsics(720, 1280);

describe('limbs reach the picture', () => {
  for (const id of ['jimothy', 'skeleton', 'howler', 'violet', 'kaiju']) {
    it(`${id}: close to the camera, elbows, wrists, knees and ankles land on the person's`, () => {
      const def = ROSTER.find((d) => d.id === id)!;
      const { bones, root: rootBone } = skeleton(def.segs);
      const rig = new Rig(def.segs, bones);
      const root = new THREE.Group();
      root.add(rootBone);
      // a person 1.3 m off, arms out and forward (the picture's perspective is strong this close)
      const d = synthPerson({ T: { x: 0.05, y: -0.1, z: -1.3 }, dir: { armL: [0.7, -0.2, 0.6], forearmL: [0.2, 0.6, 0.8], armR: [-0.8, 0.3, 0.2], forearmR: [-0.3, 1, 0.1], thighL: [0.2, -1, 0.3] } }, K);
      const T = solveTranslation(d.world, d.image, K)!;
      rig.apply(poseFromLandmarks(d.world));
      root.position.set(T.x, T.y, T.z);
      root.scale.setScalar(0.1);
      const saved = REACH_TUNE.strength;
      REACH_TUNE.strength = 0;
      const before = reachLimbs(rig, root, d.image, K);
      REACH_TUNE.strength = saved;
      const info: Record<string, { reach: boolean; turn: number }> = {};
      const after = reachLimbs(rig, root, d.image, K, info);
      for (const b of ['armL', 'forearmL', 'armR', 'forearmR', 'thighL', 'shinL']) {
        const msg = `${id} ${b}: ${before[b]!.toFixed(0)} px before, ${after[b]!.toFixed(0)} after, reachable ${info[b]?.reach}, turned ${info[b]?.turn.toFixed(0)}°`;
        // on the ray where the bone reaches it; nearer it where it cannot (the costume's own proportions)
        if (info[b]?.reach) expect(after[b]!, msg).toBeLessThan(3);
        else expect(after[b]!, msg).toBeLessThan(before[b]! + 1);
      }
    });
  }
});
