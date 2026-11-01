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

// ---- the face's moving parts: flat dark marks on the pale block, as the pictures draw them ----
// Each is a mark on the face's flat front (|x|, |y − 17.1| < 0.7, where the rounded box is flat), so a lid the face's own
// colour can slide over an eye and read as skin: same material, same normal, no edge.
/** an eye: a dark oval this wide, 1.45 times as tall, a little proud of the face */
const DOT_R = 0.16, DOT_SY = 1.45;
/** the brows: centre, half length, the rest slant (inner ends down: the grumpy V) */
const BROW_X = 0.62, BROW_Y = 17.92, BROW_HALF = 0.37, BROW_TILT = 0.38;
const BROW_RISE = BROW_HALF * Math.sin(BROW_TILT);
/** the mouth's centre, rest width and line thickness */
const MOUTH_X = 0.08, MOUTH_Y = 16.5, MOUTH_W = 0.72, MOUTH_T = 0.12;
/** depths in front of the face: the mouth and tongue, the eyes, the lids, the lash line, the brows over everything */
// (a shallow stack: seen from the side, a lid far in front of its eye would slide off it)
const Z_MOUTH = 0.03, Z_EYE = 0, Z_LID = 0.05, Z_LASH = 0.056, Z_BROW = 0.06;
/** the eye's depth (× DOT_R): a flat lens */
const DOT_SZ = 0.25;
/** the lash line's plane, scaled to the eye's width where the lid crosses it */
const LASH_W = 0.4;
/** the head bone's joint: d.at hangs a part relative to it, so tick's positions are model coordinates less this */
const HEAD_Y = BUILDER_SEGMENTS.find((sg) => sg.name === 'head')!.a[1];
/** the face block: its centre, the rounding of its edges, and where its flat front ends going up */
const FACE_CY = FACE.y - 0.05, FACE_ROUND = 0.8, FACE_FLAT = FACE_CY + 1.5 - FACE_ROUND;

/**
 * The mouth as a strip of MN columns across (two vertices each: the upper lip's edge and the lower's), its shape from a
 * few numbers. The rest is a short grumpy line, slanted (its left end up) and turned down at the ends; every expression
 * is a morph target off it (`MOUTH_TARGETS`), so each wearer's mouth is its own influences on one shared geometry.
 */
const MN = 21;
interface MouthShape {
  /** corners' lift (left, right), the middle's lift, the line's slant (left end up) */
  cl: number; cr: number; mid: number; slant: number;
  /** width (× MOUTH_W) and each half's own stretch */
  w: number; wl: number; wr: number;
  /** thickness; how far it opens (the lower lip drops, the upper rises a fifth of it); 0 a line's ends, 1 an oval's */
  t: number; o: number; round: number;
  /** the upper lip lifted either side of the middle (a sneer) */
  lift: number;
}
const MOUTH_REST: MouthShape = { cl: -0.035, cr: -0.035, mid: 0, slant: 0.043, w: 1, wl: 1, wr: 1, t: MOUTH_T, o: 0, round: 0, lift: 0 };
/** the targets, in the order of the influences tick sets */
const MOUTH_TARGETS: Partial<MouthShape>[] = [
  { cl: 0.21, wl: 1.12, t: 0.13 }, // 0 the left corner up (smileL): a smirk on its own
  { cr: 0.21, wr: 1.12, t: 0.13 }, // 1 the right corner up
  { cl: -0.2, cr: -0.2, mid: 0.025, w: 0.92 }, // 2 frown: both corners down, the middle up a little
  { o: 0.46, w: 0.96 }, // 3 open (jaw): the lower lip drops
  { o: 0.22, w: 0.5, round: 1, slant: 0, cl: 0, cr: 0 }, // 4 funnel: an "o"
  { o: 0.03, w: 0.46, round: 0.65, t: 0.2, slant: 0.01, cl: 0, cr: 0 }, // 5 pucker: lips pushed into a small knot
  { lift: 0.13, t: 0.14 }, // 6 sneer: the upper lip up either side of the middle
];
function mouthPositions(p: MouthShape): Float32Array {
  const out = new Float32Array(MN * 6);
  for (let i = 0; i < MN; i++) {
    const u = -1 + (2 * i) / (MN - 1), env = Math.max(0, 1 - u * u);
    const x = u * (MOUTH_W / 2) * p.w * (u > 0 ? p.wl : p.wr);
    const c = (u > 0 ? p.cl : p.cr) * u * u + p.mid * env + p.slant * u;
    const h = (p.t / 2) * ((1 - 0.55 * u ** 4) * (1 - p.round) + Math.sqrt(env) * p.round);
    // the opening's lower edge an ellipse's (a "D" laid flat: a shout's), the upper lip rising a little with it
    const open = Math.sqrt(env) * p.o;
    const lift = p.lift * Math.exp(-(((Math.abs(u) - 0.42) / 0.3) ** 2));
    out.set([x, c + h + 0.15 * open + lift, 0, x, c - h - open, 0], i * 6);
  }
  return out;
}
/** the upper and lower lips' middle vertices (the tongue sits on the lower) */
const M_UP = ((MN - 1) / 2) * 2, M_LO = M_UP + 1;
function mouthGeometry(): THREE.BufferGeometry {
  const base = mouthPositions(MOUTH_REST);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(base, 3));
  const nor = new Float32Array(MN * 6);
  for (let i = 0; i < MN * 2; i++) nor[i * 3 + 2] = 1;
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  const idx: number[] = [];
  for (let i = 0; i < MN - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  g.setIndex(idx);
  g.morphAttributes.position = MOUTH_TARGETS.map((tg) => {
    const p = mouthPositions({ ...MOUTH_REST, ...tg });
    for (let k = 0; k < p.length; k++) p[k]! -= base[k]!;
    return new THREE.BufferAttribute(p, 3);
  });
  g.morphTargetsRelative = true;
  // the morphs reach past the rest line's box: bounds for the widest of them, or a raycast/cull would clip it
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, -0.2, 0), 0.75);
  return g;
}
/** the lips' middles at rest and each target's move of them (y), for placing the tongue without reading the GPU's morph */
const MOUTH = (() => {
  const base = mouthPositions(MOUTH_REST), y = (p: Float32Array, v: number) => p[v * 3 + 1]!;
  const t = MOUTH_TARGETS.map((tg) => mouthPositions({ ...MOUTH_REST, ...tg }));
  return { up: y(base, M_UP), lo: y(base, M_LO), dUp: t.map((p) => y(p, M_UP) - y(base, M_UP)), dLo: t.map((p) => y(p, M_LO) - y(base, M_LO)) };
})();
/** a cheek: a ball of the face's colour sunk in the block's lower side, pushed out when he puffs */
const CHEEK_X = 0.98, CHEEK_Y = 16.55, CHEEK_Z = -0.75;

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

/**
 * The ornaments are lights (founder, 2026-10-31: "make the ornaments volumetric lighting sources"): each bulb glows and
 * twinkles by its colour, wears a soft additive halo in the air round it, and lights the needles near it — the tree's
 * material adds every ornament's light with its distance (`litByOrnaments`), from where it hangs this frame.
 */
const ORNS = BALLS.map(([ti, tooth, len, ci]) => {
  const t = TIERS[ti]!, [x, z] = ring(t.r0 * 0.99, ((tooth % SIDES) + SIDES) % SIDES), top = t.y0 - DROP * 0.55;
  return { bone: t.bone, p: [x, top - len * 1.2 - 0.3, z] as [number, number, number], ci };
});
const NORN = ORNS.length;
/** per material copy (each wearer has its own): the ornaments' world positions and light, as the shader's uniforms */
const ornUniforms = new WeakMap<THREE.Material, { uOrnPos: { value: THREE.Vector3[] }; uOrnCol: { value: THREE.Color[] }; uOrnR: { value: number } }>();
const ornU = (m: THREE.Material) => {
  let u = ornUniforms.get(m);
  if (!u) { u = { uOrnPos: { value: ORNS.map(() => new THREE.Vector3(0, -1e4, 0)) }, uOrnCol: { value: ORNS.map(() => new THREE.Color(0, 0, 0)) }, uOrnR: { value: 0.2 } }; ornUniforms.set(m, u); }
  return u;
};
/** the needles lit by the ornaments: their light added as emission, falling off with distance (a point light's, softened) */
function litByOrnaments(m: THREE.MeshStandardMaterial): void {
  m.name = 'lime';
  m.onBeforeCompile = function (this: THREE.Material, shader) {
    Object.assign(shader.uniforms, ornU(this));
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\n varying vec3 vOrnW;')
      .replace('#include <project_vertex>', '#include <project_vertex>\n vOrnW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec3 vOrnW; uniform vec3 uOrnPos[${NORN}]; uniform vec3 uOrnCol[${NORN}]; uniform float uOrnR;`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        for (int i = 0; i < ${NORN}; i++) {
          vec3 dv = vOrnW - uOrnPos[i];
          float q = dot(dv, dv) / (uOrnR * uOrnR);
          totalEmissiveRadiance += uOrnCol[i] * diffuseColor.rgb * (1.0 / (1.0 + q * 2.5)) * smoothstep(9.0, 2.0, q);
        }`);
  };
  m.customProgramCacheKey = () => 'builder-lime-ornaments-v1';
}

/** a soft round glow, for the halos (made once, on the page: the costume worker never dresses) */
let haloTex: THREE.Texture | null = null;
function haloTexture(): THREE.Texture {
  if (haloTex) return haloTex;
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d')!, r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.18, 'rgba(255,255,255,0.75)'); r.addColorStop(0.45, 'rgba(255,255,255,0.22)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  haloTex = new THREE.CanvasTexture(c); haloTex.colorSpace = THREE.SRGBColorSpace;
  return haloTex;
}

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

  // a little lime of its own: under a camera's real (often warm, dim) light the green went olive; the costume it copies
  // is a game's bright lime
  const lime = d.std({ color: 0xffffff, vertexColors: true, roughness: 0.95, metalness: 0, flatShading: true, side: THREE.DoubleSide, emissive: 0x2a4a12, emissiveIntensity: 1 });
  // the face is the one thing to read, deep in its hole under the hat: a faint glow of its own keeps it out of the shade
  const head = d.std({ color: 0xc4c1d0, emissive: 0xc4c1d0, emissiveIntensity: 0.05, roughness: 0.75 });
  const ink = d.std({ color: 0x141216, roughness: 0.5 });
  const string = d.std({ color: 0x222222, roughness: 0.8 });
  // the bulbs glow (their brightness twinkles in tick); one material per colour, so a colour twinkles together
  const ballMats = BALL_COLOURS.map((c, i) => { const m = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.2, roughness: 0.3, metalness: 0.1 }); m.name = `orn-${i}`; return m; });
  litByOrnaments(lime);
  const black = d.std({ color: 0x1e1e22, roughness: 0.45, metalness: 0.1 });
  const orange = d.std({ color: 0xf0861c, roughness: 0.45, metalness: 0.05 });
  const gold = d.std({ color: 0xe8b83a, emissive: 0xffb81a, emissiveIntensity: 0.25, roughness: 0.25, metalness: 0.85 });

  // ---- the tree, and its balls on their strings ----
  for (const t of TIERS) hang(mesh(tierGeo(t), lime), t.bone);
  const ballG = new THREE.SphereGeometry(0.34, 12, 8), strG = new THREE.CylinderGeometry(0.035, 0.035, 1, 4);
  for (const [ti, tooth, len, ci] of BALLS) {
    const t = TIERS[ti]!, [x, z] = ring(t.r0 * 0.99, ((tooth % SIDES) + SIDES) % SIDES), top = t.y0 - DROP * 0.55;
    const L = len * 1.2, s = mesh(strG, string); s.scale.y = L; hang(s, t.bone, x, top - L / 2, z);
    hang(mesh(ballG, ballMats[ci]!, `orn-${ci}`), t.bone, x, top - L - 0.3, z);
  }
  // the halos: soft additive glows in the air round each bulb (drawn after the tree, not written to depth; the stage fades
  // them by opacity, not by dithering: `keepBlend`)
  const haloMats = BALL_COLOURS.map((c, i) => {
    const m = new THREE.SpriteMaterial({ map: haloTexture(), color: c, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.85, toneMapped: false });
    m.name = `halo-${i}`; m.userData.keepBlend = true; return m;
  });
  for (const o of ORNS) {
    const sp = new THREE.Sprite(haloMats[o.ci]!);
    sp.name = `halo-${o.ci}`; sp.scale.setScalar(3.2); sp.renderOrder = 5;
    d.at(sp, o.bone, ...o.p);
  }

  // ---- the face: a pale block, a hair behind the hole's edge; small eyes under grumpy brows, a flat mouth ----
  hang(mesh(new RoundedBoxGeometry(3.0, 3.0, 2.3, 3, FACE_ROUND), head), 'head', 0, FACE_CY, FACE_Z - 1.15);
  // the moving parts are hung as they are, unmerged, and keep their geometry (not in `made`, which is freed below)
  // (the lids are the face's own colour and cast nothing: a shadow would give them away)
  const own = (m: THREE.Mesh, x: number, y: number, z: number, shadow = true) => {
    d.at(m, 'head', x, y, z).traverse((o) => { o.receiveShadow = false; if (!shadow) o.castShadow = false; });
  };
  // the lids: the face's colour over the eye, the upper hung from its top edge and the lower stood on its bottom edge, so
  // tick only scales them; the lash line is the dark edge a shut lid leaves
  const lidUpG = new THREE.PlaneGeometry(0.62, 1).translate(0, -0.5, 0), lidLoG = new THREE.PlaneGeometry(0.62, 1).translate(0, 0.5, 0);
  const lashG = new THREE.PlaneGeometry(LASH_W, 1);
  for (const sx of [1, -1]) {
    const S = sx > 0 ? 'L' : 'R';
    const e = new THREE.Mesh(new THREE.SphereGeometry(DOT_R, 12, 10), ink); e.scale.set(1, DOT_SY, DOT_SZ); e.name = 'eye' + S;
    own(e, sx * EYE_X, EYE_Y, FACE_Z + Z_EYE);
    const up = new THREE.Mesh(lidUpG, head); up.name = 'lidUp' + S; own(up, sx * EYE_X, EYE_Y, FACE_Z + Z_LID, false);
    const lo = new THREE.Mesh(lidLoG, head); lo.name = 'lidLo' + S; own(lo, sx * EYE_X, EYE_Y, FACE_Z + Z_LID, false);
    const lash = new THREE.Mesh(lashG, ink); lash.name = 'lash' + S; own(lash, sx * EYE_X, EYE_Y, FACE_Z + Z_LASH, false);
    // slanted down to the middle: determined, a little grumpy (the pictures' look)
    const b = new THREE.Mesh(new THREE.BoxGeometry(BROW_HALF * 2, 0.16, 0.1), ink); b.rotation.z = sx * BROW_TILT; b.name = 'brow' + S;
    own(b, sx * BROW_X, BROW_Y, FACE_Z + Z_BROW);
    // a cheek, sunk in the block until he puffs it out
    const ch = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), head); ch.name = 'cheek' + S; ch.visible = false;
    own(ch, sx * CHEEK_X, CHEEK_Y, FACE_Z + CHEEK_Z, false);
  }
  const mouth = new THREE.Mesh(mouthGeometry(), ink); mouth.name = 'mouth';
  own(mouth, MOUTH_X, MOUTH_Y, FACE_Z + Z_MOUTH, false);
  // the tongue, in the open mouth only (tick sizes it to the opening)
  const tongue = new THREE.Mesh(new THREE.CircleGeometry(1, 20), d.std({ color: 0xa8424f, roughness: 0.6 })); tongue.name = 'tongue'; tongue.visible = false;
  own(tongue, MOUTH_X, MOUTH_Y, FACE_Z + Z_MOUTH + 0.008, false);

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

/** one side of the face's moving parts (index 0 the character's left, +x) */
interface Side { eye: THREE.Object3D | null; up: THREE.Object3D | null; lo: THREE.Object3D | null; lash: THREE.Object3D | null; brow: THREE.Object3D | null; cheek: THREE.Object3D | null }
/** per root: the face's moving parts and the lights' materials, found once (a WeakMap, not userData: clone JSON-copies it) */
interface Parts {
  side: [Side, Side]; mouth: THREE.Mesh | null; tongue: THREE.Object3D | null;
  balls: THREE.MeshStandardMaterial[]; halos: THREE.SpriteMaterial[]; lime: THREE.Material | null;
  /** each ornament's bone and its place in the bone's frame */
  orn: { bone: THREE.Object3D; local: THREE.Vector3; ci: number }[];
  /** this frame's twinkle per colour (kept, so a frame allocates nothing) */
  k: number[];
}
const found = new WeakMap<THREE.Object3D, Parts>();
const scratch = new THREE.Vector3();

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const sstep = (a: number, b: number, v: number) => { const x = clamp01((v - a) / (b - a)); return x * x * (3 - 2 * x); };
const ramp = (v: number, lo: number, hi: number) => clamp01((v - lo) / (hi - lo));
/** how much of each eye the upper lid hides at rest (heavy lids, slanted in to the nose like the brows: grumpy) */
const LID_REST = 0.2, LID_TILT = 0.22;

/**
 * The expression this frame, per side where the face gives one ([left, right]): the wearer's, remapped, or with no face
 * read, the idle one. The remaps are assumed, not measured: MediaPipe's scores rarely reach 1 for a whole movement and
 * some rest above 0 (a squint, a pucker), so each starts a little in and is full before the top.
 */
const X = {
  blink: [0, 0], squint: [0, 0], wide: [0, 0], down: [0, 0], outer: [0, 0], smile: [0, 0],
  up: 0, frown: 0, jaw: 0, funnel: 0, pucker: 0, sneer: 0, puff: 0, lookX: 0, lookY: 0, side: 0,
};
function expression(f: FaceState | null | undefined, t: number): void {
  if (f) {
    // `smile` is the two sides' mean; on its own (the lab's ?face=smile:1) it lifts both
    const both = Math.max(0, f.smile - (f.smileL + f.smileR) / 2);
    X.blink[0] = ramp(f.blinkL, 0.15, 0.65); X.blink[1] = ramp(f.blinkR, 0.15, 0.65);
    X.squint[0] = ramp(f.squintL, 0.2, 0.7); X.squint[1] = ramp(f.squintR, 0.2, 0.7);
    X.wide[0] = ramp(f.wideL, 0.08, 0.5); X.wide[1] = ramp(f.wideR, 0.08, 0.5);
    X.down[0] = ramp(f.browDownL, 0.08, 0.55); X.down[1] = ramp(f.browDownR, 0.08, 0.55);
    X.outer[0] = ramp(f.browOuterL, 0.08, 0.6); X.outer[1] = ramp(f.browOuterR, 0.08, 0.6);
    X.smile[0] = ramp(f.smileL + both, 0.06, 0.7); X.smile[1] = ramp(f.smileR + both, 0.06, 0.7);
    X.up = ramp(f.browUp, 0.1, 0.65); X.frown = ramp(f.frown, 0.03, 0.35); X.jaw = clamp01(f.jaw);
    X.funnel = ramp(f.funnel, 0.06, 0.5); X.pucker = ramp(f.pucker, 0.2, 0.85); X.sneer = ramp(f.sneer, 0.06, 0.5);
    X.puff = ramp(f.puff, 0.04, 0.4); X.lookX = f.lookX; X.lookY = f.lookY; X.side = f.jawSide;
    return;
  }
  // no face read: he blinks every 4.4 s (twice in a row every third time) and glances aside now and then, held, and back
  const bt = t % 13.2, b1 = bt % 4.4, blink = b1 < 0.16 ? Math.sin((b1 / 0.16) * Math.PI) : bt > 8.8 && b1 > 0.24 && b1 < 0.4 ? Math.sin(((b1 - 0.24) / 0.16) * Math.PI) : 0;
  X.blink[0] = X.blink[1] = blink;
  const n = Math.floor(t / 2.9), g = sstep(0, 0.22, t - n * 2.9);
  const gx = (k: number) => (k % 3 === 0 ? 0 : (hash(k * 7.3) * 2 - 1) * 0.75), gy = (k: number) => (k % 3 === 0 ? 0 : (hash(k * 3.1 + 5) - 0.6) * 0.6);
  X.lookX = gx(n - 1) + (gx(n) - gx(n - 1)) * g; X.lookY = gy(n - 1) + (gy(n) - gy(n - 1)) * g;
  X.squint[0] = X.squint[1] = X.wide[0] = X.wide[1] = X.down[0] = X.down[1] = X.outer[0] = X.outer[1] = X.smile[0] = X.smile[1] = 0;
  X.up = X.frown = X.jaw = X.funnel = X.pucker = X.sneer = X.puff = X.side = 0;
}

/** the face from the expression: lids, eyes, brows, cheeks and the mouth's morphs */
function pose(p: Parts): void {
  for (let i = 0; i < 2; i++) {
    const s = p.side[i]!, sx = i === 0 ? 1 : -1;
    const bl = X.blink[i]!, sq = X.squint[i]!, wd = X.wide[i]!, bd = X.down[i]!, bo = X.outer[i]!, sm = X.smile[i]!;
    // the eye: the dark oval looks where the wearer looks, opens a little rounder when wide
    const sc = 1 + 0.14 * wd - 0.06 * sq;
    const cx = sx * EYE_X + 0.14 * X.lookX, cy = EYE_Y + 0.09 * X.lookY, hh = DOT_R * DOT_SY * sc;
    if (s.eye) { s.eye.position.x = cx; s.eye.position.y = cy - HEAD_Y; s.eye.scale.set(sc, DOT_SY * sc, DOT_SZ); }
    // how much of the eye each lid hides (1: to just under its middle, where they meet when shut)
    // (the upper lid lifts as the eyes look up and droops as they look down, as a real one does)
    const cu = Math.max(bl, clamp01(LID_REST + 0.5 * bd + 0.3 * sq + 0.2 * X.sneer - 0.6 * wd - 0.3 * X.up - 0.3 * bo - 0.2 * X.lookY));
    const cl = Math.max(bl, clamp01(0.5 * sq + 0.35 * sm + 0.15 * X.sneer));
    const top = cy + hh + 0.025, meet = cy - 0.03, bot = cy - hh - 0.025;
    let yu = top + (meet - top) * cu, yl = bot + (meet - bot) * cl;
    if (yl > yu) yu = yl = (yu + yl) / 2;
    // the lid line slants as the brow does: in and down for a scowl, up in the middle for a worried brow
    const a = sx * (LID_TILT + 0.3 * bd - 0.45 * X.up), b = a * (0.35 + 0.65 * bl);
    // each lid's free edge passes through (cx, y); its hinge edge stays clear of the eye
    if (s.up) {
      const drop = (top + 0.01 - yu) / Math.cos(a);
      s.up.visible = drop > 0.004;
      s.up.position.x = cx - drop * Math.sin(a); s.up.position.y = top + 0.01 - HEAD_Y; s.up.rotation.z = a; s.up.scale.y = Math.max(1e-3, drop);
    }
    if (s.lo) {
      const rise = (yl - (bot - 0.01)) / Math.cos(b);
      s.lo.visible = rise > 0.004;
      s.lo.position.x = cx + rise * Math.sin(b); s.lo.position.y = bot - 0.01 - HEAD_Y; s.lo.rotation.z = b; s.lo.scale.y = Math.max(1e-3, rise);
    }
    // a shut lid leaves a dark line where it meets the lower, as wide as the eye where the lid crosses it
    if (s.lash) {
      const w = 0.075 * sstep(0.6, 0.95, cu), q = (yu - cy) / hh, chord = DOT_R * sc * Math.sqrt(Math.max(0, 1 - q * q));
      s.lash.visible = w > 0.003 && chord > 0.02;
      s.lash.position.x = cx; s.lash.position.y = yu - HEAD_Y; s.lash.rotation.z = a;
      s.lash.scale.set((2 * chord + 0.05) / LASH_W, Math.max(1e-3, w), 1);
    }
    // the brow by its two ends: a scowl drops the inner end most, a raised outer end lifts the whole brow (one brow up
    // reads as a doubt), the inner raise lifts and tips both toward worried
    if (s.brow) {
      const inner = -BROW_RISE + 0.4 * X.up - 0.22 * bd + 0.18 * bo - 0.08 * X.sneer;
      const outer = BROW_RISE + 0.06 * X.up - 0.08 * bd + 0.26 * bo - 0.03 * X.sneer;
      // (raised past the flat of the face, it follows the block's rounding back, or it floats off its top edge)
      const by = BROW_Y + (inner + outer) / 2, over = Math.min(FACE_ROUND * 0.8, Math.max(0, by + 0.06 - FACE_FLAT));
      s.brow.position.x = sx * (BROW_X - 0.05 * bd); s.brow.position.y = by - HEAD_Y;
      s.brow.position.z = FACE_Z + Z_BROW - (FACE_ROUND - Math.sqrt(FACE_ROUND * FACE_ROUND - over * over));
      s.brow.rotation.z = sx * Math.asin(Math.max(-0.95, Math.min(0.95, (outer - inner) / (2 * BROW_HALF))));
    }
    if (s.cheek) {
      const pf = X.puff;
      s.cheek.visible = pf > 0.01;
      s.cheek.position.z = FACE_Z + CHEEK_Z + 0.4 * pf; s.cheek.scale.setScalar(1 + 0.08 * pf);
    }
  }
  const m = p.mouth, inf = m?.morphTargetInfluences;
  if (!m || !inf) return;
  // an "o" and pursed lips both narrow the mouth: together they share the narrowing, or it would turn inside out
  const nf = X.funnel, np = clamp01(X.pucker + 0.6 * X.puff), tot = Math.max(1, nf + np);
  inf[0] = X.smile[0]!; inf[1] = X.smile[1]!; inf[2] = X.frown * (1 - 0.6 * Math.max(X.smile[0]!, X.smile[1]!));
  inf[3] = X.jaw; inf[4] = nf / tot; inf[5] = np / tot; inf[6] = X.sneer;
  m.position.x = MOUTH_X + 0.12 * X.side;
  // the tongue lies on the lower lip, in the opening the jaw makes
  if (p.tongue) {
    let up = MOUTH.up, lo = MOUTH.lo;
    for (let k = 0; k < inf.length; k++) { up += inf[k]! * MOUTH.dUp[k]!; lo += inf[k]! * MOUTH.dLo[k]!; }
    const show = sstep(0.12, 0.45, X.jaw), w = 1 - 0.04 * inf[3]! - 0.5 * inf[4]! - 0.54 * inf[5]! - 0.08 * inf[2]!;
    const th = 0.24 * (up - lo) * show;
    p.tongue.visible = th > 0.01;
    p.tongue.position.x = m.position.x; p.tongue.position.y = MOUTH_Y + lo + th * 1.25 - HEAD_Y;
    p.tongue.scale.set(Math.max(1e-3, (MOUTH_W / 2) * w * 0.46 * show), Math.max(1e-3, th), 1);
  }
}

/** the wearer's face moves the costume's (face tracking on); the bulbs twinkle and light the needles */
const TWINKLE = BALL_COLOURS.map((_, i) => ({ rate: 1.3 + 0.37 * i, ph: i * 1.9 }));
function tick(root: THREE.Object3D, t: number, face?: FaceState | null): void {
  let p = found.get(root);
  if (!p) {
    const side = (): Side => ({ eye: null, up: null, lo: null, lash: null, brow: null, cheek: null });
    const q: Parts = { side: [side(), side()], mouth: null, tongue: null, balls: [], halos: [], lime: null, orn: [], k: BALL_COLOURS.map(() => 0) };
    const balls = new Map<number, THREE.MeshStandardMaterial>(), halos = new Map<number, THREE.SpriteMaterial>();
    const part = /^(eye|lidUp|lidLo|lash|brow|cheek)([LR])$/;
    const key = { eye: 'eye', lidUp: 'up', lidLo: 'lo', lash: 'lash', brow: 'brow', cheek: 'cheek' } as const;
    root.traverse((o) => {
      const pm = part.exec(o.name);
      if (pm) q.side[pm[2] === 'L' ? 0 : 1][key[pm[1] as keyof typeof key]] = o;
      else if (o.name === 'mouth') q.mouth = o as THREE.Mesh;
      else if (o.name === 'tongue') q.tongue = o;
      const mat = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (mat && !Array.isArray(mat)) {
        const m = /^orn-(\d)$/.exec(mat.name), h = /^halo-(\d)$/.exec(mat.name);
        if (m) balls.set(Number(m[1]), mat as THREE.MeshStandardMaterial);
        if (h) halos.set(Number(h[1]), mat as THREE.SpriteMaterial);
        if (mat.name === 'lime') q.lime = mat;
      }
    });
    q.balls = BALL_COLOURS.map((_, i) => balls.get(i)!).filter(Boolean);
    q.halos = BALL_COLOURS.map((_, i) => halos.get(i)!).filter(Boolean);
    const bones = new Map<string, THREE.Object3D>();
    root.traverse((o) => { if ((o as THREE.Bone).isBone) bones.set(o.name, o); });
    for (const o of ORNS) {
      const b = bones.get(o.bone), a = BUILDER_SEGMENTS.find((sg) => sg.name === o.bone)!.a;
      if (b) q.orn.push({ bone: b, local: new THREE.Vector3(o.p[0] - a[0], o.p[1] - a[1], o.p[2] - a[2]), ci: o.ci });
    }
    found.set(root, p = q);
  }
  // twinkle: each colour on its own slow breath, a sparkle now and then
  const k = p.k;
  for (let i = 0; i < TWINKLE.length; i++) {
    const w = TWINKLE[i]!;
    k[i] = 0.55 + 0.45 * Math.sin(t * w.rate + w.ph) + 0.6 * Math.max(0, Math.sin(t * w.rate * 3.1 + w.ph * 2) - 0.85) * 6;
  }
  for (let i = 0; i < p.balls.length; i++) p.balls[i]!.emissiveIntensity = 0.6 + 1.6 * k[i]!;
  for (let i = 0; i < p.halos.length; i++) p.halos[i]!.color.setHex(BALL_COLOURS[i]!).multiplyScalar(0.35 + 0.9 * k[i]!);
  // the needles round each bulb take its light, from where it hangs now (world space, as the shader reads it)
  if (p.lime && p.orn.length) {
    const u = ornU(p.lime);
    root.updateMatrixWorld(true);
    u.uOrnR.value = 2.4 * Math.abs(scratch.setFromMatrixScale(root.matrixWorld).y);
    for (let i = 0; i < p.orn.length; i++) {
      const o = p.orn[i]!;
      u.uOrnPos.value[i]!.copy(o.local).applyMatrix4(o.bone.matrixWorld);
      u.uOrnCol.value[i]!.setHex(BALL_COLOURS[o.ci]!).multiplyScalar(1.3 * k[o.ci]!);
    }
  }
  expression(face, t);
  pose(p);
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
