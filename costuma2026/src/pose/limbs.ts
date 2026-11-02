// Limbs the picture does not show well (founder, 2026-11-02, after a debug recording of a woman seated at a patio
// table, her legs behind its chairs: "When we lose or drop to low confidence, higher confidence matches should have
// stronger spatio-temporal pose influence… If we only see one leg it's a good prior for the other… A raised thigh with
// no visible calf should assume a bent knee (more common than a can can dance)").
//
// On that recording, while her knees read 0.8–0.9 visible the model had her thighs 45–70° forward and her knees bent
// (seated); when they fell to ~0.3 the costume's legs went straight down (standing): an unseen bone eased to the costume's
// rest. Now each limb bone keeps a memory of its direction relative to the bone it hangs from (a thigh in the pelvis's
// frame, a shin in its thigh's, an upper arm in the chest's, a forearm in its upper arm's), taken in as fast as the
// picture is sure of it and forgotten over seconds; and under the memory a prior: a hidden leg takes the seen leg's,
// mirrored; a shin whose ankle is not seen hangs toward the ground as far as a knee bends (a thigh forward, the knee
// bent; a thigh down, the leg straight). What is shown is the reading where it is sure, the memory where it is not and
// the memory is fresh, the prior under both — every weight a curve (founder: "no booleans in motion") — and how sure
// that whole is goes to the rig alone (LM.b: the picture's own visibility stays what it was, or the floor stood on
// guessed feet), so a well-founded guess is drawn instead of the rest pose.
import * as THREE from 'three';
import type { LM } from './landmarks';
import { L } from './landmarks';

export const LIMB_TUNE = {
  /** a reading counts from this visibility, fully from the second (the model keeps a hidden, seated leg seated at
   *  ~0.3–0.4: a weak reading, not none) */
  visFrom: 0.15, visTo: 0.7,
  /** seconds: the memory takes in a sure reading, and forgets (2.5 s let a seated woman stand up within two seconds
   *  of her knees going behind a chair) */
  learn: 0.15, forget: 6,
  /** how sure a mirrored leg is, at most (the other leg fully seen and remembered) */
  mirror: 0.75,
  /** how sure a hanging shin is (gravity and the knee's hinge: a good guess, not a reading) */
  hang: 0.6,
  /** the knee bends this far at most (degrees) */
  kneeMax: 150,
  /** a limb whose two ends are seen (a shoulder and a wrist, a hip and an ankle) has its middle pinned between them:
   *  the model's 3D for both its bones counts this much, at most, however unseen the elbow or knee is (an elbow below
   *  the frame's edge with the hand raised in it: a signer's, a selfie's) */
  chain: 0.85,
};

type Seg = 'thighL' | 'thighR' | 'shinL' | 'shinR' | 'armL' | 'armR' | 'forearmL' | 'forearmR';
/** each bone: its joints (from, to), what it hangs from, the joints carried with its far end, its mirror */
const SEGS: { seg: Seg; a: number; b: number; carry: number[]; mirror: Seg }[] = [
  { seg: 'thighL', a: L.hipL, b: L.knL, carry: [L.anL, L.heelL, L.toeL], mirror: 'thighR' },
  { seg: 'thighR', a: L.hipR, b: L.knR, carry: [L.anR, L.heelR, L.toeR], mirror: 'thighL' },
  { seg: 'shinL', a: L.knL, b: L.anL, carry: [L.heelL, L.toeL], mirror: 'shinR' },
  { seg: 'shinR', a: L.knR, b: L.anR, carry: [L.heelR, L.toeR], mirror: 'shinL' },
  { seg: 'armL', a: L.shL, b: L.elL, carry: [L.wrL, L.indexL, L.pinkyL, L.thumbL], mirror: 'armR' },
  { seg: 'armR', a: L.shR, b: L.elR, carry: [L.wrR, L.indexR, L.pinkyR, L.thumbR], mirror: 'armL' },
  { seg: 'forearmL', a: L.elL, b: L.wrL, carry: [L.indexL, L.pinkyL, L.thumbL], mirror: 'forearmR' },
  { seg: 'forearmR', a: L.elR, b: L.wrR, carry: [L.indexR, L.pinkyR, L.thumbR], mirror: 'forearmL' },
];
const PARENT: Partial<Record<Seg, Seg>> = { shinL: 'thighL', shinR: 'thighR', forearmL: 'armL', forearmR: 'armR' };

/** a track's limb memory: per bone, its remembered direction (in its parent's frame) and how sure that is */
export type LimbState = Partial<Record<Seg, { x: number; y: number; z: number; c: number }>>;

const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const V = (p: LM) => new THREE.Vector3(p.x, p.y, p.z);
const mid = (a: LM, b: LM) => V(a).add(V(b)).multiplyScalar(0.5);

/** an orthonormal frame: x across, y along `y`, z = x × y */
function frame(xHint: THREE.Vector3, y: THREE.Vector3): THREE.Matrix3 {
  const Y = y.clone().normalize(), X = xHint.clone().addScaledVector(Y, -xHint.dot(Y));
  if (X.lengthSq() < 1e-8) X.set(1, 0, 0).addScaledVector(Y, -Y.x);
  X.normalize();
  const Z = new THREE.Vector3().crossVectors(X, Y);
  return new THREE.Matrix3().set(X.x, Y.x, Z.x, X.y, Y.y, Z.y, X.z, Y.z, Z.z);
}
const toLocal = (F: THREE.Matrix3, v: THREE.Vector3) => v.clone().applyMatrix3(F.clone().transpose());
const toWorld = (F: THREE.Matrix3, v: THREE.Vector3) => v.clone().applyMatrix3(F);

/**
 * The limbs of `world` (the shown 3D pose, camera axes, metres) where the picture is unsure, from memory and priors;
 * `image` gives how sure each point is (visibility, zero outside the frame), `up` the floor's up, `st` the track's
 * memory (updated). Returns a new pose: unsure bones turned to what is believed, the joints past them carried along,
 * and each bone's far end's visibility how sure that belief is.
 */
export function fillLimbs(world: LM[], image: LM[], up: THREE.Vector3, st: LimbState, dt: number): LM[] {
  const T = LIMB_TUNE, out = world.map((p) => ({ ...p }));
  const learn = 1 - Math.exp(-dt / T.learn), keep = Math.exp(-dt / T.forget);
  const hipL = V(world[L.hipL]!), hipR = V(world[L.hipR]!), shL = V(world[L.shL]!), shR = V(world[L.shR]!);
  const torsoUp = mid(world[L.shL]!, world[L.shR]!).sub(mid(world[L.hipL]!, world[L.hipR]!));
  const pelvis = frame(hipL.clone().sub(hipR), torsoUp), chest = frame(shL.clone().sub(shR), torsoUp);
  const across = hipL.clone().sub(hipR).normalize();
  // how sure the picture is of each bone this frame (both its ends), or of its limb's two ends (its middle is pinned
  // between them)
  const CHAIN: Partial<Record<Seg, [number, number]>> = {
    armL: [L.shL, L.wrL], forearmL: [L.shL, L.wrL], armR: [L.shR, L.wrR], forearmR: [L.shR, L.wrR],
    thighL: [L.hipL, L.anL], shinL: [L.hipL, L.anL], thighR: [L.hipR, L.anR], shinR: [L.hipR, L.anR],
  };
  const sureOf = (a: number, b: number) => sstep(T.visFrom, T.visTo, Math.min(image[a]!.v, image[b]!.v));
  const sure = (seg: Seg, a: number, b: number) => { const c = CHAIN[seg]; return Math.max(sureOf(a, b), c ? T.chain * sureOf(c[0], c[1]) : 0); };
  // first pass: what each bone reads, in its parent's frame as the picture has it (for the mirrors and the memory)
  const frames = new Map<Seg, THREE.Matrix3>();
  const parentFrame = (s: (typeof SEGS)[number], pose: LM[]): THREE.Matrix3 => {
    const p = PARENT[s.seg];
    if (!p) return s.seg.startsWith('thigh') ? pelvis : chest;
    const ps = SEGS.find((q) => q.seg === p)!;
    // the parent bone's frame: across the body, along the parent bone (the knee's and elbow's hinge is across it)
    return frame(across, V(pose[ps.b]!).sub(V(pose[ps.a]!)));
  };
  const read = new Map<Seg, { d: THREE.Vector3; c: number }>();
  for (const s of SEGS) {
    const F = parentFrame(s, world);
    frames.set(s.seg, F);
    read.set(s.seg, { d: toLocal(F, V(world[s.b]!).sub(V(world[s.a]!)).normalize()), c: sure(s.seg, s.a, s.b) });
  }
  // the memory: decays, takes in what is sure
  for (const s of SEGS) {
    const r = read.get(s.seg)!, m = st[s.seg] ??= { x: r.d.x, y: r.d.y, z: r.d.z, c: 0 };
    const k = learn * r.c;
    const d = new THREE.Vector3(m.x, m.y, m.z).lerp(r.d, k).normalize();
    m.x = d.x; m.y = d.y; m.z = d.z;
    m.c = Math.max(m.c * keep, r.c);
  }
  // second pass, from the body out (thighs and upper arms, then shins and forearms, so a child hangs from its filled
  // parent): what is shown
  for (const s of SEGS) {
    const r = read.get(s.seg)!, m = st[s.seg]!, a = V(out[s.a]!);
    const len = V(world[s.b]!).distanceTo(V(world[s.a]!));
    if (r.c >= 0.999 || len < 1e-4) continue;
    const F = parentFrame(s, out);
    // the prior: the other limb's (mirrored across the body) as far as it is sure; a shin hanging toward the ground as
    // far as a knee bends; else the reading itself (the rig eases an unsure bone to its rest, as before)
    // (legs only: arms are as often doing different things as the same)
    const leg = s.seg.startsWith('thigh') || s.seg.startsWith('shin');
    const o = st[s.mirror]!, oc = leg ? Math.max(read.get(s.mirror)!.c, o.c) * T.mirror : 0;
    const mirrored = new THREE.Vector3(-o.x, o.y, o.z);
    let prior = mirrored, pc = oc;
    if (s.seg.startsWith('shin')) {
      // in the thigh's frame (x across, y along the thigh, z = x × y: behind the leg), the knee bends from straight
      // (0, 1, 0) toward +z; the ground's down there, kept to that hinge and its range
      const down = toLocal(F, up.clone().negate());
      const bend = Math.min(THREE.MathUtils.degToRad(T.kneeMax), Math.max(0, Math.atan2(down.z, down.y)));
      const hang = new THREE.Vector3(0, Math.cos(bend), Math.sin(bend));
      // the mirror where the other leg is sure, the hang under it
      prior = mirrored.clone().multiplyScalar(oc).addScaledVector(hang, T.hang * (1 - oc));
      if (prior.lengthSq() < 1e-8) prior = hang;
      prior.normalize();
      pc = oc + (1 - oc) * T.hang;
    }
    // the reading where sure, the memory as far as it is fresh, the prior under both
    const mc = m.c * (1 - r.c);
    const d = r.d.clone().multiplyScalar(r.c).addScaledVector(new THREE.Vector3(m.x, m.y, m.z), mc).addScaledVector(prior, (1 - r.c - mc) * pc);
    if (d.lengthSq() < 1e-8) continue;
    d.normalize();
    const conf = r.c + mc + (1 - r.c - mc) * pc;
    const b = a.clone().addScaledVector(toWorld(F, d), len), shift = b.clone().sub(V(out[s.b]!));
    out[s.b] = { ...out[s.b]!, x: b.x, y: b.y, z: b.z, b: Math.max(out[s.b]!.v, conf) };
    for (const i of s.carry) out[i] = { ...out[i]!, x: out[i]!.x + shift.x, y: out[i]!.y + shift.y, z: out[i]!.z + shift.z };
  }
  return out;
}
