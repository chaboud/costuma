// The picture: the camera frame as a full-screen background (cover-fitted, mirrored for a selfie), and over it each
// tracked person's costume, placed in camera space and drawn through a perspective camera with the same intrinsics the
// pose solve used — so the costume lands on the person whatever the focal length guess (pose/solve.ts).
import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { buildCharacter, type Built, type CharacterDef, type SurfaceArrays } from '../characters/build';
import { byId } from '../characters/roster';
import { Rig, poseFromLandmarks, type BodyPose } from '../pose/rig';
import type { Track } from '../pose/tracker';
import { project, type Intrinsics } from '../pose/solve';
import { CameraLight } from './envlight';
import { Ground } from '../pose/ground';
import { Googly, type EyePlace } from './googly';
import { Breath, type Mouth } from './breath';
import { L } from '../pose/landmarks';

interface Wearer {
  trackId: number;
  def: CharacterDef;
  root: THREE.Object3D;
  rig: Rig;
  mats: THREE.Material[];
  fade: number;
  /** 0..1: how far this costume has faded in (new) or, leaving, how much is left */
  life: number;
  leaving: boolean;
  /** a ring of the wearer's past poses and body lengths: the pyramid's dancers replay them late, a canon */
  poses: BodyPose[];
  head: number;
  len: Track['len'] | null;
  clones: Clone[];
}

/** a dancer in the pyramid: its own character (the wearer's, or another in a mix), its own rig and fading materials */
interface Clone { id: string; def: CharacterDef; root: THREE.Object3D; rig: Rig; mats: THREE.Material[]; row: number; col: number; shadow: THREE.Mesh }

// a soft dark patch where a clone meets the floor: what makes something inserted look like it stands there
const SHADOW_MAT = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, toneMapped: false,
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: 'varying vec2 vUv; void main() { float r = length(vUv - 0.5) * 2.0; gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5 * pow(clamp(1.0 - r, 0.0, 1.0), 1.6)); }',
});
const SHADOW_GEO = new THREE.PlaneGeometry(1, 1);

/** past poses kept per wearer; the back row of the pyramid dances this many frames late at most */
const POSE_HIST = 12;

const clonePose = (p: BodyPose): BodyPose => ({
  pelvis: p.pelvis.clone(), chest: p.chest.clone(), head: p.head.clone(), headVis: p.headVis, neck: p.neck.clone(),
  dir: Object.fromEntries(Object.entries(p.dir).map(([k, v]) => [k, v.clone()])) as BodyPose['dir'], vis: { ...p.vis },
});

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
  /** costumes fading off people who changed into another (never a pop) */
  private leaving: Wearer[] = [];
  private lastT = -1;
  private frameDt = 0;
  /** the dance pyramid in 3D: each wearer's costume cloned behind and above them, dancing their moves late (party) */
  pyramid = false;
  /** the wearers themselves undressed (party's "behind you": only their pyramid shows, and they stay in front) */
  hideWearers = false;
  /** with no pyramid, "behind you" still has two backup dancers (a row of two) */
  backup = false;
  /** which character dances at place `i` of a wearer's pyramid (a mix gives each its own); default: the wearer's */
  cloneCast: (wearerId: string, i: number) => string = (id) => id;
  /** the floor (pose/ground.ts): the pyramid stands on it */
  ground = new Ground();
  /** face fun: googly eyes, and sparks breathed from open mouths */
  readonly googly = new Googly();
  readonly breath = new Breath();
  googlyOn = false;
  breathOn = true;
  /** In Situ's club lights, real lights in the scene (they light the costumes); always present, dark when unused */
  readonly spots = [0, 1, 2].map(() => new THREE.SpotLight(0xffffff, 0, 0, 0.24, 0.65, 2));
  /** the last layer: grain and a vignette over the plate, the costumes and the people alike, so the 3D is not cleaner
   *  than the footage (multiplied in: a framebuffer cannot take a negative) */
  private readonly grain: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
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
    this.world.add(this.googly.group, this.breath.points);
    for (const sp of this.spots) this.world.add(sp, sp.target);
    this.grain = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
      vertexShader: 'varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: `varying vec2 vUv; uniform float uTime; uniform vec2 uRes;
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        void main() {
          vec2 d = vUv - 0.5; d.y *= 1.15;
          float vig = 1.0 - 0.35 * dot(d, d);
          float n = hash(floor(vUv * uRes) + fract(uTime * 7.31) * 97.0);
          gl_FragColor = vec4(vec3(vig * (0.965 + 0.035 * n)), 1.0);
        }`,
      uniforms: { uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) } },
      depthTest: false, depthWrite: false, toneMapped: false, transparent: true,
      blending: THREE.CustomBlending, blendSrc: THREE.ZeroFactor, blendDst: THREE.SrcColorFactor,
    }));
    this.grain.frustumCulled = false;
    this.grain.renderOrder = 1200;
    this.grain.visible = false;
    this.scene.add(this.grain);
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

  /** build (once) and keep a character; slow (marching cubes) — prefer prepare(), which does the slow part off thread */
  template(id: string): Built {
    let b = this.templates.get(id);
    if (!b) { b = buildCharacter(byId(id)); this.templates.set(id, b); }
    return b;
  }
  hasTemplate(id: string): boolean { return this.templates.has(id); }

  // costumes made in a worker, one at a time, in the order asked (a re-ask moves one to the front)
  private worker: Worker | null = null;
  private queue: string[] = [];
  private busy: string | null = null;
  private waiting = new Map<string, ((b: Built) => void)[]>();
  workerMs = new Map<string, number>();

  /** a costume ready to wear, made off the main thread; `urgent` puts it at the head of the queue */
  prepare(id: string, urgent = false): Promise<Built> {
    const have = this.templates.get(id);
    if (have) return Promise.resolve(have);
    const p = new Promise<Built>((r) => { const l = this.waiting.get(id) ?? []; l.push(r); this.waiting.set(id, l); });
    if (this.busy !== id) {
      this.queue = this.queue.filter((q) => q !== id);
      if (urgent) this.queue.unshift(id); else this.queue.push(id);
    }
    this.pump();
    return p;
  }
  isPreparing(id: string): boolean { return this.busy === id || this.queue.includes(id); }

  private pump(): void {
    if (this.busy || !this.queue.length) return;
    if (!this.worker) {
      try {
        this.worker = new Worker(new URL('../characters/build.worker.ts', import.meta.url), { type: 'module' });
        this.worker.onmessage = (e: MessageEvent<{ id: string; body: SurfaceArrays | null; fur: SurfaceArrays | null; ms: number }>) => {
          const { id, body, fur, ms } = e.data;
          this.workerMs.set(id, ms);
          const b = buildCharacter(byId(id), undefined, body ? { body, fur } : undefined);
          this.finish(id, b);
        };
        this.worker.onerror = (e) => { console.warn('costume worker failed; building on the main thread', e); this.worker = null; this.workerDead = true; this.fallback(); };
      } catch { this.workerDead = true; }
    }
    if (this.workerDead) { this.fallback(); return; }
    this.busy = this.queue.shift()!;
    this.worker!.postMessage({ id: this.busy });
  }
  private workerDead = false;
  /** no worker (an old browser): build on the main thread, one a frame */
  private fallback(): void {
    const id = this.busy ?? this.queue.shift();
    if (!id) return;
    this.busy = id;
    setTimeout(() => this.finish(id, buildCharacter(byId(id))), 16);
  }
  private finish(id: string, b: Built): void {
    if (!this.templates.has(id)) this.templates.set(id, b);
    const done = this.templates.get(id)!;
    for (const r of this.waiting.get(id) ?? []) r(done);
    this.waiting.delete(id);
    this.busy = null;
    this.pump();
  }

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
    const dt = this.lastT < 0 ? 1 / 30 : Math.min(0.1, Math.max(0, t - this.lastT));
    this.lastT = t;
    this.frameDt = dt;
    const keep = new Set<number>();
    for (const tr of tracks) {
      const id = cast(tr.id);
      let w = this.wearers.get(tr.id);
      // a change of costume: the old one fades off the person while the new one fades on (the new one may still be
      // in the making: the old one stays until it is ready)
      if (w && w.def.id !== id && this.templates.has(id)) { w.leaving = true; this.leaving.push(w); this.wearers.delete(tr.id); w = undefined; }
      if (!w && !this.templates.has(id)) continue;
      keep.add(tr.id);
      if (!w) w = this.dress(tr.id, id);
      w.life = Math.min(1, w.life + dt / 0.35);
      this.pose(w, tr, t);
    }
    for (const [id, w] of this.wearers) if (!keep.has(id)) this.drop(w);
    this.leaving = this.leaving.filter((w) => {
      w.life -= dt / 0.35;
      if (w.life <= 0) { this.drop(w); return false; }
      const tr = tracks.find((k) => k.id === w.trackId);
      if (tr) this.pose(w, tr, t);
      return true;
    });
  }

  private dress(trackId: number, id: string): Wearer {
    const { def, root, rig, mats } = this.instance(id);
    const w: Wearer = { trackId, def, root, rig, mats, fade: 0, life: 0, leaving: false, poses: [], head: 0, len: null, clones: [] };
    this.world.add(root);
    this.wearers.set(trackId, w);
    return w;
  }

  /** a worn copy of a character: its own bones, rig and material copies (each fades on its own) */
  private instance(id: string): { def: CharacterDef; root: THREE.Object3D; rig: Rig; mats: THREE.Material[] } {
    const tpl = this.template(id);
    const root = SkeletonUtils.clone(tpl.root);
    const bones = new Map<string, THREE.Bone>();
    root.traverse((o) => { if ((o as THREE.Bone).isBone) bones.set(o.name, o as THREE.Bone); });
    // each wearer fades on its own: its own copies of the materials (keeping the shader hooks, which clone() drops)
    const copies = new Map<THREE.Material, THREE.Material>();
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh && !(o as THREE.Sprite).isSprite) return;
      const swap = (mat: THREE.Material) => {
        let c = copies.get(mat);
        if (!c) {
          c = mat.clone();
          c.onBeforeCompile = mat.onBeforeCompile;
          c.customProgramCacheKey = mat.customProgramCacheKey;
          // an additive glow fades by its opacity; anything else by dithering (no sorting needed)
          if (mat.userData.keepBlend) c.userData.baseOpacity = mat.opacity; else c.alphaHash = true;
          copies.set(mat, c);
        }
        return c;
      };
      m.material = Array.isArray(m.material) ? m.material.map(swap) : swap(m.material);
    });
    return { def: tpl.def, root, rig: new Rig(tpl.def.segs, bones), mats: [...copies.values()] };
  }

  private drop(w: Wearer): void {
    this.world.remove(w.root);
    for (const c of w.clones) this.dropClone(c);
    for (const m of w.mats) m.dispose();
    if (this.wearers.get(w.trackId) === w) this.wearers.delete(w.trackId);
  }

  private pose(w: Wearer, tr: Track, t: number): void {
    const def = w.def, rig = w.rig;
    const p = poseFromLandmarks(tr.world);
    const s = this.fit(rig, def, tr.len);
    rig.apply(p, t, def.idle?.tail ?? 0, this.frameDt);
    // the wearer's mouth opens the costume's (face tracking)
    if (def.face?.jaw) rig.setJaw((tr.face?.jaw ?? 0) * def.face.jaw);
    w.root.position.set(tr.T.x, tr.T.y, tr.T.z);
    w.root.scale.setScalar(s);
    const f0 = tr.presence * Math.max(0, Math.min(1, w.life));
    const fade = f0 * f0 * (3 - 2 * f0);
    if (fade !== w.fade) { for (const m of w.mats) m.opacity = fade * ((m.userData.baseOpacity as number | undefined) ?? 1); w.fade = fade; }
    w.root.visible = fade > 0.01 && !this.hideWearers;
    def.tick?.(w.root, t, tr.face ?? null);
    // the pose into the ring
    w.head = (w.head + 1) % POSE_HIST;
    w.poses[w.head] = clonePose(p);
    w.len = tr.len;
    this.posePyramid(w, s, fade, t);
  }

  /** size a character to a person and stretch its limbs and neck toward theirs; returns its scale */
  private fit(rig: Rig, def: CharacterDef, len: Track['len']): number {
    const s = (len.torso / rig.torso) * (def.fit?.size ?? 1) * this.opts.size;
    const limb = def.fit?.limb ?? 0;
    const fitLen = (bone: string, person: number) => {
      const k = 1 + ((person / s) / (rig.len.get(bone) ?? 1) - 1) * limb;
      rig.setLength(bone, Math.min(1.6, Math.max(0.65, k)));
    };
    for (const side of ['L', 'R']) { fitLen('arm' + side, len.upperArm); fitLen('thigh' + side, len.thigh); fitLen('shin' + side, len.shin); }
    const kn = rig.neckFit(len.neck / s);
    rig.setNeck(1 + (Math.min(1.25, Math.max(0.45, kn)) - 1) * (def.fit?.head ?? 0.85));
    return s;
  }

  private dropClone(c: Clone): void {
    this.world.remove(c.root, c.shadow);
    for (const m of c.mats) m.dispose();
  }

  /**
   * Rows behind and above the wearer, each one more than the last, each row later: a canon. In camera space: back is
   * away from the camera, up is up; perspective makes the back rows smaller on its own. Fewer rows when several people
   * dance, so the triangle count stays a phone's.
   */
  private posePyramid(w: Wearer, s: number, fade: number, t: number): void {
    const rows = this.pyramid ? (this.wearers.size > 1 ? 2 : 3) : this.backup ? 1 : 0;
    const want: { row: number; col: number; id: string }[] = [];
    for (let r = 1; r <= rows; r++) for (let j = 0; j <= r; j++) want.push({ row: r, col: j, id: this.cloneCast(w.def.id, want.length) });
    // a place whose dancer changed (a new mix, another cast) gets the new one once it is made; the old dances till then
    for (let i = 0; i < w.clones.length; i++) {
      const c = w.clones[i]!, wnt = want[i];
      if (!wnt) { this.dropClone(c); w.clones.splice(i--, 1); continue; }
      if (c.id !== wnt.id && this.templates.has(wnt.id)) { this.dropClone(c); w.clones[i] = this.makeClone(wnt); }
    }
    while (w.clones.length < want.length) {
      const wnt = want[w.clones.length]!;
      if (!this.templates.has(wnt.id)) { void this.prepare(wnt.id); break; }
      w.clones.push(this.makeClone(wnt));
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
      // the wearer's pose `delay` frames ago (or the oldest kept), through this dancer's own rig, fitted to the wearer
      let p: BodyPose | undefined;
      for (let k = delay; k >= 0 && !p; k--) p = w.poses[(w.head - k + POSE_HIST * 4) % POSE_HIST];
      const cs = w.len ? this.fit(c.rig, c.def, w.len) : s;
      if (p) c.rig.apply(p, t - delay / 30, c.def.idle?.tail ?? 0);
      const at = foot.clone().addScaledVector(back, c.row * height * 0.5).addScaledVector(side, fj * height * 0.55);
      c.root.position.copy(at).addScaledVector(g.n, up);
      c.root.scale.setScalar(cs);
      c.root.visible = fade > 0.01;
      for (const m of c.mats) m.opacity = fade * ((m.userData.baseOpacity as number | undefined) ?? 1);
      c.shadow.position.copy(at).addScaledVector(g.n, 0.004);
      c.shadow.quaternion.copy(flat);
      c.shadow.scale.set(height * 0.42, height * 0.26, 1);
      c.shadow.visible = c.root.visible;
      c.def.tick?.(c.root, t - delay / 30, null);
    }
  }

  private makeClone(w: { row: number; col: number; id: string }): Clone {
    const { def, root, rig, mats } = this.instance(w.id);
    root.traverse((o) => { o.castShadow = false; });
    const shadow = new THREE.Mesh(SHADOW_GEO, SHADOW_MAT);
    shadow.renderOrder = 1;
    this.world.add(root, shadow);
    return { id: w.id, def, root, rig, mats, row: w.row, col: w.col, shadow };
  }

  /**
   * Each person's eyes and mouth this frame, for the googly eyes and the sparks: on their costume when it is worn and
   * says where (CharacterDef.face), else on their own face — the image point pushed out to their head's depth, turned
   * with their head. Camera space (the world group's frame).
   */
  faces(tracks: Track[], K: Intrinsics, dt: number): void {
    this.world.updateMatrixWorld();
    const inv = this.world.matrixWorld.clone().invert();
    const people: { id: number; eyes: EyePlace[] | null; show: number }[] = [];
    const mouths: Mouth[] = [];
    for (const tr of tracks) {
      if (tr.lost && tr.presence <= 0) continue;
      const f = tr.face;
      const w = this.wearers.get(tr.id);
      const worn = w && w.root.visible && !this.hideWearers ? w : null;
      const head = poseFromLandmarks(tr.world).head;
      const ax = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).applyQuaternion(head);
      const nose = new THREE.Vector3(tr.T.x + tr.world[L.nose]!.x, tr.T.y + tr.world[L.nose]!.y, tr.T.z + tr.world[L.nose]!.z);
      const d = Math.max(0.3, -nose.z);
      const at = (x: number, y: number, out: number) => new THREE.Vector3(((x * K.w - K.cx) / K.f) * d, ((K.cy - y * K.h) / K.f) * d, -d).addScaledVector(ax(0, 0, 1), out);
      let eyes: EyePlace[] | null = null;
      let mouth: { p: THREE.Vector3; dir: THREE.Vector3; scale: number } | null = null;
      if (worn) {
        worn.root.updateMatrixWorld(true);
        const hb = worn.rig.bones.get('head'), hs = worn.def.segs.find((q) => q.name === 'head');
        const M = hb ? inv.clone().multiply(hb.matrixWorld) : null;
        const s = worn.root.scale.x;
        if (M && hs && worn.def.face?.eyes) {
          const u = new THREE.Vector3(1, 0, 0).transformDirection(M), v = new THREE.Vector3(0, 1, 0).transformDirection(M), n = new THREE.Vector3(0, 0, 1).transformDirection(M);
          eyes = worn.def.face.eyes.map(([x, y, z, r]) => ({ p: new THREE.Vector3(x - hs.a[0], y - hs.a[1], z - hs.a[2]).applyMatrix4(M), u, v, n, r: r * s * 1.15 }));
        }
        const jb = worn.rig.bones.get('jaw'), js = worn.def.segs.find((q) => q.name === 'jaw');
        if (jb && js && worn.def.face?.jaw) {
          const J = inv.clone().multiply(jb.matrixWorld);
          mouth = { p: new THREE.Vector3(js.b[0] - js.a[0], js.b[1] - js.a[1], js.b[2] - js.a[2]).applyMatrix4(J), dir: new THREE.Vector3(0, -0.2, 1).transformDirection(M ?? J), scale: s * 10 };
        } else if (M && hs) {
          // no jaw to open: the sparks come from the front of the costume's face, where the wearer's mouth is
          const n = new THREE.Vector3(0, 0, 1).transformDirection(M);
          const real = f ? at(f.mouth.x, f.mouth.y, 0) : nose.clone();
          mouth = { p: real.addScaledVector(n, 0.12 * s * 10), dir: n.clone().add(new THREE.Vector3(0, -0.2, 0)).normalize(), scale: s * 10 };
        }
      }
      if (!eyes && f) {
        const u = ax(1, 0, 0), v = ax(0, 1, 0), n = ax(0, 0, 1);
        // the face mesh's eyes are the person's left then right; the googly eye is a third again bigger than the eye
        eyes = f.eyes.map((e) => ({ p: at(e.x, e.y, 0.02), u, v, n, r: Math.max(0.012, (e.r * K.w / K.f) * d * 1.35) }));
      }
      if (!mouth && f) mouth = { p: at(f.mouth.x, f.mouth.y, 0.03), dir: ax(0, -0.2, 1).normalize(), scale: 1 };
      people.push({ id: tr.id, eyes, show: tr.presence });
      if (mouth && f) mouths.push({ id: tr.id, ...mouth, open: f.jaw * tr.presence, colors: undefined });
    }
    this.googly.update(people, this.ground.n, dt, this.googlyOn);
    // the light meter: the largest read face in view (render/envlight.ts readFace)
    let big: Track | null = null;
    for (const tr of tracks) if (!tr.lost && tr.face?.read && tr.face.probe && (!big || tr.face.mouth.w > big.face!.mouth.w)) big = tr;
    this.light.face = big ? { probe: big.face!.probe!, w: big.face!.mouth.w * 2.4 } : null;
    const h = this.renderer.getDrawingBufferSize(new THREE.Vector2()).y;
    this.breath.update(mouths, dt, h / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2)), this.breathOn);
  }

  /** the grain-and-vignette layer over everything (party mode) */
  setGrain(on: boolean, t: number): void {
    this.grain.visible = on;
    const u = this.grain.material.uniforms;
    u.uTime!.value = t;
    const sz = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    (u.uRes!.value as THREE.Vector2).set(sz.x / 1.5, sz.y / 1.5);
  }

  /**
   * In Situ's club lights: three spots hung above and behind the dancers, swinging their pools over the floor between
   * the subject and the pyramid behind them; colours walk a club's palette, a kick on the beat. Real lights here (they
   * light the costumes), projected for the scene shader (beams and pools on the plate), so both agree.
   */
  stageSpots(on: boolean, t: number, beat: number, K: Intrinsics, anchor: THREE.Vector3 | null): { L: THREE.Vector2; P: THREE.Vector2; R: THREE.Vector2; C: THREE.Color }[] {
    const g = this.ground, { back, side } = g.axes();
    const F = g.foot(anchor ?? new THREE.Vector3(0, -0.3, -3));
    const C = F.clone().addScaledVector(back, 1.1);
    const pal = [0xffe2c0, 0xff3aa8, 0x3ad8ff];
    const uv = (p: THREE.Vector3) => { const q = project(p, K); return new THREE.Vector2(q.x, 1 - q.y); };
    return this.spots.map((sp, i) => {
      const L = F.clone().addScaledVector(side, (i - 1) * 2.4).addScaledVector(back, 0.6).addScaledVector(g.n, 3.6);
      const P = C.clone().addScaledVector(side, (i - 1) * 0.9 + 1.2 * Math.sin(t * 0.33 + i * 2.1)).addScaledVector(back, 0.8 * Math.cos(t * 0.27 + i * 1.3));
      const col = new THREE.Color(pal[i]!);
      sp.color.copy(col);
      sp.position.copy(L);
      sp.target.position.copy(P);
      sp.target.updateMatrixWorld();
      // intensity always set, never added or removed (a light that comes and goes recompiles every lit shader)
      sp.intensity = on ? 38 * (1 + 0.8 * beat) : 0;
      const r = L.distanceTo(P) * Math.tan(sp.angle) * 0.9;
      const Pu = uv(P), Lu = L.z < -0.15 ? uv(L) : new THREE.Vector2(Pu.x, 1.4);
      const R = new THREE.Vector2(Math.abs(uv(P.clone().addScaledVector(side, r)).x - Pu.x), Math.abs(uv(P.clone().addScaledVector(back, r)).y - Pu.y));
      return { L: Lu, P: Pu, R, C: col.clone().multiplyScalar(1 + 0.8 * beat) };
    });
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
