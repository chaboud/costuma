// Getting a photo, a clip or the link off the phone: the share sheet when there is one, else a download. Share runs from
// its own tap (iOS wants a fresh gesture), so captures land in a preview first.
export async function shareFile(blob: Blob, name: string): Promise<'shared' | 'saved' | 'cancelled'> {
  const file = new File([blob], name, { type: blob.type });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'costuma 2026' }); return 'shared'; } catch (e) { if ((e as Error).name === 'AbortError') return 'cancelled'; }
  }
  saveFile(blob, name);
  return 'saved';
}
export function saveFile(blob: Blob, name: string): void {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 30000);
}
/** mp4 first: iOS Safari cannot record webm */
export function recorderMime(): string | undefined {
  const MR = (window as unknown as { MediaRecorder?: typeof MediaRecorder }).MediaRecorder;
  if (!MR) return undefined;
  return ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find((m) => MR.isTypeSupported(m));
}
