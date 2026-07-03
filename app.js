// Acta Technologies Waitlist Controller

class ActaWaitlistApp {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 7; // Step 1 to 7 (Success)
    
    // UI Elements
    this.form = document.getElementById('actaWaitlistForm');
    this.modal = document.getElementById('waitlistModal');
    this.landingPage = document.getElementById('landingPage');
    this.progressBar = document.getElementById('modalProgressBar');
    this.ambientGlow = document.getElementById('ambientGlow');
    this.rotatingHeadline = document.getElementById('rotatingHeadline');
    
    // Rotating headlines array
    this.headlines = [
      "Faster with AI.",
      "Turn Ideas Into Products.",
      "AI-Native Product Engineering.",
      "Software Built for Tomorrow.",
      "Build Once. Scale Faster."
    ];
    this.headlineIndex = 0;
    
    this.init();
  }

  init() {
    // Form submit listener
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Cursor-aware light positioning
    document.addEventListener('mousemove', (e) => {
      if (this.ambientGlow) {
        this.ambientGlow.style.left = `${e.clientX}px`;
        this.ambientGlow.style.top = `${e.clientY}px`;
      }
    });

    // Setup auto-rotating headlines
    this.startHeadlineRotation();

    // Keyboard controls inside the conversational modal
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Radio choice click triggers auto-advance
    this.setupRadioListeners();
  }

  // Opens conversational modal
  openWaitlist() {
    this.modal.classList.add('active');
    this.landingPage.style.opacity = '0.3';
    this.currentStep = 1;
    
    // Focus first input
    this.updateUI();
  }

  // Closes conversational modal
  closeWaitlist() {
    this.modal.classList.remove('active');
    this.landingPage.style.opacity = '1';
  }

  // Automatic headline transitions
  startHeadlineRotation() {
    setInterval(() => {
      if (!this.rotatingHeadline) return;
      
      // Fade out
      this.rotatingHeadline.style.opacity = '0';
      
      setTimeout(() => {
        this.headlineIndex = (this.headlineIndex + 1) % this.headlines.length;
        this.rotatingHeadline.textContent = this.headlines[this.headlineIndex];
        // Fade in
        this.rotatingHeadline.style.opacity = '1';
      }, 350);
      
    }, 3000);
  }

  // Staging card radio click actions
  setupRadioListeners() {
    const radios = this.form.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        setTimeout(() => {
          this.nextStep();
        }, 300);
      });
    });
  }

  // Step Nav: Next
  nextStep() {
    if (this.currentStep >= this.totalSteps) return;

    // Validate the current step fields
    if (!this.validateStep(this.currentStep)) return;

    if (this.currentStep === 6) {
      this.handleSubmit();
      return;
    }

    const currentEl = document.getElementById(`step-${this.currentStep}`);
    currentEl.classList.remove('active');
    currentEl.classList.add('exit');

    this.currentStep++;

    const nextEl = document.getElementById(`step-${this.currentStep}`);
    nextEl.classList.remove('exit');
    nextEl.classList.add('active');

    this.updateUI();
  }

  // Step Nav: Back
  prevStep() {
    if (this.currentStep <= 1 || this.currentStep === 7) return;

    const currentEl = document.getElementById(`step-${this.currentStep}`);
    currentEl.classList.remove('active');

    this.currentStep--;

    const prevEl = document.getElementById(`step-${this.currentStep}`);
    prevEl.classList.remove('exit');
    prevEl.classList.add('active');

    this.updateUI();
  }

  // Keyboard navigation shortcuts
  handleKeyDown(e) {
    // Only capture keypresses when the modal is active
    if (!this.modal.classList.contains('active') || this.currentStep === 7) return;

    const key = e.key.toLowerCase();
    const activeSection = document.getElementById(`step-${this.currentStep}`);

    if (e.key === 'Enter') {
      e.preventDefault();
      this.nextStep();
      return;
    }

    // Card letter selection (A, B, C...)
    const options = activeSection.querySelectorAll('.option-card');
    if (options.length > 0 && ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].includes(key)) {
      const index = key.charCodeAt(0) - 97;
      if (index >= 0 && index < options.length) {
        e.preventDefault();
        const radio = options[index].querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change'));
        }
      }
    }
  }

  // Verification filters
  validateStep(stepIndex) {
    const activeSection = document.getElementById(`step-${stepIndex}`);
    if (!activeSection) return true;

    let isValid = true;

    // Check input structures
    const inputs = activeSection.querySelectorAll('input[required]');
    inputs.forEach(input => {
      input.style.borderColor = '';
      const val = input.value.trim();

      if (!val) {
        isValid = false;
        this.shakeElement(input);
        return;
      }

      // Strict email verify
      if (input.type === 'email') {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(val)) {
          isValid = false;
          this.shakeElement(input);
        }
      }

      // Name length validation
      if (input.id === 'fullName') {
        const nameWords = val.split(/\s+/);
        const nameRegex = /^[\p{L}\s'-]{3,60}$/u;
        if (nameWords.length < 2 || !nameRegex.test(val)) {
          isValid = false;
          this.shakeElement(input);
        }
      }
    });

    // Check option card group selections
    const radios = activeSection.querySelectorAll('input[type="radio"]');
    if (radios.length > 0) {
      const checked = Array.from(radios).some(r => r.checked);
      if (!checked) {
        isValid = false;
        const grid = activeSection.querySelector('.options-grid');
        if (grid) this.shakeElement(grid);
      }
    }

    return isValid;
  }

  // Shaking visual warning triggers
  shakeElement(element) {
    element.style.borderColor = 'var(--error-color)';
    element.style.transform = 'translateX(-10px)';
    element.style.transition = 'transform 0.1s ease';

    let pos = 10;
    const interval = setInterval(() => {
      pos = -pos;
      element.style.transform = `translateX(${pos}px)`;
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      element.style.transform = '';
      element.style.transition = '';
    }, 320);
  }

  // Progress metrics and auto-scroll focus controls
  updateUI() {
    // Progress calculation (interactive inputs step 1 to 6)
    const pct = Math.min(((this.currentStep - 1) / 5) * 100, 100);
    this.progressBar.style.width = `${pct}%`;

    // Arrows
    const btnPrev = document.getElementById('navPrev');
    const btnNext = document.getElementById('navNext');
    if (btnPrev && btnNext) {
      btnPrev.disabled = (this.currentStep === 1 || this.currentStep === 7);
      btnNext.disabled = (this.currentStep === 7);
    }

    // Scroll active element cleanly
    const activeSection = document.getElementById(`step-${this.currentStep}`);
    if (activeSection) {
      const input = activeSection.querySelector('input');
      if (input) {
        setTimeout(() => {
          input.focus();
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      } else {
        setTimeout(() => {
          activeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }

  // Shares waitlist referral link
  shareWaitlist() {
    const shareData = {
      title: 'Acta Technologies Waitlist',
      text: 'Join the waiting list of Acta Technologies for early AI software engineering access!',
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Link shared successfully'))
        .catch((err) => console.log('Error sharing link:', err));
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Referral access link copied to your clipboard!');
    }
  }

  // Form Submission
  handleSubmit() {
    if (!this.validateStep(this.currentStep)) return;

    const formData = new FormData(this.form);
    const data = {
      // Step 1
      role: formData.get('role'),
      // Step 2
      buildType: formData.get('buildType'),
      // Step 3
      projectType: formData.get('projectType'),
      // Step 4
      timeline: formData.get('timeline'),
      // Step 5
      referral: formData.get('referral'),
      // Step 6 personal details
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      whatsapp: formData.get('whatsapp') || 'N/A',
      company: formData.get('company'),
      country: formData.get('country'),
      timestamp: new Date().toISOString()
    };

    console.log('Acta Waitlist Submission:', data);

    // Google Sheets integration via scriptURL
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbx3_pkZys2dBwTHK6ReO8IfbffDJTn8A6qhOLOtmnCQ346yu4LxlQsni6MI8mmwIMGGpA/exec';
    
    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(() => console.log('Data successfully logged to Google Sheets'))
    .catch((err) => console.error('Error posting to script:', err));

    // Save locally
    let list = JSON.parse(localStorage.getItem('acta_waitlist') || '[]');
    list.push(data);
    localStorage.setItem('acta_waitlist', JSON.stringify(list));

    // Move to success screen
    const currentEl = document.getElementById(`step-${this.currentStep}`);
    currentEl.classList.remove('active');
    currentEl.classList.add('exit');

    this.currentStep = 7;

    const successEl = document.getElementById(`step-${this.currentStep}`);
    successEl.classList.add('active');

    this.updateUI();
  }
}

// Init
let app;
window.addEventListener('DOMContentLoaded', () => {
  app = new ActaWaitlistApp();
  window.app = app;
});
