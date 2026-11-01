import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { facePlace, FACEMAP_TUNE } from '../src/render/facemap';
import { CONTROLS, FaceMotion } from '../src/pose/facegeo';
import { ROSTER } from '../src/characters/roster';
import { CANON } from './canonical-face';

describe('the face carried onto a costume', () => {
  it('every costume with eyes gets a place: the mapped eyes on its eyes, the face in front of its head', () => {
    for (const def of ROSTER) {
      const p = facePlace(def);
      if (!def.face?.eyes) { expect(p).toBeNull(); continue; }
      expect(p, def.id).not.toBeNull();
      // the brows land above the costume's eyes, the mouth corners below, left on its left
      const c = (n: string) => p!.centres[CONTROLS.findIndex((k) => k.name === n)]!;
      expect(c('browInL').y, def.id).toBeGreaterThan(p!.o.y);
      expect(c('mouthL').y, def.id).toBeLessThan(p!.o.y);
      expect(c('mouthL').x, def.id).toBeGreaterThan(c('mouthR').x);
      expect(p!.sx, def.id).toBeGreaterThan(0);
      expect(FACEMAP_TUNE.gain).toBeGreaterThan(0);
    }
  });
  it('reads a mouth corner rising as that control\'s movement, relative to the face at rest', () => {
    const W = 720, H = 1280;
    const mesh = (lift: number) => {
      const pts = Array.from({ length: 478 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
      for (const [k, c] of Object.entries(CANON)) pts[Number(k)] = { x: 0.5 + (c[0] * 20) / W, y: 0.4 - (c[1] * 20) / H, z: -(c[2] * 20) / W };
      // the controls' points that the fixture lacks sit at their canonical places too
      for (const c of CONTROLS) if (!CANON[c.i]) { const v = c.at.map((x) => x * 8.8917); pts[c.i] = { x: 0.5 + (v[0]! * 20) / W, y: 0.4 - ((v[1]! + 2.664) * 20) / H, z: -((v[2]! + 3.1734) * 20) / W }; }
      const i = 291; pts[i] = { ...pts[i]!, y: pts[i]!.y - (lift * 20) / H };
      return pts;
    };
    const m = new FaceMotion();
    for (let k = 0; k < 10; k++) m.update(mesh(0), W, H, 1 / 30);
    for (let k = 0; k < 10; k++) m.update(mesh(0.6), W, H, 1 / 30);
    const at = CONTROLS.findIndex((c) => c.name === 'mouthL'), other = CONTROLS.findIndex((c) => c.name === 'mouthR');
    // 0.6 cm of an 8.9 cm span: ~0.067 spans up
    expect(m.move[at * 3 + 1]!).toBeGreaterThan(0.05);
    expect(Math.abs(m.move[other * 3 + 1]!)).toBeLessThan(0.005);
    void THREE;
  });
});
