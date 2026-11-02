// The cloth's swing, held, in the built app (?test=1&synth=1): each costume at rest, swung to its left, swung back, and
// twisted round — the shapes the moving hem passes through, for seams (where the hem's angle wraps at the back), tears
// and the swing's direction.   node scripts/cloth-shots.mjs <outdir>   (C=ghost,witch; npm run build first)
import { createRequire } from 'node:module';
import { serveBuild } from './serve.mjs';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = process.argv[2] ?? 'shots-cloth';
mkdirSync(out, { recursive: true });
const server = await serveBuild();
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 700 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('pageerror', e.message));
const POSES = { rest: '0,0,0', left: 'm,0,0', back: '0,0,-m', twist: 'tw' };
for (const id of (process.env.C ?? 'ghost,witch').split(',')) {
  await page.goto(`${server.url}index.html?test=1&synth=1&c=${id}&people=1`);
  await page.waitForFunction(() => window.__costuma?.started && window.__costuma.frame > 12 && window.__costuma.stage.count > 0, null, { timeout: 240000 });
  await page.waitForTimeout(1500);
  for (const [name, how] of Object.entries(POSES)) {
    const ok = await page.evaluate((how) => {
      const w = [...window.__costuma.stage.wearers.values()][0], c = w?.cloth;
      if (!c) return false;
      const defs = w.def.cloth;
      c.set((th, j) => {
        const m = defs[j].max;
        if (how === 'tw') return [Math.cos(th) * m, 0, -Math.sin(th) * m]; // tangential: the hem turned round
        const [x, y, z] = how.split(',').map((v) => (v === 'm' ? m : v === '-m' ? -m : Number(v)));
        return [x, y, z];
      });
      return true;
    }, how);
    const f0 = await page.evaluate(() => window.__costuma.frame);
    await page.waitForFunction((f) => window.__costuma.frame > f + 2, f0, { timeout: 120000 });
    const file = path.join(out, `${id}-${name}.png`);
    await page.screenshot({ path: file });
    console.log(file, ok ? '' : '(no cloth)');
  }
}
await browser.close();
await server.close();
