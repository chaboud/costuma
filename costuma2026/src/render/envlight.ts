// Light from the camera. The costume should look lit by the room it stands in, so the camera frame itself becomes the
// light: a few times a second it is folded into a small equirectangular environment around the wearer and prefiltered
// (PMREM) for the physically based materials, which then take their diffuse and their reflections from it; and the
// brightest direction of that environment becomes a key light with soft shadows, which gives the figure its shape.
//
// The fold: directions into the scene (away from the camera) see the frame as the camera saw it, spread wider than the
// lens so it reaches round the sides; directions back toward the camera — the side that lights the wearer's front,
// which the camera cannot see — see the frame mirrored and blurred (a guess: rooms are roughly alike all round). Up
// takes the top of the frame, down the bottom: a ceiling light lights from above, a floor bounces from below. This is
// image-based lighting in the sense of Debevec's light probes, with a camera standing in for the probe. It is a guess at
// the unseen hemisphere, not a measurement of it.
import * as THREE from 'three';
import type { Intrinsics } from '../pose/solve';

const EW = 64, EH = 32;  // equirect
const SW = 48, SH = 36;  // the sampled frame
const BW = 12, BH = 9;   // its blurred copy (the unseen side)

export const LIGHT_TUNE = {
  /** how much wider than the lens the frame is spread over the scene side */
  spread: 1.6,
  /** the unseen side's brightness relative to the seen */
  back: 0.9,
  envIntensity: 1.15,
  /** key light: its intensity per unit of directional share × mean radiance */
  key: 5.0,
  /** frames between updates */
  every: 6,
  /**
   * a dim frame is brightened toward this mean (linear) for the costume's light, never darkened, by at most `maxGain`:
   * a camera's auto-exposure already lifts a dark room, but a costume lit at a dark street's level reads as mud
   */
  targetMean: 0.22, maxGain: 2.8,
  /** a little neutral light always: a costume's colours must still read in a dark street (a costume, not a forensic match) */
  fill: 0.35,
};

const srgbToLin = new Float32Array(256).map((_, i) => { const c = i / 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });

export class CameraLight {
  readonly key = new THREE.DirectionalLight(0xffffff, 1);
  readonly fill = new THREE.HemisphereLight(0xffffff, 0x444444, 0.0);
  private readonly cv: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly lin = new Float32Array(SW * SH * 3);
  private readonly blur = new Float32Array(BW * BH * 3);
  private readonly data = new Uint16Array(EW * EH * 4);
  /** the environment's radiance, smoothed over time (an EMA per texel): a step in the frame is a glide in the light */
  private readonly smooth = new Float32Array(EW * EH * 3);
  private primed = false;
  private readonly keyDir = new THREE.Vector3(0, 1, 1).normalize();
  private keyI = 0;
  private readonly tex: THREE.DataTexture;
  private readonly pmrem: THREE.PMREMGenerator;
  private rt: THREE.WebGLRenderTarget | null = null;
  /** read-outs for the debug panel */
  mean = 0;
  share = 0;
  gain = 1;
  /** In Situ: light the costumes as the room is lit (no lifting a dark room; the club's spots give the punch) */
  realism = false;
  dir = new THREE.Vector3(0, 1, 1).normalize();
  private target = new THREE.Vector3(0, 0, -2);

  constructor(private readonly renderer: THREE.WebGLRenderer, private readonly scene: THREE.Scene, world: THREE.Group) {
    this.cv = document.createElement('canvas');
    this.cv.width = SW; this.cv.height = SH;
    this.ctx = this.cv.getContext('2d', { willReadFrequently: true })!;
    this.tex = new THREE.DataTexture(this.data, EW, EH, THREE.RGBAFormat, THREE.HalfFloatType);
    this.tex.mapping = THREE.EquirectangularReflectionMapping;
    this.tex.colorSpace = THREE.LinearSRGBColorSpace;
    this.tex.magFilter = THREE.LinearFilter; this.tex.minFilter = THREE.LinearFilter;
    this.pmrem = new THREE.PMREMGenerator(renderer);
    this.key.castShadow = true;
    this.key.shadow.mapSize.set(1024, 1024);
    this.key.shadow.bias = -0.0005;
    this.key.shadow.normalBias = 0.02;
    this.key.shadow.radius = 4;
    // the light and its target live in world space; positions are set from the (mirrored) camera frame each update
    scene.add(this.key);
    scene.add(this.key.target);
    scene.add(this.fill);
    void world;
    // until the first frame: a soft neutral room
    this.fill.intensity = 1.0;
  }

  update(video: HTMLVideoElement, K: Intrinsics, mirror: boolean, frame: number, people: THREE.Vector3[], on: boolean): void {
    this.aimShadows(people, mirror);
    if (!on) {
      this.scene.environment = null;
      this.fill.intensity = 1.2; this.key.intensity = 1.6; this.key.position.copy(this.target).add(new THREE.Vector3(1.5, 3, 2.5));
      return;
    }
    if (frame % LIGHT_TUNE.every !== 0 && this.rt) return;
    if (video.readyState < 2 || !video.videoWidth) return;
    this.ctx.drawImage(video, 0, 0, SW, SH);
    const px = this.ctx.getImageData(0, 0, SW, SH).data;
    let mean = 0;
    for (let i = 0, j = 0; i < SW * SH; i++, j += 4) {
      const r = srgbToLin[px[j]!]!, g = srgbToLin[px[j + 1]!]!, b = srgbToLin[px[j + 2]!]!;
      this.lin[i * 3] = r; this.lin[i * 3 + 1] = g; this.lin[i * 3 + 2] = b;
      mean += 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    this.mean = mean / (SW * SH);
    this.gain = Math.min(this.realism ? 1.25 : LIGHT_TUNE.maxGain, Math.max(1, LIGHT_TUNE.targetMean / Math.max(this.mean, 1e-3)));
    const gain = this.gain;
    // the blurred copy: box means
    this.blur.fill(0);
    const fx = SW / BW, fy = SH / BH;
    for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) {
      const bi = (Math.floor(y / fy) * BW + Math.floor(x / fx)) * 3, si = (y * SW + x) * 3;
      const B = this.blur; B[bi] = B[bi]! + this.lin[si]!; B[bi + 1] = B[bi + 1]! + this.lin[si + 1]!; B[bi + 2] = B[bi + 2]! + this.lin[si + 2]!;
    }
    for (let i = 0; i < this.blur.length; i++) this.blur[i] = this.blur[i]! / (fx * fy);
    // fold into the equirect (three's convention: u = atan(z, x)/2π + .5, v = asin(y)/π + .5, row 0 at the bottom)
    const fxn = K.f / K.w, fyn = K.f / K.h;
    let sx = 0, sy = 0, sz = 0, tot = 0;
    for (let r = 0; r < EH; r++) {
      const lat = ((r + 0.5) / EH - 0.5) * Math.PI;
      const cy = Math.sin(lat), cl = Math.cos(lat);
      for (let c = 0; c < EW; c++) {
        const a = ((c + 0.5) / EW - 0.5) * Math.PI * 2;
        let dx = Math.cos(a) * cl;
        const dz = Math.sin(a) * cl;
        // the env is built in the displayed (mirrored) world, sampled from the camera's own frame
        const sxDir = mirror ? -dx : dx;
        const seen = dz < 0;
        const depth = Math.max(Math.abs(dz), 0.08);
        const u = Math.min(1, Math.max(0, 0.5 + (sxDir / depth) * fxn / LIGHT_TUNE.spread));
        const v = Math.min(1, Math.max(0, 0.5 - (cy / depth) * fyn / LIGHT_TUNE.spread));
        let R: number, G: number, B: number;
        if (seen) {
          const i = (Math.min(SH - 1, Math.floor(v * SH)) * SW + Math.min(SW - 1, Math.floor(u * SW))) * 3;
          R = this.lin[i]!; G = this.lin[i + 1]!; B = this.lin[i + 2]!;
        } else {
          const i = (Math.min(BH - 1, Math.floor(v * BH)) * BW + Math.min(BW - 1, Math.floor(u * BW))) * 3;
          R = this.blur[i]! * LIGHT_TUNE.back; G = this.blur[i + 1]! * LIGHT_TUNE.back; B = this.blur[i + 2]! * LIGHT_TUNE.back;
        }
        R *= gain; G *= gain; B *= gain;
        // ~0.6 s to follow a change (updates come every few frames)
        const si = (r * EW + c) * 3, kk = this.primed ? 0.28 : 1;
        R = this.smooth[si] = this.smooth[si]! + (R - this.smooth[si]!) * kk;
        G = this.smooth[si + 1] = this.smooth[si + 1]! + (G - this.smooth[si + 1]!) * kk;
        B = this.smooth[si + 2] = this.smooth[si + 2]! + (B - this.smooth[si + 2]!) * kk;
        const k = (r * EW + c) * 4;
        this.data[k] = THREE.DataUtils.toHalfFloat(R); this.data[k + 1] = THREE.DataUtils.toHalfFloat(G);
        this.data[k + 2] = THREE.DataUtils.toHalfFloat(B); this.data[k + 3] = THREE.DataUtils.toHalfFloat(1);
        const lum = 0.2126 * R + 0.7152 * G + 0.0722 * B, w = lum * cl; // solid angle ∝ cos(lat)
        dx = Math.cos(a) * cl;
        sx += w * dx; sy += w * cy; sz += w * dz; tot += w;
      }
    }
    this.primed = true;
    this.tex.needsUpdate = true;
    this.rt = this.pmrem.fromEquirectangular(this.tex, this.rt);
    this.scene.environment = this.rt.texture;
    this.scene.environmentIntensity = LIGHT_TUNE.envIntensity;
    // the key: from the environment's brightest direction, as strong as the light is lopsided
    const len = Math.hypot(sx, sy, sz);
    this.share = tot > 0 ? len / tot : 0;
    if (len > 1e-6) this.keyDir.lerp(new THREE.Vector3(sx / len, sy / len, sz / len), 0.25).normalize();
    this.dir.copy(this.keyDir);
    // a key from straight below reads as a horror torch; keep it at least a little above the horizon
    if (this.dir.y < 0.15) { this.dir.y = 0.15; this.dir.normalize(); }
    const ki = LIGHT_TUNE.key * this.share * (tot / (EW * EH)) * 2;
    this.keyI += (ki - this.keyI) * (this.keyI === 0 ? 1 : 0.25);
    this.key.intensity = this.keyI;
    // the neutral fill is for dark streets only: in a bright room it lifts the costumes to milk
    this.fill.intensity = LIGHT_TUNE.fill * (this.realism ? 0.25 : 1) * Math.min(1, Math.max(0, 1 - this.mean / 0.22));
    this.key.position.copy(this.target).addScaledVector(this.dir, 4);
  }

  /** the shadow box round the people (they stand 1–6 m off; costumes are ~2 m) */
  private aimShadows(people: THREE.Vector3[], mirror: boolean): void {
    if (!people.length) return;
    const c = new THREE.Vector3();
    for (const p of people) c.add(p);
    c.multiplyScalar(1 / people.length);
    if (mirror) c.x = -c.x;
    let r = 1.4;
    for (const p of people) r = Math.max(r, Math.hypot((mirror ? -p.x : p.x) - c.x, p.y - c.y, p.z - c.z) + 1.4);
    this.target.copy(c);
    this.key.target.position.copy(c);
    this.key.position.copy(c).addScaledVector(this.dir, 4);
    const cam = this.key.shadow.camera;
    if (cam.right !== r) { cam.left = -r; cam.right = r; cam.top = r; cam.bottom = -r; cam.near = 0.1; cam.far = 4 + r * 2; cam.updateProjectionMatrix(); }
  }
}
