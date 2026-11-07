"use strict";

document.querySelectorAll('[data-current-year]').forEach(element => {
  element.textContent = new Date().getFullYear();
});
(() => {
  const button = document.getElementById('toTop');
  const footer = document.querySelector('footer');
  if (!button || !footer) return;
  const show = visible => {
    button.classList.toggle('visible', visible);
    button.setAttribute('aria-hidden', String(!visible));
    button.tabIndex = visible ? 0 : -1;
  };
  show(false);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => show(entries.some(entry => entry.isIntersecting)), { threshold: .02 }).observe(footer);
  } else { show(true); }
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
})();

(() => {
  const header = document.querySelector('.aliev-index-sticky-header');
  const toggle = header && header.querySelector('.aliev-nav-toggle');
  const menu = document.getElementById('aliev-transport-mobile-menu');
  if (!toggle || !menu) return;
  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
    menu.hidden = true;
    document.body.classList.remove('menu-open');
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); }
  });
  window.matchMedia('(min-width: 981px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
})();

(() => {
  const viewport = document.querySelector('[data-mn-services-viewport]');
  const track = document.querySelector('[data-mn-services-track]');
  if (!viewport || !track) return;

  const originals = Array.from(track.querySelectorAll(':scope > .mn-service-card'));
  if (originals.length < 2) return;

  originals.forEach((card) => {
    const img = card.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.decoding = 'async';
      img.fetchPriority = 'low';
    }
  });

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pausedByUser = motionPreference.matches;
  let focusWithin = false;
  const pauseButton = document.querySelector('[data-transport-pause]');
  const status = document.querySelector('[data-transport-status]');
  function updatePauseButton() {
    if (!pauseButton) return;
    pauseButton.textContent = pausedByUser ? 'Abspielen' : 'Pause';
    pauseButton.setAttribute('aria-label', pausedByUser ? 'Automatischen Wechsel starten' : 'Automatischen Wechsel pausieren');
    pauseButton.setAttribute('aria-pressed', String(pausedByUser));
  }
  updatePauseButton();
  const count = originals.length;
  const autoplayDelay = 3000;
  const duration = 520;
  let index = count; // middle/original set
  let timer = null;
  let settleTimer = null;
  let dragging = false;
  let dragMoved = false;
  let startX = 0;
  let lastX = 0;
  let baseX = 0;
  let initialized = false;
  let inView = false;
  let pageScrolling = false;
  let scrollResumeTimer = null;

  function cloneCard(card) {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.setAttribute('tabindex', '-1');
    const img = clone.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.decoding = 'async';
      img.fetchPriority = 'low';
    }
    return clone;
  }

  function clearSettle() {
    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = null;
  }

  function cardAt(i) {
    return track.children[i] || null;
  }

  // Measure the exact physical card position. This avoids mobile rounding errors
  // from vw widths, gaps and viewport padding that previously exposed blank space.
  function xFor(i) {
    const card = cardAt(i);
    const first = track.firstElementChild;
    if (!card || !first) return 0;
    return -(card.offsetLeft - first.offsetLeft);
  }

  function setX(x, animate = true) {
    clearSettle();
    track.style.transition = animate && !motionPreference.matches
      ? `transform ${duration}ms cubic-bezier(.22,.61,.36,1)`
      : 'none';
    track.style.transform = `translate3d(${x}px,0,0)`;
    if (animate) settleTimer = setTimeout(normalize, duration + 80);
  }

  function normalize() {
    clearSettle();
    // Three complete sets exist: previous clone set, original set, next clone set.
    // Jump invisibly back into the middle set before an edge can ever be exposed.
    if (index >= count * 2) {
      index -= count;
      setX(xFor(index), false);
    } else if (index < count) {
      index += count;
      setX(xFor(index), false);
    }
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function start() {
    stop();
    if (!initialized || !inView || document.hidden || dragging || pageScrolling || pausedByUser || focusWithin) return;
    timer = setInterval(next, autoplayDelay);
  }

  function pauseForPageScroll() {
    pageScrolling = true;
    stop();
    if (scrollResumeTimer) clearTimeout(scrollResumeTimer);
    scrollResumeTimer = setTimeout(() => {
      pageScrolling = false;
      start();
    }, 700);
  }

  function build() {
    stop();
    clearSettle();
    track.innerHTML = '';

    // Full clone set on BOTH sides = no empty end on phones, even during swipes.
    originals.map(cloneCard).forEach((card) => track.appendChild(card));
    originals.forEach((card) => track.appendChild(card));
    originals.map(cloneCard).forEach((card) => track.appendChild(card));

    index = count;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setX(xFor(index), false);
      start();
    }));
  }

  function init() {
    if (initialized) return;
    initialized = true;
    viewport.tabIndex = 0;
    viewport.classList.add('is-enhanced');
    build();
  }

  function next() {
    if (dragging) return;
    index += 1;
    setX(xFor(index), true);
  }

  function previous() {
    if (dragging) return;
    index -= 1;
    setX(xFor(index), true);
  }

  track.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'transform') normalize();
  });

  viewport.addEventListener('pointerdown', (e) => {
    if (!initialized) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true;
    dragMoved = false;
    stop();
    clearSettle();
    viewport.classList.add('is-dragging');

    startX = lastX = e.clientX;
    baseX = xFor(index);
    track.style.transition = 'none';

  });

  viewport.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    lastX = e.clientX;
    const dx = lastX - startX;
    if (Math.abs(dx) > 6 && !dragMoved) {
      dragMoved = true;
      viewport.setPointerCapture?.(e.pointerId);
    }
    // Limit live drag to a little over one card. Full clone sets ensure content
    // remains present on both sides while the user swipes.
    const card = cardAt(index);
    const nextCard = cardAt(index + 1);
    const oneStep = (card && nextCard) ? Math.abs(nextCard.offsetLeft - card.offsetLeft) : viewport.clientWidth;
    const limitedDx = Math.max(-oneStep * 1.15, Math.min(oneStep * 1.15, dx));
    track.style.transform = `translate3d(${baseX + limitedDx}px,0,0)`;
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove('is-dragging');
    try { viewport.releasePointerCapture?.(e.pointerId); } catch (_) {}

    const dx = lastX - startX;
    const card = cardAt(index);
    const nextCard = cardAt(index + 1);
    const oneStep = (card && nextCard) ? Math.abs(nextCard.offsetLeft - card.offsetLeft) : viewport.clientWidth;
    const threshold = Math.min(70, oneStep * .18);
    if (dx < -threshold) index += 1;
    else if (dx > threshold) index -= 1;

    setX(xFor(index), true);
    start();
  }

  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  viewport.addEventListener('click', (e) => {
    if (!dragMoved) return;
    e.preventDefault();
    e.stopPropagation();
    dragMoved = false;
  }, true);

  viewport.addEventListener('keydown', (e) => {
    if (!initialized) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault(); stop(); next(); start();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault(); stop(); previous(); start();
    }
  });

  viewport.addEventListener('mouseenter', () => {
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) stop();
  });
  viewport.addEventListener('mouseleave', start);

  // Pause autoplay while the visitor scrolls the page on phone/tablet.
  // The timer restarts only after scrolling has been quiet for a moment.
  window.addEventListener('scroll', pauseForPageScroll, { passive: true });
  window.addEventListener('touchmove', pauseForPageScroll, { passive: true });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (!initialized) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 140);
  }, { passive: true });


  function announceSelection() {
    const original = originals[((index - count) % count + count) % count];
    if (status) status.textContent = original.querySelector('.mn-service-name').textContent;
  }
  document.querySelector('[data-transport-prev]')?.addEventListener('click', () => {
    init(); stop(); previous(); announceSelection(); start();
  });
  document.querySelector('[data-transport-next]')?.addEventListener('click', () => {
    init(); stop(); next(); announceSelection(); start();
  });
  pauseButton?.addEventListener('click', () => {
    pausedByUser = !pausedByUser;
    updatePauseButton();
    pausedByUser ? stop() : start();
  });
  motionPreference.addEventListener('change', () => {
    pausedByUser = motionPreference.matches;
    updatePauseButton();
    pausedByUser ? stop() : start();
  });
  viewport.addEventListener('dragstart', event => event.preventDefault());
  viewport.addEventListener('focusin', event => {
    focusWithin = true;
    stop();
    const card = event.target.closest('.mn-service-card');
    if (card && card.parentElement === track) {
      index = Array.from(track.children).indexOf(card);
      setX(xFor(index), false);
      viewport.scrollLeft = 0;
    }
  });
  viewport.addEventListener('focusout', event => {
    if (viewport.contains(event.relatedTarget)) return;
    focusWithin = false;
    start();
  });

  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      inView = !!entries[0]?.isIntersecting;
      if (inView) { init(); start(); }
      else stop();
    }, { rootMargin: '320px 0px', threshold: 0.01 });
    observer.observe(viewport);
  } else {
    inView = true;
    init();
  }
})();
