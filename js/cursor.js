/**
 * BIJU400X - Interactive Cinematic Custom Cursor
 * Features:
 * - Dual cursor (Precision Dot + Trailing Glowing Ring)
 * - Lerp physics interpolation
 * - Magnetic pull on buttons, cards, and interactive elements
 * - Hover state expansion with cyber-purple/cyan luminescence
 * - Touch detection auto-disable
 */

class BijuCursor {
  constructor() {
    this.dot = document.querySelector('.cursor-dot');
    this.ring = document.querySelector('.cursor-ring');
    
    if (!this.dot || !this.ring) return;

    this.mouse = { x: -100, y: -100 };
    this.ringPos = { x: -100, y: -100 };
    this.lerpSpeed = 0.18;
    this.isHovering = false;
    this.isMagnetic = false;
    this.magneticTarget = null;

    this.init();
  }

  init() {
    // Check for touch / mobile devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      if (this.dot) this.dot.style.display = 'none';
      if (this.ring) this.ring.style.display = 'none';
      return;
    }

    // Mouse movement
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      // Position inner dot instantly for razor precision
      this.dot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;
    }, { passive: true });

    // Interactive Hover Elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .btn, .cyber-card, .hologram-service-card, .hud-stat-cell, .tech-pill-badge, input, select, textarea'
    );

    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.ring.classList.add('active');
        this.isHovering = true;
      });

      el.addEventListener('mouseleave', () => {
        this.ring.classList.remove('active');
        this.isHovering = false;
        this.isMagnetic = false;
        this.magneticTarget = null;
      });
    });

    // Magnetic Button Physics
    const magneticElements = document.querySelectorAll('.btn, .brand-logo, .audio-toggle-btn, .footer-social-btn');
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.35;
        const deltaY = (e.clientY - centerY) * 0.35;

        el.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate3d(0, 0, 0)';
      });
    });

    // Click Ripple Effect on Buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (btn) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-wave');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      }
    });

    this.render();
  }

  render() {
    // Lerp trailing ring
    this.ringPos.x += (this.mouse.x - this.ringPos.x) * this.lerpSpeed;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * this.lerpSpeed;

    this.ring.style.transform = `translate3d(${this.ringPos.x - 18}px, ${this.ringPos.y - 18}px, 0)`;

    requestAnimationFrame(() => this.render());
  }
}

window.BijuCursor = BijuCursor;
