// MediaPipe PoseLandmarker (BlazePose GHUM, 33 landmarks with metric world coordinates), several people at once.
// Wasm and models are vendored under public/ (never a CDN at run time: house rule since costuma 2024).
import type { PoseLandmarker as PL } from '@mediapipe/tasks-vision';
import type { Detection } from './tracker';
import { worldToThree } from './landmarks';

export type ModelKind = 'lite' | 'full';

export class Detector {
  private lm: PL | null = null;
  private lastTs = -1;
  delegate: 'GPU' | 'CPU' = 'GPU';
  inferMs = 0;
  /** cut-out masks per person (party mode): costs a GPU→CPU copy per person per frame */
  masks = false;
  /** `conf`: how sure the model must be that a person is there, to find one (detection) and to keep them (presence) */
  constructor(public model: ModelKind, public numPoses: number, public conf = 0.65) {}

  async load(onStage?: (s: string) => void): Promise<void> {
    const base = import.meta.env.BASE_URL;
    onStage?.('loading the pose engine');
    const vision = await import('@mediapipe/tasks-vision');
    const fileset = await vision.FilesetResolver.forVisionTasks(`${base}mediapipe`);
    const make = (delegate: 'GPU' | 'CPU') => vision.PoseLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: `${base}models/pose_landmarker_${this.model}.task`, delegate },
      runningMode: 'VIDEO',
      numPoses: this.numPoses,
      minPoseDetectionConfidence: this.conf,
      minPosePresenceConfidence: this.conf,
      minTrackingConfidence: 0.5,
      outputSegmentationMasks: this.masks,
    });
    onStage?.(`loading the ${this.model} pose model`);
    try {
      this.lm = await make('GPU');
      this.delegate = 'GPU';
    } catch (e) {
      console.warn('GPU delegate failed, using CPU', e);
      this.lm = await make('CPU');
      this.delegate = 'CPU';
    }
  }

  async setOptions(o: { numPoses?: number; masks?: boolean; conf?: number }): Promise<void> {
    if (o.conf !== undefined && o.conf !== this.conf) { this.conf = o.conf; await this.lm?.setOptions({ minPoseDetectionConfidence: o.conf, minPosePresenceConfidence: o.conf }); }
    if (o.numPoses) { this.numPoses = o.numPoses; await this.lm?.setOptions({ numPoses: o.numPoses }); }
    if (o.masks !== undefined && o.masks !== this.masks) { this.masks = o.masks; await this.lm?.setOptions({ outputSegmentationMasks: o.masks }); }
  }

  /** run on a frame; `ts` ms, strictly increasing */
  detect(src: HTMLVideoElement | HTMLCanvasElement, ts: number): Detection[] {
    if (!this.lm) return [];
    if (ts <= this.lastTs) ts = this.lastTs + 1;
    this.lastTs = ts;
    const t0 = performance.now();
    const r = this.lm.detectForVideo(src, ts);
    this.inferMs = performance.now() - t0;
    const out: Detection[] = [];
    for (let i = 0; i < r.landmarks.length; i++) {
      const im = r.landmarks[i]!, w = r.worldLandmarks[i];
      if (!w) continue;
      const m = r.segmentationMasks?.[i];
      out.push({
        image: im.map((p) => ({ x: p.x, y: p.y, z: p.z, v: p.visibility ?? 1 })),
        world: w.map(worldToThree),
        // copied out: the task owns its masks and frees them with the result
        mask: m ? { data: m.getAsFloat32Array().slice(), w: m.width, h: m.height } : undefined,
      });
    }
    r.close();
    return out;
  }

  close(): void { this.lm?.close(); this.lm = null; }
}
