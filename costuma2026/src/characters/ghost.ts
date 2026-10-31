// The Ghost: the classic bedsheet ghost — a white sheet over a person from the crown to below the knees. A round dome
// over the head falls over the shoulders into a skirt that widens to a wavy hem, with soft folds that deepen toward it.
// The sheet is one skinned signed-distance surface on the hero's skeleton; its skirt is hollow (open at the hem, dark
// inside) so a lifted edge shows the inside of a sheet, not a solid. Its weights are written here (`sheetWeights`, in
// `dress`) rather than taken from distance to the bones: the head owns the dome and face, the arms own the sheet's sides
// from the shoulder to below the hands and fade out toward the hem, so raising the arms lifts the sides into wings
// ("Boo!") while the hem stays down; the thighs carry part of the front hem; the spine the rest.
//
// The eye holes and the mouth are black decals conformed to the sheet's surface (so their outlines are crisp at any
// distance, not marching-cubes stair steps), rigid on the head bone over a face the head owns outright. The mouth is a
// morph between a small "o" and a tall "O": the wearer's open mouth stretches it (`face.jaw`), and with no face read it
// moans now and then. Blinks narrow the eye holes. The sheet has a faint cool self-glow and a cooler rim so it reads at
// night, and its hem stirs (a vertex ripple in bind pose, driven by one shared clock).
//
// Model frame: the hero's — 20 units tall on y = 0, +y up, +z forward, +x the ghost's own left.
import * as THREE from 'three';
import type { CharacterDef, Dresser } from './build';
import type { Seg } from './sdf';
import { sdEllipsoid, smin } from './sdf';
import { HERO_SEGMENTS } from './hero';

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** smoothstep from a to b (a > b runs downhill) */
const ss = (a: number, b: number, v: number) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);

// ---------------------------------------------------------------------------------------------------------------------
// the sheet

/** the skirt's axis sits a little forward of the spine (a sheet hangs off the chest) */
const CZ = 0.12;
/** the skirt's wall: thick enough for the marching cubes' coarse vertical cells to keep it closed */
const TH = 0.3;
/** the head's dome: the wearer's head inside, with a sheet's slack over the crown */
const DOME = { c: [0, 17.25, 0.15] as const, r: [1.42, 1.5, 1.38] as const };

/** folds round the skirt, -1..1: a few big ones and some smaller, irregular */
const fold = (th: number) => 0.55 * Math.sin(7 * th + 0.3) + 0.3 * Math.sin(12 * th + 1.7) + 0.15 * Math.sin(17 * th + 0.4);
/** how deep the folds are at a height: shallow over the shoulders, deepest at the hem */
const foldAmp = (y: number) => 0.06 + 0.42 * ss(14.8, 5.4, y);
/** the hem: lowest under each fold's ridge (`f` the fold there), with a little raggedness */
const hemY = (f: number, th: number) => 4.9 - 0.45 * f - 0.08 * Math.sin(29 * th + 1.1);

/** the skirt's side: an elliptic tube widening to the hem, its folds (`f`) bulging out (iq's ellipse estimate) */
function skirtSide(x: number, y: number, z: number, f: number): number {
  const t = clamp01((14.0 - y) / 9.2);
  const rx = 3.3 + 0.45 * t, rz = 1.72 + 0.62 * t, zz = z - CZ;
  const k0 = Math.hypot(x / rx, zz / rz), k1 = Math.hypot(x / (rx * rx), zz / (rz * rz));
  return (k1 > 1e-6 ? (k0 * (k0 - 1)) / k1 : -Math.min(rx, rz)) - foldAmp(y) * f;
}

/**
 * The dome; the shoulders as a tall half-ellipsoid it sits in (so the sheet slopes from the head over the shoulders
 * like a bell, not a shelf), blended wide so there is no neck; the skirt below, tangent to the shoulders at their
 * widest; cut at the hem; hollow from the hem up to the hips (higher, the inside is never seen and only costs triangles).
 */
export function ghostSDF(x: number, y: number, z: number): number {
  // far outside the skirt's widest folds (the field is flat past 1.25 from the surface): skip the folds' trigonometry
  const zz = z - CZ;
  if (y < 15.4 && (x * x) / 30.0 + (zz * zz) / 15.2 > 1) return 2;
  let d = sdEllipsoid(x, y, z, DOME.c[0], DOME.c[1], DOME.c[2], DOME.r[0], DOME.r[1], DOME.r[2]);
  const th = Math.atan2(zz, x), f = fold(th);
  // the shoulders carry the folds' start, so they run on up toward the head
  d = smin(d, sdEllipsoid(x, y, z, 0, 14.0, 0.1, 3.3, 2.55, 1.72) - foldAmp(y) * f * ss(16.4, 14.0, y), 1.1);
  if (y < 15.4) {
    const side = skirtSide(x, y, z, f);
    // a plain union: the skirt's top edge lies on the shoulders' equator, where both are upright and equal (a blend
    // there bulged into a ridge round the body)
    d = Math.min(d, Math.max(side, y - 14.0));
    d = Math.max(d, hemY(f, th) - y);
    if (y < 11.0) d = Math.max(d, -smax(side + TH, y - 10.0, 0.6));
  }
  return d;
}

const SHEET = 0, INSIDE = 1;
function ghostRegion(x: number, y: number, z: number): number {
  if (y < 10.6 && skirtSide(x, y, z, fold(Math.atan2(z - CZ, x))) < -TH * 0.5) return INSIDE;
  return SHEET;
}

const SHADE = new THREE.Color(0x98a4bc);
/** the folds' valleys and the lower sheet a touch greyer and cooler; the inside in shadow */
function ghostTint(r: number, x: number, y: number, z: number, c: THREE.Color): void {
  if (r !== SHEET) return;
  const f = fold(Math.atan2(z - CZ, x)), a = ss(15.5, 5.6, y);
  c.lerp(SHADE, clamp01(0.75 * a * Math.max(0, -f) + 0.1 * a));
  // under the dome, where the sheet tucks in toward the neck
  const tuck = ss(1.1, 0.4, Math.abs(y - 15.85)) * ss(1.6, 0.9, Math.hypot(x, z - 0.1));
  c.multiplyScalar(1 - 0.12 * tuck);
}

const BOX = { min: [-4.55, 3.95, -2.95] as [number, number, number], max: [4.55, 19.1, 3.2] as [number, number, number] };

// ---------------------------------------------------------------------------------------------------------------------
// skin weights

const BONES = ['head', 'armL', 'forearmL', 'armR', 'forearmR', 'thighL', 'thighR', 'spine2', 'spine1', 'pelvis'] as const;
const [HEAD, ARM_L, FORE_L, ARM_R, FORE_R, THIGH_L, THIGH_R, SPINE2, SPINE1, PELVIS] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
/**
 * Which bones carry the sheet at a bind-pose point, into `w` by BONES, summing to 1: the head its dome and face (the
 * face's front down to the chin, so the decals on it never part from it), the arms the sides from below the shoulder's
 * top to below the hand, fading toward the hem (rigidly, the sheet below a hand would swing up past it with a raised arm;
 * faded, it hangs between the hand and the hem), the thighs part of the front hem, the spine and pelvis the rest.
 */
function sheetWeights(x: number, y: number, z: number, w: Float32Array): void {
  w.fill(0);
  const ax = Math.abs(x), left = x >= 0;
  const lo = 15.65 - 0.55 * ss(0.3, 1.2, z);
  const head = ss(lo, lo + 0.85, y);
  const side = (1 - head) * ss(1.45, 2.95, ax) * ss(15.4, 14.3, y) * ss(5.6, 9.4, y);
  const fore = side * ss(12.6, 10.9, y);
  const leg = (1 - head - side) * 0.65 * ss(9.7, 6.9, y) * ss(-1.9, -0.3, z - CZ);
  const legL = leg * ss(-1.1, 1.1, x);
  const torso = Math.max(0, 1 - head - side - leg);
  const up = ss(12.6, 13.9, y), low = 1 - ss(10.0, 11.3, y);
  w[HEAD] = head;
  w[left ? ARM_L : ARM_R] = side - fore; w[left ? FORE_L : FORE_R] = fore;
  w[THIGH_L] = legL; w[THIGH_R] = leg - legL;
  w[SPINE2] = torso * up; w[SPINE1] = torso * (1 - up - low); w[PELVIS] = torso * low;
}

/** the sheet's weights (above), the four largest of each vertex, over build.ts's distance weights */
function reweigh(body: THREE.SkinnedMesh, segs: Seg[]): void {
  const pos = body.geometry.attributes.position!, si = body.geometry.attributes.skinIndex!, sw = body.geometry.attributes.skinWeight!;
  const bone = BONES.map((n) => segs.findIndex((s) => s.name === n));
  const w = new Float32Array(BONES.length), pick = [0, 0, 0, 0];
  for (let v = 0; v < pos.count; v++) {
    sheetWeights(pos.getX(v), pos.getY(v), pos.getZ(v), w);
    let sum = 0;
    for (let j = 0; j < 4; j++) {
      let best = -1;
      for (let b = 0; b < w.length; b++) if (w[b]! > 1e-4 && (best < 0 || w[b]! > w[best]!)) best = b;
      pick[j] = best;
      if (best >= 0) { sum += w[best]!; w[best] = -w[best]!; }
    }
    for (let j = 0; j < 4; j++) {
      const b = pick[j]!;
      si.setComponent(v, j, b >= 0 ? bone[b]! : 0);
      sw.setComponent(v, j, b >= 0 ? -w[b]! / sum : 0);
    }
  }
  si.needsUpdate = true; sw.needsUpdate = true;
}

// ---------------------------------------------------------------------------------------------------------------------
// the face

/** the sheet's front surface z at (x, y), by bisection on the field */
function frontZ(x: number, y: number): number {
  let lo = 0, hi = 3.2;
  for (let i = 0; i < 32; i++) { const m = (lo + hi) / 2; if (ghostSDF(x, y, m) < 0) lo = m; else hi = m; }
  return lo;
}

const EYE = { x: 0.47, y: 17.48, rx: 0.29, ry: 0.43, tilt: 0.08 };
/** the mouth's top stays put; its bottom drops as it opens */
const MOUTH = { top: 16.93, rx0: 0.25, ry0: 0.17, rx1: 0.21, ry1: 0.52 };
const EYE_Z = frontZ(EYE.x, EYE.y);
const JAW_Z = frontZ(0, 16.75);

/** the hero's joints; the jaw (nothing hangs on it) only says where an open mouth breathes from */
const GHOST_SEGMENTS: Seg[] = HERO_SEGMENTS.map((s) => (s.name === 'jaw'
  ? { name: 'jaw', a: [0, 16.75, 0.55], b: [0, 16.75, JAW_Z + 0.15], parent: 'head', reach: 0 }
  : s.name.startsWith('tail') ? { ...s, reach: 0 } : s));

/**
 * An elliptical decal laid on the sheet: rings of points in the face's plane pushed onto the surface along +z and lifted
 * a hair off it. `shapes` are the ellipses it morphs between (the first is the base); the origin is at `origin`.
 */
function decal(shapes: { cx: number; cy: number; rx: number; ry: number; tilt: number }[], origin: THREE.Vector3, rings = 6, segs = 28): THREE.BufferGeometry {
  const lift = 0.018;
  const layer = (e: (typeof shapes)[number]) => {
    const out: number[] = [];
    const cs = Math.cos(e.tilt), sn = Math.sin(e.tilt);
    const put = (u: number, v: number) => {
      const x = e.cx + u * cs - v * sn, y = e.cy + u * sn + v * cs;
      out.push(x - origin.x, y - origin.y, frontZ(x, y) + lift - origin.z);
    };
    put(0, 0);
    for (let i = 1; i <= rings; i++) for (let j = 0; j < segs; j++) {
      const a = (j / segs) * Math.PI * 2, k = i / rings;
      put(Math.cos(a) * e.rx * k, Math.sin(a) * e.ry * k);
    }
    return new Float32Array(out);
  };
  const idx: number[] = [];
  for (let j = 0; j < segs; j++) idx.push(0, 1 + j, 1 + ((j + 1) % segs));
  for (let i = 1; i < rings; i++) for (let j = 0; j < segs; j++) {
    const a = 1 + (i - 1) * segs + j, b = 1 + (i - 1) * segs + ((j + 1) % segs), c = a + segs, d = b + segs;
    idx.push(a, c, d, a, d, b);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(layer(shapes[0]!), 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  if (shapes.length > 1) g.morphAttributes.position = shapes.slice(1).map((s) => new THREE.BufferAttribute(layer(s), 3));
  return g;
}

/** one clock for every ghost's hem (a shared uniform: each wearer's material copy reads the same object) */
const FLUTTER = { value: 0 };

function sheetMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.86, metalness: 0, emissive: 0xc4d8ff, emissiveIntensity: 0.1 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uFlutter = FLUTTER;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n uniform float uFlutter;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        { // the hem stirs: slow ripples round it, growing toward the edge; in bind pose, so it rides the bones
          float hem = smoothstep(8.2, 4.8, position.y);
          if (hem > 0.0) {
            vec2 r = vec2(position.x, position.z - ${CZ.toFixed(2)});
            float th = atan(r.y, r.x);
            float w = 0.6 * sin(uFlutter * 2.1 + th * 3.0 + position.y * 0.9) + 0.4 * sin(uFlutter * 3.3 - th * 5.0 + 1.3);
            transformed.xz += normalize(r + 1e-4) * (0.15 * hem * w);
            transformed.y += 0.07 * hem * sin(uFlutter * 2.7 + th * 4.0);
          }
        }`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        // a ghost's rim: a faint cool glow where the sheet turns away from the eye
        totalEmissiveRadiance += vec3(0.55, 0.75, 1.0) * 0.22 * pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.5);`);
  };
  m.customProgramCacheKey = () => 'ghost-sheet-v1';
  return m;
}

function dress(d: Dresser): void {
  const body = d.bones.get('pelvis')!.parent as THREE.SkinnedMesh | null;
  if (body?.isSkinnedMesh) {
    reweigh(body, d.segs);
    (body.material as THREE.Material).dispose();
    body.material = sheetMaterial();
    body.name = 'ghost-sheet';
  }
  const hole = d.std({ color: 0x040507, roughness: 1, metalness: 0, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
  for (const sx of [1, -1]) {
    const o = new THREE.Vector3(sx * EYE.x, EYE.y, EYE_Z);
    const eye = new THREE.Mesh(decal([{ cx: sx * EYE.x, cy: EYE.y, rx: EYE.rx, ry: EYE.ry, tilt: -sx * EYE.tilt }], o), hole);
    eye.name = sx > 0 ? 'ghost-eyeL' : 'ghost-eyeR';
    d.at(eye, 'head', o.x, o.y, o.z).castShadow = false;
  }
  const mo = new THREE.Vector3(0, MOUTH.top, frontZ(0, MOUTH.top));
  const mouth = new THREE.Mesh(decal([
    { cx: 0, cy: MOUTH.top - MOUTH.ry0, rx: MOUTH.rx0, ry: MOUTH.ry0, tilt: 0 },
    { cx: 0, cy: MOUTH.top - MOUTH.ry1, rx: MOUTH.rx1, ry: MOUTH.ry1, tilt: 0 },
  ], mo, 7, 32), hole);
  mouth.name = 'ghost-mouth';
  // (a decal casting a shadow onto its own sheet would draw a dark halo round it)
  d.at(mouth, 'head', mo.x, mo.y, mo.z).castShadow = false;
}

const PARTS = new WeakMap<THREE.Object3D, { mouth: THREE.Mesh | null; eyes: THREE.Object3D[] }>();

export const GHOST: CharacterDef = {
  id: 'ghost', name: 'Ghost', blurb: 'A bedsheet ghost that says boo',
  segs: GHOST_SEGMENTS,
  body: { sdf: ghostSDF, region: ghostRegion, box: BOX, palette: [0xe9ecf3, 0x6c7486], surface: 'soft', weights: 'soft', tint: ghostTint },
  dress,
  // the sheet is wide already; its head may sit a little high on the wearer's (a sheet's crown has slack)
  fit: { size: 1.04, limb: 0.6, head: 0.45 },
  face: {
    // the jaw opens nothing (the mouth is a morph); a small angle only lowers where the breath comes out as it opens
    jaw: 0.3,
    eyes: [[EYE.x, EYE.y, EYE_Z + 0.05, 0.34], [-EYE.x, EYE.y, EYE_Z + 0.05, 0.34]],
    breath: { colors: [0xeaf6ff, 0xa8dcff, 0xc8bcff, 0xffffff], rate: 0.7, speed: 0.55, size: 1.5 },
  },
  res: 90,
  tick(root, t, face) {
    let e = PARTS.get(root);
    if (!e) {
      // this wearer's own copies, found once (a WeakMap: userData is JSON-copied when the stage clones a root)
      e = { mouth: (root.getObjectByName('ghost-mouth') as THREE.Mesh | undefined) ?? null,
        eyes: [root.getObjectByName('ghost-eyeL') ?? null, root.getObjectByName('ghost-eyeR') ?? null].filter((o): o is THREE.Object3D => !!o) };
      PARTS.set(root, e);
    }
    FLUTTER.value = t;
    // the wearer's mouth when it is read; else a slow "oooo" every few seconds
    const moan = Math.max(0, Math.sin(t * 0.85 - 1.0));
    const open = face ? face.jaw : 0.55 * moan * moan * moan;
    if (e.mouth?.morphTargetInfluences) e.mouth.morphTargetInfluences[0] = Math.min(1, open);
    // blinks narrow the holes (with no face read, a blink now and then)
    const idle = (t % 5.3) < 0.14 ? 1 : 0;
    const bl = face ? face.blinkL : idle, br = face ? face.blinkR : idle;
    if (e.eyes[0]) e.eyes[0].scale.y = 1 - 0.85 * bl;
    if (e.eyes[1]) e.eyes[1].scale.y = 1 - 0.85 * br;
  },
};
