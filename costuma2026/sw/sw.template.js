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
const VERSION = '__VERSION__';
const MANIFEST = __MANIFEST__; // { "path": "hash" }, paths relative to this file
const SHELL = __SHELL__; // paths fetched at install
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
