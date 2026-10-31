// Party mode: the people cut out of the frame and the frame rebuilt round them, graded like a concert's screens.
//
// Who: MediaPipe's pose model gives each person their own mask (detector.ts), so "cut out one, or several" is a count:
// the N nearest tracked people are subjects, each on a channel of one RGBA mask texture, keeping that channel while
// they stay (their colours do not jump); anyone else belongs to the background.
//
// How it is drawn, all on the phone, each frame:
//   1. the CPU, on a 160-px grid: the union of the subjects, its outside distance (a two-pass chamfer: rings, glows),
//      the echo trails (a decaying max) and the subjects' box (the pyramid's anchor);
//   2. a cut-out pass writes this frame's subjects (rgb + alpha) into a 12-deep history (the pyramid's clones dance in
//      canon, a few frames behind each other);
//   3. the scene pass, in the video's own uv, in half-float so lasers and neon can run past white: one fragment
//      shader, a branch per preset; it reads the previous scene for feedback (the tunnel);
//   4. bloom: a bright pass at a quarter size, blurred, and again at a sixteenth for the wide halo;
//   5. the grade, as the background quad's material: chromatic split toward the edges, the bloom, a vignette, grain,
//      a highlight roll-off, a beat's flash.
// With the microphone on (audio/beat.ts) the bass drives `uBeat`: kicks in the feedback, the lasers, the split.
import * as THREE from 'three';
import type { Track } from '../pose/tracker';
import type { Ground } from '../pose/ground';
import { project, type Intrinsics } from '../pose/solve';

export interface Preset {
  id: string;
  name: string;
  code: number;
  /** the picker card's face (a CSS background) */
  swatch: string;
}

export const PRESETS: Preset[] = [
  { id: 'insitu', name: 'In Situ', code: 12, swatch: 'radial-gradient(ellipse at 30% 85%, rgba(255,80,190,0.9), transparent 35%), radial-gradient(ellipse at 72% 80%, rgba(80,220,255,0.9), transparent 35%), linear-gradient(160deg, transparent 40%, rgba(255,240,220,0.35) 50%, transparent 60%), #2a2430' },
  { id: 'tunnel', name: 'Tunnel', code: 9, swatch: 'repeating-radial-gradient(circle, #ff2d95 0 3px, #12071f 3px 8px, #2ee6ff 8px 11px, #12071f 11px 16px)' },
  { id: 'lasers', name: 'Lasers', code: 10, swatch: 'linear-gradient(115deg, transparent 46%, #b6ff2e 48%, transparent 50%), linear-gradient(65deg, transparent 46%, #ff2d95 48%, transparent 50%), linear-gradient(90deg, transparent 47%, #2ee6ff 49%, transparent 51%), #07040d' },
  { id: 'kaleido', name: 'Kaleido', code: 11, swatch: 'conic-gradient(#ff2d95, #ffe62e, #b6ff2e, #2ee6ff, #8a2eff, #ff2d95)' },
  { id: 'rings', name: 'Rings', code: 5, swatch: 'repeating-radial-gradient(circle, #ff3d7f 0 5px, #ffb23d 5px 10px, #3dd6ff 10px 15px, #8c5cff 15px 20px)' },
  { id: 'neon', name: 'Neon', code: 4, swatch: 'radial-gradient(circle, transparent 0 40%, #39ff9c 42% 50%, transparent 54%), #06030f' },
  { id: 'pop', name: 'Pop Art', code: 1, swatch: 'radial-gradient(circle at 30% 30%, #ffde00 0 22%, transparent 23%), radial-gradient(circle at 70% 70%, #ff2d8a 0 22%, transparent 23%), #19c3ff' },
  { id: 'warhol', name: 'Warhol', code: 2, swatch: 'conic-gradient(#ff5fa2 0 25%, #ffd400 0 50%, #2ad4c4 0 75%, #7b5cff 0)' },
  { id: 'echo', name: 'Echoes', code: 6, swatch: 'linear-gradient(90deg, #1b1033, #ff2db4 40%, #2de2ff 70%, #1b1033)' },
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

const HIST = 12;

const QUAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const COMMON = /* glsl */ `
  vec3 hsv(float h, float s, float v) { vec3 k = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0); return v * mix(vec3(1.0), k, s); }
  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
  // the show's palette: hot pink, lime, sun yellow, aqua, violet, round and round, smooth
  vec3 neon(float t) {
    t = fract(t) * 5.0;
    float f = fract(t); f = f * f * (3.0 - 2.0 * f);
    int i = int(floor(t));
    vec3 c0 = vec3(1.0, 0.16, 0.58), c1 = vec3(0.70, 1.0, 0.16), c2 = vec3(1.0, 0.88, 0.16), c3 = vec3(0.16, 0.88, 1.0), c4 = vec3(0.55, 0.18, 1.0);
    vec3 a = i == 0 ? c0 : i == 1 ? c1 : i == 2 ? c2 : i == 3 ? c3 : c4;
    vec3 b = i == 0 ? c1 : i == 1 ? c2 : i == 2 ? c3 : i == 3 ? c4 : c0;
    return mix(a, b, f);
  }`;

const CUT_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uTex, uMask;
  uniform vec4 uOn;
  void main() {
    vec4 m = smoothstep(0.3, 0.7, texture2D(uMask, vec2(vUv.x, 1.0 - vUv.y))) * uOn;
    gl_FragColor = vec4(texture2D(uTex, vUv).rgb, max(max(m.r, m.g), max(m.b, m.a)));
  }`;

const SCENE_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uTex, uMask, uFx, uPrev;
  uniform highp sampler2DArray uHist;
  uniform float uHead, uTime, uAspect, uBeat, uLevel, uClones, uPyramid;
  uniform int uPreset;
  uniform vec4 uOn, uBox;
  // the pyramid, laid out on the floor (pose/ground.ts) and projected: each clone's feet in uv, its scale against the
  // subject, its delay in frames; back to front. uFoot: the subject's own feet in uv; uFootW: their width in uv
  // In Situ's spotlights, projected: the source, the floor pool's centre (uv), the pool's radii (uv), the colour
  uniform vec2 uSpotL[3], uSpotP[3], uSpotR[3];
  uniform vec3 uSpotC[3];
  uniform float uSpotK;
  uniform vec4 uClone[9];
  uniform int uCloneN;
  uniform vec2 uFoot;
  uniform float uFootW;
  uniform vec3 uPal[16];
  ${COMMON}

  vec3 pal(int who, int k) { return uPal[who * 4 + k]; }
  vec3 print(vec3 c, int who) { float l = luma(c); return l < 0.22 ? pal(who, 0) : l < 0.45 ? pal(who, 1) : l < 0.7 ? pal(who, 2) : pal(who, 3); }
  vec3 solar(vec3 c, float t) {
    vec3 s = mix(c, 1.0 - c, step(0.5, c));
    return mix(s * 2.0, hsv(fract(t * 0.07) + luma(c) * 0.8, 0.85, 1.0) * (0.35 + 1.2 * luma(s)), 0.55);
  }
  vec3 discoLight(vec2 p, float t) {
    vec3 acc = vec3(0.0);
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      vec2 c = vec2(0.5 + 0.42 * sin(t * (0.45 + fi * 0.13) + fi * 1.7), 0.45 + 0.35 * cos(t * (0.37 + fi * 0.11) + fi * 2.3));
      vec2 d = (p - c) * vec2(uAspect, 1.0);
      acc += neon(fi / 5.0 + t * 0.03) * exp(-dot(d, d) * 45.0) * 0.9;
    }
    return acc;
  }
  // how a cut-out looks in this preset (the subject's look without its rims): the clones wear it too
  vec3 look(vec3 v, int who, vec2 uv, float t) {
    if (uPreset == 0) return v * 1.08;
    if (uPreset == 1 || uPreset == 2) return print(v, who);
    if (uPreset == 3) return solar(v, t);
    if (uPreset == 4) return v * 0.16;
    if (uPreset == 7) return v * (0.75 + 0.7 * discoLight(uv, t));
    if (uPreset == 10) return v * 0.9;
    return v;
  }
  // a frame of the subjects, \`delay\` frames ago, at q (outside the frame: nothing)
  vec4 past(vec2 q, float delay) {
    if (q.x < 0.0 || q.y < 0.0 || q.x > 1.0 || q.y > 1.0) return vec4(0.0);
    return texture(uHist, vec3(q, mod(uHead - delay + ${HIST}.0 * 8.0, ${HIST}.0)));
  }
  // a laser from \`o\` at angle \`a\` (from straight down), in aspect-correct space
  float beam(vec2 p, vec2 o, float a, float w) {
    vec2 d = vec2(sin(a), -cos(a));
    vec2 v = p - o;
    float along = dot(v, d);
    float across = abs(v.x * d.y - v.y * d.x);
    return along > 0.0 ? exp(-across * across / (w * w)) * exp(-along * 0.25) : 0.0;
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
    float t = uTime, beat = uBeat;
    vec2 sp = vec2(uv.x * uAspect, uv.y);
    // a lit edge on every subject, and a halo just outside them, in the show's colours
    float rim = clamp(1.0 - abs(subj - 0.5) * 2.0, 0.0, 1.0);
    vec3 hue = neon(t * 0.06 + float(who) * 0.23);
    vec3 halo = hue * exp(-dist * 22.0) * 0.6;
    vec3 bg = vid, fg = vid;

    if (uPreset == 0) {
      bg = vec3(luma(vid)) * vec3(0.75, 0.78, 0.95) * (0.12 + 0.75 * exp(-dist * 7.0));
      fg = vid * 1.08;
    } else if (uPreset == 1) {
      fg = print(vid, who);
      vec3 base = hsv(fract(0.55 + floor(t * 0.25 + beat * 0.0) * 0.23), 0.75, 1.0);
      vec2 g = fract(sp * 70.0) - 0.5;
      float dots = step(length(g), 0.18 + 0.22 * luma(vid));
      bg = mix(base, base * 0.55 + vec3(0.05), dots);
    } else if (uPreset == 2) {
      int ci = int(cellIx);
      fg = print(vid, ci);
      bg = mix(pal((ci + 2) - 4 * ((ci + 2) / 4), 2), pal(ci, 3), 0.15);
    } else if (uPreset == 3) {
      fg = solar(vid, t);
      bg = solar(vid, t + 3.0) * 0.7;
    } else if (uPreset == 4) {
      vec3 tube = neon(t * 0.08 + muv.y * 0.3);
      float line = exp(-pow((dist - 0.035) * 60.0, 2.0)), glow = exp(-dist * 14.0);
      bg = tube * (line * 2.4 * (1.0 + beat) + glow * 0.5);
      fg = vid * 0.16 + tube * rim * 2.0;
    } else if (uPreset == 5) {
      float k = dist * 9.0 - t * 0.9 - beat * 0.4;
      float band = fract(k);
      bg = neon(floor(k) * 0.17 + t * 0.02) * (0.25 + 1.1 * smoothstep(0.0, 0.08, band) * smoothstep(0.32, 0.12, band));
      bg *= 0.3 + 0.9 * exp(-dist * 1.4);
      // a lit edge only: the halo (bright where dist is 0) belongs outside — inside, it washed the person to a ghost
      fg = vid + hue * rim * 1.2;
    } else if (uPreset == 6) {
      bg = vid * 0.25 * vec3(0.7, 0.75, 1.0);
      bg = mix(bg, neon(stamp) * 1.3, clamp(trail, 0.0, 1.0) * 0.85);
      fg = vid;
    } else if (uPreset == 7) {
      vec3 L = discoLight(uv, t);
      vec2 fc = floor(sp * 140.0);
      float fleck = step(0.992, hash(fc + floor(t * 6.0))) * 1.6;
      bg = vid * 0.1 + L * (0.9 + beat) + fleck * hsv(hash(fc), 0.5, 1.0);
      fg = vid * (0.75 + 0.7 * L);
    } else if (uPreset == 9) {
      // the tunnel: the last frame, a little smaller and turned, fed back under this one — the dancers recede forever
      vec2 c = vec2(0.5, 0.52);
      vec2 d = (uv - c) * vec2(uAspect, 1.0);
      float a = 0.012 + 0.03 * beat, z = 0.962 - 0.035 * beat;
      d = mat2(cos(a), -sin(a), sin(a), cos(a)) * d / z;
      vec3 prev = texture2D(uPrev, c + d / vec2(uAspect, 1.0)).rgb;
      prev = mix(prev, neon(t * 0.08) * luma(prev) * 1.5, 0.07) * 0.94;
      bg = vid * 0.1 + prev;
      fg = vid + hue * rim * 1.4;
    } else if (uPreset == 10) {
      // lasers through haze: three sources over the stage, fans that sweep, snap on the beat
      vec2 p = sp;
      float haze = 0.4 + 0.6 * noise(p * 3.0 + vec2(t * 0.15, -t * 0.08));
      vec3 acc = vec3(0.0);
      for (int s = 0; s < 3; s++) {
        float fs = float(s);
        vec2 o = vec2((0.15 + 0.35 * fs) * uAspect, 1.04);
        for (int k = 0; k < 6; k++) {
          float fk = float(k);
          float a = (fk - 2.5) * (0.16 + 0.06 * sin(t * 0.7 + fs)) + 0.55 * sin(t * (0.35 + 0.1 * fs) + fs * 2.0);
          acc += neon(fs * 0.33 + fk * 0.04 + t * 0.02) * beam(p, o, a, 0.0045 + 0.004 * beat);
        }
      }
      bg = vid * 0.06 + acc * (1.4 + 1.8 * beat) * haze + neon(t * 0.03) * 0.05 * haze;
      fg = vid * 0.9 + hue * rim * 1.5 + acc * 0.25;
    } else if (uPreset == 11) {
      // a kaleidoscope of the room behind them, turning
      vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);
      float r = length(p) * (1.0 - 0.08 * beat), a = atan(p.y, p.x) + t * 0.12;
      float seg = 6.2831853 / 6.0;
      a = mod(a, seg); a = abs(a - seg * 0.5);
      vec2 q = vec2(cos(a), sin(a)) * r;
      vec3 k = texture2D(uTex, clamp(0.5 + q / vec2(uAspect, 1.0) * 0.9, 0.0, 1.0)).rgb;
      k = mix(vec3(luma(k)), k, 1.8);
      bg = clamp(k, 0.0, 1.5) * 0.8 * mix(vec3(1.0), neon(r * 0.8 - t * 0.1) * 1.4, 0.45);
      fg = vid + hue * rim * 1.3;
    }
    if (uPreset == 12) {
      // in situ: the room as the camera saw it, a club's lights added — beams through haze down to pools on the floor
      // (the same lights stand in 3D over the costumes: render/stage.ts stageSpots); the people in the pools are lit
      vec3 add = vec3(0.0), pools = vec3(0.0);
      float haze = 0.55 + 0.45 * noise(sp * 4.0 + vec2(t * 0.12, -t * 0.07));
      for (int i = 0; i < 3; i++) {
        vec2 Ls = uSpotL[i], Ps = uSpotP[i], R = max(uSpotR[i], vec2(0.004));
        vec2 e = (uv - Ps) / R;
        float pool = exp(-dot(e, e) * 1.6);
        // the beam: a cone from the source to the pool, widening, brightest near the floor, soft-edged
        vec2 ax = Ps - Ls; float L2 = max(dot(ax, ax), 1e-5);
        float k = clamp(dot(uv - Ls, ax) / L2, 0.0, 1.15);
        vec2 q = Ls + ax * k;
        float wdt = mix(0.006, R.x * 0.95, k);
        float across = length((uv - q) * vec2(uAspect, 1.0)) / (wdt * uAspect);
        float beam = exp(-across * across * 2.2) * smoothstep(0.0, 0.25, k) * (k < 1.0 ? 1.0 : exp(-(k - 1.0) * 12.0));
        add += uSpotC[i] * beam * haze * 0.4;
        pools += uSpotC[i] * pool;
      }
      add *= uSpotK; pools *= uSpotK;
      // the room a touch darker, so the lights read; floating motes catch the beams
      float mote = step(0.996, hash(floor(sp * 220.0) + floor(t * 3.0))) * 0.8;
      bg = vid * 0.8 * (1.0 + pools * 1.4) + add * (1.0 + mote * 3.0) + pools * 0.07;
      fg = vid * (1.0 + pools * 0.9) + add * 0.15;
    }
    if (uPreset != 1 && uPreset != 2 && uPreset != 0 && uPreset != 12) bg += halo * (uPreset == 4 ? 0.0 : 1.0);
    // the dance pyramid, over any preset's room: the subjects cloned on the floor behind them, row after row, each
    // later — a canon — in the preset's own look, with a lit edge and a contact shadow
    if (uPyramid > 0.5 && uClones > 0.5) {
      for (int i = 0; i < 9; i++) {
        if (i >= uCloneN) break;
        vec4 cl = uClone[i];
        vec2 e = (uv - cl.xy) / vec2(uFootW * cl.z * 0.6, uFootW * cl.z * 0.13);
        bg *= 1.0 - 0.55 * exp(-dot(e, e));
        vec4 c = past(uFoot + (uv - cl.xy) / cl.z, cl.w);
        int cw = uPreset == 2 ? int(cellIx) : i - 4 * (i / 4);
        vec3 edge = (uPreset == 12 ? vec3(0.0) : neon(float(i) * 0.13 + t * 0.05)) * clamp(1.0 - abs(c.a - 0.5) * 2.0, 0.0, 1.0) * 1.4;
        bg = mix(bg, look(c.rgb, cw, uv, t) * (1.0 - 0.06 * float(i / 3)) + edge, c.a);
      }
    }
    gl_FragColor = vec4(mix(bg, fg, subj), 1.0);
  }`;

const BRIGHT_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uSrc;
  uniform vec2 uTexel;
  uniform float uThreshold;
  void main() {
    vec3 c = (texture2D(uSrc, vUv + uTexel * vec2(-1.0, -1.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(1.0, -1.0)).rgb
            + texture2D(uSrc, vUv + uTexel * vec2(-1.0, 1.0)).rgb + texture2D(uSrc, vUv + uTexel * vec2(1.0, 1.0)).rgb) * 0.25;
    float l = max(max(c.r, c.g), c.b);
    float k = smoothstep(uThreshold, uThreshold + 0.35, l);
    gl_FragColor = vec4(c * k, 1.0);
  }`;

const BLUR_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uSrc;
  uniform vec2 uDir;
  void main() {
    vec3 c = texture2D(uSrc, vUv).rgb * 0.2270270;
    c += (texture2D(uSrc, vUv + uDir * 1.3846154).rgb + texture2D(uSrc, vUv - uDir * 1.3846154).rgb) * 0.3162162;
    c += (texture2D(uSrc, vUv + uDir * 3.2307692).rgb + texture2D(uSrc, vUv - uDir * 3.2307692).rgb) * 0.0702703;
    gl_FragColor = vec4(c, 1.0);
  }`;

const FINAL_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uScene, uBloom1, uBloom2, uOld;
  uniform float uMix;
  #ifdef FG
  uniform sampler2D uMask;
  uniform vec4 uOn;
  #endif
  uniform float uTime, uBeat, uFlash, uCA, uBloomK;
  uniform vec2 uRes;
  void main() {
    vec2 d = vUv - 0.5;
    float ca = (0.006 + 0.012 * uBeat) * uCA;
    vec3 c = vec3(texture2D(uScene, vUv + d * ca).r, texture2D(uScene, vUv).g, texture2D(uScene, vUv - d * ca).b);
    if (uMix < 1.0) c = mix(texture2D(uOld, vUv).rgb, c, uMix);
    c += (texture2D(uBloom1, vUv).rgb * 0.75 + texture2D(uBloom2, vUv).rgb * 0.9) * uBloomK;
    c += uBeat * uFlash * 0.07;
    // the highlights roll off instead of clipping: neon stays a colour
    vec3 hi = max(c - 0.8, 0.0);
    c = min(c, 0.8) + 0.2 * (1.0 - exp(-hi * 3.0)) + hi * 0.05;
    #ifdef FG
    // the subjects again, over whatever the 3D scene drew: the same grade, only where they stand
    vec4 m = smoothstep(0.3, 0.7, texture2D(uMask, vec2(vUv.x, 1.0 - vUv.y))) * uOn;
    gl_FragColor = vec4(c, max(max(m.r, m.g), max(m.b, m.a)));
    #else
    gl_FragColor = vec4(c, 1.0);
    #endif
  }`;

export class Party {
  /** the background quad's material while party mode is on: the grade (step 5) */
  readonly material: THREE.ShaderMaterial;
  /**
   * the same grade drawn after the 3D scene with the subjects' mask as its alpha: the people stay in front of costumes
   * that dance behind them (insertion by draw order, no depth needed)
   */
  readonly foreground: THREE.ShaderMaterial;
  private _preset: Preset = PRESETS[0]!;
  /** a change of preset crossfades (the old one drawn alongside for a moment), never a cut */
  get preset(): Preset { return this._preset; }
  set preset(p: Preset) {
    if (p === this._preset) return;
    this.fromCode = this._preset.code;
    this.xfade = this.started ? 0 : 1;
    this._preset = p;
  }
  private fromCode = 0;
  private xfade = 1;
  private started = false;
  private rtOld: THREE.WebGLRenderTarget | null = null;
  /** how many people to cut out (the nearest) */
  subjects = 2;
  /** the bass's envelope, 0..1 (audio/beat.ts); 0 without the microphone */
  beat = 0;
  /** In Situ's lights as the stage laid them out (render/stage.ts stageSpots), projected */
  setSpots(spots: { L: THREE.Vector2; P: THREE.Vector2; R: THREE.Vector2; C: THREE.Color }[], k: number): void {
    const u = this.scene.uniforms;
    spots.forEach((s, i) => {
      (u.uSpotL!.value as THREE.Vector2[])[i]!.copy(s.L); (u.uSpotP!.value as THREE.Vector2[])[i]!.copy(s.P);
      (u.uSpotR!.value as THREE.Vector2[])[i]!.copy(s.R); (u.uSpotC!.value as THREE.Color[])[i]!.copy(s.C);
    });
    u.uSpotK!.value = k;
  }
  /** the pyramid clones the people (off when the costumes make their own pyramid in 3D) */
  clones = true;
  /** the pyramid toggle (every preset) */
  pyramid = true;
  private maskTex: THREE.DataTexture;
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
  private readonly box = new THREE.Vector4(0.35, 0.1, 0.65, 0.7);
  // passes
  private readonly quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
  private readonly quadScene = new THREE.Scene();
  private readonly cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private readonly cut: THREE.ShaderMaterial;
  private readonly scene: THREE.ShaderMaterial;
  private readonly bright: THREE.ShaderMaterial;
  private readonly blur: THREE.ShaderMaterial;
  private rtScene: THREE.WebGLRenderTarget[] = [];
  private rtB1a: THREE.WebGLRenderTarget | null = null;
  private rtB1b: THREE.WebGLRenderTarget | null = null;
  private rtB2a: THREE.WebGLRenderTarget | null = null;
  private rtB2b: THREE.WebGLRenderTarget | null = null;
  private hist: THREE.WebGLArrayRenderTarget | null = null;
  private head = 0;
  private flip = 0;
  private sizeKey = '';

  constructor(shared: { uTex: THREE.IUniform; uCrop: THREE.IUniform; uMirror: THREE.IUniform }, vertexShader: string) {
    this.maskTex = new THREE.DataTexture(new Uint8Array(4), 1, 1, THREE.RGBAFormat);
    this.maskTex.needsUpdate = true;
    this.resizeFx(160, 90);
    const common = { depthTest: false, depthWrite: false, toneMapped: false };
    this.cut = new THREE.ShaderMaterial({ ...common, vertexShader: QUAD_VERT, fragmentShader: CUT_FRAG, uniforms: { uTex: shared.uTex, uMask: { value: this.maskTex }, uOn: { value: this.uOn } } });
    this.scene = new THREE.ShaderMaterial({
      ...common, vertexShader: QUAD_VERT, fragmentShader: SCENE_FRAG,
      uniforms: {
        uTex: shared.uTex, uMask: { value: this.maskTex }, uFx: { value: this.fxTex }, uPrev: { value: null }, uHist: { value: null },
        uHead: { value: 0 }, uClones: { value: 1 }, uPyramid: { value: 1 },
        uSpotL: { value: [0, 1, 2].map(() => new THREE.Vector2(0.5, 1.2)) }, uSpotP: { value: [0, 1, 2].map(() => new THREE.Vector2(0.5, 0.1)) },
        uSpotR: { value: [0, 1, 2].map(() => new THREE.Vector2(0.1, 0.04)) }, uSpotC: { value: [0, 1, 2].map(() => new THREE.Color(0, 0, 0)) }, uSpotK: { value: 0 }, uClone: { value: Array.from({ length: 9 }, () => new THREE.Vector4()) }, uCloneN: { value: 0 },
        uFoot: { value: new THREE.Vector2(0.5, 0.1) }, uFootW: { value: 0.2 }, uTime: { value: 0 }, uAspect: { value: 1 }, uBeat: { value: 0 }, uLevel: { value: 0 }, uPreset: { value: 0 },
        uOn: { value: this.uOn }, uBox: { value: this.box }, uPal: { value: PALETTES.flat().map((h) => new THREE.Color(h)) },
      },
    });
    this.bright = new THREE.ShaderMaterial({ ...common, vertexShader: QUAD_VERT, fragmentShader: BRIGHT_FRAG, uniforms: { uSrc: { value: null }, uTexel: { value: new THREE.Vector2() }, uThreshold: { value: 0.72 } } });
    this.blur = new THREE.ShaderMaterial({ ...common, vertexShader: QUAD_VERT, fragmentShader: BLUR_FRAG, uniforms: { uSrc: { value: null }, uDir: { value: new THREE.Vector2() } } });
    this.material = new THREE.ShaderMaterial({
      ...common, vertexShader, fragmentShader: FINAL_FRAG,
      uniforms: {
        uCrop: shared.uCrop, uMirror: shared.uMirror,
        uScene: { value: null }, uBloom1: { value: null }, uBloom2: { value: null },
        uTime: { value: 0 }, uBeat: { value: 0 }, uFlash: { value: 1 }, uRes: { value: new THREE.Vector2(1, 1) },
        uOld: { value: null }, uMix: { value: 1 }, uCA: { value: 1 }, uBloomK: { value: 1 },
      },
    });
    this.foreground = new THREE.ShaderMaterial({
      ...common, vertexShader, fragmentShader: FINAL_FRAG, transparent: true, defines: { FG: 1 },
      uniforms: { ...this.material.uniforms, uMask: this.scene.uniforms.uMask!, uOn: this.scene.uniforms.uOn! },
    });
    this.quad.frustumCulled = false;
    this.quadScene.add(this.quad);
  }

  private resizeFx(w: number, h: number): void {
    this.fxTex?.dispose();
    this.fxData = new Uint8Array(w * h * 4);
    this.fxTex = new THREE.DataTexture(this.fxData, w, h, THREE.RGBAFormat);
    this.fxTex.magFilter = THREE.LinearFilter; this.fxTex.minFilter = THREE.LinearFilter;
    this.union = new Float32Array(w * h); this.dist = new Float32Array(w * h);
    this.trail = new Float32Array(w * h); this.stamp = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) this.fxData[i * 4] = 255; // nobody yet: everywhere is far from a subject
    this.fxTex.needsUpdate = true;
    this.fw = w; this.fh = h;
    if (this.scene) this.scene.uniforms.uFx!.value = this.fxTex;
  }

  /** the subjects this frame, their masks into the textures, the distance field, the trails, the box (step 1) */
  private frameDt = 1 / 30;
  update(tracks: Track[], dt: number, t: number, aspect: number, ground?: Ground, K?: Intrinsics): void {
    this.frameDt = dt;
    const u = this.scene.uniforms;
    u.uTime!.value = t; u.uAspect!.value = aspect; u.uPreset!.value = this.preset.code; u.uBeat!.value = this.beat; u.uClones!.value = this.clones ? 1 : 0; u.uPyramid!.value = this.pyramid ? 1 : 0;
    this.material.uniforms.uTime!.value = t; this.material.uniforms.uBeat!.value = this.beat;
    // in situ looks like the camera's own picture: barely any fringing, the room's bright parts do not bloom much
    const situ = this.preset.code === 12;
    this.material.uniforms.uCA!.value = situ ? 0.25 : 1; this.material.uniforms.uBloomK!.value = situ ? 0.45 : 1;
    const fw = aspect >= 1 ? 160 : Math.max(48, Math.round(160 * aspect)), fh = aspect >= 1 ? Math.max(48, Math.round(160 / aspect)) : 160;
    if (fw !== this.fw || fh !== this.fh) this.resizeFx(fw, fh);
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
        if (!buf || buf.length !== m.data.length) { buf = this.chanMask[c] = new Float32Array(m.data.length); buf.set(m.data); }
        else {
          // ~40 ms: the mask's frame-to-frame noise at the edge (a shimmer) goes, a moving arm keeps up
          const k = 1 - Math.exp(-dt / 0.04), d = m.data;
          for (let i = 0; i < d.length; i++) buf[i] = buf[i]! + (d[i]! - buf[i]!) * k;
        }
      }
    }
    const on = [0, 0, 0, 0];
    for (let c = 0; c < 4; c++) { const id = this.chans[c]; if (id !== null && this.chanMask[c]) on[c] = tracks.find((k) => k.id === id)?.presence ?? 0; }
    this.uOn.set(on[0]!, on[1]!, on[2]!, on[3]!);
    this.fx(dt, t, on);
    this.layPyramid(live[0], ground, K, dt);
    if (!this.mw) return;
    const n = this.mw * this.mh, md = this.maskData;
    for (let c = 0; c < 4; c++) {
      const src = this.chanMask[c];
      if (!src) { for (let i = 0; i < n; i++) md[i * 4 + c] = 0; continue; }
      for (let i = 0; i < n; i++) md[i * 4 + c] = src[i]! * 255;
    }
    this.maskTex.needsUpdate = true;
  }

  /**
   * The pyramid on the floor: the nearest subject's hips dropped to the floor, rows back along it and across it, each
   * clone's feet projected through the camera, its scale the ratio of depths (so the floor's perspective decides how
   * small and how high the back rows are), sorted back to front.
   */
  private readonly cloneSm = Array.from({ length: 9 }, () => new THREE.Vector4());
  private cloneSmN = 0;
  private layPyramid(subject: Track | undefined, ground?: Ground, K?: Intrinsics, dt = 1 / 30): void {
    const u = this.scene.uniforms;
    if (!subject || !ground || !K) { u.uCloneN!.value = 0; this.cloneSmN = 0; return; }
    const hip = new THREE.Vector3(subject.T.x, subject.T.y, subject.T.z);
    const foot = ground.foot(hip), H = Math.max(1.2, Math.min(2.2, ground.height(hip) * 1.9));
    const { back, side } = ground.axes();
    const fp = project(foot, K), kk = 1 - Math.exp(-dt / 0.15);
    // the layout glides: the clones' places follow the subject's feet over ~0.15 s, never in a jump
    const uf = u.uFoot!.value as THREE.Vector2;
    if (this.cloneSmN === 0) uf.set(fp.x, 1 - fp.y); else uf.lerp(new THREE.Vector2(fp.x, 1 - fp.y), kk);
    u.uFootW!.value = Math.max(0.05, this.box.z - this.box.x);
    const list: { v: THREE.Vector4; depth: number }[] = [];
    for (let r = 1; r <= 3; r++) for (let j = 0; j <= r; j++) {
      const fj = j - r / 2;
      const at = foot.clone().addScaledVector(back, r * H * 0.5).addScaledVector(side, fj * H * 0.55);
      if (at.z > -0.3) continue;
      const p = project(at, K);
      list.push({ v: new THREE.Vector4(p.x, 1 - p.y, -foot.z / -at.z, r * 3 + Math.abs(fj) * 1.5), depth: -at.z });
    }
    list.sort((a, b) => b.depth - a.depth);
    const arr = u.uClone!.value as THREE.Vector4[];
    list.forEach((c, i) => { const sm = this.cloneSm[i]!; if (this.cloneSmN !== list.length) sm.copy(c.v); else sm.lerp(c.v, kk); sm.w = c.v.w; arr[i]!.copy(sm); });
    this.cloneSmN = list.length;
    u.uCloneN!.value = list.length;
  }

  private resizeMask(w: number, h: number): void {
    this.maskTex.dispose();
    this.mw = w; this.mh = h;
    this.maskData = new Uint8Array(w * h * 4);
    this.maskTex = new THREE.DataTexture(this.maskData, w, h, THREE.RGBAFormat);
    this.maskTex.magFilter = THREE.LinearFilter; this.maskTex.minFilter = THREE.LinearFilter;
    this.scene.uniforms.uMask!.value = this.maskTex;
    this.cut.uniforms.uMask!.value = this.maskTex;
  }

  private fx(dt: number, t: number, on: number[]): void {
    const W = this.fw, H = this.fh, U = this.union, D = this.dist;
    let x0 = W, y0 = H, x1 = -1, y1 = -1;
    for (let y = 0; y < H; y++) {
      const my = Math.min(this.mh - 1, Math.floor(((y + 0.5) / H) * this.mh));
      for (let x = 0; x < W; x++) {
        let v = 0;
        if (this.mw) {
          const mi = my * this.mw + Math.min(this.mw - 1, Math.floor(((x + 0.5) / W) * this.mw));
          for (let c = 0; c < 4; c++) { const m = this.chanMask[c]; if (m) v = Math.max(v, m[mi]! * on[c]!); }
        }
        U[y * W + x] = v;
        if (v > 0.5) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      }
    }
    // the subjects' box in uv (y up), smoothed: the pyramid stands on it
    if (x1 >= 0) {
      const k = 1 - Math.exp(-dt / 0.12);
      const bx0 = x0 / W, bx1 = (x1 + 1) / W, by0 = 1 - (y1 + 1) / H, by1 = 1 - y0 / H;
      this.box.set(this.box.x + (bx0 - this.box.x) * k, this.box.y + (by0 - this.box.y) * k, this.box.z + (bx1 - this.box.z) * k, this.box.w + (by1 - this.box.w) * k);
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

  /** (re)make the render targets for a video of w × h */
  private targets(renderer: THREE.WebGLRenderer, vw: number, vh: number): void {
    const long = 900, k = long / Math.max(vw, vh);
    const w = Math.max(64, Math.round(vw * k)), h = Math.max(64, Math.round(vh * k));
    const key = `${w}x${h}`;
    if (key === this.sizeKey) return;
    this.sizeKey = key;
    for (const r of [...this.rtScene, this.rtB1a, this.rtB1b, this.rtB2a, this.rtB2b, this.rtOld]) r?.dispose();
    this.hist?.dispose();
    // half float when the phone can draw into it (lasers and neon past white feed the bloom); bytes otherwise
    const ext = renderer.extensions;
    const hdr = ext.has('EXT_color_buffer_half_float') || ext.has('EXT_color_buffer_float');
    const opt = { type: hdr ? THREE.HalfFloatType : THREE.UnsignedByteType, depthBuffer: false, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter } as const;
    this.bright.uniforms.uThreshold!.value = hdr ? 0.72 : 0.62;
    this.rtScene = [new THREE.WebGLRenderTarget(w, h, opt), new THREE.WebGLRenderTarget(w, h, opt)];
    this.rtOld = new THREE.WebGLRenderTarget(w, h, opt);
    const w1 = Math.max(16, Math.round(w / 4)), h1 = Math.max(16, Math.round(h / 4));
    const w2 = Math.max(8, Math.round(w / 16)), h2 = Math.max(8, Math.round(h / 16));
    this.rtB1a = new THREE.WebGLRenderTarget(w1, h1, opt); this.rtB1b = new THREE.WebGLRenderTarget(w1, h1, opt);
    this.rtB2a = new THREE.WebGLRenderTarget(w2, h2, opt); this.rtB2b = new THREE.WebGLRenderTarget(w2, h2, opt);
    const hk = 480 / Math.max(vw, vh);
    this.hist = new THREE.WebGLArrayRenderTarget(Math.round(vw * hk), Math.round(vh * hk), HIST, { depthBuffer: false });
    this.hist.texture.magFilter = THREE.LinearFilter; this.hist.texture.minFilter = THREE.LinearFilter;
    this.scene.uniforms.uHist!.value = this.hist.texture;
    this.material.uniforms.uRes!.value.set(w, h);
  }

  private pass(renderer: THREE.WebGLRenderer, mat: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null, layer = 0): void {
    this.quad.material = mat;
    renderer.setRenderTarget(target, layer);
    renderer.render(this.quadScene, this.cam);
  }

  /** steps 2–4, before the frame is drawn; the grade (step 5) is the background quad itself */
  render(renderer: THREE.WebGLRenderer, vw: number, vh: number): void {
    this.targets(renderer, vw, vh);
    const prevTarget = renderer.getRenderTarget();
    // 2: this frame's cut-out into the history
    this.head = (this.head + 1) % HIST;
    this.pass(renderer, this.cut, this.hist as unknown as THREE.WebGLRenderTarget, this.head);
    this.scene.uniforms.uHead!.value = this.head;
    // 3: the scene, reading the last one
    const cur = this.rtScene[this.flip]!, prev = this.rtScene[1 - this.flip]!;
    this.flip = 1 - this.flip;
    this.scene.uniforms.uPrev!.value = prev.texture;
    this.pass(renderer, this.scene, cur);
    // a preset changing: the old one drawn too, for the grade to cross from (0.45 s)
    this.started = true;
    const f = this.material.uniforms;
    if (this.xfade < 1) {
      this.xfade = Math.min(1, this.xfade + this.frameDt / 0.45);
      const code = this.scene.uniforms.uPreset!.value;
      this.scene.uniforms.uPreset!.value = this.fromCode;
      this.pass(renderer, this.scene, this.rtOld);
      this.scene.uniforms.uPreset!.value = code;
      f.uOld!.value = this.rtOld!.texture;
    }
    const e = this.xfade;
    f.uMix!.value = e * e * (3 - 2 * e);
    // 4: bloom
    const b = this.bright.uniforms, bl = this.blur.uniforms;
    b.uSrc!.value = cur.texture; (b.uTexel!.value as THREE.Vector2).set(1 / cur.width, 1 / cur.height);
    this.pass(renderer, this.bright, this.rtB1a);
    const blur2 = (a: THREE.WebGLRenderTarget, c: THREE.WebGLRenderTarget, times: number) => {
      for (let i = 0; i < times; i++) {
        bl.uSrc!.value = a.texture; (bl.uDir!.value as THREE.Vector2).set(1.4 / a.width, 0); this.pass(renderer, this.blur, c);
        bl.uSrc!.value = c.texture; (bl.uDir!.value as THREE.Vector2).set(0, 1.4 / a.height); this.pass(renderer, this.blur, a);
      }
    };
    blur2(this.rtB1a!, this.rtB1b!, 1);
    b.uSrc!.value = this.rtB1a!.texture; (b.uTexel!.value as THREE.Vector2).set(1 / this.rtB1a!.width, 1 / this.rtB1a!.height);
    const th = b.uThreshold!.value as number;
    b.uThreshold!.value = 0;
    this.pass(renderer, this.bright, this.rtB2a);
    b.uThreshold!.value = th;
    blur2(this.rtB2a!, this.rtB2b!, 2);
    renderer.setRenderTarget(prevTarget);
    f.uScene!.value = cur.texture; f.uBloom1!.value = this.rtB1a!.texture; f.uBloom2!.value = this.rtB2a!.texture;
  }
}
