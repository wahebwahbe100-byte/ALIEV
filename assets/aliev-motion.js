/* ALIEV — progressive, staged scroll motion derived from BABIN BAU's supplied
   assets/motion.js. Content stays in normal document flow, no whole-section fade,
   and every reveal happens only once. Never affects the existing hero sliders. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const seen = new Set();
  const targets = [];
  function add(selector, { direction, step = 0, columns = 0 } = {}) {
    // Delay within a row, not across the entire page or long grid.
    [...document.querySelectorAll(selector)].forEach((node, index) => {
      if (seen.has(node) || node.closest('[hidden], dialog, .hero-slider, .hero-carousel, .mobile-nav, .aliev-nav-mobile')) return;
      if (node.getClientRects().length === 0) return;
      seen.add(node);
      node.classList.add('aliev-reveal');
      if (direction === 'left' || direction === 'right') node.classList.add('aliev-reveal-' + direction);
      if (step) node.style.setProperty('--aliev-reveal-delay', `${Math.min((columns ? index % columns : index) * step, 330)}ms`);
      targets.push(node);
    });
  }

  // Homepage: paired columns, calm card cadence, and the process steps.
  add('.page-home .section-kicker');
  add('.page-home .section-intro');
  add('.page-home .service-category .category-top');
  add('.page-home .service-category .service-grid > .service-card', { step: 95, columns: 3 });
  add('.page-home #ueber-uns .about-copy', { direction: 'left' });
  add('.page-home #ueber-uns .about-values > li', { direction: 'right', step: 125 });
  add('.page-home .process-heading', { direction: 'left' });
  add('.page-home .process-steps > li', { direction: 'right', step: 125 });
  add('.page-home .faq-layout > :first-child', { direction: 'left' });
  add('.page-home .faq-list > details', { direction: 'right', step: 80 });
  add('.page-home .project-cta-copy', { direction: 'left' });
  add('.page-home .project-cta-button', { direction: 'right' });

  // Transport and Reinigung overview pages. The old full-section reveal was
  // deliberately removed because it hid content and nested other animations.
  add('.object-showcase .showcase-heading, .object-showcase .section-heading');
  add('.object-showcase .object-card', { step: 85, columns: 4 });
  add('.mn-reference-services .mn-services-top, .mn-reference-services .mn-services-head');
  add('.problem-situation-grid > .problem-cards', { direction: 'left' });
  add('.problem-situation-grid > .problem-copy', { direction: 'right' });
  add('.service-comparison .comparison-heading, .service-comparison .comparison-table-wrap');
  add('.mn-solution-heading');
  add('.mn-solution-grid > *', { step: 110, columns: 3 });
  add('.next-steps-reference h2');
  add('.next-steps-reference-grid > *', { step: 120, columns: 4 });
  add('.longform-features .longform-head > *', { step: 75 });
  add('.longform-features .longform-card', { step: 90, columns: 3 });
  add('.longform-faq .faq-heading, .longform-faq .longform-head');
  add('.longform-faq details', { step: 85, columns: 4 });
  add('.other-services .section-head');
  add('.other-services .other-service-card', { step: 90, columns: 3 });
  add('.cta .cta-panel');

  // Individual Transport and Reinigung detail pages share one component system.
  add('main > .intro .intro-grid > :first-child', { direction: 'left' });
  add('main > .intro .intro-grid > :last-child', { direction: 'right' });
  add('main > .special .section-head');
  add('main > .problem .problem-shell');
  add('main > .solution .solution-title');
  add('main > .solution .solution-list > *', { step: 105, columns: 3 });
  add('main > .time-section .time-grid > :first-child', { direction: 'left' });
  add('main > .time-section .time-grid > :last-child', { direction: 'right' });
  add('main > .promise .section-head');
  add('main > .promise .promise-grid > *', { step: 100, columns: 3 });
  add('main > .areas .section-head');
  add('main > .areas .area-grid > *', { step: 90, columns: 3 });
  add('main > .services .section-head');
  add('main > .services .service-grid > .service-card', { step: 95, columns: 3 });
  add('main > .next h2');
  add('main > .next .next-grid > *', { step: 110, columns: 3 });
  add('main > .cta .cta-box');

  // Contact page and shared footer. Skip form controls; do not animate inputs.
  add('.contact-page-intro .section-shell');
  add('.contact-section .contact-layout > .contact-copy', { direction: 'left' });
  add('.contact-section .contact-layout > .inquiry-form', { direction: 'right' });
  add('.aliev-footer-shell > .aliev-footer-main');

  if (!targets.length) return;
  const root = document.documentElement;
  // Prepare hidden states without transitioning from opacity 1 to 0.
  root.classList.add('aliev-motion-prep');

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.015, rootMargin: '0px 0px 5% 0px' });

  // Restore saved-scroll pages / hash links immediately; do not hide anything
  // above the viewport or under a current hash target.
  window.requestAnimationFrame(() => {
    root.classList.add('aliev-motion-ready');
    root.classList.remove('aliev-motion-prep');
    window.requestAnimationFrame(() => {
      for (const node of targets) {
        const rect = node.getBoundingClientRect();
        if (rect.bottom < 0) node.classList.add('is-revealed');
        else observer.observe(node);
      }
    });
  });

  // Remove staggering after the entrance so hover transitions never feel delayed.
  document.addEventListener('transitionend', (event) => {
    const node = event.target;
    if (event.propertyName !== 'opacity' || !(node instanceof Element) || !node.classList.contains('aliev-reveal')) return;
    node.style.removeProperty('--aliev-reveal-delay');
  }, {passive:true});

  function restoreContent() {
    root.classList.remove('aliev-motion-ready', 'aliev-motion-prep');
    observer.disconnect();
    targets.forEach(node => node.classList.add('is-revealed'));
  }
  reducedMotion.addEventListener?.('change', (event) => {
    if (event.matches) restoreContent();
  });

  // Shadow only: keep the existing header geometry and slider behavior intact.
  const header = document.querySelector('.site-header, .aliev-index-sticky-header');
  if (header) {
    let pending = false;
    const update = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        header.classList.toggle('aliev-has-scrolled', window.scrollY > 24);
        pending = false;
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }
})();
