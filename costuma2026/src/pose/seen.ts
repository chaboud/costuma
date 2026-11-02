// What the picture holds of a person (founder, 2026-11-02: "if body parts are off the edge of the screen or
// obstructed, we should probably just assume a continued trajectory… Right now the legs off the bottom of the screen
// end up crunching up top often").
//
// The pose model guesses every joint, in the frame or not, and its visibility for a guessed one is not always low: on
// recorded torso shots a knee 0.3 of the frame below the bottom edge read 0.50 at times, a hip just below it 0.70. So a
// joint's visibility is also how far inside the frame it is — a curve, all of it a little inside the edge, none a little
// outside — and everything downstream that weighs by visibility (the retarget easing an unseen bone back to the
// costume's own rest, which carries on its parent's line; the reach; the torso-shot anchor; the occlusion's fit)
// stops believing what the frame cannot show.
//
// And a person's limb lengths, which the costumes fit their own limbs to, were measured every frame from those guesses:
// the guessed thighs of three torso shots measured 0.18–0.23 m (a thigh is ~0.4), and costumes that fit their legs to
// the wearer's (limb 0.5–0.7) drew them at 65–75 % — short legs folded up under the body. Now a limb's length is
// learned only as fast as both its ends are seen, as a share of the torso, starting from people's usual shares
// (measured on 28 fully seen people in two clips: thigh 0.80 of the torso, shin 0.75, upper arm 0.43, forearm 0.44).
import type { Detection } from './tracker';
import type { LM } from './landmarks';
import { L } from './landmarks';

export const SEEN_TUNE = {
  /** a joint is fully in the picture this far inside its edge (share of the frame), not at all this far outside */
  edge: 0.03,
  /** a limb's length counts from when both its ends are this visible, fully from the second */
  visFrom: 0.5, visTo: 0.85,
  /** people's limbs as shares of their torso (shoulders' middle to hips' middle), MediaPipe's world landmarks */
  ratio: { upperArm: 0.43, forearm: 0.44, thigh: 0.8, shin: 0.75 },
};
export type LimbKey = keyof typeof SEEN_TUNE.ratio;
export const LIMB_KEYS = Object.keys(SEEN_TUNE.ratio) as LimbKey[];

const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/** how much of a picture point (0..1 both ways) the frame holds: 1 inside, 0 outside, a curve across the edge */
export function inFrameShare(p: { x: number; y: number }): number {
  const inside = Math.min(p.x, 1 - p.x, p.y, 1 - p.y);
  return sstep(-SEEN_TUNE.edge, SEEN_TUNE.edge, inside);
}

/** a detection with each joint's visibility (picture and 3D alike) scaled by how far inside the frame it is */
export function inFrame(d: Detection): Detection {
  const k = d.image.map(inFrameShare);
  return { ...d, image: d.image.map((p, i) => ({ ...p, v: p.v * k[i]! })), world: d.world.map((p, i) => ({ ...p, v: p.v * k[i]! })) };
}

const SIDES: Record<LimbKey, [number, number][]> = {
  upperArm: [[L.shL, L.elL], [L.shR, L.elR]],
  forearm: [[L.elL, L.wrL], [L.elR, L.wrR]],
  thigh: [[L.hipL, L.knL], [L.hipR, L.knR]],
  shin: [[L.knL, L.anL], [L.knR, L.anR]],
};
const dist = (a: LM, b: LM) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

/** each limb's length (`world`, metres) as a share of `torso`, from the sides the picture shows (`image`'s
 *  visibility), and how much to believe it (0..1) */
export function limbShares(world: LM[], image: LM[], torso: number): Record<LimbKey, { share: number; w: number }> {
  const out = {} as Record<LimbKey, { share: number; w: number }>;
  for (const key of LIMB_KEYS) {
    let sum = 0, ws = 0;
    for (const [a, b] of SIDES[key]) {
      const w = sstep(SEEN_TUNE.visFrom, SEEN_TUNE.visTo, Math.min(image[a]!.v, image[b]!.v));
      sum += dist(world[a]!, world[b]!) * w; ws += w;
    }
    out[key] = { share: ws > 0 && torso > 1e-3 ? sum / ws / torso : SEEN_TUNE.ratio[key], w: Math.min(1, ws) };
  }
  return out;
}
