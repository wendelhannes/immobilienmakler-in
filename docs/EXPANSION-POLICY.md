# Expansions-Policy: Städte- & Stadtteil-Seiten

Stand: Juli 2026 · Verantwortlich: Hannes Wendel

## Warum dieses programmatische Muster zulässig ist

Die 50 Stadt-Hauptseiten sind ein **datengetriebenes Verzeichnis**, kein
Doorway-Muster:

- Jede Seite enthält **echte, seitenspezifische Daten**: die lokalen Maklerbüros
  mit realen Google-Bewertungen (Sterne, Anzahl), LLM-zusammengefasste
  Kundenstimmen pro Büro, Grunderwerbsteuer des Bundeslands, Einwohnerzahl.
- Jede Stadt- und Intent-Seite trägt zusätzlich einen **einzigartigen,
  daten-gegroundeten Marktkommentar** (cache-market/, rotierende Erzählwinkel).
- Gemessene Cross-City-Ähnlichkeit der Stadt-Hauptseiten: 15–25 % (Audit 07/2026)
  – deutlich unter der 60 %-Uniqueness-Schwelle.

## Regeln für Erweiterungen (Hard Gate)

1. **Keine neue Stadt**, solange sie nicht dieselbe Datentiefe liefert:
   ≥ 5 Maklerbüros mit Bewertungen, Review-Zusammenfassungen, Marktkommentar
   (kompletter Pipeline-Lauf `fetch → reviews → market → generate`).
2. **Keine neue Stadtteil-Seite** ohne (a) validen, realen Stadtteilnamen
   (lib/stadtteil.ts-Parser + Sichtprüfung) und (b) eigenen Marktkommentar.
3. **Nach jeder Erweiterung**: Stichprobe von 3 Seitenpaaren unterschiedlicher
   Städte auf Textähnlichkeit prüfen; Ziel < 40 %.
4. Intent-Guides ohne stadtspezifischen Mehrwert werden NICHT dupliziert –
   nationale Inhalte gehören auf die Pillar-Seiten (/haus-verkaufen usw.).

## Historie

- 07/2026: 11 fabrizierte/trunkierte Stadtteil-Seiten entfernt (Parser-Bug),
  301-Redirects gesetzt; Uniqueness-Schicht (Marktkommentare) für alle
  Städte, Intents und Stadtteile eingeführt.
