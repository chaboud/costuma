// Mouth magic: open your mouth and it breathes glowing sparks — out of your own mouth, or your costume's (its jaw's tip).
// How much is how open (the face model's jawOpen); the sparks drift, rise a little, fade. One pool of points for
// everyone, drawn additive so they glow, sized in metres (they shrink with distance like anything else in the scene).
import * as THREE from 'three';

const MAX = 900;
const VERT = /* glsl */ `
  attribute float aSize; attribute float aLife; attribute vec3 aColor;
  uniform float uScale;
  varying float vLife; varying vec3 vColor;
  void main() {
    vLife = aLife; vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aLife > 0.0 ? aSize * uScale / max(-mv.z, 0.05) : 0.0;
  }`;
const FRAG = /* glsl */ `
  varying float vLife; varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    if (d > 1.0 || vLife <= 0.0) discard;
    float core = exp(-d * d * 5.0), halo = exp(-d * d * 1.6) * 0.45;
    float fade = smoothstep(0.0, 0.25, vLife) * smoothstep(1.0, 0.85, vLife);
    gl_FragColor = vec4(vColor * (core * 1.6 + halo) * fade, 1.0);
  }`;

const NEON = [0xff2994, 0xb3ff29, 0xffe029, 0x29e0ff, 0x8c2eff].map((h) => new THREE.Color(h));

export interface Mouth { id: number; p: THREE.Vector3; dir: THREE.Vector3; open: number; scale: number; colors?: THREE.Color[] }

export class Breath {
  readonly points: THREE.Points;
  private readonly pos = new Float32Array(MAX * 3);
  private readonly vel = new Float32Array(MAX * 3);
  private readonly col = new Float32Array(MAX * 3);
  private readonly size = new Float32Array(MAX);
  private readonly life = new Float32Array(MAX);
  private readonly span = new Float32Array(MAX);
  private next = 0;
  private readonly owed = new Map<number, number>();
  private readonly mat: THREE.ShaderMaterial;

  constructor() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(this.col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1));
    g.setAttribute('aLife', new THREE.BufferAttribute(this.life, 1));
    this.mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: { uScale: { value: 800 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
    this.points = new THREE.Points(g, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 1050;
  }

  /** `pxPerUnit`: the camera's pixels per metre at 1 m (canvas height / (2 tan(fov/2))) */
  update(mouths: Mouth[], dt: number, pxPerUnit: number, on: boolean): void {
    this.mat.uniforms.uScale!.value = pxPerUnit;
    this.points.visible = on;
    if (!on) return;
    for (const m of mouths) {
      // from a third open to fully open: none to ~110 a second
      const k = Math.min(1, Math.max(0, (m.open - 0.3) / 0.45));
      let owe = (this.owed.get(m.id) ?? 0) + k * k * 110 * dt;
      const pal = m.colors?.length ? m.colors : NEON;
      while (owe >= 1) {
        owe -= 1;
        const i = this.next; this.next = (this.next + 1) % MAX;
        // a cone out of the mouth, a little downward first, then the sparks rise
        const spread = 0.35, a = Math.random() * Math.PI * 2, s = Math.random() * spread;
        const side = new THREE.Vector3(1, 0, 0).cross(m.dir); if (side.lengthSq() < 1e-4) side.set(0, 1, 0); side.normalize();
        const up = new THREE.Vector3().crossVectors(m.dir, side).normalize();
        const d = m.dir.clone().addScaledVector(side, Math.cos(a) * s).addScaledVector(up, Math.sin(a) * s - 0.15).normalize();
        const speed = (1.1 + Math.random() * 1.1) * m.scale;
        this.pos[i * 3] = m.p.x; this.pos[i * 3 + 1] = m.p.y; this.pos[i * 3 + 2] = m.p.z;
        this.vel[i * 3] = d.x * speed; this.vel[i * 3 + 1] = d.y * speed; this.vel[i * 3 + 2] = d.z * speed;
        const c = pal[Math.floor(Math.random() * pal.length)]!;
        this.col[i * 3] = c.r; this.col[i * 3 + 1] = c.g; this.col[i * 3 + 2] = c.b;
        this.size[i] = (0.025 + Math.random() * 0.045) * m.scale;
        this.span[i] = 0.9 + Math.random() * 0.6;
        this.life[i] = 1;
      }
      this.owed.set(m.id, owe);
    }
    const drag = Math.exp(-1.6 * dt);
    for (let i = 0; i < MAX; i++) {
      if (this.life[i]! <= 0) continue;
      this.life[i] = this.life[i]! - dt / this.span[i]!;
      this.vel[i * 3] = this.vel[i * 3]! * drag; this.vel[i * 3 + 2] = this.vel[i * 3 + 2]! * drag;
      this.vel[i * 3 + 1] = this.vel[i * 3 + 1]! * drag + 0.5 * dt;
      this.pos[i * 3] = this.pos[i * 3]! + this.vel[i * 3]! * dt;
      this.pos[i * 3 + 1] = this.pos[i * 3 + 1]! + this.vel[i * 3 + 1]! * dt;
      this.pos[i * 3 + 2] = this.pos[i * 3 + 2]! + this.vel[i * 3 + 2]! * dt;
    }
    const g = this.points.geometry;
    for (const n of ['position', 'aColor', 'aSize', 'aLife']) g.getAttribute(n).needsUpdate = true;
  }
}
