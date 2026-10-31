// Offline: the recorded raw detections of a still (scripts/jitter-probe.mjs) replayed through the tracker and the
// retargeter at 30 fps, reporting how much the costume would shake. Skipped unless JITTER=<file.json>.
//   JITTER=jitter.json npx vitest run scripts/jitter-sim.test.ts
import { describe, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { Tracker, TUNE } from '../src/pose/tracker';
import { solveTranslation } from '../src/pose/solve';
import { poseFromLandmarks } from '../src/pose/rig';
import type { Detection } from '../src/pose/tracker';

const file = process.env.JITTER;
const sd = (xs: number[]) => { const m = xs.reduce((a, b) => a + b, 0) / xs.length; return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length); };
const deg = THREE.MathUtils.radToDeg;

function measure(frames: { K: never; det: Detection }[], label: string, run: (d: Detection, i: number) => { T: { x: number; y: number; z: number }; world: Detection['world'] } | null) {
  const tx: number[] = [], ty: number[] = [], tz: number[] = [], arm: number[] = [], fore: number[] = [], yaw: number[] = [], pel: number[] = [];
  const ref = poseFromLandmarks(frames[0]!.det.world);
  frames.forEach((f, i) => {
    const r = run(f.det, i);
    if (!r) return;
    tx.push(r.T.x); ty.push(r.T.y); tz.push(r.T.z);
    const p = poseFromLandmarks(r.world);
    arm.push(deg(p.dir.armL.angleTo(ref.dir.armL))); fore.push(deg(p.dir.forearmL.angleTo(ref.dir.forearmL)));
    yaw.push(deg(p.head.angleTo(ref.head))); pel.push(deg(p.pelvis.angleTo(ref.pelvis)));
  });
  console.log(`${label.padEnd(28)} hips sd x ${(sd(tx) * 100).toFixed(1)} y ${(sd(ty) * 100).toFixed(1)} z ${(sd(tz) * 100).toFixed(1)} cm · upper arm ${sd(arm).toFixed(2)}° forearm ${sd(fore).toFixed(2)}° head ${sd(yaw).toFixed(2)}° pelvis ${sd(pel).toFixed(2)}°`);
}

describe.skipIf(!file)('jitter (replay)', () => {
  it('reports', () => {
    const raw = JSON.parse(readFileSync(file!, 'utf8')) as { K: never; dets: Detection[] }[];
    const frames = raw.filter((r) => r.dets.length).map((r) => ({ K: r.K, det: r.dets[0]! }));
    console.log(`${frames.length} frames of a still`);
    measure(frames, 'raw', (d, i) => { const T = solveTranslation(d.world, d.image, frames[i]!.K); return T ? { T, world: d.world } : null; });
    const run = (label: string, tune: Partial<typeof TUNE>) => {
      const saved = { ...TUNE };
      Object.assign(TUNE, tune);
      const tr = new Tracker();
      // the sequence three times over at 30 fps; measured on the last pass, once the filters have settled
      const seq = [...frames, ...frames, ...frames];
      const outs: { T: { x: number; y: number; z: number }; world: Detection['world'] }[] = [];
      seq.forEach((f, i) => { tr.update([f.det], (i + 1) * 33.3, f.K); const t = tr.tracks[0]; if (t) outs.push({ T: { ...t.T }, world: t.world.map((p) => ({ ...p })) }); });
      const last = outs.slice(-frames.length);
      measure(frames, label, (_d, i) => last[i] ?? null);
      Object.assign(TUNE, saved);
    };
    run('tracker (current)', {});
    run('limbs ×1, core ×2 (shipped?)', { tauCore: 0.09 });
    run('tracker ×2 taus', { tauWorld: TUNE.tauWorld * 2, tauImage: TUNE.tauImage * 2, tauZ: TUNE.tauZ * 2 });
    run('tracker ×3 taus', { tauWorld: TUNE.tauWorld * 3, tauImage: TUNE.tauImage * 3, tauZ: TUNE.tauZ * 3 });
  });
});
