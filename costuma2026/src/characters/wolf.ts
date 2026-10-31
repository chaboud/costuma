// Howler: a wolf man (founder, 2026-10-06: "a giant wolf man style (homage to rampage)"). An original design, no game's
// or film's werewolf: a hunched biped on digitigrade legs, a deep chest under a shaggy ruff, a long muzzle with a black
// nose, tall pointed ears, long arms ending in claws, a bushy tail; grey with a pale chest and muzzle and a dark saddle,
// eyes that glow amber. An upright plan on the rig's bone names (hero.ts's frame and capture rules): the tail bones carry
// its tail. Metres for a 20 m wolf man, the sdf.ts frame (y up, +z forward). Fur as shells (fur.ts).
import { sdCapsule, sdEllipsoid, sdSphere, smin, type Seg } from './sdf';

export const WOLF_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 9.4, -0.6], b: [0, 10.4, 0], parent: null },
  { name: 'spine1', a: [0, 10.4, 0], b: [0, 12.6, 0.8], parent: 'pelvis' },
  { name: 'spine2', a: [0, 12.6, 0.8], b: [0, 14.8, 1.9], parent: 'spine1' },
  { name: 'neck', a: [0, 14.8, 1.9], b: [0, 16.0, 3.0], parent: 'spine2', reach: 1.6 },
  { name: 'head', a: [0, 16.0, 3.0], b: [0, 16.6, 5.8], parent: 'neck' },
  { name: 'jaw', a: [0, 15.5, 3.9], b: [0, 15.3, 6.6], parent: 'head', reach: 0.8 },
  { name: 'tail1', a: [0, 9.2, -1.6], b: [0, 8.2, -3.6], parent: 'pelvis', reach: 1.8 },
  { name: 'tail2', a: [0, 8.2, -3.6], b: [0, 6.8, -5.2], parent: 'tail1', reach: 1.8 },
  { name: 'tail3', a: [0, 6.8, -5.2], b: [0, 5.3, -6.4], parent: 'tail2', reach: 1.6 },
  { name: 'tail4', a: [0, 5.3, -6.4], b: [0, 4.0, -7.2], parent: 'tail3', reach: 1.4 },
  // digitigrade legs: the knee forward, the hock back, a long foot to the toes
  { name: 'thighL', a: [1.6, 9.2, -0.3], b: [1.9, 6.0, 1.3], parent: 'pelvis' },
  { name: 'shinL', a: [1.9, 6.0, 1.3], b: [1.9, 2.8, -0.9], parent: 'thighL' },
  { name: 'footL', a: [1.9, 2.8, -0.9], b: [1.9, 0.4, 1.0], parent: 'shinL' },
  { name: 'thighR', a: [-1.6, 9.2, -0.3], b: [-1.9, 6.0, 1.3], parent: 'pelvis' },
  { name: 'shinR', a: [-1.9, 6.0, 1.3], b: [-1.9, 2.8, -0.9], parent: 'thighR' },
  { name: 'footR', a: [-1.9, 2.8, -0.9], b: [-1.9, 0.4, 1.0], parent: 'shinR' },
  // long arms, hanging a little forward
  { name: 'armL', a: [2.7, 14.3, 1.6], b: [3.3, 11.2, 2.0], parent: 'spine2' },
  { name: 'forearmL', a: [3.3, 11.2, 2.0], b: [3.2, 8.2, 3.2], parent: 'armL' },
  { name: 'armR', a: [-2.7, 14.3, 1.6], b: [-3.3, 11.2, 2.0], parent: 'spine2' },
  { name: 'forearmR', a: [-3.3, 11.2, 2.0], b: [-3.2, 8.2, 3.2], parent: 'armR' },
];

export const WOLF_BOX = { min: [-5.0, -0.5, -8.6] as [number, number, number], max: [5.0, 20.4, 8.6] as [number, number, number] };
export const WOLF_EYES: [number, number, number] = [0.62, 17.05, 4.75];
const NOSE: [number, number, number] = [0, 16.35, 7.35];

export function wolfSDF(x: number, y: number, z: number, bulk = 0): number {
  const ax = Math.abs(x);
  // a deep chest leaning forward over a lean waist and narrow hips
  let d = sdEllipsoid(x, y, z, 0, 13.4, 1.4, 2.6, 2.5, 2.1);
  d = smin(d, sdEllipsoid(x, y, z, 0, 11.2, 0.4, 1.7, 1.6, 1.4), 0.9); // the waist
  d = smin(d, sdEllipsoid(x, y, z, 0, 9.8, -0.4, 2.0, 1.2, 1.5), 0.7); // the hips
  d = smin(d, sdEllipsoid(x, y, z, 0, 15.1, 1.6, 2.3, 1.5, 2.0), 0.8); // the ruff over the shoulders
  d = smin(d, sdSphere(ax, y, z, 2.5, 14.2, 1.5, 1.05), 0.7); // the shoulders
  // the head: a skull, a long muzzle, the lower jaw, tall ears
  let h = sdEllipsoid(x, y, z, 0, 16.9, 3.6, 1.35, 1.25, 1.55);
  h = smin(h, sdCapsule(x, y, z, 0, 16.7, 4.6, 0, 16.3, 7.1, 0.82, 0.45), 0.5); // the muzzle
  h = smin(h, sdCapsule(x, y, z, 0, 15.8, 4.4, 0, 15.75, 6.7, 0.55, 0.32), 0.35); // the lower jaw
  h = smin(h, sdEllipsoid(ax, y, z, 1.15, 16.5, 3.6, 0.55, 0.75, 0.9), 0.4); // the cheeks' fur
  h = smin(h, sdCapsule(ax, y, z, 0.75, 17.8, 3.1, 1.05, 19.4, 2.7, 0.5, 0.06), 0.3); // ears
  h = Math.max(h, -sdSphere(ax, y, z, WOLF_EYES[0], WOLF_EYES[1], WOLF_EYES[2] + 0.12, 0.3)); // eye sockets
  d = smin(d, h, 0.6);
  // arms: lean upper arms, forearms, big hands with claws
  d = smin(d, sdCapsule(ax, y, z, 2.7, 14.3, 1.6, 3.3, 11.2, 2.0, 0.9, 0.72), 0.5);
  d = smin(d, sdCapsule(ax, y, z, 3.3, 11.2, 2.0, 3.2, 8.4, 3.1, 0.78, 0.55), 0.35);
  d = smin(d, sdEllipsoid(ax, y, z, 3.2, 7.9, 3.35, 0.55, 0.75, 0.55), 0.3);
  // legs: a muscled thigh, a lean shank, a long foot
  d = smin(d, sdCapsule(ax, y, z, 1.6, 9.2, -0.3, 1.9, 6.0, 1.3, 1.25, 0.85), 0.6);
  d = smin(d, sdCapsule(ax, y, z, 1.9, 6.0, 1.3, 1.9, 2.8, -0.9, 0.75, 0.48), 0.4);
  d = smin(d, sdCapsule(ax, y, z, 1.9, 2.8, -0.9, 1.9, 0.5, 0.9, 0.5, 0.42), 0.3);
  // the tail: bushy, thickest past its root, down and out behind
  const T: [number, number, number, number][] = [[0, 9.2, -1.6, 0.6], [0, 8.2, -3.6, 1.0], [0, 6.8, -5.2, 1.15], [0, 5.3, -6.4, 0.9], [0, 4.0, -7.2, 0.35]];
  for (let i = 0; i + 1 < T.length; i++) { const a = T[i]!, b = T[i + 1]!; d = smin(d, sdCapsule(x, y, z, a[0], a[1], a[2], b[0], b[1], b[2], a[3], b[3]), 0.5); }
  d -= bulk;
  // claws: four on each hand, hooked down; three on each foot
  for (const k of [-1.5, -0.5, 0.5, 1.5]) d = smin(d, sdCapsule(ax, y, z, 3.2 + k * 0.17, 7.4, 3.5, 3.2 + k * 0.22, 6.5, 3.85, 0.17, 0.03), 0.1);
  for (const k of [-1, 0, 1]) d = smin(d, sdCapsule(ax, y, z, 1.9 + k * 0.28, 0.4, 1.2, 1.9 + k * 0.34, 0.1, 1.85, 0.2, 0.03), 0.1);
  return d;
}

/** Regions: 0 grey fur, 1 pale (chest, belly, muzzle, throat, inner legs), 2 dark (the saddle, ears' backs, tail tip), 3 nose and claws. */
export function wolfRegion(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  if (Math.hypot(x, y - NOSE[1], z - NOSE[2]) < 0.45) return 3;
  if ((y < 7.6 && y > 6.2 && z > 3.4 && ax > 2.6) || (y < 0.5 && z > 1.2)) return 3; // claws
  if (y > 17.4 && ax > 0.6 && z < 3.2) return 2; // the ears' backs
  if (z < -6.3) return 2; // the tail's tip
  if (y > 15.4 && y < 16.4 && z > 4.4) return 1; // the muzzle's underside and the lips
  if (y > 14.6 && y < 15.8 && z > 2.8 && ax < 1.2) return 1; // the throat
  if (z > 2.2 && y > 10.2 && y < 15.0 && ax < 1.8) return 1; // the chest
  if (y > 12.4 && z < 0.8 && ax < 1.9 && y > 12.4 + 0.5 * ax) return 2; // the saddle
  return 0;
}

/** The coat's length, 0..1.4: bare at the nose, eyes and claws, short on the muzzle and feet, long in the ruff and tail. */
export function wolfFurLength(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  if (wolfRegion(x, y, z) === 3) return 0;
  if (Math.hypot(ax - WOLF_EYES[0], y - WOLF_EYES[1], z - WOLF_EYES[2]) < 0.65) return 0;
  if (z > 4.6 && y > 15.2) return 0.35; // the muzzle
  if (y > 17.6) return 0.4; // the ears
  if (y > 14.0 && y < 16.4 && z < 3.4) return 1.4; // the ruff
  if (z < -1.4 && y < 9.6) return 1.4; // the tail
  if (y < 3.0) return 0.45; // the feet
  return 1;
}
