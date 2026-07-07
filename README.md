# immobilienmakler-in

Unabhängiger Vergleich der bestbewerteten Immobilienmakler in 50 deutschen Städten – auf Basis echter Google-Bewertungen, ganz ohne bezahlte Platzierungen.

🔗 **Live:** [immobilienmakler-in.com](https://immobilienmakler-in.com)

## Worum geht's?

Wer eine Immobilie verkaufen möchte, findet online kaum verlässliche Informationen darüber, welcher Makler in seiner Stadt wirklich gute Arbeit leistet. **immobilienmakler-in.com** schafft hier Transparenz: Für jede Stadt werden die öffentlich einsehbaren Google-Bewertungen aller relevanten Maklerbüros ausgewertet und gegenübergestellt – nach Sterne-Durchschnitt und Anzahl der Bewertungen, ohne Werbeplätze oder bezahlte Rankings.

Zusätzlich gibt es einen [Ratgeberbereich](https://immobilienmakler-in.com/ratgeber) rund um den Immobilienverkauf (Hausverkauf, Immobilienbewertung, Maklerprovision, Maklerauswahl u.v.m.) sowie kostenlose Tools für Makler selbst, um ihre eigene Online-Sichtbarkeit zu prüfen.

## Features

- 📍 [Maklerranking für 50 deutsche Großstädte](https://immobilienmakler-in.com/staedte)
- ★ Ranking ausschließlich nach echten Google-Bewertungen
- 📖 [Ratgeberartikel](https://immobilienmakler-in.com/ratgeber) zu Ablauf, Kosten und Bewertung beim Immobilienverkauf, u.a. [Haus verkaufen](https://immobilienmakler-in.com/haus-verkaufen) und [SEO für Immobilienmakler](https://immobilienmakler-in.com/seo-fuer-immobilienmakler)
- 🔍 [Kostenloser Sichtbarkeits-Check](https://immobilienmakler-in.com/sichtbarkeits-check) für Makler (SEO & KI-Suche)
- 100 % kostenlos, keine Anmeldung, keine Datenweitergabe

## Tech-Stack

- [Next.js](https://nextjs.org/) / TypeScript
- CSS
- Deployment via [Vercel](https://vercel.com/)

## Projektstruktur

```
app/            – Next.js App Router (Seiten, Layouts)
components/     – Wiederverwendbare UI-Komponenten
content/        – Ratgeber- und Städte-Inhalte
data/           – Makler- und Städtedaten
lib/            – Hilfsfunktionen
public/         – Statische Assets
scripts/        – Build- und Daten-Scripts
```

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Anschließend läuft die App unter `http://localhost:3000`.

## Kontakt

Ein Projekt von [Hannes Wendel](https://immobilienmakler-in.com/ueber-uns).
Fragen, Feedback oder Kooperationsanfragen: siehe [Über uns](https://immobilienmakler-in.vercel.app/ueber-uns) auf der Website.
