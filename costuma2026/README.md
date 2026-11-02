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
node scripts/pose-record.mjs <clip|photo> <out.json>   # every frame through the real pose model, in order (FPS= SECS= VF='ffmpeg filter' N=)
STAB=a.json,b.json npx vitest run scripts/stability-sim.test.ts   # replay through the tracker: lean, error, jerk, jumps; INJECT=1 adds depth flips
LEGS=a.json npx vitest run scripts/legs-sim.test.ts   # legs the frame cuts off: hips/knees/ankles in the picture, the leg raw, tracked and on the costume, its drawn lengths (C=)
CLOTH=a.json,b.json npx vitest run scripts/cloth-sim.test.ts   # the ghost's and witch's hems on recorded people: swing still and walking
node scripts/cloth-shots.mjs <dir>   # the cloth held at rest, swung and twisted, in the built app (C=ghost,witch)
BODY=a.json,b.json npx vitest run scripts/body-sim.test.ts   # sizing by shot: the fitted torso, how much it moves, the costume's shoulders against the person's, hips seen vs out (DRIFT=)
STAB=... npx vitest run scripts/kalman-tune.test.ts          # the smoothing's settings swept, against the EMA (FULL=1 the Kalman grid)
node scripts/offline-check.mjs   # the service worker: the shell kept by content hash; offline, the page loads, starts and dresses someone
OCCL=people|all node scripts/occlusion-check.mjs <clip.y4m> <dir>   # occlusion on a frozen frame: on, off, people alone (all), the cut-outs, the depth map (MIN= people in view first)
node scripts/capture-check.mjs <clip.y4m>     # as an iPhone: a photo to the share sheet (file alone), the preview on a refusal; a 0.5–10× camera: the lens pill; a clip's sound (ffprobe), refused; reset to defaults; a debug recording, unzipped and replayed
META=<…-debug.zip> npx vitest run scripts/meta-replay.test.ts   # a phone's debug recording: what it holds, and its raw detections replayed through today's tracker against the phone's
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
  the identity — never a position key (2024's flicker). A new person shows
  after three frames found. EMA smoothing (the house smoother; time constants
  1.5× the first ones since 2026-11-01), the torso and face harder than the
  limbs, depth hardest. **People stand up** (`src/pose/upright.ts`): with the
  hips out of the picture (a torso shot) the smoothed pose is hung from the
  shoulders — the torso square to the shoulder line, as upright as they allow,
  the hips one measured torso length below — so a guessed body cannot tip over;
  with the hips in view, a body flat in 3D that the picture shows upright (a
  depth flip) is stood up, and one the picture agrees with is accepted after
  0.35 s. **The costume is pinned to the picture**: the 3D placement slides
  sideways at its depth until the torso lands on the smoothed picture's torso.
  Measured by replaying clips recorded frame by frame through the real model
  (`scripts/pose-record.mjs`, `scripts/stability-sim.test.ts`): in torso shots
  the costume's shoulders sat 20–27 px off the person's (RMS) and now 3–5, their
  frame-to-frame jitter 2–4× the picture's and now equal to it (6, 10, 6 px);
  the head's biggest jumps ~50 → ~15 px; arms and turns 25–42 % less jerky;
  injected depth flips on a street clip left the body horizontal for 3–6 frames
  a person and now 0–1. **A fader's motor after the smoothing** (founder:
  "to get rid of tremble … no booleans in motion"): each shown value has a
  position and a velocity, pulled toward the smoothed reading by a curve of the
  error — e·m²/(1+m²), m the error in units of the model's measured noise for
  that kind of point (limbs 3× the torso's): a cube inside the noise, the error
  itself well past it, no threshold anywhere — damped by its velocity
  (critically), stiffer the further off by another curve, with a faint linear
  pull that settles the last offset; the whole body's shared shift (a hand-held
  camera's shake) through a stiff one. **Settings → Smoothing** (0 snappy .. 1
  steady, default 0.5) scales the EMA's times, the motors' knees and their
  stiffness together. Replayed on a still torso clip at the default: arms
  ~0.16° a frame (the EMA alone 2.0°), position 1.1 px (3.2); on a walking
  street clip the chest turn's error 15.7° → ~25° (lag). The same rule runs
  through the rest of the motion: the upright check believes a flat body by a
  curve over time and turns the torso a share of the way (it used to hold, then
  jump ~30° at acceptance), the reach eases between its two depth answers and
  toward its turn cap, the picture pin eases in with how much torso is seen,
  and the face's rest learns at rates that are curves. A constant-velocity Kalman filter (`src/pose/kalman.ts`)
  was tried for the points and the depth and lost to the slower EMA on every
  recorded clip (MediaPipe's errors wander over frames, which a velocity filter
  reads as motion); it is there, off (`TUNE.filter`). Tracks fade in and out.
- **Retargeting** (`src/pose/rig.ts`): onto Strollzilla's rig bone names. Each
  bone swings from a *canonical* direction in its parent's frame (an arm out
  sideways, a thigh straight down, a shin along its thigh) to the person's
  segment, after a fixed rotation from its own rest direction — so any rest
  pose works and the shortest arc never meets its singularity in a pose a
  person can make (arms overhead included). Limbs stretch toward the wearer's
  lengths (`fit.limb`), the neck squashes so the head lands on the wearer's
  (`fit.head`).
- **Limbs held, mirrored and hung** (`src/pose/limbs.ts`; the second phone
  debug recording, a woman seated at a patio table, her legs behind its chairs;
  founder: "higher confidence matches should have stronger spatio-temporal pose
  influence… If we only see one leg it's a good prior for the other… A raised
  thigh with no visible calf should assume a bent knee"). While her knees read
  0.8–0.9 visible the model had her seated (thighs 45–70° forward); when they
  fell to ~0.3 the costume's legs went straight down, standing (the rest pose).
  Now each limb bone keeps a memory of its direction in its parent's frame,
  taken in as fast as the picture is sure of it (counting from 0.15 visible,
  fully from 0.7: the model keeps a hidden seated leg seated at 0.3–0.4) and
  forgotten over ~6 s; under it a prior: a hidden leg takes the seen leg's,
  mirrored; a shin whose ankle is unseen hangs toward the ground within the
  knee's hinge (a thigh forward, the knee bent; a thigh down, straight). How
  sure that is reaches the rig alone (`LM.b`: the picture's visibility stays,
  or the floor stood on guessed feet). On the recording: her left leg stays
  seated throughout (thigh 48–77°, knee 26–84°, where it went to 5°/7°), her
  mostly hidden right leg sits too (27–55°, where it stood all along); a
  standing person whose legs leave the frame keeps them straight. And a
  reading under 0.3 visible moves the smoothed pose at down to a fifth of the
  rate (`TUNE.rateFrom`); applied up to 0.85 it slowed the street's swinging
  arms (wrists read ~0.6) by 5–11°, so it acts on near-lost points only.
  `tests/limbs.test.ts`: seated, mirrored, hung, standing (the first three fail
  on the build before).
- **What is seen, and the rest extrapolated** (`src/pose/seen.ts`,
  `src/pose/body.ts`; founder: "like stretch Armstrong, limbs without hints
  have a neutral to return to… We can estimate body length from other points…
  Full body is best, but they're all priors for an estimator… It's
  extrapolation with a partial fit"). An unseen bone eases, by a curve of how
  unseen, to the costume's own rest: its parent's line carried on (a thigh down
  the torso, a straight elbow). A joint's visibility is also how far inside the
  frame it is (the model rated knees below a torso shot up to 0.5–0.7 at times;
  a raised-knee guess there lifted the costume's thighs 43–85° toward the
  chest; now they stay at rest). Every length comes from one fit per person:
  their torso, a one-dimensional Kalman filter (log) read through every part
  the picture shows — torso, neck, shoulders' and hips' width, the ears' span,
  upper arms, forearms, thighs, shins — each by its visibility and by how much
  that part's share of the torso varies between people (shares and spreads
  measured on ~300 detections per part where part and torso were clearly seen,
  ~20 people: neck 0.39 of the torso, shoulders 0.67, ears 0.31, thigh 0.80,
  shin 0.77…), plus, while the hips are hidden and as far as the size is not
  already known, the model's own guess of the hidden torso. A person's own
  shares are learned only while their torso is seen (it is the reference), so a
  full view teaches the fit their face and shoulders and a selfie afterwards
  keeps it (synthetic: a person seen whole then in a selfie whose hidden torso
  the model guesses 20 % short — before 17 % drift, now under 2 %); a selfie
  from the start is sized by the usual shares and the guess. Unseen lengths are
  the size times the shares: a torso shot's guessed thighs measured 0.18–0.23
  m, and costumes that fit their legs to the wearer drew them at 68–75 %; now
  89–96 % (`scripts/legs-sim.test.ts`). The size follows the model's 3D scale
  (it moves with the framing: one man's shoulders 3 %, neck and ears 7 %
  smaller once zoomed to a chest shot, and the depth is solved in that scale),
  so what persists is the proportions; through that zoom the costume's
  shoulders against his went from 1.11× to 1.15× (1.17× before), its size
  moving 0.06 % a frame (`scripts/body-sim.test.ts`). Steadiness on five
  recorded clips unchanged.
- **Reach** (`src/pose/reach.ts`): after the retarget, each limb bone is aimed
  so its far end lands on the person's joint in the picture — the camera's ray
  through the joint met by a sphere of the bone's own length round where the
  bone starts (of the two meetings, the one nearer the 3D guess; past the
  bone's reach, its nearest point), down the chain, weighed by visibility.
  The costume's proportions are kept (founder: "within skeletal constraints of
  the character"); joint limits would go here. A person 1.3 m off with arms
  forward: elbows, wrists, knees and ankles that were 9–493 px off the person's
  (Howler's forearm the worst) land on them wherever the bone reaches.
- **Occlusion** (`src/render/occlusion.ts`, settings → Occlusion
  (experimental): Off (the default) / People / People + things). Two layers.
  *People*, no extra model: the pose model's cut-out of each person (the masks
  party mode uses; with them on, it reads a 480-px copy of the frame — tracked
  people on OpenPose's street clip, 45 s headless: 1.04 on average without the
  copy, 1.11 with it) and each person's front from the pose solve (the middle
  of their seen nose, shoulders and hips, less 0.1 m). The nearest four keep a
  channel each of one texture; a costume pixel fades by a curve of how far
  behind another person's front it lies wherever that person's cut-out covers
  it, and never by its own wearer's cut-out. Packed only when a new mask comes
  (1.7–3.2 ms a pack for one to four people on this sandbox's CPU; not measured
  on a phone). Only tracked people count: someone the app is not tracking (past
  the People count, or missed) hides nothing in this layer.
  *Things*, People + things: Depth Anything V2 Small (Apache 2.0, the
  onnx-community 4-bit export, 19 MB, vendored) through onnxruntime-web 1.30
  (its WebGPU bundle; its 27 MB runtime a build asset fetched only when asked
  for), WebGPU where the phone gives an adapter, else the CPU in a worker,
  reading the frame now and then (headless CPU: 1.5–3.6 s a reading; WebGPU on a
  phone not measured). Its relative depth is put in metres against the tracked
  people (`1/z = a·d + b`, the shift believed only as far as the people stand
  apart), and it decides only where no one is: outside the people's cut-outs,
  widened by a block of 8 mask pixels (its edges bleed past a body). The floor
  never hides anything (a pixel as far as the floor's plane counts as floor).
  The first version had only the depth model and kept a wearer's own body from
  hiding their costume by a 0.3 m margin before their hips, which also stopped
  anything held against the body: frozen-frame A/B on COCO scenes (share of the
  frame changed with occlusion on), before → now: a person holding a big teddy
  bear 0.00 → 0.61 % (the bear hides the arm over it); three people on a couch,
  0.26 % by the people alone (the seated pair's arms that cross behind the
  standing man), 0.11 % more by things (by eye, mostly the couch's arm over a leg); a baby with
  a cake 0.33 → 0.01 % and a woman in a chair 0.46 → 0.03 %, where nothing
  stands in front of the costume in view (`scripts/occlusion-check.mjs`).
- **Characters** (`src/characters/`): code, no model files. An SDF body
  polygonised by marching cubes, coloured by region, skinned by distance to
  its segments (Strollzilla's `build.ts`, generalised), plus rigid meshes on
  bones. A character is a `CharacterDef` (data, D-7): add a file, list it in
  `roster.ts` and `ids.ts`. Built in a worker on first use (≈0.3–1.5 s
  headless), cloned per person.
- **Cloth that moves** (`src/characters/cloth.ts`, `CharacterDef.cloth`;
  founder: "The ghost and witch should have fabric motion, right?"). The ghost's
  sheet and the witch's skirt, shawl and hair were skinned rigidly to their
  bones. Now each has secondary motion: a ring of eight spring particles round
  its hem, each tied to where its hem point would be if rigid on its bone (the
  pelvis; the chest for the shawl and the hair's tips), lagging, overshooting
  and settling (a damped spring of its own frequency, 1.1–1.8 Hz, damping
  0.22–0.3) with air drag trailing a walk; how far each lies off its place,
  carried into the bone's bind frame, displaces the cloth in the vertex shader
  before skinning, none at its top, all at the hem, softly saturated at a
  maximum (5–7 % of the costume's height). Per wearer (each costume's own
  uniforms), and the pyramid's clones swing too. Replayed on recorded people
  (`scripts/cloth-sim.test.ts`): standing still, the hem moves 0.1–0.7 % of the
  costume's height (the tracker's tremble and a hand-held phone: under a
  centimetre), changing under 0.1 % a frame; walking, 1.8–3.9 % at the median
  and 4.8–6.7 % at the 95th percentile. Held shapes (rest, swung, twisted:
  `scripts/cloth-shots.mjs`) show no seam or tear. How it reads in motion on a
  phone is not yet seen.
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
  never more than 4° a frame). **The expressions are read from the mesh's
  shape** (`pose/facegeo.ts`; founder: "more responsive to actual deformation
  of the mesh"): in a frame on the rigid upper face, in outer-eye-corner spans,
  the lips' gap, each lid's opening, each mouth corner's lift, the mouth's
  width, each brow's inner and outer height, each iris across its eye, the chin
  across the face — each relative to the person's own resting face (their first
  reading, the mouth shut and eyes open as MediaPipe's canonical face model has
  them, then learnt over seconds; the open eye quickly, the mouth slowly), so a
  resting frown or a held scowl levels out and changes surface (founder: "Just
  do relative plus smoothing"). The blendshape scores only fill in what the
  mesh cannot say (a puffed cheek, a wrinkled nose). **The face is carried
  onto the costume's** (`render/facemap.ts`; founder: "Not expression
  triggers. Mappings … Performance transfer"): 23 mesh points (mouth corners,
  lips, cheeks, nostrils, brows, chin, jaw) move against their own learnt rest
  (`FaceMotion`), and a map from the human face's frame to the costume's — its
  eyes on the person's eyes, its mouth (`face.mouth`, else where a face's would
  be) on the mouth — lays that movement on the costume's surface as a smooth
  field, in every one of its materials' vertex shaders before skinning (fur
  follows: the coat is the body pushed out); rigid parts on the head move whole
  by the field where they stand (bent, Violet's glasses buckled). Where a costume
  opens its jaw by a bone, the lower lip's and chin's up-and-down are left to
  it. Lids and pupils stay the costumes' own rigs, read from the mesh. Lab:
  `lab.html?c=<id>&focus=head&ctl=smile|scowl|o|raise` (or
  `ctl=mouthL:0,0.08,0;…`). On real meshes of a smiling portrait the scores called both
  eyes 27 % blinked, the mesh open; on an eye painted shut the scores read 0.57
  against 0.24, the mesh 1.00 against 0.00. Gains are assumed from typical
  faces, not measured on live ones. Into `FaceState` (`characters/build.ts`):
  jaw, blinks, squints, wide eyes, gaze, per-side smiles and brows, frown,
  pucker, funnel, sideways jaw, puff, sneer. Smoothed by EMA, quick for the jaw
  and blinks. A face not read
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
  `rig.setJaw`, sideways too) and, if settings ask (off by default since
  2026-11-01), breathes sparks (`render/breath.ts`, colours, rate and speed per
  costume: `face.breath`; sparks fade within half a metre of the lens and never
  grow past a tenth of the frame). **Googly eyes**
  (`render/googly.ts`) go on the person's eyes, or over the costume's
  (`face.eyes` anchors on the head bone); their pupils are physics in
  eye-radius units — gravity from the floor's up, the eye's own acceleration
  (smoothed, with a dead zone so a still head does not buzz), rim bounces. The
  lab shows any face: `lab.html?c=<id>&focus=head&face=blinkL:1,lookX:0.8&jaw=0.6&head=20,0,10`.
- **Hands** (`src/pose/hands.ts`, settings → Hand tracking, on by default;
  founder, 2026-11-02: "Some of our characters have hands.. we should be doing
  hand tracking", sign-language clips as the test material). MediaPipe
  HandLandmarker (21 points a hand; `public/models/hand_landmarker.task`,
  7.8 MB, loaded in the background after Start), read from a crop round each
  wrist the pose model points at, as faces are — up to two crops a frame, the
  longest-waiting first, 10 ms budget, only for costumes with hands. Measured
  headless on two WLASL sign clips, one NSL clip and a yoga still
  (`scripts/hand-probe.mjs`): the crop found the hand on every frame whose
  wrist the pose model read as visible on the near clips (52/63, 40/40), its
  wrist within 0.05 of the crop's side of the pose model's at the median; with
  the clip shrunk to 0.4× (a far signer) 42 of 42 against 30 on the whole
  frame; on the still, arms out and the hands small, the crops found both and
  the whole frame neither. A hand is a frame (across the knuckles, along the
  hand) and five curls (each finger's bends square to the knuckles' line, over
  a fist's). Smoothed (slerp, EMA); between readings it rides the forearm;
  unread for half a second it eases onto the pose model's own hand points for
  which way it points (its twist kept: their twist was 90° off the hand
  model's on a sign clip), and with none of those the wrist goes straight.
  Every character has a hand bone on each forearm (`sdf.ts withHands`,
  appended; `CharacterDef.hands`), which takes only skin its forearm may (the
  capture rule asked as the forearm: no thigh by a hanging hand, a test). The
  rig turns it after the reach (`rig.setHands`): exact within the wrist's
  bend, eased toward 85°, its twist half taken by the forearm so the wrist
  does not wring. Fingers: SDF hands (gloves, mittens, claws, the mechs'
  blocks) bend past their knuckle line toward the palm in the vertex shader
  before skinning (`characters/curl.ts`: each finger's curl by where a point
  lies across the hand, never tighter than the hand is thick); Skelly's and
  Catrina's bone hands are jointed (`characters/bonehand.ts`: each phalanx on
  its own pivot, knuckle 80°, middle 100°, last 65° at a fist). The witch's
  broom, Unison's sword and the scarecrow's straw ride the hand. The reach aims
  a forearm at the hand model's wrist where it has one. The lab poses hands:
  `lab.html?c=skeleton&pose=hands|wrists&focus=handL&curl=1`.
  `scripts/hands-e2e.mjs <clip.y4m>` runs a clip through the app headless and
  says how far each costume hand points from its reading (3–11° on the NSL
  clip). Found on the way: Skelly's and Catrina's modelled hands had their
  thumbs behind (a right hand on the left arm), unseen until a palm turned to
  the camera; and a raised hand whose elbow lay under the frame's edge left
  the costume's arm hanging, since the frame's edge zeroes the elbow — now a
  limb whose two ends are seen trusts the model's 3D for its middle
  (`limbs.ts LIMB_TUNE.chain`), and the reach aims a forearm at a seen wrist
  whatever its elbow (`REACH_TUNE.chain`). Not measured: the hand model's ms on
  a phone (headless CPU: ~80 ms a crop; the readout and the debug recording's
  `hand` ms will say).
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
  A clip carries the microphone's sound (founder, 2026-11-02: "We should always
  open the mic"): it opens at Start, after the camera, for the whole session
  (processing off, so music survives), shared by every clip and the music
  listener (which now also comes back at the next Start when left on); refused,
  it is asked again at the next clip. Recorded as H.264 with AAC where the
  browser has it (iOS Safari), else H.264 with Opus, else the browser's own
  types. A refused microphone, or a browser that will not record sound with the
  picture, still makes the clip, silent, and the recording's toast says why.
  Checked headless: the microphone open from Start and after a clip; an H.264 +
  Opus mp4 read back by ffprobe with both streams; refused, H.264 alone. Not
  checked on a phone.
- **Pipeline views** (settings → Advanced → Show depth map / Show cut-outs):
  the depth model's map over the camera's picture (metres once people calibrate
  it, near red to far blue on a log scale; the model's relative reading in grey
  before), and each tracked person's cut-out from the pose model in its channel's
  colour with the front the occlusion uses. Each runs its part of the pipeline
  (the depth model; the masks) whatever the occlusion setting, shown and not
  applied. Drawn on the overlay through the background's own crop and mirror.
- **Video metadata** (settings → Advanced; `src/capture/meta.ts`; founder:
  "a way to record a video with the right metadata to reconstruct what was raw
  and what was tracked/generated. It's the only way you're going to be able to
  debug stuff"). A clip then also records the camera's own picture (a second
  recorder on the camera's track, 4 Mbit/s) and a log, every camera frame, of
  what the pose model returned exactly (before the app's own handling) in the
  replay scripts' format, with what the tracker was handed besides (the floor's
  up, the People count, the lens) and what it and the stage made: each track's
  place, size, smoothed picture and 3D pose, verdict and face, each costume's
  scale and cloth; once, the build, the device, the camera, the settings and the
  tracker's whole state at the start (`Tracker.snapshot`). The preview offers
  "Save debug data": one zip (stored) with the clip, the camera's recording and
  the log. `META=<zip> npx vitest run scripts/meta-replay.test.ts` replays the
  log through today's tracker from that state and compares it with the phone's:
  the same code gives the same tracks (headless, real camera path: 0.001 cm, the
  log's rounding); every replay script (`stability-sim`, `legs-sim`, `body-sim`,
  `cloth-sim`…) takes the zip or its log too (`scripts/recs.ts`). Not in it: the
  cut-out masks and the face model's raw points (too big; their effects are in
  the tracks and faces logged). A 20 s clip's zip is ~30 MB; the log alone (a few
  MB) is what replays.
- **Reset to defaults** (settings, at the bottom): a first tap arms it ("Tap
  again to reset", three seconds), the second puts every setting on the panel
  back and applies each as its own control would (the detector's options, the
  pose model, smoothing, the microphone, the dancers); the costume, the mode,
  the rotation, the effect and the lens's zoom are chosen elsewhere and stay.
  Checked headless (`scripts/capture-check.mjs`).
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
- **Costumes ready before they are picked** (founder, 2026-11-02: "When we
  select and then detect a new character, there's generally a stall,
  particularly on a slow connection"). Measured: a costume is 0.5–1.9 s of a
  worker's time (headless desktop core) and 50–690 ms of the main thread's
  (meshes and props from the worker's arrays; the vampire and witch the worst),
  and its first wearing compiled its shaders (4–8 programs). They were made from
  Start, one worker, the rotation only: a pick of any other costume was made
  then (5.5 s headless). Now (`render/stage.ts`) every character is made from the
  page's load, while the start screen is up and the camera and models load —
  the chosen one, then the rotation, then the rest — on two workers where the
  phone has the cores; each gets a spare worn copy made ahead, and its shaders
  compiled where that cannot stop the picture (in the background on a GPU with
  `KHR_parallel_shader_compile`, or before Start; never while a clip records:
  headless, without the extension, a background compile froze the page for
  seconds and a clip came out with no picture). The worker's arrays are kept in
  IndexedDB per build (`characters/cache.ts`): headless, all 17 costumes made
  14.2 s after load on a first visit, 3.7 s on the next (none by a worker;
  1.9 s of main-thread assembly, the worst 0.37 s). The settings readout says how
  many are made, from the phone's copy, still to make, and whether this GPU
  compiles in the background (not known for iPhones; the debug log records it).
- **Kept on the phone** (`sw/sw.template.js`, written by the build with a
  manifest of every file and its content's hash): the page network-first (a new
  version at once; the phone's copy offline), every other file from the phone if
  it holds that content, else fetched once and kept — a changed file is fetched
  anew, an unchanged 9 MB model survives an update; the shell (page, code,
  costume worker, thumbnails) fetched at install, models kept on first use (on a
  slow connection two copies of a download would only fight); what neither this
  version nor the last needs is dropped. `scripts/offline-check.mjs`: with the
  network gone the page loads, starts and dresses someone. ~32 MB stored after
  a visit (headless; the depth model's 46 MB only if used).
- **A far person's own noise** (`pose/tracker.ts measureNoise`; the first phone
  debug recording, 2026-11-02: "a bit jiggly, but pretty good"). The phone ran
  ~10 detections a second (full model, occlusion People + things, the kaiju,
  faces); a woman seated ~8 m off, ~100 px tall in the frame, had 2.7 cm of 3D
  noise at the shoulders against 0.8–2.1 cm for people near the camera, and the
  fixed 3D bands let it through as 1–2° of turn an update. Each track now
  measures its own 3D noise (third differences of the raw pose, the median over
  a group's seen points, learned only as far as the raw pose is still: a
  walker's own motion read as noise widened every band and the street's chest
  turn went from 23–30° off to 37–46°) and its 3D bands widen to it. On her:
  the chest's turn 1.17 → 0.85° an update, the head's 2.08 → 1.81°, the arms
  1.21/0.71 → 1.00/0.64°, errors no worse; the street and the torso clips as
  before. The picture's bands stay as they were: there, a hand-held phone moves
  the person, which the costume must follow (her shoulders moved against the
  room about as much as with it). Not yet fixed: the 10 a second itself (the
  debug log now times every stage, every drawn frame).
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
| EMA ×1.5, an upright prior, the costume pinned to the picture | a Kalman filter (founder's suggestion) | replayed over five recorded clips the Kalman filter lost to the slower EMA on error and jerk, and doubled the size's jumps on depth; pinning and the prior did the most (torso-shot shoulders 20–27 px off → 3–5) |
| The head's turn from the face mesh | the pose model's ears and nose | measured: rolls within 1–2° against 7–13° off; profiles still fall back to the pose model |
| Hands from a crop round each wrist, IMAGE mode | HandLandmarker on the whole frame (VIDEO mode, its own tracking) | the crop says whose hand and which; it found a far signer's hand on 42/42 frames against 30, and a yoga still's small hands where the whole frame found none; costs a palm detection each crop (two a frame, 10 ms budget) |
| A finger curl bent in the vertex shader | finger bones in every character | one bend serves gloves, mittens, claws and blocks without re-rigging twelve characters; the two bone hands are jointed exactly |

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

- **What do the hands cost on a phone, and do they hold?** Settle by: a debug
  recording (Video metadata on) waving and signing at arm's length: the
  ticks' `hand` ms (if a frame's hand reading passes ~10 ms at the median,
  read one crop a frame), and in the log each hand's `trust` (how often the
  hand model reads it) against the frames where the wrist is in sight.

Not verified yet: anything on a real phone (frame rate, GPU delegate on iOS
Safari, recording mime on iOS, share sheet).
