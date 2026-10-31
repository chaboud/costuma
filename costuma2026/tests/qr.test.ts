import { describe, expect, it } from 'vitest';
import { qrSvg } from '../src/ui/qr';

describe('qr', () => {
  it('draws a scalable svg for the page address', () => {
    const svg = qrSvg('https://chaboud.github.io/costuma/2026/');
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('viewBox');
    expect(svg.length).toBeGreaterThan(1000);
  });
});
