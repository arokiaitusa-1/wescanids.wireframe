/**
 * WE SCAN – Premium Homepage Interactive Controller (Version 3)
 * Elementor Blueprint Inspector + Scroll Animations
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
      e.preventDefault();
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
  // 4. Elementor Blueprint Inspector Toggle
  // ─────────────────────────────────────────────────────────
  const toggleBlueprintBtn = document.getElementById('toggleBlueprintBtn');
  let blueprintsVisible = false;

  toggleBlueprintBtn?.addEventListener('click', () => {
    blueprintsVisible = !blueprintsVisible;
    document.body.classList.toggle('show-blueprints', blueprintsVisible);
    toggleBlueprintBtn.classList.toggle('active', blueprintsVisible);
    toggleBlueprintBtn.innerHTML = blueprintsVisible
      ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg> Hide Elementor Specs`
      : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg> Elementor Structure Specs`;
  });

  // ─────────────────────────────────────────────────────────
  // 5. Scroll Reveal Animations via IntersectionObserver
  // ─────────────────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target); // animate only once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately if IntersectionObserver unavailable
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // ─────────────────────────────────────────────────────────
  // 6. Interactive Demo Form Submit Handler
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
      }, 800);
    });
  });

  // ─────────────────────────────────────────────────────────
  // 7. Active Nav Link on Scroll
  // ─────────────────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const activateNavLink = () => {
    let currentId = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= 100) {
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
