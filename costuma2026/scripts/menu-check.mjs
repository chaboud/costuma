// Nothing runs under a sheet (founder, 2026-11-03: "Menu performance sucks... No need to actively run the detectors when
// the menu is up"): headless, the real path (a still as Chromium's fake camera, the real pose model), checks that
//  - with no sheet up, frames are drawn and the tracker is fed;
//  - with the settings open, no frame is drawn and the tracker is not fed, for seconds; the readout still says what it
//    says (the costumes being made);
//  - a clip under way keeps everything running under the sheet;
//  - closed (its ✕), it all runs again, and the person keeps their track (and costume).
// Exit 1 on a failure.   npm run build && node scripts/menu-check.mjs <any.y4m>
import { createRequire } from 'node:module';
import { serveBuild } from './serve.mjs';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');

const clip = path.resolve(process.argv[2]);
const server = await serveBuild();
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', `--use-file-for-fake-video-capture=${clip}`, '--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['camera', 'microphone'] });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('pageerror', e.message));
await ctx.addInitScript(() => localStorage.setItem('costuma26.settings', JSON.stringify({ model: 'full', mode: 'one', people: 1 })));
await page.goto(`${server.url}index.html?c=skeleton&facing=environment&nosw=1`);
await page.click('#btn-start');
await page.waitForFunction(() => window.__costuma?.started, null, { timeout: 240000 });
await page.waitForFunction(() => window.__costuma.stage.count > 0 && window.__costuma.tracker.tracks.some((t) => !t.lost && t.presence >= 1), null, { timeout: 600000, polling: 1000 });
let fails = 0;
const ok = (c, what) => { console.log(`${c ? 'ok  ' : 'FAIL'} ${what}`); if (!c) fails++; };
const state = () => page.evaluate(() => ({ frame: window.__costuma.frame, last: window.__costuma.tracker.last, ids: window.__costuma.tracker.tracks.filter((t) => !t.lost).map((t) => t.id) }));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const a = await state();
await page.waitForFunction((f) => window.__costuma.frame > f + 1, a.frame, { timeout: 120000, polling: 250 });
const b = await state();
ok(b.frame > a.frame && b.last > a.last, `no sheet: frames drawn (${a.frame} → ${b.frame}), the tracker fed`);

await page.click('#btn-gear');
await wait(1500);
const c = await state();
await wait(6000);
const d = await state();
ok(d.frame === c.frame, `settings open: no frame drawn in 6 s (${c.frame} → ${d.frame})`);
ok(d.last === c.last, 'settings open: the tracker not fed');
const ro = await page.evaluate(() => document.getElementById('readout').textContent);
ok(/costumes \d+ made/.test(ro ?? ''), 'settings open: the readout still says how the costumes are coming along');

// a clip under way keeps the frame running under the sheet (the flag alone: the recorder's own path is capture-check's)
await page.evaluate(() => { window.__costuma.stage.recording = true; });
await page.waitForFunction((f) => window.__costuma.frame > f + 1, d.frame, { timeout: 120000, polling: 250 }).catch(() => {});
const e = await state();
ok(e.frame > d.frame + 1, `recording: frames drawn under the sheet (${d.frame} → ${e.frame})`);
await page.evaluate(() => { window.__costuma.stage.recording = false; });

await page.click('#settings [data-close]');
await page.waitForFunction((f) => window.__costuma.frame > f + 2, e.frame, { timeout: 120000, polling: 250 }).catch(() => {});
const f = await state();
ok(f.frame > e.frame + 2 && f.last > e.last, `closed: frames drawn again (${e.frame} → ${f.frame}), the tracker fed`);
ok(f.ids.length > 0 && f.ids.every((id) => a.ids.includes(id)), `closed: the person kept their track (${a.ids} → ${f.ids})`);
console.log(fails ? `${fails} failed` : 'all ok');
await browser.close();
await server.close();
process.exit(fails ? 1 : 0);
