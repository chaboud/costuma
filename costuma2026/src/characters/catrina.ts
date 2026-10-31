// Catrina: an elegant skeleton lady for the Day of the Dead, in the spirit of La Catrina (an original figure, no
// particular artwork copied). A sugar-skull face, a wide black hat piled with marigolds and red roses under two ostrich
// plumes, an off-the-shoulder gown with a black lace frill across bare collarbones, red sleeves ending in black lace bell
// cuffs, a purple sash and a long skirt of three ruffled tiers, and bony white hands.
//
// - **The gown** is one skinned signed-distance body (bodice, neck and bare shoulders, sleeves, skirt) with sharp
//   weights. Its colours are drawn per fragment from the bind-pose position (as Jack's cloth): the lace bands' scalloped
//   edges, the tiers' trims and the front lacing are far finer than the marching-cubes grid, which would stair-step them.
//   The skirt hangs from the pelvis; its front takes a share of each thigh (re-weighted in `dress`, up to three bones
//   per vertex), so a step or a squat pushes the cloth forward over the knees instead of the knees going through it.
// - **The head** is rigid on the head bone: a calavera polygonised from its own field, cut along the mouth line into
//   the skull and a lower jaw on the `jaw` bone (both from one grid, so the seam closes exactly), the face painted in a
//   fragment shader in the same model coordinates on both (black sockets in rings of marigold, magenta and turquoise
//   petals, an upside-down heart for a nose, a stitched smile along the seam, cheek swirls, a flower on the forehead, a
//   heart on the chin). An open mouth shows teeth on both halves and the dark behind them.
// - **The hat, flowers, plumes, hands, choker and earrings** are meshes on bones (build.ts `dress`).
//
// Model frame: the hero's (hero.ts) — 20 units tall on y = 0, +y up, +z forward, +x her own left. The skull's centre is
// near the head segment's midpoint, which the stage's neck fit puts on the wearer's head (rig.ts neckFit).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Capture, CharacterDef, Dresser } from './build';
import { sdCapsule, sdEllipsoid, sdSphere, smin, type Seg } from './sdf';
import { isoGeometry } from './skeleton';

type V3 = [number, number, number];

// the arms are set a little out from the bodice (Jack's): a sleeve that touched the body would be joined to it by the
// marching cubes and tear off it when raised
const SH: V3 = [2.5, 14.55, 0], EL: V3 = [2.95, 11.95, -0.05], WR: V3 = [3.12, 9.6, 0.35];
/** the jaw's hinge: behind and above the mouth's corners, so an open mouth swings the chin down and a little back */
const HINGE: V3 = [0, 16.35, -0.25];
const mx = (p: V3): V3 => [-p[0], p[1], p[2]];

export const CATRINA_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 9.6, 0], b: [0, 10.6, 0], parent: null },
  { name: 'spine1', a: [0, 10.6, 0], b: [0, 12.4, 0.1], parent: 'pelvis' },
  { name: 'spine2', a: [0, 12.4, 0.1], b: [0, 15.0, 0.1], parent: 'spine1' },
  { name: 'neck', a: [0, 15.0, 0.1], b: [0, 15.9, 0.15], parent: 'spine2' },
  { name: 'head', a: [0, 15.9, 0.15], b: [0, 18.4, 0.3], parent: 'neck' },
  // the lower jaw is a mesh on this bone; it takes nothing from the body
  { name: 'jaw', a: HINGE, b: [0, 15.55, 1.0], parent: 'head', reach: 0 },
  { name: 'tail1', a: [0, 10.4, -1.0], b: [0, 9.6, -1.1], parent: 'pelvis', reach: 0 },
  { name: 'tail2', a: [0, 9.6, -1.1], b: [0, 8.8, -1.2], parent: 'tail1', reach: 0 },
  { name: 'tail3', a: [0, 8.8, -1.2], b: [0, 8.0, -1.3], parent: 'tail2', reach: 0 },
  { name: 'tail4', a: [0, 8.0, -1.3], b: [0, 7.2, -1.4], parent: 'tail3', reach: 0 },
  { name: 'thighL', a: [1.1, 9.6, 0], b: [1.2, 5.3, 0.2], parent: 'pelvis' },
  { name: 'shinL', a: [1.2, 5.3, 0.2], b: [1.2, 1.1, -0.1], parent: 'thighL' },
  { name: 'footL', a: [1.2, 1.1, -0.1], b: [1.2, 0.35, 1.4], parent: 'shinL' },
  { name: 'thighR', a: [-1.1, 9.6, 0], b: [-1.2, 5.3, 0.2], parent: 'pelvis' },
  { name: 'shinR', a: [-1.2, 5.3, 0.2], b: [-1.2, 1.1, -0.1], parent: 'thighR' },
  { name: 'footR', a: [-1.2, 1.1, -0.1], b: [-1.2, 0.35, 1.4], parent: 'shinR' },
  { name: 'armL', a: SH, b: EL, parent: 'spine2' },
  { name: 'forearmL', a: EL, b: WR, parent: 'armL' },
  { name: 'armR', a: mx(SH), b: mx(EL), parent: 'spine2' },
  { name: 'forearmR', a: mx(EL), b: mx(WR), parent: 'armR' },
];
const SEG_INDEX = (n: string) => CATRINA_SEGMENTS.findIndex((s) => s.name === n);

const BOX = { min: [-4.3, -0.45, -4.1] as V3, max: [4.3, 17.3, 3.9] as V3 };

// ---------------------------------------------------------------------------------------------------------------------
// small vector helpers

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len3 = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const nrm = (a: V3): V3 => { const l = len3(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const sstep = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
/** smooth max: carves `b` out of `a` with a fillet of `k` */
const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);

// the arm's axes and a frame round each (for the flutes' angle), the left arm's; the right is its mirror
const UA = nrm(sub(EL, SH)), UL = len3(sub(EL, SH));
const UN = nrm(cross(UA, [0, 0, 1])), UB = cross(UA, UN);
const FA = nrm(sub(WR, EL)), FL = len3(sub(WR, EL));
const FN = nrm(cross(FA, [0, 0, 1])), FB = cross(FA, FN);

// ---------------------------------------------------------------------------------------------------------------------
// the gown: three parts, each its own field (the capture rule and the colours ask which part a point is on). Each starts
// with a bound: far from the part, a distance no greater than the true one, which is all the grid needs

/** where the off-shoulder lace frill runs round the bodice */
const FRILL_TOP = 14.3, FRILL_BOT = 13.45;
/** the bodice, the bare neck, shoulders and collarbones, and the lace frill across the top of the bodice */
function torsoD(x: number, y: number, z: number): number {
  if (y < 9.9) return 10.1 - y;
  if (y > 17.2) return y - 17.0;
  const ax = Math.abs(x);
  if (ax > 3.3) return ax - 3.05;
  if (z > 2.0) return z - 1.6;
  if (z < -1.8) return -1.5 - z;
  let d = sdEllipsoid(x, y, z, 0, 13.3, 0.05, 1.5, 1.85, 0.95); // the ribcage
  d = smin(d, sdEllipsoid(ax, y, z, 0.6, 13.25, 0.5, 0.6, 0.52, 0.5), 0.35); // the bust, in the bodice
  d = smin(d, sdEllipsoid(x, y, z, 0, 11.3, 0.05, 1.16, 1.2, 0.86), 0.7); // the waist, narrow
  if (y > 13.3) {
    d = smin(d, sdCapsule(ax, y, z, 0, 15.02, -0.14, 2.2, 14.62, -0.06, 0.33, 0.36), 0.42); // the shoulders, sloping
    d = smin(d, sdSphere(ax, y, z, SH[0], SH[1], SH[2], 0.45), 0.3); // a round bare shoulder over each joint
    d = smin(d, sdCapsule(ax, y, z, 0.2, 14.78, 0.62, 2.1, 14.9, 0.22, 0.11, 0.1), 0.08); // the collarbones
    d = smax(d, -sdSphere(x, y, z, 0, 14.92, 0.82, 0.16), 0.12); // the notch between them
    d = smin(d, sdCapsule(x, y, z, 0, 14.6, -0.05, 0, 16.5, 0.05, 0.4, 0.36), 0.35); // the neck, up into the skull
    if (y < FRILL_TOP + 0.1 && y > FRILL_BOT - 0.1) {
      // the frill: a fluted band flaring out as it falls, proud of the bust in front and nearly flat at the sides (an
      // arm's own frill hangs there, and the two must not touch)
      const s = clamp01((FRILL_TOP - y) / (FRILL_TOP - FRILL_BOT));
      const th = Math.atan2(x, z), fr = Math.abs(Math.cos(th));
      const flute = 1 + 0.045 * s * Math.cos(16 * th);
      const rx = (1.18 + 0.4 * s) * flute, rz = (0.82 + 0.5 * s * (0.6 + 0.4 * fr)) * flute;
      const ring = (Math.hypot(x / rx, (z - 0.05) / rz) - 1) * Math.min(rx, rz);
      d = Math.min(d, Math.max(ring, y - FRILL_TOP, FRILL_BOT - y));
    }
  }
  return d;
}

/** the skirt's tiers: top and bottom heights, radii across and front-to-back at each, the flutes round its ruffle */
const TIERS = [
  { top: 11.35, bot: 7.1, r0: [1.22, 0.98], r1: [2.02, 1.78], n: 15 },
  { top: 7.6, bot: 3.75, r0: [1.9, 1.62], r1: [2.62, 2.32], n: 19 },
  { top: 4.25, bot: 0.12, r0: [2.48, 2.18], r1: [3.28, 2.98], n: 23 },
] as const;
const SASH = 11.2;
/** the skirt fuller behind: its centre drifts back as it falls */
const skirtZ = (y: number) => -0.028 * (11.3 - y);
function skirtD(x: number, y: number, z: number): number {
  if (y > 11.8) return y - 11.6;
  const r = Math.hypot(x, z);
  if (r > 4.1) return r - 3.95;
  const th = Math.atan2(x, z), zc = skirtZ(y);
  // the sash round the waist, over the join of bodice and skirt
  let d = Math.max((Math.hypot(x / 1.36, (z - 0.05) / 1.08) - 1) * 1.08, Math.abs(y - SASH) - 0.28);
  for (const T of TIERS) {
    if (y > T.top + 0.4 || y < T.bot - 0.4) { d = Math.min(d, Math.max(y - T.top, T.bot - y)); continue; }
    const t = clamp01((T.top - y) / (T.top - T.bot));
    // the last third of each tier is its ruffle: flaring out and fluted
    const s = sstep(0.68, 1, t), k = 1 + 0.065 * s * Math.cos(T.n * th), flare = 0.36 * s * s;
    const rx = (T.r0[0] + (T.r1[0] - T.r0[0]) * t + flare) * k, rz = (T.r0[1] + (T.r1[1] - T.r0[1]) * t + flare) * k;
    const ring = (Math.hypot(x / rx, (z - zc) / rz) - 1) * Math.min(rx, rz);
    d = Math.min(d, Math.max(ring, y - T.top, T.bot - y));
  }
  return d;
}

/** a sleeve (`ax`: either side): the upper arm with a frill round its top, a bell flaring to a hollow cuff at the wrist */
function armD(ax: number, y: number, z: number): number {
  if (ax < 1.6) return 1.75 - ax;
  if (y > 15.3) return y - 15.15;
  if (y < 8.7) return 8.9 - y;
  if (ax > 4.4) return ax - 4.1;
  let d = sdCapsule(ax, y, z, SH[0], SH[1], SH[2], EL[0], EL[1], EL[2], 0.4, 0.36);
  // the forearm: a bell from mid-forearm to the wrist, its rim fluted
  const px = ax - EL[0], py = y - EL[1], pz = z - EL[2];
  const t = (px * FA[0] + py * FA[1] + pz * FA[2]) / FL, tc = clamp01(t);
  const qx = px - FA[0] * FL * tc, qy = py - FA[1] * FL * tc, qz = pz - FA[2] * FL * tc;
  const rho = Math.hypot(qx, qy, qz);
  const s = sstep(0.3, 1.0, tc);
  const phi = Math.atan2(qx * FB[0] + qy * FB[1] + qz * FB[2], qx * FN[0] + qy * FN[1] + qz * FN[2]);
  const R = 0.34 + 0.4 * s * s * (1 + 0.14 * s * Math.cos(9 * phi));
  d = smin(d, Math.max(rho - R, -t * FL, (t - 1) * FL), 0.22);
  // the cuff is open: a hollow up into it that the bony hand comes out of
  d = Math.max(d, -Math.max(rho - (R - 0.13), (0.78 - t) * FL));
  // the off-shoulder frill round the top of the sleeve
  const ux = ax - SH[0], uy = y - SH[1], uz = z - SH[2];
  const tu = (ux * UA[0] + uy * UA[1] + uz * UA[2]) / UL;
  if (tu > 0.05 && tu < 0.46) {
    const rx = ux - UA[0] * UL * tu, ry = uy - UA[1] * UL * tu, rz = uz - UA[2] * UL * tu;
    const su = clamp01((tu - 0.14) / 0.24);
    const ph = Math.atan2(rx * UB[0] + ry * UB[1] + rz * UB[2], rx * UN[0] + ry * UN[1] + rz * UN[2]);
    const Rf = (0.47 + 0.3 * su) * (1 + 0.07 * su * Math.cos(10 * ph));
    d = Math.min(d, Math.max(Math.hypot(rx, ry, rz) - Rf, (0.14 - tu) * UL, (tu - 0.38) * UL));
  }
  return d;
}

export function catrinaSDF(x: number, y: number, z: number): number {
  return Math.min(torsoD(x, y, z), skirtD(x, y, z), armD(Math.abs(x), y, z));
}

const TORSO = 0, SKIRT = 1, ARM = 2;
/** the parts' distances at the last point asked, and which is nearest (asked once per vertex by several passes) */
const dist = new Float64Array(3);
let lastX = NaN, lastY = NaN, lastZ = NaN, lastPart = 0;
function parts(x: number, y: number, z: number): number {
  if (x === lastX && y === lastY && z === lastZ) return lastPart;
  dist[TORSO] = torsoD(x, y, z); dist[SKIRT] = skirtD(x, y, z); dist[ARM] = armD(Math.abs(x), y, z);
  let m = 0;
  for (let i = 1; i < 3; i++) if (dist[i]! < dist[m]!) m = i;
  lastX = x; lastY = y; lastZ = z; lastPart = m;
  return m;
}
const SEAM = 0.2;
const near = (i: number) => dist[i]! <= dist[lastPart]! + SEAM;

/**
 * Which bones may take the skin at a point. A sleeve goes with its arm; the bodice never does (a raised arm would pull a
 * sheet up the flank). The bare shoulders are given to the arm in `dress`, on a ramp out from the neck: a cut between
 * spine and arm anywhere on bare skin tears open when the arm goes up. The skirt goes with the pelvis (and the spine at the waist); `dress` gives its front a
 * share of the thighs. The neck goes with the neck and, under the skull, the head.
 */
const capture: Capture = (sg, x, y, z) => {
  parts(x, y, z);
  const n = sg.name, side = n.endsWith('L') ? 1 : n.endsWith('R') ? -1 : 0, ax = Math.abs(x);
  if (side !== 0 && x * side < -0.05) return false;
  if (n.startsWith('arm') || n.startsWith('forearm')) return lastPart === ARM;
  if (n === 'pelvis') return near(SKIRT) || (near(TORSO) && y < 11.6);
  if (n === 'spine1') return (near(SKIRT) && y > 9.8) || (near(TORSO) && y < 13.2);
  if (n === 'spine2') return near(TORSO);
  if (n === 'neck') return near(TORSO) && y > 14.5 && ax < 1.1;
  if (n === 'head') return near(TORSO) && y > 15.8 && ax < 0.9;
  return false;
};

/** the region is the part; `partTint` then writes the parts' weights into the vertex colour, which the cloth shader
 *  reads as weights (not as a colour) and `dress` reads back to find the skirt and the shoulders */
const catrinaRegion = (x: number, y: number, z: number) => parts(x, y, z);
/** across a seam the parts blend, so the cloth's colours do too (the grid is coarse) */
function partTint(_r: number, x: number, y: number, z: number, c: THREE.Color): void {
  const p = parts(x, y, z);
  const w0 = Math.exp(-(dist[0]! - dist[p]!) / 0.08), w1 = Math.exp(-(dist[1]! - dist[p]!) / 0.08), w2 = Math.exp(-(dist[2]! - dist[p]!) / 0.08);
  const ws = w0 + w1 + w2;
  c.setRGB(w0 / ws, w1 / ws, w2 / ws);
}

// ---------------------------------------------------------------------------------------------------------------------
// the gown's shader: colours per fragment from the bind-pose position and normal, each part's weighed by `aPart`

const g3 = (v: readonly number[]) => `vec3(${v.map((n) => n.toFixed(5)).join(', ')})`;
const CLOTH_GLSL = /* glsl */ `
  varying vec3 vBind; varying vec3 vBindN;
  vec3 srgb(float r, float g, float b) { return pow(vec3(r, g, b), vec3(2.2)); }
  // 1 where d < 0, antialiased over w
  float inside(float d, float w) { return 1.0 - smoothstep(-w, w, d); }
  // a row of round scallops along s, each one period wide and h deep (0 between them, h at a scallop's middle)
  float scallop(float s, float period, float h) { float q = 2.0 * fract(s / period) - 1.0; return h * sqrt(max(0.0, 1.0 - q * q)); }
  // lace: little rings on a lattice, cut by the surface
  vec3 lace(vec3 p, vec3 base, vec3 ink, float w) {
    vec3 q = fract(p * 5.5) - 0.5, r = fract(p * 5.5 + 0.5) - 0.5;
    float m = abs(length(q) - 0.26) - 0.05;
    m = min(m, length(q) - 0.08);
    float net = abs(length(r) - 0.36) - 0.025;
    return mix(base, ink, 0.5 * max(inside(m, w * 5.5), 0.6 * inside(net, w * 5.5)));
  }
  vec3 bone() { return srgb(0.94, 0.92, 0.88); }
  float segment2(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
  vec3 red() { return srgb(0.56, 0.04, 0.1); }
  vec3 black() { return srgb(0.07, 0.05, 0.07); }
  vec3 laceInk() { return srgb(0.32, 0.26, 0.3); }
  vec3 purple() { return srgb(0.36, 0.13, 0.5); }
  vec3 marigold() { return srgb(1.0, 0.56, 0.06); }

  vec3 torsoCol(vec3 p, vec3 n, float w) {
    float th = atan(p.x, p.z);
    vec3 c = red();
    // the bodice's seams: eight thin darker lines down it
    float seam = abs(fract(th / 0.785 + 0.5) - 0.5) * 0.785 * 1.2;
    c *= 1.0 - 0.28 * inside(seam - 0.018, w);
    // the lacing down the front: a black cord criss-crossed between two rows of eyelets
    float ax = abs(p.x);
    float zone = inside(ax - 0.2, w) * inside(p.y - 13.0, w) * inside(11.55 - p.y, w) * step(0.2, n.z);
    float cord = abs(fract((p.y + 1.3 * ax) / 0.26) - 0.5) * 0.26 / 1.64 - 0.014;
    float edge = abs(ax - 0.2) - 0.022;
    c = mix(c, black(), zone * max(inside(cord, w) * inside(ax - 0.17, w), inside(edge, w)));
    // the lace frill with a scalloped hem, and above it the bare bone
    float bot = ${FRILL_BOT.toFixed(2)} - scallop(th * 1.3, 0.3, 0.1);
    c = mix(c, lace(p, black(), laceInk(), w), inside(bot - p.y, w));
    // the bare bone: a soft shade down toward the frill, under each collarbone and in the notch between them
    vec3 b = bone() * mix(0.8, 1.0, smoothstep(${FRILL_TOP.toFixed(2)}, ${(FRILL_TOP + 0.45).toFixed(2)}, p.y));
    float front = smoothstep(0.0, 0.35, n.z);
    float clav = segment2(vec2(ax, p.y), vec2(0.22, 14.79), vec2(2.08, 14.91));
    b *= 1.0 - 0.18 * smoothstep(0.26, 0.08, clav) * front;
    b *= 1.0 - 0.3 * smoothstep(0.22, 0.0, length(vec2(p.x, p.y - 14.9))) * front;
    // the collarbones drawn as the face is painted: a soft grey line round each, the bone's knob at the shoulder
    vec3 ink = srgb(0.42, 0.4, 0.44);
    b = mix(b, ink, 0.75 * inside(abs(clav - 0.12) - 0.014, w) * front * step(0.24, ax));
    c = mix(c, b, inside(${(FRILL_TOP + 0.02).toFixed(2)} - p.y, w));
    return c;
  }

  vec3 skirtCol(vec3 p, vec3 n, float w) {
    float th = atan(p.x, p.z);
    float arc = th * length(p.xz);
    // the tier that shows here, its colour, its trim's, and how far up from its hem
    vec3 base, trim; float e;
    if (p.y > ${(TIERS[0].bot - 0.03).toFixed(2)}) { base = red(); trim = black(); e = p.y - ${TIERS[0].bot.toFixed(2)}; }
    else if (p.y > ${(TIERS[1].bot - 0.03).toFixed(2)}) { base = black(); trim = red(); e = p.y - ${TIERS[1].bot.toFixed(2)}; }
    else { base = purple(); trim = black(); e = p.y - ${TIERS[2].bot.toFixed(2)}; }
    // gathered: fine pleats shading the cloth
    vec3 c = base * (0.9 + 0.1 * cos(th * 56.0));
    // the trim: a lace band with a scalloped top along each ruffle's hem
    float top = 0.62 + scallop(arc, 0.42, 0.13);
    vec3 t = trim == black() ? lace(p, black(), laceInk(), w) : trim;
    c = mix(c, t, inside(e - top, w));
    // a thin marigold piping at the very hem of each tier
    c = mix(c, marigold(), inside(abs(e - 0.07) - 0.035, w));
    // the sash: purple satin, a marigold stripe along each edge
    float sa = abs(p.y - ${SASH.toFixed(2)});
    c = mix(c, purple() * 1.15, inside(sa - 0.3, w));
    c = mix(c, marigold(), inside(abs(sa - 0.22) - 0.035, w));
    // the underside of a ruffle is in its own shade
    c *= mix(1.0, 0.35, smoothstep(-0.2, -0.6, n.y));
    return c;
  }

  vec3 armCol(vec3 p, vec3 n, float w) {
    vec3 q = vec3(abs(p.x), p.y, p.z);
    vec3 nn = vec3(sign(p.x) * n.x, n.y, n.z);
    float tu = dot(q - ${g3(SH)}, ${g3(UA)}) / ${UL.toFixed(5)};
    vec3 fo = q - ${g3(EL)};
    float tf = dot(fo, ${g3(FA)}) / ${FL.toFixed(5)};
    vec3 radial = fo - ${g3(FA)} * ${FL.toFixed(5)} * clamp(tf, 0.0, 1.0);
    float ph = atan(dot(radial, ${g3(FB)}), dot(radial, ${g3(FN)}));
    vec3 c = red();
    // the bell cuff in black lace from mid-forearm, its top scalloped, a marigold piping at its rim
    float cuffTop = 0.42 - scallop(ph * 0.5, 0.35, 0.09);
    c = mix(c, lace(p, black(), laceInk(), w), inside(cuffTop - tf, w / ${FL.toFixed(3)}));
    c = mix(c, marigold(), inside(abs(tf - 0.965) - 0.018, w / ${FL.toFixed(3)}));
    // inside the open cuff: dark
    c = mix(c, black() * 0.4, step(0.75, tf) * smoothstep(0.1, -0.3, dot(nn, normalize(radial))));
    // the frill at the top of the sleeve, scalloped along its hem, and the bare shoulder above it
    float ub = 0.39 + scallop(ph * 0.5, 0.35, 0.06) / ${UL.toFixed(3)};
    c = mix(c, lace(p, black(), laceInk(), w), inside(tu - ub, w / ${UL.toFixed(3)}));
    c = mix(c, bone(), inside(tu - 0.14, w / ${UL.toFixed(3)}));
    return c;
  }

  vec3 gown(vec3 p, vec3 n, vec3 k, float w) {
    vec3 c = vec3(0.0);
    if (k.x > 0.001) c += torsoCol(p, n, w) * k.x;
    if (k.y > 0.001) c += skirtCol(p, n, w) * k.y;
    if (k.z > 0.001) c += armCol(p, n, w) * k.z;
    return c / max(1e-4, k.x + k.y + k.z);
  }`;

function clothMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.62, metalness: 0 });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n varying vec3 vBind; varying vec3 vBindN;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n vBind = position; vBindN = normal;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + CLOTH_GLSL)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float pw = max(length(fwidth(vBind)) * 0.6, 1e-4);
        // the vertex colour is the parts' weights (partTint), not a colour
        diffuseColor.rgb = gown(vBind, normalize(vBindN), diffuseColor.rgb, pw);`);
  };
  m.customProgramCacheKey = () => 'catrina-cloth-v4';
  return m;
}

// ---------------------------------------------------------------------------------------------------------------------
// the skull: one field, cut along the mouth into the head's part and the jaw's

/** the face is painted on a cylinder round the head: u across (≈ x on the front), v = y */
const FACE_R = 1.32, FACE_Z = -0.1;
const faceU = (x: number, z: number) => FACE_R * Math.atan2(x, z - FACE_Z);
/** the stitched smile, and the seam between skull and jaw under it: rising a little toward the corners */
const mouthY = (u: number) => { const a = Math.min(Math.abs(u), 0.95) / 0.7; return 16.08 + 0.07 * a * a; };
/** the eye sockets' centres (her left; the right mirrored) */
const SOCKET: V3 = [0.42, 17.0, 1.18];

function skullD(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let d = sdEllipsoid(x, y, z, 0, 17.42, -0.08, 1.02, 1.1, 1.22); // the cranium
  d = smin(d, sdEllipsoid(x, y, z, 0, 16.85, -0.38, 0.9, 0.6, 0.85), 0.3); // the skull's base, behind
  d = smin(d, sdEllipsoid(x, y, z, 0, 16.75, 0.45, 0.82, 0.88, 0.78), 0.35); // the face, brow to lip
  d = smin(d, sdEllipsoid(ax, y, z, 0.66, 16.68, 0.72, 0.3, 0.28, 0.42), 0.25); // the cheekbones
  d = smin(d, sdEllipsoid(x, y, z, 0, 16.0, 0.5, 0.68, 0.5, 0.62), 0.35); // the lower face
  d = smin(d, sdEllipsoid(x, y, z, 0, 15.68, 0.82, 0.3, 0.22, 0.28), 0.25); // the chin
  // the sockets: shallow pits under the paint
  d = smax(d, -sdEllipsoid(ax, y, z, SOCKET[0], SOCKET[1], SOCKET[2], 0.3, 0.28, 0.22), 0.1);
  return d;
}
/** the jaw's region: under the mouth line, in front of a plane just behind the cheeks (negative inside) */
const jawRegion = (x: number, y: number, z: number) => Math.max(y - mouthY(faceU(x, z)), -0.05 - z);
const upperSkull = (x: number, y: number, z: number) => Math.max(skullD(x, y, z), -jawRegion(x, y, z));
const lowerSkull = (x: number, y: number, z: number) => Math.max(skullD(x, y, z), jawRegion(x, y, z));

const SKULL_WHITE = new THREE.Color(0xf4efe8), MOUTH_DARK = new THREE.Color(0x1a0608);
/** the skull's own surface is white (the paint goes on it); the cut faces along the mouth are the dark inside */
function skullColor(x: number, y: number, z: number, c: THREE.Color): void {
  const cut = skullD(x, y, z) < -0.025 && Math.abs(y - mouthY(faceU(x, z))) < 0.06;
  c.copy(cut ? MOUTH_DARK : SKULL_WHITE);
}

const FACE_GLSL = /* glsl */ `
  varying vec3 vBind;
  vec3 srgb(float r, float g, float b) { return pow(vec3(r, g, b), vec3(2.2)); }
  float inside(float d, float w) { return 1.0 - smoothstep(-w, w, d); }
  float dot2(vec2 v) { return dot(v, v); }
  // Inigo Quilez's heart: its point at the origin, its lobes up to y = 1.1, half as wide
  float heart(vec2 p) {
    p.x = abs(p.x);
    if (p.y + p.x > 1.0) return sqrt(dot2(p - vec2(0.25, 0.75))) - sqrt(2.0) / 4.0;
    return sqrt(min(dot2(p - vec2(0.0, 1.0)), dot2(p - 0.5 * max(p.x + p.y, 0.0)))) * sign(p.x - p.y);
  }
  float segment(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h); }
  float mouthY(float u) { float a = min(abs(u), 0.95) / 0.7; return 16.08 + 0.07 * a * a; }

  vec3 paint(vec3 base, vec3 p, float w) {
    vec3 BLACK = srgb(0.05, 0.03, 0.05), ORANGE = srgb(1.0, 0.52, 0.02), MAGENTA = srgb(0.9, 0.1, 0.5);
    vec3 TURQ = srgb(0.05, 0.75, 0.78), RED = srgb(0.85, 0.06, 0.12);
    float u = ${FACE_R.toFixed(3)} * atan(p.x, p.z - (${FACE_Z.toFixed(3)})), v = p.y, au = abs(u);
    vec2 f = vec2(u, v);
    vec3 c = base;
    const float TAU = 6.2831853, N = 10.0;
    // a ring of petals round each socket, shorter toward the nose, a dot past each tip
    vec2 q = vec2(au - ${SOCKET[0].toFixed(3)}, v - ${SOCKET[1].toFixed(3)});
    float rho = length(q), phi = atan(q.y, q.x);
    float k = floor(phi / TAU * N + 0.5), pk = k * TAU / N, dl = phi - pk;
    float r0 = 0.28, L = 0.2 * (0.45 + 0.55 * smoothstep(-0.9, 0.3, cos(pk)));
    float tt = clamp((rho - r0) / L, 0.0, 1.0);
    float wd = 0.1 * pow(sin(3.14159 * tt), 0.7) * (0.65 + 0.35 * L / 0.2);
    float dp = max(abs(dl) * rho - wd, max(r0 - 0.03 - rho, rho - r0 - L));
    float ki = mod(k + 30.0, 3.0);
    vec3 pc = ki < 0.5 ? ORANGE : ki < 1.5 ? MAGENTA : TURQ;
    c = mix(c, pc, inside(dp, w));
    c = mix(c, BLACK, inside(abs(dp) - 0.008, w) * step(r0 - 0.01, rho));
    vec2 tip = vec2(cos(pk), sin(pk)) * (r0 + L + 0.06);
    c = mix(c, pc, inside(length(q - tip) - 0.028, w));
    // the socket, black
    c = mix(c, BLACK, inside((length(q / vec2(0.3, 0.28)) - 1.0) * 0.28, w));
    // the nose: an upside-down heart
    c = mix(c, BLACK, inside(heart(vec2(u, 16.74 - v) / 0.24) * 0.24, w));
    // the stitched smile along the jaw's seam
    float um = clamp(u, -0.92, 0.92);
    c = mix(c, BLACK, inside(length(vec2(u - um, v - mouthY(um))) - 0.02, w));
    float sp = 0.088, us = clamp(floor(u / sp + 0.5), -10.0, 10.0) * sp;
    float hs = 0.1 * (1.0 - 0.45 * pow(min(abs(us), 0.9) / 0.9, 2.0));
    float ds = segment(f, vec2(us, mouthY(us) - hs), vec2(us, mouthY(us) + hs)) - 0.017;
    c = mix(c, BLACK, inside(ds, w) * step(abs(us), 0.9));
    // a swirl on each cheek
    vec2 cq = vec2(au - 0.74, v - 16.42);
    float cr = length(cq), ca = atan(cq.y, cq.x);
    float sw = max(abs(fract(cr / 0.05 - ca / TAU + 0.5) - 0.5) * 0.05 - 0.009, cr - 0.155);
    c = mix(c, TURQ, inside(sw, w));
    // a flower on the forehead: six marigold petals round a magenta heart of a centre
    vec2 fq = vec2(u, v - 17.74);
    float fr = length(fq), fa = atan(fq.y, fq.x);
    c = mix(c, ORANGE, inside(fr - 0.2 * (0.5 + 0.5 * abs(cos(fa * 3.0))), w));
    c = mix(c, MAGENTA, inside(fr - 0.07, w));
    // a heart on the chin
    c = mix(c, RED, inside(heart(vec2(u, v - 15.6) / 0.14) * 0.14, w));
    return c;
  }`;

function faceMaterial(d: Dresser): THREE.MeshStandardMaterial {
  // a little self-glow in the paint's own colours, so the white face and its colours hold up in a dim room
  const m = d.std({ name: 'catrina-face', color: 0xffffff, vertexColors: true, roughness: 0.42, metalness: 0, emissive: 0xffffff, emissiveIntensity: 0.14 });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n varying vec3 vBind;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n vBind = position;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + FACE_GLSL)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float fw = max(length(fwidth(vBind)) * 0.6, 1e-4);
        float skin = smoothstep(0.25, 0.6, diffuseColor.r);
        diffuseColor.rgb = mix(diffuseColor.rgb, paint(diffuseColor.rgb, vBind, fw), skin);`)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance *= diffuseColor.rgb;');
  };
  m.customProgramCacheKey = () => 'catrina-face-v2';
  return m;
}

// ---------------------------------------------------------------------------------------------------------------------
// geometry kit

const V = (p: V3) => new THREE.Vector3(p[0], p[1], p[2]);
let seed = 1;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

/** non-indexed, no uv, with a vertex colour (one colour, or per vertex from `fn`) — so any of them can be merged */
function prep(g: THREE.BufferGeometry, col: number | THREE.Color | ((x: number, y: number, z: number, c: THREE.Color) => void)): THREE.BufferGeometry {
  const h = g.index ? g.toNonIndexed() : g;
  if (h !== g) g.dispose();
  h.deleteAttribute('uv');
  if (!h.attributes.normal) h.computeVertexNormals();
  const p = h.attributes.position!, n = p.count, a = new Float32Array(n * 3), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    if (typeof col === 'function') { c.setRGB(1, 1, 1); col(p.getX(i), p.getY(i), p.getZ(i), c); } else c.set(col);
    a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b;
  }
  h.setAttribute('color', new THREE.BufferAttribute(a, 3));
  return h;
}
function merge(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const g = mergeGeometries(parts, false)!;
  for (const p of parts) p.dispose();
  return g;
}

/** the frame whose +y runs a→b and whose +x is as near model +x as that allows (skeleton.ts) */
function frame(a: V3, b: V3): THREE.Matrix4 {
  const y = V(b).sub(V(a)).normalize();
  const x = new THREE.Vector3(1, 0, 0).addScaledVector(y, -y.x);
  if (x.lengthSq() < 1e-6) x.set(0, 0, 1);
  x.normalize();
  const z = new THREE.Vector3().crossVectors(x, y);
  return new THREE.Matrix4().makeBasis(x, y, z).setPosition(a[0], a[1], a[2]);
}
function ball(c: V3, r: number, s: V3 = [1, 1, 1], seg = 10): THREE.BufferGeometry {
  return new THREE.SphereGeometry(r, seg, Math.max(5, Math.round(seg * 0.7))).scale(s[0], s[1], s[2]).translate(c[0], c[1], c[2]);
}
/** a small bone from a to b: a lathe swelling at both ends (skeleton.ts longBone, with few rings) */
function smallBone(a: V3, b: V3, r0: number, rs: number, r1: number): THREE.BufferGeometry {
  const len = V(b).distanceTo(V(a)), cap = 2, along = 5;
  const pts: THREE.Vector2[] = [];
  for (let k = 0; k <= cap; k++) { const t = -Math.PI / 2 + (k / cap) * (Math.PI / 2); pts.push(new THREE.Vector2(Math.max(1e-3, r0 * Math.cos(t)), r0 * 0.75 * Math.sin(t))); }
  const w = Math.min(0.2, 1.3 * Math.max(r0, r1) / len);
  for (let k = 1; k < along; k++) {
    const t = k / along;
    pts.push(new THREE.Vector2(rs + (r0 - rs) * Math.exp(-((t / w) ** 2)) + (r1 - rs) * Math.exp(-(((1 - t) / w) ** 2)), t * len));
  }
  for (let k = 0; k <= cap; k++) { const t = (k / cap) * (Math.PI / 2); pts.push(new THREE.Vector2(Math.max(1e-3, r1 * Math.cos(t)), len + r1 * 0.75 * Math.sin(t))); }
  return new THREE.LatheGeometry(pts, 6).applyMatrix4(frame(a, b));
}

/**
 * The left hand, bones only, hanging from the wrist along `dir`: palm in, thumb forward, long fingers curled a little
 * (Skelly's, slimmer). Drawn a little bigger than a hand so it covers the wearer's; it rides the forearm (the rig has no
 * hand bone).
 */
function hand(wrist: V3, dir: V3): THREE.BufferGeometry[] {
  const m = frame(wrist, [wrist[0] + dir[0], wrist[1] + dir[1], wrist[2] + dir[2]]);
  const S = 1.42;
  const P = (x: number, y: number, z: number): V3 => { const v = new THREE.Vector3(x * S, y * S, z * S).applyMatrix4(m); return [v.x, v.y, v.z]; };
  const g: THREE.BufferGeometry[] = [];
  for (const [x, y, z] of [[0, 0.1, 0.14], [0, 0.1, -0.02], [0, 0.1, -0.18], [0.02, 0.3, 0.18], [0.02, 0.3, 0.0], [0.02, 0.3, -0.16]] as V3[]) g.push(ball(P(x, y, z), 0.13, [1, 1, 1], 7));
  const fingers: [number, number][] = [[0.2, 1.05], [0.07, 1.14], [-0.07, 1.06], [-0.19, 0.88]];
  for (const [fz, L] of fingers) {
    const k0 = P(0.02, 0.4, fz * 0.85), k1 = P(0.0, 0.4 + 0.55 * L, fz);
    const k2 = P(-0.07, 0.4 + 0.93 * L, fz * 1.05), k3 = P(-0.16, 0.4 + 1.17 * L, fz * 1.08), k4 = P(-0.26, 0.4 + 1.33 * L, fz * 1.08);
    g.push(smallBone(k0, k1, 0.1, 0.07, 0.105), smallBone(k1, k2, 0.1, 0.066, 0.095), smallBone(k2, k3, 0.09, 0.06, 0.082), smallBone(k3, k4, 0.078, 0.055, 0.06));
  }
  const t0 = P(0.0, 0.25, 0.24), t1 = P(-0.05, 0.6, 0.46), t2 = P(-0.1, 0.88, 0.56), t3 = P(-0.16, 1.08, 0.6);
  g.push(smallBone(t0, t1, 0.11, 0.08, 0.1), smallBone(t1, t2, 0.1, 0.072, 0.088), smallBone(t2, t3, 0.088, 0.064, 0.06));
  return g;
}

// --- flowers, each facing +y about its own origin, coloured per vertex

const MARIGOLD = [0xff8a00, 0xffa21a, 0xf27200, 0xffb630, 0xe86400].map((h) => new THREE.Color(h));
/** a marigold: a pom-pom of ruffled petals standing like fins out of a dome */
function marigold(r: number): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const n = 34;
  const m = new THREE.Matrix4();
  for (let i = 0; i < n; i++) {
    const f = (i + 0.5) / n, polar = Math.acos(1 - f * 1.2), az = i * 2.39996 + rnd() * 0.3;
    const er = new THREE.Vector3(Math.sin(polar) * Math.cos(az), Math.cos(polar), Math.sin(polar) * Math.sin(az));
    const ep = new THREE.Vector3(-Math.sin(az), 0, Math.cos(az));
    const et = new THREE.Vector3().crossVectors(ep, er);
    m.makeBasis(ep, er, et).setPosition(er.clone().multiplyScalar(r * 0.62));
    const g = new THREE.SphereGeometry(1, 6, 4).scale(0.08 * r, 0.38 * r, 0.26 * r).applyMatrix4(m);
    const c = MARIGOLD[Math.floor(rnd() * MARIGOLD.length)]!.clone().multiplyScalar(0.8 + 0.2 * Math.sin(polar));
    parts.push(prep(g, c));
  }
  parts.push(prep(new THREE.SphereGeometry(r * 0.6, 10, 7), 0xd85a00));
  return merge(parts);
}

/** a rose: a ribbon wound out from the bud, cupped, its top edge rolling outward in petals */
function rose(r: number, col = 0xb01020): THREE.BufferGeometry {
  const turns = 2.7, steps = 72, rows = 3;
  const pos: number[] = [];
  const at = (i: number, j: number): V3 => {
    const f = i / steps, a = f * turns * Math.PI * 2;
    const rad = r * (0.1 + 0.62 * f), petal = 1 - 0.22 * Math.abs(Math.sin(a * 1.25));
    const h0 = r * (-0.08 - 0.3 * f), h1 = r * (0.42 - 0.14 * f) * petal;
    const v = j / (rows - 1), h = h0 + (h1 - h0) * v, rr = rad * (0.82 + 0.18 * v + 0.4 * f * v * v);
    return [Math.cos(a) * rr, h, Math.sin(a) * rr];
  };
  for (let i = 0; i < steps; i++) for (let j = 0; j < rows - 1; j++) {
    const a = at(i, j), b = at(i + 1, j), c = at(i + 1, j + 1), dd = at(i, j + 1);
    pos.push(...a, ...b, ...c, ...a, ...c, ...dd);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  const base = new THREE.Color(col), deep = base.clone().multiplyScalar(0.45);
  const parts = [prep(g, (x, y, z, c) => c.copy(deep).lerp(base, clamp01(Math.hypot(x, z) / (r * 0.5)) * 0.6 + clamp01((y + 0.2 * r) / (0.6 * r)) * 0.4))];
  // the cup under it
  parts.push(prep(ball([0, -0.12 * r, 0], r * 0.42, [1, 0.6, 1], 10), deep));
  return merge(parts);
}

/** a small five-petalled flower */
function blossom(r: number, col: number, eye: number): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    parts.push(prep(new THREE.SphereGeometry(1, 7, 4).scale(r * 0.5, r * 0.12, r * 0.32).translate(r * 0.5, 0, 0).rotateY(a), col));
  }
  parts.push(prep(ball([0, 0.05 * r, 0], r * 0.22, [1, 0.7, 1], 8), eye));
  return merge(parts);
}

/** a leaf: a flattened, pointed blade along +z */
function leaf(l: number): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(1, 8, 5).scale(l * 0.22, l * 0.03, l * 0.5);
  const p = g.attributes.position!;
  for (let i = 0; i < p.count; i++) { const t = p.getZ(i) / (l * 0.5); p.setX(i, p.getX(i) * (1 - 0.55 * Math.max(0, t))); p.setY(i, p.getY(i) + 0.05 * l * t * t); }
  g.computeVertexNormals();
  return prep(g.translate(0, 0, l * 0.45), 0x2f6a2c);
}

/** an ostrich plume: a quill along `pts`, soft barbs drooping either side, pale at the root to `tip` at their ends */
function plume(pts: V3[], width: number, root: number, tip: number, n = 54): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(pts.map(V));
  const parts: THREE.BufferGeometry[] = [prep(new THREE.TubeGeometry(curve, 24, 0.035, 4, false), root)];
  const cr = new THREE.Color(root), ct = new THREE.Color(tip), down = new THREE.Vector3(0, -1, 0);
  for (let i = 0; i < n; i++) {
    const t = 0.05 + 0.95 * (i / n), p = curve.getPoint(t), tan = curve.getTangent(t);
    const side = new THREE.Vector3().crossVectors(tan, new THREE.Vector3(0, 1, 0));
    if (side.lengthSq() < 1e-4) side.set(1, 0, 0);
    side.normalize();
    const L = width * (0.3 + 0.7 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.1)), 0.6));
    for (const s of [-1, 1]) for (let row = 0; row < 2; row++) {
      const dir = side.clone().multiplyScalar(s).addScaledVector(down, 0.35 + 0.3 * row + 0.2 * t).addScaledVector(tan, 0.35).normalize();
      dir.x += (rnd() - 0.5) * 0.3; dir.y += (rnd() - 0.5) * 0.3; dir.z += (rnd() - 0.5) * 0.3; dir.normalize();
      const len = L * (0.75 + 0.35 * rnd()) * (row ? 0.8 : 1);
      const g = new THREE.ConeGeometry(0.05, len, 3, 1).translate(0, len / 2, 0);
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)).translate(p.x, p.y, p.z);
      parts.push(prep(g, (x, y, z, c) => c.copy(cr).lerp(ct, clamp01(Math.hypot(x - p.x, y - p.y, z - p.z) / len))));
    }
  }
  return merge(parts);
}

// --- the hat, in its own frame: the brim's centre at the origin, y up, +z her front

const BRIM_R = 2.7, CROWN_R = 1.1;
function hatGeometry(): THREE.BufferGeometry {
  // the crown: straight sides tapering a little, then a rounded top
  const crown: THREE.Vector2[] = [];
  for (let i = 0; i <= 6; i++) { const t = i / 6; crown.push(new THREE.Vector2(CROWN_R - 0.07 * t, 0.7 * t)); }
  for (let i = 1; i <= 8; i++) { const a = (i / 8) * Math.PI / 2; crown.push(new THREE.Vector2(Math.max(0.001, (CROWN_R - 0.07) * Math.cos(a)), 0.7 + 0.42 * Math.sin(a))); }
  const brim: THREE.Vector2[] = [];
  for (let i = 0; i <= 14; i++) { const f = i / 14, r = CROWN_R - 0.02 + f * (BRIM_R - CROWN_R); brim.push(new THREE.Vector2(r, -0.06 * Math.sin(Math.PI * f) + 0.26 * f ** 4)); }
  const g = merge([prep(new THREE.LatheGeometry(crown, 48), 0x18121c), prep(new THREE.LatheGeometry(brim, 64), 0x18121c),
    // a rolled edge round the brim
    prep(new THREE.TorusGeometry(BRIM_R, 0.06, 6, 96).rotateX(Math.PI / 2).translate(0, 0.26, 0), 0x241a2a)]);
  // the brim undulates a little round its edge
  const p = g.attributes.position!;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), r = Math.hypot(x, z);
    if (r > CROWN_R) { const f = (r - CROWN_R) / (BRIM_R - CROWN_R); p.setY(i, p.getY(i) + 0.1 * f * f * Math.sin(3 * Math.atan2(x, z) + 0.6)); }
  }
  g.computeVertexNormals();
  return g;
}

/** where a thing on the hat goes: `deg` round from the front toward her left, `r` out, `y` up; facing out and up */
function onHat(g: THREE.BufferGeometry, deg: number, r: number, y: number, out = 0.75, spin = 0): THREE.BufferGeometry {
  const a = (deg * Math.PI) / 180, radial = new THREE.Vector3(Math.sin(a), 0, Math.cos(a));
  const dir = radial.clone().multiplyScalar(out).add(new THREE.Vector3(0, 1, 0)).normalize();
  g.rotateY(spin);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir));
  return g.translate(radial.x * r, y, radial.z * r);
}

function hatFlowers(): THREE.BufferGeometry {
  const g: THREE.BufferGeometry[] = [];
  // a heap up the crown on her left front and over its top, a few over the brim's edge, a smaller heap behind on her
  // right. Most cameras see the hat from below: what lies on the brim near the crown hides behind it
  const M: [number, number, number, number, number][] = [[35, 1.32, 0.62, 0.62, 1.6], [72, 1.26, 0.82, 0.58, 1.6], [104, 1.3, 0.52, 0.5, 1.8],
    [6, 1.36, 0.5, 0.46, 1.8], [50, 0.9, 1.18, 0.52, 0.8], [-150, 1.3, 0.55, 0.5, 1.6], [-118, 1.36, 0.45, 0.4, 1.8], [56, 2.3, 0.3, 0.46, 1.2]];
  for (const [deg, r, y, s, out] of M) g.push(onHat(marigold(s), deg, r, y, out));
  const R: [number, number, number, number, number][] = [[18, 1.25, 0.98, 0.42, 1.2], [92, 1.05, 1.12, 0.42, 1.0], [54, 1.62, 0.36, 0.46, 1.6],
    [-14, 1.38, 0.78, 0.36, 1.5], [128, 1.42, 0.45, 0.4, 1.8], [-172, 1.38, 0.62, 0.44, 1.6], [28, 2.28, 0.26, 0.38, 1.2], [-36, 1.0, 1.1, 0.34, 0.8]];
  for (const [deg, r, y, s, out] of R) g.push(onHat(rose(s), deg, r, y, out, rnd() * 6));
  const B: [number, number, number, number, number][] = [[-28, 1.3, 0.45, 0.26, 0xe0287a], [116, 1.18, 0.95, 0.26, 0xf4ecfa], [78, 1.62, 0.36, 0.26, 0xe0287a],
    [-138, 1.22, 0.9, 0.26, 0x9a3ac8], [0, 1.1, 1.06, 0.24, 0xf4ecfa], [40, 2.4, 0.2, 0.22, 0xe0287a], [150, 1.35, 0.5, 0.24, 0x9a3ac8]];
  for (const [deg, r, y, s, c] of B) g.push(onHat(blossom(s, c, 0xffd23a), deg, r, y, 1.4));
  for (const [deg, r, y, l, tilt] of [[30, 2.2, 0.25, 1.0, 0.2], [90, 2.0, 0.35, 0.95, -0.3], [125, 2.0, 0.3, 0.85, 0.4], [-160, 2.0, 0.3, 0.85, 0.2],
    [-5, 2.0, 0.3, 0.8, -0.4], [60, 2.5, 0.2, 0.8, -0.3]] as [number, number, number, number, number][]) {
    const a = (deg * Math.PI) / 180;
    g.push(leaf(l).rotateX(-0.35).rotateY(a + tilt).translate(Math.sin(a) * r * 0.62, y, Math.cos(a) * r * 0.62));
  }
  return merge(g);
}

function hatPlumes(): THREE.BufferGeometry {
  return merge([
    // a big white plume up from the flowers and arching back over the crown
    plume([[1.0, 0.6, -0.35], [1.25, 1.7, -0.45], [0.95, 2.55, -1.05], [0.35, 2.75, -1.9], [-0.05, 2.35, -2.55]], 0.7, 0xfaf6f2, 0xf0d8ec, 60),
    // a magenta one out to her left
    plume([[1.25, 0.5, 0.05], [1.85, 1.45, -0.15], [2.45, 1.95, -0.7], [2.85, 1.7, -1.35]], 0.5, 0xd02880, 0x8a1a8a, 44),
  ]);
}

// ---------------------------------------------------------------------------------------------------------------------
// dressing

/** the skull's front at (x, y): its surface z, by bisection on the field */
function skullFrontZ(x: number, y: number): number {
  let lo = 0, hi = 2;
  for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (skullD(x, y, m) < 0) lo = m; else hi = m; }
  return lo;
}

/** how far from `o` (inside the torso) along `dir` its surface is, by bisection */
function torsoExit(o: V3, dir: V3): number {
  let lo = 0, hi = 2.0;
  for (let i = 0; i < 26; i++) { const m = (lo + hi) / 2; if (torsoD(o[0] + dir[0] * m, o[1] + dir[1] * m, o[2] + dir[2] * m) < 0) lo = m; else hi = m; }
  return lo;
}

/** the hat's place on the head and its tilt: cocked down to her right, the front lifted off the face */
const HAT_AT: V3 = [0.05, 18.15, -0.05];
const HAT_TILT = new THREE.Euler(-0.14, 0.15, 0.1);

function dress(d: Dresser): void {
  seed = 11;
  // --- the gown: the skinned body's material swapped for the cloth shader, with each vertex's part; the skirt's front
  // re-weighted onto the thighs (build.ts adds the root bone to the skinned body before dressing)
  const body = d.bones.get('pelvis')!.parent as THREE.SkinnedMesh | null;
  if (body?.isSkinnedMesh) {
    const geo = body.geometry, pos = geo.attributes.position!, col = geo.attributes.color!;
    const si = geo.attributes.skinIndex!, sw = geo.attributes.skinWeight!;
    const P = SEG_INDEX('pelvis'), TL = SEG_INDEX('thighL'), TR = SEG_INDEX('thighR'), AL = SEG_INDEX('armL'), AR = SEG_INDEX('armR');
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), ax = Math.abs(x);
      const cs = col.getX(i) + col.getY(i) + col.getZ(i) || 1, torso = col.getX(i) / cs, skirt = col.getY(i) / cs;
      if (skirt > 0.5 && y < 10.5) {
        // the front, from the hips down, follows the knees a little; least at the back and toward the hem
        const zc = skirtZ(y), front = sstep(-0.3, 0.9, (z - zc) / Math.max(0.5, Math.hypot(x, z - zc)));
        const kk = 0.42 * front * sstep(10.4, 6.8, y) * (1 - 0.55 * sstep(5.5, 1.0, y));
        const wl = sstep(-0.9, 0.9, x);
        si.setXYZW(i, P, TL, TR, 0);
        sw.setXYZW(i, 1 - kk, kk * wl, kk * (1 - wl), 0);
      } else if (torso > 0.5 && y > 13.8 && ax > 1.25) {
        // the bare shoulder goes over to the arm on a ramp out from the neck, all of it past the joint's inner side
        const wa = sstep(1.25, 2.3, ax) * sstep(13.8, 14.35, y);
        if (wa > 0) {
          si.setZ(i, x > 0 ? AL : AR);
          sw.setXYZW(i, sw.getX(i) * (1 - wa), sw.getY(i) * (1 - wa), wa, 0);
        }
      }
    }
    si.needsUpdate = true; sw.needsUpdate = true;
    (body.material as THREE.Material).dispose();
    body.material = clothMaterial();
  }

  const one = (geo: THREE.BufferGeometry, bone: string, mat: THREE.Material, name: string) => {
    const m = new THREE.Mesh(geo, mat);
    m.name = name;
    d.at(m, bone, 0, 0, 0);
    return m;
  };
  const both = (geo: THREE.BufferGeometry, bone: string, mat: THREE.Material, name: string) => {
    for (const side of ['L', 'R'] as const) {
      const m = new THREE.Mesh(geo, mat);
      m.name = `${name}${side}`;
      if (side === 'R') m.scale.x = -1;
      d.at(m, bone + side, 0, 0, 0);
    }
  };

  // --- the head: the skull and the jaw from one grid (their seam closes exactly), painted alike
  // the head: the skull and the jaw, each on its own grid at about the same spacing (the seam lies under the painted
  // stitches, which hide the half-cell they may disagree by)
  const face = faceMaterial(d);
  one(isoGeometry(upperSkull, { min: [-1.12, 15.8, -1.42], max: [1.12, 18.6, 1.4] }, 54, skullColor, 50000), 'head', face, 'catrina-skull');
  one(isoGeometry(lowerSkull, { min: [-0.92, 15.38, -0.12], max: [0.92, 16.3, 1.38] }, 34, skullColor, 16000), 'jaw', face, 'catrina-jaw');
  // teeth, hidden in the other half while the mouth is shut: the upper row hangs from the skull, the lower stands on the jaw
  const ivory = d.std({ color: 0xf6f0e2, roughness: 0.35 });
  const teeth = (upper: boolean): THREE.BufferGeometry => {
    const out: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 10; i++) {
      const x = -0.45 + (i / 9) * 0.9, u = faceU(x, 1.0), y = mouthY(u) + (upper ? -0.07 : 0.07);
      const z = skullFrontZ(x, mouthY(u) + (upper ? 0.04 : -0.04)) - 0.1;
      out.push(new THREE.CapsuleGeometry(0.055, 0.08, 2, 6).scale(1, 1, 0.7).rotateY(Math.atan2(x, 0.8)).translate(x, y, z));
    }
    return merge(out.map((g) => prep(g, 0xf6f0e2)));
  };
  one(teeth(true), 'head', ivory, 'catrina-teeth');
  one(teeth(false), 'jaw', ivory, 'catrina-lowerteeth');
  one(ball([0, 16.02, 0.5], 1, [0.56, 0.3, 0.5], 14), 'head', d.std({ color: 0x14040a, roughness: 0.8 }), 'catrina-mouth');

  // gold drops at her ears
  const gold = d.std({ color: 0xe0b040, roughness: 0.25, metalness: 0.85 });
  const drops: THREE.BufferGeometry[] = [];
  for (const sx of [1, -1]) drops.push(prep(ball([sx * 0.93, 16.5, -0.18], 0.07, [1, 1, 1], 8), 0xffffff),
    prep(new THREE.TorusGeometry(0.1, 0.025, 6, 16).rotateY(Math.PI / 2).translate(sx * 0.95, 16.33, -0.18), 0xffffff),
    prep(ball([sx * 0.95, 16.1, -0.18], 0.1, [0.8, 1.4, 0.8], 10), 0xffffff));
  one(merge(drops), 'head', gold, 'catrina-earrings');

  // --- the hat: felt, a purple band, flowers, plumes
  const hat = new THREE.Group();
  hat.name = 'catrina-hat';
  hat.add(new THREE.Mesh(hatGeometry(), d.std({ vertexColors: true, roughness: 0.7, metalness: 0.05, side: THREE.DoubleSide })));
  hat.add(new THREE.Mesh(new THREE.CylinderGeometry(CROWN_R + 0.02, CROWN_R + 0.03, 0.36, 48, 1, true).translate(0, 0.2, 0), d.std({ color: 0x6a2a90, roughness: 0.35, metalness: 0.1, side: THREE.DoubleSide })));
  const petals = d.std({ vertexColors: true, roughness: 0.6, side: THREE.DoubleSide });
  hat.add(new THREE.Mesh(hatFlowers(), petals));
  const plumes = new THREE.Mesh(hatPlumes(), d.std({ vertexColors: true, roughness: 0.85, side: THREE.DoubleSide }));
  plumes.name = 'catrina-plumes';
  hat.add(plumes);
  hat.rotation.copy(HAT_TILT);
  d.at(hat, 'head', HAT_AT[0], HAT_AT[1], HAT_AT[2]);

  // --- the bony hands, out of the cuffs
  const bone = d.std({ color: 0xf2ece0, roughness: 0.45, emissive: 0x2a2620, emissiveIntensity: 1 });
  const dir: V3 = [WR[0] - EL[0], WR[1] - EL[1], WR[2] - EL[2]];
  both(merge(hand([WR[0] - FA[0] * 0.35, WR[1] - FA[1] * 0.35, WR[2] - FA[2] * 0.35], dir).map((g) => prep(g, 0xffffff))), 'forearm', bone, 'catrina-hand');

  // --- a black velvet choker with a marigold at the throat
  const neckY = 15.35;
  one(new THREE.TorusGeometry(0.43, 0.075, 8, 32).rotateX(Math.PI / 2).scale(1, 1.6, 1).translate(0, neckY, 0.02), 'neck', d.std({ color: 0x120c14, roughness: 0.8 }), 'catrina-choker');
  const neckFlower = marigold(0.17);
  neckFlower.rotateX(Math.PI / 2).translate(0, neckY - 0.05, 0.5);
  one(neckFlower, 'neck', petals, 'catrina-neckflower');

  // --- two strands of pearls round the neck, lying on the collarbones and the chest
  const pearls: THREE.BufferGeometry[] = [];
  for (const [drop, r, n] of [[0.45, 0.075, 30], [0.85, 0.065, 42]] as [number, number, number][]) {
    for (let i = 0; i < n; i++) {
      // from a guide inside the neck's base, out along a ray that is level in front (onto the chest) and turns upward
      // round the sides and the back (onto the collarbones and the shoulders' tops), so the strand lies on the body
      const th = -Math.PI + ((i + 0.5) / n) * Math.PI * 2, f = (1 + Math.cos(th)) / 2;
      const o: V3 = [0.42 * Math.sin(th), 15.12 - drop * f * f, 0.02 + 0.42 * Math.cos(th)];
      const dir = nrm([Math.sin(th) * (0.25 + f), 1.2 * (1 - f) * (1 - f), Math.cos(th) * (0.25 + f)]);
      const t = torsoExit(o, dir) + r * 0.85;
      pearls.push(prep(new THREE.SphereGeometry(r, 6, 4).translate(o[0] + dir[0] * t, o[1] + dir[1] * t, o[2] + dir[2] * t), 0xffffff));
    }
  }
  one(merge(pearls), 'spine2', d.std({ color: 0xf6efe6, roughness: 0.18, metalness: 0.1, emissive: 0x302c28, emissiveIntensity: 1 }), 'catrina-pearls');

  // --- a corsage on the sash at her left hip: a marigold, a rose, two leaves
  const cors = merge([
    marigold(0.3).rotateX(1.3).rotateY(0.5).translate(0.95, SASH + 0.05, 1.05),
    rose(0.26).rotateX(1.2).rotateY(0.9).translate(1.3, SASH - 0.15, 0.62),
    leaf(0.6).rotateY(1.2).translate(1.2, SASH - 0.3, 0.9), leaf(0.55).rotateY(-0.2).rotateZ(-0.6).translate(0.75, SASH - 0.25, 1.05),
  ]);
  one(cors, 'pelvis', petals, 'catrina-corsage');

  // --- a bow on the sash at her back: two loops, a knot, two tails falling over the first tier
  const zb = -1.1;
  const bow: THREE.BufferGeometry[] = [ball([0, SASH, zb - 0.06], 1, [0.2, 0.22, 0.14], 10)];
  for (const sx of [1, -1]) {
    bow.push(new THREE.TorusGeometry(0.36, 0.11, 8, 20).scale(1, 0.62, 0.45).rotateZ(sx * 0.18).translate(sx * 0.4, SASH + 0.04, zb));
    const tail = new THREE.CapsuleGeometry(0.12, 1.3, 3, 8).scale(1.6, 1, 0.4);
    tail.rotateZ(sx * 0.2).rotateX(-0.12).translate(sx * 0.28, SASH - 0.78, zb - 0.12);
    bow.push(tail);
  }
  one(merge(bow.map((g) => prep(g, 0xffffff))), 'pelvis', d.std({ color: 0x6a2a90, roughness: 0.35, metalness: 0.1 }), 'catrina-bow');
}

const SWAY = new WeakMap<THREE.Object3D, THREE.Object3D | null>();

export const CATRINA: CharacterDef = {
  id: 'catrina', name: 'Catrina', blurb: 'A sugar-skull lady in a flowered hat',
  segs: CATRINA_SEGMENTS,
  body: {
    sdf: catrinaSDF, region: catrinaRegion, box: BOX,
    // the parts' weights as colours (see partTint): torso, skirt, sleeve
    palette: [0xff0000, 0x00ff00, 0x0000ff], tint: partTint,
    surface: 'soft', weights: 'sharp', capture,
  },
  dress,
  // the gown's skirt and the hat run wider than the wearer; the sleeves stretch toward the wearer's arms
  fit: { size: 1.06, limb: 0.6 },
  // googly eyes over the painted sockets, at the plane of their rims (the pits' floors are ~0.2 further in)
  face: { jaw: 0.35, eyes: [[SOCKET[0], SOCKET[1], SOCKET[2] - 0.04, 0.3], [-SOCKET[0], SOCKET[1], SOCKET[2] - 0.04, 0.3]] },
  res: 80,
  tick(root, t) {
    // the plumes stir a little
    let p = SWAY.get(root);
    if (p === undefined) { p = root.getObjectByName('catrina-plumes') ?? null; SWAY.set(root, p); }
    if (p) { p.rotation.x = 0.03 * Math.sin(t * 1.3); p.rotation.z = 0.025 * Math.sin(t * 0.9 + 1.0); }
  },
};
