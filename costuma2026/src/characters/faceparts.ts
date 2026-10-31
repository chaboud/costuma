// Face parts a costume can wear on its head bone and move from the wearer's face (FaceState, build.ts): eyelids that
// blink, squint and widen, and eyes that look where the wearer looks. Rigid meshes, added in `dress` with
// d.at(part, 'head', x, y, z) and found again by name in the costume's `tick` (cache what you find per root in a
// WeakMap: ticks run every frame and must not allocate).
//
// Axes are the head bone's: x the character's left, y up, z forward (out of the face). "L" is the character's left,
// which is the wearer's left (pose/face.ts).
import * as THREE from 'three';
import type { FaceState } from './build';

const OPEN_UP = -1.05, OPEN_LO = 0.72, SHUT = 0.07;

/**
 * Eyelids for a round eye of radius `r` (model units): two half shells of `mat` a little bigger than the eye (`gap`, a
 * share of r), hinged on the eye's own horizontal axis, named `${name}-up` and `${name}-lo` in a group named `name`.
 * Place the group at the eye's centre. `tilt` (radians about z) slants the lid line (a scowl, a sleepy droop); `open`
 * scales how far apart they rest (1: the iris clear).
 */
export function eyelids(name: string, r: number, mat: THREE.Material, opts: { gap?: number; tilt?: number; open?: number } = {}): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  const R = r * (1 + (opts.gap ?? 0.08));
  const up = new THREE.Mesh(new THREE.SphereGeometry(R, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat);
  const lo = new THREE.Mesh(new THREE.SphereGeometry(R, 28, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat);
  up.name = name + '-up';
  lo.name = name + '-lo';
  g.add(up, lo);
  g.rotation.z = opts.tilt ?? 0;
  g.userData.open = opts.open ?? 1;
  setLids(g, 0, 0, 0);
  return g;
}

/** close a pair of lids made by `eyelids`: `close` 0..1 (a blink brings both rims together), `squint` raises the lower,
 *  `wide` pulls the upper back */
export function setLids(g: THREE.Object3D, close: number, squint: number, wide: number): void {
  const up = g.children[0], lo = g.children[1];
  if (!up || !lo) return;
  const k = (g.userData.open as number | undefined) ?? 1;
  const c = Math.min(1, Math.max(0, close));
  const upOpen = OPEN_UP * k - 0.3 * wide, loOpen = (OPEN_LO - 0.45 * squint) * k;
  up.rotation.x = upOpen + (SHUT - upOpen) * c;
  lo.rotation.x = loOpen + (-SHUT - loOpen) * c;
}

/** both lids of a face from the wearer's: a blink closes, a squint half closes and lifts the lower, wide opens */
export function faceLids(left: THREE.Object3D | null, right: THREE.Object3D | null, f: FaceState | null | undefined): void {
  const z = !f;
  if (left) setLids(left, z ? 0 : Math.max(f!.blinkL, 0.3 * f!.squintL), z ? 0 : f!.squintL, z ? 0 : f!.wideL);
  if (right) setLids(right, z ? 0 : Math.max(f!.blinkR, 0.3 * f!.squintR), z ? 0 : f!.squintR, z ? 0 : f!.wideR);
}

/**
 * Turn an eye (a group whose origin is the eyeball's centre, its pupil on its +z) toward where the wearer looks:
 * `range` radians at a full look sideways, two thirds of it up and down. Its rest turn is kept from the first call.
 */
export function look(eye: THREE.Object3D, f: FaceState | null | undefined, range = 0.4): void {
  let rest = eye.userData.lookRest as THREE.Euler | undefined;
  if (!rest) eye.userData.lookRest = rest = eye.rotation.clone();
  const x = f?.lookX ?? 0, y = f?.lookY ?? 0;
  eye.rotation.set(rest.x - y * range * 0.67, rest.y + x * range, rest.z);
}
