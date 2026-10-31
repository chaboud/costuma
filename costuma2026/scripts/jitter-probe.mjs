// How much MediaPipe's answers move when nothing moves: the built app on a still (Chromium's fake camera), every raw
// detection recorded (world landmarks, image landmarks, the solved hips) to a JSON file, for tuning the smoothing
// offline against numbers (scripts/jitter-sim.mjs).   node scripts/jitter-probe.mjs <still.y4m> <out.json>   env: N=40
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { serveBuild } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const clip = path.resolve(process.argv[2]), out = process.argv[3] ?? 'jitter.json', N = Number(process.env.N ?? 40);
const server = await serveBuild();
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', `--use-file-for-fake-video-capture=${clip}`] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['camera'] });
const page = await ctx.newPage();
await page.goto(`${server.url}index.html?c=builder&facing=environment`);
await page.click('#btn-start');
await page.waitForFunction(() => window.__costuma?.started, null, { timeout: 240000 });
await page.evaluate(() => {
  const tr = window.__costuma.tracker, orig = tr.update.bind(tr);
  window.__raw = [];
  tr.update = (dets, now, K) => { if (dets.length) window.__raw.push({ now, K, dets: dets.map((d) => ({ world: d.world, image: d.image })) }); return orig(dets, now, K); };
});
await page.waitForFunction((n) => window.__raw.length >= n, N, { timeout: 1800000, polling: 2000 });
const raw = await page.evaluate(() => window.__raw);
writeFileSync(out, JSON.stringify(raw));
console.log('frames', raw.length);
await browser.close();
await server.close();
