// Offline: a phone's debug recording (settings → Advanced → Video metadata) replayed. Its raw detections go through the
// tracker as it is now, from where the phone's tracker stood when the clip began (its state is in the log), handed
// exactly what the phone's was (the frame's time, the lens, the floor's up, the People count), and what comes out is compared with what the phone's tracker made at the time: the same code gives the same
// tracks (to the log's rounding), and a change since shows as a difference, frame by frame. Prints what the recording
// holds first: the build, the device, the camera, the people and what the tracker said of them.
// Skipped unless META=<…-debug.zip | …-meta.json>.          META=costuma-…-debug.zip npx vitest run scripts/meta-replay.test.ts
import { describe, it } from 'vitest';
import * as THREE from 'three';
import { Tracker, setSmoothing } from '../src/pose/tracker';
import { guessIntrinsics } from '../src/pose/solve';
import { loadRecording } from './recs';

const file = process.env.META ?? '';
type Logged = { id: number; costume: string; presence: number; lost: boolean; verdict: string; T: number[]; len: { torso: number }; image: number[][]; world: number[][] };
const q = (xs: number[], p: number) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))]! : NaN; };

describe.skipIf(!file)('a debug recording, replayed', () => {
  it(file, () => {
    const { recs, info } = loadRecording(file);
    const i = (info ?? {}) as Record<string, unknown> & { settings?: Record<string, unknown>; video?: { w: number; h: number } };
    const dur = recs.length > 1 ? (recs.at(-1)!.now - recs[0]!.now) / 1000 : 0;
    console.log(`\n${file.split('/').pop()}\n build ${i.build} · ${i.ua}\n camera ${i.facing} ${i.video?.w}×${i.video?.h} zoom ${i.zoom} · ${recs.length} frames over ${dur.toFixed(1)} s (${(recs.length / Math.max(dur, 1e-3)).toFixed(1)} a second)`);
    if (i.settings) { const s = i.settings; console.log(` settings: model ${s.model}, people ${s.people}, smoothing ${s.smoothing}, threshold ${s.poseConf}, lens ${s.lens}, occlusion ${s.occlusion}, scene ${s.scene}, costume ${s.costume}`); }
    // what the phone's tracker said, per track
    const seen = new Map<number, { frames: number; verdicts: Record<string, number>; torso: number[]; costume: string }>();
    for (const r of recs) for (const t of (r.tracks ?? []) as Logged[]) {
      const e = seen.get(t.id) ?? { frames: 0, verdicts: {}, torso: [], costume: t.costume };
      e.frames++; e.verdicts[t.verdict] = (e.verdicts[t.verdict] ?? 0) + 1; e.torso.push(t.len.torso);
      seen.set(t.id, e);
    }
    for (const [id, e] of seen) console.log(` track ${id} (${e.costume}): ${e.frames} frames · ${Object.entries(e.verdicts).map(([k, v]) => `${k} ${v}`).join(', ')} · torso ${q(e.torso, 0.05).toFixed(3)}–${q(e.torso, 0.95).toFixed(3)} m`);
    console.log(` detections a frame: ${recs.map((r) => r.dets.length).join('')}`);
    // the replay: today's tracker on the phone's inputs
    // from where the phone's tracker stood when the clip began, with its smoothing setting
    const tr = new Tracker(), dT: number[] = [], dW: number[] = [], dI: number[] = [], missing = { now: 0, then: 0 };
    if (i.tracker) tr.restore(i.tracker as never);
    if (typeof i.settings?.smoothing === 'number') setSmoothing(i.settings.smoothing);
    let firstDiff = -1;
    for (const r of recs) {
      const K = r.K ?? guessIntrinsics(r.w, r.h, 0.85), up = r.up ? new THREE.Vector3(r.up.x, r.up.y, r.up.z) : new THREE.Vector3(0, 1, 0);
      tr.update(r.dets.slice(0, r.people ?? r.dets.length), r.now, K, up);
      const logged = (r.tracks ?? []) as Logged[];
      for (const t of logged) {
        const n = tr.tracks.find((k) => k.id === t.id);
        if (!n) { missing.now++; continue; }
        const d = Math.hypot(n.T.x - t.T[0]!, n.T.y - t.T[1]!, n.T.z - t.T[2]!) * 100;
        let w = 0, im = 0;
        for (let j = 0; j < n.world.length; j++) {
          w += Math.hypot(n.world[j]!.x - t.world[j]![0]!, n.world[j]!.y - t.world[j]![1]!, n.world[j]!.z - t.world[j]![2]!);
          im += Math.hypot((n.image[j]!.x - t.image[j]![0]!) * K.w, (n.image[j]!.y - t.image[j]![1]!) * K.h);
        }
        dT.push(d); dW.push((w / n.world.length) * 100); dI.push(im / n.image.length);
        if (firstDiff < 0 && (d > 0.05 || im / n.image.length > 0.5)) firstDiff = r.i;
      }
      for (const n of tr.tracks) if (!logged.some((t) => t.id === n.id)) missing.then++;
    }
    console.log(` replayed through today's tracker against the phone's: hips ${q(dT, 0.5).toFixed(3)} cm median, ${q(dT, 0.99).toFixed(3)} at the 99th · 3D pose ${q(dW, 0.5).toFixed(3)} / ${q(dW, 0.99).toFixed(3)} cm · picture ${q(dI, 0.5).toFixed(2)} / ${q(dI, 0.99).toFixed(2)} px` +
      ` · tracks only the phone had ${missing.now}, only the replay ${missing.then}${firstDiff >= 0 ? ` · first difference at frame ${firstDiff}` : ' · the same'}`);
  });
});
