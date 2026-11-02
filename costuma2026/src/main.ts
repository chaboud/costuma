// costuma 2026: the boot, the frame loop and the HUD. Camera → MediaPipe pose (several people, 3D) → tracker (stable
// ids) → each person's costume posed and placed in camera space → drawn over the camera frame, lit by it.
import './style.css';
import { Camera, isIOS } from './camera';
import { Detector } from './pose/detector';
import { Tracker, setSmoothing, type Detection, type Track } from './pose/tracker';
import { guessIntrinsics, project, type Intrinsics } from './pose/solve';
import * as THREE from 'three';
import { synthCrowd, synthMask } from './pose/synth';
import { BONES, L } from './pose/landmarks';
import { BG_VERT, Stage } from './render/stage';
import { PRESETS, Party } from './render/party';
import { Beat } from './audio/beat';
import { MetaLog, zip } from './capture/meta';
import { Motion } from './platform/motion';
import { FaceTracker, attachFaces, type FaceDet } from './pose/face';
import { LIGHT_TUNE } from './render/envlight';
import { DEFAULT_CAST, ROSTER, byId } from './characters/roster';
import { parseFace, type CharacterDef } from './characters/build';
import { DEFAULTS, loadSettings, saveSettings, type Settings } from './settings';
import { ICONS } from './ui/icons';
import { pageUrl, qrSvg } from './ui/qr';
import { canShareFile, recorderMime, saveFile, shareFile } from './ui/share';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const BASE = import.meta.env.BASE_URL;
const q = new URLSearchParams(location.search);
const TEST = q.get('test') === '1';
const SYNTH = Number(q.get('synth') ?? 0);

const settings: Settings = loadSettings();
setSmoothing(settings.smoothing);
if (q.get('c')) settings.costume = q.get('c')!;
if (!ROSTER.some((d) => d.id === settings.costume)) settings.costume = ROSTER[0]!.id;
if (q.get('people')) settings.people = Number(q.get('people'));
const persist = () => saveSettings(settings);

const video = $<HTMLVideoElement>('video');
const canvas = $<HTMLCanvasElement>('stage');
const overlay = $<HTMLCanvasElement>('overlay');
const octx = overlay.getContext('2d')!;
const stage = new Stage(canvas);
stage.opts.size = settings.size; stage.opts.shadows = settings.shadows; stage.opts.envLight = settings.envLight;
const party = new Party(stage.bgUniforms, BG_VERT);
stage.cloneCast = (wearerId, i) => settings.scene === 'party' && settings.partyCast === 'mix' ? rosterAt(rotationIndex(wearerId) + 1 + i + mixShift) : wearerId;
const beat = new Beat();
const motion = new Motion();
let faceTracker: FaceTracker | null = null;
let lastFaceNow = -1;
if (q.get('scene') === 'party' || q.get('scene') === 'costume') settings.scene = q.get('scene') as Settings['scene'];
if (q.get('fx')) settings.effect = q.get('fx')!;
if (q.get('googly')) settings.googly = q.get('googly') === '1';
if (q.get('pc')) settings.partyCostumes = q.get('pc') === 'behind' ? 'behind' : q.get('pc') === '1' || q.get('pc') === 'on' ? 'on' : 'off';
party.preset = PRESETS.find((p) => p.id === settings.effect) ?? PRESETS[0]!;
const camera = new Camera(video, (q.get('facing') as 'user' | 'environment' | null) ?? undefined);
let detector: Detector | null = null;
const tracker = new Tracker();
let started = false;

// ── who wears what ─────────────────────────────────────────────────────────────────────────────────────────────────
// one costume for everyone, or a mix (each new person the next costume along); a tap on a person changes theirs
const overrides = new Map<number, string>();
const mixed = new Map<number, string>();
let mixNext = 0;
/** a re-tap of Mix moves everyone along: who wears what is shuffled by this */
let mixShift = 0;
/** the characters in the rotation, in roster order (never empty: the default seven if all were taken out) */
function rotation(): CharacterDef[] {
  const on = ROSTER.filter((d) => settings.cast.includes(d.id));
  return on.length ? on : ROSTER.filter((d) => DEFAULT_CAST.includes(d.id));
}
const rosterAt = (i: number) => { const r = rotation(); return r[((i % r.length) + r.length) % r.length]!.id; };
const rotationIndex = (id: string) => Math.max(0, rotation().findIndex((d) => d.id === id));
function castOf(trackId: number): string {
  const o = overrides.get(trackId);
  if (o) return o;
  // the party has its own dancers (Skelly unless chosen), whoever you are in costume mode; a party mix: each their own
  if (settings.scene === 'party') {
    if (settings.partyCast !== 'mix') return ROSTER.some((d) => d.id === settings.partyCast) ? settings.partyCast : 'skeleton';
    let m = mixed.get(trackId);
    if (!m) { m = rosterAt(mixShift + mixNext++ * 3); mixed.set(trackId, m); }
    return m;
  }
  if (settings.mode === 'one') return settings.costume;
  let m = mixed.get(trackId);
  if (!m) {
    m = rosterAt(rotationIndex(settings.costume) + mixShift + mixNext++);
    mixed.set(trackId, m);
  }
  return m;
}

// costumes are made in a worker (stage.prepare): all of them, in the background, from the start; one asked for before
// it is ready jumps the queue. The picture never stops while one is made.
const asked = new Set<string>();
function ensureBuilt(id: string, quiet = false): void {
  if (stage.hasTemplate(id)) return;
  const first = !asked.has(id);
  asked.add(id);
  if (!quiet && first) toast(`Dressing up as ${byId(id).name}…`, 1800);
  if (first || !quiet) void stage.prepare(id, true).catch((e) => { console.error('build failed', id, e); toast(`${byId(id).name} failed to build`); });
}

// ── HUD ────────────────────────────────────────────────────────────────────────────────────────────────────────────
let toastTimer = 0;
function toast(text: string, ms = 1400): void {
  const t = $('toast');
  t.textContent = text;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.classList.remove('on'), ms);
}
const hint = (text: string) => { const h = $('hint'); h.textContent = text; h.classList.toggle('on', !!text); };
const thumbUrl = (id: string) => `${BASE}thumbs/${id}.png`;

function buildPicker(): void {
  const el = $('picker');
  el.innerHTML = '';
  if (settings.scene === 'party') {
    for (const p of PRESETS) {
      const b = document.createElement('button');
      b.className = 'card fx';
      b.dataset.id = p.id;
      b.setAttribute('role', 'option');
      b.innerHTML = `<div class="thumb"></div><div class="name"></div>`;
      (b.querySelector('.thumb') as HTMLElement).style.background = p.swatch;
      b.querySelector('.name')!.textContent = p.name;
      b.onclick = () => chooseEffect(p.id);
      el.appendChild(b);
    }
    markPicker();
    return;
  }
  const card = (id: string, name: string, cls = '') => {
    const b = document.createElement('button');
    b.className = `card ${cls}`;
    b.dataset.id = id;
    b.setAttribute('role', 'option');
    b.innerHTML = `<div class="thumb"></div><div class="name"></div>`;
    b.querySelector('.name')!.textContent = name;
    const th = b.querySelector('.thumb')!;
    if (id === 'mix') th.textContent = 'MIX';
    else {
      const img = new Image();
      img.alt = '';
      img.draggable = false;
      img.onerror = () => { img.remove(); th.textContent = name.slice(0, 1); };
      img.src = thumbUrl(id);
      th.appendChild(img);
    }
    b.onclick = () => choose(id);
    el.appendChild(b);
  };
  card('mix', 'Mix', 'mix');
  for (const d of rotation()) card(d.id, d.name);
  // the rest of the cast, and who is in the rotation
  const more = document.createElement('button');
  more.className = 'card more';
  more.innerHTML = '<div class="thumb">+</div><div class="name">More</div>';
  more.onclick = openMore;
  el.appendChild(more);
  markPicker();
}
/**
 * The picker scrolls three ways: the browser's own pan (touch), a drag (a finger where the browser's pan does not take,
 * or a mouse), and a mouse wheel turned into sideways. A drag that moved is not a tap: the card under it is not chosen.
 */
function scrollablePicker(el: HTMLElement): void {
  let down: { x: number; left: number; id: number } | null = null, moved = false;
  el.addEventListener('pointerdown', (e) => { down = { x: e.clientX, left: el.scrollLeft, id: e.pointerId }; moved = false; });
  el.addEventListener('dragstart', (e) => e.preventDefault());
  el.addEventListener('pointermove', (e) => {
    if (!down || e.pointerId !== down.id) return;
    const dx = e.clientX - down.x;
    if (!moved && Math.abs(dx) > 6) { moved = true; el.classList.add('dragging'); }
    if (moved) el.scrollLeft = down.left - dx;
  });
  const up = () => { down = null; el.classList.remove('dragging'); };
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up); // the browser's own pan took over: it scrolls, we stop
  el.addEventListener('click', (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  el.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    el.scrollLeft += e.deltaY;
    e.preventDefault();
  }, { passive: false });
}

function markPicker(): void {
  for (const b of $('picker').querySelectorAll<HTMLButtonElement>('.card')) {
    const on = settings.scene === 'party' ? b.dataset.id === settings.effect : settings.mode === 'mix' ? b.dataset.id === 'mix' : b.dataset.id === settings.costume;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', String(on));
    // centre the chosen card by scrolling the picker alone (scrollIntoView can move the page and its ancestors too)
    if (on) { const p = $('picker'); p.scrollTo({ left: b.offsetLeft - (p.clientWidth - b.offsetWidth) / 2, behavior: 'smooth' }); }
  }
}
function choose(id: string): void {
  overrides.clear();
  if (id === 'mix') {
    // Mix again: everyone moves on to another costume
    const again = settings.mode === 'mix';
    settings.mode = 'mix';
    if (again) mixShift++;
    mixed.clear(); mixNext = 0;
    toast(again ? 'Shuffled' : 'Mix: everyone gets their own');
  } else {
    settings.mode = 'one';
    settings.costume = id;
    ensureBuilt(id);
    if (stage.hasTemplate(id)) toast(byId(id).name, 900);
  }
  persist();
  markPicker();
}

/** the party's dancers, in the order a re-tap walks them: every costume in the rotation, then a mix */
const dancers = () => [...rotation().map((d) => d.id), 'mix'];
function chooseEffect(id: string): void {
  const p = PRESETS.find((x) => x.id === id) ?? PRESETS[0]!;
  if (settings.effect === p.id && party.preset.id === p.id) {
    // the same effect again: the next set of dancers (and a mix reshuffles each time round)
    const DANCERS = dancers();
    const i = DANCERS.indexOf(settings.partyCast);
    settings.partyCast = DANCERS[(i + 1) % DANCERS.length]!;
    if (settings.partyCast === 'mix') mixShift++;
    overrides.clear(); mixed.clear(); mixNext = 0;
    if (settings.partyCast !== 'mix') ensureBuilt(settings.partyCast);
    if (settings.partyCostumes === 'off') settings.partyCostumes = 'behind';
    persist();
    toast(settings.partyCast === 'mix' ? 'Dancers: a mix' : `Dancers: ${byId(settings.partyCast).name}`, 1000);
    return;
  }
  settings.effect = p.id;
  party.preset = p;
  persist();
  markPicker();
  toast(p.name, 800);
}

/** fade to black, do `fn` while dark, fade back */
function dip(fn: () => void | Promise<void>): void {
  const d = $('dip');
  d.classList.add('on');
  setTimeout(async () => { try { await fn(); } finally { requestAnimationFrame(() => requestAnimationFrame(() => d.classList.remove('on'))); } }, 190);
}

/** the pose model's cut-out of each person: party mode draws with them, occlusion hides costumes behind other people */
const masksWanted = () => settings.scene === 'party' || settings.occlusion !== 'off';

/** costumes, or party mode; party asks the pose model for each person's cut-out mask */
function setScene(scene: Settings['scene']): void {
  settings.scene = scene;
  persist();
  stage.setBackground(scene === 'party' ? party.material : null);
  void detector?.setOptions({ masks: masksWanted() });
  $('btn-pyramid').classList.toggle('hidden', scene !== 'party');
  for (const b of document.querySelectorAll<HTMLButtonElement>('.modes button')) {
    const on = b.dataset.scene === scene;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', String(on));
  }
  buildPicker();
}

/** "More characters": every character, a ✓/✕ each for the rotation (the picker, Mix and the party's dancers) */
function openMore(): void {
  const body = $('more-body');
  body.innerHTML = '';
  const extra = ROSTER.filter((d) => !DEFAULT_CAST.includes(d.id));
  const section = (title: string, list: CharacterDef[]) => {
    const h = document.createElement('h3'); h.textContent = title; body.appendChild(h);
    const grid = document.createElement('div'); grid.className = 'more-grid';
    for (const d of list) {
      const b = document.createElement('button');
      b.className = 'more-card';
      b.innerHTML = '<div class="thumb"></div><div class="name"></div><div class="tick"></div>';
      const img = new Image(); img.alt = ''; img.draggable = false; img.src = thumbUrl(d.id); img.onerror = () => img.remove();
      b.querySelector('.thumb')!.appendChild(img);
      b.querySelector('.name')!.textContent = d.name;
      const mark = () => { const on = settings.cast.includes(d.id); b.classList.toggle('on', on); b.querySelector('.tick')!.textContent = on ? '✓' : '✕'; b.setAttribute('aria-pressed', String(on)); };
      mark();
      b.onclick = () => {
        const on = settings.cast.includes(d.id);
        if (on && settings.cast.length <= 1) { toast('Keep at least one'); return; }
        settings.cast = on ? settings.cast.filter((x) => x !== d.id) : [...settings.cast, d.id];
        if (!on) ensureBuilt(d.id, true);
        mixed.clear(); mixNext = 0;
        persist(); mark(); buildPicker();
      };
      grid.appendChild(b);
    }
    body.appendChild(grid);
  };
  section('The usual crowd', ROSTER.filter((d) => DEFAULT_CAST.includes(d.id)));
  section('Advanced & trash', extra);
  openModal('more');
}

function openModal(id: string): void { $(id).classList.remove('hidden'); }
for (const m of document.querySelectorAll<HTMLElement>('.modal')) {
  m.addEventListener('click', (e) => { if (e.target === m || (e.target as HTMLElement).closest('[data-close]')) m.classList.add('hidden'); });
}

function showQR(): void {
  const url = pageUrl();
  $('qr-code').innerHTML = qrSvg(url);
  $('qr-url').textContent = url;
  openModal('qr');
}
$('btn-copy').onclick = async () => {
  try { await navigator.clipboard.writeText(pageUrl()); toast('Link copied'); } catch { toast('Could not copy — long-press the link'); }
};
$('btn-share-link').onclick = async () => {
  if (navigator.share) { try { await navigator.share({ title: 'costuma 2026', text: 'Be a 3D costume:', url: pageUrl() }); } catch { /* cancelled */ } }
  else { try { await navigator.clipboard.writeText(pageUrl()); toast('Link copied'); } catch { toast(pageUrl()); } }
};

/** whether the Advanced section was left open (the panel is rebuilt each time it opens) */
let advancedOpen = false;
function buildSettings(): void {
  const body = $('settings-body');
  body.innerHTML = '';
  // rows go into the panel, or into the Advanced section once it is open for them
  let into: HTMLElement = body;
  const row = (label: string, note: string, control: HTMLElement) => {
    const d = document.createElement('div');
    d.className = 'set';
    const l = document.createElement('label');
    const span = document.createElement('span');
    span.textContent = label;
    if (note) { const s = document.createElement('small'); s.textContent = note; span.appendChild(s); }
    l.append(span, control);
    d.appendChild(l);
    into.appendChild(d);
  };
  const seg = <T extends string | number>(opts: [T, string][], get: () => T, set: (v: T) => void) => {
    const s = document.createElement('div');
    s.className = 'seg';
    for (const [v, label] of opts) {
      const b = document.createElement('button');
      b.textContent = label;
      b.classList.toggle('on', get() === v);
      b.onclick = () => { set(v); persist(); for (const x of s.children) x.classList.remove('on'); b.classList.add('on'); };
      s.appendChild(b);
    }
    return s;
  };
  const sw = (get: () => boolean, set: (v: boolean) => void) => {
    const i = document.createElement('input');
    i.type = 'checkbox'; i.className = 'switch'; i.checked = get();
    i.onchange = () => { set(i.checked); persist(); };
    return i;
  };
  const range = (min: number, max: number, step: number, get: () => number, set: (v: number) => void) => {
    const i = document.createElement('input');
    i.type = 'range'; i.min = String(min); i.max = String(max); i.step = String(step); i.value = String(get());
    i.oninput = () => { set(Number(i.value)); persist(); };
    return i;
  };
  row(settings.scene === 'party' ? 'Subjects' : 'People', settings.scene === 'party' ? 'How many people to cut out (the nearest)' : 'How many to dress at once', seg<number>([[1, '1'], [2, '2'], [3, '3'], [4, '4']], () => settings.people, (v) => { settings.people = v; void detector?.setOptions({ numPoses: v }); }));
  row('Costume size', 'Bigger hides more of the person', range(0.8, 1.5, 0.01, () => settings.size, (v) => { settings.size = v; stage.opts.size = v; }));
  row('Occlusion (experimental)', 'Who and what stands in front of a costume hides it. People: from the pose model, nothing more to load. Things too (tables, chairs, props): a depth model, 47 MB the first time', seg<Settings['occlusion']>([['off', 'Off'], ['people', 'People'], ['all', 'People + things']], () => settings.occlusion, (v) => {
    settings.occlusion = v;
    void detector?.setOptions({ masks: masksWanted() });
    if (v === 'all') void loadDepth();
  }));
  row('Smoothing', 'Steady holds a still pose rock-solid; snappy follows fast moves sooner', range(0, 1, 0.05, () => settings.smoothing, (v) => { settings.smoothing = v; setSmoothing(v); }));
  row('Pose model', 'Accurate is steadier, slower to load and run', seg<'lite' | 'full'>([['lite', 'Fast'], ['full', 'Accurate']], () => settings.model, (v) => { settings.model = v; void reloadDetector(); }));
  row('Light from the camera', 'The costume is lit by the room it stands in', sw(() => settings.envLight, (v) => { settings.envLight = v; stage.opts.envLight = v; }));
  row('Shadows', 'Off is faster on older phones', sw(() => settings.shadows, (v) => { settings.shadows = v; stage.opts.shadows = v; }));
  row('React to the music', 'Listens through the microphone for the beat', sw(() => settings.music, (v) => {
    settings.music = v;
    if (v) void listen(true);
    else beat.stop();
  }));
  {
    const sel = document.createElement('select');
    sel.className = 'pick';
    for (const d of rotation()) { const o = document.createElement('option'); o.value = d.id; o.textContent = d.name; sel.appendChild(o); }
    { const o = document.createElement('option'); o.value = 'mix'; o.textContent = 'A mix'; sel.appendChild(o); }
    sel.value = settings.partyCast;
    sel.onchange = () => { settings.partyCast = sel.value; overrides.clear(); mixed.clear(); persist(); if (sel.value !== 'mix') ensureBuilt(sel.value); };
    row('Party dancers', 'Who dances behind (or as) you in party mode', sel);
  }
  row('Costumes in party mode', 'Behind you: you stay yourself, a pyramid of your costume dances behind you', seg<Settings['partyCostumes']>([['off', 'Off'], ['behind', 'Behind'], ['on', 'On you']], () => settings.partyCostumes, (v) => { settings.partyCostumes = v; }));
  row('Face tracking', 'Mouths open costumes and breathe sparks; googly eyes find your eyes', sw(() => settings.faces, (v) => { settings.faces = v; if (v) void loadFaces(); }));
  row('Mouth magic', 'Open your mouth: sparks', sw(() => settings.breath, (v) => { settings.breath = v; }));
  // Advanced: what tunes the tracking and what shows or records how it works
  const adv = document.createElement('details');
  adv.className = 'advanced';
  adv.open = advancedOpen;
  adv.ontoggle = () => { advancedOpen = adv.open; };
  const sum = document.createElement('summary');
  sum.textContent = 'Advanced';
  adv.appendChild(sum);
  body.appendChild(adv);
  into = adv;
  row('Detection threshold', 'Higher ignores what only looks like a person (coats, posters, shadows); lower finds people further off or half hidden', range(0.4, 0.9, 0.05, () => settings.poseConf, (v) => { settings.poseConf = v; void detector?.setOptions({ conf: v }); }));
  row('Lens', 'If costumes look too flat or too deep', range(0.55, 1.3, 0.01, () => settings.lens, (v) => { settings.lens = v; }));
  row('Show the skeleton', 'What the pose tracker sees', sw(() => settings.debug, (v) => { settings.debug = v; }));
  row('Video metadata', 'A clip also records the camera’s own picture and a log of what was detected and tracked, every frame — for debugging. The preview then offers “Save debug data” (one zip)', sw(() => settings.videoMeta, (v) => { settings.videoMeta = v; }));
  into = body;
  // everything above back to its default; a second tap within three seconds does it (one stray tap must not)
  const reset = document.createElement('button');
  reset.id = 'btn-reset';
  reset.className = 'secondary reset';
  reset.textContent = 'Reset to defaults';
  let armed = -1e9;
  reset.onclick = () => {
    if (performance.now() - armed > 3000) {
      armed = performance.now();
      reset.textContent = 'Tap again to reset';
      setTimeout(() => { if (performance.now() - armed >= 2900) reset.textContent = 'Reset to defaults'; }, 3000);
      return;
    }
    resetSettings();
  };
  body.appendChild(reset);
}

/** the settings panel's own settings (the costume, the mode, the rotation, the effect and the lens's zoom are chosen
 *  elsewhere and stay) */
const PANEL = ['people', 'size', 'occlusion', 'smoothing', 'poseConf', 'model', 'envLight', 'shadows', 'lens', 'music', 'partyCast', 'partyCostumes', 'faces', 'breath', 'debug', 'videoMeta'] as const satisfies readonly (keyof Settings)[];
/** every panel setting back to its default, each applied as its own control would apply it */
function resetSettings(): void {
  const was = { ...settings };
  for (const k of PANEL) (settings as unknown as Record<string, unknown>)[k] = DEFAULTS[k];
  stage.opts.size = settings.size; stage.opts.shadows = settings.shadows; stage.opts.envLight = settings.envLight;
  setSmoothing(settings.smoothing);
  void detector?.setOptions({ numPoses: settings.people, conf: settings.poseConf, masks: masksWanted() });
  if (settings.model !== was.model) void reloadDetector();
  if (settings.occlusion === 'all') void loadDepth();
  if (!settings.music) beat.stop();
  if (settings.partyCast !== was.partyCast) { overrides.clear(); mixed.clear(); if (settings.partyCast !== 'mix') ensureBuilt(settings.partyCast); }
  if (settings.faces) void loadFaces();
  persist();
  buildSettings();
  toast('Settings back to their defaults', 1500);
}

// ── capture ────────────────────────────────────────────────────────────────────────────────────────────────────────
let snapWanted = false;
let lastCapture: { blob: Blob; name: string } | null = null;
function preview(blob: Blob, name: string): void {
  lastCapture = { blob, name };
  const box = $('preview-media');
  box.innerHTML = '';
  const url = URL.createObjectURL(blob);
  if (blob.type.startsWith('video')) {
    const v = document.createElement('video');
    v.src = url; v.controls = true; v.playsInline = true; v.loop = true; v.muted = true; void v.play().catch(() => undefined);
    box.appendChild(v);
  } else {
    const i = new Image(); i.src = url; box.appendChild(i);
  }
  // on an iPhone the sheet is how a file gets into Photos; a download would land in Files
  // a clip recorded with its metadata offers the debug data too (only right after that clip)
  $('btn-debug').classList.toggle('hidden', !debugBundle || !name.startsWith(debugBundle.name.replace('-debug.zip', '')));
  const ios = isIOS() && canShareFile(blob, name);
  $('btn-share').textContent = ios ? 'Save to Photos' : 'Share';
  $('btn-save').textContent = ios ? 'Download' : 'Save';
  $('preview-note').textContent = ios ? `In the sheet, choose “Save ${blob.type.startsWith('video') ? 'Video' : 'Image'}”.` : '';
  openModal('preview');
}
$('btn-share').onclick = async () => { if (lastCapture) { const r = await shareFile(lastCapture.blob, lastCapture.name); if (r === 'saved') toast('Saved'); } };
$('btn-save').onclick = () => { if (lastCapture) { saveFile(lastCapture.blob, lastCapture.name); toast('Saved'); } };
$('btn-debug').onclick = async () => {
  if (!debugBundle) return;
  const r = await shareFile(debugBundle.blob, debugBundle.name);
  if (r === 'saved') toast(isIOS() ? 'Saved to Files (Downloads)' : 'Saved', 1800);
};
/**
 * A photo or a clip just taken. On an iPhone, straight to the share sheet ("Save Image" / "Save Video": into Photos),
 * the shutter's tap still counting as the gesture the sheet needs; if Safari will not open it from there, or it is
 * dismissed, the preview, whose "Save to Photos" is a fresh tap. Elsewhere the preview: Save downloads (on Android a
 * download shows in the gallery), Share is the sheet.
 */
async function captured(blob: Blob, name: string): Promise<void> {
  lastCapture = { blob, name };
  if (isIOS() && canShareFile(blob, name)) {
    if (!shareHinted) { shareHinted = true; toast(blob.type.startsWith('video') ? 'Choose “Save Video” to put it in Photos' : 'Choose “Save Image” to put it in Photos', 2600); }
    const r = await shareFile(blob, name, false);
    if (r === 'shared') return;
  }
  preview(blob, name);
}
let shareHinted = false;
const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

let recorder: MediaRecorder | null = null;
/** the debug recording under way (capture/meta.ts), and the last one's zip */
let meta: MetaLog | null = null;
let debugBundle: { blob: Blob; name: string } | null = null;
/** what a debug recording says once: the build, the device, the camera, the settings */
function metaInfo(): Record<string, unknown> {
  const tr = (video.srcObject as MediaStream | null)?.getVideoTracks()[0];
  return {
    build: __BUILD__, ua: navigator.userAgent, dpr: devicePixelRatio, screen: { w: innerWidth, h: innerHeight },
    video: { w: video.videoWidth, h: video.videoHeight }, facing: camera.facing, mirrored: camera.mirrored, zoom: camera.zoom,
    track: tr?.getSettings?.() ?? null, settings: { ...settings }, synth: SYNTH, people: settings.people,
  };
}
let recStarting = false;
let recTimer = 0;
let micRefusedSaid = false; // the first silent clip of a session says why; the rest just record
/** the microphone, opened at Start for the whole session (founder: "We should always open the mic"): every clip
 *  records it, the music listener reads it. Processing off, so music survives (echo cancellation and noise suppression
 *  flatten it). Asked again only if it was refused or has ended. */
let mic: MediaStream | null = null;
let micAsking: Promise<void> | null = null;
function openMic(): Promise<void> {
  if (mic?.getAudioTracks().some((t) => t.readyState === 'live')) return Promise.resolve();
  if (!navigator.mediaDevices?.getUserMedia || (SYNTH && !q.get('mic'))) return Promise.resolve();
  return micAsking ??= navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } })
    .then((s) => { mic = s; }, (e) => { console.warn('no microphone', e); mic = null; })
    .finally(() => { micAsking = null; });
}
/** the music listener on the session's microphone (`said`: the player just switched it on) */
async function listen(said: boolean): Promise<void> {
  await openMic();
  if (!mic) { if (said) { settings.music = false; persist(); toast('No microphone'); } return; }
  await beat.start(mic);
  if (said) toast('Listening for the beat', 1200);
}
/** the sound for a clip: the session's microphone (asked for now if it is not open); none if the player refuses it */
async function clipSound(): Promise<MediaStreamTrack[]> {
  await openMic();
  return mic?.getAudioTracks().filter((t) => t.readyState === 'live') ?? [];
}
async function toggleRecording(): Promise<void> {
  const btn = $('btn-rec');
  if (recorder) { recorder.stop(); return; }
  if (recStarting) return;
  const cs = (canvas as HTMLCanvasElement & { captureStream?: (fps: number) => MediaStream }).captureStream;
  if (!recorderMime() || !cs) { toast('Recording is not supported in this browser'); return; }
  recStarting = true;
  btn.classList.add('on'); btn.innerHTML = ICONS.stop;
  // the clip carries the sound: the session's microphone (asked again here if it was refused at Start)
  const sound = SYNTH && !q.get('mic') ? [] : await clipSound();
  // said in the recording's own toast (a toast of its own was covered by it at once)
  let note = 'Recording — tap to stop';
  if (!sound.length && (!SYNTH || q.get('mic')) && !micRefusedSaid) { micRefusedSaid = true; note = 'Recording without sound (no microphone) — tap to stop'; }
  const stream = cs.call(canvas, 30);
  for (const t of sound) stream.addTrack(t);
  let mime = recorderMime(sound.length > 0)!, r: MediaRecorder;
  try { r = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 }); } catch (e) {
    // a browser that will not record this sound: the picture alone, said so
    console.warn('recording with sound refused', e);
    for (const t of stream.getAudioTracks()) stream.removeTrack(t);
    mime = recorderMime(false)!;
    r = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
    note = 'Recording without sound (this browser) — tap to stop';
  }
  const chunks: Blob[] = [];
  // Video metadata (settings → Advanced): the camera's own frames and a log of every frame beside the clip
  const log = settings.videoMeta ? new MetaLog() : null;
  if (log) {
    const cam = (video.srcObject as MediaStream | null)?.getVideoTracks()[0] ?? null;
    log.start(metaInfo(), performance.now(), tracker.snapshot(), cam, recorderMime(false));
    meta = log;
  }
  r.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  r.onstop = async () => {
    clearTimeout(recTimer);
    recorder = null;
    btn.classList.remove('on'); btn.innerHTML = ICONS.rec;
    const type = mime.split(';')[0]!, ext = type.includes('mp4') ? 'mp4' : 'webm', name = `costuma-${stamp()}`;
    const clip = new Blob(chunks, { type });
    if (!log) { void captured(clip, `${name}.${ext}`); return; }
    meta = null;
    const { json, raw } = await log.stop();
    const files: { name: string; data: Blob | string }[] = [{ name: `${name}.${ext}`, data: clip }, { name: `${name}-meta.json`, data: json }];
    if (raw) files.push({ name: `${name}-camera.${log.rawMime.includes('mp4') ? 'mp4' : 'webm'}`, data: raw });
    debugBundle = { blob: await zip(files), name: `${name}-debug.zip` };
    // the preview, not the sheet straight away: it offers the clip and the debug data
    preview(clip, `${name}.${ext}`);
  };
  r.start(250);
  recorder = r;
  recStarting = false;
  recTimer = window.setTimeout(() => r.state === 'recording' && r.stop(), 20000);
  toast(note, note.includes('without') ? 2600 : 1200);
}

// ── the controls fade when left alone ──────────────────────────────────────────────────────────────────────────────
// After a few seconds untouched the HUD fades out (the picture is the show); any touch brings it back, and that first
// touch only brings it back — it does not also change a costume or an effect underneath.
const IDLE_MS = 4500;
let lastTouch = performance.now();
let swallowTap = false;
const hud = () => $('hud');
function wake(): void {
  lastTouch = performance.now();
  if (hud().classList.contains('idle')) { hud().classList.remove('idle'); swallowTap = true; setTimeout(() => (swallowTap = false), 400); }
}
for (const ev of ['pointerdown', 'keydown', 'wheel'] as const) window.addEventListener(ev, wake, { capture: true, passive: true });
setInterval(() => {
  const modal = [...document.querySelectorAll('.modal')].some((m) => !m.classList.contains('hidden'));
  const idle = started && !modal && performance.now() - lastTouch > IDLE_MS;
  if (idle !== hud().classList.contains('idle')) hud().classList.toggle('idle', idle);
}, 300);

// ── tap a person to change their costume ───────────────────────────────────────────────────────────────────────────
function screenOf(t: Track): { x: number; y: number } {
  const c = stage.cover;
  const im = t.image;
  const ux = (im[L.shL]!.x + im[L.shR]!.x + im[L.hipL]!.x + im[L.hipR]!.x) / 4, uy = (im[L.shL]!.y + im[L.shR]!.y + im[L.hipL]!.y + im[L.hipR]!.y) / 4;
  let x = (ux * c.vw - c.ox) * c.s;
  const y = (uy * c.vh - c.oy) * c.s;
  if (c.mirror) x = c.cw - x;
  return { x, y };
}
canvas.addEventListener('click', (e) => {
  if (!started) return;
  if (swallowTap) { swallowTap = false; return; }
  if (settings.scene === 'party' && settings.partyCostumes === 'off') {
    const i = PRESETS.findIndex((p) => p.id === settings.effect);
    chooseEffect(PRESETS[(i + 1) % PRESETS.length]!.id);
    return;
  }
  let best: Track | null = null, bd = Infinity;
  for (const t of tracker.tracks) {
    if (t.lost) continue;
    const s = screenOf(t), d = Math.hypot(s.x - e.clientX, s.y - e.clientY);
    if (d < bd) { bd = d; best = t; }
  }
  if (!best || bd > Math.max(innerWidth, innerHeight) * 0.3) return;
  const cur = castOf(best.id);
  const next = rosterAt(rotationIndex(cur) + 1);
  overrides.set(best.id, next);
  ensureBuilt(next);
  toast(byId(next).name, 900);
});

// ── the loop ───────────────────────────────────────────────────────────────────────────────────────────────────────
let frame = 0, lastVideoTime = -1, lastSeen = 0, t0 = performance.now(), lastNow = performance.now();
// with masks (party mode, occlusion) the pose model sees a smaller copy of the frame: the masks come back at the input's
// size, one GPU→CPU copy each
const detCanvas = document.createElement('canvas');
const detCtx = detCanvas.getContext('2d')!;
function detectionInput(): HTMLVideoElement | HTMLCanvasElement {
  if (!masksWanted()) return video;
  const vw = video.videoWidth || 720, vh = video.videoHeight || 1280, k = 480 / Math.max(vw, vh);
  const w = Math.round(vw * k), h = Math.round(vh * k);
  if (detCanvas.width !== w || detCanvas.height !== h) { detCanvas.width = w; detCanvas.height = h; }
  detCtx.drawImage(video, 0, 0, w, h);
  return detCanvas;
}
let fps = 0, fpsT = performance.now(), fpsN = 0;
function intrinsics(): Intrinsics {
  // zoomed, the same sensor sees a narrower view: the focal length grows with the zoom (0.5: an ultra-wide)
  return guessIntrinsics(video.videoWidth || 720, video.videoHeight || 1280, settings.lens * (camera.zoom > 0 ? camera.zoom : 1));
}

/** the lens pill: the camera's zoom stops, or its other lenses; empty (hidden) when it offers no choice */
function renderLens(): void {
  const box = $('lens');
  box.innerHTML = '';
  if (SYNTH) return;
  const stops = camera.stops();
  const cur = camera.zoomRange
    ? stops.reduce((b, s, i) => (Math.abs(s.zoom - camera.zoom) < Math.abs(stops[b]!.zoom - camera.zoom) ? i : b), 0)
    : camera.lens;
  stops.forEach((st, i) => {
    const b = document.createElement('button');
    const on = i === cur;
    b.textContent = on ? st.label + '×' : st.label;
    b.classList.toggle('on', on);
    b.setAttribute('aria-label', camera.zoomRange ? `Zoom ${st.label}×` : `Camera ${st.label}`);
    b.onclick = () => {
      if (on) return;
      dip(async () => {
        try {
          if (st.zoom > 0) { await camera.setZoom(st.zoom); settings.zoom[camera.facing] = camera.zoom; persist(); }
          else { await camera.nextLens(-1 - st.zoom); stage.setVideo(video); }
        } catch (e) { toast(`Camera: ${(e as Error).message}`); }
        renderLens();
      });
    };
    box.appendChild(b);
  });
}
function loop(now: number): void {
  requestAnimationFrame(loop);
  if (!started) return;
  frame++;
  const K = intrinsics();
  stage.layout(K, camera.mirrored && !SYNTH);
  let dets: Detection[] | null = null;
  if (SYNTH) {
    dets = synthCrowd(SYNTH, (now - t0) / 1000 * (TEST ? 0 : 1) + Number(q.get('t') ?? 0), K);
    if (settings.scene === 'party') { const a = K.w / K.h, mw = a >= 1 ? 240 : Math.round(240 * a), mh = a >= 1 ? Math.round(240 / a) : 240; for (const d of dets) d.mask = synthMask(d, mw, mh, a); }
  } else if (detector && video.readyState >= 2 && video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    try { dets = detector.detect(detectionInput(), now); } catch (e) { console.error(e); }
  }
  // up for the upright check (pose/upright.ts): the floor's, from the phone's gravity or the people (last frame's)
  // (what the tracker is handed, as the debug recording keeps it for an exact replay: last frame's up, the People count)
  const upUsed = { x: stage.ground.n.x, y: stage.ground.n.y, z: stage.ground.n.z }, peopleUsed = settings.people;
  if (dets) tracker.update(dets.slice(0, settings.people), now, K, stage.ground.n);
  // faces from the full-resolution frame, each read from a crop round a person's head (pose/face.ts)
  if (dets) {
    let faces: Map<number, FaceDet> | null = null;
    if (faceTracker && settings.faces && !SYNTH) { try { faces = faceTracker.detect(video, tracker.tracks, K); } catch (e) { console.error(e); } }
    attachFaces(tracker.tracks, faces, K, now, lastFaceNow < 0 ? 1 / 30 : Math.min(0.25, (now - lastFaceNow) / 1000));
    lastFaceNow = now;
    // headless runs set the faces by hand (?jaw=0..1, ?face=blinkL:1,smile:1,lookX:-0.5)
    if (SYNTH && (q.get('jaw') || q.get('face'))) for (const t of tracker.tracks) if (t.face) Object.assign(t.face, parseFace(q.get('face'), { jaw: Number(q.get('jaw') ?? 0) }));
  }
  stage.ground.update(tracker.tracks, SYNTH ? null : motion.upInCamera(camera.facing), Math.min(0.25, (now - lastNow) / 1000));
  const costumed = settings.scene === 'costume' || settings.partyCostumes !== 'off';
  if (costumed) for (const t of tracker.tracks) ensureBuilt(castOf(t.id), true);
  const tSec = (now - t0) / 1000, dt = Math.min(0.25, (now - lastNow) / 1000);
  lastNow = now;
  const dressing = costumed;
  // costumes in the party: on you (and in Pyramid, cloned in 3D behind you), or only behind you, with you cut out
  // and drawn over them; either way the costumes clone, not the people in 2D
  const partying = settings.scene === 'party', behind = partying && settings.partyCostumes === 'behind';
  stage.pyramid = partying && settings.pyramid && settings.partyCostumes !== 'off';
  stage.hideWearers = behind;
  party.pyramid = settings.pyramid;
  stage.setForeground(behind ? party.foreground : null);
  party.clones = !stage.pyramid;
  stage.stageLights(settings.scene === 'party' && party.preset.id !== 'insitu', tSec, beat.env);
  // In Situ's club lights: laid out on the floor round the nearest person, real over the costumes, projected for the plate
  {
    const near = tracker.tracks.filter((t) => !t.lost).sort((a, b) => b.T.z - a.T.z)[0];
    const situ = settings.scene === 'party' && party.preset.id === 'insitu';
    const spots = stage.stageSpots(situ, tSec, beat.env, K, near ? new THREE.Vector3(near.T.x, near.T.y, near.T.z) : null);
    party.setSpots(spots, situ ? 1 : 0);
    stage.light.realism = situ;
  }
  stage.setGrain(true, tSec);
  // occlusion (render/occlusion.ts): the people's cut-outs this frame, before the costumes take their channels; the
  // picture's depth now and then (off the frame: it resolves later)
  if (settings.occlusion === 'all' && !SYNTH && stage.depth.due(now) && video.readyState >= 2) void stage.depth.read(video, tracker.tracks, K, now, { n: stage.ground.n, h: stage.ground.h });
  stage.depth.frame(settings.occlusion, tracker.tracks, stage.bgUniforms.uCrop.value, stage.bgUniforms.uMirror.value, stage.renderer.getDrawingBufferSize(new THREE.Vector2()), dt);
  stage.sync(dressing ? tracker.tracks : [], castOf, tSec);
  // the debug recording: this camera frame's raw detections and what the tracker and the stage made of them
  if (meta && dets) meta.frame(now, video.currentTime, dets, peopleUsed, tracker.tracks, K, upUsed, stage.ground, stage.wearersOut(), castOf);
  stage.googlyOn = settings.googly && settings.faces;
  stage.breathOn = settings.breath && settings.faces;
  stage.faces(tracker.tracks, K, dt);
  beat.update(dt, now);
  if (settings.scene === 'party') {
    party.subjects = settings.people;
    party.beat = beat.env;
    party.update(tracker.tracks, dt, tSec, K.w / K.h, stage.ground, K);
    party.render(stage.renderer, K.w, K.h);
  }
  stage.render(video, K, frame);
  if (snapWanted) {
    snapWanted = false;
    canvas.toBlob((b) => { if (b) void captured(b, `costuma-${stamp()}.jpg`); }, 'image/jpeg', 0.92);
  }
  const live = tracker.tracks.filter((t) => !t.lost).length;
  if (live) lastSeen = now;
  hint(now - lastSeen > 2500 ? 'Step back until your head and hips are in view' : '');
  drawOverlay();
  fpsN++;
  if (now - fpsT > 1000) { fps = (fpsN * 1000) / (now - fpsT); fpsN = 0; fpsT = now; readout(); autoQuality(); }
}

// a slow phone steps its pixels down (then its shadows) rather than stutter: three slow seconds a step, never back up
let slowSecs = 0, stepped = false;
function autoQuality(): void {
  if (TEST || !started || tracker.tracks.length === 0) return;
  slowSecs = fps < 22 ? slowSecs + 1 : 0;
  if (slowSecs < 3) return;
  slowSecs = 0;
  if (stage.opts.pixelRatio > 1.01) stage.opts.pixelRatio = Math.max(1, stage.opts.pixelRatio - 0.25);
  else if (stage.opts.shadows) { stage.opts.shadows = false; }
  else return;
  if (!stepped) { stepped = true; toast('Lowering quality to keep up', 1500); }
}

function drawOverlay(): void {
  const w = overlay.clientWidth, h = overlay.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
  if (overlay.width !== Math.round(w * dpr)) { overlay.width = Math.round(w * dpr); overlay.height = Math.round(h * dpr); }
  octx.setTransform(dpr, 0, 0, dpr, 0, 0);
  octx.clearRect(0, 0, w, h);
  if (!settings.debug) return;
  const c = stage.cover;
  const P = (p: { x: number; y: number }) => { let x = (p.x * c.vw - c.ox) * c.s; if (c.mirror) x = c.cw - x; return [x, (p.y * c.vh - c.oy) * c.s] as const; };
  // the floor as the app believes it: a grid under the nearest person (or ahead of the camera), half-metre squares
  {
    const g = stage.ground, K = intrinsics(), { back, side } = g.axes();
    const near = tracker.tracks.filter((t) => !t.lost).sort((a, b) => b.T.z - a.T.z)[0];
    const o = g.foot(near ? new THREE.Vector3(near.T.x, near.T.y, near.T.z) : new THREE.Vector3(0, 0, -3)).addScaledVector(back, -1);
    const pt = (u: number, v: number) => o.clone().addScaledVector(side, u).addScaledVector(back, v);
    const line = (a: THREE.Vector3, b: THREE.Vector3) => {
      if (a.z > -0.2 || b.z > -0.2) return;
      const [ax, ay] = P(project(a, K)), [bx, by] = P(project(b, K));
      octx.beginPath(); octx.moveTo(ax, ay); octx.lineTo(bx, by); octx.stroke();
    };
    octx.strokeStyle = 'rgba(125, 252, 255, 0.45)'; octx.lineWidth = 1.5;
    for (let u = -3; u <= 3.001; u += 0.5) line(pt(u, 0), pt(u, 8));
    for (let v = 0; v <= 8.001; v += 0.5) line(pt(-3, v), pt(3, v));
    octx.fillStyle = '#7dfcff'; octx.font = '600 12px system-ui';
    octx.fillText(`floor: ${g.source}${g.fromFeet ? ' + feet' : ''} · camera ${g.cameraHeight.toFixed(2)} m up`, 12, c.ch - 200);
  }
  for (const t of tracker.tracks) {
    octx.globalAlpha = t.presence;
    octx.strokeStyle = '#7dfcff'; octx.lineWidth = 3;
    for (const [a, b] of BONES) {
      const pa = t.image[a]!, pb = t.image[b]!;
      if (Math.min(pa.v, pb.v) < 0.4) continue;
      const [ax, ay] = P(pa), [bx, by] = P(pb);
      octx.beginPath(); octx.moveTo(ax, ay); octx.lineTo(bx, by); octx.stroke();
    }
    octx.fillStyle = '#ff8a1f';
    for (const p of t.image) { if (p.v < 0.4) continue; const [x, y] = P(p); octx.beginPath(); octx.arc(x, y, 4, 0, Math.PI * 2); octx.fill(); }
    const s = screenOf(t);
    octx.fillStyle = '#fff'; octx.font = '600 14px system-ui';
    octx.fillText(`#${t.id} ${byId(castOf(t.id)).name} · ${(-t.T.z).toFixed(1)} m`, s.x - 40, s.y);
  }
  octx.globalAlpha = 1;
}

function readout(): void {
  const el = $('readout');
  if (!el || $('settings').classList.contains('hidden')) return;
  const K = intrinsics();
  el.textContent = [
    `build ${__BUILD__}`,
    `${fps.toFixed(0)} fps · pose ${detector?.inferMs.toFixed(1) ?? '–'} ms (${detector?.delegate ?? '–'}, ${settings.model}) · face ${faceTracker ? faceTracker.inferMs.toFixed(1) + ' ms' : settings.faces ? 'loading' : 'off'}`,
    `video ${video.videoWidth}×${video.videoHeight} · f ${K.f.toFixed(0)} px · ${camera.facing}`,
    `camera ${camera.describe()}`,
    `occlusion ${settings.occlusion} · cut-outs ${stage.depth.people} (on ${stage.depth.u.uOcclMasksOn.value.toFixed(2)}) · depth ${stage.depth.ready ? `${stage.depth.engine} · ${stage.depth.ms.toFixed(0)} ms${stage.depth.cal ? ` · 1/z = ${stage.depth.cal.a.toFixed(3)}·d + ${stage.depth.cal.b.toFixed(3)} (${stage.depth.cal.n} points)` : ' · not yet calibrated'} · on ${stage.depth.u.uOcclDepthOn.value.toFixed(2)}` : settings.occlusion === 'all' ? 'loading' : 'off'}`,
    `people ${tracker.tracks.filter((t) => !t.lost).length} · dressed ${stage.count}`,
    ...tracker.tracks.filter((t) => !t.lost && t.face).map((t) => {
      const f = t.face!, e = new THREE.Euler().setFromQuaternion(f.head, 'YXZ'), d = (r: number) => Math.round(THREE.MathUtils.radToDeg(r));
      return `face ${t.id}: ${f.read ? 'read' : 'pose only'} · trust ${f.trust.toFixed(2)} · head yaw ${d(e.y)} nod ${d(e.x)} tilt ${d(e.z)} · jaw ${f.jaw.toFixed(2)} blink ${f.blinkL.toFixed(2)}/${f.blinkR.toFixed(2)} look ${f.lookX.toFixed(2)},${f.lookY.toFixed(2)}`;
    }),
    `pixels ×${stage.opts.pixelRatio.toFixed(2)} · shadows ${stage.opts.shadows ? 'on' : 'off'}`,
    `face light ${stage.light.faceConf > 0.05 ? `${stage.light.faceLum.toFixed(3)} from (${stage.light.faceDir.x.toFixed(2)}, ${stage.light.faceDir.y.toFixed(2)}) ×${stage.light.faceConf.toFixed(2)}` : '—'}`,
    `light mean ${stage.light.mean.toFixed(3)} × ${stage.light.gain.toFixed(2)} · key share ${stage.light.share.toFixed(2)} · every ${LIGHT_TUNE.every} frames`,
  ].join('\n');
}

// ── boot ───────────────────────────────────────────────────────────────────────────────────────────────────────────
async function reloadDetector(): Promise<void> {
  if (SYNTH) return;
  const old = detector;
  const d = new Detector(settings.model, settings.people, settings.poseConf);
  d.masks = masksWanted();
  await d.load((s) => toast(s, 2500));
  detector = d;
  old?.close();
  toast(settings.model === 'full' ? 'Accurate pose model' : 'Fast pose model', 1000);
}

/** the depth model, when occlusion is asked for (render/occlusion.ts): loaded once, in the background */
let depthLoading = false;
async function loadDepth(): Promise<void> {
  if (stage.depth.ready || depthLoading || SYNTH) return;
  depthLoading = true;
  try { await stage.depth.load((s) => toast(s, 2500)); toast(`Occlusion on (${stage.depth.engine === 'webgpu' ? 'GPU' : 'CPU'})`, 1500); }
  catch (e) { console.warn(e); toast('The depth model would not load on this phone: people only'); settings.occlusion = 'people'; persist(); }
  finally { depthLoading = false; }
}

/** the face model, in the background after Start: faces join in when it is ready, the start waits for nothing */
async function loadFaces(): Promise<void> {
  if (faceTracker || SYNTH || !settings.faces) return;
  const f = new FaceTracker();
  try { await f.load(); faceTracker = f; } catch (e) { console.warn('face model failed', e); }
}

/** a stand-in room for camera-free test runs: a dim wall, a bright window to the left, a floor */
function fakeRoom(): MediaStream {
  const c = document.createElement('canvas');
  c.width = 720; c.height = 1280;
  const g = c.getContext('2d')!;
  const draw = () => {
    const wall = g.createLinearGradient(0, 0, 0, 1280);
    wall.addColorStop(0, '#5a4a63'); wall.addColorStop(0.62, '#3b3142'); wall.addColorStop(0.63, '#6b5440'); wall.addColorStop(1, '#3a2c22');
    g.fillStyle = wall; g.fillRect(0, 0, 720, 1280);
    g.fillStyle = '#fff3d6'; g.fillRect(40, 220, 170, 330);
    g.fillStyle = '#ffb35a'; g.beginPath(); g.arc(600, 180, 46, 0, Math.PI * 2); g.fill();
  };
  draw();
  setInterval(draw, 500);
  return (c as HTMLCanvasElement & { captureStream: (fps: number) => MediaStream }).captureStream(30);
}

async function start(): Promise<void> {
  const status = $('start-status');
  const btn = $<HTMLButtonElement>('btn-start');
  btn.disabled = true;
  // the phone's gravity for the floor; iOS asks inside this tap, so before anything awaits
  const motionAsk = SYNTH ? Promise.resolve(false) : motion.enable();
  try {
    if (SYNTH) {
      video.srcObject = fakeRoom();
      await video.play().catch(() => undefined);
      if (q.get('mic')) await openMic();
      if (video.readyState < 2) await new Promise((r) => video.addEventListener('loadeddata', r, { once: true }));
    } else {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error(location.protocol !== 'https:' ? 'The camera needs an https:// page.' : 'This browser has no camera access.');
      status.textContent = 'Asking for the camera…';
      await camera.open(camera.facing, settings.zoom[camera.facing] ?? 1);
      renderLens();
      // the microphone for the session: clips record it, the music listener reads it (refused, clips are silent)
      status.textContent = 'Asking for the microphone…';
      await openMic();
      if (settings.music) void listen(false);
      status.textContent = 'Loading the pose model…';
      detector = new Detector(settings.model, settings.people, settings.poseConf);
      detector.masks = masksWanted();
      await detector.load((s) => { status.textContent = s[0]!.toUpperCase() + s.slice(1) + '…'; });
    }
    stage.setVideo(video);
    void motionAsk;
    status.textContent = `Dressing up as ${byId(settings.costume).name}…`;
    await new Promise((r) => setTimeout(r, 30));
    const first = settings.mode === 'one' ? settings.costume : ROSTER[0]!.id;
    await stage.prepare(first, true);
    // the rest in the background, in picker order; the face model too
    for (const d of rotation()) void stage.prepare(d.id);
    void loadFaces();
    if (settings.occlusion === 'all') void loadDepth();
    $('start').classList.add('hidden');
    $('hud').classList.remove('hidden');
    setScene(settings.scene);
    started = true;
    t0 = performance.now();
    lastSeen = performance.now();
    markPicker();
  } catch (e) {
    console.error(e);
    const err = e as Error;
    status.textContent = err.name === 'NotAllowedError' ? 'Camera permission was refused. Allow it in the browser settings and try again.' : `Could not start: ${err.message}`;
    btn.disabled = false;
  }
}

function boot(): void {
  $('btn-pyramid').innerHTML = ICONS.pyramid;
  const markPyramid = () => $('btn-pyramid').setAttribute('aria-pressed', String(settings.pyramid));
  markPyramid();
  $('btn-pyramid').onclick = () => {
    settings.pyramid = !settings.pyramid;
    persist(); markPyramid();
    toast(settings.pyramid ? 'Dance pyramid' : 'No pyramid', 800);
  };
  $('btn-googly').innerHTML = ICONS.googly;
  const markGoogly = () => $('btn-googly').setAttribute('aria-pressed', String(settings.googly));
  markGoogly();
  $('btn-googly').onclick = () => {
    settings.googly = !settings.googly;
    if (settings.googly && !settings.faces) { settings.faces = true; void loadFaces(); }
    persist(); markGoogly();
    toast(settings.googly ? 'Googly eyes' : 'No googly eyes', 800);
  };
  $('btn-qr').innerHTML = ICONS.qr; $('btn-flip').innerHTML = ICONS.flip; $('btn-gear').innerHTML = ICONS.gear;
  $('btn-snap').innerHTML = ICONS.camera; $('btn-rec').innerHTML = ICONS.rec;
  $('btn-start').onclick = () => void start();
  $('btn-start-qr').onclick = showQR;
  $('btn-qr').onclick = showQR;
  $('btn-gear').onclick = () => { buildSettings(); openModal('settings'); readout(); };
  $('btn-flip').onclick = async () => {
    if (SYNTH) return;
    dip(async () => { try { await camera.flip(settings.zoom[camera.facing === 'user' ? 'environment' : 'user'] ?? 1); stage.setVideo(video); tracker.clear(); overrides.clear(); mixed.clear(); } catch (e) { toast(`Camera: ${(e as Error).message}`); } renderLens(); });
  };
  $('btn-snap').onclick = () => { snapWanted = true; const f = $('stage'); f.style.filter = 'brightness(1.8)'; setTimeout(() => (f.style.filter = ''), 120); };
  $('btn-rec').onclick = toggleRecording;
  for (const b of document.querySelectorAll<HTMLButtonElement>('.modes button')) b.onclick = () => { if (b.dataset.scene !== settings.scene) dip(() => setScene(b.dataset.scene as Settings['scene'])); };
  const cast = $('start-cast');
  for (const d of rotation().slice(0, 6)) { const i = new Image(); i.src = thumbUrl(d.id); i.alt = d.name; i.onerror = () => i.remove(); cast.appendChild(i); }
  buildPicker();
  scrollablePicker($('picker'));
  requestAnimationFrame(loop);
  const w = window as unknown as { __costuma: unknown };
  w.__costuma = { stage, tracker, settings, start, choose, party, beat, setScene, chooseEffect, get started() { return started; }, get frame() { return frame; }, get mic() { return mic; }, LIGHT_TUNE, camera, intrinsics };
  if (TEST && SYNTH) void start();
}
boot();
