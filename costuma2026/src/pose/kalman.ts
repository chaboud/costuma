// Constant-velocity Kalman filters, one per coordinate, in flat arrays: position and velocity with their covariance.
// Against the EMA the house used, the filter predicts: a joint moving steadily is followed where it is going, not
// where it was, so smoothing as hard costs far less lag (founder, 2026-11-01: "kalman filters are commonly used to
// smooth with minimal lag"). And an innovation gate: a reading too far from the prediction for the filter's own
// uncertainty is believed less in proportion (its noise inflated), so a one-frame glitch barely moves the costume,
// while a real fast move — whose prediction error persists and grows the uncertainty — is caught up with in a frame or
// two.
export class CVBank {
  readonly x: Float64Array;
  readonly v: Float64Array;
  private readonly p00: Float64Array;
  private readonly p01: Float64Array;
  private readonly p11: Float64Array;

  constructor(readonly n: number) {
    this.x = new Float64Array(n); this.v = new Float64Array(n);
    this.p00 = new Float64Array(n); this.p01 = new Float64Array(n); this.p11 = new Float64Array(n);
  }

  /** start coordinate i at z, still, as uncertain as one reading (`r`, a variance) */
  reset(i: number, z: number, r: number): void {
    this.x[i] = z; this.v[i] = 0;
    this.p00[i] = r; this.p01[i] = 0; this.p11[i] = r * 100;
  }

  /** move coordinate i by d (the whole person shifted: a hand-held camera), keeping its velocity and uncertainty */
  shift(i: number, d: number): void { this.x[i] = this.x[i]! + d; }

  /**
   * One step for coordinate i: predict `dt` seconds on (process noise `q`, the acceleration's spectral density, units²/s³),
   * then take reading z (noise variance `r`). `gate`: past this many standard deviations of surprise the reading's noise
   * is inflated by the square of how far past. Returns the filtered position.
   */
  step(i: number, z: number, dt: number, q: number, r: number, gate = 3): number {
    // predict
    let x = this.x[i]! + this.v[i]! * dt, v = this.v[i]!;
    let p00 = this.p00[i]! + dt * (2 * this.p01[i]! + dt * this.p11[i]!) + (q * dt * dt * dt) / 3;
    let p01 = this.p01[i]! + dt * this.p11[i]! + (q * dt * dt) / 2;
    let p11 = this.p11[i]! + q * dt;
    // update, gated
    const y = z - x;
    let S = p00 + r;
    const d2 = (y * y) / S;
    if (d2 > gate * gate) S = p00 + r * (d2 / (gate * gate));
    const k0 = p00 / S, k1 = p01 / S;
    x += k0 * y; v += k1 * y;
    p11 -= k1 * p01; p01 -= k0 * p01; p00 -= k0 * p00;
    this.x[i] = x; this.v[i] = v; this.p00[i] = p00; this.p01[i] = p01; this.p11[i] = p11;
    return x;
  }
}
