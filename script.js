document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // SCROLL PROGRESS BAR & STICKY HEADER
  // ==========================================================================
  const scrollProgress = document.getElementById('scrollProgress');
  const header = document.querySelector('.main-header');

  window.addEventListener('scroll', () => {
    // 1. Scroll progress
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
      const percentage = (window.scrollY / totalScroll) * 100;
      scrollProgress.style.width = `${percentage}%`;
    }

    // 2. Sticky header background blur and height transition
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================================================
  // MOBILE HAMBURGER MENU
  // ==========================================================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked on mobile
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // ==========================================================================
  // INTERSECTION OBSERVER FOR ACTIVE NAV LINKS & SCROLL REVEALS
  // ==========================================================================
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the sweet spot of viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entries.length === 1 && !entry.isIntersecting) return; // ignore solo exit

      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // ==========================================================================
  // ADD DECORATIVE SCROLL REVEALS ON PORTFOLIO CARDS
  // ==========================================================================
  const cards = document.querySelectorAll('.portfolio-card, .stat-card');
  const cardObserverOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        cardObserver.unobserve(entry.target); // Stop observing once animated in
      }
    });
  }, cardObserverOptions);

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      cardObserver.observe(card);
    });

  // ==========================================================================
  // ANTI-BOT EMAIL CANVAS GENERATOR & CLICK-TO-COPY
  // ==========================================================================
  const u = 'edi.webdev';
  const d = 'gmail.com';
  const fullEmail = `${u}@${d}`;

  const renderEmailCanvas = () => {
    const container = document.getElementById('emailContainer');
    if (!container) return;

    // Create high-DPI canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set standard display dimensions
    const displayWidth = 180;
    const displayHeight = 24;
    const scale = window.devicePixelRatio || 2; // Supports high-DPI/Retina screens
    
    canvas.width = displayWidth * scale;
    canvas.height = displayHeight * scale;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    
    ctx.scale(scale, scale);
    
    // Draw email text matching site style
    ctx.fillStyle = '#ffffff'; // White color to match theme text
    ctx.font = '600 16px "Outfit", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(fullEmail, 0, displayHeight / 2);
    
    // Inject the canvas image into the container
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');
    img.alt = 'Contact Email';
    img.style.display = 'block';
    img.style.height = '100%';
    
    container.appendChild(img);
  };

  // Run the canvas renderer
  renderEmailCanvas();

  // Unified click-to-action handler
  const handleEmailAction = (event, element, feedbackTextElement) => {
    // 1. Copy to clipboard
    navigator.clipboard.writeText(fullEmail).then(() => {
      const originalText = feedbackTextElement ? feedbackTextElement.textContent : '';
      
      if (feedbackTextElement) {
        feedbackTextElement.textContent = 'Copied to Clipboard!';
      } else {
        // Simple alert or toast if no text container
        alert(`Email address (${fullEmail}) copied to clipboard!`);
      }

      // 2. Open mailto link dynamically
      setTimeout(() => {
        window.location.href = `mailto:${fullEmail}`;
      }, 100);

      // Restore button text after 3 seconds
      if (feedbackTextElement) {
        setTimeout(() => {
          feedbackTextElement.textContent = originalText;
        }, 3000);
      }
    }).catch(err => {
      // Fallback if copy fails
      window.location.href = `mailto:${fullEmail}`;
    });
  };

  const emailContainer = document.getElementById('emailContainer');
  const emailBtn = document.getElementById('emailBtn');
  const emailBtnText = document.getElementById('emailBtnText');

  if (emailContainer) {
    emailContainer.addEventListener('click', (e) => {
      handleEmailAction(e, emailContainer, null);
    });
  }

  if (emailBtn) {
    emailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleEmailAction(e, emailBtn, emailBtnText);
    });
  }

  // ==========================================================================
  // INQUIRY FORM — FORMSPREE SUBMISSION + SUCCESS MODAL
  // ==========================================================================
  const form = document.getElementById('inquiryForm');
  const submitBtn = form.querySelector('.form-submit-btn');
  const modalOverlay = document.getElementById('successModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function showSuccessModal() {
    if (!modalOverlay) return;
    // Reset any existing error states on the form inputs
    const errors = form.querySelectorAll('.form-error-msg.show');
    errors.forEach(el => el.classList.remove('show'));

    modalOverlay.classList.add('show');
    setTimeout(() => {
      // Auto-dismiss after 5 seconds
      setTimeout(dismissModal, 5000);
    }, 400);
  }

  function dismissModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('show');
  }

  // Close modal: X button, click outside card, Escape key
  const closeModal = () => dismissModal();
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dismissModal();
  });

  // Handle form submission via Formspree POST API
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const formData = new FormData(form);
      const submitBtnOriginalText = submitBtn.textContent.trim();
      let hasError = false;

      // Validate required fields before submitting to Formspree
      if (!formData.get('name').trim()) {
        hasError = true;
        shakeField(form.querySelector('[name="name"]'));
      }

      // Email is required and must be a valid format
      const emailValue = formData.get('email');
      if (!emailValue.trim()) {
        hasError = true;
        shakeField(form.querySelector('[name="email"]'));
      } else if (!isValidEmail(emailValue)) {
        hasError = true;
        setFormError(form.querySelector('[name="email"]'), 'Please enter a valid email address.');
        shakeField(form.querySelector('[name="email"]'));
      }

      // Project description is required
      const desc = formData.get('projectDescription');
      if (!desc || !desc.trim().length) {
        hasError = true;
        setFormError(form.querySelector('.form-description'), 'Please enter a project description.');
        shakeField(form.querySelector('[name="projectDescription"]'));
      }

      // Phone is optional, but must be valid if provided
      const phone = formData.get('phone');
      if (phone && phone.trim() && !isValidPhone(phone)) {
        hasError = true;
        setFormError(form.querySelector('[name="phone"]'), 'Please enter a valid phone number.');
        shakeField(form.querySelector('[name="phone"]'));
      }

      if (hasError) return;

      // Set loading state on button
      submitBtn.textContent = '';
      const spinner = form.querySelector('.submit-spinner');
      spinner.classList.add('show');
      submitBtn.classList.add('loading');

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok || response.status === 200) {
          showSuccessModal();
        } else {
          const errorText = await response.text();
          setFormError(form.querySelector('[name="email"]'), `Submission failed: ${errorText}`);
        }
      } catch (err) {
        setFormError(form.querySelector('[name="email"]'), 'Network error. Please try again later.');
      } finally {
        // Restore button state
        submitBtn.textContent = submitBtnOriginalText;
        spinner.classList.remove('show');
        submitBtn.classList.remove('loading');
      }
    });

    // Helper: shake an input element and add inline error message
    function setFormError(input, message) {
      const existingMsg = input.parentElement.querySelector('.form-error-msg');
      if (existingMsg) {
        existingMsg.textContent = message;
        existingMsg.classList.add('show');
      } else {
        const msgEl = document.createElement('div');
        msgEl.className = 'form-error-msg show';
        msgEl.textContent = message;
        input.parentElement.appendChild(msgEl);
      }
    }

    function shakeField(input) {
      if (!input) return;
      const animName = 'shakeError';
      // Remove animation class to allow re-triggering
      input.classList.remove(animName);
      void input.offsetWidth; // Force reflow
      input.classList.add(animName);
    }

    function isValidEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    function isValidPhone(val) {
      // Allow digits, spaces, dashes, plus sign
      return /^\+?[\d\s\-()]{7,}$/.test(val.trim());
    }
  }
});
