/**
 * BIJU400X - GSAP Cinematic Animations, 3D Card Tilts & Number Counters
 */

class BijuAnimations {
  constructor() {
    this.init();
  }

  init() {
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      this.initSectionReveals();
      this.initStatCounters();
      this.initProcessTimeline();
      this.initCaseCharts();
    }
    this.init3DCardTilts();
  }

  initSectionReveals() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => {
      // Titles and tags fade-up
      const title = sec.querySelector('.section-title');
      const tag = sec.querySelector('.section-tag');
      const subtitle = sec.querySelector('.section-subtitle');

      const tl = window.gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });

      if (tag) tl.from(tag, { y: 25, opacity: 0, duration: 0.6, ease: 'power3.out' });
      if (title) tl.from(title, { y: 35, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4');
      if (subtitle) tl.from(subtitle, { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');

      // Staggered grid cards
      const cards = sec.querySelectorAll(
        '.cyber-card, .hologram-service-card, .hud-stat-cell, .process-step-item, .case-dashboard-card, .testimonial-card-3d, .tech-pill-badge'
      );
      if (cards.length > 0) {
        window.gsap.from(cards, {
          scrollTrigger: {
            trigger: cards[0],
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out'
        });
      }
    });
  }

  initStatCounters() {
    const statCells = document.querySelectorAll('.hud-stat-cell');
    
    statCells.forEach(cell => {
      const numElem = cell.querySelector('.stat-counter-val');
      if (!numElem) return;

      const targetVal = parseFloat(numElem.getAttribute('data-target') || '0');

      window.ScrollTrigger.create({
        trigger: cell,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const obj = { val: 0 };
          window.gsap.to(obj, {
            val: targetVal,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: () => {
              if (targetVal >= 1000) {
                numElem.textContent = Math.floor(obj.val).toLocaleString();
              } else {
                numElem.textContent = Math.floor(obj.val);
              }
            }
          });
        }
      });
    });
  }

  initProcessTimeline() {
    const spineProgress = document.querySelector('.timeline-spine-progress');
    const timeline = document.querySelector('.process-timeline');

    if (spineProgress && timeline) {
      window.ScrollTrigger.create({
        trigger: timeline,
        start: 'top 70%',
        end: 'bottom 80%',
        scrub: 0.5,
        onUpdate: (self) => {
          spineProgress.style.height = `${self.progress * 100}%`;
        }
      });
    }
  }

  initCaseCharts() {
    const charts = document.querySelectorAll('.chart-path');
    charts.forEach(chart => {
      window.ScrollTrigger.create({
        trigger: chart,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          chart.style.animation = 'drawChart 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }
      });
    });
  }

  init3DCardTilts() {
    // Interactive 3D Perspective Tilt on Mouse Movement
    const cards = document.querySelectorAll(
      '.cyber-card, .hologram-service-card, .case-dashboard-card, .testimonial-card-3d'
    );

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }
}

window.BijuAnimations = BijuAnimations;
