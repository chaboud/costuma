// Bastion: a fighting machine (founder, 2026-10-04: "I'd love to take a Jaeger out for a spin"; 2026-10-06: "the robot
// could be more Transformers shaped"), now an armoured truck that stands up (mechSDF below). An original design, not
// anyone's. Built as a body plan on the rig's bone names (as raccoon.ts is), so build.ts
// skins it and pose.ts poses it: the theropod's arms are its arms, held up like a boxer's; its tail bones carry nothing.
// Authored in metres for a 20 m mech on y = 0, x right, y up, +z forward — the same frame as sdf.ts. Its plates are
// rigid: each vertex follows one bone (build.ts), so armour does not stretch at the joints.
import { sdCapsule, sdSphere, smin, type Seg } from './sdf';

export const MECH_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 9.2, 0], b: [0, 10.4, 0], parent: null },
  { name: 'spine1', a: [0, 10.4, 0], b: [0, 12.4, 0.1], parent: 'pelvis' },
  { name: 'spine2', a: [0, 12.4, 0.1], b: [0, 15.4, 0.2], parent: 'spine1' },
  { name: 'neck', a: [0, 15.4, 0.2], b: [0, 16.2, 0.3], parent: 'spine2', reach: 0.9 },
  { name: 'head', a: [0, 16.2, 0.3], b: [0, 18.4, 0.6], parent: 'neck' },
  // no jaw and no tail: the bones exist for the poses, nothing hangs on them
  { name: 'jaw', a: [0, 16.4, 1.2], b: [0, 16.4, 1.6], parent: 'head', reach: 0 },
  { name: 'tail1', a: [0, 9.2, -0.5], b: [0, 9.0, -1.0], parent: 'pelvis', reach: 0 },
  { name: 'tail2', a: [0, 9.0, -1.0], b: [0, 8.8, -1.5], parent: 'tail1', reach: 0 },
  { name: 'tail3', a: [0, 8.8, -1.5], b: [0, 8.6, -2.0], parent: 'tail2', reach: 0 },
  { name: 'tail4', a: [0, 8.6, -2.0], b: [0, 8.4, -2.5], parent: 'tail3', reach: 0 },
  { name: 'thighL', a: [2.1, 9.2, 0], b: [2.3, 5.2, 0.3], parent: 'pelvis' },
  { name: 'shinL', a: [2.3, 5.2, 0.3], b: [2.3, 1.2, -0.1], parent: 'thighL' },
  { name: 'footL', a: [2.3, 1.2, -0.1], b: [2.3, 0.4, 1.8], parent: 'shinL' },
  { name: 'thighR', a: [-2.1, 9.2, 0], b: [-2.3, 5.2, 0.3], parent: 'pelvis' },
  { name: 'shinR', a: [-2.3, 5.2, 0.3], b: [-2.3, 1.2, -0.1], parent: 'thighR' },
  { name: 'footR', a: [-2.3, 1.2, -0.1], b: [-2.3, 0.4, 1.8], parent: 'shinR' },
  { name: 'armL', a: [4.1, 14.7, 0.2], b: [4.5, 11.6, 0.4], parent: 'spine2' },
  { name: 'forearmL', a: [4.5, 11.6, 0.4], b: [4.5, 8.4, 1.0], parent: 'armL' },
  { name: 'armR', a: [-4.1, 14.7, 0.2], b: [-4.5, 11.6, 0.4], parent: 'spine2' },
  { name: 'forearmR', a: [-4.5, 11.6, 0.4], b: [-4.5, 8.4, 1.0], parent: 'armR' },
];

export const MECH_BOX = { min: [-6.4, -0.4, -4.4] as [number, number, number], max: [6.4, 19.8, 4.0] as [number, number, number] };

/** a box with rounded edges: centre, half sizes, edge radius */
function sdBox(px: number, py: number, pz: number, cx: number, cy: number, cz: number, hx: number, hy: number, hz: number, r: number): number {
  const qx = Math.abs(px - cx) - hx + r, qy = Math.abs(py - cy) - hy + r, qz = Math.abs(pz - cz) - hz + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r;
}

/** a cylinder along x: centre, half length, radius, edge round (a wheel) */
function sdWheel(px: number, py: number, pz: number, cx: number, cy: number, cz: number, h: number, r: number, k: number): number {
  const dx = Math.abs(px - cx) - h + k, dr = Math.hypot(py - cy, pz - cz) - r + k;
  return Math.hypot(Math.max(dx, 0), Math.max(dr, 0)) + Math.min(Math.max(dx, dr), 0) - k;
}

/** a point in a panel's frame, the panel turned about its hinge: yaw about up, then roll about forward */
function panelLocal(px: number, py: number, pz: number, hx: number, hy: number, hz: number, yaw: number, roll: number): [number, number, number] {
  let x = px - hx, y = py - hy, z = pz - hz;
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  [x, z] = [x * cy - z * sy, x * sy + z * cy];
  const cr = Math.cos(roll), sr = Math.sin(roll);
  [x, y] = [x * cr + y * sr, -x * sr + y * cr];
  return [x, y, z];
}
/** a door standing up behind the shoulder: hinged at the back's top corner, out and up, swept back */
const DOOR = { hx: 1.5, hy: 14.6, hz: -2.15, yaw: 0.4, roll: 0.62, w: 1.1, h: 0.85, t: 0.12 };
function sdDoor(ax: number, y: number, z: number): number {
  const [x, ly, lz] = panelLocal(ax, y, z, DOOR.hx, DOOR.hy, DOOR.hz, DOOR.yaw, DOOR.roll);
  return sdBox(x, ly, lz, DOOR.w, DOOR.h, 0, DOOR.w, DOOR.h, DOOR.t, 0.1);
}

/**
 * Bastion as a vehicle that stands up (founder, 2026-10-06: "the robot could be more Transformers shaped"): an armoured
 * truck folded into a figure. Its cab is the chest — a windscreen raked back across it, split by a pillar, headlights at
 * its corners, a bumper across its foot; the hood runs down the belly into a narrow waist; the doors stand up behind the
 * shoulders like wings; the front wheels ride the shoulders and the rear ones the calves; big lower legs and feet; a
 * helmeted head with a faceplate, two eyes and fins for ears. Its own design: no show's robot or truck.
 */
export function mechSDF(x: number, y: number, z: number, bulk = 0): number {
  const ax = Math.abs(x);
  let d = 1e9;
  // the cab: a broad chest, its front raked back above the headlights where the windscreen is
  { const cab = sdBox(x, y, z, 0, 13.75, 0.25, 2.9, 1.75, 1.75, 0.3);
    const rake = (z - (2.0 - Math.max(0, y - 13.4) * 0.6)) * 0.86;
    d = Math.max(cab, rake); }
  d = smin(d, sdBox(x, y, z, 0, 12.2, 0.3, 2.3, 0.6, 1.5, 0.3), 0.3); // the cab's floor, narrowing
  d = Math.min(d, sdBox(x, y, z, 0, 12.55, 1.95, 2.5, 0.22, 0.28, 0.1)); // the bumper
  d = Math.min(d, sdBox(ax, y, z, 2.2, 13.1, 1.92, 0.42, 0.26, 0.15, 0.08)); // the headlights' housings
  // the hood down the belly to a narrow waist, the waist's workings, a pelvis block
  d = Math.min(d, sdBox(x, y, z, 0, 11.1, 0.75, 1.15, 0.9, 0.55, 0.25));
  d = smin(d, sdBox(x, y, z, 0, 11.0, 0, 1.2, 1.0, 1.05, 0.3), 0.2);
  d = smin(d, sdBox(x, y, z, 0, 9.75, 0, 2.2, 0.75, 1.4, 0.3), 0.25);
  d = Math.min(d, sdBox(x, y, z, 0, 9.45, 1.35, 0.7, 0.7, 0.25, 0.15));
  // the truck's back as a backpack, the doors standing up from it like wings
  d = Math.min(d, sdBox(x, y, z, 0, 13.5, -1.85, 2.2, 1.6, 0.55, 0.25));
  d = Math.min(d, sdDoor(ax, y, z));
  // the head: a helmet with a crest and two fins, a faceplate below the eyes
  d = Math.min(d, sdCapsule(x, y, z, 0, 15.3, 0.25, 0, 16.3, 0.35, 0.6, 0.55));
  d = Math.min(d, sdBox(x, y, z, 0, 17.25, 0.45, 0.82, 0.92, 0.9, 0.35));
  d = Math.min(d, sdBox(x, y, z, 0, 16.55, 0.95, 0.55, 0.38, 0.42, 0.18)); // the faceplate
  d = Math.min(d, sdBox(x, y, z, 0, 18.2, 0.35, 0.12, 0.35, 0.75, 0.08)); // the crest
  d = Math.min(d, sdBox(ax, y, z, 0.95, 17.55, 0.25, 0.12, 0.62, 0.3, 0.08)); // the fins
  // the shoulders: the front wheel arches, a wheel on the outside of each
  d = Math.min(d, sdBox(ax, y, z, 4.05, 15.05, 0.2, 1.15, 0.8, 1.35, 0.3));
  d = Math.min(d, sdWheel(ax, y, z, 5.4, 14.7, 0.2, 0.32, 0.92, 0.12));
  // the arms: lean upper arms on visible joints, heavy forearms, fists
  d = Math.min(d, sdSphere(ax, y, z, 4.1, 14.4, 0.2, 0.75));
  d = Math.min(d, sdCapsule(ax, y, z, 4.1, 14.2, 0.2, 4.5, 11.8, 0.4, 0.62, 0.58));
  d = Math.min(d, sdSphere(ax, y, z, 4.5, 11.6, 0.4, 0.72));
  d = Math.min(d, sdBox(ax, y, z, 4.55, 10.0, 0.6, 0.9, 1.5, 1.0, 0.3));
  d = Math.min(d, sdBox(ax, y, z, 4.55, 8.05, 1.0, 0.75, 0.75, 0.8, 0.28));
  // the legs: a thigh, a knee guard, a big lower leg with the rear wheel on its outside, a long foot
  d = Math.min(d, sdCapsule(ax, y, z, 2.1, 9.1, 0, 2.3, 5.6, 0.25, 1.05, 0.95));
  d = Math.min(d, sdBox(ax, y, z, 2.3, 5.25, 0.85, 0.85, 0.75, 0.55, 0.25));
  d = Math.min(d, sdBox(ax, y, z, 2.3, 3.0, 0.05, 1.25, 2.15, 1.35, 0.35));
  d = Math.min(d, sdWheel(ax, y, z, 3.75, 2.6, -0.35, 0.3, 0.9, 0.12));
  d = Math.min(d, sdBox(ax, y, z, 2.3, 0.5, 0.65, 1.15, 0.5, 2.0, 0.2));
  return d - bulk;
}

/**
 * Regions: 0 the body's paint, 1 trim (bumper, wheel arches, knee guards, toe caps, crest, hubs), 2 glow (eyes,
 * headlights), 3 dark (joints, the waist's workings), 4 glass (the windscreen), 5 tyres, 6 the faceplate's silver.
 */
export function mechRegion(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  // the wheels: a tyre round a hub
  if (ax > 5.0 && Math.hypot(y - 14.7, z - 0.2) < 1.0) return Math.hypot(y - 14.7, z - 0.2) < 0.42 ? 1 : 5;
  if (ax > 3.38 && Math.hypot(y - 2.6, z + 0.35) < 0.98) return Math.hypot(y - 2.6, z + 0.35) < 0.4 ? 1 : 5;
  if (y > 16.95 && y < 17.3 && z > 1.2 && ax > 0.12 && ax < 0.62) return 2; // the eyes
  if (y > 12.85 && y < 13.35 && z > 1.95 && ax > 1.85 && ax < 2.6) return 2; // the headlights
  // the windscreen: the raked face of the cab, split by a pillar down the middle
  if (y > 13.55 && y < 15.35 && ax < 2.55 && ax > 0.18 && z > 1.75 - Math.max(0, y - 13.4) * 0.6) return 4;
  if (y > 16.15 && y < 16.95 && z > 1.25 && ax < 0.6) return 6; // the faceplate
  // the doors: a window in the upper half, the rest the body's paint
  if (z < -1.9 && y > 13.8) {
    const [lx, ly, lz] = panelLocal(ax, y, z, DOOR.hx, DOOR.hy, DOOR.hz, DOOR.yaw, DOOR.roll);
    if (Math.abs(lz) < 0.3 && lx > 0.25 && lx < 1.75 && ly > 0.85 && ly < 1.5) return 4;
  }
  if (y > 12.3 && y < 12.8 && z > 1.65) return 1; // the bumper
  if (y > 14.25 && y < 15.9 && ax > 2.9 && ax < 5.15) return 1; // the wheel arches
  if (y > 4.5 && y < 6.0 && z > 0.4 && ax > 1.4 && ax < 3.2) return 1; // the knees
  if (y < 1.1 && z > 1.6) return 1; // the toe caps
  if (y > 17.9 && ax < 0.2) return 1; // the crest
  // joints: shoulders, elbows, neck, the waist's workings
  if (Math.hypot(ax - 4.1, y - 14.4, z - 0.2) < 0.85 && y < 14.25) return 3;
  if (Math.hypot(ax - 4.5, y - 11.6, z - 0.4) < 0.8) return 3;
  if (y > 15.2 && y < 16.2 && ax < 0.7) return 3;
  if (y > 10.2 && y < 11.6 && z < 1.25 && ax < 1.25) return 3;
  return 0;
}
