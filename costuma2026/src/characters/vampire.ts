// The Count: a classic vampire, an original design (no film's likeness). A pale grey-white face with high cheekbones,
// hollow cheeks and pointed ears, slick black hair with a widow's peak, sharp black brows, faintly glowing red eyes; a
// black tailcoat over a red waistcoat and a white shirt, a gold medallion on a red ribbon; and the cape: black satin
// lined in red, from a tall stiff collar that rises behind the head to the calves.
//
// How it is made (the parts that are not the usual SDF body):
// - **The head is rigid meshes**, polygonised from its own field at a finer grid than the body's (a face at the body's
//   ~0.2-unit cells is a blob): the skull and upper face on the head bone, the lower jaw on the jaw bone, split along the
//   mouth line back to the hinge. The cut faces are the mouth's inside (dark, a row of teeth at the front), so an open
//   mouth (`face.jaw`) opens a dark mouth, and the two fangs hanging from the upper jaw, hidden in the lower lip while it
//   is shut, show.
// - **The cape and its collar are parametric sheets**, skinned with weights written per vertex (`skinSheet`), not by
//   distance: its middle hangs from the shoulders on the tail bones (the idle sway), its sides follow the arms — the
//   upper arm over the shoulder and down to the elbow, the forearm to the hand, fading below the hand to nothing at the
//   hem — so raised arms spread it as a bat's wings, lining out. One double-sided material: black outside, red inside.
// - **The tux front is drawn in the body's shader** (bind-pose position, as Jack's flannel): the jacket's V, the
//   lapels, the waistcoat, the shirt and its studs stay crisp at any distance where vertex colours would stair-step.
//
// The helpers marked `export` are shared with the witch (witch.ts).
//
// Frame: the hero's (hero.ts) — 20 units tall on y = 0, +y up, +z forward, +x the Count's own left.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Box, Capture, CharacterDef, Dresser, FaceState, Field } from './build';
import { sdCapsule, sdEllipsoid, smin, type Seg } from './sdf';
import { isoGeometry } from './skeleton';

export type V3 = [number, number, number];

export const sstep = (a: number, b: number, x: number): number => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
/** smooth max: carves `b` out of `a` with a fillet of `k` */
export const smax = (a: number, b: number, k: number): number => -smin(-a, -b, k);

// ---------------------------------------------------------------------------------------------------------------------
// shared kit (the witch uses these too)

/**
 * A grid surface P(u, v), u ∈ [-1, 1] across and v ∈ [0, 1] along, indexed and smooth-shaded; wound so that ∂u × ∂v is
 * its front face (`flip` the other way). `uv` carries (u, v) remapped to 0..1 for the weights.
 */
export function sheetGeometry(nu: number, nv: number, at: (u: number, v: number, out: THREE.Vector3) => void, flip = false, wrap = false): THREE.BufferGeometry {
  const n = (nu + 1) * (nv + 1);
  const pos = new Float32Array(n * 3), uv = new Float32Array(n * 2);
  const p = new THREE.Vector3();
  for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
    const k = j * (nu + 1) + i, u = -1 + (2 * i) / nu, v = j / nv;
    at(u, v, p);
    pos[k * 3] = p.x; pos[k * 3 + 1] = p.y; pos[k * 3 + 2] = p.z;
    uv[k * 2] = (u + 1) / 2; uv[k * 2 + 1] = v;
  }
  const idx: number[] = [];
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, e = c + 1;
    if (flip) idx.push(a, c, b, b, c, e); else idx.push(a, b, c, b, e, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  if (wrap) {
    // a closed sheet (u = -1 meets u = 1): the seam's two columns share a normal, or it shows as a crease
    const nr = g.attributes.normal!, a = new THREE.Vector3(), b = new THREE.Vector3();
    for (let j = 0; j <= nv; j++) {
      const i0 = j * (nu + 1), i1 = i0 + nu;
      a.fromBufferAttribute(nr, i0).add(b.fromBufferAttribute(nr, i1)).normalize();
      nr.setXYZ(i0, a.x, a.y, a.z); nr.setXYZ(i1, a.x, a.y, a.z);
    }
  }
  return g;
}

/** a bone and its share of a vertex */
export type Influence = [string, number];

/** Skin weights on `geo` from `weigh` (given each vertex's position and its sheet's u in -1..1 and v in 0..1): the four
 *  heaviest, normalised. */
export function setSkin(d: Dresser, geo: THREE.BufferGeometry, weigh: (x: number, y: number, z: number, u: number, v: number) => Influence[]): void {
  const pos = geo.attributes.position!, uv = geo.attributes.uv;
  const index = new Map(d.segs.map((s, i) => [s.name, i] as const));
  const si = new Uint16Array(pos.count * 4), sw = new Float32Array(pos.count * 4);
  for (let i = 0; i < pos.count; i++) {
    const ws = weigh(pos.getX(i), pos.getY(i), pos.getZ(i), uv ? uv.getX(i) * 2 - 1 : 0, uv ? uv.getY(i) : 0).filter((w) => w[1] > 1e-4);
    ws.sort((a, b) => b[1] - a[1]);
    const k = Math.min(4, ws.length);
    let sum = 0;
    for (let j = 0; j < k; j++) sum += ws[j]![1];
    for (let j = 0; j < k; j++) { si[i * 4 + j] = index.get(ws[j]![0]) ?? 0; sw[i * 4 + j] = sum > 0 ? ws[j]![1] / sum : 0; }
    if (k === 0) { si[i * 4] = index.get('spine2') ?? 0; sw[i * 4] = 1; }
  }
  geo.setAttribute('skinIndex', new THREE.BufferAttribute(si, 4));
  geo.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
}

/** A skinned mesh on the body's skeleton (as the fur's layers are), for geometry carrying its own weights (setSkin). */
export function bindSkinned(d: Dresser, geo: THREE.BufferGeometry, mat: THREE.Material, name: string): THREE.SkinnedMesh | null {
  const body = d.bones.get('pelvis')!.parent as THREE.SkinnedMesh | null;
  if (!body?.isSkinnedMesh) return null;
  const m = new THREE.SkinnedMesh(geo, mat);
  m.name = name;
  m.castShadow = true;
  m.receiveShadow = true;
  m.frustumCulled = false;
  body.add(m);
  m.bind(body.skeleton, body.bindMatrix);
  return m;
}

/** merge indexed geometries with the same attributes */
export function mergeAll(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const g = mergeGeometries(parts, false)!;
  for (const p of parts) p.dispose();
  return g;
}

/**
 * Cloth seen from both sides: its outside one colour, its lining another (by the face's side, so a sheet needs no
 * thickness), times the vertex colours when the geometry has them. A faint sheen toward the grazing angles reads as
 * satin.
 */
export function clothMaterial(outside: number, lining: number, rough: number, sheen: number, key: string, vertexColors = false): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: rough, metalness: 0, side: THREE.DoubleSide, vertexColors });
  const U = { uOut: { value: new THREE.Color(outside) }, uIn: { value: new THREE.Color(lining) }, uSheen: { value: sheen } };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n uniform vec3 uOut; uniform vec3 uIn; uniform float uSheen;')
      .replace('#include <color_fragment>', '#include <color_fragment>\n vec3 clothC = gl_FrontFacing ? uOut : uIn; diffuseColor.rgb *= clothC;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n { float fr = 1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))); totalEmissiveRadiance += clothC * uSheen * pow(fr, 3.0); }');
  };
  m.customProgramCacheKey = () => key;
  return m;
}

/** the z of a field's front surface at (x, y), searching z in [lo, hi] (inside at lo) */
export function frontZ(f: Field, x: number, y: number, lo = 0, hi = 3): number {
  for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (f(x, y, m) < 0) lo = m; else hi = m; }
  return lo;
}

/** a field's outward normal at a point (central differences) */
export function fieldNormal(f: Field, x: number, y: number, z: number, out: THREE.Vector3, e = 0.02): THREE.Vector3 {
  return out.set(f(x + e, y, z) - f(x - e, y, z), f(x, y + e, z) - f(x, y - e, z), f(x, y, z + e) - f(x, y, z - e)).normalize();
}

/**
 * A flat ribbon lying on a field's surface through `pts` (each pushed out to the surface along +z and `lift` past it),
 * `width` across, its face toward the surface's normal.
 */
export function ribbonOn(f: Field, pts: [number, number][], width: number, lift: number, samples = 24): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(x, y, frontZ(f, x, y))));
  const pos: number[] = [], idx: number[] = [];
  const n = new THREE.Vector3(), t = new THREE.Vector3(), w = new THREE.Vector3();
  for (let i = 0; i <= samples; i++) {
    const p = curve.getPointAt(i / samples);
    curve.getTangentAt(i / samples, t);
    p.z = frontZ(f, p.x, p.y);
    fieldNormal(f, p.x, p.y, p.z, n);
    w.crossVectors(t, n).normalize().multiplyScalar(width / 2);
    p.addScaledVector(n, lift);
    pos.push(p.x - w.x, p.y - w.y, p.z - w.z, p.x + w.x, p.y + w.y, p.z + w.z);
    if (i > 0) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/**
 * A head as two rigid meshes from one field: the upper part on the head bone, the lower jaw (inside `mask` < 0) on the
 * jaw bone. Both are closed by the cut, so an open mouth shows the cut faces: the `colour` callback paints them (a
 * point inside the head's own surface is on a cut).
 */
export function splitHead(d: Dresser, head: Field, mask: Field, box: Box, jawBox: Box, res: number, jawRes: number,
  colour: (x: number, y: number, z: number, c: THREE.Color) => void, mat: THREE.Material, name: string,
  extra?: (geo: THREE.BufferGeometry) => void): void {
  const skinNormals = (g: THREE.BufferGeometry) => {
    // on the skin and the cut's rim, the normal of the whole head (the grid's own normals bend toward the cut along the
    // seam, and the shut mouth's seam shows as a crease)
    const p = g.attributes.position!, n = g.attributes.normal!, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      if (Math.abs(mask(x, y, z)) > 0.12) continue;
      const h = head(x, y, z);
      if (h > 0.02 || h < -0.08) continue;
      fieldNormal(head, x, y, z, v, 0.015);
      n.setXYZ(i, v.x, v.y, v.z);
    }
    extra?.(g);
    return g;
  };
  const upper = new THREE.Mesh(skinNormals(isoGeometry((x, y, z) => Math.max(head(x, y, z), -mask(x, y, z)), box, res, colour, 60000)), mat);
  upper.name = `${name}-head`;
  d.at(upper, 'head', 0, 0, 0);
  const lower = new THREE.Mesh(skinNormals(isoGeometry((x, y, z) => Math.max(head(x, y, z), mask(x, y, z)), jawBox, jawRes, colour, 20000)), mat);
  lower.name = `${name}-jaw`;
  d.at(lower, 'jaw', 0, 0, 0);
}

/** skin, lit by the room, with dark vertex colours (hair, brows) glossier: the roughness follows the colour's brightness */
export function headMaterial(key: string): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6, metalness: 0 });
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <roughnessmap_fragment>',
      '#include <roughnessmap_fragment>\n roughnessFactor = mix(0.28, roughnessFactor, smoothstep(0.004, 0.05, dot(vColor.rgb, vec3(0.333))));');
  };
  m.customProgramCacheKey = () => key;
  return m;
}

/**
 * Eyes: a ball, an iris cap of `iris` (glowing by `glow`), a pupil, a glint; with `lid`, an upper lid of that colour
 * over the top of each, `lidRest` radians down from open (a heavy lid reads as menace), that a blink sweeps shut. The
 * eye groups are named `${name}L`/`R`, the lids `${name}-lidL`/`R` (the character's own left is +x).
 */
export function addEyes(d: Dresser, at: V3, r: number, iris: number, glow: number, name: string,
  opts: { look?: [number, number]; irisFrac?: number; lid?: number; lidRest?: number; white?: number } = {}): void {
  const look = opts.look ?? [0, 0], irisFrac = opts.irisFrac ?? 0.5;
  const white = d.std({ color: opts.white ?? 0xece6da, roughness: 0.18 });
  const ir = d.std({ color: iris, emissive: iris, emissiveIntensity: glow, roughness: 0.15 });
  const dark = d.std({ color: 0x040304, roughness: 0.08 });
  const glint = d.std({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.7, roughness: 0.2 });
  const lidMat = opts.lid !== undefined ? d.std({ color: opts.lid, roughness: 0.55, side: THREE.DoubleSide }) : null;
  for (const sx of [1, -1]) {
    const side = sx > 0 ? 'L' : 'R';
    const eye = new THREE.Group();
    eye.name = `${name}${side}`;
    eye.add(new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), white));
    const aim = new THREE.Group();
    aim.rotation.set(look[0], -sx * look[1], 0);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(r * 1.02, 20, 6, 0, Math.PI * 2, 0, irisFrac), ir);
    cap.name = `${name}-iris`;
    cap.rotation.x = Math.PI / 2;
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(r * 1.035, 16, 4, 0, Math.PI * 2, 0, irisFrac * 0.42), dark);
    pupil.rotation.x = Math.PI / 2;
    const g = new THREE.Mesh(new THREE.SphereGeometry(r * 0.16, 8, 6), glint);
    g.position.set(sx * r * 0.22, r * 0.28, r * 0.98);
    aim.add(cap, pupil, g);
    eye.add(aim);
    if (lidMat) {
      // a cap round the ball's top, turned forward about the ball's centre: at 0 it leaves the eye open; at π/2 it
      // covers the front
      const lid = new THREE.Mesh(new THREE.SphereGeometry(r * 1.12, 20, 8, 0, Math.PI * 2, 0, 1.3), lidMat);
      lid.name = `${name}-lid${side}`;
      lid.rotation.x = opts.lidRest ?? 0.2;
      eye.add(lid);
    }
    d.at(eye, 'head', sx * at[0], at[1], at[2]);
  }
}

/** a brow: a tapered dark wedge from its inner end `a` to its outer `b` (the left; the right is mirrored) */
export function addBrows(d: Dresser, a: V3, b: V3, rIn: number, rOut: number, colour: number, name: string): void {
  const mat = d.std({ color: colour, roughness: 0.7 });
  for (const sx of [1, -1]) {
    const A = new THREE.Vector3(sx * a[0], a[1], a[2]), B = new THREE.Vector3(sx * b[0], b[1], b[2]);
    const g = new THREE.CylinderGeometry(rOut, rIn, A.distanceTo(B), 7, 1).scale(1, 1, 0.55);
    const m = new THREE.Mesh(g, mat);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
    const holder = new THREE.Group();
    holder.name = `${name}${sx > 0 ? 'L' : 'R'}`;
    holder.add(m);
    const mid = A.add(B).multiplyScalar(0.5);
    d.at(holder, 'head', mid.x, mid.y, mid.z);
  }
}

/** the parts of a face that move with the wearer's (addEyes's lids, addBrows's brows) and glowing materials, by name */
export interface FaceParts {
  lids: { o: THREE.Object3D; rest: number; left: boolean }[];
  eyes: { o: THREE.Object3D; left: boolean }[];
  brows: { o: THREE.Object3D; y: number }[];
  glow: THREE.MeshStandardMaterial[];
}
export function findFace(root: THREE.Object3D, eye: string, brow: string, glowNames: string[]): FaceParts {
  const p: FaceParts = { lids: [], eyes: [], brows: [], glow: [] };
  root.traverse((o) => {
    if (o.name === `${eye}-lidL` || o.name === `${eye}-lidR`) p.lids.push({ o, rest: o.rotation.x, left: o.name.endsWith('L') });
    if (o.name === `${eye}L` || o.name === `${eye}R`) p.eyes.push({ o, left: o.name.endsWith('L') });
    if (o.name === `${brow}L` || o.name === `${brow}R`) p.brows.push({ o, y: o.position.y });
    if (glowNames.includes(o.name)) {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (!p.glow.includes(m)) p.glow.push(m);
    }
  });
  return p;
}
/** blinks shut the lids (or, with none, squash the eyes), raised brows lift the brows */
export function moveFace(p: FaceParts, face: FaceState | null | undefined, browLift = 0.12): void {
  const blink = (left: boolean) => (face ? (left ? face.blinkL : face.blinkR) : 0);
  for (const l of p.lids) l.o.rotation.x = l.rest + (Math.PI / 2 - l.rest) * blink(l.left);
  if (!p.lids.length) for (const e of p.eyes) e.o.scale.y = 1 - 0.9 * blink(e.left);
  for (const b of p.brows) b.o.position.y = b.y + browLift * (face?.browUp ?? 0);
}

/** the house capture rule for a clothed upright figure: a thigh keeps its own top, an arm its sleeve (by height) */
export function clothedCapture(armIn: (y: number) => number, headFrom: number): Capture {
  return (sg, x, y, z) => {
    const n = sg.name;
    if (n.startsWith('thigh')) return z > -1.6 && y < sg.a[1]! + 0.8 && Math.abs(Math.abs(x) - Math.abs(sg.a[0]!)) < (y < sg.a[1]! + 0.3 ? 1.3 : 0.9);
    if (n.startsWith('arm') || n.startsWith('forearm')) return Math.abs(x) > armIn(y) && z > -1.15;
    if (n === 'head') return y > headFrom;
    return true;
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// the skeleton: the hero's joints (so the torso fits as every other costume's); the jaw hinges by the ear; the feet
// lie nearly level (a person's heel-to-toe landmarks do); the tail bones hang the cape down the back

const SHOULDER_Y = 14.6, ELBOW_Y = 11.9, WRIST_Y = 9.45;
export const VAMP_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 9.6, 0], b: [0, 10.6, 0], parent: null },
  { name: 'spine1', a: [0, 10.6, 0], b: [0, 12.4, 0.1], parent: 'pelvis' },
  { name: 'spine2', a: [0, 12.4, 0.1], b: [0, 15.0, 0.1], parent: 'spine1' },
  { name: 'neck', a: [0, 15.0, 0.1], b: [0, 15.9, 0.15], parent: 'spine2', reach: 0.8 },
  { name: 'head', a: [0, 15.9, 0.15], b: [0, 18.4, 0.3], parent: 'neck' },
  { name: 'jaw', a: [0, 16.55, -0.12], b: [0, 16.2, 1.15], parent: 'head', reach: 0 },
  { name: 'tail1', a: [0, 14.9, -1.3], b: [0, 12.4, -1.6], parent: 'spine2', reach: 0 },
  { name: 'tail2', a: [0, 12.4, -1.6], b: [0, 9.9, -1.9], parent: 'tail1', reach: 0 },
  { name: 'tail3', a: [0, 9.9, -1.9], b: [0, 7.4, -2.2], parent: 'tail2', reach: 0 },
  { name: 'tail4', a: [0, 7.4, -2.2], b: [0, 4.9, -2.5], parent: 'tail3', reach: 0 },
  { name: 'thighL', a: [1.1, 9.6, 0], b: [1.2, 5.3, 0.2], parent: 'pelvis' },
  { name: 'shinL', a: [1.2, 5.3, 0.2], b: [1.2, 1.1, -0.1], parent: 'thighL' },
  { name: 'footL', a: [1.2, 1.1, -0.1], b: [1.2, 0.75, 1.8], parent: 'shinL' },
  { name: 'thighR', a: [-1.1, 9.6, 0], b: [-1.2, 5.3, 0.2], parent: 'pelvis' },
  { name: 'shinR', a: [-1.2, 5.3, 0.2], b: [-1.2, 1.1, -0.1], parent: 'thighR' },
  { name: 'footR', a: [-1.2, 1.1, -0.1], b: [-1.2, 0.75, 1.8], parent: 'shinR' },
  { name: 'armL', a: [2.4, SHOULDER_Y, 0], b: [2.72, ELBOW_Y, -0.05], parent: 'spine2' },
  { name: 'forearmL', a: [2.72, ELBOW_Y, -0.05], b: [2.85, WRIST_Y, 0.4], parent: 'armL' },
  { name: 'armR', a: [-2.4, SHOULDER_Y, 0], b: [-2.72, ELBOW_Y, -0.05], parent: 'spine2' },
  { name: 'forearmR', a: [-2.72, ELBOW_Y, -0.05], b: [-2.85, WRIST_Y, 0.4], parent: 'armR' },
];

const BOX = { min: [-3.6, -0.3, -1.6] as V3, max: [3.6, 16.6, 2.2] as V3 };

// ---------------------------------------------------------------------------------------------------------------------
// the body: tailcoat, trousers, shoes, hands (the head is a mesh)

function vampSDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let d = 9;
  if (y > 8.6) {
    // the tailcoat's chest, a nipped waist, the hips
    d = sdEllipsoid(x, y, z, 0, 13.3, 0.05, 1.78, 1.95, 1.05);
    d = smin(d, sdEllipsoid(x, y, z, 0, 11.4, 0.1, 1.38, 1.25, 0.92), 0.55);
    d = smin(d, sdEllipsoid(x, y, z, 0, 9.95, 0.0, 1.6, 1.05, 1.0), 0.5);
    if (y > 13.4) {
      d = smin(d, sdCapsule(ax, y, z, 0, 15.0, -0.1, 2.25, 14.6, 0, 0.55, 0.6), 0.5); // the shoulders, padded
      d = smin(d, sdCapsule(x, y, z, 0, 14.8, -0.02, 0, 16.2, 0.06, 0.48, 0.38), 0.3); // the neck, up inside the head's
    }
  }
  if (y < 10.9) {
    // the trousers, slim, to the shoes
    d = smin(d, sdCapsule(ax, y, z, 1.0, 9.7, 0.0, 1.16, 5.4, 0.15, 0.86, 0.58), 0.45);
    if (y < 6.4) d = smin(d, sdCapsule(ax, y, z, 1.16, 5.4, 0.15, 1.2, 1.35, -0.08, 0.57, 0.44), 0.3);
  }
  if (y < 1.9) {
    // a dress shoe: a flat sole, a heel, a long narrow toe
    let s = Math.max(sdEllipsoid(ax, y, z, 1.2, 0.48, 0.55, 0.5, 0.48, 1.25), -y);
    s = smin(s, Math.max(sdCapsule(ax, y, z, 1.2, 0.36, 0.7, 1.2, 0.3, 1.95, 0.4, 0.17), -y), 0.25);
    d = smin(d, s, 0.3);
  }
  if (ax > 1.5 && y > 8.2 && y < 15.6) {
    // the sleeves, joined to the coat only over the shoulder (below, a blend webs them to the side and a raised arm
    // tears the web), a white cuff, a long pale hand
    const sl = sdCapsule(ax, y, z, 2.4, 14.4, 0, 2.72, 11.95, -0.05, 0.56, 0.47);
    d = y > 14.0 ? smin(d, sl, 0.35) : Math.min(d, sl);
    if (y < 12.6) {
      let a = sdCapsule(ax, y, z, 2.72, 11.95, -0.05, 2.84, 10.15, 0.27, 0.46, 0.41);
      a = smin(a, sdCapsule(ax, y, z, 2.83, 10.25, 0.25, 2.85, 9.85, 0.33, 0.37, 0.36), 0.06);
      // the hand: the wrist, a palm, long fingers together, a thumb
      let h = sdCapsule(ax, y, z, 2.85, 9.9, 0.33, 2.86, 9.4, 0.42, 0.22, 0.21);
      h = smin(h, sdEllipsoid(ax, y, z, 2.87, 9.05, 0.47, 0.19, 0.45, 0.36), 0.2);
      h = smin(h, sdEllipsoid(ax, y, z, 2.88, 8.45, 0.52, 0.15, 0.5, 0.3), 0.15);
      h = smin(h, sdCapsule(ax, y, z, 2.78, 9.3, 0.76, 2.72, 8.8, 0.92, 0.12, 0.09), 0.1);
      d = Math.min(d, smin(a, h, 0.1));
    }
  }
  return d;
}

/** regions: 0 jacket, 1 trousers, 2 shoes, 3 skin, 4 shirt white */
const JACKET = 0, TROUSERS = 1, SHOE = 2, SKIN = 3, SHIRT = 4;
function vampRegion(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  if (y < 1.12 && ax > 0.5) return SHOE;
  if (ax > 2.45 && y < 10.3) return y < 9.86 ? SKIN : SHIRT;
  if (y > 15.3 && ax < 0.7) return SKIN;
  if (ax > 2.0 && y > 9.0) return JACKET;
  return y < 10.55 ? TROUSERS : JACKET;
}
const ROUGH = [0.86, 0.82, 0.16, 0.5, 0.6];

/**
 * The tux front, drawn per fragment from the bind-pose position (vBind) on the coat's front (vTux): the jacket's V to
 * the button at the waist, the lapels with a peak under the collar, the red waistcoat with gold buttons, the shirt
 * front with two black studs. Linear colours.
 */
const TUX_GLSL = /* glsl */ `
  varying vec3 vBind; varying vec3 vBindN; varying float vTux; varying float vRough;
  float inside(float v, float w) { return 1.0 - smoothstep(w - 0.014, w + 0.014, v); }
  vec3 tux(vec3 base, vec3 p, vec3 n, inout float rough) {
    float ax = abs(p.x);
    float front = smoothstep(0.05, 0.3, n.z) * step(0.0, p.z);
    float wJ = 0.05 + 0.82 * clamp((p.y - 11.05) / 4.1, 0.0, 1.0);
    float open = inside(ax, wJ) * step(11.05, p.y) * front;
    float peak = smoothstep(13.5, 14.45, p.y) * (1.0 - smoothstep(14.5, 14.62, p.y));
    float lapel = inside(ax, wJ + 0.3 + 0.24 * peak) * (1.0 - open) * step(10.9, p.y) * front;
    float wS = 0.6 * clamp((p.y - 13.45) / 1.75, 0.0, 1.0);
    float shirt = inside(ax, wS) * step(13.45, p.y);
    vec3 vest = vec3(0.3, 0.01, 0.018) * (0.82 + 0.18 * abs(sin(p.x * 22.0 + p.y * 9.0) * sin(p.y * 22.0 - p.x * 9.0)));
    vec3 c = mix(base, vec3(0.004, 0.004, 0.007), lapel);
    c = mix(c, vest, open);
    c = mix(c, vec3(0.8, 0.79, 0.75) * (0.95 + 0.05 * sin(p.x * 120.0)), open * shirt);
    float stud = min(length(p.xy - vec2(0.0, 14.3)), length(p.xy - vec2(0.0, 13.85)));
    c = mix(c, vec3(0.015), open * shirt * (1.0 - smoothstep(0.045, 0.06, stud)));
    float btn = min(length(p.xy - vec2(0.0, 12.05)), length(p.xy - vec2(0.0, 11.5)));
    c = mix(c, vec3(0.62, 0.38, 0.09), open * (1.0 - shirt) * (1.0 - smoothstep(0.07, 0.085, btn)));
    rough = mix(rough, 0.2, lapel);
    rough = mix(rough, 0.42, open);
    rough = mix(rough, 0.25, open * (1.0 - shirt) * (1.0 - smoothstep(0.07, 0.085, btn)));
    return c;
  }`;

function tuxMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7, metalness: 0 });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n attribute float aTux; attribute float aRough; varying vec3 vBind; varying vec3 vBindN; varying float vTux; varying float vRough;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n vBind = position; vBindN = normal; vTux = aTux; vRough = aRough;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + TUX_GLSL)
      .replace('#include <color_fragment>', '#include <color_fragment>\n float tuxRough = vRough; { float r2 = vRough; vec3 tc = tux(diffuseColor.rgb, vBind, normalize(vBindN), r2); diffuseColor.rgb = mix(diffuseColor.rgb, tc, vTux); tuxRough = mix(vRough, r2, vTux); }')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n roughnessFactor = tuxRough;');
  };
  m.customProgramCacheKey = () => 'vamp-tux-v1';
  return m;
}

// ---------------------------------------------------------------------------------------------------------------------
// the head

const HINGE: V3 = [0, 16.55, -0.12];
const MOUTH_Y = 16.29, LIP_Z = 1.16;
/** the mouth's line, rising from the lips back to the hinge */
const cutY = (z: number) => MOUTH_Y + 0.21 * (LIP_Z - z);
/** the jaw's half-width: the chin between the mouth's corners drops, the cheeks and the jaw's angles stay */
const JAW_W = 0.44;
/** the lower jaw's wedge: under the mouth line, in front of the hinge, over the throat, between the corners (< 0 inside) */
const jawMask: Field = (x, y, z) => Math.max(y - cutY(z), -0.15 - z, 15.98 - 0.32 * (z + 0.15) - y, Math.abs(x) - JAW_W);

/** the hairline's height round the head (φ from the face, 0, to the nape, π): a widow's peak, high temples */
const HAIR_PHI = [0, 0.42, 0.9, 1.3, 1.72, 2.3, Math.PI], HAIR_Y = [17.78, 18.08, 17.86, 17.36, 17.28, 16.85, 16.6];
function hairline(ax: number, z: number): number {
  const phi = Math.atan2(ax, z);
  for (let i = 1; i < HAIR_PHI.length; i++) {
    if (phi <= HAIR_PHI[i]!) { const t = (phi - HAIR_PHI[i - 1]!) / (HAIR_PHI[i]! - HAIR_PHI[i - 1]!); return lerp(HAIR_Y[i - 1]!, HAIR_Y[i]!, t); }
  }
  return HAIR_Y[HAIR_Y.length - 1]!;
}

const EYE: V3 = [0.34, 17.14, 0.93];
/** slick hair: the skull's own shape, swelled above the hairline (no step: the edge is in the colour), fuller behind */
const hairThick = (ax: number, y: number, z: number) => {
  const yh = hairline(ax, z);
  return 0.08 * sstep(yh - 0.03, yh + 0.14, y) * (1 + 0.8 * sstep(17.0, 18.0, y) * sstep(0.1, -0.7, z));
};
const craniumSDF = (x: number, y: number, z: number) => sdEllipsoid(x, y, z, 0, 17.42, 0.02, 0.9, 1.0, 1.08) - hairThick(Math.abs(x), y, z);
/** the head: skull with its hair, face, ears, neck */
function faceSDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let d = craniumSDF(x, y, z);
  d = smin(d, sdEllipsoid(x, y, z, 0, 16.85, 0.45, 0.74, 0.95, 0.75), 0.4); // the face
  d = smin(d, sdEllipsoid(x, y, z, 0, 16.03, 0.72, 0.38, 0.3, 0.36), 0.3); // a pointed chin
  d = smin(d, sdCapsule(ax, y, z, 0.68, 16.62, -0.05, 0.27, 15.97, 0.72, 0.17, 0.15), 0.3); // the jaw's line
  d = smin(d, sdEllipsoid(ax, y, z, 0.5, 16.98, 0.8, 0.3, 0.17, 0.28), 0.2); // high cheekbones
  d = smax(d, -sdEllipsoid(ax, y, z, 0.56, 16.5, 0.95, 0.22, 0.28, 0.2), 0.2); // hollow cheeks under them
  d = smin(d, sdCapsule(ax, y, z, 0.1, 17.4, 1.04, 0.62, 17.48, 0.84, 0.1, 0.08), 0.15); // the brow ridge
  d = smax(d, -sdEllipsoid(ax, y, z, EYE[0], EYE[1], 1.08, 0.24, 0.15, 0.2), 0.08); // the sockets
  // a long straight nose, its nostrils
  d = smin(d, sdCapsule(x, y, z, 0, 17.2, 1.04, 0, 16.7, 1.4, 0.085, 0.11), 0.12);
  d = smin(d, sdEllipsoid(ax, y, z, 0.11, 16.68, 1.22, 0.1, 0.08, 0.1), 0.08);
  // thin lips
  d = smin(d, sdCapsule(ax, y, z, 0, 16.36, 1.12, 0.27, 16.33, 0.98, 0.055, 0.035), 0.06);
  d = smin(d, sdCapsule(ax, y, z, 0, 16.21, 1.08, 0.24, 16.25, 0.96, 0.055, 0.035), 0.06);
  // pointed ears
  d = smin(d, sdEllipsoid(ax, y, z, 0.88, 17.0, -0.05, 0.1, 0.32, 0.2), 0.12);
  d = smin(d, sdCapsule(ax, y, z, 0.9, 17.15, -0.1, 1.04, 17.66, -0.36, 0.12, 0.02), 0.1);
  // the neck, down into the shirt's collar
  return smin(d, sdCapsule(x, y, z, 0, 15.2, -0.06, 0, 16.5, 0.0, 0.47, 0.45), 0.3);
}
/**
 * The head's material: the skin's vertex colours, and the slick hair drawn per fragment above the hairline (the same
 * table as `hairline`) where `aHair` says the skin is the skull's (not an ear's), so the widow's peak is a crisp V.
 */
function vampHeadMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.58, metalness: 0 });
  const knots = HAIR_PHI.map((ph, i) => `if (ph <= ${ph.toFixed(4)}) return mix(${HAIR_Y[i - 1]?.toFixed(3) ?? '0.0'}, ${HAIR_Y[i]!.toFixed(3)}, (ph - ${(HAIR_PHI[i - 1] ?? 0).toFixed(4)}) / ${((ph - (HAIR_PHI[i - 1] ?? ph - 1)) || 1).toFixed(4)});`).slice(1).join('\n    ');
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n attribute float aHair; varying float vHair; varying vec3 vHeadP;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n vHair = aHair; vHeadP = position;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
  varying float vHair; varying vec3 vHeadP;
  float hairline(vec3 p) {
    float ph = atan(abs(p.x), p.z);
    ${knots}
    return ${HAIR_Y[HAIR_Y.length - 1]!.toFixed(3)};
  }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
  float hairK = smoothstep(-0.006, 0.006, vHeadP.y - hairline(vHeadP)) * smoothstep(0.35, 0.65, vHair);
  // combed back: faint streaks along the head
  vec3 hairC = vec3(0.0035, 0.0035, 0.005) * (0.8 + 0.4 * sin(atan(vHeadP.x, -vHeadP.z + 0.4) * 90.0));
  diffuseColor.rgb = mix(diffuseColor.rgb, hairC, hairK);`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n roughnessFactor = mix(roughnessFactor, 0.26, hairK);');
  };
  m.customProgramCacheKey = () => 'vamp-head-v2';
  return m;
}
/** 1 on the skull's skin (where hair may be drawn), 0 on the ears and the face's parts that stand off it */
function hairAttribute(g: THREE.BufferGeometry): void {
  const p = g.attributes.position!, a = new Float32Array(p.count);
  for (let i = 0; i < p.count; i++) a[i] = Math.abs(craniumSDF(p.getX(i), p.getY(i), p.getZ(i))) < 0.05 ? 1 : 0;
  g.setAttribute('aHair', new THREE.BufferAttribute(a, 1));
}

function vampHead(x: number, y: number, z: number): number {
  if (y < 15.0) return 15.1 - y;
  // far outside a bound round the whole head, the bound will do (most of the grid's corners)
  const b = sdEllipsoid(x, y, z, 0, 16.95, 0.15, 1.25, 1.95, 1.55);
  if (b > 0.35) return b;
  return faceSDF(x, y, z);
}

const C_SKIN = new THREE.Color(0xdcdcd4), C_SHADE = new THREE.Color(0x8e8698), C_LIP = new THREE.Color(0x6a2430);
const C_MOUTH = new THREE.Color(0x200406), C_TEETH = new THREE.Color(0xeee8da);
function headColour(x: number, y: number, z: number, c: THREE.Color): void {
  const ax = Math.abs(x);
  const f = faceSDF(x, y, z);
  if (f < -0.07) {
    // a cut face, deep: the inside of the mouth, the front teeth along its edge (near the skin the cut keeps the skin's
    // colour, so the shut mouth's seam does not show)
    c.copy(z > LIP_Z - 0.24 && ax < 0.36 && Math.abs(y - cutY(z)) < 0.12 ? C_TEETH : C_MOUTH);
    // the cheeks' insides, where the chin's sides part from them, a shadowed skin rather than a hole
    if (ax > JAW_W - 0.05) c.copy(C_SHADE).multiplyScalar(0.55);
    return;
  }
  c.copy(C_SKIN);
  // grey-violet shadow round the eyes and in the hollow cheeks
  const eye = Math.hypot((ax - EYE[0]) / 0.36, (y - EYE[1] + 0.04) / 0.26, (z - 1.0) / 0.4);
  c.lerp(C_SHADE, 0.55 * (1 - sstep(0.7, 1.25, eye)));
  const hollow = Math.hypot((ax - 0.56) / 0.3, (y - 16.5) / 0.36);
  c.lerp(C_SHADE, 0.3 * (1 - sstep(0.4, 1.0, hollow)) * sstep(0.6, 0.9, z));
  if (z > 0.95 && ax < 0.3 && Math.abs(y - cutY(z)) < 0.08) c.copy(C_LIP);
}

// ---------------------------------------------------------------------------------------------------------------------
// the cape and its collar

const Y_HEM = 2.75;
const CAPE_V1 = 0.17; // the share of the sheet that is the yoke over the shoulders
/** the neckline's height round the neck (c: cos of the angle from the back): higher behind, down to the throat */
const yNeck = (c: number) => 15.52 - 0.22 * (1 - c) / 2;
/** where the yoke turns down over the shoulder */
const yShoulder = (c: number) => 14.62 - 0.3 * Math.max(0, c) ** 2;

function capeAt(u: number, v: number, o: THREE.Vector3): void {
  let th: number, rx: number, rz: number, zc: number, y: number, fold = 0;
  if (v <= CAPE_V1) {
    // the yoke: from the throat round the neck, over the shoulders' tops (a squared arch, so it clears the pads)
    const t = v / CAPE_V1;
    th = u * 2.09;
    const c = Math.cos(th), yN = yNeck(c), yS = yShoulder(c), e = lerp(2, 4, Math.abs(Math.sin(th)));
    y = yS + (yN - yS) * Math.pow(Math.max(0, 1 - t ** e), 1 / e);
    rx = lerp(0.76, 3.15, t); rz = lerp(0.76, 1.5, t); zc = lerp(0.0, -0.1, t);
  } else {
    // the hang: straight down outside the arms, flaring to the hem, in folds
    const s = (v - CAPE_V1) / (1 - CAPE_V1);
    th = u * lerp(2.09, 1.76, sstep(0, 0.3, s));
    const c = Math.cos(th);
    y = lerp(yShoulder(c), Y_HEM + 0.35 * Math.abs(u) ** 2, s);
    rx = 3.15 + 0.72 * Math.sqrt(s) + 0.6 * s * s; rz = 1.5 + 0.42 * Math.sqrt(s) + 0.55 * s * s; zc = -0.1 - 0.25 * s;
    fold = (0.012 + 0.09 * s) * Math.sin(th * 6.5 + 0.4) * sstep(0, 0.12, s);
  }
  o.set(rx * (1 + fold) * Math.sin(th), y, zc - rz * (1 + fold) * Math.cos(th));
}

/** the collar: stiff, standing up from the neckline behind the head, flaring, its front corners highest */
function collarAt(u: number, v: number, o: THREE.Vector3): void {
  const th = u * lerp(2.09, 1.72, v), c = Math.cos(th);
  const top = 18.12 + 0.62 * Math.abs(u) ** 1.6;
  const y = lerp(yNeck(c) - 0.05, top, v);
  const fl = 0.4 * v + 0.6 * v * v;
  const rx = lerp(0.8, 2.0, fl), rz = lerp(0.8, 1.62, fl), zc = lerp(0.0, -0.18, v);
  o.set(rx * Math.sin(th), y, zc - rz * c);
}

const TAILS = VAMP_SEGMENTS.filter((s) => s.name.startsWith('tail'));
/** the back's share of a vertex at height y, down the tail bones (each blended into the next at its joint) */
function backInfluence(y: number, w: number, out: Influence[]): void {
  if (w <= 0) return;
  const top = TAILS[0]!.a[1];
  if (y >= top) { out.push(['spine2', w]); return; }
  for (let i = 0; i < TAILS.length; i++) {
    const s = TAILS[i]!, len = s.a[1] - s.b[1];
    if (y >= s.b[1] || i === TAILS.length - 1) {
      const t = Math.min(1, (s.a[1] - y) / len);
      // the upper half of each bone shares with the one above, the lower half with the one below
      const prev = i > 0 ? TAILS[i - 1]!.name : 'spine2', next = i < TAILS.length - 1 ? TAILS[i + 1]!.name : null;
      if (t < 0.5) { const k = 0.5 - t; out.push([s.name, w * (1 - k)], [prev, w * k]); }
      else if (next) { const k = Math.min(0.5, t - 0.5); out.push([s.name, w * (1 - k)], [next, w * k]); }
      else out.push([s.name, w]);
      return;
    }
  }
}

/**
 * The cape's weights. Its sides (by |u|, toward the front edges) follow the arms: over the shoulder and down to the
 * elbow the upper arm, from there to the hand the forearm, then less and less down to the hem, which stays with the
 * back; the middle of the back hangs from the tail bones. Raised arms pull the sides up and out: wings.
 */
function capeWeights(x: number, y: number, _z: number, u: number, v: number): Influence[] {
  const out: Influence[] = [];
  const side = x >= 0 ? 'L' : 'R';
  const au = Math.abs(u);
  let w: number;
  if (v <= CAPE_V1) w = sstep(0.4, 0.85, au) * sstep(0.35, 1.0, v / CAPE_V1) * 0.9;
  else w = sstep(0.3, 0.78, au) * Math.pow(sstep(Y_HEM + 0.3, WRIST_Y + 0.2, y), 1.3);
  if (w > 0) {
    const up = sstep(ELBOW_Y - 0.9, ELBOW_Y + 0.9, y);
    out.push(['arm' + side, w * up], ['forearm' + side, w * (1 - up)]);
  }
  backInfluence(y, 1 - w, out);
  return out;
}

// ---------------------------------------------------------------------------------------------------------------------
// dressing

function dress(d: Dresser): void {
  // --- the body's material: the tux front drawn in the shader, roughness by region
  const body = d.bones.get('pelvis')!.parent as THREE.SkinnedMesh | null;
  if (body?.isSkinnedMesh) {
    const pos = body.geometry.attributes.position!;
    const tux = new Float32Array(pos.count), rough = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i), r = vampRegion(x, y, z);
      tux[i] = r === JACKET && Math.abs(x) < 1.9 && y > 10.8 && y < 15.4 && z > 0 ? 1 : 0;
      rough[i] = ROUGH[r] ?? 0.7;
    }
    body.geometry.setAttribute('aTux', new THREE.BufferAttribute(tux, 1));
    body.geometry.setAttribute('aRough', new THREE.BufferAttribute(rough, 1));
    (body.material as THREE.Material).dispose();
    body.material = tuxMaterial();
  }

  // --- the head: skull and face on the head bone, the lower jaw on the jaw bone, the mouth's inside on the cut
  splitHead(d, vampHead, jawMask,
    { min: [-1.12, 15.05, -1.28], max: [1.12, 18.62, 1.62] },
    { min: [-0.52, 15.55, -0.25], max: [0.52, 16.75, 1.35] }, 56, 30,
    headColour, vampHeadMaterial(), 'vamp', hairAttribute);
  addEyes(d, EYE, 0.13, 0xb01020, 0.55, 'vamp-eye', { look: [0.05, 0], lid: 0xa8a2ae, lidRest: 0.32, white: 0xe4ddd0, irisFrac: 0.62 });
  // sharp brows rising to their outer ends, on the brow ridge
  const browAt = (ax: number, lift: number): V3 => { const yy = 17.42 + lift; return [ax, yy, frontZ(faceSDF, ax, yy, 0.3, 1.6) + 0.025]; };
  addBrows(d, browAt(0.1, 0.02), browAt(0.6, 0.17), 0.065, 0.025, 0x0a0a0c, 'vamp-brow');
  // two fangs from the upper jaw, behind the lower lip while the mouth is shut
  const fangMat = d.std({ color: 0xf4f0e6, roughness: 0.25 });
  for (const sx of [1, -1]) {
    const f = new THREE.Mesh(new THREE.ConeGeometry(0.048, 0.24, 8).rotateX(Math.PI), fangMat);
    d.at(f, 'head', sx * 0.2, cutY(0.94) - 0.1, 0.94);
  }

  // --- the shirt's collar: a band round the neck, open at the throat, its front corners out in points
  const band = sheetGeometry(40, 6, (u, v, o) => {
    const th = u * 2.72, au = Math.abs(u), wing = sstep(0.78, 1, au);
    const y = lerp(14.96, 15.6 - 0.32 * wing, v), r = lerp(0.62, 0.56, v) + 0.13 * wing * v;
    o.set(r * Math.sin(th), y, 0.03 - r * Math.cos(th));
  });
  d.at(new THREE.Mesh(band, d.std({ color: 0xf2f0ea, roughness: 0.55, side: THREE.DoubleSide })), 'neck', 0, 0, 0);

  // --- the cape and its collar: one skinned sheet, black satin outside, red inside
  const cape = sheetGeometry(76, 60, capeAt);
  setSkin(d, cape, capeWeights);
  const collar = sheetGeometry(44, 14, collarAt, true);
  setSkin(d, collar, () => [['spine2', 1]]);
  const capeMat = clothMaterial(0x17151e, 0x8a0814, 0.36, 0.5, 'vamp-cape-v1');
  bindSkinned(d, mergeAll([cape, collar]), capeMat, 'vamp-cape');

  // a clasp at the throat: two gold roses and a chain between them
  const gold = d.std({ color: 0xd4a640, roughness: 0.28, metalness: 0.9 });
  const clasp: THREE.BufferGeometry[] = [];
  const cth = 2.09, cx = 0.8 * Math.sin(cth), cz = -0.8 * Math.cos(cth), cy = yNeck(Math.cos(cth)) - 0.12;
  for (const sx of [1, -1]) {
    clasp.push(new THREE.CylinderGeometry(0.16, 0.16, 0.07, 16).rotateX(Math.PI / 2).rotateY(sx * 0.6).translate(sx * cx, cy, cz + 0.04));
    clasp.push(new THREE.SphereGeometry(0.085, 10, 8).translate(sx * cx * 1.03, cy, cz + 0.09));
  }
  const chain = new THREE.CatmullRomCurve3([new THREE.Vector3(cx * 0.95, cy, cz + 0.08), new THREE.Vector3(0, cy - 0.38, cz + 0.32), new THREE.Vector3(-cx * 0.95, cy, cz + 0.08)]);
  clasp.push(new THREE.TubeGeometry(chain, 12, 0.035, 6, false));
  d.at(new THREE.Mesh(mergeAll(clasp), gold), 'spine2', 0, 0, 0);

  // --- the medallion on its red ribbon
  const ribbon = d.std({ color: 0x9a0c18, roughness: 0.4, side: THREE.DoubleSide });
  const MY = 12.85, mz = frontZ(vampSDF, 0, MY);
  const strips: THREE.BufferGeometry[] = [];
  for (const sx of [1, -1]) strips.push(ribbonOn(vampSDF, [[sx * 0.1, MY + 0.35], [sx * 0.3, 14.0], [sx * 0.5, 15.0]], 0.2, 0.03));
  d.at(new THREE.Mesh(mergeAll(strips), ribbon), 'spine2', 0, 0, 0);
  const med = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.07, 32).rotateX(Math.PI / 2), gold);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.045, 8, 32), gold);
  const beads = mergeAll(Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return new THREE.SphereGeometry(0.045, 8, 6).translate(Math.cos(a) * 0.29, Math.sin(a) * 0.29, 0.05); }));
  const gem = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12).scale(1, 1.15, 0.55), d.std({ color: 0x8a0010, emissive: 0xc0001a, emissiveIntensity: 0.45, roughness: 0.08, metalness: 0.2 }));
  gem.name = 'vamp-gem';
  gem.position.z = 0.05;
  med.add(disc, rim, new THREE.Mesh(beads, gold), gem);
  d.at(med, 'spine2', 0, MY, mz + 0.07);
}

const FOUND = new WeakMap<THREE.Object3D, FaceParts>();

export const VAMPIRE: CharacterDef = {
  id: 'vampire', name: 'Vampire', blurb: 'A caped count with a medallion, fangs and red eyes',
  segs: VAMP_SEGMENTS,
  body: {
    sdf: vampSDF, region: vampRegion, box: BOX,
    palette: [0x17161c, 0x131217, 0x060608, 0xdcdcd4, 0xefede6],
    surface: 'suit', weights: 'sharp',
    capture: clothedCapture((y) => (y < 12 ? 2.15 : y < 14.1 ? 1.95 : 2.05), 15.85),
  },
  dress,
  fit: { size: 1.06, limb: 0.7 },
  idle: { tail: 0.04 },
  face: { jaw: 0.42, eyes: [[EYE[0], EYE[1], EYE[2] + 0.12, 0.17], [-EYE[0], EYE[1], EYE[2] + 0.12, 0.17]] },
  res: 84,
  tick(root, t, face) {
    let e = FOUND.get(root);
    if (!e) { e = findFace(root, 'vamp-eye', 'vamp-brow', ['vamp-eye-iris', 'vamp-gem']); FOUND.set(root, e); }
    moveFace(e, face);
    // the eyes smoulder, and flare when the mouth opens
    const k = 0.45 + 0.12 * Math.sin(t * 1.3) + 1.1 * (face?.jaw ?? 0);
    for (const m of e.glow) m.emissiveIntensity = k;
  },
};
