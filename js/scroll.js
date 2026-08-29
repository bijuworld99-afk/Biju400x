/**
 * BIJU400X - Smooth Inertia Scroll & GSAP ScrollTrigger Synchronization
 * Powered by Lenis & GSAP ScrollTrigger
 */

class BijuScrollController {
  constructor(threeEngine) {
    this.threeEngine = threeEngine;
    this.lenis = null;
    this.init();
  }

  init() {
    // Check if Lenis is available
    if (typeof window.Lenis !== 'undefined') {
      this.lenis = new window.Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 2.0,
        infinite: false
      });

      // Synchronize Lenis with GSAP ScrollTrigger
      if (window.ScrollTrigger) {
        this.lenis.on('scroll', () => {
          window.ScrollTrigger.update();
        });

        if (window.gsap) {
          window.gsap.ticker.add((time) => {
            this.lenis.raf(time * 1000);
          });
          window.gsap.ticker.lagSmoothing(0);
        }
      }

      // Feed scroll progress to Three.js camera controller
      this.lenis.on('scroll', (e) => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? e.scroll / totalHeight : 0;
        
        if (this.threeEngine && typeof this.threeEngine.updateScrollProgress === 'function') {
          this.threeEngine.updateScrollProgress(progress);
        }

        // Header glassmorphism on scroll
        const header = document.querySelector('.site-header');
        if (header) {
          if (e.scroll > 50) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }
      });
    } else {
      // Fallback to standard scroll if Lenis fails to load
      window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
        if (this.threeEngine) {
          this.threeEngine.updateScrollProgress(progress);
        }
      }, { passive: true });
    }

    // Smooth Anchor Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            if (this.lenis) {
              this.lenis.scrollTo(target, { offset: -60 });
            } else {
              target.scrollIntoView({ behavior: 'smooth' });
            }

            // Close mobile dropdown menu if open
            const mobilePanel = document.getElementById('mobile-dropdown-panel');
            const mobileToggle = document.getElementById('mobile-menu-btn');
            const mobileBackdrop = document.getElementById('mobile-dropdown-backdrop');
            if (mobilePanel && mobilePanel.classList.contains('open')) {
              mobilePanel.classList.remove('open');
            }
            if (mobileToggle) {
              mobileToggle.classList.remove('active');
              mobileToggle.setAttribute('aria-expanded', 'false');
            }
            if (mobileBackdrop) {
              mobileBackdrop.classList.remove('open');
            }
            document.body.classList.remove('mobile-nav-locked');
          }
        }
      });
    });

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top-btn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        if (this.lenis) {
          this.lenis.scrollTo(0, { duration: 1.5 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }

  getLenisInstance() {
    return this.lenis;
  }
}

window.BijuScrollController = BijuScrollController;
