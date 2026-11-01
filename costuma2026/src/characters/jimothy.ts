// Jimothy, upright: the Seattle raccoon who went viral in July 2026 for being short and round — "scrunched together like
// an accordion", head perched high above the shoulders (vets think short spine syndrome) — stood up on his hind legs as a
// costume. Strollzilla's Jimothy (src/render/kaiju/raccoon.ts, 93b9331) is the same raccoon on four legs; his head,
// markings and coat are that file's, scaled; the body is new, because a person's arms must drive his arms and a
// person's legs his legs.
//
// The design, in the wearer's torsos (hips 0, shoulders 1, a person's head centre about 1.5) once the stage has fitted
// him (fit.size below):
// - **a ball, not a torso**: a belly from a little under the hips to the shoulders, about 1.6 torsos wide, with a
//   narrower chest on top, so a person standing inside it is covered;
// - **the head where the person's is**: its centre at about 1.75, big enough (1.3 to 2.2, the ears to 2.4) that a face
//   inside it is hidden. A person's head sits right on their shoulders, so his can't float far above the ball: the
//   "perched" look is a tall skull, upright ears and a pinch at the neck, not a long neck;
// - **short, thick limbs**: legs about two thirds of a person's, arms about four fifths; fit.limb stretches them part
//   of the way so his hands still follow the wearer's. The shoulders sit out on the ball's upper sides and a little
//   forward, so arms hanging at a person's sides lie half out of the ball, hugging it, instead of vanishing into it;
// - **the ringed tail** hangs behind and curls out to his left along the ground, so a camera in front sees it past his
//   leg.
// Frame: metres for a figure about 18 tall on y = 0 (build.ts), +z his nose, +x his own left.
//
// Skinning is the hard part of a ball with arms. With the two-nearest-bones blend every point near a shoulder joint is
// "near the arm", so a raised arm drags the ball's side up into a sheet (Howler's cheer does this from the hip). Here
// every vertex first asks which *part* it is on (the SDF pieces below, grouped: body, head, each arm, each leg, the
// tail) and a bone may take only its own part's vertices, plus a thin seam where two parts meet. The shoulder joint sits
// in the middle of a round shoulder pad that belongs to the body, so the arm's root lies on a sphere about its pivot:
// when it swings, the seam slides over the pad instead of tearing off it. It still stretches — the arm's side of the
// seam turns and the body's doesn't, and two-bone blending by distance to the bones' axes cannot grade it, the spine's
// axis being three metres off — so the arm leaves the shoulder thin, where that stretch is paid by its girth.
//
// The face follows the wearer's (FaceState, build.ts; `tick` below). The lower jaw is its own mesh, rigid on the `jaw`
// bone and furred like the rest (wolf.ts furredPart): the head below the mouth line, ahead of the hinge, is cut away and
// handed to it, so a closed mouth is the old face with a fine line under the whisker pads, and an open one a clean gap
// with a dark palate, a pink tongue and small fangs, its sides closed by a dark membrane (wolf.ts mouthSides). Black bead
// eyes with a glint that shifts as the wearer looks, under lids of the mask's dark (a blink is the shine going out, a
// smile pushes the lower lids up); the pale brows, the ears and the cheek ruffs ride small bones that
// take a smooth share of the head's skin (wolf.ts faceZones), so brows lift and knit, ears perk and flatten, cheeks
// bunch up in a smile and puff, all in the fur itself; whiskers twitch.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { CharacterDef, Capture, Dresser, FaceState } from './build';
import { eyelids, look, setLids } from './faceparts';
import { faceZones, furredPart, idleBlink, mouthSides, smax, smileLids, sstep, type Zone } from './wolf';
import { sdCapsule, sdEllipsoid, sdSphere, smin, type Seg } from './sdf';

type V3 = [number, number, number];

// joints (the left side; the right is mirrored)
// the legs stand apart: closer, the thighs met at the midline and a squat, splaying them, tore the skin they shared
const LX = 2.1;
const HIP: V3 = [1.95, 6.0, 0.2], KNEE: V3 = [LX, 3.4, 0.55], ANKLE: V3 = [LX, 1.0, 0.0], TOE: V3 = [LX, 0.3, 2.0];
// the arms rest out, nearly level and a little forward. A swing from rest stretches the skin where the arm meets the
// body; measured on the CPU-skinned mesh, the stretched skin on a hanging arm halves from 12° under level to 45°, the
// cheer's is no smaller, and at 45° (the arm's underside then joined to the chest) it runs down the body as a web that
// shows from the front. Hanging, they would lie in the ball and the marching cubes would join them to it
const SHOULDER: V3 = [2.9, 11.0, 0.8], ELBOW: V3 = [4.99, 10.54, 1.28], WRIST: V3 = [6.76, 10.06, 1.79];
const TAIL: V3[] = [[0, 6.6, -2.6], [0.5, 4.6, -4.4], [1.6, 2.4, -5.3], [3.0, 1.1, -5.2], [4.5, 0.85, -4.1]];
const TAIL_R = [1.15, 1.45, 1.4, 1.2, 0.75];
/** the skull's centre: everything on the head is placed from it */
const SK: V3 = [0, 14.4, 0.6];
// The mouth, in head coordinates (from SK): a line through the jaw's hinge, under the cheeks, rising a little to under
// the nose. Below it, ahead of the hinge and within MOUTH_W of the middle, the head is the lower jaw's.
const HINGE_Y = -1.25, HINGE_Z = 0.9, MOUTH_SLOPE = 0.08, MOUTH_W = 0.74;
/** height over the mouth line (head coordinates) */
const overMouth = (hy: number, hz: number) => hy - HINGE_Y - MOUTH_SLOPE * (hz - HINGE_Z);
/** the jaw's share of the head, as a distance (negative inside) */
const jawRegion = (ax: number, hy: number, hz: number) => Math.max(overMouth(hy, hz), HINGE_Z - hz, ax - MOUTH_W);
// the face's bones, model coordinates (the left; the right mirrored): an ear's pivot at its root, a brow's at the middle
// of the pale arc over the eye, a cheek's at the middle of its ruff
const EAR: V3 = [1.44, SK[1] + 1.5, SK[2] - 0.66], BROW: V3 = [1.1, SK[1] + 1.1, SK[2] + 1.5], CHEEK: V3 = [1.8, SK[1] - 0.66, SK[2] + 0.25];

export const JIMOTHY_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 6.0, 0], b: [0, 7.6, 0], parent: null },
  { name: 'spine1', a: [0, 7.6, 0], b: [0, 9.4, 0.1], parent: 'pelvis' },
  { name: 'spine2', a: [0, 9.4, 0.1], b: [0, 11.4, 0.1], parent: 'spine1' },
  { name: 'neck', a: [0, 11.4, 0.1], b: [0, SK[1] - 1.6, SK[2] - 0.25], parent: 'spine2' },
  { name: 'head', a: [0, SK[1] - 1.6, SK[2] - 0.25], b: [0, SK[1] + 1.6, SK[2] + 0.1], parent: 'neck' },
  // the jaw's mesh is rigid (no skin): `a` its hinge, `b` the middle of the mouth's opening (where the breath leaves)
  { name: 'jaw', a: [0, SK[1] + HINGE_Y, SK[2] + HINGE_Z], b: [0, SK[1] + HINGE_Y + MOUTH_SLOPE * 2.1 - 0.15, SK[2] + 3.0], parent: 'head', reach: 0 },
  { name: 'tail1', a: TAIL[0]!, b: TAIL[1]!, parent: 'pelvis' },
  { name: 'tail2', a: TAIL[1]!, b: TAIL[2]!, parent: 'tail1' },
  { name: 'tail3', a: TAIL[2]!, b: TAIL[3]!, parent: 'tail2' },
  { name: 'tail4', a: TAIL[3]!, b: TAIL[4]!, parent: 'tail3' },
  { name: 'thighL', a: HIP, b: KNEE, parent: 'pelvis' },
  { name: 'shinL', a: KNEE, b: ANKLE, parent: 'thighL' },
  { name: 'footL', a: ANKLE, b: TOE, parent: 'shinL' },
  { name: 'thighR', a: mx(HIP), b: mx(KNEE), parent: 'pelvis' },
  { name: 'shinR', a: mx(KNEE), b: mx(ANKLE), parent: 'thighR' },
  { name: 'footR', a: mx(ANKLE), b: mx(TOE), parent: 'shinR' },
  { name: 'armL', a: SHOULDER, b: ELBOW, parent: 'spine2' },
  { name: 'forearmL', a: ELBOW, b: WRIST, parent: 'armL' },
  { name: 'armR', a: mx(SHOULDER), b: mx(ELBOW), parent: 'spine2' },
  { name: 'forearmR', a: mx(ELBOW), b: mx(WRIST), parent: 'armR' },
  // the face's bones: no skin from the build (reach 0); `dress` gives each a share of the head's (faceZones)
  { name: 'earL', a: EAR, b: [EAR[0], EAR[1] + 1.5, EAR[2]], parent: 'head', reach: 0 },
  { name: 'earR', a: mx(EAR), b: [-EAR[0], EAR[1] + 1.5, EAR[2]], parent: 'head', reach: 0 },
  { name: 'browL', a: BROW, b: [BROW[0] + 0.8, BROW[1] - 0.15, BROW[2] - 0.4], parent: 'head', reach: 0 },
  { name: 'browR', a: mx(BROW), b: [-BROW[0] - 0.8, BROW[1] - 0.15, BROW[2] - 0.4], parent: 'head', reach: 0 },
  { name: 'cheekL', a: CHEEK, b: [CHEEK[0] + 1.0, CHEEK[1], CHEEK[2]], parent: 'head', reach: 0 },
  { name: 'cheekR', a: mx(CHEEK), b: [-CHEEK[0] - 1.0, CHEEK[1], CHEEK[2]], parent: 'head', reach: 0 },
];
function mx(p: V3): V3 { return [-p[0], p[1], p[2]]; }

export const JIMOTHY_BOX = { min: [-8.6, -0.4, -7.2] as V3, max: [8.6, 18.4, 5.8] as V3 };

// his eyes and nose (dress hangs them on the head bone); Strollzilla's head scaled by 0.82 about the skull's centre
export const JIMOTHY_EYES: V3 = [0.98, SK[1] + 0.33, SK[2] + 1.97];
export const JIMOTHY_NOSE: V3 = [0, SK[1] - 0.5, SK[2] + 4.05];

// the hand's frame: along the forearm, and across it (the fingers spread front to back while the arm is out)
const FA = norm(sub(WRIST, ELBOW));
const ACROSS = norm([-FA[2], 0, FA[0]]);
function sub(a: V3, b: V3): V3 { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function norm(a: V3): V3 { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; }
const along = (p: V3, k: number, s: number, dy = 0): V3 => [p[0] + FA[0] * k + ACROSS[0] * s, p[1] + FA[1] * k + ACROSS[1] * s + dy, p[2] + FA[2] * k + ACROSS[2] * s];
const PALM = along(WRIST, 0.35, 0);
const HAND_TIP = along(PALM, 1.3, 0);
/** how far past the wrist a point is, along the forearm (the hand is dark from just before it) */
const pastWrist = (ax: number, y: number, z: number) => (ax - WRIST[0]) * FA[0] + (y - WRIST[1]) * FA[1] + (z - WRIST[2]) * FA[2];

// the fingers, thumb and toes as fixed capsules (root, tip): built once, never per sample
const FINGERS: [V3, V3][] = [-0.42, -0.14, 0.14, 0.42].map((s) => [along(PALM, 0.35, s * 1.1), along(PALM, 1.15 - Math.abs(s) * 0.5, s * 1.35, -0.12)]);
FINGERS.push([along(PALM, -0.1, 0.45), along(PALM, 0.45, 0.95, -0.1)]);
const TOES: [V3, V3][] = [-0.5, -0.17, 0.17, 0.5].map((s) => [[LX + s * 1.1, 0.3, 1.8], [LX + s * 1.3, 0.22, 2.7 - Math.abs(s) * 0.4]]);
const capV = (x: number, y: number, z: number, a: V3, b: V3, ra: number, rb: number) => sdCapsule(x, y, z, a[0], a[1], a[2], b[0], b[1], b[2], ra, rb);

/** each part's distance, for the surface and for who may skin it */
interface Parts { body: number; head: number; arm: number; leg: number; tail: number; min: number; raw: number; cut: number }
/**
 * A part further than FAR from a point is given its bound's distance instead of its own: the field clamps past 1.25
 * (build.ts), and nothing reads a part that far for skinning, so only the build time sees the difference (with the
 * fingers made constants, the grid's pass went from 1.8 s to 0.55 s in Node).
 */
const FAR = 2.5;
let lx = NaN, ly = NaN, lz = NaN;
const P: Parts = { body: 0, head: 0, arm: 0, leg: 0, tail: 0, min: 0, raw: 0, cut: 0 };

/**
 * The whole head before the mouth is cut (head coordinates hy, hz; model x): broad cheeks, a pointed muzzle with whisker
 * pads under it, rounded upright ears, sockets for the eyes. The lower jaw is not in it: the jaw's mesh adds its own chin.
 */
function headRaw(x: number, ax: number, hy: number, hz: number): number {
  let h = sdEllipsoid(x, hy, hz, 0, 0, 0, 2.38, 2.05, 2.21);
  h = smin(h, sdEllipsoid(ax, hy, hz, 1.8, -0.66, 0.25, 1.15, 1.23, 1.31), 0.66); // the cheek ruff
  h = smin(h, sdCapsule(x, hy, hz, 0, -0.25, 1.48, 0, -0.57, 3.6, 1.11, 0.45), 0.5); // the muzzle
  // the whisker pads: the muzzle's underside a little fuller, so the upper lip covers the chin's top
  h = smin(h, sdEllipsoid(ax, hy, hz, 0.3, -0.86, 2.75, 0.4, 0.3, 0.62), 0.3);
  h = smin(h, sdEllipsoid(ax, hy, hz, 1.44, 2.05, -0.66, 0.78, 1.03, 0.34), 0.29); // the ears
  return Math.max(h, -sdSphere(ax, hy, hz, JIMOTHY_EYES[0] + 0.05, JIMOTHY_EYES[1] - SK[1], JIMOTHY_EYES[2] - SK[2] + 0.2, 0.34));
}

/** on the faces the jaw's cut leaves in the head (the palate, the walls): where the cut, not the head, is the surface */
const inMouth = (p: Parts) => p.cut < 0.08 && -p.cut > p.raw - 0.02;

/** the lower jaw, a mesh rigid on the `jaw` bone (model coordinates): the head's share under the mouth line, a chin */
function jawSDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x), hy = y - SK[1], hz = z - SK[2];
  let j = smax(headRaw(x, ax, hy, hz), jawRegion(ax, hy, hz), 0.06);
  j = smin(j, sdCapsule(x, hy, hz, 0, -1.07, 1.15, 0, -1.23, 2.95, 0.78, 0.41), 0.2); // the chin
  return Math.max(j, overMouth(hy, hz), HINGE_Z - 0.3 - hz);
}
const JAW_BOX = { min: [-1.0, SK[1] - 2.1, SK[2] + 0.5], max: [1.0, SK[1] - 0.8, SK[2] + 3.6] } as const;

/** the parts at a point; the last point asked is kept (region, tint and capture ask about the same vertex in turn) */
function parts(x: number, y: number, z: number): Parts {
  if (x === lx && y === ly && z === lz) return P;
  lx = x; ly = y; lz = z;
  const ax = Math.abs(x);
  // the ball: a belly that hangs a little below the hips, a narrower chest on it, a pad round each shoulder joint
  let b = sdSphere(x, y, z, 0, 9.2, 0.2, 5.6);
  if (b < FAR) {
    b = sdEllipsoid(x, y, z, 0, 7.7, 0.35, 3.85, 3.35, 3.4);
    b = smin(b, sdEllipsoid(x, y, z, 0, 10.3, 0.3, 3.0, 2.1, 2.7), 1.6);
    b = smin(b, sdEllipsoid(x, y, z, 0, 6.9, -1.2, 3.4, 2.6, 2.7), 1.2); // the seat
    b = smin(b, sdSphere(ax, y, z, SHOULDER[0], SHOULDER[1], SHOULDER[2], 0.85), 0.7);
    // the neck's ruff: short and thick, a pinch under the skull
    b = smin(b, sdCapsule(x, y, z, 0, 11.0, 0.2, 0, SK[1] - 1.4, SK[2] - 0.15, 2.1, 1.7), 0.8);
  }
  P.body = b;
  // the head (headRaw), with the jaw's share cut away: a fine fillet at the lip, the line a closed mouth shows
  const hy = y - SK[1], hz = z - SK[2];
  let h = sdSphere(x, hy, hz, 0, 0.6, 0.5, 4.3), cut = 9;
  P.raw = h;
  if (h < FAR) {
    P.raw = h = headRaw(x, ax, hy, hz);
    cut = jawRegion(ax, hy, hz);
    h = smax(h, -cut, 0.08);
  }
  P.head = h; P.cut = cut;
  // the arm on this side: thin where it leaves the shoulder (the skin there is what a swing stretches, by its girth and
  // its distance from the joint) and thick past it, a forearm, a dark hand with a raccoon's long fingers
  let a = capV(ax, y, z, SHOULDER, HAND_TIP, 1.6, 1.6);
  if (a < FAR) {
    a = capV(ax, y, z, SHOULDER, ELBOW, 0.72, 0.8);
    a = smin(a, sdSphere(ax, y, z, (SHOULDER[0] + ELBOW[0]) / 2, (SHOULDER[1] + ELBOW[1]) / 2, (SHOULDER[2] + ELBOW[2]) / 2, 0.9), 0.6);
    a = smin(a, capV(ax, y, z, ELBOW, WRIST, 0.8, 0.6), 0.4);
    if (sdSphere(ax, y, z, PALM[0], PALM[1], PALM[2], 1.6) < FAR) {
      a = smin(a, sdEllipsoid(ax, y, z, PALM[0], PALM[1], PALM[2], 0.62, 0.38, 0.62), 0.3);
      for (const f of FINGERS) a = smin(a, capV(ax, y, z, f[0], f[1], 0.24, 0.17), 0.14);
    }
  }
  P.arm = a;
  // the leg on this side: a thick haunch into a short shank, a long flat hind foot
  let l = sdCapsule(ax, y, z, HIP[0], HIP[1], HIP[2], LX, 0.6, 1.0, 2.0, 2.0);
  if (l < FAR) {
    l = capV(ax, y, z, HIP, KNEE, 1.42, 1.1);
    l = smin(l, capV(ax, y, z, KNEE, ANKLE, 1.08, 0.85), 0.5);
    if (y < 2.6) {
      l = smin(l, Math.max(sdEllipsoid(ax, y, z, LX, 0.45, 0.75, 0.95, 0.6, 1.75), -y), 0.45);
      for (const t of TOES) l = smin(l, capV(ax, y, z, t[0], t[1], 0.26, 0.18), 0.15);
    }
  }
  P.leg = l;
  // the tail: bushy, thick past the root
  let t = sdSphere(x, y, z, 2.0, 3.4, -4.4, 5.4);
  if (t < FAR) {
    t = 1e9;
    for (let i = 0; i + 1 < TAIL.length; i++) t = smin(t, capV(x, y, z, TAIL[i]!, TAIL[i + 1]!, TAIL_R[i]!, TAIL_R[i + 1]!), 0.5);
  }
  P.tail = t;
  P.min = Math.min(b, h, a, l, t);
  return P;
}

export function jimothySDF(x: number, y: number, z: number): number {
  const p = parts(x, y, z);
  let d = smin(p.body, p.head, 0.6);
  d = smin(d, p.arm, 0.5);
  d = smin(d, p.leg, 0.7);
  return smin(d, p.tail, 0.6);
}

/** distance along the tail from its root, for the rings */
function alongTail(x: number, y: number, z: number): number {
  let best = 0, bd = Infinity, acc = 0;
  for (let i = 0; i + 1 < TAIL.length; i++) {
    const a = TAIL[i]!, b = TAIL[i + 1]!;
    const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2], l2 = bx * bx + by * by + bz * bz;
    const u = Math.max(0, Math.min(1, ((x - a[0]) * bx + (y - a[1]) * by + (z - a[2]) * bz) / l2));
    const dx = x - a[0] - bx * u, dy = y - a[1] - by * u, dz = z - a[2] - bz * u, d = dx * dx + dy * dy + dz * dz;
    if (d < bd) { bd = d; best = acc + u * Math.sqrt(l2); }
    acc += Math.sqrt(l2);
  }
  return best;
}

/**
 * Regions: 0 grey-brown fur, 1 pale (brows, muzzle, ear rims), 2 dark (the mask, the stripe, the tail's rings and tip),
 * 3 black (the nose), 4 buff (the belly, the tail's light rings), 5 the paws' dark brown, 6 the mouth's inside (the
 * palate and the walls the jaw leaves, seen only when it opens).
 */
export function jimothyRegion(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  if (Math.hypot(x, y - JIMOTHY_NOSE[1], z - JIMOTHY_NOSE[2]) < 0.62) return 3;
  const p = parts(x, y, z), m = p.min;
  // (the lip's own fillet is dark, not red: the line a shut mouth shows)
  if (p.head === m && inMouth(p)) return p.raw < -0.08 ? 6 : 2;
  if (p.head === m) {
    // a bandit's mask: a dark oval round each eye drooping back toward the cheek, a dark stripe up the bridge from the
    // nose to the crown, a white arc over each eye, white from the muzzle down. In face coordinates, so it moves with SK
    const hy = y - SK[1], hz = z - SK[2];
    if (hz > 0.2 && hy > -1.9) {
      const ex = ax - 1.1, ev = hy - 0.22 + 0.32 * ex;
      if ((ex / 1.25) ** 2 + (ev / 0.66) ** 2 < 1) return 2;
      if (ax < 0.34 && hy > -0.35 && hy < 2.4 && hz > 0.6) return 2;
      const bx = ax - 1.05, bv = hy - 1.12 + 0.18 * bx;
      if ((bx / 1.0) ** 2 + (bv / 0.4) ** 2 < 1) return 1;
      if (hy < -0.15 + 0.25 * Math.max(0, ax - 1.2) && hz > 0.5) return 1;
    }
    if (hy > 2.75 && ax > 0.98) return 1; // the ears' rims
    return 0;
  }
  if (p.tail === m) { const t = alongTail(x, y, z); return t > 7.9 || t % 2.0 < 0.85 ? 2 : 4; }
  if (p.arm === m) return pastWrist(ax, y, z) > -0.25 ? 5 : 0;
  if (p.leg === m) return y < 1.3 ? 5 : 0;
  // the belly: a buff oval down the front of the ball
  if (z > 1.2 && (x / 2.4) ** 2 + ((y - 7.9) / 3.1) ** 2 < 1) return 4;
  return 0;
}

/** The coat's length, 0..1.4: bare at the eyes and nose, short on the face, hands and feet, long in the cheeks and tail. */
export function jimothyFurLength(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  const eye = Math.hypot(ax - JIMOTHY_EYES[0], y - JIMOTHY_EYES[1], z - JIMOTHY_EYES[2]);
  if (eye < 0.62 || Math.hypot(x, y - JIMOTHY_NOSE[1], z - JIMOTHY_NOSE[2]) < 0.85) return 0;
  const p = parts(x, y, z), m = p.min;
  if (p.head === m) {
    if (inMouth(p)) return 0;
    // bare along the mouth line: the fur's coarser shell cannot follow the cut, and strands there took the mouth's colour
    if (Math.abs(overMouth(y - SK[1], z - SK[2])) < 0.09 && z - SK[2] > HINGE_Z - 0.2 && ax < MOUTH_W + 0.1) return 0;
    const hy = y - SK[1], hz = z - SK[2];
    if (hy > 1.4 && ax > 0.9 && hz < 0.1) return 0.5; // the ears
    if (ax > 1.4 && hy < 0 && hz < 1.5) return 1.35; // the cheek ruff
    if (hz > 1.0) return 0.35 + 0.4 * Math.min(1, (eye - 0.62) / 1.3); // the face: short, longer away from the eyes
    return 0.9;
  }
  if (p.tail === m) return 1.4;
  if (p.arm === m) return pastWrist(ax, y, z) > -0.25 ? 0.25 : 0.9;
  if (p.leg === m) return y < 1.3 ? 0.3 : 1;
  return 1.1;
}

/**
 * Who may skin a vertex: a bone takes its own part's vertices and a seam SEAM wide where its part meets another. Asked
 * for every bone of every vertex (2.5M times a build), so the bone's part is a table lookup, not string tests.
 */
// measured on this body before the limb rules below (the share of the surface stretched past 4x in a cheer): 0.95 % at
// 0.8, 0.62 % at 0.4, 0.52 % at 0.12; at 0 the whole jump in weight sits in one row of triangles, a crease
const SEAM = 0.15;
const enum G { Body, Neck, Head, ArmL, ArmR, LegL, LegR, Tail }
const GROUP = new Map<string, G>([
  ['pelvis', G.Body], ['spine1', G.Body], ['spine2', G.Body], ['neck', G.Neck], ['head', G.Head], ['jaw', G.Head],
  ['armL', G.ArmL], ['forearmL', G.ArmL], ['armR', G.ArmR], ['forearmR', G.ArmR],
  ['thighL', G.LegL], ['shinL', G.LegL], ['footL', G.LegL], ['thighR', G.LegR], ['shinR', G.LegR], ['footR', G.LegR],
  ['tail1', G.Tail], ['tail2', G.Tail], ['tail3', G.Tail], ['tail4', G.Tail],
]);
/**
 * A forearm, shin or foot takes only what lies past a little before its joint: the soft falloff otherwise gives the
 * root of the arm a third of the forearm's weight, and a bent elbow (a wave) or knee (a squat) drags the shoulder or hip
 */
const SHIN = norm(sub(ANKLE, KNEE));
const CHILD = new Map<string, (ax: number, y: number, z: number) => boolean>([
  ['forearm', (ax, y, z) => (ax - ELBOW[0]) * FA[0] + (y - ELBOW[1]) * FA[1] + (z - ELBOW[2]) * FA[2] > -0.9],
  ['shin', (ax, y, z) => (ax - KNEE[0]) * SHIN[0] + (y - KNEE[1]) * SHIN[1] + (z - KNEE[2]) * SHIN[2] > -0.9],
  ['foot', (_ax, y) => y < ANKLE[1] + 0.7],
]);
const childOk = (n: string, x: number, y: number, z: number) => { const f = CHILD.get(n.slice(0, -1)); return !f || f(Math.abs(x), y, z); };
const jimothyCapture: Capture = (sg, x, y, z) => {
  const q = parts(x, y, z), lim = q.min + SEAM;
  switch (GROUP.get(sg.name)) {
    case G.Body: return q.body <= lim;
    // the neck takes the ball's top and the skull's underside, and the head the neck's ruff, so a turn of the head (the
    // neck bone never twists) is spread down the ruff instead of torn at the skull's rim; above the cheeks the head is
    // one rigid piece
    case G.Neck: return y > 10.6 && ((q.body <= lim && Math.abs(x) < 2.4) || (q.head <= lim && y < SK[1] - 1.6));
    case G.Head: return (q.head <= lim && y > SK[1] - 2.1) || (q.body <= lim && y > 12.0 && Math.abs(x) < 2.0);
    case G.ArmL: return q.arm <= lim && x > 0.5 && childOk(sg.name, x, y, z);
    case G.ArmR: return q.arm <= lim && x < -0.5 && childOk(sg.name, x, y, z);
    case G.LegL: return q.leg <= lim && x > 0.2 && childOk(sg.name, x, y, z);
    case G.LegR: return q.leg <= lim && x < -0.2 && childOk(sg.name, x, y, z);
    case G.Tail: return q.tail <= lim;
    default: return true;
  }
};

// ---- the face ----

const JIM_FUR = { length: 1.0, density: 7, tip: 0.18 };
const PALE = new THREE.Color(0xe6e0d2), MOUTH = new THREE.Color(0x5a262a), LIP = new THREE.Color(0x2a2420);

/** the jaw's colours: its top inside the upper lip is the mouth's, the rest the pale chin */
function jawColour(x: number, y: number, z: number, c: THREE.Color): void {
  // on top, the mouth only well inside the upper lip's footprint; at its rim a dark lip, the line a shut mouth shows
  const hy = y - SK[1], hz = z - SK[2], top = overMouth(hy, hz) > -0.06;
  c.copy(top ? (headRaw(x, Math.abs(x), hy + 0.02, hz) < -0.15 ? MOUTH : LIP) : PALE);
}
/** the jaw's coat: short and pale on the chin, none on the cut faces a closed mouth hides */
function jawFur(x: number, y: number, z: number): number {
  return overMouth(y - SK[1], z - SK[2]) > -0.08 || Math.abs(x) > MOUTH_W - 0.06 ? 0 : 0.42;
}

/** the left's share at x (the right takes the rest): a face bone's zone fades out across the middle */
const leftShare = (x: number) => sstep(-0.12, 0.12, x);
const ZONES: Zone[] = [1, -1].flatMap((sx) => {
  const s = sx > 0 ? 'L' : 'R', side = (x: number) => (sx > 0 ? leftShare(x) : 1 - leftShare(x));
  return [
    // an ear: what stands off the skull near the ear's own shape, so its root bends and the skull stays
    { bone: 'ear' + s, w: (x: number, y: number, z: number) => {
      const X = sx * x, hy = y - SK[1], hz = z - SK[2];
      const skull = Math.hypot(x / 2.38, hy / 2.05, hz / 2.21), e = Math.hypot((X - 1.44) / 0.78, (hy - 2.05) / 1.03, (hz + 0.66) / 0.34);
      return side(x) * sstep(1.0, 1.14, skull) * sstep(1.75, 1.25, e);
    } },
    // a brow: the pale arc over the eye and the fur round it, fading out before the stripe up the bridge
    { bone: 'brow' + s, w: (x: number, y: number, z: number) => {
      const r = Math.hypot((sx * x - BROW[0]) / 0.85, (y - BROW[1]) / 0.55, (z - BROW[2]) / 1.0);
      return side(x) * (1 - sstep(0.45, 1.0, r));
    } },
    // a cheek: the ruff, most at its middle
    { bone: 'cheek' + s, w: (x: number, y: number, z: number) => {
      const r = Math.hypot((sx * x - CHEEK[0]) / 1.6, (y - CHEEK[1]) / 1.4, (z - CHEEK[2]) / 1.6);
      return side(x) * (1 - sstep(0.45, 1.05, r));
    } },
  ];
});

function dress(d: Dresser): void {
  // the face's bones take their shares of the head's skin first (the jaw below joins the body's children after)
  faceZones(d, ZONES);
  // black, wet bead eyes in the mask, each with a glint that rides the eye as it turns (the bead itself shows no turn),
  // under lids of the mask's own dark: a blink is the shine going out of the mask
  const bead = d.std({ color: 0x050505, roughness: 0.06, metalness: 0.1 });
  const glint = d.std({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.1, roughness: 0.3 });
  const lid = d.std({ color: 0x211c19, roughness: 1 });
  for (const [sx, s] of [[1, 'L'], [-1, 'R']] as const) {
    const eye = new THREE.Group();
    eye.name = 'jim-eye' + s;
    eye.add(new THREE.Mesh(new THREE.SphereGeometry(0.34, 14, 10), bead));
    // a flat fleck on the bead's surface, inside the lids' radius so a shut lid hides it
    const gl = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), glint);
    gl.position.set(0.1, 0.15, 0.28);
    gl.scale.set(1, 1, 0.35);
    eye.add(gl);
    d.at(eye, 'head', sx * JIMOTHY_EYES[0], JIMOTHY_EYES[1], JIMOTHY_EYES[2]);
    d.at(eyelids('jim-lid' + s, 0.34, lid, { gap: 0.1 }), 'head', sx * JIMOTHY_EYES[0], JIMOTHY_EYES[1], JIMOTHY_EYES[2]);
  }
  // a black nose that shines
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 10), d.std({ color: 0x0a0a0a, roughness: 0.25 }));
  nose.scale.set(1.15, 0.8, 0.75);
  d.at(nose, 'head', JIMOTHY_NOSE[0], JIMOTHY_NOSE[1], JIMOTHY_NOSE[2]);

  // the lower jaw, furred; in it a pink tongue and two small fangs, and in the head two more over them, a row of tiny
  // incisors and a dark throat behind: all hidden while the mouth is shut
  furredPart(d, 'jim-jaw', 'jaw', jawSDF, JAW_BOX, 24, jawColour, JIM_FUR, 5, jawFur);
  const line = (hz: number) => SK[1] + HINGE_Y + MOUTH_SLOPE * (hz - HINGE_Z);
  const tongue = new THREE.SphereGeometry(1, 18, 10).scale(0.34, 0.14, 0.78).translate(0, line(2.05) - 0.12, SK[2] + 2.05);
  d.at(new THREE.Mesh(tongue, d.std({ color: 0xc8646e, roughness: 0.45 })), 'jaw', 0, 0, 0);
  const tooth = d.std({ color: 0xf2eee4, roughness: 0.35 });
  const fang = (x: number, hz: number, len: number, r: number, down: boolean) => {
    const g = new THREE.ConeGeometry(r, len, 7);
    if (down) g.rotateX(Math.PI);
    return g.translate(x, line(hz) + (down ? 0.1 - len / 2 : len / 2 - 0.1), SK[2] + hz);
  };
  const upper = [fang(0.3, 2.62, 0.34, 0.065, true), fang(-0.3, 2.62, 0.34, 0.065, true)];
  for (const x of [-0.19, -0.065, 0.065, 0.19]) upper.push(fang(x, 3.08, 0.2, 0.034, true));
  const lower = [fang(0.23, 2.45, 0.3, 0.055, false), fang(-0.23, 2.45, 0.3, 0.055, false)];
  d.at(new THREE.Mesh(mergeGeometries(upper)!, tooth), 'head', 0, 0, 0);
  d.at(new THREE.Mesh(mergeGeometries(lower)!, tooth), 'jaw', 0, 0, 0);
  // the mouth's sides, from the hinge to just behind the fangs, inside the jaw's top edge (wolf.ts mouthSides)
  const edge: V3[] = [];
  for (let i = 0; i <= 8; i++) { const hz = HINGE_Z + 0.05 + (i / 8) * 1.5; edge.push([0.68 - 0.13 * (hz - 1), line(hz), SK[2] + hz]); }
  mouthSides(d, 'jim-mouth', edge, 0x2a1214);
  const throat = new THREE.SphereGeometry(1, 14, 8).scale(0.5, 0.3, 0.45).translate(0, SK[1] - 1.35, SK[2] + 1.35);
  d.at(new THREE.Mesh(throat, d.std({ color: 0x1a0b0c, roughness: 0.9 })), 'head', 0, 0, 0);

  // whiskers: three dark ones from each whisker pad, fanned out and back (one mesh a side, turned by tick)
  const whisker = d.std({ color: 0x1b1816, roughness: 0.5 });
  for (const [sx, s] of [[1, 'L'], [-1, 'R']] as const) {
    const parts: THREE.BufferGeometry[] = [];
    for (const [dy, dz, ry, rz, len] of [[0.09, -0.04, 0.12, -0.32, 1.9], [-0.02, 0.06, -0.02, -0.2, 2.1], [-0.12, 0.15, -0.17, -0.1, 1.8]] as const) {
      const dir = new THREE.Vector3(sx, ry, rz).normalize();
      parts.push(new THREE.CylinderGeometry(0.01, 0.035, len, 5).translate(0, len / 2, 0)
        .applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)).translate(0, dy, dz));
    }
    const m = new THREE.Mesh(mergeGeometries(parts)!, whisker);
    m.castShadow = false;
    const g = new THREE.Group();
    g.name = 'jim-whisk' + s;
    g.add(m);
    d.at(g, 'head', sx * 0.55, SK[1] - 0.82, SK[2] + 2.8);
  }
}

/** per worn root: the face's moving parts, found once (a WeakMap: userData is JSON-copied when the stage clones) */
interface JimFace { eyes: Obj[]; lids: Obj[]; ears: Obj[]; brows: Obj[]; cheeks: Obj[]; whisk: Obj[] }
type Obj = THREE.Object3D | null;
const FACES = new WeakMap<THREE.Object3D, JimFace>();
const HEAD_A = JIMOTHY_SEGMENTS.find((s) => s.name === 'head')!.a;
/** a face bone's rest place in the head's frame (its segment's `a` from the head's) */
const BROW_O = [BROW[0] - HEAD_A[0], BROW[1] - HEAD_A[1], BROW[2] - HEAD_A[2]], CHEEK_O = [CHEEK[0] - HEAD_A[0], CHEEK[1] - HEAD_A[1], CHEEK[2] - HEAD_A[2]];
/** an ear's quick flick now and then (radians, back and forth), each ear on its own clock; 0 at the lab's t = 0.6 */
const flick = (t: number, ph: number) => { const u = (t + ph) % 6.1; return u < 0.4 ? 0.22 * Math.sin((u / 0.4) * Math.PI * 2) * (1 - u / 0.4) : 0; };
/** the whiskers' twitch now and then */
const twitch = (t: number) => { const u = (t + 2.2) % 3.7; return u < 0.45 ? 0.07 * Math.sin(u * 42) * (1 - u / 0.45) : 0; };

/**
 * The wearer's face on his: lids (blinkL/R, squintL/R, wideL/R, and smileL/R lifts the lower ones; an idle blink with
 * no face), the glints (lookX/Y),
 * brows (browUp the inner ends, browOuterL/R the outer, browDownL/R knit and low), ears (perk with wide and raised brows,
 * pinned back with a scowl, drooping with a frown; a flick now and then), cheeks (smileL/R bunch them up, puff swells
 * them, sneer lifts, frown drops), whiskers (forward with a smile, up with a sneer or a puff). The jaw is the stage's
 * (face.jaw, jawSide).
 */
function tick(root: THREE.Object3D, t: number, face?: FaceState | null): void {
  let p = FACES.get(root);
  if (!p) {
    const by = (n: string): Obj => root.getObjectByName(n) ?? null;
    const both = (n: string) => [by(n + 'L'), by(n + 'R')];
    p = { eyes: both('jim-eye'), lids: both('jim-lid'), ears: both('ear'), brows: both('brow'), cheeks: both('cheek'), whisk: both('jim-whisk') };
    FACES.set(root, p);
  }
  const f = face ?? null;
  if (f) smileLids(p.lids, f);
  else { const b = idleBlink(t); for (const l of p.lids) if (l) setLids(l, b, 0, 0); }
  for (const e of p.eyes) if (e) look(e, f, 0.75);
  const frown = f?.frown ?? 0, sneer = f?.sneer ?? 0, puff = f?.puff ?? 0, inner = f?.browUp ?? 0;
  for (let i = 0; i < 2; i++) {
    const L = i === 0, sx = L ? 1 : -1;
    const outer = f ? (L ? f.browOuterL : f.browOuterR) : 0, down = f ? (L ? f.browDownL : f.browDownR) : 0;
    const wide = f ? (L ? f.wideL : f.wideR) : 0, smile = f ? (L ? f.smileL : f.smileR) : 0;
    const brow = p.brows[i];
    if (brow) {
      brow.position.set(sx * BROW_O[0]!, BROW_O[1]! + 0.36 * (0.55 * inner + 0.45 * outer) - 0.26 * down, BROW_O[2]! + 0.06 * down);
      // + about z lifts the left brow's outer end: the inner ends rise with browUp, knit down in a scowl
      brow.rotation.z = sx * (0.32 * (outer - inner) + 0.3 * down);
    }
    const ear = p.ears[i];
    if (ear) {
      const perk = Math.max(wide, 0.8 * inner, outer), flat = Math.max(down, 0.6 * sneer), droop = frown;
      ear.rotation.set(0.2 * perk - 0.55 * flat - 0.12 * droop + flick(t, L ? 3.1 : 0.4), 0, -sx * (0.45 * flat + 0.4 * droop - 0.15 * perk));
    }
    const cheek = p.cheeks[i];
    if (cheek) {
      cheek.position.set(sx * (CHEEK_O[0]! + 0.12 * puff + 0.06 * smile), CHEEK_O[1]! + 0.34 * smile + 0.12 * sneer - 0.14 * frown, CHEEK_O[2]! - 0.1 * smile + 0.08 * puff);
      cheek.scale.setScalar(1 + 0.22 * puff + 0.08 * smile);
    }
    const wh = p.whisk[i];
    if (wh) wh.rotation.set(0, -sx * 0.3 * smile, sx * (0.28 * sneer + 0.2 * puff - 0.12 * frown + twitch(t)));
  }
}

export const JIMOTHY: CharacterDef = {
  id: 'jimothy', name: 'Jimothy', blurb: 'The round Seattle raccoon, standing up',
  segs: JIMOTHY_SEGMENTS,
  body: {
    sdf: jimothySDF, region: jimothyRegion, box: JIMOTHY_BOX,
    palette: [0x6c655d, 0xe6e0d2, 0x1c1917, 0x0a0a0a, 0x8f877c, 0x3a3330, 0x4a2226],
    weights: 'soft', capture: jimothyCapture,
    fur: JIM_FUR, furLen: jimothyFurLength,
    tint(r, x, y, z, c) {
      // a raccoon's back is darker and more grizzled than its flanks; his limbs are darker than his body
      if (r !== 0) return;
      if (z < -0.5) c.multiplyScalar(1 - 0.2 * Math.min(1, (-0.5 - z) / 2.5));
      const p = parts(x, y, z);
      if (p.arm === p.min || p.leg === p.min) c.multiplyScalar(0.82);
    },
  },
  dress,
  tick,
  // size: his shoulders land a twentieth above the wearer's and his head over theirs (the numbers at the top); more and
  // the head floats off the face. limb: halfway, so his short arms reach the wearer's forearms and his feet hover a
  // little above theirs, short and thick still
  fit: { size: 1.05, limb: 0.5 },
  // the jaw opens this far (radians) at a wide-open mouth; googly eyes over his own, in the mask
  face: { jaw: 0.55, eyes: [[JIMOTHY_EYES[0], JIMOTHY_EYES[1], JIMOTHY_EYES[2] + 0.18, 0.36], [-JIMOTHY_EYES[0], JIMOTHY_EYES[1], JIMOTHY_EYES[2] + 0.18, 0.36]] },
  idle: { tail: 0.15 },
  // 84 and eight layers keep body and coat under 150k triangles (88 was 156k)
  res: 84,
  furShells: 8,
};
