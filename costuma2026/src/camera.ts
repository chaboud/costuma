// Camera capture with costuma 2024's (and PewPew's) iOS rules: always facingMode, never deviceId (iOS Safari changes
// deviceIds between enumerations); the <video> is autoplay + muted + playsinline; wait 100 ms after stopping tracks
// before opening again.
export type Facing = 'user' | 'environment';

export const isIOS = (): boolean => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
export const isMobile = (): boolean => isIOS() || /Android|Mobile/i.test(navigator.userAgent);

export class Camera {
  stream: MediaStream | null = null;
  facing: Facing;
  constructor(readonly video: HTMLVideoElement, facing?: Facing) {
    this.facing = facing ?? (isMobile() ? 'environment' : 'user');
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
  }

  async open(facing = this.facing): Promise<void> {
    const had = !!this.stream;
    this.stop();
    if (had) await new Promise((r) => setTimeout(r, 100));
    const video: MediaTrackConstraints = { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } };
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: false, video });
    this.facing = facing;
    this.video.srcObject = this.stream;
    await this.video.play().catch(() => undefined);
    if (this.video.readyState < 2) await new Promise<void>((r) => this.video.addEventListener('loadeddata', () => r(), { once: true }));
  }

  async flip(): Promise<void> {
    await this.open(this.facing === 'user' ? 'environment' : 'user');
  }

  /** a front camera is shown mirrored, as people expect a selfie to be */
  get mirrored(): boolean { return this.facing === 'user'; }

  stop(): void {
    if (!this.stream) return;
    for (const t of this.stream.getTracks()) t.stop();
    this.video.srcObject = null;
    this.stream = null;
  }
}
