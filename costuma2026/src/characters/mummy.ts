// The Mummy: a figure wrapped head to foot in old linen. The body is one skinned signed-distance surface (the hero's
// anatomy, slimmer — a mummy is gaunt — and a bandage's thickness bigger), its arms set a little wider so a raised arm
// never webs to the ribs. The wraps are drawn in the fragment shader from the bind-pose position (so they ride the body
// as it bends and stay crisp at any distance, where vertex colours at the marching-cubes resolution would come out as
// stair steps): overlapping strips that run diagonally and mirror left and right into chevrons down the front, each
// lapping the one below with a shadow under its edge and a faint relief (a bump from the same pattern), a second layer
// of straps crossing them in patches, dark gaps here and there, and grime that gathers toward the feet and hands.
//
// The head is a rigid mesh on the head bone, polygonised from its own field at a finer grid, with a narrow eye slit cut
// across the face and two glowing amber eyes deep in it. The lower face is a second rigid mesh on the jaw bone, hinged
// below the ear: the wearer's open mouth swings it down (`face.jaw`), showing a dark mouth with a few old teeth. Loose
// bandage ends trail from a wrist, an elbow, the waist and the back of the head; `tick` hangs them from their bones
// under gravity (whatever the limb is doing) and lets them sway.
//
// Model frame: the hero's — 20 units tall on y = 0, +y up, +z forward, +x the mummy's own left.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Capture, CharacterDef, Dresser } from './build';
import type { Seg } from './sdf';
import { sdCapsule, sdEllipsoid, sdSphere, smin } from './sdf';
import { isoGeometry } from './skeleton';

type V3 = [number, number, number];
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);

/** the jaw hinges below the ear; its tip is the front of the mouth (where an open mouth breathes from) */
const HINGE: V3 = [0, 16.62, -0.02];

export const MUMMY_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 9.6, 0], b: [0, 10.6, 0], parent: null },
  { name: 'spine1', a: [0, 10.6, 0], b: [0, 12.4, 0.1], parent: 'pelvis' },
  { name: 'spine2', a: [0, 12.4, 0.1], b: [0, 15.0, 0.1], parent: 'spine1' },
  { name: 'neck', a: [0, 15.0, 0.1], b: [0, 15.9, 0.15], parent: 'spine2', reach: 0.8 },
  { name: 'head', a: [0, 15.9, 0.15], b: [0, 18.4, 0.3], parent: 'neck' },
  { name: 'jaw', a: HINGE, b: [0, 16.3, 1.3], parent: 'head', reach: 0 },
  { name: 'tail1', a: [0, 14.8, -1.2], b: [0, 12.6, -1.4], parent: 'spine2', reach: 0 },
  { name: 'tail2', a: [0, 12.6, -1.4], b: [0, 10.4, -1.6], parent: 'tail1', reach: 0 },
  { name: 'tail3', a: [0, 10.4, -1.6], b: [0, 8.2, -1.8], parent: 'tail2', reach: 0 },
  { name: 'tail4', a: [0, 8.2, -1.8], b: [0, 6.2, -2.0], parent: 'tail3', reach: 0 },
  { name: 'thighL', a: [1.1, 9.6, 0], b: [1.2, 5.3, 0.2], parent: 'pelvis' },
  { name: 'shinL', a: [1.2, 5.3, 0.2], b: [1.2, 1.1, -0.1], parent: 'thighL' },
  { name: 'footL', a: [1.2, 1.1, -0.1], b: [1.2, 0.35, 1.4], parent: 'shinL' },
  { name: 'thighR', a: [-1.1, 9.6, 0], b: [-1.2, 5.3, 0.2], parent: 'pelvis' },
  { name: 'shinR', a: [-1.2, 5.3, 0.2], b: [-1.2, 1.1, -0.1], parent: 'thighR' },
  { name: 'footR', a: [-1.2, 1.1, -0.1], b: [-1.2, 0.35, 1.4], parent: 'shinR' },
  // the arms a little wider than the hero's: the wraps make them thicker, and they must stay clear of the ribs
  { name: 'armL', a: [2.52, 14.55, 0], b: [2.92, 11.95, -0.05], parent: 'spine2' },
  { name: 'forearmL', a: [2.92, 11.95, -0.05], b: [3.08, 9.55, 0.38], parent: 'armL' },
  { name: 'armR', a: [-2.52, 14.55, 0], b: [-2.92, 11.95, -0.05], parent: 'spine2' },
  { name: 'forearmR', a: [-2.92, 11.95, -0.05], b: [-3.08, 9.55, 0.38], parent: 'armR' },
];

const BOX = { min: [-4.2, -0.5, -1.9] as V3, max: [4.2, 16.6, 2.3] as V3 };
/** the linen's thickness over the body */
const WRAP = 0.13;

// ---------------------------------------------------------------------------------------------------------------------
// the body (the head is its own mesh)

/**
 * The hero's anatomy (hero.ts `body`), gaunter in the chest and back, arms moved out to the segments above, the head
 * left to its own mesh (the neck runs up into it). The arms join the body only over the shoulder: lower, a blend webs
 * an arm to the ribs and a cheer tears the web.
 */
function mummySDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let d = 4;
  if (y > 8.2) {
    d = sdEllipsoid(x, y, z, 0, 13.35, 0.1, 1.62, 1.95, 1.0); // the ribcage
    d = smin(d, sdEllipsoid(ax, y, z, 0.8, 13.8, 0.62, 0.82, 0.6, 0.42), 0.45); // what is left of the chest
    d = smin(d, sdEllipsoid(x, y, z, 0, 13.75, -0.32, 1.66, 1.25, 0.58), 0.4); // the back
    d = smin(d, sdCapsule(ax, y, z, 0, 15.3, -0.2, 1.85, 14.95, -0.1, 0.48, 0.34), 0.5); // the trapezius
    d = smin(d, sdEllipsoid(x, y, z, 0, 11.6, 0.1, 1.28, 1.45, 0.86), 0.6); // a hollow belly
    d = smin(d, sdEllipsoid(x, y, z, 0, 10.0, 0, 1.62, 1.0, 1.0), 0.6); // the pelvis
    d = smin(d, sdEllipsoid(ax, y, z, 0.7, 9.55, -0.48, 0.8, 0.85, 0.6), 0.4); // the glutes
    d = Math.max(d, -sdCapsule(x, y, z, 0, 14.6, -1.06, 0, 10.6, -0.94, 0.14, 0.12)); // the spine's groove
    if (y > 14.2) d = smin(d, sdCapsule(x, y, z, 0, 14.9, -0.05, 0, 16.25, 0.1, 0.6, 0.52), 0.4); // the neck, into the head
    // the shoulders, blended into the trapezius; the upper arms blended there only
    d = smin(d, sdEllipsoid(ax, y, z, 2.42, 14.45, 0, 0.6, 0.84, 0.7), 0.4);
    const upper = smin(sdCapsule(ax, y, z, 2.52, 14.4, 0, 2.92, 11.98, -0.05, 0.54, 0.42), sdEllipsoid(ax, y, z, 2.7, 13.15, 0.1, 0.48, 0.95, 0.48), 0.3);
    d = y > 14.0 ? smin(d, upper, 0.3) : Math.min(d, upper);
    if (y < 12.4) {
      let fore = sdCapsule(ax, y, z, 2.92, 11.9, -0.05, 3.06, 9.7, 0.36, 0.45, 0.3);
      fore = smin(fore, sdEllipsoid(ax, y, z, 2.96, 11.2, 0.05, 0.46, 0.8, 0.46), 0.3);
      fore = smin(fore, sdEllipsoid(ax, y, z, 3.1, 9.05, 0.45, 0.25, 0.55, 0.42), 0.2); // a mitten of a hand
      fore = smin(fore, sdCapsule(ax, y, z, 3.0, 9.4, 0.74, 2.92, 8.9, 0.94, 0.15, 0.12), 0.12); // the thumb
      d = Math.min(d, fore);
    }
  }
  if (y < 10.6) {
    // the legs: thigh, knee, calf, ankle; wrapped feet with a flat sole
    d = smin(d, sdCapsule(ax, y, z, 1.02, 9.6, 0, 1.15, 5.45, 0.2, 0.86, 0.54), 0.45);
    d = smin(d, sdEllipsoid(ax, y, z, 1.12, 7.7, 0.26, 0.74, 1.6, 0.68), 0.4);
    d = smin(d, sdEllipsoid(ax, y, z, 0.82, 8.3, 0.0, 0.52, 1.3, 0.58), 0.4);
    d = smin(d, sdSphere(ax, y, z, 1.17, 5.3, 0.3, 0.5), 0.3);
    d = smin(d, sdCapsule(ax, y, z, 1.18, 5.25, 0.15, 1.2, 1.15, -0.1, 0.48, 0.32), 0.3);
    d = smin(d, sdEllipsoid(ax, y, z, 1.2, 3.95, -0.26, 0.52, 1.3, 0.56), 0.35);
    d = smin(d, Math.max(sdEllipsoid(ax, y, z, 1.2, 0.5, 0.55, 0.46, 0.5, 1.25), -y - WRAP), 0.25);
  }
  return d - WRAP;
}

/** one region: linen, which the shader wraps (the dark of the slit and the mouth is on the head's own mesh) */
const mummyRegion = (): number => 0;

/**
 * Arms take only their own skin, past a line in the gap between them and the body (by the hips at 2.3, by the ribs
 * at 1.95, over the shoulder 2.15); thighs keep their own top (species.ts's rule for the upright plans).
 */
const capture: Capture = (sg, x, y, z) => {
  if (sg.name.startsWith('thigh')) return z > -1.6 && y < sg.a[1]! + 0.8 && Math.abs(Math.abs(x) - Math.abs(sg.a[0]!)) < (y < sg.a[1]! + 0.3 ? 1.3 : 0.9);
  if (sg.name.startsWith('arm') || sg.name.startsWith('forearm')) return Math.abs(x) > (y < 12 ? 2.3 : y < 14.1 ? 1.95 : 2.15);
  return true;
};

// ---------------------------------------------------------------------------------------------------------------------
// the head and the jaw

/** the eye slit's middle height at |x| across: its outer ends a little higher (a frown) */
const SLIT_Y = 17.16;
const slitY = (ax: number) => SLIT_Y + 0.07 * ax;

/** the wrapped skull: cranium, the face's mass, a brow over the slit, the nose under the linen */
function headShape(x: number, y: number, z: number): number {
  let d = sdEllipsoid(x, y, z, 0, 17.35, 0.0, 1.1, 1.24, 1.2);
  d = smin(d, sdEllipsoid(x, y, z, 0, 16.7, 0.4, 0.88, 0.9, 0.94), 0.4);
  d = smin(d, sdCapsule(x, y, z, -0.62, 17.42, 1.0, 0.62, 17.42, 1.0, 0.2, 0.2), 0.3); // the brow
  d = smin(d, sdCapsule(x, y, z, 0, 17.0, 1.16, 0, 16.6, 1.36, 0.12, 0.17), 0.22); // the nose
  return d;
}

/** the slit: a narrow groove round the front of the face, deep enough to hold the eyes */
function slit(x: number, y: number, z: number): number {
  const ax = Math.abs(x), rho = Math.hypot(x, z - 0.15), phi = Math.atan2(x, z - 0.15);
  return Math.max(Math.abs(y - slitY(ax)) - 0.085, 0.86 - rho, Math.abs(phi) * rho - 0.78);
}

/** the jaw's block: below a plane through the hinge that meets the face at the mouth, and in front of the hinge */
const jawBlock = (y: number, z: number) => smax(y - (HINGE[1] - 0.2 * (z - HINGE[2])), -0.2 - z, 0.15);
/** where the lips meet: the plane at the face's front */
const LIP_Y = HINGE[1] - 0.2 * (1.3 - HINGE[2]);

function skullSDF(x: number, y: number, z: number): number {
  const d = smax(headShape(x, y, z), -slit(x, y, z), 0.04);
  return Math.max(d, -(jawBlock(y, z) - 0.012));
}
function jawSDF(x: number, y: number, z: number): number {
  return Math.max(headShape(x, y, z), jawBlock(y, z) + 0.012);
}

const LINEN_C = new THREE.Color(0xd6cbae), DARK_C = new THREE.Color(0x120c08);
function headColor(x: number, y: number, z: number, c: THREE.Color): void {
  // inside the slit and on the cut faces of the mouth: the dark between the wraps
  const dark = slit(x, y, z) < 0.03 || Math.abs(jawBlock(y, z)) < 0.035;
  c.copy(dark ? DARK_C : LINEN_C);
}

// ---------------------------------------------------------------------------------------------------------------------
// the linen

/**
 * The wraps, per fragment, from the bind-pose position `p` (model units) over the vertex colour `base`. Family A runs
 * diagonally round everything, mirrored left and right (chevrons down the front; nearly level round the head); each strip
 * is lighter where it lies over the one below and shadowed where the next laps it, with a dark seam at its edge. Family B
 * crosses it in patches, steeper and the other way, each of its straps lying on top with a drop shadow either side.
 * `hgt` is the relief for the bump.
 */
const LINEN_GLSL = /* glsl */ `
  varying vec3 vBind;
  float lh(float n) { return fract(sin(n * 91.345) * 47453.5453); }
  float lh3(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float lnoise(vec3 p) {
    vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    float a = mix(mix(lh3(i), lh3(i + vec3(1.0, 0.0, 0.0)), f.x), mix(lh3(i + vec3(0.0, 1.0, 0.0)), lh3(i + vec3(1.0, 1.0, 0.0)), f.x), f.y);
    float b = mix(mix(lh3(i + vec3(0.0, 0.0, 1.0)), lh3(i + vec3(1.0, 0.0, 1.0)), f.x), mix(lh3(i + vec3(0.0, 1.0, 1.0)), lh3(i + vec3(1.0, 1.0, 1.0)), f.x), f.y);
    return mix(a, b, f.z);
  }
  // strips of width w along a gradient g (not normalised: its y stays 1, so a tilt that changes across the body bends
  // the strips without squeezing them), wobbling: (s, id, fract, fwidth)
  vec4 wrapAt(vec3 p, vec3 g, float w, float seed) {
    float s = dot(p, g) / w + 0.7 * lnoise(p * 0.4 + seed) + 0.15 * lnoise(p * 1.7 + seed);
    return vec4(s, floor(s), fract(s), fwidth(s));
  }
  vec3 linen(vec3 base, vec3 p, out float hgt) {
    // which way the wraps lean: one way round the torso, mirrored on the right arm and on each leg; nearly level round
    // the head
    float legs = 1.0 - smoothstep(9.2, 10.2, p.y);
    float side = mix(mix(1.0, sign(p.x), smoothstep(1.7, 2.1, abs(p.x))), clamp(p.x * 3.0, -1.0, 1.0), legs);
    float head = smoothstep(15.8, 16.6, p.y);
    vec4 A = wrapAt(p, vec3(mix(0.4, 0.12, head) * side, 1.0, mix(0.15, 0.04, head)), 0.54, 0.0);
    float ea = max(A.w * 1.5, 0.035);
    float lip = smoothstep(0.0, ea, A.z);
    // the seam's dark softens with distance (strips a few pixels wide), or the figure reads as pinstripes
    float far = smoothstep(0.06, 0.3, A.w);
    float shade = (0.86 + 0.16 * lh(A.y * 7.13)) * (1.0 - mix(0.26, 0.12, far) * smoothstep(0.62, 1.0, A.z)) * mix(mix(0.66, 0.88, far), 1.0, lip);
    hgt = (1.0 - A.z) * lip;
    // the crossing straps
    vec4 B = wrapAt(p, vec3(-0.85 * side, 1.0, -0.22), 0.68, 3.7);
    float eb = max(B.w * 1.5, 0.035);
    float patchB = smoothstep(0.5, 0.58, lnoise(p * 0.3 + 11.0)) * step(0.42, lh(B.y * 3.31 + 1.7)) * (1.0 - head * 0.6);
    float inB = smoothstep(0.0, eb, B.z - 0.14) * smoothstep(0.0, eb, 0.86 - B.z);
    float onB = patchB * inB;
    float nearB = 1.0 - smoothstep(0.0, 0.12, min(abs(B.z - 0.14), abs(B.z - 0.86)));
    shade *= 1.0 - 0.32 * patchB * (1.0 - inB) * nearB;
    float shadeB = (0.9 + 0.12 * lh(B.y * 5.7)) * (1.0 - 0.24 * smoothstep(0.55, 0.86, B.z));
    shade = mix(shade, shadeB, onB);
    hgt = mix(hgt, 1.4 - 0.5 * (B.z - 0.14) / 0.72, onB);
    // here and there a strip falls short of the next and the dark beneath shows
    float gap = step(0.9, lh(A.y * 2.17 + 0.3)) * (1.0 - smoothstep(0.0, ea, A.z - 0.04)) * (1.0 - onB) * (1.0 - far);
    // each strip its own age: some yellower, some greyer
    float age = lh(A.y * 1.9 + onB * 4.0);
    vec3 c = base * shade * mix(vec3(1.04, 1.0, 0.9), vec3(0.9, 0.92, 0.9), age);
    // grime: tea-brown stains in blotches, gathering toward the feet and on the hands
    float g = lnoise(p * 0.7 + 5.0) * 0.6 + lnoise(p * 2.4) * 0.4;
    float low = 1.0 - smoothstep(1.0, 6.5, p.y);
    float hand = smoothstep(2.75, 3.05, abs(p.x)) * (1.0 - smoothstep(9.3, 10.4, p.y));
    float dirt = clamp(smoothstep(0.48, 0.8, g) * 0.6 + 0.5 * low + 0.4 * hand, 0.0, 0.85);
    c = mix(c, c * vec3(0.5, 0.4, 0.27), dirt);
    return mix(c, vec3(0.025, 0.018, 0.012), gap * 0.85);
  }
  // three's perturbNormalArb (bumpmap_pars_fragment), for a height made here rather than read from a map
  vec3 linenBump(vec3 surf, vec3 n, vec2 dHdxy, float faceDir) {
    vec3 sx = normalize(dFdx(surf)), sy = normalize(dFdy(surf));
    vec3 r1 = cross(sy, n), r2 = cross(n, sx);
    float det = dot(sx, r1) * faceDir;
    vec3 grad = sign(det) * (dHdxy.x * r1 + dHdxy.y * r2);
    return normalize(abs(det) * n - grad);
  }`;

function linenMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n varying vec3 vBind;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n vBind = position;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + LINEN_GLSL)
      .replace('#include <color_fragment>', '#include <color_fragment>\n float linenH; diffuseColor.rgb = linen(diffuseColor.rgb, vBind, linenH);')
      .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n normal = linenBump(-vViewPosition, normal, vec2(dFdx(linenH), dFdy(linenH)) * 0.55, faceDirection);');
  };
  m.customProgramCacheKey = () => 'mummy-linen-v1';
  return m;
}

// ---------------------------------------------------------------------------------------------------------------------
// meshes

/**
 * A glow: additive, bright where it faces the eye and fading to nothing at its rim, so a sphere reads as a soft light
 * rather than a disc. The stage fades an additive material by its opacity (`keepBlend`).
 */
function haloMaterial(color: number): THREE.MeshBasicMaterial {
  const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  m.userData.keepBlend = true;
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n varying vec3 vHaloN; varying vec3 vHaloV;')
      .replace('#include <project_vertex>', '#include <project_vertex>\n vHaloN = normalize(normalMatrix * normal); vHaloV = -mvPosition.xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n varying vec3 vHaloN; varying vec3 vHaloV;')
      .replace('#include <color_fragment>', '#include <color_fragment>\n diffuseColor.a *= pow(clamp(dot(normalize(vHaloN), normalize(vHaloV)), 0.0, 1.0), 2.2);');
  };
  m.customProgramCacheKey = () => 'mummy-halo-v1';
  return m;
}

let seed = 1;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

function merge(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const g = mergeGeometries(parts.map((p) => (p.index ? p.toNonIndexed() : p)), false)!;
  for (const p of parts) p.dispose();
  return g;
}
const paint = (g: THREE.BufferGeometry, hex: number) => {
  const c = new THREE.Color(hex), n = g.attributes.position!.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3));
  return g;
};

/**
 * A loose bandage end hanging from its origin along -y: a strip that curls out and twists a little, frayed at the tip,
 * its edges and its tip dirtier. Vertex colours; drawn from both sides.
 */
function ribbon(len: number, w: number, curl: number, twist: number): THREE.BufferGeometry {
  const n = 14, across = 3;
  const pos: number[] = [], col: number[] = [], idx: number[] = [];
  const clean = new THREE.Color(0xd8c9a4), grime = new THREE.Color(0x6e5a3e), c = new THREE.Color();
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = twist * t, ca = Math.cos(a), sa = Math.sin(a);
    const fray = i === n ? 0.25 : 0;
    for (let j = 0; j < across; j++) {
      const u = (j / (across - 1) - 0.5) * w;
      const y = -len * t + (fray ? (rnd() - 0.5) * fray * len * 0.25 : 0);
      pos.push(u * ca + curl * t * t, y, u * sa + 0.15 * Math.sin(t * 3.1));
      const edge = Math.abs(j / (across - 1) - 0.5) * 2;
      c.copy(clean).lerp(grime, clamp01(0.15 + 0.5 * t * t + 0.2 * edge)).multiplyScalar(0.92 + 0.12 * (1 - edge));
      col.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < n; i++) for (let j = 0; j < across - 1; j++) {
    const a = i * across + j, b = a + 1, d = a + across, e = d + 1;
    idx.push(a, d, b, b, d, e);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** where each loose end hangs from, on which bone, and its shape */
const ENDS: { bone: string; at: V3; len: number; w: number; curl: number; twist: number }[] = [
  { bone: 'forearmL', at: [3.25, 9.95, 0.2], len: 2.6, w: 0.42, curl: 0.35, twist: 0.9 },
  { bone: 'forearmR', at: [-3.15, 11.5, -0.25], len: 1.9, w: 0.36, curl: -0.25, twist: -0.7 },
  { bone: 'pelvis', at: [1.55, 10.45, 0.55], len: 3.3, w: 0.44, curl: 0.4, twist: 1.2 },
  { bone: 'pelvis', at: [-0.75, 10.6, -1.0], len: 2.8, w: 0.4, curl: -0.3, twist: -1.0 },
  { bone: 'head', at: [0.55, 17.9, -0.95], len: 2.2, w: 0.38, curl: 0.25, twist: 0.8 },
];

function dress(d: Dresser): void {
  seed = 11;
  const linen = linenMaterial();
  // the body's wraps: its material swapped for the linen (build.ts hangs the root bone on the skinned body before dressing)
  const body = d.bones.get('pelvis')!.parent as THREE.SkinnedMesh | null;
  if (body?.isSkinnedMesh) {
    (body.material as THREE.Material).dispose();
    body.material = linen;
  }

  // --- the head and the jaw, with the dark inside the mouth and a few old teeth behind the lips
  const skull = isoGeometry(skullSDF, { min: [-1.3, 15.65, -1.32], max: [1.3, 18.72, 1.62] }, 56, headColor, 40000);
  const head = new THREE.Mesh(skull, linen);
  head.name = 'mummy-head';
  d.at(head, 'head', 0, 0, 0);
  const jawGeo = isoGeometry(jawSDF, { min: [-1.05, 15.6, -0.35], max: [1.05, 16.75, 1.62] }, 40, headColor, 20000);
  const jaw = new THREE.Mesh(jawGeo, linen);
  jaw.name = 'mummy-jaw';
  d.at(jaw, 'jaw', 0, 0, 0);
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12).scale(0.58, 0.3, 0.5).translate(0, LIP_Y - 0.1, 0.5), d.std({ color: 0x1c0d08, roughness: 0.9 }));
  d.at(mouth, 'head', 0, 0, 0).castShadow = false;
  const teeth: THREE.BufferGeometry[] = [];
  for (const [tx, h] of [[-0.42, 0.13], [-0.25, 0.17], [-0.08, 0.15], [0.1, 0.18], [0.36, 0.14]] as const) {
    // on the lip line's curve, a little behind the front
    const zf = Math.sqrt(Math.max(0, 1 - (tx / 0.9) ** 2)) * 0.82 + 0.22;
    teeth.push(new THREE.BoxGeometry(0.13, h, 0.1).rotateY(Math.atan2(tx, zf)).translate(tx, LIP_Y - 0.03 - h / 2, zf));
  }
  d.at(new THREE.Mesh(merge(teeth), d.std({ color: 0xcbb78a, roughness: 0.6 })), 'head', 0, 0, 0).castShadow = false;

  // --- the eyes: amber embers deep in the slit, each in a soft halo that fills the slit with its light
  const glow = d.std({ color: 0x000000, emissive: 0xffa21e, emissiveIntensity: 2.4, roughness: 0.4 });
  const halo = haloMaterial(0xff9a24);
  for (const sx of [1, -1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10).scale(1.5, 0.75, 0.6), glow);
    e.name = 'mummy-eye';
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 10).scale(3.6, 1.6, 1.2), halo);
    h.name = 'mummy-halo';
    h.renderOrder = 2;
    e.add(h);
    const ex = sx * 0.4, rho = 0.95;
    d.at(e, 'head', ex, slitY(0.4), 0.15 + Math.sqrt(rho * rho - ex * ex));
    e.castShadow = false; h.castShadow = false; h.receiveShadow = false;
  }

  // --- the loose ends, each on a pivot that `tick` turns to hang it
  const cloth = d.std({ color: 0xffffff, vertexColors: true, roughness: 0.92, side: THREE.DoubleSide });
  ENDS.forEach((e, i) => {
    const pivot = new THREE.Group();
    pivot.name = 'mummy-end';
    pivot.userData.phase = i * 1.7;
    pivot.add(new THREE.Mesh(ribbon(e.len, e.w, e.curl, e.twist), cloth));
    d.at(pivot, e.bone, e.at[0], e.at[1], e.at[2]);
  });
}

// tick's scratch (never allocate per frame)
const QP = new THREE.Quaternion(), QS = new THREE.Quaternion(), EU = new THREE.Euler();
const PARTS = new WeakMap<THREE.Object3D, { ends: THREE.Object3D[]; phase: number[]; eyes: THREE.MeshStandardMaterial[] }>();

export const MUMMY: CharacterDef = {
  id: 'mummy', name: 'Mummy', blurb: 'Old linen, loose ends, eyes like embers',
  segs: MUMMY_SEGMENTS,
  body: { sdf: mummySDF, region: mummyRegion, box: BOX, palette: [0xd6cbae], surface: 'soft', weights: 'sharp', capture },
  dress,
  fit: { size: 1.06, limb: 0.6 },
  face: {
    jaw: 0.38,
    eyes: [[0.4, slitY(0.4), 1.17, 0.3], [-0.4, slitY(0.4), 1.17, 0.3]],
    // what a mummy breathes: the dust of ages
    breath: { colors: [0xe0c890, 0xb89a62, 0xf0e2bc, 0x9a8460], rate: 0.8, speed: 0.6, size: 1.3 },
  },
  res: 84,
  tick(root, t, face) {
    let e = PARTS.get(root);
    if (!e) {
      // this wearer's own copies, found once (a WeakMap: userData is JSON-copied when the stage clones a root)
      const ends: THREE.Object3D[] = [], phase: number[] = [], eyes = new Set<THREE.MeshStandardMaterial>();
      root.traverse((o) => {
        if (o.name === 'mummy-end') { ends.push(o); phase.push((o.userData.phase as number | undefined) ?? 0); }
        if (o.name === 'mummy-eye') eyes.add((o as THREE.Mesh).material as THREE.MeshStandardMaterial);
      });
      e = { ends, phase, eyes: [...eyes] };
      PARTS.set(root, e);
    }
    // the loose ends hang under gravity from wherever their bone is, swaying: undo the bone chain's turn up to the
    // costume's root (which the stage only moves and scales), then a slow sway
    for (let i = 0; i < e.ends.length; i++) {
      const p = e.ends[i]!, ph = e.phase[i]!;
      QP.identity();
      for (let o = p.parent; o && o !== root; o = o.parent) QP.premultiply(o.quaternion);
      EU.set(0.16 * Math.sin(t * 1.25 + ph) + 0.05 * Math.sin(t * 3.1 + ph * 2.3), 0, 0.12 * Math.sin(t * 0.95 + ph * 1.3));
      QS.setFromEuler(EU);
      p.quaternion.copy(QP.invert()).multiply(QS);
    }
    // the embers breathe; a blink dims them; an open mouth makes them flare
    const k = (2.0 + 0.5 * Math.sin(t * 1.6) + 0.18 * Math.sin(t * 6.7 + 0.8)) * (1 - 0.8 * Math.max(face?.blinkL ?? 0, face?.blinkR ?? 0)) * (1 + 0.5 * (face?.jaw ?? 0));
    for (const m of e.eyes) m.emissiveIntensity = k;
  },
};
