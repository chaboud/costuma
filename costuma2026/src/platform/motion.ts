// The phone's gravity, for the floor (pose/ground.ts). deviceorientation's beta and gamma give up in the device's frame
// (x right, y to the top of the screen, z out of the screen): (-sin γ cos β, sin β, cos γ cos β). The rear camera's
// frame is the device's; the front camera looks the other way (x and z flip). In landscape the picture turns against
// the device by the screen's angle. That last mapping is reasoned, not measured on a phone, so ground.ts only takes
// gravity when it agrees with the people in view. iOS asks permission, inside a tap.
import * as THREE from 'three';

export class Motion {
  private up: THREE.Vector3 | null = null;
  private listening = false;

  /** call from a tap (iOS's permission prompt needs one); resolves either way */
  async enable(): Promise<boolean> {
    const DOE = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent;
    try {
      if (DOE?.requestPermission) { const r = await DOE.requestPermission(); if (r !== 'granted') return false; }
    } catch { return false; }
    if (!this.listening) {
      this.listening = true;
      window.addEventListener('deviceorientation', (e) => {
        if (e.beta === null || e.gamma === null) return;
        const b = THREE.MathUtils.degToRad(e.beta), g = THREE.MathUtils.degToRad(e.gamma);
        (this.up ??= new THREE.Vector3()).set(-Math.sin(g) * Math.cos(b), Math.sin(b), Math.cos(g) * Math.cos(b)).normalize();
      });
    }
    return true;
  }

  /** up in the camera's frame (three's axes), or null without a sensor */
  upInCamera(facing: 'user' | 'environment'): THREE.Vector3 | null {
    if (!this.up) return null;
    const angle = THREE.MathUtils.degToRad((screen.orientation?.angle ?? (window as unknown as { orientation?: number }).orientation ?? 0) as number);
    const v = this.up.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), -angle);
    if (facing === 'user') { v.x = -v.x; v.z = -v.z; }
    return v;
  }
}
