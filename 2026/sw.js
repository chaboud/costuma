// costuma 2026's service worker (founder, 2026-11-02: "Could pre-fetch assets to local storage to have things be fast
// and available... need to handle content changes, of course"). The build writes it (vite.config.ts) with a manifest:
// every file of the app with a hash of its contents.
//  - the page itself: the network first (a new version arrives at once), the phone's copy when there is no network;
//  - every file in the manifest: the phone's copy if it holds this content, else fetched once and kept. Files whose name
//    carries the bundler's hash are kept under their own name; the rest (models, the pose model's runtime, thumbnails)
//    under their name and their content's hash, so a changed file is fetched anew and an unchanged one — a 9 MB model —
//    survives an update;
//  - installed, it fetches the small shell (the page, the code, the costume worker, the thumbnails) at once; the models
//    are kept the first time the app asks for them (fetched twice at once on a slow connection, they would only fight);
//  - activated, it drops what neither this version nor the one before needs (a page open across an update can still
//    fetch its own parts).
const VERSION = "4455abd · 2026-11-09 22:17Z";
const MANIFEST = {"assets/build.worker-BC0wa-0N.js":"134ff25095c32ff3","assets/depth.worker-BGtm7YhD.js":"5dee425fa023faa2","assets/main-B0xxPrsk.css":"124e81e489d16e45","assets/main-D2QTUYck.js":"a0026c7209283644","assets/ort-wasm-simd-threaded-DcHrbrbl.wasm":"3398c10d07d229bd","assets/ort-wasm-simd-threaded.asyncify-D5D0fo7z.wasm":"39f9f0894d478800","assets/ort.wasm.bundle.min-Bu_8w9sX.js":"d692e38a0d71ebe3","assets/ort.webgpu.bundle.min-C5HzYTF3.js":"1142da09e8360bc5","assets/vision_bundle-Bk4VIwNi.js":"57485176dcff1d2c","index.html":"553975a69c1604fb","mediapipe/vision_wasm_internal.js":"e7fd9858e8e8f221","mediapipe/vision_wasm_internal.wasm":"6a5c64584c2ab61c","mediapipe/vision_wasm_nosimd_internal.js":"438d1fe8ff7f4d94","mediapipe/vision_wasm_nosimd_internal.wasm":"8a3092d34c79d3f5","models/depth-anything-v2-small-q4f16.onnx":"eca72971aea64216","models/face_landmarker.task":"64184e229b263107","models/hand_landmarker.task":"fbc2a30080c3c557","models/pose_landmarker_full.task":"4eaa5eb7a9836522","models/pose_landmarker_lite.task":"59929e1d1ee95287","thumbs/bastion.png":"11171d662ac388dc","thumbs/builder.png":"6f27f2e22c63a148","thumbs/catrina.png":"78b073d465eae9d7","thumbs/crimson.png":"b27076e3bc58fcf6","thumbs/ghost.png":"e710f750c9c34bf9","thumbs/howler.png":"c42ce83ce427200d","thumbs/jimothy.png":"d0abe5471bc5dcd1","thumbs/kaiju.png":"cdba96341d7968b2","thumbs/kestrel.png":"04574ad6a3dcf24d","thumbs/mummy.png":"08e9357eb51d0682","thumbs/plume.png":"b3b0a2ccc750de49","thumbs/pumpkin.png":"06471abc2d16f23a","thumbs/skeleton.png":"78c9da8fbd3bc2f3","thumbs/unison.png":"7c3f6f83514872e9","thumbs/vampire.png":"02326b8cd094ac2c","thumbs/violet.png":"d339f1a07f58ba9f","thumbs/witch.png":"b1bcfbecede89568"}; // { "path": "hash" }, paths relative to this file
const SHELL = ["assets/build.worker-BC0wa-0N.js","assets/main-B0xxPrsk.css","assets/main-D2QTUYck.js","assets/vision_bundle-Bk4VIwNi.js","index.html","thumbs/bastion.png","thumbs/builder.png","thumbs/catrina.png","thumbs/crimson.png","thumbs/ghost.png","thumbs/howler.png","thumbs/jimothy.png","thumbs/kaiju.png","thumbs/kestrel.png","thumbs/mummy.png","thumbs/plume.png","thumbs/pumpkin.png","thumbs/skeleton.png","thumbs/unison.png","thumbs/vampire.png","thumbs/violet.png","thumbs/witch.png"]; // paths fetched at install
const CACHE = 'costuma-2026';
const BASE = new URL('./', self.location).href;

const hashed = (path) => path.startsWith('assets/');
const keyOf = (path) => (hashed(path) ? BASE + path : `${BASE}${path}?v=${MANIFEST[path]}`);

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(SHELL.map(async (p) => {
      if (await c.match(keyOf(p))) return;
      try { const r = await fetch(BASE + p, { cache: 'no-cache' }); if (r.ok) await c.put(keyOf(p), r); } catch { /* fetched on use */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    const prevRes = await c.match(BASE + '__manifest__');
    const prev = prevRes ? await prevRes.json() : { manifest: {} };
    const keep = new Set([...Object.keys(MANIFEST).map(keyOf), ...Object.keys(prev.manifest).map((p) => (hashed(p) ? BASE + p : `${BASE}${p}?v=${prev.manifest[p]}`)), BASE + '__manifest__', BASE, BASE + 'index.html']);
    for (const req of await c.keys()) if (!keep.has(req.url)) await c.delete(req);
    await c.put(BASE + '__manifest__', new Response(JSON.stringify({ version: VERSION, manifest: MANIFEST })));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(BASE) || req.headers.has('range')) return;
  const url = new URL(req.url), path = decodeURIComponent(url.pathname.slice(new URL(BASE).pathname.length));
  // the page: the network first, the phone's copy offline
  if (req.mode === 'navigate' || path === '' || path === 'index.html') {
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      try {
        const r = await fetch(req, { cache: 'no-cache' });
        if (r.ok) await c.put(BASE + 'index.html', r.clone());
        return r;
      } catch {
        // the copy from the last visit through this worker, or the one kept at install
        return (await c.match(BASE + 'index.html')) ?? (await c.match(keyOf('index.html'))) ?? Response.error();
      }
    })());
    return;
  }
  const inManifest = Object.prototype.hasOwnProperty.call(MANIFEST, path);
  // an old version's hashed file (a page open across an update) is still served if it was kept
  if (!inManifest && !hashed(path)) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE), key = inManifest ? keyOf(path) : BASE + path;
    const have = await c.match(key);
    if (have) return have;
    const r = await fetch(req);
    // kept while the app already reads it (a 9 MB model is not held back until it is stored)
    if (r.ok && inManifest) e.waitUntil(c.put(key, r.clone()));
    return r;
  })());
});
