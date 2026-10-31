// Kaiju skin: a canvas-generated scale texture (jittered-cell Voronoi with
// dark seams and a per-cell tone) sampled triplanar in *bind-pose* object
// space so it never swims under the skinning, over the vertex colour that
// says skin / belly / plate / claw. Roughness from the same map; belly
// plates get horizontal ridges; plates are bone-matte.
import * as THREE from 'three';
import { furUniforms } from './fur';

function scaleTexture(size = 512): { map: THREE.CanvasTexture; rough: THREE.CanvasTexture } {
  const cv = document.createElement('canvas'); cv.width = cv.height = size;
  const g = cv.getContext('2d')!;
  const rv = document.createElement('canvas'); rv.width = rv.height = size;
  const rg = rv.getContext('2d')!;
  const img = g.createImageData(size, size), rimg = rg.createImageData(size, size);
  const N = 22; // cells per tile edge
  const pts: [number, number, number][] = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) pts.push([(i + 0.2 + rnd() * 0.6) / N, (j + 0.2 + rnd() * 0.6) / N, 0.7 + rnd() * 0.3]);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size;
    const ci = Math.floor(u * N), cj = Math.floor(v * N);
    let d0 = 9, d1 = 9, tone = 1;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      const ii = (ci + di + N) % N, jj = (cj + dj + N) % N;
      const p = pts[jj * N + ii]!;
      let dx = u - p[0], dy = v - p[1];
      dx -= Math.round(dx); dy -= Math.round(dy); // wrap
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < d0) { d1 = d0; d0 = d; tone = p[2]; } else if (d < d1) d1 = d;
    }
    const edge = d1 - d0; // small near a seam
    const seam = Math.min(1, edge / 0.02);
    const dome = 1 - Math.min(1, d0 / (0.55 / N)); // each scale is a little dome: bright centre
    const shade = (0.55 + 0.45 * seam) * tone * (0.85 + 0.3 * dome);
    const k = (y * size + x) * 4;
    img.data[k] = 255 * shade; img.data[k + 1] = 255 * shade; img.data[k + 2] = 255 * shade; img.data[k + 3] = 255;
    const rough = 0.55 + 0.4 * (1 - seam) - 0.15 * dome;
    rimg.data[k] = 255 * rough; rimg.data[k + 1] = 255 * rough; rimg.data[k + 2] = 255 * rough; rimg.data[k + 3] = 255;
  }
  g.putImageData(img, 0, 0); rg.putImageData(rimg, 0, 0);
  const map = new THREE.CanvasTexture(cv); map.wrapS = map.wrapT = THREE.RepeatWrapping; map.colorSpace = THREE.NoColorSpace;
  const rough = new THREE.CanvasTexture(rv); rough.wrapS = rough.wrapT = THREE.RepeatWrapping;
  return { map, rough };
}

let cached: { map: THREE.CanvasTexture; rough: THREE.CanvasTexture } | null = null;

/**
 * `furry`: the undercoat under fur (fur.ts) — no scales, the vertex colour darkened as the coat over it grows long.
 * `surface`: no scales — a mech's painted plate (mech.ts), a soft coat (a bird's feathers, a moth's down), a suit.
 */
export function createKaijuMaterial(furry = false, surface?: 'armour' | 'soft' | 'suit'): THREE.MeshStandardMaterial {
  if (furry) return undercoatMaterial();
  // painted metal (a mech); a soft coat, feathers or down, matte; a hero's suit or armour, a sheen without the metal
  if (surface === 'armour') return new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.42, metalness: 0.45 });
  if (surface === 'soft') return new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0 });
  if (surface === 'suit') return new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.34, metalness: 0.18 });
  if (!cached && typeof document !== 'undefined') cached = scaleTexture();
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7, metalness: 0.02 });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uScales = { value: cached?.map ?? null };
    shader.uniforms.uRough = { value: cached?.rough ?? null };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\n varying vec3 vBind; varying vec3 vBindN;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n vBind = position; vBindN = normal;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform sampler2D uScales; uniform sampler2D uRough;
        varying vec3 vBind; varying vec3 vBindN;
        vec4 triplanar(sampler2D t, vec3 p, vec3 n, float scale) {
          vec3 w = abs(n); w = pow(w, vec3(4.0)); w /= (w.x + w.y + w.z + 1e-4);
          return texture2D(t, p.yz * scale) * w.x + texture2D(t, p.xz * scale) * w.y + texture2D(t, p.xy * scale) * w.z;
        }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec3 bn = normalize(vBindN);
        // scales are larger on the back and tail, finer on the face and hands
        float fine = smoothstep(14.0, 17.5, vBind.y) * step(3.0, vBind.z);
        float sc = mix(0.14, 0.32, fine);
        float scales = triplanar(uScales, vBind, bn, sc).r;
        // plates and claws are matte bone: keep their vertex colour, just darken the seams a little
        float isBone = step(0.78, diffuseColor.g) * step(0.7, diffuseColor.r);
        diffuseColor.rgb *= mix(0.55 + 0.6 * scales, 0.85 + 0.15 * scales, isBone);
        // belly plates: horizontal ridges
        float bellyish = step(0.6, diffuseColor.r) * step(diffuseColor.b, 0.7) * (1.0 - isBone);
        float ridge = 0.85 + 0.15 * smoothstep(0.2, 0.5, abs(fract(vBind.y * 1.6) - 0.5));
        diffuseColor.rgb *= mix(1.0, ridge, bellyish);
        float roughTex = triplanar(uRough, vBind, bn, sc).r;`)
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = mix(roughTex, 0.9, isBone);');
  };
  m.customProgramCacheKey = () => 'kaiju-v1';
  return m;
}

function undercoatMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 });
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, furUniforms);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\n uniform float uFurFade;')
      // deep in the coat the skin is in the strands' shade; with no coat (far away) it is the fur's own colour
      .replace('#include <color_fragment>', '#include <color_fragment>\n diffuseColor.rgb *= mix(1.0, 0.6, uFurFade);');
  };
  m.customProgramCacheKey = () => 'kaiju-undercoat-v1';
  return m;
}
