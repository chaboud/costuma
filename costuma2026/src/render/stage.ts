// The picture: the camera frame as a full-screen background (cover-fitted, mirrored for a selfie), and over it each
// tracked person's costume, placed in camera space and drawn through a perspective camera with the same intrinsics the
// pose solve used — so the costume lands on the person whatever the focal length guess (pose/solve.ts).
import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { buildCharacter, type Built, type CharacterDef } from '../characters/build';
import { byId } from '../characters/roster';
import { Rig, poseFromLandmarks } from '../pose/rig';
import type { Track } from '../pose/tracker';
import type { Intrinsics } from '../pose/solve';
import { CameraLight } from './envlight';
import { Ground } from '../pose/ground';

interface Wearer {
  trackId: number;
  def: CharacterDef;
  root: THREE.Object3D;
  rig: Rig;
  mats: THREE.Material[];
  fade: number;
  /** the bones in a fixed order, and a ring of their past poses (the pyramid's canon) */
  boneList: THREE.Bone[];
  hist: Float32Array[];
  histHead: number;
  clones: { root: THREE.Object3D; bones: THREE.Bone[]; row: number; col: number; shadow: THREE.Mesh }[];
}

// a soft dark patch where a clone meets the floor: what makes something inserted look like it stands there
const SHADOW_MAT = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, toneMapped: false,
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: 'varying vec2 vUv; void main() { float r = length(vUv - 0.5) * 2.0; gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5 * pow(clamp(1.0 - r, 0.0, 1.0), 1.6)); }',
});
const SHADOW_GEO = new THREE.PlaneGeometry(1, 1);

/** past poses kept per wearer; the back row of the pyramid dances this many frames late at most */
const POSE_HIST = 12;

export const BG_VERT = /* glsl */ `
  varying vec2 vUv;
  uniform vec4 uCrop; // u0, v0, du, dv of the video shown
  uniform float uMirror;
  void main() {
    vec2 uv = position.xy * 0.5 + 0.5;
    uv.x = mix(uv.x, 1.0 - uv.x, uMirror);
    vUv = uCrop.xy + uv * uCrop.zw;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }`;
const BG_FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uTex;
  void main() { gl_FragColor = vec4(texture2D(uTex, vUv).rgb, 1.0); }`;

export interface StageOptions { size: number; shadows: boolean; envLight: boolean; pixelRatio: number }

export class Stage {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(50, 1, 0.05, 60);
  /** everything in camera space; scale.x = -1 mirrors it with the selfie view */
  readonly world = new THREE.Group();
  readonly light: CameraLight;
  private readonly bg: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  /** the background's shared uniforms: any background material (party.ts) takes these same objects */
  readonly bgUniforms = { uTex: { value: null as THREE.Texture | null }, uCrop: { value: new THREE.Vector4(0, 0, 1, 1) }, uMirror: { value: 0 } };
  private readonly plainBg: THREE.ShaderMaterial;
  private videoTex: THREE.VideoTexture | null = null;
  private readonly templates = new Map<string, Built>();
  private readonly wearers = new Map<number, Wearer>();
  /** the dance pyramid in 3D: each wearer's costume cloned behind and above them, dancing their moves late (party) */
  pyramid = false;
  /** the wearers themselves undressed (party's "behind you": only their pyramid shows, and they stay in front) */
  hideWearers = false;
  /** the floor (pose/ground.ts): the pyramid stands on it */
  ground = new Ground();
  /** drawn after everything: the cut-out people over the costumes (party.ts foreground) */
  private readonly fg: THREE.Mesh<THREE.PlaneGeometry, THREE.Material>;
  /** party mode's stage lights on the costumes: two coloured rims from behind, pulsing with the beat */
  readonly rims = [new THREE.DirectionalLight(0xff2d95, 0), new THREE.DirectionalLight(0x2ee6ff, 0)];
  opts: StageOptions = { size: 1, shadows: true, envLight: true, pixelRatio: Math.min(window.devicePixelRatio || 1, 2) };
  /** where the video falls on the canvas: scale (canvas px per video px) and the visible crop, for the debug overlay */
  cover = { s: 1, ox: 0, oy: 0, vw: 1, vh: 1, cw: 1, ch: 1, mirror: false };

  constructor(readonly canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(this.opts.pixelRatio);
    this.plainBg = new THREE.ShaderMaterial({
      vertexShader: BG_VERT, fragmentShader: BG_FRAG, depthTest: false, depthWrite: false, toneMapped: false,
      uniforms: this.bgUniforms,
    });
    this.bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.plainBg);
    this.fg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.plainBg);
    this.fg.frustumCulled = false;
    this.fg.renderOrder = 1000;
    this.fg.visible = false;
    this.bg.frustumCulled = false;
    this.bg.renderOrder = -1000;
    this.scene.add(this.bg);
    this.scene.add(this.fg);
    this.scene.add(this.world);
    this.scene.add(this.camera);
    this.light = new CameraLight(this.renderer, this.scene, this.world);
    // behind the people, either side and above: they edge the costumes in colour (no shadows: a rim, not a key)
    this.rims[0]!.position.set(-3, 2.5, -6); this.rims[1]!.position.set(3, 2.5, -6);
    for (const r of this.rims) { r.target.position.set(0, 0, -3); this.scene.add(r, r.target); }
  }

  setVideo(video: HTMLVideoElement): void {
    this.videoTex?.dispose();
    const t = new THREE.VideoTexture(video);
    t.colorSpace = THREE.NoColorSpace; // shown exactly as the camera gave it
    t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = false;
    this.videoTex = t;
    this.bgUniforms.uTex.value = t;
  }

  /** the background's look: the camera frame as it is, or another material on the same uniforms (party mode) */
  setBackground(m: THREE.ShaderMaterial | null): void {
    this.bg.material = m ?? this.plainBg;
  }
  /** a full-screen layer over the 3D scene (or none) */
  setForeground(m: THREE.ShaderMaterial | null): void {
    this.fg.visible = !!m;
    if (m) this.fg.material = m;
  }

  /** build (once) and keep a character; slow (marching cubes), so call it while showing something */
  template(id: string): Built {
    let b = this.templates.get(id);
    if (!b) { b = buildCharacter(byId(id)); this.templates.set(id, b); }
    return b;
  }
  hasTemplate(id: string): boolean { return this.templates.has(id); }

  /** fit the camera and the background to the canvas and the video (cover), with the solve's intrinsics */
  layout(K: Intrinsics, mirror: boolean): void {
    const cw = this.canvas.clientWidth || window.innerWidth, ch = this.canvas.clientHeight || window.innerHeight;
    const pr = this.opts.pixelRatio;
    if (this.renderer.getPixelRatio() !== pr) this.renderer.setPixelRatio(pr);
    const size = this.renderer.getSize(new THREE.Vector2());
    if (size.x !== cw || size.y !== ch) this.renderer.setSize(cw, ch, false);
    const s = Math.max(cw / K.w, ch / K.h);
    const visW = cw / s, visH = ch / s;
    const u0 = (K.w - visW) / 2 / K.w, v0 = (K.h - visH) / 2 / K.h;
    // texture v runs bottom-up while the video's rows run top-down; VideoTexture's flipY makes v=1 the top row
    this.bgUniforms.uCrop.value.set(u0, v0, visW / K.w, visH / K.h);
    this.bgUniforms.uMirror.value = mirror ? 1 : 0;
    this.camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(visH / 2 / K.f));
    this.camera.aspect = cw / ch;
    this.camera.updateProjectionMatrix();
    this.world.scale.x = mirror ? -1 : 1;
    this.cover = { s, ox: (K.w - visW) / 2, oy: (K.h - visH) / 2, vw: K.w, vh: K.h, cw, ch, mirror };
  }

  /** dress the tracked people: `cast(trackId)` says which character each wears */
  sync(tracks: Track[], cast: (trackId: number) => string, t: number): void {
    const keep = new Set<number>();
    for (const tr of tracks) {
      const id = cast(tr.id);
      if (!this.templates.has(id)) continue; // being built; dressed next frame
      keep.add(tr.id);
      let w = this.wearers.get(tr.id);
      if (w && w.def.id !== id) { this.drop(w); w = undefined; }
      if (!w) w = this.dress(tr.id, id);
      this.pose(w, tr, t);
    }
    for (const [id, w] of this.wearers) if (!keep.has(id)) this.drop(w);
  }

  private dress(trackId: number, id: string): Wearer {
    const tpl = this.template(id);
    const root = SkeletonUtils.clone(tpl.root);
    const bones = new Map<string, THREE.Bone>();
    root.traverse((o) => { if ((o as THREE.Bone).isBone) bones.set(o.name, o as THREE.Bone); });
    // each wearer fades on its own: its own copies of the materials (keeping the shader hooks, which clone() drops)
    const copies = new Map<THREE.Material, THREE.Material>();
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const swap = (mat: THREE.Material) => {
        let c = copies.get(mat);
        if (!c) {
          c = mat.clone();
          c.onBeforeCompile = mat.onBeforeCompile;
          c.customProgramCacheKey = mat.customProgramCacheKey;
          c.alphaHash = true;
          copies.set(mat, c);
        }
        return c;
      };
      m.material = Array.isArray(m.material) ? m.material.map(swap) : swap(m.material);
    });
    const boneList = tpl.def.segs.map((sg) => bones.get(sg.name)!).filter(Boolean);
    const w: Wearer = { trackId, def: tpl.def, root, rig: new Rig(tpl.def.segs, bones), mats: [...copies.values()], fade: 0,
      boneList, hist: Array.from({ length: POSE_HIST }, () => new Float32Array(boneList.length * 7)), histHead: 0, clones: [] };
    this.world.add(root);
    this.wearers.set(trackId, w);
    return w;
  }

  private drop(w: Wearer): void {
    this.world.remove(w.root);
    for (const c of w.clones) this.world.remove(c.root, c.shadow);
    for (const m of w.mats) m.dispose();
    this.wearers.delete(w.trackId);
  }

  private pose(w: Wearer, tr: Track, t: number): void {
    const def = w.def, rig = w.rig;
    const p = poseFromLandmarks(tr.world);
    const s = (tr.len.torso / rig.torso) * (def.fit?.size ?? 1) * this.opts.size;
    const limb = def.fit?.limb ?? 0;
    const fitLen = (bone: string, person: number) => {
      const k = 1 + ((person / s) / (rig.len.get(bone) ?? 1) - 1) * limb;
      rig.setLength(bone, Math.min(1.6, Math.max(0.65, k)));
    };
    for (const side of ['L', 'R']) { fitLen('arm' + side, tr.len.upperArm); fitLen('thigh' + side, tr.len.thigh); fitLen('shin' + side, tr.len.shin); }
    const kn = rig.neckFit(tr.len.neck / s);
    rig.setNeck(1 + (Math.min(1.25, Math.max(0.45, kn)) - 1) * (def.fit?.head ?? 0.85));
    rig.apply(p, t, def.idle?.tail ?? 0);
    w.root.position.set(tr.T.x, tr.T.y, tr.T.z);
    w.root.scale.setScalar(s);
    const fade = tr.presence * tr.presence * (3 - 2 * tr.presence);
    if (fade !== w.fade) { for (const m of w.mats) m.opacity = fade; w.fade = fade; }
    w.root.visible = fade > 0.01 && !this.hideWearers;
    def.tick?.(w.root, t);
    // the pose into the ring
    w.histHead = (w.histHead + 1) % POSE_HIST;
    const h = w.hist[w.histHead]!;
    w.boneList.forEach((b, i) => { b.quaternion.toArray(h, i * 7); b.position.toArray(h, i * 7 + 4); });
    this.posePyramid(w, s, fade, t);
  }

  /**
   * Rows behind and above the wearer, each one more than the last, each row later: a canon. In camera space: back is
   * away from the camera, up is up; perspective makes the back rows smaller on its own. Fewer rows when several people
   * dance, so the triangle count stays a phone's.
   */
  private posePyramid(w: Wearer, s: number, fade: number, t: number): void {
    const rows = this.pyramid ? (this.wearers.size > 1 ? 2 : 3) : 0;
    const want: [number, number][] = [];
    for (let r = 1; r <= rows; r++) for (let j = 0; j <= r; j++) want.push([r, j]);
    while (w.clones.length > want.length) { const c = w.clones.pop()!; this.world.remove(c.root, c.shadow); }
    while (w.clones.length < want.length) {
      const root = SkeletonUtils.clone(w.root);
      // the clone shares the wearer's (fading) materials; SkeletonUtils.clone already does, and drops its own clones
      root.traverse((o) => { o.castShadow = false; });
      const bones = new Map<string, THREE.Bone>();
      root.traverse((o) => { if ((o as THREE.Bone).isBone) bones.set(o.name, o as THREE.Bone); });
      const [row, col] = want[w.clones.length]!;
      const shadow = new THREE.Mesh(SHADOW_GEO, SHADOW_MAT);
      shadow.renderOrder = 1;
      w.clones.push({ root, bones: w.def.segs.map((sg) => bones.get(sg.name)!).filter(Boolean), row, col, shadow });
      this.world.add(root, shadow);
    }
    // on the floor: the wearer's hips dropped to it, then rows back along it and across it, the hips at the wearer's
    // height above it; perspective shrinks and raises the back rows by itself
    const height = w.rig.torso * s * 3.2; // about the costume's height, metres
    const g = this.ground, { back, side } = g.axes();
    const hip = w.root.position, foot = g.foot(hip), up = g.height(hip);
    const flat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), g.n);
    for (const c of w.clones) {
      const fj = c.col - c.row / 2;
      const delay = Math.round(c.row * 3 + Math.abs(fj) * 1.5);
      const h = w.hist[(w.histHead - delay + POSE_HIST * 4) % POSE_HIST]!;
      c.bones.forEach((b, i) => { b.quaternion.fromArray(h, i * 7); b.position.fromArray(h, i * 7 + 4); });
      const at = foot.clone().addScaledVector(back, c.row * height * 0.5).addScaledVector(side, fj * height * 0.55);
      c.root.position.copy(at).addScaledVector(g.n, up);
      c.root.scale.copy(w.root.scale);
      c.root.visible = fade > 0.01;
      c.shadow.position.copy(at).addScaledVector(g.n, 0.004);
      c.shadow.quaternion.copy(flat);
      c.shadow.scale.set(height * 0.42, height * 0.26, 1);
      c.shadow.visible = c.root.visible;
      w.def.tick?.(c.root, t - delay / 30);
    }
  }

  /** the party's rim lights: `on`, their colours along the show's palette, a kick on the beat */
  stageLights(on: boolean, t: number, beat: number): void {
    const pal = [0xff2994, 0xb3ff29, 0xffe029, 0x29e0ff, 0x8c2eff];
    this.rims.forEach((r, i) => {
      // intensity always set (a light that comes and goes would recompile every lit shader: Strollzilla's lesson)
      r.intensity = on ? 2.2 + 3.0 * beat : 0;
      const k = (t * 0.12 + i * 0.4) % 1 * pal.length, a = Math.floor(k), f = k - a;
      r.color.setHex(pal[a % pal.length]!).lerp(new THREE.Color(pal[(a + 1) % pal.length]!), f);
    });
  }

  /** hip centres of the dressed people (for the light's shadow box) */
  people(): THREE.Vector3[] {
    return [...this.wearers.values()].filter((w) => w.root.visible).map((w) => w.root.position.clone());
  }

  render(video: HTMLVideoElement | null, K: Intrinsics, frame: number): void {
    this.renderer.shadowMap.enabled = this.opts.shadows;
    if (video) this.light.update(video, K, this.cover.mirror, frame, this.people(), this.opts.envLight);
    this.renderer.render(this.scene, this.camera);
  }

  get count(): number { return this.wearers.size; }
}
