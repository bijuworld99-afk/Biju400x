/**
 * BIJU400X - Interactive Mouse Trail & Floating Canvas Particles
 * Complementary canvas layer for micro-particle sparkles and cursor trail
 */

class BijuMicroParticles {
  constructor() {
    this.trail = [];
    this.maxTrail = 18;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1';
    
    document.body.appendChild(this.canvas);

    this.mouse = { x: -100, y: -100, isMoving: false };
    this.idleTimer = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), false);

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.isMoving = true;

      // Add trail point
      this.trail.push({
        x: this.mouse.x,
        y: this.mouse.y,
        radius: Math.random() * 2.5 + 1,
        alpha: 1,
        color: Math.random() > 0.5 ? '#00E5FF' : '#A855F7'
      });

      if (this.trail.length > this.maxTrail) {
        this.trail.shift();
      }

      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        this.mouse.isMoving = false;
      }, 100);
    }, { passive: true });

    this.render();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.trail.length; i++) {
      const p = this.trail[i];
      p.alpha *= 0.92;
      p.radius *= 0.96;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
    }

    this.trail = this.trail.filter(p => p.alpha > 0.05);

    requestAnimationFrame(() => this.render());
  }
}

window.BijuMicroParticles = BijuMicroParticles;
