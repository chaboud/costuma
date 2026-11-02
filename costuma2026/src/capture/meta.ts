// A clip with what it was made from (founder, 2026-11-02: "You probably need a way to record a video with the right
// metadata to reconstruct what was raw and what was tracked/generated. It's the only way you're going to be able to
// debug stuff"). Settings → Advanced → Video metadata: a clip then also records
//  - the camera's own frames, untouched (a second recorder on the camera's track): what the models saw;
//  - per camera frame, what the pose model returned, exactly (before any of the app's own handling: the frame's edge,
//    the upright check, smoothing), in the replay scripts' format (scripts/pose-record.mjs: `{ i, now, w, h, dets }`),
//    so every offline replay runs on it unchanged; and beside it what the app made of it: each track's place, size,
//    smoothed picture and 3D pose, verdict, face and hands, each costume's scale and cloth, the lens, gravity and the
//    floor; and what the hand model returned for each wrist it read;
//  - once: the build, the device, the settings, the camera.
// All three go into one zip (stored, not compressed: the videos are compressed already) that the preview offers as
// "Save debug data". `scripts/meta-replay.test.ts` replays a recording's raw detections through the tracker as it is now
// and compares it with what the phone's tracker made at the time.
import type { Detection, Track } from '../pose/tracker';
import type { HandDet } from '../pose/hands';
import type { Intrinsics } from '../pose/solve';

type V3 = { x: number; y: number; z: number };

/** what the stage made of a track this frame (its costume) */
export interface WearerOut { trackId: number; costume: string; scale: number; fade: number; swing: number[] }

export interface MetaFrame {
  /** the replay format (scripts/pose-record.mjs): frame index, the page's clock (ms; `info.t0` is the clip's start),
   *  the frame's size, the pose model's detections as returned (no masks) */
  i: number; now: number; w: number; h: number; dets: Detection[];
  /** what the tracker was handed besides: how many detections (the People count) and the up it checked against (the
   *  floor's, as it stood before this frame); for an exact replay */
  people: number; up: V3;
  /** the video's own time (s); the lens; the floor after this frame (up in camera axes, height, where up came from) */
  vt: number; K: { f: number; cx: number; cy: number; w: number; h: number };
  ground: { n: V3; h: number; source: string };
  /** what the tracker made: each track as the stage reads it */
  tracks: unknown[];
  /** what the stage made: each costume */
  wearers: WearerOut[];
  /** what the hand model returned this frame (pose/hands.ts: crops round the wrists, mapped back to the frame), by
   *  person and side: the frame's image points [x, y, z] and the metric points turned to the camera */
  hands?: { id: number; side: string; score: number; pts: number[][]; world: number[][] }[];
}

const r5 = (_k: string, v: unknown) => (typeof v === 'number' ? Math.round(v * 1e5) / 1e5 : v);
const pts = (lm: { x: number; y: number; z: number; v: number }[]) => lm.map((p) => [p.x, p.y, p.z, p.v]);

export class MetaLog {
  private frames: MetaFrame[] = [];
  private t0 = 0;
  private i = 0;
  private raw: MediaRecorder | null = null;
  private rawChunks: Blob[] = [];
  rawMime = '';

  /** begin: `info` once (build, device, settings…), the tracker's state now (a replay continues from it), `track` the
   *  camera's video track to record untouched */
  start(info: Record<string, unknown>, now: number, tracker: { all: unknown[]; nextId: number; last: number }, track: MediaStreamTrack | null, mime: string | undefined): void {
    this.t0 = now;
    // the page's own clock throughout (ms, performance.now): the tracker's times stay as they were (moved to start at
    // zero, its last update came out negative, which it reads as "never", and the replay stepped 1/30 s for 0.25)
    // the tracker's state unrounded (a string: the log rounds every number to 1e-5, and a size filter's variance or a
    // motor's velocity rounded so made a replay differ by 0.05 cm)
    this.info = { ...info, started: new Date().toISOString(), t0: now, trackerJSON: JSON.stringify(tracker) };
    if (track && mime && typeof MediaRecorder !== 'undefined') {
      try {
        // 4 Mbit/s: the models' picture is ~480 px; the bundle stays near a phone's upload limits (a 20 s clip ~30 MB)
        this.raw = new MediaRecorder(new MediaStream([track]), { mimeType: mime, videoBitsPerSecond: 4_000_000 });
        this.rawMime = mime;
        this.raw.ondataavailable = (e) => { if (e.data.size) this.rawChunks.push(e.data); };
        this.raw.start(500);
      } catch (e) { console.warn('raw recording refused', e); this.raw = null; }
    }
  }
  private info: Record<string, unknown> = {};

  /** one camera frame: the raw detections, and what the tracker and the stage made of them */
  frame(now: number, vt: number, dets: Detection[], people: number, tracks: Track[], K: Intrinsics, up: V3, ground: { n: V3; h: number; source: string }, wearers: WearerOut[], castOf: (id: number) => string, hands?: Map<number, Partial<Record<'L' | 'R', HandDet>>> | null): void {
    const xyz = (p: V3) => [p.x, p.y, p.z];
    this.frames.push({
      i: this.i++, now, w: K.w, h: K.h,
      dets: dets.map((d) => ({ image: d.image.map((p) => ({ ...p })), world: d.world.map((p) => ({ ...p })) })),
      people, up: { x: up.x, y: up.y, z: up.z },
      vt, K: { f: K.f, cx: K.cx, cy: K.cy, w: K.w, h: K.h },
      ground: { n: { x: ground.n.x, y: ground.n.y, z: ground.n.z }, h: ground.h, source: ground.source },
      tracks: tracks.map((t) => ({
        id: t.id, costume: castOf(t.id), presence: t.presence, lost: t.lost, hits: t.hits, verdict: t.verdict,
        T: [t.T.x, t.T.y, t.T.z], len: t.len, body: { logS: t.body.logS, P: t.body.P },
        // the smoothed picture and the 3D pose the costume was posed from: [x, y, z, v] each
        image: pts(t.image), world: pts(t.world),
        face: t.face ? faceOut(t.face as unknown as Record<string, unknown>) : null,
        // each hand: its frame (a quaternion, camera axes), curls, trust in the hand model, how much is shown
        hands: t.hands ? Object.fromEntries((['L', 'R'] as const).map((s) => { const h = t.hands![s]; return [s, { q: [h.q.x, h.q.y, h.q.z, h.q.w], curl: h.curl, trust: h.trust, w: h.w }]; })) : null,
      })),
      wearers,
      hands: hands ? [...hands].flatMap(([id, o]) => Object.values(o).map((h) => ({ id, side: h!.side, score: h!.score, pts: h!.pts.map(xyz), world: h!.world.map(xyz) }))) : [],
    });
  }

  /** every drawn frame (detection or not): when, and the main thread's ms by stage (detect, face, pose — the costumes
   *  — and render, the WebGL calls; the GPU's own time is not seen), the last depth reading's ms, the quality ladder */
  private ticks: { now: number; ms: Record<string, number> }[] = [];
  tick(now: number, ms: Record<string, number>): void { this.ticks.push({ now, ms: { ...ms } }); }
  /** what happened besides (a costume made or warmed: its ms), when */
  private events: { now: number; what: string; data: Record<string, unknown> }[] = [];
  event(now: number, what: string, data: Record<string, unknown>): void { this.events.push({ now, what, data }); }

  get frameCount(): number { return this.frames.length; }

  /** end: the log as JSON and the camera's own clip */
  async stop(): Promise<{ json: string; raw: Blob | null }> {
    let raw: Blob | null = null;
    if (this.raw) {
      const r = this.raw;
      if (r.state !== 'inactive') await new Promise<void>((done) => { r.onstop = () => done(); r.stop(); });
      raw = new Blob(this.rawChunks, { type: this.rawMime.split(';')[0] });
    }
    const json = JSON.stringify({ format: 'costuma-meta-1', info: this.info, frames: this.frames, ticks: this.ticks, events: this.events }, r5);
    return { json, raw };
  }
}

/** a face's state: its numbers (jaw, blinks, expressions…), its head turn and how much it is trusted */
function faceOut(f: Record<string, unknown>): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(f)) if (typeof v === 'number' || typeof v === 'boolean') o[k] = v;
  const h = f.head as { x: number; y: number; z: number; w: number } | undefined;
  if (h) o.head = [h.x, h.y, h.z, h.w];
  return o;
}

// ── a zip, stored (no compression): local headers, the data, a central directory ──────────────────────────────────────
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(b: Uint8Array): number { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]!) & 0xff]! ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }

export async function zip(files: { name: string; data: Blob | string }[]): Promise<Blob> {
  const enc = new TextEncoder(), parts: BlobPart[] = [], dir: Uint8Array[] = [];
  let off = 0;
  for (const f of files) {
    const data = typeof f.data === 'string' ? enc.encode(f.data) : new Uint8Array(await f.data.arrayBuffer());
    const name = enc.encode(f.name), crc = crc32(data);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
    h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true);
    c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true); c.setUint32(42, off, true);
    parts.push(new Uint8Array(h.buffer), name, data);
    const cd = new Uint8Array(46 + name.length); cd.set(new Uint8Array(c.buffer)); cd.set(name, 46); dir.push(cd);
    off += 30 + name.length + data.length;
  }
  const size = dir.reduce((a, d) => a + d.length, 0), e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, size, true); e.setUint32(16, off, true);
  return new Blob([...parts, ...dir, new Uint8Array(e.buffer)], { type: 'application/zip' });
}
