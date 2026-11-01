// Camera capture with costuma 2024's (and PewPew's) iOS rules: always facingMode on iOS, never deviceId (iOS Safari
// changes deviceIds between enumerations); the <video> is autoplay + muted + playsinline; wait 100 ms after stopping tracks
// before opening again.
export type Facing = 'user' | 'environment';

export const isIOS = (): boolean => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
export const isMobile = (): boolean => isIOS() || /Android|Mobile/i.test(navigator.userAgent);

/** a stop on the lens pill: the zoom it asks for, as a factor of the camera's main lens */
export interface LensStop { zoom: number; label: string }

/**
 * The camera's lenses, two ways. Where the stream can zoom (the `zoom` constraint: Chrome on Android since 87, Safari on
 * iOS since 17.4 by a third party's account, not checked here), stops at 0.5× (or whatever the phone's least is,
 * an ultra-wide), 1×, 2×, 3×, 5× inside what it reports — an iPhone's back camera switches to its ultra-wide and
 * telephoto lenses by itself as the zoom passes them. Where it cannot, other cameras facing the same way, cycled by
 * device (Android lists its lenses as cameras) — never on iOS, whose device ids change between enumerations.
 */
export class Camera {
  stream: MediaStream | null = null;
  facing: Facing;
  /** the zoom this stream is at, as a factor of the main lens (0.5: an ultra-wide; 2: twice as narrow) */
  zoom = 1;
  /** what the stream can zoom over, if it can */
  zoomRange: { min: number; max: number } | null = null;
  /** other cameras facing the same way (no zoom): their device ids and labels, and which is open */
  lenses: { id: string; label: string }[] = [];
  lens = 0;
  constructor(readonly video: HTMLVideoElement, facing?: Facing) {
    this.facing = facing ?? (isMobile() ? 'environment' : 'user');
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
  }

  /** open a camera by facing (or, off iOS, a device facing that way), at a zoom if it can */
  async open(facing = this.facing, zoom = 1, deviceId?: string): Promise<void> {
    const had = !!this.stream;
    this.stop();
    if (had) await new Promise((r) => setTimeout(r, 100));
    const video: MediaTrackConstraints = { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } };
    if (deviceId && !isIOS()) video.deviceId = { exact: deviceId };
    else video.facingMode = facing;
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: false, video });
    this.facing = facing;
    this.video.srcObject = this.stream;
    await this.video.play().catch(() => undefined);
    if (this.video.readyState < 2) await new Promise<void>((r) => this.video.addEventListener('loadeddata', () => r(), { once: true }));
    await this.readLenses();
    if (this.zoomRange && zoom !== this.zoom) await this.setZoom(zoom);
  }

  private get track(): MediaStreamTrack | null { return this.stream?.getVideoTracks()[0] ?? null; }

  private async readLenses(): Promise<void> {
    const t = this.track;
    this.zoomRange = null; this.zoom = 1; this.lenses = []; this.lens = 0;
    if (!t) return;
    const caps = (t.getCapabilities?.() ?? {}) as { zoom?: { min: number; max: number } };
    if (caps.zoom && caps.zoom.max > caps.zoom.min) {
      this.zoomRange = { min: caps.zoom.min, max: caps.zoom.max };
      this.zoom = (t.getSettings() as { zoom?: number }).zoom ?? 1;
      return;
    }
    if (isIOS()) return;
    try {
      const want = this.facing === 'environment' ? /back|rear|environment/i : /front|user|face/i;
      const cams = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === 'videoinput' && want.test(d.label));
      if (cams.length > 1) {
        this.lenses = cams.map((d) => ({ id: d.deviceId, label: d.label }));
        this.lens = Math.max(0, cams.findIndex((d) => d.deviceId === t.getSettings().deviceId));
      }
    } catch { /* no list: no lens choice */ }
  }

  /** the stops to offer: zoom stops inside the range, or one per camera facing this way; none when there is no choice */
  stops(): LensStop[] {
    if (this.zoomRange) {
      const { min, max } = this.zoomRange;
      const out: LensStop[] = [];
      if (min < 0.95) out.push({ zoom: min, label: String(Math.round(min * 10) / 10).replace(/^0/, '') });
      for (const z of [1, 2, 3, 5]) if (z >= min - 1e-3 && z <= max + 1e-3) out.push({ zoom: z, label: String(z) });
      return out.length > 1 ? out : [];
    }
    return this.lenses.map((_, i) => ({ zoom: -1 - i, label: String(i + 1) }));
  }

  /** zoom to `z` (clamped to the range); returns the zoom the camera says it is at */
  async setZoom(z: number): Promise<number> {
    const t = this.track;
    if (!t || !this.zoomRange) return this.zoom;
    z = Math.min(this.zoomRange.max, Math.max(this.zoomRange.min, z));
    try {
      await t.applyConstraints({ advanced: [{ zoom: z } as MediaTrackConstraintSet] });
      this.zoom = (t.getSettings() as { zoom?: number }).zoom ?? z;
    } catch { /* refused: stays where it was */ }
    return this.zoom;
  }

  /** the next camera facing this way (no zoom): reopens on its device */
  async nextLens(i = (this.lens + 1) % Math.max(1, this.lenses.length)): Promise<void> {
    const l = this.lenses[i];
    if (!l) return;
    const list = this.lenses;
    await this.open(this.facing, 1, l.id);
    this.lenses = list; this.lens = i;
  }

  async flip(zoom = 1): Promise<void> {
    await this.open(this.facing === 'user' ? 'environment' : 'user', zoom);
  }

  /** a front camera is shown mirrored, as people expect a selfie to be */
  get mirrored(): boolean { return this.facing === 'user'; }

  /** what the camera offers, for the settings readout */
  describe(): string {
    const t = this.track;
    const z = this.zoomRange ? `zoom ${this.zoom.toFixed(2)} of ${this.zoomRange.min}–${this.zoomRange.max}` : 'no zoom';
    const l = this.lenses.length ? ` · lenses ${this.lenses.map((x, i) => (i === this.lens ? '[' + x.label + ']' : x.label)).join(', ')}` : '';
    return `${z}${l}${t?.label ? ` · ${t.label}` : ''}`;
  }

  stop(): void {
    if (!this.stream) return;
    for (const t of this.stream.getTracks()) t.stop();
    this.video.srcObject = null;
    this.stream = null;
  }
}
