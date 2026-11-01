// Occlusion from a picture's depth (founder, 2026-11-01: "is there a phone-friendly monocular image depth estimation
// model that we could use to handle occlusion? Could be a fun optional setting"). Depth Anything V2 Small (Apache 2.0;
// the onnx-community 4-bit export, 19 MB, vendored under public/models: never a CDN at run time) through
// onnxruntime-web 1.30 (its WebGPU bundle; its 27 MB runtime is a build asset, fetched only when this is switched on):
// WebGPU where the phone gives an adapter (iOS 26 Safari, recent Android Chrome), else the CPU in a worker.
// It sees the frame at ~250×250 every so often (a frame takes ~1–1.6 s on this sandbox's CPU; WebGPU should be many
// times quicker — not measured on a phone) and says how near each pixel is — relatively: an inverse depth up to an
// unknown scale and shift.
//
// So each reading is put into metres against what the app already knows: the tracked people's points, whose distances
// the pose solve gives (`1/z = a·d + b`, least squares, its shift held near none with one person in view, both read
// once people stand at different distances; eased over readings). Then each pixel of a costume is hidden as far as the
// picture says something real stands in front of it — a curve of how far in front (founder: "no booleans in motion"):
// nothing within `near` metres (the wearer's own body, a costume's thickness), all of it `soft` further — through the
// costume's dithered transparency. The depth map eases from one reading to the next, and the whole effect eases in once
// calibrated and out when it is not.
import * as THREE from 'three';
import type { Track } from '../pose/tracker';
import type { Intrinsics } from '../pose/solve';
import { L } from '../pose/landmarks';

export const OCCLUSION_TUNE = {
  /** the model's input: about this many pixels (each side a multiple of 14, keeping the frame's shape) */
  pixels: 250 * 250,
  /** seconds between readings: on WebGPU, on the CPU */
  everyGpu: 0.15, everyCpu: 0.8,
  /** a costume pixel starts to hide when the picture is this many metres in front of it, and is gone this much further */
  near: 0.18, soft: 0.25,
  /** never by its own wearer: only what stands this far in front of the wearer's hips can hide their costume (a
   *  skeleton is inside its wearer: their own front, nearer than its spine, hid it whole) */
  self: 0.3,
  /** a reading's share of the shown depth map (the rest the last), and of the calibration */
  mapEase: 0.6, calEase: 0.5,
};

const POINTS = [L.nose, L.shL, L.shR, L.hipL, L.hipR, L.elL, L.elR, L.knL, L.knR, L.earL, L.earR];
const MEAN = [0.485, 0.456, 0.406], STD = [0.229, 0.224, 0.225];

type Ort = typeof import('onnxruntime-web/webgpu');

export class SceneDepth {
  ready = false;
  busy = false;
  /** the last reading's milliseconds, which engine ran it, the calibration */
  ms = 0;
  engine = '';
  cal: { a: number; b: number; n: number } | null = null;
  private ort: Ort | null = null;
  private session: import('onnxruntime-web').InferenceSession | null = null;
  private canvas = document.createElement('canvas');
  private w = 0;
  private h = 0;
  private map: Float32Array | null = null;
  private last = -1e9;
  readonly texture = new THREE.DataTexture(new Uint16Array(4), 2, 2, THREE.RedFormat, THREE.HalfFloatType);
  /** shared by every costume's materials (wearOcclusion) */
  readonly u = {
    uOccl: { value: this.texture as THREE.Texture }, uOcclOn: { value: 0 }, uOcclCrop: { value: new THREE.Vector4(0, 0, 1, 1) },
    uOcclMirror: { value: 0 }, uOcclRes: { value: new THREE.Vector2(1, 1) },
    uOcclNear: { value: OCCLUSION_TUNE.near }, uOcclSoft: { value: OCCLUSION_TUNE.soft },
  };

  constructor() {
    this.texture.magFilter = this.texture.minFilter = THREE.LinearFilter;
    this.texture.flipY = false;
  }

  /** load the engine and the model (~47 MB the first time); `say` reports the steps */
  async load(say?: (s: string) => void): Promise<void> {
    const base = import.meta.env.BASE_URL;
    say?.('Loading the depth engine…');
    // the bundled build carries its own loader; its one runtime file is the build's own asset (no wasmPaths: set, it
    // looked for a separate loader relative to the wrong folder)
    const ort = this.ort = await import('onnxruntime-web/webgpu');
    ort.env.wasm.numThreads = 1; // GitHub Pages cannot send the headers threads need
    // a GPU only if it gives an adapter (headless Chromium has navigator.gpu and none); decided before the first
    // start, because a failed start leaves the runtime refusing every later one
    const nav = navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } };
    const gpu = !!(await nav.gpu?.requestAdapter().catch(() => null));
    if (!gpu) ort.env.wasm.proxy = true; // the CPU's work in a worker: the frames go on
    say?.('Loading the depth model…');
    const url = `${base}models/depth-anything-v2-small-q4f16.onnx`;
    const ep = gpu ? 'webgpu' : 'wasm';
    try { this.session = await ort.InferenceSession.create(url, { executionProviders: [ep] }); this.engine = ep; } catch (e) { console.warn('depth: no', ep, e); }
    if (!this.session) throw new Error('the depth model would not load');
    this.ready = true;
  }

  /** time for a reading? */
  due(now: number): boolean {
    return this.ready && !this.busy && now - this.last > 1000 * (this.engine === 'webgpu' ? OCCLUSION_TUNE.everyGpu : OCCLUSION_TUNE.everyCpu);
  }

  /** read the frame's depth and put it in metres against the people in it; `floor`: the floor's plane (n·p = h, camera
   *  space), whose pixels never hide a costume */
  async read(src: HTMLVideoElement | HTMLCanvasElement, tracks: Track[], K: Intrinsics, now: number, floor?: { n: THREE.Vector3; h: number }): Promise<void> {
    if (!this.session || !this.ort || this.busy) return;
    this.busy = true;
    this.last = now;
    try {
      const vw = K.w, vh = K.h, scale = Math.sqrt(OCCLUSION_TUNE.pixels / (vw * vh));
      const w = Math.max(14, Math.round((vw * scale) / 14) * 14), h = Math.max(14, Math.round((vh * scale) / 14) * 14);
      this.canvas.width = w; this.canvas.height = h;
      const g = this.canvas.getContext('2d', { willReadFrequently: true })!;
      g.drawImage(src, 0, 0, w, h);
      const px = g.getImageData(0, 0, w, h).data, n = w * h, data = new Float32Array(3 * n);
      for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) data[k * n + i] = (px[i * 4 + k]! / 255 - MEAN[k]!) / STD[k]!;
      const t0 = performance.now();
      const out = await this.session.run({ [this.session.inputNames[0]!]: new this.ort.Tensor('float32', data, [1, 3, h, w]) });
      this.ms = performance.now() - t0;
      const t = out[this.session.outputNames[0]!]!;
      const d = t.data as Float32Array, oh = t.dims.at(-2)!, ow = t.dims.at(-1)!;
      this.calibrate(d, ow, oh, tracks);
      if (this.cal) this.toMetres(d, ow, oh, K, floor);
    } catch (e) { console.warn('depth reading failed', e); } finally { this.busy = false; }
  }

  /** fit 1/z = a·d + b on the people's points (their depth from the pose solve) */
  private calibrate(d: Float32Array, w: number, h: number, tracks: Track[]): void {
    const at = (x: number, y: number) => {
      const fx = Math.min(w - 1, Math.max(0, x * w - 0.5)), fy = Math.min(h - 1, Math.max(0, y * h - 0.5));
      const x0 = Math.floor(fx), y0 = Math.floor(fy), x1 = Math.min(w - 1, x0 + 1), y1 = Math.min(h - 1, y0 + 1), u = fx - x0, v = fy - y0;
      return (d[y0 * w + x0]! * (1 - u) + d[y0 * w + x1]! * u) * (1 - v) + (d[y1 * w + x0]! * (1 - u) + d[y1 * w + x1]! * u) * v;
    };
    let sw = 0, sx = 0, sy = 0, sxx = 0, sxy = 0, syy = 0, n = 0;
    for (const t of tracks) {
      if (t.lost || t.presence < 0.5) continue;
      for (const i of POINTS) {
        const im = t.image[i]!, wp = t.world[i]!;
        if (im.v < 0.7 || im.x < 0 || im.x > 1 || im.y < 0 || im.y > 1) continue;
        const z = -(t.T.z + wp.z);
        if (z < 0.3) continue;
        const x = at(im.x, im.y), y = 1 / z, k = im.v;
        sw += k; sx += k * x; sy += k * y; sxx += k * x * x; sxy += k * x * y; syy += k * y * y; n++;
      }
    }
    if (n < 4 || sw <= 0) return;
    const mx = sx / sw, my = sy / sw, vx = sxx / sw - mx * mx, cxy = sxy / sw - mx * my, vy = syy / sw - my * my;
    // the shift is believed by how far apart the people truly stand (their metric depths, not the model's numbers: one
    // body's own disparity varies more than its depth does, and fitted a shift that squashed the street into 5–10 m) —
    // a curve: one person, a scale through no shift; people a fifth of their distance apart, half of the fit
    const spread = vy / (vy + (0.2 * my) ** 2 + 1e-12);
    const aFit = vx > 1e-9 ? cxy / vx : 0, aZero = mx > 1e-9 ? my / mx : 0;
    let a = aZero + (aFit - aZero) * spread, b = (my - a * mx) * spread;
    if (!(a > 0)) { a = aZero; b = 0; }
    const e = this.cal ? OCCLUSION_TUNE.calEase : 1;
    this.cal = this.cal ? { a: this.cal.a + (a - this.cal.a) * e, b: this.cal.b + (b - this.cal.b) * e, n } : { a, b, n };
  }

  /** the reading in metres, eased into the shown map */
  private toMetres(d: Float32Array, w: number, h: number, K: Intrinsics, floor?: { n: THREE.Vector3; h: number }): void {
    const { a, b } = this.cal!, n = w * h;
    if (!this.map || this.w !== w || this.h !== h) { this.map = new Float32Array(n).fill(-1); this.w = w; this.h = h; }
    const k = OCCLUSION_TUNE.mapEase, half = new Uint16Array(n);
    for (let i = 0; i < n; i++) {
      const inv = a * d[i]! + b;
      let z = inv > 1 / 60 ? 1 / inv : 60;
      // the floor never hides a costume (a costume's feet stand on it; read from the body alone, the ground round them
      // came out a little nearer and cut the legs off): a pixel as far as the floor's plane along its ray counts as
      // floor, by a curve of how near the two agree, and is pushed to the far distance
      if (floor) {
        const x = ((i % w) + 0.5) / w, y = (Math.floor(i / w) + 0.5) / h;
        const rx = (x * K.w - K.cx) / K.f, ry = -(y * K.h - K.cy) / K.f;
        const nd = floor.n.x * rx + floor.n.y * ry - floor.n.z;
        const t = Math.abs(nd) > 1e-6 ? floor.h / nd : -1;
        if (t > 0.2 && t < 60) {
          const off = Math.abs(z - t) / t, u = Math.min(1, Math.max(0, (off - 0.08) / 0.17)), floorish = 1 - u * u * (3 - 2 * u);
          z += (60 - z) * floorish;
        }
      }
      const m = this.map[i]! < 0 ? z : this.map[i]! + (z - this.map[i]!) * k;
      this.map[i] = m;
      half[i] = THREE.DataUtils.toHalfFloat(m);
    }
    const img = this.texture.image as { data: Uint16Array; width: number; height: number };
    if (img.width !== w || img.height !== h) { this.texture.dispose(); img.width = w; img.height = h; }
    img.data = half;
    this.texture.needsUpdate = true;
  }

  /** each frame: where the screen shows the video (the background's crop and mirror), the screen's size, and how much
   *  of the effect is on (eased: on once calibrated and wanted) */
  frame(on: boolean, crop: THREE.Vector4, mirror: number, res: THREE.Vector2, dt: number): void {
    const want = on && this.ready && !!this.cal && !!this.map ? 1 : 0;
    this.u.uOcclOn.value += (want - this.u.uOcclOn.value) * (1 - Math.exp(-dt / 0.4));
    this.u.uOcclCrop.value.copy(crop);
    this.u.uOcclMirror.value = mirror;
    this.u.uOcclRes.value.copy(res);
  }
}

const DECL = /* glsl */ `
uniform sampler2D uOccl; uniform float uOcclOn; uniform vec4 uOcclCrop; uniform float uOcclMirror; uniform vec2 uOcclRes;
uniform float uOcclNear; uniform float uOcclSoft; uniform float uOcclSelf;
// how much of this costume pixel the picture leaves showing: the scene's depth where it lands (the background's own
// crop and mirror), against the pixel's own; a curve of how far the scene stands in front
float occlVisible() {
  if (uOcclOn <= 0.0) return 1.0;
  vec2 s = gl_FragCoord.xy / uOcclRes;
  s.x = mix(s.x, 1.0 - s.x, uOcclMirror);
  vec2 v = uOcclCrop.xy + s * uOcclCrop.zw;
  float scene = texture2D(uOccl, vec2(v.x, 1.0 - v.y)).r;
  // measured from the nearer of this pixel and the wearer's front: the wearer's own body, its arms, the floor at its
  // feet are never in front of it
  float hidden = smoothstep(uOcclNear, uOcclNear + uOcclSoft, min(vViewPosition.z, uOcclSelf) - scene);
  return 1.0 - hidden * uOcclOn;
}`;

/**
 * Give a worn costume's materials the occlusion: each multiplies its alpha by what the picture leaves showing (the
 * worn copies fade by dithered transparency, so a hidden pixel dithers away; a glow by its blending). Chains after the
 * materials' own hooks, keyed by them. Returns the costume's own uniform for its wearer's front.
 */
export function wearOcclusion(root: THREE.Object3D, shared: SceneDepth['u']): { value: number } {
  // the wearer's front (metres from the camera), this costume's own: set each frame (stage.ts pose)
  const self = { value: 1e3 };
  const u = { ...shared, uOcclSelf: self };
  const done = new Set<THREE.Material>();
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    for (const mat of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      if (done.has(mat) || (mat as THREE.ShaderMaterial).isShaderMaterial) continue;
      done.add(mat);
      const own = mat.onBeforeCompile, key = mat.customProgramCacheKey.call(mat);
      mat.onBeforeCompile = function (this: THREE.Material, shader, renderer) {
        own.call(this, shader, renderer);
        // the standard materials carry vViewPosition; a material without it is left alone
        if (!shader.fragmentShader.includes('vViewPosition')) return;
        Object.assign(shader.uniforms, u);
        shader.fragmentShader = shader.fragmentShader
          .replace('#include <common>', `#include <common>\n${DECL}`)
          .replace('#include <alphamap_fragment>', '#include <alphamap_fragment>\n diffuseColor.a *= occlVisible();');
      };
      mat.customProgramCacheKey = () => `${key}|occl`;
      mat.needsUpdate = true;
    }
  });
  return self;
}
