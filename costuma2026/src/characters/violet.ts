// Violet ("Vi"), the Golden State Valkyries' mascot, as a fan costume (founder, 2026-10-31: "to show our support"). What
// the team and the press said of her (Aug 2025): a purple raven, Muppet-like, near-sighted, in gold glasses, a
// one-of-a-kind dress and a bow, socks in the team's V (chevron) pattern, sneakers; curious, friendly, loves to dance.
// An affectionate, original rendering of that description — no logo, no wordmark, no text anywhere on her:
// - a big round Muppet head sitting right on her shoulders, a short tuft on top, a gold bow on her left; big white eyes
//   behind round gold glasses (rims, a bridge and temples: meshes on the head bone); a thick, glossy, charcoal raven's
//   beak whose lower half rides the `jaw` bone, so the wearer's open mouth opens hers;
// - plush violet plumage (fur.ts feathers, as Plume) on her head, shoulders, wings, thighs and tail;
// - wings for arms, hanging a little out from her sides, the primaries dark at the tips (no hands);
// - a black sleeveless dress: a V neckline and a hem in gold, a violet waistband, a pleated bell skirt;
// - knee socks with violet, black and gold chevrons on white, and violet high-top sneakers with white soles (meshes on
//   the shins and feet, so the stripes and the soles are crisp at any size).
// Frame: metres for a figure about 17 tall on y = 0, +z her beak, +x her own left (build.ts). The head's segment has its
// midpoint at the head's centre, which the stage puts on the wearer's head; a person's ears sit only ~0.3 torsos above
// their shoulder landmarks, so the big head is modelled low, resting on the shoulders as a mascot's does.
//
// Budget (lab, 2026-10-31): the dress and the skirt are a third of the surface and the fur's shells are drawn over all of
// it, so the skirt is solid (its inside, the hips and the thighs under it are not surface at all) and the shins stop
// inside the socks.
import * as THREE from 'three';
import type { Capture, CharacterDef, Dresser } from './build';
import { sdCapsule, sdEllipsoid, sdSphere, smin, type Seg } from './sdf';
import { isoGeometry } from './skeleton';

type V3 = [number, number, number];

// joints (the left side; the right is mirrored)
const HIP: V3 = [1.2, 7.9, 0], KNEE: V3 = [1.32, 4.5, 0.15], ANKLE: V3 = [1.32, 1.35, -0.1], TOE: V3 = [1.32, 1.0, 2.0];
// the wings hang a little out from her sides: a wing that touched the body would be joined to it by the marching cubes
// and tear off it when raised
const SHOULDER: V3 = [2.45, 12.1, 0], ELBOW: V3 = [3.3, 9.7, -0.1], WRIST: V3 = [3.85, 7.4, 0.15];
const WAIST = 9.4, HEM = 5.9;
const mx = (p: V3): V3 => [-p[0], p[1], p[2]];

// The head is designed at one size and drawn `HS` times that about its centre: everything on it (the beak, the eyes,
// the glasses, the bow) is given in design coordinates and placed through `hs`.
/** the head's centre (the head segment's midpoint) and its radii, design units */
const HC: V3 = [0, 13.6, 0.25];
const HR: V3 = [1.9, 1.95, 1.8];
const HS = 1.1;
const hs = (p: V3): V3 => [HC[0] + (p[0] - HC[0]) * HS, HC[1] + (p[1] - HC[1]) * HS, HC[2] + (p[2] - HC[2]) * HS];
/** her left eye's centre and radius, design units (the right mirrored) */
const EYE_D: V3 = [0.82, 14.25, 1.62];
const EYE_R_D = 0.56;
/** the back corner of the beak's gape, design units: the jaw's pivot */
const HINGE_D: V3 = [0, 13.05, 1.25];
/** the gape, design units: the line the two halves of the beak meet on, falling a little toward the tip */
const gape = (z: number) => HINGE_D[1] - 0.1 * (z - HINGE_D[2]);
// the same in model units
const EYE = hs(EYE_D), EYE_R = EYE_R_D * HS, HINGE = hs(HINGE_D);

export const VIOLET_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 7.9, 0], b: [0, 8.9, 0], parent: null },
  { name: 'spine1', a: [0, 8.9, 0], b: [0, 10.3, 0.05], parent: 'pelvis' },
  { name: 'spine2', a: [0, 10.3, 0.05], b: [0, 11.5, 0.05], parent: 'spine1' },
  { name: 'neck', a: [0, 11.5, 0.05], b: [0, 11.9, 0.1], parent: 'spine2' },
  { name: 'head', a: [0, 11.9, 0.1], b: [0, 15.3, 0.4], parent: 'neck' },
  // the lower mandible is a mesh on this bone; it takes nothing from the body
  { name: 'jaw', a: HINGE, b: hs([0, 12.75, 3.95]), parent: 'head', reach: 0 },
  // a short spray of tail feathers from under the back of the skirt
  { name: 'tail1', a: [0, 6.3, -1.3], b: [0, 5.75, -2.3], parent: 'pelvis', reach: 1.4 },
  { name: 'tail2', a: [0, 5.75, -2.3], b: [0, 5.3, -3.1], parent: 'tail1', reach: 1.4 },
  { name: 'tail3', a: [0, 5.3, -3.1], b: [0, 5.0, -3.7], parent: 'tail2', reach: 1.2 },
  { name: 'tail4', a: [0, 5.0, -3.7], b: [0, 4.8, -4.1], parent: 'tail3', reach: 1.0 },
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

export const VIOLET_BOX = { min: [-4.6, 2.3, -4.5] as V3, max: [4.6, 17.4, 2.5] as V3 };

const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// --- the parts, each its own field (the capture rule and the regions ask which part a point is on). Each starts with a
// bound: far from the part, a distance no greater than the true one, which is all the blends and the grid need (every
// bound here is past the widest blend it meets), and most of the grid is far from most parts

/** the body under the dress: a plump bird's breast, the shoulders' breadth, round shoulder caps, the hips */
function torsoD(x: number, y: number, z: number): number {
  if (y < 6.5) return 7.3 - y;
  if (y > 13.4) return y - 12.6;
  const ax = Math.abs(x);
  let d = sdEllipsoid(x, y, z, 0, 10.0, 0.1, 1.9, 2.4, 1.55);
  d = smin(d, sdEllipsoid(x, y, z, 0, 10.75, 0.45, 1.55, 1.3, 1.25), 0.6);
  d = smin(d, sdEllipsoid(x, y, z, 0, 11.45, 0, 2.15, 1.0, 1.35), 0.7);
  d = smin(d, sdSphere(ax, y, z, 2.2, 11.85, 0, 0.7), 0.5);
  return smin(d, sdEllipsoid(x, y, z, 0, 8.3, -0.1, 1.65, 1.0, 1.4), 0.6);
}

/** the skirt: a pleated bell from the waist (inside the body) to the hem */
function skirtD(x: number, y: number, z: number): number {
  if (y > WAIST + 0.6 || y < HEM - 0.6) return Math.max(y - WAIST, HEM - y);
  const t = Math.min(1, Math.max(0, (WAIST - y) / (WAIST - HEM))), f = 1 - (1 - t) * (1 - t);
  const pleat = 1 + 0.03 * f * Math.cos(Math.atan2(x, z) * 10);
  const rx = (1.72 + 0.95 * f) * pleat, rz = (1.45 + 0.85 * f) * pleat, zc = 0.05 - 0.1 * f;
  const ring = (Math.hypot(x / rx, (z - zc) / rz) - 1) * Math.min(rx, rz);
  return Math.max(ring, y - WAIST, HEM - y);
}

/** the head, design units: a big round Muppet head, plump cheeks, a tuft on top, sockets the eyes sit in */
function headDesign(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let h = sdEllipsoid(x, y, z, HC[0], HC[1], HC[2], HR[0], HR[1], HR[2]);
  h = smin(h, sdEllipsoid(ax, y, z, 0.9, 13.0, 0.7, 1.05, 0.9, 1.0), 0.5);
  for (const k of [-1, 0, 1]) {
    const c = 1 - Math.abs(k);
    h = smin(h, sdCapsule(x, y, z, k * 0.2, 15.2, 0.2, k * 0.55, 16.25 + c * 0.35, 0.55 + c * 0.25, 0.3, 0.09), 0.3);
  }
  return Math.max(h, -sdSphere(ax, y, z, EYE_D[0], EYE_D[1], EYE_D[2], EYE_R_D + 0.04));
}
/** a model point in the head's design units */
const toDesign = (x: number, y: number, z: number, f: (x: number, y: number, z: number) => number) =>
  f(HC[0] + (x - HC[0]) / HS, HC[1] + (y - HC[1]) / HS, HC[2] + (z - HC[2]) / HS) * HS;
function headD(x: number, y: number, z: number): number {
  if (y < 10.6) return 11.4 - y;
  return toDesign(x, y, z, headDesign);
}

/** a wing (`ax`: either side): the upper arm, the forearm's broad flat blade, four primaries past the wrist */
function wingD(ax: number, y: number, z: number): number {
  if (ax < 1.0) return 1.7 - ax;
  if (y > 13.4) return y - 12.8;
  if (y < 4.6) return 5.2 - y;
  let d = sdCapsule(ax, y, z, ...SHOULDER, ...ELBOW, 0.7, 0.58);
  const k = 1.75; // the blade is this much broader front to back than across
  d = smin(d, sdCapsule(ax, y, z / k, ELBOW[0], ELBOW[1], ELBOW[2] / k, WRIST[0], WRIST[1], WRIST[2] / k, 0.5, 0.4), 0.45);
  for (let i = 0; i < 4; i++) {
    const zk = -0.75 + i * 0.5, drop = 1.45 + 0.4 * (1 - Math.abs(zk) / 0.75);
    d = smin(d, sdCapsule(ax, y, z, WRIST[0] - 0.05, WRIST[1] + 0.5, zk * 0.8 + 0.1, WRIST[0] + 0.14, WRIST[1] - drop, zk * 1.15 + 0.15, 0.3, 0.09), 0.22);
  }
  return d;
}

/** a leg (`ax`): a plump thigh, the knee, the top of the shin (the rest is inside the sock) */
function legD(ax: number, y: number, z: number): number {
  if (y > 9.4) return y - 8.7;
  if (ax > 3.0) return ax - 2.1;
  let d = sdCapsule(ax, y, z, ...HIP, ...KNEE, 0.78, 0.56);
  d = smin(d, sdSphere(ax, y, z, ...KNEE, 0.6), 0.3);
  return smin(d, sdCapsule(ax, y, z, ...KNEE, KNEE[0], 3.0, 0.03, 0.55, 0.5), 0.3);
}

/** the tail: three feathers fanned down and back */
function tailD(x: number, y: number, z: number): number {
  if (z > 0) return z + 0.85;
  if (y > 7.6) return y - 6.8;
  let d = 1e9;
  for (const k of [-1, 0, 1]) {
    const c = 1 - Math.abs(k);
    d = smin(d, sdCapsule(x, y, z, k * 0.25, 6.3, -1.3, k * 0.9, 5.0 - c * 0.25, -3.7 - c * 0.35, 0.4, 0.13), 0.3);
  }
  return d;
}

export function violetSDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let d = smin(torsoD(x, y, z), headD(x, y, z), 0.8);
  d = smin(d, legD(ax, y, z), 0.55);
  // the wing joins the body only at the shoulder; lower down it stays apart, even where it passes near
  d = smin(d, wingD(ax, y, z), 0.05 + 0.5 * sstep(10.9, 11.8, y));
  return Math.min(d, skirtD(x, y, z), tailD(x, y, z));
}

const TORSO = 0, SKIRT = 1, HEAD = 2, WING = 3, LEG = 4, TAIL = 5;
/** the parts' distances at the last point asked, and which is nearest (asked once per vertex by each of three passes) */
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
 * shoulder blends the wing into the chest, the neck the head into the body). A raised wing takes only the wing (the
 * body under it stays with the spine: no sheet pulled up the flank); a leg only the leg; the head only the head and
 * neck. The skirt goes with the pelvis, and its front and sides with the thighs too (as the species' thigh rule), so a
 * squat lifts it instead of the knees going through it.
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
  if (n === 'head') return near(HEAD);
  if (n === 'jaw' || n.startsWith('foot')) return false;
  if (n.startsWith('tail')) return near(TAIL);
  if (n.startsWith('arm') || n.startsWith('forearm')) return near(WING);
  if (n.startsWith('shin')) return near(LEG);
  if (n.startsWith('thigh')) {
    if (near(LEG)) return true;
    return near(SKIRT) && z > -0.4 && y < HIP[1] + 0.8 && Math.abs(Math.abs(x) - HIP[0]) < 1.35;
  }
  return true;
};

const CREST_Y = hs([0, 15.95, 0])[1];
const neckline = (ax: number, z: number) => (z > 0 ? 11.55 - 1.0 * Math.max(0, 1 - ax / 1.05) : 11.55);
const BLACK_C = new THREE.Color(0x141218), GOLD_C = new THREE.Color(0xe2ac38), CLOTH_C = new THREE.Color(0x8a48d8);
/** a band's weight: 1 inside `half` of its centre, 0 past it, blended over `soft` either side */
const band = (s: number, half: number, soft: number) => 1 - sstep(half - soft, half + soft, Math.abs(s));
/** the dress's colour: black, the gold neckline and hem, the violet waistband (which also hides where the skirt leaves the body) */
function cloth(p: number, x: number, y: number, z: number, c: THREE.Color): void {
  c.copy(BLACK_C);
  if (p === TORSO) c.lerp(GOLD_C, band(y - (neckline(Math.abs(x), z) - 0.15), 0.15, 0.08));
  c.lerp(CLOTH_C, band(y - (WAIST - 0.17), 0.28, 0.08));
  if (p === SKIRT) c.lerp(GOLD_C, 1 - sstep(HEM + 0.34, HEM + 0.5, y));
}

/** Regions: 0 violet plumage, 1 dark violet (feather tips), 2 the dress's black, 3 gold trim, 4 white, 5 violet cloth. */
export function violetRegion(x: number, y: number, z: number): number {
  const ax = Math.abs(x), p = parts(x, y, z);
  if (p === SKIRT) return y < HEM + 0.42 ? 3 : y > WAIST - 0.45 ? 5 : 2;
  if (p === TORSO) {
    // a V neckline at the front, sleeveless (the shoulders feathered), a violet waistband
    const neck = neckline(ax, z);
    if (y > neck) return 0;
    if (y > neck - 0.3) return 3;
    if (y < WAIST + 0.1 && y > WAIST - 0.45) return 5;
    return 2;
  }
  if (p === HEAD) return y > CREST_Y ? 1 : 0;
  if (p === WING) return y < 6.9 ? 1 : 0;
  if (p === TAIL) return z < -3.2 ? 1 : 0;
  if (p === LEG) return y < 4.1 ? 4 : 0;
  return 0;
}

/** The plumage's length, 0..1.1: none on the dress, the legs in socks, round the eyes and the beak; plush elsewhere. */
export function violetFeatherLength(x: number, y: number, z: number): number {
  const r = violetRegion(x, y, z);
  if (r !== 0 && r !== 1) return 0;
  const p = parts(x, y, z);
  if (p === HEAD) {
    const dx = Math.abs(x) / HS, dy = HC[1] + (y - HC[1]) / HS, dz = HC[2] + (z - HC[2]) / HS;
    const e = Math.hypot(dx - EYE_D[0], dy - EYE_D[1], dz - EYE_D[2]);
    if (e < EYE_R_D + 0.28) return 0;
    if (dz > 0.95 && dx < 1.0 && Math.abs(dy - HINGE_D[1]) < 0.85) return 0; // round the beak's base
    if (dy > 15.4) return 0.6; // the tuft and the crown
    return 0.42 * Math.min(1, (e - EYE_R_D - 0.28) / 0.45);
  }
  if (p === TORSO) return 0.45; // the shoulders and the chest in the neckline
  if (p === WING) return y < 7.4 ? 1.0 : 0.7;
  if (p === TAIL) return 1.1;
  if (p === LEG) return 0.45;
  return 0.45;
}

// --- the meshes (the beak and the bow in the head's design units, scaled with it)

/** the upper mandible: thick, rounded, a ridge up toward the brow, the tip hooked over the lower */
const upperCore = (x: number, y: number, z: number) => smin(
  sdCapsule(x / 1.22, y, z, 0, 13.3, 1.1, 0, 12.95, 4.25, 0.82, 0.13) * 0.9,
  sdCapsule(x, y, z, 0, 13.75, 1.0, 0, 13.3, 3.0, 0.36, 0.25), 0.35);
function upperBeakD(x: number, y: number, z: number): number {
  const d = Math.max(upperCore(x, y, z), gape(z) - y);
  return smin(d, sdCapsule(x, y, z, 0, 12.92, 4.05, 0, 12.58, 4.38, 0.18, 0.07), 0.15);
}
/** the lower mandible, under the gape, a little shorter than the upper so the hook overhangs it */
const lowerCore = (x: number, y: number, z: number) => sdCapsule(x / 1.15, y, z, 0, 13.0, 1.1, 0, 12.75, 3.95, 0.62, 0.11) * 0.92;
const lowerBeakD = (x: number, y: number, z: number) => Math.max(lowerCore(x, y, z), y - gape(z) + 0.03);
const BEAK = 0x26242c, MOUTH = 0x5a1424, TONGUE = 0xc85a72;
/** the mouth's inside shows only when the beak is open: dark red under the upper, a pink tongue on the lower; the rims stay beak */
const beakColour = (lower: boolean) => (x: number, y: number, z: number, c: THREE.Color) => {
  const inside = (lower ? lowerCore : upperCore)(Math.abs(x) + 0.09, y, z) < 0 && z < 3.8;
  if (!lower && inside && y < gape(z) + 0.05) c.setHex(MOUTH);
  else if (lower && inside && y > gape(z) - 0.08) c.setHex(Math.abs(x) < 0.3 && z > 1.7 ? TONGUE : MOUTH);
  else c.setHex(BEAK);
};

/** the bow, in its own frame (x across, y up, z out of the head): two lobes pinched at a knot, two short tails */
function bowD(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  // each loop a rounded wedge, narrow at the knot and broad at its end, puffed in the middle
  const half = 0.13 + 0.42 * Math.min(ax, 1.25), puff = 0.1 + 0.13 * Math.sin(Math.PI * Math.min(1, ax / 1.3));
  let d = Math.max(Math.abs(y) - half, ax - 1.25, Math.abs(z) - puff) - 0.07;
  d = smin(d, sdEllipsoid(x, y, z, 0, 0, 0.04, 0.26, 0.3, 0.28), 0.08);
  // two ribbon tails from the knot, down and out
  return smin(d, sdCapsule(ax, y, z * 1.8, 0.08, -0.1, 0, 0.45, -0.95, 0, 0.13, 0.15), 0.08);
}

/** a sneaker in its ankle's frame: a white sole flat on the ground, a violet high-top, a white toe cap and laces */
function sneakerD(x: number, y: number, z: number): number {
  const Y = ANKLE[1];
  let d = Math.max(sdEllipsoid(x, y, z, 0, 0.32 - Y, 0.65, 0.84, 0.4, 1.72), -(y + Y));
  d = smin(d, sdEllipsoid(x, y, z, 0, 0.78 - Y, 0.55, 0.74, 0.6, 1.5), 0.2);
  d = smin(d, sdEllipsoid(x, y, z, 0, 0.62 - Y, 1.5, 0.7, 0.46, 0.85), 0.25);
  d = smin(d, sdCapsule(x, y, z, 0, 0.95 - Y, -0.2, 0, 1.45 - Y, -0.15, 0.62, 0.6), 0.3);
  return Math.max(d, -sdCapsule(x, y, z, 0, 1.4 - Y, -0.15, 0, 3 - Y, -0.15, 0.47, 0.47));
}
const SHOE = 0x7d3cd0, WHITE = 0xf4f2f8, GOLD = 0xe2ac38;
function sneakerColour(x: number, y: number, z: number, c: THREE.Color): void {
  const h = y + ANKLE[1]; // height above the ground
  if (h < 0.42 || (z > 1.75 && h < 0.9)) c.setHex(WHITE); // the sole and the toe cap
  else if (Math.abs(x) < 0.3 && z > 0.25 && z < 1.55 && h > 1.0) c.setHex(WHITE); // the laces
  else if (z < -0.75 && h > 0.95) c.setHex(GOLD); // the heel tab
  else c.setHex(SHOE);
}

/** the socks' chevrons, around (u: 0 is the front) and up (v): white with violet, black and gold Vs, a violet cuff */
function sockTexture(): THREE.DataTexture {
  const W = 128, H = 256, data = new Uint8Array(W * H * 4);
  const col = (hex: number) => [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
  const violet = col(0x7438c4), black = col(0x16141a), gold = col(0xf2b21c), white = col(WHITE);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const v = (j + 0.5) / H, th = ((i + 0.5) / W) * Math.PI * 2;
    // V at the front and the back: the stripe lowest on the shin's line, rising to the sides
    const s = v * 3.6 - 0.42 * Math.abs(Math.sin(th));
    const f = ((s % 1.2) + 1.2) % 1.2;
    let c = f < 0.36 ? violet : f < 0.48 ? white : f < 0.66 ? black : f < 0.78 ? white : f < 0.92 ? gold : white;
    if (v > 0.9) c = v > 0.94 ? violet : black; // the cuff
    data.set([c[0]!, c[1]!, c[2]!, 255], (j * W + i) * 4);
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
  // eyes: big white balls, black pupils looking a little in and down, a glint
  const white = d.std({ color: 0xfbfbff, roughness: 0.15 }), dark = d.std({ color: 0x07060c, roughness: 0.06 });
  const glint = d.std({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8, roughness: 0.2 });
  for (const sx of [1, -1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(EYE_R_D, 22, 16), white);
    const look = new THREE.Group();
    look.rotation.set(0.1, -sx * 0.16, 0);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(EYE_R_D + 0.012, 22, 6, 0, Math.PI * 2, 0, 0.5), dark);
    pupil.rotation.x = Math.PI / 2;
    look.add(pupil);
    const g = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), glint);
    g.position.set(sx * 0.09, 0.12, EYE_R_D + 0.02);
    look.add(g);
    e.add(look);
    onHead(d, e, [sx * EYE_D[0], EYE_D[1], EYE_D[2]]);
  }
  // round gold glasses: a rim round each eye, turned to follow the round face, a bridge over the beak, temples back
  const gold = d.std({ color: GOLD, roughness: 0.22, metalness: 0.9 });
  const rimR = 0.7, rimZ = EYE_D[2] + EYE_R_D + 0.12, turn = 0.32;
  const glasses = new THREE.Group();
  for (const sx of [1, -1]) {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(rimR, 0.085, 10, 44), gold);
    rim.rotation.y = sx * turn;
    rim.position.set(sx * EYE_D[0], 0, rimZ);
    glasses.add(rim);
    // the temple: from the rim's outer edge back along the side of the head
    const a = new THREE.Vector3(sx * (EYE_D[0] + rimR * Math.cos(turn)), 0.05, rimZ - rimR * Math.sin(turn));
    const b = new THREE.Vector3(sx * 1.86, 0.05, -0.2);
    const tm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, a.distanceTo(b), 8), gold);
    tm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    tm.position.copy(a).add(b).multiplyScalar(0.5);
    glasses.add(tm);
  }
  const bridge = new THREE.Mesh(new THREE.TorusGeometry(EYE_D[0] - rimR * Math.cos(turn), 0.075, 8, 16, Math.PI), gold);
  bridge.position.set(0, 0.02, rimZ + rimR * Math.sin(turn));
  glasses.add(bridge);
  onHead(d, glasses, [0, EYE_D[1], 0]);

  // the beak: glossy charcoal, the upper half on the head, the lower on the jaw; the mouth dark behind them
  const beakMat = d.std({ vertexColors: true, roughness: 0.3, metalness: 0.08 });
  const upper = new THREE.Mesh(isoGeometry(upperBeakD, { min: [-1.1, 12.4, 0.9], max: [1.1, 14.3, 4.5] }, 36, beakColour(false), 12000), beakMat);
  upper.position.set(-HC[0], -HC[1], -HC[2]);
  const lower = new THREE.Mesh(isoGeometry(lowerBeakD, { min: [-0.8, 12.3, 0.9], max: [0.8, 13.15, 4.1] }, 32, beakColour(true), 10000), beakMat);
  lower.position.set(-HC[0], -HC[1], -HC[2]);
  const ug = new THREE.Group(); ug.add(upper); onHead(d, ug, HC);
  const lg = new THREE.Group(); lg.add(lower); onHead(d, lg, HC, 'jaw');
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), d.std({ color: MOUTH, roughness: 0.6 }));
  mouth.scale.set(0.55, 0.36, 0.55);
  onHead(d, mouth, [0, HINGE_D[1] - 0.05, HINGE_D[2] + 0.35]);

  // the bow: gold, on the left of her crown, tilted to lie on the head's slope
  const bow = new THREE.Mesh(isoGeometry(bowD, { min: [-1.55, -1.05, -0.35], max: [1.55, 0.75, 0.4] }, 30, undefined, 10000), d.std({ color: GOLD, roughness: 0.35, metalness: 0.55 }));
  bow.rotation.set(-0.25, 0.15, -0.55);
  onHead(d, bow, [1.0, 15.25, 0.45]);

  // the socks: on the shins, from inside the sneakers to just under the knee
  const sock = new THREE.MeshStandardMaterial({ map: sockTexture(), roughness: 0.85, side: THREE.DoubleSide });
  const top = 4.15, bot = 1.2;
  const kz = (yy: number) => KNEE[2] + (ANKLE[2] - KNEE[2]) * (KNEE[1] - yy) / (KNEE[1] - ANKLE[1]);
  for (const [shin, sx] of [['shinL', 1], ['shinR', -1]] as const) {
    const a = new THREE.Vector3(sx * KNEE[0], bot, kz(bot)), b = new THREE.Vector3(sx * KNEE[0], top, kz(top));
    // the cylinder's own seam (u = 0) faces +z: the chevrons' points are on the shin's front
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.53, a.distanceTo(b), 40, 1, true), sock);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    const mid = a.add(b).multiplyScalar(0.5);
    d.at(m, shin, mid.x, mid.y, mid.z);
  }
  // the sneakers: one shape for both (symmetric about its own middle)
  const shoe = isoGeometry(sneakerD, { min: [-0.95, -ANKLE[1] - 0.05, -1.2], max: [0.95, 0.75, 2.45] }, 28, sneakerColour, 10000);
  const shoeMat = d.std({ vertexColors: true, roughness: 0.5 });
  for (const [foot, sx] of [['footL', 1], ['footR', -1]] as const) d.at(new THREE.Mesh(shoe, shoeMat), foot, sx * ANKLE[0], ANKLE[1], ANKLE[2]);
}

export const VIOLET: CharacterDef = {
  id: 'violet', name: 'Violet', blurb: 'The Valkyries’ purple raven, in gold glasses',
  segs: VIOLET_SEGMENTS,
  body: {
    sdf: violetSDF, region: violetRegion, box: VIOLET_BOX,
    palette: [0x7a3cc8, 0x2c1448, 0x141218, GOLD, WHITE, 0x8a48d8],
    surface: 'soft', capture: violetCapture,
    fur: { length: 1.2, density: 2.0, tip: 0.3, feather: true }, furLen: violetFeatherLength,
    tint(r, x, y, z, c) {
      // the dress's bands blended across their edges, not switched at a vertex: the grid is coarse and a hard edge
      // zigzags (a V neckline most of all)
      const p = parts(x, y, z);
      if (r >= 2 && (p === TORSO || p === SKIRT)) cloth(p, x, y, z, c);
      // the undercoat material darkens the body to 0.6 for the fur's roots: the cloth has no fur, so give it back
      if (r >= 2) c.multiplyScalar(1.6);
      // a raven's back is a shade darker
      if ((r === 0 || r === 1) && z < -0.6) c.multiplyScalar(1 - 0.18 * Math.min(1, (-0.6 - z) / 1.5));
    },
  },
  dress: dressViolet,
  fit: { size: 1.1, limb: 0.55 },
  idle: { tail: 0.12 },
  face: { jaw: 0.45, eyes: [[EYE[0], EYE[1], EYE[2], EYE_R], [-EYE[0], EYE[1], EYE[2], EYE_R]] },
  // 76 and seven layers keep body, coat and the meshes near 150k triangles (88 and nine were 265k)
  res: 76,
  furShells: 7,
};
