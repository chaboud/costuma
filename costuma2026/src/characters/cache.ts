// Costumes kept on the phone (founder, 2026-11-02: "Could pre-fetch assets to local storage to have things be fast and
// available... need to handle content changes"): the costume worker's arrays (the sampled surface, its colours and
// weights, the fur's shell: 0.5–1.9 s a costume on a desktop's core) in IndexedDB, so a later visit skips the worker
// and only assembles them. Keyed by the costume worker's own file name, which carries the bundler's hash of its code —
// every character's included: any change to any character's code is a new name, and what the old one made is dropped.
import type { SurfaceArrays } from './build';

const DB = 'costuma-costumes', STORE = 'arrays';
export interface Kept { body: SurfaceArrays | null; fur: SurfaceArrays | null }

let db: Promise<IDBDatabase | null> | null = null;
function open(): Promise<IDBDatabase | null> {
  return db ??= new Promise((resolve) => {
    try {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(STORE);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => resolve(null);
      r.onblocked = () => resolve(null);
    } catch { resolve(null); }
  });
}
const tx = async <T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T | undefined> => {
  const d = await open();
  if (!d) return undefined;
  return new Promise((resolve) => {
    try {
      const r = fn(d.transaction(STORE, mode).objectStore(STORE));
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => resolve(undefined);
    } catch { resolve(undefined); }
  });
};

/** the costume cache for one version of the costume code (`version`: the worker's file name) */
export class CostumeCache {
  constructor(private version: string) {}
  private key(id: string): string { return `${this.version}|${id}`; }
  get(id: string): Promise<Kept | undefined> { return tx('readonly', (s) => s.get(this.key(id)) as IDBRequest<Kept>); }
  put(id: string, k: Kept): Promise<unknown> { return tx('readwrite', (s) => s.put(k, this.key(id))); }
  /** drop what another version of the code made */
  async prune(): Promise<void> {
    const keys = (await tx('readonly', (s) => s.getAllKeys())) ?? [];
    for (const k of keys) if (typeof k === 'string' && !k.startsWith(`${this.version}|`)) await tx('readwrite', (s) => s.delete(k));
  }
}
