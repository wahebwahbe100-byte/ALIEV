"use strict";

(() => {
  const root = document.querySelector("[data-hero-slider]");
  if (!root) return;

  const slides = [...root.querySelectorAll("[data-hero-slide]")];
  const pages = [...root.querySelectorAll("[data-slide-to]")];
  const previous = root.querySelector("[data-hero-prev]");
  const next = root.querySelector("[data-hero-next]");
  const play = root.querySelector("[data-hero-play]");
  const number = root.querySelector("[data-slide-number]");
  const status = root.querySelector("[data-hero-status]");
  if (slides.length < 2 || pages.length !== slides.length || !previous || !next || !play) return;

  const duration = 4000;
  const transitionMs = 650;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let timer = null;
  let userPaused = false;
  let focusPaused = false;
  let visible = true;
  let touchStart = null;
  let isTransitioning = false;

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function shouldRun() {
    return !userPaused && !focusPaused && visible && !document.hidden && !reducedMotion.matches;
  }

  function syncPlaybackState(delay = duration) {
    const running = shouldRun();
    root.classList.toggle("is-running", running);
    play.hidden = reducedMotion.matches;
    play.setAttribute("aria-pressed", String(userPaused || focusPaused));
    play.setAttribute("aria-label", (userPaused || focusPaused) ? "Automatischen Bildwechsel starten" : "Automatischen Bildwechsel pausieren");
    clearTimer();
    if (running && !isTransitioning) {
      timer = setTimeout(() => showSlide(index + 1, false), delay);
    }
  }

  function updateUi() {
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.inert = !active;
    });
    pages.forEach((page, i) => {
      const active = i === index;
      page.classList.toggle("is-current", active);
      page.setAttribute("aria-pressed", String(active));
    });
    if (number) number.textContent = String(index + 1).padStart(2, "0");
  }

  function showSlide(target, manual) {
    const nextIndex = (target + slides.length) % slides.length;
    if (manual) focusPaused = false;
    if (nextIndex === index || isTransitioning) {
      syncPlaybackState();
      return;
    }

    isTransitioning = true;
    clearTimer();
    index = nextIndex;
    updateUi();
    if (manual && status) status.textContent = slides[index].getAttribute("aria-label") || "";

    window.setTimeout(() => {
      isTransitioning = false;
      // Keep slide changes 4s apart, including the fade duration.
      syncPlaybackState(Math.max(0, duration - transitionMs - 40));
    }, transitionMs + 40);
  }

  previous.addEventListener("click", () => showSlide(index - 1, true));
  next.addEventListener("click", () => showSlide(index + 1, true));
  pages.forEach((page, i) => page.addEventListener("click", () => showSlide(i, true)));

  play.addEventListener("click", () => {
    const paused = userPaused || focusPaused;
    userPaused = !paused;
    focusPaused = false;
    syncPlaybackState();
  });

  // Pointer hover never pauses automatic image switching.

  root.addEventListener("focusin", event => {
    if (event.target === play) return;
    if (event.target.matches(":focus-visible")) {
      focusPaused = true;
      syncPlaybackState();
    }
  });

  root.addEventListener("focusout", event => {
    if (!root.contains(event.relatedTarget)) {
      focusPaused = false;
      syncPlaybackState();
    }
  });

  root.addEventListener("pointerdown", event => {
    if (focusPaused) {
      focusPaused = false;
      syncPlaybackState();
    }
    if (event.pointerType !== "touch" || event.target.closest("a,button,input,select,textarea")) return;
    touchStart = { x: event.clientX, y: event.clientY };
  }, { passive: true });

  root.addEventListener("pointerup", event => {
    if (!touchStart || event.pointerType !== "touch") return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      showSlide(index + (dx < 0 ? 1 : -1), true);
    }
  }, { passive: true });

  root.addEventListener("pointercancel", () => { touchStart = null; }, { passive: true });

  root.addEventListener("keydown", event => {
    if (!event.target.closest(".hero-controls") || event.altKey || event.ctrlKey || event.metaKey) return;
    const targets = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in targets)) return;
    event.preventDefault();
    showSlide(targets[event.key], true);
    pages[index]?.focus();
  });

  document.addEventListener("visibilitychange", syncPlaybackState);
  reducedMotion.addEventListener("change", syncPlaybackState);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      syncPlaybackState();
    }, { threshold: 0.15 });
    observer.observe(root);
  }

  root.classList.add("is-enhanced");
  updateUi();
  syncPlaybackState();
})();
