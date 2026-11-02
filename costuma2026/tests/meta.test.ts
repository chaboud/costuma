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
});
