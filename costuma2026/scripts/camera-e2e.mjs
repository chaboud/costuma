// The real path, headless: a still or clip as Chromium's fake camera → getUserMedia → MediaPipe (vendored wasm and
// model) → tracker → costume. Prints what the tracker saw and the pose read off it; screenshots with and without the
// skeleton overlay.
//   node scripts/camera-e2e.mjs <clip.y4m> <outdir>    env: C=crimson FACING=environment|user MODEL=lite|full W= H=
import { createRequire } from 'node:module';
import { serveBuild } from './serve.mjs';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clip = path.resolve(process.argv[2]);
const out = process.argv[3] ?? 'shots-e2e';
mkdirSync(out, { recursive: true });
const server = await serveBuild(); // run `npm run build` first
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', `--use-file-for-fake-video-capture=${clip}`, '--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: Number(process.env.W ?? 390), height: Number(process.env.H ?? 844) }, permissions: ['camera'] });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('pageerror', e.message));
page.on('console', (m) => { const t = m.text(); if (m.type() === 'error' || m.type() === 'warning' || /GPU|delegate/i.test(t)) console.log('console', m.type(), t.slice(0, 240)); });
const C = process.env.C ?? 'crimson';
await ctx.addInitScript((m) => localStorage.setItem('costuma26.settings', JSON.stringify({ model: m, debug: false, mode: 'one', people: 2 })), process.env.MODEL ?? 'lite');
await page.goto(`${server.url}index.html?c=${C}&facing=${process.env.FACING ?? 'environment'}${process.env.EXTRA ?? ''}`);
await page.click('#btn-start');
await page.waitForFunction(() => window.__costuma?.started, null, { timeout: 240000 });
const t0 = Date.now();
// headless software GL runs this at well under 1 fps: wait on frames, not seconds
await page.waitForFunction(() => (window.__costuma.stage.count > 0 || window.__costuma.settings.scene === 'party') && window.__costuma.tracker.tracks.some((t) => t.presence >= 1), null, { timeout: 400000, polling: 1000 }).catch(() => console.log('no costume after', (Date.now() - t0) / 1000, 's'));
const f0 = await page.evaluate(() => window.__costuma.frame);
await page.waitForFunction((f) => window.__costuma.frame > f + 4, f0, { timeout: 200000, polling: 1000 });
const info = await page.evaluate(() => {
  const c = window.__costuma;
  const deg = (r) => Math.round((r * 180) / Math.PI);
  return c.tracker.tracks.map((t) => {
    const w = t.world;
    const v = (i) => [w[i].x, w[i].y, w[i].z].map((n) => +n.toFixed(2));
    return { id: t.id, presence: +t.presence.toFixed(2), T: [t.T.x, t.T.y, t.T.z].map((n) => +n.toFixed(2)), torso: +t.len.torso.toFixed(2),
      nose: v(0), earL: v(7), earR: v(8), shL: v(11), shR: v(12), wrL: v(15), wrR: v(16), hipL: v(23), hipR: v(24), anL: v(27), anR: v(28),
      vis: { wrL: +w[15].v.toFixed(2), anL: +w[27].v.toFixed(2) } };
  });
});
console.log(JSON.stringify(info, null, 1));
await page.screenshot({ path: path.join(out, `${C}-e2e.png`), timeout: 300000 });
await page.evaluate(() => { window.__costuma.settings.debug = true; });
const f1 = await page.evaluate(() => window.__costuma.frame);
await page.waitForFunction((f) => window.__costuma.frame > f + 1, f1, { timeout: 100000, polling: 500 });
await page.screenshot({ path: path.join(out, `${C}-e2e-debug.png`), timeout: 300000 });
await page.evaluate(() => document.getElementById('btn-gear').click());
await page.waitForTimeout(6000);
const readout = await page.evaluate(() => document.getElementById('readout').textContent);
console.log(readout);
await browser.close();
await server.close();
