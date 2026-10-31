// The costumes, in picker order. Violet replaced Strollzilla's Valkyrie (founder, 2026-10-31: the Valkyries' own mascot,
// to show our support); species.ts keeps the Valkyrie's definition for Strollzilla's sake, unlisted. A character is data (build.ts CharacterDef): add one by writing its file and listing
// it here and in ids.ts (a test holds the two equal).
import type { CharacterDef } from './build';
import { JIMOTHY } from './jimothy';
import { BUILDER } from './builder';
import { SKELETON } from './skeleton';
import { PUMPKIN } from './pumpkin';
import { VIOLET } from './violet';
import { BASTION, CRIMSON, HOWLER, KESTREL, PLUME, UNISON } from './species';
import { KAIJU } from './kaiju';
import { CATRINA } from './catrina';
import { GHOST } from './ghost';
import { MUMMY } from './mummy';
import { VAMPIRE } from './vampire';
import { WITCH } from './witch';

export const ROSTER: CharacterDef[] = [
  JIMOTHY, BUILDER, SKELETON, PUMPKIN, HOWLER, VIOLET, PLUME,
  // the rest: off by default, put into the rotation from "More characters"
  KAIJU, CATRINA, GHOST, MUMMY, VAMPIRE, WITCH, CRIMSON, BASTION, KESTREL, UNISON,
];
/** in the rotation (picker, mix, party dancers) unless the player says otherwise (founder, 2026-10-31) */
export const DEFAULT_CAST = ['jimothy', 'builder', 'skeleton', 'pumpkin', 'howler', 'violet', 'plume'];
export const byId = (id: string): CharacterDef => ROSTER.find((d) => d.id === id) ?? ROSTER[0]!;
