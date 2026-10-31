// The Tree Builder: a blocky builder guy in a full Christmas-tree costume (founder, 2026-10-31: "Christmas tree builder
// man from Forsaken"; then: "scale up the tree so it goes from head to toe... no body except face (through a cut-hole) is
// exposed. And then the hard hat serves as the star, canted up at 30-45 degrees. Like someone saying 'good day'").
// An ORIGINAL, affectionate take on the classic blocky builder: his face (dot eyes, a smile, a moustache) peeks through a
// hole in a tiered tree that reaches the floor, his yellow hard hat sits on top where the star would be, tipped back,
// and his arms are boughs. No game's logo, text, mesh or skin is copied; we could not confirm a Christmas-tree skin
// exists, so nothing here is modelled on one.
//
// Built rigid: every part is a mesh hung on one bone (build.ts `dress`), no SDF body, so nothing stretches or tears. The
// tiers ride the bones of the body they cover: the skirt on the pelvis (the legs carry nothing; they walk inside it), the
// middle on spine1, the upper on spine2, and the tier with the face hole and the hat on the head, so the face never
// slides out of its hole when the wearer turns their head.
//
// Frame: metres for a ~21-unit figure on y = 0, +y up, +z its face, +x its own left (build.ts).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { CharacterDef, Dresser } from './build';
import type { Seg } from './sdf';

/** shoulder joints' half-width: where a wearer's arms come out of the tree, so the boughs follow them */
const SH = 2.75;

// Straight vertical limbs: a rigid part follows its bone exactly only if the bone's rest direction is the part's axis.
export const BUILDER_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 9.6, 0], b: [0, 10.8, 0], parent: null },
  { name: 'spine1', a: [0, 10.8, 0], b: [0, 12.6, 0], parent: 'pelvis' },
  { name: 'spine2', a: [0, 12.6, 0], b: [0, 15.0, 0], parent: 'spine1' },
  { name: 'neck', a: [0, 15.0, 0], b: [0, 15.9, 0], parent: 'spine2' },
  { name: 'head', a: [0, 15.9, 0], b: [0, 18.4, 0], parent: 'neck' },
  // the rig wants these names; nothing hangs on them, nor on the legs
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

/** the face hole: centred on the head bone's middle, which the stage's neck fit puts on the wearer's head */
interface Hole { y: number; a: number; b: number }
const FACE: Hole = { y: 17.15, a: 1.4, b: 1.22 };
/** the rim round the hole: a twist of needles, and how far its bulbs sit outside it */
const RIM = 0.3;

/**
 * A tier: an open flared cone from its hem (y0, r0) up to (y1, r1), its hem cut into `n` hanging points, round axis x.
 * `k` subdivides each point's facets (a hole needs a finer surface to cut), `turn` rotates it (a notch to the front).
 */
interface Tier {
  y0: number; y1: number; r0: number; r1: number; n: number; bone: string;
  x?: number; flare?: number; k?: number; rows?: number; turn?: number; drop?: number; hole?: Hole;
  /** decorations: baubles at alternate points, a garland turn, a string of lights (fraction of height, sag) */
  baubles?: boolean; garland?: boolean; lights?: [number, number] | null;
}

/**
 * Bottom up. Each hem overlaps the tier below's top, so a bend opens no gap and the shade under each hem separates them.
 * The skirt reaches the floor in the rest pose and is wide enough that a wearer's legs walk inside it.
 */
const TIERS: Tier[] = [
  { y0: 0.45, y1: 5.4, r0: 6.0, r1: 2.9, n: 13, bone: 'pelvis', baubles: true, garland: true, lights: [0.62, 0.3] },
  { y0: 3.8, y1: 8.4, r0: 5.2, r1: 2.5, n: 12, bone: 'pelvis', turn: 0.3, baubles: true, garland: true, lights: [0.62, 0.3] },
  { y0: 6.7, y1: 11.0, r0: 4.45, r1: 2.15, n: 11, bone: 'pelvis', baubles: true, garland: true, lights: [0.62, 0.3] },
  { y0: 9.4, y1: 13.0, r0: 3.8, r1: 1.8, n: 9, bone: 'spine1', turn: 0.2, baubles: true, garland: true, lights: [0.62, 0.3] },
  { y0: 11.7, y1: 14.8, r0: 3.25, r1: 1.6, n: 8, bone: 'spine2', baubles: true, garland: true, lights: [0.62, 0.3] },
  { y0: 13.5, y1: 16.2, r0: 2.9, r1: 1.45, n: 8, bone: 'spine2', turn: 0.4, baubles: true, garland: true, lights: [0.6, 0.28] },
  // the face's tier: nearly straight-sided where the face is, so the hole is a face's width
  { y0: 15.0, y1: 19.1, r0: 2.75, r1: 1.35, n: 8, bone: 'head', flare: 0.85, k: 3, rows: 16, hole: FACE, baubles: true },
  // the tip, a notch to the front so no point hangs over the face; the hat sits on it
  { y0: 18.55, y1: 20.3, r0: 1.8, r1: 0.6, n: 6, bone: 'head', turn: Math.PI / 6, baubles: true, garland: true, lights: [0.62, 0.25] },
];
/** the boughs: frills down each arm, getting smaller to a tip past where the hand would be */
function boughs(sx: number): Tier[] {
  const x = sx * SH, L = sx > 0 ? 'L' : 'R';
  return [
    { y0: 12.1, y1: 14.9, r0: 1.3, r1: 0.55, n: 7, bone: 'arm' + L, x, drop: 0.35, rows: 2 },
    { y0: 10.6, y1: 12.7, r0: 1.15, r1: 0.5, n: 7, bone: 'forearm' + L, x, turn: 0.4, drop: 0.32, rows: 2 },
    { y0: 9.1, y1: 11.3, r0: 0.95, r1: 0.42, n: 6, bone: 'forearm' + L, x, drop: 0.3, rows: 2 },
    { y0: 7.7, y1: 9.8, r0: 0.72, r1: 0.3, n: 5, bone: 'forearm' + L, x, turn: 0.3, drop: 0.25, rows: 2 },
  ];
}
/** how far a hem's points hang below its notches */
const DROP = 0.5;
/** the tiers' flare: a straight cone read as one smooth lampshade; flared like a skirt, each hem stands off the tier below */
const FLARE = 1.4;
const PINE_HEM = 0x3f9a4b, PINE_TOP = 0x123d19;

/** radius of a tier's surface at fraction f of its height (0 hem, 1 top) */
const tierR = (t: Tier, f: number) => t.r1 + (t.r0 - t.r1) * Math.pow(Math.min(1, Math.max(0, 1 - f)), t.flare ?? FLARE);
const tierF = (t: Tier, y: number) => (y - t.y0) / (t.y1 - t.y0);
/** is a point (model frame) in front of the hole, within `m` of its edge? */
const inHole = (h: Hole, x: number, y: number, z: number, m = 0) => z > 0 && (x / (h.a + m)) ** 2 + ((y - h.y) / (h.b + m)) ** 2 < 1;

/**
 * A tier's surface in the model frame: faceted (flat shaded) to sit with the blocky face, shaded from a light hem to a
 * dark top (the shade under each hem is what separates the tiers from the front), and with its hole cut: the triangles
 * whose middles lie in it are dropped, and the rim hides the steps that leaves.
 */
function tierGeo(t: Tier): THREE.BufferGeometry {
  const k = t.k ?? 1, seg = t.n * 2 * k, h = t.y1 - t.y0, cy = (t.y0 + t.y1) / 2, cx = t.x ?? 0, turn = t.turn ?? 0;
  const g = new THREE.CylinderGeometry(t.r1, t.r0, h, seg, t.rows ?? 4, true);
  const p = g.attributes.position as THREE.BufferAttribute;
  const col = new Float32Array(p.count * 3), lo = new THREE.Color(PINE_HEM), hi = new THREE.Color(PINE_TOP), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const f = (y + h / 2) / h, th = Math.atan2(x, z);
    let rr = tierR(t, f), dy = 0;
    if (f < 1e-4) {
      // CylinderGeometry puts vertex j at angle 2πj/seg from +z (x = r sin θ): every 2k-th is a point, zigzag between
      const j = Math.round(th / ((Math.PI * 2) / seg)), m = ((j % (2 * k)) + 2 * k) % (2 * k), w = 1 - Math.min(m, 2 * k - m) / k;
      dy = -(t.drop ?? DROP) * w; rr *= 1 + 0.05 * w;
    }
    p.setXYZ(i, cx + Math.sin(th + turn) * rr, cy + y + dy, Math.cos(th + turn) * rr);
    c.copy(lo).lerp(hi, Math.pow(Math.min(1, Math.max(0, f)), 0.8));
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  if (t.hole) {
    const src = g.index!.array, keep: number[] = [];
    for (let i = 0; i < src.length; i += 3) {
      const a = src[i]!, b = src[i + 1]!, d = src[i + 2]!;
      const mx = (p.getX(a) + p.getX(b) + p.getX(d)) / 3, my = (p.getY(a) + p.getY(b) + p.getY(d)) / 3, mz = (p.getZ(a) + p.getZ(b) + p.getZ(d)) / 3;
      if (!inHole(t.hole, mx, my, mz)) keep.push(a, b, d);
    }
    g.setIndex(keep);
  }
  g.computeVertexNormals();
  return g;
}

/** a point on a tier's surface at angle θ (from +z toward +x) and height fraction f, pushed out by `out` */
function onTier(t: Tier, th: number, f: number, out: number): THREE.Vector3 {
  const r = tierR(t, f) + out;
  return new THREE.Vector3((t.x ?? 0) + Math.sin(th) * r, t.y0 + f * (t.y1 - t.y0), Math.cos(th) * r);
}

/**
 * A rope along a curve whose radius ripples in a twist (ring i, spoke j), flat shaded so its facets glint: tinsel in gold,
 * the hole's rim in green. A plain tube read as a pipe.
 */
function twistGeo(curve: THREE.Curve<THREE.Vector3>, segs: number, r: number, closed: boolean): THREE.BufferGeometry {
  const radial = 6, g = new THREE.TubeGeometry(curve, segs, r, radial, closed);
  const p = g.attributes.position as THREE.BufferAttribute, n = g.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i <= segs; i++) for (let j = 0; j <= radial; j++) {
    const v = i * (radial + 1) + j, k = 0.42 * Math.sin(i * 2.2 + j * ((Math.PI * 2 * 2) / radial));
    p.setXYZ(v, p.getX(v) + n.getX(v) * r * k, p.getY(v) + n.getY(v) * r * k, p.getZ(v) + n.getZ(v) * r * k);
  }
  g.computeVertexNormals();
  return g;
}

// Bulb colours × twinkle phases. Each wearer's materials are its own copies (stage.ts), so the twinkle is per material:
// each bulb takes one of these, and neighbours differ in colour and phase. Each is a draw call per bone: keep it few.
const BULB_COLOURS = [0xff2020, 0xffaa10, 0x2a70ff, 0xff30c0];
const BULB_PHASES = 2;

function dress(d: Dresser): void {
  // Parts are gathered per (bone, material) and merged: several hundred little meshes would be as many draw calls per
  // wearer on a phone that is also running pose detection.
  const buckets = new Map<string, { bone: string; mat: THREE.Material; name: string; geos: THREE.BufferGeometry[] }>();
  const made = new Set<THREE.BufferGeometry>();
  const hang = (o: THREE.Object3D, bone: string, x = 0, y = 0, z = 0) => {
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
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, name = '') => { made.add(g); const o = new THREE.Mesh(g, m); o.name = name; return o; };

  // a faint glow of its own: in its hole, under the hat, the face is in the tree's shade, and it is the one thing to read
  const skin = d.std({ color: 0xf2c193, emissive: 0xf2c193, emissiveIntensity: 0.18, roughness: 0.6 });
  const ink = d.std({ color: 0x15110f, roughness: 0.35 });
  const brownHair = d.std({ color: 0x5b3a20, roughness: 0.8 });
  const blush = d.std({ color: 0xf29a8e, roughness: 0.7 });
  const hat = d.std({ color: 0xf7c519, roughness: 0.35, metalness: 0.05 });
  const pine = d.std({ color: 0xffffff, vertexColors: true, roughness: 0.8, flatShading: true, side: THREE.DoubleSide });
  const needles = d.std({ color: 0x1f5e2a, roughness: 0.85, flatShading: true });
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
    const m = d.std({ color: 0x202020, emissive: BULB_COLOURS[c]!, emissiveIntensity: 1.2, roughness: 0.3, name: `bulb-${c}-${ph}` });
    m.userData.phase = c * 1.9 + ph * Math.PI;
    m.userData.rate = 1.5 + 0.6 * ((c + ph * 3) % 4);
    bulbMats.push(m);
  }
  const baubleG = new THREE.SphereGeometry(0.36, 12, 8), capG = new THREE.CylinderGeometry(0.1, 0.1, 0.16, 6);
  const bulbG = new THREE.SphereGeometry(0.24, 8, 6);
  let bi = 0, li = 0;
  const bauble = (bone: string, p: THREE.Vector3, s = 1) => {
    const b = mesh(baubleG, baubleMats[bi++ % baubleMats.length]!); b.scale.setScalar(s); hang(b, bone, p.x, p.y, p.z);
    const c = mesh(capG, tinsel); c.scale.setScalar(s); hang(c, bone, p.x, p.y + 0.38 * s, p.z);
  };
  const bulb = (bone: string, p: THREE.Vector3, s = 1) => {
    const b = mesh(bulbG, bulbMats[(li++ * 5 + bi) % bulbMats.length]!, 'bulb');
    b.scale.set(s, 1.3 * s, s);
    hang(b, bone, p.x, p.y, p.z);
  };

  // ---- the tree ----
  for (const [ti, t] of [...TIERS, ...boughs(1), ...boughs(-1)].entries()) {
    hang(mesh(tierGeo(t), pine), t.bone);
    // nothing on the head's tiers hangs over the face (the tip's baubles reached its rim)
    const ok = (p: THREE.Vector3) => t.bone !== 'head' || !inHole(FACE, p.x, p.y, p.z, RIM + 0.5);
    // baubles hang from alternate points of the hem, the tiers turned against each other so they don't stack
    if (t.baubles) {
      const step = (Math.PI * 2) / t.n, s = Math.min(1.25, 0.75 + t.r0 * 0.1);
      for (let k = ti % 2; k < t.n; k += 2) {
        const th = k * step + (t.turn ?? 0), r = t.r0 * 1.05 + 0.1 * s, y = t.y0 - (t.drop ?? DROP) - 0.36 * s;
        const p = new THREE.Vector3(Math.sin(th) * r, y, Math.cos(th) * r);
        if (ok(p)) bauble(t.bone, p, s);
      }
    }
    // the garland: one gold turn round the tier, low at the hem to high under the next tier's hem, so the turns read as
    // one spiral up the tree however the body bends
    if (t.garland) {
      const pts: THREE.Vector3[] = [], th0 = ti * 1.9;
      for (let i = 0; i <= 48; i++) { const u = i / 48; pts.push(onTier(t, th0 + u * Math.PI * 2, 0.18 + 0.64 * u, 0.13)); }
      hang(mesh(twistGeo(new THREE.CatmullRomCurve3(pts), 120, 0.15 + t.r0 * 0.012, false), garland), t.bone);
    }
    // the lights: a wire swagged round the tier between pins, a bulb at each swag's low point and either side of it
    if (t.lights) {
      const [fTop, sag] = t.lights, swags = t.n - 2, th0 = 0.4 + ti * 0.7, s = Math.min(1.3, 0.8 + t.r0 * 0.1);
      const at = (u: number) => { const q = Math.sin(u * Math.PI * swags); return onTier(t, th0 + u * Math.PI * 2, fTop - sag * q * q, 0.1); };
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < 96; i++) pts.push(at(i / 96));
      hang(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 192, 0.045, 4, true), wire), t.bone);
      for (let q = 0; q < swags; q++) for (const du of [0.3, 0.7]) {
        const p = at((q + du) / swags);
        if (ok(p)) bulb(t.bone, new THREE.Vector3(p.x * 1.04, p.y - 0.22 * s, p.z * 1.04), s);
      }
    }
  }
  // the boughs' ends: a cap where each meets the shoulder (seen from above when the arm is raised), a point past the hand,
  // a bauble and a few lights on the forearm
  for (const sx of [-1, 1]) {
    const L = sx > 0 ? 'L' : 'R', x = sx * SH;
    const cap = mesh(new THREE.SphereGeometry(0.75, 10, 6), needles); hang(cap, 'arm' + L, x, 14.55, 0);
    const tip = mesh(new THREE.ConeGeometry(0.42, 1.5, 8), needles); tip.rotation.x = Math.PI; hang(tip, 'forearm' + L, x, 7.1, 0);
    bauble('forearm' + L, new THREE.Vector3(x + sx * 0.75, 9.95, 0.35), 0.8);
    bauble('forearm' + L, new THREE.Vector3(x - sx * 0.2, 8.55, 0.7), 0.7);
    for (const [y, th] of [[11.6, 0.3], [10.2, -0.5], [8.8, 0.9], [12.9, -0.2]] as const) {
      const r = 0.95 - (12.9 - y) * 0.1;
      bulb('forearm' + L, new THREE.Vector3(x + Math.sin(th * sx) * r, y, Math.cos(th) * r), 0.85);
    }
  }

  // ---- the face, through its hole: a soft oval just behind the tree's surface, a rim of needles round it ----
  const ft = TIERS.find((t) => t.hole)!, faceR = tierR(ft, tierF(ft, FACE.y));
  const FZ = faceR - 0.6, FRX = 1.5, FRY = 1.32, FRZ = 0.55;
  /** the face's front at (x, y), so its features sit on it */
  const faceZ = (x: number, y: number) => FZ + FRZ * Math.sqrt(Math.max(0, 1 - (x / FRX) ** 2 - ((y - FACE.y) / FRY) ** 2));
  const faceM = mesh(new THREE.SphereGeometry(1, 24, 16), skin); faceM.scale.set(FRX, FRY, FRZ); hang(faceM, 'head', 0, FACE.y, FZ);
  const eyeG = new THREE.SphereGeometry(0.2, 12, 8);
  for (const sx of [-1, 1]) {
    const e = mesh(eyeG, ink); e.scale.set(0.8, 1.3, 0.45); hang(e, 'head', sx * 0.5, 17.5, faceZ(sx * 0.5, 17.5));
    const c = mesh(eyeG, blush); c.scale.set(1.3, 0.8, 0.3); hang(c, 'head', sx * 0.88, 16.95, faceZ(sx * 0.88, 16.95) - 0.02);
    // the moustache: two chunky lobes swept out and down, a builder's
    const m = mesh(new THREE.BoxGeometry(0.78, 0.32, 0.3), brownHair); m.rotation.set(0, sx * 0.25, sx * -0.22);
    hang(m, 'head', sx * 0.37, 16.9, faceZ(sx * 0.37, 16.9) + 0.02);
  }
  // the smile sits low enough that its ends clear the moustache (higher, only its bottom showed and it read as an "O")
  const smile = mesh(new THREE.TorusGeometry(0.46, 0.075, 6, 18, 2.3), ink);
  smile.rotation.z = -Math.PI / 2 - 1.15;
  hang(smile, 'head', 0, 16.85, faceZ(0, 16.4) + 0.02);
  // the rim follows the tree's surface round the hole; gold tinsel just outside it, and a ring of lights round that
  const ring = (a: number, b: number, out: number) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 64; i++) {
      const u = (i / 64) * Math.PI * 2, x = Math.cos(u) * a, y = FACE.y + Math.sin(u) * b, r = tierR(ft, tierF(ft, y)) + out;
      pts.push(new THREE.Vector3(x, y, Math.sqrt(Math.max(0, r * r - x * x))));
    }
    return new THREE.CatmullRomCurve3(pts, true);
  };
  hang(mesh(twistGeo(ring(FACE.a, FACE.b, 0.05), 96, RIM, true), needles), 'head');
  hang(mesh(twistGeo(ring(FACE.a + 0.38, FACE.b + 0.38, 0.06), 96, 0.12, true), garland), 'head');
  for (let i = 0; i < 12; i++) {
    const u = ((i + 0.5) / 12) * Math.PI * 2, x = Math.cos(u) * (FACE.a + 0.72), y = FACE.y + Math.sin(u) * (FACE.b + 0.72);
    const r = tierR(ft, tierF(ft, y)) + 0.12;
    bulb('head', new THREE.Vector3(x, y, Math.sqrt(Math.max(0, r * r - x * x))), 0.9);
  }

  // ---- the hard hat on top, where the star would be: tipped up at the front and a little to one side, about the back of
  // its crown, as a man lifts his hat to say "good day"; the tip of the tree stays under it. Its brim is a ring and its
  // inside a dark lining: a solid brim, tipped toward the camera, read as a yellow disc ----
  const HS = 1.2, hatG = new THREE.Group();
  const dome = mesh(new THREE.SphereGeometry(1, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), hat); dome.scale.set(1.66 * HS, 1.42 * HS, 1.72 * HS); hatG.add(dome);
  const crest = mesh(new THREE.TorusGeometry(1, 0.11, 6, 20, Math.PI), hat); crest.rotation.y = Math.PI / 2; crest.scale.copy(dome.scale); hatG.add(crest);
  const brimG = new THREE.LatheGeometry([new THREE.Vector2(0.8, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 0.09), new THREE.Vector2(0.8, 0.09), new THREE.Vector2(0.8, 0)], 32);
  const brim = mesh(brimG, hat); brim.scale.set(2.05 * HS, 1, 2.2 * HS); brim.position.set(0, -0.02, 0.22 * HS); hatG.add(brim);
  const lining = mesh(new THREE.CircleGeometry(1, 24), d.std({ color: 0x7a6a52, roughness: 0.9 }));
  lining.rotation.x = Math.PI / 2; lining.scale.set(1.62 * HS, 1.68 * HS, 1); lining.position.y = 0.04; hatG.add(lining);
  const back = -1.3 * HS;
  hatG.position.set(0, 0, -back);
  const tipG = new THREE.Group();
  tipG.add(hatG);
  // ~33° in all, mostly to the side and a little back: tipped straight back, from the front (where the camera is) it
  // showed only its brim and lining, a halo; canted to the side, the crown keeps its profile and reads as a jaunty tip
  tipG.rotation.set(-0.26, 0, 0.5, 'ZXY');
  hang(tipG, 'head', 0, 19.65, back);

  for (const b of buckets.values()) {
    const a = d.segs.find((s) => s.name === b.bone)!.a;
    const g = mergeGeometries(b.geos);
    for (const x of b.geos) x.dispose();
    if (!g) throw new Error(`builder: parts on ${b.bone} would not merge`);
    g.translate(-a[0], -a[1], -a[2]);
    const m = new THREE.Mesh(g, b.mat);
    m.name = b.name;
    d.at(m, b.bone, a[0], a[1], a[2]);
    // the face takes no shadow: the hat and the rim put it in the dark in the app, where it is what people look for
    if (b.mat === skin || b.mat === ink || b.mat === blush || b.mat === brownHair) m.receiveShadow = false;
  }
  for (const g of made) g.dispose();
}

/** per root: its bulb materials, found once (a WeakMap, not userData: clone JSON-copies userData) */
const found = new WeakMap<THREE.Object3D, THREE.MeshStandardMaterial[]>();

function tick(root: THREE.Object3D, t: number): void {
  let bulbs = found.get(root);
  if (!bulbs) {
    const set = new Set<THREE.MeshStandardMaterial>();
    root.traverse((o) => { const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined; if (o.name === 'bulb' && m) set.add(m); });
    bulbs = [...set];
    found.set(root, bulbs);
  }
  // each group swells to bright and falls back on its own clock; cubed so a bulb spends most of its time lit low and
  // flashes, never dark (a dark bulb read as a hole in the tree). Past ~2 the tone mapping turns a pure colour pastel, so
  // the peak stays under it: the flash is the few hot ones among many saturated ones
  for (const m of bulbs) {
    const s = 0.5 + 0.5 * Math.sin(t * (m.userData.rate as number) + (m.userData.phase as number));
    m.emissiveIntensity = 0.55 + 1.35 * s * s * s;
  }
}

export const BUILDER: CharacterDef = {
  // "Tree Builder" truncated in the picker's cell ("Tree Buil…"); the thumbnail shows the tree
  id: 'builder', name: 'Builder', blurb: 'A builder in a Christmas tree costume, tipping his hat',
  segs: BUILDER_SEGMENTS,
  dress,
  tick,
  // rigid boughs: stretched, their frills part at the elbow, so they keep near their own lengths (already a person's)
  fit: { size: 1.0, limb: 0.2 },
};
