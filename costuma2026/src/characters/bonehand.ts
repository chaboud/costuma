// A hand of separate bones (Skelly's and Catrina's): the palm one mesh, each finger three phalanges and the thumb two,
// each hung on a pivot at its joint, so hand tracking can curl them knuckle by knuckle (characters/curl.ts turns the
// pivots; pose/hands.ts reads the curls). Built for the left hand in model units; the right is its mirror (scale.x −1,
// as every paired mesh here), and a turn about the mirrored axis bends the right hand's fingers toward its own palm.
import * as THREE from 'three';

type V3 = [number, number, number];

export interface HandParts {
  /** the carpals, the metacarpals, the thumb's first bone: what does not curl */
  palm: THREE.BufferGeometry[];
  /** thumb first, then index … little: each its joints (from the hand out) and the bone past each joint */
  fingers: { joints: V3[]; bones: THREE.BufferGeometry[] }[];
  /** the knuckles' hinge (model units, unit length): across the hand, a turn about it by + bends toward the palm */
  hinge: V3;
}

/**
 * The hand as a group: the palm as one mesh, the fingers as chains of pivots (userData.curl = [finger, joint], finger
 * 0 the thumb; userData.hinge the axis). `prepare` merges a list of geometries into one (and colours them, if the
 * costume does). Its origin is the model's: hang it with `d.at(group, bone, 0, 0, 0)`.
 */
export function jointedHand(parts: HandParts, prepare: (g: THREE.BufferGeometry[]) => THREE.BufferGeometry, mat: THREE.Material, name: string): THREE.Group {
  const root = new THREE.Group();
  root.name = name;
  const palm = new THREE.Mesh(prepare(parts.palm), mat);
  palm.name = `${name}-palm`;
  root.add(palm);
  parts.fingers.forEach((f, i) => {
    let parent: THREE.Object3D = root, at = new THREE.Vector3();
    f.joints.forEach((j, k) => {
      const p = new THREE.Object3D();
      p.name = `${name}-f${i}${k}`;
      const J = new THREE.Vector3(...j);
      p.position.copy(J).sub(at);
      p.userData.curl = [i, k];
      p.userData.hinge = [...parts.hinge];
      const g = prepare([f.bones[k]!]).translate(-J.x, -J.y, -J.z);
      const m = new THREE.Mesh(g, mat);
      m.name = `${name}-b${i}${k}`;
      p.add(m);
      parent.add(p);
      parent = p;
      at = J;
    });
  });
  return root;
}

/** the right hand from the left: its mirror (scale.x −1), its parts renamed */
export function mirrorHand(left: THREE.Group): THREE.Group {
  const right = left.clone(true);
  right.traverse((o) => { o.name = o.name.replace(/handL/g, 'handR'); });
  right.scale.x = -1;
  return right;
}
