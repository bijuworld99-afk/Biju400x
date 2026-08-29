/**
 * BIJU400X - Master Application Orchestrator
 * Bootstraps 3D Scene, Loader, Scroll System, Cursor, and Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Three.js Engine
  let threeEngine = null;
  if (typeof BijuThreeEngine !== 'undefined') {
    threeEngine = new BijuThreeEngine();
  }

  // 2. Initialize Micro-particles canvas
  if (typeof BijuMicroParticles !== 'undefined') {
    new BijuMicroParticles();
  }

  // 3. Initialize Custom Cursor
  if (typeof BijuCursor !== 'undefined') {
    new BijuCursor();
  }

  // 4. Initialize Smooth Scrolling (Lenis + GSAP ScrollTrigger)
  let scrollController = null;
  if (typeof BijuScrollController !== 'undefined') {
    scrollController = new BijuScrollController(threeEngine);
  }

  // 5. Initialize GSAP Animations & Tilts
  if (typeof BijuAnimations !== 'undefined') {
    new BijuAnimations();
  }

  // 6. Initialize UI & Form Controls
  if (typeof BijuUIController !== 'undefined') {
    new BijuUIController();
  }

  // 7. Cinematic Loader Simulation & Hero Camera Zoom In
  initCinematicLoader(threeEngine);
});

/**
 * Cinematic Preloader with Counter & Camera Zoom
 */
function initCinematicLoader(threeEngine) {
  const loader = document.getElementById('cinematic-loader');
  const progressBar = document.querySelector('.loader-bar');
  const percentageText = document.querySelector('.loader-percentage');

  if (!loader || !progressBar || !percentageText) return;

  let progress = 0;
  const startTime = Date.now();
  const duration = 1600; // 1.6s smooth cinematic load

  // Initially pull camera further back for dramatic entrance zoom
  if (threeEngine && threeEngine.camera) {
    threeEngine.camera.position.z = 55;
    threeEngine.currentCam.z = 55;
    threeEngine.targetCam.z = 35;
  }

  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    progress = Math.min(100, Math.floor((elapsed / duration) * 100));

    progressBar.style.width = `${progress}%`;
    percentageText.textContent = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        // Fade out loader
        loader.classList.add('loaded');

        // Cinematic Hero Entrance using GSAP
        if (window.gsap) {
          const heroTl = window.gsap.timeline();
          heroTl.from('.hero-headline', {
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out'
          })
          .from('.hero-badge-row', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
          }, '-=0.8')
          .from('.hero-subheadline', {
            y: 30,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out'
          }, '-=0.6')
          .from('.hero-cta-group', {
            y: 25,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
          }, '-=0.5')
          .from('.hero-telemetry-row', {
            y: 20,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out'
          }, '-=0.4');
        }

        // Camera smoothly glides into Hero position
        if (threeEngine) {
          threeEngine.targetCam.z = 35;
        }
      }, 350);
    }
  }, 25);
}
