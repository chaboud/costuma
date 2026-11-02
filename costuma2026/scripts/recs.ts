// Recorded frames for the offline replays, from any of: a scripts/pose-record.mjs array, a phone's debug recording
// (settings → Advanced → Video metadata: its `-meta.json`, or the whole `-debug.zip`).
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import type { Detection } from '../src/pose/tracker';

export interface Rec { i: number; now: number; w: number; h: number; dets: Detection[]; people?: number; up?: { x: number; y: number; z: number }; K?: { f: number; cx: number; cy: number; w: number; h: number }; tracks?: unknown[] }
export interface Recording { recs: Rec[]; info: Record<string, unknown> | null }

export function loadRecording(file: string): Recording {
  const text = file.endsWith('.zip') ? execFileSync('unzip', ['-p', file, '*-meta.json'], { maxBuffer: 1 << 30 }).toString() : readFileSync(file, 'utf8');
  const j = JSON.parse(text) as Rec[] | { format: string; info: Record<string, unknown>; frames: Rec[] };
  return Array.isArray(j) ? { recs: j, info: null } : { recs: j.frames, info: j.info };
}
export const loadRecs = (file: string): Rec[] => loadRecording(file).recs;
