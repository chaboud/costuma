// Offline: does the costume stay on a person when the camera shakes in the hand? Real MediaPipe noise (a noisy still,
// scripts/jitter-probe.mjs) plus a synthetic hand tremor (the whole image moving: 5 and 9 Hz tremor, a slow drift),
// replayed at 30 fps through the tracker. Reports how far the costume's hips land from where the person's are (px of
// a 720-wide frame, RMS) and how much the limbs still jitter. Skipped unless JITTER=<file.json>.
//   JITTER=jitter-noisy.json npx vitest run scripts/shake-sim.test.ts
import { describe, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { Tracker, TUNE } from '../src/pose/tracker';
import { project, type Intrinsics } from '../src/pose/solve';
import { poseFromLandmarks } from '../src/pose/rig';
import { L } from '../src/pose/landmarks';
import type { Detection } from '../src/pose/tracker';

const file = process.env.JITTER;
const sd = (xs: number[]) => { const m = xs.reduce((a, b) => a + b, 0) / xs.length; return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length); };
const rms = (xs: number[]) => Math.sqrt(xs.reduce((a, b) => a + b * b, 0) / xs.length);

describe.skipIf(!file)('hand shake (replay)', () => {
  it('reports', () => {
    const raw = JSON.parse(readFileSync(file!, 'utf8')) as { K: Intrinsics; dets: Detection[] }[];
    const frames = raw.filter((r) => r.dets.length).map((r) => ({ K: r.K, det: r.dets[0]! }));
    const K = frames[0]!.K;
    // the still's own landmarks: their mean is the truth before the shake moves it
    const base = frames[0]!.det.image.map((_, j) => ({ x: frames.reduce((a, f) => a + f.det.image[j]!.x, 0) / frames.length, y: frames.reduce((a, f) => a + f.det.image[j]!.y, 0) / frames.length }));
    const shake = (i: number) => { const t = i / 30; return { x: 0.006 * Math.sin(2 * Math.PI * 5 * t) + 0.004 * Math.sin(2 * Math.PI * 9 * t + 1) + 0.012 * Math.sin(2 * Math.PI * 0.7 * t), y: 0.005 * Math.sin(2 * Math.PI * 6 * t + 2) + 0.004 * Math.sin(2 * Math.PI * 8.5 * t) + 0.01 * Math.sin(2 * Math.PI * 0.5 * t + 1) }; };
    const run = (label: string, tune: Partial<typeof TUNE>) => {
      const saved = { ...TUNE };
      Object.assign(TUNE, tune);
      const tr = new Tracker();
      const err: number[] = [], arm: number[] = [], head: number[] = [];
      const n = frames.length * 4;
      for (let i = 0; i < n; i++) {
        const f = frames[i % frames.length]!, s = shake(i);
        const det: Detection = { world: f.det.world, image: f.det.image.map((p) => ({ ...p, x: p.x + s.x, y: p.y + s.y })) };
        tr.update([det], (i + 1) * 33.3, K);
        const t = tr.tracks[0];
        if (!t || i < frames.length) continue;
        // where the costume's hips are drawn, against where the person's hips are in this frame
        const hp = project(t.T, K);
        const truth = { x: (base[L.hipL]!.x + base[L.hipR]!.x) / 2 + s.x, y: (base[L.hipL]!.y + base[L.hipR]!.y) / 2 + s.y };
        err.push(Math.hypot((hp.x - truth.x) * 720, (hp.y - truth.y) * 720 * (K.h / K.w)));
        const p = poseFromLandmarks(t.world);
        arm.push(THREE.MathUtils.radToDeg(p.dir.armL.angleTo(new THREE.Vector3(1, 0, 0))));
        head.push(THREE.MathUtils.radToDeg(p.head.angleTo(new THREE.Quaternion())));
      }
      // the hips' offset has a constant part (the solve's own bias); the tremble is what varies
      console.log(`${label.padEnd(26)} hips off by ${rms(err).toFixed(1)} px RMS, trembling ${sd(err).toFixed(1)} px · arm jitter ${sd(arm).toFixed(2)}° · head ${sd(head).toFixed(2)}°`);
      Object.assign(TUNE, saved);
    };
    run('tracker (as shipped)', {});
    run('tracker, no smoothing', { tauWorld: 1e-4, tauImage: 1e-4, tauZ: 1e-4, tauCore: 1e-4 });
    run('image 70 ms, depth 200 ms', { tauImage: 0.07, tauZ: 0.2 });
    run('image 100 ms, depth 250 ms', { tauImage: 0.1, tauZ: 0.25 });
  });
});
