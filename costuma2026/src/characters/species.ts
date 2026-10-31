// Strollzilla's upright species (src/render/kaiju/, 93b9331) as costumes: their fields, regions, skeletons and the
// meshes build.ts hung on their bones, re-expressed as CharacterDefs. The SDF files beside this one are copies; when
// Strollzilla improves a body, copy it again.
import * as THREE from 'three';
import type { CharacterDef, Capture, Dresser } from './build';
import { HERO_BOX, HERO_SEGMENTS, heroRegion, heroSDF } from './hero';
import { WOLF_BOX, WOLF_EYES, WOLF_SEGMENTS, wolfFurLength, wolfRegion, wolfSDF } from './wolf';
import { PLUME_BOX, PLUME_EYES, PLUME_SEGMENTS, plumeFeatherLength, plumeRegion, plumeSDF } from './plume';
import { MECH_BOX, MECH_SEGMENTS, mechRegion, mechSDF } from './mech';
import { KESTREL_BOX, UNISON_BOX, kestrelRegion, kestrelSDF, unisonRegion, unisonSDF } from './robots';

/** Strollzilla's captureRule for the upright plans: a thigh keeps its own top, an arm the arm, a tail/cape what is behind. */
function capture(opts: { mech?: boolean; cape?: boolean; tail?: number | null }): Capture {
  const mech = !!opts.mech, cape = !!opts.cape, tail = opts.tail ?? null;
  return (sg, x, y, z) => {
    if (sg.name.startsWith('thigh')) return z > -1.6 && y < sg.a[1]! + (mech ? 1.4 : 0.8) && Math.abs(Math.abs(x) - Math.abs(sg.a[0]!)) < (y < sg.a[1]! + 0.3 ? (mech ? 1.45 : 1.3) : (mech ? 1.4 : 0.9));
    if (sg.name.startsWith('tail')) return tail !== null ? z < tail : cape && z < -1.55;
    if (!mech && (sg.name.startsWith('arm') || sg.name.startsWith('forearm'))) return Math.abs(x) > 2.0;
    if (mech && sg.name.startsWith('arm')) return z > -1.5;
    return true;
  };
}

const glowMat = (d: Dresser, c: number, k = 2.2) => d.std({ color: c, emissive: c, emissiveIntensity: k, roughness: 0.3 });

export const CRIMSON: CharacterDef = {
  id: 'crimson', name: 'Crimson', blurb: 'A suited hero, visor and all',
  segs: HERO_SEGMENTS,
  body: { sdf: (x, y, z) => heroSDF(x, y, z, 'crimson'), region: (x, y, z) => heroRegion(x, y, z, 'crimson'), box: HERO_BOX,
    palette: [0xc81e2a, 0xf4f4f4, 0x101014, 0xc0c4cc], surface: 'suit', capture: capture({}) },
  dress(d) {
    const glass = d.std({ color: 0x08080c, roughness: 0.08, metalness: 0.6 });
    for (const sx of [-1, 1]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.38, 0.4), glass);
      bar.rotation.set(0, sx * 0.42, sx * -0.32);
      d.at(bar, 'head', sx * 0.46, 17.12, 1.12);
    }
  },
  fit: { size: 1.08, limb: 0.7 },
};

export const VALKYRIE: CharacterDef = {
  id: 'valkyrie', name: 'Valkyrie', blurb: 'Winged helm, spear and shield',
  segs: HERO_SEGMENTS,
  body: { sdf: (x, y, z) => heroSDF(x, y, z, 'valkyrie'), region: (x, y, z) => heroRegion(x, y, z, 'valkyrie'), box: HERO_BOX,
    palette: [0x6b3fa0, 0xe0b040, 0xeeeaf4, 0xe8b896], surface: 'suit', capture: capture({ cape: true }) },
  dress(d) {
    const eye = d.std({ color: 0x1a1020, roughness: 0.2 });
    for (const sx of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 8), eye); e.scale.set(1, 1.3, 0.6); d.at(e, 'head', sx * 0.42, 16.8, 1.5); }
    const shaft = d.std({ color: 0x5a4632, roughness: 0.6 }), steel = d.std({ color: 0xd8d8e0, roughness: 0.25, metalness: 0.85 });
    const spear = new THREE.Group();
    spear.add(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 17, 10), shaft));
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.42, 2.4, 10), steel); tip.position.y = 9.6; spear.add(tip);
    d.at(spear, 'forearmR', -2.9, 11.0, 0.85);
    const shield = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.3, 28), d.std({ color: 0x6b3fa0, roughness: 0.4, metalness: 0.3 }));
    disc.rotation.z = Math.PI / 2; shield.add(disc);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.16, 8, 32), d.std({ color: 0xe0b040, roughness: 0.3, metalness: 0.7 }));
    rim.rotation.y = Math.PI / 2; shield.add(rim);
    const boss = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 10), steel); boss.position.x = 0.2; shield.add(boss);
    d.at(shield, 'forearmL', 3.38, 10.4, 0.45);
  },
  fit: { size: 1.08, limb: 0.7 },
  idle: { tail: 0.05 },
};

export const HOWLER: CharacterDef = {
  id: 'howler', name: 'Howler', blurb: 'A wolf man with amber eyes',
  segs: WOLF_SEGMENTS,
  body: { sdf: (x, y, z) => wolfSDF(x, y, z), region: wolfRegion, box: WOLF_BOX, palette: [0x77706a, 0xb8afa0, 0x34302c, 0x121010],
    capture: capture({ tail: -1.5 }), fur: { length: 0.8, density: 7, tip: 0.22 }, furLen: wolfFurLength },
  dress(d) {
    const m = glowMat(d, 0xffb020, 1.8);
    for (const sx of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 8), m); e.scale.set(1.2, 0.8, 0.8); d.at(e, 'head', sx * WOLF_EYES[0], WOLF_EYES[1], WOLF_EYES[2]); }
  },
  fit: { size: 1.1, limb: 0.6 },
  idle: { tail: 0.25 },
};

export const PLUME: CharacterDef = {
  id: 'plume', name: 'Plume', blurb: 'A big, friendly, feathered bird',
  segs: PLUME_SEGMENTS,
  body: { sdf: (x, y, z) => plumeSDF(x, y, z), region: plumeRegion, box: PLUME_BOX, palette: [0xf4b408, 0xffe7a0, 0xe8508c, 0xf08424],
    surface: 'soft', capture: capture({ tail: -2.4 }), fur: { length: 1.5, density: 1.6, tip: 0.3, feather: true }, furLen: plumeFeatherLength },
  dress(d) {
    const white = d.std({ color: 0xf8f8f4, roughness: 0.2 }), dark = d.std({ color: 0x0a0a10, roughness: 0.1 });
    for (const sx of [-1, 1]) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.52, 18, 12), white);
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 8), dark);
      p.position.set(-sx * 0.1, 0.02, 0.36); p.scale.set(1, 1.2, 0.6); e.add(p);
      d.at(e, 'head', sx * PLUME_EYES[0], PLUME_EYES[1], PLUME_EYES[2]);
    }
  },
  fit: { size: 1.12, limb: 0.5 },
  idle: { tail: 0.15 },
};

function mechDress(kind: 'bastion' | 'kestrel' | 'unison', glow: number) {
  return (d: Dresser) => {
    const g = glowMat(d, glow);
    if (kind === 'bastion') {
      for (const sx of [-1, 1]) {
        const eye = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.1), g); eye.rotation.z = sx * -0.12; d.at(eye, 'head', sx * 0.36, 17.12, 1.36);
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.36, 0.1), g); d.at(lamp, 'spine2', sx * 2.2, 13.1, 2.08);
      }
      return;
    }
    const uni = kind === 'unison';
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), g);
    canopy.scale.set(uni ? 0.95 : 0.85, uni ? 0.55 : 0.6, uni ? 0.45 : 0.35);
    d.at(canopy, 'spine2', 0, 14.35, uni ? 2.55 : 1.95);
    if (uni) for (const sx of [-1, 1]) { const e = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.1), g); e.rotation.z = sx * 0.25; d.at(e, 'head', sx * 0.32, 16.85, 1.62); }
    else d.at(new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 0.12), g), 'head', 0, 17.1, 1.42);
    if (uni) {
      const steel = d.std({ color: 0xdfe4ea, roughness: 0.2, metalness: 0.9 }), gold = d.std({ color: 0xd8a830, roughness: 0.3, metalness: 0.8 });
      const sword = new THREE.Group();
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.22, 8, 0.9), steel); blade.position.y = -4.5; sword.add(blade);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.64, 1.4, 4), steel); tip.rotation.z = Math.PI; tip.position.y = -9.2; tip.scale.set(0.35, 1, 1); sword.add(tip);
      sword.rotation.x = -0.95;
      const guard = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 3.0), gold); guard.position.y = -0.3; sword.add(guard);
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.6, 8), gold); grip.position.y = 0.6; sword.add(grip);
      d.at(sword, 'forearmR', -4.75, 8.0, 2.1);
    }
  };
}

export const BASTION: CharacterDef = {
  id: 'bastion', name: 'Bastion', blurb: 'An armoured truck that stands up',
  segs: MECH_SEGMENTS,
  body: { sdf: (x, y, z) => mechSDF(x, y, z), region: mechRegion, box: MECH_BOX, palette: [0x4a5462, 0xd9a032, 0x8fe8ff, 0x1c1f24, 0x6c9cc4, 0x141619, 0xc4c8ce],
    surface: 'armour', weights: 'rigid', capture: capture({ mech: true }) },
  dress: mechDress('bastion', 0x8fe8ff),
  fit: { size: 1.0, limb: 0.6 },
};

export const KESTREL: CharacterDef = {
  id: 'kestrel', name: 'Kestrel', blurb: 'A jet that stands up',
  segs: MECH_SEGMENTS,
  body: { sdf: (x, y, z) => kestrelSDF(x, y, z), region: kestrelRegion, box: KESTREL_BOX, palette: [0xe6e8ec, 0x56627a, 0xffb040, 0x1c1f24, 0xc8283a],
    surface: 'armour', weights: 'rigid', capture: capture({ mech: true }) },
  dress: mechDress('kestrel', 0xffb040),
  fit: { size: 1.0, limb: 0.6 },
};

export const UNISON: CharacterDef = {
  id: 'unison', name: 'Unison', blurb: 'Five machines locked into one',
  segs: MECH_SEGMENTS,
  body: { sdf: (x, y, z) => unisonSDF(x, y, z), region: unisonRegion, box: UNISON_BOX, palette: [0xeceef2, 0x26326a, 0x7fe8ff, 0x1c1f24, 0xe8742a, 0x22a89c, 0xe8c228, 0xc42a3a],
    surface: 'armour', weights: 'rigid', capture: capture({ mech: true }) },
  dress: mechDress('unison', 0x7fe8ff),
  fit: { size: 1.0, limb: 0.6 },
};
