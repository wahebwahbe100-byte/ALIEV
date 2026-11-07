"use strict";
(() => {
  const header = document.querySelector(".site-header.aliev-index-match");
  if (!header) return;
  const toggle = header.querySelector(".menu-toggle");
  const menu = header.querySelector("#mobile-nav");
  if (!toggle || !menu) return;
  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menü öffnen");
    menu.hidden = true;
    document.body.classList.remove("menu-open");
  }
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  });
  menu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !menu.hidden) {closeMenu();toggle.focus();}
  });
  window.matchMedia("(min-width: 981px)").addEventListener("change", event => {
    if (event.matches) closeMenu();
  });
})();
