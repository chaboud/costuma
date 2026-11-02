// Hand tracking on the real path, headless: a clip (sign language, say) as Chromium's fake camera → the pose model → the
// hand model on crops round the wrists → the tracker's hands → the costume's hand bones and fingers. Over FRAMES drawn
// frames it prints what the crops found, each hand's state (read or from the pose, trust, curls) and how far the
// costume's hand points from the hand it was given (0 unless the wrist's bend limit eased it short); then a screenshot
// with the debug overlay (the hand model's points in yellow) and one without.
//   npm run build && node scripts/hands-e2e.mjs <clip.y4m> <outdir>      env: C=skeleton FRAMES=12 W=900 H=600
import { createRequire } from 'node:module';
import { serveBuild } from './serve.mjs';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');

const clip = path.resolve(process.argv[2]);
const out = process.argv[3] ?? 'shots-hands';
mkdirSync(out, { recursive: true });
const server = await serveBuild();
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', `--use-file-for-fake-video-capture=${clip}`, '--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: Number(process.env.W ?? 900), height: Number(process.env.H ?? 600) }, permissions: ['camera'] });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('pageerror', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('console', m.text().slice(0, 240)); });
const C = process.env.C ?? 'skeleton';
await ctx.addInitScript(() => localStorage.setItem('costuma26.settings', JSON.stringify({ model: 'full', mode: 'one', people: 1, hands: true, faces: false })));
await page.goto(`${server.url}index.html?c=${C}&facing=environment&nosw=1`);
await page.click('#btn-start');
await page.waitForFunction(() => window.__costuma?.started, null, { timeout: 240000 });
await page.waitForFunction(() => window.__costuma.hands && window.__costuma.stage.count > 0 && window.__costuma.tracker.tracks.some((t) => t.presence >= 1), null, { timeout: 600000, polling: 1000 });
if (process.env.DEBUG) await page.evaluate(() => { window.__dbgHands = true; });
const rows = [];
for (let i = 0; i < Number(process.env.FRAMES ?? 12); i++) {
  const f0 = await page.evaluate(() => window.__costuma.frame);
  await page.waitForFunction((f) => window.__costuma.frame > f, f0, { timeout: 120000, polling: 200 });
  rows.push(await page.evaluate(() => {
    const c = window.__costuma, h = c.hands;
    const w = [...c.stage.wearers.values()][0];
    const res = { frame: c.frame, ms: +h.inferMs.toFixed(0), boxes: h.boxes.map((b) => `${b.side}${b.found ? '+' : '-'}${Math.round(b.s)}`).join(' '), hands: {} };
    for (const t of c.tracker.tracks.filter((t) => !t.lost && t.hands)) for (const s of ['L', 'R']) {
      const hs = t.hands[s];
      let off = null;
      if (w && w.trackId === t.id && hs.w > 0.05) {
        // the costume's hand bone's along against the hand's (both in the costume root's frame, camera axes)
        const hb = w.rig.bones.get('hand' + s);
        if (hb) {
          w.root.updateMatrixWorld(true);
          const q = hb.getWorldQuaternion(hs.q.clone()).premultiply(w.root.getWorldQuaternion(hs.q.clone()).invert());
          const a = w.rig.rest.get('hand' + s).dir.clone().applyQuaternion(q), want = a.clone().set(0, 1, 0).applyQuaternion(hs.q);
          off = Math.round((a.angleTo(want) * 180) / Math.PI);
          if (window.__dbgHands) {
            const fb = w.rig.bones.get('forearm' + s), fq = fb.getWorldQuaternion(hs.q.clone()).premultiply(w.root.getWorldQuaternion(hs.q.clone()).invert());
            const fd = w.rig.rest.get('forearm' + s).dir.clone().applyQuaternion(fq);
            const [el, wr] = s === 'L' ? [13, 15] : [14, 16], pw = t.world;
            const pf = a.clone().set(pw[wr].x - pw[el].x, pw[wr].y - pw[el].y, pw[wr].z - pw[el].z).normalize();
            const f = (v) => v.toArray().map((x) => x.toFixed(2)).join(',');
            res.dbg = { want: f(want), bone: f(a), costumeFore: f(fd), personFore: f(pf), across: f(a.clone().set(1, 0, 0).applyQuaternion(hs.q)), rootQ: w.root.getWorldQuaternion(hs.q.clone()).toArray().map((x) => x.toFixed(2)).join(','), handLocal: hb.quaternion.toArray().map((x) => x.toFixed(2)).join(',') };
          }
        }
      }
      res.hands[`${t.id}${s}`] = `${hs.trust > 0.5 ? 'read' : hs.w > 0.05 ? 'pose' : '-'} w ${hs.w.toFixed(2)} trust ${hs.trust.toFixed(2)} curl ${hs.curl.map((x) => x.toFixed(1)).join('/')}${off !== null ? ` · bone off ${off}°` : ''}`;
    }
    return res;
  }));
  console.log(JSON.stringify(rows.at(-1)));
}
const read = rows.flatMap((r) => Object.values(r.hands)).filter((s) => s.startsWith('read')).length, all = rows.flatMap((r) => Object.values(r.hands)).length;
console.log(`${clip.split('/').pop()} · ${C}: hands read on ${read} of ${all} hand-frames; crops found ${rows.reduce((a, r) => a + (r.boxes.match(/\+/g) ?? []).length, 0)} of ${rows.reduce((a, r) => a + (r.boxes.match(/[+-]/g) ?? []).length, 0)}`);
await page.screenshot({ path: path.join(out, `${C}-hands.png`), timeout: 300000 });
await page.evaluate(() => { window.__costuma.settings.debug = true; });
const f1 = await page.evaluate(() => window.__costuma.frame);
await page.waitForFunction((f) => window.__costuma.frame > f + 1, f1, { timeout: 100000, polling: 500 });
await page.screenshot({ path: path.join(out, `${C}-hands-debug.png`), timeout: 300000 });
await browser.close();
await server.close();
