# costuma 2026

3D costumes that move with you. Point a phone at people (up to four), pick who
to be, and each person is drawn over as a code-built 3D character posed by
their own skeleton, lit by the room the camera sees. **Party mode** cuts the
nearest one to four people out of the frame and rebuilds the room round them
(pop art, a Warhol 2×2, solarize, neon outlines, contour rings, echo trails,
disco). Photo and clip capture; a QR button shares the page.

Static files only; everything is computed on the phone. Nothing is uploaded.

Source here; the built page is `../2026/` (served by GitHub Pages at
`chaboud.github.io/costuma/2026/` once on `main`). The 2024 app in `../site/`
is untouched.

## Commands

```bash
npm install
npm run dev                 # vite on :5173 (--host for a phone on the LAN; the camera needs https or localhost)
npm run check               # tsc + vitest — run before committing
npm run build               # → ../2026/ (relative paths; commit it, Pages serves it)
node scripts/lab-shots.mjs <dir>     # characters on the turntable (C=ids POSES=rest,wave,cheer,squat,turn YAWS=0,35,90,180 EXTRA='&zoom=1.6&focus=head')
node scripts/thumbs.mjs              # the picker's thumbnails → public/thumbs/ (rerun after changing a look)
node scripts/app-shots.mjs <dir>     # the built app with synthetic people (C=ids N=2 T=0,1.5 DEBUG=1); build first
node scripts/camera-e2e.mjs <clip.y4m> <dir>   # the built app on Chromium's fake camera: real MediaPipe (C= FACING= MODEL= W= H=)
```

Make a test clip from any photo: `ffmpeg -loop 1 -i photo.jpg -t 3 -r 15 -pix_fmt yuv420p clip.y4m`.
Headless runs use SwiftShader at well under 1 fps; their timings mean nothing,
and the scripts wait on frames, not seconds.

## How it works

`camera → MediaPipe PoseLandmarker → tracker → rig → stage`, one frame at a time
in `src/main.ts`.

- **Pose** (`src/pose/detector.ts`): MediaPipe tasks-vision PoseLandmarker
  (BlazePose GHUM, 33 landmarks), `numPoses` 1–4, GPU delegate with a CPU
  fallback. Wasm and the lite/full models are vendored in `public/` — never a
  CDN at run time (house rule since 2024). Each person comes with *image*
  landmarks (where in the frame) and *world* landmarks (metres about the hips).
- **Placement** (`src/pose/solve.ts`): a 3-unknown linear least squares finds
  the translation that projects the world landmarks onto the image landmarks:
  the hips in camera space. The 3D camera uses the same intrinsics, so a
  costume lands on its person whatever the lens guess; a wrong guess only
  changes depth and perspective strength (settings → Lens).
- **Tracking** (`src/pose/tracker.ts`): detections come in no fixed order;
  each joins the nearest track within a torso length (greedy). The track id is
  the identity — never a position key (2024's flicker). EMA smoothing, the
  house smoother, with depth smoothed hardest. Tracks fade in and out.
- **Retargeting** (`src/pose/rig.ts`): onto Strollzilla's rig bone names. Each
  bone swings from a *canonical* direction in its parent's frame (an arm out
  sideways, a thigh straight down, a shin along its thigh) to the person's
  segment, after a fixed rotation from its own rest direction — so any rest
  pose works and the shortest arc never meets its singularity in a pose a
  person can make (arms overhead included). Limbs out of view fall back to
  rest. Limbs stretch toward the wearer's lengths (`fit.limb`), the neck
  squashes so the head lands on the wearer's (`fit.head`).
- **Characters** (`src/characters/`): code, no model files. An SDF body
  polygonised by marching cubes, coloured by region, skinned by distance to
  its segments (Strollzilla's `build.ts`, generalised), plus rigid meshes on
  bones. A character is a `CharacterDef` (data, D-7): add a file, list it in
  `roster.ts` and `ids.ts`. Built on first use (≈0.3–1.5 s on a phone),
  cloned per person.
- **Light** (`src/render/envlight.ts`): the camera frame is folded into a
  small equirectangular environment a few times a second (the scene side as
  seen, spread wider than the lens; the unseen side behind the camera as the
  frame mirrored and blurred) and prefiltered (PMREM), so the physically based
  materials take their diffuse and reflections from the room; the
  environment's brightest direction becomes a shadow-casting key light. Dim
  frames are lifted (×2.6 at most) so a costume on a dark street still reads.
  The unseen hemisphere is a guess, not a measurement.
- **Party** (`src/render/party.ts`): the pose model's per-person cut-out
  masks (`outputSegmentationMasks`), so "cut out one or several" is a count:
  the N nearest tracked people take channels of one RGBA mask texture and keep
  them while they stay. Detection runs on a 480-px copy of the frame in this
  mode (one GPU→CPU mask copy per person a frame). What a single shader pass
  cannot do — distance to the nearest subject (rings, neon glow) and where
  they have been (echo trails) — runs on the CPU on a 160-px grid (a two-pass
  chamfer distance, a decaying max) and is drawn smooth by the texture filter.
  Presets are branches of one fragment shader. A tap cycles the preset.
- **Stage** (`src/render/stage.ts`): the video is a full-screen background,
  cover-fitted; a selfie mirrors the whole world group (`scale.x = −1`), not
  the data — mirrored landmarks would describe a different-handed person.

## Decisions (and what was rejected)

| Choice | Over | Why |
|---|---|---|
| MediaPipe PoseLandmarker | TF.js BlazePose (one person), MoveNet multipose (2D only), PoseNet (2024's: 2D) | the only browser option with 3D world landmarks *and* several people |
| Characters as code (SDF + bones) | glTF assets | Strollzilla's roster came for free, nothing to license, every look is editable text |
| Swing from canonical directions | shortest arc from rest | arms overhead are ~180° from hanging: the arc's axis flips there |
| Mirror the render | mirror the landmarks | a mirrored skeleton is a different-handed person; the costume faced away |
| Static build committed to `2026/` | a deploy branch | costuma's Pages already serves `main`; one merge publishes it |

## Things that bit already

- **Vite's dev server reloads the page when it discovers a dependency** —
  mid-test, headless runs saw a fresh page with no state. The test scripts run
  against the build (`scripts/serve.mjs`), and `optimizeDeps.include` lists the
  late imports.
- **`Material.clone()` drops `onBeforeCompile`** (it is an instance property
  the copy does not carry): per-person material copies for fading lost the fur
  shader. `stage.ts` copies the hook and the cache key by hand.
- **MediaPipe's shoulder landmarks sit on top of the shoulders**, so its
  shoulder-to-ear distance is ~0.15 m; the rigs' heads stood ~15 cm above the
  wearer's head on a real photo until the neck fit (`rig.neckFit`).
- **Strollzilla never raised its arms overhead**, so its arm capture rules let
  a raised arm drag the cape (Valkyrie) or the hips (Howler) up as a sheet;
  `species.ts` keeps arms off the back and gives the wolf's forearms a reach.

## Depth on iPhone

ARKit's LiDAR depth and body tracking are not reachable from a web page on an
iPhone (checked 2026-10-31 against secondary sources, not WebKit release
notes): iOS Safari ships no WebXR (`immersive-ar`), and the WebXR depth-sensing
module is Chromium-only (Android ARCore). `getUserMedia` gives no depth track.
AR Quick Look shows USDZ models, not camera depth. So depth here is what
MediaPipe infers from the image. Real depth would need a native app or App
Clip (ARKit's `sceneDepth` and `ARBodyTrackingConfiguration`), or Chrome on
Android with WebXR depth sensing — both outside "static page, computed on the
phone" as this app means it.

## Open questions

- **Is the lite model steady enough on a phone?** Settle by: the founder
  wearing it outdoors at dusk with two people; if costumes jitter or swap,
  try *Accurate* and compare `pose ms` in the settings readout.
- **Does the unseen-hemisphere guess look right?** Settle by: the same
  costume in a room lit from behind the camera vs. from behind the wearer;
  if the front is too dark in the first, raise `LIGHT_TUNE.back`.
- **Does the focal guess (0.85 × long side) suit front and rear cameras?**
  Settle by: a costume that looks too flat/deep on a phone; adjust Lens, note
  the value per camera.

Not verified yet: anything on a real phone (frame rate, GPU delegate on iOS
Safari, recording mime on iOS, share sheet).
