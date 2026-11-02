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
// What the picture does show sizes the person, and every unseen length is extrapolated from that (body.ts).
import type { Detection } from './tracker';

export const SEEN_TUNE = {
  /** a joint is fully in the picture this far inside its edge (share of the frame), not at all this far outside */
  edge: 0.03,
};

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
