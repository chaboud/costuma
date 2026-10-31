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

export const ROSTER: CharacterDef[] = [JIMOTHY, BUILDER, SKELETON, PUMPKIN, HOWLER, CRIMSON, VIOLET, PLUME, BASTION, KESTREL, UNISON];
export const byId = (id: string): CharacterDef => ROSTER.find((d) => d.id === id) ?? ROSTER[0]!;
