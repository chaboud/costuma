import type { CharacterDef } from './build';
import { SEGMENTS, kaijuSDF, regionAt, boxFor, SHAPES } from './sdf';
const SH = { ...SHAPES.ridgeback!, skin: 0x3a3c40, belly: 0x6a665c, plate: 0xd9d3ba };
export const KAIJU: CharacterDef = {
  id: 'kaiju', name: 'Kaiju', blurb: 'coming soon',
  segs: SEGMENTS,
  body: { sdf: (x, y, z) => kaijuSDF(x, y, z, SH), region: (x, y, z) => regionAt(x, y, z, SH), box: boxFor(SH),
    palette: [SH.skin, SH.belly, SH.plate, 0xe8e3d2], surface: 'scales' },
  fit: { size: 1.0, limb: 0.5 },
  idle: { tail: 0.2 },
  face: { jaw: 0.5 },
};
