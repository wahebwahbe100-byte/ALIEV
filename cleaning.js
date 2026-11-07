'use strict';
const toggle = document.querySelector('.menu-toggle');
const mobile = document.querySelector('#mobile-menu');
if (toggle && mobile) {
  function closeMobile() { toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Menü öffnen'); mobile.hidden=true; }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded')==='true';
    toggle.setAttribute('aria-expanded',String(!open));
    toggle.setAttribute('aria-label',open?'Menü öffnen':'Menü schließen');
    mobile.hidden = open;
  });
  mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMobile));
  document.addEventListener('keydown', e=>{if(e.key==='Escape'&&!mobile.hidden){closeMobile();toggle.focus();}});
  window.matchMedia('(min-width: 981px)').addEventListener('change', e=>{if(e.matches)closeMobile();});
}
