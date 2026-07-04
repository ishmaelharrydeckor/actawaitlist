// Acta Technologies Waitlist Controller

class ActaWaitlistApp {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 6; // Step 1 to 6 (Success)
    
    // UI Elements
    this.form = document.getElementById('actaWaitlistForm');
    this.modal = document.getElementById('waitlistModal');
    this.landingPage = document.getElementById('landingPage');
    this.progressBar = document.getElementById('modalProgressBar');
    this.ambientGlow = document.getElementById('ambientGlow');
    this.rotatingHeadline = document.getElementById('rotatingHeadline');
    
    // Rotating headlines array
    this.headlines = [
      "Android Apps with AI.",
      "Design Modern UI/UX with AI.",
      "Websites with AI.",
      "Turn Ideas Into Real Products.",
      "Become an AI Software Builder.",
      "Learn the Future of Software Development."
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

  // Opens conversational modal and resets steps
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

    if (this.currentStep === 5) {
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
    if (this.currentStep <= 1 || this.currentStep === 6) return;

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
    if (!this.modal.classList.contains('active') || this.currentStep === 6) return;

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

    // Check all inputs inside active section
    const allInputs = activeSection.querySelectorAll('input');
    allInputs.forEach(input => {
      if (input.style) {
        input.style.borderColor = '';
      }
      const val = input.value.trim();

      // For required fields, fail if empty
      if (input.hasAttribute('required') && !val) {
        isValid = false;
        this.shakeElement(input);
        return;
      }

      // If empty and optional, skip further checks
      if (!val) return;

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

      // WhatsApp format verification (optional phone check)
      if (input.id === 'whatsapp') {
        const cleanPhone = val.replace(/[\s\-()]/g, '');
        const phoneRegex = /^\+?[0-9]{7,15}$/;
        if (!phoneRegex.test(cleanPhone)) {
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
    // Progress calculation (interactive inputs step 1 to 5)
    const pct = Math.min(((this.currentStep - 1) / 4) * 100, 100);
    this.progressBar.style.width = `${pct}%`;

    // Arrows
    const btnPrev = document.getElementById('navPrev');
    const btnNext = document.getElementById('navNext');
    if (btnPrev && btnNext) {
      btnPrev.disabled = (this.currentStep === 1 || this.currentStep === 6);
      btnNext.disabled = (this.currentStep === 6);
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
      // Fallback copy to clipboard (bulletproof for secure contexts & local file:// runs)
      const shareUrl = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl)
          .then(() => alert('Referral access link copied to your clipboard!'))
          .catch(() => this.fallbackCopyText(shareUrl));
      } else {
        this.fallbackCopyText(shareUrl);
      }
    }
  }

  // Older browser & local file:// copy fallback
  fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // prevent scrolling to bottom
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      alert('Referral access link copied to your clipboard!');
    } catch (err) {
      console.error('Could not copy text: ', err);
      // Final fallback: ask the user to manually copy it
      prompt('Copy the waitlist link below:', text);
    }
    document.body.removeChild(textArea);
  }

  // Form Submission
  handleSubmit() {
    if (!this.validateStep(this.currentStep)) return;

    const formData = new FormData(this.form);

    // Structure payload keys to match the exact keys Google Apps Script expects
    const payload = {
      timestamp: new Date().toISOString(),
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      whatsapp: formData.get('whatsapp'),
      occupation: formData.get('role'), // Maps "What best describes you?" to Occupation column
      primarySkill: formData.get('learnInterest'), // Maps "What are you interested in learning?" to Primary Skill column
      reason: `Commitment: ${formData.get('commitment')} | Company: ${formData.get('company')} | Country: ${formData.get('country')}`, // Combines remaining details into Reason column
      referral: formData.get('referral')
    };

    console.log('Acta Waitlist Submission:', payload);

    // Google Sheets integration via scriptURL
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbx3_pkZys2dBwTHK6ReO8IfbffDJTn8A6qhOLOtmnCQ346yu4LxlQsni6MI8mmwIMGGpA/exec';
    
    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(() => console.log('Data successfully logged to Google Sheets'))
    .catch((err) => console.error('Error posting to script:', err));

    // Save locally
    let list = JSON.parse(localStorage.getItem('acta_waitlist') || '[]');
    list.push(payload);
    localStorage.setItem('acta_waitlist', JSON.stringify(list));

    // Move to success screen
    const currentEl = document.getElementById(`step-${this.currentStep}`);
    currentEl.classList.remove('active');
    currentEl.classList.add('exit');

    this.currentStep = 6;

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
