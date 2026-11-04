import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { guessIntrinsics } from '../src/pose/solve';
import { synthCrowd } from '../src/pose/synth';
import { Tracker } from '../src/pose/tracker';
import { zip } from '../src/capture/meta';

const K = guessIntrinsics(720, 1280);

describe('the debug recording', () => {
  it('a tracker restored from its snapshot goes on exactly as the original', () => {
    const a = new Tracker(), up = new THREE.Vector3(0, 1, 0);
    let t = 0;
    for (let i = 0; i < 40; i++) a.update(synthCrowd(2, i / 30, K), (t += 33), K, up);
    // through JSON, as the log carries it
    const b = new Tracker();
    b.restore(JSON.parse(JSON.stringify(a.snapshot())));
    for (let i = 40; i < 90; i++) {
      const d = synthCrowd(2, i / 30, K);
      a.update(d, (t += 33), K, up);
      b.update(d, t, K, up);
    }
    expect(b.tracks.map((k) => k.id)).toEqual(a.tracks.map((k) => k.id));
    for (let j = 0; j < a.tracks.length; j++) {
      const x = a.tracks[j]!, y = b.tracks[j]!;
      expect(y.T).toEqual(x.T);
      expect(y.world).toEqual(x.world);
      expect(y.image).toEqual(x.image);
      expect(y.len).toEqual(x.len);
    }
  });

  it('the zip holds its files, stored, under their names', async () => {
    const blob = await zip([{ name: 'a.json', data: '{"x":1}' }, { name: 'b.bin', data: new Blob([new Uint8Array([1, 2, 3, 250])]) }]);
    const b = new Uint8Array(await blob.arrayBuffer()), v = new DataView(b.buffer);
    const out: { name: string; data: number[] }[] = [];
    let o = 0;
    while (v.getUint32(o, true) === 0x04034b50) {
      const size = v.getUint32(o + 18, true), nl = v.getUint16(o + 26, true);
      out.push({ name: new TextDecoder().decode(b.subarray(o + 30, o + 30 + nl)), data: [...b.subarray(o + 30 + nl, o + 30 + nl + size)] });
      o += 30 + nl + size;
    }
    expect(out.map((f) => f.name)).toEqual(['a.json', 'b.bin']);
    expect(new TextDecoder().decode(new Uint8Array(out[0]!.data))).toBe('{"x":1}');
    expect(out[1]!.data).toEqual([1, 2, 3, 250]);
    // the central directory follows, and the end record says two entries
    expect(v.getUint32(b.length - 22, true)).toBe(0x06054b50);
    expect(v.getUint16(b.length - 22 + 10, true)).toBe(2);
  });

  it('the zip\'s checksums are CRC-32, a long clip read slice by slice (never held twice)', async () => {
    const crcAt = async (z: Blob, k: number) => { const v = new DataView(await z.slice(0, 30).arrayBuffer()); return [v.getUint32(14, true), v.getUint32(18, true), k]; };
    // the check value of CRC-32 over "123456789"
    expect((await crcAt(await zip([{ name: 'c.txt', data: '123456789' }]), 0))[0]).toBe(0xcbf43926);
    // past the 8 MB slice: against a CRC taken in one pass
    const big = new Uint8Array(9 * 1024 * 1024 + 123);
    for (let i = 0; i < big.length; i++) big[i] = (i * 2654435761) >>> 24;
    let c = 0xffffffff;
    const T = Array.from({ length: 256 }, (_, n) => { let x = n; for (let k = 0; k < 8; k++) x = x & 1 ? 0xedb88320 ^ (x >>> 1) : x >>> 1; return x >>> 0; });
    for (let i = 0; i < big.length; i++) c = T[(c ^ big[i]!) & 0xff]! ^ (c >>> 8);
    const [crc, size] = await crcAt(await zip([{ name: 'clip.mp4', data: new Blob([big]) }]), 0);
    expect(crc).toBe((c ^ 0xffffffff) >>> 0);
    expect(size).toBe(big.length);
  });
});
