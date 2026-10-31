// The whole app headless, phone-sized, driven by synthetic people (?test=1&synth=N: no camera, a painted room).
//   node scripts/app-shots.mjs <outdir>    env: C=ids  N=2  T=0,1.5  W=390 H=844  EXTRA='&people=3'  DEBUG=1
import { createRequire } from 'node:module';
import { serveBuild } from './serve.mjs';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2] ?? 'shots-app';
mkdirSync(out, { recursive: true });
const server = await serveBuild(); // run `npm run build` first
const ids = (process.env.C ?? 'crimson').split(',');
const times = (process.env.T ?? '0,1.5').split(',');
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: Number(process.env.W ?? 390), height: Number(process.env.H ?? 844) }, deviceScaleFactor: 1 });
await ctx.addInitScript((dbg) => { try { localStorage.setItem('costuma26.settings', JSON.stringify({ debug: !!dbg[0], mode: dbg[1] || 'one' })); } catch {} }, [process.env.DEBUG ?? '', process.env.MODE ?? '']);
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('pageerror', e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('console', m.text().slice(0, 300)); });
for (const id of ids) for (const t of times) {
  await page.goto(`${server.url}index.html?test=1&synth=${process.env.N ?? 2}&c=${id}&t=${t}&people=4${process.env.EXTRA ?? ''}`);
  await page.waitForFunction(() => window.__costuma?.started && window.__costuma.frame > 12 && window.__costuma.stage.count > 0, null, { timeout: 240000 });
  await page.waitForTimeout(1500);
  const file = path.join(out, `${id}-t${t}.png`);
  await page.screenshot({ path: file });
  console.log(file);
}
await browser.close();
await server.close();
