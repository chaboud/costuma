// Occlusion from the depth model, headless (Chromium's fake camera, the real pose and depth models on the CPU): the
// model loads, reads, calibrates against the people, and costumes behind a nearer person or thing are hidden; a
// screenshot of the same moment with it on and with it off.   node scripts/occlusion-check.mjs <clip.y4m> <outdir>  (C= costume)
import { createRequire } from 'node:module';
import { serveBuild } from './serve.mjs';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');
const clip = path.resolve(process.argv[2]), out = process.argv[3] ?? 'shots-occl';
mkdirSync(out, { recursive: true });
const server = await serveBuild();
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', `--use-file-for-fake-video-capture=${clip}`] });
const ctx = await browser.newContext({ viewport: { width: Number(process.env.W ?? 844), height: Number(process.env.H ?? 390) }, permissions: ['camera'] });
await ctx.addInitScript(() => localStorage.setItem('costuma26.settings', JSON.stringify({ model: 'lite', people: 3, occlusion: true, v: 7 })));
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('pageerror', e.message));
page.on('console', (m) => { const t = m.text(); if (/depth|onnx|ort|wasm/i.test(t) && m.type() !== 'debug') console.log('console', m.type(), t.slice(0, 200)); });
await page.goto(`${server.url}index.html?c=${process.env.C ?? 'skeleton'}&facing=environment`);
await page.click('#btn-start');
await page.waitForFunction(() => window.__costuma?.started, null, { timeout: 300000 });
const t0 = Date.now();
await page.waitForFunction(() => window.__costuma.stage.depth.cal && window.__costuma.stage.depth.u.uOcclOn.value > 0.9, null, { timeout: 900000, polling: 2000 }).catch(() => console.log('no calibration after', (Date.now() - t0) / 1000, 's'));
const info = await page.evaluate(() => { const d = window.__costuma.stage.depth; return { engine: d.engine, ms: Math.round(d.ms), cal: d.cal, on: d.u.uOcclOn.value, people: window.__costuma.tracker.tracks.filter((t) => !t.lost).length }; });
console.log(JSON.stringify(info));
// freeze the depth and pose for a fair A/B: stop the clock where it is
await page.evaluate(() => { window.__costuma.settings.occlusion = true; });
await page.screenshot({ path: path.join(out, 'on.png'), timeout: 300000 });
await page.evaluate(() => { window.__costuma.settings.occlusion = false; window.__costuma.stage.depth.u.uOcclOn.value = 0; });
const f = await page.evaluate(() => window.__costuma.frame);
await page.waitForFunction((x) => window.__costuma.frame > x, f, { timeout: 120000, polling: 200 });
await page.evaluate(() => { window.__costuma.stage.depth.u.uOcclOn.value = 0; });
await page.screenshot({ path: path.join(out, 'off.png'), timeout: 300000 });
await browser.close();
await server.close();
