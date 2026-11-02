// Offline: what happens to legs the frame cuts off. A clip recorded frame by frame through the real pose model
// (scripts/pose-record.mjs; e.g. a photo zoomed in from its top, so the frame's bottom edge rises from the feet to the
// chest) replayed through the tracker, the retarget and the reach, as the stage does it, for the largest person.
// Skipped unless LEGS=<a.json>.     LEGS=zoom-man.json npx vitest run scripts/legs-sim.test.ts      (C= character)
//
// Per frame: where the hips, knees and ankles are in the picture (y, 1 the bottom edge) and how visible, then the
// left leg three ways — the model's raw 3D, the tracker's output, the costume's bones after the reach: the thigh's angle
// from the torso's down (0 a straight hip; 90 a knee raised level) and the knee's bend (0 straight).
import { describe, it } from 'vitest';
import { loadRecs } from './recs';
import * as THREE from 'three';
import { Tracker, type Detection } from '../src/pose/tracker';
import { guessIntrinsics } from '../src/pose/solve';
import { Rig, poseFromLandmarks } from '../src/pose/rig';
import { reachLimbs } from '../src/pose/reach';
import { skeleton } from '../src/characters/build';
import { ROSTER } from '../src/characters/roster';
import { L, type LM } from '../src/pose/landmarks';

interface Rec { i: number; now: number; w: number; h: number; dets: Detection[] }
const file = process.env.LEGS ?? '';
const deg = THREE.MathUtils.radToDeg;
const V = (p: LM) => new THREE.Vector3(p.x, p.y, p.z);
const mid = (a: LM, b: LM) => V(a).add(V(b)).multiplyScalar(0.5);

/** the thigh's angle from the torso's down, and the knee's bend, from points */
function legOf(hip: THREE.Vector3, knee: THREE.Vector3, ankle: THREE.Vector3, down: THREE.Vector3) {
  const th = knee.clone().sub(hip).normalize(), sh = ankle.clone().sub(knee).normalize();
  return { thigh: deg(th.angleTo(down)), knee: deg(th.angleTo(sh)) };
}
// SIDE=R for the right leg
const R = process.env.SIDE === 'R';
const HIP = R ? L.hipR : L.hipL, KN = R ? L.knR : L.knL, AN = R ? L.anR : L.anL;
function legW(w: LM[]) {
  const down = mid(w[L.hipL]!, w[L.hipR]!).sub(mid(w[L.shL]!, w[L.shR]!)).normalize();
  return legOf(V(w[HIP]!), V(w[KN]!), V(w[AN]!), down);
}

describe.skipIf(!file)('legs off the frame (replay)', () => {
  it(file, () => {
    const recs = loadRecs(file);
    const K = guessIntrinsics(recs[0]!.w, recs[0]!.h, 0.85);
    const def = ROSTER.find((d) => d.id === (process.env.C ?? 'skeleton'))!;
    const { bones, root: rootBone } = skeleton(def.segs);
    const rig = new Rig(def.segs, bones);
    const root = new THREE.Group();
    root.add(rootBone);
    const tr = new Tracker();
    const rows: string[] = [' frame | hip y v | knee y v | ankle y v | raw thigh/knee | tracked thigh/knee | costume thigh/knee | person thigh/shin m'];
    const g = (b: string) => new THREE.Vector3().setFromMatrixPosition(rig.bones.get(b)!.matrixWorld);
    for (const r of recs) {
      tr.update(r.dets, r.now, K, new THREE.Vector3(0, 1, 0));
      const t = tr.tracks.filter((k) => !k.lost).sort((a, b) => b.len.torso / -b.T.z - a.len.torso / -a.T.z)[0];
      if (!t || !t.det) continue;
      const raw = legW(t.det.world), out = legW(t.world);
      // the costume as the stage poses it: retarget, root at the hips, the scale from the torso, the reach
      rig.apply(poseFromLandmarks(t.world));
      root.position.set(t.T.x, t.T.y, t.T.z);
      root.scale.setScalar(t.len.torso / rig.torso);
      reachLimbs(rig, root, t.image, K);
      root.updateMatrixWorld(true);
      const down = g('pelvis').sub(g('spine2')).normalize();
      // the shin's start is the knee, the foot's the ankle
      const cos = R ? legOf(g('thighR'), g('shinR'), g('footR'), down) : legOf(g('thighL'), g('shinL'), g('footL'), down);
      const im = t.det.image, f = (i: number) => `${im[i]!.y.toFixed(2)} ${im[i]!.v.toFixed(2)}`;
      if (r.i % Number(process.env.EVERY ?? 3) === 0) rows.push(` ${String(r.i).padStart(5)} | ${f(HIP)} | ${f(KN)} | ${f(AN)} | ${raw.thigh.toFixed(0).padStart(4)}/${raw.knee.toFixed(0).padStart(4)} | ${out.thigh.toFixed(0).padStart(4)}/${out.knee.toFixed(0).padStart(4)} | ${cos.thigh.toFixed(0).padStart(4)}/${cos.knee.toFixed(0).padStart(4)} | ${t.len.thigh.toFixed(2)}/${t.len.shin.toFixed(2)}`);
    }
    // the costume's legs as the stage fits them (stage.ts fit): each bone's length against the costume's own, at the end
    const last = tr.tracks.filter((k) => !k.lost)[0];
    if (last) {
      const sc = (last.len.torso / rig.torso) * (def.fit?.size ?? 1), limb = def.fit?.limb ?? 0;
      const k = (bone: string, person: number) => Math.min(1.6, Math.max(0.65, 1 + ((person / sc) / (rig.len.get(bone) ?? 1) - 1) * limb));
      rows.push(` the costume's thigh drawn at ${(100 * k('thighL', last.len.thigh)).toFixed(0)} % of its own, its shin at ${(100 * k('shinL', last.len.shin)).toFixed(0)} % (limb fit ${limb})`);
    }
    console.log(`\n${file.split('/').pop()} · ${def.id}\n${rows.join('\n')}`);
  });
});
