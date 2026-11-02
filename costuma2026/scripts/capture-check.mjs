// Capture and the lens pill, headless, with what headless Chromium lacks stubbed in:
//  - as an iPhone (its user agent; a share sheet that records what it was handed): a photo goes straight to the sheet
//    with the file alone; when the sheet refuses (no recent tap), the preview opens with "Save to Photos";
//  - a camera that says it zooms 0.5–10× (Chrome's fake camera, its track's capabilities patched): the pill shows
//    .5 1× 2 3 5, a tap zooms the track and the focal length follows;
//  - the microphone opens at Start and stays; a clip carries its sound (Chromium's fake microphone: a beep), read back with ffprobe; with the
//    microphone refused, the clip is still made, silent, and the player is told;
//  - settings → Reset to defaults: one tap only arms it, the second puts every panel setting back and applies it;
//  - Video metadata (the real camera path, the real pose model): a clip's preview offers the debug zip, which holds the
//    clip, the camera's own recording and the log; the log replayed through today's tracker gives what the page's gave.
// Prints what it saw; exit 1 on a failure.   node scripts/capture-check.mjs <any.y4m>     (npm run build first)
import { createRequire } from 'node:module';
import { serveBuild } from './serve.mjs';
import path from 'node:path';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
const { chromium } = createRequire(import.meta.url)('playwright');

const clip = path.resolve(process.argv[2] ?? '');
const server = await serveBuild();
const fails = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const wake = (page) => page.evaluate(() => document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })));

// ── as an iPhone: the share sheet ──
{
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1' });
  await ctx.addInitScript(() => {
    window.__shared = [];
    window.__shareMode = 'ok';
    navigator.canShare = (d) => !!d?.files?.length;
    navigator.share = (d) => {
      window.__shared.push({ keys: Object.keys(d), files: (d.files ?? []).map((f) => ({ name: f.name, type: f.type, size: f.size })) });
      return window.__shareMode === 'refuse' ? Promise.reject(new DOMException('no activation', 'NotAllowedError')) : Promise.resolve();
    };
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('pageerror', e.message));
  await page.goto(`${server.url}index.html?test=1&synth=1&c=skeleton`);
  await page.waitForFunction(() => window.__costuma?.started && window.__costuma.frame > 3, null, { timeout: 300000, polling: 500 });
  await wake(page); await page.waitForTimeout(200);
  await page.evaluate(() => document.getElementById('btn-snap').click());
  await page.waitForFunction(() => window.__shared.length >= 1, null, { timeout: 120000, polling: 250 }).catch(() => undefined);
  const s1 = await page.evaluate(() => ({ shared: window.__shared, preview: !document.getElementById('preview').classList.contains('hidden') }));
  console.log(JSON.stringify(s1.shared));
  check(s1.shared.length === 1 && s1.shared[0].files[0]?.type === 'image/jpeg' && s1.shared[0].files[0].size > 10000, 'a photo goes to the share sheet as a jpeg file');
  check(s1.shared[0]?.keys.join() === 'files', 'the sheet gets the file alone (no title or text)');
  check(!s1.preview, 'no preview when the sheet opened');
  await page.evaluate(() => { window.__shareMode = 'refuse'; });
  await wake(page); await page.waitForTimeout(200);
  await page.evaluate(() => document.getElementById('btn-snap').click());
  await page.waitForFunction(() => !document.getElementById('preview').classList.contains('hidden'), null, { timeout: 120000, polling: 250 }).catch(() => undefined);
  const s2 = await page.evaluate(() => ({ preview: !document.getElementById('preview').classList.contains('hidden'), share: document.getElementById('btn-share').textContent, save: document.getElementById('btn-save').textContent, note: document.getElementById('preview-note').textContent }));
  console.log(JSON.stringify(s2));
  check(s2.preview && s2.share === 'Save to Photos' && /Save Image/.test(s2.note), 'refused: the preview offers Save to Photos and says which button to pick');
  if (process.env.SHOT) await page.screenshot({ path: path.resolve(process.env.SHOT) });
  await browser.close();
}

// ── a camera that zooms ──
{
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', `--use-file-for-fake-video-capture=${clip}`] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['camera'] });
  await ctx.addInitScript(() => {
    const P = MediaStreamTrack.prototype, caps = P.getCapabilities, sets = P.getSettings, apply = P.applyConstraints;
    window.__zoomCalls = [];
    P.getCapabilities = function () { return { ...caps.call(this), zoom: { min: 0.5, max: 10, step: 0.1 } }; };
    P.getSettings = function () { return { ...sets.call(this), zoom: this.__zoom ?? 1 }; };
    P.applyConstraints = function (c) { const z = c?.advanced?.[0]?.zoom; if (z !== undefined) { this.__zoom = z; window.__zoomCalls.push(z); return Promise.resolve(); } return apply.call(this, c); };
    localStorage.setItem('costuma26.settings', JSON.stringify({ model: 'lite', v: 6 }));
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('pageerror', e.message));
  await page.goto(`${server.url}index.html?c=skeleton&facing=environment`);
  await page.click('#btn-start');
  await page.waitForFunction(() => window.__costuma?.started, null, { timeout: 300000 });
  const pill = await page.evaluate(() => [...document.querySelectorAll('#lens button')].map((b) => b.textContent));
  console.log('pill', pill.join(' '));
  if (process.env.SHOT2) { await page.waitForTimeout(1500); await page.screenshot({ path: path.resolve(process.env.SHOT2) }); }
  check(pill.join(' ') === '.5 1× 2 3 5', 'the pill offers .5 1× 2 3 5');
  const f1 = await page.evaluate(() => window.__costuma.intrinsics().f);
  await wake(page); await page.waitForTimeout(200);
  await page.evaluate(() => [...document.querySelectorAll('#lens button')].find((b) => b.textContent === '.5').click());
  await page.waitForFunction(() => window.__costuma.camera.zoom === 0.5, null, { timeout: 20000, polling: 100 }).catch(() => undefined);
  await page.waitForTimeout(600);
  const after = await page.evaluate(() => ({ zoom: window.__costuma.camera.zoom, f: window.__costuma.intrinsics().f, calls: window.__zoomCalls, pill: [...document.querySelectorAll('#lens button')].map((b) => b.textContent).join(' '), saved: window.__costuma.settings.zoom }));
  console.log(JSON.stringify({ f1, ...after }));
  check(after.zoom === 0.5 && Math.abs(after.f / f1 - 0.5) < 1e-6, 'a tap on .5 zooms the track and halves the focal length');
  check(after.pill === '.5× 1 2 3 5' && after.saved.environment === 0.5, 'the pill marks .5× and the setting keeps it');
  await browser.close();
}
// ── clips carry sound ──
/** record a clip of about `secs` seconds with the shutter (desktop: it opens in the preview); its streams by ffprobe */
async function recordClip(page, secs) {
  // the costumes made first (headless, the workers starve the frames: a 3 s clip came out empty)
  await page.waitForFunction(() => window.__costuma.stage.building === 0, null, { timeout: 300000, polling: 500 });
  await wake(page); await page.waitForTimeout(200);
  await page.evaluate(() => document.getElementById('btn-rec').click());
  await page.waitForTimeout(secs * 1000);
  await wake(page); await page.waitForTimeout(200);
  await page.evaluate(() => document.getElementById('btn-rec').click());
  await page.waitForFunction(() => !document.getElementById('preview').classList.contains('hidden'), null, { timeout: 120000, polling: 250 });
  const got = await page.evaluate(async () => {
    const v = document.querySelector('#preview-media video'), b = await (await fetch(v.src)).blob();
    const bytes = new Uint8Array(await b.arrayBuffer());
    let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return { type: b.type, b64: btoa(s), toast: document.getElementById('toast').textContent };
  });
  const file = path.join(mkdtempSync(path.join(tmpdir(), 'clip-')), `clip.${got.type.includes('mp4') ? 'mp4' : 'webm'}`);
  writeFileSync(file, Buffer.from(got.b64, 'base64'));
  const streams = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,codec_name', '-of', 'csv=p=0', file]).toString().trim().split('\n');
  return { type: got.type, streams, toast: got.toast };
}
for (const refuse of [false, true]) {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['camera', 'microphone'] });
  if (refuse) await ctx.addInitScript(() => {
    const gum = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = (c) => (c?.audio ? Promise.reject(new DOMException('denied', 'NotAllowedError')) : gum(c));
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('pageerror', e.message));
  await page.goto(`${server.url}index.html?test=1&synth=1&mic=1&c=skeleton`);
  await page.waitForFunction(() => window.__costuma?.started && window.__costuma.frame > 3, null, { timeout: 300000, polling: 500 });
  const open = await page.evaluate(() => !!window.__costuma.mic?.getAudioTracks().some((t) => t.readyState === 'live'));
  if (!refuse) check(open, 'the microphone is open from Start, before any clip');
  const clip = await recordClip(page, 3);
  const still = await page.evaluate(() => !!window.__costuma.mic?.getAudioTracks().some((t) => t.readyState === 'live'));
  if (!refuse) check(still, 'and stays open after the clip');
  console.log(JSON.stringify({ refuse, type: clip.type, streams: clip.streams, toast: clip.toast }));
  if (!refuse) check(clip.streams.some((x) => x.endsWith('video')) && clip.streams.some((x) => x.endsWith('audio')), `a clip carries the picture and the sound (${clip.streams.join(' + ')})`);
  else check(clip.streams.some((x) => x.endsWith('video')) && !clip.streams.some((x) => x.endsWith('audio')) && /without sound/.test(clip.toast), 'the microphone refused: the clip is made, silent, and the player is told');
  await browser.close();
}

// ── reset to defaults ──
{
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  // a player who changed things: three people, steady, no shadows, a smaller costume, the lite model, the skeleton shown
  await ctx.addInitScript(() => { if (!sessionStorage.getItem('seeded')) { sessionStorage.setItem('seeded', '1'); localStorage.setItem('costuma26.settings', JSON.stringify({ people: 3, smoothing: 0.9, shadows: false, size: 0.9, model: 'lite', debug: true, costume: 'pumpkin', v: 7 })); } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('pageerror', e.message));
  await page.goto(`${server.url}index.html?test=1&synth=1`);
  await page.waitForFunction(() => window.__costuma?.started && window.__costuma.frame > 3, null, { timeout: 300000, polling: 500 });
  await wake(page); await page.waitForTimeout(200);
  await page.evaluate(() => document.getElementById('btn-gear').click());
  const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem('costuma26.settings')));
  await page.evaluate(() => document.getElementById('btn-reset').click());
  const once = { s: await stored(), label: await page.evaluate(() => document.getElementById('btn-reset').textContent) };
  check(once.s.people === 3 && once.s.smoothing === 0.9 && once.label === 'Tap again to reset', 'one tap only arms the reset');
  await page.evaluate(() => document.getElementById('btn-reset').click());
  const after = await stored(), ui = await page.evaluate(() => ({
    people: document.querySelector('#settings-body .seg button.on')?.textContent,
    debug: [...document.querySelectorAll('#settings-body .set')].find((d) => /skeleton/.test(d.textContent))?.querySelector('input').checked,
    shadows: window.__costuma.stage.opts.shadows, size: window.__costuma.stage.opts.size, toast: document.getElementById('toast').textContent,
  }));
  console.log(JSON.stringify({ after: { people: after.people, smoothing: after.smoothing, shadows: after.shadows, size: after.size, model: after.model, debug: after.debug, costume: after.costume }, ui }));
  check(after.people === 2 && after.smoothing === 0.5 && after.shadows === true && after.size === 1 && after.model === 'full' && after.debug === false, 'the second tap puts the panel\'s settings back');
  check(ui.people === '2' && ui.debug === false && ui.shadows === true && ui.size === 1 && /defaults/.test(ui.toast), 'the panel shows them, the stage takes them, the player is told');
  check(after.costume === 'pumpkin', 'what is chosen outside the panel (the costume) stays');
  await browser.close();
}

// ── a debug recording (Video metadata) ──
{
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', `--use-file-for-fake-video-capture=${clip}`] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['camera', 'microphone'], acceptDownloads: true });
  await ctx.addInitScript(() => localStorage.setItem('costuma26.settings', JSON.stringify({ model: 'lite', videoMeta: true, v: 7 })));
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('pageerror', e.message));
  await page.goto(`${server.url}index.html?c=skeleton&facing=environment`);
  await page.click('#btn-start');
  await page.waitForFunction(() => window.__costuma?.started && window.__costuma.tracker.tracks.some((t) => !t.lost), null, { timeout: 300000, polling: 500 });
  const rec = await recordClip(page, 6);
  const shown = await page.evaluate(() => !document.getElementById('btn-debug').classList.contains('hidden'));
  check(shown, 'the preview offers the debug data');
  const dl = page.waitForEvent('download', { timeout: 60000 });
  await page.evaluate(() => document.getElementById('btn-debug').click());
  const d = await dl;
  const zipPath = path.join(mkdtempSync(path.join(tmpdir(), 'debug-')), d.suggestedFilename());
  await d.saveAs(zipPath);
  const list = execFileSync('unzip', ['-Z1', zipPath]).toString().trim().split('\n');
  console.log(JSON.stringify({ zip: path.basename(zipPath), files: list, clip: rec.streams }));
  check(list.length === 3 && list.some((f) => f.endsWith('-meta.json')) && list.some((f) => /-camera\.(mp4|webm)$/.test(f)) && list.some((f) => /^costuma-[^/]*\d\.(mp4|webm)$/.test(f)), 'the zip holds the clip, the camera\'s own recording and the log');
  const dir = path.dirname(zipPath);
  execFileSync('unzip', ['-o', '-q', zipPath, '-d', dir]);
  const cam = list.find((f) => /-camera\./.test(f));
  const camStreams = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,width,height', '-of', 'csv=p=0', path.join(dir, cam)]).toString().trim();
  check(/video/.test(camStreams), `the camera's own recording is video (${camStreams})`);
  const replay = execFileSync('npx', ['vitest', 'run', 'scripts/meta-replay.test.ts'], { cwd: path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), env: { ...process.env, META: zipPath } }).toString();
  const lines = replay.split('\n').filter((l) => /build |camera |track |detections|replayed/.test(l));
  console.log(lines.join('\n'));
  check(/· the same/.test(replay) && /tracks only the phone had 0, only the replay 0/.test(replay), 'the log replayed through today\'s tracker gives what the page\'s tracker gave');
  await browser.close();
}

await server.close();
console.log(fails.length ? `${fails.length} failed` : 'all ok');
process.exit(fails.length ? 1 : 0);
