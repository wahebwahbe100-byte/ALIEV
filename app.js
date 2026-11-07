"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const config = window.ALIEV_CONFIG || {};
const services = {
  courier: { title: "Kurier- & Direktfahrten", category: "TRANSPORT & UMZUG", image: "courier", description: "Wenn eine Sendung direkt ans Ziel kommen soll. Wir stimmen Abholung, Transport und Übergabe auf Ihren Bedarf ab.", features: ["Direkte Beförderung Ihrer Sendung", "Abhol- und Zieladresse individuell abgestimmt", "Planung passend zu Umfang und Termin"] },
  furniture: { title: "Möbel- & Gütertransport", category: "TRANSPORT & UMZUG", image: "furniture", description: "Vom einzelnen Möbelstück bis zu mehreren Gütern: Wir planen den Transport mit dem passenden Blick für Maße, Schutz und Zugänglichkeit.", features: ["Transport einzelner Möbel und weiterer Güter", "Sorgfältiger Umgang beim Be- und Entladen", "Verpackung und Montage ergänzend anfragbar"] },
  moving: { title: "Privat- & Firmenumzüge", category: "TRANSPORT & UMZUG", image: "moving", description: "Ein Umzug ist mehr als ein Ortswechsel. Gemeinsam planen wir die Aufgaben, damit Ihr Zuhause oder Ihr Unternehmen gut am neuen Ort ankommt.", features: ["Planung von privaten und gewerblichen Umzügen", "Abstimmung von Umfang, Ablauf und Terminen", "Verpackung, Montage und Reinigung kombinierbar"] },
  packing: { title: "Verpackungsservice", category: "TRANSPORT & UMZUG", image: "packing", description: "Guter Schutz beginnt vor dem Transport. Wir besprechen, welche Gegenstände besondere Aufmerksamkeit benötigen und welche Verpackung sich dafür eignet.", features: ["Verpackung passend zu Ihren Gegenständen", "Schutz für empfindliche Oberflächen", "Ergänzend zu Transport und Umzug planbar"] },
  clearance: { title: "Entrümpelung & Entsorgung", category: "TRANSPORT & UMZUG", image: "clearance", description: "Manchmal braucht es Platz für etwas Neues. Wir besprechen mit Ihnen, welche Gegenstände bleiben und welche entfernt werden sollen.", features: ["Räumung nach gemeinsam festgelegtem Umfang", "Abstimmung zu Gegenständen und Zugänglichkeit", "Entsorgungsumfang vorab persönlich klären"] },
  assembly: { title: "Möbelmontage", category: "TRANSPORT & UMZUG", image: "assembly", description: "Damit aus Möbelteilen wieder ein Zuhause oder Arbeitsplatz wird. Montageaufgaben lassen sich passend zu Ihrem Umzug oder als eigene Leistung anfragen.", features: ["Auf- und Abbau nach vorheriger Abstimmung", "Planung anhand von Möbeltyp und Umfang", "Mit Möbeltransport oder Umzug kombinierbar"] },
  office: { title: "Büro- & Unterhaltsreinigung", category: "REINIGUNG & PFLEGE", image: "office", description: "Ein gepflegter Arbeitsplatz schafft ein angenehmes Umfeld. Wir stimmen die Reinigung auf Ihre Räume, deren Nutzung und Ihren Alltag ab.", features: ["Individuell abgestimmte Reinigungsbereiche", "Einmalige oder regelmäßige Reinigung anfragen", "Umfang und Turnus passend zu Ihrem Betrieb"] },
  windows: { title: "Glas- & Fensterreinigung", category: "REINIGUNG & PFLEGE", image: "windows", description: "Für klare Aussichten und gepflegte Glasflächen. Teilen Sie uns mit, welche Fenster oder Glasflächen gereinigt werden sollen.", features: ["Fenster und Glasflächen nach Absprache", "Rahmenreinigung im Leistungsumfang klären", "Zugänglichkeit und Umfang vorab abstimmen"] },
  "home-cleaning": { title: "Privat- & Haushaltsreinigung", category: "REINIGUNG & PFLEGE", image: "home-cleaning", description: "Ein sauberes Zuhause und mehr Raum für Ihren Alltag. Gemeinsam legen wir fest, welche Bereiche gereinigt werden und wie häufig Sie Unterstützung wünschen.", features: ["Reinigung Ihrer vereinbarten Wohnbereiche", "Einmalige oder regelmäßige Unterstützung", "Schwerpunkte nach Ihren Wünschen abstimmen"] },
  stairs: { title: "Treppenhausreinigung", category: "REINIGUNG & PFLEGE", image: "about", description: "Der erste Eindruck beginnt im Eingangsbereich. Wir stimmen die Pflege gemeinsam genutzter Flächen auf das Gebäude und Ihren Bedarf ab.", features: ["Treppen und Podeste nach Absprache", "Eingangsbereiche im Umfang berücksichtigen", "Regelmäßigen Turnus individuell festlegen"] },
  deep: { title: "Grundreinigung", category: "REINIGUNG & PFLEGE", image: "home-cleaning", description: "Wenn es gründlicher sein darf. Gemeinsam bestimmen wir die Flächen und Bereiche, die eine intensive Reinigung benötigen.", features: ["Intensive Reinigung vereinbarter Bereiche", "Materialien und Oberflächen berücksichtigen", "Passend zu Bedarf und Zustand planen"] },
  construction: { title: "Bauendreinigung", category: "REINIGUNG & PFLEGE", image: "office", description: "Nach Bau- oder Renovierungsarbeiten folgt der letzte Schritt: Wir besprechen die Reinigung der betroffenen Räume und Flächen für die anschließende Nutzung.", features: ["Reinigung nach Bau- und Renovierungsarbeiten", "Umfang anhand des Objektzustands abstimmen", "Termin passend zur Fertigstellung planen"] }
};

const menuToggle = $(".menu-toggle");
const mobileNav = $("#mobile-nav");
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Menü öffnen");
  mobileNav.hidden = true;
}
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Menü öffnen" : "Menü schließen");
  mobileNav.hidden = expanded;
});
$$("a", mobileNav).forEach(link => link.addEventListener("click", closeMenu));
// On the homepage, the Startseite link always returns to the hero at the top.
// The mobile menu is already closed by its existing link click handler.
if (document.body.classList.contains("page-home")) {
  $$(".desktop-nav a[href='#start'], .mobile-nav a[href='#start']").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      window.scrollTo({top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
    });
  });
}
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); }
});
window.matchMedia("(min-width: 981px)").addEventListener("change", event => { if (event.matches) closeMenu(); });

function openDialog(dialog) {
  dialog.showModal();
  document.body.classList.add("modal-open");
}
for (const dialog of $$("dialog")) {
  $(".dialog-close", dialog).addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => { if (!$("dialog[open]")) document.body.classList.remove("modal-open"); });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
}

const serviceDialog = $("#service-dialog");
let selectedService = null;
for (const button of $$("[data-service]")) {
  button.addEventListener("click", () => {
    const service = services[button.dataset.service];
    if (!service) return;
    selectedService = service;
    $("#dialog-service-category").textContent = service.category;
    $("#dialog-service-title").textContent = service.title;
    $("#dialog-service-description").textContent = service.description;
    $("#dialog-service-image").src = `assets/${service.image}.webp`;
    $("#dialog-service-image").alt = `Illustration: ${service.title}`;
    const features = $("#dialog-service-features");
    features.replaceChildren();
    for (const feature of service.features) {
      const item = document.createElement("li");
      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.classList.add("icon"); icon.setAttribute("aria-hidden", "true");
      const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      use.setAttribute("href", "#i-check"); icon.append(use);
      const text = document.createElement("span"); text.textContent = feature;
      item.append(icon, text); features.append(item);
    }
    openDialog(serviceDialog);
  });
}

let toastTimeout;
function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => element.classList.remove("visible"), 3500);
}
function selectService(title) {
  const select = $("#service-select");
  if (!select) {
    window.location.assign(`kontakt.html?service=${encodeURIComponent(title)}#kontakt`);
    return;
  }
  select.value = title;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  toast(`Leistung ausgewählt: ${title}`);
}
$("#request-service")?.addEventListener("click", () => {
  if (!selectedService) return;
  serviceDialog.close();
  selectService(selectedService.title);
});
// Subpages pass the desired cleaning service in the URL when returning to the inquiry form.
const linkedService = new URLSearchParams(window.location.search).get("service");
if (linkedService && $("#service-select")) {
  const select = $("#service-select");
  if ([...select.options].some(option => option.value === linkedService)) {
    select.value = linkedService;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

$$("[data-select]").forEach(link => link.addEventListener("click", event => {
  event.preventDefault();
  selectService(link.dataset.select);
}));

const legalDialog = $("#legal-dialog");
const legalContent = $("#legal-content");
function legalParagraph(text, className = "") {
  const element = document.createElement("p");
  element.textContent = text;
  if (className) element.className = className;
  legalContent.append(element);
}
function legalHeading(text) {
  const element = document.createElement("h3"); element.textContent = text; legalContent.append(element);
}
function showLegal(type) {
  legalContent.replaceChildren();
  if (type === "imprint") {
    $("#legal-title").textContent = "Impressum";
    const company = config.company || {};
    if (!company.legalName || !company.street || !company.postalCity) {
      legalParagraph("Private Website-Vorschau: Die verbindlichen Unternehmens- und Kontaktangaben wurden noch nicht hinterlegt.", "notice");
      legalHeading("ALIEV Logistics & Services");
      legalParagraph("Vor einer öffentlichen Nutzung sind der vollständige Unternehmensname, die vertretungsberechtigte Person, die Geschäftsanschrift und die Kontaktangaben zu ergänzen. Weitere Register- oder Steuerangaben können je nach Unternehmen erforderlich sein.");
    } else {
      legalHeading(company.legalName);
      [company.representative, company.street, company.postalCity].filter(Boolean).forEach(value => legalParagraph(value));
      if (company.phone || company.email) legalHeading("Kontakt");
      if (company.phone) legalParagraph(`Telefon: ${company.phone}`);
      if (company.email) legalParagraph(`E-Mail: ${company.email}`);
      if (company.register) { legalHeading("Registerangaben"); legalParagraph(company.register); }
      if (company.vatId) { legalHeading("Umsatzsteuer-ID"); legalParagraph(company.vatId); }
    }
    legalHeading("Bildhinweis");
    legalParagraph("Die Website verwendet Stockfotografien und KI-generierte Bildmotive zur Illustration der Leistungen. Die Motive zeigen keine dokumentierten ALIEV-Kundenaufträge, Mitarbeitenden oder Geschäftsräume. Die Fotos der Transport-Leistungsgalerie stammen von Pexels; die Bildnachweise sind im Website-Paket enthalten.");
  } else {
    $("#legal-title").textContent = "Datenschutzhinweise";
    legalParagraph("Hinweise zur privaten Vorschau. Die vollständige, auf den tatsächlichen Betrieb abgestimmte Datenschutzerklärung ist vor einer öffentlichen Nutzung zu ergänzen.", "notice");
    legalHeading("Das Anfrageformular");
    legalParagraph("Ihre Eingaben werden in dieser Vorschau im Browser verarbeitet, um eine Zusammenfassung und eine Textdatei zu erstellen. Das Formular übermittelt keine Anfrage an ALIEV und speichert Ihre Eingaben nicht in einer Datenbank. Beim Neuladen der Seite gehen die Eingaben verloren.");
    legalHeading("Heruntergeladener Entwurf");
    legalParagraph("Wenn Sie den Entwurf herunterladen, enthält die Datei Ihre eingegebenen Angaben. Sie entscheiden selbst, wo Sie die Datei speichern und an wen Sie sie weitergeben.");
    if (config.inquiryEmail) {
      legalHeading("E-Mail-Programm");
      legalParagraph("Über „E-Mail öffnen“ werden die Angaben an Ihr eingerichtetes E-Mail-Programm übergeben. Der Versand erfolgt erst, wenn Sie ihn dort auslösen.");
    }
    legalHeading("Betrieb dieser Vorschau");
    legalParagraph("Der Anwendungscode bindet keine Analyse- oder Werbedienste ein. Die Bereitstellung und Zugangskontrolle erfolgen über die Hosting-Plattform. Für deren Datenverarbeitung gelten zusätzlich die Hinweise des Plattformanbieters.");
    legalHeading("Verantwortliche Stelle");
    legalParagraph(config.company?.email ? `Kontakt: ${config.company.email}` : "Die verantwortliche Stelle und ihre Kontaktdaten sind vom Websitebetreiber noch zu ergänzen.");
  }
  openDialog(legalDialog);
}
$$("[data-legal]").forEach(button => button.addEventListener("click", () => showLegal(button.dataset.legal)));

const form = $("#inquiry-form");
if (form) {
const inquiryDialog = $("#inquiry-dialog");
let inquiryText = "";
const dateField = $("input[name=date]");
const today = new Date();
dateField.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
for (const input of $$("input, textarea", form)) {
  input.addEventListener("input", () => input.setCustomValidity(""));
}
const recipient = typeof config.inquiryEmail === "string" && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.inquiryEmail) ? config.inquiryEmail : "";
if (recipient) $("#form-note").textContent = "Prüfen Sie Ihre Anfrage im nächsten Schritt. Der Versand erfolgt über Ihr E-Mail-Programm.";

form.addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  for (const key of ["name", "email", "phone", "location", "message"]) data[key] = String(data[key] || "").trim();
  if (data.name.length < 2) { form.elements.name.setCustomValidity("Bitte geben Sie Ihren Namen ein."); form.elements.name.reportValidity(); return; }
  if (data.message.length < 10) { form.elements.message.setCustomValidity("Bitte beschreiben Sie Ihr Vorhaben mit mindestens 10 Zeichen."); form.elements.message.reportValidity(); return; }
  if (!form.reportValidity()) return;
  const date = data.date ? new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${data.date}T12:00:00`)) : "Nach Absprache";
  const rows = [["Leistung", data.service], ["Name", data.name], ["E-Mail", data.email], ["Telefon", data.phone || "Nicht angegeben"], ["Ort / PLZ", data.location || "Nach Absprache"], ["Wunschtermin", date], ["Nachricht", data.message]];
  const summary = $("#inquiry-summary");
  summary.replaceChildren();
  for (const [label, value] of rows) {
    const row = document.createElement("div"); row.className = "summary-row";
    const term = document.createElement("dt"); term.textContent = label;
    const detail = document.createElement("dd"); detail.textContent = value;
    row.append(term, detail); summary.append(row);
  }
  inquiryText = "ALIEV LOGISTICS & SERVICES\nANFRAGEENTWURF — NOCH NICHT VERSENDET\n\n" + rows.map(([label, value]) => `${label}: ${value}`).join("\n\n");
  $("#download-status").textContent = "";
  if (recipient) {
    $("#email-inquiry").hidden = false;
    $("#email-inquiry").href = `mailto:${recipient}?subject=${encodeURIComponent(`Projektanfrage: ${data.service}`)}&body=${encodeURIComponent(inquiryText.replace("ANFRAGEENTWURF — NOCH NICHT VERSENDET", "PROJEKTANFRAGE"))}`;
    $("#inquiry-status").textContent = "Prüfen Sie Ihre Angaben. Öffnen Sie anschließend Ihr E-Mail-Programm, um die Anfrage selbst zu versenden, oder laden Sie den Entwurf herunter.";
  }
  openDialog(inquiryDialog);
});
$("#download-inquiry").addEventListener("click", () => {
  if (!inquiryText) return;
  const file = new Blob(["\uFEFF", inquiryText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url; link.download = "ALIEV-Anfrage.txt";
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  $("#download-status").textContent = "Der Download wurde gestartet. Ihre Anfrage wurde nicht versendet.";
});
$("#edit-inquiry").addEventListener("click", () => {
  inquiryDialog.close();
  form.elements.name.focus({ preventScroll: true });
});
} // The inquiry form is hosted on kontakt.html only.

$$("#year, [data-current-year]").forEach(element => {
  element.textContent = new Date().getFullYear();
});
// Homepage navigation underline: highlight the section currently in view, including the contact CTA.
// Transport and Reinigung link to other HTML pages, not to #transport or
// #reinigung, so comparing hrefs to `#${section.id}` never matched them.
// Use a single scroll-position calculation rather than competing IO callbacks.
(() => {
  if (!document.body.classList.contains("page-home")) return;
  const targets = [
    ["start", "#start"],
    ["leistungen", "#start"],
    ["transport", "transport.html"],
    ["reinigung", "gebaeudereinigung.html"],
    ["ueber-uns", "#ueber-uns"],
    ["projekt-kontakt", "kontakt.html#kontakt"]
  ].map(([id, href]) => ({ element: document.getElementById(id), href }))
    .filter(item => item.element);
  const links = $$(".desktop-nav a, .mobile-nav a");
  if (!targets.length || !links.length) return;

  let scheduled = false;
  const updateActiveLink = () => {
    scheduled = false;
    // Anticipate the next section before its title reaches the center of the screen.
    // The link switches while the next section is approaching from the bottom,
    // around 78% of the viewport height, on desktop and mobile alike.
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const anticipatoryLine = viewportHeight * 0.78;
    let href = null;
    targets.forEach(({ element, href: candidate }) => {
      if (element.getBoundingClientRect().top <= anticipatoryLine) href = candidate;
    });
    links.forEach(link => {
      link.classList.toggle("active", href !== null && link.getAttribute("href") === href);
    });
  };
  const requestUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateActiveLink);
  };
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("load", requestUpdate);
  requestUpdate();
})();

// Direct footer links on related pages open the corresponding existing legal dialog.
const legalRequest = new URLSearchParams(window.location.search).get("legal");
if (legalRequest === "privacy" || legalRequest === "imprint") {
  showLegal(legalRequest);
}
