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
// when it swings, the seam slides over the pad instead of tearing off it.
import * as THREE from 'three';
import type { CharacterDef, Capture } from './build';
import { sdCapsule, sdEllipsoid, sdSphere, smin, type Seg } from './sdf';

type V3 = [number, number, number];

// joints (the left side; the right is mirrored)
// the legs stand apart: closer, the thighs met at the midline and a squat, splaying them, tore the skin they shared
const LX = 2.1;
const HIP: V3 = [1.95, 6.0, 0.2], KNEE: V3 = [LX, 3.4, 0.55], ANKLE: V3 = [LX, 1.0, 0.0], TOE: V3 = [LX, 0.3, 2.0];
// the arms rest out, nearly level and a little forward: hanging, they would lie in the ball, the marching cubes would
// join them to it, and the join would tear when the arm lifts. Lower (25° under level was tried) and the arm's underside
// ran along the ball, so the ball's side was in the arm's seam and a cheer lifted it into a web down to the waist
const SHOULDER: V3 = [2.9, 11.0, 0.8], ELBOW: V3 = [4.99, 10.54, 1.28], WRIST: V3 = [6.76, 10.06, 1.79];
const TAIL: V3[] = [[0, 6.6, -2.6], [0.5, 4.6, -4.4], [1.6, 2.4, -5.3], [3.0, 1.1, -5.2], [4.5, 0.85, -4.1]];
const TAIL_R = [1.15, 1.45, 1.4, 1.2, 0.75];
/** the skull's centre: everything on the head is placed from it */
const SK: V3 = [0, 14.4, 0.6];

export const JIMOTHY_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 6.0, 0], b: [0, 7.6, 0], parent: null },
  { name: 'spine1', a: [0, 7.6, 0], b: [0, 9.4, 0.1], parent: 'pelvis' },
  { name: 'spine2', a: [0, 9.4, 0.1], b: [0, 11.4, 0.1], parent: 'spine1' },
  { name: 'neck', a: [0, 11.4, 0.1], b: [0, SK[1] - 1.6, SK[2] - 0.25], parent: 'spine2' },
  { name: 'head', a: [0, SK[1] - 1.6, SK[2] - 0.25], b: [0, SK[1] + 1.6, SK[2] + 0.1], parent: 'neck' },
  { name: 'jaw', a: [0, SK[1] - 1.1, SK[2] + 1.1], b: [0, SK[1] - 1.2, SK[2] + 2.9], parent: 'head', reach: 0 },
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
interface Parts { body: number; head: number; arm: number; leg: number; tail: number; min: number }
/**
 * A part further than FAR from a point is given its bound's distance instead of its own: the field clamps past 1.25
 * (build.ts), and nothing reads a part that far for skinning, so only the build time sees the difference (it halves it).
 */
const FAR = 2.5;
let lx = NaN, ly = NaN, lz = NaN;
const P: Parts = { body: 0, head: 0, arm: 0, leg: 0, tail: 0, min: 0 };

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
    b = smin(b, sdSphere(ax, y, z, SHOULDER[0], SHOULDER[1], SHOULDER[2], 1.15), 0.9);
    // the neck's ruff: short and thick, a pinch under the skull
    b = smin(b, sdCapsule(x, y, z, 0, 11.0, 0.2, 0, SK[1] - 1.4, SK[2] - 0.15, 2.1, 1.7), 0.8);
  }
  P.body = b;
  // the head: broad cheeks, a pointed muzzle, a short jaw, rounded upright ears; sockets for the eyes
  const hy = y - SK[1], hz = z - SK[2];
  let h = sdSphere(x, hy, hz, 0, 0.6, 0.5, 4.3);
  if (h < FAR) {
    h = sdEllipsoid(x, hy, hz, 0, 0, 0, 2.38, 2.05, 2.21);
    h = smin(h, sdEllipsoid(ax, hy, hz, 1.8, -0.66, 0.25, 1.15, 1.23, 1.31), 0.66); // the cheek ruff
    h = smin(h, sdCapsule(x, hy, hz, 0, -0.25, 1.48, 0, -0.57, 3.6, 1.11, 0.45), 0.5); // the muzzle
    h = smin(h, sdCapsule(x, hy, hz, 0, -1.07, 1.15, 0, -1.23, 2.95, 0.78, 0.41), 0.33); // the lower jaw
    h = smin(h, sdEllipsoid(ax, hy, hz, 1.44, 2.05, -0.66, 0.78, 1.03, 0.34), 0.29); // the ears
    h = Math.max(h, -sdSphere(ax, y, z, JIMOTHY_EYES[0] + 0.05, JIMOTHY_EYES[1], JIMOTHY_EYES[2] + 0.2, 0.34));
  }
  P.head = h;
  // the arm on this side: a thick upper arm, a forearm, a dark hand with a raccoon's long fingers
  let a = capV(ax, y, z, SHOULDER, HAND_TIP, 1.6, 1.6);
  if (a < FAR) {
    a = capV(ax, y, z, SHOULDER, ELBOW, 0.95, 0.8);
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
 * 3 black (the nose), 4 buff (the belly, the tail's light rings), 5 the paws' dark brown.
 */
export function jimothyRegion(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  if (Math.hypot(x, y - JIMOTHY_NOSE[1], z - JIMOTHY_NOSE[2]) < 0.62) return 3;
  const p = parts(x, y, z), m = p.min;
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
const SEAM = 0.25;
const enum G { Body, Neck, Head, ArmL, ArmR, LegL, LegR, Tail }
const GROUP = new Map<string, G>([
  ['pelvis', G.Body], ['spine1', G.Body], ['spine2', G.Body], ['neck', G.Neck], ['head', G.Head], ['jaw', G.Head],
  ['armL', G.ArmL], ['forearmL', G.ArmL], ['armR', G.ArmR], ['forearmR', G.ArmR],
  ['thighL', G.LegL], ['shinL', G.LegL], ['footL', G.LegL], ['thighR', G.LegR], ['shinR', G.LegR], ['footR', G.LegR],
  ['tail1', G.Tail], ['tail2', G.Tail], ['tail3', G.Tail], ['tail4', G.Tail],
]);
const jimothyCapture: Capture = (sg, x, y, z) => {
  const q = parts(x, y, z), lim = q.min + SEAM;
  switch (GROUP.get(sg.name)) {
    case G.Body: return q.body <= lim;
    // the neck is the band between the ball and the skull; above it the head is one rigid piece
    case G.Neck: return (q.body <= lim || q.head <= lim) && y > 10.6 && y < SK[1] - 1.0;
    case G.Head: return q.head <= lim && y > SK[1] - 2.1;
    case G.ArmL: return q.arm <= lim && x > 0.5;
    case G.ArmR: return q.arm <= lim && x < -0.5;
    case G.LegL: return q.leg <= lim && x > 0.2;
    case G.LegR: return q.leg <= lim && x < -0.2;
    case G.Tail: return q.tail <= lim;
    default: return true;
  }
};

export const JIMOTHY: CharacterDef = {
  id: 'jimothy', name: 'Jimothy', blurb: 'The round Seattle raccoon, standing up',
  segs: JIMOTHY_SEGMENTS,
  body: {
    sdf: jimothySDF, region: jimothyRegion, box: JIMOTHY_BOX,
    palette: [0x766c62, 0xe6e0d2, 0x1c1917, 0x0a0a0a, 0x9d9384, 0x3a3330],
    weights: 'soft', capture: jimothyCapture,
    fur: { length: 1.0, density: 7, tip: 0.18 }, furLen: jimothyFurLength,
    tint(r, x, y, z, c) {
      // a raccoon's back is darker and more grizzled than its flanks; his limbs are darker than his body
      if (r !== 0) return;
      if (z < -0.5) c.multiplyScalar(1 - 0.2 * Math.min(1, (-0.5 - z) / 2.5));
      const p = parts(x, y, z);
      if (p.arm === p.min || p.leg === p.min) c.multiplyScalar(0.82);
    },
  },
  dress(d) {
    // small, black, wet eyes in the mask; a black nose that shines
    const eye = d.std({ color: 0x050505, roughness: 0.06, metalness: 0.1 });
    for (const sx of [-1, 1]) d.at(new THREE.Mesh(new THREE.SphereGeometry(0.34, 14, 10), eye), 'head', sx * JIMOTHY_EYES[0], JIMOTHY_EYES[1], JIMOTHY_EYES[2]);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 10), d.std({ color: 0x0a0a0a, roughness: 0.25 }));
    nose.scale.set(1.15, 0.8, 0.75);
    d.at(nose, 'head', JIMOTHY_NOSE[0], JIMOTHY_NOSE[1], JIMOTHY_NOSE[2]);
  },
  fit: { size: 1.05, limb: 0.5 },
  idle: { tail: 0.15 },
  // 84 and eight layers keep body and coat under 150k triangles (88 was 156k)
  res: 84,
  furShells: 8,
};
