// Does the picker scroll? A phone-sized page: a drag across the picker (pointer events, the path a finger takes when
// the browser's own pan does not), then a mouse wheel over it; reports scrollLeft after each (exit 1 if either did not
// move it). A synthesized touch swipe cannot be judged here: in this headless Chromium it scrolls nothing, not even a
// plain scrolling div (checked 2026-10-31) — so the browser's own touch pan is verified only on a phone.
import { createRequire } from 'node:module';
import { serveBuild } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const server = await serveBuild();
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('pageerror', e.message));
await page.goto(`${server.url}index.html?test=1&synth=1&c=builder`);
await page.waitForFunction(() => window.__costuma?.started && window.__costuma.frame > 3, null, { timeout: 240000 });
const box = await page.locator('#picker').boundingBox();
const info = () => page.evaluate(() => { const p = document.getElementById('picker'); return { left: p.scrollLeft, max: p.scrollWidth - p.clientWidth }; });
console.log('before', await info());
await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
await page.mouse.down();
for (let i = 1; i <= 10; i++) await page.mouse.move(box.x + box.width * 0.8 - i * 25, box.y + box.height / 2);
// headless frames are seconds long and pointer moves are delivered once a frame: wait for frames, not time
const f0 = await page.evaluate(() => window.__costuma.frame);
await page.waitForFunction((f) => window.__costuma.frame > f + 2, f0, { timeout: 60000 });
await page.mouse.up();
await page.waitForFunction((f) => window.__costuma.frame > f + 4, f0, { timeout: 60000 });
const chosen = await page.evaluate(() => window.__costuma.settings.costume);
const afterSwipe = await info();
console.log('a drag chose nothing:', chosen === 'builder');
console.log('after swipe', afterSwipe);
await page.evaluate(() => { document.getElementById('picker').scrollLeft = 0; });
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.wheel(0, 300);
await page.waitForTimeout(1500);
const afterWheel = await info();
console.log('after wheel', afterWheel);
await browser.close();
await server.close();
process.exit(afterSwipe.left > 50 && afterWheel.left > 50 ? 0 : 1);
