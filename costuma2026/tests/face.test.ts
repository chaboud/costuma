import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { guessIntrinsics } from '../src/pose/solve';
import { synthPerson } from '../src/pose/synth';
import { Tracker } from '../src/pose/tracker';
import { attachFaces, type FaceDet } from '../src/pose/face';
import { NEUTRAL_FACE, parseFace } from '../src/characters/build';
import { L } from '../src/pose/landmarks';

const K = guessIntrinsics(720, 1280);
const deg = (r: number) => (r * 180) / Math.PI;
const angle = (a: THREE.Quaternion, b: THREE.Quaternion) => deg(a.angleTo(b));

/** a face reading for a track: its mesh at the pose's own face points (enough for attachFaces), a turn, expressions */
function reading(tr: Tracker, rot: THREE.Quaternion | null, shapes: Record<string, number> = {}): Map<number, FaceDet> {
  const out = new Map<number, FaceDet>();
  for (const t of tr.tracks) {
    const pts = Array.from({ length: 478 }, () => ({ x: t.image[L.nose]!.x, y: t.image[L.nose]!.y, z: 0 }));
    pts[263] = pts[362] = { x: t.image[L.eyeL]!.x, y: t.image[L.eyeL]!.y, z: 0 };
    pts[33] = pts[133] = { x: t.image[L.eyeR]!.x, y: t.image[L.eyeR]!.y, z: 0 };
    out.set(t.id, { pts, shapes: new Map(Object.entries(shapes)), rot });
  }
  return out;
}

describe('faces', () => {
  it('turns the head as the face mesh says, and hands back to the body without a jump when the face is lost', () => {
    const tr = new Tracker();
    const person = () => synthPerson({ T: { x: 0, y: 0, z: -2.5 }, scale: 1 }, K);
    const turn = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.15, 0.6, 0.3, 'YXZ'));
    let now = 0;
    const dt = 1 / 30;
    // read for two seconds: the head comes to the face's turn
    for (let i = 0; i < 60; i++) { tr.update([person()], (now += 33), K); attachFaces(tr.tracks, reading(tr, turn), K, now, dt); }
    const f = tr.tracks[0]!.face!;
    expect(f.trust).toBeGreaterThan(0.95);
    expect(angle(f.head, turn)).toBeLessThan(1);
    // lost (turned to a profile, say): never more than a few degrees a frame, and back to the body's own head in seconds
    let prev = f.head.clone(), worst = 0;
    for (let i = 0; i < 300; i++) {
      tr.update([person()], (now += 33), K);
      attachFaces(tr.tracks, new Map(), K, now, dt);
      worst = Math.max(worst, angle(prev, f.head));
      prev = f.head.clone();
    }
    expect(worst).toBeLessThan(4);
    expect(f.trust).toBeLessThan(0.01);
    // the body's head here is level (the synthetic person looks at the camera)
    expect(deg(new THREE.Euler().setFromQuaternion(f.head, 'YXZ').y)).toBeLessThan(5);
  });

  it('carries a reading between turns (more people than faces a frame), then relaxes', () => {
    const tr = new Tracker();
    let now = 0;
    const p = synthPerson({ T: { x: 0, y: 0, z: -2.5 }, scale: 1 }, K);
    for (let i = 0; i < 20; i++) { tr.update([p], (now += 33), K); attachFaces(tr.tracks, reading(tr, null, { jawOpen: 0.7, eyeBlinkLeft: 1 }), K, now, 1 / 30); }
    const f = tr.tracks[0]!.face!;
    expect(f.jaw).toBeGreaterThan(0.9);
    expect(f.blinkL).toBeGreaterThan(0.9);
    // one frame unread: still open
    tr.update([p], (now += 33), K); attachFaces(tr.tracks, new Map(), K, now, 1 / 30);
    expect(f.jaw).toBeGreaterThan(0.9);
    // a second unread: relaxed toward rest
    for (let i = 0; i < 40; i++) { tr.update([p], (now += 33), K); attachFaces(tr.tracks, new Map(), K, now, 1 / 30); }
    expect(f.jaw).toBeLessThan(0.05);
  });

  it('reads the gaze and the sideways jaw with the person\'s left positive', () => {
    const tr = new Tracker();
    let now = 0;
    const p = synthPerson({ T: { x: 0, y: 0, z: -2.5 }, scale: 1 }, K);
    // both eyes toward the person's left: the left eye looks out, the right eye in
    for (let i = 0; i < 30; i++) { tr.update([p], (now += 33), K); attachFaces(tr.tracks, reading(tr, null, { eyeLookOutLeft: 0.6, eyeLookInRight: 0.6, jawLeft: 0.4 }), K, now, 1 / 30); }
    const f = tr.tracks[0]!.face!;
    expect(f.lookX).toBeGreaterThan(0.5);
    expect(f.jawSide).toBeGreaterThan(0.5);
  });

  it('parses ?face= onto a neutral face', () => {
    const f = parseFace('blinkL:1,lookX:-0.5,bogus:3,smile:x', { jaw: 0.4 });
    expect(f.blinkL).toBe(1);
    expect(f.lookX).toBe(-0.5);
    expect(f.jaw).toBe(0.4);
    expect(f.smile).toBe(0);
    expect(Object.keys(f).sort()).toEqual(Object.keys(NEUTRAL_FACE).sort());
  });
});
