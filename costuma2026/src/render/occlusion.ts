// Costumes hidden behind what stands in front of them, in two layers (founder, 2026-11-01: "is there a phone-friendly
// monocular image depth estimation model that we could use to handle occlusion?"; then, after people at tables and in
// chairs: "our move would be some form of segmentation").
//
// People (`people`, every mode but off; no extra model): the pose model cuts each person out of the frame (the masks
// party mode uses) and the pose solve says how far each stands. Up to four tracked people, nearest first, each keep a
// channel of one RGBA texture; a costume pixel is hidden where another person's cut-out covers it and that person's
// front stands in front of it — a curve of how far (founder: "no booleans in motion"). The wearer's own cut-out never
// hides their costume: that is the exact self-exclusion the depth model could only guess at with a margin, which
// stopped anything held against the body from hiding anything (teddy bear 0.00 %, cake 0.33 % of the frame changed).
//
// Things (`all`): Depth Anything V2 Small (Apache 2.0; the onnx-community 4-bit export, 19 MB, vendored under
// public/models: never a CDN at run time) through onnxruntime-web 1.30 (its WebGPU bundle; its 27 MB runtime a build
// asset, fetched only when asked for): WebGPU where the phone gives an adapter, else the CPU in a worker. It sees the
// frame at ~250×250 every so often (~1–1.6 s a frame on this sandbox's CPU; WebGPU should be many times quicker — not
// measured on a phone) and says how near each pixel is — relatively, an inverse depth up to an unknown scale and shift,
// put into metres against the tracked people's points (`1/z = a·d + b`, least squares, the shift believed by how far
// apart the people stand). It decides only where no person is (their cut-outs, widened by a block or so: its edges
// bleed past a body), so it speaks for tables, chairs and props; the floor's pixels never hide anything.
import * as THREE from 'three';
import type { Track } from '../pose/tracker';
import type { Intrinsics } from '../pose/solve';
import { L } from '../pose/landmarks';

export type OcclusionMode = 'off' | 'people' | 'all';

export const OCCLUSION_TUNE = {
  /** the model's input: about this many pixels (each side a multiple of 14, keeping the frame's shape) */
  pixels: 250 * 250,
  /** seconds between readings: on WebGPU, on the CPU */
  everyGpu: 0.15, everyCpu: 0.8,
  /** a person hides a costume pixel this many metres behind their front, all of it `soft` further */
  nearPeople: 0.1,
  /** a person's front: this far before the middle of their seen nose, shoulders and hips (joints sit inside a body) */
  bodyFront: 0.1,
  /** a thing (the depth model) hides a costume pixel this many metres behind it, all of it `soft` further */
  near: 0.1, soft: 0.25,
  /** a wearer with no cut-out (a fifth person, or before the first) falls back on its front: only what stands this far
   *  in front of its hips hides its costume (a skeleton is inside its wearer: their own front hid it whole) */
  self: 0.3,
  /** the cut-outs: eased over this many seconds (the edge's shimmer goes, a moving arm keeps up); "someone is near" is
   *  their maximum over blocks this many mask pixels wide, read smoothly (where the depth model is not believed) */
  maskTau: 0.04, wideBlock: 8,
  /** a reading's share of the shown depth map (the rest the last), and of the calibration */
  mapEase: 0.6, calEase: 0.5,
};

/** a person's front, metres from the camera: the middle of their seen core points, less a body's half depth */
function front(k: Track): number {
  const zs: number[] = [];
  for (const i of CORE) if (k.image[i]!.v >= 0.5) zs.push(-(k.T.z + k.world[i]!.z));
  zs.sort((a, b) => a - b);
  return (zs.length ? zs[zs.length >> 1]! : -k.T.z) - OCCLUSION_TUNE.bodyFront;
}

const CORE = [L.nose, L.shL, L.shR, L.hipL, L.hipR];
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
  /** the people's cut-outs, a channel each, at the pose model's mask size; and their maximum over blocks */
  private peopleTex = new THREE.DataTexture(new Uint8Array(4), 1, 1, THREE.RGBAFormat);
  private wideTex = new THREE.DataTexture(new Uint8Array(1), 1, 1, THREE.RedFormat);
  private slots: (number | null)[] = [null, null, null, null];
  private slotMask: (Float32Array | null)[] = [null, null, null, null];
  /** what was packed last: each slot's detection and weight; seconds since */
  private packedDet: unknown[] = [null, null, null, null];
  private packedW = [0, 0, 0, 0];
  private since = 0;
  private mw = 0;
  private mh = 0;
  private ww = 0;
  /** shared by every costume's materials (wearOcclusion) */
  readonly u = {
    uOccl: { value: this.texture as THREE.Texture }, uOcclPeople: { value: this.peopleTex as THREE.Texture }, uOcclWide: { value: this.wideTex as THREE.Texture },
    uOcclOn: { value: 0 }, uOcclMasksOn: { value: 0 }, uOcclDepthOn: { value: 0 },
    uOcclCrop: { value: new THREE.Vector4(0, 0, 1, 1) }, uOcclMirror: { value: 0 }, uOcclRes: { value: new THREE.Vector2(1, 1) },
    uOcclNear: { value: OCCLUSION_TUNE.near }, uOcclNearPeople: { value: OCCLUSION_TUNE.nearPeople }, uOcclSoft: { value: OCCLUSION_TUNE.soft },
    uOcclPeopleZ: { value: new THREE.Vector4(1e3, 1e3, 1e3, 1e3) },
  };

  constructor() {
    for (const t of [this.texture, this.peopleTex, this.wideTex]) { t.magFilter = t.minFilter = THREE.LinearFilter; t.flipY = false; t.unpackAlignment = 1; t.needsUpdate = true; }
  }

  /** how many people have a cut-out this frame */
  get people(): number { return this.slotMask.filter(Boolean).length; }

  /** the channel of a tracked person's cut-out, or -1 */
  slotOf(trackId: number): number {
    const c = this.slots.indexOf(trackId);
    return c >= 0 && this.slotMask[c] ? c : -1;
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

  /**
   * Each frame, before the costumes are posed: the people's cut-outs and fronts, how much of each layer is on (eased:
   * people once a cut-out has come, things once the depth model is calibrated), where the screen shows the video (the
   * background's crop and mirror) and the screen's size.
   */
  frame(mode: OcclusionMode, tracks: Track[], crop: THREE.Vector4, mirror: number, res: THREE.Vector2, dt: number): void {
    const u = this.u, k = 1 - Math.exp(-dt / 0.4);
    const masks = this.cutOuts(mode === 'off' ? [] : tracks, dt) ? 1 : 0;
    const depth = mode === 'all' && this.ready && !!this.cal && !!this.map ? 1 : 0;
    u.uOcclMasksOn.value += (masks - u.uOcclMasksOn.value) * k;
    u.uOcclDepthOn.value += (depth - u.uOcclDepthOn.value) * k;
    // a thousandth is nothing to see: the shader's early way out takes over
    if (u.uOcclMasksOn.value < 1e-3) u.uOcclMasksOn.value = 0;
    if (u.uOcclDepthOn.value < 1e-3) u.uOcclDepthOn.value = 0;
    u.uOcclOn.value = Math.max(u.uOcclMasksOn.value, u.uOcclDepthOn.value);
    u.uOcclCrop.value.copy(crop);
    u.uOcclMirror.value = mirror;
    u.uOcclRes.value.copy(res);
  }

  /** a wearer's own uniforms this frame (after `frame`): its cut-out's channel, which never hides it, and its front */
  place(o: OcclWearer, trackId: number, hipsZ: number, dt: number): void {
    const c = this.slotOf(trackId);
    o.ch.value.set(c === 0 ? 1 : 0, c === 1 ? 1 : 0, c === 2 ? 1 : 0, c === 3 ? 1 : 0);
    const want = c >= 0 ? this.u.uOcclMasksOn.value : 0;
    o.masked.value += (want - o.masked.value) * (1 - Math.exp(-dt / 0.2));
    o.self.value = -hipsZ - OCCLUSION_TUNE.self;
  }

  /**
   * The nearest four people's cut-outs into the texture's channels (each keeps its channel while it stays), weighted by
   * their presence, and their fronts; false when nobody has one. Repacked only when a cut-out is new (the pose model
   * runs at about half the display's rate) or a weight has moved: the packing is the main thread's (measured in Node on
   * this sandbox at 270×480: 1.7–3.2 ms a pack for one to four people, against 4.0–7.6 for the first, per-byte version;
   * not measured on a phone).
   */
  private cutOuts(tracks: Track[], dt: number): boolean {
    this.since += dt;
    const live = tracks.filter((k) => k.presence > 0).sort((a, b) => b.T.z - a.T.z).slice(0, 4);
    const ids = new Set(live.map((k) => k.id));
    for (let c = 0; c < 4; c++) if (this.slots[c] !== null && !ids.has(this.slots[c]!)) { this.slots[c] = null; this.slotMask[c] = null; }
    const zs = [1e3, 1e3, 1e3, 1e3], weight = [0, 0, 0, 0], ease = 1 - Math.exp(-this.since / OCCLUSION_TUNE.maskTau);
    let fresh = false;
    for (const k of live) {
      let c = this.slots.indexOf(k.id);
      if (c < 0) { c = this.slots.indexOf(null); if (c < 0) continue; this.slots[c] = k.id; }
      const m = k.det?.mask;
      if (m && k.det !== this.packedDet[c]) {
        if (m.w !== this.mw || m.h !== this.mh) this.resizeMasks(m.w, m.h);
        const buf = this.slotMask[c], d = m.data;
        if (!buf) this.slotMask[c] = Float32Array.from(d);
        else for (let i = 0; i < buf.length; i++) buf[i] = buf[i]! + (d[i]! - buf[i]!) * ease;
        this.packedDet[c] = k.det;
        fresh = true;
      }
      if (!this.slotMask[c]) continue;
      zs[c] = front(k);
      weight[c] = k.presence;
    }
    this.u.uOcclPeopleZ.value.set(zs[0]!, zs[1]!, zs[2]!, zs[3]!);
    if (!this.mw || !weight.some((w) => w > 0)) return false;
    if (!fresh && weight.every((w, c) => Math.abs(w - this.packedW[c]!) < 0.02)) return true;
    this.since = 0;
    this.packedW = weight;
    // a texel's four channels as one little-endian word; "someone is near" the blocks' maximum over everyone
    const B = OCCLUSION_TUNE.wideBlock, ww = this.ww, mw = this.mw, mh = this.mh;
    const [s0, s1, s2, s3] = this.slotMask, [k0, k1, k2, k3] = weight.map((w) => w * 255) as [number, number, number, number];
    const m32 = new Uint32Array((this.peopleTex.image.data as Uint8Array).buffer), wd = this.wideTex.image.data as Uint8Array;
    wd.fill(0);
    for (let y = 0, i = 0; y < mh; y++) {
      const row = Math.floor(y / B) * ww;
      for (let x = 0; x < mw; x++, i++) {
        const a = s0 ? (s0[i]! * k0) | 0 : 0, b = s1 ? (s1[i]! * k1) | 0 : 0, c = s2 ? (s2[i]! * k2) | 0 : 0, d = s3 ? (s3[i]! * k3) | 0 : 0;
        m32[i] = (a | (b << 8) | (c << 16) | (d << 24)) >>> 0;
        // by hand: Math.max of four ran 4.7 ms a pack for four people against 3.2
        let mx = a > b ? a : b;
        if (c > mx) mx = c;
        if (d > mx) mx = d;
        const j = row + Math.floor(x / B);
        if (mx > wd[j]!) wd[j] = mx;
      }
    }
    this.peopleTex.needsUpdate = this.wideTex.needsUpdate = true;
    return true;
  }

  private resizeMasks(w: number, h: number): void {
    const B = OCCLUSION_TUNE.wideBlock;
    this.mw = w; this.mh = h; this.ww = Math.ceil(w / B);
    this.slotMask = [null, null, null, null];
    this.packedDet = [null, null, null, null];
    const set = (t: THREE.DataTexture, tw: number, th: number, ch: number) => { t.dispose(); t.image = { data: new Uint8Array(tw * th * ch), width: tw, height: th }; t.needsUpdate = true; };
    set(this.peopleTex, w, h, 4);
    set(this.wideTex, this.ww, Math.ceil(h / B), 1);
  }
}

const DECL = /* glsl */ `
uniform sampler2D uOccl; uniform sampler2D uOcclPeople; uniform sampler2D uOcclWide;
uniform float uOcclOn; uniform float uOcclMasksOn; uniform float uOcclDepthOn;
uniform vec4 uOcclCrop; uniform float uOcclMirror; uniform vec2 uOcclRes;
uniform float uOcclNear; uniform float uOcclNearPeople; uniform float uOcclSoft; uniform vec4 uOcclPeopleZ;
uniform float uOcclSelf; uniform vec4 uOcclSelfCh; uniform float uOcclMasked;
// how much of this costume pixel is left showing: where it lands in the video (the background's own crop and mirror),
// hidden by another person's cut-out whose front stands before it, and, where nobody is, by what the depth model says
// stands before it; each a curve of how far in front
float occlVisible() {
  if (uOcclOn <= 0.0) return 1.0;
  vec2 s = gl_FragCoord.xy / uOcclRes;
  s.x = mix(s.x, 1.0 - s.x, uOcclMirror);
  vec2 v = uOcclCrop.xy + s * uOcclCrop.zw;
  vec2 iv = vec2(v.x, 1.0 - v.y);
  float z = vViewPosition.z;
  // people: every cut-out but the wearer's own
  vec4 m = texture2D(uOcclPeople, iv) * (1.0 - uOcclSelfCh);
  vec4 hp = m * smoothstep(vec4(uOcclNearPeople), vec4(uOcclNearPeople + uOcclSoft), z - uOcclPeopleZ);
  float hidden = max(max(hp.x, hp.y), max(hp.z, hp.w)) * uOcclMasksOn;
  if (uOcclDepthOn > 0.0) {
    // things: only where no one is (the cut-outs widened: the model's edges bleed past a body); a wearer with no
    // cut-out of its own measures from the nearer of the pixel and its front
    float someone = texture2D(uOcclWide, iv).r * uOcclMasksOn;
    float scene = texture2D(uOccl, iv).r;
    float zRef = mix(min(z, uOcclSelf), z, uOcclMasked);
    hidden = max(hidden, uOcclDepthOn * (1.0 - someone) * smoothstep(uOcclNear, uOcclNear + uOcclSoft, zRef - scene));
  }
  return 1.0 - hidden;
}`;

/** a worn costume's own occlusion uniforms: its wearer's front (metres), its cut-out's channel, how far it is masked */
export interface OcclWearer { self: { value: number }; ch: { value: THREE.Vector4 }; masked: { value: number } }

/**
 * Give a worn costume's materials the occlusion: each multiplies its alpha by what is left showing (the worn copies
 * fade by dithered transparency, so a hidden pixel dithers away; a glow by its blending). Chains after the materials'
 * own hooks, keyed by them. Returns the costume's own uniforms, set each frame (SceneDepth.place; a pyramid's clone
 * keeps the defaults: no cut-out of its own, so the people in front hide it).
 */
export function wearOcclusion(root: THREE.Object3D, shared: SceneDepth['u']): OcclWearer {
  const own: OcclWearer = { self: { value: 1e3 }, ch: { value: new THREE.Vector4() }, masked: { value: 0 } };
  const u = { ...shared, uOcclSelf: own.self, uOcclSelfCh: own.ch, uOcclMasked: own.masked };
  const done = new Set<THREE.Material>();
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    for (const mat of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      if (done.has(mat) || (mat as THREE.ShaderMaterial).isShaderMaterial) continue;
      done.add(mat);
      const hook = mat.onBeforeCompile, key = mat.customProgramCacheKey.call(mat);
      mat.onBeforeCompile = function (this: THREE.Material, shader, renderer) {
        hook.call(this, shader, renderer);
        // the standard materials carry vViewPosition; a material without it is left alone
        if (!shader.fragmentShader.includes('vViewPosition')) return;
        Object.assign(shader.uniforms, u);
        shader.fragmentShader = shader.fragmentShader
          .replace('#include <common>', `#include <common>\n${DECL}`)
          .replace('#include <alphamap_fragment>', '#include <alphamap_fragment>\n diffuseColor.a *= occlVisible();');
      };
      mat.customProgramCacheKey = () => `${key}|occl2`;
      mat.needsUpdate = true;
    }
  });
  return own;
}
