import { describe, expect, it } from 'vitest';
import { Party } from '../src/render/party';
import { Tracker } from '../src/pose/tracker';
import { guessIntrinsics } from '../src/pose/solve';
import { synthMask, synthPerson } from '../src/pose/synth';

const K = guessIntrinsics(1280, 720);
const shared = { uTex: { value: null }, uCrop: { value: null }, uMirror: { value: 0 } };

function frame(tr: Tracker, xs: number[], t: number) {
  const dets = xs.map((x, i) => { const d = synthPerson({ T: { x, y: 0, z: -3 - i * 0.8 } }, K); d.mask = synthMask(d, 160, 90, 16 / 9); return d; });
  return tr.update(dets, t, K);
}

describe('party', () => {
  it('cuts out the N nearest, and each keeps its channel', () => {
    const tr = new Tracker(), p = new Party(shared, 'void main(){}');
    p.subjects = 1;
    let t = 0;
    for (let i = 0; i < 12; i++) p.update(frame(tr, [-0.8, 0.9], (t += 33)), 0.033, t / 1000, 16 / 9);
    const near = tr.tracks.reduce((a, b) => (b.T.z > a.T.z ? b : a));
    const on = (p.material.uniforms.uOn!.value as { x: number; y: number; z: number; w: number });
    expect([on.x, on.y, on.z, on.w].filter((v) => v > 0).length).toBe(1);
    expect((p as unknown as { chans: (number | null)[] }).chans[0]).toBe(near.id);
    p.subjects = 2;
    for (let i = 0; i < 12; i++) p.update(frame(tr, [-0.8, 0.9], (t += 33)), 0.033, t / 1000, 16 / 9);
    const chans = (p as unknown as { chans: (number | null)[] }).chans;
    expect(chans[0]).toBe(near.id);
    expect(chans.filter((c) => c !== null).length).toBe(2);
  });
  it('distance is zero on a subject and grows away from them; trails fade', () => {
    const tr = new Tracker(), p = new Party(shared, 'void main(){}');
    let t = 0;
    for (let i = 0; i < 12; i++) p.update(frame(tr, [0], (t += 33)), 0.033, t / 1000, 16 / 9);
    const fx = (p as unknown as { fxData: Uint8Array; fw: number; fh: number });
    const at = (x: number, y: number, ch: number) => fx.fxData[(Math.floor(y * fx.fh) * fx.fw + Math.floor(x * fx.fw)) * 4 + ch]!;
    expect(at(0.5, 0.45, 0)).toBe(0);              // the torso
    expect(at(0.05, 0.5, 0)).toBeGreaterThan(60);  // the frame's edge, far off
    expect(at(0.5, 0.45, 1)).toBeGreaterThan(240); // trail full where they stand
    for (let i = 0; i < 60; i++) p.update(tr.update([], (t += 33), K), 0.033, t / 1000, 16 / 9);
    expect(at(0.5, 0.45, 1)).toBeLessThan(100); // 1.1 s decay after a 0.35 s fade: ~0.2 left at 2 s
  });
});
