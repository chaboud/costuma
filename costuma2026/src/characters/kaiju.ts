// Kaiju: a classic city-stomper, as a costume. Charcoal scales, heavy legs, small clawed arms, a long tail that drags
// on the ground and curls out to its left, three rows of jagged pale plates down the back and tail, amber eyes under a
// scowling brow, a mouthful of teeth. Open your mouth and it roars: the jaw drops, the plates charge from the tail's
// tip up to the neck in electric blue, flickering, the throat lights, and it breathes a blue stream (render/breath.ts,
// by `face.breath`).
//
// Built on Strollzilla's theropod (sdf.ts: its primitives, its scales material, its eyes and teeth) but stood up the way
// a suit is worn. The theropod leans its chest 2.6 m ahead of its hips and carries its skull 5 m ahead of its neck: on
// an upright person its arms hung from in front of the wearer's shoulders, its head floated a head's length in front
// of theirs, and from the front its plates hid behind its own back. Here the spine rises nearly straight (12°), the
// skull sits on a thick neck over the wearer's head with the snout out in front, the upper plates tip up and the side
// rows fan out, so their points stand over the shoulders and beside the head in a front view, and the tail sweeps out
// to one side, so the camera sees it past a leg.
//
// - The body (skull and upper jaw included) is one SDF, skinned. The lower jaw is its own small SDF mesh, rigid on the
//   `jaw` bone, so an open mouth is a clean gap (a skinned jaw stretches a sheet across it); the palate and the tongue
//   are coloured as a mouth, the throat behind them dark, and a glow core sits in it, hidden while the jaw is shut.
// - The plates are rigid meshes, merged per bone with one material per bone, so `tick` can light them bone by bone.
//   Their roots are sunk into the body; the SDF has only a low ridge under them.
// Frame (build.ts): metres for a ~19-unit figure on y = 0, +z its snout, +x its own left.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { NEUTRAL_FACE, type CharacterDef, type Capture, type Dresser, type FaceState } from './build';
import { sdCapsule, sdEllipsoid, sdSphere, smin, type Seg } from './sdf';
import { createKaijuMaterial } from './material';
import { isoGeometry } from './skeleton';
import { eyelids, look, setLids } from './faceparts';

type V3 = [number, number, number];

/** the mouth line: the upper jaw's flat underside and the lower jaw's flat top meet here */
const MOUTH_Y = 15.55;
/** the jaw's hinge, at the back of the mouth */
const HINGE: V3 = [0, 15.6, 1.2];
/** an amber eye, the left one (the right is mirrored) */
const EYE: V3 = [1.26, 16.95, 3.8];
/** the left brow ridge's axis, temple to snout (the skull's capsule and its bone), and the upper lip's bone */
const BROW_A: V3 = [1.4, 17.55, 2.0], BROW_B: V3 = [0.95, 17.2, 4.35];
const LIP_A: V3 = [1.15, 15.85, 2.7], LIP_B: V3 = [0.45, 15.85, 6.3];
/** the tail's joints, from the rump: down to the ground and out to its left */
const TAIL: V3[] = [[0, 9.0, -1.8], [0.3, 7.0, -4.6], [1.3, 4.6, -7.2], [3.0, 2.5, -9.4], [5.2, 1.1, -11.2]];
const TAIL_R = [2.5, 1.95, 1.45, 0.95, 0.3];
/** the left arm's joints (the right mirrored) */
const SHOULDER: V3 = [2.8, 13.9, 1.2], ELBOW: V3 = [4.35, 12.4, 1.8], WRIST: V3 = [4.5, 11.0, 3.4];
const mx = (p: V3): V3 => [-p[0], p[1], p[2]];

export const KAIJU_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 9.2, -0.4], b: [0, 10.6, 0.0], parent: null },
  { name: 'spine1', a: [0, 10.6, 0.0], b: [0, 12.6, 0.5], parent: 'pelvis' },
  { name: 'spine2', a: [0, 12.6, 0.5], b: [0, 14.4, 0.9], parent: 'spine1' },
  { name: 'neck', a: [0, 14.4, 0.9], b: [0, 16.4, 1.2], parent: 'spine2' },
  // the head segment's midpoint is where the stage puts the wearer's ears (Rig.neckFit): at the kaiju's eyes' height,
  // so the wearer's face sits behind the back of its snout. Lower (at the mouth line, as first built) the stage left its
  // eyes a head above theirs
  { name: 'head', a: [0, 16.4, 1.2], b: [0, 17.3, 5.4], parent: 'neck' },
  // the jaw takes no skin (its mesh is rigid); its `b` is where the breath leaves (stage.ts faces): inside the snout
  // while shut, in the middle of the mouth's opening once it is open
  { name: 'jaw', a: HINGE, b: [0, 16.2, 5.0], parent: 'head', reach: 0 },
  { name: 'tail1', a: TAIL[0]!, b: TAIL[1]!, parent: 'pelvis' },
  { name: 'tail2', a: TAIL[1]!, b: TAIL[2]!, parent: 'tail1' },
  { name: 'tail3', a: TAIL[2]!, b: TAIL[3]!, parent: 'tail2' },
  { name: 'tail4', a: TAIL[3]!, b: TAIL[4]!, parent: 'tail3' },
  { name: 'thighL', a: [2.0, 9.0, 0.1], b: [2.2, 5.0, 0.7], parent: 'pelvis' },
  { name: 'shinL', a: [2.2, 5.0, 0.7], b: [2.3, 1.5, -0.1], parent: 'thighL' },
  { name: 'footL', a: [2.3, 1.5, -0.1], b: [2.4, 0.4, 2.4], parent: 'shinL' },
  { name: 'thighR', a: [-2.0, 9.0, 0.1], b: [-2.2, 5.0, 0.7], parent: 'pelvis' },
  { name: 'shinR', a: [-2.2, 5.0, 0.7], b: [-2.3, 1.5, -0.1], parent: 'thighR' },
  { name: 'footR', a: [-2.3, 1.5, -0.1], b: [-2.4, 0.4, 2.4], parent: 'shinR' },
  // small arms, held out and a little forward: half a metre clear of the flank, or the marching cubes join them to it
  // and a raised arm pulls the join out as a web
  { name: 'armL', a: SHOULDER, b: ELBOW, parent: 'spine2' },
  { name: 'forearmL', a: ELBOW, b: WRIST, parent: 'armL' },
  { name: 'armR', a: mx(SHOULDER), b: mx(ELBOW), parent: 'spine2' },
  { name: 'forearmR', a: mx(ELBOW), b: mx(WRIST), parent: 'armR' },
  ...FACE_SEGMENTS(),
];

/**
 * The face's own bones, children of the head (the rig never turns them; `tick` does): a brow ridge and an upper lip per
 * side that move, and still anchors round them that move with the head. The skin's weights are the two nearest bones'
 * (build.ts, falling off with distance), and the head's own segment runs down the skull's middle, far from the face's
 * surface: alone against it a brow took the whole side of the skull. The anchors sit just under the surface round each
 * moving bone, so a brow's or a lip's hold on the skin fades out within a scale or two of it.
 */
function FACE_SEGMENTS(): Seg[] {
  const out: Seg[] = [{ name: 'bridge', a: [0, 17.2, 1.0], b: [0, 16.95, 5.6], parent: 'head', reach: 1.3 }];
  for (const [S, k] of [['L', 1], ['R', -1]] as const) {
    const m = (p: V3): V3 => [p[0] * k, p[1], p[2]];
    out.push(
      // the brow ridge over the eye, pivoting at its back end (the temple)
      { name: 'brow' + S, a: m(BROW_A), b: m(BROW_B), parent: 'head', reach: 1.0 },
      // the upper lip along the mouth line, inside the lip's edge
      { name: 'lip' + S, a: m(LIP_A), b: m(LIP_B), parent: 'head', reach: 1.0 },
      { name: 'crown' + S, a: m([0.8, 17.8, 0.6]), b: m([0.45, 17.85, 2.6]), parent: 'head', reach: 1.3 },
      { name: 'cheek' + S, a: m([1.6, 16.15, 1.2]), b: m([1.3, 16.3, 3.1]), parent: 'head', reach: 1.3 },
      { name: 'snout' + S, a: m([0.8, 16.45, 3.2]), b: m([0.35, 16.5, 6.0]), parent: 'head', reach: 1.3 },
    );
  }
  return out;
}
/** the face bones that move, and the anchors that only hold the skin still round them (the cheeks, also puffed) */
const FACE_MOVERS = ['browL', 'browR', 'lipL', 'lipR'];
const FACE_ANCHORS = ['bridge', 'crownL', 'crownR', 'cheekL', 'cheekR', 'snoutL', 'snoutR'];

const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const sstep = (a: number, b: number, v: number) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };

/** the upper lip's half-width at z (the upper jaw's capsule, cut at the mouth line) */
const lipW = (z: number) => 1.5 + (1.02 - 1.5) * clamp01((z - 1.5) / 4.5);

/** the upper head: a low broad cranium, a scowling brow, cheeks and a deep blunt snout, cut flat at the mouth line */
function skullSDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let h = sdEllipsoid(x, y, z, 0, 16.85, 1.3, 1.8, 1.3, 1.95); // the cranium
  h = smin(h, sdCapsule(x, y, z, 0, 15.8, 1.5, 0, 15.75, 6.0, 1.5, 1.02), 0.5); // the upper jaw, wide at the lip
  h = smin(h, sdCapsule(x, y, z, 0, 16.45, 2.0, 0, 16.4, 5.7, 1.2, 0.9), 0.6); // the snout's bridge
  // the brow: from the back of the skull's side down and in over each eye, a scowl
  h = smin(h, sdCapsule(ax, y, z, ...BROW_A, ...BROW_B, 0.56, 0.42), 0.35);
  h = smin(h, sdEllipsoid(ax, y, z, 1.55, 16.2, 1.6, 0.82, 0.95, 1.35), 0.4); // the cheeks
  h = smin(h, sdSphere(ax, y, z, 0.5, 16.95, 5.75, 0.28), 0.2); // the nostrils' rims
  h = smax(h, -sdSphere(ax, y, z, EYE[0] + 0.08, EYE[1] - 0.02, EYE[2] + 0.08, 0.38), 0.1); // the eye sockets
  // the mouth: nothing below the line in front of the hinge (the lower jaw is a mesh of its own)
  return smax(h, Math.min(MOUTH_Y - y, z - HINGE[2]), 0.12);
}

/** the lower jaw, a rigid mesh on the `jaw` bone: flat on top at the mouth line, heavy, a broad chin */
function jawSDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let j = sdCapsule(x, y, z, 0, 15.25, 1.5, 0, 15.2, 5.6, 1.38, 0.95);
  j = smin(j, sdSphere(x, y, z, 0, 14.9, 5.55, 0.78), 0.4); // the chin
  j = smin(j, sdEllipsoid(x, y, z, 0, 14.75, 2.6, 1.25, 0.75, 1.8), 0.5); // the jowl under it
  j = smin(j, sdCapsule(ax, y, z, 1.1, 15.3, 1.0, 1.0, 15.3, 3.2, 0.4, 0.35), 0.3); // the hinge's ends
  return Math.max(j, y - MOUTH_Y);
}
const JAW_BOX = { min: [-1.8, 13.7, -0.1], max: [1.8, MOUTH_Y + 0.05, 6.5] } as const;

/** toe and finger claws (their own region's colour) */
function clawSDF(ax: number, y: number, z: number): number {
  let d = 1e9;
  for (const tx of [-1, 0, 1]) d = Math.min(d, sdCapsule(ax, y, z, 2.4 + tx * 0.95, 0.45, 3.25 + (tx === 0 ? 0.45 : 0), 2.4 + tx * 1.1, 0.12, 4.0 + (tx === 0 ? 0.55 : 0), 0.26, 0.05));
  for (const cx of [-0.32, 0, 0.32]) d = Math.min(d, sdCapsule(ax, y, z, WRIST[0] + cx, WRIST[1] - 0.45, WRIST[2] + 0.55, WRIST[0] + cx * 1.5, WRIST[1] - 1.15, WRIST[2] + 1.25, 0.17, 0.035));
  return d;
}

/** an arm (the left; mirrored by |x|): upper arm, forearm, hand */
function armSDF(ax: number, y: number, z: number): number {
  const [sx, sy, sz] = SHOULDER, [ex, ey, ez] = ELBOW, [wx, wy, wz] = WRIST;
  let a = sdCapsule(ax, y, z, sx, sy, sz, ex, ey, ez, 0.9, 0.72);
  a = smin(a, sdCapsule(ax, y, z, ex, ey, ez, wx, wy, wz, 0.7, 0.56), 0.3);
  return smin(a, sdEllipsoid(ax, y, z, WRIST[0], WRIST[1] - 0.25, WRIST[2] + 0.25, 0.58, 0.52, 0.62), 0.3); // the hand
}

/**
 * What an arm must never take, for the capture rule: the trunk, the shoulders, the hips and the legs' tops. Raised, a
 * forearm that took the hip beside it (|x| alone could not tell them apart) pulled a sheet from the haunch to the hand.
 */
function trunkSDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let d = sdEllipsoid(x, y, z, 0, 9.7, -0.3, 3.0, 2.6, 2.6);
  d = Math.min(d, sdCapsule(x, y, z, 0, 10.2, 0.0, 0, 12.6, 0.5, 2.75, 2.55));
  d = Math.min(d, sdCapsule(x, y, z, 0, 12.6, 0.5, 0, 14.2, 0.7, 2.55, 2.0));
  d = Math.min(d, sdEllipsoid(x, y, z, 0, 11.4, 1.5, 2.2, 3.0, 1.75));
  d = Math.min(d, sdEllipsoid(ax, y, z, 1.65, 13.9, 0.5, 1.35, 1.05, 1.4));
  d = Math.min(d, sdSphere(ax, y, z, 2.05, 8.6, -0.1, 2.2));
  return Math.min(d, sdCapsule(ax, y, z, 2.0, 9.0, 0.1, 2.2, 5.0, 0.7, 1.95, 1.55));
}

/** the neck, thick, into the back of the skull, and the throat under the jaw */
function neckSDF(x: number, y: number, z: number): number {
  return smin(sdCapsule(x, y, z, 0, 14.0, 0.5, 0, 16.2, 0.95, 2.05, 1.7), sdEllipsoid(x, y, z, 0, 14.5, 1.9, 1.45, 1.0, 1.3), 0.6);
}

/** the body, skull and upper jaw included; plates are meshes, only a low ridge under them here */
/** is (x, y, z) within r of (cx, cy, cz)? (the field's parts are skipped beyond their reach: see kaijuBodySDF) */
const near = (x: number, y: number, z: number, cx: number, cy: number, cz: number, r: number) => {
  const dx = x - cx, dy = y - cy, dz = z - cz;
  return dx * dx + dy * dy + dz * dz < r * r;
};

/**
 * The body, skull and upper jaw included; plates are meshes, only a low ridge under them here. Each part is asked only
 * within its reach plus its blend and the 1.25 m past which the grid's field is clamped to "outside" (build.ts): beyond
 * that it cannot change the surface, and most of the box is beyond every part (in Node, the field 0.85 s → 0.33 s, the same 48.6k triangles).
 */
export function kaijuBodySDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let d = 9;
  // the torso: a pear — wide hips, a deep belly, the chest narrowing into hunched shoulders; the neck into the skull
  if (near(x, y, z, 0, 12.4, 0.4, 8.2)) {
    d = sdEllipsoid(x, y, z, 0, 9.7, -0.3, 3.0, 2.6, 2.6);
    d = smin(d, sdCapsule(x, y, z, 0, 10.2, 0.0, 0, 12.6, 0.5, 2.75, 2.55), 1.0);
    d = smin(d, sdCapsule(x, y, z, 0, 12.6, 0.5, 0, 14.2, 0.7, 2.55, 2.0), 0.9);
    d = smin(d, sdEllipsoid(x, y, z, 0, 11.4, 1.5, 2.2, 3.0, 1.75), 0.9); // the belly's bulge
    d = smin(d, sdEllipsoid(ax, y, z, 1.65, 13.9, 0.5, 1.35, 1.05, 1.4), 0.8); // the shoulders, hunched
    d = smin(d, neckSDF(x, y, z), 0.9);
  }
  // the ridge the plates root in
  if (x * x < 4 && z < 1.5 && y > 6.5 && y < 19) {
    d = smin(d, sdCapsule(x, y, z, 0, 16.2, -0.3, 0, 12.0, -2.0, 0.45, 0.6), 0.6);
    d = smin(d, sdCapsule(x, y, z, 0, 12.0, -2.0, 0, 9.4, -3.0, 0.6, 0.55), 0.6);
  }
  // the skull
  if (y > 13.4 && z > -1.6 && near(x, y, z, 0, 16.6, 3.25, 6.5)) d = smin(d, skullSDF(x, y, z), 0.7);
  // the tail: tapering, down to drag along the ground and out to the left
  if (z < 1.6 && y < 13.5 && x > -4.5 && x < 7.6) {
    const ks = [1.0, 0.7, 0.5, 0.4];
    for (let i = 0; i < 4; i++) {
      const a = TAIL[i]!, b = TAIL[i + 1]!;
      d = smin(d, sdCapsule(x, y, z, a[0], a[1], a[2], b[0], b[1], b[2], TAIL_R[i]!, TAIL_R[i + 1]!), ks[i]!);
    }
  }
  // the legs: a haunch, a thick thigh, a column of a shin, a broad foot with three clawed toes
  if (y < 12.2 && ax < 6.0 && z > -4.0 && z < 5.6) {
    let g = sdSphere(ax, y, z, 2.05, 8.6, -0.1, 2.2);
    g = smin(g, sdCapsule(ax, y, z, 2.0, 9.0, 0.1, 2.2, 5.0, 0.7, 1.95, 1.55), 0.6);
    g = smin(g, sdSphere(ax, y, z, 2.25, 5.1, 0.85, 1.45), 0.5); // the knee
    g = smin(g, sdCapsule(ax, y, z, 2.2, 5.0, 0.7, 2.3, 1.5, -0.1, 1.45, 1.3), 0.5);
    if (y < 4.5) {
      g = smin(g, sdCapsule(ax, y, z, 2.3, 1.3, 0.0, 2.4, 0.75, 2.0, 1.25, 0.95), 0.5); // the foot
      g = smin(g, sdSphere(ax, y, z, 2.3, 0.9, -0.6, 0.95), 0.4); // the heel
      if (z > 0.2) for (const tx of [-1, 0, 1]) g = smin(g, sdCapsule(ax, y, z, 2.4 + tx * 0.5, 0.75, 1.8, 2.4 + tx * 0.95, 0.5, 3.25 + (tx === 0 ? 0.45 : 0), 0.52, 0.36), 0.3);
    }
    d = smin(d, g, 0.8);
  }
  // the arms: small, a shoulder's knob, three claws on each hand
  if (ax > 1.2 && y > 8.2 && y < 15.8 && z > -1.3 && z < 6.2) d = smin(d, armSDF(ax, y, z), 0.3);
  if ((y < 2.0 && z > 2.0) || (ax > 3.2 && y > 8.4 && y < 12.0 && z > 2.6)) d = Math.min(d, clawSDF(ax, y, z));
  // flat soles
  return Math.max(d, -y);
}

const C = { skin: 0x60646b, belly: 0x86806f, ridge: 0x2a2c2f, claw: 0xe2dccb, mouth: 0x4a1418, bone: 0xc9c2b0 };
const PALETTE = [C.skin, C.belly, C.ridge, C.claw, C.mouth];

/** 0 skin, 1 belly, 2 ridge, 3 claw, 4 mouth */
export function kaijuRegion(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  if (clawSDF(ax, y, z) < 0.06) return 3;
  // the palate (the upper jaw's flat underside, well inside the lip) and the throat at the back of the mouth (both
  // hidden while the jaw is shut)
  if (z > HINGE[2] + 0.2 && z < 5.6 && y < MOUTH_Y + 0.04 && y > MOUTH_Y - 0.12 && ax < lipW(z) - 0.45) return 4;
  // the throat behind the mouth: a dark cavity (red there showed as a collar when the head turned off the jaw)
  if (z > 1.9 && z < 3.3 && y > 14.75 && y < MOUTH_Y && ax < 1.0) return 2;
  if (ax < 0.9 && z < -0.3 && y > 9.4 && y < 16.5 && z < -2.45 + (y - 9.4) * 0.3) return 2;
  // the belly: an oval down the torso's front, and the throat's underside
  const bx = ax / 2.05, by = (y - 11.1) / 3.4;
  if (bx * bx + by * by < 1 && z > 1.0) return 1;
  const tx = ax / 1.15, ty = (y - 14.2) / 0.75;
  if (tx * tx + ty * ty < 1 && z > 2.0) return 1;
  return 0;
}

const BELLY = new THREE.Color(C.belly);
function kaijuTint(r: number, x: number, y: number, z: number, c: THREE.Color): void {
  if (r === 1) {
    // the belly's plates: broad horizontal bands, darker in the seams
    const f = Math.abs(((y * 1.25) % 1) - 0.5) * 2;
    c.multiplyScalar(0.8 + 0.2 * sstep(0.15, 0.55, f));
  } else if (r === 0) {
    // darker along the back and the tail's top, the belly's tone bleeding a little into the skin round it
    const back = sstep(0.0, -2.5, z) * sstep(6.5, 12, y) + (z < -3 ? sstep(-0.5, 1.0, y - (9.4 + z * 0.62)) : 0);
    c.multiplyScalar(1 - 0.22 * Math.min(1, back));
    const bx = Math.abs(x) / 2.05, by = (y - 11.1) / 3.4, e = bx * bx + by * by;
    if (z > 0.6 && e < 1.5) c.lerp(BELLY, 0.35 * sstep(1.5, 1.0, e));
  }
}

/**
 * Which bone may take which skin: a thigh its own leg (never the hip or the belly beside it), the tail only what is
 * behind the rump (its sway must not swing the seat), an arm only the arm (never the chest's side), the head only the
 * skull (never the throat).
 */
const capAt = [NaN, NaN, NaN], skAt = [NaN, NaN, NaN];
let capArm = false, skD = 0;
const capture: Capture = (sg, x, y, z) => {
  const n = sg.name;
  if (n.startsWith('thigh')) return x * sg.a[0]! > -0.3 && z > -2.0 && y < sg.a[1]! + 0.6 && Math.abs(Math.abs(x) - Math.abs(sg.a[0]!)) < (y < sg.a[1]! - 0.3 ? 2.2 : 1.2);
  if (n.startsWith('tail')) return z < -2.7;
  if (n.startsWith('arm') || n.startsWith('forearm')) {
    if (x * sg.a[0]! <= 0) return false;
    // the arm's own skin, and a thin seam where it meets the trunk (memoised: asked once per arm bone a vertex)
    if (x !== capAt[0] || y !== capAt[1] || z !== capAt[2]) {
      capAt[0] = x; capAt[1] = y; capAt[2] = z;
      capArm = armSDF(Math.abs(x), y, z) < trunkSDF(x, y, z) + 0.1;
    }
    return capArm;
  }
  // the skull is the head's whole (the jaw's hinge and cheeks sit nearer the neck's axis than the head's), and the
  // neck never takes it; a thin seam where they meet. The face's bones take only the skull too, each its own side of
  // it (and a hair over the middle, so the middle blends the two)
  const face = FACE_BONE.has(n);
  if (n === 'head' || n === 'neck' || face) {
    if (face && sg.a[0]! !== 0 && x * Math.sign(sg.a[0]!) < -0.15) return false;
    if (x !== skAt[0] || y !== skAt[1] || z !== skAt[2]) {
      skAt[0] = x; skAt[1] = y; skAt[2] = z;
      skD = y > 13.4 && z > -1.6 ? skullSDF(x, y, z) - neckSDF(x, y, z) : 9;
    }
    return n === 'neck' ? skD > -0.25 : skD < 0.25;
  }
  return true;
};
const FACE_BONE = new Set([...FACE_MOVERS, ...FACE_ANCHORS]);

// ---- the plates ----

/** the spine's line the plates follow, neck top to tail tip, as points on its axis */
const RIDGE: V3[] = [[0, 16.6, 1.1], [0, 14.4, 0.9], [0, 12.6, 0.5], [0, 10.6, 0.0], [0, 9.0, -1.0], ...TAIL.slice(1)];
/** the bones that carry plates, tail tip first: the order the glow climbs */
const PLATE_BONES = ['tail4', 'tail3', 'tail2', 'tail1', 'pelvis', 'spine1', 'spine2', 'neck'];
const GLOW = 0x2f8dff;

/** a place on the ridge: its axis point, the way along (toward the tail), out of the back, to its left; 0..1 along */
interface Station { p: THREE.Vector3; t: THREE.Vector3; o: THREE.Vector3; side: THREE.Vector3; u: number }
function stations(step: number, from: number, to: number): Station[] {
  const pts = RIDGE.map((p) => new THREE.Vector3(...p));
  const lens = pts.slice(1).map((p, i) => p.distanceTo(pts[i]!));
  const total = lens.reduce((a, b) => a + b, 0);
  const out: Station[] = [];
  for (let s = from * total; s <= to * total + 1e-6; s += step) {
    let k = 0, acc = 0;
    while (k < lens.length - 1 && acc + lens[k]! < s) acc += lens[k++]!;
    const f = (s - acc) / lens[k]!;
    const p = pts[k]!.clone().lerp(pts[k + 1]!, f);
    // the way along, smoothed over the corner between two spans
    const t = pts[k + 1]!.clone().sub(pts[k]!).normalize();
    if (k + 2 < pts.length) t.lerp(pts[k + 2]!.clone().sub(pts[k + 1]!).normalize(), Math.max(0, f - 0.5)).normalize();
    // out of the back: "back and up" made square to the way along
    const o = new THREE.Vector3(0, 0.7, -0.7);
    o.addScaledVector(t, -o.dot(t)).normalize();
    const side = new THREE.Vector3().crossVectors(t, o).normalize();
    out.push({ p, t, o, side, u: s / total });
  }
  return out;
}

/** march from outside along -o to the body's surface */
function surfaceAlong(p: THREE.Vector3, o: THREE.Vector3): THREE.Vector3 {
  const q = p.clone().addScaledVector(o, 6);
  for (let i = 0; i < 80; i++) {
    const d = kaijuBodySDF(q.x, q.y, q.z);
    if (d < 0.02) break;
    q.addScaledVector(o, -Math.max(0.03, d * 0.8));
  }
  return q;
}

/**
 * One plate in its own plane: u along the spine (toward the tail), v out of the back, thickness along z. A broad leaf
 * of jagged points, the tallest leaning back toward the tail; `kink` varies the outline so no two neighbours match.
 */
function plateGeometry(h: number, w: number, thick: number, kink: number): THREE.BufferGeometry {
  const k = kink - 0.5;
  const P: [number, number][] = [
    [0.5, -0.35], [0.53, 0.1], [0.52, 0.3], [0.5, 0.47 + 0.08 * k], [0.36, 0.42], [0.31, 0.6 - 0.06 * k], [0.2, 0.58],
    [0.16, 0.8], [0.06 - 0.04 * k, 1.0], [-0.06, 0.82], [-0.12, 0.66], [-0.24, 0.76 + 0.08 * k], [-0.3, 0.56],
    [-0.42, 0.6 - 0.06 * k], [-0.46, 0.42], [-0.55, 0.36 + 0.05 * k], [-0.54, 0.12], [-0.5, -0.35],
  ];
  const shape = new THREE.Shape(P.map(([a, b]) => new THREE.Vector2(a * w, b * h)));
  const g = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: true, bevelThickness: thick * 0.45, bevelSize: Math.min(0.13, w * 0.04), bevelSegments: 1, steps: 1, curveSegments: 1 });
  g.translate(0, 0, -thick / 2);
  // thinner to the tips; dark at the root, pale bone above
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const col = new Float32Array(pos.count * 3);
  const root = new THREE.Color(C.ridge), bone = new THREE.Color(C.bone), c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const v = pos.getY(i) / h;
    pos.setZ(i, pos.getZ(i) * (1 - 0.6 * clamp01(v)));
    c.copy(root).lerp(bone, sstep(-0.05, 0.6, v));
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.deleteAttribute('uv');
  g.computeVertexNormals();
  return g;
}

/** the centre row's plate height along the ridge (0 the neck's top, 1 the tail's tip): biggest behind the shoulders */
const plateH = (u: number) => 2.4 + 1.8 * sstep(0.0, 0.16, u) - 1.9 * sstep(0.22, 0.68, u) - 0.95 * sstep(0.68, 1.0, u);

/** the plates' material, one per bone: the emissive is scaled by the vertex colour so the roots stay dark when lit */
function plateMaterial(i: number): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: 0.6, metalness: 0.05, emissive: GLOW, emissiveIntensity: 0 });
  m.name = `kaiju-plate-${i}`;
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance *= 0.12 + 0.88 * smoothstep(0.08, 0.55, vColor.g);');
  };
  m.customProgramCacheKey = () => 'kaiju-plate-v1';
  return m;
}

/** a soft round glow for the halos (made on the page: the costume worker never dresses) */
let haloTex: THREE.Texture | null = null;
function haloTexture(): THREE.Texture {
  if (haloTex) return haloTex;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d')!, r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.2, 'rgba(255,255,255,0.6)'); r.addColorStop(0.5, 'rgba(255,255,255,0.18)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  haloTex = new THREE.CanvasTexture(c); haloTex.colorSpace = THREE.SRGBColorSpace;
  return haloTex;
}

function nearestBone(p: THREE.Vector3): string {
  let best = PLATE_BONES[0]!, bd = Infinity;
  const q = new THREE.Vector3();
  for (const n of PLATE_BONES) {
    const sg = KAIJU_SEGMENTS.find((s) => s.name === n)!;
    const d = new THREE.Line3(new THREE.Vector3(...sg.a), new THREE.Vector3(...sg.b)).closestPointToPoint(p, true, q).distanceTo(p);
    if (d < bd) { bd = d; best = n; }
  }
  return best;
}

function dress(d: Dresser): void {
  // ---- the plates: three rows, the centre one tallest; high on the back they tip up, and the side rows fan out ----
  const byBone = new Map<string, THREE.BufferGeometry[]>();
  const halos = new Map<string, { p: THREE.Vector3; h: number; n: number }>();
  const add = (st: Station, sd: number, scale: number, kink: number) => {
    const h = plateH(st.u) * scale;
    if (h < 0.35) return;
    // the root is found straight out from the spine (beside it for a side row); the plate then leans from it
    const out = st.o.clone().addScaledVector(st.side, sd * 0.55).normalize();
    const base = surfaceAlong(st.p.clone().addScaledVector(st.side, sd * 0.9), out);
    // high on the back a plate stands up, and a side row's leans out further: so their points show over the shoulders
    // and beside the head from the front
    const up = sstep(0.42, 0.05, st.u);
    const o = st.o.clone().addScaledVector(new THREE.Vector3(0, 1, 0), (sd ? 1.9 : 1.3) * up).addScaledVector(st.side, sd * (0.7 + 0.6 * up)).normalize();
    const n = new THREE.Vector3().crossVectors(st.t, o).normalize();
    const t = new THREE.Vector3().crossVectors(o, n).normalize();
    base.addScaledVector(o, -0.4 * Math.min(1, h / 2));
    const g = plateGeometry(h, h * (0.86 + 0.1 * kink), Math.max(0.12, 0.085 * h + 0.05), kink);
    g.applyMatrix4(new THREE.Matrix4().makeBasis(t, o, n).setPosition(base));
    const bone = nearestBone(base);
    (byBone.get(bone) ?? byBone.set(bone, []).get(bone)!).push(g);
    if (sd === 0) {
      const hl = halos.get(bone) ?? { p: new THREE.Vector3(), h: 0, n: 0 };
      hl.p.add(base.clone().addScaledVector(o, h * 0.4)); hl.h += h; hl.n++;
      halos.set(bone, hl);
    }
  };
  stations(1.55, 0.04, 0.985).forEach((st, i) => add(st, 0, 1, (i * 0.618) % 1));
  stations(1.6, 0.035, 0.62).forEach((st, i) => { for (const sd of [-1, 1]) add(st, sd, 0.6 + 0.3 * sstep(0.3, 0.05, st.u), ((i + (sd > 0 ? 0.5 : 0)) * 0.382) % 1); });
  PLATE_BONES.forEach((bone, i) => {
    const gs = byBone.get(bone);
    if (!gs) return;
    const merged = mergeGeometries(gs, false)!;
    gs.forEach((g) => g.dispose());
    const m = new THREE.Mesh(merged, plateMaterial(i));
    m.name = `kaiju-plates-${bone}`;
    d.at(m, bone, 0, 0, 0);
    const hl = halos.get(bone);
    if (hl) {
      // the stage fades an additive glow by its opacity, not by dithering (`keepBlend`); its colour is the glow (tick)
      const sm = new THREE.SpriteMaterial({ map: haloTexture(), color: 0x000000, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.9, toneMapped: false });
      sm.name = `kaiju-halo-${i}`; sm.userData.keepBlend = true;
      const sp = new THREE.Sprite(sm);
      sp.scale.setScalar((hl.h / hl.n) * 3.0); sp.renderOrder = 5;
      const p = hl.p.divideScalar(hl.n);
      d.at(sp, bone, p.x, p.y, p.z);
    }
  });

  // ---- the lower jaw: its own field, rigid on the jaw bone, skin outside and a dark tongue on top ----
  const belly = new THREE.Color(C.belly).multiplyScalar(0.8);
  const jawGeo = isoGeometry(jawSDF, JAW_BOX, 40, (x, y, z, c) => {
    const ax = Math.abs(x);
    if (y > MOUTH_Y - 0.1 && ax < lipW(z) - 0.5) c.setHex(C.mouth);
    else if (y < 14.6 && ax < 0.9) c.copy(belly);
    else c.setHex(C.skin);
  }, 16000);
  const jaw = new THREE.Mesh(jawGeo, createKaijuMaterial());
  jaw.name = 'kaiju-jaw';
  d.at(jaw, 'jaw', 0, 0, 0);

  // ---- teeth: bone cones along the upper lip, pointing down, and inside them along the lower jaw, pointing up ----
  const tooth = d.std({ color: 0xece6d4, roughness: 0.45 });
  const upper: THREE.BufferGeometry[] = [], lower: THREE.BufferGeometry[] = [];
  // (an upper tooth has a root up into the jaw, hidden until a snarl lifts the lip off it: a cone alone showed its flat
  // base. It leans in and back from the tooth, as the jaw's side and front do above the lip, or it shows through them)
  const Y = new THREE.Vector3(0, 1, 0), dir = new THREE.Vector3();
  const root = (x: number, y: number, z: number, r: number) => {
    dir.set(-Math.sign(x) * ROOT_IN, ROOT_LEN, z > 6 ? -ROOT_BACK : 0);
    const len = dir.length();
    // (it starts inside the cone, slimmer than it there, so no edge of it shows at the lip's rounded rim)
    upper.push(new THREE.CylinderGeometry(r * 0.42, r * 0.68, len, 6).translate(0, len / 2, 0)
      .applyQuaternion(new THREE.Quaternion().setFromUnitVectors(Y, dir.normalize())).translate(x, y - 0.1, z));
  };
  for (let i = 0; i < 7; i++) for (const sx of [-1, 1]) {
    const z = 2.3 + i * 0.6, big = i === 4 ? 1.35 : 1;
    upper.push(new THREE.ConeGeometry(0.15 * big, 0.55 * big, 6).rotateX(Math.PI).translate(sx * (lipW(z) - 0.14), MOUTH_Y - 0.22 * big, z));
    root(sx * (lipW(z) - 0.14), MOUTH_Y + 0.055 * big, z, 0.15 * big);
    lower.push(new THREE.ConeGeometry(0.12, 0.42, 6).translate(sx * (lipW(z) - 0.45), MOUTH_Y + 0.14, z + 0.3));
  }
  for (const sx of [-1, 1]) {
    upper.push(new THREE.ConeGeometry(0.13, 0.42, 6).rotateX(Math.PI).translate(sx * 0.32, MOUTH_Y - 0.17, 6.75));
    root(sx * 0.32, MOUTH_Y + 0.04, 6.75, 0.13);
  }
  d.at(new THREE.Mesh(mergeGeometries(upper)!, tooth), 'head', 0, 0, 0);
  d.at(new THREE.Mesh(mergeGeometries(lower)!, tooth), 'jaw', 0, 0, 0);

  // ---- the throat's glow: at the back of the mouth, inside the shut jaw; lit by `tick` ----
  const core = new THREE.MeshStandardMaterial({ color: 0x0c1a2a, emissive: GLOW, emissiveIntensity: 0, roughness: 0.4 });
  core.name = 'kaiju-core';
  // brightest where it faces you, soft at its rim: an orb of light, not a flat blue disc
  core.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n float facing = abs(dot(normalize(normal), normalize(vViewPosition)));\n totalEmissiveRadiance *= 0.2 + 1.4 * facing * facing;');
  };
  core.customProgramCacheKey = () => 'kaiju-core-v1';
  const coreM = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), core);
  coreM.scale.set(0.85, 0.7, 0.6);
  d.at(coreM, 'head', 0, 15.0, 3.2);

  // ---- the eyes: amber, lit from within, a slit of a pupil; each turns in its socket to look, under scaly lids ----
  const eyeMat = d.std({ color: 0xf0a018, emissive: 0xff7a00, emissiveIntensity: 1.0, roughness: 0.18 });
  const pupilMat = d.std({ color: 0x0a0806, roughness: 0.3 });
  // the lids are the skull's skin: its scales material, painted its colour (a little darker, they sit in the brow's shade)
  const lidMat = createKaijuMaterial();
  const lidCol = new THREE.Color(C.skin).multiplyScalar(0.9);
  for (const sx of [1, -1]) {
    const S = sx > 0 ? 'L' : 'R';
    const sock = new THREE.Group();
    sock.name = 'kaiju-socket' + S;
    sock.quaternion.copy(socketTurn(sx));
    // the eyeball, its pupil on its +z (faceparts.look turns it)
    const ball = new THREE.Group();
    ball.name = 'kaiju-eye' + S;
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), pupilMat);
    pupil.name = 'kaiju-pupil' + S;
    pupil.position.z = 0.24;
    pupil.scale.set(PUPIL_W, 1.3, 0.4);
    ball.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12), eyeMat), pupil);
    // the lids, built LID_K times too big and scaled down: the scales material reads its pattern off the geometry's own
    // coordinates, so a lid made at its real size wore scales twice as big as the face's round it. Slanted down toward
    // the snout: the scowl the brow gives it
    const lids = eyelids('kaiju-lids' + S, 0.3 * LID_K, lidMat, { gap: 0.1, tilt: sx * 0.3 });
    lids.scale.setScalar(1 / LID_K);
    for (const o of lids.children) {
      const g = (o as THREE.Mesh).geometry, n = g.getAttribute('position').count, col = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) lidCol.toArray(col, i * 3);
      g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    }
    sock.add(ball, lids);
    d.at(sock, 'head', sx * EYE[0], EYE[1], EYE[2]);
  }
}

/** the socket's turn: +z out of the eye where it looks at rest (out to its side and forward), +x across it, level */
function socketTurn(sx: number): THREE.Quaternion {
  const z = new THREE.Vector3(sx * 0.6, 0.05, 0.8).normalize();
  const x = new THREE.Vector3(0, 1, 0).cross(z).normalize();
  const y = new THREE.Vector3().crossVectors(z, x);
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
}
/** an upper tooth's root: how far it rises over the tooth's base, and leans in (and back, at the front) */
const ROOT_LEN = 0.5, ROOT_IN = 0.32, ROOT_BACK = 0.42;
/** the lids' scale-up (see dress), and the slit's width (× its sphere's radius) at rest */
const LID_K = 2.3, PUPIL_W = 0.35;

/** per worn root: the plate, halo and core materials (its own copies), the face's parts, found once, and the charge */
interface Lit {
  plates: (THREE.MeshStandardMaterial | null)[]; halos: (THREE.SpriteMaterial | null)[]; core: THREE.MeshStandardMaterial | null; charge: number; t: number;
  face: FaceParts;
}
const LIT = new WeakMap<THREE.Object3D, Lit>();
const HALO = new THREE.Color(GLOW);

/** one side's moving face: the eyeball, its slit, its two lids (and their open and shut turns), the brow's and lip's bones */
interface FaceSide {
  ball: THREE.Object3D | null; pupil: THREE.Object3D | null; up: THREE.Object3D | null; lo: THREE.Object3D | null;
  upOpen: number; upShut: number; loOpen: number; loShut: number;
  brow: THREE.Object3D | null; lip: THREE.Object3D | null; cheek: THREE.Object3D | null;
  browRest: THREE.Vector3; lipRest: THREE.Vector3; cheekRest: THREE.Vector3;
}
interface FaceParts { side: [FaceSide, FaceSide]; jaw: THREE.Object3D | null }
function findFace(root: THREE.Object3D): FaceParts {
  const side = (): FaceSide => ({
    ball: null, pupil: null, up: null, lo: null, upOpen: 0, upShut: 0, loOpen: 0, loShut: 0,
    brow: null, lip: null, cheek: null, browRest: new THREE.Vector3(), lipRest: new THREE.Vector3(), cheekRest: new THREE.Vector3(),
  });
  const f: FaceParts = { side: [side(), side()], jaw: null };
  root.traverse((o) => {
    if ((o as THREE.Bone).isBone && o.name === 'jaw') f.jaw = o;
    const m = /^(kaiju-eye|kaiju-pupil|kaiju-lids|brow|lip|cheek)([LR])$/.exec(o.name);
    if (!m) return;
    const sd = f.side[m[2] === 'L' ? 0 : 1];
    if (m[1] === 'kaiju-eye') sd.ball = o;
    else if (m[1] === 'kaiju-pupil') sd.pupil = o;
    else if (m[1] === 'kaiju-lids') {
      sd.up = o.children[0] ?? null; sd.lo = o.children[1] ?? null;
      // the lids' own open and shut turns (faceparts), read off them rather than copied: this face sets each lid alone
      setLids(o, 0, 0, 0); sd.upOpen = sd.up?.rotation.x ?? 0; sd.loOpen = sd.lo?.rotation.x ?? 0;
      setLids(o, 1, 0, 0); sd.upShut = sd.up?.rotation.x ?? 0; sd.loShut = sd.lo?.rotation.x ?? 0;
    } else if ((o as THREE.Bone).isBone && m[1] === 'brow') { sd.brow = o; sd.browRest.copy(o.position); }
    else if ((o as THREE.Bone).isBone && m[1] === 'lip') { sd.lip = o; sd.lipRest.copy(o.position); }
    else if ((o as THREE.Bone).isBone && m[1] === 'cheek') { sd.cheek = o; sd.cheekRest.copy(o.position); }
  });
  return f;
}

const clamp01k = (v: number) => Math.max(0, Math.min(1, v));
const ramp = (v: number, lo: number, hi: number) => clamp01k((v - lo) / (hi - lo));
/** how far the upper lids hang over the eyes at rest: a heavy, glowering lid */
const KLID_REST = 0.2;
/** the jaw's full opening (radians, face.jaw) and its sideways swing at a full jawSide: the rig swings every jaw 0.16 rad
 *  (rig.setJaw), which on this long snout put a shut chin 0.8 m off the upper jaw's, a dislocation; a third of it reads
 *  as the jaw shifting */
const JAW_OPEN = 0.5, JAW_SIDE = 0.055;
const AX_X = new THREE.Vector3(1, 0, 0), AX_Y = new THREE.Vector3(0, 1, 0), QX = new THREE.Quaternion();
/** the gaze a still face is given (only its look is read): a glance aside now and then */
const IDLE_LOOK: FaceState = { ...NEUTRAL_FACE };

/**
 * The face from the wearer's (remapped: MediaPipe's scores rarely reach 1 and some rest above 0; the gains assumed, not
 * measured), or an idle one with no face read: lids blink, wink, squint and widen; the slits look where the wearer looks,
 * widening when they stare and narrowing as it charges; the brow ridges drop into a scowl or lift; the upper lip curls
 * off the teeth in a snarl, and a little with every roar.
 */
function faceTick(F: FaceParts, t: number, f: FaceState | null | undefined, charge: number): void {
  let lookF: FaceState;
  if (!f) {
    const n = Math.floor(t / 3.4), g = sstep(0, 0.25, t - n * 3.4);
    const gx = (k: number) => (k % 3 === 0 ? 0 : (Math.abs(Math.sin(k * 91.7)) * 2 - 1) * 0.8);
    IDLE_LOOK.lookX = gx(n - 1) + (gx(n) - gx(n - 1)) * g;
    lookF = IDLE_LOOK;
  } else lookF = f;
  // no face: a slow blink every 5.2 s
  const b0 = t % 5.2, idleBlink = b0 < 0.2 ? Math.sin((b0 / 0.2) * Math.PI) : 0;
  const up = f ? ramp(f.browUp, 0.1, 0.65) : 0, sneer = f ? ramp(f.sneer, 0.06, 0.5) : 0, jaw = f ? clamp01k(f.jaw) : 0;
  const puff = f ? ramp(f.puff, 0.04, 0.4) : 0;
  // the jaw again, after the stage's rig.setJaw, with less of the sideways swing (the breath reads the bone after this)
  if (f && F.jaw) F.jaw.quaternion.setFromAxisAngle(AX_Y, f.jawSide * JAW_SIDE).multiply(QX.setFromAxisAngle(AX_X, f.jaw * JAW_OPEN));
  for (let i = 0; i < 2; i++) {
    const s = F.side[i]!, sx = i === 0 ? 1 : -1, L = i === 0;
    const bl = f ? ramp(L ? f.blinkL : f.blinkR, 0.15, 0.65) : idleBlink;
    const sq = f ? ramp(L ? f.squintL : f.squintR, 0.2, 0.7) : 0, wd = f ? ramp(L ? f.wideL : f.wideR, 0.08, 0.5) : 0;
    const bd = f ? ramp(L ? f.browDownL : f.browDownR, 0.08, 0.55) : 0, bo = f ? ramp(L ? f.browOuterL : f.browOuterR, 0.08, 0.6) : 0;
    const sm = f ? ramp(L ? f.smileL : f.smileR, 0.06, 0.7) : 0;
    // the lids: the upper hangs lower in a scowl and a squint, lifts when wide or the brows go up; the lower rises in a
    // squint or a grin; a blink shuts both
    const cu = Math.max(bl, clamp01k(KLID_REST + 0.35 * bd + 0.3 * sq + 0.15 * sneer - 0.6 * wd - 0.3 * up - 0.2 * bo - 0.15 * lookF.lookY));
    const cl = Math.max(bl, clamp01k(0.45 * sq + 0.3 * sm));
    if (s.up) { const o = s.upOpen - 0.3 * wd; s.up.rotation.x = o + (s.upShut - o) * cu; }
    if (s.lo) s.lo.rotation.x = s.loOpen + (s.loShut - s.loOpen) * cl;
    if (s.ball) look(s.ball, lookF, 0.45);
    // the slit: wider when staring, thin in a squint and as the plates charge
    if (s.pupil) s.pupil.scale.x = PUPIL_W * (1 + 0.9 * wd - 0.35 * sq) * (1 - 0.3 * charge);
    // the brow ridge pivots at the temple: a scowl drops it, the snout end most, and slides it out over the eye; the
    // inner raise lifts the snout end; the outer raise lifts the temple end
    if (s.brow) {
      s.brow.position.set(s.browRest.x + sx * 0.06 * bd, s.browRest.y - 0.14 * bd + 0.12 * up + 0.22 * bo - 0.04 * sneer, s.browRest.z + 0.08 * bd);
      s.brow.rotation.x = 0.09 * bd - 0.07 * up + 0.02 * bo + 0.04 * sneer;
    }
    // the upper lip lifts off the teeth, and out a little: a snarl, a roar, and on a smile's side a toothy smirk
    if (s.lip) {
      const k = Math.min(1.2, sneer + 0.25 * jaw * jaw + 0.5 * sm);
      s.lip.position.set(s.lipRest.x + sx * 0.06 * k, s.lipRest.y + 0.3 * k, s.lipRest.z + 0.03 * k);
    }
    // the cheeks (an anchor at rest) swell out when the wearer puffs theirs
    if (s.cheek) s.cheek.position.set(s.cheekRest.x + sx * 0.24 * puff, s.cheekRest.y - 0.04 * puff, s.cheekRest.z + 0.06 * puff);
  }
}

export const KAIJU: CharacterDef = {
  id: 'kaiju', name: 'Kaiju', blurb: 'A city-stomper: open wide for atomic breath',
  segs: KAIJU_SEGMENTS,
  body: {
    sdf: kaijuBodySDF, region: kaijuRegion, box: { min: [-5.0, -0.3, -12.0], max: [6.0, 19.0, 7.6] },
    palette: PALETTE, surface: 'scales', weights: 'sharp', capture, tint: kaijuTint,
  },
  dress,
  fit: { size: 1.06, limb: 0.6, head: 1 },
  idle: { tail: 0.2 },
  res: 88,
  face: {
    jaw: JAW_OPEN,
    eyes: [[EYE[0], EYE[1], EYE[2] + 0.3, 0.38], [-EYE[0], EYE[1], EYE[2] + 0.3, 0.38]],
    // measured stepping render/breath.ts at a real 30 fps (headless frames are too slow to show it): a spark shows only
    // after its first 15 % of life, so at speed 2.4 the stream began 0.5–0.9 m past the snout, out of a portrait
    // frame, and facing the camera it flew into the lens as white discs; at 1.4 it is a dense beam from the jaws in
    // profile and a blue burst toward the camera. Blue-weighted: a third white saturated the additive core
    breath: { colors: [0x9fe8ff, 0x3aa8ff, 0x3aa8ff, 0x1f6fff, 0xffffff], rate: 3, speed: 1.4, size: 1.0 },
  },
  tick(root, t, face) {
    let e = LIT.get(root);
    const jaw = face?.jaw ?? 0;
    if (!e) {
      // the wearer's own material copies (stage.ts clones them per wearer); a WeakMap, not userData, which is cloned
      const plates: (THREE.MeshStandardMaterial | null)[] = PLATE_BONES.map(() => null), halos: (THREE.SpriteMaterial | null)[] = PLATE_BONES.map(() => null);
      let core: THREE.MeshStandardMaterial | null = null;
      root.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.Material | undefined;
        if (!m || Array.isArray(m)) return;
        const p = /^kaiju-plate-(\d)$/.exec(m.name), h = /^kaiju-halo-(\d)$/.exec(m.name);
        if (p) plates[Number(p[1])] = m as THREE.MeshStandardMaterial;
        if (h) halos[Number(h[1])] = m as THREE.SpriteMaterial;
        if (m.name === 'kaiju-core') core = m as THREE.MeshStandardMaterial;
      });
      e = { plates, halos, core, charge: sstep(0.15, 0.7, jaw), t, face: findFace(root) };
      LIT.set(root, e);
    }
    // the charge follows the mouth: up in about a third of a second, down a little slower
    const dt = Math.max(0, Math.min(0.1, t - e.t));
    e.t = t;
    const want = sstep(0.15, 0.7, jaw);
    e.charge += (want - e.charge) * (1 - Math.exp(-dt / (want > e.charge ? 0.12 : 0.3)));
    const c = e.charge;
    const n = PLATE_BONES.length;
    for (let i = 0; i < n; i++) {
      // the tail's tip lights first and the glow climbs to the neck; each bone flickers on its own
      const u = i / (n - 1);
      const k = sstep(u * 0.45, u * 0.45 + 0.5, c);
      const f = 1 + 0.16 * Math.sin(t * 29 + i * 1.7) + 0.1 * Math.sin(t * 47 + i * 2.9) + 0.22 * Math.max(0, Math.sin(t * 11.3 + i * 0.8) - 0.7) * 3;
      const pm = e.plates[i], hm = e.halos[i];
      // charged, the bone darkens to a blue-grey under its glow, so the blue reads saturated rather than pastel
      if (pm) { pm.emissiveIntensity = 1.7 * k * f; pm.color.setRGB(1 - 0.62 * k, 1 - 0.5 * k, 1 - 0.3 * k); }
      if (hm) hm.color.copy(HALO).multiplyScalar(0.75 * k * f);
    }
    if (e.core) e.core.emissiveIntensity = 2.6 * c * (1 + 0.2 * Math.sin(t * 37));
    faceTick(e.face, t, face, c);
  },
};
