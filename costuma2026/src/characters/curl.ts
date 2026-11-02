// Fingers that curl (hand tracking, pose/hands.ts reads each finger's curl). The costumes' hands are SDF shapes — a
// glove's mitten, a witch's four long fingers, a wolf's claws — skinned to one hand bone, with no finger bones to turn.
// So the curl is a bend in the vertex shader, before skinning (as the cloth's swing is, cloth.ts): past the knuckle line,
// what the hand bone carries is wound onto an arc toward the palm, its total angle the finger's curl times a fist's,
// over the fingers' length, the rest carried rigidly on from the arc's end; the normals turn with it. Which finger a
// point belongs to is where it lies across the hand (the little finger's side to the index's), each finger's curl
// blended into its neighbour's; past the index (the thumb's side) nothing bends. A thick mitten's palm side would fold
// through itself on a tight arc, so the arc is never tighter than the hand is thick: a mitten makes a loose fist, a
// thin finger a tight one.
//
// A hand of separate bones (Skelly's, Catrina's: bonehand.ts) curls exactly instead: each phalanx turns at its own
// joint, the knuckle, middle and last joints each by its share of a fist (JOINT_FIST), the thumb's two as well.
//
// Per wearer: each costume's material copies get their own uniforms (stage.ts instance), as the cloth's do.
import * as THREE from 'three';
import type { Seg } from './sdf';

/** a hand's shape for the bend, in shares of its hand bone's length (the wrist to the bone's far end) */
export interface HandShape {
  /** the knuckle line, from the wrist */
  knuckle: number;
  /** the fingers' length past the knuckles */
  finger: number;
  /** half the hand's width across the knuckles */
  half: number;
  /** half the fingers' thickness (the arc's tightest radius) */
  thick: number;
  /** a fist's total bend (radians) */
  fist: number;
}
export const DEFAULT_HAND: HandShape = { knuckle: 0.45, finger: 0.6, half: 0.42, thick: 0.18, fist: THREE.MathUtils.degToRad(230) };

const DECL = /* glsl */ `
uniform vec3 uCurlO[2]; uniform vec3 uCurlX[2]; uniform vec3 uCurlY[2]; uniform vec3 uCurlN[2];
uniform vec4 uCurlP[2]; uniform vec4 uCurlF[2];`;
// after beginnormal_vertex (bind pose, before skinning): the bent position kept for begin_vertex, the normal turned
const NORMAL = /* glsl */ `
vec3 curlPos = position;
#ifdef USE_SKINNING
for (int h = 0; h < 2; h++) {
  // the hand bone's share of this point (a thigh by a hanging hand is never its)
  float hw = dot(skinWeight, vec4(equal(skinIndex, vec4(uCurlP[h].w))));
  if (hw < 0.01) continue;
  vec3 d = position - uCurlO[h];
  float u = dot(d, uCurlY[h]);
  if (u <= 0.0) continue;
  // across the hand: -1 the little finger's side, +1 the index's; each finger's curl, blended into its neighbours'
  float s = dot(d, uCurlX[h]) / uCurlP[h].y;
  float t = clamp((s + 0.75) * 2.0, 0.0, 3.0);
  vec4 c = uCurlF[h];
  float k = t < 1.0 ? mix(c.w, c.z, t) : t < 2.0 ? mix(c.z, c.y, t - 1.0) : mix(c.y, c.x, t - 2.0);
  k *= 1.0 - smoothstep(1.05, 1.4, s);
  float F = uCurlP[h].x, th = k * uCurlP[h].z * hw;
  if (th < 1e-4) continue;
  float n = dot(d, uCurlN[h]), R = F / th;
  float ua = min(u, F), phi = ua / R;
  vec2 T = vec2(cos(phi), sin(phi)), Nn = vec2(-sin(phi), cos(phi));
  vec2 q = vec2(R * sin(phi), R * (1.0 - cos(phi))) + T * (u - ua) + Nn * n;
  vec3 across = d - uCurlY[h] * u - uCurlN[h] * n;
  curlPos = uCurlO[h] + across + uCurlY[h] * q.x + uCurlN[h] * q.y;
  float ny = dot(objectNormal, uCurlY[h]), nn = dot(objectNormal, uCurlN[h]);
  objectNormal += uCurlY[h] * (ny * T.x + nn * Nn.x - ny) + uCurlN[h] * (ny * T.y + nn * Nn.y - nn);
}
#endif`;
const VERTEX = /* glsl */ `
transformed += curlPos - position;`;

interface Side { bone: number; O: THREE.Vector3; X: THREE.Vector3; Y: THREE.Vector3; N: THREE.Vector3; P: THREE.Vector4; F: THREE.Vector4 }
/** a jointed hand's pivot (bonehand.ts): which finger (0 the thumb) and joint, its hinge, which hand */
interface Pivot { o: THREE.Object3D; f: number; j: number; hinge: THREE.Vector3; side: 'L' | 'R' }

/** each joint's bend at a fist (radians): a finger's knuckle, middle and last joints; the thumb's two */
export const JOINT_FIST = { finger: [80, 100, 65].map(THREE.MathUtils.degToRad), thumb: [35, 60].map(THREE.MathUtils.degToRad) };

/** a costume's curling fingers: made once per worn copy (after its materials are its own), set every frame */
export class FingerCurl {
  private readonly u: Record<string, { value: unknown }>;
  private readonly sides: Partial<Record<'L' | 'R', Side>> = {};
  private readonly pivots: Pivot[] = [];

  constructor(root: THREE.Object3D, segs: Seg[], shape: Partial<HandShape> = {}) {
    const S = { ...DEFAULT_HAND, ...shape };
    const O: THREE.Vector3[] = [], X: THREE.Vector3[] = [], Y: THREE.Vector3[] = [], N: THREE.Vector3[] = [], P: THREE.Vector4[] = [], F: THREE.Vector4[] = [];
    const meshes: THREE.SkinnedMesh[] = [];
    root.traverse((o) => { const m = o as THREE.SkinnedMesh; if (m.isSkinnedMesh && m.skeleton) meshes.push(m); });
    const bones = meshes[0]?.skeleton.bones ?? [];
    (['L', 'R'] as const).forEach((side, h) => {
      const sg = segs.find((s) => s.name === 'hand' + side);
      const bi = bones.findIndex((b) => b.name === 'hand' + side);
      const a = new THREE.Vector3(...(sg?.a ?? [0, 0, 0])), b = new THREE.Vector3(...(sg?.b ?? [0, -1, 0]));
      const len = a.distanceTo(b) || 1, y = b.clone().sub(a).normalize();
      // at rest a hand hangs palm in, index forward: across (little → index) is forward; the palm faces the body's
      // middle (the left hand's -x, the right's +x)
      const x = new THREE.Vector3(0, 0, 1).addScaledVector(y, -y.z).normalize();
      const z = new THREE.Vector3().crossVectors(x, y);
      const palm = side === 'L' ? z.clone().negate() : z.clone();
      const fist = Math.min(S.fist, (S.finger * len) / Math.max(1e-3, S.thick * len * 1.1));
      O.push(a.clone().addScaledVector(y, S.knuckle * len)); X.push(x); Y.push(y); N.push(palm);
      P.push(new THREE.Vector4(S.finger * len, S.half * len, fist, sg && bi >= 0 ? bi : -1));
      F.push(new THREE.Vector4());
      if (sg && bi >= 0) this.sides[side] = { bone: bi, O: O[h]!, X: x, Y: y, N: palm, P: P[h]!, F: F[h]! };
    });
    this.u = { uCurlO: { value: O }, uCurlX: { value: X }, uCurlY: { value: Y }, uCurlN: { value: N }, uCurlP: { value: P }, uCurlF: { value: F } };
    // jointed hands (bonehand.ts): their pivots, each told its hand by the bone it hangs from
    root.traverse((o) => {
      const c = o.userData.curl as [number, number] | undefined, h = o.userData.hinge as [number, number, number] | undefined;
      if (!c || !h) return;
      let b: THREE.Object3D | null = o.parent;
      while (b && !/^(hand|forearm)[LR]$/.test(b.name)) b = b.parent;
      if (b) this.pivots.push({ o, f: c[0], j: c[1], hinge: new THREE.Vector3(...h), side: b.name.endsWith('L') ? 'L' : 'R' });
    });
    if (!this.sides.L && !this.sides.R) return;
    for (const m of meshes) for (const mat of Array.isArray(m.material) ? m.material : [m.material]) patch(mat, this.u);
  }

  get active(): boolean { return !!(this.sides.L || this.sides.R || this.pivots.length); }

  /** each hand's finger curls (thumb, index, middle, ring, little; 0 straight, 1 a fist); a bent hand's thumb is not
   *  bent, a jointed one's is */
  set(side: 'L' | 'R', curl: readonly number[]): void {
    const s = this.sides[side];
    if (s) s.F.set(curl[1] ?? 0, curl[2] ?? 0, curl[3] ?? 0, curl[4] ?? 0);
    for (const p of this.pivots) {
      if (p.side !== side) continue;
      const max = (p.f === 0 ? JOINT_FIST.thumb : JOINT_FIST.finger)[p.j] ?? 0;
      p.o.quaternion.setFromAxisAngle(p.hinge, (curl[p.f] ?? 0) * max);
    }
  }
}

/** chain the bend into a material's vertex shader, keyed so the program is shared (the uniforms are this wearer's) */
function patch(mat: THREE.Material, u: Record<string, { value: unknown }>): void {
  const own = mat.onBeforeCompile, key = mat.customProgramCacheKey.call(mat);
  mat.onBeforeCompile = function (this: THREE.Material, shader, renderer) {
    own.call(this, shader, renderer);
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${DECL}`)
      .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>\n${NORMAL}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n${VERTEX}`);
  };
  mat.customProgramCacheKey = () => `${key}|curl`;
  mat.needsUpdate = true;
}
