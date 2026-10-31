// Two more piloted machines on the mech's skeleton (mech.ts MECH_SEGMENTS; build.ts skins them rigid, a bone a vertex).
// Founder, 2026-10-06: "a voltron style (fusion of robots), a macross/robotech style". Original designs, no show's robot:
// - **Unison**: five machines locked into one. A jet is the torso (its canopy on the chest, its tail fins folded up
//   behind the shoulders), a tank is each arm (the turret on the shoulder, its gun forward, treads down the forearm), a
//   truck is each leg (the cab at the knee, wheels on the calf). Each machine keeps its own colour and the seams between
//   them stay dark, so the fusion reads from a block away. It carries a broadsword (build.ts, a mesh on the right
//   forearm) for its blade.
// - **Kestrel**: a jet that stands up. Slim, its legs are the engines (nozzles at the heels), its swept wings fold behind
//   its back with two tail fins above them, intakes on its shoulders carry missile pods; a canopy on the chest, a sleek
//   head with two blade antennae. In a bombing run it folds back into flight (pose.ts).
// Metres for a 20 m machine, the sdf.ts frame (y up, +z forward); the joints are the mech's.
import { sdCapsule, sdEllipsoid, sdSphere, smin } from './sdf';

/** a box with rounded edges: centre, half sizes, edge radius */
function sdBox(px: number, py: number, pz: number, cx: number, cy: number, cz: number, hx: number, hy: number, hz: number, r: number): number {
  const qx = Math.abs(px - cx) - hx + r, qy = Math.abs(py - cy) - hy + r, qz = Math.abs(pz - cz) - hz + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r;
}

export const UNISON_BOX = { min: [-6.8, -0.4, -4.6] as [number, number, number], max: [6.8, 20.2, 5.0] as [number, number, number] };

export function unisonSDF(x: number, y: number, z: number, bulk = 0): number {
  const ax = Math.abs(x);
  let d = 1e9;
  // the jet: a broad chest block, the canopy proud on its upper front, its nose down the sternum
  d = Math.min(d, sdBox(x, y, z, 0, 13.6, 0.2, 3.1, 2.1, 2.0, 0.5));
  d = Math.min(d, sdEllipsoid(x, y, z, 0, 14.3, 2.15, 1.05, 0.7, 0.75));
  d = Math.min(d, sdBox(x, y, z, 0, 12.4, 2.0, 0.9, 1.0, 0.4, 0.3));
  // its tail fins folded up behind the shoulders
  d = Math.min(d, sdBox(ax, y, z, 1.7, 15.6, -2.3, 0.18, 2.4, 1.1, 0.12));
  d = Math.min(d, sdBox(x, y, z, 0, 13.0, -2.3, 2.2, 1.6, 0.6, 0.3));
  // waist and pelvis: the joint between the machines
  d = smin(d, sdBox(x, y, z, 0, 11.2, 0.1, 1.9, 1.1, 1.35, 0.35), 0.3);
  d = smin(d, sdBox(x, y, z, 0, 9.7, 0, 2.5, 0.95, 1.55, 0.3), 0.3);
  d = Math.min(d, sdBox(x, y, z, 0, 9.4, 1.4, 0.8, 0.9, 0.35, 0.2)); // the crotch plate
  // the head: a helmet, a faceplate, a tall centre fin and two short side horns
  d = Math.min(d, sdCapsule(x, y, z, 0, 15.3, 0.2, 0, 16.4, 0.3, 0.75, 0.7));
  d = Math.min(d, sdBox(x, y, z, 0, 17.2, 0.4, 1.0, 1.0, 1.1, 0.4));
  d = Math.min(d, sdBox(x, y, z, 0, 16.6, 1.25, 0.65, 0.45, 0.35, 0.15));
  d = Math.min(d, sdBox(x, y, z, 0, 18.6, 0.3, 0.13, 0.75, 0.9, 0.08));
  d = Math.min(d, sdCapsule(ax, y, z, 0.95, 17.7, 0.4, 1.5, 18.5, 0.2, 0.2, 0.08));
  // the tanks: the turret on the shoulder with its gun forward, the hull down the arm, treads on its outer face
  d = Math.min(d, sdBox(ax, y, z, 4.2, 15.4, 0.1, 1.55, 0.85, 1.7, 0.35));
  d = Math.min(d, sdCapsule(ax, y, z, 4.2, 15.5, 1.6, 4.2, 15.5, 3.9, 0.3, 0.26));
  d = Math.min(d, sdSphere(ax, y, z, 4.1, 14.4, 0.2, 1.0));
  d = Math.min(d, sdCapsule(ax, y, z, 4.1, 14.2, 0.2, 4.5, 11.8, 0.4, 0.85, 0.8));
  d = Math.min(d, sdSphere(ax, y, z, 4.5, 11.6, 0.4, 0.9));
  // the hull and fist sit a little outboard of the arm's bones: at the bones they met the thigh, the marching cubes joined
  // the two into one surface, and a stomp tore it (a gap of half a metre keeps them apart)
  d = Math.min(d, sdBox(ax, y, z, 4.8, 10.0, 0.6, 1.0, 1.7, 1.3, 0.3));
  d = Math.min(d, sdBox(ax, y, z, 5.85, 10.0, 0.6, 0.22, 1.8, 1.35, 0.18));
  d = Math.min(d, sdBox(ax, y, z, 4.75, 7.9, 1.0, 0.85, 0.85, 0.95, 0.3)); // the fist
  // the trucks: a thigh, the cab at the knee with its windscreen forward, the bed down the shin, wheels on the calf
  d = Math.min(d, sdCapsule(ax, y, z, 2.1, 9.1, 0, 2.3, 5.8, 0.25, 1.15, 1.1));
  d = Math.min(d, sdBox(ax, y, z, 2.3, 5.4, 0.6, 1.15, 1.05, 1.0, 0.3));
  d = Math.min(d, sdBox(ax, y, z, 2.3, 3.0, 0.0, 1.2, 2.0, 1.25, 0.3));
  for (const wy of [3.8, 1.9]) d = Math.min(d, sdCapsule(ax, y, z, 3.35, wy, -0.4, 3.75, wy, -0.4, 0.75, 0.75));
  d = Math.min(d, sdBox(ax, y, z, 2.3, 0.55, 0.65, 1.15, 0.55, 2.0, 0.2)); // the boot
  return d - bulk;
}

/**
 * Regions: 0 the jet's white, 1 its navy (waist, pelvis, fins, helmet), 2 glow (canopy, eyes), 3 dark (joints, treads,
 * wheels, windscreens, the guns), 4 the left tank's orange, 5 the right tank's teal, 6 the left truck's yellow, 7 the
 * right truck's red.
 */
export function unisonRegion(x: number, y: number, z: number): number {
  const ax = Math.abs(x), left = x > 0;
  if (y > 13.7 && y < 15.0 && z > 1.6 && ax < 1.1) return 2; // the canopy
  if (y > 16.5 && y < 17.0 && z > 1.4 && ax < 0.5 && ax > 0.12) return 2; // the eyes
  // dark: the guns, treads, wheels, windscreens, the joints between machines
  if (ax > 3.9 && ax < 4.5 && y > 15.1 && y < 15.9 && z > 1.7) return 3;
  if (ax > 5.55 && y > 8.2 && y < 11.8) return 3;
  if (ax > 3.1 && y < 4.6 && y > 1.1 && z < 0.4) return 3;
  if (y > 5.5 && y < 6.3 && z > 1.4 && ax > 1.3 && ax < 3.3) return 3;
  if (Math.hypot(ax - 4.1, y - 14.4, z - 0.2) < 1.05 && y < 14.6) return 3;
  if (Math.hypot(ax - 4.5, y - 11.6, z - 0.4) < 0.95 && y > 11.3) return 3;
  if (y > 10.7 && y < 11.0 && ax < 2.0) return 3;
  if (y > 8.6 && y < 8.9 && ax > 1.0 && ax < 3.6) return 3;
  // each machine its colour
  if (ax > 3.55 && y > 6.4 && y < 16.4) return left ? 4 : 5;
  if (ax > 2.9 && y > 11.4 && y < 16.4) return left ? 4 : 5;
  if (y < 8.8 && ax > 0.95) return left ? 6 : 7;
  if (y > 15.2 || (ax > 1.4 && ax < 2.0 && z < -1.2) || y < 11.3 || z < -1.7) return 1;
  return 0;
}

export const KESTREL_BOX = { min: [-7.6, -0.4, -6.6] as [number, number, number], max: [7.6, 21.0, 4.4] as [number, number, number] };

/** a capsule squashed to `k` of its thickness across the plane through its axis and x: a wing, a fin */
function flat(x: number, y: number, z: number, ax: number, ay: number, az: number, bx: number, by: number, bz: number, ra: number, rb: number, k: number): number {
  const cy = (ay + by) / 2;
  return sdCapsule(x, cy + (y - cy) / k, z, ax, ay, az, bx, by, bz, ra, rb) * k;
}

/** the same, squashed across x: an upright fin */
function flatX(x: number, y: number, z: number, ax: number, ay: number, az: number, bx: number, by: number, bz: number, ra: number, rb: number, k: number): number {
  const cx = (ax + bx) / 2;
  return sdCapsule(cx + (x - cx) / k, y, z, ax, ay, az, bx, by, bz, ra, rb) * k;
}

export function kestrelSDF(x: number, y: number, z: number, bulk = 0): number {
  const ax = Math.abs(x);
  let d = 1e9;
  // the fuselage as a chest: narrower than Bastion's, the canopy forward, the intakes on the shoulders
  d = Math.min(d, sdBox(x, y, z, 0, 13.7, 0.1, 2.5, 1.9, 1.7, 0.6));
  d = Math.min(d, sdEllipsoid(x, y, z, 0, 14.4, 1.75, 0.95, 0.75, 0.85));
  d = smin(d, sdBox(x, y, z, 0, 11.4, 0.0, 1.5, 1.2, 1.15, 0.4), 0.4);
  d = smin(d, sdBox(x, y, z, 0, 9.8, 0, 2.2, 0.85, 1.35, 0.35), 0.3);
  // the nose cone, folded down the back
  d = Math.min(d, sdCapsule(x, y, z, 0, 15.2, -2.0, 0, 10.8, -2.3, 0.75, 0.2));
  // the wings, swept back and down from behind the shoulders; two tail fins above them
  d = Math.min(d, flat(ax, y, z, 1.4, 13.6, -2.2, 6.8, 12.4, -5.6, 1.9, 0.4, 0.17));
  d = Math.min(d, flatX(ax, y, z, 1.5, 14.2, -2.4, 1.65, 17.8, -3.7, 0.95, 0.22, 0.2));
  // the intakes over the shoulders, the missile pods on them
  d = Math.min(d, sdBox(ax, y, z, 3.4, 15.2, 0.2, 1.15, 0.9, 1.5, 0.3));
  d = Math.min(d, sdBox(ax, y, z, 3.4, 16.4, -0.1, 0.85, 0.45, 1.1, 0.2));
  // the head: a sleek helmet, a visor, two blade antennae swept back
  d = Math.min(d, sdCapsule(x, y, z, 0, 15.3, 0.1, 0, 16.3, 0.2, 0.6, 0.55));
  d = Math.min(d, sdEllipsoid(x, y, z, 0, 17.1, 0.35, 0.85, 1.0, 1.15));
  d = Math.min(d, sdCapsule(ax, y, z, 0.45, 17.8, 0.6, 1.0, 19.4, -0.9, 0.16, 0.05));
  // the arms: slim, a forearm guard, a hand
  d = Math.min(d, sdSphere(ax, y, z, 4.1, 14.5, 0.2, 0.8));
  d = Math.min(d, sdCapsule(ax, y, z, 4.1, 14.3, 0.2, 4.5, 11.8, 0.4, 0.65, 0.6));
  d = Math.min(d, sdSphere(ax, y, z, 4.5, 11.6, 0.4, 0.7));
  d = Math.min(d, sdBox(ax, y, z, 4.5, 10.0, 0.6, 0.8, 1.6, 0.85, 0.3));
  d = Math.min(d, sdBox(ax, y, z, 4.5, 8.0, 0.95, 0.6, 0.65, 0.6, 0.25));
  // the legs are the engines: a thigh, a long nacelle of a shin, a nozzle at the heel, a slim foot
  d = Math.min(d, sdCapsule(ax, y, z, 2.1, 9.1, 0, 2.3, 5.6, 0.25, 1.1, 1.0));
  d = Math.min(d, sdBox(ax, y, z, 2.3, 5.2, 0.7, 0.75, 0.65, 0.5, 0.25));
  d = Math.min(d, sdCapsule(ax, y, z, 2.3, 4.8, -0.1, 2.3, 1.7, -0.3, 1.25, 1.15));
  d = Math.min(d, sdCapsule(ax, y, z, 2.3, 1.6, -0.6, 2.3, 1.1, -1.4, 1.0, 1.1));
  d = Math.min(d, sdBox(ax, y, z, 2.3, 0.45, 0.9, 0.75, 0.45, 1.5, 0.2));
  return d - bulk;
}

/** Regions: 0 white, 1 slate (the fuselage's belly, the arms, the engines), 2 glow (canopy, visor), 3 dark (nozzles, joints), 4 the red stripe. */
export function kestrelRegion(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  if (y > 13.8 && y < 15.1 && z > 1.2 && ax < 1.0) return 2; // the canopy
  if (y > 16.8 && y < 17.4 && z > 1.0 && ax < 0.75) return 2; // the visor
  if (y < 1.9 && z < -0.9) return 3; // the nozzles
  if (Math.hypot(ax - 4.1, y - 14.5, z - 0.2) < 0.85 && y < 14.5) return 3;
  if (Math.hypot(ax - 4.5, y - 11.6, z - 0.4) < 0.75) return 3;
  if (y > 10.4 && y < 10.8 && ax < 1.6) return 3;
  if (ax > 2.5 && ax < 4.3 && y > 16.0 && y < 16.9) return 4; // the pods' red
  if (z < -1.9 && ax > 1.5 && ax < 7.0 && Math.abs(y - (13.6 - (ax - 1.4) * 0.22)) < 0.3) return 4; // a stripe down each wing
  if (y > 12.6 && y < 13.0 && ax < 2.3 && z > 0.8) return 4; // a band across the chest
  if (ax > 3.6 && y < 13.8 && y > 7.2) return 1; // the arms
  if (y < 5.0 && ax > 1.0) return 1; // the engines
  return 0;
}
