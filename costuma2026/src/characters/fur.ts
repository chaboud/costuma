// Fur as shells (founder, 2026-10-03: "a Jimothy Kaiju with fur rendering"): the body's surface drawn again a few
// times, each layer pushed out along its normal a little further, each keeping only the fragments that lie on a strand
// tall enough to reach it. Strands are columns along the normal: the cell a fragment falls in is taken from its
// bind-pose position on the surface (not the pushed-out one), so every layer cuts the same strand, and the strands ride
// the skinning without swimming. They thin toward their tips, droop a little, and are darker at the root.
//
// Smooth by distance, never switched: `furUniforms.uFurFade` (the renderer's, from the kaiju's height on screen)
// shortens every strand together, and a layer is skipped only once no strand reaches it. A strand smaller than a pixel
// widens until the layer is solid, so far fur is a soft coat, not shimmer (CLAUDE.md: patterns fade out under a pixel).
// The layers cast no shadow and sit on the layer the normals pass skips: both would see them as solid hulls.
import * as THREE from 'three';
export const FAR_LAYER = 2;

export const furUniforms = { uFurFade: { value: 1 } };

const HASH = `
  float furHash(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float furNoise(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(furHash(i), furHash(i + vec3(1, 0, 0)), f.x), mix(furHash(i + vec3(0, 1, 0)), furHash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(furHash(i + vec3(0, 0, 1)), furHash(i + vec3(1, 0, 1)), f.x), mix(furHash(i + vec3(0, 1, 1)), furHash(i + vec3(1, 1, 1)), f.x), f.y), f.z); }`;

/** One layer's material: `h` its height through the coat, 0..1. One program for every layer (its own uniforms). */
function layerMaterial(h: number, fur: { length: number; density: number; tip: number; feather?: boolean }): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: fur.feather ? 0.75 : 0.92, metalness: 0 });
  const U = { uH: { value: h }, uFurLen: { value: fur.length }, uFurDensity: { value: fur.density }, uFurTip: { value: fur.tip }, uFeather: { value: fur.feather ? 1 : 0 } };
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, U, furUniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        uniform float uH; uniform float uFurLen; uniform float uFurFade; uniform float uFeather; attribute float aFur; varying vec3 vFurP; varying vec3 vFurN; varying float vFurK;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        vFurP = position; vFurN = normalize(objectNormal); vFurK = aFur;
        // out along the normal as far as the coat reaches here, combed back and down the body, the tips drooping
        float reach = uFurLen * uFurFade * aFur * uH;
        vec3 comb = vec3(0.0, -0.75, -0.65);
        comb -= dot(comb, vFurN) * vFurN;
        // a feather lies flatter than a hair: less out, more down the body
        transformed += vFurN * reach * mix(1.0, 0.45, uFeather) + comb * reach * mix(0.9, 1.5, uFeather) * uH;
        transformed.y -= reach * 0.35 * uH;`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform float uH; uniform float uFurDensity; uniform float uFurFade; uniform float uFurTip; uniform float uFeather; varying vec3 vFurP; varying vec3 vFurN; varying float vFurK;
        ${HASH}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec3 q = vFurP * uFurDensity;
        // how big a strand is on screen: under a pixel or two, the strands widen into a soft solid coat
        float fw = length(fwidth(q));
        vec3 cell = floor(q), n = normalize(vFurN);
        // the strand stands off its cell's centre by a hash: no lattice
        vec3 f = fract(q) - 0.5 - (vec3(furHash(cell + 17.0), furHash(cell + 41.0), furHash(cell + 73.0)) - 0.5) * 0.55;
        // across the strand: the offset from its cell's centre in the surface's own plane
        vec3 ft = f - dot(f, n) * n;
        float clump = furNoise(vFurP * 0.7);
        float len = (0.35 + 0.65 * furHash(cell)) * (0.55 + 0.6 * clump);
        float r = mix(0.48, 0.1, clamp(uH / max(len, 1e-3), 0.0, 1.0));
        r = mix(r, 0.75, smoothstep(0.35, 0.9, fw));
        float t = uH / max(len, 1e-3);
        float shade = mix(0.55, 1.0, t);
        if (uFeather > 0.5) {
          // a feather: a vane laid down the body, long along the comb and broad across it, narrowing to its tip, a
          // darker shaft down its middle and faint barbs; the next row's tips lie over its root, so a coat is shingled
          vec3 cd = vec3(0.0, -0.75, -0.65); cd -= dot(cd, n) * n; cd = length(cd) > 1e-3 ? normalize(cd) : normalize(cross(n, vec3(1.0, 0.0, 0.0)));
          len = 0.6 + 0.4 * furHash(cell);
          t = uH / len;
          float al = dot(ft, cd), ac = length(ft - al * cd);
          float ra = mix(0.62, 0.36, t), rb = mix(0.5, 0.2, t * t);
          r = 1.0;
          if ((al * al) / (ra * ra) + (ac * ac) / (rb * rb) > mix(1.0, 1.8, smoothstep(0.35, 0.9, fw))) discard;
          shade = mix(0.72, 1.0, t) * (ac < 0.035 ? 0.82 : 1.0) * (0.94 + 0.06 * sin(al * 60.0 + ac * 25.0)) * (0.9 + 0.2 * furHash(cell + 5.0));
          ft = vec3(0.0);
        }
        if (uH > len || length(ft) > r || vFurK < 0.02) discard;
        // dark at the root, lighter guard hairs at the tip
        diffuseColor.rgb *= shade;
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.25 + 0.06, uFurTip * smoothstep(0.6, 1.0, t));`);
  };
  m.customProgramCacheKey = () => 'kaiju-fur-v2';
  return m;
}

/**
 * Layers of fur over `base` (a SkinnedMesh), on `geo` (the same skinned surface, coarser): children of it, bound to its
 * skeleton, so they move with every bone. Returns the layers; `setFurFade` hides the ones no strand reaches.
 */
export function addFur(base: THREE.SkinnedMesh, geo: THREE.BufferGeometry, fur: { length: number; density: number; tip: number; feather?: boolean }, shells: number): THREE.SkinnedMesh[] {
  const out: THREE.SkinnedMesh[] = [];
  for (let i = 1; i <= shells; i++) {
    const layer = new THREE.SkinnedMesh(geo, layerMaterial(i / shells, fur));
    layer.castShadow = false;
    layer.receiveShadow = true;
    layer.frustumCulled = false;

    layer.userData.h = i / shells;
    base.add(layer);
    layer.bind(base.skeleton, base.bindMatrix);
    out.push(layer);
  }
  return out;
}

/** The coat's length, 0..1 (the renderer's, by the kaiju's size on screen); a layer no strand can reach is not drawn. */
export function setFurFade(layers: THREE.SkinnedMesh[], fade: number): void {
  furUniforms.uFurFade.value = fade;
  // the longest strand is 0.95 of the coat (len ≤ 1 × 0.95 + …): a layer above the fade by that much is empty
  for (const l of layers) l.visible = (l.userData.h as number) <= fade * 1.15 + 1e-3;
}
