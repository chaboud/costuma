import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';
const sha = (() => { try { return execSync('git rev-parse --short HEAD').toString().trim(); } catch { return 'dev'; } })();
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
