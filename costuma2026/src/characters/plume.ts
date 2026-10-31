// Plume: a huge, friendly, feathered bird (founder, 2026-10-06: "a Big Bird style character (trying for the feathers)").
// An original design, no show's bird: a tall upright bird, pear-shaped, on long bare legs with big three-toed feet; a long
// shaggy neck; a round head with a broad orange beak and big round eyes; a crest of three tall pink plumes; stubby wings
// held at its sides; a short tail of plumes. Golden plumage with a cream bib, every surface feathered (fur.ts as
// feathers: broad vanes laid flat down the body). An upright plan on the rig's bone names (hero.ts's frame and capture
// rules): the arms are its wings, the tail bones its tail. Metres for a 20 m bird, the sdf.ts frame (y up, +z forward).
import { sdCapsule, sdEllipsoid, sdSphere, smin, type Seg } from './sdf';

export const PLUME_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 7.6, -0.4], b: [0, 8.8, 0], parent: null },
  { name: 'spine1', a: [0, 8.8, 0], b: [0, 10.8, 0.3], parent: 'pelvis' },
  { name: 'spine2', a: [0, 10.8, 0.3], b: [0, 12.6, 0.6], parent: 'spine1' },
  // a long neck, up and a little forward
  { name: 'neck', a: [0, 12.6, 0.6], b: [0, 15.6, 1.3], parent: 'spine2', reach: 1.9 },
  { name: 'head', a: [0, 15.6, 1.3], b: [0, 17.6, 2.4], parent: 'neck' },
  { name: 'jaw', a: [0, 15.9, 2.6], b: [0, 15.7, 4.4], parent: 'head', reach: 0.7 },
  // the tail: a short spray of plumes behind the rump
  { name: 'tail1', a: [0, 7.4, -2.6], b: [0, 6.8, -3.6], parent: 'pelvis', reach: 1.4 },
  { name: 'tail2', a: [0, 6.8, -3.6], b: [0, 6.2, -4.5], parent: 'tail1', reach: 1.4 },
  { name: 'tail3', a: [0, 6.2, -4.5], b: [0, 5.7, -5.2], parent: 'tail2', reach: 1.2 },
  { name: 'tail4', a: [0, 5.7, -5.2], b: [0, 5.3, -5.7], parent: 'tail3', reach: 1.0 },
  // long legs: the thigh inside the body, a bare shank, a broad foot
  { name: 'thighL', a: [1.4, 7.4, 0], b: [1.5, 4.6, 0.3], parent: 'pelvis' },
  { name: 'shinL', a: [1.5, 4.6, 0.3], b: [1.5, 0.9, -0.2], parent: 'thighL' },
  { name: 'footL', a: [1.5, 0.9, -0.2], b: [1.5, 0.3, 1.8], parent: 'shinL' },
  { name: 'thighR', a: [-1.4, 7.4, 0], b: [-1.5, 4.6, 0.3], parent: 'pelvis' },
  { name: 'shinR', a: [-1.5, 4.6, 0.3], b: [-1.5, 0.9, -0.2], parent: 'thighR' },
  { name: 'footR', a: [-1.5, 0.9, -0.2], b: [-1.5, 0.3, 1.8], parent: 'shinR' },
  // the wings, held at its sides, the primaries hanging past the hips
  { name: 'armL', a: [2.7, 11.6, 0.2], b: [3.3, 9.2, -0.1], parent: 'spine2' },
  { name: 'forearmL', a: [3.3, 9.2, -0.1], b: [3.2, 7.0, 0.3], parent: 'armL' },
  { name: 'armR', a: [-2.7, 11.6, 0.2], b: [-3.3, 9.2, -0.1], parent: 'spine2' },
  { name: 'forearmR', a: [-3.3, 9.2, -0.1], b: [-3.2, 7.0, 0.3], parent: 'armR' },
];

export const PLUME_BOX = { min: [-5.0, -0.4, -7.2] as [number, number, number], max: [5.0, 21.4, 6.6] as [number, number, number] };
/** its eyes (build.ts hangs them on the head bone): big, round, set high on the face */
export const PLUME_EYES: [number, number, number] = [0.72, 17.25, 2.75];

export function plumeSDF(x: number, y: number, z: number, bulk = 0): number {
  const ax = Math.abs(x);
  // the body: a pear, broad below, the breast forward
  let d = sdEllipsoid(x, y, z, 0, 9.2, -0.2, 3.3, 3.5, 3.0);
  d = smin(d, sdEllipsoid(x, y, z, 0, 11.4, 0.5, 2.5, 2.2, 2.3), 1.0);
  // the neck: long and thick (the feathers make it shaggier)
  d = smin(d, sdCapsule(x, y, z, 0, 12.2, 0.5, 0, 15.8, 1.4, 1.25, 0.95), 0.8);
  // the head: round, with a broad beak, upper over lower, and the crest's three plumes
  let h = sdSphere(x, y, z, 0, 16.9, 1.8, 1.55);
  h = smin(h, sdCapsule(x, y, z, 0, 16.55, 2.9, 0, 16.1, 5.0, 0.72, 0.18), 0.3);
  h = smin(h, sdCapsule(x, y, z, 0, 15.85, 2.8, 0, 15.75, 4.4, 0.5, 0.14), 0.25);
  for (const [cx, k] of [[0, 1], [0.6, 0.82], [-0.6, 0.82]] as const) h = smin(h, sdCapsule(x, y, z, cx * 0.5, 18.1, 1.6, cx * 1.3, 18.1 + 2.7 * k, 1.0 - 0.7 * k, 0.34, 0.12), 0.3);
  h = Math.max(h, -sdSphere(ax, y, z, PLUME_EYES[0], PLUME_EYES[1], PLUME_EYES[2], 0.5)); // eye sockets
  d = smin(d, h, 0.5);
  // the wings: broad, flat against the flanks, the primaries a little apart at the tips
  d = smin(d, sdEllipsoid(ax, y, z, 3.0, 9.8, 0.0, 0.75, 2.6, 1.7), 0.7);
  for (const k of [-1, 0, 1]) d = smin(d, sdCapsule(ax, y, z, 3.2, 8.4, k * 0.6, 3.25, 6.6 + Math.abs(k) * 0.4, k * 0.75 + 0.2, 0.42, 0.14), 0.3);
  // the tail: three plumes fanned up and back
  for (const k of [-1, 0, 1]) d = smin(d, sdCapsule(x, y, z, k * 0.3, 7.6, -2.6, k * 1.1, 7.0 + (1 - Math.abs(k)) * 0.5, -5.6, 0.5, 0.2), 0.4);
  // the legs: thighs lost in the body's feathers, long bare shanks
  d = smin(d, sdCapsule(ax, y, z, 1.4, 7.4, 0, 1.5, 4.8, 0.3, 1.0, 0.55), 0.5);
  d = smin(d, sdCapsule(ax, y, z, 1.5, 4.8, 0.3, 1.5, 1.0, -0.2, 0.42, 0.36), 0.25);
  d -= bulk;
  // the feet: three long toes forward, one back
  for (const k of [-1, 0, 1]) d = smin(d, sdCapsule(ax, y, z, 1.5, 0.5, 0.1, 1.5 + k * 0.85, 0.3, 2.0 - Math.abs(k) * 0.3, 0.34, 0.16), 0.2);
  d = smin(d, sdCapsule(ax, y, z, 1.5, 0.5, -0.2, 1.5, 0.3, -1.1, 0.3, 0.14), 0.15);
  return d;
}

/** Regions: 0 golden plumage, 1 the cream bib and face, 2 pink (the crest's plumes and the tail's tips), 3 orange (beak, legs, feet). */
export function plumeRegion(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  if (y > 15.6 && y < 17.1 && z > 2.6 && ax < 0.85) return 3; // the beak
  if (y < 5.0 && ax > 0.9 && ax < 2.6) return 3; // shanks
  if (y < 1.0) return 3; // feet
  if (y > 18.4) return 2; // the crest
  if (z < -4.6) return 2; // the tail's tips
  if (z > 1.2 && y > 9.4 && y < 13.4 && ax < 1.8) return 1; // the bib
  if (z > 2.2 && y > 16.2 && y < 18.2 && ax < 1.25) return 1; // round the eyes
  return 0;
}

/** The plumage's length, 0..1.4: none on the beak, legs and eyes, short on the face, long on the neck, body and tail. */
export function plumeFeatherLength(x: number, y: number, z: number): number {
  const ax = Math.abs(x), r = plumeRegion(x, y, z);
  if (r === 3) return 0;
  if (Math.hypot(ax - PLUME_EYES[0], y - PLUME_EYES[1], z - PLUME_EYES[2]) < 0.9) return 0;
  if (r === 2) return 0.6; // the plumes are their own shape; a short fringe on them
  if (y > 16.0) return 0.45; // the head
  if (y > 14.6 && z > 1.6) return 0.3; // the throat under the beak (long, it hung as a beard)
  if (y > 12.2) return 1.25; // the neck's ruff
  if (z < -2.4) return 1.4; // the tail
  return 1;
}
