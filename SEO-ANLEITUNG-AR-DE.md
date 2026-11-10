# ALIEV – SEO-Optimierung und Google-Indexierung (Stand: 2026-11-10)

## Was wurde in den Website-Dateien umgesetzt?
- **38 HTML-Seiten**: einzigartige, deutschsprachige SEO-Titel und Beschreibungen mit klaren Dienstleistungsbegriffen.
- Startseite und Kontaktseite: **`noindex, nofollow` entfernt**; alle Seiten haben nun `index, follow`.
- Jede Seite besitzt genau eine **absolute Canonical-URL** unter `https://alievservices.de/`.
- `robots.txt` erlaubt das Crawling und verweist auf `sitemap.xml` mit 38 vorhandenen URLs.
- Strukturierte Daten in JSON-LD: LocalBusiness, WebSite, WebPage, BreadcrumbList und passende Service-Daten.
- Social Sharing: Open Graph/Twitter mit absoluten URLs.
- Große Hero-PNGs wurden zusätzlich als **WebP** erstellt und in den Referenzen eingesetzt. PNG-Originale als Fallback/Archiv beibehalten.
- Keine erfundenen Bewertungen, Auszeichnungen, Öffnungszeiten oder Zertifizierungen.
- Impressum, Datenschutz, Ali Aliev, Telefonnummer und E-Mail aus der vorherigen Fassung übernommen. Kein Steuer-Abschnitt hinzugefügt.

## Nach dem Hochladen unbedingt erledigen
1. **Website veröffentlichen**: Dateien aus dem Ordner `ALIEV-main` im öffentlichen Webroot hochladen. Bei GitHub Pages auf die richtige Repository-Branch, bei IONOS-Webhosting in das richtige Verzeichnis. Der `CNAME` in den Dateien kann auf GitHub Pages hindeuten; ein bei IONOS registrierter Domainname beweist nicht, dass IONOS die Website hostet. Die tatsächliche Hosting-Umgebung prüfen.
2. **Erreichbarkeit prüfen**: https://alievservices.de/ , https://alievservices.de/robots.txt und https://alievservices.de/sitemap.xml müssen öffentlich über HTTPS erreichbar sein und HTTP 200 liefern. Prüfen, ob die Domain ohne `www` und `index.html` sauber auf die gewünschte Version führt; ggf. hosterseitige 301-Weiterleitungen einrichten. Canonicals allein erzwingen keine Weiterleitungen.
3. **Google Search Console** unter https://search.google.com/search-console/ öffnen. Eine Domain-Property `alievservices.de` hinzufügen und per DNS-TXT-Eintrag beim DNS-Anbieter (z. B. IONOS) verifizieren. Keine Zugangsdaten an Dritte weitergeben.
4. **Sitemap einreichen**: in Search Console → Sitemaps: `https://alievservices.de/sitemap.xml`. Unter URL-Prüfung die Startseite sowie Transport- und Reinigungsseite testen und bei Bedarf „Indexierung beantragen“.
5. **Indexierung kontrollieren**: Search Console → Seitenindexierung und Leistung. Ergebnisse, Suchanfragen, „Gecrawlt – zurzeit nicht indexiert“ und kanonische URLs beobachten und Inhalte bei Bedarf verbessern. Sitemaps und `index`-Anweisungen **garantieren keine Indexierung oder Rankingposition**.
6. **Local SEO (wenn für das Unternehmen geeignet)**: Google Unternehmensprofil unter https://www.google.com/business/ beantragen/prüfen. Unternehmensname, Telefonnummer, Website und tatsächliche Geschäftsadresse konsistent halten. Falls keine Kunden an der Adresse empfangen werden, eine zulässige Service-Area-Darstellung wählen. Keine falsche Adresse oder künstliche Bewertungen verwenden.
7. **Leistungsinhalte und Vertrauen ausbauen**: eigene, belegbare Projektfotos mit Beschreibungen, konkrete Abläufe, Einsatzgebiete und transparente Antworten auf häufige Fragen. Nur echte Bewertungen und nachweisbare Referenzen zeigen.
8. **Performance testen**: https://pagespeed.web.dev/ und https://search.google.com/test/rich-results ; nach Veröffentlichung auf Mobilgeräte prüfen und Warnungen beheben.
9. **Bing**: https://www.bing.com/webmasters/ prüfen und Sitemap einreichen.

## Hinweise
- Keine „Google-Garantie“: Bei der Dateiverarbeitung war die Live-Website über externe Recherche nicht zuverlässig abrufbar. HTTP-Status, Hosting, Canonical-Verhalten, tatsächliche Google-Indexierung und Core Web Vitals lassen sich erst nach der Veröffentlichung verlässlich kontrollieren.
- Der Unternehmenssitz wurde aus dem vorhandenen Impressum übernommen (`Pferdskopfweg 15, 65931 Frankfurt am Main`). Vor dem Produktivbetrieb alle Unternehmensangaben auf Aktualität prüfen.
- Für rechtliche Angaben in Impressum/Datenschutz und korrekte IONOS-Hostingdaten im Zweifel rechtlich beraten lassen.
- SEO-Texte sollten nur reale angebotene Dienste beschreiben. Gebietsangaben ggf. an das tatsächliche Einsatzgebiet anpassen.
