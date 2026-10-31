// The picker's thumbnails: each character from the lab, head and shoulders, transparent, into public/thumbs/<id>.png.
// Rerun after changing a character's look.   node scripts/thumbs.mjs   env: C=ids
import { createRequire } from 'node:module';
import { createServer } from 'vite';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/thumbs');
mkdirSync(out, { recursive: true });
const server = await createServer({ root, server: { port: 0, host: '127.0.0.1', hmr: false, watch: null }, logLevel: 'error' });
await server.listen();
const port = server.httpServer.address().port;
const { ROSTER_IDS } = await server.ssrLoadModule('/src/characters/ids.ts');
const ids = (process.env.C ?? ROSTER_IDS.join(',')).split(',');
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 256, height: 256 } });
page.on('pageerror', (e) => console.log('pageerror', e.message));
for (const id of ids) {
  await page.goto(`http://127.0.0.1:${port}/lab.html?c=${id}&thumb=1&w=256&h=256&pose=wave&yaw=18&pitch=4`);
  await page.waitForFunction(() => window.__lab?.ready, null, { timeout: 180000 });
  await page.locator('canvas').screenshot({ path: path.join(out, `${id}.png`), omitBackground: true });
  console.log(id);
}
await browser.close();
await server.close();
