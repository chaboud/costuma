// The upright heroes: a valkyrie and a sentai-style suited hero, on one humanoid skeleton with the rig's bone names.
// Original designs (founder, 2026-10-03: "Violet Valkyries mascot style, power rangers classics"); no team's mark and
// no show's suit is copied:
// - **Valkyrie**: violet armour with gold trim, a winged helm over a braid, a breastplate, an armoured skirt, greaves, a
//   cape that hangs on the tail bones and sways with the stride; a spear and a round shield are meshes on her forearms
//   (build.ts), so they stay rigid.
// - **Crimson**: a crimson suit with white chevrons on the chest, white gloves and boots, a silver belt and buckle, a
//   rounded helmet with a black V visor.
// Metres for a 20 m hero, the sdf.ts frame (y up, +z forward). Weights as the theropod's (sharp), so the suit bends.
import { sdCapsule, sdEllipsoid, sdSphere, smin, type Seg } from './sdf';

export const HERO_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 9.6, 0], b: [0, 10.6, 0], parent: null },
  { name: 'spine1', a: [0, 10.6, 0], b: [0, 12.4, 0.1], parent: 'pelvis' },
  { name: 'spine2', a: [0, 12.4, 0.1], b: [0, 15.0, 0.1], parent: 'spine1' },
  { name: 'neck', a: [0, 15.0, 0.1], b: [0, 15.9, 0.15], parent: 'spine2', reach: 0.8 },
  { name: 'head', a: [0, 15.9, 0.15], b: [0, 18.4, 0.3], parent: 'neck' },
  { name: 'jaw', a: [0, 16.4, 0.9], b: [0, 16.4, 1.2], parent: 'head', reach: 0 },
  // the cape (the valkyrie's; nothing on the suited hero), from the shoulders down the back
  { name: 'tail1', a: [0, 14.8, -1.2], b: [0, 12.6, -1.4], parent: 'spine2', reach: 1.0 },
  { name: 'tail2', a: [0, 12.6, -1.4], b: [0, 10.4, -1.6], parent: 'tail1', reach: 1.0 },
  { name: 'tail3', a: [0, 10.4, -1.6], b: [0, 8.2, -1.8], parent: 'tail2', reach: 1.0 },
  { name: 'tail4', a: [0, 8.2, -1.8], b: [0, 6.2, -2.0], parent: 'tail3', reach: 1.0 },
  { name: 'thighL', a: [1.1, 9.6, 0], b: [1.2, 5.3, 0.2], parent: 'pelvis' },
  { name: 'shinL', a: [1.2, 5.3, 0.2], b: [1.2, 1.1, -0.1], parent: 'thighL' },
  { name: 'footL', a: [1.2, 1.1, -0.1], b: [1.2, 0.35, 1.4], parent: 'shinL' },
  { name: 'thighR', a: [-1.1, 9.6, 0], b: [-1.2, 5.3, 0.2], parent: 'pelvis' },
  { name: 'shinR', a: [-1.2, 5.3, 0.2], b: [-1.2, 1.1, -0.1], parent: 'thighR' },
  { name: 'footR', a: [-1.2, 1.1, -0.1], b: [-1.2, 0.35, 1.4], parent: 'shinR' },
  // the arms hang close to the body, as a person's do (half a metre clear of the hips: nearer, the marching cubes join
  // them to the thigh and a swing tears the join)
  { name: 'armL', a: [2.4, 14.6, 0], b: [2.72, 11.9, -0.05], parent: 'spine2' },
  { name: 'forearmL', a: [2.72, 11.9, -0.05], b: [2.85, 9.45, 0.4], parent: 'armL' },
  { name: 'armR', a: [-2.4, 14.6, 0], b: [-2.72, 11.9, -0.05], parent: 'spine2' },
  { name: 'forearmR', a: [-2.72, 11.9, -0.05], b: [-2.85, 9.45, 0.4], parent: 'armR' },
];

export const HERO_BOX = { min: [-4.2, -0.4, -2.8] as [number, number, number], max: [4.2, 20.4, 2.6] as [number, number, number] };

/**
 * The body both share: an athletic figure built from its anatomy, not from tubes (founder, 2026-10-06: "crimson could be
 * more human shaped"). Eight heads tall; a ribcage under pectorals, the trapezius rising to the neck, deltoids capping the
 * shoulders, the lats tapering the back into a waist, glutes, a quadriceps' sweep, knees, calves, and hands and feet with
 * their shape. The valkyrie a little slighter.
 */
function body(x: number, y: number, z: number, slight: number): number {
  const ax = Math.abs(x), s = 1 - 0.08 * slight;
  // the torso: the ribcage, the chest's muscles over it, the back's, the abdomen and the pelvis
  let d = sdEllipsoid(x, y, z, 0, 13.35, 0.1, 1.8 * s, 1.95, 1.05 * s);
  d = smin(d, sdEllipsoid(ax, y, z, 0.85 * s, 13.75, 0.75, 0.95 * s, 0.68, 0.5), 0.45); // the pectorals
  // the lats: high and flat, a V from the armpits (lower and rounder, the back read as a balloon over the waist)
  d = smin(d, sdEllipsoid(x, y, z, 0, 13.75, -0.35, 1.95 * s, 1.3, 0.62), 0.4);
  d = smin(d, sdCapsule(ax, y, z, 0, 15.35, -0.2, 1.85 * s, 14.95, -0.1, 0.5, 0.36), 0.5); // the trapezius
  d = smin(d, sdEllipsoid(x, y, z, 0, 11.6, 0.12, 1.35 * s, 1.45, 0.92 * s), 0.6); // the abdomen
  d = smin(d, sdEllipsoid(x, y, z, 0, 10.0, 0, 1.68 * s, 1.0, 1.02 * s), 0.6); // the pelvis
  d = smin(d, sdEllipsoid(ax, y, z, 0.72, 9.55, -0.5, 0.82 * s, 0.85, 0.62), 0.4); // the glutes
  // the spine's groove down the back, between the muscles either side (without it the back read as one smooth mass)
  d = Math.max(d, -sdCapsule(x, y, z, 0, 14.6, -1.12, 0, 10.6, -0.98, 0.16, 0.14));
  // the neck, with a jaw and a skull above it
  d = smin(d, sdCapsule(x, y, z, 0, 14.9, -0.05, 0, 16.3, 0.12, 0.6, 0.52), 0.4);
  d = smin(d, sdEllipsoid(x, y, z, 0, 17.3, 0.1, 0.95, 1.12, 1.08), 0.3); // the cranium
  d = smin(d, sdEllipsoid(x, y, z, 0, 16.55, 0.4, 0.74, 0.74, 0.82), 0.35); // the jaw and face
  // the shoulders: a deltoid over each joint, blended into the trapezius
  d = smin(d, sdEllipsoid(ax, y, z, 2.3 * s, 14.5, 0, 0.7 * s, 0.92, 0.78), 0.4);
  // the arms: the biceps' and triceps' mass on the upper arm, the forearm thick by the elbow, a wrist, a hand
  d = smin(d, sdCapsule(ax, y, z, 2.4, 14.4, 0, 2.72, 11.95, -0.05, 0.56 * s, 0.42 * s), 0.3);
  d = smin(d, sdEllipsoid(ax, y, z, 2.56, 13.15, 0.12, 0.5 * s, 0.95, 0.5 * s), 0.3);
  d = smin(d, sdCapsule(ax, y, z, 2.72, 11.9, -0.05, 2.85, 9.6, 0.38, 0.46 * s, 0.3 * s), 0.25);
  d = smin(d, sdEllipsoid(ax, y, z, 2.76, 11.2, 0.05, 0.48 * s, 0.8, 0.48 * s), 0.3);
  d = smin(d, sdEllipsoid(ax, y, z, 2.87, 9.0, 0.48, 0.24, 0.52, 0.42), 0.2); // the palm and fingers
  d = smin(d, sdCapsule(ax, y, z, 2.8, 9.35, 0.75, 2.72, 8.85, 0.95, 0.15, 0.12), 0.12); // the thumb
  // the legs: the thigh with the quadriceps' sweep and the inner thigh, the knee, the calf, the ankle
  d = smin(d, sdCapsule(ax, y, z, 1.02, 9.6, 0, 1.15, 5.45, 0.2, 0.9 * s, 0.56 * s), 0.45);
  d = smin(d, sdEllipsoid(ax, y, z, 1.12, 7.7, 0.28, 0.8 * s, 1.6, 0.72 * s), 0.4);
  d = smin(d, sdEllipsoid(ax, y, z, 0.8, 8.3, 0.0, 0.55 * s, 1.3, 0.6), 0.4);
  d = smin(d, sdSphere(ax, y, z, 1.17, 5.3, 0.32, 0.52 * s), 0.3); // the knee
  d = smin(d, sdCapsule(ax, y, z, 1.18, 5.25, 0.15, 1.2, 1.15, -0.1, 0.5 * s, 0.3 * s), 0.3);
  d = smin(d, sdEllipsoid(ax, y, z, 1.2, 3.95, -0.28, 0.56 * s, 1.3, 0.6 * s), 0.35); // the calf
  // the feet: a heel and a long arch to the toes, flat beneath
  d = smin(d, Math.max(sdEllipsoid(ax, y, z, 1.2, 0.5, 0.55, 0.46, 0.5, 1.25), -y), 0.25);
  return d;
}

export function heroSDF(x: number, y: number, z: number, style: 'valkyrie' | 'crimson', bulk = 0): number {
  const ax = Math.abs(x);
  let d = body(x, y, z, style === 'valkyrie' ? 1 : 0);
  if (style === 'valkyrie') {
    d = smin(d, sdEllipsoid(x, y, z, 0, 13.6, 0.55, 2.2, 1.5, 1.0), 0.4); // the breastplate
    // the armoured skirt: a flared bell of plates from the waist to mid-thigh
    { const t = Math.max(0, Math.min(1, (10.8 - y) / 3.4)), r = 1.6 + 0.75 * t;
      const ring = Math.hypot(x / 1.05, z / 0.8) - r;
      d = Math.min(d, Math.max(ring, Math.abs(y - 9.1) - 1.7, -(Math.hypot(x / 1.05, z / 0.8) - r + 0.32))); }
    d = smin(d, sdSphere(ax, y, z, 2.38, 14.9, 0, 1.0), 0.3); // the pauldrons
    d = smin(d, sdCapsule(ax, y, z, 1.2, 4.6, 0.35, 1.2, 1.4, 0.2, 0.75, 0.62), 0.2); // the greaves
    // the helm: a rounded cap over the head, a nasal guard, and two wings swept up and back from its sides
    d = smin(d, sdSphere(x, y, z, 0, 17.0, 0.25, 1.32), 0.3);
    d = smin(d, sdEllipsoid(x, y, z, 0, 17.4, 0.2, 1.42, 1.0, 1.42), 0.2);
    for (let i = 0; i < 3; i++) d = smin(d, sdCapsule(ax, y, z, 1.3, 17.6 + i * 0.25, 0.2 - i * 0.35, 2.3 + i * 0.25, 19.0 + i * 0.35, -1.0 - i * 0.5, 0.32 - i * 0.06, 0.1), 0.2);
    // the braid down her back
    d = smin(d, sdCapsule(x, y, z, 0, 16.6, -1.1, 0, 12.6, -1.5, 0.42, 0.26), 0.3);
    // the cape: a curtain from the shoulders to the knees, behind
    { const w = 2.3 + (14.8 - y) * 0.12; d = Math.min(d, Math.max(Math.abs(x) - w, Math.abs(z + 1.75 + (14.8 - y) * 0.03) - 0.2, y - 14.8, 4.6 - y) - 0.08); }
  } else {
    // the helmet: a head's shape a little larger (a ball read as a mascot), a chin guard, a crest ridge; the visor is a mesh
    d = smin(d, sdEllipsoid(x, y, z, 0, 17.3, 0.12, 1.08, 1.24, 1.18), 0.25);
    d = smin(d, sdEllipsoid(x, y, z, 0, 16.5, 0.45, 0.82, 0.72, 0.86), 0.25);
    d = smin(d, sdCapsule(x, y, z, 0, 18.42, -0.7, 0, 18.5, 0.85, 0.16, 0.12), 0.2);
    d = smin(d, sdEllipsoid(x, y, z, 0, 10.55, 0.05, 1.55, 0.38, 1.1), 0.15); // the belt
    d = smin(d, sdEllipsoid(x, y, z, 0, 10.55, 1.05, 0.55, 0.42, 0.22), 0.1); // the buckle
    d = smin(d, sdCapsule(ax, y, z, 2.82, 10.25, 0.3, 2.86, 9.5, 0.42, 0.4, 0.38), 0.15); // the gloves' cuffs
    d = smin(d, sdCapsule(ax, y, z, 1.2, 3.2, -0.05, 1.2, 1.0, -0.08, 0.52, 0.48), 0.2); // the boots' shafts
  }
  return d - bulk;
}

/**
 * Regions. Valkyrie: 0 violet armour, 1 gold trim, 2 the helm's wings and the braid (pale), 3 the face (skin).
 * Crimson: 0 the crimson suit, 1 white (chevrons, gloves, boots), 2 the black visor, 3 silver (belt and buckle).
 */
export function heroRegion(x: number, y: number, z: number, style: 'valkyrie' | 'crimson'): number {
  const ax = Math.abs(x);
  if (style === 'valkyrie') {
    if (y > 17.6 && ax > 1.2) return 2; // the helm's wings
    if (z < -0.9 && y > 12.4 && y < 16.8 && ax < 0.6) return 2; // the braid
    if (y > 15.9 && y < 17.2 && z > 0.6 && ax < 1.0) return 3; // the face under the helm
    if (y > 16.9 && y < 17.3 && z > 0.6) return 1; // the helm's brow band
    if (Math.abs(y - 10.85) < 0.25 || (y < 7.6 && y > 7.3)) return 1; // the belt and the skirt's hem
    if (y > 13.5 && y < 14.0 && z > 0.8) return 1; // the breastplate's rim
    if (ax > 2.0 && Math.abs(y - 14.9) < 0.35) return 1; // the pauldrons' rims
    return 0;
  }
  if (y > 16.75 && y < 17.5 && z > 0.9 && ax < 0.95) return 2; // dark behind the visor (the visor itself is a mesh)
  if (Math.abs(y - 10.6) < 0.45 && z > -1.5) return 3; // the belt
  if (y < 3.2 || y < 10.4 && ax > 2.3 && y > 8.2) return 1; // the boots and gloves
  // two white chevrons across the chest, pointing down
  if (z > 0.7 && ax < 1.7) { const c = y - 12.6 - ax * 0.55; if ((c > 0 && c < 0.35) || (c > 0.75 && c < 1.1)) return 1; }
  return 0;
}
