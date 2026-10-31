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

const EW = 128, EH = 64; // equirect: 32-texel cube faces after PMREM, sharp enough for a glossy reflection
const SW = 96, SH = 72;  // the sampled frame
const BW = 12, BH = 9;   // its blurred copy (past the frame's edge, and the unseen side)
const FW = 24;           // a face's crop, for reading how it is lit

export const LIGHT_TUNE = {
  /** how much wider than the lens the frame is spread over the scene side (1: exactly as the lens saw it, so a reflection
   *  lines up with the picture behind it; past the frame's edge the picture blurs out) */
  spread: 1.0,
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
  /**
   * The light read off the people in view (stage.ts sets it each frame): the largest read face's probe points (forehead,
   * chin, their left cheek, right cheek, nose) in image coordinates and its width (a share of the image's). A face is a
   * light meter the camera carries for free: its sides say where the light on people comes from — including from behind
   * the camera, which the frame cannot show — and its brightness how strong it is.
   */
  face: { probe: { x: number; y: number }[]; w: number } | null = null;
  /** read-outs: the face's verdict (direction in display space, irradiance proxy, confidence) */
  faceDir = new THREE.Vector3(0, 0, 1);
  faceLum = 0;
  faceConf = 0;
  private readonly fcv: HTMLCanvasElement;
  private readonly fctx: CanvasRenderingContext2D;
  dir = new THREE.Vector3(0, 1, 1).normalize();
  private target = new THREE.Vector3(0, 0, -2);

  constructor(private readonly renderer: THREE.WebGLRenderer, private readonly scene: THREE.Scene, world: THREE.Group) {
    this.cv = document.createElement('canvas');
    this.cv.width = SW; this.cv.height = SH;
    this.ctx = this.cv.getContext('2d', { willReadFrequently: true })!;
    this.fcv = document.createElement('canvas');
    this.fcv.width = this.fcv.height = FW;
    this.fctx = this.fcv.getContext('2d', { willReadFrequently: true })!;
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
    this.readFace(video, mirror);
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
    // the unseen side (behind the camera, what lights people's fronts) is the frame mirrored and blurred — a guess; a
    // face in view measures it: its brightness against the guess's scales the unseen side, as far as we trust the face
    let backMean = 0;
    for (let i = 0; i < BW * BH; i++) backMean += 0.2126 * this.blur[i * 3]! + 0.7152 * this.blur[i * 3 + 1]! + 0.0722 * this.blur[i * 3 + 2]!;
    backMean /= BW * BH;
    // a face of albedo ~0.35 under irradiance E reads E·0.35/π·π… as a ratio: what the face says the front gets over
    // what the mirror guessed, clamped (skin's albedo varies two-fold; this is a nudge, not a measurement)
    const faceBack = this.faceConf > 0 ? Math.min(2.5, Math.max(0.4, (this.faceLum / 0.35) / Math.max(backMean * 2.2, 1e-3))) : 1;
    const backK = LIGHT_TUNE.back * (1 + (faceBack - 1) * this.faceConf);
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
        const depth = Math.max(Math.abs(dz), 0.05);
        const u0 = 0.5 + (sxDir / depth) * fxn / LIGHT_TUNE.spread, v0 = 0.5 - (cy / depth) * fyn / LIGHT_TUNE.spread;
        const u = Math.min(1, Math.max(0, u0)), v = Math.min(1, Math.max(0, v0));
        const bi = (Math.min(BH - 1, Math.floor(v * BH)) * BW + Math.min(BW - 1, Math.floor(u * BW))) * 3;
        let R: number, G: number, B: number;
        if (seen) {
          // inside the frame exactly as filmed; past its edge the edge's colour, blurring out (not stretched streaks)
          const i = (Math.min(SH - 1, Math.floor(v * SH)) * SW + Math.min(SW - 1, Math.floor(u * SW))) * 3;
          const over = Math.max(Math.abs(u0 - 0.5) - 0.5, Math.abs(v0 - 0.5) - 0.5, 0), b = Math.min(1, over / 0.4);
          R = this.lin[i]! + (this.blur[bi]! - this.lin[i]!) * b;
          G = this.lin[i + 1]! + (this.blur[bi + 1]! - this.lin[i + 1]!) * b;
          B = this.lin[i + 2]! + (this.blur[bi + 2]! - this.lin[i + 2]!) * b;
        } else {
          R = this.blur[bi]! * backK; G = this.blur[bi + 1]! * backK; B = this.blur[bi + 2]! * backK;
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
    // the key: the environment's brightest direction, turned toward where the faces say the light comes from
    const envDir = len > 1e-6 ? new THREE.Vector3(sx / len, sy / len, sz / len) : this.keyDir.clone();
    const want = envDir.clone().lerp(this.faceDir, 0.65 * this.faceConf).normalize();
    this.keyDir.lerp(want, 0.25).normalize();
    this.dir.copy(this.keyDir);
    // a key from straight below reads as a horror torch; keep it at least a little above the horizon
    if (this.dir.y < 0.15) { this.dir.y = 0.15; this.dir.normalize(); }
    // a face lit hard from one side (its sides differ a lot) asks for a stronger key than a flat-lit one
    const faceShare = this.faceConf > 0 ? Math.min(1, this.faceDir.clone().setZ(0).length() * 1.4) : this.share;
    const ki = LIGHT_TUNE.key * (this.share + (faceShare - this.share) * this.faceConf * 0.6) * (tot / (EW * EH)) * 2;
    this.keyI += (ki - this.keyI) * (this.keyI === 0 ? 1 : 0.25);
    this.key.intensity = this.keyI;
    // the neutral fill is for dark streets only: in a bright room it lifts the costumes to milk
    this.fill.intensity = LIGHT_TUNE.fill * (this.realism ? 0.25 : 1) * Math.min(1, Math.max(0, 1 - this.mean / 0.22));
    this.key.position.copy(this.target).addScaledVector(this.dir, 4);
  }

  /** read the largest face's light: its probes' brightness from a small crop of the frame (image space → display) */
  private readFace(video: HTMLVideoElement, mirror: boolean): void {
    const f = this.face;
    if (!f || f.w < 0.04) { this.faceConf *= 0.9; return; }
    const xs = f.probe.map((p) => p.x), ys = f.probe.map((p) => p.y);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const pad = 0.15, w = (x1 - x0) * (1 + pad * 2), h = (y1 - y0) * (1 + pad * 2);
    const cx0 = x0 - (x1 - x0) * pad, cy0 = y0 - (y1 - y0) * pad;
    const vw = video.videoWidth, vh = video.videoHeight;
    if (w <= 0 || h <= 0 || !vw) return;
    this.fctx.drawImage(video, cx0 * vw, cy0 * vh, w * vw, h * vh, 0, 0, FW, FW);
    const px = this.fctx.getImageData(0, 0, FW, FW).data;
    // each probe: the mean of a 3×3 patch round it
    const lum = f.probe.map((p) => {
      const gx = Math.round(((p.x - cx0) / w) * (FW - 1)), gy = Math.round(((p.y - cy0) / h) * (FW - 1));
      let s = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const x = Math.min(FW - 1, Math.max(0, gx + dx)), y = Math.min(FW - 1, Math.max(0, gy + dy)), k = (y * FW + x) * 4;
        s += 0.2126 * srgbToLin[px[k]!]! + 0.7152 * srgbToLin[px[k + 1]!]! + 0.0722 * srgbToLin[px[k + 2]!]!; n++;
      }
      return s / n;
    });
    const [fore, chin, left, right, nose] = lum as [number, number, number, number, number];
    const mean = (fore + chin + left + right + nose) / 5;
    // the person's left cheek is on the image's right (+x, unmirrored); a brighter forehead means light from above
    const gx = (left - right) / Math.max(left + right, 1e-4), gy = (fore - chin) / Math.max(fore + chin, 1e-4);
    // up/down is read weakly and leans above: the chin's probe sits by collars, beards and a smile's teeth (a test
    // portrait lit from above read as lit from below, 2026-10-31), and real light comes from below only on a stage
    const d = new THREE.Vector3(gx * 2.2 * (mirror ? -1 : 1), Math.max(0.1, gy * 1.0 + 0.35), 0.75).normalize();
    // trust grows with the face's size in the frame (small faces are a few pixels of noise)
    const conf = Math.min(1, Math.max(0, (f.w - 0.04) / 0.08));
    this.faceDir.lerp(d, 0.3).normalize();
    this.faceLum += (mean - this.faceLum) * 0.3;
    this.faceConf += (conf - this.faceConf) * 0.3;
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
