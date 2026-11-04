// Clips run for minutes (founder, 2026-11-04: "I'd like it to be possible to do several minutes"; they stopped at 20 s):
// headless, with the limit shortened (?clipmax=45 stands in for the five minutes), checks that
//  - a clip is still recording past the old 20 s, its time on the button;
//  - with the controls faded (untouched), the record button and its time stay in sight, the rest fade;
//  - 30 s before the limit the player is told; at the limit it stops by itself, says so, and the clip runs that long.
// Exit 1 on a failure.   npm run build && node scripts/clip-length-check.mjs
import { createRequire } from 'node:module';
import { serveBuild } from './serve.mjs';
import path from 'node:path';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
const { chromium } = createRequire(import.meta.url)('playwright');

const MAX = 45;
const server = await serveBuild();
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['camera', 'microphone'] });
// every toast's text, as it is shown
await ctx.addInitScript(() => {
  window.__toasts = [];
  addEventListener('DOMContentLoaded', () => {
    const t = document.getElementById('toast');
    new MutationObserver(() => { if (t.textContent) window.__toasts.push(t.textContent); }).observe(t, { childList: true, characterData: true, subtree: true });
  });
});
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('pageerror', e.message));
let fails = 0;
const ok = (c, what) => { console.log(`${c ? 'ok  ' : 'FAIL'} ${what}`); if (!c) fails++; };
await page.goto(`${server.url}index.html?test=1&synth=1&mic=1&c=skeleton&clipmax=${MAX}`);
await page.waitForFunction(() => window.__costuma?.started && window.__costuma.frame > 3, null, { timeout: 300000, polling: 500 });
await page.waitForFunction(() => window.__costuma.stage.building === 0, null, { timeout: 300000, polling: 500 });
await page.evaluate(() => document.getElementById('btn-rec').click());
const t0 = Date.now();
await page.waitForTimeout(25000);
const mid = await page.evaluate(() => {
  const op = (sel) => getComputedStyle(document.querySelector(sel)).opacity;
  return { on: document.getElementById('btn-rec').classList.contains('on'), text: document.getElementById('btn-rec').textContent, idle: document.getElementById('hud').classList.contains('idle'),
    rec: op('#btn-rec'), shutter: op('.shutter'), snap: op('#btn-snap'), picker: op('#picker'), top: op('.top') };
});
ok(mid.on, `still recording at 25 s (it stopped at 20 before)`);
ok(/^0:2\d$/.test(mid.text), `the button says the clip's time (${mid.text})`);
ok(mid.idle && mid.shutter === '1' && mid.top === '0' && mid.picker === '0' && mid.snap === '0', `untouched, the controls fade but the record button stays (shutter ${mid.shutter}, photo ${mid.snap}, picker ${mid.picker}, top ${mid.top})`);
await page.waitForFunction(() => !document.getElementById('preview').classList.contains('hidden'), null, { timeout: (MAX + 60) * 1000, polling: 250 });
const took = (Date.now() - t0) / 1000;
const got = await page.evaluate(async () => {
  const v = document.querySelector('#preview-media video'), b = await (await fetch(v.src)).blob();
  const bytes = new Uint8Array(await b.arrayBuffer());
  let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return { type: b.type, b64: btoa(s), toasts: window.__toasts, size: b.size };
});
const warned = got.toasts.filter((t) => /left \(clips stop at/.test(t)), ended = got.toasts.filter((t) => /Clips stop at .* saved/.test(t));
ok(warned.length > 0, `told before the end (${warned[0] ?? 'nothing'})`);
ok(ended.length > 0 && took > MAX - 2 && took < MAX + 30, `stopped by itself at the limit (${took.toFixed(0)} s; ${ended[0] ?? 'not said'})`);
const file = path.join(mkdtempSync(path.join(tmpdir(), 'clip-')), `clip.${got.type.includes('mp4') ? 'mp4' : 'webm'}`);
writeFileSync(file, Buffer.from(got.b64, 'base64'));
const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());
ok(dur > MAX - 3, `the clip runs ${dur.toFixed(1)} s (${(got.size / 1e6).toFixed(1)} MB, ${got.type})`);
console.log(fails ? `${fails} failed` : 'all ok');
await browser.close();
await server.close();
process.exit(fails ? 1 : 0);
