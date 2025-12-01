# Vibe Coding: Building Costuma with Claude Code 🎃

*A collaborative coding session documenting the creation of an AI-powered AR Halloween costume*

## The Vision
Transform a last-minute Halloween costume crisis into an opportunity to build something cool with AI. The goal: create a browser-based AR costume overlay that works on any phone, can be shared via QR code, and actually looks good.

## The Process

### Phase 1: Foundation & Setup
**Challenge**: Getting basic AR pose detection working
- Started with MediaPipe but hit WASM loading issues
- **Solution**: Switched to TensorFlow.js PoseNet for better browser compatibility
- Set up HTTPS server for camera access (required for getUserMedia)
- Created basic static site structure in `./site/`

### Phase 2: Asset Integration
**Challenge**: Loading and displaying costume assets
- Downloaded real assets: Rick Astley GIF, face mask PNG, skeleton PNG, 3D robot GLB
- **Problem**: Initial Three.js complexity was causing loading issues
- **Solution**: Created simplified `minimal-working.html` using Canvas 2D instead

### Phase 3: The Coordinate Crisis 🐛
**Major Problem**: All pose keypoints returning (0.0, 0.0) despite high confidence scores
- Spent significant time debugging coordinate system
- **Root Cause**: Video element not properly initialized when PoseNet analyzed it
- **Solution**: Canvas-based approach - draw video frames to hidden canvas before PoseNet analysis

```javascript
// The fix that changed everything:
inputCtx.drawImage(video, 0, 0, inputCanvas.width, inputCanvas.height);
const pose = await net.estimateSinglePose(inputCanvas, { flipHorizontal: false });
```

### Phase 4: Mobile Optimization
**Challenge**: Making it work great on phones
- Fixed canvas sizing for tall screens (`object-fit: cover`)
- Removed Unicode emojis from buttons (rendering issues)
- Made buttons larger and full-width for mobile
- Added safe zones (6vh) to avoid browser chrome overlap

### Phase 5: Multi-Person Magic
**Upgrade**: From single to multiple person detection
- Changed `estimateSinglePose` to `estimateMultiplePoses`
- Added support for up to 5 people simultaneously
- Each person gets their own costume overlay

### Phase 6: Smart Camera Features
**Challenge**: iOS camera switching was broken
- **Problem**: iOS Safari changes deviceIds on enumeration
- **Solution**: Use `facingMode` ('user' vs 'environment') instead of deviceId on iOS
- Added automatic camera mirroring for front-facing cameras
- Smart defaults: rear camera on mobile, front on desktop

### Phase 7: Polish & Performance
**Final touches that made it shine**:

1. **Dynamic Scaling**: Costumes scale based on shoulder distance
   ```javascript
   const shoulderDistance = Math.sqrt(/* calculate distance */);
   const scaleFactor = Math.max(0.5, Math.min(3.0, shoulderDistance / 100));
   ```

2. **Depth-Based Rendering**: People further away draw first (appear behind)
   ```javascript
   posesWithScale.sort((a, b) => a.scale - b.scale); // smallest to largest
   ```

3. **High-Quality Detection**: Upgraded to 513x513 input resolution
   ```javascript
   inputResolution: { width: 513, height: 513 } // 4x improvement
   ```

## Key Technical Decisions

### Why TensorFlow.js PoseNet over MediaPipe?
- **Reliability**: Consistent WASM loading across browsers
- **Simplicity**: Easier integration, fewer dependencies
- **Performance**: Good enough quality with better compatibility

### Why Canvas 2D over Three.js?
- **Startup Speed**: Faster initial load
- **Simplicity**: Easier debugging and iteration
- **Mobile Performance**: Lower resource usage
- **Transparency**: Better PNG alpha handling

### Why GitHub Pages?
- **Static Hosting**: Perfect for client-side-only app
- **QR Code Friendly**: Easy to share URLs
- **Free**: No hosting costs
- **HTTPS**: Required for camera access

## Problem-Solving Highlights

### The Great Coordinate Mystery 🕵️
**Symptoms**: Perfect pose detection (confidence 0.94+) but all coordinates (0,0)
**Investigation**: Added extensive debugging, checked scaling, canvas sizing
**Breakthrough**: Video element timing - PoseNet was analyzing before video was ready
**Fix**: Canvas-based frame capture ensured stable input

### iOS Camera Switching Saga 📱
**Research Phase**: Discovered iOS Safari quirks with deviceId instability
**Multiple Approaches Tried**:
1. DeviceId with fresh enumeration (unreliable)
2. Label-based detection (inconsistent)
3. FacingMode constraints (winner!)

**Final Solution**: Platform-specific camera handling
```javascript
if (isIOS && isMobile) {
    // Use facingMode for iOS reliability
    facingMode: isCurrentlyFront ? 'environment' : 'user'
} else {
    // Use deviceId for other platforms
    deviceId: { exact: currentDeviceId }
}
```

## Architecture Evolution

### V1: Complex Three.js Setup
- Multiple file architecture
- 3D scene management
- Asset loading complexity
- **Result**: Worked but slow to load

### V2: Simplified Canvas Approach
- Single HTML file (`basic-costume.html`)
- Direct Canvas 2D rendering
- Streamlined asset loading
- **Result**: Fast, reliable, mobile-friendly

### V3: Multi-Person with Depth
- Multiple pose detection
- Scale-based sorting
- Dynamic rendering order
- **Result**: Professional AR experience

## Performance Optimizations

1. **Input Resolution Tuning**: 257x257 → 513x513 for better accuracy
2. **Canvas Sizing**: Match video dimensions exactly (1:1 coordinate mapping)
3. **Efficient Rendering**: Clear canvas once, draw all people in depth order
4. **iOS Optimizations**: FacingMode over deviceId, proper stream cleanup

## UI/UX Insights

### Button Design Evolution
- Started with emoji-heavy buttons → Unicode rendering issues
- Small buttons → Too hard to tap on mobile
- Inline layout → Full-width responsive flex layout
- **Final**: Clean text buttons with backdrop blur and proper touch targets

### Camera Experience
- Auto-detection of front vs rear camera
- Automatic mirroring for natural selfie experience
- One-button camera switching
- Visual feedback for camera changes

### Costume Selection
- Started with "None" option → Removed (why turn off the fun?)
- Added "Hello!" as mystery Rick Roll option
- Debug mode toggle for developers
- **Result**: 5 costume options + debug mode

## What We Learned

### About AI Collaboration
- **Claude Code excels** at rapid iteration and debugging
- **Multiple AI perspectives** provided valuable initial direction
- **Real-time problem solving** works better than big upfront planning

### About Browser AR
- **Camera APIs are tricky** but powerful when working
- **iOS Safari has specific quirks** that require platform-specific handling
- **Canvas 2D is often better** than WebGL for simple overlays
- **Mobile performance matters** - optimization is key

### About Building Fast
- **Start simple, add complexity** - minimal working version first
- **Debug extensively** - pose detection coordinate issues took time to solve
- **Test on real devices** - iOS behavior different from desktop
- **Polish matters** - small UX improvements make huge difference

## Files Created

### Core Application
- `site/basic-costume.html` - Main optimized AR experience (6,000+ lines)
- `site/index.html` - Full-featured version with Three.js
- `site/main.js` - Complex 3D rendering logic
- `site/style.css` - Comprehensive styling

### Development & Debug Tools
- `site/debug-pose.html` - Pose detection debugging tool
- `site/minimal-working.html` - Simplified test version
- `site/https-server.js` - Local HTTPS development server

### Assets & Resources
- `site/assets/` - Costume images (Rick Astley GIF, meme faces, etc.)
- `site/qr_costuma_512.png` - QR code for mobile access
- `.gitignore` - Proper exclusions for screenshots, temp files

### Documentation
- `README.md` - Project overview and usage
- `vibe-coding.md` - This development log
- `reference/` - Original AI execution plans

## The Result

A fully functional AR costume experience that:
- ✅ Works on any modern phone browser
- ✅ Detects multiple people simultaneously
- ✅ Provides real-time costume switching
- ✅ Handles camera switching gracefully
- ✅ Scales costumes based on distance
- ✅ Renders with proper depth sorting
- ✅ Requires no app installation
- ✅ Can be shared via QR code
- ✅ Actually looks good and is fun to use!

**Total development time**: ~4 hours of focused collaboration with Claude Code

**Lines of code**: ~600 (final optimized version)

**AI models used**: Claude Code, ChatGPT 5, Gemini, Claude Opus 4.1

**Deployment**: GitHub Pages static hosting

## Lessons for Future AI Collaboration

1. **Start with the simplest version that works**
2. **Debug systematically** - console.log everything
3. **Test on target devices early and often**
4. **Platform-specific code is sometimes necessary**
5. **Performance optimization can wait until core functionality works**
6. **AI is excellent at research and rapid iteration**
7. **Real-world testing reveals issues planning cannot predict**

---

*Built with AI collaboration, debugged with persistence, and deployed with Halloween spirit.* 🎃🤖✨

## Post-Halloween Session: Refinements & New Features

### Phase 8: The Fade-In/Fade-Out Saga (Attempt #1)

**Goal**: Add smooth opacity transitions to handle detection dropouts gracefully

**Initial Implementation**:
- Added per-person opacity tracking with fade-in/fade-out
- Fade in at 0.15/frame when detected
- Fade out at 0.05/frame when lost
- 20-frame "dwell period" to keep showing people briefly after dropout
- Applied via `ctx.globalAlpha`

**The Flickering Bug** 🐛:
User reported: "I'm getting lots of fade outs/ins for things that are adjacent.. Seems wrong."

**Root Cause**: Position-based identity keys!
```javascript
// The bug:
const key = `${Math.round(nose.position.x / 100)}_${Math.round(nose.position.y / 100)}`;
```
When a person moved from x=145 to x=155, their key changed from `"1_y"` to `"2_y"`, causing:
- Old position treated as "lost" → fade out
- New position treated as "new person" → fade in
- Result: Constant flickering as you moved

**The Fix**: Stable person IDs
- Implemented `nextPersonId` counter and `previousPeopleById` Map
- Each person gets permanent ID (`person_0`, `person_1`, etc.) on first detection
- IDs preserved through proximity matching (200px threshold)
- Opacity/tracking data tied to stable ID, not position

**The Popping Bug** 🐛:
Even after the ID fix, people were "popping out of existence" instead of fading.

**Root Cause**: Two issues:
1. **Score filter**: `poses.filter(p => p.pose.score > 0.3)` was removing fading people with old/low detection scores
2. **No scale lower bound**: Scales could drop too low

**The Fix**:
```javascript
// Keep poses with good detection OR that are fading out
const validPoses = posesWithOpacity.filter(p => p.pose.score > 0.3 || p.opacity > 0);
// Add hard lower bound on scale
const scale = Math.max(0.3, smoothedScale);
```

**User Reaction**: "Okay.. this has all been hilarious." 🤦‍♂️

**Outcome**: Git reset. Fade-in/fade-out abandoned (for now).

### Phase 9: Scale Pumping Issues

**Problem**: User noticed "pumping" - rhythmic growing/shrinking of costumes

**Investigation**: The `seenScale` experiment
User tried implementing a global rolling average:
```javascript
let seenScale = 1.0;
const EMA_SEEN_SCALE = 0.1;

let rawScale = seenScale; // Default to rolling average
if (maxDist !== null) {
    rawScale = Math.max(0.2, Math.min(4.0, maxDist / 50));
    seenScale = (seenScale * (1 - EMA_SEEN_SCALE)) + (rawScale * EMA_SEEN_SCALE);
}
```

**Issues Identified**:
1. **Global, not per-person**: Multiple people at different distances fight over the same average
2. **Never resets**: Accumulates forever from session start
3. **Updated mid-loop**: Changes while processing current frame

**Better Alternative Suggested**: Use existing `observedScales` array (last 30 observations) for a windowed average instead of forever-accumulating global.

**Outcome**: Left as experiment, pumping reduced but not eliminated.

### Phase 10: Costume Sizing Refinements

**User Request**: Scale down costumes for better proportions

**Changes Made**:
- **Grumpy Cat**: 400x400 → 320x320 (0.8x) - `basic-costume.html:657-658`
- **Disaster Girl**: 480x480 → 384x384 (0.8x) - `basic-costume.html:669-670`
- **Candy/Scream**: 400x400 → 280x280 (0.7x) - `basic-costume.html:663-664`
- **Rick Roll**: 800x500 → 720x450 (0.9x) - `basic-costume.html:680-681`

### Phase 11: Adding Derpy

**User**: "Let's add the 'Derpy' character that's in the assets now... Name is actually 'Derpy'"

**Implementation Steps**:
1. **Added button** (`basic-costume.html:102`):
   ```html
   <button class="costume-btn" onclick="setCostume('derpy')">Derpy</button>
   ```

2. **Added asset loading** (`basic-costume.html:437`):
   ```javascript
   derpy: './assets/Derpy.png'
   ```

3. **Added to face costume check** (`basic-costume.html:624`):
   ```javascript
   if (costumeType === 'scream' || costumeType === 'grumpy' || costumeType === 'disaster' || costumeType === 'derpy')
   ```

4. **Initial sizing**: 320x320 (same as Grumpy Cat)

**Sizing Iterations**:
- "Let's make Derpy about 1.8x size" → 576x576
- "Let's actually go for 640..." → **640x640** (final)

### Technical Observations

**What Worked**:
- Stable person IDs solved the flickering problem elegantly
- Position-based keys were fundamentally flawed for tracking moving people
- Simple costume additions (Derpy) were straightforward once plumbing understood

**What Was Challenging**:
- Opacity/fade systems added significant complexity
- Multi-person tracking with ephemeral data is hard
- Scale "pumping" remains partially unsolved
- Git resets were necessary when complexity spiraled

**Lessons Learned**:
1. **Identity is hard**: Position-based keys seem logical but fail with movement
2. **Test edge cases**: Filtering by score can accidentally remove valid data
3. **Complexity accumulates**: Each feature (smoothing, opacity, multi-person) interacts in unexpected ways
4. **Sometimes reset and simplify**: Git reset was the right call when things got "fucked"
5. **Iterate on sizing**: Physical testing revealed costume sizes needed refinement

### Code Quality Notes

From the user's perspective:
- The fade-in/fade-out attempt was "hilarious" (complexity got out of hand)
- Scale pumping with global `seenScale` "seems like there is still some pumping, but maaaaybe less?"
- Final state: Simpler than fade attempt, but scale smoothing could be better

### Session Statistics

**Duration**: ~2 hours of refinement work

**Features Attempted**: 2 (fade-in/fade-out, scale improvements)

**Features Completed**: 1 (new Derpy costume)

**Git Resets**: 1 (after fade-in/fade-out complexity)

**Costume Size Adjustments**: 6 total

**Bugs Fixed**: 2 major (position-based key flickering, fade-out popping)

**Current Status**: Stable but with known scale pumping issue

---

*"Okay.. this has all been hilarious."* - User reflection on the fade-in/fade-out debugging experience