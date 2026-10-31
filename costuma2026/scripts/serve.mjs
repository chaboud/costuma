// Serve the production build (../2026) for headless runs; the dev server reloads pages as it discovers dependencies.
import { preview } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
export async function serveBuild() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const server = await preview({ root, logLevel: 'error', preview: { port: 0, host: '127.0.0.1' } });
  const port = server.httpServer.address().port;
  return { url: `http://127.0.0.1:${port}/`, close: () => new Promise((r) => server.httpServer.close(r)) };
}
