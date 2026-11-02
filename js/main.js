/**
 * WE SCAN – Premium Homepage Interactive Controller (Version 4)
 * Handles Hero Video, Demo Video Player, Modals, Sticky CTA & Scroll Observers
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────────────────
  // 1. Sticky Header Shadow on Scroll
  // ─────────────────────────────────────────────────────────
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    siteHeader?.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  // ─────────────────────────────────────────────────────────
  // 2. Mobile Drawer Navigation
  // ─────────────────────────────────────────────────────────
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');

  const openDrawer = () => {
    mobileDrawer?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    mobileDrawer?.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  mobileToggle?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);

  mobileDrawer?.querySelectorAll('.mobile-nav-link, .btn').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ─────────────────────────────────────────────────────────
  // 3. Demo Request Modal System
  // ─────────────────────────────────────────────────────────
  const demoModal = document.getElementById('demoModal');
  const openModalButtons = document.querySelectorAll('[data-open-demo-modal]');
  const closeModalBtn = document.getElementById('closeModalBtn');

  const openModal = () => {
    demoModal?.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    demoModal?.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If inside an anchor tag that triggers modal, prevent default jump
      if (btn.tagName === 'A' || btn.tagName === 'BUTTON' || btn.closest('[data-open-demo-modal]')) {
        e.preventDefault();
      }
      openModal();
    });
  });

  closeModalBtn?.addEventListener('click', closeModal);
  demoModal?.addEventListener('click', (e) => {
    if (e.target === demoModal) closeModal();
  });

  // Escape key closes modal or drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeDrawer();
    }
  });

  // ─────────────────────────────────────────────────────────
  // 4. Hero Video Autoplay Assurance
  // ─────────────────────────────────────────────────────────
  const heroVideo = document.getElementById('heroBgVideo');
  if (heroVideo) {
    heroVideo.muted = true;
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented playback, poster image fallback is visible
        console.info('Hero video autoplay fallback active.');
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  // 5. Real Product Demonstration Video Section Controller
  // ─────────────────────────────────────────────────────────
  const demoVideoContainer = document.getElementById('demoVideoContainer');
  const productDemoVideo = document.getElementById('productDemoVideo');
  const demoPlayBtn = document.getElementById('demoPlayBtn');
  const triggerDemoVideoBtn = document.getElementById('triggerDemoVideoBtn');

  const startDemoVideo = () => {
    if (!productDemoVideo) return;
    demoVideoContainer?.classList.add('is-playing');
    productDemoVideo.controls = true;
    productDemoVideo.play().catch(err => {
      console.warn('Video play prevented:', err);
    });
  };

  demoPlayBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    startDemoVideo();
  });

  triggerDemoVideoBtn?.addEventListener('click', () => {
    demoVideoContainer?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(startDemoVideo, 400);
  });

  if (productDemoVideo) {
    productDemoVideo.addEventListener('pause', () => {
      if (productDemoVideo.currentTime < productDemoVideo.duration && !productDemoVideo.seeking) {
        demoVideoContainer?.classList.remove('is-playing');
        productDemoVideo.controls = false;
      }
    });

    productDemoVideo.addEventListener('ended', () => {
      demoVideoContainer?.classList.remove('is-playing');
      productDemoVideo.controls = false;
      productDemoVideo.load(); // Reset to poster
    });
  }

  // ─────────────────────────────────────────────────────────
  // 6. Scroll Reveal Animations via IntersectionObserver
  // ─────────────────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // ─────────────────────────────────────────────────────────
  // 7. Interactive Demo Form Submit Handler
  // ─────────────────────────────────────────────────────────
  const demoForms = document.querySelectorAll('form[name="demo-request"]');
  demoForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.innerHTML = `<span>Sending Request...</span>`;
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        alert('Thank you! Your demo request has been received. A WE SCAN representative will contact you shortly.');
        form.reset();
        if (submitBtn) {
          submitBtn.innerHTML = origText;
          submitBtn.disabled = false;
        }
        closeModal();
      }, 700);
    });
  });

  // ─────────────────────────────────────────────────────────
  // 8. Active Nav Link on Scroll
  // ─────────────────────────────────────────────────────────
  const trackSections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const activateNavLink = () => {
    let currentId = '';
    trackSections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 140) {
        currentId = section.id;
      }
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  };

  window.addEventListener('scroll', activateNavLink, { passive: true });

});
