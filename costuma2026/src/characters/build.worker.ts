// The expensive part of a costume — its SDF sampled on a grid, marching cubes, region colours, skin weights, and the
// coarser shell its fur grows on — off the main thread, so a costume never freezes the picture while it is made. The
// main thread only assembles the arrays into meshes and hangs the bones' props (build.ts buildCharacter with `pre`).
import { byId } from './roster';
import { resOf, surfaceArrays, transferOf } from './build';

self.onmessage = (e: MessageEvent<{ id: string }>) => {
  const def = byId(e.data.id);
  const t0 = performance.now();
  if (!def.body) { postMessage({ id: def.id, body: null, fur: null, ms: 0 }); return; }
  const R = resOf(def);
  const body = surfaceArrays(def.body, def.segs, R.body);
  const fur = def.body.fur && (def.furShells ?? 10) > 0 ? surfaceArrays(def.body, def.segs, R.fur) : null;
  postMessage({ id: def.id, body, fur, ms: performance.now() - t0 }, { transfer: [...transferOf(body), ...(fur ? transferOf(fur) : [])] });
};
