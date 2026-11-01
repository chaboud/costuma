import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { FaceCalib, faceGeometry, CANONICAL } from '../src/pose/facegeo';
import { NEUTRAL_FACE } from '../src/characters/build';
import { CANON } from './canonical-face';

const W = 720, H = 1280;
/**
 * The canonical face as the face model would report it: turned (yaw, pitch, roll), `pxPerCm` pixels a centimetre,
 * placed at the picture's middle, as 478 points (x, y in 0..1, y down; z in x's units, smaller nearer). `move` shifts
 * points in the face's own centimetres first (an expression); the irises sit in each eye's middle, shifted by `iris`.
 */
function mesh(move: Record<number, [number, number, number]> = {}, turn: [number, number, number] = [0.35, 0.1, 0.17], iris: [number, number] = [0, 0], pxPerCm = 22) {
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(turn[1], turn[0], turn[2], 'YXZ'));
  const pts = Array.from({ length: 478 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
  const local = (i: number) => { const c = CANON[i]!, m = move[i] ?? [0, 0, 0]; return new THREE.Vector3(c[0] + m[0], c[1] + m[1], c[2] + m[2]); };
  const put = (i: number, v: THREE.Vector3) => {
    const w = v.clone().applyQuaternion(q).multiplyScalar(pxPerCm);
    // picture: x right, y down; depth: smaller nearer (the face looks along +z, toward the camera)
    pts[i] = { x: 0.5 + w.x / W, y: 0.4 - w.y / H, z: -w.z / W };
  };
  for (const k of Object.keys(CANON)) put(Number(k), local(Number(k)));
  // irises: the right one at 468, the left at 473, in the middle of each eye, shifted by iris[0] eye widths across
  // (+ toward the person's left) and iris[1] up
  for (const [ic, outer, inner] of [[473, 263, 362], [468, 33, 133]] as const) {
    const o = local(outer), n = local(inner), wEye = Math.abs(o.x - n.x);
    const c = o.clone().add(n).multiplyScalar(0.5).add(new THREE.Vector3(iris[0] * wEye, iris[1] * wEye, 0.3));
    put(ic, c);
  }
  return pts;
}
/** read against a calibration that has seen the resting canonical face (or `calib`) */
function express(pts: ReturnType<typeof mesh>, calib?: FaceCalib) {
  if (!calib) { calib = new FaceCalib(); calib.update(faceGeometry(mesh(), W, H)!, 1 / 30); }
  return calib.express(faceGeometry(pts, W, H)!, NEUTRAL_FACE);
}

describe('the face read from its mesh', () => {
  it('measures the canonical face as itself, turned and scaled', () => {
    const g = faceGeometry(mesh(), W, H)!;
    for (const k of ['gap', 'width', 'cornerL', 'apL', 'apR', 'browInL', 'browOutR'] as const) expect(g[k]).toBeCloseTo(CANONICAL[k], 2);
  });
  it('a resting face makes no expression', () => {
    const e = express(mesh());
    for (const k of ['jaw', 'blinkL', 'blinkR', 'smileL', 'smileR', 'frown', 'browUp', 'browDownL', 'wideL', 'pucker', 'funnel'] as const) expect(e[k]).toBeLessThan(0.05);
    expect(Math.abs(e.lookX)).toBeLessThan(0.05);
    expect(Math.abs(e.jawSide)).toBeLessThan(0.05);
  });
  it('each movement reads on its own channel and side', () => {
    // the lower lip 2 cm down: the jaw opens (by how far, not a score)
    const open = express(mesh({ 14: [0, -2, 0] }));
    expect(open.jaw).toBeGreaterThan(0.4);
    expect(express(mesh({ 14: [0, -3.5, 0] })).jaw).toBeGreaterThan(open.jaw);
    // the left corner 0.5 cm up: a smile on the left only
    const smirk = express(mesh({ 291: [0, 0.5, 0] }));
    expect(smirk.smileL).toBeGreaterThan(0.5);
    expect(smirk.smileR).toBeLessThan(0.05);
    // the left upper lid down onto the lower: a wink of the left eye
    const wink = express(mesh({ 386: [0, CANON[374]![1] - CANON[386]![1] + 0.05, 0] }));
    expect(wink.blinkL).toBeGreaterThan(0.9);
    expect(wink.blinkR).toBeLessThan(0.05);
    // both brows' inner ends 0.5 cm up; then the left one 0.4 cm down
    expect(express(mesh({ 336: [0, 0.5, 0], 107: [0, 0.5, 0] })).browUp).toBeGreaterThan(0.6);
    const scowl = express(mesh({ 336: [0, -0.4, 0] }));
    expect(scowl.browDownL).toBeGreaterThan(0.6);
    expect(scowl.browDownR).toBeLessThan(0.05);
    // the irises a quarter of an eye toward the person's left: look left (+)
    const calib = new FaceCalib();
    calib.update(faceGeometry(mesh(), W, H)!, 0.1);
    expect(express(mesh({}, undefined, [0.25, 0]), calib).lookX).toBeGreaterThan(0.5);
    expect(express(mesh({}, undefined, [-0.25, 0]), calib).lookX).toBeLessThan(-0.5);
    // the chin 0.8 cm to the person's left
    expect(express(mesh({ 152: [0.8, 0, 0] })).jawSide).toBeGreaterThan(0.5);
    // the corners pulled in: a pucker with the lips shut, a funnel with them open
    const narrow = { 291: [-0.6, 0, 0] as [number, number, number], 61: [0.6, 0, 0] as [number, number, number] };
    expect(express(mesh(narrow)).pucker).toBeGreaterThan(0.5);
    expect(express(mesh({ ...narrow, 14: [0, -1.5, 0] })).funnel).toBeGreaterThan(0.5);
  });
  it('takes the first reading as the person\'s rest: low brows are not a scowl', () => {
    const low = { 336: [0, -0.5, 0] as [number, number, number], 107: [0, -0.5, 0] as [number, number, number], 300: [0, -0.5, 0] as [number, number, number], 70: [0, -0.5, 0] as [number, number, number] };
    const calib = new FaceCalib();
    calib.update(faceGeometry(mesh(low), W, H)!, 1 / 30);
    const e = calib.express(faceGeometry(mesh(low), W, H)!, NEUTRAL_FACE);
    expect(e.browDownL).toBeLessThan(0.05);
    expect(e.browDownR).toBeLessThan(0.05);
  });
  it('learns the person\'s own resting face, and a blink does not teach it', () => {
    // narrower eyes than the canonical face's: read as half shut at first, then as rest
    const narrowEyes = { 386: [0, -0.2, 0] as [number, number, number], 159: [0, -0.2, 0] as [number, number, number] };
    const calib = new FaceCalib();
    for (let i = 0; i < 300; i++) calib.update(faceGeometry(mesh(narrowEyes), W, H)!, 1 / 30);
    expect(express(mesh(narrowEyes), calib).blinkL).toBeLessThan(0.05);
    // blinking now and then does not move the rest toward shut
    const before = calib.rest.apL;
    const shut = { 386: [0, CANON[374]![1] - CANON[386]![1] + 0.05, 0] as [number, number, number] };
    for (let i = 0; i < 6; i++) calib.update(faceGeometry(mesh(shut), W, H)!, 1 / 30);
    expect(calib.rest.apL).toBeGreaterThan(before * 0.97);
  });
});
