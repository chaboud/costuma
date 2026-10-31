// The floor, estimated the way a phone does AR without a depth sensor (ARKit and ARCore find planes from the camera and
// the motion sensors together; a web page on an iPhone gets neither — see README "Depth on iPhone"). Two questions:
//
// - Which way is up? The phone's gravity (platform/motion.ts), when it has one and it agrees with the people in view;
//   else the people themselves: people stand up, so the long-run direction from their ankles (or hips) to their
//   shoulders is up; else the camera is assumed level.
// - Where is the floor along it? Where the feet are: MediaPipe's world landmarks are metric and the pose solve put
//   them in camera space, so a visible heel or toe is a point on the floor. Feet out of frame: the hips dropped by the
//   person's own leg length. Nobody: the camera assumed 1.4 m up (a phone held at chest height).
//
// The plane is n·x = h in camera space (three's axes, the camera at the origin), so -h is the camera's height above it.
// Smoothed by EMA (the house smoother): the floor does not dance.
import * as THREE from 'three';
import type { Track } from './tracker';
import { L } from './landmarks';

export const GROUND_TUNE = {
  /** seconds: how slowly up and the floor's height follow their evidence */
  tauN: 1.0, tauH: 0.6,
  /** metres: the camera's assumed height when nobody is in view */
  cameraHeight: 1.4,
  /** degrees: the phone's gravity is used only within this of the people's up (it guards a wrong axis mapping) */
  imuAgree: 35,
  footVis: 0.5,
};

export type GroundSource = 'assumed' | 'body' | 'motion';

export class Ground {
  /** up, camera space */
  readonly n = new THREE.Vector3(0, 1, 0);
  /** the plane n·x = h */
  h = -GROUND_TUNE.cameraHeight;
  /** where up came from, and whether the height came from feet (true) or was inferred */
  source: GroundSource = 'assumed';
  fromFeet = false;
  private readonly bodyUp = new THREE.Vector3(0, 1, 0);
  private bodyW = 0;

  update(tracks: Track[], motionUp: THREE.Vector3 | null, dt: number): void {
    const kN = 1 - Math.exp(-dt / GROUND_TUNE.tauN), kH = 1 - Math.exp(-dt / GROUND_TUNE.tauH);
    // the people's up: ankles (or hips) to shoulders, weighted by presence
    const up = new THREE.Vector3();
    let w = 0;
    for (const t of tracks) {
      if (t.lost || t.presence < 0.5) continue;
      const P = (i: number) => new THREE.Vector3(t.world[i]!.x, t.world[i]!.y, t.world[i]!.z);
      const sh = P(L.shL).add(P(L.shR)).multiplyScalar(0.5);
      const ankV = Math.min(t.world[L.anL]!.v, t.world[L.anR]!.v);
      const base = ankV > GROUND_TUNE.footVis ? P(L.anL).add(P(L.anR)).multiplyScalar(0.5) : P(L.hipL).add(P(L.hipR)).multiplyScalar(0.5);
      const d = sh.sub(base);
      if (d.lengthSq() < 1e-4) continue;
      up.addScaledVector(d.normalize(), t.presence * (ankV > GROUND_TUNE.footVis ? 1 : 0.6));
      w += t.presence;
    }
    if (w > 0 && up.lengthSq() > 1e-6) {
      up.normalize();
      this.bodyUp.lerp(up, this.bodyW > 0 ? kN * 0.5 : 1).normalize();
      this.bodyW = Math.min(1, this.bodyW + dt);
    }
    // choose up: gravity if it agrees with the people (or there are none), else the people, else what we had
    let target: THREE.Vector3 | null = null;
    const agree = Math.cos(THREE.MathUtils.degToRad(GROUND_TUNE.imuAgree));
    if (motionUp && (this.bodyW === 0 || motionUp.dot(this.bodyUp) > agree)) { target = motionUp; this.source = 'motion'; }
    else if (this.bodyW > 0) { target = this.bodyUp; this.source = 'body'; }
    if (target) this.n.lerp(target, kN).normalize();
    // the floor's height along up: the lowest visible foot, else the hips less the legs
    let hs = 0, hw = 0, feet = false;
    for (const t of tracks) {
      if (t.lost || t.presence < 0.5) continue;
      const cam = (i: number) => this.n.x * (t.T.x + t.world[i]!.x) + this.n.y * (t.T.y + t.world[i]!.y) + this.n.z * (t.T.z + t.world[i]!.z);
      let low = Infinity;
      for (const [i, sole] of [[L.heelL, 0.02], [L.heelR, 0.02], [L.toeL, 0.02], [L.toeR, 0.02], [L.anL, 0.08], [L.anR, 0.08]] as const) {
        if (t.world[i]!.v > GROUND_TUNE.footVis) low = Math.min(low, cam(i) - sole);
      }
      if (low < Infinity) { hs += low * t.presence; hw += t.presence; feet = true; continue; }
      const hip = (cam(L.hipL) + cam(L.hipR)) / 2;
      const legs = Math.max(0.6, Math.min(1.1, t.len.thigh + t.len.shin + 0.08));
      hs += (hip - legs) * t.presence * 0.4; hw += t.presence * 0.4;
    }
    if (hw > 0) { this.h += (hs / hw - this.h) * kH; this.fromFeet = feet; }
  }

  /** the point of the floor under p */
  foot(p: THREE.Vector3, out = new THREE.Vector3()): THREE.Vector3 {
    return out.copy(p).addScaledVector(this.n, this.h - this.n.dot(p));
  }
  /** height of p above the floor */
  height(p: THREE.Vector3): number { return this.n.dot(p) - this.h; }
  /** the floor's own axes: `back` away from the camera, `side` to the right, both on the plane */
  axes(): { back: THREE.Vector3; side: THREE.Vector3 } {
    // straight away from the camera, laid onto the floor
    const back = new THREE.Vector3(0, 0, -1).addScaledVector(this.n, this.n.z).normalize();
    const side = new THREE.Vector3().crossVectors(back, this.n).normalize();
    return { back, side };
  }
  /** the camera's height above the floor, metres */
  get cameraHeight(): number { return -this.h; }
}
