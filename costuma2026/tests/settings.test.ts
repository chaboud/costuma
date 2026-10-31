import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadSettings } from '../src/settings';

const store = (v: unknown) => vi.stubGlobal('localStorage', { getItem: () => JSON.stringify(v), setItem: () => undefined });
afterEach(() => vi.unstubAllGlobals());

describe('settings', () => {
  it('reads the old yes/no for costumes in party mode', () => {
    store({ partyCostumes: true, v: 2 }); expect(loadSettings().partyCostumes).toBe('on');
    store({ partyCostumes: false, v: 2 }); expect(loadSettings().partyCostumes).toBe('off');
    store({ partyCostumes: 'behind', v: 2 }); expect(loadSettings().partyCostumes).toBe('behind');
  });
  it('moves settings from before v2 to the new party default, once', () => {
    store({ effect: 'pop', partyCostumes: false, people: 3 });
    const s = loadSettings();
    expect([s.effect, s.partyCostumes, s.partyCast, s.people, s.v]).toEqual(['insitu', 'behind', 'skeleton', 3, 2]);
    // already v2: a choice made since stays
    store({ effect: 'pop', partyCostumes: 'off', v: 2 });
    expect([loadSettings().effect, loadSettings().partyCostumes]).toEqual(['pop', 'off']);
  });
  it('a first visit gets In Situ with skeletons behind', () => {
    store({}); const s = loadSettings();
    expect([s.effect, s.partyCostumes, s.partyCast]).toEqual(['insitu', 'behind', 'skeleton']);
  });
  it('falls back to defaults when storage throws', () => {
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('private'); } });
    expect(loadSettings().people).toBe(2);
  });
});
