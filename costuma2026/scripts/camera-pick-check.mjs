// A computer's cameras (founder, 2026-11-05: "On a desktop/laptop with multiple cameras, we don't have a good way to
// select the right camera"): headless Chromium with three fake cameras, then with one. Checks that
//  - with three, a caret shows beside the flip; its list names all three and ticks the open one;
//  - picking one from the list opens it, and it is kept;
//  - the flip steps to the next camera and says its name;
//  - a tap elsewhere closes the list;
//  - the next visit opens the camera kept;
//  - with one camera there is no caret.
// Exit 1 on a failure.   npm run build && node scripts/camera-pick-check.mjs
import { createRequire } from 'node:module';
import { serveBuild } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');

const server = await serveBuild();
let fails = 0;
const ok = (c, what) => { console.log(`${c ? 'ok  ' : 'FAIL'} ${what}`); if (!c) fails++; };
// (Chromium's own test pattern: a clip file makes its fake cameras one)
const launch = (count) => chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', `--use-fake-device-for-media-stream=device-count=${count}`, '--use-fake-ui-for-media-stream'] });
async function start(ctx) {
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('pageerror', e.message));
  await page.goto(`${server.url}index.html?c=skeleton&nosw=1`);
  await page.click('#btn-start');
  await page.waitForFunction(() => window.__costuma?.started, null, { timeout: 240000 });
  return page;
}
const now = (page) => page.evaluate(() => ({ id: window.__costuma.camera.deviceId, label: window.__costuma.camera.label, kept: JSON.parse(localStorage.getItem('costuma26.settings') ?? '{}').camera ?? null }));
const visible = (page, sel) => page.evaluate((s) => !document.querySelector(s).classList.contains('hidden') && getComputedStyle(document.querySelector(s)).display !== 'none', sel);

{
  const browser = await launch(3);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, permissions: ['camera', 'microphone'] });
  await ctx.addInitScript(() => {
    if (!localStorage.getItem('costuma26.settings')) localStorage.setItem('costuma26.settings', JSON.stringify({ model: 'lite', mode: 'one', people: 1, hands: false, faces: false }));
    window.__toasts = [];
    addEventListener('DOMContentLoaded', () => {
      const t = document.getElementById('toast');
      new MutationObserver(() => { if (t.textContent) window.__toasts.push(t.textContent); }).observe(t, { childList: true, characterData: true, subtree: true });
    });
  });
  let page = await start(ctx);
  await page.waitForFunction(() => !document.getElementById('btn-cams').classList.contains('hidden'), null, { timeout: 30000 }).catch(() => {});
  ok(await visible(page, '#btn-cams'), 'three cameras: the caret shows beside the flip');
  await page.click('#btn-cams');
  await page.waitForTimeout(500);
  const list = await page.evaluate(() => [...document.querySelectorAll('#cam-menu button')].map((b) => ({ label: b.textContent, on: b.classList.contains('on') })));
  const a = await now(page);
  ok(list.length === 3 && list.filter((x) => x.on).length === 1 && list.find((x) => x.on)?.label === a.label, `its list names them, the open one ticked (${list.map((x) => (x.on ? `[${x.label}]` : x.label)).join(', ')})`);
  const pick = list.find((x) => !x.on);
  await page.click(`#cam-menu button:nth-child(${list.indexOf(pick) + 1})`);
  await page.waitForFunction((id) => window.__costuma.camera.deviceId && window.__costuma.camera.deviceId !== id, a.id, { timeout: 60000 }).catch(() => {});
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('costuma26.settings') ?? '{}').camera?.id === window.__costuma.camera.deviceId, null, { timeout: 15000 }).catch(() => {});
  const b = await now(page);
  ok(b.label === pick.label && b.id !== a.id, `picked from the list: ${b.label} is open`);
  ok(b.kept?.id === b.id && b.kept?.label === b.label, `and kept for next time (${JSON.stringify(b.kept)})`);
  ok(!(await visible(page, '#cam-menu')), 'the list closes on a pick');
  await page.click('#btn-flip');
  await page.waitForFunction((id) => window.__costuma.camera.deviceId !== id, b.id, { timeout: 60000 }).catch(() => {});
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('costuma26.settings') ?? '{}').camera?.id === window.__costuma.camera.deviceId, null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(800);
  const c = await now(page), toasts = await page.evaluate(() => window.__toasts);
  ok(c.id !== b.id && toasts.includes(c.label), `the flip steps to the next camera and names it (${c.label})`);
  await page.click('#btn-cams');
  await page.waitForTimeout(300);
  await page.mouse.click(640, 500);
  await page.waitForTimeout(300);
  ok(!(await visible(page, '#cam-menu')), 'a tap elsewhere closes the list');
  await page.close();
  page = await start(ctx);
  await page.waitForTimeout(1000);
  const d = await now(page);
  // (by name: this browser gives its fake cameras new ids on every load, so the id kept no longer opens; the app finds
  // the camera by its name and keeps its new id)
  ok(d.label === c.label && d.kept?.id === d.id, `the next visit opens the camera kept (${d.label}${d.id !== c.id ? ', found by name under a new id' : ''})`);
  await browser.close();
}
{
  const browser = await launch(1);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, permissions: ['camera', 'microphone'] });
  await ctx.addInitScript(() => localStorage.setItem('costuma26.settings', JSON.stringify({ model: 'lite', mode: 'one', people: 1, hands: false, faces: false })));
  const page = await start(ctx);
  await page.waitForTimeout(1500);
  ok(!(await visible(page, '#btn-cams')), 'one camera: no caret');
  await browser.close();
}
console.log(fails ? `${fails} failed` : 'all ok');
await server.close();
process.exit(fails ? 1 : 0);
