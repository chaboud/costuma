# Project: AR Costume Overlay (Static, all‑client‑side)

Goal: A static site (e.g., GitHub Pages) that opens the camera, detects up to N faces and/or full-body poses in the browser, and overlays 2D/3D assets. Includes a simple in‑page UI to switch costumes. No server required.

---

## Tech Stack Choices (safe on iOS + Android browsers)

**Detection options (pick 1–3):**
- **Face landmarks (filters/masks):** MediaPipe Face Landmarker (Tasks Vision, WASM/TFJS). Multi‑face, robust, good for "stickers over faces."  
- **Full‑body pose (sprites on body / skeleton):** TensorFlow.js Pose‑Detection API with **MoveNet MultiPose** (17 body keypoints). Fast and widely supported.  
- **3D body (experimental/optional):** MediaPipe **BlazePose GHUM** (3D landmarks) via the Pose Landmarker (Tasks); good if you want depth/rotation, at some perf cost.  
- **QR scanning (optional for alignment/UX):** `jsQR` (small, pure JS) or `zxing-js` (feature‑rich).

**Rendering:**
- **2D overlays:** HTML `<canvas>` 2D context.
- **3D overlays:** **three.js** + GLTFLoader for rigged assets; or simple billboards tied to landmarks.

**Performance backends:**
- TF.js **webgl** backend (default) with **wasm** fallback for older devices.  
- MediaPipe Tasks Vision uses **WASM**; no GPU dependency.

**Why these:** All load via `<script>` tags/CDNs, work over HTTPS on mobile Safari/Chrome, and keep bundle small enough for GitHub Pages.

---

## Compatibility Notes (mobile first)
- Require HTTPS (`getUserMedia`). GitHub Pages is fine.
- iOS Safari needs a user gesture before starting the camera. Provide a big **Start** button.
- Use `facingMode: 'user'` for front camera; offer a flip toggle when supported.
- Keep canvas resolution moderate (e.g., 720p) to maintain 30 FPS on midrange phones.
- Provide a **Quality** dropdown (Low/Med/High) that internally sets model variant or input size.

---

## Features
1. **Modes:** Face overlay | Body overlay | QR align.  
2. **Multi‑person:** Up to 10 faces (configurable). MoveNet MultiPose handles multiple bodies.
3. **Costume UI:**
   - *Option A (super simple):* Floating **Randomize** button.  
   - *Option B (carousel):* Bottom strip of swatches/thumbnails; tap to switch.  
   - *Option C (drawer):* Slide‑up panel with categories (2D, 3D, GIFs).
4. **Assets:**
   - 2D PNGs (alpha) sized to facial landmarks (eyes, nose, mouth) or head bbox.  
   - Animated GIF / PNG sequence sprites (Rick Astley cutout).  
   - 3D GLTFs (hat, mask) attached to head orientation (optional).
5. **Privacy:** All processing on‑device; no uploads. Display a banner stating this.

---

## Project Structure
```
/ (static root)
  index.html
  /assets
    /2d/ hat.png, shades.png, rick/ (sprite frames or gif)
    /3d/ hat.glb, mask.glb
  /lib (optional if not using CDNs)
  /styles/site.css
  /src
    app.js           (boot, camera, routing)
    detectors.js     (face + pose + qr loaders)
    overlay2d.js     (canvas drawing helpers)
    overlay3d.js     (three.js integration; optional)
    ui.js            (randomize, carousel)
    util.js
```

> You can collapse this into a single `index.html` with `<script type="module">` for GitHub Pages simplicity. Below, we give a one‑file starter then suggest modular splits.

---

## CDN Pins (minimal)
- **TF.js & Pose Detection API:**  
  `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js`  
  `https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@3.7.0/dist/pose-detection.min.js`
- **MediaPipe Tasks Vision (Face Landmarker):**  
  `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs` (module)
- **three.js (optional 3D):**  
  `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js`  
  `https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js`
- **QR (choose one):**  
  `https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js` (global)  
  or `https://cdn.jsdelivr.net/npm/@zxing/library@0.20.2`

> Versions can be updated, but pin initially for reproducibility.

---

## Starter: single‑file static demo (multi‑face + multi‑pose)

> Save as `index.html` in an empty repo, push to GitHub Pages. Add a few PNGs in `/assets/2d/` and (optionally) a GLB in `/assets/3d/`.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AR Costume Overlay</title>
  <style>
    html,body { margin:0; height:100%; background:#000; color:#fff; font-family:system-ui, sans-serif; }
    #wrap { position:relative; width:100%; height:100%; overflow:hidden; }
    video#cam { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transform: scaleX(-1); }
    canvas#paint { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
    #ui { position:absolute; left:0; right:0; bottom:0; display:flex; gap:.5rem; padding:.5rem; justify-content:center; align-items:center; }
    .btn { background:#111; border:1px solid #444; padding:.6rem 1rem; border-radius:.8rem; color:#fff; }
    #thumbs { position:absolute; left:0; right:0; bottom:3.5rem; display:flex; gap:.4rem; overflow-x:auto; padding:.4rem; }
    #thumbs img { height:64px; border-radius:.5rem; border:1px solid #333; background:#111; cursor:pointer; }
    #banner { position:absolute; top:.5rem; left:50%; transform:translateX(-50%); background:rgba(0,0,0,.55); padding:.4rem .6rem; border-radius:.5rem; font-size:.85rem; }
  </style>
</head>
<body>
<div id="wrap">
  <video id="cam" playsinline autoplay muted></video>
  <canvas id="paint"></canvas>
  <div id="banner">All processing happens on-device. No uploads.</div>
  <div id="thumbs"></div>
  <div id="ui">
    <select id="mode" class="btn">
      <option value="face">Face overlay</option>
      <option value="pose">Body overlay</option>
      <option value="qr">QR align</option>
    </select>
    <select id="quality" class="btn">
      <option value="low">Low</option>
      <option value="med" selected>Med</option>
      <option value="high">High</option>
    </select>
    <button id="rand" class="btn">Randomize</button>
    <button id="flip" class="btn">Flip</button>
    <button id="start" class="btn">Start camera</button>
  </div>
</div>

<!-- TFJS + Pose Detection API -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@3.7.0/dist/pose-detection.min.js"></script>
<!-- MediaPipe Tasks Vision (module) for Face Landmarks -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs"></script>
<!-- QR (global) -->
<script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js"></script>
<!-- three.js optional (uncomment to try 3D) -->
<!-- <script type="module" src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"></script> -->
<!-- <script type="module" src="https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js"></script> -->

<script type="module">
  import { FaceLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs";

  const el = {
    v: document.getElementById('cam'),
    c: document.getElementById('paint'),
    mode: document.getElementById('mode'),
    quality: document.getElementById('quality'),
    rand: document.getElementById('rand'),
    flip: document.getElementById('flip'),
    start: document.getElementById('start'),
    thumbs: document.getElementById('thumbs')
  };
  const ctx = el.c.getContext('2d');
  let stream, facing = 'user';

  // Assets registry (add your own)
  const costumes = {
    face: [
      { id:'shades', src:'/assets/2d/shades.png', anchor:'eyes', scale:1.35 },
      { id:'hat', src:'/assets/2d/hat.png', anchor:'forehead', scale:1.25 },
      { id:'rick', src:'/assets/2d/rick.gif', anchor:'headBox', scale:1.0 }
    ],
    pose: [
      { id:'sparkle', src:'/assets/2d/sparkles.png', joints:['left_wrist','right_wrist'], scale:1.0 }
    ]
  };
  let current = { face: 0, pose: 0 };

  // Preload thumbs
  function buildThumbs() {
    el.thumbs.innerHTML = '';
    const list = costumes[el.mode.value];
    list.forEach((c, i) => {
      const img = new Image(); img.src = c.src; img.title = c.id;
      img.onclick = () => { current[el.mode.value] = i; };
      el.thumbs.appendChild(img);
    });
  }

  el.mode.onchange = buildThumbs; buildThumbs();
  el.rand.onclick = () => { const list = costumes[el.mode.value]; current[el.mode.value] = Math.floor(Math.random()*list.length); };
  el.flip.onclick = async () => { facing = (facing==='user'?'environment':'user'); await startCamera(); };

  // Camera
  async function startCamera() {
    if (stream) stream.getTracks().forEach(t=>t.stop());
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: facing } }, audio:false });
    el.v.srcObject = stream;
    await el.v.play();
    resizeCanvas();
  }
  el.start.onclick = startCamera;
  window.addEventListener('resize', resizeCanvas);
  function resizeCanvas() {
    const w = el.v.videoWidth || window.innerWidth;
    const h = el.v.videoHeight || window.innerHeight;
    el.c.width = w; el.c.height = h;
  }

  // ======= DETECTORS =======
  // Pose: MoveNet MultiPose via TFJS API
  let poseDetector;
  async function loadPose(quality) {
    const inputRes = quality==='high'? 256 : quality==='med'? 192 : 160;
    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
      enableSmoothing: true,
      minPoseScore: 0.2,
      multiPoseMaxDimension: inputRes
    };
    poseDetector = await poseDetection.createDetector(model, detectorConfig);
  }

  // Face: MediaPipe FaceLandmarker (Tasks Vision)
  let faceLandmarker;
  async function loadFace(quality) {
    const fileset = await FilesetResolver.forVisionTasks(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm`);
    faceLandmarker = await FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task` },
      runningMode: 'VIDEO',
      numFaces: 10, // up to 10 faces
      outputFaceBlendshapes: false,
      minFaceDetectionConfidence: 0.5
    });
  }

  // QR: jsQR (simple scanning rectangle)
  function scanQR(imageData, w, h) {
    const code = jsQR(imageData.data, w, h, { inversionAttempts: 'dontInvert' });
    return code; // {location, data}
  }

  // ======= OVERLAYS =======
  const imgCache = new Map();
  async function getImg(src){ if (!imgCache.has(src)) { const i=new Image(); i.src=src; await i.decode().catch(()=>{}); imgCache.set(src,i);} return imgCache.get(src); }

  function drawFaceOverlay(faces) {
    const asset = costumes.face[current.face];
    if (!asset) return;
    faces.forEach(f => {
      // f has landmarks[468] in image coords
      // Simple head box using left/right cheek + forehead (approx)
      const lx = f.boundingBox.originX, ly = f.boundingBox.originY, lw = f.boundingBox.width, lh = f.boundingBox.height;
      const cx = lx + lw/2, cy = ly + lh/2;
      const scale = asset.scale || 1.0;
      getImg(asset.src).then(img => {
        const w = lw*scale, h = lh*scale;
        ctx.drawImage(img, cx - w/2, cy - h/2, w, h);
      });
    });
  }

  function drawPoseOverlay(poses) {
    const asset = costumes.pose[current.pose];
    if (!asset) return;
    poses.forEach(p => {
      const kp = Object.fromEntries(p.keypoints.map(k=>[k.name,k]));
      const left = kp['left_wrist'], right = kp['right_wrist'];
      if (left && right && left.score>0.2 && right.score>0.2) {
        getImg(asset.src).then(img => {
          const midX = (left.x+right.x)/2, midY=(left.y+right.y)/2;
          const span = Math.hypot(right.x-left.x, right.y-left.y);
          const w = span*1.5*(asset.scale||1), h = img.height*(w/img.width);
          ctx.drawImage(img, midX - w/2, midY - h/2, w, h);
        });
      }
    });
  }

  // ======= MAIN LOOP =======
  let lastTime = 0; let ready=false; let qrMode=false;
  async function ensureModels() {
    await Promise.all([
      loadPose(el.quality.value),
      loadFace(el.quality.value)
    ]);
    ready = true;
  }
  ensureModels();

  async function tick(t){
    requestAnimationFrame(tick);
    if (!el.v.videoWidth || !ready) return;
    // draw camera
    ctx.save();
    ctx.scale(-1,1); ctx.translate(-el.c.width,0); // mirror like selfie
    ctx.drawImage(el.v, 0, 0, el.c.width, el.c.height);
    ctx.restore();

    // get raw pixels if QR
    if (el.mode.value==='qr') {
      const imgData = ctx.getImageData(0,0,el.c.width, el.c.height);
      const code = scanQR(imgData, el.c.width, el.c.height);
      if (code) {
        // draw corner markers
        ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 4;
        ctx.beginPath();
        const pts = [code.location.topLeftCorner, code.location.topRightCorner, code.location.bottomRightCorner, code.location.bottomLeftCorner];
        ctx.moveTo(pts[0].x, pts[0].y); pts.slice(1).forEach(p=>ctx.lineTo(p.x,p.y)); ctx.closePath(); ctx.stroke();
        // align an overlay to QR rect (example)
        const w = Math.hypot(pts[1].x-pts[0].x, pts[1].y-pts[0].y);
        getImg('/assets/2d/hat.png').then(img=>{ ctx.drawImage(img, pts[0].x, pts[0].y - w*0.5, w, w*0.5); });
      }
      return; // skip other detectors for perf in QR mode
    }

    // Pose (bodies)
    if (el.mode.value==='pose' && poseDetector) {
      const poses = await poseDetector.estimatePoses(el.v, { maxPoses: 6, flipHorizontal: true });
      drawPoseOverlay(poses);
    }

    // Face (up to 10 faces)
    if (el.mode.value==='face' && faceLandmarker) {
      const res = faceLandmarker.detectForVideo(el.v, performance.now());
      drawFaceOverlay(res.faces || res.faceLandmarks || []);
    }
  }
  requestAnimationFrame(tick);

  // Quality switch reloads models
  el.quality.onchange = async () => { await ensureModels(); };
</script>
</body>
</html>
```

**Notes:**
- The FaceLandmarker returns either `faces` or `faceLandmarks` depending on version; the drawing function handles both.
- For production, limit simultaneous detectors for perf (switch by mode). You can keep a tiny face detector running to show idle effects.

---

## 3D Option (attach a GLTF hat to head)
- Use Face Landmarker landmarks around the eyes and forehead to compute head center + approximate scale; estimate roll using vector between eye corners.
- In three.js, create a camera‑matched orthographic/AR view (or render to texture above the video canvas). For a first pass: position a hat model at `(cx, cy, z)` where `z` scales with the head bbox.
- Keep polycount low (<10k) and no skeletal animation at first.

---

## Execution Plan (for Claude Code)

1) **Bootstrap repo**
- Create GitHub repo → enable Pages (main branch `/`)
- Add `index.html`, `/assets` + 2–3 PNGs, optional `.glb`.

2) **Camera + canvas**
- Implement Start button → `getUserMedia({video:{facingMode:'user'}})`; mirror canvas.

3) **Detectors**
- Add TFJS + Pose‑Detection; create MoveNet MultiPose detector.  
- Add MediaPipe Tasks Vision; create FaceLandmarker with `numFaces:10`.  
- Optional: add `jsQR` and toggle via Mode.

4) **Overlay layer**
- Write helpers `drawFaceOverlay()` and `drawPoseOverlay()` to map assets to boxes/keypoints.

5) **UI layer**
- Implement Mode, Quality, Randomize, Flip, and a simple thumbnail carousel fed by `/assets`.

6) **Performance tuning**
- Cap canvas size to ~720p.  
- Avoid decoding large GIFs per frame (prefer sprite sheet or MP4 + `drawImage`).  
- In Pose mode, set `maxPoses` to 6–8, not 10, for mobile stability.  
- Consider requestAnimationFrame throttling if FPS dips (<18).

7) **3D pass (optional)**
- Add three.js module; create renderer sized to video.  
- Load a GLTF hat; on each frame, set position/scale from face bbox; render on top with alpha.

8) **Polish**
- Add on‑screen privacy note.  
- Add error handling (no camera permissions, etc.).  
- Add PWA manifest for full‑screen camera on mobile.

---

## UI Variants (pick one now, add others later)
- **Minimal:** Single **Randomize** FAB over video.  
- **Carousel:** Bottom scroller with thumbnails.  
- **Category Drawer:** Chips for *Face*, *Body*, *3D*; inside each, thumbnails.

---

## Stock / Placeholder Assets
- 2D: Transparent PNG hats, glasses, masks you create.  
- Rick Astley: Use your cutout GIF or PNG sequence under fair use / parody; verify rights for public hosting.
- 3D: Look for low‑poly hats/masks (GLTF/GLB) from permissive sources (e.g., Poly Pizza, Sketchfab CC‑BY). Keep <1MB if possible.

---

## Security & Privacy
- Only run on HTTPS.  
- All inference is local; no network calls beyond CDNs.  
- Provide a visible disclaimer.

---

## Future Upgrades
- FaceBlendshapes for expression‑driven effects.  
- Segmentation (selfie background replacement) using MediaPipe Selfie Segmentation.  
- WebAssembly SIMD and threads where available for more FPS.

---

## Modular Split (optional)
If you split files, move detection code to `src/detectors.js` and overlays to `src/overlay2d.js` / `src/overlay3d.js`, import with `<script type="module" src="src/app.js"></script>`.

---

## Testing Checklist (phones)
- iPhone (Safari): tap Start → camera works, 30 FPS target.  
- Android (Chrome): front/back flip works.  
- Low light: reduce input size (Quality Low) automatically if FPS < 15.  
- Multi‑face crowd: try 4–6 faces; ensure overlays remain attached.

---

## Notes on Model Choices
- **MoveNet MultiPose** is fast and accurate for 17‑keypoint 2D pose; good for sprites attached to wrists/head/shoulders.  
- **Face Landmarker** gives dense landmarks for robust face‑locked stickers and scale/rotation inference.  
- **BlazePose GHUM** (3D) gives z‑depth (optional); start with 2D for reliability.

---

## Where the docs live (for later reading)
- MoveNet / TFJS Pose Detection API (MultiPose)
- MediaPipe Face Landmarker (Tasks Vision)
- BlazePose GHUM (3D) overview
- jsQR and/or ZXing for QR

(Links are referenced in the chat response with citations.)

