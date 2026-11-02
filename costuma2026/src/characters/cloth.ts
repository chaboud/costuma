// Fabric that moves (founder, 2026-11-02: "The ghost and witch should have fabric motion, right?"). A sheet, a skirt,
// a shawl or hair is skinned to the bones it hangs from, so it went exactly where they went: no lag, no swing. Here each
// such piece of cloth gets secondary motion, the games' way, cheap and stable: a ring of spring particles round its hem
// (eight), each tied to where its hem point would be if the cloth were rigid on its bone. When the body moves, turns or
// stops, the particles lag, overshoot and settle (a damped spring: its own frequency and damping), air drag trails
// them a little behind a walk; how far each lies off its rigid place, carried back into the bone's bind frame, displaces
// the cloth in the vertex shader before skinning — nothing at its top, all of it at the hem, blended round the hem
// between the two nearest particles. Every limit is a curve (founder: "no booleans in motion"): the swing is softly
// saturated at `max`, never cut.
//
// Per wearer: each costume's material copies get their own uniforms (stage.ts instance), as the occlusion's do. The
// particles live in the stage's world (camera space, metres); the tracker's motion drives them, so they also hear its
// tremble — `scripts/cloth-sim.test.ts` measures the hem on recorded clips, still and walking.
import * as THREE from 'three';

/** one piece of cloth: its meshes, the bone it hangs in, and how it swings (model units: the costume's own frame) */
export interface ClothPart {
  /** the meshes it moves, by name */
  meshes: string[];
  /** the bone whose frame it hangs in (its hem's rigid place rides this bone) */
  bone: string;
  /** bind pose: the hem's centre (x, z); the height where the cloth starts to move and the height of its hem */
  cx: number; cz: number; top: number; hem: number;
  /** the hem's radii across (x) and front to back (z): where the particles sit */
  rx: number; rz: number;
  /** its swing: natural frequency (Hz), damping ratio (1 does not overshoot), air drag (1/s) */
  hz: number; damping: number; drag: number;
  /** the most it moves (model units, softly), and how much of the up-and-down to keep (cloth hardly stretches) */
  max: number; lift: number;
}

const N = 8;
const TAU = Math.PI * 2;

const DECL = /* glsl */ `
uniform vec3 uSway[${N}]; uniform vec2 uClothC; uniform float uClothTop; uniform float uClothHem;`;
// after begin_vertex (bind pose, before morphs and skinning): the hem's share of the swing, round the hem between the
// two nearest particles
const BODY = /* glsl */ `
{
  float hh = smoothstep(uClothTop, uClothHem, position.y);
  hh *= hh;
  if (hh > 0.0) {
    vec2 rr = vec2(position.x - uClothC.x, position.z - uClothC.y);
    float q = (atan(rr.x, rr.y) / 6.2831853 + 1.0) * ${N.toFixed(1)};
    float i0 = floor(q), ff = q - i0;
    ff = ff * ff * (3.0 - 2.0 * ff);
    int a = int(mod(i0, ${N.toFixed(1)})), b = int(mod(i0 + 1.0, ${N.toFixed(1)}));
    transformed += hh * mix(uSway[a], uSway[b], ff);
  }
}`;

interface Live {
  def: ClothPart;
  mesh: THREE.SkinnedMesh;
  bi: number;
  /** the particles (world) and their velocities; the hem's rigid places last frame */
  x: THREE.Vector3[];
  v: THREE.Vector3[];
  rest: THREE.Vector3[];
  /** the swing in bind units, as the shader reads it */
  sway: THREE.Vector3[];
  primed: boolean;
}

const _M = new THREE.Matrix4(), _L = new THREE.Matrix3(), _Li = new THREE.Matrix3();
const _r = new THREE.Vector3(), _d = new THREE.Vector3(), _a = new THREE.Vector3();

/** a costume's moving cloth: made once per worn copy (after its materials are its own), stepped every frame */
export class ClothSway {
  private parts: Live[] = [];
  /** tests and review shots: hold the cloth where `set` put it */
  held = false;

  constructor(root: THREE.Object3D, defs: ClothPart[]) {
    for (const def of defs) {
      const meshes = def.meshes.map((n) => root.getObjectByName(n) as THREE.SkinnedMesh | undefined).filter((m): m is THREE.SkinnedMesh => !!m?.isSkinnedMesh);
      const first = meshes[0];
      if (!first) continue;
      const bi = first.skeleton.bones.findIndex((b) => b.name === def.bone);
      if (bi < 0) continue;
      const sway = Array.from({ length: N }, () => new THREE.Vector3());
      const u = { uSway: { value: sway }, uClothC: { value: new THREE.Vector2(def.cx, def.cz) }, uClothTop: { value: def.top }, uClothHem: { value: def.hem } };
      for (const m of meshes) for (const mat of Array.isArray(m.material) ? m.material : [m.material]) patch(mat, u);
      const z = () => Array.from({ length: N }, () => new THREE.Vector3());
      this.parts.push({ def, mesh: first, bi, x: z(), v: z(), rest: z(), sway, primed: false });
    }
  }

  get active(): boolean { return this.parts.length > 0; }

  /** step the cloth `dt` seconds, the costume posed (its bones placed) */
  update(root: THREE.Object3D, dt: number): void {
    if (!this.parts.length || this.held) return;
    root.updateMatrixWorld(true);
    const h = Math.min(0.1, Math.max(0, dt));
    for (const p of this.parts) {
      const d = p.def, m = p.mesh, sk = m.skeleton;
      // bind pose → world for a point that rides the bone (three's skinning: bindMatrixInverse · bone · boneInverse ·
      // bindMatrix, then the mesh's world matrix)
      _M.copy(m.matrixWorld).multiply(m.bindMatrixInverse).multiply(sk.bones[p.bi]!.matrixWorld).multiply(sk.boneInverses[p.bi]!).multiply(m.bindMatrix);
      _L.setFromMatrix4(_M);
      _Li.copy(_L).invert();
      // world units per model unit along the hem (the costume's scale): the soft limit, in the world
      const unit = Math.cbrt(Math.abs(_L.determinant())) || 1;
      const w = TAU * d.hz, c = 2 * d.damping * w;
      for (let k = 0; k < N; k++) {
        const th = (k / N) * TAU;
        _r.set(d.cx + d.rx * Math.sin(th), d.hem, d.cz + d.rz * Math.cos(th)).applyMatrix4(_M);
        if (!p.primed) { p.x[k]!.copy(_r); p.v[k]!.set(0, 0, 0); p.rest[k]!.copy(_r); continue; }
        // the rigid place's own velocity: the spring's damping is relative to it (the cloth's own swing dies out),
        // the air's to the world (a walk trails the hem)
        const rv = _a.copy(_r).sub(p.rest[k]!).divideScalar(Math.max(1e-3, h));
        p.rest[k]!.copy(_r);
        // substeps keep the spring stable (ω·step ≤ 0.25) at any frame time
        const n = Math.max(1, Math.ceil((w * h) / 0.25)), s = h / n;
        const x = p.x[k]!, v = p.v[k]!;
        for (let i = 0; i < n; i++) {
          // a = ω²(rest − x) − 2ζω(v − v_rest) − drag·v, semi-implicit
          _d.copy(_r).sub(x).multiplyScalar(w * w)
            .addScaledVector(v, -c - d.drag).addScaledVector(rv, c);
          v.addScaledVector(_d, s);
          x.addScaledVector(v, s);
        }
        // how far off its rigid place, softly limited (a curve to `max`, never a cut): x/√(1+(x/max)²)
        _d.copy(x).sub(_r);
        const lim = d.max * unit, len = _d.length(), k2 = 1 / Math.sqrt(1 + (len / lim) ** 2);
        if (k2 < 1) { _d.multiplyScalar(k2); x.copy(_r).add(_d); }
        // into the bone's bind frame, the up-and-down mostly taken out (cloth hardly stretches)
        p.sway[k]!.copy(_d).applyMatrix3(_Li);
        p.sway[k]!.y *= d.lift;
      }
      p.primed = true;
    }
  }

  /** review shots: every particle of every part to `f(angle round the hem, part)` (model units), held there */
  set(f: (th: number, part: number) => [number, number, number]): void {
    this.held = true;
    this.parts.forEach((p, j) => p.sway.forEach((s, k) => s.set(...f((k / N) * TAU, j))));
  }

  /** the hem's swing per part, model units (for tests and the readout): the largest particle's */
  swing(): number[] {
    return this.parts.map((p) => Math.max(...p.sway.map((s) => s.length())));
  }
}

/** chain the swing into a material's vertex shader, keyed so the program is shared (the uniforms are this wearer's) */
function patch(mat: THREE.Material, u: Record<string, { value: unknown }>): void {
  const own = mat.onBeforeCompile, key = mat.customProgramCacheKey.call(mat);
  mat.onBeforeCompile = function (this: THREE.Material, shader, renderer) {
    own.call(this, shader, renderer);
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${DECL}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>\n${BODY}`);
  };
  mat.customProgramCacheKey = () => `${key}|cloth`;
  mat.needsUpdate = true;
}
