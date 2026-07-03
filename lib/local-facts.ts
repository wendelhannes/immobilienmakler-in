// Lokale, pro Stadt einzigartige Fakten für die Content-Uniqueness-Schicht
// (Audit C2/H2/M6): Grunderwerbsteuer je Bundesland, Einwohner, Marktdaten.

import cityList from "@/data/city-list.json";
import type { MaklerSummary } from "./types";

type City = { name: string; slug: string; bundesland: string; einwohner: number };
const CITIES = cityList as City[];

// Grunderwerbsteuersätze je Bundesland (Stand 2026).
// Quelle: Landesfinanzverwaltungen; Thüringen seit 01/2024 auf 5,0 % gesenkt,
// Sachsen seit 01/2023 auf 5,5 % erhöht.
export const GRUNDERWERBSTEUER: Record<string, number> = {
  "Baden-Württemberg": 5.0,
  Bayern: 3.5,
  Berlin: 6.0,
  Brandenburg: 6.5,
  Bremen: 5.0,
  Hamburg: 5.5,
  Hessen: 6.0,
  "Mecklenburg-Vorpommern": 6.0,
  Niedersachsen: 5.0,
  "Nordrhein-Westfalen": 6.5,
  "Rheinland-Pfalz": 5.0,
  Saarland: 6.5,
  Sachsen: 5.5,
  "Sachsen-Anhalt": 5.0,
  "Schleswig-Holstein": 6.5,
  Thüringen: 5.0,
};

export interface CityFacts {
  name: string;
  bundesland: string;
  einwohner: number;
  taxRate: number | null;
}

export function getCityFacts(stadtSlug: string): CityFacts | null {
  const city = CITIES.find((c) => c.slug === stadtSlug);
  if (!city) return null;
  return {
    name: city.name,
    bundesland: city.bundesland,
    einwohner: city.einwohner,
    taxRate: GRUNDERWERBSTEUER[city.bundesland] ?? null,
  };
}

const fmt = (n: number) => n.toLocaleString("de-DE");
const fmtRate = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 1 });

export interface MarktStats {
  count: number;
  totalReviews: number;
  avgRating: string;
  topName: string;
  gewerbeCount: number;
  stadtteile: string[];
}

export function buildMarktStats(makler: MaklerSummary[]): MarktStats | null {
  if (makler.length === 0) return null;
  const totalReviews = makler.reduce((s, m) => s + (m.reviewsCount || 0), 0);
  const avg = makler.reduce((s, m) => s + (m.rating || 0), 0) / makler.length;
  return {
    count: makler.length,
    totalReviews,
    avgRating: avg.toFixed(1).replace(".", ","),
    topName: makler[0].name,
    gewerbeCount: makler.filter((m) => m.spezialisierung === "Gewerbeimmobilien").length,
    stadtteile: Array.from(new Set(makler.map((m) => m.stadtteil).filter(Boolean))) as string[],
  };
}

/**
 * Datengetriebener "Marktlage"-Absatz (~180 Wörter), pro Stadt einzigartig
 * durch reale Zahlen: Einwohner, Bundesland, Steuersatz, Maklerdichte,
 * Bewertungsvolumen, Stadtteile, Spezialisierungen.
 */
export function buildMarktlageText(facts: CityFacts, stats: MarktStats): string {
  const parts: string[] = [];

  parts.push(
    `${facts.name} zählt rund ${fmt(facts.einwohner)} Einwohner und gehört damit zu den ` +
      `wichtigsten Immobilienmärkten in ${facts.bundesland}.`
  );

  if (facts.taxRate != null) {
    parts.push(
      `Käufer zahlen in ${facts.bundesland} eine Grunderwerbsteuer von ${fmtRate(facts.taxRate)} % ` +
        `des Kaufpreises – ein Kostenfaktor, den Eigentümer bei der Preisverhandlung kennen sollten.`
    );
  }

  parts.push(
    `Für unseren Vergleich haben wir ${stats.count} Maklerbüros in ${facts.name} ausgewertet, ` +
      `die zusammen ${fmt(stats.totalReviews)} Google-Bewertungen mit einem Schnitt von ` +
      `${stats.avgRating} von 5 Sternen erhalten haben.`
  );

  parts.push(
    `Die höchste Bewertungsqualität erreicht aktuell ${stats.topName}.`
  );

  if (stats.stadtteile.length >= 2) {
    parts.push(
      `Mehrere Büros sind klar auf einzelne Lagen spezialisiert – darunter ` +
        `${stats.stadtteile.slice(0, 3).join(", ")} – was bei stadtteilspezifischen ` +
        `Objekten ein echter Vorteil sein kann.`
    );
  }

  if (stats.gewerbeCount > 0) {
    parts.push(
      `${stats.gewerbeCount === 1 ? "Ein Büro ist" : `${stats.gewerbeCount} Büros sind`} ` +
        `auf Gewerbeimmobilien spezialisiert.`
    );
  }

  parts.push(
    `Alle Angaben beruhen auf öffentlich einsehbaren Google-Bewertungen und werden regelmäßig aktualisiert.`
  );

  return parts.join(" ");
}

/** Lokale Zusatz-FAQ mit echten Daten (Audit M6). */
export function buildLocalFaq(
  facts: CityFacts,
  pageType: string
): { q: string; a: string }[] {
  const faq: { q: string; a: string }[] = [];
  const taxPages = ["hauptseite", "haus-verkaufen", "was-kostet-ein-immobilienmakler", "immobilienbewertung"];
  if (facts.taxRate != null && taxPages.includes(pageType)) {
    faq.push({
      q: `Wie hoch ist die Grunderwerbsteuer in ${facts.name}?`,
      a:
        `In ${facts.name} gilt der Grunderwerbsteuersatz des Landes ${facts.bundesland}: ` +
        `${fmtRate(facts.taxRate)} % des Kaufpreises. Sie wird beim Immobilienkauf fällig ` +
        `und in der Regel vom Käufer getragen (Stand ${new Date().getFullYear()}).`,
    });
  }
  return faq;
}
