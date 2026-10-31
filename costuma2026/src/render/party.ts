// Party mode: the people cut out of the frame and the frame rebuilt round them. MediaPipe's pose model gives each person
// their own mask (detector.ts), so "cut out one, or several" is a count: the N nearest tracked people are subjects, each
// on a channel of one RGBA mask texture, keeping that channel while they stay (their colours do not jump); anyone else
// belongs to the background. Everything runs on the phone: the masks come off the GPU once a frame, and the two things a
// shader cannot do in one pass — how far each pixel is from the nearest subject (for the contour rings and the neon
// glow) and where they have been (the echo trails) — are done on the CPU at a low resolution (a chamfer distance and a
// decaying max), then drawn smooth by the texture filter. One fragment shader holds every preset.
import * as THREE from 'three';
import type { Track } from '../pose/tracker';

export interface Preset {
  id: string;
  name: string;
  code: number;
  /** the picker card's face (a CSS background) */
  swatch: string;
}

export const PRESETS: Preset[] = [
  { id: 'pop', name: 'Pop Art', code: 1, swatch: 'radial-gradient(circle at 30% 30%, #ffde00 0 22%, transparent 23%), radial-gradient(circle at 70% 70%, #ff2d8a 0 22%, transparent 23%), #19c3ff' },
  { id: 'warhol', name: 'Warhol', code: 2, swatch: 'conic-gradient(#ff5fa2 0 25%, #ffd400 0 50%, #2ad4c4 0 75%, #7b5cff 0)' },
  { id: 'rings', name: 'Rings', code: 5, swatch: 'repeating-radial-gradient(circle, #ff3d7f 0 5px, #ffb23d 5px 10px, #3dd6ff 10px 15px, #8c5cff 15px 20px)' },
  { id: 'echo', name: 'Echoes', code: 6, swatch: 'linear-gradient(90deg, #1b1033, #ff2db4 40%, #2de2ff 70%, #1b1033)' },
  { id: 'neon', name: 'Neon', code: 4, swatch: 'radial-gradient(circle, transparent 0 40%, #39ff9c 42% 50%, transparent 54%), #06030f' },
  { id: 'disco', name: 'Disco', code: 7, swatch: 'radial-gradient(circle at 30% 30%, #ff4fd8, transparent 45%), radial-gradient(circle at 70% 60%, #4fd1ff, transparent 45%), radial-gradient(circle at 45% 80%, #ffe14f, transparent 40%), #120820' },
  { id: 'solar', name: 'Solarize', code: 3, swatch: 'linear-gradient(135deg, #1a0b3d, #ff7a00 45%, #00e5ff 55%, #2a0b3d)' },
  { id: 'spot', name: 'Spotlight', code: 0, swatch: 'radial-gradient(circle at 50% 40%, #fff6d8, #6a5a40 45%, #120f0a 75%)' },
];

/** four flat screen-print colours per subject, dark to light (Warhol's Marilyns: a deep shadow, a skin, a lip, a light) */
const PALETTES: number[][] = [
  [0x2a1340, 0xff3d8b, 0xffb000, 0xfff3c4],
  [0x0b2a4a, 0x00b3c7, 0xff6f3c, 0xfffbe0],
  [0x2d0b0b, 0x8e3cff, 0x3cff9e, 0xf9f871],
  [0x10261a, 0xff2e2e, 0x2ec5ff, 0xffe1f0],
];

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex, uMask, uFx;
  uniform float uTime, uAspect;
  uniform int uPreset;
  uniform vec4 uOn;
  uniform vec3 uPal[16];

  vec3 hsv(float h, float s, float v) { vec3 k = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0); return v * mix(vec3(1.0), k, s); }
  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec3 pal(int who, int k) { return uPal[who * 4 + k]; }
  // four tones by brightness: the screen print
  vec3 print(vec3 c, int who) {
    float l = luma(c);
    return l < 0.22 ? pal(who, 0) : l < 0.45 ? pal(who, 1) : l < 0.7 ? pal(who, 2) : pal(who, 3);
  }
  vec3 solar(vec3 c, float t) {
    vec3 s = mix(c, 1.0 - c, step(0.5, c));
    float h = fract(t * 0.07);
    return mix(s * 2.0, hsv(h + luma(c) * 0.8, 0.85, 1.0) * (0.35 + 1.2 * luma(s)), 0.55);
  }
  // disco: coloured spots sweeping the room, a mirror ball's flecks
  vec3 discoLight(vec2 p, float t) {
    vec3 acc = vec3(0.0);
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      vec2 c = vec2(0.5 + 0.42 * sin(t * (0.45 + fi * 0.13) + fi * 1.7), 0.45 + 0.35 * cos(t * (0.37 + fi * 0.11) + fi * 2.3));
      vec2 d = (p - c) * vec2(uAspect, 1.0);
      acc += hsv(fi / 5.0 + t * 0.03, 0.9, 1.0) * exp(-dot(d, d) * 45.0) * 0.75;
    }
    return acc;
  }

  void main() {
    vec2 uv = vUv;
    float cellIx = 0.0;
    if (uPreset == 2) { vec2 cell = floor(uv * 2.0); cellIx = cell.x + (1.0 - cell.y) * 2.0; uv = fract(uv * 2.0); }
    vec2 muv = vec2(uv.x, 1.0 - uv.y);
    vec3 vid = texture2D(uTex, uv).rgb;
    vec4 m = smoothstep(0.3, 0.7, texture2D(uMask, muv)) * uOn;
    float subj = max(max(m.r, m.g), max(m.b, m.a));
    int who = 0; float best = m.r;
    if (m.g > best) { best = m.g; who = 1; }
    if (m.b > best) { best = m.b; who = 2; }
    if (m.a > best) { best = m.a; who = 3; }
    vec4 fx = texture2D(uFx, muv);
    float dist = fx.r, trail = fx.g, stamp = fx.b;
    float t = uTime;
    vec3 bg = vid, fg = vid;
    vec2 sp = vec2(uv.x * uAspect, uv.y);

    if (uPreset == 0) {
      // a stage: the room dimmed and greyed, light pooled round the subjects
      bg = vec3(luma(vid)) * vec3(0.75, 0.78, 0.95) * (0.12 + 0.75 * exp(-dist * 7.0));
      fg = vid * 1.08;
    } else if (uPreset == 1) {
      // pop art: subjects screen-printed in their own four colours; the room a flat colour with Ben-Day dots
      fg = print(vid, who);
      vec3 base = hsv(fract(0.55 + floor(t * 0.25) * 0.23), 0.75, 1.0);
      vec2 g = fract(sp * 70.0) - 0.5;
      float dots = step(length(g), 0.18 + 0.22 * luma(vid));
      bg = mix(base, base * 0.55 + vec3(0.05), dots);
    } else if (uPreset == 2) {
      // four panels, each printed in its own colours: the subjects and their room both
      int ci = int(cellIx);
      fg = print(vid, ci);
      bg = mix(pal((ci + 2) - 4 * ((ci + 2) / 4), 2), pal(ci, 3), 0.15);
    } else if (uPreset == 3) {
      fg = solar(vid, t);
      bg = solar(vid, t + 3.0) * 0.7;
    } else if (uPreset == 4) {
      // neon: a black room, each subject a dark shape with a glowing tube round it
      vec3 tube = hsv(fract(t * 0.08 + muv.y * 0.3), 0.9, 1.0);
      float line = exp(-pow((dist - 0.035) * 60.0, 2.0)), glow = exp(-dist * 14.0);
      bg = tube * (line * 1.6 + glow * 0.45);
      float rim = clamp(1.0 - abs(subj - 0.5) * 2.0, 0.0, 1.0);
      fg = vid * 0.18 + tube * rim * 1.4;
    } else if (uPreset == 5) {
      // rings: the subjects' outline echoed outward, band after band, flowing away from them
      float k = dist * 9.0 - t * 0.9;
      float band = fract(k);
      bg = hsv(fract(floor(k) * 0.13 + t * 0.02), 0.8, 1.0) * (0.55 + 0.45 * smoothstep(0.0, 0.12, band) * smoothstep(1.0, 0.85, band));
      bg *= 0.35 + 0.65 * exp(-dist * 1.5);
      fg = vid;
    } else if (uPreset == 6) {
      // echoes: where the dancers were, in the colour of when
      bg = vid * 0.3 * vec3(0.7, 0.75, 1.0);
      bg = mix(bg, hsv(stamp, 0.9, 1.0), clamp(trail, 0.0, 1.0) * 0.85);
      fg = vid;
    } else if (uPreset == 7) {
      vec3 L = discoLight(uv, t);
      vec2 fc = floor(sp * 140.0);
      float fleck = step(0.992, hash(fc + floor(t * 6.0))) * 1.2;
      bg = vid * 0.1 + L * 0.8 + fleck * hsv(hash(fc), 0.5, 1.0);
      fg = vid * (0.75 + 0.7 * L);
    }
    gl_FragColor = vec4(mix(bg, fg, subj), 1.0);
  }`;

export class Party {
  readonly material: THREE.ShaderMaterial;
  preset: Preset = PRESETS[0]!;
  /** how many people to cut out (the nearest) */
  subjects = 2;
  private maskTex: THREE.DataTexture | null = null;
  private maskData = new Uint8Array(4);
  private mw = 0;
  private mh = 0;
  private fw = 0;
  private fh = 0;
  private fxTex!: THREE.DataTexture;
  private fxData!: Uint8Array;
  private chans: (number | null)[] = [null, null, null, null];
  private chanMask: (Float32Array | null)[] = [null, null, null, null];
  private union!: Float32Array;
  private dist!: Float32Array;
  private trail!: Float32Array;
  private stamp!: Float32Array;
  private readonly uOn = new THREE.Vector4();

  constructor(shared: { uTex: THREE.IUniform; uCrop: THREE.IUniform; uMirror: THREE.IUniform }, vertexShader: string) {
    this.resizeFx(160, 90);
    this.material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader: FRAG, depthTest: false, depthWrite: false, toneMapped: false,
      uniforms: {
        ...shared,
        uMask: { value: null }, uFx: { value: this.fxTex }, uTime: { value: 0 }, uAspect: { value: 1 }, uPreset: { value: 0 },
        uOn: { value: this.uOn },
        uPal: { value: PALETTES.flat().map((h) => new THREE.Color(h)) },
      },
    });
  }

  private resizeFx(w: number, h: number): void {
    this.fxTex?.dispose();
    this.fxData = new Uint8Array(w * h * 4);
    this.fxTex = new THREE.DataTexture(this.fxData, w, h, THREE.RGBAFormat);
    this.fxTex.magFilter = THREE.LinearFilter; this.fxTex.minFilter = THREE.LinearFilter;
    this.union = new Float32Array(w * h); this.dist = new Float32Array(w * h);
    this.trail = new Float32Array(w * h); this.stamp = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) this.fxData[i * 4] = 255; // nobody yet: everywhere is far from a subject
    this.fw = w; this.fh = h;
    if (this.material) this.material.uniforms.uFx!.value = this.fxTex;
  }

  /** the subjects this frame, their masks into the textures, the distance field and the trails */
  update(tracks: Track[], dt: number, t: number, aspect: number): void {
    const u = this.material.uniforms;
    u.uTime!.value = t; u.uAspect!.value = aspect; u.uPreset!.value = this.preset.code;
    // the fx grid follows the frame's shape, long side 160
    const fw = aspect >= 1 ? 160 : Math.max(48, Math.round(160 * aspect)), fh = aspect >= 1 ? Math.max(48, Math.round(160 / aspect)) : 160;
    if (fw !== this.fw || fh !== this.fh) this.resizeFx(fw, fh);
    // the nearest N live people, by apparent size
    const live = tracks.filter((k) => k.presence > 0).sort((a, b) => b.len.torso / -b.T.z - a.len.torso / -a.T.z).slice(0, this.subjects);
    const ids = new Set(live.map((k) => k.id));
    for (let c = 0; c < 4; c++) if (this.chans[c] !== null && !ids.has(this.chans[c]!)) { this.chans[c] = null; this.chanMask[c] = null; }
    for (const k of live) {
      let c = this.chans.indexOf(k.id);
      if (c < 0) { c = this.chans.indexOf(null); if (c < 0) continue; this.chans[c] = k.id; }
      const m = k.det?.mask;
      if (m) {
        if (m.w !== this.mw || m.h !== this.mh) this.resizeMask(m.w, m.h);
        let buf = this.chanMask[c];
        if (!buf || buf.length !== m.data.length) buf = this.chanMask[c] = new Float32Array(m.data.length);
        buf.set(m.data);
      }
    }
    const on = [0, 0, 0, 0];
    for (let c = 0; c < 4; c++) { const id = this.chans[c]; if (id !== null && this.chanMask[c]) on[c] = tracks.find((k) => k.id === id)?.presence ?? 0; }
    this.uOn.set(on[0]!, on[1]!, on[2]!, on[3]!);
    this.fx(dt, t, on);
    if (!this.maskTex) return;
    // the mask texture: subject c in channel c
    const n = this.mw * this.mh, md = this.maskData;
    for (let c = 0; c < 4; c++) {
      const src = this.chanMask[c];
      if (!src) { for (let i = 0; i < n; i++) md[i * 4 + c] = 0; continue; }
      for (let i = 0; i < n; i++) md[i * 4 + c] = src[i]! * 255;
    }
    this.maskTex.needsUpdate = true;
  }

  private resizeMask(w: number, h: number): void {
    this.maskTex?.dispose();
    this.mw = w; this.mh = h;
    this.maskData = new Uint8Array(w * h * 4);
    this.maskTex = new THREE.DataTexture(this.maskData, w, h, THREE.RGBAFormat);
    this.maskTex.magFilter = THREE.LinearFilter; this.maskTex.minFilter = THREE.LinearFilter;
    this.material.uniforms.uMask!.value = this.maskTex;
  }

  /** the union of the subjects at the fx grid's size; its outside distance (chamfer, cells); the trails */
  private fx(dt: number, t: number, on: number[]): void {
    const W = this.fw, H = this.fh, U = this.union, D = this.dist;
    for (let y = 0; y < H; y++) {
      const my = Math.min(this.mh - 1, Math.floor(((y + 0.5) / H) * this.mh));
      for (let x = 0; x < W; x++) {
        const mi = my * this.mw + Math.min(this.mw - 1, Math.floor(((x + 0.5) / W) * this.mw));
        let v = 0;
        for (let c = 0; c < 4; c++) { const m = this.chanMask[c]; if (m && this.mw) v = Math.max(v, m[mi]! * on[c]!); }
        U[y * W + x] = v;
      }
    }
    const INF = 1e6, R2 = Math.SQRT2;
    for (let i = 0; i < W * H; i++) D[i] = U[i]! > 0.5 ? 0 : INF;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x;
      let d = D[i]!;
      if (x > 0) d = Math.min(d, D[i - 1]! + 1);
      if (y > 0) { d = Math.min(d, D[i - W]! + 1); if (x > 0) d = Math.min(d, D[i - W - 1]! + R2); if (x < W - 1) d = Math.min(d, D[i - W + 1]! + R2); }
      D[i] = d;
    }
    for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) {
      const i = y * W + x;
      let d = D[i]!;
      if (x < W - 1) d = Math.min(d, D[i + 1]! + 1);
      if (y < H - 1) { d = Math.min(d, D[i + W]! + 1); if (x < W - 1) d = Math.min(d, D[i + W + 1]! + R2); if (x > 0) d = Math.min(d, D[i + W - 1]! + R2); }
      D[i] = d;
    }
    const decay = Math.exp(-dt / 1.1), phase = (t * 0.2) % 1, fd = this.fxData;
    for (let i = 0; i < W * H; i++) {
      const v = U[i]!;
      this.trail[i] = Math.max(this.trail[i]! * decay, v);
      if (v > 0.5) this.stamp[i] = phase;
      fd[i * 4] = Math.min(1, D[i]! / 48) * 255;
      fd[i * 4 + 1] = this.trail[i]! * 255;
      fd[i * 4 + 2] = this.stamp[i]! * 255;
      fd[i * 4 + 3] = v * 255;
    }
    this.fxTex.needsUpdate = true;
  }

  /** the masks come off the GPU while party mode is on; nobody in it: the rooms still play */
  get hasMasks(): boolean { return !!this.maskTex; }
}
