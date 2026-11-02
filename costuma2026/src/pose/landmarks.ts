// BlazePose's 33 landmarks (MediaPipe PoseLandmarker). "Left" is the person's own left.
export const L = {
  nose: 0, eyeInL: 1, eyeL: 2, eyeOutL: 3, eyeInR: 4, eyeR: 5, eyeOutR: 6, earL: 7, earR: 8, mouthL: 9, mouthR: 10,
  shL: 11, shR: 12, elL: 13, elR: 14, wrL: 15, wrR: 16, pinkyL: 17, pinkyR: 18, indexL: 19, indexR: 20, thumbL: 21, thumbR: 22,
  hipL: 23, hipR: 24, knL: 25, knR: 26, anL: 27, anR: 28, heelL: 29, heelR: 30, toeL: 31, toeR: 32,
} as const;
export const N_LANDMARKS = 33;

/** A landmark: for world landmarks metres in the camera's axes (three's: x right, y up, z toward the camera); for image
 *  landmarks x, y in 0..1 of the frame (y down). `v` is MediaPipe's visibility (0..1). */
/** a point: where, and how visible the picture says it is (`v`); `b`, set on a pose the tracker filled in where the
 *  picture was unsure (limbs.ts), how sure that filled-in point is — read by the costume's rig alone (the floor, the
 *  occlusion and the size ask the picture, `v`) */
export interface LM { x: number; y: number; z: number; v: number; b?: number }

/** MediaPipe world landmarks are x right, y down, z away from the camera; three's camera space is y up, z toward it. */
export function worldToThree(p: { x: number; y: number; z: number; visibility?: number }): LM {
  return { x: p.x, y: -p.y, z: -p.z, v: p.visibility ?? 1 };
}

/** the skeleton the debug view draws */
export const BONES: [number, number][] = [
  [L.shL, L.shR], [L.shL, L.elL], [L.elL, L.wrL], [L.shR, L.elR], [L.elR, L.wrR], [L.shL, L.hipL], [L.shR, L.hipR],
  [L.hipL, L.hipR], [L.hipL, L.knL], [L.knL, L.anL], [L.hipR, L.knR], [L.knR, L.anR], [L.anL, L.toeL], [L.anR, L.toeR],
  [L.earL, L.eyeL], [L.eyeL, L.nose], [L.nose, L.eyeR], [L.eyeR, L.earR],
];
