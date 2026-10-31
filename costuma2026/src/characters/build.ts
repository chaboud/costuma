// A costume character, built once from code: an SDF body polygonised through three's MarchingCubes addon, coloured by
// region, skinned to a skeleton of named segments, with rigid meshes hung on the bones (eyes, props, or a whole blocky
// body). Adapted from Strollzilla's src/render/kaiju/build.ts (93b9331): the same surface, weights and capture rules,
// generalised so a character is a definition (roster.ts) rather than a switch on species.
//
// Frame: metres for a 20-unit-tall figure standing on y = 0, x to its left, y up, +z forward (its nose) — the
// Strollzilla frame. The stage scales the whole thing down to the wearer.
import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import type { Seg } from './sdf';
import { createKaijuMaterial } from './material';
import { addFur } from './fur';

export type Field = (x: number, y: number, z: number) => number;
export interface Box { min: readonly [number, number, number]; max: readonly [number, number, number] }
export type Surface = 'scales' | 'armour' | 'soft' | 'suit' | 'fur';
export interface Fur { length: number; density: number; tip: number; feather?: boolean }
/** may bone `sg` take the skin at (x, y, z)? (build.ts in Strollzilla: stops a thigh taking the hip, an arm the chest) */
export type Capture = (sg: { name: string; a: readonly number[] }, x: number, y: number, z: number) => boolean;

export interface Body {
  sdf: Field;
  /** region code at a point: an index into `palette` */
  region: Field;
  box: Box;
  palette: number[];
  surface?: Surface;
  /** sharp: a suit bends at the joint; soft: a round body stretches; rigid: armour follows one bone */
  weights?: 'sharp' | 'soft' | 'rigid';
  capture?: Capture;
  fur?: Fur;
  furLen?: Field;
  /** a last word on a vertex's colour (a darker back, a gradient) */
  tint?: (region: number, x: number, y: number, z: number, c: THREE.Color) => void;
}

export interface Dresser {
  bones: Map<string, THREE.Bone>;
  segs: Seg[];
  /** hang `m` on `bone` with its origin at model point (x, y, z) */
  at(m: THREE.Object3D, bone: string, x: number, y: number, z: number): THREE.Object3D;
  std(p: THREE.MeshStandardMaterialParameters): THREE.MeshStandardMaterial;
}

export interface CharacterDef {
  id: string;
  name: string;
  blurb: string;
  segs: Seg[];
  body?: Body;
  /** meshes on bones; for a blocky character, the whole figure */
  dress?: (d: Dresser) => void;
  /**
   * how it is fitted to the wearer: `size` scales it past torso-matching (a round body needs more to cover a person);
   * `limb` 0..1 how far its limbs stretch toward the wearer's own lengths (0 keeps its proportions); `head` 0..1 how far
   * its neck squashes to put its head on the wearer's (default 0.85)
   */
  fit?: { size?: number; limb?: number; head?: number };
  /** procedural motion the camera cannot see: a tail's sway (radians) */
  idle?: { tail?: number };
  /** marching-cubes grid; more is finer and slower to build */
  res?: number;
  /** strands of fur layers (when body.fur) */
  furShells?: number;
  /**
   * per-frame motion of the costume's own (lights twinkling, a flame flickering): called on each worn instance with the
   * instance's root (find parts by name) and seconds since start. Cheap, and never allocate in it.
   */
  tick?: (root: THREE.Object3D, t: number) => void;
}

export interface Built {
  def: CharacterDef;
  /** what goes in the scene: the skinned mesh, or a group holding the root bone */
  root: THREE.Object3D;
  bones: Map<string, THREE.Bone>;
  fur: THREE.SkinnedMesh[];
  /** ms it took */
  ms: number;
}

/** A skinned surface as plain arrays: what a worker computes and hands back (build.worker.ts). */
export interface SurfaceArrays {
  position: Float32Array; normal: Float32Array; color: Float32Array; skinIndex: Uint16Array; skinWeight: Float32Array; aFur?: Float32Array;
}
/** the arrays' buffers, for postMessage's transfer list */
export const transferOf = (a: SurfaceArrays): ArrayBuffer[] =>
  [a.position, a.normal, a.color, a.skinIndex, a.skinWeight, ...(a.aFur ? [a.aFur] : [])].map((x) => x.buffer as ArrayBuffer);

export function geometryOf(a: SurfaceArrays): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(a.position, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(a.normal, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(a.color, 3));
  if (a.aFur) geo.setAttribute('aFur', new THREE.BufferAttribute(a.aFur, 1));
  geo.setAttribute('skinIndex', new THREE.BufferAttribute(a.skinIndex, 4));
  geo.setAttribute('skinWeight', new THREE.BufferAttribute(a.skinWeight, 4));
  return geo;
}

/** The skinned surface at a grid resolution: positions, normals, region colours, the two nearest bones' weights. */
export function surface(body: Body, segs: Seg[], res: number): THREE.BufferGeometry {
  return geometryOf(surfaceArrays(body, segs, res));
}

export function surfaceArrays(body: Body, segs: Seg[], res: number): SurfaceArrays {
  const B = body.box;
  const cx = (B.min[0] + B.max[0]) / 2, cy = (B.min[1] + B.max[1]) / 2, cz = (B.min[2] + B.max[2]) / 2;
  const hx = (B.max[0] - B.min[0]) / 2, hy = (B.max[1] - B.min[1]) / 2, hz = (B.max[2] - B.min[2]) / 2;
  const mc = new MarchingCubes(res, new THREE.MeshBasicMaterial(), false, false, 400000);
  mc.isolation = 50;
  const f = mc.field as Float32Array;
  const n = res;
  for (let k = 0; k < n; k++) {
    const z = cz + ((k / (n - 1)) * 2 - 1) * hz;
    for (let j = 0; j < n; j++) {
      const y = cy + ((j / (n - 1)) * 2 - 1) * hy;
      for (let i = 0; i < n; i++) {
        const x = cx + ((i / (n - 1)) * 2 - 1) * hx;
        f[k * n * n + j * n + i] = Math.max(0, Math.min(100, 50 - body.sdf(x, y, z) * 40));
      }
    }
  }
  mc.update();
  const count = mc.count;
  const pos = new Float32Array(count * 3), nor = new Float32Array(count * 3), col = new Float32Array(count * 3);
  const pa = mc.positionArray as Float32Array, na = mc.normalArray as Float32Array;
  const pal = body.palette.map((h) => new THREE.Color(h));
  const c = new THREE.Color();
  for (let v = 0; v < count; v++) {
    const x = cx + pa[v * 3]! * hx, y = cy + pa[v * 3 + 1]! * hy, z = cz + pa[v * 3 + 2]! * hz;
    pos[v * 3] = x; pos[v * 3 + 1] = y; pos[v * 3 + 2] = z;
    let nx = na[v * 3]! / hx, ny = na[v * 3 + 1]! / hy, nz = na[v * 3 + 2]! / hz;
    const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
    nor[v * 3] = nx; nor[v * 3 + 1] = ny; nor[v * 3 + 2] = nz;
    const r = body.region(x, y, z);
    c.copy(pal[r] ?? pal[0]!);
    body.tint?.(r, x, y, z, c);
    // a little variation down the body so it isn't a flat colour
    const v1 = 0.94 + 0.06 * Math.sin(y * 1.7 + z * 0.9) * Math.cos(x * 2.3);
    col[v * 3] = c.r * v1; col[v * 3 + 1] = c.g * v1; col[v * 3 + 2] = c.b * v1;
  }
  mc.geometry.dispose();
  let aFur: Float32Array | undefined;
  if (body.fur) {
    aFur = new Float32Array(count);
    for (let v = 0; v < count; v++) aFur[v] = body.furLen ? body.furLen(pos[v * 3]!, pos[v * 3 + 1]!, pos[v * 3 + 2]!) : 1;
  }
  const idx = new Uint16Array(count * 4), wts = new Float32Array(count * 4);
  const segList = segs.map((sg, i) => ({ i, a: sg.a, b: sg.b, reach: sg.reach ?? Infinity, name: sg.name }));
  const takes = body.capture;
  const mode = body.weights ?? 'sharp';
  for (let v = 0; v < count; v++) {
    const x = pos[v * 3]!, y = pos[v * 3 + 1]!, z = pos[v * 3 + 2]!;
    let d0 = Infinity, d1 = Infinity, i0 = 0, i1 = 0;
    for (const sg of segList) {
      if (takes && !takes(sg, x, y, z)) continue;
      const bax = sg.b[0] - sg.a[0], bay = sg.b[1] - sg.a[1], baz = sg.b[2] - sg.a[2];
      const pax = x - sg.a[0], pay = y - sg.a[1], paz = z - sg.a[2];
      const t = Math.max(0, Math.min(1, (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz || 1)));
      const d = Math.hypot(pax - bax * t, pay - bay * t, paz - baz * t);
      if (d > sg.reach) continue;
      if (d < d0) { d1 = d0; i1 = i0; d0 = d; i0 = sg.i; } else if (d < d1) { d1 = d; i1 = sg.i; }
    }
    if (!isFinite(d1)) { d1 = d0; i1 = i0; }
    const w0 = mode === 'rigid' ? 1 : mode === 'soft' ? 1 / Math.pow(d0 + 1.2, 2) : 1 / Math.pow(d0 + 0.3, 4);
    const w1 = mode === 'rigid' ? 0 : mode === 'soft' ? 1 / Math.pow(d1 + 1.2, 2) : 1 / Math.pow(d1 + 0.3, 4);
    const sum = w0 + w1;
    idx[v * 4] = i0; idx[v * 4 + 1] = i1;
    wts[v * 4] = w0 / sum; wts[v * 4 + 1] = w1 / sum;
  }
  return { position: pos, normal: nor, color: col, skinIndex: idx, skinWeight: wts, aFur };
}

/** the resolutions a character is built at: its body, and its fur's coarser shell */
export const resOf = (def: CharacterDef, res = def.res ?? 88) => ({ body: res, fur: Math.max(32, Math.round(res * 0.6)) });

/** The bones, one per segment, positioned at their `a` ends relative to their parent, identity rotations. */
export function skeleton(segs: Seg[]): { bones: Map<string, THREE.Bone>; root: THREE.Bone } {
  const bones = new Map<string, THREE.Bone>();
  let root: THREE.Bone | null = null;
  for (const s of segs) {
    const b = new THREE.Bone();
    b.name = s.name;
    if (s.parent) {
      const p = segs.find((q) => q.name === s.parent)!;
      b.position.set(s.a[0] - p.a[0], s.a[1] - p.a[1], s.a[2] - p.a[2]);
      bones.get(s.parent)!.add(b);
    } else {
      b.position.set(s.a[0], s.a[1], s.a[2]);
      root = b;
    }
    bones.set(s.name, b);
  }
  return { bones, root: root! };
}

/** `pre`: the surfaces already computed (by the worker); without, they are computed here */
export function buildCharacter(def: CharacterDef, res = def.res ?? 88, pre?: { body: SurfaceArrays; fur: SurfaceArrays | null }): Built {
  const t0 = performance.now();
  const R = resOf(def, res);
  const { bones, root } = skeleton(def.segs);
  let top: THREE.Object3D;
  let fur: THREE.SkinnedMesh[] = [];
  if (def.body) {
    const body = def.body;
    const geo = pre ? geometryOf(pre.body) : surface(body, def.segs, R.body);
    const surf = body.surface === 'scales' ? undefined : body.surface === 'fur' ? undefined : body.surface;
    const mesh = new THREE.SkinnedMesh(geo, createKaijuMaterial(!!body.fur || body.surface === 'fur', surf));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(root);
    mesh.bind(new THREE.Skeleton(def.segs.map((s) => bones.get(s.name)!)));
    if (body.fur && (def.furShells ?? 10) > 0) fur = addFur(mesh, pre?.fur ? geometryOf(pre.fur) : surface(body, def.segs, R.fur), body.fur, def.furShells ?? 10);
    top = mesh;
  } else {
    const g = new THREE.Group();
    g.add(root);
    top = g;
  }
  if (def.dress) {
    const mats = new Map<string, THREE.MeshStandardMaterial>();
    def.dress({
      bones, segs: def.segs,
      at(m, bone, x, y, z) {
        const sg = def.segs.find((q) => q.name === bone)!;
        m.position.set(x - sg.a[0], y - sg.a[1], z - sg.a[2]);
        m.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        bones.get(bone)!.add(m);
        return m;
      },
      std(p) {
        const k = JSON.stringify(p);
        let m = mats.get(k);
        if (!m) { m = new THREE.MeshStandardMaterial(p); mats.set(k, m); }
        return m;
      },
    });
  }
  top.name = def.id;
  return { def, root: top, bones, fur, ms: performance.now() - t0 };
}

/** Rest-pose facts the retargeter needs: each segment's direction and the torso's landmarks. */
export interface RestInfo {
  dir: Map<string, THREE.Vector3>;
  /** midpoint of the hip joints (thighs' a) and of the shoulders (arms' a), model units */
  hip: THREE.Vector3;
  shoulder: THREE.Vector3;
  torso: number;
  len: Map<string, number>;
}
export function restInfo(segs: Seg[]): RestInfo {
  const dir = new Map<string, THREE.Vector3>(), len = new Map<string, number>();
  for (const s of segs) {
    const v = new THREE.Vector3(s.b[0] - s.a[0], s.b[1] - s.a[1], s.b[2] - s.a[2]);
    len.set(s.name, v.length());
    dir.set(s.name, v.lengthSq() > 0 ? v.normalize() : new THREE.Vector3(0, 1, 0));
  }
  const get = (n: string) => segs.find((s) => s.name === n)!;
  const hip = new THREE.Vector3(...get('thighL').a).add(new THREE.Vector3(...get('thighR').a)).multiplyScalar(0.5);
  const shoulder = new THREE.Vector3(...get('armL').a).add(new THREE.Vector3(...get('armR').a)).multiplyScalar(0.5);
  return { dir, hip, shoulder, torso: shoulder.distanceTo(hip), len };
}
