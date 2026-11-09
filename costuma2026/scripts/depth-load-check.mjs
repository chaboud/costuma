// The depth model's loading, when it goes wrong (founder's iPhone, 2026-11-04: "The depth model would not load on this
// phone: people only", the reason thrown away). Headless, the real camera path, People + things asked for:
//  - a GPU that will not take the model (a stand-in adapter that cannot make a device): the CPU takes it, in a worker,
//    and reads; the toast says so and the readout keeps the GPU's own words;
//  - the model not to be had at all (its file refused): the toast and the readout say why in the engine's own words,
//    occlusion falls back to people only, and Show depth map is switched off with it;
//  - a tab with no room for the runtime's 4 GB memory reservation (stand-in: ?depthstrict=1, any maximum over 1 GB
//    refused; founder's iPhone, 2026-11-09: out of memory): capped, the model loads and reads; uncapped, it fails.
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
  // died: the last page was killed loading the depth model (its mark left behind)
  if (kind === 'died') await ctx.addInitScript(() => { if (!sessionStorage.getItem('marked')) { sessionStorage.setItem('marked', '1'); localStorage.setItem('costuma26.depthLoading', '1'); } });
  if (kind === 'none') await ctx.route('**/models/depth-anything-*.onnx', (r) => r.fulfill({ status: 404, body: 'no' }));
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('pageerror', e.message));
  // tight: a stand-in for an iPhone tab with no room for a 4 GB reservation (the worker refuses any maximum over 1 GB);
  // loose: the same with the cap lifted, which must fail as the iPhone did (the check has teeth)
  const extra = kind === 'tight' ? '&depthstrict=1' : kind === 'loose' ? '&depthstrict=1&depthcap=0' : '';
  await page.goto(`${server.url}index.html?c=skeleton&facing=environment&nosw=1${extra}`);
  await page.click('#btn-start');
  await page.waitForFunction(() => window.__costuma?.started, null, { timeout: 240000 });
  if (kind === 'died') {
    await page.waitForTimeout(8000);
    const s = await page.evaluate(() => ({ occ: window.__costuma.settings.occlusion, show: window.__costuma.settings.showDepth, ready: window.__costuma.stage.depth.ready, toasts: window.__toasts, mark: localStorage.getItem('costuma26.depthLoading') }));
    ok(s.occ === 'people' && !s.show && !s.ready, `after a page died loading it, depth is not loaded again by itself (occlusion ${s.occ}, depth view ${s.show})`);
    ok(s.toasts.some((t) => /stopped this page last time/.test(t)), 'and the player is told');
    ok(s.mark === null, 'the mark is cleared');
    await browser.close();
    return;
  }
  await page.waitForFunction(() => { const d = window.__costuma.stage.depth; return d.ready || (d.failed && window.__costuma.settings.occlusion !== 'all'); }, null, { timeout: 600000, polling: 1000 });
  if (kind === 'tight' || kind === 'loose') {
    if (kind === 'tight') await page.waitForFunction(() => window.__costuma.stage.depth.ms > 0, null, { timeout: 600000, polling: 1000 }).catch(() => {});
    const s = await page.evaluate(() => ({ ready: window.__costuma.stage.depth.ready, engine: window.__costuma.stage.depth.engine, failed: window.__costuma.stage.depth.failed, memory: window.__costuma.stage.depth.memory, ms: window.__costuma.stage.depth.ms }));
    if (kind === 'tight') {
      ok(s.ready && s.ms > 0, `a tight tab: the depth model loads and reads, its memory capped (${s.engine}; ${s.memory}; ${s.ms.toFixed(0)} ms a reading)`);
      ok(/4096 → 1024 MB/.test(s.memory), 'the runtime asked for 4 GB and was given 1 GB');
    } else ok(!s.ready && /Out of memory/.test(s.failed), `the same tab without the cap fails as the iPhone did (${s.failed})`);
  } else if (kind === 'gpu') {
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
await run('tight');
await run('loose');
await run('died');
console.log(fails ? `${fails} failed` : 'all ok');
await server.close();
process.exit(fails ? 1 : 0);
