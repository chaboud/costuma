# Building browser-based AR pose estimation for mobile

**TensorFlow.js MoveNet Lightning delivers 30-50 fps pose tracking on mobile browsers, enabling real-time AR overlays through static websites hosted on GitHub Pages.** This combination of lightweight pose estimation, Three.js 3D rendering, and modern WebGL acceleration makes sophisticated AR experiences possible entirely client-side, with iOS Safari requiring special handling for camera access and Android Chrome offering broader compatibility.

Browser-based pose estimation has matured significantly by October 2025, with **MediaPipe and TensorFlow.js** dominating the landscape while legacy options like face-api.js have been abandoned. The technology now runs efficiently enough on mobile devices to overlay 3D models, sprites, and animations on people in real-time, triggered by QR codes and hosted as completely static websites. Critical success factors include choosing the right pose estimation library for mobile performance, implementing iOS Safari workarounds for camera access, optimizing 3D assets aggressively (targeting under 5MB per model), and using adaptive quality systems that throttle when thermal limits are reached.

## Choose MoveNet Lightning for optimal mobile performance

**TensorFlow.js MoveNet Lightning** emerges as the best choice for full-body pose estimation on mobile devices, achieving 30-50+ fps on modern smartphones with just 17 keypoints. This outperforms alternatives: MediaPipe BlazePose Lite provides more detailed tracking with 33 keypoints but runs at only 10-20 fps on iOS Safari, while **MoveNet Thunder** offers higher accuracy at the cost of reduced speed (15-30 fps). For projects requiring face tracking specifically, **MediaPipe Face Mesh** delivers 468 facial landmarks at 15-25 fps on iOS, sufficient for face filter applications.

The **Human library by Vladmandic** provides the most comprehensive solution when you need combined face, body, and hand tracking through a unified API. This modern library supersedes the abandoned face-api.js (last updated March 2020) and offers switchable models with active maintenance through February 2025. For educational projects or rapid prototyping, **ml5.js** wraps TensorFlow.js models in a beginner-friendly interface, though with slight performance overhead.

Integration requires minimal code when using CDN delivery. Load TensorFlow.js models directly from jsDelivr for optimal global performance, as this CDN achieves sub-50ms time-to-first-byte through its multi-CDN architecture combining Cloudflare, Fastly, and Quantil. Always pin specific versions in production to prevent breaking changes from automatic updates. The typical MoveNet Lightning model weighs 5-6 MB and downloads in roughly 2 seconds on 4G networks, cached permanently after first load.

Key performance benchmarks reveal significant platform disparities. On desktop Chrome, MoveNet Lightning consistently hits 50+ fps, while **iOS Safari caps around 30-50 fps** due to WebGL limitations and the "GPU Process: WebGL" setting that degrades performance when enabled. Android Chrome performs between these extremes at 40-50+ fps. iOS Safari's inferior performance stems from Apple's conservative approach to GPU acceleration and memory management, with devices sometimes experiencing only 50% of Android's frame rates for identical code.

## Master iOS Safari's camera access requirements

iOS Safari demands specific video element attributes that don't affect other browsers but cause complete failure on iOS without them. The **playsinline attribute proves absolutely essential**—without it, video plays in iOS's native fullscreen player, breaking AR overlay positioning entirely. Combine this with autoplay and muted attributes in your video setup. Multiple getUserMedia calls kill existing streams permanently on iOS, so get one master stream and clone it for different uses rather than requesting camera access repeatedly.

iOS Safari restricts WebRTC APIs exclusively to Safari proper, meaning Chrome on iOS, Firefox on iOS, in-app browsers, and even **PWA standalone mode all fail to access the camera**. This architectural limitation stems from Apple requiring all iOS browsers to use WKWebView, which lacks WebRTC support outside Safari itself. For production AR experiences, direct users to open links specifically in Safari on iOS devices.

Permission handling differs substantially between platforms. iOS Safari doesn't persist permissions by default until iOS 13+, requiring users to grant access each session initially. iOS 13 introduced per-site permissions accessible via the "AA" icon in the address bar under Website Settings → Camera: Allow. iOS 17 added a global setting at Settings → Safari → Camera, though per-site permissions remain the privacy-respecting default. Android Chrome, conversely, remembers user choices per-origin and provides clear management through Chrome → Settings → Site Settings → Camera.

Critical iOS-specific bugs require workarounds. Device IDs regenerate randomly on every page load for fingerprinting prevention—store both deviceId and device.label, matching by label on subsequent loads. Call getUserMedia before enumerateDevices to see actual camera devices, as iOS hides them until permission is granted. Memory crashes occur frequently on older iPhones (6/7 models) with intensive WebRTC, particularly on iOS 11-12, improved but not eliminated in later versions. The iOS 15.2 camera switching bug broke facingMode changes, patched in later releases but illustrating iOS Safari's ongoing instability for WebRTC.

For reliable camera initialization across platforms, always stop existing stream tracks completely before switching cameras, explicitly set facingMode to "user" or "environment" rather than relying on defaults, and implement conservative memory budgets—limit processing resolution to maximum 640×480 on iOS, throttle pose estimation to 15-20 fps, and proactively release resources when switching contexts. Monitor performance degradation with RequestAnimationFrame timestamps and reduce quality automatically when frame times exceed targets.

## Optimize 3D rendering with aggressive compression and LOD

Three.js integration with pose estimation requires mapping 2D/3D landmark coordinates to 3D model skeleton rotations. MediaPipe Pose provides 3D coordinates (x, y, z) for 33 body keypoints, but bones need rotation angles rather than positions. Calculate these by constructing direction vectors between joints and converting to quaternions through lookAt methods. Critical: call updateMatrixWorld after lookAt operations for proper worldToLocal transformations.

**Inverse kinematics libraries** simplify pose-to-skeleton mapping significantly. THREE.IK uses the FABRIK solver for fast, iterative IK solving with ball-joint constraints, while CCDIKSolver (built into Three.js addons) implements Cyclic Coordinate Descent for SkinnedMesh objects. Apply IK to limbs (arms, legs) that need to reach specific positions from pose landmarks, while keeping the spine and torso as forward kinematics for better artistic control. This hybrid FK/IK approach balances realism with predictable behavior.

**ASTC texture compression** delivers the best quality-to-size ratio for mobile devices as of October 2025, with universal support on modern Android and iOS devices from 2020 onward. ASTC 6x6 blocks (3.6 bits per pixel) provide excellent balance between quality and size, while ASTC 8x8 enables aggressive compression at 2 bpp with visible but acceptable artifacts. For comparison, ASTC achieves approximately 1.5 dB better quality than PVRTC or BC1 formats and 0.7 dB better than ETC2 at equivalent bitrates. Check for WEBGL_compressed_texture_astc extension support and fall back to ETC2 (mandatory in OpenGL ES 3.0) or ETC1 for older devices.

Mobile polygon budgets require discipline. Target **50,000-100,000 total visible triangles** for smooth 30 fps performance on mid-range devices, with individual objects staying under 100,000 polygons as an industry standard. However, draw calls matter more than raw polygon count—aim for fewer than 100 draw calls per frame by batching static geometry, using instancing for repeated objects, and minimizing unique materials since each typically triggers a new draw call. Check renderer.info.render.calls to monitor this critical metric.

Level-of-detail systems prove essential for mobile performance. Three.js LOD objects switch meshes at specified distances: high detail (100% triangles, 4k-8k textures) from 0-50 units, medium detail (30-50% triangles, 1k-2k textures) from 50-300 units, low detail (10-20% triangles, 512px textures) from 300-1000 units, and impostor quads beyond that. Use SimplifyModifier to programmatically reduce geometry, targeting 30% of original vertices for medium LOD. Call lod.update(camera) in your render loop to activate distance-based switching.

For shader optimization on mobile GPUs, prefer vertex shader work over fragment shaders since fragment shaders run exponentially more times. Always use built-in GLSL functions like dot, mix, and normalize rather than custom implementations—hardware has specialized instructions for these. Avoid conditional branching (if statements) in shaders, using single optimized shader paths instead. Set precision annotations carefully: mediump suffices for most mobile calculations, lowp works for samplers, reserve highp only for positions and normals where precision matters.

## Implement adaptive quality and performance monitoring

Throttle pose estimation separately from rendering to maintain smooth visual updates even when inference lags. Run pose detection at 15-30 fps while rendering at full frame rate (30-60 fps), interpolating poses between updates. This decoupling prevents jitter when estimation occasionally takes longer than one frame:

```javascript
let lastPoseUpdate = 0;
const POSE_INTERVAL = 33; // 30fps

function animate(timestamp) {
  if (timestamp - lastPoseUpdate >= POSE_INTERVAL) {
    updatePoseEstimation();
    lastPoseUpdate = timestamp;
  }
  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

Track frame times to detect performance degradation and thermal throttling. Maintain a rolling window of the last 60 frame deltas, calculate average FPS, and adjust quality settings when FPS drops below thresholds for sustained periods. When detecting consecutive frame drops (10+ frames exceeding target time), reduce target FPS from 30 to 25 to 15, lower pose model complexity from high to medium to low, or decrease processing resolution from 640×480 to 480×360 to 320×240.

**OffscreenCanvas** moves rendering off the main thread, preventing UI jank from heavy 3D calculations. Supported in Chrome, Firefox, and Safari 17+ (iOS 17+), it requires transferring canvas control to a Web Worker. Check for 'OffscreenCanvas' in window before attempting transfer. Workers can't access DOM directly, so implement message passing for events and state updates. ImageBitmapLoader works in workers while standard image loading doesn't, requiring code adjustments.

Multi-layer canvas architecture improves performance by separating update frequencies. Render video feed to a background canvas (can skip frames), pose landmarks to a middle canvas (updates frequently), and overlays to a top canvas (only when switching costumes). This prevents redrawing static or slowly-changing content unnecessarily. CSS will composite the layers efficiently with GPU acceleration.

Memory management requires explicit cleanup on WebGL and WebAssembly resources since JavaScript garbage collection doesn't handle them automatically. Call dispose on geometries, materials, and textures when removing objects. For entire scene cleanup, traverse the scene graph calling dispose on every object's geometry and materials (handling both single materials and material arrays). MediaPipe models require explicit close methods to release WASM memory—skipping this causes accumulating memory leaks.

Target 30 fps instead of 60 fps on mobile for AR experiences unless the application specifically benefits from doubled frame rate (fast-paced games, competitive interactions). The **30 fps target cuts battery drain by approximately 50%**, reduces thermal throttling significantly, and provides 33ms per frame instead of 16ms for game logic and inference. User studies show 30 fps appears smooth enough for AR overlays and pose-driven animations, with the performance and battery benefits outweighing the subjective smoothness improvement of 60 fps.

## Structure your project with proven implementation patterns

Several production-quality examples demonstrate successful implementations. The akbartus/Yolov8-Pose-Detection-on-Browser repository showcases vanilla JavaScript with ONNX and TensorFlow.js, no frameworks required, with all code in single HTML files for educational clarity. Sheeborshee/AR-body-filters implements real-time PoseNet-based body filters. Official MediaPipe documentation at developers.google.com/mediapipe provides canonical JavaScript examples for pose, face mesh, and hands solutions with detailed API references.

**html5-qrcode** dominates QR scanning implementations with 95+ projects using it. The library supports both camera scanning and file uploads with built-in UI or low-level API access, working cross-platform on iOS 15.1+, Android, and desktop browsers. Implement QR code triggers by having codes contain URLs with parameters (https://yoursite.com/ar?overlay=skeleton&camera=environment), parsing those parameters on page load, and initializing the appropriate AR experience. Store configuration in sessionStorage during the scan-to-experience transition.

Bottom sheet UI patterns provide mobile-friendly overlay selection. Implement swipe-up gesture handlers on a handle element positioned at the bottom, support Android back button through popstate events, and use CSS transforms (translateY) for smooth 60fps animations via GPU compositing. Display overlay thumbnails in a grid with lazy-loaded images, implement tap-to-activate switching, and show loading states while new assets download.

State management without frameworks uses a lightweight pub/sub pattern. Create a StateManager class maintaining state objects and listener arrays, with setState methods that notify subscribers of specific key changes. This provides reactive updates without framework overhead, suitable for the relatively simple state requirements of AR experiences (current overlay, camera mode, quality level, UI visibility).

Asset loading should implement caching and lazy loading. Create an AssetLoader class maintaining a cache Map of loaded images/models and a loading Map of in-progress requests to avoid duplicate fetches. Provide preloadOverlays for high-priority assets and lazy loading for others. Use the Image API for 2D assets and GLTFLoader for 3D models, with loading progress callbacks to update UI indicators.

Camera management requires platform-specific handling. Create a CameraManager class wrapping getUserMedia calls, storing the current stream and facing mode. Provide methods for start (with facing mode), stop (releasing all tracks), and switchCamera (stopping old stream before requesting new one). Return promises that resolve when video metadata loads and playback begins, allowing callers to await camera readiness before starting pose estimation.

Error handling needs graceful degradation. Catch NotAllowedError (permission denied), NotFoundError (no camera), NotReadableError (camera in use), and OverconstrainedError (unsupported constraints), displaying user-friendly messages for each. Show loading states during model initialization (2-5 seconds), provide fallback UI when pose detection fails (low confidence or no person detected), and implement offline support through service workers caching critical assets.

## Acquire free assets and optimize hosting

**Mixamo** provides the largest collection of free rigged characters with automatic rigging service and 2,000+ motion capture animations (walking, dancing, idle, fighting). Export as FBX and convert to GLB/GLTF through Blender or online converters since Mixamo doesn't offer GLB export directly. Licensing permits both personal and commercial use without attribution requirements.

**Sketchfab** offers direct GLB downloads with filtering by rigged models and Creative Commons licenses (CC0, CC-BY, CC-BY-SA). Search for "rigged" or "mixamo" tags to find pose-ready characters. Download options include native GLB (recommended for web), GLTF, FBX, and OBJ formats. The platform hosts meme-friendly models like Rick Astley, Mario characters, and popular game/movie characters, often under permissive licenses.

**GLB/GLTF 2.0 format** represents the optimal choice for web 3D, designated the "JPEG of 3D" by the industry. GLB packages everything (geometry, materials, textures, animations) in a single binary file, while GLTF separates JSON from external resources. Three.js GLTFLoader provides native support with straightforward integration. The format preserves PBR materials, skeletal animations, and morph targets while maintaining smaller file sizes than FBX through efficient binary encoding.

Compress models aggressively for mobile delivery. Online tools like compress-glb.com, optimizeglb.com, and 3dmodel.tools/glb-gltf-compressor achieve 50-90% size reduction through Draco mesh compression, texture conversion to WebP, resolution reduction, and unused data removal. Target under 5MB per model for reasonable mobile load times. The gltfpack command-line tool from meshoptimizer provides the most control with options like -cc for Draco compression and -tc for KTX2 texture conversion with Basis supercompression.

**jsDelivr CDN** outperforms alternatives for MediaPipe and TensorFlow.js delivery, achieving sub-50ms TTFB globally through multi-CDN architecture combining Cloudflare, Fastly, and Quantil with automatic fallback. The CDN provides near-zero error rates, excellent China coverage, and direct npm/GitHub integration with file minification and ES module optimization. Always pin versions in production (jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404) rather than using @latest, as pinned versions cache for one year versus only seven days for unpinned URLs.

**GitHub Pages** offers the simplest static hosting with automatic HTTPS for .github.io domains and custom domain support via Let's Encrypt (required for camera access). Limits include 1GB recommended repository size, 1GB maximum published site size, 100GB monthly bandwidth soft limit, and 10 builds per hour (though this doesn't apply to GitHub Actions workflows). Configure GitHub Actions for automated builds from source code, with static assets deployed to gh-pages branch.

**Cloudflare Pages** provides superior performance for high-traffic sites with unlimited bandwidth on the free tier, 300+ global edge locations delivering the fastest worldwide TTFB, and 500 builds per month. The platform integrates with Cloudflare Workers for edge compute and supports custom headers unlike GitHub Pages. Trade-offs include 25MB maximum file size (rarely an issue with compressed assets) and less polished UI compared to Netlify or Vercel. Migrate from GitHub Pages to Cloudflare Pages when bandwidth becomes a concern or you need maximum global performance.

**Vite** dominates modern static site building with lightning-fast dev server using native ES modules, instant hot module replacement, and minimal configuration. The tool handles Three.js perfectly and includes production optimization automatically. Configure base path for GitHub Pages deployment (base: '/repo-name/') and build outputs to dist folder. Alternative tools include Parcel for zero-config prototyping and Webpack for complex enterprise requirements, though Vite's speed and simplicity make it the default choice for new projects in 2025.

## Navigate platform differences and deployment

Development requires HTTPS for camera access, but localhost exemption allows local testing. For mobile device testing, use **ngrok** to create HTTPS tunnels (ngrok http 3000) providing public URLs like https://abc123.ngrok.io accessible from any device. Alternative approaches include mkcert for local self-signed certificates (requires installation on test devices) or Chrome flags to treat specific origins as secure (chrome://flags/#unsafely-treat-insecure-origin-as-secure), though this only works on the configured device.

Remote debugging tools prove essential for mobile development. Chrome on desktop can debug Android Chrome through chrome://inspect, Safari Web Inspector debugs iOS Safari (Mac only), and **Eruda** provides an in-browser console accessible on any platform by adding a script tag. Test on actual devices rather than emulators when possible, as camera access and WebGL performance differ substantially from simulated environments.

iOS Safari video playback requires specific attribute combinations that Android Chrome ignores but iOS demands. Set playsinline to prevent fullscreen native player, autoplay to start without user interaction, and muted to satisfy autoplay policies. Use pagehide event instead of beforeunload for cleanup on iOS since Safari doesn't fire beforeunload reliably. Detect iOS with /iPad|iPhone|iPod/.test(navigator.platform) and adjust event listeners accordingly.

Handle device orientation changes by listening for both orientationchange and resize events, recalculating canvas dimensions and camera aspect ratios, and updating Three.js camera projection matrices. iOS Safari swaps video dimensions when rotating (480×640 becomes 640×480), so adjust overlays dynamically based on actual video dimensions rather than assuming fixed aspect ratios. Implement orientation locking where appropriate for better UX (Screen Orientation API), though this has limited support.

Production deployment should implement service workers for offline capability, caching ML models (20-50MB), AR assets, and application code for instant subsequent loads. Service workers cannot access camera directly—getUserMedia only works in window context—but can cache everything else. Use network-first strategy for API calls and cache-first for static assets. Note that iOS PWA standalone mode blocks camera access entirely, so ensure users stay in Safari browser for AR functionality.

Performance monitoring in production tracks FPS through frame time deltas, monitors memory usage via performance.memory API (Chrome only), logs model load times and errors, and records user interactions (overlay switches, screenshots). Implement adaptive quality that automatically reduces model complexity or resolution when sustained performance degrades, logs the adjustments for later analysis, and presents options for users to manually override quality settings.

## Key implementation checklist

Start with a minimal viable implementation: initialize camera with appropriate constraints for mobile (1280×720, 30fps target, environment facing mode for rear camera), load MoveNet Lightning via CDN for fastest mobile performance, set up canvas for video and overlay rendering, implement basic pose landmark visualization, and add simple sprite overlay positioned at nose or shoulders. This core loop provides immediate feedback and validates the technical stack before adding complexity.

Add AR features incrementally: implement QR code scanning with html5-qrcode for entry flow, create bottom sheet UI for overlay selection with touch-friendly tap targets, integrate Three.js for 3D model rendering if needed beyond sprites, implement camera switching between front/environment cameras, add screenshot and share functionality using canvas.toBlob and navigator.share API. Each feature builds on the stable foundation rather than attempting everything simultaneously.

Optimize for production deployment: compress 3D models below 5MB each using online tools, implement texture compression (ASTC/ETC2) for faster loading, set up LOD systems for complex scenes with multiple quality levels, add adaptive quality management reducing settings under sustained low FPS, and enable service worker caching for offline capability. Monitor performance in production with error tracking and FPS logging.

Test across target platforms systematically: iOS Safari 15+ on real iPhones (required, simulators insufficient), Android Chrome on mid-range devices (Pixel, Samsung), desktop Chrome/Firefox/Safari for development, and various screen sizes and aspect ratios. Verify camera permissions work correctly, test QR code scanning under different lighting, confirm overlay positioning at various angles and distances, measure battery usage over 15+ minute sessions, and validate memory doesn't leak during extended use.

Deploy to GitHub Pages initially for simplicity (automatic HTTPS, familiar workflow, adequate for most projects), then migrate to Cloudflare Pages if bandwidth or global performance becomes important (unlimited bandwidth, 300+ edge locations). Pin library versions in production to prevent automatic updates from breaking functionality, implement proper error handling and loading states throughout the user flow, and provide clear instructions for iOS users to use Safari specifically since other browsers on iOS fail to access camera.

The technology stack has matured sufficiently by October 2025 that browser-based AR pose estimation runs reliably on modern mobile devices when implemented with platform-specific optimizations and conservative performance targets.