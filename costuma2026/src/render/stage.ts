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

interface Wearer {
  trackId: number;
  def: CharacterDef;
  root: THREE.Object3D;
  rig: Rig;
  mats: THREE.Material[];
  fade: number;
}

const BG_VERT = /* glsl */ `
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
  private videoTex: THREE.VideoTexture | null = null;
  private readonly templates = new Map<string, Built>();
  private readonly wearers = new Map<number, Wearer>();
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
    this.bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
      vertexShader: BG_VERT, fragmentShader: BG_FRAG, depthTest: false, depthWrite: false, toneMapped: false,
      uniforms: { uTex: { value: null }, uCrop: { value: new THREE.Vector4(0, 0, 1, 1) }, uMirror: { value: 0 } },
    }));
    this.bg.frustumCulled = false;
    this.bg.renderOrder = -1000;
    this.scene.add(this.bg);
    this.scene.add(this.world);
    this.scene.add(this.camera);
    this.light = new CameraLight(this.renderer, this.scene, this.world);
  }

  setVideo(video: HTMLVideoElement): void {
    this.videoTex?.dispose();
    const t = new THREE.VideoTexture(video);
    t.colorSpace = THREE.NoColorSpace; // shown exactly as the camera gave it
    t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = false;
    this.videoTex = t;
    this.bg.material.uniforms.uTex!.value = t;
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
    this.bg.material.uniforms.uCrop!.value.set(u0, v0, visW / K.w, visH / K.h);
    this.bg.material.uniforms.uMirror!.value = mirror ? 1 : 0;
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
    const w: Wearer = { trackId, def: tpl.def, root, rig: new Rig(tpl.def.segs, bones), mats: [...copies.values()], fade: 0 };
    this.world.add(root);
    this.wearers.set(trackId, w);
    return w;
  }

  private drop(w: Wearer): void {
    this.world.remove(w.root);
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
    w.root.visible = fade > 0.01;
    def.tick?.(w.root, t);
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
