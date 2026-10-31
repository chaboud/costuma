// The music, if the player lets the page listen: the bass's energy against its own running average, an onset when it
// jumps (a kick drum), an envelope that falls off fast. The party's visuals kick on it. The microphone opens with echo
// cancellation, noise suppression and gain control off (PewPew: they flatten exactly the transients we want).
export class Beat {
  /** 0..1, 1 on a kick, falling off over ~0.2 s */
  env = 0;
  /** the bass's level, 0..1, smoothed */
  level = 0;
  stream: MediaStream | null = null;
  private ctx: AudioContext | null = null;
  private an: AnalyserNode | null = null;
  private buf = new Uint8Array(0);
  private avg = 0;
  private last = 0;

  get on(): boolean { return !!this.an; }

  async start(): Promise<void> {
    if (this.an) return;
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    await this.ctx.resume();
    const src = this.ctx.createMediaStreamSource(this.stream);
    this.an = this.ctx.createAnalyser();
    this.an.fftSize = 1024;
    this.an.smoothingTimeConstant = 0;
    src.connect(this.an);
    this.buf = new Uint8Array(this.an.frequencyBinCount);
  }

  stop(): void {
    for (const t of this.stream?.getTracks() ?? []) t.stop();
    void this.ctx?.close();
    this.stream = null; this.ctx = null; this.an = null;
    this.env = 0; this.level = 0;
  }

  /** `dt` seconds since the last call, `now` ms */
  update(dt: number, now: number): void {
    this.env *= Math.exp(-dt / 0.18);
    if (!this.an || !this.ctx) return;
    this.an.getByteFrequencyData(this.buf);
    // the kick's band: ~40–160 Hz
    const hz = this.ctx.sampleRate / this.an.fftSize;
    const lo = Math.max(1, Math.floor(40 / hz)), hi = Math.max(lo + 1, Math.ceil(160 / hz));
    let s = 0;
    for (let i = lo; i <= hi; i++) s += this.buf[i]!;
    const bass = s / ((hi - lo + 1) * 255);
    this.level += (bass - this.level) * Math.min(1, dt / 0.1);
    this.avg += (bass - this.avg) * Math.min(1, dt / 1.2);
    if (bass > this.avg * 1.3 + 0.04 && bass > 0.22 && now - this.last > 260) { this.env = 1; this.last = now; }
  }
}
