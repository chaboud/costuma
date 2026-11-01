// Howler: a wolf man (founder, 2026-10-06: "a giant wolf man style (homage to rampage)"). An original design, no game's
// or film's werewolf: a hunched biped on digitigrade legs, a deep chest under a shaggy ruff, a long muzzle with a black
// nose, tall pointed ears, long arms ending in claws, a bushy tail; grey with a pale chest and muzzle and a dark saddle,
// eyes that glow amber. An upright plan on the rig's bone names (hero.ts's frame and capture rules): the tail bones carry
// its tail. Metres for a 20 m wolf man, the sdf.ts frame (y up, +z forward). Fur as shells (fur.ts).
//
// The face moves with the wearer's (FaceState, build.ts; `howlerTick` below): the lower jaw is a mesh of its own, rigid
// on the `jaw` bone and furred like the body, so an open mouth is a clean gap with a dark palate, a tongue and fangs
// (kaiju.ts's jaw, with fur); the eyes glow behind lids that blink, squint and widen, their pupils look where the wearer
// looks; a brow ridge over each eye, the ears and the upper lips ride small bones (`earL`, `browL`, `lipL`, …) that take
// a smooth share of the head's skin (`faceZones`), so a scowl, ears pinned back and a snarl that bares the fangs bend
// the furred surface itself instead of moving stuck-on pieces.
import * as THREE from 'three';
import type { Dresser, FaceState, Field, Fur } from './build';
import { addFur } from './fur';
import { createKaijuMaterial } from './material';
import { isoGeometry } from './skeleton';
import { eyelids, faceLids, look, setLids } from './faceparts';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { sdCapsule, sdEllipsoid, sdSphere, smin, type Seg } from './sdf';

// ---- shared with jimothy.ts: face bones that bend the skin, and rigid parts that keep the coat ----

export const sstep = (a: number, b: number, v: number): number => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
export const smax = (a: number, b: number, k: number): number => -smin(-a, -b, k);

/** a face bone and how much of the head's skin it takes at a model point (0..1, smooth) */
export interface Zone { bone: string; w: (x: number, y: number, z: number) => number }

/**
 * Blend face bones into a skinned body's head: at each vertex every zone's bone takes its share of what the head bone
 * held there (never the neck's or the body's), on the body and on its fur's coarser surface alike, so the coat follows.
 * The bones are segments with `reach: 0` (the build gives them no skin of their own). Run in `dress`, on the template:
 * every wearer's copy shares the geometry. At most two zones meet at a vertex (the weights' last two slots).
 */
export function faceZones(d: Dresser, zones: Zone[]): void {
  const body = d.bones.get('pelvis')!.parent as THREE.SkinnedMesh | null;
  if (!body?.isSkinnedMesh) return;
  const geos = new Set<THREE.BufferGeometry>([body.geometry]);
  for (const c of body.children) if ((c as THREE.SkinnedMesh).isSkinnedMesh && c.userData.h !== undefined) geos.add((c as THREE.SkinnedMesh).geometry);
  const head = d.segs.findIndex((s) => s.name === 'head');
  const bone = zones.map((z) => d.segs.findIndex((s) => s.name === z.bone));
  const take = [0, 0], who = [0, 0];
  for (const geo of geos) {
    const pos = geo.attributes.position!, si = geo.attributes.skinIndex!, sw = geo.attributes.skinWeight!;
    for (let i = 0; i < pos.count; i++) {
      // a vertex only one bone may take holds it twice, at half each (build.ts): one slot of it
      const i0 = si.getX(i), same = si.getY(i) === i0, i1 = same ? 0 : si.getY(i);
      let w0 = sw.getX(i) + (same ? sw.getY(i) : 0), w1 = same ? 0 : sw.getY(i);
      const hs = (i0 === head ? w0 : 0) + (i1 === head ? w1 : 0);
      if (hs < 1e-4) continue;
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      let n = 0, rem = hs;
      for (let k = 0; k < zones.length && n < 2; k++) {
        const w = zones[k]!.w(x, y, z);
        if (w < 2e-3) continue;
        take[n] = rem * Math.min(1, w); who[n] = bone[k]!; rem -= take[n]!; n++;
      }
      if (!n) continue;
      const keep = rem / hs;
      if (i0 === head) w0 *= keep;
      if (i1 === head) w1 *= keep;
      si.setXYZW(i, i0, i1, who[0]!, n > 1 ? who[1]! : 0);
      sw.setXYZW(i, w0, w1, take[0]!, n > 1 ? take[1]! : 0);
    }
    si.needsUpdate = true; sw.needsUpdate = true;
  }
}

/**
 * A rigid part with the body's coat: `sdf` (model coordinates) polygonised in `box`, coloured by `color`, skinned wholly
 * to `bone` on the body's own skeleton (as the fur's layers are), with the body's fur grown on it to `furLen` (0 bare).
 * A plain mesh on the bone would be bald; this one is the same undercoat and strands as the skin beside it.
 */
export function furredPart(d: Dresser, name: string, bone: string, sdf: Field, box: { min: readonly [number, number, number]; max: readonly [number, number, number] },
  res: number, color: (x: number, y: number, z: number, c: THREE.Color) => void, fur: Fur | undefined, shells: number, furLen: Field): THREE.SkinnedMesh | null {
  const body = d.bones.get('pelvis')!.parent as THREE.SkinnedMesh | null;
  if (!body?.isSkinnedMesh) return null;
  const geo = isoGeometry(sdf, box, res, color, 24000);
  const n = geo.attributes.position!.count, p = geo.attributes.position!;
  const si = new Uint16Array(n * 4), sw = new Float32Array(n * 4), af = new Float32Array(n);
  const b = d.segs.findIndex((s) => s.name === bone);
  for (let i = 0; i < n; i++) { si[i * 4] = b; sw[i * 4] = 1; af[i] = furLen(p.getX(i), p.getY(i), p.getZ(i)); }
  geo.setAttribute('skinIndex', new THREE.BufferAttribute(si, 4));
  geo.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
  geo.setAttribute('aFur', new THREE.BufferAttribute(af, 1));
  const m = new THREE.SkinnedMesh(geo, createKaijuMaterial(!!fur));
  m.name = name;
  m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false;
  body.add(m);
  m.bind(body.skeleton, body.bindMatrix);
  if (fur && shells > 0) addFur(m, geo, fur, shells);
  return m;
}

/**
 * The mouth's sides: a membrane at each corner from the hinge forward along `edge` (the left side's points, back to
 * front, model coordinates, on the mouth line), its top row on the head and its bottom on the jaw, the rows between
 * blended. Shut it has no height; open it fills the wedge between palate and jaw, so the mouth is a cavity from the side
 * instead of a gap you see the room through. Mirrored for the right.
 */
export function mouthSides(d: Dresser, name: string, edge: readonly (readonly [number, number, number])[], color: number): THREE.SkinnedMesh | null {
  const body = d.bones.get('pelvis')!.parent as THREE.SkinnedMesh | null;
  if (!body?.isSkinnedMesh) return null;
  const head = d.segs.findIndex((s) => s.name === 'head'), jaw = d.segs.findIndex((s) => s.name === 'jaw');
  const R = 4, n = edge.length, pos: number[] = [], nor: number[] = [], si: number[] = [], sw: number[] = [], idx: number[] = [];
  for (const sx of [1, -1]) {
    const base = pos.length / 3;
    for (const p of edge) for (let r = 0; r <= R; r++) {
      pos.push(sx * p[0], p[1], p[2]); nor.push(sx, 0, 0);
      si.push(head, jaw, 0, 0); sw.push(1 - r / R, r / R, 0, 0);
    }
    for (let i = 0; i + 1 < n; i++) for (let r = 0; r < R; r++) {
      const a = base + i * (R + 1) + r, b = a + R + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
  geo.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
  geo.setIndex(idx);
  const m = new THREE.SkinnedMesh(geo, d.std({ color, roughness: 0.8, side: THREE.DoubleSide }));
  m.name = name;
  m.frustumCulled = false; m.receiveShadow = true;
  body.add(m);
  m.bind(body.skeleton, body.bindMatrix);
  return m;
}

/** a blink now and then while no face is read (0 at t = 0.6, the lab's still) */
export const idleBlink = (t: number): number => { const u = (t + 1.3) % 4.6; return u < 0.16 ? Math.sin((u / 0.16) * Math.PI) : 0; };

// The mouth: a level line through the jaw's hinge, under the eye; below it, ahead of the hinge and within MOUTH_W of
// the middle, the head is the lower jaw's (its own mesh, rigid on the `jaw` bone)
const MOUTH_Y = 16.0, HINGE_Z = 3.75, MOUTH_W = 0.66;
/** the jaw's share of the head, as a distance (negative inside) */
const jawRegion = (ax: number, y: number, z: number) => Math.max(y - MOUTH_Y, HINGE_Z - z, ax - MOUTH_W);
// the face's bones (the left; the right mirrored): an ear's pivot at its root, a brow's on the ridge over the eye, an
// upper lip's at its front, by the canine, so a grin lifts its back corner
const EAR_A: [number, number, number] = [0.8, 17.85, 3.05], EAR_B: [number, number, number] = [1.05, 19.4, 2.7];
const BROW: [number, number, number] = [0.6, 17.45, 4.8], LIP: [number, number, number] = [0.38, 16.15, 6.55];
const mxw = (p: [number, number, number]): [number, number, number] => [-p[0], p[1], p[2]];

export const WOLF_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 9.4, -0.6], b: [0, 10.4, 0], parent: null },
  { name: 'spine1', a: [0, 10.4, 0], b: [0, 12.6, 0.8], parent: 'pelvis' },
  { name: 'spine2', a: [0, 12.6, 0.8], b: [0, 14.8, 1.9], parent: 'spine1' },
  { name: 'neck', a: [0, 14.8, 1.9], b: [0, 16.0, 3.0], parent: 'spine2', reach: 1.6 },
  { name: 'head', a: [0, 16.0, 3.0], b: [0, 16.6, 5.8], parent: 'neck' },
  // the jaw's mesh is rigid (no skin): `a` its hinge, `b` the middle of the mouth's opening (where the breath leaves)
  { name: 'jaw', a: [0, MOUTH_Y, HINGE_Z], b: [0, MOUTH_Y - 0.15, 6.2], parent: 'head', reach: 0 },
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
  // the face's bones: no skin from the build (reach 0); howlerDress gives each a share of the head's (faceZones)
  { name: 'earL', a: EAR_A, b: EAR_B, parent: 'head', reach: 0 },
  { name: 'earR', a: mxw(EAR_A), b: mxw(EAR_B), parent: 'head', reach: 0 },
  { name: 'browL', a: BROW, b: [BROW[0] + 0.45, BROW[1], BROW[2] - 0.35], parent: 'head', reach: 0 },
  { name: 'browR', a: mxw(BROW), b: [-BROW[0] - 0.45, BROW[1], BROW[2] - 0.35], parent: 'head', reach: 0 },
  { name: 'lipL', a: LIP, b: [LIP[0] + 0.08, LIP[1] - 0.1, LIP[2] - 1.9], parent: 'head', reach: 0 },
  { name: 'lipR', a: mxw(LIP), b: [-LIP[0] - 0.08, LIP[1] - 0.1, LIP[2] - 1.9], parent: 'head', reach: 0 },
];

export const WOLF_BOX = { min: [-5.0, -0.5, -8.6] as [number, number, number], max: [5.0, 20.4, 8.6] as [number, number, number] };
export const WOLF_EYES: [number, number, number] = [0.62, 17.05, 4.75];
const NOSE: [number, number, number] = [0, 16.35, 7.35];

/** the whole head before the mouth is cut: a skull, a long muzzle with flews along its underside, a brow ridge, tall
 *  ears, sockets for the eyes. Not the lower jaw: the jaw's mesh (wolfJawSDF) adds its own */
function wolfHead(x: number, ax: number, y: number, z: number): number {
  let h = sdEllipsoid(x, y, z, 0, 16.9, 3.6, 1.35, 1.25, 1.55);
  h = smin(h, sdCapsule(x, y, z, 0, 16.7, 4.6, 0, 16.3, 7.1, 0.82, 0.45), 0.5); // the muzzle
  // the flews: the upper lips, full along the muzzle's underside so they cover the lower jaw's top
  h = smin(h, sdEllipsoid(ax, y, z, 0.36, 16.0, 5.4, 0.27, 0.24, 1.55), 0.3);
  h = smin(h, sdEllipsoid(ax, y, z, 1.15, 16.5, 3.6, 0.55, 0.75, 0.9), 0.4); // the cheeks' fur
  h = smin(h, sdCapsule(ax, y, z, 0.22, 17.4, 4.95, 0.95, 17.5, 4.45, 0.2, 0.17), 0.22); // the brow ridge
  h = smin(h, sdCapsule(ax, y, z, 0.75, 17.8, 3.1, 1.05, 19.4, 2.7, 0.5, 0.06), 0.3); // ears
  return Math.max(h, -sdSphere(ax, y, z, WOLF_EYES[0], WOLF_EYES[1], WOLF_EYES[2] + 0.12, 0.3)); // eye sockets
}
/** on the faces the jaw's cut leaves in the head (the palate, its walls), well inside the lip's fillet */
function inMouth(x: number, y: number, z: number): boolean {
  const ax = Math.abs(x), c = jawRegion(ax, y, z);
  if (c > 0.08 || c < -0.6) return false;
  const raw = wolfHead(x, ax, y, z);
  return -c > raw - 0.02 && raw < -0.06;
}

/** the lower jaw, a mesh rigid on the `jaw` bone: the head's share under the mouth line, and the jaw itself */
function wolfJawSDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let j = smax(wolfHead(x, ax, y, z), jawRegion(ax, y, z), 0.06);
  j = smin(j, sdCapsule(x, y, z, 0, 15.8, 4.4, 0, 15.75, 6.7, 0.55, 0.32), 0.25);
  return Math.max(j, y - MOUTH_Y, HINGE_Z - 0.3 - z);
}
const JAW_BOX = { min: [-0.9, 15.0, 3.3], max: [0.9, MOUTH_Y + 0.05, 7.3] } as const;

export function wolfSDF(x: number, y: number, z: number, bulk = 0): number {
  const ax = Math.abs(x);
  // a deep chest leaning forward over a lean waist and narrow hips
  let d = sdEllipsoid(x, y, z, 0, 13.4, 1.4, 2.6, 2.5, 2.1);
  d = smin(d, sdEllipsoid(x, y, z, 0, 11.2, 0.4, 1.7, 1.6, 1.4), 0.9); // the waist
  d = smin(d, sdEllipsoid(x, y, z, 0, 9.8, -0.4, 2.0, 1.2, 1.5), 0.7); // the hips
  d = smin(d, sdEllipsoid(x, y, z, 0, 15.1, 1.6, 2.3, 1.5, 2.0), 0.8); // the ruff over the shoulders
  d = smin(d, sdSphere(ax, y, z, 2.5, 14.2, 1.5, 1.05), 0.7); // the shoulders
  // the head, with the lower jaw's share cut away (a fine fillet at the lip: the line a shut mouth shows)
  d = smin(d, smax(wolfHead(x, ax, y, z), -jawRegion(ax, y, z), 0.08), 0.6);
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

/**
 * Regions: 0 grey fur, 1 pale (chest, belly, muzzle, throat, inner legs), 2 dark (the saddle, ears' backs, tail tip), 3
 * nose, lips and claws, 4 the mouth's inside (the palate and the walls the jaw leaves, seen only when it opens).
 */
export const WOLF_PALETTE = [0x77706a, 0xb8afa0, 0x34302c, 0x121010, 0x4a1c20];
export function wolfRegion(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  if (Math.hypot(x, y - NOSE[1], z - NOSE[2]) < 0.45) return 3;
  if (inMouth(x, y, z)) return 4;
  if (y > MOUTH_Y - 0.08 && y < MOUTH_Y + 0.1 && z > HINGE_Z + 0.5 && z < 7.4) return 3; // the black lip line
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
  if (wolfRegion(x, y, z) >= 3) return 0;
  // bare along the mouth line: the fur's coarser shell cannot follow the cut, and strands there took the mouth's red
  if (Math.abs(y - MOUTH_Y) < 0.16 && z > HINGE_Z - 0.2 && ax < MOUTH_W + 0.12) return 0;
  if (Math.hypot(ax - WOLF_EYES[0], y - WOLF_EYES[1], z - WOLF_EYES[2]) < 0.65) return 0;
  if (z > 4.6 && y > 15.2) return 0.35; // the muzzle
  if (y > 17.6) return 0.4; // the ears
  if (y > 14.0 && y < 16.4 && z < 3.4) return 1.4; // the ruff
  if (z < -1.4 && y < 9.6) return 1.4; // the tail
  if (y < 3.0) return 0.45; // the feet
  return 1;
}

// ---- Howler's face (species.ts HOWLER: dress, tick) ----

const leftShare = (x: number) => sstep(-0.12, 0.12, x);
const ZONES: Zone[] = [1, -1].flatMap((sx) => {
  const s = sx > 0 ? 'L' : 'R', side = (x: number) => (sx > 0 ? leftShare(x) : 1 - leftShare(x));
  const ea = [sx * EAR_A[0], EAR_A[1], EAR_A[2]], eb = [sx * EAR_B[0], EAR_B[1], EAR_B[2]];
  const ex = eb[0]! - ea[0]!, ey = eb[1]! - ea[1]!, ez = eb[2]! - ea[2]!, el = ex * ex + ey * ey + ez * ez;
  return [
    // an ear: from a little up its root to the tip, near its own shape, so the root bends and the skull stays
    { bone: 'ear' + s, w: (x: number, y: number, z: number) => {
      const t = ((x - ea[0]!) * ex + (y - ea[1]!) * ey + (z - ea[2]!) * ez) / el;
      const d = sdCapsule(x, y, z, ea[0]!, ea[1]!, ea[2]!, eb[0]!, eb[1]!, eb[2]!, 0.5, 0.06);
      return side(x) * sstep(0.03, 0.3, t) * sstep(0.6, 0.2, d);
    } },
    // a brow: the ridge over the eye and the fur round it
    { bone: 'brow' + s, w: (x: number, y: number, z: number) => {
      const r = Math.hypot((sx * x - BROW[0]) / 0.6, (y - BROW[1]) / 0.42, (z - BROW[2]) / 0.65);
      return side(x) * (1 - sstep(0.4, 1.0, r));
    } },
    // an upper lip: the flew and the muzzle's side over the fangs, up to under the nose
    { bone: 'lip' + s, w: (x: number, y: number, z: number) => {
      const r = Math.hypot((sx * x - 0.4) / 0.5, (y - 16.15) / 0.55, (z - 6.0) / 1.6);
      return side(x) * (1 - sstep(0.4, 1.0, r)) * sstep(MOUTH_Y - 0.3, MOUTH_Y - 0.05, y + 0.25);
    } },
  ];
});

/** its jaw's colours: the top inside the lips is the mouth's, the rest the head's (wolfRegion) */
function jawColour(x: number, y: number, z: number, c: THREE.Color): void {
  // on top, the mouth only well inside the upper lip's footprint; at its rim the black lip, the line a shut mouth shows
  const top = y > MOUTH_Y - 0.05, inside = top && wolfHead(x, Math.abs(x), MOUTH_Y + 0.02, z) < -0.15;
  c.setHex(inside ? WOLF_PALETTE[4]! : top ? WOLF_PALETTE[3]! : WOLF_PALETTE[wolfRegion(x, y, z)]!);
}
const jawFur = (x: number, y: number, z: number) => (y > MOUTH_Y - 0.08 || Math.abs(x) > MOUTH_W - 0.06 ? 0 : wolfFurLength(x, y, z));

const HOWL_FUR = { length: 0.8, density: 7, tip: 0.22 };
export function howlerDress(d: Dresser): void {
  faceZones(d, ZONES);
  // eyes that glow amber, a dark pupil each that turns where the wearer looks, under slanted lids
  const glow = d.std({ color: 0xffb020, emissive: 0xffb020, emissiveIntensity: 1.8, roughness: 0.3 });
  const pupil = d.std({ color: 0x0c0806, roughness: 0.3 });
  const lid = d.std({ color: 0x2c2826, roughness: 0.9 });
  for (const [sx, s] of [[1, 'L'], [-1, 'R']] as const) {
    const eye = new THREE.Group();
    eye.name = 'howl-eye' + s;
    eye.add(new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 12), glow));
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), pupil);
    p.position.z = 0.205; p.scale.set(0.62, 1.2, 0.4);
    eye.add(p);
    d.at(eye, 'head', sx * WOLF_EYES[0], WOLF_EYES[1], WOLF_EYES[2]);
    d.at(eyelids('howl-lid' + s, 0.24, lid, { gap: 0.1, tilt: sx * 0.3, open: 0.85 }), 'head', sx * WOLF_EYES[0], WOLF_EYES[1], WOLF_EYES[2]);
  }
  // the lower jaw, furred, a tongue on it; fangs and incisors in both jaws, the uppers' points just over the lower lip
  furredPart(d, 'howl-jaw', 'jaw', wolfJawSDF, JAW_BOX, 30, jawColour, HOWL_FUR, 6, jawFur);
  const tongue = new THREE.SphereGeometry(1, 18, 10).scale(0.3, 0.12, 0.95).translate(0, MOUTH_Y - 0.13, 5.35);
  d.at(new THREE.Mesh(tongue, d.std({ color: 0xb8505c, roughness: 0.45 })), 'jaw', 0, 0, 0);
  const tooth = d.std({ color: 0xf0ead8, roughness: 0.35 });
  const fang = (x: number, z: number, len: number, r: number, down: boolean, root = 0.25) => {
    const g = new THREE.ConeGeometry(r, len, 7);
    if (down) g.rotateX(Math.PI);
    return g.translate(x, MOUTH_Y + (down ? root - len / 2 : len / 2 - root), z);
  };
  const upper: THREE.BufferGeometry[] = [], lower: THREE.BufferGeometry[] = [];
  for (const sx of [1, -1]) {
    // the canines' roots go deep, so a snarl lifting the lip half a metre still bares tooth, not a root in the air
    upper.push(fang(sx * 0.42, 6.3, 0.95, 0.11, true, 0.5), fang(sx * 0.44, 5.6, 0.6, 0.07, true, 0.45), fang(sx * 0.44, 5.05, 0.55, 0.07, true, 0.45));
    lower.push(fang(sx * 0.24, 6.45, 0.55, 0.085, false), fang(sx * 0.27, 5.5, 0.3, 0.06, false));
    for (const x of [0.07, 0.19]) { upper.push(fang(sx * x, 6.95, 0.5, 0.045, true, 0.38)); lower.push(fang(sx * x, 6.6, 0.34, 0.04, false)); }
  }
  d.at(new THREE.Mesh(mergeGeometries(upper)!, tooth), 'head', 0, 0, 0);
  d.at(new THREE.Mesh(mergeGeometries(lower)!, tooth), 'jaw', 0, 0, 0);
  // the mouth's sides and a dark throat behind
  const edge: [number, number, number][] = [];
  for (let i = 0; i <= 8; i++) { const z = HINGE_Z + 0.05 + (i / 8) * 2.0; edge.push([0.5 - 0.08 * (z - HINGE_Z), MOUTH_Y, z]); }
  mouthSides(d, 'howl-mouth', edge, 0x2a1214);
  const throat = new THREE.SphereGeometry(1, 14, 8).scale(0.45, 0.3, 0.5).translate(0, MOUTH_Y - 0.32, HINGE_Z + 0.55);
  d.at(new THREE.Mesh(throat, d.std({ color: 0x1a0b0c, roughness: 0.9 })), 'head', 0, 0, 0);
}

/** per worn root: the face's moving parts, found once (a WeakMap: userData is JSON-copied when the stage clones) */
type Obj = THREE.Object3D | null;
interface HowlFace { eyes: Obj[]; lids: Obj[]; ears: Obj[]; brows: Obj[]; lips: Obj[] }
const FACES = new WeakMap<THREE.Object3D, HowlFace>();
const HEAD_A = WOLF_SEGMENTS.find((s) => s.name === 'head')!.a;
const BROW_O = [BROW[0] - HEAD_A[0], BROW[1] - HEAD_A[1], BROW[2] - HEAD_A[2]], LIP_O = [LIP[0] - HEAD_A[0], LIP[1] - HEAD_A[1], LIP[2] - HEAD_A[2]];
/** an ear's twitch now and then, each on its own clock (0 at the lab's t = 0.6) */
const flick = (t: number, ph: number) => { const u = (t + ph) % 7.3; return u < 0.35 ? 0.16 * Math.sin((u / 0.35) * Math.PI * 2) * (1 - u / 0.35) : 0; };

/**
 * The wearer's face on Howler's: lids (blinkL/R, squintL/R, wideL/R; an idle blink with no face), pupils (lookX/Y),
 * brows (browUp the inner ends, browOuterL/R the outer, browDownL/R a low scowl), ears (pricked with wide eyes and raised
 * brows, pinned back flat with a scowl, a snarl or a frown), upper lips (sneer bares the fangs, smile pulls the corners
 * up into a grin, frown drops them). The jaw is the stage's (face.jaw, jawSide).
 */
export function howlerTick(root: THREE.Object3D, t: number, face?: FaceState | null): void {
  let p = FACES.get(root);
  if (!p) {
    const by = (n: string): Obj => root.getObjectByName(n) ?? null;
    const both = (n: string) => [by(n + 'L'), by(n + 'R')];
    p = { eyes: both('howl-eye'), lids: both('howl-lid'), ears: both('ear'), brows: both('brow'), lips: both('lip') };
    FACES.set(root, p);
  }
  const f = face ?? null;
  if (f) faceLids(p.lids[0]!, p.lids[1]!, f);
  else { const b = idleBlink(t); for (const l of p.lids) if (l) setLids(l, b, 0, 0); }
  for (const e of p.eyes) if (e) look(e, f, 0.5);
  const inner = f?.browUp ?? 0, frown = f?.frown ?? 0, sneer = f?.sneer ?? 0;
  for (let i = 0; i < 2; i++) {
    const L = i === 0, sx = L ? 1 : -1;
    const outer = f ? (L ? f.browOuterL : f.browOuterR) : 0, down = f ? (L ? f.browDownL : f.browDownR) : 0;
    const wide = f ? (L ? f.wideL : f.wideR) : 0, smile = f ? (L ? f.smileL : f.smileR) : 0;
    const brow = p.brows[i];
    if (brow) {
      brow.position.set(sx * BROW_O[0]!, BROW_O[1]! + 0.26 * (0.55 * inner + 0.45 * outer) - 0.2 * down, BROW_O[2]! + 0.05 * down);
      // + about z lifts the left brow's outer end: the inner ends rise with browUp and drop in a scowl
      brow.rotation.z = sx * (0.3 * (outer - inner) + 0.35 * down);
    }
    const ear = p.ears[i];
    if (ear) {
      const perk = Math.max(wide, 0.8 * inner, outer), flat = Math.max(down, sneer, 0.8 * frown);
      ear.rotation.set(0.18 * perk - 0.75 * flat + flick(t, L ? 2.4 : 5.0), 0, -sx * (0.35 * flat - 0.12 * perk));
    }
    const lip = p.lips[i];
    if (lip) {
      // a snarl lifts the lip off the fangs and a little out; a grin lifts the corner behind (the bone's at the front)
      lip.position.set(sx * (LIP_O[0]! + 0.08 * sneer), LIP_O[1]! + 0.5 * sneer + 0.08 * smile - 0.06 * frown, LIP_O[2]! - 0.14 * smile);
      lip.rotation.x = 0.16 * smile - 0.1 * frown - 0.06 * sneer;
    }
  }
}
