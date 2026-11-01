// Performance transfer (founder, 2026-11-01: "Our face mesh should apply/map to boned faces. Not expression triggers.
// Mappings. It's a homomorphic spatial mapping mechanic. Performance transfer"): the wearer's face, as the movement of
// a few dozen of its mesh points against their rest (pose/facegeo.ts FaceMotion), carried onto the costume's face by a
// map from the human face's frame to the costume's — its eyes where the person's eyes are, its mouth where the mouth is,
// scaled between — and laid onto the costume's surface as a smooth field: each vertex near the face moves as the mapped
// points round it move (a Gaussian falloff over the face's plane, weighed where the points crowd), before skinning, so
// the head carries it. A smile pulls the costume's mouth corners up as far as the wearer's went, scaled to its face; a
// brow raise lifts its brow; a sneer its nose; whatever the face does, on any costume with eyes, fur included (the coat
// is the body's own vertices pushed out). Rigid parts on the head (eyes, beaks, teeth, glasses) are moved whole by the
// field where they stand, through the head bone (bent, Violet's glasses buckled with a scowl). The jaw's opening stays the jaw bone's on costumes that have one (the lower lip's and
// chin's up-and-down is left out there, or a mouth would open twice); lids and pupils stay the costumes' own rigs.
import * as THREE from 'three';
import type { CharacterDef } from '../characters/build';
import { CONTROLS } from '../pose/facegeo';

export const FACEMAP_TUNE = {
  /** how much more than true to scale the movement (a costume face reads smaller than a face) */
  gain: 1.6,
  /** the falloff's width (the costume's eye spans) and the face's reach round its middle (outer-eye-corner spans) */
  sigma: 0.22, reach: 1.1,
  /** behind the eyes by this much (eye spans) the field is gone, by this much it is whole: the back of the head stays */
  backFrom: 0.9, backTo: 0.35,
};

const N = CONTROLS.length;
/** the human face's eye centres in the frame (outer-eye-corner spans): their distance, their height, the mouth's */
const H_EYES = 0.7088, H_EYE_Y = -0.0142, H_MOUTH_Y = -0.816;

/** where the human face's frame lands on a costume: per-costume, from its eyes (and its mouth, if it says) */
export interface FacePlace {
  /** the costume's eyes' middle, model units */
  o: THREE.Vector3;
  /** model units per outer-eye-corner span across, up, and out */
  sx: number; sy: number; sz: number;
  centres: THREE.Vector3[];
  /** the jaw opens by its bone (the lower lip's up-and-down left out) */
  jaw: boolean;
  strength: number;
  box: THREE.Vector4; z: THREE.Vector2;
}

export function facePlace(def: CharacterDef): FacePlace | null {
  const eyes = def.face?.eyes;
  if (!eyes || eyes.length < 2) return null;
  const l = new THREE.Vector3(eyes[0]![0], eyes[0]![1], eyes[0]![2]), r = new THREE.Vector3(eyes[1]![0], eyes[1]![1], eyes[1]![2]);
  const o = l.clone().add(r).multiplyScalar(0.5);
  const span = l.distanceTo(r);
  if (span < 1e-4) return null;
  const sx = span / H_EYES;
  // the mouth: the costume's own if it says, else where a face's would be for these eyes
  const m = def.face?.mouth;
  const mouthY = m ? m[1] : o.y - (sx * (H_EYE_Y - H_MOUTH_Y));
  const sy = Math.max(0.3 * sx, (o.y - mouthY) / (H_EYE_Y - H_MOUTH_Y));
  const sz = sx;
  const at = (p: [number, number, number]) => new THREE.Vector3(o.x + sx * p[0], o.y + sy * (p[1] - H_EYE_Y), o.z + sz * p[2]);
  const T = FACEMAP_TUNE;
  const centre = at([0, -0.55, 0]);
  return {
    o, sx, sy, sz, centres: CONTROLS.map((c) => at(c.at)), jaw: !!def.face?.jaw, strength: def.face?.transfer ?? 1,
    box: new THREE.Vector4(centre.x, centre.y, T.reach * Math.max(sx, sy), T.sigma * span),
    z: new THREE.Vector2(o.z - T.backFrom * span, o.z - T.backTo * span),
  };
}

/** one worn costume's face field: its uniforms, shared by all its materials */
export interface FaceField {
  place: FacePlace;
  u: {
    uFaceOn: { value: number }; uFaceC: { value: THREE.Vector3[] }; uFaceD: { value: THREE.Vector3[] };
    uFaceBox: { value: THREE.Vector4 }; uFaceZ: { value: THREE.Vector2 };
    uFaceHead: { value: THREE.Matrix4 }; uFaceHeadInv: { value: THREE.Matrix4 }; uFaceHeadA: { value: THREE.Vector3 };
  };
}

const DECL = /* glsl */ `
#define FACE_N ${N}
uniform float uFaceOn; uniform vec3 uFaceC[FACE_N]; uniform vec3 uFaceD[FACE_N]; uniform vec4 uFaceBox; uniform vec2 uFaceZ;
uniform mat4 uFaceHead; uniform mat4 uFaceHeadInv; uniform vec3 uFaceHeadA;
// the face's movement at a point of the costume (model units, its rest frame): the mapped controls' movements, each by a
// Gaussian of its distance across the face's plane, averaged where they crowd; nothing behind the eyes or off the face
vec3 faceDisp(vec3 p) {
  if (uFaceOn <= 0.0) return vec3(0.0);
  vec2 q = p.xy - uFaceBox.xy;
  if (dot(q, q) > uFaceBox.z * uFaceBox.z) return vec3(0.0);
  float front = smoothstep(uFaceZ.x, uFaceZ.y, p.z);
  if (front <= 0.0) return vec3(0.0);
  vec3 sum = vec3(0.0); float wsum = 0.0, s2 = uFaceBox.w * uFaceBox.w;
  for (int i = 0; i < FACE_N; i++) { vec2 d = p.xy - uFaceC[i].xy; float w = exp(-dot(d, d) / s2); sum += w * uFaceD[i]; wsum += w; }
  return sum / max(wsum, 1.0) * front * uFaceOn;
}`;
const MOVE = /* glsl */ `#include <begin_vertex>
#ifdef USE_SKINNING
  transformed += faceDisp(position);
#else
  // a rigid part (glasses, eyes, teeth, a beak) moves whole, by the field where it stands: it never bends
  { vec4 fw = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    vec3 fd = faceDisp((uFaceHeadInv * fw).xyz + uFaceHeadA);
    if (dot(fd, fd) > 0.0) transformed += inverse(mat3(modelMatrix)) * (mat3(uFaceHead) * fd); }
#endif`;

/**
 * Give a costume (`root`: a worn copy, or the lab's) the face field: each mesh material's shader takes the movement
 * after its own hooks (fur and the like build on the moved position). Returns the field to drive, or null for a costume
 * with no eyes to map a face to.
 */
export function wearFaceField(root: THREE.Object3D, def: CharacterDef): FaceField | null {
  const place = facePlace(def);
  if (!place) return null;
  const head = def.segs.find((s) => s.name === 'head');
  const u: FaceField['u'] = {
    uFaceOn: { value: 0 }, uFaceC: { value: place.centres.map((c) => c.clone()) }, uFaceD: { value: CONTROLS.map(() => new THREE.Vector3()) },
    uFaceBox: { value: place.box.clone() }, uFaceZ: { value: place.z.clone() },
    uFaceHead: { value: new THREE.Matrix4() }, uFaceHeadInv: { value: new THREE.Matrix4() },
    uFaceHeadA: { value: new THREE.Vector3(...(head?.a ?? [0, 0, 0])) },
  };
  const done = new Set<THREE.Material>();
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    for (const mat of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      if (done.has(mat) || (mat as THREE.ShaderMaterial).isShaderMaterial) continue;
      done.add(mat);
      const own = mat.onBeforeCompile;
      // the program is keyed by the material's own hook, plus the field (never by this wrapper's source: every
      // material would then share one program)
      const key = mat.customProgramCacheKey.call(mat);
      mat.onBeforeCompile = function (this: THREE.Material, shader, renderer) {
        own.call(this, shader, renderer);
        Object.assign(shader.uniforms, u);
        shader.vertexShader = shader.vertexShader.replace('#include <common>', `#include <common>\n${DECL}`).replace('#include <begin_vertex>', MOVE);
      };
      mat.customProgramCacheKey = () => `${key}|face${N}`;
      mat.needsUpdate = true;
    }
  });
  return { place, u };
}

/**
 * Drive a worn face field: `move` the wearer's controls' movement (FaceMotion.move: outer-eye-corner spans), or null
 * for none; `headBone` the costume's head bone (its world matrix current); `on` 0..1.
 */
export function driveFaceField(f: FaceField, move: Float32Array | null, headBone: THREE.Object3D | undefined, on = 1): void {
  const { place: p, u } = f;
  u.uFaceOn.value = move ? on * p.strength : 0;
  if (!move) return;
  const g = FACEMAP_TUNE.gain;
  CONTROLS.forEach((c, k) => {
    const d = u.uFaceD.value[k]!;
    d.set(move[k * 3]! * p.sx * g, p.jaw && c.jaw ? 0 : move[k * 3 + 1]! * p.sy * g, move[k * 3 + 2]! * p.sz * g);
  });
  if (headBone) { u.uFaceHead.value.copy(headBone.matrixWorld); u.uFaceHeadInv.value.copy(headBone.matrixWorld).invert(); }
}
