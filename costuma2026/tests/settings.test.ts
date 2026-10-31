import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadSettings } from '../src/settings';

const store = (v: unknown) => vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(v), setItem: () => undefined });
afterEach(() => vi.unstubAllGlobals());

describe('settings', () => {
  it('reads the old yes/no for costumes in party mode', () => {
    store({ partyCostumes: true }); expect(loadSettings().partyCostumes).toBe('on');
    store({ partyCostumes: false }); expect(loadSettings().partyCostumes).toBe('off');
    store({ partyCostumes: 'behind' }); expect(loadSettings().partyCostumes).toBe('behind');
  });
  it('falls back to defaults when storage throws', () => {
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('private'); } });
    expect(loadSettings().people).toBe(2);
  });
});
