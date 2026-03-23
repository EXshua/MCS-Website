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

  /* ---- Contact Form with mailto fallback ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = (document.getElementById('f-name')        || {}).value || '';
      const email   = (document.getElementById('f-email')       || {}).value || '';
      const phone   = (document.getElementById('f-phone')       || {}).value || '';
      const vessel  = (document.getElementById('f-vessel')      || {}).value || '';
      const vtype   = (document.getElementById('f-vessel-type') || {}).value || '';
      const message = (document.getElementById('f-message')     || {}).value || '';

      const subject = encodeURIComponent('Compliance Enquiry — ' + (vessel || name));
      const body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'Vessel Name: ' + vessel + '\n' +
        'Vessel Type: ' + vtype + '\n\n' +
        'Message:\n' + message
      );

      window.location.href =
        'mailto:admin@marinecompliancesolutions.co.uk' +
        '?subject=' + subject +
        '&body=' + body;

      // Show confirmation
      const formWrap = contactForm.parentElement;
      const thanks = document.createElement('div');
      thanks.className = 'form-thanks';
      thanks.innerHTML =
        '<div style="text-align:center;padding:40px 20px;">' +
        '<div style="font-size:2.5rem;margin-bottom:16px;">✅</div>' +
        '<h3 style="color:var(--navy);margin-bottom:10px;font-size:1.3rem;">Message sent!</h3>' +
        '<p style="color:var(--text-light);font-size:0.95rem;">Your email client should open with your enquiry pre-filled. ' +
        'If it didn\'t, email us directly at <a href="mailto:admin@marinecompliancesolutions.co.uk">admin@marinecompliancesolutions.co.uk</a></p>' +
        '</div>';
      formWrap.innerHTML = '';
      formWrap.appendChild(thanks);
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
