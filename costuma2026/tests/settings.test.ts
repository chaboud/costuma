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
    expect([s.effect, s.partyCostumes, s.partyCast, s.people, s.v, s.model]).toEqual(['insitu', 'behind', 'skeleton', 3, 5, 'full']);
    // already v2: a party choice made since stays, but the model moves to full (v3)
    store({ effect: 'pop', partyCostumes: 'off', model: 'lite', v: 2 });
    expect([loadSettings().effect, loadSettings().partyCostumes, loadSettings().model]).toEqual(['pop', 'off', 'full']);
    // v3: the lite model, chosen since, stays
    store({ model: 'lite', v: 3 });
    expect(loadSettings().model).toBe('lite');
  });
  it('the pyramid became a toggle: a saved Pyramid effect becomes In Situ with the pyramid on', () => {
    store({ effect: 'pyramid', pyramid: false, v: 3 });
    expect([loadSettings().effect, loadSettings().pyramid]).toEqual(['insitu', true]);
    store({ effect: 'lasers', pyramid: false, v: 4 });
    expect([loadSettings().effect, loadSettings().pyramid]).toEqual(['lasers', false]);
  });
  it('the rotation: the usual seven by default; a chosen one stays', () => {
    store({ v: 4 });
    expect(loadSettings().cast).toEqual(['jimothy', 'builder', 'skeleton', 'pumpkin', 'howler', 'violet', 'plume']);
    store({ cast: ['kaiju', 'ghost'], v: 5 });
    expect(loadSettings().cast).toEqual(['kaiju', 'ghost']);
    store({ cast: [], v: 5 });
    expect(loadSettings().cast.length).toBe(7);
  });
  it('whoever wore the Valkyrie wears Violet', () => {
    store({ costume: 'valkyrie', partyCast: 'valkyrie', v: 3 });
    expect([loadSettings().costume, loadSettings().partyCast]).toEqual(['violet', 'violet']);
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
