// Jack: a pumpkin-headed scarecrow. The clothes are one skinned signed-distance body (a stuffed flannel shirt with an
// open cuff at each wrist, baggy jeans, a burlap neck, old boots) on the hero's skeleton with sharp weights, so it bends
// at the joints like cloth. Its pattern is drawn in the fragment shader in bind-pose space (red flannel check, indigo
// twill with sewn-on patches): at the body's marching-cubes resolution a vertex-coloured check comes out as stair steps
// (the hero's chevrons do), and a shader pattern stays crisp at any distance and rides the cloth as it bends. The head
// is a rigid mesh on the head bone: a ribbed pumpkin shell polygonised from its own field with the face carved right
// through the front wall, so the cuts have thickness; the inside and the cut walls glow (a per-vertex mask on the
// emissive) and a candle flame stands at the bottom, both flickering in `tick`. A battered hat sits crooked on top with
// the stem through its crown, and straw bursts from the collar, the cuffs (the hands are straw) and the trouser legs.
//
// Model frame: the hero's — 20 units tall on y = 0, +y up, +z forward, +x Jack's own left. The pumpkin's centre sits at
// the head segment's midpoint, which is where the stage's neck fit puts the wearer's head (rig.ts neckFit).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Capture, CharacterDef, Dresser } from './build';
import type { Seg } from './sdf';
import { sdCapsule, sdEllipsoid, smin } from './sdf';
import { isoGeometry } from './skeleton';

type V3 = [number, number, number];

// the hero's skeleton with the arms set a little wider: the shirt is stuffed, and the sleeves must stay half a unit
// clear of it at rest or the marching cubes join them and a raised arm tears the join
export const JACK_SEGMENTS: Seg[] = [
  { name: 'pelvis', a: [0, 9.6, 0], b: [0, 10.6, 0], parent: null },
  { name: 'spine1', a: [0, 10.6, 0], b: [0, 12.4, 0.1], parent: 'pelvis' },
  { name: 'spine2', a: [0, 12.4, 0.1], b: [0, 15.0, 0.1], parent: 'spine1' },
  { name: 'neck', a: [0, 15.0, 0.1], b: [0, 15.9, 0.15], parent: 'spine2', reach: 0.8 },
  { name: 'head', a: [0, 15.9, 0.15], b: [0, 18.4, 0.3], parent: 'neck' },
  { name: 'jaw', a: [0, 16.4, 0.9], b: [0, 16.4, 1.2], parent: 'head', reach: 0 },
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
  { name: 'armL', a: [2.5, 14.55, 0], b: [2.95, 11.95, -0.05], parent: 'spine2' },
  { name: 'forearmL', a: [2.95, 11.95, -0.05], b: [3.12, 9.6, 0.35], parent: 'armL' },
  { name: 'armR', a: [-2.5, 14.55, 0], b: [-2.95, 11.95, -0.05], parent: 'spine2' },
  { name: 'forearmR', a: [-2.95, 11.95, -0.05], b: [-3.12, 9.6, 0.35], parent: 'armR' },
];

const BOX = { min: [-4.2, -0.5, -1.9] as [number, number, number], max: [4.2, 17.1, 2.3] as [number, number, number] };

// ---------------------------------------------------------------------------------------------------------------------
// the clothed body

const WRIST: V3 = [3.12, 9.6, 0.35];
/** the sleeve's open end: a hollow carved up into the cuff, which the straw hand bursts out of */
const cuffHole = (ax: number, y: number, z: number) => sdCapsule(ax, y, z, 3.05, 10.55, 0.2, 3.16, 9.0, 0.45, 0.3, 0.3);

/**
 * The clothes' field. Each part is only evaluated where it can matter (a term further than its blend radius from the
 * running distance adds nothing to a smooth min), so a point by the boots never prices the collar: this field runs over
 * ~440k grid points at every build, on a phone.
 */
function jackSDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let d = 4;
  if (y > 8.4) {
    // the shirt: a stuffed barrel, a belly over the belt, sloped shoulders; the jeans' seat and hips under it
    d = sdEllipsoid(x, y, z, 0, 13.0, 0.05, 1.74, 2.15, 1.2);
    d = smin(d, sdEllipsoid(x, y, z, 0, 11.35, 0.15, 1.62, 1.1, 1.12), 0.5);
    if (y > 13.2) {
      d = smin(d, sdCapsule(ax, y, z, 0, 15.0, -0.05, 2.15, 14.62, 0, 0.5, 0.56), 0.5);
      // the collar, a rolled ring round the neck, and the burlap neck the pumpkin sits on
      d = smin(d, Math.hypot(Math.hypot(x, (z + 0.02) * 1.15) - 0.78, y - 15.18) - 0.2, 0.12);
      d = smin(d, sdCapsule(x, y, z, 0, 14.9, 0.05, 0, 15.6, 0.12, 0.62, 0.55), 0.2); // (its top stays in the shell's floor)
    }
    if (y < 11.6) d = smin(d, sdEllipsoid(x, y, z, 0, 10.05, 0.0, 1.78, 1.05, 1.15), 0.4);
  }
  if (y < 10.9) {
    // baggy legs to the boot tops
    d = smin(d, sdCapsule(ax, y, z, 1.08, 9.6, 0.0, 1.2, 5.3, 0.15, 0.88, 0.74), 0.35);
    if (y < 6.4) d = smin(d, sdCapsule(ax, y, z, 1.2, 5.3, 0.15, 1.22, 2.1, -0.05, 0.74, 0.7), 0.25);
  }
  if (ax > 1.5 && y > 8.8) {
    // the sleeves, baggy, a little narrower at the cuff, with the cuff hollowed. Blended into the body only over the
    // shoulder: below it a blend webs the sleeve to the shirt's side, and a raised arm tears the web into a blade
    const sl = sdCapsule(ax, y, z, 2.5, 14.55, 0, 2.95, 11.95, -0.05, 0.6, 0.55);
    d = y > 14.0 ? smin(d, sl, 0.3) : Math.min(d, sl);
    if (y < 12.9) {
      d = smin(d, sdCapsule(ax, y, z, 2.95, 11.95, -0.05, 3.08, 10.0, 0.28, 0.55, 0.52), 0.25);
      d = Math.max(d, -cuffHole(ax, y, z));
    }
  }
  if (y < 3.4) {
    // old boots: a shaft out of the trouser leg, a round toe, a flat sole
    const boot = smin(sdCapsule(ax, y, z, 1.22, 2.3, -0.05, 1.22, 0.6, -0.05, 0.5, 0.52), Math.max(sdEllipsoid(ax, y, z, 1.22, 0.5, 0.55, 0.58, 0.5, 1.3), -y), 0.3);
    d = Math.min(d, boot);
  }
  return d;
}

/** regions: 0 flannel, 1 denim, 2 boot leather, 3 burlap, 4 the dark inside a cuff */
const FLANNEL = 0, DENIM = 1, BOOT = 2, BURLAP = 3, SHADOW = 4;
function jackRegion(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  if (cuffHole(ax, y, z) < 0.06) return SHADOW;
  if (y < 2.25 && ax > 0.4) return BOOT;
  if (y > 15.38 && ax < 0.8) return BURLAP;
  if (ax > 2.1 && y > 9.2) return FLANNEL;
  return y > 10.72 ? FLANNEL : DENIM;
}

/**
 * The cloth, drawn per fragment from the bind-pose position and normal (both from the vertex shader before skinning,
 * so the pattern rides the body): `aCloth` weighs flannel (x), denim (y) and burlap (z) against the vertex colour,
 * interpolating smoothly across a seam. Colours are linear.
 */
const CLOTH_GLSL = /* glsl */ `
  varying vec3 vCloth; varying vec3 vBind; varying vec3 vBindN;
  float band(float q, float c, float w) { return 1.0 - smoothstep(w - 0.015, w + 0.015, abs(q - c)); }
  vec3 check(vec2 p, vec3 base, vec3 line) {
    vec2 q = fract(p / 1.3);
    float du = band(q.x, 0.5, 0.18), dv = band(q.y, 0.5, 0.18);
    float lu = band(q.x, 0.06, 0.028), lv = band(q.y, 0.06, 0.028);
    vec3 c = base * (1.0 - 0.66 * du) * (1.0 - 0.66 * dv);
    c = mix(c, line, 0.7 * max(lu, lv) * (1.0 - 0.6 * max(du, dv)));
    return c * (0.9 + 0.1 * sin((p.x + p.y) * 64.0));
  }
  vec3 tri(vec3 p, vec3 n, vec3 base, vec3 line) {
    vec3 w = n * n; w *= w; w /= (w.x + w.y + w.z + 1e-4);
    return check(p.zy, base, line) * w.x + check(p.xy, base, line) * w.z + check(p.xz, base, line) * w.y;
  }
  float box2(vec2 p, vec2 c, vec2 h) { vec2 d = abs(p - c) - h; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }
  // a sewn-on patch: inside it its own cloth, round its edge a dashed cream stitch
  vec3 sewOn(vec3 c, vec2 p, vec2 at, vec2 h, vec3 cloth, float face) {
    float b = box2(p, at, h);
    c = mix(c, cloth, (1.0 - smoothstep(-0.01, 0.01, b)) * face);
    float st = (1.0 - smoothstep(0.012, 0.03, abs(b + 0.07))) * step(0.45, fract((p.x + p.y) * 4.5));
    return mix(c, vec3(0.75, 0.62, 0.38), st * face);
  }
  vec3 burlap(vec2 p) { return vec3(0.36, 0.25, 0.11) * (0.8 + 0.2 * abs(sin(p.x * 70.0)) * abs(sin(p.y * 70.0))); }
  vec3 denim(vec3 p, vec3 n) {
    vec3 c = vec3(0.04, 0.075, 0.19) * (0.86 + 0.14 * sin((p.x + p.y + p.z) * 75.0));
    c *= 1.0 + 0.6 * smoothstep(0.4, 1.0, n.z) * smoothstep(3.0, 8.5, p.y) * (1.0 - smoothstep(8.5, 9.6, p.y)); // worn pale over the thighs
    float front = smoothstep(0.25, 0.5, n.z), back = smoothstep(0.25, 0.5, -n.z);
    c = sewOn(c, p.xy, vec2(1.22, 5.55), vec2(0.42, 0.4), burlap(p.xy), front);
    c = sewOn(c, p.xy, vec2(-1.08, 7.85), vec2(0.36, 0.42), check(p.xy * 1.4, vec3(0.05, 0.16, 0.05), vec3(0.6, 0.5, 0.2)), front);
    c = sewOn(c, p.xy, vec2(0.75, 9.55), vec2(0.42, 0.36), burlap(p.xy * 1.2), back);
    return c;
  }
  vec3 cloth(vec3 base, vec3 p, vec3 n, vec3 k) {
    vec3 f = tri(p, n, vec3(0.42, 0.028, 0.02), vec3(0.78, 0.6, 0.26));
    // the button placket down the shirt front
    f *= 1.0 - 0.5 * (1.0 - smoothstep(0.03, 0.05, abs(p.x - 0.13))) * smoothstep(0.3, 0.6, n.z) * step(10.9, p.y);
    vec3 sack = burlap(vec2(atan(p.z, p.x) * 0.7, p.y)) * 1.3;
    return base * clamp(1.0 - k.x - k.y - k.z, 0.0, 1.0) + f * k.x + denim(p, n) * k.y + sack * k.z;
  }`;

function clothMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0 });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n attribute vec3 aCloth; varying vec3 vCloth; varying vec3 vBind; varying vec3 vBindN;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n vBind = position; vBindN = normal; vCloth = aCloth;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + CLOTH_GLSL)
      .replace('#include <color_fragment>', '#include <color_fragment>\n diffuseColor.rgb = cloth(diffuseColor.rgb, vBind, normalize(vBindN), vCloth);');
  };
  m.customProgramCacheKey = () => 'jack-cloth-v2';
  return m;
}

// ---------------------------------------------------------------------------------------------------------------------
// the pumpkin

const PC: V3 = [0, 17.15, 0.22]; // its centre: the head segment's midpoint, a little forward over the face
const PR = 1.82, PH = 1.38, SHELL = 0.24;

/** the pumpkin's outside: an oblate ball with ten lobes (one centred on the face), dimpled at both poles */
function pumpkinOuter(x: number, y: number, z: number): { d: number; groove: number } {
  const px = x - PC[0], py = y - PC[1], pz = z - PC[2];
  const rho = Math.hypot(px, pz), th = Math.atan2(pz, px);
  const groove = 1 - Math.sqrt(Math.abs(Math.cos(5 * (th - Math.PI / 2))));
  const lobe = 1 - 0.06 * groove;
  let d = (Math.hypot(rho / lobe / PR, py / PH) - 1) * PH;
  d += 0.32 * Math.exp(-((rho / 0.6) ** 2)) * Math.min(1, Math.abs(py) / PH);
  return { d, groove };
}

/** 2D: a triangle, apex up at (cx, top), base half-width w at bot, turned by `tilt` (negative inside) */
function tri2(u: number, v: number, cx: number, top: number, bot: number, w: number, tilt = 0): number {
  const cy = (top + bot) / 2, cs = Math.cos(tilt), sn = Math.sin(tilt);
  const qu = (u - cx) * cs - (v - cy) * sn, qv = (u - cx) * sn + (v - cy) * cs + cy;
  const h = top - bot, nl = Math.hypot(h, w);
  return Math.max((Math.abs(qu) * h + (qv - top) * w) / nl, bot - qv);
}
const ell2 = (u: number, v: number, cx: number, cy: number, rx: number, ry: number) => (Math.hypot((u - cx) / rx, (v - cy) / ry) - 1) * Math.min(rx, ry);
const box2 = (u: number, v: number, cx: number, cy: number, hx: number, hy: number) => {
  const dx = Math.abs(u - cx) - hx, dy = Math.abs(v - cy) - hy;
  return Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0);
};

/** the carved face in the front plane (u across, v up from the centre): triangle eyes and nose, a toothy grin */
function face(u: number, v: number): number {
  const au = Math.abs(u);
  let d = tri2(au, v, 0.66, 0.74, 0.14, 0.36, -0.12); // the eyes, their inner corners raised a touch: up to mischief
  d = Math.min(d, tri2(u, v, 0, 0.1, -0.2, 0.17));
  // the grin: the part of one ellipse below another, so its corners turn up
  let m = Math.max(ell2(u, v, 0, -0.36, 1.2, 0.64), -ell2(u, v, 0, -0.08, 1.34, 0.56));
  m = Math.max(m, -box2(au, v, 0.32, -0.7, 0.11, 0.12)); // two teeth hang from the top lip...
  m = Math.max(m, -box2(u, v, 0, -0.93, 0.12, 0.13)); // ...one stands up from the bottom
  return Math.min(d, m);
}

function pumpkinSDF(x: number, y: number, z: number): number {
  const o = pumpkinOuter(x, y, z).d;
  let d = Math.max(o, -(o + SHELL));
  const hole = Math.max(face(x - PC[0], y - PC[1]), PC[2] + 0.4 - z);
  d = Math.max(d, -hole);
  return d;
}

// On the rind the vertex colour is the rind's; where the shell glows (the cut walls, the inside) it is the glow's own
// colour, hot yellow by the candle to deep orange under the lid, and the shader draws it as emissive only: a lit pale
// flesh under a saturated emissive tone-maps to peach.
const RIND = new THREE.Color(0xe8700e), GROOVE = new THREE.Color(0x9a4008);
const HOT = new THREE.Color(0xffb43c), EMBER = new THREE.Color(0xff640a);
function pumpkinColor(x: number, y: number, z: number, c: THREE.Color): void {
  const { d, groove } = pumpkinOuter(x, y, z);
  if (d < -0.05) { c.copy(HOT).lerp(EMBER, Math.max(0, Math.min(1, (y - PC[1] - PH * 0.2) / (PH * 0.8)))); return; }
  c.copy(RIND).lerp(GROOVE, Math.min(1, groove * 1.3));
  // a little darker toward the stem and the base, as a real one ripens
  c.multiplyScalar(0.85 + 0.15 * (1 - Math.abs(y - PC[1]) / PH));
}

/**
 * The shell's material: rind lit by the room, with the emissive switched on per vertex by `aGlow` (0 on the rind, up
 * to 1 down the cut walls and over the inside) in the vertex colour's hue, and the lit part switched off there, so a
 * flicker of emissiveIntensity lights the carving from within.
 */
function shellMaterial(d: Dresser): THREE.MeshStandardMaterial {
  const m = d.std({ color: 0xffffff, vertexColors: true, roughness: 0.5, metalness: 0, emissive: 0xffffff, emissiveIntensity: 1.0 });
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\n attribute float aGlow; varying float vGlow;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n vGlow = aGlow;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n varying float vGlow;')
      .replace('#include <color_fragment>', '#include <color_fragment>\n vec3 glowHue = diffuseColor.rgb; diffuseColor.rgb *= 1.0 - 0.92 * vGlow;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance *= vGlow * glowHue;');
  };
  m.customProgramCacheKey = () => 'jack-shell-v2';
  return m;
}

// ---------------------------------------------------------------------------------------------------------------------
// meshes

let seed = 1;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const UP = new THREE.Vector3(0, 1, 0);
const STRAW = [0xe8c66a, 0xd4ac4a, 0xf2dc8c, 0xc49a3c].map((h) => new THREE.Color(h));

/** one straw: a thin four-sided cone from `o` along `dir`, its own colour in the vertex colours */
function straw(o: THREE.Vector3, dir: THREE.Vector3, len: number, r: number): THREE.BufferGeometry {
  const g = new THREE.ConeGeometry(r, len, 4, 1).translate(0, len / 2, 0);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize())).translate(o.x, o.y, o.z);
  const c = STRAW[Math.floor(rnd() * STRAW.length)]!, n = g.attributes.position!.count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}
/** a direction `spread` radians at most off `axis`, at random */
function jitter(axis: THREE.Vector3, spread: number): THREE.Vector3 {
  const a = axis.clone().normalize();
  const t = Math.abs(a.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
  const u = new THREE.Vector3().crossVectors(a, t).normalize(), w = new THREE.Vector3().crossVectors(a, u);
  const ang = rnd() * Math.PI * 2, off = Math.tan(spread * Math.sqrt(rnd()));
  return a.addScaledVector(u, Math.cos(ang) * off).addScaledVector(w, Math.sin(ang) * off).normalize();
}

function merge(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const g = mergeGeometries(parts.map((p) => (p.index ? p.toNonIndexed() : p)), false)!;
  for (const p of parts) p.dispose();
  return g;
}

/** surface z of the body in front at (x, y), by bisection on the field */
function frontZ(x: number, y: number): number {
  let lo = 0, hi = 3;
  for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (jackSDF(x, y, m) < 0) lo = m; else hi = m; }
  return lo;
}
/** the body's radius from its axis at height y along the ray at angle th (0 = +x, π/2 = front) */
function rayR(y: number, th: number, cz: number): number {
  let lo = 0, hi = 3;
  for (let i = 0; i < 26; i++) { const m = (lo + hi) / 2; if (jackSDF(Math.cos(th) * m, y, cz + Math.sin(th) * m) < 0) lo = m; else hi = m; }
  return lo;
}

/** a rope: a tube with a twisted stripe painted along it */
function rope(curve: THREE.Curve<THREE.Vector3>, len: number, r: number, closed: boolean): THREE.BufferGeometry {
  const segs = Math.max(8, Math.round(len * 18));
  const g = new THREE.TubeGeometry(curve, segs, r, 7, closed);
  const uv = g.attributes.uv!, n = uv.count, col = new Float32Array(n * 3);
  const a = new THREE.Color(0xc8a868), b = new THREE.Color(0x8a6a38), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const s = 0.5 + 0.5 * Math.sin((uv.getX(i) * len * 4.5 + uv.getY(i)) * Math.PI * 2);
    c.copy(a).lerp(b, s * s);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}

function dress(d: Dresser): void {
  seed = 7;
  // --- the cloth: the skinned body's material swapped for the shader-patterned one, its weights per vertex
  // (build.ts adds the root bone to the skinned body before dressing; without it the palette colours stand in)
  const body = d.bones.get('pelvis')!.parent as THREE.SkinnedMesh | null;
  if (body?.isSkinnedMesh) {
    const pos = body.geometry.attributes.position!;
    const k = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const r = jackRegion(pos.getX(i), pos.getY(i), pos.getZ(i));
      k[i * 3] = r === FLANNEL ? 1 : 0; k[i * 3 + 1] = r === DENIM ? 1 : 0; k[i * 3 + 2] = r === BURLAP ? 1 : 0;
    }
    body.geometry.setAttribute('aCloth', new THREE.BufferAttribute(k, 3));
    (body.material as THREE.Material).dispose();
    body.material = clothMaterial();
  }

  const strawMat = d.std({ color: 0xffffff, vertexColors: true, roughness: 0.75, metalness: 0 });
  const ropeMat = d.std({ color: 0xffffff, vertexColors: true, roughness: 0.9, metalness: 0 });
  const both = (geo: THREE.BufferGeometry, bone: string, mat: THREE.Material, name: string) => {
    for (const side of ['L', 'R'] as const) {
      const m = new THREE.Mesh(geo, mat);
      m.name = `jack-${name}${side}`;
      if (side === 'R') m.scale.x = -1;
      d.at(m, bone + side, 0, 0, 0);
    }
  };

  // --- the head: the shell with its glow mask, a candle inside, the stem, the hat
  const shell = isoGeometry(pumpkinSDF, { min: [-1.92, PC[1] - PH - 0.05, PC[2] - 1.92], max: [1.92, PC[1] + PH + 0.05, PC[2] + 1.92] }, 48, pumpkinColor, 40000);
  const sp = shell.attributes.position!, glow = new Float32Array(sp.count);
  for (let i = 0; i < sp.count; i++) glow[i] = Math.max(0, Math.min(1, -pumpkinOuter(sp.getX(i), sp.getY(i), sp.getZ(i)).d / 0.16));
  shell.setAttribute('aGlow', new THREE.BufferAttribute(glow, 1));
  const head = new THREE.Mesh(shell, shellMaterial(d));
  head.name = 'jack-pumpkin';
  d.at(head, 'head', 0, 0, 0);

  // the candle's flame on the shell's floor (raised by the dimple to ~0.55 over the bottom), seen through the grin and
  // the nose; the candle itself is left out, a white block in the mouth read as a stray tooth. It scales about its
  // own foot (the wick), so its group sits there
  const floor = PC[1] - PH + SHELL + 0.3;
  const flame = new THREE.Group();
  flame.name = 'jack-flame';
  const fl = new THREE.Mesh(merge([
    new THREE.SphereGeometry(0.15, 10, 8).scale(1, 1.1, 1).translate(0, 0.15, 0),
    new THREE.ConeGeometry(0.148, 0.42, 10, 1, true).translate(0, 0.36, 0),
  ]), d.std({ color: 0x000000, emissive: 0xffc860, emissiveIntensity: 2.4 }));
  fl.name = 'jack-flamecore';
  flame.add(fl);
  d.at(flame, 'head', 0, floor, PC[2] - 0.15);

  const top = PC[1] + PH - 0.22;
  const stemGeo = new THREE.CylinderGeometry(0.16, 0.26, 1.5, 7, 8).translate(0, 0.75, 0);
  { // bend it over (the way the hat leans, so it leaves through the crown's hole) and flare its foot
    const p = stemGeo.attributes.position!;
    for (let i = 0; i < p.count; i++) {
      const t = p.getY(i) / 1.5, flare = 1 + 0.6 * Math.max(0, 1 - t * 5);
      p.setXYZ(i, p.getX(i) * flare + 0.5 * t * t, p.getY(i), p.getZ(i) * flare - 0.1 * t * t);
    }
    stemGeo.computeVertexNormals();
  }
  d.at(new THREE.Mesh(stemGeo.translate(0, top, PC[2] - 0.05), d.std({ color: 0x5b6a2c, roughness: 0.85 })), 'head', 0, 0, 0);

  // the hat: a battered felt with a drooping brim and a dented crown, crooked, the stem through a hole in its top
  const felt = d.std({ color: 0x4a3626, roughness: 0.95, side: THREE.DoubleSide });
  const brimPts: THREE.Vector2[] = [];
  for (let i = 0; i <= 10; i++) { const r = 1.08 + (i / 10) * 1.12; brimPts.push(new THREE.Vector2(r, -0.22 * ((r - 1.08) / 1.12) ** 2)); }
  const crownPts: THREE.Vector2[] = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10; crownPts.push(new THREE.Vector2(1.1 - 0.24 * t - (t > 0.85 ? (t - 0.85) * 3.6 : 0), t * 1.2)); }
  const hatGeo = merge([new THREE.LatheGeometry(brimPts, 28), new THREE.LatheGeometry(crownPts, 28)]);
  { // dent the crown's front and let the brim sag on one side
    const p = hatGeo.attributes.position!;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const dent = y > 0.7 ? 0.2 * Math.exp(-((x / 0.5) ** 2)) * Math.max(0, z) : 0;
      p.setXYZ(i, x, y - 0.07 * Math.max(0, x) * Math.max(0, Math.hypot(x, z) - 1.08) - dent * 0.6, z - dent);
    }
    hatGeo.computeVertexNormals();
  }
  const band = new THREE.TorusGeometry(1.07, 0.08, 6, 28).rotateX(Math.PI / 2).scale(1, 2.4, 1).translate(0, 0.2, 0);
  const hat = new THREE.Group();
  hat.add(new THREE.Mesh(hatGeo, felt), new THREE.Mesh(band, d.std({ color: 0x1e1712, roughness: 0.8 })));
  // perched on the top: the crown's base (r 1.1) must clear the pumpkin's shoulder there (~0.25 under the top), or the
  // lobes show through it from the side
  hat.rotation.set(-0.08, 0, -0.2);
  d.at(hat, 'head', 0.08, PC[1] + PH - 0.1, PC[2] - 0.1);

  // --- straw: round the collar, out of each cuff (the hand), out of each trouser leg over the boot
  const collar: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 34; i++) {
    const th = (i / 34) * Math.PI * 2 + rnd() * 0.15, r = 0.72;
    const o = new THREE.Vector3(Math.cos(th) * r, 15.3 + rnd() * 0.1, Math.sin(th) * r * 0.9);
    const dir = jitter(new THREE.Vector3(Math.cos(th) * 0.9, 0.7, Math.sin(th) * 0.9), 0.35);
    collar.push(straw(o, dir, 0.45 + rnd() * 0.5, 0.05));
  }
  const c = new THREE.Mesh(merge(collar), strawMat); c.name = 'jack-collar';
  d.at(c, 'spine2', 0, 0, 0);

  const fa = new THREE.Vector3(2.95, 11.95, -0.05), wr = new THREE.Vector3(...WRIST);
  const along = wr.clone().sub(fa).normalize();
  const hand: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 46; i++) {
    const ang = rnd() * Math.PI * 2, rr = 0.26 * Math.sqrt(rnd());
    const side = new THREE.Vector3(Math.cos(ang) * rr, 0, Math.sin(ang) * rr);
    const o = wr.clone().addScaledVector(along, 0.55).add(side);
    hand.push(straw(o, jitter(along.clone().addScaledVector(side, 1.4), 0.3), 0.8 + rnd() * 0.9, 0.055));
  }
  both(merge(hand), 'forearm', strawMat, 'hand');

  const ankle: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 26; i++) {
    const th = (i / 26) * Math.PI * 2 + rnd() * 0.2;
    const o = new THREE.Vector3(1.22 + Math.cos(th) * 0.62, 2.2 + rnd() * 0.12, -0.05 + Math.sin(th) * 0.62);
    ankle.push(straw(o, jitter(new THREE.Vector3(Math.cos(th), -1.1, Math.sin(th)), 0.3), 0.4 + rnd() * 0.45, 0.05));
  }
  both(merge(ankle), 'shin', strawMat, 'ankle');

  // a twist of rope round the sack neck, under the pumpkin
  const tie: THREE.Vector3[] = [];
  for (let i = 0; i < 14; i++) { const th = (i / 14) * Math.PI * 2, r = rayR(15.62, th, 0.1) + 0.04; tie.push(new THREE.Vector3(Math.cos(th) * r, 15.62, 0.1 + Math.sin(th) * r)); }
  d.at(new THREE.Mesh(rope(new THREE.CatmullRomCurve3(tie, true), 3.6, 0.09, true), ropeMat), 'neck', 0, 0, 0);

  // --- the rope belt, following the waist round, knotted at the front with two frayed ends hanging
  const beltY = 10.72, ring: THREE.Vector3[] = [];
  for (let i = 0; i < 24; i++) { const th = (i / 24) * Math.PI * 2, r = rayR(beltY, th, 0.05) + 0.06; ring.push(new THREE.Vector3(Math.cos(th) * r, beltY, 0.05 + Math.sin(th) * r)); }
  const beltCurve = new THREE.CatmullRomCurve3(ring, true);
  const kx = 0.55, kz = frontZ(kx, beltY) + 0.1;
  const end1 = new THREE.CatmullRomCurve3([new THREE.Vector3(kx, beltY - 0.05, kz), new THREE.Vector3(kx + 0.12, beltY - 0.6, kz + 0.12), new THREE.Vector3(kx + 0.05, beltY - 1.25, kz + 0.08)]);
  const end2 = new THREE.CatmullRomCurve3([new THREE.Vector3(kx, beltY - 0.05, kz), new THREE.Vector3(kx - 0.12, beltY - 0.5, kz + 0.14), new THREE.Vector3(kx - 0.02, beltY - 1.0, kz + 0.1)]);
  const fray: THREE.BufferGeometry[] = [];
  for (const e of [end1, end2]) {
    const tip = e.getPoint(1);
    for (let i = 0; i < 7; i++) fray.push(straw(tip, jitter(new THREE.Vector3(0, -1, 0.1), 0.35), 0.22 + rnd() * 0.2, 0.035));
  }
  const knot = new THREE.SphereGeometry(0.22, 10, 8).scale(1.2, 0.9, 0.8).translate(kx, beltY, kz);
  const kc = new Float32Array(knot.attributes.position!.count * 3), kcol = new THREE.Color(0xb09058);
  for (let i = 0; i < kc.length; i += 3) { kc[i] = kcol.r; kc[i + 1] = kcol.g; kc[i + 2] = kcol.b; }
  knot.setAttribute('color', new THREE.BufferAttribute(kc, 3));
  d.at(new THREE.Mesh(merge([rope(beltCurve, 11, 0.13, true), rope(end1, 1.3, 0.1, false), rope(end2, 1.0, 0.1, false), knot]), ropeMat), 'pelvis', 0, 0, 0);
  d.at(new THREE.Mesh(merge(fray), strawMat), 'pelvis', 0, 0, 0);

  // a couple of straws escaping between the shirt's buttons, and the buttons themselves
  const buttons: THREE.BufferGeometry[] = [], escaped: THREE.BufferGeometry[] = [];
  for (const y of [14.25, 13.45, 12.65]) {
    const z = frontZ(0.13, y);
    buttons.push(new THREE.CylinderGeometry(0.12, 0.12, 0.07, 10).rotateX(Math.PI / 2).translate(0.13, y, z + 0.02));
  }
  for (let i = 0; i < 5; i++) escaped.push(straw(new THREE.Vector3(0.13, 13.05, frontZ(0.13, 13.05) - 0.05), jitter(new THREE.Vector3(0.4, 0.3, 1), 0.4), 0.35 + rnd() * 0.25, 0.035));
  d.at(new THREE.Mesh(merge(buttons), d.std({ color: 0x2a1c12, roughness: 0.5 })), 'spine2', 0, 0, 0);
  d.at(new THREE.Mesh(merge(escaped), strawMat), 'spine2', 0, 0, 0);
}

/**
 * A thigh keeps its own top (species.ts's rule for the upright plans); an arm takes the sleeve and nothing else. The
 * line runs in the gap between body and sleeve at each height: by the hips (≤ 2.0 wide) and the forearm's sleeve (≥ 2.4
 * from the axis) at 2.2; by the shirt's side (≤ 1.75) and the upper sleeve's inside (≥ 2.0) at 1.88; over the shoulder,
 * the sleeve's cap past 2.1. A sleeve vertex left to the spine stays behind when the arm goes up and draws a blade from
 * the armpit; a hip vertex given to the forearm follows it up and draws one from the hip.
 */
const capture: Capture = (sg, x, y, z) => {
  if (sg.name.startsWith('thigh')) return z > -1.6 && y < sg.a[1]! + 0.8 && Math.abs(Math.abs(x) - Math.abs(sg.a[0]!)) < (y < sg.a[1]! + 0.3 ? 1.3 : 0.9);
  if (sg.name.startsWith('arm') || sg.name.startsWith('forearm')) return Math.abs(x) > (y < 12 ? 2.2 : y < 14.1 ? 1.88 : 2.1);
  return true;
};

const LIT = new WeakMap<THREE.Object3D, { shell: THREE.MeshStandardMaterial[]; core: THREE.MeshStandardMaterial[]; flame: THREE.Object3D | null }>();

export const PUMPKIN: CharacterDef = {
  id: 'pumpkin', name: 'Jack', blurb: 'A scarecrow with a candle-lit pumpkin head',
  segs: JACK_SEGMENTS,
  body: {
    sdf: jackSDF, region: jackRegion, box: BOX,
    // flannel and denim are drawn by the cloth shader; these are its fallbacks and the plain parts
    palette: [0x8c1a14, 0x23355a, 0x3a2416, 0xa8885a, 0x1a120c],
    surface: 'soft', weights: 'sharp', capture,
  },
  dress,
  // the stuffed clothes run a little larger than the wearer; the skinned body stretches, so limbs follow the wearer's
  fit: { size: 1.08, limb: 0.6 },
  // the box is shorter than the hero's (the head is a mesh), so 76 gives the hero's 88 cells up the body
  res: 76,
  tick(root, t) {
    let e = LIT.get(root);
    if (!e) {
      // the wearer's own material copies (stage.ts clones them per wearer); a WeakMap, not userData, which is cloned
      const shell: THREE.MeshStandardMaterial[] = [], core: THREE.MeshStandardMaterial[] = [];
      root.traverse((o) => {
        if (o.name === 'jack-pumpkin') shell.push((o as THREE.Mesh).material as THREE.MeshStandardMaterial);
        if (o.name === 'jack-flamecore') core.push((o as THREE.Mesh).material as THREE.MeshStandardMaterial);
      });
      e = { shell, core, flame: root.getObjectByName('jack-flame') ?? null };
      LIT.set(root, e);
    }
    // a candle's flicker: a slow breath, a quicker waver and a sharp gutter now and then
    const f = 0.5 * Math.sin(t * 1.7) + 0.3 * Math.sin(t * 7.9 + 1.3) + 0.22 * Math.sin(t * 13.3 + 0.4) + 0.15 * Math.sin(t * 23.7 + 2.2);
    const gutter = Math.max(0, Math.sin(t * 0.83 + 0.5) - 0.92) * 6;
    // the shell's glow peaks near 1 so the tone mapper's shoulder does not flatten the flicker away
    const k = Math.max(0.35, 1 + 0.36 * f - gutter);
    for (const m of e.shell) m.emissiveIntensity = k;
    for (const m of e.core) m.emissiveIntensity = 2.4 * k;
    if (e.flame) { e.flame.scale.set(1 - 0.08 * f, k * (1 + 0.12 * Math.sin(t * 17.0)), 1 - 0.08 * f); e.flame.rotation.z = 0.12 * Math.sin(t * 5.3); }
  },
};
