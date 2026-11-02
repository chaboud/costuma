// Offline: how the cloth moves on recorded people (scripts/pose-record.mjs clips) — the real ghost and witch built, posed
// as the stage poses them (retarget, root at the hips, the fitted scale, the reach), their cloth stepped each frame.
// Skipped unless CLOTH=<a.json,b.json>.        CLOTH=torso-still.json,street.json npx vitest run scripts/cloth-sim.test.ts
//
// Per clip and piece of cloth: the hem's swing (the largest particle's, % of the costume's height) — its median, its 95th
// percentile, and how much it changes frame to frame. Still clips say how much the tracker's tremble shakes the cloth;
// a walk, how much it swings. (The swing a person sees is this share of their costume's height on screen.)
import { describe, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { Tracker, type Detection } from '../src/pose/tracker';
import { guessIntrinsics } from '../src/pose/solve';
import { Rig, poseFromLandmarks } from '../src/pose/rig';
import { reachLimbs } from '../src/pose/reach';
import { buildCharacter } from '../src/characters/build';
import { GHOST } from '../src/characters/ghost';
import { WITCH } from '../src/characters/witch';
import { ClothSway } from '../src/characters/cloth';

interface Rec { i: number; now: number; w: number; h: number; dets: Detection[] }
const files = (process.env.CLOTH ?? '').split(',').filter(Boolean);
const q = (xs: number[], p: number) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))] ?? NaN; };

describe.skipIf(!files.length)('cloth on recorded people (replay)', () => {
  it('swing', () => {
    const rows: string[] = [];
    for (const def of [GHOST, WITCH]) {
      const built = buildCharacter(def, 48);
      for (const file of files) {
        const recs = JSON.parse(readFileSync(file, 'utf8')) as Rec[];
        const K = guessIntrinsics(recs[0]!.w, recs[0]!.h, 0.85);
        const root = built.root.clone(true);
        const bones = new Map<string, THREE.Bone>();
        root.traverse((o) => { if ((o as THREE.Bone).isBone) bones.set(o.name, o as THREE.Bone); });
        // SkinnedMesh.clone keeps the template's skeleton: rebind each to the clone's bones
        root.traverse((o) => { const m = o as THREE.SkinnedMesh; if (m.isSkinnedMesh) m.bind(new THREE.Skeleton(m.skeleton.bones.map((b) => bones.get(b.name)!), m.skeleton.boneInverses), m.bindMatrix); });
        const rig = new Rig(def.segs, bones), cloth = new ClothSway(root, def.cloth!);
        const tr = new Tracker(), sw: number[][] = [];
        let id = -1, last = -1;
        for (const r of recs) {
          tr.update(r.dets, r.now, K, new THREE.Vector3(0, 1, 0));
          const live = tr.tracks.filter((k) => !k.lost && k.det);
          if (id < 0 && live.length) id = live.sort((a, b) => b.len.torso / -b.T.z - a.len.torso / -a.T.z)[0]!.id;
          const t = live.find((k) => k.id === id);
          if (!t) continue;
          const dt = last < 0 ? 1 / 30 : (r.now - last) / 1000;
          last = r.now;
          rig.apply(poseFromLandmarks(t.world), r.now / 1000, 0, dt);
          root.position.set(t.T.x, t.T.y, t.T.z);
          root.scale.setScalar((t.len.torso / rig.torso) * (def.fit?.size ?? 1));
          reachLimbs(rig, root, t.image, K);
          cloth.update(root, dt);
          sw.push(cloth.swing().map((x) => (100 * x) / 20));
        }
        def.cloth!.forEach((c, j) => {
          const s = sw.slice(10).map((v) => v[j]!), steps = s.slice(1).map((x, i) => Math.abs(x - s[i]!));
          rows.push(`${def.id.padEnd(6)} ${c.meshes[0]!.padEnd(12)} ${file.split('/').pop()!.padEnd(20)} swing median ${q(s, 0.5).toFixed(2)} %, p95 ${q(s, 0.95).toFixed(2)} %, frame to frame ${q(steps, 0.5).toFixed(3)} % (p95 ${q(steps, 0.95).toFixed(3)})`);
        });
      }
    }
    console.log(`\nthe hem's swing, % of the costume's height\n${rows.join('\n')}`);
  });
});
