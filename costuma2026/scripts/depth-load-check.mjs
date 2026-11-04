// The depth model's loading, when it goes wrong (founder's iPhone, 2026-11-04: "The depth model would not load on this
// phone: people only", the reason thrown away). Headless, the real camera path, People + things asked for:
//  - a GPU that will not take the model (a stand-in adapter that cannot make a device): the CPU takes it, in a worker,
//    and reads; the toast says so and the readout keeps the GPU's own words;
//  - the model not to be had at all (its file refused): the toast and the readout say why in the engine's own words,
//    occlusion falls back to people only, and Show depth map is switched off with it.
// Exit 1 on a failure.   npm run build && node scripts/depth-load-check.mjs <any.y4m>
import { createRequire } from 'node:module';
import { serveBuild } from './serve.mjs';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');

const clip = path.resolve(process.argv[2]);
const server = await serveBuild();
let fails = 0;
const ok = (c, what) => { console.log(`${c ? 'ok  ' : 'FAIL'} ${what}`); if (!c) fails++; };

async function run(kind) {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', `--use-file-for-fake-video-capture=${clip}`] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['camera', 'microphone'] });
  await ctx.addInitScript(() => {
    localStorage.setItem('costuma26.settings', JSON.stringify({ model: 'full', mode: 'one', people: 1, occlusion: 'all', showDepth: true, hands: false }));
    // an adapter that cannot make a device: the GPU path fails the way a phone's might
    if (navigator.gpu) navigator.gpu.requestAdapter = async () => ({ features: new Set(), limits: {}, info: {}, requestDevice: async () => { throw new Error('stand-in GPU: no device'); } });
    window.__toasts = [];
    addEventListener('DOMContentLoaded', () => {
      const t = document.getElementById('toast');
      new MutationObserver(() => { if (t.textContent) window.__toasts.push(t.textContent); }).observe(t, { childList: true, characterData: true, subtree: true });
    });
  });
  if (kind === 'none') await ctx.route('**/models/depth-anything-*.onnx', (r) => r.fulfill({ status: 404, body: 'no' }));
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('pageerror', e.message));
  await page.goto(`${server.url}index.html?c=skeleton&facing=environment&nosw=1`);
  await page.click('#btn-start');
  await page.waitForFunction(() => window.__costuma?.started, null, { timeout: 240000 });
  await page.waitForFunction(() => { const d = window.__costuma.stage.depth; return d.ready || (d.failed && window.__costuma.settings.occlusion !== 'all'); }, null, { timeout: 600000, polling: 1000 });
  if (kind === 'gpu') {
    await page.waitForFunction(() => window.__costuma.stage.depth.ms > 0, null, { timeout: 600000, polling: 1000 }).catch(() => {});
    const s = await page.evaluate(() => ({ engine: window.__costuma.stage.depth.engine, failed: window.__costuma.stage.depth.failed, ms: window.__costuma.stage.depth.ms, toasts: window.__toasts }));
    ok(s.engine === 'wasm', `the GPU refused: the CPU took it (${s.engine})`);
    ok(/^GPU: .+/.test(s.failed), `the GPU's own words kept (${s.failed})`);
    ok(s.ms > 0, `and it reads (${s.ms.toFixed(0)} ms a reading)`);
    ok(s.toasts.some((t) => /CPU: the GPU would not take it/.test(t)), 'the toast says the CPU took it');
  } else {
    await page.click('#btn-gear');
    await page.waitForTimeout(1500);
    const s = await page.evaluate(() => ({ failed: window.__costuma.stage.depth.failed, occ: window.__costuma.settings.occlusion, show: window.__costuma.settings.showDepth, toasts: window.__toasts, readout: document.getElementById('readout').textContent, stored: JSON.parse(localStorage.getItem('costuma26.settings')) }));
    ok(/CPU: .+/.test(s.failed), `the reason in the engine's own words (${s.failed})`);
    ok(s.toasts.some((t) => /would not load on this phone \(.+\): people only/.test(t)), 'the toast says why');
    ok(s.occ === 'people' && s.stored.occlusion === 'people', 'occlusion falls back to people only, and is kept so');
    ok(!s.show && !s.stored.showDepth, 'Show depth map is switched off with it');
    ok(s.readout.includes(s.failed), 'the readout keeps the reason');
    ok(/\[WebGPU .*f16 (yes|no)\]/.test(s.readout), `the readout says what the GPU offers (${(s.readout.match(/\[[^\]]*\]/) ?? ['none'])[0]})`);
  }
  await browser.close();
}
await run('gpu');
await run('none');
console.log(fails ? `${fails} failed` : 'all ok');
await server.close();
process.exit(fails ? 1 : 0);
