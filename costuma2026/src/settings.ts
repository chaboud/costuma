// What the player can change, kept per browser. Defaults are a phone's: two people, the fast model.
export interface Settings {
  people: number;
  model: 'lite' | 'full';
  size: number;
  /** the lens guess: focal length as a share of the long side (pose/solve.ts) */
  lens: number;
  envLight: boolean;
  shadows: boolean;
  debug: boolean;
  mode: 'one' | 'mix';
  costume: string;
  /** costumes over people, or party mode: people cut out and the frame rebuilt round them (render/party.ts) */
  scene: 'costume' | 'party';
  effect: string;
  /**
   * costumes in party mode: off; behind you (you stay yourself, cut out and drawn in front, a pyramid of the costume
   * dancing behind you — insertion by draw order); on you (you wear it, and in Pyramid it clones behind you too)
   */
  partyCostumes: 'off' | 'behind' | 'on';
  /** listen to the music (the microphone) for the beat; never on by default — it asks for the mic */
  music: boolean;
  /** face tracking (mouths, eyes): a second model, ~4 MB, a few ms a frame */
  faces: boolean;
  /** googly eyes on everyone (or their costumes) */
  googly: boolean;
  /** open mouths breathe sparks */
  breath: boolean;
  /** who dances in party mode (behind you, or on you): Skelly unless chosen otherwise */
  partyCast: string;
  /** the settings' own version: a new default that must reach people who already have settings bumps it */
  v: number;
}
export const DEFAULTS: Settings = { people: 2, model: 'full', size: 1, lens: 0.85, envLight: true, shadows: true, debug: false, mode: 'one', costume: 'jimothy', scene: 'costume', effect: 'insitu', partyCostumes: 'behind', music: false, faces: true, googly: false, breath: true, partyCast: 'skeleton', v: 3 };
const KEY = 'costuma26.settings';

export function loadSettings(): Settings {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<Settings>;
    // the version is the stored one: merged over the defaults, old settings would read as current and never migrate
    const v = stored.v ?? (Object.keys(stored).length ? 1 : DEFAULTS.v);
    const s = { ...DEFAULTS, ...stored };
    // it was a yes/no before it had a third answer
    const pc = s.partyCostumes as unknown;
    if (pc === true) s.partyCostumes = 'on';
    else if (pc !== 'behind' && pc !== 'on') s.partyCostumes = 'off';
    // v2 (2026-10-31): party mode's default is In Situ, with skeletons dancing behind you — for everyone, once
    if (v < 2) { s.effect = 'insitu'; s.partyCostumes = 'behind'; s.partyCast = 'skeleton'; }
    // v3 (2026-10-31): the full pose model by default (founder: "default to the higher quality tracker")
    if (v < 3) s.model = 'full';
    // Violet took the Valkyrie's place: whoever wore the Valkyrie wears Violet
    if (s.costume === 'valkyrie') s.costume = 'violet';
    if (s.partyCast === 'valkyrie') s.partyCast = 'violet';
    s.v = DEFAULTS.v;
    return s;
  } catch { return { ...DEFAULTS }; }
}
export function saveSettings(s: Settings): void {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode: settings last the session */ }
}
