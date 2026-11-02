import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
// the commit the source is at, with a "+" when the source has changes not yet committed (a build from a dirty tree
// stamped its parent's hash: a phone's debug log named the wrong code). Commit the source, then build.
const sha = (() => {
  try {
    const h = execSync('git rev-parse --short HEAD').toString().trim();
    const dirty = execSync('git status --porcelain -- .').toString().split('\n').some((l) => l.trim());
    return dirty ? `${h}+` : h;
  } catch { return 'dev'; }
})();
const stamp = `${sha} · ${new Date().toISOString().slice(0, 16).replace('T', ' ')}Z`;
/**
 * The service worker (sw/sw.template.js), written after the build with the build's manifest: every file and a hash of
 * its contents (so an unchanged model is kept across updates and a changed one fetched anew), and the small shell it
 * fetches at install.
 */
function serviceWorker(outDir: string) {
  return {
    name: 'costuma-sw',
    apply: 'build' as const,
    closeBundle() {
      const manifest: Record<string, string> = {};
      const walk = (d: string) => { for (const f of readdirSync(d)) { const p = path.join(d, f); if (statSync(p).isDirectory()) walk(p); else { const rel = path.relative(outDir, p).split(path.sep).join('/'); if (rel !== 'sw.js') manifest[rel] = createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 16); } } };
      walk(outDir);
      const shell = Object.keys(manifest).filter((p) => p === 'index.html' || /^assets\/(main|build\.worker|vision_bundle)-.*\.(js|css)$/.test(p) || p.startsWith('thumbs/'));
      const src = readFileSync(path.resolve('sw/sw.template.js'), 'utf8')
        .replace("'__VERSION__'", JSON.stringify(stamp)).replace('__MANIFEST__', JSON.stringify(manifest)).replace('__SHELL__', JSON.stringify(shell));
      writeFileSync(path.join(outDir, 'sw.js'), src);
    },
  };
}

// Relative base: the build drops into costuma/2026/ (GitHub Pages from main) or any static host unchanged.
export default defineConfig({
  base: './',
  define: { __BUILD__: JSON.stringify(stamp) },
  plugins: [serviceWorker(path.resolve('../2026'))],
  build: { outDir: '../2026', emptyOutDir: true, sourcemap: false, target: 'es2022', rollupOptions: { input: { main: 'index.html' } } },
  server: { port: 5173 },
  // the costume builder's worker is a module (it imports the roster); module workers: Safari 15+
  worker: { format: 'es' },
  // pre-bundled up front: discovered late, vite reloads the page mid-run (it broke the headless e2e)
  optimizeDeps: { include: ['three', '@mediapipe/tasks-vision', 'qrcode-generator', 'three/addons/objects/MarchingCubes.js', 'three/addons/utils/SkeletonUtils.js', 'three/addons/environments/RoomEnvironment.js', 'three/addons/geometries/RoundedBoxGeometry.js', 'three/addons/utils/BufferGeometryUtils.js'] },
  test: { exclude: ['**/node_modules/**', '**/dist/**'] },
} as Parameters<typeof defineConfig>[0]);
