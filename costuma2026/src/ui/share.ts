// Getting a photo, a clip or the link off the phone. On a phone the share sheet is the way into the photo library:
// iOS's sheet has "Save Image" / "Save Video", which put the file in Photos (a download lands in Files instead, four taps
// away). The sheet needs a recent tap (the browser's user activation), so a capture tries it straight from the shutter's
// tap and falls back to a preview, whose button is a fresh tap.
export type ShareResult = 'shared' | 'cancelled' | 'refused' | 'saved';

const asFile = (blob: Blob, name: string) => new File([blob], name, { type: blob.type });

/** whether this browser can hand this file to the share sheet */
export function canShareFile(blob: Blob, name: string): boolean {
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  try { return !!nav.canShare?.({ files: [asFile(blob, name)] }); } catch { return false; }
}

/**
 * The share sheet with the file alone: no title or text beside it (a sheet sharing text as well can leave "Save Image"
 * out; reported for iOS, not checked here). 'refused' when the browser would not open it (no recent tap); with
 * `fallback` a refusal or a browser without file sharing downloads it instead ('saved').
 */
export async function shareFile(blob: Blob, name: string, fallback = true): Promise<ShareResult> {
  if (canShareFile(blob, name)) {
    try { await navigator.share({ files: [asFile(blob, name)] }); return 'shared'; } catch (e) {
      const n = (e as Error).name;
      if (n === 'AbortError') return 'cancelled';
      if (!fallback) return 'refused';
    }
  } else if (!fallback) return 'refused';
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
