import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { guessIntrinsics } from '../src/pose/solve';
import { synthPerson } from '../src/pose/synth';
import { Tracker, type Detection } from '../src/pose/tracker';
import { inFrame, inFrameShare, SEEN_TUNE } from '../src/pose/seen';
import { Rig, poseFromLandmarks } from '../src/pose/rig';
import { reachLimbs } from '../src/pose/reach';
import { skeleton } from '../src/characters/build';
import { ROSTER } from '../src/characters/roster';
import { L } from '../src/pose/landmarks';

const K = guessIntrinsics(720, 1280);
const deg = THREE.MathUtils.radToDeg;
/** the legs' 3D at `k` of their length (the picture left as it was): under 1, what the model guesses below the frame */
function legsAt(d: Detection, k: number): Detection {
  const w = d.world.map((p) => ({ ...p }));
  for (const [hip, kn, an] of [[L.hipL, L.knL, L.anL], [L.hipR, L.knR, L.anR]] as const) {
    const H = w[hip]!, Kn = w[kn]!, A = w[an]!;
    const k2 = { x: H.x + (Kn.x - H.x) * k, y: H.y + (Kn.y - H.y) * k, z: H.z + (Kn.z - H.z) * k };
    w[an] = { ...A, x: k2.x + (A.x - Kn.x) * k, y: k2.y + (A.y - Kn.y) * k, z: k2.z + (A.z - Kn.z) * k };
    w[kn] = { ...Kn, ...k2 };
  }
  return { ...d, world: w };
}

describe('what the frame holds', () => {
  it('a joint outside the frame is not seen, whatever the model says; across the edge, a curve', () => {
    expect(inFrameShare({ x: 0.5, y: 0.5 })).toBe(1);
    expect(inFrameShare({ x: 0.5, y: 1.3 })).toBe(0);
    expect(inFrameShare({ x: 0.5, y: 1 })).toBeCloseTo(0.5, 5);
    expect(inFrameShare({ x: -0.01, y: 0.5 })).toBeGreaterThan(0.1);
    expect(inFrameShare({ x: -0.01, y: 0.5 })).toBeLessThan(0.5);
    const d = synthPerson({ T: { x: 0, y: -0.7, z: -1 }, legsVis: 0.7 }, K);
    expect(d.image[L.knL]!.y).toBeGreaterThan(1.1);
    const seen = inFrame(d);
    expect(seen.image[L.knL]!.v).toBe(0);
    expect(seen.world[L.knL]!.v).toBe(0);
    expect(seen.image[L.shL]!.v).toBe(d.image[L.shL]!.v);
  });

  it('legs guessed half-length below the frame do not shrink the legs the costume fits to', () => {
    const tr = new Tracker();
    // a torso shot from the start: the model's legs half a leg, its knees read 0.6 visible
    const shot = legsAt(synthPerson({ T: { x: 0, y: -0.7, z: -1 }, legsVis: 0.6 }, K), 0.5);
    let t = 0;
    for (let i = 0; i < 90; i++) tr.update([shot], (t += 33), K);
    const k = tr.tracks[0]!;
    expect(k.len.thigh / k.len.torso).toBeCloseTo(SEEN_TUNE.ratio.thigh, 2);
    expect(k.len.shin / k.len.torso).toBeCloseTo(SEEN_TUNE.ratio.shin, 2);
  });

  it('legs seen are learned, and kept when they leave the frame', () => {
    const tr = new Tracker();
    // a long-legged person (the synthetic one's legs are near the usual share already), whole in the picture
    const at = (f: number) => {
      const T = { x: 0, y: -0.2 - 0.5 * f, z: -3 + 2 * f }, d = synthPerson({ T }, K);
      // below the frame the model guesses the legs half-length
      return legsAt(d, d.image[L.knL]!.y > 1 ? 0.6 : 1.25);
    };
    let t = 0;
    for (let i = 0; i < 120; i++) tr.update([at(0)], (t += 33), K);
    const k = tr.tracks[0]!, learned = k.len.thigh / k.len.torso;
    expect(learned).toBeGreaterThan(SEEN_TUNE.ratio.thigh * 1.15);
    // the camera comes close over two seconds: the legs leave the frame (the same track throughout)
    for (let i = 0; i <= 60; i++) tr.update([at(i / 60)], (t += 33), K);
    expect(at(1).image[L.hipL]!.y).toBeGreaterThan(1);
    for (let i = 0; i < 90; i++) tr.update([at(1)], (t += 33), K);
    expect(tr.tracks.length).toBe(1);
    expect(tr.tracks[0]).toBe(k);
    expect(k.len.thigh / k.len.torso).toBeCloseTo(learned, 1);
  });

  it('a torso shot whose model raises the unseen knees keeps the costume\'s legs down', () => {
    const def = ROSTER.find((d) => d.id === 'skeleton')!;
    const { bones, root: rootBone } = skeleton(def.segs);
    const rig = new Rig(def.segs, bones);
    const root = new THREE.Group();
    root.add(rootBone);
    const tr = new Tracker();
    // knees raised forward, below the frame, read 0.7 visible (the recordings had 0.5–0.7 there at times)
    const d = synthPerson({ T: { x: 0, y: -0.7, z: -1 }, legsVis: 0.7, dir: { thighL: [0, -0.2, 1], thighR: [0, -0.2, 1] } }, K);
    let t = 0;
    for (let i = 0; i < 30; i++) tr.update([d], (t += 33), K);
    const k = tr.tracks[0]!;
    rig.apply(poseFromLandmarks(k.world));
    root.position.set(k.T.x, k.T.y, k.T.z);
    root.scale.setScalar(k.len.torso / rig.torso);
    reachLimbs(rig, root, k.image, K);
    root.updateMatrixWorld(true);
    const at = (b: string) => new THREE.Vector3().setFromMatrixPosition(rig.bones.get(b)!.matrixWorld);
    const down = at('pelvis').sub(at('spine2')).normalize();
    const thigh = at('shinL').sub(at('thighL')).normalize();
    // the costume's own rest: its thigh carries on the torso's line (it was 70–80° up, the model's guess believed)
    expect(deg(thigh.angleTo(down))).toBeLessThan(15);
  });
});
