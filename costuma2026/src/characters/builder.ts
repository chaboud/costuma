// The Tree Builder: a blocky builder in a Christmas-tree costume (founder, 2026-10-31: "Christmas tree builder man from
// Forsaken"; then "no body except face (through a cut-hole) is exposed... the hard hat serves as the star"; then two
// reference pictures of the look he wants). Modelled on those pictures as an ORIGINAL build, no game's mesh or texture:
// one tall lime cone of six low-poly tiers with saw-toothed hems, a pale blocky face with grumpy brows looking out of a
// hole high in the second tier from the top, a few small balls hanging on strings, and on the point, tipped, a black hard
// hat with orange panels and a gold four-pointed star.
//
// Built rigid: every part is a mesh hung on one bone (build.ts `dress`), so nothing stretches or tears. The tiers ride the
// bones of the body they cover: the skirt on the pelvis (the legs carry nothing; they walk inside it), the middle on
// spine1 and spine2, the tier with the face hole and the point with the hat on the head, so the face never slides out of
// its hole when the wearer turns their head. No arms: the cone hides them.
//
// Frame: metres for a ~24-unit figure on y = 0, +y up, +z its face, +x its own left (build.ts).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { CharacterDef, Dresser, FaceState } from './build';
import type { Seg } from './sdf';

// Straight vertical limbs, as a person's at rest; the arms and legs carry nothing but the rig needs them.
export const BUILDER_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 9.6, 0], b: [0, 10.8, 0], parent: null },
  { name: 'spine1', a: [0, 10.8, 0], b: [0, 12.6, 0], parent: 'pelvis' },
  { name: 'spine2', a: [0, 12.6, 0], b: [0, 15.0, 0], parent: 'spine1' },
  { name: 'neck', a: [0, 15.0, 0], b: [0, 15.9, 0], parent: 'spine2' },
  { name: 'head', a: [0, 15.9, 0], b: [0, 18.4, 0], parent: 'neck' },
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
  { name: 'armL', a: [2.75, 14.4, 0], b: [2.75, 11.9, 0], parent: 'spine2' },
  { name: 'forearmL', a: [2.75, 11.9, 0], b: [2.75, 9.5, 0], parent: 'armL' },
  { name: 'armR', a: [-2.75, 14.4, 0], b: [-2.75, 11.9, 0], parent: 'spine2' },
  { name: 'forearmR', a: [-2.75, 11.9, 0], b: [-2.75, 9.5, 0], parent: 'armR' },
];

/** the face hole, a rounded rectangle (superellipse, exponent P): centred on the head bone's middle, which the stage's
 * neck fit puts on the wearer's head */
interface Hole { y: number; a: number; b: number }
const FACE: Hole = { y: 17.15, a: 1.6, b: 1.62 };
const P = 3;

/**
 * A tier: a ten-sided frustum from its hem (y0, r0) up to (y1, r1), flat sided, the hem's corners and mid-sides hanging
 * as saw teeth. `cols` facets per side (a hole needs a finer surface to cut), `rows` up the height.
 */
interface Tier { y0: number; y1: number; r0: number; r1: number; bone: string; flare?: number; cols?: number; rows?: number; hole?: Hole }
const SIDES = 10;
/** a flat side faces the front, as in the pictures, and the face hole sits in it */
const TURN = Math.PI / SIDES;
/** how far a hem's teeth hang below its notches (each tooth a little more or less: the pictures' hems are hand-cut) */
const DROP = 0.38;

/**
 * Bottom up. The pictures' tree is stubby, about 0.7 as wide as it is tall, and its upper tiers stay wide: the face and
 * the hem are pinned to the wearer's head and the floor, so the look comes from the widths. Each hem stands well off the
 * tier below (a lip with a shade under it, as in the pictures) and overlaps its top, so a bend opens no gap.
 */
const TIERS: Tier[] = [
  { y0: 0.35, y1: 5.2, r0: 7.8, r1: 5.0, bone: 'pelvis' },
  { y0: 3.9, y1: 8.7, r0: 7.1, r1: 4.4, bone: 'pelvis' },
  { y0: 7.3, y1: 12.0, r0: 6.3, r1: 3.8, bone: 'spine1' },
  { y0: 10.6, y1: 15.0, r0: 5.4, r1: 3.2, bone: 'spine2' },
  // the face's tier: the hole high in it, as in the pictures, under the point
  // (flared hard at the hem and narrow at the face, so the face stays near the wearer's head axis: on a wide tier it sat
  // a third of a metre in front of it, and a turned head would swing it off theirs)
  { y0: 13.5, y1: 20.0, r0: 4.7, r1: 2.4, bone: 'head', flare: 1.8, cols: 6, rows: 20, hole: FACE },
  // the point, broad and tall as in the pictures; the hat sits on it
  { y0: 19.25, y1: 23.7, r0: 3.4, r1: 0.05, bone: 'head', flare: 1 },
];
const LIME = 0x8fd14f, LIME_SHADE = 0x2c5c16;

/** radius (to the corners) of a tier at fraction f of its height (0 hem, 1 top): flared, so each hem stands off the tier below */
const tierR = (t: Tier, f: number) => t.r1 + (t.r0 - t.r1) * Math.pow(Math.min(1, Math.max(0, 1 - f)), t.flare ?? 1.25);
/** a cheap hash in [0, 1): the teeth's lengths */
const hash = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
/** the point of a ten-sided ring of corner radius rc at fraction u ∈ [0, SIDES) round it, on its flat sides */
function ring(rc: number, u: number): [number, number] {
  const s = Math.floor(u), w = u - s, a0 = TURN + (s / SIDES) * Math.PI * 2, a1 = TURN + ((s + 1) / SIDES) * Math.PI * 2;
  return [rc * (Math.sin(a0) + (Math.sin(a1) - Math.sin(a0)) * w), rc * (Math.cos(a0) + (Math.cos(a1) - Math.cos(a0)) * w)];
}
/** the tier's surface in front at (x, y): its z on the flat side that x crosses */
function frontZ(t: Tier, x: number, y: number): number {
  const rc = tierR(t, (y - t.y0) / (t.y1 - t.y0));
  for (let s = 0; s < SIDES; s++) {
    const [x0, z0] = ring(rc, s), [x1, z1] = ring(rc, s + 1);
    if (z0 + z1 > 0 && (x - x0) * (x - x1) <= 0 && x0 !== x1) return z0 + ((x - x0) / (x1 - x0)) * (z1 - z0);
  }
  return Math.sqrt(Math.max(0, rc * rc - x * x));
}
const holeRho = (h: Hole, x: number, y: number) => Math.pow(Math.abs(x / h.a) ** P + Math.abs((y - h.y) / h.b) ** P, 1 / P);
const FACE_TIER = TIERS.find((t) => t.hole)!;
/** the face's front: set back in the hole, so the hole's edge and its dark inside frame it (flush, it read as pasted on) */
const FACE_Z = frontZ(FACE_TIER, 0, FACE.y) - 0.3;
/** the eyes, also where googly eyes are glued on (face.eyes) */
const EYE_X = 0.56, EYE_Y = 17.4;

/**
 * A tier's surface in the model frame, shaded from the lime hem to a darker top (the shade under the next hem, which is
 * what separates the tiers), with its hole cut: the triangles in it are dropped and the vertices round its edge are moved
 * onto the edge along the tree's surface, so the cut is clean without a rim to hide its steps.
 */
function tierGeo(t: Tier): THREE.BufferGeometry {
  const C = t.cols ?? 2, R = t.rows ?? 2, N = SIDES * C, h = t.y1 - t.y0;
  const pos: number[] = [], col: number[] = [], lo = new THREE.Color(LIME), hi = new THREE.Color(LIME_SHADE), c = new THREE.Color();
  // rows top down and columns round with the angle, as CylinderGeometry's: the same winding, outward
  for (let i = 0; i <= R; i++) {
    const f = 1 - i / R, rc = tierR(t, f);
    for (let j = 0; j <= N; j++) {
      let [x, z] = ring(rc, j / C), y = t.y0 + f * h;
      if (i === R && j % 2 === 0) {
        const k = j % N, w = 0.6 + 0.8 * hash(k + t.y0 * 7);
        y -= DROP * w; x *= 1.04; z *= 1.04;
      }
      pos.push(x, y, z);
      // lime down most of the band, darkening only where the next hem's lip overhangs it
      const k = Math.min(1, Math.max(0, (f - 0.25) / 0.4));
      c.copy(lo).lerp(hi, k * k * (3 - 2 * k));
      col.push(c.r, c.g, c.b);
    }
  }
  const idx: number[] = [];
  for (let i = 0; i < R; i++) for (let j = 0; j < N; j++) {
    const a = i * (N + 1) + j, b = a + N + 1, cc = b + 1, d = a + 1;
    idx.push(a, b, d, b, cc, d);
  }
  if (t.hole) {
    const H = t.hole, keep: number[] = [], edge = new Set<number>(), kept = new Set<number>();
    for (let q = 0; q < idx.length; q += 3) {
      const v = [idx[q]!, idx[q + 1]!, idx[q + 2]!];
      const mx = (pos[v[0]! * 3]! + pos[v[1]! * 3]! + pos[v[2]! * 3]!) / 3, my = (pos[v[0]! * 3 + 1]! + pos[v[1]! * 3 + 1]! + pos[v[2]! * 3 + 1]!) / 3;
      const mz = (pos[v[0]! * 3 + 2]! + pos[v[1]! * 3 + 2]! + pos[v[2]! * 3 + 2]!) / 3;
      if (mz > 0 && holeRho(H, mx, my) < 1) for (const k of v) edge.add(k);
      else { keep.push(...v); for (const k of v) kept.add(k); }
    }
    for (const k of edge) {
      if (!kept.has(k)) continue;
      const x = pos[k * 3]!, y = pos[k * 3 + 1]!, rho = holeRho(H, x, y);
      if (rho < 0.3) continue;
      const nx = x / rho, ny = H.y + (y - H.y) / rho;
      pos[k * 3] = nx; pos[k * 3 + 1] = ny; pos[k * 3 + 2] = frontZ(t, nx, ny);
    }
    idx.length = 0; idx.push(...keep);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/**
 * The ornaments, sparse as in the pictures and most of them in front: tier, the hem's corner they hang from (a tooth;
 * corner s is at 18° + 36°·s from the front, so 0 and −1 flank its middle), string length, colour. None hangs over the face.
 */
const BALLS: [number, number, number, number][] = [
  [0, -3, 0.6, 2], [0, 0, 0.7, 4], [0, 2, 0.55, 0],
  [1, -1, 0.9, 0], [1, 1, 0.6, 3], [1, -4, 0.6, 1],
  [2, -2, 0.6, 1], [2, 2, 0.7, 2],
  [3, -1, 0.6, 4], [3, 1, 0.55, 1],
  [4, -2, 0.45, 1], [4, 1, 0.45, 2],
  [5, -2, 0.35, 0], [5, 1, 0.35, 2],
];
const BALL_COLOURS = [0xd8262e, 0x2b4fd6, 0x8a3fd0, 0xe04aa8, 0xf07a1a];

function dress(d: Dresser): void {
  // Parts are gathered per (bone, material) and merged: a draw call per part would be many per wearer on a phone that is
  // also running pose detection. The face's moving parts (eyes, brows, mouth) stay their own meshes, for tick.
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

  const lime = d.std({ color: 0xffffff, vertexColors: true, roughness: 0.95, metalness: 0, flatShading: true, side: THREE.DoubleSide });
  // the face is the one thing to read, deep in its hole under the hat: a faint glow of its own keeps it out of the shade
  const head = d.std({ color: 0xc4c1d0, emissive: 0xc4c1d0, emissiveIntensity: 0.05, roughness: 0.75 });
  const ink = d.std({ color: 0x141216, roughness: 0.5 });
  const string = d.std({ color: 0x222222, roughness: 0.8 });
  const ballMats = BALL_COLOURS.map((c) => d.std({ color: c, roughness: 0.35, metalness: 0.15 }));
  const black = d.std({ color: 0x1e1e22, roughness: 0.45, metalness: 0.1 });
  const orange = d.std({ color: 0xf0861c, roughness: 0.45, metalness: 0.05 });
  const gold = d.std({ color: 0xe8b83a, emissive: 0xffb81a, emissiveIntensity: 0.25, roughness: 0.25, metalness: 0.85 });

  // ---- the tree, and its balls on their strings ----
  for (const t of TIERS) hang(mesh(tierGeo(t), lime), t.bone);
  const ballG = new THREE.SphereGeometry(0.34, 12, 8), strG = new THREE.CylinderGeometry(0.035, 0.035, 1, 4);
  for (const [ti, tooth, len, ci] of BALLS) {
    const t = TIERS[ti]!, [x, z] = ring(t.r0 * 0.99, ((tooth % SIDES) + SIDES) % SIDES), top = t.y0 - DROP * 0.55;
    const L = len * 1.2, s = mesh(strG, string); s.scale.y = L; hang(s, t.bone, x, top - L / 2, z);
    hang(mesh(ballG, ballMats[ci]!), t.bone, x, top - L - 0.3, z);
  }

  // ---- the face: a pale block, a hair behind the hole's edge; small eyes under grumpy brows, a flat mouth ----
  hang(mesh(new RoundedBoxGeometry(3.0, 3.0, 2.3, 3, 0.8), head), 'head', 0, FACE.y - 0.05, FACE_Z - 1.15);
  // the moving parts are hung as they are, unmerged, and keep their geometry (not in `made`, which is freed below)
  const own = (m: THREE.Mesh, x: number, y: number, z: number) => { d.at(m, 'head', x, y, z).traverse((o) => { o.receiveShadow = false; }); };
  for (const sx of [1, -1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), ink); e.scale.set(1, 1.45, 0.5); e.name = sx > 0 ? 'eyeL' : 'eyeR';
    own(e, sx * EYE_X, EYE_Y, FACE_Z + 0.02);
    // slanted down to the middle: determined, a little grumpy (the pictures' look)
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.16, 0.1), ink); b.rotation.z = sx * 0.38; b.name = sx > 0 ? 'browL' : 'browR';
    own(b, sx * 0.62, 17.92, FACE_Z + 0.04);
  }
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.12, 0.1), ink); mouth.rotation.z = 0.12; mouth.name = 'mouth';
  own(mouth, 0.08, 16.5, FACE_Z + 0.03);

  // ---- the hard hat on the point, where a star would be: black with four orange panels between its ribs, a gold
  // four-pointed star on the front; tipped to the side about the point (~22°), which stays inside it. To the side and a
  // little forward, as it sits in the pictures: tipped back, from below it showed its underside and hid the star ----
  const hatG = new THREE.Group();
  const HR = [2.4, 2.25, 2.45] as const;
  const dome = mesh(new THREE.SphereGeometry(1, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), black); dome.scale.set(...HR); hatG.add(dome);
  // orange bands between wide black ribs front, back and to the sides (SphereGeometry's φ = 0 is −x, π/2 is +z), off the
  // crown and the band: black with orange segments, as in the pictures (wider bands read as an orange hat)
  const RIB = 0.95;
  for (let q = 0; q < 4; q++) {
    const p = mesh(new THREE.SphereGeometry(1, 8, 6, q * (Math.PI / 2) + RIB / 2, Math.PI / 2 - RIB, 0.1 * Math.PI, 0.27 * Math.PI), orange);
    p.scale.set(HR[0] * 1.012, HR[1] * 1.012, HR[2] * 1.012); hatG.add(p);
  }
  const brimG = new THREE.LatheGeometry([new THREE.Vector2(0.96, 0), new THREE.Vector2(1.08, 0), new THREE.Vector2(1.08, 0.12), new THREE.Vector2(0.96, 0.12), new THREE.Vector2(0.96, 0)], 24);
  const brim = mesh(brimG, black); brim.scale.set(HR[0], 1, HR[2] * 1.06); brim.position.set(0, -0.02, 0.1); hatG.add(brim);
  // the open underside closed with a dark lining: seen from below (the camera is at the wearer's chest, the hat over their
  // head) the single-sided dome vanished from inside and left only its brim, a black ring
  const lining = mesh(new THREE.CircleGeometry(1, 20), d.std({ color: 0x2a2620, roughness: 0.9 }));
  lining.rotation.x = Math.PI / 2; lining.scale.set(HR[0] * 0.99, HR[2] * 0.99, 1); lining.position.y = 0.01; hatG.add(lining);
  const star = new THREE.Shape();
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 2 + (i * Math.PI) / 4, r = i % 2 ? 0.24 : 0.85;
    if (i) star.lineTo(Math.cos(a) * r, Math.sin(a) * r); else star.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const starG = new THREE.ExtrudeGeometry(star, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 1 });
  const sy = 0.95, starM = mesh(starG, gold); starM.scale.setScalar(1.5);
  starM.position.set(0, sy, HR[2] * Math.sqrt(1 - (sy / HR[1]) ** 2) + 0.02); starM.rotation.x = -0.45; hatG.add(starM);
  hatG.position.y = -0.8; // the point reaches into the dome
  const tip = new THREE.Group();
  tip.add(hatG);
  tip.rotation.set(0.12, 0, 0.36, 'ZXY');
  hang(tip, 'head', 0, TIERS[TIERS.length - 1]!.y1, 0);

  for (const b of buckets.values()) {
    const a = d.segs.find((s) => s.name === b.bone)!.a;
    const g = mergeGeometries(b.geos);
    for (const x of b.geos) x.dispose();
    if (!g) throw new Error(`builder: parts on ${b.bone} would not merge`);
    g.translate(-a[0], -a[1], -a[2]);
    const m = new THREE.Mesh(g, b.mat);
    m.name = b.name;
    d.at(m, b.bone, a[0], a[1], a[2]);
    // the face takes no shadow: the hat and the hole's edge put it in the dark, and it is what people look for
    if (b.mat === head) m.receiveShadow = false;
  }
  for (const g of made) g.dispose();
}

/** per root: the face's moving parts and their rest poses, found once (a WeakMap, not userData: clone JSON-copies it) */
interface Parts { eyes: THREE.Object3D[]; brows: { o: THREE.Object3D; y: number; z: number }[]; mouth: THREE.Object3D | null }
const found = new WeakMap<THREE.Object3D, Parts>();

/** the wearer's face moves the costume's: brows lift, the mouth opens and widens, the eyes blink (face tracking on) */
function tick(root: THREE.Object3D, _t: number, face?: FaceState | null): void {
  let p = found.get(root);
  if (!p) {
    const q: Parts = { eyes: [], brows: [], mouth: null };
    root.traverse((o) => {
      if (o.name === 'eyeL' || o.name === 'eyeR') q.eyes.push(o);
      else if (o.name === 'browL' || o.name === 'browR') q.brows.push({ o, y: o.position.y, z: o.rotation.z });
      else if (o.name === 'mouth') q.mouth = o;
    });
    found.set(root, p = q);
  }
  const f = face ?? null;
  for (const e of p.eyes) e.scale.y = 1.45 * (1 - 0.88 * (f ? (e.name === 'eyeL' ? f.blinkL : f.blinkR) : 0));
  for (const b of p.brows) { b.o.position.y = b.y + 0.22 * (f?.browUp ?? 0); b.o.rotation.z = b.z * (1 - 0.7 * (f?.browUp ?? 0)); }
  if (p.mouth) { p.mouth.scale.y = 1 + 5 * (f?.jaw ?? 0); p.mouth.scale.x = 1 + 0.4 * (f?.smile ?? 0) - 0.35 * (f?.pucker ?? 0); }
}

export const BUILDER: CharacterDef = {
  // "Tree Builder" truncated in the picker's cell ("Tree Buil…"); the thumbnail shows the tree
  id: 'builder', name: 'Builder', blurb: 'A builder in a Christmas tree costume, tipping his hat',
  segs: BUILDER_SEGMENTS,
  dress,
  tick,
  // nothing hangs on the limbs, so their length is moot; the torso fit sizes the cone
  fit: { size: 1.0, limb: 0.2 },
  // googly eyes go over his small dot eyes, a little proud of the face
  face: { eyes: [[EYE_X, EYE_Y, FACE_Z + 0.1, 0.26], [-EYE_X, EYE_Y, FACE_Z + 0.1, 0.26]] },
};
