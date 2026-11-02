// Occlusion headless (Chromium's fake camera, the real pose model and, for OCCL=all, the depth model on the CPU): the
// people's cut-outs arrive (and the depth model loads, reads and calibrates against them), and costumes behind a nearer
// person or thing are hidden; a screenshot of the same frozen frame with it on and with it off, the cut-outs (a colour
// each) and the depth map.   OCCL=people|all node scripts/occlusion-check.mjs <clip.y4m> <outdir>  (C= costume)
import { createRequire } from 'node:module';
import { serveBuild } from './serve.mjs';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');
const clip = path.resolve(process.argv[2]), out = process.argv[3] ?? 'shots-occl';
mkdirSync(out, { recursive: true });
const server = await serveBuild();
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', `--use-file-for-fake-video-capture=${clip}`] });
const mode = process.env.OCCL ?? 'all';
const ctx = await browser.newContext({ viewport: { width: Number(process.env.W ?? 844), height: Number(process.env.H ?? 390) }, permissions: ['camera'] });
await ctx.addInitScript((m) => localStorage.setItem('costuma26.settings', JSON.stringify({ model: 'lite', people: 3, occlusion: m, v: 7 })), mode);
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('pageerror', e.message));
page.on('console', (m) => { const t = m.text(); if (/depth|onnx|ort|wasm/i.test(t) && m.type() !== 'debug') console.log('console', m.type(), t.slice(0, 200)); });
await page.goto(`${server.url}index.html?c=${process.env.C ?? 'skeleton'}&facing=environment`);
await page.click('#btn-start');
await page.waitForFunction(() => window.__costuma?.started, null, { timeout: 300000 });
const t0 = Date.now();
// MIN=n: and at least that many people in view before the frame is frozen (a clip where people come and go)
await page.waitForFunction(([m, min]) => { const d = window.__costuma.stage.depth, n = window.__costuma.tracker.tracks.filter((t) => !t.lost).length; return n >= min && (m === 'all' ? d.cal && d.u.uOcclDepthOn.value > 0.9 : d.u.uOcclMasksOn.value > 0.9); }, [mode, Number(process.env.MIN ?? 1)], { timeout: 900000, polling: 2000 }).catch(() => console.log('not on after', (Date.now() - t0) / 1000, 's'));
const state = () => page.evaluate(() => { const d = window.__costuma.stage.depth; return { engine: d.engine, ms: Math.round(d.ms), cal: d.cal, masks: +d.u.uOcclMasksOn.value.toFixed(2), depth: +d.u.uOcclDepthOn.value.toFixed(2), cutOuts: d.people, fronts: d.u.uOcclPeopleZ.value.toArray().map((z) => +z.toFixed(2)), people: window.__costuma.tracker.tracks.filter((t) => !t.lost).map((t) => +(-t.T.z).toFixed(2)) }; });
const info = await state();
console.log(JSON.stringify(info));
// a fair A/B: the video frozen (the pose settles on that frame, a reading of that frame calibrates), then the same frame
// with the effect on and off
await page.evaluate(() => document.querySelector('video').pause());
const frames = async (n) => { const f = await page.evaluate(() => window.__costuma.frame); await page.waitForFunction((x) => window.__costuma.frame > x, f + n, { timeout: 600000, polling: 500 }); };
const read = async () => { await page.waitForFunction(() => window.__costuma.stage.depth.busy, null, { timeout: 600000, polling: 200 }).catch(() => undefined); await page.waitForFunction(() => !window.__costuma.stage.depth.busy, null, { timeout: 600000, polling: 500 }); };
await frames(4);
if (mode === 'all') { await read(); await read(); }
await frames(6);
console.log('frozen:', JSON.stringify(await state()));
await page.screenshot({ path: path.join(out, 'on.png'), timeout: 300000 });
// the same frame with the people alone (the depth model's part is on.png against this)
if (mode === 'all') {
  const people = () => page.evaluate(() => { const c = window.__costuma; c.settings.occlusion = 'people'; c.stage.depth.u.uOcclDepthOn.value = 0; });
  await people(); await frames(2); await people();
  await page.screenshot({ path: path.join(out, 'people.png'), timeout: 300000 });
}
const off = () => page.evaluate(() => { const c = window.__costuma; c.settings.occlusion = 'off'; for (const k of ['uOcclOn', 'uOcclMasksOn', 'uOcclDepthOn']) c.stage.depth.u[k].value = 0; });
await off(); await frames(2); await off();
await page.screenshot({ path: path.join(out, 'off.png'), timeout: 300000 });
// the cut-outs as the shader reads them: a colour a channel
const cm = await page.evaluate(() => {
  const img = window.__costuma.stage.depth.u.uOcclPeople.value.image, c = document.createElement('canvas');
  c.width = img.width; c.height = img.height; const g = c.getContext('2d'), id = g.createImageData(c.width, c.height);
  const col = [[255, 60, 60], [60, 255, 60], [60, 120, 255], [255, 220, 40]];
  for (let i = 0; i < img.width * img.height; i++) { const px = [0, 0, 0]; for (let k = 0; k < 4; k++) { const m = img.data[i * 4 + k] / 255; for (let j = 0; j < 3; j++) px[j] = Math.max(px[j], col[k][j] * m); } id.data.set([...px, 255], i * 4); }
  g.putImageData(id, 0, 0); return c.toDataURL('image/png');
});
(await import('node:fs')).writeFileSync(path.join(out, 'masks.png'), Buffer.from(cm.split(',')[1], 'base64'));
// the depth map itself, as the app holds it (metres; near light, 10 m and on black)
const dm = await page.evaluate(() => {
  const d = window.__costuma.stage.depth, img = d.texture.image, c = document.createElement('canvas');
  c.width = img.width; c.height = img.height; const g = c.getContext('2d'), id = g.createImageData(c.width, c.height);
  const f16 = (h) => { const e = (h >> 10) & 31, m = h & 1023; return e === 0 ? 2 ** -14 * (m / 1024) : 2 ** (e - 15) * (1 + m / 1024); };
  for (let i = 0; i < img.data.length; i++) { const z = f16(img.data[i]), k = Math.max(0, Math.min(255, 255 - z * 25)); id.data.set([k, k, k, 255], i * 4); }
  g.putImageData(id, 0, 0); return c.toDataURL('image/png');
});
(await import('node:fs')).writeFileSync(path.join(out, 'depth.png'), Buffer.from(dm.split(',')[1], 'base64'));
await browser.close();
await server.close();
