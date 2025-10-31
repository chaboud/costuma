// Global variables
let scene, camera, renderer, video, canvas;
let poseLandmarker;
let isInitialized = false;
let currentCostume = 'rick_astley';
let costumePool = [];
let animationId;
let lastPoseResults = [];

// Create a hidden canvas for PoseNet input
let inputCanvas, inputCtx;

// Debug and smoothing
let debugMode = false;
let smoothingEnabled = false;
let smoothedPoses = [];

// Asset loaders
let textureLoader;
let gltfLoader;
let assetsLoaded = false;

// Performance monitoring
let lastTime = 0;
let frameCount = 0;
let fps = 0;

// Settings
let settings = {
    quality: 'medium',
    maxPeople: 3,
    useFrontCamera: true
};

// Quality configurations
const qualityConfigs = {
    low: { width: 480, height: 360, poseInterval: 50 },
    medium: { width: 640, height: 480, poseInterval: 33 },
    high: { width: 1280, height: 720, poseInterval: 25 }
};

// Costume types
const costumes = ['none', 'rick_astley', '3d_robot', 'face_mask', 'skeleton'];

// DOM elements
const startScreen = document.getElementById('start-screen');
const arInterface = document.getElementById('ar-interface');
const startBtn = document.getElementById('start-btn');
const loading = document.getElementById('loading');
const fpsCounter = document.getElementById('fps-counter');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkBrowserSupport();
});

function checkBrowserSupport() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support camera access. Please use a modern browser.');
        return;
    }

    // Check for iOS Safari specific requirements
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS && !isSafari) {
        alert('For best results on iOS, please open this in Safari browser.');
    }
}

function setupEventListeners() {
    startBtn.addEventListener('click', initializeApp);

    // Costume selection
    document.querySelectorAll('.costume-item').forEach(item => {
        item.addEventListener('click', () => {
            const costume = item.dataset.costume;
            selectCostume(costume);
        });
    });

    // Random costume
    document.getElementById('randomize-btn').addEventListener('click', () => {
        const randomCostume = costumes[Math.floor(Math.random() * costumes.length)];
        selectCostume(randomCostume);
    });

    // Debug mode
    document.getElementById('debug-btn').addEventListener('click', toggleDebugMode);

    // Smoothing toggle
    document.getElementById('smoothing-btn').addEventListener('click', toggleSmoothing);

    // Camera flip
    document.getElementById('flip-camera-btn').addEventListener('click', flipCamera);

    // Quality settings
    document.getElementById('quality-btn').addEventListener('click', openQualityModal);
    document.getElementById('close-quality-modal').addEventListener('click', closeQualityModal);
    document.getElementById('quality-select').addEventListener('change', (e) => {
        settings.quality = e.target.value;
        applyQualitySettings();
    });
    document.getElementById('max-people-select').addEventListener('change', (e) => {
        settings.maxPeople = parseInt(e.target.value);
    });
}

function selectCostume(costume) {
    currentCostume = costume;

    // Update UI
    document.querySelectorAll('.costume-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-costume="${costume}"]`).classList.add('active');
}

function openQualityModal() {
    document.getElementById('quality-modal').classList.remove('hidden');
}

function closeQualityModal() {
    document.getElementById('quality-modal').classList.add('hidden');
}

async function initializeApp() {
    try {
        startBtn.disabled = true;
        startBtn.textContent = 'Starting...';

        // Hide start screen and show AR interface
        startScreen.classList.add('hidden');
        arInterface.classList.remove('hidden');

        // Initialize camera
        await initializeCamera();

        // Initialize Three.js
        initializeThreeJS();

        // Initialize MediaPipe
        await initializeMediaPipe();

        // Wait for assets to load
        while (!assetsLoaded) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Hide loading and start the main loop
        loading.classList.add('hidden');
        startMainLoop();

        isInitialized = true;

    } catch (error) {
        console.error('Initialization failed:', error);
        alert('Failed to initialize. Please check camera permissions and try again.');

        // Reset to start screen
        arInterface.classList.add('hidden');
        startScreen.classList.remove('hidden');
        startBtn.disabled = false;
        startBtn.textContent = 'Start Camera';
    }
}

async function initializeCamera() {
    video = document.getElementById('video');

    const config = qualityConfigs[settings.quality];
    const constraints = {
        video: {
            width: { ideal: config.width },
            height: { ideal: config.height },
            facingMode: settings.useFrontCamera ? 'user' : 'environment',
            frameRate: { ideal: 30 }
        }
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;

        return new Promise((resolve, reject) => {
            video.onloadeddata = () => {
                video.play();

                // Wait for video dimensions to be available
                const checkDimensions = () => {
                    if (video.videoWidth > 0 && video.videoHeight > 0) {
                        // Set up input canvas for PoseNet
                        inputCanvas = document.createElement('canvas');
                        inputCtx = inputCanvas.getContext('2d');
                        inputCanvas.width = video.videoWidth;
                        inputCanvas.height = video.videoHeight;
                        resolve();
                    } else {
                        setTimeout(checkDimensions, 100);
                    }
                };
                checkDimensions();
            };
            video.onerror = reject;
        });
    } catch (error) {
        console.error('Camera access failed:', error);
        throw new Error('Could not access camera. Please grant permission and try again.');
    }
}

function initializeThreeJS() {
    canvas = document.getElementById('canvas');

    // Scene setup
    scene = new THREE.Scene();

    // Camera setup (orthographic for 2D overlay effect)
    const aspect = canvas.clientWidth / canvas.clientHeight;
    camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 1000);
    camera.position.z = 1;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false // Disable for better mobile performance
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance

    // Video background
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    scene.background = videoTexture;

    // Initialize asset loaders
    textureLoader = new THREE.TextureLoader();

    // Wait for GLTFLoader to be available then load assets
    const waitForGLTFLoader = () => {
        if (typeof THREE.GLTFLoader !== 'undefined') {
            gltfLoader = new THREE.GLTFLoader();
            loadAssets().then(() => {
                initializeCostumePool();
                assetsLoaded = true;
            });
        } else {
            setTimeout(waitForGLTFLoader, 100);
        }
    };
    waitForGLTFLoader();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

// Asset storage
let loadedAssets = {
    rickTexture: null,
    robotModel: null,
    maskTexture: null,
    skeletonTexture: null
};

async function loadAssets() {
    try {
        // Load textures in parallel
        const [rickTexture, maskTexture, skeletonTexture] = await Promise.all([
            loadTexture('./assets/rick_astley.png'),
            loadTexture('./assets/face_mask.png'),
            loadTexture('./assets/skeleton.png')
        ]);

        loadedAssets.rickTexture = rickTexture;
        loadedAssets.maskTexture = maskTexture;
        loadedAssets.skeletonTexture = skeletonTexture;

        // Load robot model
        loadedAssets.robotModel = await loadGLTF('./assets/robot.glb');

        console.log('All assets loaded successfully');
    } catch (error) {
        console.error('Failed to load assets:', error);
        // Fall back to placeholder textures
        loadedAssets.rickTexture = createPlaceholderTexture('🕺', '#ff6b6b');
        loadedAssets.maskTexture = createPlaceholderTexture('🎭', '#4ecdc4');
        loadedAssets.skeletonTexture = createPlaceholderTexture('💀', '#ffffff');
    }
}

function loadTexture(url) {
    return new Promise((resolve, reject) => {
        textureLoader.load(
            url,
            resolve,
            undefined,
            reject
        );
    });
}

function loadGLTF(url) {
    return new Promise((resolve, reject) => {
        gltfLoader.load(
            url,
            (gltf) => resolve(gltf.scene),
            undefined,
            reject
        );
    });
}

function initializeCostumePool() {
    const poolSize = 10; // Support up to 10 people

    for (let i = 0; i < poolSize; i++) {
        const costumeGroup = new THREE.Group();
        costumeGroup.visible = false;

        // Rick Astley sprite
        const rickGeometry = new THREE.PlaneGeometry(0.3, 0.4);
        const rickMaterial = new THREE.MeshBasicMaterial({
            map: loadedAssets.rickTexture,
            transparent: true,
            alphaTest: 0.1
        });
        const rickMesh = new THREE.Mesh(rickGeometry, rickMaterial);

        // Robot model
        let robotMesh;
        if (loadedAssets.robotModel) {
            robotMesh = loadedAssets.robotModel.clone();
            robotMesh.scale.set(0.1, 0.1, 0.1); // Scale down for appropriate size
        } else {
            // Fallback to simple box
            const robotGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.1);
            const robotMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
            robotMesh = new THREE.Mesh(robotGeometry, robotMaterial);
        }

        // Face mask
        const maskGeometry = new THREE.PlaneGeometry(0.2, 0.15);
        const maskMaterial = new THREE.MeshBasicMaterial({
            map: loadedAssets.maskTexture,
            transparent: true,
            alphaTest: 0.1
        });
        const maskMesh = new THREE.Mesh(maskGeometry, maskMaterial);

        // Skeleton overlay
        const skeletonGeometry = new THREE.PlaneGeometry(0.4, 0.6);
        const skeletonMaterial = new THREE.MeshBasicMaterial({
            map: loadedAssets.skeletonTexture,
            transparent: true,
            alphaTest: 0.1
        });
        const skeletonMesh = new THREE.Mesh(skeletonGeometry, skeletonMaterial);

        costumeGroup.add(rickMesh);
        costumeGroup.add(robotMesh);
        costumeGroup.add(maskMesh);
        costumeGroup.add(skeletonMesh);

        // Store references for easy access
        costumeGroup.userData = {
            rick: rickMesh,
            robot: robotMesh,
            mask: maskMesh,
            skeleton: skeletonMesh
        };

        costumePool.push(costumeGroup);
        scene.add(costumeGroup);
    }
}

function createPlaceholderTexture(emoji, backgroundColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    // Background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, 256, 256);

    // Emoji
    context.font = '128px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(emoji, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

async function initializeMediaPipe() {
    try {
        console.log('Starting TensorFlow.js PoseNet initialization...');

        // Wait for TensorFlow.js to load
        while (typeof tf === 'undefined' || typeof posenet === 'undefined') {
            console.log('Waiting for TensorFlow.js and PoseNet...');
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('TensorFlow.js available, loading PoseNet model...');
        console.log('TensorFlow version:', tf.version.tfjs);

        // Detect if we should use GPU acceleration
        const useGPU = detectGPUCapability();
        console.log(`GPU detected: ${useGPU}, using ${useGPU ? 'WebGL' : 'CPU'} backend`);

        // Set backend
        if (useGPU) {
            await tf.setBackend('webgl');
        } else {
            await tf.setBackend('cpu');
        }

        // Load PoseNet model with video-compatible settings
        poseLandmarker = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width: 257, height: 257 },
            multiplier: 0.75
        });

        console.log('PoseNet model loaded successfully!');

    } catch (error) {
        console.error('TensorFlow.js initialization failed:', error);
        throw new Error('Failed to load pose detection: ' + error.message);
    }
}

function detectGPUCapability() {
    try {
        // Check for dedicated GPU
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

        if (!gl) return false;

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            console.log('GPU Renderer:', renderer);

            // Check for dedicated GPU indicators
            const hasGPU = /nvidia|amd|radeon|geforce|gtx|rtx|quadro|tesla/i.test(renderer);
            const isIntegrated = /intel|integrated|uhd|iris/i.test(renderer);

            return hasGPU && !isIntegrated;
        }

        // Fallback: check memory and performance
        const memInfo = gl.getExtension('WEBGL_lose_context');
        return true; // Default to trying GPU on unknown hardware
    } catch (error) {
        console.log('GPU detection failed, using CPU fallback');
        return false;
    }
}

function startMainLoop() {
    let lastPoseUpdate = 0;
    const poseInterval = qualityConfigs[settings.quality].poseInterval;

    function animate() {
        if (!isInitialized) return;

        animationId = requestAnimationFrame(animate);

        const now = performance.now();

        // Update FPS counter
        updateFPS(now);

        // Run pose detection at controlled interval
        if (now - lastPoseUpdate >= poseInterval) {
            detectPoses();
            lastPoseUpdate = now;
        }

        // Render scene
        renderer.render(scene, camera);
    }

    animate();
}

async function detectPoses() {
    if (!poseLandmarker || !video.videoWidth || !inputCanvas) return;

    try {
        // Draw video frame to input canvas
        inputCtx.drawImage(video, 0, 0, inputCanvas.width, inputCanvas.height);

        // Estimate pose using TensorFlow.js PoseNet
        const pose = await poseLandmarker.estimateSinglePose(inputCanvas, {
            flipHorizontal: false
        });

        // Convert PoseNet format to our expected format
        let poseResults = [];
        if (pose.score > 0.3) {
            // Convert keypoints to landmarks format
            const landmarks = pose.keypoints.map(keypoint => ({
                x: keypoint.position.x / video.videoWidth,  // Normalize to 0-1
                y: keypoint.position.y / video.videoHeight, // Normalize to 0-1
                z: 0,
                visibility: keypoint.score
            }));
            poseResults = [landmarks];
        }

        // Apply smoothing if enabled
        const finalPoses = applyExponentialSmoothing(poseResults);

        // Store for debug mode
        lastPoseResults = finalPoses;

        renderCostumes(finalPoses);
    } catch (error) {
        console.error('Pose detection failed:', error);
    }
}

function renderCostumes(allPoses) {
    // Hide all costumes first
    costumePool.forEach(group => {
        group.visible = false;
        // Hide all costume types within each group
        Object.values(group.userData).forEach(mesh => {
            mesh.visible = false;
        });
    });

    // Show debug visualization if enabled
    if (debugMode) {
        renderDebugVisualization(allPoses);
        return; // Don't show costumes in debug mode
    }

    // Don't render if costume is 'none' or assets aren't loaded yet
    if (currentCostume === 'none' || !assetsLoaded) return;

    // Render costumes for each detected person
    for (let i = 0; i < Math.min(allPoses.length, costumePool.length); i++) {
        const personLandmarks = allPoses[i];
        const costumeGroup = costumePool[i];

        if (personLandmarks.length === 0) continue;

        // Calculate position based on pose landmarks
        const position = calculateCostumePosition(personLandmarks, currentCostume);
        if (!position) continue;

        // Show and position the appropriate costume
        costumeGroup.visible = true;
        costumeGroup.position.set(position.x, position.y, position.z || 0);

        // Show the specific costume type
        const costumeMesh = getCostumeMesh(costumeGroup, currentCostume);
        if (costumeMesh) {
            costumeMesh.visible = true;
        }
    }
}

function renderDebugVisualization(allPoses) {
    // Clear any existing debug objects
    scene.children.forEach(child => {
        if (child.userData.isDebug) {
            scene.remove(child);
        }
    });

    if (!allPoses || allPoses.length === 0) return;

    // For each person detected
    for (let i = 0; i < allPoses.length; i++) {
        const landmarks = allPoses[i];
        if (!landmarks || landmarks.length === 0) continue;

        // Draw keypoints as small spheres
        landmarks.forEach((landmark, index) => {
            if (landmark.visibility > 0.5) {
                const geometry = new THREE.SphereGeometry(0.005);
                const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const sphere = new THREE.Mesh(geometry, material);

                // Convert normalized coordinates to 3D space (-1 to 1)
                sphere.position.set(
                    (landmark.x - 0.5) * 2,
                    -(landmark.y - 0.5) * 2,
                    0
                );

                sphere.userData.isDebug = true;
                scene.add(sphere);
            }
        });

        // Draw skeleton connections
        const connections = [
            [0, 1], [0, 2], [1, 3], [2, 4], // Face
            [5, 6], [5, 7], [7, 9], [6, 8], [8, 10], // Arms
            [11, 12], [5, 11], [6, 12], // Torso
            [11, 13], [13, 15], [12, 14], [14, 16] // Legs
        ];

        connections.forEach(([startIdx, endIdx]) => {
            const start = landmarks[startIdx];
            const end = landmarks[endIdx];

            if (start && end && start.visibility > 0.5 && end.visibility > 0.5) {
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(
                        (start.x - 0.5) * 2,
                        -(start.y - 0.5) * 2,
                        0
                    ),
                    new THREE.Vector3(
                        (end.x - 0.5) * 2,
                        -(end.y - 0.5) * 2,
                        0
                    )
                ]);

                const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
                const line = new THREE.Line(geometry, material);
                line.userData.isDebug = true;
                scene.add(line);
            }
        });
    }
}

function calculateCostumePosition(landmarks, costumeType) {
    if (!landmarks || landmarks.length < 5) return null;

    // PoseNet keypoint indices:
    // 0: nose, 1: leftEye, 2: rightEye, 3: leftEar, 4: rightEar
    // 5: leftShoulder, 6: rightShoulder, 7: leftElbow, 8: rightElbow
    // 9: leftWrist, 10: rightWrist, 11: leftHip, 12: rightHip
    // 13: leftKnee, 14: rightKnee, 15: leftAnkle, 16: rightAnkle

    let x, y;

    switch (costumeType) {
        case 'face_mask':
            // Use nose landmark (index 0)
            if (landmarks[0] && landmarks[0].visibility > 0.5) {
                const nose = landmarks[0];
                x = (nose.x - 0.5) * 2;
                y = -(nose.y - 0.5) * 2;
            } else {
                return null;
            }
            break;

        case 'rick_astley':
        case 'skeleton':
            // Use shoulder center for body costumes
            if (landmarks[5] && landmarks[6] &&
                landmarks[5].visibility > 0.5 && landmarks[6].visibility > 0.5) {
                const leftShoulder = landmarks[5];   // PoseNet index 5
                const rightShoulder = landmarks[6];  // PoseNet index 6
                x = ((leftShoulder.x + rightShoulder.x) / 2 - 0.5) * 2;
                y = -((leftShoulder.y + rightShoulder.y) / 2 - 0.5) * 2;
            } else {
                return null;
            }
            break;

        case '3d_robot':
            // Use hip center for robot
            if (landmarks[11] && landmarks[12] &&
                landmarks[11].visibility > 0.5 && landmarks[12].visibility > 0.5) {
                const leftHip = landmarks[11];   // PoseNet index 11
                const rightHip = landmarks[12];  // PoseNet index 12
                x = ((leftHip.x + rightHip.x) / 2 - 0.5) * 2;
                y = -((leftHip.y + rightHip.y) / 2 - 0.5) * 2;
            } else {
                return null;
            }
            break;

        default:
            return null;
    }

    return { x, y, z: 0 };
}

function getCostumeMesh(costumeGroup, costumeType) {
    switch (costumeType) {
        case 'rick_astley':
            return costumeGroup.userData.rick;
        case '3d_robot':
            return costumeGroup.userData.robot;
        case 'face_mask':
            return costumeGroup.userData.mask;
        case 'skeleton':
            return costumeGroup.userData.skeleton;
        default:
            return null;
    }
}

function updateFPS(now) {
    frameCount++;
    if (now - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (now - lastTime));
        fpsCounter.textContent = `FPS: ${fps}`;
        frameCount = 0;
        lastTime = now;
    }
}

function applyQualitySettings() {
    if (!isInitialized) return;

    const config = qualityConfigs[settings.quality];

    // Update camera constraints if needed
    const tracks = video.srcObject.getVideoTracks();
    if (tracks.length > 0) {
        tracks[0].applyConstraints({
            width: { ideal: config.width },
            height: { ideal: config.height }
        });
    }
}

function toggleDebugMode() {
    debugMode = !debugMode;
    const btn = document.getElementById('debug-btn');
    btn.style.backgroundColor = debugMode ? '#ff6b6b' : '';
    btn.title = debugMode ? 'Debug Mode: ON' : 'Debug Mode: OFF';
}

function toggleSmoothing() {
    smoothingEnabled = !smoothingEnabled;
    const btn = document.getElementById('smoothing-btn');
    btn.style.backgroundColor = smoothingEnabled ? '#ff6b6b' : '';
    btn.title = smoothingEnabled ? 'Smoothing: ON' : 'Smoothing: OFF';

    // Reset smoothed poses when toggling
    if (!smoothingEnabled) {
        smoothedPoses = [];
    }
}

function applyExponentialSmoothing(currentPoses, smoothingFactor = 0.7) {
    if (!smoothingEnabled || smoothedPoses.length === 0) {
        smoothedPoses = JSON.parse(JSON.stringify(currentPoses));
        return currentPoses;
    }

    const smoothed = [];
    for (let i = 0; i < Math.min(currentPoses.length, smoothedPoses.length); i++) {
        const currentPose = currentPoses[i];
        const smoothedPose = smoothedPoses[i];
        const newPose = [];

        for (let j = 0; j < Math.min(currentPose.length, smoothedPose.length); j++) {
            const curr = currentPose[j];
            const prev = smoothedPose[j];

            newPose.push({
                x: prev.x * smoothingFactor + curr.x * (1 - smoothingFactor),
                y: prev.y * smoothingFactor + curr.y * (1 - smoothingFactor),
                z: prev.z * smoothingFactor + curr.z * (1 - smoothingFactor),
                visibility: curr.visibility
            });
        }
        smoothed.push(newPose);
    }

    smoothedPoses = smoothed;
    return smoothed;
}

async function flipCamera() {
    if (!isInitialized) return;

    try {
        settings.useFrontCamera = !settings.useFrontCamera;

        // Stop current stream
        const tracks = video.srcObject.getVideoTracks();
        tracks.forEach(track => track.stop());

        // Start new stream with flipped camera
        await initializeCamera();

        // Update video texture
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        scene.background = videoTexture;

    } catch (error) {
        console.error('Camera flip failed:', error);
        // Revert setting on failure
        settings.useFrontCamera = !settings.useFrontCamera;
    }
}

function onWindowResize() {
    if (!camera || !renderer) return;

    const aspect = canvas.clientWidth / canvas.clientHeight;
    camera.left = -aspect;
    camera.right = aspect;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    if (video && video.srcObject) {
        const tracks = video.srcObject.getVideoTracks();
        tracks.forEach(track => track.stop());
    }
});