// What the hand model sees, measured on clips (real MediaPipe, headless): each frame through the pose model (VIDEO mode,
// as the app runs it), then each person's hands two ways — HandLandmarker on the whole frame, and on a crop round each
// wrist the pose model points at (pose/hands.ts handBox, the app's way: it says whose hand it is, and finds a far
// person's small hands). Prints, per clip, how often each finds a hand, how far its wrist lands from the pose model's,
// the hand's size against the forearm (what sizes the crop), and the model's ms. With OUT=<file.json> it also writes the
// recording (scripts/pose-record.mjs's format, each frame's `hands` beside its `dets`) for offline replays.
//   node scripts/hand-probe.mjs <clip|still> [more…]      env: FPS=30 SECS=3 OUT= SCALE=1 (shrink the frame: a far person)
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FPS = Number(process.env.FPS ?? 30), SECS = Number(process.env.SECS ?? 3), SCALE = Number(process.env.SCALE ?? 1);
const clips = process.argv.slice(2).map((p) => path.resolve(p));
const MIME = { '.mjs': 'text/javascript', '.js': 'text/javascript', '.wasm': 'application/wasm', '.jpg': 'image/jpeg', '.task': 'application/octet-stream' };
const dirs = [];
const mount = { '/tv/': path.join(root, 'node_modules/@mediapipe/tasks-vision/'), '/mediapipe/': path.join(root, 'public/mediapipe/'), '/models/': path.join(root, 'public/models/'), '/src/': path.join(root, 'scripts/') };
const server = createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end('<!doctype html><body></body>'); }
  const m = u.match(/^\/f(\d+)\/(.+)$/);
  if (m) { try { res.writeHead(200, { 'content-type': 'image/jpeg' }); return res.end(readFileSync(path.join(dirs[Number(m[1])], m[2]))); } catch { /* 404 */ } }
  for (const [k, d] of Object.entries(mount)) if (u.startsWith(k)) {
    try { const b = readFileSync(path.join(d, u.slice(k.length))); res.writeHead(200, { 'content-type': MIME[path.extname(u)] ?? 'application/octet-stream' }); return res.end(b); } catch { break; }
  }
  res.writeHead(404); res.end();
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
page.on('console', (m) => { if (m.type() === 'error' || m.text().startsWith('#')) console.log(m.text().slice(0, 300)); });
await page.goto(`http://127.0.0.1:${server.address().port}/`);
await page.evaluate(async () => {
  const { FilesetResolver, PoseLandmarker, HandLandmarker } = await import('/tv/vision_bundle.mjs');
  const fs = await FilesetResolver.forVisionTasks('/mediapipe');
  window.fs = fs; window.PL = PoseLandmarker;
  window.handImg = await HandLandmarker.createFromOptions(fs, { baseOptions: { modelAssetPath: '/models/hand_landmarker.task', delegate: 'CPU' },
    runningMode: 'IMAGE', numHands: 1, minHandDetectionConfidence: 0.4, minHandPresenceConfidence: 0.4 });
  window.handFull = await HandLandmarker.createFromOptions(fs, { baseOptions: { modelAssetPath: '/models/hand_landmarker.task', delegate: 'CPU' },
    runningMode: 'IMAGE', numHands: 4, minHandDetectionConfidence: 0.4, minHandPresenceConfidence: 0.4 });
});
const all = [];
for (const clip of clips) {
  const dir = mkdtempSync(path.join(tmpdir(), 'hframes-'));
  dirs.push(dir);
  const still = /\.(jpe?g|png)$/i.test(clip);
  const vf = [`fps=${FPS}`, SCALE !== 1 ? `scale=iw*${SCALE}:ih*${SCALE},pad=iw/${SCALE}:ih/${SCALE}:(ow-iw)/2:(oh-ih)/2` : null].filter(Boolean).join(',');
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...(still ? ['-loop', '1'] : []), '-i', clip, '-t', String(still ? 0.3 : SECS), '-vf', vf, '-q:v', '3', path.join(dir, 'f%04d.jpg')]);
  const frames = readdirSync(dir).filter((f) => f.endsWith('.jpg')).sort();
  const res = await page.evaluate(async ({ frames, fps, d }) => {
    const pl = await window.PL.createFromOptions(window.fs, { baseOptions: { modelAssetPath: '/models/pose_landmarker_full.task', delegate: 'CPU' },
      runningMode: 'VIDEO', numPoses: 2, minPoseDetectionConfidence: 0.65, minPosePresenceConfidence: 0.65, minTrackingConfidence: 0.5 });
    const C = 256, cv = document.createElement('canvas'); cv.width = cv.height = C;
    const g = cv.getContext('2d');
    const out = [];
    // pose/hands.ts handBox, kept in step by hand: the square round a hand, in frame pixels, from the pose model's points
    const box = (im, side, W, H) => {
      const [wr, el, ix, pk, sl, sr, hl, hr] = side === 'L' ? [15, 13, 19, 17, 11, 12, 23, 24] : [16, 14, 20, 18, 11, 12, 23, 24];
      const P = (i) => ({ x: im[i].x * W, y: im[i].y * H });
      const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
      const w = P(wr), e = P(el), k = { x: (P(ix).x + P(pk).x) / 2, y: (P(ix).y + P(pk).y) / 2 };
      const fore = d(w, e), knuck = d(w, k), sh = d(P(sl), P(sr));
      const torso = d({ x: (P(sl).x + P(sr).x) / 2, y: (P(sl).y + P(sr).y) / 2 }, { x: (P(hl).x + P(hr).x) / 2, y: (P(hl).y + P(hr).y) / 2 });
      const s = Math.max(1.3 * fore, 4 * knuck, 0.9 * sh, 0.6 * torso, 40);
      // the hand's middle: past the wrist toward the knuckles (or along the forearm, where those are not seen)
      const dir = knuck > 0.15 * fore ? { x: (k.x - w.x) / knuck, y: (k.y - w.y) / knuck } : { x: (w.x - e.x) / (fore || 1), y: (w.y - e.y) / (fore || 1) };
      const c = { x: w.x + dir.x * s * 0.22, y: w.y + dir.y * s * 0.22 };
      return { x: c.x - s / 2, y: c.y - s / 2, s, fore, wrist: w, vis: im[wr].v };
    };
    let msCrop = 0, msFull = 0, nCrop = 0;
    for (let i = 0; i < frames.length; i++) {
      const im = new Image();
      await new Promise((r) => { im.onload = r; im.src = `/f${d}/${frames[i]}`; });
      const W = im.width, H = im.height;
      const r = pl.detectForVideo(im, Math.round((i * 1000) / fps));
      const dets = r.landmarks.map((lm, k) => ({
        image: lm.map((p) => ({ x: p.x, y: p.y, z: p.z, v: p.visibility ?? 1 })),
        world: r.worldLandmarks[k].map((p) => ({ x: p.x, y: -p.y, z: -p.z, v: p.visibility ?? 1 })),
      }));
      r.close();
      // the whole frame
      let t0 = performance.now();
      const fr = window.handFull.detect(im);
      msFull += performance.now() - t0;
      const full = fr.landmarks.map((lm, k) => ({ pts: lm.map((p) => ({ x: p.x, y: p.y, z: p.z })), side: fr.handedness[k][0].categoryName, score: fr.handedness[k][0].score }));
      // crops round each person's wrists
      const hands = [];
      for (let p = 0; p < dets.length; p++) for (const side of ['L', 'R']) {
        const b = box(dets[p].image, side, W, H);
        g.fillStyle = '#000'; g.fillRect(0, 0, C, C);
        g.drawImage(im, b.x, b.y, b.s, b.s, 0, 0, C, C);
        t0 = performance.now();
        const hr = window.handImg.detect(cv);
        msCrop += performance.now() - t0; nCrop++;
        const lm = hr.landmarks[0];
        const h = { person: p, side, box: { x: b.x, y: b.y, s: b.s }, fore: b.fore, vis: b.vis, found: !!lm };
        if (lm) {
          const pts = lm.map((q) => ({ x: (b.x + q.x * b.s) / W, y: (b.y + q.y * b.s) / H, z: (q.z * b.s) / W }));
          h.pts = pts;
          h.world = hr.worldLandmarks[0].map((q) => ({ x: q.x, y: -q.y, z: -q.z }));
          h.handed = hr.handedness[0][0].categoryName; h.score = hr.handedness[0][0].score;
          // where its wrist lands against the pose model's (px), the hand's span (wrist to middle fingertip) over the forearm
          h.off = Math.hypot(pts[0].x * W - b.wrist.x, pts[0].y * H - b.wrist.y);
          h.span = Math.hypot((pts[12].x - pts[0].x) * W, (pts[12].y - pts[0].y) * H) / (b.fore || 1);
          // the hand's extent in the crop (0..1): how much of the box it fills, and whether any of it touches the edge
          const xs = lm.map((q) => q.x), ys = lm.map((q) => q.y);
          h.fill = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
          h.edge = Math.min(...xs) < 0.02 || Math.min(...ys) < 0.02 || Math.max(...xs) > 0.98 || Math.max(...ys) > 0.98;
        }
        hands.push(h);
      }
      out.push({ i, now: (i * 1000) / fps, w: W, h: H, dets, hands, full });
    }
    pl.close();
    return { out, msCrop: msCrop / Math.max(1, nCrop), msFull: msFull / frames.length };
  }, { frames, fps: FPS, d: dirs.length - 1 });
  rmSync(dir, { recursive: true, force: true });
  const q = (xs, p) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : NaN; };
  const hs = res.out.flatMap((f) => f.hands), found = hs.filter((h) => h.found);
  const visible = hs.filter((h) => h.vis > 0.5), foundVis = visible.filter((h) => h.found);
  const fullHands = res.out.reduce((a, f) => a + f.full.length, 0);
  console.log(`\n${path.basename(clip)}${SCALE !== 1 ? ` at ${SCALE}×` : ''}: ${res.out.length} frames ${res.out[0]?.w}×${res.out[0]?.h}, people ${res.out.map((f) => f.dets.length).join('')}`);
  console.log(` crops: a hand in ${found.length} of ${hs.length} (${foundVis.length} of ${visible.length} whose wrist reads visible > 0.5) · ${res.msCrop.toFixed(1)} ms a crop`);
  if (found.length) {
    console.log(` its wrist from the pose model's: ${q(found.map((h) => h.off / h.box.s), 0.5).toFixed(2)} of the box at the median, ${q(found.map((h) => h.off / h.box.s), 0.9).toFixed(2)} p90 · box ${q(found.map((h) => h.box.s), 0.5).toFixed(0)} px`);
    console.log(` the hand's span over the forearm ${q(found.map((h) => h.span), 0.1).toFixed(2)}–${q(found.map((h) => h.span), 0.9).toFixed(2)} · fills ${q(found.map((h) => h.fill), 0.1).toFixed(2)}–${q(found.map((h) => h.fill), 0.9).toFixed(2)} of the box · touches its edge ${found.filter((h) => h.edge).length}`);
    const sides = found.map((h) => `${h.side}:${h.handed}`);
    const agree = found.filter((h) => (h.side === 'L') === (h.handed === 'Left')).length;
    console.log(` handedness against the side asked: the model says the person's own ${agree} of ${found.length} (${[...new Set(sides)].map((s) => `${s} ${sides.filter((x) => x === s).length}`).join(', ')})`);
  }
  console.log(` whole frame: ${fullHands} hands over ${res.out.length} frames · ${res.msFull.toFixed(1)} ms a frame`);
  all.push(...res.out.map((f) => ({ ...f, clip: path.basename(clip) })));
}
if (process.env.OUT) { writeFileSync(process.env.OUT, JSON.stringify(all)); console.log(`wrote ${process.env.OUT}`); }
await browser.close();
server.close();
