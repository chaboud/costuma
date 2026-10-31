// Googly eyes: two white plastic domes with loose black pupils, on each person's real eyes — or glued onto their
// costume's eyes when it says where those are (CharacterDef.face.eyes). The pupils are physics, not animation: each
// rattles in its dome under gravity (the floor's up, pose/ground.ts) and the eye's own acceleration (shake your head and
// they fly), bounces off the rim and settles at the bottom. In eye-radius units: a 2 cm eye and a costume's 3 cm one
// feel the same world.
import * as THREE from 'three';

export interface EyePlace {
  /** centre, camera space (the world group's frame) */
  p: THREE.Vector3;
  /** the eye's own axes: across (the face's left), up, out of the face */
  u: THREE.Vector3; v: THREE.Vector3; n: THREE.Vector3;
  /** radius, metres */
  r: number;
}

export const GOOGLY_TUNE = {
  /** of real acceleration that reaches the pupil (plastic, felt: a little) */
  coupling: 0.08,
  /** head-motion noise is ~5 m/s² at 30 fps from a few mm of jitter: below this the eye "did not move" */
  deadzone: 2.0,
  damping: 2.2, restitution: 0.55, pupil: 0.46,
};

const WHITE = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, depthTest: false, toneMapped: false });
const INK = new THREE.MeshBasicMaterial({ color: 0x0a0a0a, side: THREE.DoubleSide, depthTest: false, toneMapped: false });
const RIM = new THREE.MeshBasicMaterial({ color: 0x9a9a9a, side: THREE.DoubleSide, depthTest: false, toneMapped: false });
const SHINE = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, depthTest: false, transparent: true, opacity: 0.85, toneMapped: false });
const DISC = new THREE.CircleGeometry(1, 40), RING = new THREE.RingGeometry(0.95, 1.05, 40), PUP = new THREE.CircleGeometry(1, 28), GLINT = new THREE.CircleGeometry(0.16, 16);

class Eye {
  readonly g = new THREE.Group();
  private readonly pupil: THREE.Mesh;
  /** the pupil's offset in the dome (eye radii) and its velocity */
  private readonly q = new THREE.Vector2(0, -0.5);
  private readonly w = new THREE.Vector2();
  private readonly prev: THREE.Vector3[] = [];
  private readonly sm = new THREE.Vector3();
  private primed = false;

  constructor() {
    const disc = new THREE.Mesh(DISC, WHITE), ring = new THREE.Mesh(RING, RIM);
    this.pupil = new THREE.Mesh(PUP, INK);
    this.pupil.scale.setScalar(GOOGLY_TUNE.pupil);
    const glint = new THREE.Mesh(GLINT, SHINE);
    glint.position.set(-0.38, 0.42, 0.003);
    this.pupil.position.z = 0.0015; ring.position.z = 0.001;
    this.g.add(disc, ring, this.pupil, glint);
    // drawn over everything, people and costumes too (in "behind you" the person is redrawn last)
    this.g.traverse((o) => { o.renderOrder = 1100; o.frustumCulled = false; });
  }

  update(e: EyePlace, up: THREE.Vector3, dt: number, show: number): void {
    // where the eye is, smoothed a little for its acceleration (raw, a still head buzzes)
    if (!this.primed) { this.sm.copy(e.p); this.primed = true; }
    this.sm.lerp(e.p, 1 - Math.exp(-dt / 0.05));
    this.prev.push(this.sm.clone());
    if (this.prev.length > 3) this.prev.shift();
    const acc = new THREE.Vector3();
    if (this.prev.length === 3 && dt > 0) {
      acc.copy(this.prev[2]!).addScaledVector(this.prev[1]!, -2).add(this.prev[0]!).divideScalar(dt * dt);
      const m = acc.length();
      acc.multiplyScalar(m > GOOGLY_TUNE.deadzone ? (m - GOOGLY_TUNE.deadzone) / m : 0);
    }
    // in the eye's frame the pupil feels gravity, and the eye's acceleration backwards
    const f = new THREE.Vector3().addScaledVector(up, -9.8).addScaledVector(acc, -1).multiplyScalar(GOOGLY_TUNE.coupling / Math.max(e.r, 0.005));
    const fu = f.dot(e.u), fv = f.dot(e.v);
    const lim = 1 - GOOGLY_TUNE.pupil, steps = 4, h = Math.min(dt, 0.1) / steps;
    for (let i = 0; i < steps; i++) {
      this.w.x += fu * h; this.w.y += fv * h;
      this.w.multiplyScalar(Math.exp(-GOOGLY_TUNE.damping * h));
      this.q.addScaledVector(this.w, h);
      const d = this.q.length();
      if (d > lim) {
        const nx = this.q.x / d, ny = this.q.y / d;
        this.q.set(nx * lim, ny * lim);
        const vn = this.w.x * nx + this.w.y * ny;
        if (vn > 0) {
          // bounce off the rim; the tangential part rubs a little
          const tx = this.w.x - vn * nx, ty = this.w.y - vn * ny;
          this.w.set(tx * 0.9 - GOOGLY_TUNE.restitution * vn * nx, ty * 0.9 - GOOGLY_TUNE.restitution * vn * ny);
        }
      }
    }
    // place it: the eye's axes as the group's frame
    this.g.position.copy(e.p);
    this.g.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(e.u, e.v, e.n));
    this.g.scale.setScalar(e.r * show);
    this.g.visible = show > 0.02;
    this.pupil.position.set(this.q.x, this.q.y, 0.0015);
  }
}

export class Googly {
  readonly group = new THREE.Group();
  private readonly eyes = new Map<number, Eye[]>();

  /** per person: their two eyes' places this frame (or none), how present they are */
  update(people: { id: number; eyes: EyePlace[] | null; show: number }[], up: THREE.Vector3, dt: number, on: boolean): void {
    this.group.visible = on;
    const keep = new Set<number>();
    if (on) for (const p of people) {
      if (!p.eyes) continue;
      keep.add(p.id);
      let es = this.eyes.get(p.id);
      if (!es) { es = [new Eye(), new Eye()]; for (const e of es) this.group.add(e.g); this.eyes.set(p.id, es); }
      p.eyes.forEach((e, i) => es![i]?.update(e, up, dt, p.show));
    }
    for (const [id, es] of this.eyes) if (!keep.has(id)) { for (const e of es) this.group.remove(e.g); this.eyes.delete(id); }
  }
}
