// Offline: how a person is sized in each kind of shot. Clips recorded frame by frame through the real pose model
// (scripts/pose-record.mjs) replayed through the tracker and posed as the stage poses a costume; the largest person.
// Skipped unless BODY=<a.json,b.json>.        BODY=selfie.json,street.json npx vitest run scripts/body-sim.test.ts  (C=)
//
// Per clip: the torso the app sizes by (median, metres) and how much it moves frame to frame (RMS, %); and the costume's
// shoulders on screen against the person's (the shoulder joints projected, against the picture's shoulders): the same
// share in every kind of shot means a costume fits a selfie as it fits a full body.
import { describe, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { Tracker, type Detection } from '../src/pose/tracker';
import { guessIntrinsics } from '../src/pose/solve';
import { Rig, poseFromLandmarks } from '../src/pose/rig';
import { skeleton } from '../src/characters/build';
import { ROSTER } from '../src/characters/roster';
import { L } from '../src/pose/landmarks';
import { BODY_TUNE } from '../src/pose/body';

interface Rec { i: number; now: number; w: number; h: number; dets: Detection[] }
const files = (process.env.BODY ?? '').split(',').filter(Boolean);
const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s[s.length >> 1] ?? NaN; };

describe.skipIf(!files.length)('sizing by shot (replay)', () => {
  it('sizes', () => {
    // DRIFT= tries the size filter's drift a second
    if (process.env.DRIFT) BODY_TUNE.drift = Number(process.env.DRIFT);
    const def = ROSTER.find((d) => d.id === (process.env.C ?? 'skeleton'))!;
    const rows: string[] = [];
    for (const file of files) {
      const recs = JSON.parse(readFileSync(file, 'utf8')) as Rec[];
      const K = guessIntrinsics(recs[0]!.w, recs[0]!.h, 0.85);
      const { bones, root: rootBone } = skeleton(def.segs);
      const rig = new Rig(def.segs, bones), root = new THREE.Group();
      root.add(rootBone);
      const tr = new Tracker(), torso: number[] = [], fit: number[] = [], phase: { hips: boolean; torso: number; fit: number }[] = [];
      let id = -1;
      for (const r of recs) {
        tr.update(r.dets, r.now, K, new THREE.Vector3(0, 1, 0));
        const live = tr.tracks.filter((k) => !k.lost && k.det);
        if (id < 0 && live.length) id = live.sort((a, b) => b.len.torso / -b.T.z - a.len.torso / -a.T.z)[0]!.id;
        const t = live.find((k) => k.id === id);
        if (!t || !t.det) continue;
        torso.push(t.len.torso);
        const im = t.det.image;
        if (Math.min(im[L.shL]!.v, im[L.shR]!.v) < 0.8) continue;
        rig.apply(poseFromLandmarks(t.world));
        root.position.set(t.T.x, t.T.y, t.T.z);
        root.scale.setScalar(t.len.torso / rig.torso);
        root.updateMatrixWorld(true);
        const px = (b: string) => { const p = new THREE.Vector3().setFromMatrixPosition(rig.bones.get(b)!.matrixWorld); return [K.cx + (K.f * p.x) / -p.z, K.cy - (K.f * p.y) / -p.z]; };
        const [ax, ay] = px('armL'), [bx, by] = px('armR');
        const person = Math.hypot((im[L.shL]!.x - im[L.shR]!.x) * K.w, (im[L.shL]!.y - im[L.shR]!.y) * K.h);
        if (person > 4) {
          fit.push(Math.hypot(ax! - bx!, ay! - by!) / person);
          phase.push({ hips: Math.min(im[L.hipL]!.v, im[L.hipR]!.v) > 0.8 && im[L.hipL]!.y < 0.95, torso: t.len.torso, fit: fit.at(-1)! });
        }
      }
      const steps = torso.slice(1).map((x, i) => Math.log(x / torso[i]!));
      const rms = Math.sqrt(steps.reduce((a, b) => a + b * b, 0) / Math.max(1, steps.length)) * 100;
      // the same person as the view changes: with their hips seen, and with them out of the picture
      const by = (h: boolean) => { const q = phase.filter((p) => p.hips === h); return q.length ? `${median(q.map((p) => p.torso)).toFixed(3)} m, shoulders ${median(q.map((p) => p.fit)).toFixed(2)}× (${q.length})` : '—'; };
      if (phase.some((p) => p.hips) && phase.some((p) => !p.hips)) rows.push(`${''.padEnd(20)} hips seen: ${by(true)} · hips out: ${by(false)}`);
      rows.push(`${file.split('/').pop()!.padEnd(20)} torso ${median(torso).toFixed(3)} m (moves ${rms.toFixed(2)} % a frame) · costume shoulders ${median(fit).toFixed(2)}× the person's (${fit.length} frames)`);
    }
    console.log(`\n${def.id}\n${rows.join('\n')}`);
  });
});
