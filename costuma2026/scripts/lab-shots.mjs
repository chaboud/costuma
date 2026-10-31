// Shoot the lab turntable for each character × pose × view. Starts its own vite dev server (no process juggling).
//   node scripts/lab-shots.mjs <outdir>        env: C=ids (comma) POSES=rest,wave YAWS=0,35,90,180 EXTRA='&res=96'
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { createServer } from 'vite';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2] ?? 'shots-lab';
mkdirSync(out, { recursive: true });
const server = await createServer({ root, server: { port: 0, host: '127.0.0.1', hmr: false, watch: null }, logLevel: 'error' });
await server.listen();
const port = server.httpServer.address().port;
const { ROSTER_IDS } = await server.ssrLoadModule('/src/characters/ids.ts');
const ids = (process.env.C ?? ROSTER_IDS.join(',')).split(',');
const poses = (process.env.POSES ?? 'rest,wave').split(',');
const yaws = (process.env.YAWS ?? '0,35,90,180').split(',');
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 512, height: 768 } });
page.on('pageerror', (e) => console.log('pageerror', e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('console', m.text().slice(0, 300)); });
for (const id of ids) for (const pose of poses) for (const yaw of yaws) {
  const url = `http://127.0.0.1:${port}/lab.html?c=${id}&pose=${pose}&yaw=${yaw}${process.env.EXTRA ?? ''}`;
  await page.goto(url);
  await page.waitForFunction(() => window.__lab?.ready, null, { timeout: 180000 });
  const info = await page.evaluate(() => window.__lab);
  const file = path.join(out, `${id}-${pose}-${yaw}.png`);
  await page.locator('canvas').screenshot({ path: file });
  console.log(file, `${info.ms.toFixed(0)} ms`, `${Math.round(info.tris / 1000)}k tris`);
}
await browser.close();
await server.close();
