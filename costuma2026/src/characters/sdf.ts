// The kaiju's body as a signed distance field: smooth-min blended capsules
// and spheres along the skeleton's segments, plus fins for the dorsal plates.
// Authored in metres for a 20 m kaiju standing on y = 0, x right, y up,
// +z forward (nose). No model file: the surface is ours, and it is measured
// against nothing but the lab turntable (laser-kitty's cat-gen loop).

/** `reach`: past this distance from its axis a segment weighs nothing (a leg must not take the belly with it) */
export interface Seg { name: string; a: [number, number, number]; b: [number, number, number]; parent: string | null; reach?: number }

/**
 * A species' look (ADR-0016; the sim's half is sim/species.ts, by the same id), on the one skeleton: so every species
 * walks, stomps and roars with the same rig. `head` scales the skull about its centre; `bulk` inflates the body by
 * metres (negative slims it); `plates` scales the dorsal plates, and `spikes` makes them a row of horns-like spines;
 * `horns` is the length of two brow horns in metres (0 none); the palette is skin, belly, plates.
 */
export type Plan = 'quad' | 'mech' | 'moth' | 'bird' | 'hero';

export interface Shape {
  head: number; bulk: number; plates: number; spikes: boolean; horns: number; skin: number; belly: number; plate: number;
  /**
   * the body plan: the theropod (default), four legs on the same bone names (raccoon.ts), a mech (mech.ts), a moth
   * (moth.ts), a bird (bird.ts), or an upright hero in armour or a suit (hero.ts, by `style`)
   */
  plan?: Plan;
  /**
   * which body on the plan: the heroes' valkyrie and crimson, and on the same plans the newer species — a wolf man and a
   * great feathered bird upright (wolf.ts, plume.ts), an ape on four legs (ape.ts), and two more machines on the mech's
   * skeleton (robots.ts). No style: the plan's first body (Jimothy, Bastion)
   */
  style?: 'valkyrie' | 'crimson' | 'wolf' | 'plume' | 'ape' | 'unison' | 'kestrel';
  /** the fourth region's colour (claws, beak, face, belt), when not the theropod's bone white */
  claw?: number;
  /** colours for regions 4 and up (Unison's five machines, Kestrel's stripe) */
  extra?: number[];
  /** the hide: scales (default), painted armour, a soft coat (feathers, a moth's down), a suit's sheen */
  surface?: 'armour' | 'soft' | 'suit';
  /**
   * fur (fur.ts): strand length in metres at the 20 m scale, strands per metre, how much lighter the tips are; `feather`
   * draws each strand as a flat vane laid down the body instead of a round hair
   */
  fur?: { length: number; density: number; tip: number; feather?: boolean };
}
export const SHAPES: Record<string, Shape> = {
  nibbler: { head: 1.25, bulk: -0.25, plates: 0.55, spikes: false, horns: 0, skin: 0x58753a, belly: 0xd8c98a, plate: 0xe8a84a },
  stomper: { head: 0.95, bulk: 0.55, plates: 0.75, spikes: true, horns: 0, skin: 0x6b5a48, belly: 0xc9b48e, plate: 0x2f2a28 },
  ridgeback: { head: 1, bulk: 0, plates: 1, spikes: false, horns: 0, skin: 0x3d5246, belly: 0xb9b088, plate: 0xd9d3ba },
  colossus: { head: 0.9, bulk: 0.35, plates: 1.3, spikes: false, horns: 2.6, skin: 0x2e3340, belly: 0x8e8778, plate: 0xa8dcff },
  // the Seattle raccoon (raccoon.ts): grey-brown fur, pale belly, brows and muzzle, a black mask and tail rings; the
  // palette is fur, pale, dark
  jimothy: { head: 1, bulk: 0, plates: 0, spikes: false, horns: 0, skin: 0x7a7064, belly: 0xcfc8ba, plate: 0x26221f, plan: 'quad', fur: { length: 1.0, density: 7, tip: 0.18 } },
  // Bastion, the armoured truck that stands up (mech.ts): gunmetal paint, amber trim, cyan eyes and headlights, a
  // tinted windscreen, black tyres, a silver faceplate
  bastion: { head: 1, bulk: 0, plates: 0, spikes: false, horns: 0, skin: 0x4a5462, belly: 0xd9a032, plate: 0x8fe8ff, claw: 0x1c1f24, plan: 'mech', surface: 'armour', extra: [0x6c9cc4, 0x141619, 0xc4c8ce] },
  // Roc, the bird (bird.ts): rust plumage, a cream breast and face, dark bars, a yellow beak and feet
  roc: { head: 1, bulk: 0, plates: 0, spikes: false, horns: 0, skin: 0x8a4a2a, belly: 0xe8d8b8, plate: 0x2a1c14, claw: 0xe0b030, plan: 'bird', surface: 'soft' },
  // Lumen, the moth (moth.ts): pale lilac down and wings, a violet band, teal eyespots, dark eyes and legs
  lumen: { head: 1, bulk: 0, plates: 0, spikes: false, horns: 0, skin: 0xd9cfe6, belly: 0x6a4a8a, plate: 0x40e0d0, claw: 0x1a1424, plan: 'moth', surface: 'soft' },
  // the Valkyrie (hero.ts): violet armour, gold trim, a pale-winged helm and braid, her face
  valkyrie: { head: 1, bulk: 0, plates: 0, spikes: false, horns: 0, skin: 0x6b3fa0, belly: 0xe0b040, plate: 0xeeeaf4, claw: 0xe8b896, plan: 'hero', style: 'valkyrie', surface: 'suit' },
  // Crimson, the suited hero (hero.ts): a crimson suit, white chevrons, gloves and boots, a black visor, a silver belt
  crimson: { head: 1, bulk: 0, plates: 0, spikes: false, horns: 0, skin: 0xc81e2a, belly: 0xf4f4f4, plate: 0x101014, claw: 0xc0c4cc, plan: 'hero', style: 'crimson', surface: 'suit' },
  // ADR-0028's five (founder, 2026-10-06), original designs:
  // Plume (plume.ts): golden plumage, a cream bib, pink plumes, an orange beak and legs; feathers as flat vanes
  plume: { head: 1, bulk: 0, plates: 0, spikes: false, horns: 0, skin: 0xf4b408, belly: 0xffe7a0, plate: 0xe8508c, claw: 0xf08424, plan: 'hero', style: 'plume', surface: 'soft', fur: { length: 1.5, density: 1.6, tip: 0.3, feather: true } },
  // Silverback (ape.ts): near-black fur, a silver saddle, leathery grey skin, dark nails
  silverback: { head: 1, bulk: 0, plates: 0, spikes: false, horns: 0, skin: 0x26221f, belly: 0x949088, plate: 0x5a534e, claw: 0x141210, plan: 'quad', style: 'ape', fur: { length: 1.1, density: 6, tip: 0.12 } },
  // Howler (wolf.ts): grey fur, a pale chest and muzzle, a dark saddle, a black nose and claws, amber eyes
  howler: { head: 1, bulk: 0, plates: 0, spikes: false, horns: 0, skin: 0x77706a, belly: 0xb8afa0, plate: 0x34302c, claw: 0x121010, plan: 'hero', style: 'wolf', fur: { length: 0.8, density: 7, tip: 0.22 } },
  // Kestrel (robots.ts): white, slate, an amber canopy and visor, a red stripe
  kestrel: { head: 1, bulk: 0, plates: 0, spikes: false, horns: 0, skin: 0xe6e8ec, belly: 0x56627a, plate: 0xffb040, claw: 0x1c1f24, plan: 'mech', style: 'kestrel', surface: 'armour', extra: [0xc8283a] },
  // Unison (robots.ts): a white and navy jet, an orange and a teal tank, a yellow and a red truck, a cyan canopy
  unison: { head: 1, bulk: 0, plates: 0, spikes: false, horns: 0, skin: 0xeceef2, belly: 0x26326a, plate: 0x7fe8ff, claw: 0x1c1f24, plan: 'mech', style: 'unison', surface: 'armour', extra: [0xe8742a, 0x22a89c, 0xe8c228, 0xc42a3a] },
};
/** the classic run (no species) looks like the ridgeback, which is the kaiju from before ADR-0016 */
export const shapeOf = (id: string | undefined): Shape => SHAPES[id ?? ''] ?? SHAPES.ridgeback!;
/** the skull's centre, about which `head` scales it */
const HC = [0, 16.6, 5.6] as const;

export const smin = (a: number, b: number, k: number): number => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};

export function sdSphere(px: number, py: number, pz: number, cx: number, cy: number, cz: number, r: number): number {
  const dx = px - cx, dy = py - cy, dz = pz - cz;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) - r;
}

/** capsule a→b with radius lerped ra→rb (a round tapered cone) */
export function sdCapsule(px: number, py: number, pz: number, ax: number, ay: number, az: number, bx: number, by: number, bz: number, ra: number, rb: number): number {
  const bax = bx - ax, bay = by - ay, baz = bz - az;
  const pax = px - ax, pay = py - ay, paz = pz - az;
  const t = Math.max(0, Math.min(1, (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz)));
  const dx = pax - bax * t, dy = pay - bay * t, dz = paz - baz * t;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) - (ra + (rb - ra) * t);
}

/** ellipsoid (approximate SDF, fine for blending) */
export function sdEllipsoid(px: number, py: number, pz: number, cx: number, cy: number, cz: number, rx: number, ry: number, rz: number): number {
  const x = (px - cx) / rx, y = (py - cy) / ry, z = (pz - cz) / rz;
  const k0 = Math.sqrt(x * x + y * y + z * z);
  const k1 = Math.sqrt(x * x / rx + y * y / ry + z * z / rz);
  return k1 > 0 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, ry, rz);
}

/**
 * The skeleton, as segments in rest pose. Names are ours; the rig hangs
 * THREE.Bones on them and the skin weights come from distance to them.
 */
export const SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 9.6, 0], b: [0, 10.4, 0.6], parent: null },
  { name: 'spine1', a: [0, 10.4, 0.6], b: [0, 12.4, 1.6], parent: 'pelvis' },
  { name: 'spine2', a: [0, 12.4, 1.6], b: [0, 14.4, 2.4], parent: 'spine1' },
  { name: 'neck', a: [0, 14.4, 2.4], b: [0, 16.2, 3.9], parent: 'spine2' },
  { name: 'head', a: [0, 16.2, 3.9], b: [0, 16.8, 7.4], parent: 'neck' },
  { name: 'jaw', a: [0, 15.6, 4.6], b: [0, 15.0, 7.6], parent: 'head' },
  { name: 'tail1', a: [0, 9.6, 0], b: [0, 8.6, -3.6], parent: 'pelvis' },
  { name: 'tail2', a: [0, 8.6, -3.6], b: [0, 7.4, -7.2], parent: 'tail1' },
  { name: 'tail3', a: [0, 7.4, -7.2], b: [0, 6.4, -10.6], parent: 'tail2' },
  { name: 'tail4', a: [0, 6.4, -10.6], b: [0, 5.8, -14.0], parent: 'tail3' },
  { name: 'thighL', a: [1.7, 9.3, 0.1], b: [2.0, 5.2, 1.0], parent: 'pelvis' },
  { name: 'shinL', a: [2.0, 5.2, 1.0], b: [2.2, 1.7, -0.3], parent: 'thighL' },
  { name: 'footL', a: [2.2, 1.7, -0.3], b: [2.3, 0.35, 2.3], parent: 'shinL' },
  { name: 'thighR', a: [-1.7, 9.3, 0.1], b: [-2.0, 5.2, 1.0], parent: 'pelvis' },
  { name: 'shinR', a: [-2.0, 5.2, 1.0], b: [-2.2, 1.7, -0.3], parent: 'thighR' },
  { name: 'footR', a: [-2.2, 1.7, -0.3], b: [-2.3, 0.35, 2.3], parent: 'shinR' },
  { name: 'armL', a: [2.3, 13.6, 2.6], b: [2.8, 11.8, 3.5], parent: 'spine2' },
  { name: 'forearmL', a: [2.8, 11.8, 3.5], b: [2.5, 10.7, 5.2], parent: 'armL' },
  { name: 'armR', a: [-2.3, 13.6, 2.6], b: [-2.8, 11.8, 3.5], parent: 'spine2' },
  { name: 'forearmR', a: [-2.8, 11.8, 3.5], b: [-2.5, 10.7, 5.2], parent: 'armR' },
];

/** Dorsal plate centres along the spine and tail, with their sizes (rz along, ry up, rx thick). */
export const PLATES: { c: [number, number, number]; rx: number; ry: number; rz: number }[] = [
  { c: [0, 16.9, 1.7], rx: 0.24, ry: 1.5, rz: 0.8 },
  { c: [0, 16.4, 0.3], rx: 0.3, ry: 2.3, rz: 1.1 },
  { c: [0, 15.2, -1.1], rx: 0.34, ry: 3.1, rz: 1.4 },
  { c: [0, 13.6, -2.4], rx: 0.34, ry: 3.4, rz: 1.5 },
  { c: [0, 11.9, -3.8], rx: 0.3, ry: 2.9, rz: 1.35 },
  { c: [0, 10.4, -5.6], rx: 0.28, ry: 2.3, rz: 1.15 },
  { c: [0, 9.1, -7.6], rx: 0.24, ry: 1.7, rz: 0.95 },
  { c: [0, 8.0, -9.8], rx: 0.2, ry: 1.2, rz: 0.75 },
  { c: [0, 7.1, -12.0], rx: 0.18, ry: 0.8, rz: 0.55 },
];

/** A plate is three fins: a tall centre and two shorter side lobes, so the silhouette is jagged, not a bump. */
function sdPlate(x: number, y: number, z: number, p: { c: [number, number, number]; rx: number; ry: number; rz: number }, sh: Shape): number {
  if (sh.spikes) {
    // a spine: a cone from the back, raked toward the tail
    const k = sh.plates;
    return sdCapsule(x, y, z, p.c[0], p.c[1] - p.ry * 0.3, p.c[2], p.c[0], p.c[1] + p.ry * 0.9 * k, p.c[2] - p.rz * 0.8 * k, p.rz * 0.55 * k, 0.04);
  }
  if (sh.plates !== 1) p = { c: [p.c[0], p.c[1] - p.ry * 0.35 + p.ry * 0.35 * sh.plates, p.c[2]], rx: p.rx * Math.sqrt(sh.plates), ry: p.ry * sh.plates, rz: p.rz * sh.plates };
  let d = sdEllipsoid(x, y, z, p.c[0], p.c[1] + p.ry * 0.35, p.c[2], p.rx, p.ry, p.rz * 0.45);
  d = Math.min(d, sdEllipsoid(x, y, z, p.c[0], p.c[1] + p.ry * 0.05, p.c[2] + p.rz * 0.62, p.rx, p.ry * 0.6, p.rz * 0.4));
  d = Math.min(d, sdEllipsoid(x, y, z, p.c[0], p.c[1] + p.ry * 0.05, p.c[2] - p.rz * 0.62, p.rx, p.ry * 0.6, p.rz * 0.4));
  return d;
}

/** Region of a point for colouring: 0 skin, 1 belly, 2 plate (or spine, or horn), 3 claw/teeth. */
export function regionAt(x: number, y: number, z: number, sh: Shape = SHAPES.ridgeback!): number {
  // the plate's box as sdPlate draws it (at plates 1, no spikes: exactly the ridgeback's original test)
  const k = sh.plates;
  for (const p of PLATES) {
    const cy = sh.spikes ? p.c[1] + p.ry * (0.9 * k - 0.3) / 2 : p.c[1] - p.ry * 0.35 + p.ry * 0.35 * k;
    const ry = sh.spikes ? p.ry * (0.9 * k + 0.3) / 2 : p.ry * k;
    const cz = sh.spikes ? p.c[2] - p.rz * 0.4 * k : p.c[2], rz = p.rz * k;
    if (Math.abs(x - p.c[0]) < p.rx * Math.max(1, Math.sqrt(k)) + 0.15 && Math.abs(y - cy) < ry + 0.2 && Math.abs(z - cz) < rz + 0.2) return 2;
  }
  if (sh.horns > 0 && y > HC[1] + 1.6 * sh.head && Math.abs(z - HC[2]) < 2.5 && Math.abs(x) > 0.8) return 2;
  // belly: the forward-facing underside of the torso; the throat; never the head
  if (y > 8.5 && y < 14.6 && z > 1.6 && Math.abs(x) < 2.0) return 1;
  if (y >= 14.6 && y < 15.6 && z > 3.4 && z < 5.6 && Math.abs(x) < 1.1) return 1;
  if (y > 5 && y < 8.5 && z > 0.6 && Math.abs(x) < 1.4) return 1;
  // claws and teeth
  if (y < 0.5 && z > 3.6) return 3;
  return 0;
}

export function kaijuSDF(x: number, y: number, z: number, sh: Shape = SHAPES.ridgeback!): number {
  const ax = Math.abs(x);
  let d = 1e9;
  // torso: a heavy pelvis rising into a deep chest, leaning forward
  d = smin(d, sdCapsule(x, y, z, 0, 9.4, -0.4, 0, 10.6, 0.7, 2.9, 3.0), 0.8);
  d = smin(d, sdCapsule(x, y, z, 0, 10.6, 0.7, 0, 12.6, 1.6, 3.0, 3.2), 0.8);
  d = smin(d, sdCapsule(x, y, z, 0, 12.6, 1.6, 0, 14.5, 2.4, 3.1, 2.4), 0.8);
  // chest keel and the belly's forward bulge
  d = smin(d, sdEllipsoid(x, y, z, 0, 12.2, 3.2, 2.2, 2.8, 1.6), 0.8);
  // neck: thick, into the skull
  d = smin(d, sdCapsule(x, y, z, 0, 14.5, 2.4, 0, 16.3, 3.9, 2.0, 1.7), 0.6);
  // skull: a long low box of a head, brow shelf, cheek flare, tapering snout, a jaw with a chin — in the species' head
  // scale about the skull's centre (a distance in scaled space times the scale is a distance in metres). It joins the
  // body after the body's bulk: inflated, the eye sockets filled in and the stomper went blind
  let head = 1e9;
  {
    const k = sh.head, hx = x / k, hy = HC[1] + (y - HC[1]) / k, hz = HC[2] + (z - HC[2]) / k, hax = Math.abs(hx);
    let h = sdEllipsoid(hx, hy, hz, 0, 17.0, 4.9, 1.9, 1.7, 2.3);
    h = smin(h, sdEllipsoid(hx, hy, hz, 0, 16.7, 7.0, 1.45, 1.1, 2.6), 0.4);
    h = smin(h, sdCapsule(hx, hy, hz, 0, 16.5, 7.4, 0, 16.3, 9.6, 1.05, 0.7), 0.35);
    h = smin(h, sdCapsule(hax, hy, hz, 0.7, 18.1, 4.6, 1.25, 17.9, 7.2, 0.62, 0.4), 0.28); // brow shelf
    h = smin(h, sdEllipsoid(hax, hy, hz, 1.9, 16.5, 5.0, 0.75, 0.9, 1.3), 0.35); // cheek flare
    h = smin(h, sdCapsule(hx, hy, hz, 0, 15.6, 4.9, 0, 15.3, 8.9, 0.95, 0.62), 0.3); // jaw
    h = smin(h, sdSphere(hx, hy, hz, 0, 15.2, 9.2, 0.55), 0.25); // chin
    // horns: from the back of the brow, up and swept back
    if (sh.horns > 0) h = smin(h, sdCapsule(hax, hy, hz, 1.05, 18.0, 5.0, 1.9, 18.0 + sh.horns, 5.0 - sh.horns * 0.7, 0.55, 0.08), 0.25);
    // eye sockets are carved out (nostrils were too; at 96³ the two holes merged into one white pit — dropped)
    h = Math.max(h, -sdSphere(hax, hy, hz, 1.32, 17.1, 6.9, 0.62));
    // throat pouch under the jaw
    h = smin(h, sdEllipsoid(hx, hy, hz, 0, 14.6, 4.4, 1.5, 0.9, 1.6), 0.5);
    head = h * k;
  }
  // tail: tapering arcs
  d = smin(d, sdCapsule(x, y, z, 0, 9.4, -0.4, 0, 8.6, -3.6, 2.5, 2.0), 0.9);
  d = smin(d, sdCapsule(x, y, z, 0, 8.6, -3.6, 0, 7.4, -7.2, 2.0, 1.4), 0.7);
  d = smin(d, sdCapsule(x, y, z, 0, 7.4, -7.2, 0, 6.4, -10.6, 1.4, 0.85), 0.5);
  d = smin(d, sdCapsule(x, y, z, 0, 6.4, -10.6, 0, 5.8, -14.3, 0.85, 0.3), 0.4);
  // legs: thigh with a haunch, shin, foot with three toes (mirrored by ax)
  d = smin(d, sdSphere(ax, y, z, 2.0, 8.8, 0.3, 1.95), 0.6); // haunch
  d = smin(d, sdCapsule(ax, y, z, 1.7, 9.3, 0.1, 2.0, 5.2, 1.0, 1.7, 1.15), 0.5);
  d = smin(d, sdEllipsoid(ax, y, z, 2.15, 4.6, 0.1, 0.9, 1.4, 1.1), 0.4); // calf
  d = smin(d, sdCapsule(ax, y, z, 2.0, 5.2, 1.0, 2.2, 1.7, -0.3, 1.05, 0.85), 0.4);
  d = smin(d, sdCapsule(ax, y, z, 2.2, 1.7, -0.3, 2.3, 0.6, 2.4, 0.95, 0.8), 0.35);
  // the species' build: the body swells (or slims) by metres before the toes, claws and plates go on
  d -= sh.bulk;
  d = smin(d, head, 0.5);
  for (const [tx, tz] of [[-0.95, 2.8], [0, 3.4], [1.0, 2.8]] as const) {
    d = smin(d, sdCapsule(ax, y, z, 2.3 + tx * 0.6, 0.6, 1.9, 2.3 + tx, 0.4, tz + 0.9, 0.48, 0.28), 0.2);
    d = smin(d, sdCapsule(ax, y, z, 2.3 + tx, 0.4, tz + 0.9, 2.3 + tx * 1.1, 0.15, tz + 2.0, 0.24, 0.04), 0.08); // claw
  }
  d = smin(d, sdCapsule(ax, y, z, 2.2, 0.6, -0.4, 2.2, 0.4, -1.3, 0.5, 0.35), 0.25); // heel
  // arms: small, held forward, three claws
  d = smin(d, sdCapsule(ax, y, z, 2.3, 13.6, 2.6, 2.8, 11.8, 3.5, 0.8, 0.6), 0.4);
  d = smin(d, sdCapsule(ax, y, z, 2.8, 11.8, 3.5, 2.5, 10.7, 5.2, 0.58, 0.45), 0.3);
  for (const [cx, cy] of [[-0.35, 0.1], [0, -0.1], [0.35, 0.05]] as const) d = smin(d, sdCapsule(ax, y, z, 2.5 + cx * 0.5, 10.7 + cy, 5.2, 2.5 + cx, 10.3 + cy, 6.1, 0.2, 0.06), 0.12);
  // dorsal plates: jagged fins, blended tight so they stay sharp
  for (const p of PLATES) d = smin(d, sdPlate(x, y, z, p, sh), 0.18);
  return d;
}

/** Sampling box of the kaiju in metres (a little air around the body): the ridgeback's, grown for bulk, plates and horns. */
export const BOX = { min: [-4.2, -0.6, -15.5] as const, max: [4.2, 20.2, 10.5] as const };
export function boxFor(sh: Shape): { min: [number, number, number]; max: [number, number, number] } {
  // the ridgeback samples exactly as it did before species: the same grid, the same mesh
  if (sh.bulk <= 0 && sh.plates <= 1 && !sh.spikes && sh.horns <= 0 && sh.head <= 1) return { min: [...BOX.min], max: [...BOX.max] };
  const g = Math.max(0, sh.bulk) + 0.2, top = Math.max(BOX.max[1], 16.9 + 3.4 * sh.plates + 1, HC[1] + (18.0 + sh.horns - HC[1]) * sh.head + 1);
  return { min: [BOX.min[0] - g, BOX.min[1], BOX.min[2] - g], max: [BOX.max[0] + g, top, HC[2] + (BOX.max[2] - HC[2]) * Math.max(1, sh.head) + g] };
}
