// The turntable: one character, one demo pose, one view, under a neutral studio light. The modelling loop's eye
// (scripts/lab-shots.mjs shoots it). ?c=<id> ?pose=rest|tpose|wave|cheer|squat|turn ?yaw=<deg> ?pitch=<deg> ?res=<n>
// ?w= ?h= ?zoom=<k> ?focus=head|body ?bg=<hex> ?thumb=1 (transparent, framed for the picker)
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ROSTER } from './characters/roster';
import { buildCharacter, parseFace } from './characters/build';
import { Rig, demoPose } from './pose/rig';

const q = new URLSearchParams(location.search);
const id = q.get('c') ?? ROSTER[0]!.id;
const def = ROSTER.find((d) => d.id === id) ?? ROSTER[0]!;
const W = Number(q.get('w') ?? 512), H = Number(q.get('h') ?? 768);
const thumb = q.get('thumb') === '1';
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: thumb, preserveDrawingBuffer: true });
renderer.setSize(W, H);
renderer.setPixelRatio(1);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
if (!thumb) scene.background = new THREE.Color(q.get('bg') ? Number('0x' + q.get('bg')) : 0x3a3f48);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.8;
const key = new THREE.DirectionalLight(0xffffff, 1.6);
key.position.set(2, 4, 3);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
Object.assign(key.shadow.camera, { left: -1.5, right: 1.5, top: 2.5, bottom: -0.5, near: 0.1, far: 12 });
scene.add(key);
if (!thumb) {
  const floor = new THREE.Mesh(new THREE.CircleGeometry(2.2, 48), new THREE.MeshStandardMaterial({ color: 0x55595f, roughness: 0.9 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
}

const res = q.get('res') ? Number(q.get('res')) : undefined;
const built = buildCharacter(def, res);
const rig = new Rig(def.segs, built.bones);
const pose = demoPose(q.get('pose') ?? 'rest');
// ?head=yaw,pitch,roll in degrees (yaw + toward the character's left, pitch + nose down, roll + its left ear down)
if (q.get('head')) { const [hy, hp, hr] = q.get('head')!.split(',').map((n) => THREE.MathUtils.degToRad(Number(n) || 0)); pose.head = new THREE.Quaternion().setFromEuler(new THREE.Euler(hp, hy, hr, 'YXZ')); }
rig.apply(pose, 0.6, def.idle?.tail ?? 0);
// ?jaw=0..1: the mouth opened that far (face tracking's jawOpen), at the character's own full angle
const jaw = Number(q.get('jaw') ?? 0);
const side = Number(new URLSearchParams((q.get('face') ?? '').replace(/,/g, '&').replace(/:/g, '=')).get('jawSide') ?? 0);
if (jaw > 0 || side) rig.setJaw(jaw * (def.face?.jaw ?? 0.4), side);
// ?face=blinkL:1,smileR:0.8,lookX:-0.6 — any FaceState fields (build.ts), on top of ?jaw
const faceSpec = q.get('face');
def.tick?.(built.root, Number(q.get("t") ?? 0.6), jaw > 0 || faceSpec ? parseFace(faceSpec, { jaw }) : null);
// standing: the root at the rest hip height, so the feet are near the floor in the rest pose
const s = 0.1;
built.root.scale.setScalar(s);
built.root.position.set(0, rig.hipRest.y * s, 0);
scene.add(built.root);

const yaw = THREE.MathUtils.degToRad(Number(q.get('yaw') ?? 0)), pitch = THREE.MathUtils.degToRad(Number(q.get('pitch') ?? 6));
const zoom = Number(q.get('zoom') ?? 1);
const focusHead = q.get('focus') === 'head' || thumb;
const target = new THREE.Vector3(0, thumb ? 1.5 : focusHead ? 1.45 : 1.0, 0);
const dist = (thumb ? 1.75 : focusHead ? 2.0 : 4.6) / zoom;
const camera = new THREE.PerspectiveCamera(32, W / H, 0.05, 50);
camera.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, target.y + Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist);
camera.lookAt(target);
renderer.render(scene, camera);
let tris = 0;
built.root.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && m.geometry.index === null) tris += (m.geometry.attributes.position?.count ?? 0) / 3; else if (m.isMesh) tris += m.geometry.index!.count / 3; });
document.getElementById('info')!.textContent = thumb ? '' : `${def.name} · ${built.ms.toFixed(0)} ms · ${Math.round(tris / 1000)}k tris · fur ${built.fur.length}`;
(window as unknown as { __lab: unknown }).__lab = { ready: true, ms: built.ms, tris };
