// Offline: the tracker's Kalman noise settings swept over recorded clips (scripts/pose-record.mjs), each setting scored
// against the EMA it replaces, signal by signal, as ratios (under 1: better): the RMS error against what the person
// did (a centred smoothing of the raw), the jerk (RMS second difference), the biggest frame-to-frame jump. Prints the
// best settings. Skipped unless STAB=<a.json,b.json>.    STAB=... npx vitest run scripts/kalman-tune.test.ts
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
const gauss = (xs: number[], sigma = 3) => xs.map((_, i) => {
  let a = 0, w = 0;
  for (let k = -3 * sigma; k <= 3 * sigma; k++) { const j = i + k; if (j < 0 || j >= xs.length) continue; const g = Math.exp(-(k * k) / (2 * sigma * sigma)); a += xs[j]! * g; w += g; }
  return a / w;
});
const rms = (xs: number[]) => Math.sqrt(xs.reduce((a, b) => a + b * b, 0) / Math.max(1, xs.length));
const jerk = (xs: number[]) => rms(xs.slice(2).map((x, i) => x - 2 * xs[i + 1]! + xs[i]!));
const unwrap = (xs: number[]) => { const o = [...xs]; for (let i = 1; i < o.length; i++) { while (o[i]! - o[i - 1]! > 180) o[i]! -= 360; while (o[i]! - o[i - 1]! < -180) o[i]! += 360; } return o; };

function signals(world: LM[], T: { x: number; y: number; z: number }, K: Intrinsics): number[] {
  const p = poseFromLandmarks(world);
  const e = (q: THREE.Quaternion) => new THREE.Euler().setFromQuaternion(q, 'YXZ');
  const c = e(p.chest), h = e(p.head);
  const proj = (x: number, y: number, z: number) => [K.cx + (K.f * (T.x + x)) / -(T.z + z), K.cy - (K.f * (T.y + y)) / -(T.z + z)];
  const sh = proj((world[L.shL]!.x + world[L.shR]!.x) / 2, (world[L.shL]!.y + world[L.shR]!.y) / 2, (world[L.shL]!.z + world[L.shR]!.z) / 2);
  const no = proj(world[L.nose]!.x, world[L.nose]!.y, world[L.nose]!.z);
  return [sh[0]!, sh[1]!, no[1]!, -T.z * 100, deg(c.y), deg(c.x), deg(h.y), deg(Math.atan2(p.dir.armL.y, p.dir.armL.x)), deg(Math.atan2(p.dir.armR.y, -p.dir.armR.x))];
}
const NAMES = ['shX', 'shY', 'noseY', 'depth', 'chestYaw', 'chestPitch', 'headYaw', 'armL', 'armR'];
const ANG = [4, 5, 6, 7, 8];

/** per clip and person: [err, jerk, step] per signal */
function run(recs: Rec[], tune: Partial<typeof TUNE>): Map<string, number[][]> {
  const saved = { ...TUNE };
  Object.assign(TUNE, tune);
  const K = guessIntrinsics(recs[0]!.w, recs[0]!.h, 0.85);
  const tr = new Tracker();
  const raw = new Map<number, number[][]>(), out = new Map<number, number[][]>();
  for (const r of recs) {
    tr.update(r.dets, r.now, K);
    for (const t of tr.tracks) {
      if (t.lost || !t.det) continue;

      const Tr = solveTranslation(t.det.world, t.det.image, K);
      if (!Tr) continue;
      if (!raw.has(t.id)) { raw.set(t.id, []); out.set(t.id, []); }
      raw.get(t.id)!.push(signals(t.det.world, Tr, K));
      out.get(t.id)!.push(signals(t.world, t.T, K));
    }
  }
  Object.assign(TUNE, saved);
  const res = new Map<string, number[][]>();
  for (const [id, rs] of raw) {
    if (rs.length < 20) continue;
    const os = out.get(id)!;
    res.set(String(id), NAMES.map((_, k) => {
      const un = ANG.includes(k) ? unwrap : (x: number[]) => x;
      const r = un(rs.map((s) => s[k]!)), o = un(os.map((s) => s[k]!)), truth = gauss(r);
      return [rms(o.map((x, i) => x - truth[i]!)), jerk(o), Math.max(...o.slice(1).map((x, i) => Math.abs(x - o[i]!)))];
    }));
  }
  return res;
}



describe.skipIf(!files.length)('kalman tuning (replay)', () => {
  it('sweeps', () => {
    const clips = files.map((f) => ({ name: f.split('/').pop()!, recs: JSON.parse(readFileSync(f, 'utf8')) as Rec[] }));
    const base = clips.map((c) => run(c.recs, { filter: 'ema', upright: false }));
    const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]!; };
    const results: { tune: Partial<typeof TUNE>; err: number; jerk: number; step: number; label: string }[] = [];
    const tunes: [string, Partial<typeof TUNE>][] = [];
    // the EMA slowed down, for the trade-off it makes on its own
    for (const s of [1, 1.25, 1.5, 2, 3]) tunes.push([`ema ×${s}`, { filter: 'ema', upright: false, tauWorld: TUNE.tauWorld * s, tauImage: TUNE.tauImage * s, tauCore: TUNE.tauCore * s, tauZ: TUNE.tauZ * s }]);
    // the EMA ×1.5 on the points with the depth through a Kalman filter
    for (const qd of [0.01, 0.03, 0.1, 0.3, 1]) for (const rd of [0.03, 0.06]) tunes.push([`ema ×1.5 + kalman depth q ${qd} r ${rd}`, { filter: 'ema', upright: false, tauWorld: TUNE.tauWorld * 1.5, tauImage: TUNE.tauImage * 1.5, tauCore: TUNE.tauCore * 1.5, tauZ: TUNE.tauZ * 1.5, kalmanDepth: true, qDepth: qd, rDepth: rd, gate: 4 }]);
    if (!process.env.FULL) {} else for (const qw of [0.015, 0.05, 0.15, 0.5]) for (const core of [0.15, 0.4]) for (const qi of [0.002, 0.006, 0.02]) for (const gate of [3, 6]) for (const qd of [0.05, 0.3]) {
      tunes.push([`kalman qWorld ${qw}/${(qw * core).toFixed(4)} qImage ${qi}/${(qi * core).toFixed(4)} gate ${gate} qDepth ${qd}`, { filter: 'kalman', upright: false, qWorldLimb: qw, qWorldCore: qw * core, qImageLimb: qi, qImageCore: qi * core, gate, qDepth: qd }]);
    }
    for (const [label, tune] of tunes) {
      const ratios: number[][] = [[], [], []];
      clips.forEach((c, ci) => {
        const r = run(c.recs, tune);
        for (const [id, sig] of r) {
          const b = base[ci]!.get(id);
          if (!b) continue;
          sig.forEach((m, k) => m.forEach((v, j) => { const bv = b[k]![j]!; if (bv > 1e-6) ratios[j]!.push(v / bv); }));
        }
      });
      results.push({ tune, label, err: median(ratios[0]!), jerk: median(ratios[1]!), step: median(ratios[2]!) });
    }
    // the trade-off curve: settings no other beats on both error and jerk
    const front = results.filter((a) => !results.some((b) => b !== a && b.err <= a.err && b.jerk <= a.jerk && (b.err < a.err || b.jerk < a.jerk)));
    front.sort((a, b) => a.err - b.err);
    console.log('the front (none better on both):');
    for (const r of front) console.log(`  err ×${r.err.toFixed(2)} jerk ×${r.jerk.toFixed(2)} jump ×${r.step.toFixed(2)} · ${r.label}`);
    console.log('depth through Kalman (signal 3, the costume\'s size) vs ema ×1.5:');
    console.log('the EMA slowed:');
    for (const r of results.filter((x) => x.label.startsWith('ema'))) console.log(`  err ×${r.err.toFixed(2)} jerk ×${r.jerk.toFixed(2)} jump ×${r.step.toFixed(2)} · ${r.label}`);
  });
});
