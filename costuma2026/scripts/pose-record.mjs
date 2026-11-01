// Every frame of a clip through the real pose model, in order: the clip decoded to frames (ffmpeg), each handed to
// PoseLandmarker in VIDEO mode at its own timestamp, the raw detections written to JSON. Headless runs far slower than
// real time, so a live run on Chromium's fake camera would skip most frames; this keeps them all, for replaying
// through the tracker offline (scripts/stability-sim.test.ts).
//   node scripts/pose-record.mjs <clip> <out.json>      env: FPS=30 SECS=3 MODEL=full N=4 VF='<extra ffmpeg filter>'
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clip = path.resolve(process.argv[2]), out = path.resolve(process.argv[3] ?? 'record.json');
const FPS = Number(process.env.FPS ?? 30), SECS = Number(process.env.SECS ?? 3);
const dir = mkdtempSync(path.join(tmpdir(), 'frames-'));
const vf = [`fps=${FPS}`, process.env.VF].filter(Boolean).join(',');
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...(/\.(jpe?g|png)$/i.test(clip) ? ['-loop', '1'] : []), '-i', clip, '-t', String(SECS), '-vf', vf, '-q:v', '3', path.join(dir, 'f%04d.jpg')]);
const frames = readdirSync(dir).filter((f) => f.endsWith('.jpg')).sort();
console.log(`${frames.length} frames at ${FPS} fps`);
const MIME = { '.mjs': 'text/javascript', '.wasm': 'application/wasm', '.jpg': 'image/jpeg', '.task': 'application/octet-stream' };
const mount = { '/tv/': path.join(root, 'node_modules/@mediapipe/tasks-vision/'), '/mediapipe/': path.join(root, 'public/mediapipe/'), '/models/': path.join(root, 'public/models/'), '/f/': dir + '/' };
const server = createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end('<!doctype html><body></body>'); }
  for (const [k, d] of Object.entries(mount)) if (u.startsWith(k)) {
    try { const b = readFileSync(path.join(d, u.slice(k.length))); res.writeHead(200, { 'content-type': MIME[path.extname(u)] ?? 'application/octet-stream' }); return res.end(b); } catch { break; }
  }
  res.writeHead(404); res.end();
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.log(m.text().slice(0, 200)); });
await page.goto(`http://127.0.0.1:${server.address().port}/`);
const rec = await page.evaluate(async ({ frames, fps, model, n }) => {
  const { FilesetResolver, PoseLandmarker } = await import('/tv/vision_bundle.mjs');
  const fs = await FilesetResolver.forVisionTasks('/mediapipe');
  // the app's settings (pose/detector.ts): the threshold as shipped, tracking at 0.5
  const conf = 0.65;
  const pl = await PoseLandmarker.createFromOptions(fs, { baseOptions: { modelAssetPath: `/models/pose_landmarker_${model}.task`, delegate: 'CPU' },
    runningMode: 'VIDEO', numPoses: n, minPoseDetectionConfidence: conf, minPosePresenceConfidence: conf, minTrackingConfidence: 0.5 });
  const out = [];
  for (let i = 0; i < frames.length; i++) {
    const im = new Image();
    await new Promise((r) => { im.onload = r; im.src = `/f/${frames[i]}`; });
    const r = pl.detectForVideo(im, Math.round((i * 1000) / fps));
    // as the app reads them (pose/detector.ts, landmarks.ts worldToThree): world in three's axes, image 0..1
    const dets = r.landmarks.map((lm, k) => ({
      image: lm.map((p) => ({ x: p.x, y: p.y, z: p.z, v: p.visibility ?? 1 })),
      world: r.worldLandmarks[k].map((p) => ({ x: p.x, y: -p.y, z: -p.z, v: p.visibility ?? 1 })),
    }));
    out.push({ i, now: (i * 1000) / fps, w: im.width, h: im.height, dets });
    r.close();
  }
  return out;
}, { frames, fps: FPS, model: process.env.MODEL ?? 'full', n: Number(process.env.N ?? 4) });
writeFileSync(out, JSON.stringify(rec));
console.log(`wrote ${out}: ${rec.length} frames, people per frame ${rec.map((r) => r.dets.length).join('')}`);
await browser.close();
server.close();
rmSync(dir, { recursive: true, force: true });
