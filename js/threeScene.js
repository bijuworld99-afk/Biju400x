/**
 * BIJU400X - Three.js Cinematic 3D Engine
 * Features:
 * - Procedural particle cosmos (3500+ glowing depth particles)
 * - Futuristic digital city / matrix grid
 * - Central morphing holographic cyber-core (icosahedron + orbiting rings)
 * - Volumetric lighting & depth fog
 * - Scroll-driven 3D camera cinematography
 * - Smooth mouse parallax with lerp damping
 * - Performance optimized: 60 FPS target, clamped DPR, geometry sharing
 */

class BijuThreeEngine {
  constructor() {
    this.container = document.getElementById('webgl-container');
    this.canvas = document.getElementById('webgl-canvas');
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    
    // Groups
    this.particleUniverse = null;
    this.cityGroup = null;
    this.cyberCoreGroup = null;
    this.orbitRingGroup = null;
    this.floatingShapesGroup = null;
    
    // Lights
    this.ambientLight = null;
    this.cyanLight = null;
    this.purpleLight = null;
    
    // Mouse & Animation State
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.scrollProgress = 0;
    
    // Target camera positions for scroll progression
    this.cameraWaypoints = [
      { x: 0,   y: 2,    z: 35,  rotX: 0,      rotY: 0,      rotZ: 0 },       // Hero
      { x: 10,  y: -14,  z: 28,  rotX: -0.04,  rotY: -0.2,   rotZ: 0.05 },    // Process (The 5-Stage Blueprint)
      { x: 12,  y: -30,  z: 30,  rotX: -0.05,  rotY: -0.25,  rotZ: 0.04 },    // About
      { x: -14, y: -48,  z: 32,  rotX: 0.08,   rotY: 0.28,   rotZ: -0.03 },   // Services
      { x: 0,   y: -66,  z: 24,  rotX: -0.1,   rotY: 0,      rotZ: 0 },       // Why Us
      { x: -12, y: -84,  z: 27,  rotX: 0.06,   rotY: 0.22,   rotZ: -0.04 },   // Case Studies
      { x: 8,   y: -102, z: 29,  rotX: -0.05,  rotY: -0.15,  rotZ: 0.03 },    // Testimonials
      { x: 0,   y: -120, z: 20,  rotX: 0.12,   rotY: 0,      rotZ: 0 },       // Tech Stack
      { x: 0,   y: -138, z: 32,  rotX: -0.08,  rotY: 0,      rotZ: 0 }        // Contact
    ];

    this.currentCam = { x: 0, y: 2, z: 35, rotX: 0, rotY: 0, rotZ: 0 };
    this.targetCam = { x: 0, y: 2, z: 35, rotX: 0, rotY: 0, rotZ: 0 };

    this.clock = new THREE.Clock();
    this.isInitialized = false;

    this.init();
  }

  init() {
    if (!window.THREE) {
      console.error('Three.js library is not loaded!');
      return;
    }

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0B1020, 0.018);

    // 2. Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 2, 35);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x0B1020, 1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // 4. Lights
    this.setupLights();

    // 5. Procedural 3D Objects
    this.buildParticleUniverse();
    this.buildDigitalCity();
    this.buildCyberCore();
    this.buildFloatingGeometries();

    // 6. Event listeners
    this.bindEvents();

    this.isInitialized = true;
    this.animate();
  }

  setupLights() {
    this.ambientLight = new THREE.AmbientLight(0x121B35, 1.8);
    this.scene.add(this.ambientLight);

    // Cyan Neon Light
    this.cyanLight = new THREE.PointLight(0x00E5FF, 3, 70);
    this.cyanLight.position.set(15, 10, 20);
    this.scene.add(this.cyanLight);

    // Purple Accent Light
    this.purpleLight = new THREE.PointLight(0xA855F7, 3.5, 75);
    this.purpleLight.position.set(-18, -10, 15);
    this.scene.add(this.purpleLight);

    // Dynamic Electric Blue Directional
    const dirLight = new THREE.DirectionalLight(0x4F8CFF, 1.2);
    dirLight.position.set(0, 40, 20);
    this.scene.add(dirLight);
  }

  buildParticleUniverse() {
    this.particleUniverse = new THREE.Group();
    const particleCount = 3600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color(0x00E5FF); // Cyan
    const colorB = new THREE.Color(0x4F8CFF); // Blue
    const colorC = new THREE.Color(0xA855F7); // Purple
    const colorWhite = new THREE.Color(0xFFFFFF);

    for (let i = 0; i < particleCount; i++) {
      // Cylindrical deep spatial dispersion spanning all sections
      const radius = 15 + Math.random() * 45;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 220; // Extends across the vertical scroll range
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color distribution
      const randColor = Math.random();
      let chosenColor = colorB;
      if (randColor < 0.35) chosenColor = colorA;
      else if (randColor < 0.7) chosenColor = colorC;
      else if (randColor < 0.85) chosenColor = colorWhite;

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // High performance glowing particle points
    const material = new THREE.PointsMaterial({
      size: 0.32,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    this.particleUniverse.add(particles);
    this.scene.add(this.particleUniverse);
  }

  buildDigitalCity() {
    this.cityGroup = new THREE.Group();
    const cubeCount = 55;
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);

    // Glowing wireframe + glass-like solid cubes
    for (let i = 0; i < cubeCount; i++) {
      const height = 4 + Math.random() * 18;
      const width = 1.2 + Math.random() * 2;
      const depth = 1.2 + Math.random() * 2;

      // Solid inner core
      const solidMat = new THREE.MeshBasicMaterial({
        color: 0x121B35,
        transparent: true,
        opacity: 0.65
      });
      const cubeMesh = new THREE.Mesh(boxGeo, solidMat);
      cubeMesh.scale.set(width, height, depth);

      // Wireframe outline edges
      const wireGeo = new THREE.EdgesGeometry(boxGeo);
      const wireMat = new THREE.LineBasicMaterial({
        color: Math.random() > 0.4 ? 0x00E5FF : 0x4F8CFF,
        transparent: true,
        opacity: 0.5 + Math.random() * 0.4
      });
      const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
      wireMesh.scale.set(width, height, depth);

      const columnGroup = new THREE.Group();
      columnGroup.add(cubeMesh);
      columnGroup.add(wireMesh);

      // Spread along the base of the Hero section
      const x = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 35;
      const y = -12 + height / 2;

      columnGroup.position.set(x, y, z);
      columnGroup.userData = { initialY: y, speed: 0.005 + Math.random() * 0.015, phase: Math.random() * Math.PI * 2 };

      this.cityGroup.add(columnGroup);
    }

    this.scene.add(this.cityGroup);
  }

  buildCyberCore() {
    this.cyberCoreGroup = new THREE.Group();

    // 1. Central Icosahedron Wireframe
    const icoGeo = new THREE.IcosahedronGeometry(4.5, 1);
    const icoEdges = new THREE.EdgesGeometry(icoGeo);
    const icoMat = new THREE.LineBasicMaterial({
      color: 0x00E5FF,
      transparent: true,
      opacity: 0.85
    });
    this.cyberCoreIco = new THREE.LineSegments(icoEdges, icoMat);
    this.cyberCoreGroup.add(this.cyberCoreIco);

    // 2. Glowing Inner Core Sphere
    const innerGeo = new THREE.SphereGeometry(2.2, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xA855F7,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    this.innerCoreSphere = new THREE.Mesh(innerGeo, innerMat);
    this.cyberCoreGroup.add(this.innerCoreSphere);

    // 3. Orbiting Concentric Holographic Rings
    this.orbitRingGroup = new THREE.Group();
    const ringGeo1 = new THREE.TorusGeometry(6.5, 0.05, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x4F8CFF, transparent: true, opacity: 0.6 });
    this.orbitRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.orbitRing1.rotation.x = Math.PI / 3;

    const ringGeo2 = new THREE.TorusGeometry(8.2, 0.04, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.5 });
    this.orbitRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.orbitRing2.rotation.y = Math.PI / 4;

    this.orbitRingGroup.add(this.orbitRing1);
    this.orbitRingGroup.add(this.orbitRing2);
    this.cyberCoreGroup.add(this.orbitRingGroup);

    this.cyberCoreGroup.position.set(0, 0, 0);
    this.scene.add(this.cyberCoreGroup);
  }

  buildFloatingGeometries() {
    this.floatingShapesGroup = new THREE.Group();
    const shapes = [
      new THREE.OctahedronGeometry(1.8, 0),
      new THREE.TetrahedronGeometry(1.6, 0),
      new THREE.DodecahedronGeometry(1.5, 0)
    ];

    const shapeMaterials = [
      new THREE.LineBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: 0.6 }),
      new THREE.LineBasicMaterial({ color: 0xA855F7, transparent: true, opacity: 0.6 }),
      new THREE.LineBasicMaterial({ color: 0x4F8CFF, transparent: true, opacity: 0.6 })
    ];

    // Distribute shapes down the scroll corridor (Sections 2 to 8)
    for (let i = 0; i < 24; i++) {
      const geom = shapes[i % shapes.length];
      const edges = new THREE.EdgesGeometry(geom);
      const mat = shapeMaterials[i % shapeMaterials.length];
      const shapeMesh = new THREE.LineSegments(edges, mat);

      const y = -15 - i * 5;
      const x = (i % 2 === 0 ? 1 : -1) * (10 + Math.random() * 12);
      const z = 5 + (Math.random() - 0.5) * 15;

      shapeMesh.position.set(x, y, z);
      shapeMesh.userData = {
        rotX: (Math.random() - 0.5) * 0.02,
        rotY: (Math.random() - 0.5) * 0.02,
        floatSpeed: 0.001 + Math.random() * 0.002,
        initialY: y
      };

      this.floatingShapesGroup.add(shapeMesh);
    }

    this.scene.add(this.floatingShapesGroup);
  }

  bindEvents() {
    // Window Resize & Mobile/Tablet Orientation Change
    window.addEventListener('resize', () => this.onResize(), false);
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.onResize(), 150);
    }, false);

    // Mouse Movement
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /**
   * Update scroll progress smoothly across 0 to 1
   * Maps through the 9 section waypoints seamlessly
   */
  updateScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
    const totalWaypoints = this.cameraWaypoints.length - 1;
    const scaled = this.scrollProgress * totalWaypoints;
    const index = Math.floor(scaled);
    const fraction = scaled - index;

    const p1 = this.cameraWaypoints[index];
    const p2 = this.cameraWaypoints[Math.min(index + 1, totalWaypoints)];

    // Interpolate camera target coordinates
    this.targetCam.x = p1.x + (p2.x - p1.x) * fraction;
    this.targetCam.y = p1.y + (p2.y - p1.y) * fraction;
    this.targetCam.z = p1.z + (p2.z - p1.z) * fraction;

    this.targetCam.rotX = p1.rotX + (p2.rotX - p1.rotX) * fraction;
    this.targetCam.rotY = p1.rotY + (p2.rotY - p1.rotY) * fraction;
    this.targetCam.rotZ = p1.rotZ + (p2.rotZ - p1.rotZ) * fraction;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Mouse Lerp Damping
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Smooth Camera Follow
    this.currentCam.x += (this.targetCam.x - this.currentCam.x) * 0.08;
    this.currentCam.y += (this.targetCam.y - this.currentCam.y) * 0.08;
    this.currentCam.z += (this.targetCam.z - this.currentCam.z) * 0.08;

    this.currentCam.rotX += (this.targetCam.rotX - this.currentCam.rotX) * 0.08;
    this.currentCam.rotY += (this.targetCam.rotY - this.currentCam.rotY) * 0.08;
    this.currentCam.rotZ += (this.targetCam.rotZ - this.currentCam.rotZ) * 0.08;

    // Apply mouse parallax to camera
    this.camera.position.x = this.currentCam.x + this.mouseX * 2.5;
    this.camera.position.y = this.currentCam.y - this.mouseY * 2.0;
    this.camera.position.z = this.currentCam.z;

    this.camera.rotation.x = this.currentCam.rotX - this.mouseY * 0.06;
    this.camera.rotation.y = this.currentCam.rotY - this.mouseX * 0.08;
    this.camera.rotation.z = this.currentCam.rotZ;

    // Rotate Cyber Core
    if (this.cyberCoreIco) {
      this.cyberCoreIco.rotation.y = elapsedTime * 0.25;
      this.cyberCoreIco.rotation.x = elapsedTime * 0.15;
    }
    if (this.innerCoreSphere) {
      this.innerCoreSphere.rotation.y = -elapsedTime * 0.3;
    }
    if (this.orbitRing1) {
      this.orbitRing1.rotation.z = elapsedTime * 0.35;
    }
    if (this.orbitRing2) {
      this.orbitRing2.rotation.x = elapsedTime * 0.25;
      this.orbitRing2.rotation.y = elapsedTime * 0.2;
    }

    // Dynamic Lights Orbit
    if (this.cyanLight) {
      this.cyanLight.position.x = Math.sin(elapsedTime * 0.8) * 22;
      this.cyanLight.position.y = this.currentCam.y + Math.cos(elapsedTime * 0.5) * 12;
      this.cyanLight.position.z = 15 + Math.sin(elapsedTime * 0.4) * 8;
    }
    if (this.purpleLight) {
      this.purpleLight.position.x = Math.cos(elapsedTime * 0.7) * -24;
      this.purpleLight.position.y = this.currentCam.y + Math.sin(elapsedTime * 0.6) * 14;
      this.purpleLight.position.z = 12 + Math.cos(elapsedTime * 0.5) * 8;
    }

    // Subtle drift in Particle Universe
    if (this.particleUniverse) {
      this.particleUniverse.rotation.y = elapsedTime * 0.02;
    }

    // City Building Float Oscillations
    if (this.cityGroup) {
      this.cityGroup.children.forEach(column => {
        const ud = column.userData;
        column.position.y = ud.initialY + Math.sin(elapsedTime * 1.5 + ud.phase) * 0.8;
      });
    }

    // Floating Geometric Nodes Rotation & Bobbing
    if (this.floatingShapesGroup) {
      this.floatingShapesGroup.children.forEach(shape => {
        shape.rotation.x += shape.userData.rotX;
        shape.rotation.y += shape.userData.rotY;
        shape.position.y = shape.userData.initialY + Math.sin(elapsedTime * 1.8 + shape.position.x) * 0.5;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.BijuThreeEngine = BijuThreeEngine;
