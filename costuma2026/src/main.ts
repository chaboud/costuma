// costuma 2026: the boot, the frame loop and the HUD. Camera → MediaPipe pose (several people, 3D) → tracker (stable
// ids) → each person's costume posed and placed in camera space → drawn over the camera frame, lit by it.
import './style.css';
import { Camera } from './camera';
import { Detector } from './pose/detector';
import { Tracker, type Detection, type Track } from './pose/tracker';
import { guessIntrinsics, project, type Intrinsics } from './pose/solve';
import * as THREE from 'three';
import { synthCrowd, synthMask } from './pose/synth';
import { BONES, L } from './pose/landmarks';
import { BG_VERT, Stage } from './render/stage';
import { PRESETS, Party } from './render/party';
import { Beat } from './audio/beat';
import { Motion } from './platform/motion';
import { LIGHT_TUNE } from './render/envlight';
import { ROSTER, byId } from './characters/roster';
import { loadSettings, saveSettings, type Settings } from './settings';
import { ICONS } from './ui/icons';
import { pageUrl, qrSvg } from './ui/qr';
import { recorderMime, saveFile, shareFile } from './ui/share';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const BASE = import.meta.env.BASE_URL;
const q = new URLSearchParams(location.search);
const TEST = q.get('test') === '1';
const SYNTH = Number(q.get('synth') ?? 0);

const settings: Settings = loadSettings();
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
const beat = new Beat();
const motion = new Motion();
if (q.get('scene') === 'party' || q.get('scene') === 'costume') settings.scene = q.get('scene') as Settings['scene'];
if (q.get('fx')) settings.effect = q.get('fx')!;
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
function castOf(trackId: number): string {
  const o = overrides.get(trackId);
  if (o) return o;
  if (settings.mode === 'one') return settings.costume;
  let m = mixed.get(trackId);
  if (!m) {
    const start = ROSTER.findIndex((d) => d.id === settings.costume);
    m = ROSTER[(start + mixNext++) % ROSTER.length]!.id;
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
      img.onerror = () => { img.remove(); th.textContent = name.slice(0, 1); };
      img.src = thumbUrl(id);
      th.appendChild(img);
    }
    b.onclick = () => choose(id);
    el.appendChild(b);
  };
  card('mix', 'Mix', 'mix');
  for (const d of ROSTER) card(d.id, d.name);
  markPicker();
}
function markPicker(): void {
  for (const b of $('picker').querySelectorAll<HTMLButtonElement>('.card')) {
    const on = settings.scene === 'party' ? b.dataset.id === settings.effect : settings.mode === 'mix' ? b.dataset.id === 'mix' : b.dataset.id === settings.costume;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', String(on));
    if (on) b.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}
function choose(id: string): void {
  overrides.clear();
  if (id === 'mix') {
    settings.mode = 'mix';
    mixed.clear(); mixNext = 0;
    toast('Mix: everyone gets their own');
  } else {
    settings.mode = 'one';
    settings.costume = id;
    ensureBuilt(id);
    if (stage.hasTemplate(id)) toast(byId(id).name, 900);
  }
  persist();
  markPicker();
}

function chooseEffect(id: string): void {
  const p = PRESETS.find((x) => x.id === id) ?? PRESETS[0]!;
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

/** costumes, or party mode; party asks the pose model for each person's cut-out mask */
function setScene(scene: Settings['scene']): void {
  settings.scene = scene;
  persist();
  stage.setBackground(scene === 'party' ? party.material : null);
  void detector?.setOptions({ masks: scene === 'party' });
  for (const b of document.querySelectorAll<HTMLButtonElement>('.modes button')) {
    const on = b.dataset.scene === scene;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', String(on));
  }
  buildPicker();
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

function buildSettings(): void {
  const body = $('settings-body');
  body.innerHTML = '';
  const row = (label: string, note: string, control: HTMLElement) => {
    const d = document.createElement('div');
    d.className = 'set';
    const l = document.createElement('label');
    const span = document.createElement('span');
    span.textContent = label;
    if (note) { const s = document.createElement('small'); s.textContent = note; span.appendChild(s); }
    l.append(span, control);
    d.appendChild(l);
    body.appendChild(d);
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
  row('Pose model', 'Accurate is steadier, slower to load and run', seg<'lite' | 'full'>([['lite', 'Fast'], ['full', 'Accurate']], () => settings.model, (v) => { settings.model = v; void reloadDetector(); }));
  row('Light from the camera', 'The costume is lit by the room it stands in', sw(() => settings.envLight, (v) => { settings.envLight = v; stage.opts.envLight = v; }));
  row('Shadows', 'Off is faster on older phones', sw(() => settings.shadows, (v) => { settings.shadows = v; stage.opts.shadows = v; }));
  row('Lens', 'If costumes look too flat or too deep', range(0.55, 1.3, 0.01, () => settings.lens, (v) => { settings.lens = v; }));
  row('React to the music', 'Listens through the microphone for the beat; clips record the sound', sw(() => settings.music, (v) => {
    settings.music = v;
    if (v) beat.start().then(() => toast('Listening for the beat', 1200)).catch(() => { settings.music = false; persist(); toast('No microphone'); });
    else beat.stop();
  }));
  row('Costumes in party mode', 'Behind you: you stay yourself, a pyramid of your costume dances behind you', seg<Settings['partyCostumes']>([['off', 'Off'], ['behind', 'Behind'], ['on', 'On you']], () => settings.partyCostumes, (v) => { settings.partyCostumes = v; }));
  row('Show the skeleton', 'What the pose tracker sees', sw(() => settings.debug, (v) => { settings.debug = v; }));
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
  openModal('preview');
}
$('btn-share').onclick = async () => { if (lastCapture) { const r = await shareFile(lastCapture.blob, lastCapture.name); if (r === 'saved') toast('Saved'); } };
$('btn-save').onclick = () => { if (lastCapture) { saveFile(lastCapture.blob, lastCapture.name); toast('Saved'); } };
const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

let recorder: MediaRecorder | null = null;
let recTimer = 0;
function toggleRecording(): void {
  const btn = $('btn-rec');
  if (recorder) { recorder.stop(); return; }
  const mime = recorderMime();
  const cs = (canvas as HTMLCanvasElement & { captureStream?: (fps: number) => MediaStream }).captureStream;
  if (!mime || !cs) { toast('Recording is not supported in this browser'); return; }
  const chunks: Blob[] = [];
  const stream = cs.call(canvas, 30);
  // with the music on, the clip carries the sound the beat was taken from
  for (const t of beat.stream?.getAudioTracks() ?? []) stream.addTrack(t);
  const r = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
  r.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  r.onstop = () => {
    clearTimeout(recTimer);
    recorder = null;
    btn.classList.remove('on'); btn.innerHTML = ICONS.rec;
    const type = mime.split(';')[0]!;
    preview(new Blob(chunks, { type }), `costuma-${stamp()}.${type.includes('mp4') ? 'mp4' : 'webm'}`);
  };
  r.start(250);
  recorder = r;
  btn.classList.add('on'); btn.innerHTML = ICONS.stop;
  recTimer = window.setTimeout(() => r.state === 'recording' && r.stop(), 20000);
  toast('Recording — tap to stop', 1200);
}

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
  const cur = castOf(best.id), i = ROSTER.findIndex((d) => d.id === cur);
  const next = ROSTER[(i + 1) % ROSTER.length]!.id;
  overrides.set(best.id, next);
  ensureBuilt(next);
  toast(byId(next).name, 900);
});

// ── the loop ───────────────────────────────────────────────────────────────────────────────────────────────────────
let frame = 0, lastVideoTime = -1, lastSeen = 0, t0 = performance.now(), lastNow = performance.now();
// party mode detects on a smaller copy of the frame: the masks come back at the input's size, one GPU→CPU copy each
const detCanvas = document.createElement('canvas');
const detCtx = detCanvas.getContext('2d')!;
function detectionInput(): HTMLVideoElement | HTMLCanvasElement {
  if (settings.scene !== 'party') return video;
  const vw = video.videoWidth || 720, vh = video.videoHeight || 1280, k = 480 / Math.max(vw, vh);
  const w = Math.round(vw * k), h = Math.round(vh * k);
  if (detCanvas.width !== w || detCanvas.height !== h) { detCanvas.width = w; detCanvas.height = h; }
  detCtx.drawImage(video, 0, 0, w, h);
  return detCanvas;
}
let fps = 0, fpsT = performance.now(), fpsN = 0;
function intrinsics(): Intrinsics {
  return guessIntrinsics(video.videoWidth || 720, video.videoHeight || 1280, settings.lens);
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
  if (dets) tracker.update(dets.slice(0, settings.people), now, K);
  stage.ground.update(tracker.tracks, SYNTH ? null : motion.upInCamera(camera.facing), Math.min(0.25, (now - lastNow) / 1000));
  const costumed = settings.scene === 'costume' || settings.partyCostumes !== 'off';
  if (costumed) for (const t of tracker.tracks) ensureBuilt(castOf(t.id), true);
  const tSec = (now - t0) / 1000, dt = Math.min(0.25, (now - lastNow) / 1000);
  lastNow = now;
  const dressing = costumed;
  // costumes in the party: on you (and in Pyramid, cloned in 3D behind you), or only behind you, with you cut out
  // and drawn over them; either way the costumes clone, not the people in 2D
  const partying = settings.scene === 'party', behind = partying && settings.partyCostumes === 'behind';
  stage.pyramid = behind || (partying && settings.partyCostumes === 'on' && party.preset.id === 'pyramid');
  stage.hideWearers = behind;
  stage.setForeground(behind ? party.foreground : null);
  party.clones = !stage.pyramid;
  stage.stageLights(settings.scene === 'party', tSec, beat.env);
  stage.sync(dressing ? tracker.tracks : [], castOf, tSec);
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
    canvas.toBlob((b) => b && preview(b, `costuma-${stamp()}.jpg`), 'image/jpeg', 0.92);
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
    `${fps.toFixed(0)} fps · pose ${detector?.inferMs.toFixed(1) ?? '–'} ms (${detector?.delegate ?? '–'}, ${settings.model})`,
    `video ${video.videoWidth}×${video.videoHeight} · f ${K.f.toFixed(0)} px · ${camera.facing}`,
    `people ${tracker.tracks.filter((t) => !t.lost).length} · dressed ${stage.count}`,
    `pixels ×${stage.opts.pixelRatio.toFixed(2)} · shadows ${stage.opts.shadows ? 'on' : 'off'}`,
    `light mean ${stage.light.mean.toFixed(3)} × ${stage.light.gain.toFixed(2)} · key share ${stage.light.share.toFixed(2)} · every ${LIGHT_TUNE.every} frames`,
  ].join('\n');
}

// ── boot ───────────────────────────────────────────────────────────────────────────────────────────────────────────
async function reloadDetector(): Promise<void> {
  if (SYNTH) return;
  const old = detector;
  const d = new Detector(settings.model, settings.people);
  d.masks = settings.scene === 'party';
  await d.load((s) => toast(s, 2500));
  detector = d;
  old?.close();
  toast(settings.model === 'full' ? 'Accurate pose model' : 'Fast pose model', 1000);
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
      if (video.readyState < 2) await new Promise((r) => video.addEventListener('loadeddata', r, { once: true }));
    } else {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error(location.protocol !== 'https:' ? 'The camera needs an https:// page.' : 'This browser has no camera access.');
      status.textContent = 'Asking for the camera…';
      await camera.open();
      status.textContent = 'Loading the pose model…';
      detector = new Detector(settings.model, settings.people);
      detector.masks = settings.scene === 'party';
      await detector.load((s) => { status.textContent = s[0]!.toUpperCase() + s.slice(1) + '…'; });
    }
    stage.setVideo(video);
    void motionAsk;
    status.textContent = `Dressing up as ${byId(settings.costume).name}…`;
    await new Promise((r) => setTimeout(r, 30));
    const first = settings.mode === 'one' ? settings.costume : ROSTER[0]!.id;
    await stage.prepare(first, true);
    // the rest in the background, in picker order
    for (const d of ROSTER) void stage.prepare(d.id);
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
  $('btn-qr').innerHTML = ICONS.qr; $('btn-flip').innerHTML = ICONS.flip; $('btn-gear').innerHTML = ICONS.gear;
  $('btn-snap').innerHTML = ICONS.camera; $('btn-rec').innerHTML = ICONS.rec;
  $('btn-start').onclick = () => void start();
  $('btn-start-qr').onclick = showQR;
  $('btn-qr').onclick = showQR;
  $('btn-gear').onclick = () => { buildSettings(); openModal('settings'); readout(); };
  $('btn-flip').onclick = async () => {
    if (SYNTH) return;
    dip(async () => { try { await camera.flip(); stage.setVideo(video); tracker.clear(); overrides.clear(); mixed.clear(); } catch (e) { toast(`Camera: ${(e as Error).message}`); } });
  };
  $('btn-snap').onclick = () => { snapWanted = true; const f = $('stage'); f.style.filter = 'brightness(1.8)'; setTimeout(() => (f.style.filter = ''), 120); };
  $('btn-rec').onclick = toggleRecording;
  for (const b of document.querySelectorAll<HTMLButtonElement>('.modes button')) b.onclick = () => { if (b.dataset.scene !== settings.scene) dip(() => setScene(b.dataset.scene as Settings['scene'])); };
  const cast = $('start-cast');
  for (const d of ROSTER.slice(0, 6)) { const i = new Image(); i.src = thumbUrl(d.id); i.alt = d.name; i.onerror = () => i.remove(); cast.appendChild(i); }
  buildPicker();
  requestAnimationFrame(loop);
  const w = window as unknown as { __costuma: unknown };
  w.__costuma = { stage, tracker, settings, start, choose, party, beat, setScene, chooseEffect, get started() { return started; }, get frame() { return frame; }, LIGHT_TUNE };
  if (TEST && SYNTH) void start();
}
boot();
