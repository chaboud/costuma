import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { guessIntrinsics } from '../src/pose/solve';
import { synthPerson } from '../src/pose/synth';
import { Tracker, type Detection } from '../src/pose/tracker';
import { L, type LM } from '../src/pose/landmarks';

const K = guessIntrinsics(720, 1280);
const deg = THREE.MathUtils.radToDeg;
const V = (p: LM) => new THREE.Vector3(p.x, p.y, p.z);
/** a leg as the rig sees it: the thigh's angle from the torso's down, the knee's bend, and how sure (LM.b ?? v) */
function leg(w: LM[], side: 'L' | 'R') {
  const [h, k, a] = side === 'L' ? [L.hipL, L.knL, L.anL] : [L.hipR, L.knR, L.anR];
  const down = V(w[L.hipL]!).add(V(w[L.hipR]!)).sub(V(w[L.shL]!)).sub(V(w[L.shR]!)).normalize();
  const th = V(w[k]!).sub(V(w[h]!)).normalize(), sh = V(w[a]!).sub(V(w[k]!)).normalize();
  return { thigh: deg(th.angleTo(down)), knee: deg(th.angleTo(sh)), sure: Math.min(w[k]!.b ?? w[k]!.v, w[a]!.b ?? w[a]!.v) };
}
/** a detection with some points' visibility set (the picture and the 3D alike) */
function seenAs(d: Detection, pts: number[], v: number): Detection {
  const f = (p: LM, i: number) => (pts.includes(i) ? { ...p, v } : p);
  return { ...d, image: d.image.map(f), world: d.world.map(f) };
}
const LEG_L = [L.knL, L.anL, L.heelL, L.toeL], LEG_R = [L.knR, L.anR, L.heelR, L.toeR];
/** seated: thighs forward, shins down */
const seated = { thighL: [0.1, -0.15, 1] as [number, number, number], shinL: [0, -1, 0.05] as [number, number, number], thighR: [-0.1, -0.15, 1] as [number, number, number], shinR: [0, -1, 0.05] as [number, number, number] };

describe('limbs the picture is unsure of', () => {
  it('a seated person whose knees go behind the table keeps sitting', () => {
    const tr = new Tracker();
    const T = { x: 0, y: -0.2, z: -3 };
    let t = 0;
    for (let i = 0; i < 30; i++) tr.update([synthPerson({ T, dir: seated }, K)], (t += 33), K);
    // the legs behind something: the model guesses them straight down, unsure
    const hidden = seenAs(synthPerson({ T }, K), [...LEG_L, ...LEG_R], 0.08);
    for (let i = 0; i < 60; i++) tr.update([hidden], (t += 33), K);
    const l = leg(tr.tracks[0]!.world, 'L');
    // (before: the rest pose, straight down; the picture's own visibility stays what it was)
    expect(l.thigh).toBeGreaterThan(60);
    expect(l.knee).toBeGreaterThan(55);
    expect(l.sure).toBeGreaterThan(0.5);
    expect(tr.tracks[0]!.world[L.knL]!.v).toBeLessThan(0.2);
  });

  it('a leg the picture does not show takes the seen leg\'s pose, mirrored', () => {
    const tr = new Tracker();
    const T = { x: 0, y: -0.2, z: -3 };
    let t = 0;
    // the left leg seen seated; the right hidden (guessed straight down) from the start
    const d = synthPerson({ T, dir: { thighL: seated.thighL, shinL: seated.shinL } }, K);
    for (let i = 0; i < 40; i++) tr.update([seenAs(d, LEG_R, 0.05)], (t += 33), K);
    const r = leg(tr.tracks[0]!.world, 'R'), l = leg(tr.tracks[0]!.world, 'L');
    expect(Math.abs(r.thigh - l.thigh)).toBeLessThan(15);
    expect(r.knee).toBeGreaterThan(45);
  });

  it('a raised thigh with no calf in sight hangs its shin (a bent knee, not a can-can)', () => {
    const tr = new Tracker();
    const T = { x: 0, y: -0.2, z: -3 };
    let t = 0;
    // the knee raised forward and the model's shin straight out along it, its ankle unseen (and the other leg unseen too)
    const d = synthPerson({ T, dir: { thighL: [0, 0, 1], shinL: [0, 0, 1] } }, K);
    for (let i = 0; i < 40; i++) tr.update([seenAs(seenAs(d, [L.anL, L.heelL, L.toeL], 0.05), LEG_R, 0.05)], (t += 33), K);
    const l = leg(tr.tracks[0]!.world, 'L');
    expect(l.thigh).toBeGreaterThan(70);
    expect(l.knee).toBeGreaterThan(65);
  });

  it('a standing person whose legs are hidden keeps standing', () => {
    const tr = new Tracker();
    const T = { x: 0, y: -0.2, z: -3 };
    let t = 0;
    for (let i = 0; i < 30; i++) tr.update([synthPerson({ T }, K)], (t += 33), K);
    for (let i = 0; i < 90; i++) tr.update([seenAs(synthPerson({ T }, K), [...LEG_L, ...LEG_R], 0.05)], (t += 33), K);
    const l = leg(tr.tracks[0]!.world, 'L');
    expect(l.thigh).toBeLessThan(15);
    expect(l.knee).toBeLessThan(15);
  });
});
