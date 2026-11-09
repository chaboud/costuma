// The depth model in a worker of its own (render/occlusion.ts SceneDepth), one engine a worker: the GPU (WebGPU) or the
// CPU (plain WebAssembly). Founder's iPhone, 2026-11-09: "out of memory issues when trying to load the depth model".
// What is known of it (others' reports, not measured here):
//  - onnxruntime-web's loader always asks for a shared WebAssembly memory that may grow to 4 GB, whatever the thread
//    count; Safari reserves the whole maximum up front, and an iPhone tab already holding other WebAssembly (here the
//    pose, face and hand models, each its own) may not have it: "RangeError: Out of memory". Capped at 1 GB (a smaller
//    maximum is still a valid import), as 0g-drive did (github.com/0gfoundation/0g-drive/pull/47). The depth model needs
//    a fraction of that (19 MB of weights, a 252×252 input).
//  - constant folding on the WebGPU path grows the WebAssembly heap for good (onnxruntime #33793): off.
//  - the WebGPU bundle runs on the asyncify build, which costs WebKit far more than the plain one (twolay #20: Whisper
//    1467 → 760 MB); the CPU path here is the plain one.
// A failed engine's worker is ended (`terminate`), and its memory with it: the GPU's failure cannot eat what the CPU's
// try needs, and an engine whose start failed (it refuses every later one) is never asked twice.
type Ort = typeof import('onnxruntime-web/webgpu') | typeof import('onnxruntime-web/wasm');
type Session = import('onnxruntime-web').InferenceSession;

const PAGE = 65536;
/** the largest shared memory the runtime may reserve, in pages (1 GB) */
const CAP_PAGES = 16384;
const MEAN = [0.485, 0.456, 0.406], STD = [0.229, 0.224, 0.225];

/** what the runtime asked of WebAssembly.Memory and what it was given (MB), for the readout */
const asked: { asked: number; gave: number }[] = [];
/** wrap WebAssembly.Memory: a shared memory's maximum capped; `strict` (a test's stand-in for a tight phone tab) refuses
 *  any maximum over the cap, as Safari can */
function capMemory(cap: boolean, strict: boolean): void {
  const Real = WebAssembly.Memory;
  const Capped = function (this: unknown, d: WebAssembly.MemoryDescriptor) {
    const want = d.maximum ?? d.initial;
    const max = cap && d.shared && d.maximum !== undefined ? Math.min(d.maximum, Math.max(CAP_PAGES, d.initial)) : d.maximum;
    asked.push({ asked: (want * PAGE) / 2 ** 20, gave: ((max ?? d.initial) * PAGE) / 2 ** 20 });
    if (strict && (max ?? d.initial) > CAP_PAGES) throw new RangeError('Out of memory (a tight tab: no room for that maximum)');
    return new Real({ ...d, maximum: max } as WebAssembly.MemoryDescriptor);
  } as unknown as typeof WebAssembly.Memory;
  Capped.prototype = Real.prototype;
  (WebAssembly as { Memory: typeof WebAssembly.Memory }).Memory = Capped;
}

let ort: Ort | null = null, session: Session | null = null;
const why = (e: unknown) => (typeof e === 'number' ? `the runtime stopped (code ${e})` : String((e as Error)?.message ?? e)).replace(/\s+/g, ' ').slice(0, 160);

self.onmessage = async (e: MessageEvent<{ kind: 'load'; url: string; engine: 'webgpu' | 'wasm'; cap: boolean; strict: boolean } | { kind: 'run'; px: Uint8ClampedArray; w: number; h: number }>) => {
  const m = e.data;
  if (m.kind === 'load') {
    try {
      capMemory(m.cap, m.strict);
      if (m.engine === 'webgpu') {
        const nav = self.navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } };
        if (!nav.gpu) throw new Error('no WebGPU in a worker here');
        if (!(await nav.gpu.requestAdapter().catch(() => null))) throw new Error('no WebGPU adapter in a worker');
        ort = await import('onnxruntime-web/webgpu');
      } else ort = await import('onnxruntime-web/wasm');
      ort.env.wasm.numThreads = 1; // GitHub Pages cannot send the headers threads need
      session = await ort.InferenceSession.create(m.url, {
        executionProviders: [m.engine],
        // (constant folding grows the WebAssembly heap for good on the WebGPU path: onnxruntime #33793)
        extra: { 'optimization.disable_specified_optimizers': 'ConstantFolding' },
      });
      postMessage({ kind: 'loaded', memory: asked });
    } catch (err) {
      postMessage({ kind: 'failed', why: why(err), memory: asked });
    }
    return;
  }
  if (!session || !ort) { postMessage({ kind: 'read', error: 'not loaded' }); return; }
  try {
    const { px, w, h } = m, n = w * h, data = new Float32Array(3 * n);
    for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) data[k * n + i] = (px[i * 4 + k]! / 255 - MEAN[k]!) / STD[k]!;
    const t0 = performance.now();
    const out = await session.run({ [session.inputNames[0]!]: new ort.Tensor('float32', data, [1, 3, h, w]) });
    const ms = performance.now() - t0;
    const t = out[session.outputNames[0]!]!;
    const d = Float32Array.from(t.data as Float32Array);
    postMessage({ kind: 'read', d, w: t.dims.at(-1), h: t.dims.at(-2), ms }, { transfer: [d.buffer] });
  } catch (err) { postMessage({ kind: 'read', error: why(err) }); }
};
