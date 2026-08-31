/**
 * BIJU400X - UI Controller, Web Audio Synthesizer & AJAX Contact Mailer
 * Recipient: bijuworld99@gmail.com
 */

class BijuUIController {
  constructor() {
    this.audioCtx = null;
    this.isAudioActive = false;
    this.ambientOsc = null;
    this.ambientGain = null;

    this.init();
  }

  init() {
    this.initMobileNav();
    this.initAudioSynthesizer();
    this.initContactForm();
    this.initServicesCarousel();
    this.initPricingTabs();
  }

  /* -------------------------------------------------------------
     1. Mobile Navigation Toggle
     ------------------------------------------------------------- */
  initMobileNav() {
    const toggleBtn = document.getElementById('mobile-menu-btn') || document.querySelector('.mobile-nav-toggle');
    const dropdownPanel = document.getElementById('mobile-dropdown-panel');
    const backdrop = document.getElementById('mobile-dropdown-backdrop');
    const navLinks = document.querySelectorAll('.mobile-dropdown-item, .mobile-dropdown-cta, .mobile-dropdown-phone, .nav-link');

    if (!toggleBtn || !dropdownPanel) return;

    const openDropdown = () => {
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      dropdownPanel.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      document.body.classList.add('mobile-nav-locked');
    };

    const closeDropdown = () => {
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      dropdownPanel.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      document.body.classList.remove('mobile-nav-locked');
    };

    // Toggle button click
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownPanel.classList.contains('open');
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Close on backdrop tap
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        closeDropdown();
      });
    }

    // Auto-close when any nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeDropdown();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdownPanel.classList.contains('open')) {
        closeDropdown();
      }
    });

    // Close when resized back to desktop (> 1024px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && dropdownPanel.classList.contains('open')) {
        closeDropdown();
      }
    });
  }

  /* -------------------------------------------------------------
     1b. Services Single-Line Track Carousel Controls
     ------------------------------------------------------------- */
  initServicesCarousel() {
    const track = document.getElementById('services-track');
    const prevBtn = document.getElementById('services-prev-btn');
    const nextBtn = document.getElementById('services-next-btn');

    if (track && prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -360, behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: 360, behavior: 'smooth' });
      });
    }
  }

  /* -------------------------------------------------------------
     1c. Pricing Switcher Tabs (Website Packages vs Care & Maintenance)
     ------------------------------------------------------------- */
  initPricingTabs() {
    const tabBtns = document.querySelectorAll('.pricing-tab-btn');
    const panels = document.querySelectorAll('.pricing-tab-panel');

    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        
        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });

    // Care Billing Frequency Toggle (Monthly vs Annual 20% Discount)
    const billingBtns = document.querySelectorAll('.care-billing-btn');
    const careAmounts = document.querySelectorAll('.care-amount');
    const careNotes = document.querySelectorAll('.care-billing-note');
    const careActionBtns = document.querySelectorAll('.care-action-btn');

    billingBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-billing'); // 'monthly' or 'annual'
        billingBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        careAmounts.forEach(amt => {
          const val = amt.getAttribute(`data-${mode}`);
          if (val) {
            amt.style.opacity = '0';
            setTimeout(() => {
              amt.textContent = val;
              amt.style.opacity = '1';
            }, 150);
          }
        });

        careNotes.forEach(note => {
          const text = note.getAttribute(`data-${mode}`);
          if (text) {
            note.textContent = text;
          }
        });

        careActionBtns.forEach(actionBtn => {
          const link = actionBtn.getAttribute(`data-${mode}-link`);
          if (link) {
            actionBtn.setAttribute('href', link);
          }
        });
      });
    });
  }

  /* -------------------------------------------------------------
     2. Native Procedural Web Audio API (Zero Audio Files Needed!)
     ------------------------------------------------------------- */
  initAudioSynthesizer() {
    const audioBtn = document.querySelector('.audio-toggle-btn');
    if (!audioBtn) return;

    audioBtn.addEventListener('click', () => {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.isAudioActive = !this.isAudioActive;
      audioBtn.classList.toggle('active', this.isAudioActive);

      if (this.isAudioActive) {
        this.startAmbientDrone();
        this.playUiTone(600, 'sine', 0.15);
      } else {
        this.stopAmbientDrone();
      }
    });

    // Attach subtle UI blips to buttons
    document.querySelectorAll('.btn, .nav-link, .cyber-card, .hud-stat-cell').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (this.isAudioActive) this.playUiTone(880, 'sine', 0.04, 0.05);
      });
      el.addEventListener('click', () => {
        if (this.isAudioActive) this.playUiTone(1200, 'triangle', 0.08, 0.1);
      });
    });
  }

  playUiTone(freq = 600, type = 'sine', duration = 0.08, volume = 0.08) {
    if (!this.audioCtx || !this.isAudioActive) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (err) {
      console.warn('Audio tone error:', err);
    }
  }

  startAmbientDrone() {
    if (!this.audioCtx) return;
    try {
      this.ambientOsc = this.audioCtx.createOscillator();
      this.ambientGain = this.audioCtx.createGain();

      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(65.4, this.audioCtx.currentTime); // C2 Deep bass frequency
      this.ambientGain.gain.setValueAtTime(0.03, this.audioCtx.currentTime);

      // Lowpass filter for warm cinematic sub-bass
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.audioCtx.currentTime);

      this.ambientOsc.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.audioCtx.destination);

      this.ambientOsc.start();
    } catch (err) {
      console.warn('Ambient drone start error:', err);
    }
  }

  stopAmbientDrone() {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
      } catch (err) {
        // Ignored
      }
      this.ambientOsc = null;
    }
  }

  /* -------------------------------------------------------------
     3. WhatsApp Requirement Transmission System (+91 9332600760)
     ------------------------------------------------------------- */
  initContactForm() {
    const form = document.getElementById('contact-growth-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const feedbackBanner = document.getElementById('form-feedback-banner');

    if (!form || !submitBtn || !feedbackBanner) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (document.getElementById('client-name')?.value || '').trim();
      const contact = (document.getElementById('client-email')?.value || '').trim();
      const service = document.getElementById('client-service')?.value || 'Full-Funnel Growth';
      const budget = document.getElementById('client-budget')?.value || 'Not Specified';
      const message = (document.getElementById('client-message')?.value || '').trim();

      if (!name || !contact || !message) {
        feedbackBanner.className = 'form-feedback-banner error';
        feedbackBanner.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please fill in your name, contact info, and project goals.';
        feedbackBanner.style.display = 'flex';
        return;
      }

      // Display loading / connecting state
      feedbackBanner.className = 'form-feedback-banner loading';
      feedbackBanner.innerHTML = '<i class="fa-brands fa-whatsapp fa-spin"></i> Initializing WhatsApp channel with +91 9332600760...';
      feedbackBanner.style.display = 'flex';

      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Format professional WhatsApp local business web brief
      const waText = 
`🌐 *NEW LOCAL BUSINESS WEBSITE INQUIRY - BIJU400X*
----------------------------------------
👤 *Client / Business:* ${name}
📞 *Phone / WhatsApp:* ${contact}
🏢 *Business Type:* ${service}
💰 *Project Scope:* ${budget}

📝 *Business Requirements & Details:*
${message}
----------------------------------------
⚡ _Sent via Biju400x Web Developer Desk_`;

      const whatsappNumber = '919332600760';
      const waUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(waText)}`;

      setTimeout(() => {
        // Open WhatsApp in new tab / app
        window.open(waUrl, '_blank');

        // Display glowing confirmation banner with direct fallback link
        feedbackBanner.className = 'form-feedback-banner success';
        feedbackBanner.innerHTML = `
          <i class="fa-brands fa-whatsapp" style="font-size: 1.25rem;"></i>
          <span>Brief compiled! Opening WhatsApp. If it didn't open automatically, 
            <a href="${waUrl}" target="_blank" style="color: #25D366; text-decoration: underline; font-weight: 700;">click here to chat now</a>.
          </span>
        `;

        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }, 600);
    });
  }
}

window.BijuUIController = BijuUIController;
