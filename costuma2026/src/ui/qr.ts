// The page's own address as a QR code, so a costume spreads by pointing one phone at another. The address is where
// this page is served from (no query, no hash), so the code is right wherever the build is published.
import qrcode from 'qrcode-generator';

export function pageUrl(): string {
  return location.origin + location.pathname.replace(/index\.html$/, '');
}
export function qrSvg(text: string): string {
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  return qr.createSvgTag({ cellSize: 8, margin: 2, scalable: true });
}
