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