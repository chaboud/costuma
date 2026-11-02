// The Witch: an original design. A tall crooked pointed hat with a wide drooping brim, a purple band and a gold buckle;
// long stringy dark hair from under it; a green face with a long hooked nose (a wart on it), a jutting chin, yellow
// eyes under heavy lids, a gap-toothed mouth that opens with the wearer's (a cackle); a long black dress with bell
// sleeves and a tattered hem, a purple shawl, purple-and-black striped stockings, pointed buckled boots; a broom in her
// right hand.
//
// Built from the vampire's kit (vampire.ts): the head is two rigid meshes split along the mouth (the chin between the
// mouth's corners on the jaw bone); the skirt, the shawl and the hair are skinned sheets and strands with weights
// written per vertex — the skirt's front and sides follow the thighs (and below the knee, half the shins) so a squat
// lifts it over the knees, its back hangs from the pelvis; the shawl's sides ride the upper arms; each strand of hair
// is the head's at the root and the chest's at the tip. Rigid meshes for what lies along one bone: the hat, the bell
// cuffs (forearms), the stockings and the boots' shafts (shins), the boots' feet (feet), the broom (right forearm).
//
// Frame: the hero's — 20 units tall on y = 0, +y up, +z forward, +x her own left.
import * as THREE from 'three';
import type { CharacterDef, Dresser, Field } from './build';
import { sdCapsule, sdEllipsoid, sdSphere, smin } from './sdf';
import { isoGeometry } from './skeleton';
import {
  VAMP_SEGMENTS, addBrows, addEyes, bindSkinned, clothMaterial, clothedCapture, findFace, frontZ, headMaterial, lerp,
  mergeAll, moveFace, setSkin, sheetGeometry, smax, splitHead, sstep, type FaceParts, type Influence, type V3,
} from './vampire';

// the hero's joints, as the Count's: the jaw hinges by the ear, the feet nearly level
const SEGS = VAMP_SEGMENTS;
const seg = (n: string) => SEGS.find((s) => s.name === n)!;
const KNEE_Y = 5.3;
const BOX = { min: [-3.5, 0.6, -1.5] as V3, max: [3.5, 16.6, 1.6] as V3 };

// ---------------------------------------------------------------------------------------------------------------------
// the body under the clothes' sheets: a slim bodice with a cinched waist, the hips under the skirt, bell sleeves,
// bony green hands, black-stockinged legs (the striped stockings and the boots are meshes)

function witchSDF(x: number, y: number, z: number): number {
  const ax = Math.abs(x);
  let d = 9;
  if (y > 8.7) {
    d = sdEllipsoid(x, y, z, 0, 13.25, 0.05, 1.58, 1.85, 0.98);
    d = smin(d, sdEllipsoid(ax, y, z, 0.62, 13.15, 0.5, 0.56, 0.52, 0.48), 0.35); // the bust
    d = smin(d, sdEllipsoid(x, y, z, 0, 11.35, 0.05, 1.1, 1.25, 0.78), 0.55); // a cinched waist
    d = smin(d, sdEllipsoid(x, y, z, 0, 10.0, 0.0, 1.42, 1.0, 0.95), 0.5); // the hips
    if (y > 13.4) {
      d = smin(d, sdCapsule(ax, y, z, 0, 14.95, -0.1, 2.15, 14.6, 0, 0.46, 0.5), 0.45); // the shoulders
      d = smin(d, sdCapsule(x, y, z, 0, 14.8, -0.02, 0, 16.2, 0.06, 0.42, 0.34), 0.3); // the neck, inside the head's
    }
  }
  if (y < 10.9) {
    d = smin(d, sdCapsule(ax, y, z, 1.0, 9.7, 0.0, 1.14, 5.4, 0.15, 0.62, 0.46), 0.45);
    if (y < 6.4) d = smin(d, sdCapsule(ax, y, z, 1.14, 5.4, 0.15, 1.2, 1.25, -0.08, 0.42, 0.3), 0.3);
  }
  if (ax > 1.5 && y > 7.6 && y < 15.6) {
    // the sleeves (joined to the bodice only over the shoulder), widening toward the cuff; the hands, long and bony
    const sl = sdCapsule(ax, y, z, 2.4, 14.4, 0, 2.72, 11.95, -0.05, 0.48, 0.4);
    d = y > 14.0 ? smin(d, sl, 0.35) : Math.min(d, sl);
    if (y < 12.6) {
      const a = sdCapsule(ax, y, z, 2.72, 11.95, -0.05, 2.83, 10.3, 0.25, 0.39, 0.44);
      let h = sdCapsule(ax, y, z, 2.83, 10.4, 0.25, 2.86, 9.4, 0.42, 0.17, 0.18);
      h = smin(h, sdEllipsoid(ax, y, z, 2.87, 9.05, 0.47, 0.17, 0.42, 0.33), 0.2);
      // four long fingers, a little bent, and a thumb
      for (let i = 0; i < 4; i++) {
        const fz = 0.27 + i * 0.14, fl = i === 0 || i === 3 ? 0.42 : 0.55;
        h = smin(h, sdCapsule(ax, y, z, 2.88, 8.75, fz, 2.92, 8.75 - fl, fz + 0.12, 0.075, 0.05), 0.06);
      }
      h = smin(h, sdCapsule(ax, y, z, 2.79, 9.3, 0.76, 2.72, 8.82, 0.95, 0.1, 0.07), 0.08);
      d = Math.min(d, a, h);
    }
  }
  return d;
}

/** regions: 0 the dress, 1 green skin, 2 black stockings */
const DRESS = 0, SKIN = 1, LEG = 2;
function witchRegion(x: number, y: number): number {
  const ax = Math.abs(x);
  if (ax > 2.5 && y < 10.35) return SKIN;
  if (y > 15.3 && ax < 0.6) return SKIN;
  if (y < 10.2 && ax < 2.2) return LEG;
  return DRESS;
}

// ---------------------------------------------------------------------------------------------------------------------
// the head

const HINGE_Z = -0.12;
const MOUTH_Y = 16.24, LIP_Z = 1.1;
const cutY = (z: number) => MOUTH_Y + 0.21 * (LIP_Z - z);
const JAW_W = 0.42;
const jawMask: Field = (x, y, z) => Math.max(y - cutY(z), HINGE_Z - 0.03 - z, 15.98 - 0.32 * (z + 0.15) - y, Math.abs(x) - JAW_W);
const EYE: V3 = [0.32, 17.12, 0.9];
const WART: V3 = [0.14, 16.92, 1.52];

function witchHead(x: number, y: number, z: number): number {
  if (y < 15.0) return 15.1 - y;
  const b = sdEllipsoid(x, y, z, 0, 16.95, 0.3, 1.2, 1.95, 1.8);
  if (b > 0.35) return b;
  const ax = Math.abs(x);
  let d = sdEllipsoid(x, y, z, 0, 17.42, 0.02, 0.88, 0.98, 1.05); // the cranium
  d = smin(d, sdEllipsoid(x, y, z, 0, 16.85, 0.42, 0.7, 0.95, 0.72), 0.4); // the face
  d = smin(d, sdCapsule(x, y, z, 0, 16.25, 0.72, 0, 15.78, 1.0, 0.24, 0.13), 0.3); // a long jutting chin
  d = smin(d, sdCapsule(ax, y, z, 0.62, 16.62, -0.05, 0.2, 15.92, 0.8, 0.15, 0.12), 0.3); // the jaw's line
  d = smin(d, sdEllipsoid(ax, y, z, 0.48, 16.95, 0.76, 0.28, 0.17, 0.25), 0.2); // sharp cheekbones
  d = smax(d, -sdEllipsoid(ax, y, z, 0.52, 16.48, 0.92, 0.2, 0.26, 0.18), 0.2); // hollow cheeks
  d = smin(d, sdCapsule(ax, y, z, 0.1, 17.38, 1.0, 0.6, 17.44, 0.82, 0.09, 0.07), 0.15); // the brow ridge
  d = smax(d, -sdEllipsoid(ax, y, z, EYE[0], EYE[1], 1.04, 0.23, 0.14, 0.19), 0.08); // the sockets
  // the long hooked nose: a hump on the bridge, the tip hanging down over the lip
  d = smin(d, sdCapsule(x, y, z, 0, 17.18, 1.0, 0, 16.98, 1.42, 0.085, 0.125), 0.12);
  d = smin(d, sdCapsule(x, y, z, 0, 16.98, 1.42, 0, 16.68, 1.9, 0.125, 0.09), 0.08);
  d = smin(d, sdCapsule(x, y, z, 0, 16.68, 1.9, 0, 16.5, 1.84, 0.09, 0.06), 0.06);
  d = smin(d, sdCapsule(x, y, z, 0, 16.52, 1.8, 0, 16.6, 1.18, 0.07, 0.1), 0.1); // its underside back to the lip
  d = smin(d, sdEllipsoid(ax, y, z, 0.1, 16.64, 1.3, 0.09, 0.07, 0.14), 0.08); // the nostrils' wings
  d = smin(d, sdSphere(x, y, z, WART[0], WART[1], WART[2], 0.07), 0.03); // the wart
  // thin lips
  d = smin(d, sdCapsule(ax, y, z, 0, 16.3, 1.08, 0.27, 16.33, 0.94, 0.05, 0.03), 0.05);
  d = smin(d, sdCapsule(ax, y, z, 0, 16.16, 1.05, 0.24, 16.21, 0.93, 0.05, 0.03), 0.05);
  d = smin(d, sdEllipsoid(ax, y, z, 0.86, 17.0, -0.05, 0.1, 0.3, 0.2), 0.12); // the ears
  return smin(d, sdCapsule(x, y, z, 0, 15.2, -0.06, 0, 16.5, 0.0, 0.44, 0.42), 0.3); // the neck
}

const C_SKIN = new THREE.Color(0x98c27a), C_SHADE = new THREE.Color(0x557c40), C_LIP = new THREE.Color(0x5a4a50);
const C_MOUTH = new THREE.Color(0x1c0508), C_TEETH = new THREE.Color(0xd8cc8c), C_WART = new THREE.Color(0x6a6a32);
const C_SCALP = new THREE.Color(0x161412);
function headColour(x: number, y: number, z: number, c: THREE.Color): void {
  const ax = Math.abs(x);
  const f = witchHead(x, y, z);
  if (f < -0.07) {
    // inside the mouth: crooked yellow teeth along the front, one missing
    const front = z > LIP_Z - 0.26 && ax < 0.36 && Math.abs(y - cutY(z)) < 0.13;
    const k = (x + 0.36) / 0.12, gap = Math.floor(k) === 4;
    c.copy(front && !gap && k - Math.floor(k) < 0.8 ? C_TEETH : C_MOUTH);
    if (ax > JAW_W - 0.05) c.copy(C_SHADE).multiplyScalar(0.55); // the cheeks' insides, where the chin parts from them
    return;
  }
  // the scalp under the hat, where the hair parts
  if (y > 17.62 - 0.35 * sstep(0.4, 1.3, Math.atan2(ax, z))) { c.copy(C_SCALP); return; }
  c.copy(C_SKIN);
  const eye = Math.hypot((ax - EYE[0]) / 0.36, (y - EYE[1] + 0.04) / 0.26, (z - 0.98) / 0.4);
  c.lerp(C_SHADE, 0.6 * (1 - sstep(0.7, 1.25, eye)));
  const hollow = Math.hypot((ax - 0.52) / 0.3, (y - 16.48) / 0.36);
  c.lerp(C_SHADE, 0.35 * (1 - sstep(0.4, 1.0, hollow)) * sstep(0.6, 0.9, z));
  // a little redder at the tip of the nose
  c.lerp(new THREE.Color(0x9a9a5a), 0.4 * (1 - sstep(0.1, 0.35, Math.hypot(x, y - 16.62, z - 1.88))));
  if (Math.hypot(x - WART[0], y - WART[1], z - WART[2]) < 0.1) c.copy(C_WART);
  if (z > 0.9 && ax < 0.28 && Math.abs(y - cutY(z)) < 0.05) c.copy(C_LIP);
}

// ---------------------------------------------------------------------------------------------------------------------
// the skirt, the shawl, the bell cuffs

const SKIRT_TOP = 11.2, HEM = 4.45;
let seed = 11;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
/** a tattered edge: `n` points round, each its own depth (a triangle wave through jittered peaks), 0..1 */
function tatters(n: number, s: number): (u: number) => number {
  seed = s;
  const depth = Array.from({ length: n }, () => 0.45 + 0.55 * rnd());
  return (u: number) => {
    const q = ((u + 1) / 2) * n, i = Math.floor(q) % n, f = q - Math.floor(q);
    return depth[i]! * (1 - Math.abs(f * 2 - 1));
  };
}
const SKIRT_TEETH = tatters(22, 5);

/** the skirt's radius across (rx) and front to back (rz) at height y: tight at the waist, over the hips, flaring */
function skirtR(y: number): [number, number] {
  if (y > 10.0) { const t = sstep(SKIRT_TOP, 10.0, y); return [lerp(1.06, 1.75, t), lerp(0.74, 1.2, t)]; }
  return [1.75 + 0.12 * (10.0 - y), 1.2 + 0.16 * (10.0 - y)];
}
/** the skirt: θ from the front (u = 0) round to the back (u = ±1, its seam) */
function skirtAt(u: number, v: number, o: THREE.Vector3): void {
  const th = u * Math.PI;
  const y = lerp(SKIRT_TOP, HEM - 0.85 * SKIRT_TEETH(u) + 0.15 * Math.cos(th), v);
  const [rx, rz] = skirtR(y);
  const s = sstep(10.0, HEM, y);
  const fold = 1 + (0.012 + 0.055 * s) * Math.sin(th * 9 + 0.7) * sstep(10.4, 9.6, y);
  o.set(rx * fold * Math.sin(th), y, 0.02 - 0.12 * s + rz * fold * Math.cos(th));
}
/** front and sides with the thighs (split by the side they are on), below the knee half with the shins; the back with the pelvis */
function skirtWeights(x: number, y: number, z: number): Influence[] {
  const t = Math.min(1, Math.max(0, (SKIRT_TOP - y) / (SKIRT_TOP - HEM)));
  const front = Math.max(0, z / Math.max(0.5, Math.hypot(x, z)));
  const leg = sstep(0.05, 0.35, t) * (0.3 + 0.7 * front) * 0.92;
  const kL = sstep(-0.7, 0.7, x), shin = 0.5 * sstep(KNEE_Y + 0.6, KNEE_Y - 0.9, y);
  return [['pelvis', 1 - leg], ['thighL', leg * kL * (1 - shin)], ['shinL', leg * kL * shin], ['thighR', leg * (1 - kL) * (1 - shin)], ['shinR', leg * (1 - kL) * shin]];
}

const SHAWL_V1 = 0.5;
const SHAWL_TEETH = tatters(16, 9);
const yNeck = (c: number) => 15.48 - 0.2 * (1 - c) / 2;
const yShoulder = (c: number) => 14.62 - 0.3 * Math.max(0, c) ** 2;
/** the shawl's hem (u: 0 the back, ±1 the front ends): a point down the back, up over the arms, the ends on the chest */
const shawlHem = (u: number) => { const a = Math.abs(u); return a < 0.55 ? lerp(10.9, 12.6, sstep(0, 0.55, a)) : lerp(12.6, 11.9, sstep(0.55, 1, a)); };
/** the shawl: round the neck (θ from the back), over the shoulders, hanging in a point behind and two ends in front */
function shawlAt(u: number, v: number, o: THREE.Vector3): void {
  const th = u * 2.72, c = Math.cos(th);
  let rx: number, rz: number, zc: number, y: number;
  if (v <= SHAWL_V1) {
    const t = v / SHAWL_V1, yN = yNeck(c), yS = yShoulder(c), e = lerp(2, 3, Math.abs(Math.sin(th)));
    y = yS + (yN - yS) * Math.pow(Math.max(0, 1 - t ** e), 1 / e);
    rx = lerp(0.68, 2.92, t); rz = lerp(0.68, 1.42, t); zc = lerp(0.0, -0.08, t);
    o.set(rx * Math.sin(th), y, zc - rz * c);
    return;
  }
  const s = (v - SHAWL_V1) / (1 - SHAWL_V1);
  y = lerp(yShoulder(c), shawlHem(u) - 0.55 * SHAWL_TEETH(u), s);
  rx = 2.92 + 0.32 * Math.sqrt(s); rz = 1.42 + 0.22 * Math.sqrt(s); zc = -0.08;
  // the front ends come in to the knot and hang crossed below it
  const fr = sstep(0.62, 1.0, Math.abs(u)) * sstep(0, 0.55, s);
  o.set(rx * Math.sin(th) * lerp(1, 0.12, fr), y, zc - rz * c + 0.12 * fr);
}
function shawlWeights(x: number, _y: number, _z: number, u: number, v: number): Influence[] {
  const au = Math.abs(u);
  const w = sstep(0.28, 0.5, au) * (1 - sstep(0.72, 0.9, au)) * (v <= SHAWL_V1 ? sstep(0.4, 1, v / SHAWL_V1) : 1) * 0.85;
  return [['spine2', 1 - w], [x >= 0 ? 'armL' : 'armR', w]];
}

/** a bell cuff round the left forearm, flaring past the wrist to a tattered edge (model units, rigid on the forearm) */
function cuffGeometry(): THREE.BufferGeometry {
  const a = new THREE.Vector3(...seg('forearmL').a), b = new THREE.Vector3(...seg('forearmL').b);
  const dir = b.clone().sub(a), L = dir.length();
  dir.normalize();
  const X = new THREE.Vector3(1, 0, 0).addScaledVector(dir, -dir.x).normalize(), Z = new THREE.Vector3().crossVectors(X, dir);
  const teeth = tatters(9, 3);
  return sheetGeometry(36, 8, (u, v, o) => {
    const th = u * Math.PI;
    const s = lerp(0.5, 1.12 + 0.2 * teeth(u), v) * L, r = lerp(0.44, 0.95, v ** 1.4);
    o.copy(a).addScaledVector(dir, s).addScaledVector(X, Math.sin(th) * r).addScaledVector(Z, Math.cos(th) * r);
  }, true);
}

// ---------------------------------------------------------------------------------------------------------------------
// the hair: stringy strands from under the hat's brim, hanging straight past the face, lying on the shoulders

/** the combined rest body (head and torso) the hair hangs clear of */
const restBody = (x: number, y: number, z: number) => Math.min(witchHead(x, y, z), witchSDF(x, y, z));
/** how far out from the head's axis (0, y, 0) the body reaches along the direction (sin φ, cos φ), by bisection */
function reachAt(phi: number, y: number): number {
  let lo = 0, hi = 3.2;
  if (restBody(Math.sin(phi) * hi, y, Math.cos(phi) * hi) < 0) return hi;
  // find the outermost surface: march in from outside, by the field's own distance (it never overshoots by much)
  for (let r = hi, i = 0; r > 0 && i < 60; i++) {
    const f = restBody(Math.sin(phi) * r, y, Math.cos(phi) * r);
    if (f < 0) { lo = r; hi = r + 0.1; break; }
    r -= Math.max(0.03, Math.min(0.1, f * 0.8));
  }
  for (let i = 0; i < 12; i++) { const m = (lo + hi) / 2; if (restBody(Math.sin(phi) * m, y, Math.cos(phi) * m) < 0) lo = m; else hi = m; }
  return lo;
}

function hairGeometry(): THREE.BufferGeometry {
  seed = 23;
  const parts: THREE.BufferGeometry[] = [];
  const dark = [new THREE.Color(0x1c1a17), new THREE.Color(0x26221d), new THREE.Color(0x121110), new THREE.Color(0x3a3630)];
  const N = 64;
  for (let i = 0; i < N; i++) {
    // round the head from beside the face (φ 0.42) to the back (π), both sides
    const sx = i % 2 === 0 ? 1 : -1;
    const phi = sx * (0.62 + (Math.PI - 0.62) * ((Math.floor(i / 2) + rnd() * 0.6) / (N / 2)));
    const back = Math.abs(phi) / Math.PI;
    const y0 = 17.72 - 0.25 * back + rnd() * 0.08;
    const yEnd = lerp(15.0, 12.4, back ** 0.8) - rnd() * 0.6;
    const pts: THREE.Vector3[] = [];
    let R = reachAt(phi, y0) + 0.06;
    const n = 12, w0 = rnd() * 6.28, w1 = 0.5 + rnd() * 0.8;
    for (let k = 0; k <= n; k++) {
      const t = k / n, y = lerp(y0, yEnd, t);
      // hang straight down, never back in toward the neck; clear of the shoulders and the shawl over them (it stands
      // further off the back than off the shoulders' tops)
      const clear = y > 15.7 ? 0.08 : lerp(0.08, lerp(0.48, 0.8, sstep(1.9, 2.6, Math.abs(phi))), sstep(15.7, 15.0, y));
      R = Math.max(R, reachAt(phi, y) + clear);
      const wig = 0.07 * Math.sin(t * 9 * w1 + w0) * t;
      const ph = phi + wig / Math.max(0.8, R);
      pts.push(new THREE.Vector3(Math.sin(ph) * R, y, Math.cos(ph) * R - 0.02));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const g = new THREE.TubeGeometry(curve, 14, 0.07, 4, false);
    // taper: each ring toward the tip
    const p = g.attributes.position!, rings = 15, per = 5;
    for (let r = 0; r < rings; r++) {
      const c = curve.getPointAt(r / (rings - 1)), k = lerp(1, 0.3, r / (rings - 1)) * (0.8 + 0.4 * rnd());
      for (let j = 0; j < per; j++) {
        const q = r * per + j;
        p.setXYZ(q, c.x + (p.getX(q) - c.x) * k, c.y + (p.getY(q) - c.y) * k, c.z + (p.getZ(q) - c.z) * k);
      }
    }
    g.computeVertexNormals();
    const col = dark[Math.floor(rnd() * dark.length)]!, cs = new Float32Array(p.count * 3);
    for (let q = 0; q < p.count; q++) { cs[q * 3] = col.r; cs[q * 3 + 1] = col.g; cs[q * 3 + 2] = col.b; }
    g.setAttribute('color', new THREE.BufferAttribute(cs, 3));
    g.deleteAttribute('uv');
    parts.push(g);
  }
  return mergeAll(parts);
}

// ---------------------------------------------------------------------------------------------------------------------
// the hat, the boots, the stockings, the broom

/** the hat about its base's centre (y 0): a wide wavy brim, a tall crown that bends back and flops over, a band, a buckle */
function addHat(d: Dresser): void {
  const felt = d.std({ color: 0x141217, roughness: 0.88, side: THREE.DoubleSide });
  const hat = new THREE.Group();
  hat.name = 'witch-hat';
  const brim = sheetGeometry(64, 8, (u, v, o) => {
    const th = u * Math.PI, r = lerp(0.95, 2.75, v);
    o.set(r * Math.sin(th), -0.08 * v - 0.2 * v * v + 0.12 * Math.sin(3 * th + 1) * v * v - 0.1 * Math.max(0, Math.cos(th)) * v * v, r * Math.cos(th));
  });
  hat.add(new THREE.Mesh(brim, felt));
  const curve = new THREE.CatmullRomCurve3([[0, 0, 0], [0, 1.3, -0.05], [0.05, 2.5, -0.22], [0.22, 3.35, -0.6], [0.5, 3.8, -1.15], [0.82, 3.72, -1.7], [1.0, 3.45, -2.0]].map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  const TS = 44, RS = 24;
  const crown = new THREE.TubeGeometry(curve, TS, 1, RS, false);
  const p = crown.attributes.position!;
  for (let r = 0; r <= TS; r++) {
    const t = r / TS, c = curve.getPointAt(t);
    // tapering to the tip, with creases where it bends
    const k = 1.08 * Math.pow(1 - t, 0.95) * (1 + 0.05 * Math.sin(t * 28) * (1 - t) * sstep(0.1, 0.2, t)) + 0.015;
    for (let j = 0; j <= RS; j++) {
      const q = r * (RS + 1) + j;
      p.setXYZ(q, c.x + (p.getX(q) - c.x) * k, c.y + (p.getY(q) - c.y) * k, c.z + (p.getZ(q) - c.z) * k);
    }
  }
  crown.computeVertexNormals();
  hat.add(new THREE.Mesh(crown, felt));
  // the band, purple, and its buckle, gold
  const band = new THREE.LatheGeometry([new THREE.Vector2(1.13, 0.04), new THREE.Vector2(1.11, 0.24), new THREE.Vector2(1.09, 0.44)], 40);
  hat.add(new THREE.Mesh(band, d.std({ color: 0x5a2a7a, roughness: 0.6, side: THREE.DoubleSide })));
  const gold = d.std({ color: 0xd8a838, roughness: 0.3, metalness: 0.9 });
  const buckle = mergeAll([
    new THREE.BoxGeometry(0.56, 0.08, 0.06).translate(0, 0.21, 0), new THREE.BoxGeometry(0.56, 0.08, 0.06).translate(0, -0.21, 0),
    new THREE.BoxGeometry(0.08, 0.5, 0.06).translate(0.24, 0, 0), new THREE.BoxGeometry(0.08, 0.5, 0.06).translate(-0.24, 0, 0),
    new THREE.BoxGeometry(0.05, 0.42, 0.05).translate(0, 0, 0.02),
  ]);
  const bk = new THREE.Mesh(buckle, gold);
  bk.position.set(0, 0.24, 1.13);
  bk.rotation.x = -0.03;
  hat.add(bk);
  // crooked: tipped back and to her left
  hat.rotation.set(-0.1, 0.15, 0.1);
  d.at(hat, 'head', 0.04, 17.86, -0.02);
}

/** a boot's foot, about the foot's centre line (x 0): a long pointed toe curling up, a small heel, the ankle */
function bootD(x: number, y: number, z: number): number {
  let d = Math.max(sdEllipsoid(x, y, z, 0, 0.42, 0.45, 0.46, 0.42, 1.0), -y);
  d = smin(d, Math.max(sdCapsule(x, y, z, 0, 0.36, 0.8, 0, 0.36, 2.0, 0.36, 0.15), -y), 0.25);
  d = smin(d, sdCapsule(x, y, z, 0, 0.36, 2.0, 0, 0.82, 2.55, 0.15, 0.04), 0.12);
  d = smin(d, sdCapsule(x, y, z, 0, 0.8, 0.0, 0, 1.75, -0.08, 0.44, 0.42), 0.25);
  d = Math.min(d, Math.max(Math.abs(x) - 0.2, Math.abs(y - 0.18) - 0.18, Math.abs(z + 0.28) - 0.18)); // the heel
  return d;
}

/** a striped stocking along a shin, ankle to knee: rows of rings, two at each stripe's edge so the stripes are crisp */
function stockingGeometry(sx: number): THREE.BufferGeometry {
  const knee = new THREE.Vector3(sx * 1.2, 5.75, 0.23), ankle = new THREE.Vector3(...seg('shinL').b);
  ankle.x = sx * 1.2;
  const L = knee.distanceTo(ankle), dir = knee.clone().sub(ankle).normalize();
  const rows: [number, number, number][] = []; // along, radius, stripe 0/1
  const radius = (s: number) => 0.38 + 0.13 * sstep(0, 0.45, s / L) - 0.03 * sstep(0.6, 1, s / L);
  const W = 0.34;
  for (let k = 0; k * W < L; k++) {
    const a = k * W, b = Math.min(L, (k + 1) * W);
    rows.push([a + 0.002, radius(a), k % 2], [(a + b) / 2, radius((a + b) / 2), k % 2], [b - 0.002, radius(b), k % 2]);
  }
  const RS = 20, pos: number[] = [], col: number[] = [], idx: number[] = [];
  const X = new THREE.Vector3(1, 0, 0).addScaledVector(dir, -dir.x).normalize(), Z = new THREE.Vector3().crossVectors(X, dir);
  const purple = new THREE.Color(0x6a2c9e), black = new THREE.Color(0x141018);
  rows.forEach(([s, r, k], i) => {
    const c = k ? black : purple;
    for (let j = 0; j <= RS; j++) {
      const th = (j / RS) * Math.PI * 2;
      const q = ankle.clone().addScaledVector(dir, s).addScaledVector(X, Math.cos(th) * r).addScaledVector(Z, Math.sin(th) * r);
      pos.push(q.x, q.y, q.z); col.push(c.r, c.g, c.b);
      if (i > 0 && j < RS) { const a = (i - 1) * (RS + 1) + j, b = i * (RS + 1) + j; idx.push(a, b, a + 1, a + 1, b, b + 1); }
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** the broom, in model units where her right hand holds it: a gnarled handle through the fist, straw bound at its foot */
function addBroom(d: Dresser): void {
  seed = 41;
  const grip = new THREE.Vector3(-2.93, 9.0, 0.62);
  const lean = new THREE.Vector3(-0.07, 1, 0.05).normalize();
  const along = (s: number) => grip.clone().addScaledVector(lean, s);
  const handlePts: THREE.Vector3[] = [];
  for (let i = 0; i <= 8; i++) {
    const s = lerp(3.4, -6.2, i / 8), q = along(s);
    q.x += 0.06 * Math.sin(i * 2.1); q.z += 0.05 * Math.cos(i * 1.7);
    handlePts.push(q);
  }
  const handle = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(handlePts), 40, 0.12, 8, false);
  const wood = d.std({ color: 0x5a3e24, roughness: 0.75 });
  const broom = new THREE.Group();
  broom.add(new THREE.Mesh(handle, wood));
  broom.add(new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8).translate(handlePts[0]!.x, handlePts[0]!.y, handlePts[0]!.z), wood));
  // the bristles: straws from the binding, fanning down and out to the ground
  const bind = along(-6.0);
  const straws: THREE.BufferGeometry[] = [];
  const tones = [0xd8b45c, 0xc49a3c, 0xe8cc7c, 0xa8823a].map((h) => new THREE.Color(h));
  for (let i = 0; i < 150; i++) {
    const a = rnd() * Math.PI * 2, r0 = 0.26 * Math.sqrt(rnd());
    const o = bind.clone().add(new THREE.Vector3(Math.cos(a) * r0, 0.3 - rnd() * 0.3, Math.sin(a) * r0));
    const spread = 0.12 + 0.75 * (r0 / 0.26);
    const tip = new THREE.Vector3(o.x + Math.cos(a) * spread, Math.max(0.05, o.y - 2.4 - rnd() * 0.4), o.z + Math.sin(a) * spread);
    // a cone's base at the binding, its point at the ground: built point-up from the tip, turned to aim at the binding
    const len = o.distanceTo(tip);
    const geo = new THREE.ConeGeometry(0.045, len, 3, 1).rotateX(Math.PI).translate(0, len / 2, 0);
    geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), o.clone().sub(tip).normalize())).translate(tip.x, tip.y, tip.z);
    const c = tones[Math.floor(rnd() * tones.length)]!, n = geo.attributes.position!.count, cs = new Float32Array(n * 3);
    for (let q = 0; q < n; q++) { cs[q * 3] = c.r; cs[q * 3 + 1] = c.g; cs[q * 3 + 2] = c.b; }
    geo.setAttribute('color', new THREE.BufferAttribute(cs, 3));
    straws.push(geo);
  }
  broom.add(new THREE.Mesh(mergeAll(straws), d.std({ color: 0xffffff, vertexColors: true, roughness: 0.8 })));
  // two cord bindings round the bundle's top
  const cord = d.std({ color: 0x6a2c9e, roughness: 0.7 });
  for (const [s, r] of [[-5.85, 0.33], [-6.15, 0.38]] as const) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.06, 6, 20), cord);
    t.position.copy(along(s));
    t.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), lean);
    broom.add(t);
  }
  d.at(broom, 'forearmR', 0, 0, 0);
}

// ---------------------------------------------------------------------------------------------------------------------

function dress(d: Dresser): void {
  // --- the head: split along the mouth; the hat; eyes under heavy lids; arched brows
  splitHead(d, witchHead, jawMask,
    { min: [-1.05, 15.05, -1.2], max: [1.05, 18.5, 2.05] },
    { min: [-0.5, 15.5, -0.2], max: [0.5, 16.7, 1.3] }, 56, 30,
    headColour, headMaterial('witch-head-v1'), 'witch');
  addEyes(d, EYE, 0.12, 0xc8c418, 0.3, 'witch-eye', { look: [0.08, 0.05], lid: 0x6a9452, lidRest: 0.26, white: 0xe2dcc0, irisFrac: 0.6 });
  const browAt = (ax: number, lift: number): V3 => { const yy = 17.4 + lift; return [ax, yy, frontZ(witchHead, ax, yy, 0.3, 1.6) + 0.025]; };
  addBrows(d, browAt(0.1, 0.06), browAt(0.58, 0.2), 0.06, 0.03, 0x24201c, 'witch-brow');
  addHat(d);

  // --- the hair: strands, each the head's at the root and the chest's toward the tip
  const hair = hairGeometry();
  setSkin(d, hair, (_x, y) => { const h = sstep(15.7, 16.6, y); return [['head', h], ['neck', (1 - h) * 0.3], ['spine2', (1 - h) * 0.7]]; });
  bindSkinned(d, hair, d.std({ color: 0xffffff, vertexColors: true, roughness: 0.5 }), 'witch-hair');

  // --- the skirt and the shawl, skinned sheets
  const skirt = sheetGeometry(110, 40, skirtAt, true, true);
  setSkin(d, skirt, skirtWeights);
  bindSkinned(d, skirt, clothMaterial(0x16141a, 0x2a1e30, 0.7, 0.12, 'witch-cloth-v1'), 'witch-skirt');
  const shawl = sheetGeometry(72, 22, shawlAt);
  setSkin(d, shawl, shawlWeights);
  bindSkinned(d, shawl, clothMaterial(0x5c2a82, 0x2e1642, 0.85, 0.15, 'witch-cloth-v1'), 'witch-shawl');
  // the shawl's ends knotted at the breastbone
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10).scale(1.3, 0.9, 0.8), d.std({ color: 0x5c2a82, roughness: 0.85 }));
  d.at(knot, 'spine2', 0, 13.25, frontZ(witchSDF, 0, 13.25) + 0.36);

  // --- a sash at the waist, purple, a gold buckle
  const sash = new THREE.Mesh(new THREE.TorusGeometry(1, 0.12, 8, 40).rotateX(Math.PI / 2).scale(1.13, 1.6, 0.82), d.std({ color: 0x4a2266, roughness: 0.7 }));
  d.at(sash, 'spine1', 0, 11.12, 0.05);
  const gold = d.std({ color: 0xd8a838, roughness: 0.3, metalness: 0.9 });
  const sb = mergeAll([
    new THREE.BoxGeometry(0.42, 0.07, 0.06).translate(0, 0.17, 0), new THREE.BoxGeometry(0.42, 0.07, 0.06).translate(0, -0.17, 0),
    new THREE.BoxGeometry(0.07, 0.4, 0.06).translate(0.18, 0, 0), new THREE.BoxGeometry(0.07, 0.4, 0.06).translate(-0.18, 0, 0),
  ]);
  d.at(new THREE.Mesh(sb, gold), 'spine1', 0, 11.12, frontZ(witchSDF, 0, 11.12) + 0.17);

  // --- bell cuffs, tattered, on the forearms
  const cuff = cuffGeometry(), cuffMat = clothMaterial(0x16141a, 0x2a1e30, 0.7, 0.12, 'witch-cloth-v1');
  d.at(new THREE.Mesh(cuff, cuffMat), 'forearmL', 0, 0, 0);
  const cuffR = new THREE.Mesh(cuff, cuffMat);
  cuffR.scale.x = -1;
  d.at(cuffR, 'forearmR', 0, 0, 0);

  // --- striped stockings, and the boots: shafts on the shins, pointed feet with a buckle on the feet
  const sock = d.std({ color: 0xffffff, vertexColors: true, roughness: 0.8 });
  const leather = d.std({ color: 0x1c1618, roughness: 0.38 });
  const bootGeo = isoGeometry(bootD, { min: [-0.6, -0.05, -0.65], max: [0.6, 1.95, 2.75] }, 34, undefined, 16000);
  const shaft = new THREE.LatheGeometry([new THREE.Vector2(0.43, 0), new THREE.Vector2(0.47, 1.0), new THREE.Vector2(0.52, 1.35), new THREE.Vector2(0.58, 1.42), new THREE.Vector2(0.56, 1.62), new THREE.Vector2(0.46, 1.6)], 24);
  for (const sx of [1, -1]) {
    const side = sx > 0 ? 'L' : 'R';
    d.at(new THREE.Mesh(stockingGeometry(sx), sock), 'shin' + side, 0, 0, 0);
    const ankle = seg('shin' + side).b;
    const g = new THREE.Group();
    g.add(new THREE.Mesh(shaft, leather));
    g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...seg('shin' + side).a).sub(new THREE.Vector3(...ankle)).normalize());
    d.at(g, 'shin' + side, ankle[0], ankle[1] + 0.25, ankle[2]);
    d.at(new THREE.Mesh(bootGeo, leather), 'foot' + side, sx * 1.2, 0, 0);
    const bb = new THREE.Mesh(sb, gold);
    bb.scale.setScalar(0.8);
    bb.rotation.x = -0.85;
    d.at(bb, 'foot' + side, sx * 1.2, 0.98, 0.95);
  }

  addBroom(d);
}

const FOUND = new WeakMap<THREE.Object3D, FaceParts>();

export const WITCH: CharacterDef = {
  id: 'witch', name: 'Witch', blurb: 'A green-faced witch with a crooked hat and a broom',
  segs: SEGS,
  body: {
    sdf: witchSDF, region: witchRegion, box: BOX,
    palette: [0x18161c, 0x98c27a, 0x121016],
    surface: 'soft', weights: 'sharp',
    capture: clothedCapture((y) => (y < 12 ? 2.1 : y < 14.1 ? 1.9 : 2.0), 15.85),
  },
  dress,
  fit: { size: 1.06, limb: 0.7 },
  // a cackle: the gap-toothed mouth opens and breathes green and violet sparkles
  face: { jaw: 0.45, eyes: [[EYE[0], EYE[1], EYE[2] + 0.12, 0.16], [-EYE[0], EYE[1], EYE[2] + 0.12, 0.16]],
    breath: { colors: [0x7cff4a, 0xb060ff, 0xd8ff8a, 0x8a2cff], rate: 1.2, speed: 0.8 } },
  res: 84,
  // the skirt swings from the hips, the shawl's points from the chest, the hair's tips from the chest (cloth.ts)
  cloth: [
    { meshes: ['witch-skirt'], bone: 'pelvis', cx: 0, cz: -0.1, top: 10.0, hem: HEM, rx: 2.42, rz: 2.09, hz: 1.3, damping: 0.25, drag: 0.8, max: 1.0, lift: 0.3 },
    { meshes: ['witch-shawl'], bone: 'spine2', cx: 0, cz: -0.08, top: 14.2, hem: 11.2, rx: 3.2, rz: 1.6, hz: 1.6, damping: 0.3, drag: 0.6, max: 0.45, lift: 0.3 },
    { meshes: ['witch-hair'], bone: 'spine2', cx: 0, cz: 0, top: 15.6, hem: 12.6, rx: 1.4, rz: 1.3, hz: 1.8, damping: 0.25, drag: 0.6, max: 0.5, lift: 0.25 },
  ],
  tick(root, t, face) {
    let e = FOUND.get(root);
    if (!e) { e = findFace(root, 'witch-eye', 'witch-brow', ['witch-eye-iris']); FOUND.set(root, e); }
    moveFace(e, face, 0.14);
    // a gleam in the eye, brighter as she cackles
    const k = 0.28 + 0.08 * Math.sin(t * 2.3) + 0.9 * (face?.jaw ?? 0);
    for (const m of e.glow) m.emissiveIntensity = k;
  },
};
