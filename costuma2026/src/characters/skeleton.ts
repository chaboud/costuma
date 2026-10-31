// Skelly: a human skeleton that moves exactly with the wearer. Every bone is a rigid mesh hung on its rig bone (build.ts
// `dress`) rather than a skinned surface: a skeleton is already made of separate rigid parts with gaps at the joints, so
// rigid parts articulate perfectly and nothing can tear. Long bones are lathes along their segment with knobbly ends;
// ribs, clavicles and the jaw are tubes; the skull and the pelvis, whose shapes no primitive gives, are small signed
// distance fields polygonised by marching cubes and hung rigidly on the head and the pelvis. Everything is about a
// third chunkier than anatomy so a rib still reads at phone resolution over a person, and the skull is a head-and-a-bit
// wide so it hides the wearer's own head. The ivory carries a faint self-glow (glow-in-the-dark costume paint) so the
// figure does not go muddy in a dim room lit only by the camera's own picture (render/envlight.ts); the eye sockets
// hold a green ember that breathes, and the jaw clacks now and then (`tick`).
//
// Model frame: the hero's (hero.ts) — 20 units tall on y = 0, +y up, +z forward, +x the skeleton's own left. Geometry
// is authored in model coordinates and hung with `d.at(mesh, bone, 0, 0, 0)`, which puts the mesh's origin at the model
// origin in the bone's frame; the right side is the left side's geometry under scale.x = -1 (three flips the winding).
import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Box, CharacterDef, Dresser, Field } from './build';
import type { Seg } from './sdf';
import { sdCapsule, sdEllipsoid, sdSphere, smin } from './sdf';

type V3 = [number, number, number];

// The hero's joints, so the torso fit (hips to shoulders) matches every other costume's; the jaw hinges at the
// temporomandibular joint behind the cheek, not at the chin, so a clack swings the chin down.
export const SKELLY_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 9.6, 0], b: [0, 10.6, 0], parent: null },
  { name: 'spine1', a: [0, 10.6, 0], b: [0, 12.4, 0.1], parent: 'pelvis' },
  { name: 'spine2', a: [0, 12.4, 0.1], b: [0, 15.0, 0.1], parent: 'spine1' },
  { name: 'neck', a: [0, 15.0, 0.1], b: [0, 15.9, 0.15], parent: 'spine2' },
  { name: 'head', a: [0, 15.9, 0.15], b: [0, 18.4, 0.3], parent: 'neck' },
  { name: 'jaw', a: [0, 16.5, -0.3], b: [0, 15.55, 1.0], parent: 'head', reach: 0 },
  { name: 'tail1', a: [0, 10.4, -1.0], b: [0, 9.6, -1.1], parent: 'pelvis', reach: 0 },
  { name: 'tail2', a: [0, 9.6, -1.1], b: [0, 8.8, -1.2], parent: 'tail1', reach: 0 },
  { name: 'tail3', a: [0, 8.8, -1.2], b: [0, 8.0, -1.3], parent: 'tail2', reach: 0 },
  { name: 'tail4', a: [0, 8.0, -1.3], b: [0, 7.2, -1.4], parent: 'tail3', reach: 0 },
  { name: 'thighL', a: [1.1, 9.6, 0], b: [1.2, 5.3, 0.2], parent: 'pelvis' },
  { name: 'shinL', a: [1.2, 5.3, 0.2], b: [1.2, 1.1, -0.1], parent: 'thighL' },
  { name: 'footL', a: [1.2, 1.1, -0.1], b: [1.2, 0.35, 1.4], parent: 'shinL' },
  { name: 'thighR', a: [-1.1, 9.6, 0], b: [-1.2, 5.3, 0.2], parent: 'pelvis' },
  { name: 'shinR', a: [-1.2, 5.3, 0.2], b: [-1.2, 1.1, -0.1], parent: 'thighR' },
  { name: 'footR', a: [-1.2, 1.1, -0.1], b: [-1.2, 0.35, 1.4], parent: 'shinR' },
  { name: 'armL', a: [2.4, 14.6, 0], b: [2.72, 11.9, -0.05], parent: 'spine2' },
  { name: 'forearmL', a: [2.72, 11.9, -0.05], b: [2.85, 9.45, 0.4], parent: 'armL' },
  { name: 'armR', a: [-2.4, 14.6, 0], b: [-2.72, 11.9, -0.05], parent: 'spine2' },
  { name: 'forearmR', a: [-2.72, 11.9, -0.05], b: [-2.85, 9.45, 0.4], parent: 'armR' },
];

// ---------------------------------------------------------------------------------------------------------------------
// geometry kit (shared with pumpkin.ts: isoGeometry)

const V = (p: V3) => new THREE.Vector3(p[0], p[1], p[2]);

/** the frame whose +y runs a→b and whose +x is as near model +x as that allows, so a left/right feature stays put */
function frame(a: V3, b: V3): THREE.Matrix4 {
  const y = V(b).sub(V(a)).normalize();
  const x = new THREE.Vector3(1, 0, 0).addScaledVector(y, -y.x);
  if (x.lengthSq() < 1e-6) x.set(0, 0, 1);
  x.normalize();
  const z = new THREE.Vector3().crossVectors(x, y);
  return new THREE.Matrix4().makeBasis(x, y, z).setPosition(a[0], a[1], a[2]);
}

/** a small bone: few rings along, little caps (the fingers and toes are many and small on screen) */
const smallBone = (a: V3, b: V3, r0: number, rs: number, r1: number) => longBone(a, b, r0, rs, r1, 6, 5, 2);

/** a long bone from a to b: a lathe whose radius swells from the shaft `rs` to `r0`/`r1` at the ends, capped round */
function longBone(a: V3, b: V3, r0: number, rs: number, r1: number, radial = 12, along = 14, cap = 4): THREE.BufferGeometry {
  const len = V(b).distanceTo(V(a));
  const pts: THREE.Vector2[] = [];
  for (let k = 0; k <= cap; k++) { const t = -Math.PI / 2 + (k / cap) * (Math.PI / 2); pts.push(new THREE.Vector2(Math.max(1e-3, r0 * Math.cos(t)), r0 * 0.75 * Math.sin(t))); }
  const w = Math.min(0.2, 1.3 * Math.max(r0, r1) / len);
  for (let k = 1; k < along; k++) {
    const t = k / along;
    const r = rs + (r0 - rs) * Math.exp(-((t / w) ** 2)) + (r1 - rs) * Math.exp(-(((1 - t) / w) ** 2));
    pts.push(new THREE.Vector2(r, t * len));
  }
  for (let k = 0; k <= cap; k++) { const t = (k / cap) * (Math.PI / 2); pts.push(new THREE.Vector2(Math.max(1e-3, r1 * Math.cos(t)), len + r1 * 0.75 * Math.sin(t))); }
  return new THREE.LatheGeometry(pts, radial).applyMatrix4(frame(a, b));
}

function ball(c: V3, r: number, s: V3 = [1, 1, 1], seg = 12): THREE.BufferGeometry {
  return new THREE.SphereGeometry(r, seg, Math.max(6, Math.round(seg * 0.7))).scale(s[0], s[1], s[2]).translate(c[0], c[1], c[2]);
}

function tube(points: V3[], r: number, segs = 24, radial = 8): THREE.BufferGeometry {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(V)), segs, r, radial, false);
}

/** a tube with round ends: TubeGeometry is open, which shows as a hollow pipe end */
function rod(points: V3[], r: number, segs = 24, radial = 8): THREE.BufferGeometry[] {
  return [tube(points, r, segs, radial), ball(points[0]!, r, [1, 1, 1], radial), ball(points[points.length - 1]!, r, [1, 1, 1], radial)];
}

function merge(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  // all of three's primitives are indexed with position, normal, uv; the merge needs them alike
  const g = mergeGeometries(parts.map((p) => (p.index ? p : p.toNonIndexed())), false)!;
  for (const p of parts) p.dispose();
  return g;
}

/** a mirrored copy of `x → -x` points, for curves authored on the left */
const mx = (p: V3): V3 => [-p[0], p[1], p[2]];

/**
 * A signed distance field polygonised by three's MarchingCubes over `box` at `res` cells a side: positions and normals
 * in model units, optionally vertex colours. The field index i maps to 2i/res - 1 exactly as MarchingCubes places its
 * vertices, so the surface lands where the field says. Non-indexed (a triangle soup).
 *
 * MarchingCubes only polygonises cells 1..res-2, so a shape reaching the box's last two cells high (or first low) is
 * cut open there; the box is padded by that much so `box` is the region that is actually meshed.
 */
export function isoGeometry(sdf: Field, box: Box, res: number, color?: (x: number, y: number, z: number, c: THREE.Color) => void, maxTris = 60000): THREE.BufferGeometry {
  const span = (i: 0 | 1 | 2) => (box.max[i] - box.min[i]) * res / (res - 7);
  const lo = (i: 0 | 1 | 2) => box.min[i] - 2.5 * span(i) / res;
  const cx = lo(0) + span(0) / 2, cy = lo(1) + span(1) / 2, cz = lo(2) + span(2) / 2;
  const hx = span(0) / 2, hy = span(1) / 2, hz = span(2) / 2;
  const mc = new MarchingCubes(res, new THREE.MeshBasicMaterial(), false, false, maxTris);
  mc.isolation = 50;
  const f = mc.field as Float32Array;
  const n = res;
  const k = 40;
  for (let kz = 0; kz < n; kz++) {
    const z = cz + (2 * kz / n - 1) * hz;
    for (let j = 0; j < n; j++) {
      const y = cy + (2 * j / n - 1) * hy;
      for (let i = 0; i < n; i++) {
        const x = cx + (2 * i / n - 1) * hx;
        f[kz * n * n + j * n + i] = Math.max(0, Math.min(100, 50 - sdf(x, y, z) * k));
      }
    }
  }
  mc.update();
  const count = mc.count;
  const pa = mc.positionArray as Float32Array, na = mc.normalArray as Float32Array;
  const pos = new Float32Array(count * 3), nor = new Float32Array(count * 3);
  const col = color ? new Float32Array(count * 3) : null;
  const c = new THREE.Color();
  for (let v = 0; v < count; v++) {
    const x = cx + pa[v * 3]! * hx, y = cy + pa[v * 3 + 1]! * hy, z = cz + pa[v * 3 + 2]! * hz;
    pos[v * 3] = x; pos[v * 3 + 1] = y; pos[v * 3 + 2] = z;
    let nx = na[v * 3]! / hx, ny = na[v * 3 + 1]! / hy, nz = na[v * 3 + 2]! / hz;
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    nor[v * 3] = nx; nor[v * 3 + 1] = ny; nor[v * 3 + 2] = nz;
    if (col) { c.setRGB(1, 1, 1); color!(x, y, z, c); col[v * 3] = c.r; col[v * 3 + 1] = c.g; col[v * 3 + 2] = c.b; }
  }
  mc.geometry.dispose();
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  if (col) geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo.computeBoundingSphere();
  return geo;
}

/** smooth max: carves `b` out of `a` with a fillet of `k` */
const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);

// ---------------------------------------------------------------------------------------------------------------------
// the skull and the pelvis as fields

const SOCKET: V3 = [0.43, 17.02, 1.06];
const EMBER: V3 = [0.43, 16.99, 0.74];

/** 2D distance to an isosceles triangle, apex up at (0, top), base half-width `w` at `bot` (negative inside) */
function sdTri(x: number, y: number, top: number, bot: number, w: number): number {
  const ax = Math.abs(x), h = top - bot;
  // the slanted side's outward normal, and the base
  const nx = h, ny = w, nl = Math.hypot(nx, ny);
  const side = ((ax) * nx + (y - top) * ny) / nl;
  return Math.max(side, bot - y);
}

function skullSDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let d = sdEllipsoid(x, y, z, 0, 17.45, -0.12, 1.1, 1.13, 1.32); // the cranium
  d = smin(d, sdEllipsoid(x, y, z, 0, 16.8, -0.35, 0.98, 0.62, 0.95), 0.3); // the skull's base, which the jaw hinges under
  d = smin(d, sdEllipsoid(x, y, z, 0, 16.68, 0.58, 0.8, 0.74, 0.72), 0.35); // the face over the upper jaw
  d = smin(d, sdEllipsoid(ax, y, z, 0.78, 16.86, 0.55, 0.33, 0.3, 0.48), 0.22); // the cheekbones
  d = smin(d, sdCapsule(ax, y, z, 0.86, 16.8, 0.35, 0.98, 16.68, -0.42, 0.15, 0.13), 0.15); // the arches back to the ear
  d = smin(d, sdCapsule(ax, y, z, 0.12, 17.32, 1.12, 0.78, 17.36, 0.95, 0.17, 0.15), 0.2); // the brow ridge
  // the temples pinch in under the cranium's widest line
  d = smax(d, -sdEllipsoid(ax, y, z, 1.32, 16.95, 0.05, 0.38, 0.5, 0.55), 0.18);
  // the eye sockets: deep round pits
  d = smax(d, -sdEllipsoid(ax, y, z, SOCKET[0], SOCKET[1], SOCKET[2], 0.36, 0.34, 0.5), 0.07);
  // the nasal cavity: an upside-down heart, two lobes under a point
  const nose = Math.min(sdTri(x, y, 16.86, 16.42, 0.19), Math.hypot(ax - 0.08, y - 16.47) - 0.11);
  d = smax(d, -Math.max(nose, 0.8 - z), 0.04);
  // the upper jaw stops at the teeth (meshes), and the cheeks hollow above the molars
  d = smax(d, 16.08 - y, 0.1);
  d = smax(d, -sdEllipsoid(ax, y, z, 0.8, 16.25, 0.62, 0.22, 0.3, 0.35), 0.12);
  return d;
}

function skullColor(x: number, y: number, z: number, c: THREE.Color): void {
  const ax = Math.abs(x);
  // dark in the sockets and the nose: the carved surface lies on the carve's own boundary, so test against the carve a
  // little inflated (the pit's walls fall inside it, the face round the rim outside), darker toward the back
  const socket = sdEllipsoid(ax, y, z, SOCKET[0], SOCKET[1], SOCKET[2], 0.42, 0.4, 0.56);
  const nose = Math.max(Math.min(sdTri(x, y, 16.86, 16.42, 0.19), Math.hypot(ax - 0.08, y - 16.47) - 0.11), 0.8 - z) - 0.06;
  const pit = Math.max(0, Math.min(1, -Math.min(socket, nose) / 0.05));
  const deep = pit * (0.75 + 0.25 * Math.max(0, Math.min(1, (1.2 - z) / 0.4)));
  c.copy(IVORY_C).lerp(SOOT, deep);
  // age: the sutures' weathering darkens the crown's back and the cheeks' undersides a little
  if (deep === 0) c.multiplyScalar(0.94 + 0.06 * Math.max(0, Math.min(1, (y - 16.3) / 1.2)));
}

/** distance in the (y, z) plane to a segment, less r */
function seg2(y: number, z: number, ay: number, az: number, by: number, bz: number, r: number): number {
  const dy = by - ay, dz = bz - az, t = Math.max(0, Math.min(1, ((y - ay) * dy + (z - az) * dz) / (dy * dy + dz * dz)));
  return Math.hypot(y - ay - dy * t, z - az - dz * t) - r;
}

function jawSDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let d = sdCapsule(ax, y, z, 0, 15.62, 1.0, 0.5, 15.66, 0.66, 0.17, 0.17); // the body: a U from the chin...
  d = smin(d, sdCapsule(ax, y, z, 0.5, 15.66, 0.66, 0.78, 15.74, -0.12, 0.17, 0.16), 0.1); // ...back to the angles
  d = smin(d, Math.max(seg2(y, z, 15.74, -0.14, 16.4, -0.3, 0.2), Math.abs(ax - 0.8) - 0.07), 0.08); // the ramus, a plate
  d = smin(d, sdEllipsoid(ax, y, z, 0.82, 16.45, -0.3, 0.15, 0.11, 0.13), 0.06); // the condyle, in its hinge
  d = smin(d, sdEllipsoid(x, y, z, 0, 15.6, 1.0, 0.33, 0.21, 0.17), 0.1); // the chin
  d = smin(d, sdCapsule(ax, y, z, 0, 15.8, 1.02, 0.52, 15.8, 0.62, 0.12, 0.12), 0.08); // the ridge the teeth stand in
  return d;
}

function pelvisSDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  // each iliac wing: a piece of a sphere's shell cut to a rounded outline, its hollow facing in, up and forward, so from
  // the front the two read as a butterfly's wings (a bowl cut by planes read as a bucket)
  const shell = Math.abs(Math.hypot(ax - 0.25, y - 10.95, z - 0.75) - 1.4) - 0.09;
  let d = Math.max(shell, sdEllipsoid(ax, y, z, 1.2, 10.5, -0.18, 0.78, 0.7, 0.85));
  d = smin(d, sdCapsule(ax, y, z, 0.6, 11.0, -0.45, 1.55, 11.05, 0.2, 0.1, 0.1), 0.12); // the crest's thick rim
  d = smin(d, sdEllipsoid(x, y, z, 0, 9.95, -0.78, 0.48, 0.72, 0.22), 0.15); // the sacrum
  d = smin(d, sdCapsule(ax, y, z, 0.38, 10.35, -0.72, 0.85, 10.4, -0.45, 0.17, 0.15), 0.12); // its joints to the wings
  d = smin(d, sdCapsule(ax, y, z, 1.25, 10.15, -0.15, 1.0, 9.62, 0.0, 0.24, 0.24), 0.15); // the wing down to the socket
  d = smin(d, sdSphere(ax, y, z, 0.92, 9.6, 0.0, 0.32), 0.12); // the socket's back
  // the socket's rim, a ring facing out round the femur's head
  d = Math.min(d, Math.hypot(Math.hypot(y - 9.6, z) - 0.36, ax - 1.0) - 0.1);
  // the pubis and ischium, a ring round the obturator hole, meeting in front
  d = smin(d, sdCapsule(ax, y, z, 0.95, 9.48, 0.28, 0.12, 9.3, 0.72, 0.15, 0.14), 0.1);
  d = smin(d, sdCapsule(ax, y, z, 0.12, 9.32, 0.72, 0.1, 9.02, 0.66, 0.15, 0.15), 0.1);
  d = smin(d, sdCapsule(ax, y, z, 1.0, 9.38, -0.2, 0.78, 8.92, -0.05, 0.18, 0.17), 0.1);
  d = smin(d, sdCapsule(ax, y, z, 0.78, 8.92, -0.05, 0.12, 9.04, 0.62, 0.13, 0.12), 0.1);
  return d;
}

// ---------------------------------------------------------------------------------------------------------------------
// the bones, in model coordinates, left side

function vertebra(c: V3, r: number, h: number, wide: number, back: number): THREE.BufferGeometry[] {
  return [
    new THREE.CylinderGeometry(r, r * 1.08, h, 12).translate(c[0], c[1], c[2]),
    new THREE.BoxGeometry(wide, h * 0.42, 0.18).translate(c[0], c[1] + 0.02, c[2] - r * 0.6), // transverse processes
    new THREE.BoxGeometry(0.15, h * 0.55, back).rotateX(0.35).translate(c[0], c[1] - 0.05, c[2] - r - back * 0.42), // spinous
  ];
}

/** the ribs of one side (`sx` 1 left, -1 right), each a tube built from its own points so it winds outward */
function ribs(sx: number): THREE.BufferGeometry[] {
  const out: THREE.BufferGeometry[] = [];
  const W = [1.05, 1.42, 1.64, 1.76, 1.8, 1.74, 1.6];
  const ZF = [0.95, 1.06, 1.12, 1.14, 1.12, 1.06, 0.96];
  const DROP = [0.32, 0.48, 0.62, 0.72, 0.8, 0.85, 0.85];
  for (let i = 0; i < 7; i++) {
    const yb = 14.55 - i * 0.4, w = W[i]!, zb = 0.98, zf = ZF[i]!;
    const lower = i >= 5;
    const pts: V3[] = [[0.26, yb + 0.04, -0.78]];
    const end = lower ? 0.74 * Math.PI : Math.PI - Math.asin(Math.min(0.9, 0.42 / w));
    for (let k = 0; k <= 7; k++) {
      const f = 0.14 * Math.PI + (k / 7) * (end - 0.14 * Math.PI);
      const z = -Math.cos(f) * (f < Math.PI / 2 ? zb : zf);
      const y = yb - DROP[i]! * Math.pow((f - 0.14 * Math.PI) / (0.86 * Math.PI), 1.3);
      pts.push([w * Math.sin(f), y, z]);
    }
    // the costal cartilage: true ribs reach the sternum; the lower ribs sweep up to its foot, the costal arch
    if (lower) { const last = pts[pts.length - 1]!; pts.push([0.62, last[1] + 0.25 + (i - 5) * 0.2, 1.02], [0.26, 12.62, 1.06]); }
    else pts.push([0.24, pts[pts.length - 1]![1] + 0.04, zf * 0.98]);
    out.push(...rod(pts.map((p) => [p[0] * sx, p[1], p[2]] as V3), i === 0 ? 0.13 : 0.12, 28, 7));
  }
  return out;
}

/**
 * The left hand, hanging from the wrist down the forearm's line, palm in, thumb forward, fingers a little curled toward
 * the palm. Drawn about a third bigger than a hand so it covers the wearer's own (the rig has no hand bone: it rides
 * the forearm, so a wave keeps the fingers straight on with the arm).
 */
function hand(wrist: V3, dir: V3): THREE.BufferGeometry[] {
  const m = frame(wrist, [wrist[0] + dir[0], wrist[1] + dir[1], wrist[2] + dir[2]]);
  const S = 1.35;
  const P = (x: number, y: number, z: number): V3 => { const v = new THREE.Vector3(x * S, y * S, z * S).applyMatrix4(m); return [v.x, v.y, v.z]; };
  const g: THREE.BufferGeometry[] = [];
  // the carpals: a knot of pebbles
  for (const [x, y, z] of [[0, 0.1, 0.16], [0, 0.1, -0.02], [0, 0.1, -0.2], [0.02, 0.3, 0.2], [0.02, 0.3, 0.0], [0.02, 0.3, -0.18]] as V3[]) g.push(ball(P(x, y, z), 0.14, [1, 1, 1], 8));
  // the fingers: index forward (by the thumb) to little finger behind; knuckles a little proud
  const fingers: [number, number][] = [[0.21, 1.0], [0.07, 1.08], [-0.07, 1.0], [-0.2, 0.82]];
  for (const [fz, L] of fingers) {
    const k0 = P(0.02, 0.4, fz * 0.85), k1 = P(0.0, 0.4 + 0.55 * L, fz);
    const k2 = P(-0.07, 0.4 + 0.92 * L, fz * 1.05), k3 = P(-0.17, 0.4 + 1.15 * L, fz * 1.08), k4 = P(-0.28, 0.4 + 1.3 * L, fz * 1.08);
    g.push(smallBone(k0, k1, 0.1, 0.075, 0.105), smallBone(k1, k2, 0.1, 0.07, 0.095), smallBone(k2, k3, 0.09, 0.065, 0.085), smallBone(k3, k4, 0.08, 0.06, 0.065));
  }
  // the thumb, from the wrist's front out and down
  const t0 = P(0.0, 0.25, 0.26), t1 = P(-0.05, 0.6, 0.48), t2 = P(-0.1, 0.88, 0.58), t3 = P(-0.16, 1.08, 0.62);
  g.push(smallBone(t0, t1, 0.11, 0.085, 0.1), smallBone(t1, t2, 0.1, 0.075, 0.09), smallBone(t2, t3, 0.09, 0.065, 0.065));
  return g;
}

function foot(): THREE.BufferGeometry[] {
  const g: THREE.BufferGeometry[] = [];
  g.push(ball([1.2, 0.88, 0.0], 0.27)); // the talus, under the shin
  g.push(ball([1.24, 0.44, -0.3], 1, [0.27, 0.32, 0.44])); // the heel
  for (const [x, y, z] of [[0.98, 0.62, 0.36], [1.22, 0.62, 0.34], [1.46, 0.55, 0.22], [1.08, 0.55, 0.6], [1.32, 0.52, 0.56]] as V3[]) g.push(ball([x, y, z], 0.17, [1, 1, 1], 8));
  // the metatarsals fan forward and down; the big toe's is the stoutest, on the inside
  const X0 = [0.95, 1.12, 1.28, 1.42, 1.55], X1 = [0.84, 1.08, 1.3, 1.5, 1.68], R = [0.1, 0.075, 0.07, 0.065, 0.065], T = [0.42, 0.34, 0.3, 0.27, 0.24];
  for (let i = 0; i < 5; i++) {
    const a: V3 = [X0[i]!, 0.5, 0.62], b: V3 = [X1[i]!, 0.22, 1.38 - i * 0.05];
    g.push(smallBone(a, b, R[i]! * 1.3, R[i]!, R[i]! * 1.35));
    const c: V3 = [b[0] + (i === 0 ? -0.02 : 0.02 * i), 0.15, b[2] + T[i]!];
    g.push(smallBone(b, c, R[i]! * 1.05, R[i]! * 0.8, R[i]! * 0.85));
  }
  return g;
}

const IVORY = 0xeee5cc;
const IVORY_C = new THREE.Color(IVORY);
const SOOT = new THREE.Color(0x1d120c);
const EMBER_GREEN = 0x58ff2a;

function dress(d: Dresser): void {
  // a faint self-glow: glow-in-the-dark paint, so the bones hold up in a dim room
  const bone = d.std({ color: IVORY, roughness: 0.42, metalness: 0, emissive: 0x2c2a20, emissiveIntensity: 1 });
  const boneV = d.std({ color: 0xffffff, vertexColors: true, roughness: 0.42, metalness: 0, emissive: 0x2c2a20, emissiveIntensity: 1 });
  const dark = d.std({ color: 0x120a06, roughness: 0.9 });
  const ember = d.std({ color: 0x000000, emissive: EMBER_GREEN, emissiveIntensity: 1.0, roughness: 1 });
  const both = (geo: THREE.BufferGeometry, name: string, mat: THREE.Material = bone) => {
    for (const side of ['L', 'R'] as const) {
      const m = new THREE.Mesh(geo, mat);
      m.name = `skelly-${name}${side}`;
      if (side === 'R') m.scale.x = -1;
      d.at(m, name + side, 0, 0, 0);
    }
  };
  const one = (geo: THREE.BufferGeometry, bn: string, mat: THREE.Material = bone, name = `skelly-${bn}`) => {
    const m = new THREE.Mesh(geo, mat);
    m.name = name;
    d.at(m, bn, 0, 0, 0);
    return m;
  };

  // --- the head: skull, embers in the sockets, upper teeth, the dark of the mouth behind them
  const skull = isoGeometry(skullSDF, { min: [-1.25, 15.95, -1.5], max: [1.25, 18.65, 1.4] }, 52, skullColor, 40000);
  one(skull, 'head', boneV);
  const embers = merge([ball(EMBER, 0.1, [1, 1.1, 0.7], 10), ball(mx(EMBER), 0.1, [1, 1.1, 0.7], 10)]);
  one(embers, 'head', ember, 'skelly-embers');
  const teeth = (y: number, h: number, rx: number, rz: number, zc: number): THREE.BufferGeometry[] => {
    const out: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 10; i++) {
      const th = -1.05 + (i / 9) * 2.1;
      out.push(new THREE.CapsuleGeometry(0.075, h, 2, 7).scale(1, 1, 0.75).rotateY(th).translate(rx * Math.sin(th), y, zc + rz * Math.cos(th)));
    }
    return out;
  };
  one(merge(teeth(16.15, 0.17, 0.6, 0.78, 0.47)), 'head', bone, 'skelly-teeth');
  one(merge([ball([0, 15.98, 0.8], 1, [0.58, 0.24, 0.4])]), 'head', dark, 'skelly-mouth');

  // --- the jaw: the mandible (a field: flat rami that tuck under the skull's base) and the lower teeth
  one(isoGeometry(jawSDF, { min: [-1.0, 15.36, -0.55], max: [1.0, 16.6, 1.22] }, 36, undefined, 12000), 'jaw');
  one(merge(teeth(15.88, 0.15, 0.56, 0.74, 0.47)), 'jaw', bone, 'skelly-lowerteeth');

  // --- the spine: cervical on the neck, thoracic behind the ribs, lumbar between ribs and pelvis
  one(merge([0, 1, 2, 3].flatMap((i) => vertebra([0, 15.12 + i * 0.25, -0.22], 0.25, 0.19, 0.72, 0.3))), 'neck');
  one(merge([
    ...[0, 1, 2, 3, 4, 5].flatMap((i) => vertebra([0, 12.55 + i * 0.4, -0.82], 0.25, 0.26, 0.6, 0.28)),
    ...ribs(1), ...ribs(-1),
    // the sternum: a flat blade down the front, broad at the top
    ball([0, 13.55, 1.08], 1, [0.26, 1.05, 0.12], 12), ball([0, 14.42, 1.0], 1, [0.36, 0.32, 0.13], 10),
    // the clavicles, sternum to shoulder, an S in plan
    ...rod([[0.22, 14.72, 1.02], [0.85, 14.86, 0.9], [1.55, 14.98, 0.42], [2.18, 15.02, 0.02]], 0.13, 20, 8),
    ...rod([[-0.22, 14.72, 1.02], [-0.85, 14.86, 0.9], [-1.55, 14.98, 0.42], [-2.18, 15.02, 0.02]], 0.13, 20, 8),
    // the shoulder blades, flat on the back
    ball([1.25, 13.95, -1.0], 1, [0.62, 0.85, 0.09], 12), ball([-1.25, 13.95, -1.0], 1, [0.62, 0.85, 0.09], 12),
  ]), 'spine2');
  one(merge([0, 1, 2, 3].flatMap((i) => vertebra([0, 10.85 + i * 0.42, -0.42], 0.36, 0.3, 1.15, 0.45))), 'spine1');

  // --- the pelvis
  one(isoGeometry(pelvisSDF, { min: [-1.75, 8.72, -1.05], max: [1.75, 11.2, 1.05] }, 40, undefined, 24000), 'pelvis');

  // --- the arms: humerus; radius and ulna; the hand rides the forearm (the rig has no hand bone)
  both(merge([
    ball([2.33, 14.56, -0.03], 0.36),
    longBone([2.4, 14.45, 0], [2.71, 12.08, -0.05], 0.3, 0.2, 0.28),
    ball([2.53, 11.98, -0.05], 0.21, [1, 0.9, 1], 10), ball([2.88, 11.98, -0.06], 0.2, [1, 0.9, 1], 10),
  ]), 'arm');
  const fa: V3 = [2.72, 11.9, -0.05], wr: V3 = [2.85, 9.45, 0.4];
  const dir: V3 = [wr[0] - fa[0], wr[1] - fa[1], wr[2] - fa[2]];
  both(merge([
    ball([2.74, 11.98, -0.25], 0.21, [1, 1.1, 1], 10), // the point of the elbow
    longBone([2.76, 11.85, -0.2], [2.86, 9.62, 0.22], 0.19, 0.13, 0.16, 10), // the ulna
    longBone([2.66, 11.72, 0.12], [2.86, 9.62, 0.54], 0.16, 0.13, 0.21, 10), // the radius
    ...hand([wr[0], wr[1] - 0.05, wr[2]], dir),
  ]), 'forearm');

  // --- the legs: femur with its ball in the hip socket; tibia, fibula and kneecap; the foot
  both(merge([
    ball([1.12, 9.62, 0.02], 0.36),
    longBone([1.12, 9.6, 0], [1.55, 9.24, -0.03], 0.2, 0.18, 0.2, 10), // the neck
    ball([1.64, 9.3, -0.08], 0.3, [1, 1.2, 1]), // the greater trochanter
    longBone([1.56, 9.22, 0], [1.22, 5.62, 0.18], 0.28, 0.21, 0.34),
    ball([1.0, 5.5, 0.12], 0.29), ball([1.42, 5.5, 0.12], 0.29), // the condyles
  ]), 'thigh');
  both(merge([
    longBone([1.19, 5.12, 0.18], [1.16, 1.28, -0.08], 0.36, 0.18, 0.24), // the tibia
    ball([1.0, 1.16, -0.05], 0.17, [1, 1.2, 1], 10), // the inner ankle
    longBone([1.52, 4.95, 0.02], [1.47, 1.3, -0.16], 0.16, 0.09, 0.17, 10), // the fibula, ending in the outer ankle
    ball([1.2, 5.36, 0.62], 0.27, [1, 1.1, 0.55]), // the kneecap
  ]), 'shin');
  both(merge(foot()), 'foot');
}

const ECHO = new WeakMap<THREE.Object3D, { jaw: THREE.Object3D | null; embers: THREE.MeshStandardMaterial[] }>();

export const SKELETON: CharacterDef = {
  id: 'skeleton', name: 'Skelly', blurb: 'Bones, a grin, and green embers for eyes',
  segs: SKELLY_SEGMENTS,
  dress,
  // the skull is drawn a head-and-a-bit wide; the torso fit at 1.04 lets the ribcage cover a chest in a coat. Rigid
  // limbs only stretch a little toward the wearer: further, and every joint opens a visible gap.
  fit: { size: 1.04, limb: 0.3 },
  face: { eyes: [[0.43, 17.02, 1.3, 0.36], [-0.43, 17.02, 1.3, 0.36]] },
  tick(root, t, face) {
    let e = ECHO.get(root);
    if (!e) {
      // the wearer's own material copies (stage.ts clones them per wearer), found once; a WeakMap, not userData,
      // because the stage clones roots and userData is cloned through JSON
      const embers: THREE.MeshStandardMaterial[] = [];
      root.traverse((o) => { if (o.name === 'skelly-embers') embers.push((o as THREE.Mesh).material as THREE.MeshStandardMaterial); });
      e = { jaw: root.getObjectByName('jaw') ?? null, embers };
      ECHO.set(root, e);
    }
    // the embers breathe, with a flutter on top
    const k = 0.95 + 0.3 * Math.sin(t * 2.1) + 0.1 * Math.sin(t * 7.3 + 1.1);
    for (const m of e.embers) m.emissiveIntensity = k;
    // a clack of the jaw every few seconds: a short chatter, then shut
    if (e.jaw) {
      const ph = t % 4.6;
      // the wearer's mouth when it is read (face tracking); its own clack every few seconds when it is not
      e.jaw.rotation.x = face && face.jaw > 0.05 ? 0.02 + 0.55 * face.jaw : ph < 0.75 ? 0.05 + 0.07 * Math.abs(Math.sin(ph * 25)) : 0.02;
    }
  },
};
