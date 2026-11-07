
(()=>{'use strict';
  const storageKey='aliev_cookie_notice_seen_v1';
  const privacyPath=(document.currentScript?.getAttribute('src')||'').startsWith('../')?'../datenschutz.html':'datenschutz.html';
  const getSeen=()=>{try{return window.localStorage.getItem(storageKey)==='yes'}catch(_){return !!window.__alievCookieSeen}};
  const markSeen=()=>{try{window.localStorage.setItem(storageKey,'yes')}catch(_){window.__alievCookieSeen=true}};
  function init(){
    const banner=document.createElement('section');banner.className='aliev-cookie-banner';banner.setAttribute('aria-label','Cookie-Hinweis');
    banner.innerHTML='<strong>Datenschutz &amp; Cookies</strong><p>Diese Website nutzt derzeit keine Analyse- oder Marketing-Cookies. Für die Darstellung dieses Hinweises merken wir uns Ihre Auswahl im Browser. Weitere Informationen finden Sie in unserer Datenschutzerklärung.</p><div class="aliev-cookie-actions"><button class="aliev-cookie-btn" type="button" data-ack>Verstanden</button><button class="aliev-cookie-btn secondary" type="button" data-settings>Einstellungen</button><a href="'+privacyPath+'#cookies">Datenschutz</a></div>';
    const overlay=document.createElement('div');overlay.className='aliev-cookie-overlay';overlay.hidden=true;overlay.innerHTML='<div class="aliev-cookie-panel" role="dialog" aria-modal="true" aria-labelledby="aliev-cookie-title"><button type="button" class="aliev-cookie-close" data-close aria-label="Schließen">×</button><h2 id="aliev-cookie-title">Cookie-Einstellungen</h2><p>Wir setzen in dieser Version der Website keine optionalen Analyse- oder Werbe-Cookies ein. Daher ist keine gesonderte Einwilligung zu Werbe- oder Analysezwecken erforderlich.</p><h3>Technisch notwendige Speicherung</h3><p>Nach „Verstanden“ speichern wir nur den Schlüssel <code>aliev_cookie_notice_seen_v1</code> mit dem Wert „yes“ im lokalen Browserspeicher (localStorage), damit der Hinweis nicht bei jedem Besuch erscheint. Sie können ihn in Ihren Browsereinstellungen löschen.</p><h3>Externe Inhalte</h3><p>Auf einigen Leistungsunterseiten werden Schriftarten von Google und Bilder von Pexels extern geladen. Dadurch können Verbindungsdaten an diese Anbieter fließen. <a href="'+privacyPath+'#dienste">Mehr in der Datenschutzerklärung</a>.</p><button type="button" class="aliev-cookie-btn" data-close>Schließen</button></div>';
    document.body.append(banner,overlay);
    if(getSeen()) banner.hidden=true;
    let lastFocus=null;
    const close=()=>{overlay.hidden=true;document.body.style.removeProperty('overflow');lastFocus?.focus?.()};
    const open=()=>{lastFocus=document.activeElement;overlay.hidden=false;document.body.style.overflow='hidden';overlay.querySelector('[data-close]')?.focus()};
    banner.querySelector('[data-ack]').addEventListener('click',()=>{markSeen();banner.hidden=true});
    banner.querySelector('[data-settings]').addEventListener('click',open);
    overlay.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',close));
    overlay.addEventListener('click',ev=>{if(ev.target===overlay)close()});
    document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&!overlay.hidden)close()});
    document.querySelectorAll('[data-cookie-settings]').forEach(a=>a.addEventListener('click',ev=>{ev.preventDefault();open()}));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
