// Violet ("Vi"), the Golden State Valkyries' mascot, as a fan costume (founder, 2026-10-31: "to show our support"; then
// two photos of the real costume, a studio shot and one on court: "make our Valkyrie look more like this... complete with
// ruffle feathers"). An affectionate likeness of that costume, from the photos; no logo, no wordmark, no emblem, no text
// anywhere on her (the dress's chest stays plain white):
// - a round head in a shaggy mane of lavender fur, paler round the crown, and a tall spiky crest standing up on top;
// - big oval eyes, white with dark irises and a dark lash line, behind large round gold glasses (thick rims, a bridge,
//   temples: meshes on the head bone) that sit high on the face;
// - a large, blunt, matte blue-charcoal beak, lighter at the tip, pointing forward and a little down; its lower half
//   rides the `jaw` bone, so the wearer's open mouth opens hers;
// - long shaggy lavender fur all over (fur.ts, as Howler's coat but thick and long), ruffled: its length bunches by a
//   noise over the body; a ruff where the head meets the body, a fringe under the arms, cuffs over the socks;
// - arms that are wings, with black tufts scattered on their outer sides and the shoulders;
// - a white sleeveless tennis dress from the shoulders to mid-thigh, a black waistband and a black hem, the skirt
//   flaring a little;
// - lavender legs, white socks with lavender chevrons from mid-shin, white sneakers (meshes on the shins and feet, so
//   the stripes and the soles are crisp at any size).
// Frame: metres for a figure about 18 tall on y = 0, +z her beak, +x her own left (build.ts). The head's segment has its
// midpoint at the head's centre, which the stage puts on the wearer's head; a person's ears sit only ~0.3 torsos above
// their shoulder landmarks, so the big head is modelled low, resting on the shoulders as a mascot's does.
//
// Budget (lab, 2026-10-31): the fur's shells are drawn over the whole surface, dress included, so the skirt is solid
// (its inside, the hips and the thighs under it are not surface at all) and the grid is 72 for ten long shells.
import * as THREE from 'three';
import type { Capture, CharacterDef, Dresser, FaceState } from './build';
import { eyelids } from './faceparts';
import { sdCapsule, sdEllipsoid, sdSphere, smin, type Seg } from './sdf';
import { isoGeometry } from './skeleton';

type V3 = [number, number, number];

// joints (the left side; the right is mirrored)
const HIP: V3 = [1.2, 7.9, 0], KNEE: V3 = [1.32, 4.5, 0.15], ANKLE: V3 = [1.32, 1.35, -0.1], TOE: V3 = [1.32, 1.0, 2.0];
// the arms hang a little out from her sides: an arm that touched the body would be joined to it by the marching cubes
// and tear off it when raised
const SHOULDER: V3 = [2.55, 12.1, 0], ELBOW: V3 = [3.4, 9.7, -0.1], WRIST: V3 = [3.95, 7.4, 0.15];
const WAIST = 9.4, HEM = 6.1;
/** the socks' tops: mid-shin */
const SOCK_TOP = 2.9;
const mx = (p: V3): V3 => [-p[0], p[1], p[2]];

// The head is designed at one size and drawn `HS` times that about its centre: everything on it (the beak, the eyes,
// the glasses) is given in design coordinates and placed through `hs`.
/** the head's centre (the head segment's midpoint) and its radii, design units */
const HC: V3 = [0, 13.6, 0.25];
const HR: V3 = [1.9, 1.95, 1.8];
const HS = 1.1;
const hs = (p: V3): V3 => [HC[0] + (p[0] - HC[0]) * HS, HC[1] + (p[1] - HC[1]) * HS, HC[2] + (p[2] - HC[2]) * HS];
/** her left eye's centre, design units (the right mirrored): an oval, its radii across, up and deep */
const EYE_D: V3 = [0.88, 14.55, 1.5];
const EYE_RAD: V3 = [0.5, 0.62, 0.44];
/** the back corner of the beak's gape, design units: the jaw's pivot */
const HINGE_D: V3 = [0, 13.2, 1.3];
/** the gape, design units: the line the two halves of the beak meet on, falling toward the tip */
const gape = (z: number) => HINGE_D[1] - 0.13 * (z - HINGE_D[2]);
// the same in model units
const EYE = hs(EYE_D), EYE_R = EYE_RAD[0] * HS, HINGE = hs(HINGE_D);
/** the crest's spikes, design units: x and z at the crown, height over it, how far back the tip leans */
const CREST: [number, number, number, number][] = [[0, 0.25, 2.1, 0.45], [0.42, 0.05, 1.6, 0.55], [-0.42, 0.05, 1.6, 0.55], [0.22, -0.4, 1.75, 0.85], [-0.22, -0.4, 1.75, 0.85]];
/** how far a design point is from the crest's spikes (their cores, without the head they blend into) */
function crestD(x: number, y: number, z: number): number {
  let d = 1e9;
  for (const [cx, cz, up, lean] of CREST) d = Math.min(d, sdCapsule(x, y, z, cx * 0.5, 15.0, cz, cx * 1.4, 15.2 + up, cz - lean, 0.45, 0.08));
  return d;
}
/** a model point in the head's design units */
const dyOf = (y: number) => HC[1] + (y - HC[1]) / HS, dzOf = (z: number) => HC[2] + (z - HC[2]) / HS;
/** the crest's bone pivots under the crown, so its base bends least; the plump cheeks' bones sit inside them */
const CREST_A = hs([0, 15.1, 0.05]), CREST_B = hs([0, 17.0, -0.55]);
const CHEEK_A = hs([0.62, 13.0, 0.45]), CHEEK_B = hs([1.2, 12.85, 0.85]);

export const VIOLET_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 7.9, 0], b: [0, 8.9, 0], parent: null },
  { name: 'spine1', a: [0, 8.9, 0], b: [0, 10.3, 0.05], parent: 'pelvis' },
  { name: 'spine2', a: [0, 10.3, 0.05], b: [0, 11.5, 0.05], parent: 'spine1' },
  { name: 'neck', a: [0, 11.5, 0.05], b: [0, 11.9, 0.1], parent: 'spine2' },
  { name: 'head', a: [0, 11.9, 0.1], b: [0, 15.3, 0.4], parent: 'neck' },
  // the lower mandible is a mesh on this bone; it takes nothing from the body
  { name: 'jaw', a: HINGE, b: hs([0, 12.85, 3.75]), parent: 'head', reach: 0 },
  // the face's own bones (the rig never turns them; the tick does): the crest, her most readable "brow", and the cheeks
  // that puff and push up with a smile. They take only their own patches of skin (violetCapture)
  { name: 'crest', a: CREST_A, b: CREST_B, parent: 'head' },
  { name: 'cheekL', a: CHEEK_A, b: CHEEK_B, parent: 'head' },
  { name: 'cheekR', a: [-CHEEK_A[0], CHEEK_A[1], CHEEK_A[2]], b: [-CHEEK_B[0], CHEEK_B[1], CHEEK_B[2]], parent: 'head' },
  // a small tuft behind, from under the back of the skirt
  { name: 'tail1', a: [0, 6.5, -1.2], b: [0, 6.0, -2.0], parent: 'pelvis', reach: 1.3 },
  { name: 'tail2', a: [0, 6.0, -2.0], b: [0, 5.6, -2.6], parent: 'tail1', reach: 1.2 },
  { name: 'tail3', a: [0, 5.6, -2.6], b: [0, 5.35, -3.0], parent: 'tail2', reach: 1.0 },
  { name: 'tail4', a: [0, 5.35, -3.0], b: [0, 5.2, -3.3], parent: 'tail3', reach: 0.9 },
  { name: 'thighL', a: HIP, b: KNEE, parent: 'pelvis' },
  { name: 'shinL', a: KNEE, b: ANKLE, parent: 'thighL' },
  // the foot points heel to toe, nearly level, as a person's heel and toe landmarks do (a downward rest tips the toe up)
  { name: 'footL', a: ANKLE, b: TOE, parent: 'shinL' },
  { name: 'thighR', a: mx(HIP), b: mx(KNEE), parent: 'pelvis' },
  { name: 'shinR', a: mx(KNEE), b: mx(ANKLE), parent: 'thighR' },
  { name: 'footR', a: mx(ANKLE), b: mx(TOE), parent: 'shinR' },
  { name: 'armL', a: SHOULDER, b: ELBOW, parent: 'spine2' },
  { name: 'forearmL', a: ELBOW, b: WRIST, parent: 'armL' },
  { name: 'armR', a: mx(SHOULDER), b: mx(ELBOW), parent: 'spine2' },
  { name: 'forearmR', a: mx(ELBOW), b: mx(WRIST), parent: 'armR' },
];

export const VIOLET_BOX = { min: [-4.6, 0.5, -3.8] as V3, max: [4.6, 18.3, 2.5] as V3 };

const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const hash3 = (i: number, j: number, k: number) => { const h = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453; return h - Math.floor(h); };
/** smooth value noise, 0..1 */
function noise3(x: number, y: number, z: number): number {
  const i = Math.floor(x), j = Math.floor(y), k = Math.floor(z);
  const u = x - i, v = y - j, w = z - k;
  const a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v), c = w * w * (3 - 2 * w);
  const l = (p: number, q: number, t: number) => p + (q - p) * t;
  return l(l(l(hash3(i, j, k), hash3(i + 1, j, k), a), l(hash3(i, j + 1, k), hash3(i + 1, j + 1, k), a), b),
    l(l(hash3(i, j, k + 1), hash3(i + 1, j, k + 1), a), l(hash3(i, j + 1, k + 1), hash3(i + 1, j + 1, k + 1), a), b), c);
}

// --- the parts, each its own field (the capture rule and the regions ask which part a point is on). Each starts with a
// bound: far from the part, a distance no greater than the true one, which is all the blends and the grid need (every
// bound here is past the widest blend it meets), and most of the grid is far from most parts

/** the body under the dress: a rounded chest, the shoulders' breadth, round shoulder caps, the hips */
function torsoD(x: number, y: number, z: number): number {
  if (y < 6.5) return 7.3 - y;
  if (y > 13.4) return y - 12.6;
  const ax = Math.abs(x);
  let d = sdEllipsoid(x, y, z, 0, 10.0, 0.1, 1.85, 2.4, 1.5);
  d = smin(d, sdEllipsoid(x, y, z, 0, 10.8, 0.4, 1.5, 1.25, 1.2), 0.6);
  d = smin(d, sdEllipsoid(x, y, z, 0, 11.45, 0, 2.0, 1.0, 1.35), 0.7);
  d = smin(d, sdSphere(ax, y, z, 2.25, 11.85, 0, 0.68), 0.5);
  return smin(d, sdEllipsoid(x, y, z, 0, 8.3, -0.1, 1.6, 1.0, 1.35), 0.6);
}

/** the skirt: a bell flaring a little from the waist (inside the body) to the hem at mid-thigh */
function skirtD(x: number, y: number, z: number): number {
  if (y > WAIST + 0.6 || y < HEM - 0.6) return Math.max(y - WAIST, HEM - y);
  return Math.max(skirtRing(x, y, z), y - WAIST, HEM - y);
}
/** the distance out from the bell's side (negative inside it) */
function skirtRing(x: number, y: number, z: number): number {
  const t = Math.min(1, Math.max(0, (WAIST - y) / (WAIST - HEM))), f = 1 - (1 - t) * (1 - t);
  const pleat = 1 + 0.025 * f * Math.cos(Math.atan2(x, z) * 12);
  const rx = (1.7 + 0.8 * f) * pleat, rz = (1.42 + 0.72 * f) * pleat, zc = 0.05 - 0.1 * f;
  return (Math.hypot(x / rx, (z - zc) / rz) - 1) * Math.min(rx, rz);
}

/** the head, design units: a round head, plump cheeks, the crest, sockets the eyes sit in */
function headDesign(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let h = sdEllipsoid(x, y, z, HC[0], HC[1], HC[2], HR[0], HR[1], HR[2]);
  h = smin(h, sdEllipsoid(ax, y, z, 0.9, 13.0, 0.7, 1.05, 0.9, 1.0), 0.5);
  if (y > 14.6) for (const [cx, cz, up, lean] of CREST) h = smin(h, sdCapsule(x, y, z, cx * 0.5, 15.0, cz, cx * 1.4, 15.2 + up, cz - lean, 0.45, 0.08), 0.4);
  return Math.max(h, -sdEllipsoid(ax, y, z, EYE_D[0], EYE_D[1], EYE_D[2], EYE_RAD[0] + 0.05, EYE_RAD[1] + 0.05, EYE_RAD[2] + 0.05));
}
/** `f` (design units) asked at a model point, as a model distance */
const toDesign = (x: number, y: number, z: number, f: (x: number, y: number, z: number) => number) =>
  f(HC[0] + (x - HC[0]) / HS, HC[1] + (y - HC[1]) / HS, HC[2] + (z - HC[2]) / HS) * HS;
function headD(x: number, y: number, z: number): number {
  if (y < 10.6) return 11.4 - y;
  return toDesign(x, y, z, headDesign);
}

/** an arm-wing (`ax`: either side): the upper arm, the forearm's broad flat blade, four primaries past the wrist */
function wingD(ax: number, y: number, z: number): number {
  if (ax < 1.0) return 1.7 - ax;
  if (y > 13.4) return y - 12.8;
  if (y < 4.6) return 5.2 - y;
  let d = sdCapsule(ax, y, z, ...SHOULDER, ...ELBOW, 0.6, 0.56);
  const k = 1.75; // the blade is this much broader front to back than across
  d = smin(d, sdCapsule(ax, y, z / k, ELBOW[0], ELBOW[1], ELBOW[2] / k, WRIST[0], WRIST[1], WRIST[2] / k, 0.5, 0.4), 0.45);
  for (let i = 0; i < 4; i++) {
    const zk = -0.75 + i * 0.5, drop = 1.2 + 0.35 * (1 - Math.abs(zk) / 0.75);
    d = smin(d, sdCapsule(ax, y, z, WRIST[0] - 0.05, WRIST[1] + 0.5, zk * 0.8 + 0.1, WRIST[0] + 0.12, WRIST[1] - drop, zk * 1.1 + 0.15, 0.32, 0.12), 0.25);
  }
  return d;
}

/** a leg (`ax`): a thigh, the knee, the shin down into the sock */
function legD(ax: number, y: number, z: number): number {
  if (y > 9.4) return y - 8.7;
  if (ax > 3.0) return ax - 2.1;
  let d = sdCapsule(ax, y, z, ...HIP, ...KNEE, 0.75, 0.55);
  d = smin(d, sdSphere(ax, y, z, ...KNEE, 0.57), 0.3);
  return smin(d, sdCapsule(ax, y, z, ...KNEE, ...ANKLE, 0.53, 0.42), 0.3);
}

/** the tail: a small tuft, three short plumes fanned down and back */
function tailD(x: number, y: number, z: number): number {
  if (z > 0) return z + 0.85;
  if (y > 7.6) return y - 6.9;
  let d = 1e9;
  for (const k of [-1, 0, 1]) {
    const c = 1 - Math.abs(k);
    d = smin(d, sdCapsule(x, y, z, k * 0.25, 6.5, -1.2, k * 0.7, 5.4 - c * 0.2, -3.0 - c * 0.3, 0.38, 0.14), 0.3);
  }
  return d;
}

export function violetSDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let d = smin(torsoD(x, y, z), headD(x, y, z), 0.8);
  d = smin(d, legD(ax, y, z), 0.55);
  // the arm joins the body only at the shoulder; lower down it stays apart, even where it passes near
  d = smin(d, wingD(ax, y, z), 0.05 + 0.5 * sstep(10.9, 11.8, y));
  return Math.min(d, skirtD(x, y, z), tailD(x, y, z));
}

const TORSO = 0, SKIRT = 1, HEAD = 2, WING = 3, LEG = 4, TAIL = 5;
/** the parts' distances at the last point asked, and which is nearest (asked once per vertex by each of four passes) */
const dist = new Float64Array(6);
let lastX = NaN, lastY = NaN, lastZ = NaN, lastPart = 0;
function parts(x: number, y: number, z: number): number {
  if (x === lastX && y === lastY && z === lastZ) return lastPart;
  const ax = Math.abs(x);
  dist[TORSO] = torsoD(x, y, z); dist[SKIRT] = skirtD(x, y, z); dist[HEAD] = headD(x, y, z);
  dist[WING] = wingD(ax, y, z); dist[LEG] = legD(ax, y, z); dist[TAIL] = tailD(x, y, z);
  let m = 0;
  for (let i = 1; i < 6; i++) if (dist[i]! < dist[m]!) m = i;
  lastX = x; lastY = y; lastZ = z; lastPart = m;
  return m;
}

/**
 * Which bones may take the skin at a point: each part's own bones, plus those of a part within a seam of it (so the
 * shoulder blends the arm into the chest, the neck the head into the body). A raised arm takes only the arm and the
 * shoulder (the dress under it stays with the spine: no sheet pulled up the flank); a leg only the leg; the head only
 * the head and neck. The skirt goes with the pelvis, and its front and sides with the thighs too (as the species'
 * thigh rule), so a squat lifts it instead of the knees going through it.
 */
const SEAM = 0.25;
const near = (i: number) => dist[i]! <= dist[lastPart]! + SEAM;
const violetCapture: Capture = (sg, x, y, z) => {
  parts(x, y, z);
  const n = sg.name, side = n.endsWith('L') ? 1 : n.endsWith('R') ? -1 : 0;
  if (side !== 0 && x * side < -0.05) return false;
  if (n === 'pelvis') return near(TORSO) || near(SKIRT) || near(TAIL) || near(LEG);
  if (n === 'spine1') return near(TORSO) || near(SKIRT);
  if (n === 'spine2') return near(TORSO);
  if (n === 'neck') return near(TORSO) || near(HEAD);
  // the crest's bone takes the spikes and their roots; the head lets go of their upper parts, so they turn whole
  if (n === 'crest') return near(HEAD) && dyOf(y) > 15.05 && crestD(x / HS, dyOf(y), dzOf(z)) < 0.32;
  // a cheek's bone the face below the eye, beside the beak (not the socket, the beak's base or the back of the head)
  if (n === 'cheekL' || n === 'cheekR') { const dy = dyOf(y); return near(HEAD) && dy < 13.85 && dy > 12.1 && dzOf(z) > -0.2 && Math.abs(x) / HS > 0.5; }
  if (n === 'head') return near(HEAD) && !(dyOf(y) > 15.95 && crestD(x / HS, dyOf(y), dzOf(z)) < 0.32);
  if (n === 'jaw' || n.startsWith('foot')) return false;
  if (n.startsWith('tail')) return near(TAIL);
  if (n.startsWith('arm') || n.startsWith('forearm')) return near(WING) && (lastPart === WING || y > 11.3);
  if (n.startsWith('shin')) return near(LEG);
  if (n.startsWith('thigh')) {
    if (near(LEG)) return true;
    return near(SKIRT) && z > -0.4 && y < HIP[1] + 0.8 && Math.abs(Math.abs(x) - HIP[0]) < 1.35;
  }
  return true;
};

const LAVENDER = 0xb9a3e8, PALE = 0xe4daf8, SPECK = 0x18141e, DUSK = 0x9a84d4, CLOTH = 0xf4f3f7, BLACK = 0x141218;
/** the dress's top: a scoop at the front, broad straps, cut lower under the arms (the shoulders are fur) */
const neckline = (ax: number, z: number) => (z > 0 ? 11.2 + 0.55 * sstep(0.15, 1.0, ax) : 11.65) - 0.6 * sstep(1.35, 1.9, ax);
const WHITE_C = new THREE.Color(CLOTH), BLACK_C = new THREE.Color(BLACK);
// the cloth is brightened by 1.6 (tint) where the fur is not: this lands on the fur's own undercoat
const FUR_C = new THREE.Color(LAVENDER).multiplyScalar(1 / 1.6);
/** a band's weight: 1 inside `half` of its centre, 0 past it, blended over `soft` either side */
const band = (s: number, half: number, soft: number) => 1 - sstep(half - soft, half + soft, Math.abs(s));
/** the dress's colour, blended across its edges (the grid is coarse, and a band switched at a vertex zigzags) */
function cloth(p: number, x: number, y: number, z: number, c: THREE.Color): void {
  c.copy(WHITE_C);
  // above the neckline, a strip the colour of the fur's roots that the ruff hangs over
  if (p === TORSO) c.lerp(FUR_C, sstep(neckline(Math.abs(x), z) - 0.05, neckline(Math.abs(x), z) + 0.08, y));
  c.lerp(BLACK_C, band(y - (WAIST - 0.15), 0.27, 0.08));
  // the hem's black on the outside only (the underside shows when a squat lifts the skirt)
  if (p === SKIRT) c.lerp(BLACK_C, (1 - sstep(HEM + 0.4, HEM + 0.56, y)) * (skirtRing(x, y, z) > -0.12 ? 1 : 0));
}

/** black tufts scattered over the arms' outer sides and the shoulders (streaks: longer than wide) */
function speck(x: number, y: number, z: number): boolean {
  const s = 0.8, i = Math.floor(x / s), j = Math.floor(y / (s * 1.4)), k = Math.floor(z / s);
  for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) for (let dk = -1; dk <= 1; dk++) {
    const a = i + di, b = j + dj, c = k + dk;
    if (hash3(a, b, c) > 0.45) continue;
    const px = (a + 0.2 + 0.6 * hash3(a + 7, b, c)) * s, py = (b + 0.2 + 0.6 * hash3(a, b + 7, c)) * s * 1.4, pz = (c + 0.2 + 0.6 * hash3(a, b, c + 7)) * s;
    if (((x - px) / 0.44) ** 2 + ((y - py) / 0.75) ** 2 + ((z - pz) / 0.44) ** 2 < 1) return true;
  }
  return false;
}

/** Regions: 0 lavender fur, 1 black tufts, 2 the dress's white, 3 the dress's black, 4 white, 5 pale lavender, 6 dusk tips. */
export function violetRegion(x: number, y: number, z: number): number {
  const ax = Math.abs(x), p = parts(x, y, z);
  if (p === SKIRT) return y < HEM + 0.48 || y > WAIST - 0.45 ? 3 : 2;
  if (p === TORSO) {
    const neck = neckline(ax, z);
    if (y > neck + 0.3) return y > 11.2 && ax > 1.5 && speck(x, y, z) ? 1 : 0;
    if (y > neck - 0.05) return 2;
    if (y < WAIST + 0.12 && y > WAIST - 0.42) return 3;
    return 2;
  }
  if (p === HEAD) {
    const dy = HC[1] + (y - HC[1]) / HS, dz = HC[2] + (z - HC[2]) / HS;
    return dy > 15.2 || (dy > 14.2 && dz < -0.6) ? 5 : 0; // the crest and the crown paler
  }
  if (p === WING) {
    if (y < 6.6) return 6;
    // the tufts on the outer side, away from the body
    const axis = y > ELBOW[1] ? SHOULDER[0] + (ELBOW[0] - SHOULDER[0]) * (SHOULDER[1] - y) / (SHOULDER[1] - ELBOW[1])
      : ELBOW[0] + (WRIST[0] - ELBOW[0]) * Math.min(1, (ELBOW[1] - y) / (ELBOW[1] - WRIST[1]));
    return ax - axis > -0.25 && speck(x, y, z) ? 1 : 0;
  }
  if (p === LEG) return y < SOCK_TOP - 0.05 ? 4 : 0;
  return 0;
}

/**
 * The coat's length, 0..1.5, bunched by a noise so it stands in clumps: bare on the dress, in the socks, round the eyes
 * and the beak; short on the face; a long mane round the head and a ruff where it meets the body; a fringe under the
 * arms; cuffs over the socks.
 */
export function violetFurLength(x: number, y: number, z: number): number {
  const r = violetRegion(x, y, z);
  if (r === 2 || r === 3 || r === 4) return 0;
  const p = parts(x, y, z), ax = Math.abs(x);
  const clump = 0.6 + 0.8 * noise3(x * 1.4 + 3.1, y * 1.4, z * 1.4);
  let len = 1;
  if (p === HEAD) {
    const dx = ax / HS, dy = HC[1] + (y - HC[1]) / HS, dz = HC[2] + (z - HC[2]) / HS;
    const e = Math.hypot((dx - EYE_D[0]) / EYE_RAD[0], (dy - EYE_D[1]) / EYE_RAD[1], (dz - EYE_D[2]) / EYE_RAD[2]);
    if (e < 1.5) return 0;
    if (dz > 0.95 && dx < 1.15 && dy < 13.95 && dy > 12.2) return 0; // round the beak's base
    // the face short (the glasses must show), the mane long round it
    const face = sstep(0.2, 1.2, dz) * (1 - sstep(1.0, 1.6, dx)) * (1 - sstep(15.2, 15.6, dy));
    len = 0.3 * Math.min(1, (e - 1.5) / 0.8) * face + 1.3 * (1 - face);
    if (dy > 15.2) len = 1.5; // the crest
    // under the beak, short: long, it hung down the dress's front in streaks
    else if (dy < 12.6 && dz > 0.3) len = Math.min(len, 0.25);
  } else if (p === TORSO) len = (y > 11.0 ? 1.25 : 0.9) * (z > 0 ? 1 - 0.55 * (1 - sstep(0.5, 1.2, ax)) : 1); // the ruff, short over the dress's front
  else if (p === WING) {
    // longest on the arm's underside and trailing edge: a fringe that hangs when the arm is up
    const under = sstep(-0.4, 0.4, -z) * 0.4 + sstep(-0.2, 0.3, (SHOULDER[0] + 0.6) - ax) * 0.4;
    len = (y < 7.2 ? 1.3 : 1.0) + under;
  } else if (p === LEG) len = y < SOCK_TOP + 0.7 ? 1.25 : 0.9; // the cuffs over the socks
  else if (p === TAIL) len = 1.2;
  if (r === 1) len *= 1.2; // the black tufts stand out
  return len * clump;
}

// --- the meshes (the beak and the eyes in the head's design units, scaled with it)

/** the upper beak: broad, rounded, blunt, a soft ridge up toward the glasses' bridge */
const upperCore = (x: number, y: number, z: number) => smin(
  sdCapsule(x / 1.5, y, z, 0, 13.55, 1.2, 0, 13.05, 3.85, 0.7, 0.4) * 0.88,
  sdCapsule(x / 1.3, y, z, 0, 13.85, 1.0, 0, 13.5, 2.7, 0.42, 0.32), 0.4);
const upperBeakD = (x: number, y: number, z: number) => Math.max(upperCore(x, y, z), gape(z) - y);
/** the lower beak, under the gape, a little shorter so the upper overhangs it */
const lowerCore = (x: number, y: number, z: number) => sdCapsule(x / 1.42, y, z, 0, 13.1, 1.2, 0, 12.8, 3.65, 0.55, 0.32) * 0.9;
const lowerBeakD = (x: number, y: number, z: number) => Math.max(lowerCore(x, y, z), y - gape(z) + 0.03);
const BEAK_C = new THREE.Color(0x404350), TIP_C = new THREE.Color(0x868a9a), MOUTH = 0x5a1424, TONGUE = 0xc85a72;
/** blue-charcoal, lighter toward the tip; inside, a dark red mouth and a pink tongue, which show only when it opens */
const beakColour = (lower: boolean) => (x: number, y: number, z: number, c: THREE.Color) => {
  const inside = (lower ? lowerCore : upperCore)(Math.abs(x) + 0.09, y, z) < 0 && z < 3.6;
  if (!lower && inside && y < gape(z) + 0.05) c.setHex(MOUTH);
  else if (lower && inside && y > gape(z) - 0.08) c.setHex(Math.abs(x) < 0.35 && z > 1.7 ? TONGUE : MOUTH);
  else c.copy(BEAK_C).lerp(TIP_C, sstep(2.9, 4.1, z));
};

/** a sneaker in its ankle's frame: a white sole flat on the ground, a pale grey upper, a white toe cap and laces */
function sneakerD(x: number, y: number, z: number): number {
  const Y = ANKLE[1];
  let d = Math.max(sdEllipsoid(x, y, z, 0, 0.32 - Y, 0.65, 0.84, 0.4, 1.72), -(y + Y));
  d = smin(d, sdEllipsoid(x, y, z, 0, 0.78 - Y, 0.55, 0.74, 0.6, 1.5), 0.2);
  d = smin(d, sdEllipsoid(x, y, z, 0, 0.62 - Y, 1.5, 0.7, 0.46, 0.85), 0.25);
  d = smin(d, sdCapsule(x, y, z, 0, 0.95 - Y, -0.2, 0, 1.4 - Y, -0.15, 0.62, 0.6), 0.3);
  return Math.max(d, -sdCapsule(x, y, z, 0, 1.4 - Y, -0.15, 0, 3 - Y, -0.15, 0.47, 0.47));
}
function sneakerColour(x: number, y: number, z: number, c: THREE.Color): void {
  const h = y + ANKLE[1]; // height above the ground
  if (h < 0.42 || (z > 1.75 && h < 0.9)) c.setHex(0xfafafc); // the sole and the toe cap
  else if (Math.abs(x) < 0.3 && z > 0.25 && z < 1.55 && h > 1.0) c.setHex(0xffffff); // the laces
  else if (Math.abs(h - 0.47) < 0.05) c.setHex(0xb8b8c4); // a line over the sole
  else c.setHex(0xdcdce4);
}

/** the socks: white, lavender chevrons around (u: 0 is the front) and up (v), a white cuff */
function sockTexture(): THREE.DataTexture {
  const W = 128, H = 128, data = new Uint8Array(W * H * 4);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const v = (j + 0.5) / H, th = ((i + 0.5) / W) * Math.PI * 2;
    // V at the front and the back: the stripe lowest on the shin's line, rising to the sides
    const s = v * 2.6 - 0.38 * Math.abs(Math.sin(th));
    const f = ((s % 0.85) + 0.85) % 0.85;
    const lav = f < 0.4 && v < 0.84;
    data.set(lav ? [0xa8, 0x8e, 0xe0, 255] : [0xf6, 0xf4, 0xfa, 255], (j * W + i) * 4);
  }
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
}

/** a mesh built in the head's design units, scaled with the head (its origin at the head's centre) */
function onHead(d: Dresser, m: THREE.Object3D, p: V3, bone = 'head'): void {
  m.scale.multiplyScalar(HS);
  const q = hs(p);
  d.at(m, bone, q[0], q[1], q[2]);
}

function dressViolet(d: Dresser): void {
  // eyes: big white ovals, dark irises looking a little in and down, a glint, a dark lash line over each
  const white = d.std({ color: 0xfbfbff, roughness: 0.15 }), iris = d.std({ color: 0x2a2244, roughness: 0.1 });
  const dark = d.std({ color: 0x050408, roughness: 0.06 }), lash = d.std({ color: 0x141018, roughness: 0.5 });
  const glint = d.std({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8, roughness: 0.2 });
  // lids the lavender of the feathers round the eyes (bare skin there: the undercoat's shade of the coat)
  const lidMat = d.std({ color: 0xa892dc, roughness: 0.85 });
  for (const sx of [1, -1]) {
    const s = sx > 0 ? 'L' : 'R';
    const eye = new THREE.Group();
    eye.name = 'vi-eye' + s;
    eye.scale.set(1, EYE_RAD[1] / EYE_RAD[0], EYE_RAD[2] / EYE_RAD[0]);
    eye.add(new THREE.Mesh(new THREE.SphereGeometry(EYE_RAD[0], 22, 16), white));
    // the iris, pupil and glint turn together inside the white, where the wearer looks (tick)
    const look = new THREE.Group();
    look.name = 'vi-look' + s;
    look.rotation.set(0.12, -sx * 0.14, 0);
    for (const [m, r, a] of [[iris, 0.012, 0.62], [dark, 0.02, 0.3]] as const) {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(EYE_RAD[0] + r, 22, 6, 0, Math.PI * 2, 0, a), m);
      cap.rotation.x = Math.PI / 2;
      look.add(cap);
    }
    const g = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), glint);
    // all of it inside the lids' shell (0.57), which a glint further out poked through when they shut
    g.position.set(sx * 0.1, 0.12, 0.45);
    look.add(g);
    eye.add(look);
    // lids over the white (inside the eye's oval scale, so they are ovals too), a little proud of the socket; the
    // lash line rides the upper lid's rim, where it drew before the lids existed (tipped 0.45 forward of upright)
    const lids = eyelids('vi-lid' + s, EYE_RAD[0], lidMat, { gap: 0.14 });
    lids.rotation.z = 0;
    for (const m of lids.children) m.rotation.order = 'ZXY';
    const ln = new THREE.Mesh(new THREE.TorusGeometry(EYE_RAD[0] * 1.14 + 0.005, 0.055, 6, 24, Math.PI * 0.8), lash);
    ln.rotation.set(Math.PI / 2, 0, Math.PI * 0.1);
    lids.children[0]!.add(ln);
    setLid(lids, 0, 0, 0, 0, 0);
    eye.add(lids);
    onHead(d, eye, [sx * EYE_D[0], EYE_D[1], EYE_D[2]]);
  }
  // large round gold glasses: thick rims round the eyes, turned to follow the round face, a bridge, temples back
  const gold = d.std({ color: 0xd9a441, roughness: 0.32, metalness: 0.65 });
  const rimR = 0.76, rimZ = EYE_D[2] + EYE_RAD[2] + 0.14, turn = 0.3;
  const glasses = new THREE.Group();
  glasses.name = 'vi-glasses';
  for (const sx of [1, -1]) {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(rimR, 0.12, 12, 48), gold);
    rim.rotation.y = sx * turn;
    rim.position.set(sx * EYE_D[0], 0, rimZ);
    glasses.add(rim);
    // the temple: from the rim's outer edge back along the side of the head
    const a = new THREE.Vector3(sx * (EYE_D[0] + rimR * Math.cos(turn)), 0.05, rimZ - rimR * Math.sin(turn));
    const b = new THREE.Vector3(sx * 1.84, 0.05, -0.2);
    const tm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, a.distanceTo(b), 8), gold);
    tm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    tm.position.copy(a).add(b).multiplyScalar(0.5);
    glasses.add(tm);
  }
  const bridge = new THREE.Mesh(new THREE.TorusGeometry(EYE_D[0] - rimR * Math.cos(turn), 0.1, 8, 16, Math.PI), gold);
  bridge.position.set(0, 0.05, rimZ + rimR * Math.sin(turn));
  glasses.add(bridge);
  onHead(d, glasses, [0, EYE_D[1], 0]);

  // the beak: matte blue-charcoal, the upper half on the head, the lower on the jaw; the mouth dark behind them
  const beakMat = d.std({ vertexColors: true, roughness: 0.55, metalness: 0.02 });
  const upper = new THREE.Mesh(isoGeometry(upperBeakD, { min: [-1.15, 12.45, 0.9], max: [1.15, 14.35, 4.35] }, 34, beakColour(false), 12000), beakMat);
  upper.position.set(-HINGE_D[0], -HINGE_D[1], -HINGE_D[2]);
  const lower = new THREE.Mesh(isoGeometry(lowerBeakD, { min: [-0.85, 12.45, 0.9], max: [0.85, 13.25, 4.0] }, 30, beakColour(true), 10000), beakMat);
  lower.position.set(-HC[0], -HC[1], -HC[2]);
  // the upper half hangs from the gape's back corner too: a bird's upper bill lifts a little as it gapes (tick)
  const ug = new THREE.Group(); ug.name = 'vi-upper'; ug.add(upper); onHead(d, ug, HINGE_D);
  const lg = new THREE.Group(); lg.add(lower); onHead(d, lg, HC, 'jaw');
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), d.std({ color: MOUTH, roughness: 0.6 }));
  mouth.scale.set(0.6, 0.36, 0.55);
  onHead(d, mouth, [0, HINGE_D[1] - 0.05, HINGE_D[2] + 0.35]);

  // the socks: on the shins, from inside the sneakers to mid-shin
  const sock = new THREE.MeshStandardMaterial({ map: sockTexture(), roughness: 0.85, side: THREE.DoubleSide });
  const bot = 1.2;
  const kz = (yy: number) => KNEE[2] + (ANKLE[2] - KNEE[2]) * (KNEE[1] - yy) / (KNEE[1] - ANKLE[1]);
  for (const [shin, sx] of [['shinL', 1], ['shinR', -1]] as const) {
    const a = new THREE.Vector3(sx * KNEE[0], bot, kz(bot)), b = new THREE.Vector3(sx * KNEE[0], SOCK_TOP, kz(SOCK_TOP));
    // the cylinder's own seam (u = 0) faces +z: the chevrons' points are on the shin's front
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.53, a.distanceTo(b), 40, 1, true), sock);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    const mid = a.add(b).multiplyScalar(0.5);
    d.at(m, shin, mid.x, mid.y, mid.z);
  }
  // the sneakers: one shape for both (symmetric about its own middle)
  const shoe = isoGeometry(sneakerD, { min: [-0.95, -ANKLE[1] - 0.05, -1.2], max: [0.95, 0.75, 2.45] }, 26, sneakerColour, 10000);
  const shoeMat = d.std({ vertexColors: true, roughness: 0.55 });
  for (const [foot, sx] of [['footL', 1], ['footR', -1]] as const) d.at(new THREE.Mesh(shoe, shoeMat), foot, sx * ANKLE[0], ANKLE[1], ANKLE[2]);
}

// --- the face, moved by the wearer's (face tracking): lids that blink, wink, squint and widen, eyes that look, the crest
// as her brow, the glasses riding up and tilting with the brows, cheeks that puff and push up with a smile, the upper
// bill lifting a little as the beak gapes. With no face read she blinks now and then and her crest sways.

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** the lids' turns about the eye's axis (faceparts' eyelids, set here): the upper lid's rim at rest where the lash line
 *  was drawn, the lower low; shut, they meet a little below the middle */
const UP_OPEN = -1.12, LO_OPEN = 0.95, UP_SHUT = 0.2, LO_SHUT = 0.04;
/** close 0..1, squint lifts the lower lid (and drops the upper a little), wide pulls both back, scowl drops the upper
 *  lid over the iris's top; `tilt` slants the upper lid's line about the eye's front (radians, + raises its +x end) */
function setLid(g: THREE.Object3D, close: number, squint: number, wide: number, scowl: number, tilt: number): void {
  const up = g.children[0], lo = g.children[1];
  if (!up || !lo) return;
  const c = clamp01(close);
  const u = UP_OPEN - 0.38 * wide + 0.3 * squint + 0.55 * scowl, l = LO_OPEN + 0.2 * wide - 0.62 * squint;
  up.rotation.x = u + (UP_SHUT - u) * c;
  lo.rotation.x = l + (LO_SHUT - l) * c;
  up.rotation.z = tilt * (1 - c);
}

/** a damped spring (a feather's bounce): stepped in small steps, so a long frame cannot blow it up */
interface Spring { x: number; v: number }
function stepSpring(s: Spring, target: number, dt: number, w: number, zeta: number): void {
  const n = Math.min(12, Math.ceil(dt / 0.008));
  const h = n > 0 ? dt / n : 0;
  for (let i = 0; i < n; i++) { s.v += (w * w * (target - s.x) - 2 * zeta * w * s.v) * h; s.x += s.v * h; }
}

/** per worn copy: its face parts and rest poses, found once (a WeakMap: the stage's clone JSON-copies userData) */
interface VioletParts {
  lids: (THREE.Object3D | null)[]; looks: (THREE.Object3D | null)[]; lookRest: number[];
  glasses: THREE.Object3D | null; glassesY: number; upper: THREE.Object3D | null;
  crest: THREE.Object3D | null; cheeks: (THREE.Object3D | null)[]; cheekRest: THREE.Vector3[];
  head: THREE.Object3D | null; prev: THREE.Quaternion; dq: THREE.Quaternion;
  t: number; cx: Spring; cy: Spring; cz: Spring;
}
const VIOLET_PARTS = new WeakMap<THREE.Object3D, VioletParts>();

function violetParts(root: THREE.Object3D): VioletParts {
  let p = VIOLET_PARTS.get(root);
  if (p) return p;
  const by = (n: string) => root.getObjectByName(n) ?? null;
  const looks = [by('vi-lookL'), by('vi-lookR')], cheeks = [by('cheekL'), by('cheekR')];
  const glasses = by('vi-glasses'), head = by('head');
  p = {
    lids: [by('vi-lidL'), by('vi-lidR')], looks, lookRest: looks.flatMap((o) => [o?.rotation.x ?? 0, o?.rotation.y ?? 0]),
    glasses, glassesY: glasses?.position.y ?? 0, upper: by('vi-upper'),
    crest: by('crest'), cheeks, cheekRest: cheeks.map((o) => o?.position.clone() ?? new THREE.Vector3()),
    head, prev: head?.quaternion.clone() ?? new THREE.Quaternion(), dq: new THREE.Quaternion(),
    t: NaN, cx: { x: 0, v: 0 }, cy: { x: 0, v: 0 }, cz: { x: 0, v: 0 },
  };
  VIOLET_PARTS.set(root, p);
  return p;
}

function tickViolet(root: THREE.Object3D, t: number, f?: FaceState | null): void {
  const p = violetParts(root);
  const first = Number.isNaN(p.t);
  const dt = first ? 0 : Math.min(0.1, Math.max(0, t - p.t));
  p.t = t;
  // with no face, a blink every few seconds
  const ph = (t + 1.3) % 4.4, idleBlink = ph < 0.18 ? Math.sin((ph / 0.18) * Math.PI) : 0;
  const smL = f ? (f.smileL || f.smileR ? f.smileL : f.smile) : 0, smR = f ? (f.smileL || f.smileR ? f.smileR : f.smile) : 0;
  const downL = f?.browDownL ?? 0, downR = f?.browDownR ?? 0, inner = f?.browUp ?? 0;
  const outerL = f?.browOuterL ?? 0, outerR = f?.browOuterR ?? 0;
  const puff = f?.puff ?? 0, jaw = f?.jaw ?? 0;

  // the lids: a blink or a wink per side; a squint (or a smile's cheeks) lifts the lower; wide opens; a scowl slants
  // the upper lid down toward the beak, a worry (the inner brows up) up toward it
  for (let i = 0; i < 2; i++) {
    const g = p.lids[i];
    if (!g) continue;
    const sx = i === 0 ? 1 : -1;
    const close = f ? (i === 0 ? f.blinkL : f.blinkR) : idleBlink;
    const sq = f ? clamp01(Math.max(i === 0 ? f.squintL : f.squintR, 0.6 * (i === 0 ? smL : smR))) : 0;
    const wide = f ? (i === 0 ? f.wideL : f.wideR) : 0;
    const down = i === 0 ? downL : downR;
    setLid(g, close, sq, wide, down, sx * (0.3 * down - 0.22 * inner));
  }
  // the eyes look where the wearer looks (the iris turns inside the oval white)
  for (let i = 0; i < 2; i++) {
    const o = p.looks[i];
    if (o) o.rotation.set(p.lookRest[i * 2]! - (f?.lookY ?? 0) * 0.34, p.lookRest[i * 2 + 1]! + (f?.lookX ?? 0) * 0.5, 0);
  }
  // the glasses ride up with raised brows and a smile, and one brow tips them; they never sink (they rest on the beak:
  // lower, their rims went into it), so a tip raises one side, the other staying where it was
  if (p.glasses) {
    const tilt = Math.max(-0.13, Math.min(0.13, 0.1 * (outerL - outerR) + 0.08 * (downR - downL) + 0.04 * (smL - smR)));
    const lift = 0.16 * inner + 0.08 * (outerL + outerR) + 0.05 * (smL + smR) + EYE_D[0] * Math.abs(Math.sin(tilt));
    p.glasses.position.y = p.glassesY + lift * HS;
    p.glasses.rotation.z = tilt;
  }
  // the upper bill lifts a little as she gapes, and with a sneer
  if (p.upper) p.upper.rotation.x = -(0.1 * jaw + 0.08 * (f?.sneer ?? 0));
  // cheeks: puffed out (and forward), pushed up by a smile on their side
  for (let i = 0; i < 2; i++) {
    const c = p.cheeks[i];
    if (!c) continue;
    const sx = i === 0 ? 1 : -1, sm = i === 0 ? smL : smR, r = p.cheekRest[i]!;
    c.position.set(r.x + sx * 0.3 * puff * HS, r.y + (0.16 * sm - 0.05 * puff) * HS, r.z + (0.14 * puff + 0.04 * sm) * HS);
    c.scale.setScalar(1 + 0.14 * puff + 0.05 * sm);
  }
  // the crest is her brow: up with raised brows, wide eyes and surprise (more with the beak open), flat back with a scowl
  // or a frown, cocked by one brow. A spring with a little bounce, and it lags the head's own turns (feathers have mass)
  if (p.crest) {
    const up = f ? clamp01(Math.max(inner, 0.5 * (outerL + outerR)) + 0.25 * (f.wideL + f.wideR) + 0.35 * jaw * inner) : 0;
    const down = f ? clamp01(Math.max(0.5 * (downL + downR), 0.7 * f.frown)) : 0;
    const tx = 0.45 * up - 0.6 * down + (f ? 0 : 0.05 * Math.sin(t * 1.1));
    const tz = f ? 0.3 * (outerL - outerR) + 0.25 * (downR - downL) : 0.03 * Math.sin(t * 0.7);
    if (first) { p.cx.x = tx; p.cz.x = tz; p.cy.x = 0; }
    if (p.head && !first) {
      // the head's turn since the last frame, in its own frame (small: twice the vector part)
      const q = p.dq.copy(p.prev).invert().multiply(p.head.quaternion), s = q.w < 0 ? -2 : 2;
      p.cx.x -= 0.9 * q.x * s; p.cy.x -= 0.6 * q.y * s; p.cz.x -= 0.9 * q.z * s;
    }
    if (p.head) p.prev.copy(p.head.quaternion);
    stepSpring(p.cx, tx, dt, 11, 0.3); stepSpring(p.cy, 0, dt, 10, 0.3); stepSpring(p.cz, tz, dt, 11, 0.3);
    p.cx.x = Math.max(-1, Math.min(0.8, p.cx.x)); p.cy.x = Math.max(-0.5, Math.min(0.5, p.cy.x)); p.cz.x = Math.max(-0.6, Math.min(0.6, p.cz.x));
    p.crest.rotation.set(p.cx.x, p.cy.x, p.cz.x);
    p.crest.scale.set(1, 1 + 0.14 * up - 0.08 * down, 1);
  }
}

export const VIOLET: CharacterDef = {
  id: 'violet', name: 'Violet', blurb: 'The Valkyries’ lavender raven, in gold glasses',
  segs: VIOLET_SEGMENTS,
  body: {
    sdf: violetSDF, region: violetRegion, box: VIOLET_BOX,
    palette: [LAVENDER, SPECK, CLOTH, BLACK, 0xf6f4fa, PALE, DUSK],
    surface: 'soft', capture: violetCapture,
    fur: { length: 1.0, density: 4.5, tip: 0.3 }, furLen: violetFurLength,
    tint(r, x, y, z, c) {
      const p = parts(x, y, z);
      if ((r === 2 || r === 3) && (p === TORSO || p === SKIRT)) cloth(p, x, y, z, c);
      // the undercoat material darkens the body to 0.6 for the fur's roots: the cloth has no fur, so give it back
      if (r >= 2 && r <= 4) c.multiplyScalar(1.6);
      // the back a shade darker, the crown's pale blended into the lavender
      if (r !== 2 && r !== 3 && z < -0.6) c.multiplyScalar(1 - 0.12 * Math.min(1, (-0.6 - z) / 1.5));
    },
  },
  dress: dressViolet,
  tick: tickViolet,
  fit: { size: 1.1, limb: 0.55 },
  idle: { tail: 0.12 },
  face: { jaw: 0.45, eyes: [[EYE[0], EYE[1], EYE[2], EYE_R], [-EYE[0], EYE[1], EYE[2], EYE_R]] },
  // 72 and nine layers keep body, coat and the meshes under 150k triangles (ten were 164k)
  res: 72,
  furShells: 9,
};
