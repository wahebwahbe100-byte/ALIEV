"use strict";

(() => {
  const root = document.querySelector("[data-reviews-carousel]");
  const track = document.querySelector("[data-reviews-track]");
  const viewport = document.querySelector("[data-reviews-viewport]");
  if (!root || !track || !viewport || track.children.length < 2) return;
  const prev = root.querySelector("[data-reviews-prev]");
  const next = root.querySelector("[data-reviews-next]");
  if (!prev || !next) return;

  const interval = 3000;
  const animationDuration = 540;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let timer = null;
  let inView = true;
  let hoverPaused = false;
  let focusedPaused = false;
  let moving = false;
  let finishCurrent = null;
  let touchStart = null;

  function stepSize() {
    const card = track.firstElementChild;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function clearTimer() {
    if (timer !== null) { clearTimeout(timer); timer = null; }
  }

  function canAutoplay() {
    return !hoverPaused && !focusedPaused && inView && !document.hidden && !reducedMotion.matches;
  }

  function schedule() {
    clearTimer();
    if (canAutoplay()) timer = setTimeout(() => { timer = null; goNext(); schedule(); }, interval);
  }

  function animateShift(direction) {
    if (moving) return;
    moving = true;
    const distance = stepSize();
    if (reducedMotion.matches) {
      if (direction === 1) track.append(track.firstElementChild);
      else track.prepend(track.lastElementChild);
      moving = false;
      return;
    }

    if (direction === -1) {
      track.style.transition = "none";
      track.prepend(track.lastElementChild);
      track.style.transform = `translate3d(-${distance}px, 0, 0)`;
      // Reflow makes the following transform animate from the newly inserted card.
      void track.offsetWidth;
    }

    const finish = () => {
      if (!moving) return;
      moving = false;
      track.removeEventListener("transitionend", onEnd);
      clearTimeout(fallback);
      track.style.transition = "none";
      if (direction === 1) track.append(track.firstElementChild);
      track.style.transform = "translate3d(0, 0, 0)";
      void track.offsetWidth;
      track.style.transition = "";
      finishCurrent = null;
    };
    const onEnd = event => {
      if (event.target === track && event.propertyName === "transform") finish();
    };
    finishCurrent = finish;
    track.addEventListener("transitionend", onEnd);
    track.style.transition = `transform ${animationDuration}ms cubic-bezier(.22,.7,.22,1)`;
    track.style.transform = direction === 1 ? `translate3d(-${distance}px, 0, 0)` : "translate3d(0, 0, 0)";
    const fallback = setTimeout(finish, animationDuration + 100);
  }

  function goNext() { animateShift(1); }
  function goPrev() { animateShift(-1); }

  next.addEventListener("click", () => { goNext(); schedule(); });
  prev.addEventListener("click", () => { goPrev(); schedule(); });

  // The examples rotate automatically while the carousel is in view.
  viewport.addEventListener("pointerenter", event => {
    if (event.pointerType === "mouse") { hoverPaused = true; schedule(); }
  });
  viewport.addEventListener("pointerleave", event => {
    if (event.pointerType === "mouse") { hoverPaused = false; schedule(); }
  });
  root.addEventListener("focusin", event => {
    if (event.target.matches(":focus-visible")) { focusedPaused = true; schedule(); }
  });
  root.addEventListener("focusout", event => {
    if (!root.contains(event.relatedTarget)) { focusedPaused = false; schedule(); }
  });
  root.addEventListener("pointerdown", () => { focusedPaused = false; schedule(); });

  viewport.addEventListener("touchstart", event => {
    if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  viewport.addEventListener("touchend", event => {
    if (!touchStart || event.changedTouches.length !== 1) return;
    const deltaX = event.changedTouches[0].clientX - touchStart.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) goNext(); else goPrev();
      schedule();
    }
  }, { passive: true });
  viewport.addEventListener("touchcancel", () => { touchStart = null; }, { passive: true });

  document.addEventListener("visibilitychange", schedule);
  reducedMotion.addEventListener("change", () => {
    if (finishCurrent) finishCurrent();
    schedule();
  });
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      schedule();
    }, { threshold: 0.12 });
    observer.observe(viewport);
  }
  schedule();
})();
