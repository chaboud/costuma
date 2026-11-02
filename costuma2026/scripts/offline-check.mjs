// The app kept on the phone (sw/sw.template.js), headless: the service worker installs and keeps the shell under each
// file's content hash; with the network gone, the page loads, starts and dresses someone; and a file whose content
// changed is not served from the old copy. Exit 1 on a failure.    node scripts/offline-check.mjs    (npm run build first)
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveBuild } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const fails = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) fails.push(what); };
const sw = readFileSync(path.join(root, '../2026/sw.js'), 'utf8');
const manifest = JSON.parse(sw.match(/const MANIFEST = (\{.*?\});/)[1]), shell = JSON.parse(sw.match(/const SHELL = (\[.*?\]);/)[1]);
const server = await serveBuild();
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('pageerror', e.message));
await page.goto(`${server.url}index.html?synth=1&people=1`);
await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 120000, polling: 250 }).catch(() => undefined);
const kept = await page.evaluate(async () => (await (await caches.open('costuma-2026')).keys()).map((r) => r.url));
const want = shell.map((p) => (p.startsWith('assets/') ? p : `${p}?v=${manifest[p]}`));
console.log(`${Object.keys(manifest).length} files in the manifest, ${shell.length} in the shell; the cache holds ${kept.length}`);
check(want.every((w) => kept.some((k) => k.endsWith(w))), 'the shell is kept, each file under its content hash');
// the network gone: the page, the start, a costume
await ctx.setOffline(true);
await page.reload();
const loaded = await page.evaluate(() => !!document.getElementById('btn-start'));
check(loaded, 'offline, the page loads from the phone');
await page.click('#btn-start');
const dressed = await page.waitForFunction(() => window.__costuma?.started && window.__costuma.stage.count > 0, null, { timeout: 240000, polling: 250 }).then(() => true, () => false);
check(dressed, 'offline, it starts and dresses someone (the costume worker from the phone too)');
await ctx.setOffline(false);
// a changed file: the service worker asks for it under its new hash, so the old copy is never served for it
const thumb = shell.find((p) => p.startsWith('thumbs/'));
const changed = await page.evaluate(async ([p, h]) => {
  const c = await caches.open('costuma-2026');
  return { old: !!(await c.match(new URL(`${p}?v=${h}`, location.href).href)), other: !!(await c.match(new URL(`${p}?v=0000000000000000`, location.href).href)) };
}, [thumb, manifest[thumb]]);
check(changed.old && !changed.other, 'a file is found only under the hash of its content (another content would be fetched)');
await browser.close();
await server.close();
console.log(fails.length ? `${fails.length} failed` : 'all ok');
process.exit(fails.length ? 1 : 0);
