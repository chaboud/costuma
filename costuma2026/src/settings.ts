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
  /** keep wearing costumes in party mode */
  partyCostumes: boolean;
  /** listen to the music (the microphone) for the beat; never on by default — it asks for the mic */
  music: boolean;
}
export const DEFAULTS: Settings = { people: 2, model: 'lite', size: 1, lens: 0.85, envLight: true, shadows: true, debug: false, mode: 'one', costume: 'jimothy', scene: 'costume', effect: 'pop', partyCostumes: false, music: false };
const KEY = 'costuma26.settings';

export function loadSettings(): Settings {
  try { return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<Settings>) }; } catch { return { ...DEFAULTS }; }
}
export function saveSettings(s: Settings): void {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode: settings last the session */ }
}
