// PLACEHOLDER — being authored. Until then it borrows the suited hero's body so the app runs.
import type { CharacterDef } from './build';
import { HERO_BOX, HERO_SEGMENTS, heroRegion, heroSDF } from './hero';

export const VAMPIRE: CharacterDef = {
  id: 'vampire', name: 'Vampire', blurb: 'coming soon',
  segs: HERO_SEGMENTS,
  body: { sdf: (x, y, z) => heroSDF(x, y, z, 'crimson'), region: (x, y, z) => heroRegion(x, y, z, 'crimson'), box: HERO_BOX,
    palette: [0x777777, 0xaaaaaa, 0x222222, 0x999999], surface: 'suit' },
  fit: { size: 1.08, limb: 0.7 },
};
