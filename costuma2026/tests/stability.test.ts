import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { guessIntrinsics } from '../src/pose/solve';
import { synthPerson } from '../src/pose/synth';
import { Tracker, TUNE, setSmoothing, type Detection } from '../src/pose/tracker';
import { CVBank } from '../src/pose/kalman';
import { L, type LM } from '../src/pose/landmarks';

const K = guessIntrinsics(720, 1280);
const deg = THREE.MathUtils.radToDeg;
/** the torso's angle from up, degrees */
function tilt(w: LM[]): number {
  const m = (a: number, b: number) => new THREE.Vector3((w[a]!.x + w[b]!.x) / 2, (w[a]!.y + w[b]!.y) / 2, (w[a]!.z + w[b]!.z) / 2);
  return deg(m(L.shL, L.shR).sub(m(L.hipL, L.hipR)).angleTo(new THREE.Vector3(0, 1, 0)));
}
/** the 3D pose tipped toward the camera by `a` radians about the hips (the picture left as it was): a depth flip */
function tipped(d: Detection, a: number): Detection {
  const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -a);
  return { ...d, world: d.world.map((p) => { const v = new THREE.Vector3(p.x, p.y, p.z).applyQuaternion(q); return { x: v.x, y: v.y, z: v.z, v: p.v }; }) };
}
/** a torso shot's flip: the hidden lower body swung toward the camera about the shoulders (what the model sees stays
 *  put), then re-centred on the moved hips */
function swung(d: Detection, a: number): Detection {
  const w = d.world, sh = new THREE.Vector3((w[L.shL]!.x + w[L.shR]!.x) / 2, (w[L.shL]!.y + w[L.shR]!.y) / 2, (w[L.shL]!.z + w[L.shR]!.z) / 2);
  const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), a);
  const lower = new Set<number>([L.hipL, L.hipR, L.knL, L.knR, L.anL, L.anR, L.heelL, L.heelR, L.toeL, L.toeR]);
  const moved = w.map((p, i) => { if (!lower.has(i)) return { ...p }; const v = new THREE.Vector3(p.x, p.y, p.z).sub(sh).applyQuaternion(q).add(sh); return { x: v.x, y: v.y, z: v.z, v: p.v }; });
  const hx = (moved[L.hipL]!.x + moved[L.hipR]!.x) / 2, hy = (moved[L.hipL]!.y + moved[L.hipR]!.y) / 2, hz = (moved[L.hipL]!.z + moved[L.hipR]!.z) / 2;
  return { ...d, world: moved.map((p) => ({ ...p, x: p.x - hx, y: p.y - hy, z: p.z - hz })) };
}
/** a torso shot: the hips and legs below the frame (MediaPipe's visibility for them reads low) */
function torsoShot(d: Detection): Detection {
  const low = new Set<number>([L.hipL, L.hipR, L.knL, L.knR, L.anL, L.anR, L.heelL, L.heelR, L.toeL, L.toeR]);
  const f = (p: LM, i: number) => (low.has(i) ? { ...p, v: 0.1 } : p);
  return { image: d.image.map(f), world: d.world.map(f) };
}

describe('upright: people stand up', () => {
  it('a torso shot whose 3D pose the model tipped over stays upright', () => {
    const tr = new Tracker();
    const shot = torsoShot(synthPerson({ T: { x: 0, y: 0.2, z: -1.6 } }, K));
    let t = 0;
    for (let i = 0; i < 10; i++) tr.update([shot], (t += 33), K);
    let worst = 0;
    // the model now says the body lies toward the camera, frame after frame
    const flip = swung(shot, -1.4);
    expect(tilt(flip.world)).toBeGreaterThan(70);
    for (let i = 0; i < 30; i++) { tr.update([flip], (t += 33), K); worst = Math.max(worst, tilt(tr.tracks[0]!.world)); }
    expect(worst).toBeLessThan(25);
    expect(tr.tracks[0]!.verdict).toBe('torso shot');
  });

  it('with the hips in view, a depth flip the picture contradicts is stood up at once', () => {
    const tr = new Tracker();
    const p = synthPerson({ T: { x: 0, y: -0.2, z: -3 } }, K);
    let t = 0;
    for (let i = 0; i < 10; i++) tr.update([p], (t += 33), K);
    let worst = 0;
    for (let i = 0; i < 6; i++) { tr.update([tipped(p, 1.4)], (t += 33), K); worst = Math.max(worst, tilt(tr.tracks[0]!.world)); }
    expect(worst).toBeLessThan(45);
    expect(tr.tracks[0]!.verdict).toBe('stood up');
  });

  it('a body the picture shows lying down is accepted after a moment', () => {
    const tr = new Tracker();
    let t = 0;
    const stand = synthPerson({ T: { x: 0, y: -0.2, z: -3 } }, K);
    for (let i = 0; i < 10; i++) tr.update([stand], (t += 33), K);
    // lying on its side across the picture: the 3D pose and the picture both turned 80° about the view axis
    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 1.4);
    const lyingW = stand.world.map((p) => { const v = new THREE.Vector3(p.x, p.y, p.z).applyQuaternion(q); return { x: v.x, y: v.y, z: v.z, v: p.v }; });
    const lying = synthPerson({ T: { x: 0, y: -0.2, z: -3 } }, K);
    // its picture from the turned 3D pose
    const img = lyingW.map((w) => { const z = -(w.z - 3); return { x: (K.cx + (K.f * w.x) / z) / K.w, y: (K.cy - (K.f * (w.y - 0.2)) / z) / K.h, z: 0, v: w.v }; });
    const det = { ...lying, world: lyingW, image: img };
    const verdicts: string[] = [];
    for (let i = 0; i < 25; i++) { tr.update([det], (t += 33), K); verdicts.push(tr.tracks[0]!.verdict); }
    expect(verdicts[0]).toBe('holding');
    expect(verdicts.at(-1)).toBe('accepted');
    expect(tilt(tr.tracks[0]!.world)).toBeGreaterThan(60);
  });
});

describe('placement', () => {
  it('the costume\'s torso lands on the picture\'s torso', () => {
    const tr = new Tracker();
    // the 3D pose a little wrong in depth (its shoulders 6 cm forward): the solve alone would put them off the picture
    const p = synthPerson({ T: { x: 0.3, y: 0.1, z: -2 } }, K);
    const off = { ...p, world: p.world.map((w, i) => (i === L.shL || i === L.shR ? { ...w, z: w.z + 0.06 } : w)) };
    let t = 0;
    for (let i = 0; i < 20; i++) tr.update([off], (t += 33), K);
    const k = tr.tracks[0]!;
    let du = 0, dv = 0;
    for (const i of [L.shL, L.shR, L.hipL, L.hipR]) {
      const w = k.world[i]!, z = -(k.T.z + w.z);
      du += (K.cx + (K.f * (k.T.x + w.x)) / z) - k.image[i]!.x * K.w;
      dv += (K.cy - (K.f * (k.T.y + w.y)) / z) - k.image[i]!.y * K.h;
    }
    expect(Math.abs(du / 4)).toBeLessThan(1);
    expect(Math.abs(dv / 4)).toBeLessThan(1);
    expect(TUNE.pin).toBe(true);
  });
});

describe('kalman', () => {
  it('follows a steady move with almost no lag (an EMA lags speed × tau)', () => {
    const b = new CVBank(1);
    b.reset(0, 0, 1e-4);
    let x = 0;
    for (let i = 0; i < 120; i++) x = b.step(0, 0.5 * i / 30, 1 / 30, 0.1, 4e-4, 3);
    expect(Math.abs(x - 0.5 * 119 / 30)).toBeLessThan(0.005);
  });
});

describe('the hold', () => {
  /** a still person whose readings tremble (1 cm in 3D, a pixel or two in the picture), then raises an arm */
  function run(holdOn: boolean) {
    const saved = TUNE.hold;
    TUNE.hold = holdOn;
    let seed = 3;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
    const tr = new Tracker();
    const still = synthPerson({ T: { x: 0, y: -0.2, z: -3 } }, K);
    const raised = synthPerson({ T: { x: 0, y: -0.2, z: -3 }, dir: { armL: [1, 0.4, 0], forearmL: [0.6, 1, 0] } }, K);
    const noisy = (d: Detection) => ({ world: d.world.map((p) => ({ ...p, x: p.x + rnd() * 0.035, y: p.y + rnd() * 0.035, z: p.z + rnd() * 0.05 })), image: d.image.map((p) => ({ ...p, x: p.x + rnd() * 0.004, y: p.y + rnd() * 0.003 })) });
    let t = 0, moved = 0, n = 0, prev: LM | null = null;
    for (let i = 0; i < 90; i++) {
      tr.update([noisy(still)], (t += 33), K);
      const w = tr.tracks[0]?.world[L.wrL];
      if (w && prev && i > 30) { moved += Math.hypot(w.x - prev.x, w.y - prev.y, w.z - prev.z); n++; }
      if (w) prev = { ...w };
    }
    // the arm goes up: frames until the wrist is within 5 cm of where the raised arm puts it
    const target = raised.world[L.wrL]!;
    let frames = 0;
    for (; frames < 30; frames++) {
      tr.update([noisy(raised)], (t += 33), K);
      const w = tr.tracks[0]!.world[L.wrL]!;
      if (Math.hypot(w.x - target.x, w.y - target.y, w.z - target.z) < 0.05) break;
    }
    TUNE.hold = saved;
    return { still: moved / n, frames };
  }
  it('a still person holds still, and a raised arm still arrives', () => {
    // the default setting (the middle): far stiller, a raised arm in within half a second
    setSmoothing(0.5);
    const off = run(false), on = run(true);
    expect(on.still).toBeLessThan(off.still * 0.3);
    expect(on.frames).toBeLessThan(15);
    // the snappy end: as quick as no hold, still stiller
    setSmoothing(0);
    const snappy = run(true), none = run(false);
    expect(snappy.frames).toBeLessThanOrEqual(none.frames + 2);
    expect(snappy.still).toBeLessThan(none.still);
    setSmoothing(0.5);
  });
});
