// What the face model sees, measured on stills (real MediaPipe, headless): does it find a face on the full frame, and on a
// crop round the head that the pose model points at, as the face shrinks (a person further off); and the head's turn
// from the face mesh's transformation matrix against the pose model's ears-and-nose head, on a frontal portrait rolled
// by known angles, mirrored, and on profile heads.
//   node scripts/face-probe.mjs <portrait.jpg> [profiles.jpg]      prints a table; exit 0
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imgs = process.argv.slice(2).map((p) => path.resolve(p));
const MIME = { '.mjs': 'text/javascript', '.js': 'text/javascript', '.wasm': 'application/wasm', '.html': 'text/html', '.jpg': 'image/jpeg', '.png': 'image/png', '.task': 'application/octet-stream' };
const mount = { '/tv/': path.join(root, 'node_modules/@mediapipe/tasks-vision/'), '/mediapipe/': path.join(root, 'public/mediapipe/'), '/models/': path.join(root, 'public/models/') };
const server = createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  let file = null;
  if (u === '/') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end('<!doctype html><body></body>'); }
  if (u.startsWith('/img/')) file = imgs[Number(u.slice(5))];
  for (const [k, d] of Object.entries(mount)) if (u.startsWith(k)) file = path.join(d, u.slice(k.length));
  if (!file || !existsSync(file) || !statSync(file).isFile()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('pageerror', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('console', m.text().slice(0, 200)); });
await page.goto(url);
const out = await page.evaluate(async (n) => {
  const { FilesetResolver, FaceLandmarker, PoseLandmarker } = await import('/tv/vision_bundle.mjs');
  const fs = await FilesetResolver.forVisionTasks('/mediapipe');
  const face = await FaceLandmarker.createFromOptions(fs, { baseOptions: { modelAssetPath: '/models/face_landmarker.task', delegate: 'CPU' },
    runningMode: 'IMAGE', numFaces: 4, outputFaceBlendshapes: true, outputFacialTransformationMatrixes: true,
    minFaceDetectionConfidence: 0.4, minFacePresenceConfidence: 0.4 });
  const pose = await PoseLandmarker.createFromOptions(fs, { baseOptions: { modelAssetPath: '/models/pose_landmarker_full.task', delegate: 'CPU' },
    runningMode: 'IMAGE', numPoses: 2 });
  const load = (i) => new Promise((r) => { const im = new Image(); im.onload = () => r(im); im.src = `/img/${i}`; });
  const ims = []; for (let i = 0; i < n; i++) ims.push(await load(i));
  const deg = (r) => Math.round((r * 180) / Math.PI);
  // a rotation matrix's yaw (about y), pitch (about x), roll (about z), three's 'YXZ' order: the head's turn, nod, tilt
  const euler = (m) => { // m: row-major 3×3
    const pitch = Math.asin(Math.max(-1, Math.min(1, -m[1][2])));
    return { yaw: deg(Math.atan2(m[0][2], m[2][2])), pitch: deg(pitch), roll: deg(Math.atan2(m[1][0], m[1][1])) };
  };
  const fromFace = (mat) => { const d = mat.data; // column-major 4×4
    return euler([[d[0], d[4], d[8]], [d[1], d[5], d[9]], [d[2], d[6], d[10]]]); };
  // the pose model's head, as the app builds it (rig.ts poseFromLandmarks: x the ear line, z the nose, less 0.32 rad)
  const fromPose = (w) => {
    const v = (p) => [p.x, -p.y, -p.z];
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const nrm = (a) => { const l = Math.hypot(...a); return a.map((x) => x / l); };
    const eL = v(w[7]), eR = v(w[8]), no = v(w[0]), mid = eL.map((x, i) => (x + eR[i]) / 2);
    const x = nrm(sub(eL, eR)), y = nrm(cross(sub(no, mid), x)), z = nrm(cross(x, y));
    // rotate by -0.32 rad about the head's own x: y' = y cos + z sin... (R · Rx(-a))
    const a = -0.32, c = Math.cos(a), s = Math.sin(a);
    const y2 = y.map((yi, i) => yi * c + z[i] * s), z2 = z.map((zi, i) => -y[i] * s + zi * c);
    return euler([[x[0], y2[0], z2[0]], [x[1], y2[1], z2[1]], [x[2], y2[2], z2[2]]]);
  };
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const variants = [];
  const im0 = ims[0];
  const plain = canvas(im0.width, im0.height); plain.getContext('2d').drawImage(im0, 0, 0); variants.push(['portrait', plain]);
  for (const r of [20, -20, 40]) {
    const c = canvas(im0.width, im0.height), g = c.getContext('2d');
    g.fillStyle = '#777'; g.fillRect(0, 0, c.width, c.height);
    g.translate(c.width / 2, c.height * 0.35); g.rotate((-r * Math.PI) / 180); g.translate(-c.width / 2, -c.height * 0.35); g.drawImage(im0, 0, 0);
    variants.push([`roll ${r > 0 ? '+' : ''}${r}° (on screen, ccw)`, c]);
  }
  { const c = canvas(im0.width, im0.height), g = c.getContext('2d'); g.scale(-1, 1); g.drawImage(im0, -im0.width, 0); variants.push(['mirrored', c]); }
  // further off: the portrait smaller in a 1280×720 frame (its face is ~230 px wide at full size)
  for (const s of [0.6, 0.4, 0.3, 0.2, 0.15, 0.1]) {
    const c = canvas(1280, 720), g = c.getContext('2d'); g.fillStyle = '#556'; g.fillRect(0, 0, 1280, 720);
    g.drawImage(im0, 640 - (im0.width * s) / 2, 720 - im0.height * s, im0.width * s, im0.height * s);
    variants.push([`far: face ~${Math.round(230 * s)} px of 1280`, c]);
  }
  if (ims[1]) { const c = canvas(ims[1].width, ims[1].height); c.getContext('2d').drawImage(ims[1], 0, 0); variants.push(['profiles', c]); }
  // which side the blendshapes call "Left": one eye painted shut (skin from just under it), the face mesh's 263/362
  // eye (the person's left: image right on an unmirrored photo) and then its 33/133 eye
  {
    const f0 = face.detect(plain).faceLandmarks[0];
    for (const [tag, ids] of [['person-left (263/362) shut', [263, 362, 386, 374, 387, 373, 385, 380]], ['person-right (33/133) shut', [33, 133, 159, 145, 158, 153, 160, 144]]]) {
      const c = canvas(im0.width, im0.height), g = c.getContext('2d'); g.drawImage(im0, 0, 0);
      const xs = ids.map((i) => f0[i].x * im0.width), ys = ids.map((i) => f0[i].y * im0.height);
      const x0 = Math.min(...xs) - 6, x1 = Math.max(...xs) + 6, y0 = Math.min(...ys) - 6, y1 = Math.max(...ys) + 6;
      g.drawImage(im0, x0, y1 + 4, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0);
      g.strokeStyle = '#3a2a22'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0 + 4, (y0 + y1) / 2 + 2); g.quadraticCurveTo((x0 + x1) / 2, y1, x1 - 4, (y0 + y1) / 2 + 2); g.stroke();
      const r = face.detect(c);
      const sc = (k) => +(r.faceBlendshapes[0]?.categories.find((q) => q.categoryName === k)?.score ?? -1).toFixed(2);
      variants.push([`wink ${tag}: eyeBlinkLeft ${sc('eyeBlinkLeft')} eyeBlinkRight ${sc('eyeBlinkRight')}`, c]);
      
    }
  }
  const crop = canvas(256, 256), cg = crop.getContext('2d');
  const rows = [];
  for (const [name, c] of variants) {
    const full = face.detect(c);
    const P = pose.detect(c);
    const people = [];
    for (let i = 0; i < P.landmarks.length; i++) {
      const im = P.landmarks[i], W = c.width, H = c.height;
      const px = (j) => [im[j].x * W, im[j].y * H];
      const pts = [0, 2, 5, 7, 8].map(px);
      const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
      const dd = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
      const sh = dd(px(11), px(12));
      const size = 2.4 * Math.max(dd(px(7), px(8)), dd(px(0), px(7)), dd(px(0), px(8)), 0.35 * sh);
      cg.fillStyle = '#000'; cg.fillRect(0, 0, 256, 256);
      cg.drawImage(c, cx - size / 2, cy - size / 2, size, size, 0, 0, 256, 256);
      const fc = face.detect(crop);
      // a face in the crop joins this person if its nose is near the crop's middle
      const k = fc.faceLandmarks.findIndex((l) => Math.hypot(l[1].x - 0.5, l[1].y - 0.5) < 0.3);
      const fullK = full.faceLandmarks.findIndex((l) => Math.hypot(l[1].x * W - px(0)[0], l[1].y * H - px(0)[1]) < size * 0.4);
      people.push({ cropPx: Math.round(size), poseHead: fromPose(P.worldLandmarks[i]),
        full: fullK >= 0 ? fromFace(full.facialTransformationMatrixes[fullK]) : null,
        crop: k >= 0 ? fromFace(fc.facialTransformationMatrixes[k]) : null,
        jawCrop: k >= 0 ? +(fc.faceBlendshapes[k].categories.find((q) => q.categoryName === 'jawOpen')?.score ?? 0).toFixed(2) : null,
        smileCrop: k >= 0 ? +(fc.faceBlendshapes[k].categories.find((q) => q.categoryName === 'mouthSmileLeft')?.score ?? 0).toFixed(2) : null });
    }
    rows.push({ name, facesFull: full.faceLandmarks.length, people });
  }
  return rows;
}, imgs.length);
for (const r of out) {
  console.log(`${r.name}: faces on the full frame ${r.facesFull}`);
  for (const p of r.people) {
    const f = (e) => (e ? `yaw ${e.yaw} pitch ${e.pitch} roll ${e.roll}` : '—');
    console.log(`   person (crop ${p.cropPx} px): pose head ${f(p.poseHead)} | face full ${f(p.full)} | face crop ${f(p.crop)}${p.crop ? ` jaw ${p.jawCrop} smile ${p.smileCrop}` : ''}`);
  }
}
await browser.close();
server.close();
