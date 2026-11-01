// Offline: clips recorded frame by frame through the real pose model (scripts/pose-record.mjs) replayed through the
// tracker in several configurations, measuring what the costume would do. Skipped unless STAB=<a.json,b.json>.
//   STAB=torso-hand.json,street.json npx vitest run scripts/stability-sim.test.ts      INJECT=1: flips injected
//
// Per tracked person, per configuration:
//  - lean: the torso's tilt toward or away from the camera (the depth the model guesses: "horizontal humans"), frames
//    past 45° from a level camera's up;
//  - jumpiness: each signal against a non-causal smoothing of the raw signal (centred, σ 3 frames: what the person did,
//    give or take) as the RMS error (lag and jitter together) / the RMS second difference (jerk): the hips on screen
//    (px), their depth (cm), the chest's and head's turn and the upper arms (°).
// INJECT=1 tips the raw 3D pose 80° toward the camera about the hips for frames 40–45 and 80–82 (the picture left as
// it was): what a depth flip looks like. The truth stays the uninjected raw.
import { describe, it } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { Tracker, TUNE, type Detection } from '../src/pose/tracker';
import { guessIntrinsics, solveTranslation, type Intrinsics } from '../src/pose/solve';
import { poseFromLandmarks } from '../src/pose/rig';
import { L, type LM } from '../src/pose/landmarks';

interface Rec { i: number; now: number; w: number; h: number; dets: Detection[] }
const files = (process.env.STAB ?? '').split(',').filter(Boolean);
const deg = THREE.MathUtils.radToDeg;
const UP = new THREE.Vector3(0, 1, 0);

function lean(w: LM[]): number {
  const mid = (a: number, b: number) => new THREE.Vector3((w[a]!.x + w[b]!.x) / 2, (w[a]!.y + w[b]!.y) / 2, (w[a]!.z + w[b]!.z) / 2);
  const t = mid(L.shL, L.shR).sub(mid(L.hipL, L.hipR)).normalize();
  return deg(Math.atan2(t.z, t.y));
}
const gauss = (xs: number[], sigma = 3) => xs.map((_, i) => {
  let a = 0, w = 0;
  for (let k = -3 * sigma; k <= 3 * sigma; k++) { const j = i + k; if (j < 0 || j >= xs.length) continue; const g = Math.exp(-(k * k) / (2 * sigma * sigma)); a += xs[j]! * g; w += g; }
  return a / w;
});
const rms = (xs: number[]) => Math.sqrt(xs.reduce((a, b) => a + b * b, 0) / Math.max(1, xs.length));
const jerk = (xs: number[]) => rms(xs.slice(2).map((x, i) => x - 2 * xs[i + 1]! + xs[i]!));
/** angles unwrapped so a step across ±180° is not a jump */
const unwrap = (xs: number[]) => { const o = [...xs]; for (let i = 1; i < o.length; i++) { while (o[i]! - o[i - 1]! > 180) o[i]! -= 360; while (o[i]! - o[i - 1]! < -180) o[i]! += 360; } return o; };

/** what shows: the shoulders' middle and the nose on screen (px; where the costume's chest and head are drawn), the
 *  hips' depth (cm: the costume's size), the chest's and head's turn, the upper arms (°) */
function signals(world: LM[], T: { x: number; y: number; z: number }, K: Intrinsics) {
  const p = poseFromLandmarks(world);
  const e = (q: THREE.Quaternion) => new THREE.Euler().setFromQuaternion(q, 'YXZ');
  const c = e(p.chest), h = e(p.head);
  const proj = (x: number, y: number, z: number) => [K.cx + (K.f * (T.x + x)) / -(T.z + z), K.cy - (K.f * (T.y + y)) / -(T.z + z)] as const;
  const sm = (a: number, b: number) => proj((world[a]!.x + world[b]!.x) / 2, (world[a]!.y + world[b]!.y) / 2, (world[a]!.z + world[b]!.z) / 2);
  const [shX, shY] = sm(L.shL, L.shR), [noseX, noseY] = proj(world[L.nose]!.x, world[L.nose]!.y, world[L.nose]!.z);
  return { shX, shY, noseX, noseY, depth: -T.z * 100, chestYaw: deg(c.y), chestPitch: deg(c.x),
    headYaw: deg(h.y), headPitch: deg(h.x), armL: deg(Math.atan2(p.dir.armL.y, p.dir.armL.x)), armR: deg(Math.atan2(p.dir.armR.y, -p.dir.armR.x)) };
}
type Sig = ReturnType<typeof signals>;
const KEYS: (keyof Sig)[] = ['shX', 'shY', 'noseY', 'depth', 'chestYaw', 'chestPitch', 'headYaw', 'armL', 'armR'];
const ANGLE = new Set<keyof Sig>(['chestYaw', 'chestPitch', 'headYaw', 'headPitch', 'armL', 'armR']);

function tip(w: LM[], a: number): LM[] {
  const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), a);
  return w.map((p) => { const v = new THREE.Vector3(p.x, p.y, p.z).applyQuaternion(q); return { x: v.x, y: v.y, z: v.z, v: p.v }; });
}

const score: Record<string, number> = {};
const OLD: Partial<typeof TUNE> = { filter: 'ema', kalmanDepth: false, tauWorld: 0.045, tauImage: 0.035, tauCore: 0.09, tauZ: 0.14, pin: false };
const NOW: Partial<typeof TUNE> = { upright: true, pin: true, hold: false };
const ALL: [string, Partial<typeof TUNE>][] = [
  ['before', { ...OLD, upright: false, hold: false }],
  ['smooth', { upright: false, pin: false, hold: false }],
  ['both', { upright: true, pin: false, hold: false }],
  ['pinned', NOW],
  ['ema×2', { ...NOW, tauWorld: TUNE.tauWorld * 2, tauImage: TUNE.tauImage * 2, tauCore: TUNE.tauCore * 2, tauZ: TUNE.tauZ * 2 }],
  ['hold', { ...NOW, hold: true, follow: 'hold' }],
  ['motor', { ...NOW, hold: true, follow: 'motor' }],
  ['motor6', { ...NOW, hold: true, follow: 'motor', motorCore: 6, motorLimb: 9 }],
  ['motor16', { ...NOW, hold: true, follow: 'motor', motorCore: 16, motorLimb: 22 }],
  ['motorB2', { ...NOW, hold: true, follow: 'motor', smoothBand: 2 }],
  ['steady', { ...NOW, hold: true, follow: 'motor', smoothTau: 1.5, smoothBand: 1.5, smoothW: 0.75 }],
  ['s0', { ...NOW, hold: true, follow: 'motor', smoothW: 2, smoothBand: 0.7, smoothTau: 0.8 }],
  ['s0.5', { ...NOW, hold: true, follow: 'motor', smoothW: 1.275, smoothBand: 1.35, smoothTau: 1.2 }],
  ['s1', { ...NOW, hold: true, follow: 'motor', smoothW: 0.55, smoothBand: 2, smoothTau: 1.6 }],
  ['s0.5nb', { ...NOW, hold: true, follow: 'motor', smoothW: 1.275, smoothBand: 1.35, smoothTau: 1.2, motorBoost: 0 }],
  ['hold×2', { ...NOW, hold: true, holdWorldCore: TUNE.holdWorldCore * 2, holdWorldLimb: TUNE.holdWorldLimb * 2, holdImageCore: TUNE.holdImageCore * 2, holdImageLimb: TUNE.holdImageLimb * 2 }],
];
const CONFIGS = process.env.CONF ? ALL.filter(([n]) => process.env.CONF!.split(',').includes(n)) : ALL;

describe.skipIf(!files.length)('stability (replay)', () => {
  for (const file of files) it(file, () => {
    const recs = JSON.parse(readFileSync(file, 'utf8')) as Rec[];
    const K = guessIntrinsics(recs[0]!.w, recs[0]!.h, 0.85);
    const inject = !!process.env.INJECT;
    console.log(`\n${file.split('/').pop()}: ${recs.length} frames, ${recs[0]!.w}×${recs[0]!.h}${inject ? ' · flips injected' : ''}`);
    const table = new Map<number, string[]>();
    for (const [name, tune] of CONFIGS) {
      const saved = { ...TUNE };
      Object.assign(TUNE, tune, Object.fromEntries(Object.entries(process.env).filter(([k]) => k.startsWith('T_')).map(([k, v]) => [k.slice(2), Number(v)])));
      const tr = new Tracker();
      const per = new Map<number, { raw: Sig[]; out: Sig[]; lean: number[]; rawLean: number[]; verdicts: Record<string, number> }>();
      for (const r of recs) {
        const dets = inject && ((r.i >= 40 && r.i <= 45) || (r.i >= 80 && r.i <= 82)) ? r.dets.map((d) => ({ ...d, world: tip(d.world, -1.4) })) : r.dets;
        tr.update(dets, r.now, K, UP);
        for (const t of tr.tracks) {
          if (t.lost || !t.det) continue;
          const di = dets.indexOf(t.det), orig = r.dets[di];
          if (!orig) continue;
          const Tr = solveTranslation(orig.world, orig.image, K);
          if (!Tr) continue;
          let q = per.get(t.id);
          if (!q) per.set(t.id, q = { raw: [], out: [], lean: [], rawLean: [], verdicts: {} });
          q.raw.push(signals(orig.world, Tr, K));
          q.out.push(signals(t.world, t.T, K));
          q.lean.push(lean(t.world));
          q.rawLean.push(lean(t.det.world));
          q.verdicts[t.verdict] = (q.verdicts[t.verdict] ?? 0) + 1;
        }
      }
      Object.assign(TUNE, saved);
      for (const [id, q] of per) {
        if (q.raw.length < 20) continue;
        const over = (xs: number[]) => xs.filter((x) => Math.abs(x) > 45).length;
        const parts = KEYS.map((k) => {
          const un = ANGLE.has(k) ? unwrap : (x: number[]) => x;
          const r = un(q.raw.map((s) => s[k])), o = un(q.out.map((s) => s[k])), truth = gauss(r);
          const step = Math.max(...o.slice(1).map((x, i) => Math.abs(x - o[i]!)));
          score[k] = (score[k] ?? 0) + jerk(o);
          // the error, the jerk, the biggest jump, and the frame-to-frame movement (RMS: the shake when still)
          const vel = rms(o.slice(1).map((x, i) => x - o[i]!));
          return `${k} ${rms(o.map((x, i) => x - truth[i]!)).toFixed(1)}/${jerk(o).toFixed(1)}/${step.toFixed(0)}/${vel.toFixed(2)}`;
        });
        const rows = table.get(id) ?? [];
        if (!rows.length) rows.push(` person ${id}: ${q.raw.length} frames · raw lean past 45°: ${over(q.rawLean)} frames`);
        rows.push(`  ${name.padEnd(8)} past 45°: ${String(over(q.lean)).padStart(3)} · ${parts.join('  ')} · ${Object.entries(q.verdicts).map(([k, v]) => `${k} ${v}`).join(', ')}`);
        table.set(id, rows);
      }
    }
    for (const rows of table.values()) console.log(rows.join('\n'));
  });
});
