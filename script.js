/* =============================================
   Marine Compliance Solutions — Main Script
   ============================================= */

(function () {
  'use strict';

  /* ---- Mobile Navigation ---- */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Active Nav Link ---- */
  (function setActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  })();

  /* ---- Smooth Scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // sticky header height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Contact Form ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const errorEl   = document.getElementById('form-error');

      if (errorEl) errorEl.remove();

      const data = {
        name:        (document.getElementById('f-name')        || {}).value || '',
        email:       (document.getElementById('f-email')       || {}).value || '',
        phone:       (document.getElementById('f-phone')       || {}).value || '',
        vessel:      (document.getElementById('f-vessel')      || {}).value || '',
        vessel_type: (document.getElementById('f-vessel-type') || {}).value || '',
        message:     (document.getElementById('f-message')     || {}).value || '',
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (res) { return res.json().then(function (body) { return { ok: res.ok, body: body }; }); })
        .then(function (result) {
          if (result.ok) {
            const formWrap = contactForm.parentElement;
            formWrap.innerHTML =
              '<div style="text-align:center;padding:40px 20px;">' +
              '<div style="width:52px;height:52px;background:rgba(26,143,130,0.12);border:2px solid #1a8f82;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:1.5rem;color:#1a8f82;">&#10003;</div>' +
              '<h3 style="color:var(--navy);margin-bottom:10px;font-size:1.3rem;">Enquiry received</h3>' +
              '<p style="color:var(--text-light);font-size:0.95rem;">We\'ll be in touch within one business day. ' +
              'You can also reach us at <a href="mailto:admin@marinecompliancesolutions.co.uk">admin@marinecompliancesolutions.co.uk</a></p>' +
              '</div>';
          } else {
            throw new Error(result.body.error || 'Submission failed');
          }
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Enquiry →';
          const err = document.createElement('p');
          err.id = 'form-error';
          err.style.cssText = 'color:#c0392b;font-size:0.9rem;margin-top:12px;';
          err.textContent = 'Something went wrong — please try again or email us directly at admin@marinecompliancesolutions.co.uk';
          submitBtn.insertAdjacentElement('afterend', err);
        });
    });
  }

  /* ---- Intersection Observer: Fade-in on scroll ---- */
  if ('IntersectionObserver' in window) {
    const fadeEls = document.querySelectorAll(
      '.feature-card, .tier-card, .trust-card, .vessel-card, .tier-full, .process-step, .pain-item'
    );

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

})();
