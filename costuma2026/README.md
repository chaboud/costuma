# costuma 2026

3D costumes that move with you. Point a phone at people (up to four), pick who
to be, and each person is drawn over as a code-built 3D character posed by
their own skeleton, lit by the room the camera sees. **Party mode** cuts the
nearest one to four people out of the frame and rebuilds the room round them,
graded like a concert's screens. The default, **In Situ**, keeps the real
room: the costumes dance behind you, spotlights sweep the real floor. The
others: a feedback tunnel, lasers, a kaleidoscope, contour rings, neon, pop
art, a Warhol 2×2, echo trails, disco, solarize; optionally on the beat
(microphone). **Pyramid** is a toggle over any of them: rows of dancers
behind you (in 3D, with costumes), late like a canon. Photo and clip capture;
a QR button shares the page. The controls fade after a few seconds untouched.

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
node scripts/face-probe.mjs <portrait.jpg> [profiles.jpg]   # what the face model finds: full frame vs head crops, head turn vs the truth
node scripts/capture-check.mjs <clip.y4m>     # as an iPhone: a photo to the share sheet (file alone), the preview on a refusal; a 0.5–10× camera: the lens pill
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
  `roster.ts` and `ids.ts`. Built in a worker on first use (≈0.3–1.5 s
  headless), cloned per person.
- **The rotation** (`settings.cast`): the characters the picker, the party's
  dancers and Mix draw from. Default (founder, 2026-10-31): Jimothy, the
  builder, Skelly, Jack, Howler, Violet, Plume. The rest — the kaiju, a
  Catrina, a ghost, a mummy, a vampire, a witch, and Crimson, Bastion,
  Kestrel, Unison — sit under **More → Advanced & trash**, each with a ✓/✕
  that puts it in or takes it out of every rotation. Tapping the selected
  party effect again changes the dancers (each character in turn, then Mix);
  tapping Mix again reshuffles it.
- **Light** (`src/render/envlight.ts`): the camera frame is folded into a
  small equirectangular environment a few times a second (the scene side as
  seen, spread wider than the lens; the unseen side behind the camera as the
  frame mirrored and blurred) and prefiltered (PMREM), so the physically based
  materials take their diffuse and reflections from the room; the
  environment's brightest direction becomes a shadow-casting key light. Dim
  frames are lifted (×2.6 at most) so a costume on a dark street still reads.
  The unseen hemisphere is a guess, not a measurement — nudged by a measurement where there is one: the largest read
  face is a light meter (five probes: forehead, chin, cheeks, nose). Its left–right difference turns the key light
  toward the side lighting people (including from behind the camera), up–down is read weakly and leans above (the
  chin's probe sits by collars, beards and teeth), and its brightness against the mirror's guess scales the unseen
  side. Trust grows with the face's size. The environment is 128×64, exact inside the frame (a reflection lines up with
  the picture) and blurring out past its edge. Checked on one frontal test portrait: it read the face, its brightness
  and a side; nothing on a phone yet.
- **Party** (`src/render/party.ts`): the pose model's per-person cut-out
  masks (`outputSegmentationMasks`), so "cut out one or several" is a count:
  the N nearest tracked people take channels of one RGBA mask texture and keep
  them while they stay. Detection runs on a 480-px copy of the frame in this
  mode (one GPU→CPU mask copy per person a frame). What a single shader pass
  cannot do — distance to the nearest subject (rings, neon glow) and where
  they have been (echo trails) — runs on the CPU on a 160-px grid (a two-pass
  chamfer distance, a decaying max) and is drawn smooth by the texture filter.
  Then on the GPU: a cut-out pass into a 12-deep history (the pyramid's
  clones read it a few frames late), the scene pass in half float (a branch per
  preset; the tunnel reads the previous scene), a two-level bloom, and the
  grade as the background quad (chromatic split, vignette, grain, a highlight
  roll-off). With costumes on, Pyramid clones the costumes in 3D from a ring of
  past poses instead (`stage.ts posePyramid`), and two rim lights edge them in
  the show's colours. **Behind you** (settings → Costumes in party mode) keeps
  the person themselves: the costume pyramid dances behind them and the room
  behind that — insertion by draw order, no depth: the background quad, the 3D
  costumes, then the grade again with the subjects' mask as alpha
  (`party.foreground`, drawn last). With Pyramid off no dancer is drawn at
  all. The microphone (`audio/beat.ts`, off by default) turns bass onsets into
  `uBeat`.
- **Faces** (`src/pose/face.ts`): MediaPipe FaceLandmarker (478 points, 52
  blendshapes, the face's 3D turn) beside the pose model, loaded in the
  background after Start. Each person's face is read from a **crop round their
  head**, where the pose model points (two people a frame, more take turns, a
  12 ms budget): on the whole frame the face model's 128-px detector lost a face
  smaller than ~140 px of 1280 (a person ~1 m off); on the crop it read faces
  down to 46 px (~3 m), as far as the pose model found the person
  (`scripts/face-probe.mjs`, a portrait shrunk in a 1280×720 frame). The crop
  also says whose face it is. **The head turns as the face mesh says**: its
  transformation matrix, turned by the ray to the crop so it matches our camera
  (rolls read within 1–2°; the pose model's ears-and-nose head was 7° off at
  rest, 13° off mirrored, and called near-profile heads 19–31°). Turned too far
  for the face model, the pose model's head takes over, corrected by what the
  face last said, the correction relaxing over seconds (`tests/face.test.ts`:
  never more than 4° a frame). Every blendshape a costume can use is read into
  `FaceState` (`characters/build.ts`): jaw, blinks, squints, wide eyes, gaze,
  per-side smiles and brows, frown, pucker, funnel, sideways jaw, puff, sneer —
  the blendshapes' "Left" is the person's own left (measured with an eye
  painted shut). Smoothed by EMA, quick for the jaw and blinks. A face not read
  this frame is carried along by the pose's nose for 0.4 s; then the pose
  model's own face points give eyes and a mouth. Costumes move their faces in
  their `tick` (`characters/faceparts.ts`: lids that blink, squint and widen;
  eyes that look). The default seven and the kaiju all do: winks, gaze, brows
  per side, smiles and smirks, scowls, snarls, puffed cheeks, ears and crests.
  Jimothy, Howler, Violet, Plume and the kaiju carry face bones under the head
  (brows, ears, lips, cheeks, a crest) that take a share of the head's own skin
  weights; their lower jaws are rigid meshes on the `jaw` bone, so an open mouth
  is a clean gap with a palate, tongue and teeth, not a stretched sheet. Jack's
  carving moves in his shell's vertex shader. An open mouth opens the
  costume's jaw (`face.jaw`,
  `rig.setJaw`, sideways too) and breathes sparks (`render/breath.ts`, colours,
  rate and speed per costume: `face.breath`; sparks fade within half a metre of
  the lens and never grow past a tenth of the frame). **Googly eyes**
  (`render/googly.ts`) go on the person's eyes, or over the costume's
  (`face.eyes` anchors on the head bone); their pupils are physics in
  eye-radius units — gravity from the floor's up, the eye's own acceleration
  (smoothed, with a dead zone so a still head does not buzz), rim bounces. The
  lab shows any face: `lab.html?c=<id>&focus=head&face=blinkL:1,lookX:0.8&jaw=0.6&head=20,0,10`.
- **Floor** (`src/pose/ground.ts`): the pyramids stand on a ground plane
  estimated the way phone AR does without depth hardware. Up is the phone's
  gravity (`platform/motion.ts`, iOS asks at Start) when it agrees with the
  people in view (within 35°), else the people's own long-run ankle-to-shoulder
  direction (they stand up), else a level camera. The floor's height along up
  is the lowest visible heel or toe (MediaPipe's landmarks are metric and
  already in camera space), else the hips less the person's measured legs,
  else the camera 1.4 m up. EMA-smoothed. The 3D clones stand on it with a
  contact shadow; the 2D clones' feet are laid on it and projected, their scale
  the ratio of depths. Settings → Show the skeleton also draws the floor grid
  and says where up came from. The gravity mapping in landscape and for the
  front camera is reasoned, not measured on a phone — hence the agreement gate.
- **Who counts as a person**: the pose model's detection and presence
  thresholds are a setting (Detection threshold, 0.65 by default since
  2026-11-01; MediaPipe's 0.5 before, which let coats and posters through:
  founder, "some acquisition issues"), and the tracker shows nobody until
  they have been found three frames running (`TUNE.confirm`, ~0.1 s), so a
  one-frame false find never flashes a costume.
- **Lenses** (`src/camera.ts`): where the stream can zoom (the `zoom`
  constraint: Chrome on Android; Safari on iOS from 17.4 by a third party's
  account, not checked), a pill above the shutter offers the phone's least
  zoom (0.5 on an ultra-wide), 1×, 2×, 3×, 5× inside its range; an iPhone's
  back camera changes lens by itself as the zoom passes them. Off iOS, a camera
  that cannot zoom but has siblings facing the same way cycles through them by
  device (never on iOS: its device ids change). The zoom scales the focal
  length guess, so costumes keep their depth. Kept per facing in settings. What
  a phone offers shows in the settings readout (`camera …`). Not yet seen on a
  phone.
- **Capture**: on an iPhone a photo or clip goes straight to the share sheet,
  the file alone ("Save Image" / "Save Video" put it in Photos; a download lands
  in Files), the shutter's tap standing as the gesture the sheet needs; if
  Safari refuses that (or the sheet is dismissed) the preview opens with "Save
  to Photos". Elsewhere the preview: Save downloads, Share is the sheet.
  `scripts/capture-check.mjs` checks both paths with the sheet stubbed; whether
  Safari honours the shutter's tap after the photo is encoded is not known.
- **Stage** (`src/render/stage.ts`): the video is a full-screen background,
  cover-fitted; a selfie mirrors the whole world group (`scale.x = −1`), not
  the data — mirrored landmarks would describe a different-handed person.

## Smooth, always

Founder: "everything should be smooth and pro. No jumpies, no jiggles." What
that means here, and where each lives:

- **No freezes.** Costumes are made in a Web Worker
  (`characters/build.worker.ts`), all of them in the background from Start;
  the main thread only assembles meshes. A costume asked for before it is
  ready jumps the queue; the old one stays on until the new one is ready.
- **No pops.** A costume change crossfades (0.35 s, `stage.ts sync`); a party
  preset change crossfades (0.45 s, the old preset drawn alongside); a mode
  change or camera flip dips to black and back; people fade in and out.
- **No trembling hand-held.** A phone held at arm's length shakes the whole person in the frame; an EMA lags that and
  the costume shivered against them (1.6 px measured under a simulated 5–9 Hz tremor, `scripts/shake-sim.test.ts`).
  Now what the torso's points do together is followed at once and only each point's own wobble is smoothed
  (`tracker.ts shiftTogether`); the hips are re-solved from the smoothed picture, their depth smoothed along the
  same ray so the costume does not move on screen: 0.6 px, below the unsmoothed 0.7, with the limbs and head as
  steady as before. Faces do the same for googly eyes. The bones' turns glide ~25 ms on top (`rig.apply` dt).
- **No jiggle.** Measured, not guessed: a noisy still replayed through the
  tracker at 30 fps (`scripts/jitter-probe.mjs` records, `scripts/jitter-sim.test.ts`
  replays). Raw: hips' depth 1.0 cm, upper arm 0.80°, head 1.19°, pelvis
  1.13° (s.d.). The torso and face are smoothed twice as hard as the limbs
  (`TUNE.tauCore` 90 ms vs 45 ms): head 0.51°, pelvis 0.56°, arms 0.50°, depth
  0.3 cm. The noise was synthetic (σ 14 on 8 bits); a phone at night will be
  noisier. Visibility is smoothed on its own slow clock (250 ms) so a limb at
  the frame's edge does not flicker between pose and rest. The camera's light
  glides (~0.6 s); party masks are smoothed (~40 ms) so edges do not shimmer;
  the pyramid's layout glides (~150 ms).

## Decisions (and what was rejected)

| Choice | Over | Why |
|---|---|---|
| MediaPipe PoseLandmarker | TF.js BlazePose (one person), MoveNet multipose (2D only), PoseNet (2024's: 2D) | the only browser option with 3D world landmarks *and* several people |
| Characters as code (SDF + bones) | glTF assets | Strollzilla's roster came for free, nothing to license, every look is editable text |
| Swing from canonical directions | shortest arc from rest | arms overhead are ~180° from hanging: the arc's axis flips there |
| Mirror the render | mirror the landmarks | a mirrored skeleton is a different-handed person; the costume faced away |
| Static build committed to `2026/` | a deploy branch | costuma's Pages already serves `main`; one merge publishes it |
| Faces from a crop round each head | the face model on the whole frame | the whole frame lost faces past ~1 m (its detector sees 128 px); crops read them to ~3 m and name whose face it is; costs one face read per person (two a frame, 12 ms budget) |
| The head's turn from the face mesh | the pose model's ears and nose | measured: rolls within 1–2° against 7–13° off; profiles still fall back to the pose model |

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

## More things that bit

- **The picker did not scroll**, three ways at once: the thumbnails were
  natively draggable, so a drag became an image drag and the browser
  cancelled the pointer after one move (found by logging the pointer events:
  `pointercancel` after the first `pointermove`); a mouse wheel never scrolls
  sideways; and the scroller sat under a `pointer-events: none` parent, which
  iOS Safari's panning may not see through. `scripts/picker-check.mjs` drags and
  wheels it. A synthesized touch swipe cannot be judged headless here: it
  scrolls nothing, not even a plain scrolling div.
- **A pipe hides the exit code** (Strollzilla learned it too): a check piped
  through `grep` reported a failing test and the commit and deploy went ahead.
  Write checks to a log and read `$?`.

## To do (founder's list)

- **Better fur and feather detail** (2026-10-31). The shells (Strollzilla's `fur.ts`) read as fur from a few metres but
  smear on a raised arm and look coarse up close: more shells near the camera, strand thickness by screen size, a
  feather's own shape and sheen, and clumping by a noise field. Settle by: a face close-up of Jimothy, Howler and
  Violet holding up beside a photo at phone distance.

## Open questions

- **Is the lite model steady enough on a phone?** Settle by: the founder
  wearing it outdoors at dusk with two people; if costumes jitter or swap,
  try *Accurate* and compare `pose ms` in the settings readout.
- **Does the unseen-hemisphere guess look right?** Settle by: the same
  costume in a room lit from behind the camera vs. from behind the wearer;
  if the front is too dark in the first, raise `LIGHT_TUNE.back`.
- **Does the floor sit on the floor on a phone?** Settle by: Show the
  skeleton with someone full-length in frame; the grid should lie flat under
  their feet and say `motion + feet`. If it says `body` while the phone is held
  still and upright, the gravity mapping is off (`platform/motion.ts`).
- **Does the focal guess (0.85 × long side) suit front and rear cameras?**
  Settle by: a costume that looks too flat/deep on a phone; adjust Lens, note
  the value per camera.

Not verified yet: anything on a real phone (frame rate, GPU delegate on iOS
Safari, recording mime on iOS, share sheet).
