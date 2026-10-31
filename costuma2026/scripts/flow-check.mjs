// The party's taps and the fading controls, in the built app with one synthetic person:
//  - a re-tap of the chosen effect cycles the dancers (…, a mix), the pyramid button toggles;
//  - left alone the controls fade; the first touch only brings them back (the effect under it does not change).
// Prints what it saw; exit 1 on a failure. Screenshots the mixed pyramid to <outdir>.   node scripts/flow-check.mjs <outdir>
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { serveBuild } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = process.argv[2] ?? 'shots-flow';
mkdirSync(out, { recursive: true });
const server = await serveBuild();
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => console.log('pageerror', e.message));
await page.goto(`${server.url}index.html?test=1&synth=1&scene=party&fx=insitu&pc=behind&t=0.8`);
await page.waitForFunction(() => window.__costuma?.started && window.__costuma.frame > 3, null, { timeout: 240000 });
const fails = [];
const st = () => page.evaluate(() => ({ cast: window.__costuma.settings.partyCast, fx: window.__costuma.settings.effect, pyr: window.__costuma.settings.pyramid, idle: document.getElementById('hud').classList.contains('idle') }));
const c0 = await st();
await page.evaluate(() => window.__costuma.chooseEffect('insitu'));
const c1 = await st();
console.log('re-tap In Situ:', c0.cast, '→', c1.cast);
if (c1.cast === c0.cast || c1.fx !== 'insitu') fails.push('a re-tap did not change the dancers');
let guard = 0;
while ((await st()).cast !== 'mix' && guard++ < 20) await page.evaluate(() => window.__costuma.chooseEffect('insitu'));
console.log('reached:', (await st()).cast);
if ((await st()).cast !== 'mix') fails.push('the dancers never reached a mix');
// let the mixed pyramid be made and drawn
const f0 = await page.evaluate(() => window.__costuma.frame);
await page.waitForFunction((f) => window.__costuma.frame > f + 6, f0, { timeout: 300000 });
await page.screenshot({ path: path.join(out, 'mix-pyramid.png'), timeout: 120000 });
await page.click('#btn-pyramid');
if ((await st()).pyr !== false) fails.push('the pyramid button did not toggle');
// left alone: the controls fade (the check runs every 300 ms; 4.5 s idle)
await page.waitForFunction(() => document.getElementById('hud').classList.contains('idle'), null, { timeout: 30000 }).catch(() => fails.push('the controls never faded'));
console.log('faded:', (await st()).idle);
const before = (await st()).fx;
await page.mouse.click(195, 420);
await page.waitForTimeout(500);
const after = await st();
console.log('first touch: idle', after.idle, '· effect', before, '→', after.fx);
if (after.idle) fails.push('a touch did not bring the controls back');
if (after.fx !== before) fails.push('the waking touch also changed the effect');
await browser.close();
await server.close();
if (fails.length) { console.log('FAIL:', fails.join('; ')); process.exit(1); }
console.log('ok');
