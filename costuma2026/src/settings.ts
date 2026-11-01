// What the player can change, kept per browser. Defaults are a phone's: two people, the fast model.
export interface Settings {
  people: number;
  model: 'lite' | 'full';
  size: number;
  /** the lens guess: focal length as a share of the long side (pose/solve.ts) */
  lens: number;
  /** how sure the pose model must be that someone is there (0..1): its detection and presence thresholds */
  poseConf: number;
  /** how much the pose is smoothed, 0 snappy .. 1 steady (pose/tracker.ts setSmoothing) */
  smoothing: number;
  /** the camera's zoom per facing (1: its main lens; 0.5 the ultra-wide where the phone offers it) */
  zoom: { user?: number; environment?: number };
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
  /** the dance pyramid (clones behind the dancers) in every party mode */
  pyramid: boolean;
  /** the characters in the rotation: the picker, Mix and the party's dancers (roster.ts DEFAULT_CAST; more from "More") */
  cast: string[];
  /** the settings' own version: a new default that must reach people who already have settings bumps it */
  v: number;
}
export const DEFAULTS: Settings = { people: 2, model: 'full', size: 1, lens: 0.85, poseConf: 0.65, smoothing: 0.5, zoom: {}, envLight: true, shadows: true, debug: false, mode: 'one', costume: 'jimothy', scene: 'costume', effect: 'insitu', partyCostumes: 'behind', music: false, faces: true, googly: false, breath: false, partyCast: 'skeleton', pyramid: true, cast: ['jimothy', 'builder', 'skeleton', 'pumpkin', 'howler', 'violet', 'plume'], v: 7 };
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
    // v4: the pyramid is a toggle on every party mode, not a mode of its own
    if (v < 4) { if ((s.effect as string) === 'pyramid') s.effect = 'insitu'; s.pyramid = true; }
    // v5: a rotation of seven by default; the rest wait under "More" (founder, 2026-10-31)
    if (v < 5) s.cast = [...DEFAULTS.cast];
    if (!Array.isArray(s.cast) || !s.cast.length) s.cast = [...DEFAULTS.cast];
    // v6 (2026-11-01): the pose threshold, MediaPipe's 0.5 until now, is a setting and higher (founder: "our pose
    // threshold is too low. Some acquisition issues")
    if (v < 6) s.poseConf = DEFAULTS.poseConf;
    if (!(s.poseConf >= 0.3 && s.poseConf <= 0.95)) s.poseConf = DEFAULTS.poseConf;
    // v7 (2026-11-01): the sparks from open mouths are off unless asked for (founder: "Default the sparks to off")
    if (v < 7) s.breath = false;
    if (!s.zoom || typeof s.zoom !== 'object') s.zoom = {};
    if (!(s.smoothing >= 0 && s.smoothing <= 1)) s.smoothing = DEFAULTS.smoothing;
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
