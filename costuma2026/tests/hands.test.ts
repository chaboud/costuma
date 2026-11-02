import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { HAND_TUNE, attachHands, handBox, handCurls, handFrame, handWrists, poseHandFrame, type HandDet } from '../src/pose/hands';
import { Rig, demoPose, type BodyPose } from '../src/pose/rig';
import { buildCharacter, skeleton, surfaceArrays } from '../src/characters/build';
import { byId } from '../src/characters/roster';
import { withHands } from '../src/characters/sdf';
import { FingerCurl, JOINT_FIST } from '../src/characters/curl';
import { guessIntrinsics } from '../src/pose/solve';
import { synthPerson } from '../src/pose/synth';
import { Tracker } from '../src/pose/tracker';
import { L } from '../src/pose/landmarks';

const deg = THREE.MathUtils.radToDeg;
const K = guessIntrinsics(720, 1280);

/** a hand's 21 points (metres) in the frame `q` (x across little → index, y wrist → middle knuckle), fingers curled by
 *  `bend` radians at each of their joints (toward the frame's -z), the thumb by `thumb` */
function synthHand(q: THREE.Quaternion, bend = 0, thumb = bend, at = new THREE.Vector3()): THREE.Vector3[] {
  const p: THREE.Vector3[] = Array.from({ length: 21 }, () => new THREE.Vector3());
  const across = [0.024, 0, -0.02, -0.038], len = [0.04, 0.045, 0.042, 0.035];
  for (let f = 0; f < 4; f++) {
    const mcp = new THREE.Vector3(across[f]!, 0.09 - Math.abs(across[f]!) * 0.3, 0);
    const base = 5 + f * 4;
    p[base]!.copy(mcp);
    let dir = new THREE.Vector3(0, 1, 0), at2 = mcp.clone();
    for (let j = 1; j <= 3; j++) {
      dir = dir.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), -bend);
      at2 = at2.clone().addScaledVector(dir, len[f]! * (1 - 0.2 * j));
      p[base + j]!.copy(at2);
    }
  }
  // the thumb: out from the wrist on the index's side
  let tdir = new THREE.Vector3(0.6, 0.8, 0).normalize(), tp = new THREE.Vector3(0.02, 0.02, 0);
  p[1]!.copy(tp);
  for (let j = 2; j <= 4; j++) {
    if (j > 2) tdir = tdir.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), -thumb);
    tp = tp.clone().addScaledVector(tdir, 0.03);
    p[j]!.copy(tp);
  }
  return p.map((v) => v.applyQuaternion(q).add(at));
}
const frameQ = (x: THREE.Vector3, y: THREE.Vector3) => {
  const Y = y.clone().normalize(), X = x.clone().addScaledVector(Y, -x.dot(Y)).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, new THREE.Vector3().crossVectors(X, Y)));
};
const angle = (a: THREE.Quaternion, b: THREE.Quaternion) => deg(2 * Math.acos(Math.min(1, Math.abs(a.dot(b)))));

describe('reading a hand', () => {
  it('its frame: across the knuckles and along the hand, however it is turned', () => {
    for (const q of [new THREE.Quaternion(), new THREE.Quaternion().setFromEuler(new THREE.Euler(0.4, -1.1, 2.3)), new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.2, 2.8, 0.1))]) {
      expect(angle(handFrame(synthHand(q, 0.3)), q)).toBeLessThan(1);
    }
  });

  it('its curls: straight fingers 0, a fist near 1', () => {
    const open = handCurls(synthHand(new THREE.Quaternion(), 0, 0));
    for (const c of open) expect(c).toBeLessThan(0.05);
    const fist = handCurls(synthHand(new THREE.Quaternion(), THREE.MathUtils.degToRad(75), THREE.MathUtils.degToRad(50)));
    for (const c of fist.slice(1)) expect(c).toBeGreaterThan(0.8);
    expect(fist[0]).toBeGreaterThan(0.5);
  });

  it('the crop round a wrist: past it toward the knuckles, as big as the forearm or more', () => {
    const d = synthPerson({ T: { x: 0, y: -0.1, z: -2.5 }, dir: { armR: [-1, 0, 0], forearmR: [-0.2, 1, 0] } }, K);
    const b = handBox(d.image, 'R', K.w, K.h)!;
    const P = (i: number) => ({ x: d.image[i]!.x * K.w, y: d.image[i]!.y * K.h });
    const wr = P(L.wrR), el = P(L.elR), c = { x: b.x + b.s / 2, y: b.y + b.s / 2 };
    // the box holds the wrist and its middle lies beyond it, away from the elbow
    expect(wr.x).toBeGreaterThan(b.x); expect(wr.x).toBeLessThan(b.x + b.s);
    expect(wr.y).toBeGreaterThan(b.y); expect(wr.y).toBeLessThan(b.y + b.s);
    expect((c.x - wr.x) * (wr.x - el.x) + (c.y - wr.y) * (wr.y - el.y)).toBeGreaterThan(0);
    expect(b.s).toBeGreaterThanOrEqual(HAND_TUNE.crop.fore * Math.hypot(wr.x - el.x, wr.y - el.y) - 1e-6);
  });
});

describe('hands onto people', () => {
  const person = () => {
    const tr = new Tracker();
    const d = synthPerson({ T: { x: 0, y: -0.1, z: -2.5 } }, K);
    for (let i = 1; i <= 10; i++) tr.update([d], i * 33, K);
    return tr;
  };
  const det = (q: THREE.Quaternion, bend: number, side: 'L' | 'R' = 'R'): HandDet => {
    const w = synthHand(q, bend);
    return { side, score: 0.9, world: w.map((v) => ({ x: v.x, y: v.y, z: v.z })), pts: w.map((v) => ({ x: 0.5 + v.x, y: 0.5 - v.y, z: 0 })) };
  };

  it('a reading is taken in, trusted, and its curls followed', () => {
    const tr = person(), t = tr.tracks[0]!;
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.3, 0.9, -0.4));
    let now = 330;
    for (let i = 0; i < 30; i++) attachHands(tr.tracks, new Map([[t.id, { R: det(q, 1.2) }]]), (now += 33), 1 / 30);
    const h = t.hands!.R;
    expect(h.trust).toBeGreaterThan(0.9);
    expect(h.w).toBeGreaterThan(0.9);
    expect(angle(h.q, q)).toBeLessThan(2);
    expect(Math.min(...h.curl.slice(1))).toBeGreaterThan(0.8);
  });

  it('unread, it rides the forearm a moment, then eases onto the pose model\'s hand points; with none, it lets go', () => {
    const tr = person(), t = tr.tracks[0]!;
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.3, 0.9, -0.4));
    let now = 330;
    for (let i = 0; i < 30; i++) attachHands(tr.tracks, new Map([[t.id, { R: det(q, 0) }]]), (now += 33), 1 / 30);
    // a moment unread: still the reading
    for (let i = 0; i < 5; i++) attachHands(tr.tracks, null, (now += 33), 1 / 30);
    expect(angle(t.hands!.R.q, q)).toBeLessThan(5);
    // long unread: the pose model's frame, trusted less
    for (let i = 0; i < 90; i++) attachHands(tr.tracks, null, (now += 33), 1 / 30);
    // (which way it points; its twist kept from the reading)
    const pose = poseHandFrame(t.world, 'R'), y = (q: THREE.Quaternion) => new THREE.Vector3(0, 1, 0).applyQuaternion(q);
    expect(deg(y(t.hands!.R.q).angleTo(y(pose.q)))).toBeLessThan(3);
    expect(t.hands!.R.trust).toBeLessThan(0.05);
    expect(t.hands!.R.w).toBeLessThan(HAND_TUNE.poseTrust + 0.05);
    // the hand points unseen too: nothing to show
    for (const i of [L.wrR, L.indexR, L.pinkyR, L.thumbR]) { t.world[i]!.v = 0.1; t.image[i]!.v = 0.1; }
    for (let i = 0; i < 90; i++) attachHands(tr.tracks, null, (now += 33), 1 / 30);
    expect(t.hands!.R.w).toBeLessThan(0.02);
  });
});

describe('the reach takes the hand model\'s wrist', () => {
  it('as far as it is trusted; untrusted, the picture is as it was', () => {
    const d = synthPerson({ T: { x: 0, y: -0.1, z: -2.5 } }, K);
    const h = (trust: number) => ({ q: new THREE.Quaternion(), curl: [0, 0, 0, 0, 0], trust, w: trust, pts: Array.from({ length: 21 }, () => ({ x: 0.4, y: 0.3 })), seen: 0, last: null });
    const im = handWrists(d.image, { L: h(0), R: h(1) });
    expect(im[L.wrR]!.x).toBeCloseTo(0.4, 6); expect(im[L.wrR]!.y).toBeCloseTo(0.3, 6);
    expect(im[L.wrL]).toEqual(d.image[L.wrL]);
    expect(handWrists(d.image, { L: h(0), R: h(0) })).toBe(d.image);
  });
});

describe('a costume\'s hands', () => {
  const posed = (id: string, pose: BodyPose) => {
    const def = byId(id);
    const { bones, root: rootBone } = skeleton(def.segs);
    const rig = new Rig(def.segs, bones);
    const root = new THREE.Group();
    root.add(rootBone);
    root.scale.setScalar(0.1);
    root.updateMatrixWorld(true);
    return { def, rig, root, bones };
  };
  /** a hand bone's along and across in the root's frame */
  const handAxes = (rig: Rig, root: THREE.Object3D, side: 'L' | 'R') => {
    const hb = rig.bones.get('hand' + side)!;
    root.updateMatrixWorld(true);
    const q = hb.getWorldQuaternion(new THREE.Quaternion()).premultiply(root.getWorldQuaternion(new THREE.Quaternion()).invert());
    const along = rig.rest.get('hand' + side)!.dir.clone();
    const across = new THREE.Vector3(0, 0, 1).addScaledVector(along, -along.z).normalize();
    return { along: along.applyQuaternion(q), across: across.applyQuaternion(q) };
  };

  it('every character on the roster has a hand on each forearm, appended (no other bone moves its index)', () => {
    for (const id of ['crimson', 'skeleton', 'witch', 'jimothy', 'bastion']) {
      const d = byId(id), names = d.segs.map((s) => s.name);
      expect(names).toContain('handL'); expect(names).toContain('handR');
      expect(names.indexOf('handL')).toBeGreaterThan(names.indexOf('forearmR'));
      expect(withHands(d.segs)).toBe(d.segs);
    }
  });

  for (const id of ['crimson', 'skeleton', 'mummy', 'bastion']) {
    it(`${id}: the hand turns to the reading — along and across — from the forearm as it stands`, () => {
      const { rig, root } = posed(id, demoPose('hands'));
      const pose = demoPose('hands');
      // the right: fingers up and a little out, the palm turned 40° from the camera
      const q = frameQ(new THREE.Vector3(Math.cos(0.7), 0, -Math.sin(0.7)), new THREE.Vector3(-0.15, 1, 0.1));
      pose.hands = { R: { q, w: 1, curl: [0, 0, 0, 0, 0] } };
      rig.apply(pose);
      rig.setHands(pose, root);
      const a = handAxes(rig, root, 'R');
      expect(deg(a.along.angleTo(new THREE.Vector3(0, 1, 0).applyQuaternion(q)))).toBeLessThan(1.5);
      expect(deg(a.across.angleTo(new THREE.Vector3(1, 0, 0).applyQuaternion(q)))).toBeLessThan(1.5);
      // again from the same pose: the forearm's share of the twist does not pile up frame on frame
      const fq = rig.bones.get('forearmR')!.quaternion.clone();
      rig.apply(pose);
      rig.setHands(pose, root);
      expect(angle(rig.bones.get('forearmR')!.quaternion, fq)).toBeLessThan(0.01);
      expect(deg(handAxes(rig, root, 'R').across.angleTo(a.across))).toBeLessThan(0.01);
    });
  }

  it('a wrist asked to bend past what a wrist can is eased short of it; a hand not shown hangs straight', () => {
    const { rig, root } = posed('crimson', demoPose('hands'));
    const pose = demoPose('hands');
    // the forearm up; the hand asked to point straight down (180°)
    pose.hands = { R: { q: frameQ(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0.02)), w: 1, curl: [0, 0, 0, 0, 0] } };
    rig.apply(pose);
    rig.setHands(pose, root);
    const fb = rig.bones.get('forearmR')!, hb = rig.bones.get('handR')!;
    const fdir = rig.rest.get('forearmR')!.dir.clone().applyQuaternion(fb.getWorldQuaternion(new THREE.Quaternion()));
    const hdir = rig.rest.get('handR')!.dir.clone().applyQuaternion(hb.getWorldQuaternion(new THREE.Quaternion()));
    expect(deg(fdir.angleTo(hdir))).toBeLessThan(90);
    pose.hands = { R: { q: new THREE.Quaternion(), w: 0, curl: [0, 0, 0, 0, 0] } };
    rig.apply(pose);
    rig.setHands(pose, root);
    expect(angle(hb.quaternion, new THREE.Quaternion())).toBeLessThan(0.01);
  });

  it('a hand takes only skin its forearm may: none of the thigh by a hanging hand', () => {
    const def = byId('crimson');
    const a = surfaceArrays(def.body!, def.segs, 56);
    const hi = def.segs.findIndex((s) => s.name === 'handL'), hs = def.segs[hi]!;
    let n = 0;
    for (let v = 0; v < a.position.length / 3; v++) {
      const dom = a.skinWeight[v * 4]! >= a.skinWeight[v * 4 + 1]! ? a.skinIndex[v * 4]! : a.skinIndex[v * 4 + 1]!;
      if (dom !== hi) continue;
      n++;
      const p = new THREE.Vector3(a.position[v * 3]!, a.position[v * 3 + 1]!, a.position[v * 3 + 2]!);
      const seg = new THREE.Line3(new THREE.Vector3(...hs.a), new THREE.Vector3(...hs.b));
      expect(p.distanceTo(seg.closestPointToPoint(p, true, new THREE.Vector3()))).toBeLessThan(1.2);
      // the arm's side of the body, never the trunk's or the thigh's
      expect(Math.abs(p.x)).toBeGreaterThan(2.0);
    }
    expect(n).toBeGreaterThan(40);
  });

  it('a jointed hand (Skelly) curls each finger toward its palm, knuckle by knuckle', () => {
    const def = byId('skeleton');
    const built = buildCharacter(def, 24);
    const curl = new FingerCurl(built.root, def.segs);
    expect(curl.active).toBe(true);
    built.root.updateMatrixWorld(true);
    const tip = () => { const o = built.root.getObjectByName('skelly-handL-b12')!; return new THREE.Vector3().setFromMatrixPosition(o.matrixWorld); };
    const palmC = built.root.getObjectByName('skelly-handL-palm')!;
    palmC.updateMatrixWorld(true);
    const before = tip();
    curl.set('L', [1, 1, 1, 1, 1]);
    built.root.updateMatrixWorld(true);
    const after = tip();
    // the index's last bone moved toward the palm side (the left hand's palm faces the body's middle: -x)
    expect(after.x).toBeLessThan(before.x - 0.2);
    const piv = built.root.getObjectByName('skelly-handL-f10')!;
    expect(deg(2 * Math.acos(Math.min(1, Math.abs(piv.quaternion.w))))).toBeCloseTo(deg(JOINT_FIST.finger[0]!), 0);
    // and the right hand is left alone
    expect(built.root.getObjectByName('skelly-handR-f10')!.quaternion.w).toBeCloseTo(1, 6);
  });
});
