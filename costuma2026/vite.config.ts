import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';
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
// Relative base: the build drops into costuma/2026/ (GitHub Pages from main) or any static host unchanged.
export default defineConfig({
  base: './',
  define: { __BUILD__: JSON.stringify(stamp) },
  build: { outDir: '../2026', emptyOutDir: true, sourcemap: false, target: 'es2022', rollupOptions: { input: { main: 'index.html' } } },
  server: { port: 5173 },
  // the costume builder's worker is a module (it imports the roster); module workers: Safari 15+
  worker: { format: 'es' },
  // pre-bundled up front: discovered late, vite reloads the page mid-run (it broke the headless e2e)
  optimizeDeps: { include: ['three', '@mediapipe/tasks-vision', 'qrcode-generator', 'three/addons/objects/MarchingCubes.js', 'three/addons/utils/SkeletonUtils.js', 'three/addons/environments/RoomEnvironment.js', 'three/addons/geometries/RoundedBoxGeometry.js', 'three/addons/utils/BufferGeometryUtils.js'] },
  test: { exclude: ['**/node_modules/**', '**/dist/**'] },
} as Parameters<typeof defineConfig>[0]);
