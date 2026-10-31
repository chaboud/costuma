// The Tree Builder: a blocky builder guy dressed up as a Christmas tree (founder, 2026-10-31: "Christmas tree builder
// man from Forsaken"). An ORIGINAL, affectionate take on the classic blocky builder: a hard hat, a moustache, work
// gloves, boots and a tool belt, and a tiered tree costume worn round the torso, with baubles, a gold garland, a string
// of twinkling lights and a star on the hat. No game's logo, text, mesh or skin is copied; we could not confirm a
// Christmas-tree skin exists, so nothing here is modelled on one.
//
// Built rigid: every part is a mesh hung on one bone (build.ts `dress`), no SDF body, so the box limbs articulate with no
// skin to tear. The skeleton has a person's proportions (hips, shoulders, head where a wearer's are) rather than a toy's
// short legs, because the stage fits the torso and the head and feet must land on the wearer's; the toy read comes from
// the square limbs, the block head and the legs as wide as the body, not from the lengths.
//
// Frame: metres for a ~21-unit figure on y = 0, +y up, +z its face, +x its own left (build.ts).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { CharacterDef, Dresser } from './build';
import type { Seg } from './sdf';

/** shoulder joints' half-width: near the arms' own width beside the yoke, so a wearer's arms stay under the costume's */
const SH = 2.75;

// Straight vertical limbs: a rigid box follows its bone exactly only if the bone's rest direction is the box's axis.
export const BUILDER_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 9.6, 0], b: [0, 10.8, 0], parent: null },
  { name: 'spine1', a: [0, 10.8, 0], b: [0, 12.6, 0], parent: 'pelvis' },
  { name: 'spine2', a: [0, 12.6, 0], b: [0, 15.0, 0], parent: 'spine1' },
  { name: 'neck', a: [0, 15.0, 0], b: [0, 15.9, 0], parent: 'spine2' },
  { name: 'head', a: [0, 15.9, 0], b: [0, 18.4, 0.1], parent: 'neck' },
  // the rig wants these names; nothing hangs on them
  { name: 'jaw', a: [0, 16.5, 1.0], b: [0, 16.5, 1.3], parent: 'head', reach: 0 },
  { name: 'tail1', a: [0, 9.4, -0.8], b: [0, 9.2, -1.2], parent: 'pelvis', reach: 0 },
  { name: 'tail2', a: [0, 9.2, -1.2], b: [0, 9.0, -1.6], parent: 'tail1', reach: 0 },
  { name: 'tail3', a: [0, 9.0, -1.6], b: [0, 8.8, -2.0], parent: 'tail2', reach: 0 },
  { name: 'tail4', a: [0, 8.8, -2.0], b: [0, 8.6, -2.4], parent: 'tail3', reach: 0 },
  { name: 'thighL', a: [0.95, 9.6, 0], b: [0.95, 5.3, 0], parent: 'pelvis' },
  { name: 'shinL', a: [0.95, 5.3, 0], b: [0.95, 1.2, 0], parent: 'thighL' },
  { name: 'footL', a: [0.95, 1.2, 0], b: [0.95, 0.4, 1.5], parent: 'shinL' },
  { name: 'thighR', a: [-0.95, 9.6, 0], b: [-0.95, 5.3, 0], parent: 'pelvis' },
  { name: 'shinR', a: [-0.95, 5.3, 0], b: [-0.95, 1.2, 0], parent: 'thighR' },
  { name: 'footR', a: [-0.95, 1.2, 0], b: [-0.95, 0.4, 1.5], parent: 'shinR' },
  { name: 'armL', a: [SH, 14.4, 0], b: [SH, 11.9, 0], parent: 'spine2' },
  { name: 'forearmL', a: [SH, 11.9, 0], b: [SH, 9.5, 0], parent: 'armL' },
  { name: 'armR', a: [-SH, 14.4, 0], b: [-SH, 11.9, 0], parent: 'spine2' },
  { name: 'forearmR', a: [-SH, 11.9, 0], b: [-SH, 9.5, 0], parent: 'armR' },
];

interface Tier { y0: number; y1: number; r0: number; r1: number; n: number; bone: string }
/**
 * The tree's tiers, bottom up: hem and top heights, hem and top radii, hem points, bone. Each sits on the bone of the body
 * it covers so the costume bends a little with the wearer; none reaches below the hips, where a walking or squatting leg
 * would swing through it. Each hem overlaps the tier below's top, so a bend opens no gap.
 */
const TIERS: Tier[] = [
  { y0: 9.9, y1: 12.3, r0: 3.5, r1: 1.45, n: 9, bone: 'pelvis' },
  { y0: 11.35, y1: 13.6, r0: 3.05, r1: 1.25, n: 8, bone: 'spine1' },
  { y0: 12.75, y1: 14.85, r0: 2.65, r1: 1.05, n: 7, bone: 'spine2' },
  { y0: 14.05, y1: 15.8, r0: 2.15, r1: 0.8, n: 6, bone: 'spine2' },
];
/** how far a hem's points hang below its notches */
const DROP = 0.5;
/** the tiers' flare: a straight cone read as one smooth lampshade; flared like a skirt, each hem stands off the tier below */
const FLARE = 1.4;
const PINE_HEM = 0x3f9a4b, PINE_TOP = 0x123d19;

/** radius of a tier's surface at fraction f of its height (0 hem, 1 top) */
const tierR = (t: Tier, f: number) => t.r1 + (t.r0 - t.r1) * Math.pow(Math.min(1, Math.max(0, 1 - f)), FLARE);

/**
 * A tier: an open flared cone, its hem cut into hanging points, faceted (flat shaded) to sit with the boxes, and shaded
 * from a light hem to a dark top: the shade under each hem is what separates the tiers from the front.
 */
function tierGeo(t: Tier): THREE.BufferGeometry {
  const seg = t.n * 2, h = t.y1 - t.y0;
  const g = new THREE.CylinderGeometry(t.r1, t.r0, h, seg, 4, true);
  const p = g.attributes.position as THREE.BufferAttribute;
  const col = new Float32Array(p.count * 3), lo = new THREE.Color(PINE_HEM), hi = new THREE.Color(PINE_TOP), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const f = (y + h / 2) / h;
    const r = Math.hypot(x, z) || 1;
    let rr = tierR(t, f), dy = 0;
    if (f < 1e-4) {
      // CylinderGeometry puts vertex j at angle 2πj/seg from +z (x = r sin θ): even j are the points
      const j = Math.round(Math.atan2(x, z) / ((Math.PI * 2) / seg));
      if (((j % 2) + 2) % 2 === 0) { dy = -DROP; rr *= 1.05; }
    }
    p.setXYZ(i, (x / r) * rr, y + dy, (z / r) * rr);
    c.copy(lo).lerp(hi, Math.pow(Math.min(1, Math.max(0, f)), 0.8));
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

/**
 * A tinsel rope along a curve: a tube whose radius ripples in a twist (ring i, spoke j), flat shaded so the facets glint.
 * A plain tube read as a gold pipe.
 */
function tinselGeo(curve: THREE.Curve<THREE.Vector3>, segs: number, r: number): THREE.BufferGeometry {
  const radial = 6, g = new THREE.TubeGeometry(curve, segs, r, radial, false);
  const p = g.attributes.position as THREE.BufferAttribute, n = g.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i <= segs; i++) for (let j = 0; j <= radial; j++) {
    const v = i * (radial + 1) + j, k = 1 + 0.42 * Math.sin(i * 2.2 + j * ((Math.PI * 2 * 2) / radial));
    p.setXYZ(v, p.getX(v) + n.getX(v) * r * (k - 1), p.getY(v) + n.getY(v) * r * (k - 1), p.getZ(v) + n.getZ(v) * r * (k - 1));
  }
  g.computeVertexNormals();
  return g;
}

/** a point on a tier's surface at angle θ (from +z toward +x) and height fraction f, pushed out by `out` */
function onTier(t: Tier, th: number, f: number, out: number): THREE.Vector3 {
  const r = tierR(t, f) + out;
  return new THREE.Vector3(Math.sin(th) * r, t.y0 + f * (t.y1 - t.y0), Math.cos(th) * r);
}

// Bulb colours × twinkle phases. Materials are shared by every worn clone, so the twinkle is per material: each bulb
// takes one of these, and neighbours differ in colour and phase. Each is a draw call per tier's bone: keep it few.
const BULB_COLOURS = [0xff2020, 0xffaa10, 0x2a70ff, 0xff30c0];
const BULB_PHASES = 2;
const STAR_GOLD = 0xffcc33;

function dress(d: Dresser): void {
  // Parts are gathered per (bone, material) and merged: ~300 little meshes would be ~300 draw calls per wearer on a
  // phone that is also running pose detection.
  const buckets = new Map<string, { bone: string; mat: THREE.Material; name: string; geos: THREE.BufferGeometry[] }>();
  const made = new Set<THREE.BufferGeometry>();
  const hang = (o: THREE.Object3D, bone: string, x: number, y: number, z: number) => {
    o.position.set(x, y, z);
    o.updateMatrixWorld(true);
    o.traverse((c) => {
      const m = c as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.Material, key = `${bone}|${mat.uuid}|${m.name}`;
      const g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
      for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'color') g.deleteAttribute(k);
      g.applyMatrix4(m.matrixWorld);
      let b = buckets.get(key);
      if (!b) { b = { bone, mat, name: m.name, geos: [] }; buckets.set(key, b); }
      b.geos.push(g);
    });
  };
  const geos = new Map<string, THREE.BufferGeometry>();
  /** a rounded box, geometry shared by size */
  const box = (w: number, h: number, dd: number, r = 0.25): THREE.BufferGeometry => {
    const k = `${w},${h},${dd},${r}`;
    let g = geos.get(k);
    if (!g) { g = new RoundedBoxGeometry(w, h, dd, 2, Math.min(r, w / 2 - 0.01, h / 2 - 0.01, dd / 2 - 0.01)); geos.set(k, g); }
    return g;
  };
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, name = '') => { made.add(g); const o = new THREE.Mesh(g, m); o.name = name; return o; };

  const skin = d.std({ color: 0xf2c193, roughness: 0.6 });
  const ink = d.std({ color: 0x15110f, roughness: 0.35 });
  const brownHair = d.std({ color: 0x5b3a20, roughness: 0.8 });
  const blush = d.std({ color: 0xf29a8e, roughness: 0.7 });
  const hat = d.std({ color: 0xf7c519, roughness: 0.35, metalness: 0.05 });
  const sweater = d.std({ color: 0xc2232c, roughness: 0.75 });
  const cuff = d.std({ color: 0xf2efe8, roughness: 0.8 });
  const glove = d.std({ color: 0xc89a5a, roughness: 0.85 });
  const gloveDark = d.std({ color: 0x8f6534, roughness: 0.85 });
  const jeans = d.std({ color: 0x2f4f86, roughness: 0.85 });
  const leather = d.std({ color: 0x6b4226, roughness: 0.6 });
  const boot = d.std({ color: 0x7a4a24, roughness: 0.7 });
  const sole = d.std({ color: 0x2a201a, roughness: 0.9 });
  const steel = d.std({ color: 0xc9ced6, roughness: 0.3, metalness: 0.85 });
  const darkSteel = d.std({ color: 0x55595f, roughness: 0.35, metalness: 0.8 });
  const wood = d.std({ color: 0xa8743e, roughness: 0.7 });
  const pine = d.std({ color: 0xffffff, vertexColors: true, roughness: 0.8, flatShading: true, side: THREE.DoubleSide });
  const tinsel = d.std({ color: 0xe8b53a, roughness: 0.3, metalness: 0.9 });
  const garland = d.std({ color: 0xf0bf45, roughness: 0.25, metalness: 0.9, flatShading: true });
  const wire = d.std({ color: 0x173a1d, roughness: 0.7 });
  const baubleMats = [
    d.std({ color: 0xd11f2b, roughness: 0.18, metalness: 0.55 }),
    d.std({ color: 0xe9b43c, roughness: 0.2, metalness: 0.9 }),
    d.std({ color: 0x2353c9, roughness: 0.18, metalness: 0.55 }),
  ];
  // distinct names keep d.std's cache from folding equal-looking bulbs into one material; a dark body so the colour is all
  // glow (a lit base colour under the emissive washed the bulbs out to pastel)
  const bulbMats: THREE.MeshStandardMaterial[] = [];
  for (let ph = 0; ph < BULB_PHASES; ph++) for (let c = 0; c < BULB_COLOURS.length; c++) {
    const m = d.std({ color: 0x202020, emissive: BULB_COLOURS[c]!, emissiveIntensity: 2.5, roughness: 0.3, name: `bulb-${c}-${ph}` });
    m.userData.phase = c * 1.9 + ph * Math.PI;
    m.userData.rate = 1.5 + 0.6 * ((c + ph * 3) % 4);
    bulbMats.push(m);
  }
  const starMat = d.std({ color: 0x6a4a00, emissive: STAR_GOLD, emissiveIntensity: 1.3, roughness: 0.25, metalness: 0.4, name: 'star' });

  // ---- the head: a rounded block, a simple face, a moustache, the hard hat and the star ----
  hang(mesh(box(2.9, 2.6, 2.6, 0.62), skin), 'head', 0, 17.15, 0.05);
  const eyeG = new THREE.SphereGeometry(0.2, 12, 8);
  for (const sx of [-1, 1]) {
    const e = mesh(eyeG, ink); e.scale.set(0.8, 1.3, 0.45); hang(e, 'head', sx * 0.52, 17.45, 1.35);
    const c = mesh(eyeG, blush); c.scale.set(1.3, 0.8, 0.3); hang(c, 'head', sx * 0.95, 16.9, 1.33);
    // the moustache: two chunky lobes swept out and down, a builder's
    const m = mesh(box(0.8, 0.34, 0.3, 0.14), brownHair); m.rotation.z = sx * -0.22; hang(m, 'head', sx * 0.38, 16.82, 1.41);
  }
  // the smile sits low enough that its ends clear the moustache (higher, only its bottom showed and it read as an "O")
  const smile = mesh(new THREE.TorusGeometry(0.5, 0.075, 6, 18, 2.3), ink);
  smile.rotation.z = -Math.PI / 2 - 1.15;
  hang(smile, 'head', 0, 16.78, 1.36);
  // the hard hat: a dome with a front-to-back crest, a brim with a longer peak in front
  const hatG = new THREE.Group();
  hatG.add(mesh(new THREE.SphereGeometry(1, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), hat));
  const crest = mesh(new THREE.TorusGeometry(1, 0.11, 6, 20, Math.PI), hat);
  crest.rotation.y = Math.PI / 2; hatG.add(crest);
  hatG.scale.set(1.66, 1.22, 1.72);
  hang(hatG, 'head', 0, 18.0, 0.05);
  const brim = mesh(new THREE.CylinderGeometry(1, 1, 0.16, 28), hat);
  brim.scale.set(1.9, 1, 2.08);
  hang(brim, 'head', 0, 18.05, 0.3);
  // the star on top: extruded, lit from within, pulsing (tick); thick enough to read side on
  const starShape = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 0.42 : 1.0;
    if (i) starShape.lineTo(Math.cos(a) * r, Math.sin(a) * r); else starShape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const starG = new THREE.ExtrudeGeometry(starShape, { depth: 0.36, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.08, bevelSegments: 1 });
  starG.translate(0, 0, -0.18);
  hang(mesh(starG, starMat, 'star'), 'head', 0, 20.15, 0.05);
  hang(mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.6, 6), tinsel), 'head', 0, 19.35, 0.05);

  // ---- the neck and the body under the costume: a red sweater shows at the shoulders ----
  hang(mesh(new THREE.CylinderGeometry(0.72, 0.8, 1.5, 10), skin), 'neck', 0, 15.6, 0);
  hang(mesh(box(2 * SH - 1.2, 2.8, 2.2, 0.4), sweater), 'spine2', 0, 13.9, 0);
  hang(mesh(box(3.5, 2.4, 2.0, 0.3), sweater), 'spine1', 0, 11.7, 0);
  hang(mesh(box(3.75, 2.0, 2.1, 0.3), jeans), 'pelvis', 0, 9.5, 0);

  // ---- the tree ----
  for (const t of TIERS) hang(mesh(tierGeo(t), pine), t.bone, 0, (t.y0 + t.y1) / 2, 0);
  // baubles hang from every other point of each hem, the tiers turned against each other so they don't stack
  const baubleG = new THREE.SphereGeometry(0.36, 12, 8), capG = new THREE.CylinderGeometry(0.1, 0.1, 0.16, 6);
  let bi = 0;
  TIERS.forEach((t, ti) => {
    const step = (Math.PI * 2) / t.n;
    for (let k = ti % 2; k < t.n; k += 2) {
      const th = k * step, r = t.r0 * 1.05 + 0.1, y = t.y0 - DROP - 0.34;
      hang(mesh(baubleG, baubleMats[bi++ % baubleMats.length]!), t.bone, Math.sin(th) * r, y, Math.cos(th) * r);
      hang(mesh(capG, tinsel), t.bone, Math.sin(th) * r, y + 0.38, Math.cos(th) * r);
    }
  });
  // the garland: one gold turn round each tier, low at the hem to high under the next tier's hem, so the turns read as
  // one spiral up the tree however the body bends
  TIERS.forEach((t, ti) => {
    const pts: THREE.Vector3[] = [], th0 = ti * 1.9;
    for (let i = 0; i <= 48; i++) { const u = i / 48; pts.push(onTier(t, th0 + u * Math.PI * 2, 0.18 + 0.64 * u, 0.13)); }
    hang(mesh(tinselGeo(new THREE.CatmullRomCurve3(pts), 120, 0.17), garland), t.bone, 0, 0, 0);
  });
  // the lights: a wire swagged round each tier between pins, a bulb at each swag's low point and either side of it
  const bulbG = new THREE.SphereGeometry(0.24, 10, 7);
  let li = 0;
  TIERS.forEach((t, ti) => {
    const swags = t.n - 2, th0 = 0.4 + ti * 0.7, fTop = 0.6, sag = 0.3;
    const at = (u: number) => { const s = Math.sin(u * Math.PI * swags); return onTier(t, th0 + u * Math.PI * 2, fTop - sag * s * s, 0.1); };
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 96; i++) pts.push(at(i / 96));
    hang(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 192, 0.045, 4, true), wire), t.bone, 0, 0, 0);
    for (let s = 0; s < swags; s++) for (const du of [0.22, 0.5, 0.78]) {
      const p = at((s + du) / swags);
      const b = mesh(bulbG, bulbMats[(li * 5 + ti) % bulbMats.length]!, 'bulb');
      b.scale.set(1, 1.3, 1);
      hang(b, t.bone, p.x * 1.04, p.y - 0.22, p.z * 1.04);
      li++;
    }
  });

  // ---- the arms: red sleeves, a white cuff, tan work gloves; a hammer in the right fist ----
  for (const sx of [-1, 1]) {
    const L = sx > 0 ? 'L' : 'R', x = sx * SH;
    hang(mesh(box(1.7, 1.2, 1.7, 0.45), sweater), 'arm' + L, x, 14.35, 0); // the shoulder
    hang(mesh(box(1.5, 2.8, 1.5, 0.25), sweater), 'arm' + L, x, 13.0, 0);
    hang(mesh(box(1.38, 1.38, 1.38, 0.55), sweater), 'arm' + L, x, 11.9, 0); // the elbow: hidden straight, fills the corner bent
    hang(mesh(box(1.42, 2.3, 1.42, 0.25), sweater), 'forearm' + L, x, 10.8, 0);
    hang(mesh(box(1.58, 0.45, 1.58, 0.15), cuff), 'forearm' + L, x, 9.75, 0);
    hang(mesh(box(1.64, 0.6, 1.64, 0.2), gloveDark), 'forearm' + L, x, 9.3, 0); // the glove's gauntlet
    hang(mesh(box(1.45, 1.3, 1.5, 0.4), glove), 'forearm' + L, x, 8.5, 0.05);
    hang(mesh(box(0.42, 0.8, 0.46, 0.18), glove), 'forearm' + L, x - sx * 0.5, 8.75, 0.82); // the thumb
  }
  // the claw hammer: gripped in the fist, handle forward and turned out so it reads from the front too (straight at the
  // camera it foreshortened to a bar); the head across the handle's end, face up, claw down and back
  const hammer = new THREE.Group();
  const handle = mesh(new THREE.CylinderGeometry(0.19, 0.22, 3.4, 8), wood);
  handle.rotation.x = Math.PI / 2; handle.position.z = 1.1; hammer.add(handle);
  const grip = mesh(new THREE.CylinderGeometry(0.26, 0.26, 1.3, 8), sole);
  grip.rotation.x = Math.PI / 2; hammer.add(grip);
  const hz = 2.75;
  const neckM = mesh(box(0.62, 0.9, 0.7, 0.12), darkSteel); neckM.position.set(0, 0.05, hz); hammer.add(neckM);
  const face = mesh(new THREE.CylinderGeometry(0.4, 0.36, 0.9, 10), steel); face.position.set(0, 0.85, hz); hammer.add(face);
  const claw = mesh(box(0.5, 1.15, 0.32, 0.12), darkSteel); claw.position.set(0, -0.8, hz - 0.25); claw.rotation.x = -0.55; hammer.add(claw);
  hammer.rotation.y = -0.6;
  hang(hammer, 'forearmR', -SH, 8.45, 0.1);

  // ---- the legs: jeans, boxy knees, work boots ----
  for (const sx of [-1, 1]) {
    const L = sx > 0 ? 'L' : 'R', x = sx * 0.95;
    hang(mesh(box(1.8, 4.5, 1.8, 0.25), jeans), 'thigh' + L, x, 7.75, 0);
    hang(mesh(box(1.76, 1.76, 1.76, 0.6), jeans), 'thigh' + L, x, 5.3, 0); // the knee
    hang(mesh(box(1.74, 3.9, 1.74, 0.25), jeans), 'shin' + L, x, 3.3, 0);
    hang(mesh(box(1.98, 1.7, 2.0, 0.3), boot), 'shin' + L, x, 1.6, 0); // the boot's shaft
    hang(mesh(box(1.95, 0.32, 2.05, 0.1), boot), 'shin' + L, x, 2.45, 0); // its collar
    hang(mesh(box(2.0, 1.05, 3.1, 0.4), boot), 'foot' + L, x, 0.62, 0.55);
    hang(mesh(box(2.1, 0.3, 3.25, 0.1), sole), 'foot' + L, x, 0.15, 0.55);
    for (let i = 0; i < 3; i++) hang(mesh(box(1.0, 0.1, 0.16, 0.04), cuff), 'shin' + L, x, 1.1 + i * 0.4, 1.02); // laces
  }

  // ---- the tool belt, low on the hips under the tree's hem: a buckle, pouches at the front corners (at the sides a
  // hanging hand went through them), a wrench in the right one ----
  hang(mesh(box(3.95, 0.62, 2.3, 0.15), leather), 'pelvis', 0, 9.05, 0);
  hang(mesh(box(0.7, 0.5, 0.14, 0.06), steel), 'pelvis', 0, 9.05, 1.18);
  for (const sx of [-1, 1]) hang(mesh(box(0.85, 1.05, 0.7, 0.18), leather), 'pelvis', sx * 1.65, 8.55, 1.0);
  const wrench = new THREE.Group();
  wrench.add(mesh(box(0.26, 1.7, 0.12, 0.05), steel));
  const jawM = mesh(new THREE.TorusGeometry(0.28, 0.1, 6, 12, Math.PI * 1.4), steel);
  jawM.position.y = 1.0; jawM.rotation.z = -Math.PI * 0.2; wrench.add(jawM);
  wrench.rotation.z = 0.2;
  hang(wrench, 'pelvis', -1.7, 9.0, 1.05);

  for (const b of buckets.values()) {
    const a = d.segs.find((s) => s.name === b.bone)!.a;
    const g = mergeGeometries(b.geos);
    for (const x of b.geos) x.dispose();
    if (!g) throw new Error(`builder: parts on ${b.bone} would not merge`);
    g.translate(-a[0], -a[1], -a[2]);
    const m = new THREE.Mesh(g, b.mat);
    m.name = b.name;
    d.at(m, b.bone, a[0], a[1], a[2]);
  }
  for (const g of made) g.dispose();
}

/** per root: the bulb materials and the star's, found once (a WeakMap, not userData: clone JSON-copies userData) */
const found = new WeakMap<THREE.Object3D, { bulbs: THREE.MeshStandardMaterial[]; star: THREE.MeshStandardMaterial | null }>();

function tick(root: THREE.Object3D, t: number): void {
  let f = found.get(root);
  if (!f) {
    const bulbs = new Set<THREE.MeshStandardMaterial>();
    let star: THREE.MeshStandardMaterial | null = null;
    root.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (o.name === 'bulb' && m) bulbs.add(m);
      if (o.name === 'star' && m) star = m;
    });
    f = { bulbs: [...bulbs], star };
    found.set(root, f);
  }
  // each group swells to bright and falls back on its own clock; cubed so a bulb spends most of its time lit low and
  // flashes, never dark (a dark bulb read as a hole in the tree). Past ~2 the tone mapping turns a pure colour pastel, so
  // the peak stays under it: the flash is the few hot ones among many saturated ones
  for (const m of f.bulbs) {
    const s = 0.5 + 0.5 * Math.sin(t * (m.userData.rate as number) + (m.userData.phase as number));
    m.emissiveIntensity = 0.55 + 1.35 * s * s * s;
  }
  if (f.star) f.star.emissiveIntensity = 1.25 + 0.3 * Math.sin(t * 2.4);
}

export const BUILDER: CharacterDef = {
  id: 'builder', name: 'Tree Builder', blurb: 'A blocky builder, decked out as a Christmas tree',
  segs: BUILDER_SEGMENTS,
  dress,
  tick,
  // a rigid figure: stretched limbs open gaps at the joints, so they keep near their own lengths (already a person's)
  fit: { size: 1.06, limb: 0.2 },
};
