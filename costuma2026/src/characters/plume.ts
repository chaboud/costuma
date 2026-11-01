// Plume: a huge, friendly, feathered bird (founder, 2026-10-06: "a Big Bird style character (trying for the feathers)").
// An original design, no show's bird: a tall upright bird, pear-shaped, on long bare legs with big three-toed feet; a long
// shaggy neck; a round head with a broad orange beak and big round eyes; a crest of three tall pink plumes; stubby wings
// held at its sides; a short tail of plumes. Golden plumage with a cream bib, every surface feathered (fur.ts as
// feathers: broad vanes laid flat down the body). An upright plan on the rig's bone names (hero.ts's frame and capture
// rules): the arms are its wings, the tail bones its tail. Metres for a 20 m bird, the sdf.ts frame (y up, +z forward).
//
// Its face moves with the wearer's (costuma, 2026-10-31; this file now differs from Strollzilla's copy): the beak is two
// meshes, the upper half on the head and the lower on the `jaw` bone, so it gapes onto a dark mouth and a tongue (in the
// body it was one solid the jaw could only stretch); the eyes are white with round pupils that look where the wearer
// looks, under golden lids that blink, wink, squint, widen and scowl; the crest is its brow, on a bone of its own; the
// cheeks puff and push up with a smile on bones of their own. `tickPlume` moves them; species.ts wires it in.
import * as THREE from 'three';
import type { Capture, Dresser, FaceState } from './build';
import { eyelids } from './faceparts';
import { sdCapsule, sdEllipsoid, sdSphere, smin, type Seg } from './sdf';
import { isoGeometry } from './skeleton';

export const PLUME_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 7.6, -0.4], b: [0, 8.8, 0], parent: null },
  { name: 'spine1', a: [0, 8.8, 0], b: [0, 10.8, 0.3], parent: 'pelvis' },
  { name: 'spine2', a: [0, 10.8, 0.3], b: [0, 12.6, 0.6], parent: 'spine1' },
  // a long neck, up and a little forward
  { name: 'neck', a: [0, 12.6, 0.6], b: [0, 15.6, 1.3], parent: 'spine2', reach: 1.9 },
  { name: 'head', a: [0, 15.6, 1.3], b: [0, 17.6, 2.4], parent: 'neck' },
  // the lower beak is a mesh on this bone; it takes no skin (plumeCapture)
  { name: 'jaw', a: [0, 15.9, 2.6], b: [0, 15.7, 4.4], parent: 'head', reach: 0 },
  // the face's own bones (the rig never turns them; tickPlume does), each taking only its own patch of skin
  { name: 'crest', a: [0, 18.05, 1.55], b: [0, 20.6, 0.4], parent: 'head' },
  { name: 'cheekL', a: [0.6, 16.3, 2.15], b: [1.15, 16.15, 2.6], parent: 'head' },
  { name: 'cheekR', a: [-0.6, 16.3, 2.15], b: [-1.15, 16.15, 2.6], parent: 'head' },
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
const EYE_R = 0.52;

/** the crest: three tall plumes up and back from the crown (their cores, without the head they blend into) */
function crestD(x: number, y: number, z: number): number {
  let d = 1e9;
  for (const [cx, k] of [[0, 1], [0.6, 0.82], [-0.6, 0.82]] as const) d = Math.min(d, sdCapsule(x, y, z, cx * 0.5, 18.1, 1.6, cx * 1.3, 18.1 + 2.7 * k, 1.0 - 0.7 * k, 0.34, 0.12));
  return d;
}

export function plumeSDF(x: number, y: number, z: number, bulk = 0): number {
  const ax = Math.abs(x);
  // the body: a pear, broad below, the breast forward
  let d = sdEllipsoid(x, y, z, 0, 9.2, -0.2, 3.3, 3.5, 3.0);
  d = smin(d, sdEllipsoid(x, y, z, 0, 11.4, 0.5, 2.5, 2.2, 2.3), 1.0);
  // the neck: long and thick (the feathers make it shaggier)
  d = smin(d, sdCapsule(x, y, z, 0, 12.2, 0.5, 0, 15.8, 1.4, 1.25, 0.95), 0.8);
  // the head: round, with the crest's three plumes (the beak is meshes: dressPlume)
  let h = sdSphere(x, y, z, 0, 16.9, 1.8, 1.55);
  if (y > 17.4) for (const [cx, k] of [[0, 1], [0.6, 0.82], [-0.6, 0.82]] as const) h = smin(h, sdCapsule(x, y, z, cx * 0.5, 18.1, 1.6, cx * 1.3, 18.1 + 2.7 * k, 1.0 - 0.7 * k, 0.34, 0.12), 0.3);
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

// --- the face

/**
 * The species' capture rule (species.ts `capture`) with the face's bones: the jaw takes no skin (the lower beak is a
 * mesh on it); the crest's bone takes the plumes and their roots, and the head lets go of their upper parts so they turn
 * whole; a cheek's bone the face below its eye, beside the beak (not the beak's root, the eye or the throat).
 */
export function plumeCapture(base: Capture): Capture {
  return (sg, x, y, z) => {
    const n = sg.name;
    if (n === 'jaw') return false;
    if (n === 'crest') return y > 17.9 && crestD(x, y, z) < 0.4;
    if (n === 'cheekL' || n === 'cheekR') return (n === 'cheekL' ? x : -x) > 0.6 && y > 15.3 && y < 16.75 && z > 1.7;
    if (n === 'head' && y > 18.75 && crestD(x, y, z) < 0.4) return false;
    return base(sg, x, y, z);
  };
}

const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
/** the gape: the line the beak's halves meet on, from the hinge falling a little to the tip */
const gape = (z: number) => 16.02 - 0.06 * (z - 2.7);
/** the beak's halves as they were in the body (a broad upper over a shorter lower), cut apart along the gape */
const upperCore = (x: number, y: number, z: number) => sdCapsule(x, y, z, 0, 16.55, 2.9, 0, 16.1, 5.0, 0.72, 0.18);
const upperBeakD = (x: number, y: number, z: number) => Math.max(upperCore(x, y, z), gape(z) - y);
const lowerCore = (x: number, y: number, z: number) => sdCapsule(x, y, z, 0, 15.85, 2.8, 0, 15.75, 4.4, 0.5, 0.14);
const lowerBeakD = (x: number, y: number, z: number) => Math.max(lowerCore(x, y, z), y - gape(z) + 0.03);
const BEAK_C = new THREE.Color(0xf07a22), TIP_C = new THREE.Color(0xf6a24a), MOUTH = 0x6a1420, TONGUE = 0xe8607a;
/** orange, paler at the tip; inside, a dark red mouth and a pink tongue, which show only when it opens (the upper half's
 *  roof dark only over the lower half: it is the broader, and its underside shows past the lower's sides, shut) */
const beakColour = (lower: boolean) => (x: number, y: number, z: number, c: THREE.Color) => {
  const inside = lower ? lowerCore(Math.abs(x) + 0.08, y, z) < 0 : lowerCore(Math.abs(x) + 0.1, gape(z) - 0.12, z) < 0;
  if (!lower && inside && y < gape(z) + 0.05 && z < 4.7) c.setHex(MOUTH);
  else if (lower && inside && z < 4.7 && y > gape(z) - 0.07) c.setHex(Math.abs(x) < 0.24 && z > 3.0 ? TONGUE : MOUTH);
  else c.copy(BEAK_C).lerp(TIP_C, sstep(3.9, 5.0, z));
};

/** the jaw's pivot (its segment's a): the gape's back corner */
const HINGE: [number, number, number] = [0, 15.9, 2.6];

export function dressPlume(d: Dresser): void {
  // eyes: big white balls, round black pupils with a glint (turned a little in at rest: a friendly cross of the eyes),
  // under golden lids with a dark rim
  const white = d.std({ color: 0xf8f8f4, roughness: 0.2 }), dark = d.std({ color: 0x0a0a10, roughness: 0.1 });
  const glint = d.std({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8, roughness: 0.2 });
  const lidMat = d.std({ color: 0xe8a80c, roughness: 0.8 }), rim = d.std({ color: 0x5a2c08, roughness: 0.6 });
  for (const sx of [1, -1]) {
    const s = sx > 0 ? 'L' : 'R';
    const eye = new THREE.Group();
    eye.name = 'pl-eye' + s;
    eye.add(new THREE.Mesh(new THREE.SphereGeometry(EYE_R, 22, 16), white));
    const look = new THREE.Group();
    look.name = 'pl-look' + s;
    look.rotation.set(0.04, -sx * 0.2, 0);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(EYE_R + 0.012, 22, 6, 0, Math.PI * 2, 0, 0.44), dark);
    pupil.rotation.x = Math.PI / 2;
    look.add(pupil);
    // inside the lids' shell (0.56), or it shows through them shut
    const g = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), glint);
    g.position.set(sx * 0.08, 0.1, 0.47);
    look.add(g);
    eye.add(look);
    const lids = eyelids('pl-lid' + s, EYE_R, lidMat, { gap: 0.08 });
    for (const m of lids.children) m.rotation.order = 'ZXY';
    const ln = new THREE.Mesh(new THREE.TorusGeometry(EYE_R * 1.08 + 0.005, 0.045, 6, 24, Math.PI * 0.8), rim);
    ln.rotation.set(Math.PI / 2, 0, Math.PI * 0.1);
    lids.children[0]!.add(ln);
    setLid(lids, 0, 0, 0, 0, 0);
    eye.add(lids);
    d.at(eye, 'head', sx * PLUME_EYES[0], PLUME_EYES[1], PLUME_EYES[2]);
  }
  // the beak: the upper half on the head, hung from the gape's back corner (it lifts a little as it gapes), the lower on
  // the jaw; a dark mouth behind them
  const beakMat = d.std({ vertexColors: true, roughness: 0.5, metalness: 0.02 });
  const upper = new THREE.Mesh(isoGeometry(upperBeakD, { min: [-0.8, 15.85, 2.1], max: [0.8, 17.35, 5.25] }, 34, beakColour(false), 12000), beakMat);
  upper.position.set(-HINGE[0], -HINGE[1], -HINGE[2]);
  const ug = new THREE.Group(); ug.name = 'pl-upper'; ug.add(upper); d.at(ug, 'head', ...HINGE);
  const lower = new THREE.Mesh(isoGeometry(lowerBeakD, { min: [-0.56, 15.2, 2.2], max: [0.56, 16.1, 4.65] }, 30, beakColour(true), 10000), beakMat);
  d.at(lower, 'jaw', 0, 0, 0);
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), d.std({ color: MOUTH, roughness: 0.6 }));
  mouth.scale.set(0.38, 0.3, 0.55);
  d.at(mouth, 'head', 0, 15.97, 3.0);
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** the lids' turns about the eye's axis (faceparts' eyelids, set here): at rest the upper well back, the lower low; shut,
 *  they meet a little below the middle */
const UP_OPEN = -1.25, LO_OPEN = 1.0, UP_SHUT = 0.2, LO_SHUT = 0.04;
/** close 0..1, squint lifts the lower lid (and drops the upper a little), wide pulls both back, scowl drops the upper
 *  lid over the pupil's top; `tilt` slants the upper lid's line about the eye's front (radians, + raises its +x end) */
function setLid(g: THREE.Object3D, close: number, squint: number, wide: number, scowl: number, tilt: number): void {
  const up = g.children[0], lo = g.children[1];
  if (!up || !lo) return;
  const c = clamp01(close);
  const u = UP_OPEN - 0.3 * wide + 0.35 * squint + 0.7 * scowl, l = LO_OPEN + 0.2 * wide - 0.62 * squint;
  up.rotation.x = u + (UP_SHUT - u) * c;
  lo.rotation.x = l + (LO_SHUT - l) * c;
  up.rotation.z = tilt * (1 - c);
}

/** a damped spring (a plume's bounce): stepped in small steps, so a long frame cannot blow it up */
interface Spring { x: number; v: number }
function stepSpring(s: Spring, target: number, dt: number, w: number, zeta: number): void {
  const n = Math.min(12, Math.ceil(dt / 0.008));
  const h = n > 0 ? dt / n : 0;
  for (let i = 0; i < n; i++) { s.v += (w * w * (target - s.x) - 2 * zeta * w * s.v) * h; s.x += s.v * h; }
}

/** per worn copy: its face parts and rest poses, found once (a WeakMap: the stage's clone JSON-copies userData) */
interface PlumeParts {
  lids: (THREE.Object3D | null)[]; looks: (THREE.Object3D | null)[]; lookRest: number[]; upper: THREE.Object3D | null;
  crest: THREE.Object3D | null; cheeks: (THREE.Object3D | null)[]; cheekRest: THREE.Vector3[];
  head: THREE.Object3D | null; prev: THREE.Quaternion; dq: THREE.Quaternion;
  t: number; cx: Spring; cy: Spring; cz: Spring;
}
const PLUME_PARTS = new WeakMap<THREE.Object3D, PlumeParts>();

function plumeParts(root: THREE.Object3D): PlumeParts {
  let p = PLUME_PARTS.get(root);
  if (p) return p;
  const by = (n: string) => root.getObjectByName(n) ?? null;
  const looks = [by('pl-lookL'), by('pl-lookR')], cheeks = [by('cheekL'), by('cheekR')], head = by('head');
  p = {
    lids: [by('pl-lidL'), by('pl-lidR')], looks, lookRest: looks.flatMap((o) => [o?.rotation.x ?? 0, o?.rotation.y ?? 0]),
    upper: by('pl-upper'), crest: by('crest'), cheeks, cheekRest: cheeks.map((o) => o?.position.clone() ?? new THREE.Vector3()),
    head, prev: head?.quaternion.clone() ?? new THREE.Quaternion(), dq: new THREE.Quaternion(),
    t: NaN, cx: { x: 0, v: 0 }, cy: { x: 0, v: 0 }, cz: { x: 0, v: 0 },
  };
  PLUME_PARTS.set(root, p);
  return p;
}

/**
 * The face, moved by the wearer's (face tracking): lids that blink, wink, squint, widen and scowl; pupils that look; the
 * crest as its brow (up with raised brows, wide eyes and surprise, flat back with a scowl or a frown, cocked by one brow,
 * bouncing on a spring and lagging the head's turns); cheeks that puff and push up with a smile; the upper beak lifting a
 * little as it gapes. With no face read it blinks now and then and its crest sways.
 */
export function tickPlume(root: THREE.Object3D, t: number, f?: FaceState | null): void {
  const p = plumeParts(root);
  const first = Number.isNaN(p.t);
  const dt = first ? 0 : Math.min(0.1, Math.max(0, t - p.t));
  p.t = t;
  const ph = (t + 2.1) % 3.9, idleBlink = ph < 0.18 ? Math.sin((ph / 0.18) * Math.PI) : 0;
  const smL = f ? (f.smileL || f.smileR ? f.smileL : f.smile) : 0, smR = f ? (f.smileL || f.smileR ? f.smileR : f.smile) : 0;
  const downL = f?.browDownL ?? 0, downR = f?.browDownR ?? 0, inner = f?.browUp ?? 0;
  const outerL = f?.browOuterL ?? 0, outerR = f?.browOuterR ?? 0;
  const puff = f?.puff ?? 0, jaw = f?.jaw ?? 0;

  for (let i = 0; i < 2; i++) {
    const g = p.lids[i];
    if (!g) continue;
    const sx = i === 0 ? 1 : -1, down = i === 0 ? downL : downR;
    const close = f ? (i === 0 ? f.blinkL : f.blinkR) : idleBlink;
    const sq = f ? clamp01(Math.max(i === 0 ? f.squintL : f.squintR, 0.6 * (i === 0 ? smL : smR))) : 0;
    setLid(g, close, sq, f ? (i === 0 ? f.wideL : f.wideR) : 0, down, sx * (0.3 * down - 0.22 * inner));
  }
  for (let i = 0; i < 2; i++) {
    const o = p.looks[i];
    if (o) o.rotation.set(p.lookRest[i * 2]! - (f?.lookY ?? 0) * 0.36, p.lookRest[i * 2 + 1]! + (f?.lookX ?? 0) * 0.5, 0);
  }
  if (p.upper) p.upper.rotation.x = -(0.1 * jaw + 0.08 * (f?.sneer ?? 0));
  for (let i = 0; i < 2; i++) {
    const c = p.cheeks[i];
    if (!c) continue;
    const sx = i === 0 ? 1 : -1, sm = i === 0 ? smL : smR, r = p.cheekRest[i]!;
    c.position.set(r.x + sx * 0.22 * puff, r.y + 0.16 * sm - 0.04 * puff, r.z + 0.1 * puff + 0.04 * sm);
    c.scale.setScalar(1 + 0.1 * puff + 0.05 * sm);
  }
  if (p.crest) {
    const up = f ? clamp01(Math.max(inner, 0.5 * (outerL + outerR)) + 0.25 * (f.wideL + f.wideR) + 0.35 * jaw * inner) : 0;
    const down = f ? clamp01(Math.max(0.5 * (downL + downR), 0.7 * f.frown)) : 0;
    const tx = 0.42 * up - 0.6 * down + (f ? 0 : 0.05 * Math.sin(t * 1.1));
    const tz = f ? 0.3 * (outerL - outerR) + 0.25 * (downR - downL) : 0.03 * Math.sin(t * 0.7);
    if (first) { p.cx.x = tx; p.cz.x = tz; p.cy.x = 0; }
    if (p.head && !first) {
      // the head's turn since the last frame, in its own frame (small: twice the vector part)
      const q = p.dq.copy(p.prev).invert().multiply(p.head.quaternion), s = q.w < 0 ? -2 : 2;
      p.cx.x -= 0.9 * q.x * s; p.cy.x -= 0.6 * q.y * s; p.cz.x -= 0.9 * q.z * s;
    }
    if (p.head) p.prev.copy(p.head.quaternion);
    stepSpring(p.cx, tx, dt, 11, 0.3); stepSpring(p.cy, 0, dt, 10, 0.3); stepSpring(p.cz, tz, dt, 11, 0.3);
    p.cx.x = Math.max(-1, Math.min(0.8, p.cx.x)); p.cy.x = Math.max(-0.5, Math.min(0.5, p.cy.x)); p.cz.x = Math.max(-0.6, Math.min(0.6, p.cz.x));
    p.crest.rotation.set(p.cx.x, p.cy.x, p.cz.x);
    p.crest.scale.set(1, 1 + 0.12 * up - 0.08 * down, 1);
  }
}
