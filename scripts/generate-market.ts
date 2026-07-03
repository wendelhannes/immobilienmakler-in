import fs from "node:fs";
import path from "node:path";
import { slugify } from "../lib/slug";
import type { City, Makler } from "../lib/types";

const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  for (const line of fs.readFileSync(envLocalPath, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = "claude-sonnet-4-6";
const CITY_LIST_PATH = path.join(process.cwd(), "data", "city-list.json");
const CITIES_DIR = path.join(process.cwd(), "data", "cities");
const MARKET_DIR = path.join(process.cwd(), "cache-market");
const RATE_LIMIT_MS = 500;

// Grunderwerbsteuersätze je Bundesland (Stand 2026) – gespiegelt aus lib/local-facts.
const GRUNDERWERBSTEUER: Record<string, number> = {
  "Baden-Württemberg": 5.0, Bayern: 3.5, Berlin: 6.0, Brandenburg: 6.5,
  Bremen: 5.0, Hamburg: 5.5, Hessen: 6.0, "Mecklenburg-Vorpommern": 6.0,
  Niedersachsen: 5.0, "Nordrhein-Westfalen": 6.5, "Rheinland-Pfalz": 5.0,
  Saarland: 6.5, Sachsen: 5.5, "Sachsen-Anhalt": 5.0,
  "Schleswig-Holstein": 6.5, Thüringen: 5.0,
};

const INTENTS = [
  "haus-verkaufen",
  "immobilienbewertung",
  "was-kostet-ein-immobilienmakler",
  "wie-finde-ich-einen-guten-immobilienmakler",
  "immobilienmakler-oder-privat-verkaufen",
] as const;

// Intent-spezifischer Kontext für das Prompt.
const INTENT_CONTEXT: Record<string, string> = {
  "haus-verkaufen":
    "Ratgeberseite zum Hausverkauf. Schreibe einen lokalen Marktkontext für Verkäufer in {stadt}: Wie ist die Maklerlandschaft vor Ort aufgestellt (Dichte, Bewertungsvolumen, Spezialisierungen)? Du darfst die Grunderwerbsteuer als Käufer-Nebenkosten kurz einordnen. KEINE erfundenen Verkaufsdauern, Quadratmeterpreise oder Prozentwerte.",
  immobilienbewertung:
    "Ratgeberseite zur Immobilienbewertung. Schreibe, worauf es bei einer lokalen Bewertung in {stadt} ankommt und wie eine dichte, gut bewertete Maklerlandschaft dabei hilft. KEINE erfundenen Quadratmeterpreise oder Wertangaben.",
  "was-kostet-ein-immobilienmakler":
    "Ratgeberseite zu Maklerkosten. Ordne die Kostenblöcke beim Immobilienkauf/-verkauf in {stadt} ein: die Maklerprovision (gesetzliche Teilung zwischen Käufer und Verkäufer) UND die Grunderwerbsteuer als separaten Käufer-Kostenblock. KEINE erfundenen konkreten Provisionssätze über die gesetzliche Regelung hinaus.",
  "wie-finde-ich-einen-guten-immobilienmakler":
    "Ratgeberseite zur Maklerwahl. Schreibe, wie man in {stadt} anhand echter Google-Bewertungen (Anzahl und Durchschnitt) einen guten Makler erkennt – mit Bezug auf die konkrete Bewertungslandschaft vor Ort. KEINE erfundenen Zahlen.",
  "immobilienmakler-oder-privat-verkaufen":
    "Ratgeberseite Makler vs. Privatverkauf. Schreibe, wann sich in {stadt} ein Makler lohnt – mit Bezug auf die lokale Wettbewerbs-/Maklerdichte. KEINE erfundenen Statistiken.",
};

// Rotierende Erzähl-Winkel gegen strukturelle Duplikate.
const ANGLES = [
  "Beginne mit der Größe und Bedeutung des Marktes (Einwohner, Bundesland).",
  "Beginne mit der Bewertungslandschaft (Anzahl Makler, Gesamtzahl der Google-Bewertungen).",
  "Beginne mit einem konkreten Kostenaspekt (z. B. der Grunderwerbsteuer).",
  "Beginne mit dem bestbewerteten Anbieter und was ihn auszeichnet.",
  "Beginne mit den Spezialisierungen bzw. den Stadtteilen der lokalen Makler.",
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseArgs() {
  const a = process.argv.slice(2);
  const gi = (f: string) => (a.indexOf(f) !== -1 ? a[a.indexOf(f) + 1] : undefined);
  return {
    stadt: gi("--stadt"),
    limit: gi("--limit") ? parseInt(gi("--limit")!, 10) : undefined,
    force: a.includes("--force"),
  };
}

const fmt = (n: number) => n.toLocaleString("de-DE");

function factsBlock(city: City, makler: Makler[]): string {
  const withRev = makler;
  const totalReviews = withRev.reduce((s, m) => s + (m.reviewsCount || 0), 0);
  const avg = withRev.reduce((s, m) => s + (m.rating || 0), 0) / (withRev.length || 1);
  const top = withRev[0];
  const stadtteile = Array.from(new Set(makler.map((m) => m.stadtteil).filter(Boolean)));
  const spezMap = new Map<string, number>();
  for (const m of makler) spezMap.set(m.spezialisierung, (spezMap.get(m.spezialisierung) || 0) + 1);
  const spez = Array.from(spezMap.entries()).map(([k, v]) => `${v}× ${k}`).join(", ");
  const tax = GRUNDERWERBSTEUER[city.bundesland];

  const lines = [
    `Stadt: ${city.name}`,
    `Bundesland: ${city.bundesland}`,
    `Einwohner: ${fmt(city.einwohner)}`,
    tax != null ? `Grunderwerbsteuer im Bundesland: ${tax.toLocaleString("de-DE", { minimumFractionDigits: 1 })} % des Kaufpreises` : "",
    `Ausgewertete Maklerbüros: ${makler.length}`,
    `Google-Bewertungen gesamt: ${fmt(totalReviews)}`,
    `Durchschnittsbewertung: ${avg.toFixed(1).replace(".", ",")} von 5`,
    top ? `Bestbewertetes Büro: ${top.name} (${top.rating.toString().replace(".", ",")} Sterne, ${fmt(top.reviewsCount)} Bewertungen)` : "",
    stadtteile.length ? `Vertretene Stadtteile: ${stadtteile.slice(0, 6).join(", ")}` : "",
    spez ? `Spezialisierungen: ${spez}` : "",
  ].filter(Boolean);
  return lines.join("\n");
}

function buildPrompt(city: City, makler: Makler[], key: string, angleIdx: number): string {
  const facts = factsBlock(city, makler);
  const angle = ANGLES[angleIdx % ANGLES.length];

  if (key === "hauptseite") {
    return `Du bist Redakteur eines unabhängigen Immobilienmakler-Vergleichsportals. Schreibe einen einzigartigen, sachlichen Marktüberblick zu Immobilienmaklern in ${city.name}.

Nur diese Fakten verwenden (nichts erfinden):
${facts}

Regeln:
- 220 bis 280 Wörter, natürlicher redaktioneller Fließtext (2–3 Absätze), KEINE Aufzählungen, KEINE Zwischenüberschriften.
- ${angle}
- Verwende die Wendung "Immobilienmakler ${city.name}" ein- bis zweimal natürlich.
- Nutze ausschließlich die oben genannten Zahlen. Erfinde KEINE Quadratmeterpreise, Vermarktungsdauern, Prozentwerte oder Datumsangaben.
- Kein Marketing-Sprech, keine Superlative ohne Datenbeleg, keine Anrede des Lesers.
- Gib NUR den Fließtext aus, ohne Vorbemerkung.`;
  }

  const context = (INTENT_CONTEXT[key] || "").replace(/\{stadt\}/g, city.name);
  return `Du bist Redakteur eines unabhängigen Immobilienmakler-Vergleichsportals. ${context}

Nur diese Fakten verwenden (nichts erfinden):
${facts}

Regeln:
- 140 bis 180 Wörter, ein bis zwei Absätze Fließtext, KEINE Aufzählungen.
- ${angle}
- Nutze ausschließlich die oben genannten Zahlen. Erfinde KEINE konkreten Preise, Dauern oder Prozentwerte über die genannten hinaus.
- Sachlich, ortsbezogen, kein Marketing-Sprech.
- Gib NUR den Fließtext aus, ohne Vorbemerkung.`;
}

async function generate(prompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 700,
      temperature: 0.8,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status} ${res.statusText}`);
  const data = await res.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) throw new Error("Leere Antwort");
  return text;
}

async function main() {
  if (!ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY fehlt (.env.local).");
    process.exit(1);
  }
  const { stadt, limit, force } = parseArgs();
  const allCities: City[] = JSON.parse(fs.readFileSync(CITY_LIST_PATH, "utf-8"));
  const cities = stadt ? allCities.filter((c) => c.slug === slugify(stadt)) : allCities;

  const keys = ["hauptseite", ...INTENTS];
  let generated = 0, cached = 0, skippedNoData = 0, failed = 0;

  for (let ci = 0; ci < cities.length; ci++) {
    const city = cities[ci];
    const dataPath = path.join(CITIES_DIR, `${city.slug}.json`);
    if (!fs.existsSync(dataPath)) { skippedNoData++; continue; }
    const makler: Makler[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    if (makler.length === 0) { skippedNoData++; continue; }

    const cityDir = path.join(MARKET_DIR, city.slug);
    fs.mkdirSync(cityDir, { recursive: true });

    for (let ki = 0; ki < keys.length; ki++) {
      const key = keys[ki];
      const out = path.join(cityDir, `${key}.json`);
      if (!force && fs.existsSync(out)) {
        cached++;
        continue;
      }
      const toDo = limit && generated >= limit;
      if (toDo) break;
      try {
        // Winkel variiert über Stadt UND Seitentyp -> unterschiedliche Struktur.
        const text = await generate(buildPrompt(city, makler, key, ci + ki));
        fs.writeFileSync(out, JSON.stringify({ text, generated_at: new Date().toISOString() }, null, 2), "utf-8");
        generated++;
        console.log(`[${ci + 1}/${cities.length}] ${city.name} · ${key} ✓ (${text.split(/\s+/).length} W)`);
        await sleep(RATE_LIMIT_MS);
      } catch (e) {
        failed++;
        console.error(`[${ci + 1}/${cities.length}] ${city.name} · ${key} FEHLER: ${(e as Error).message}`);
      }
    }
    if (limit && generated >= limit) break;
  }

  console.log(`\nFertig: ${generated} neu, ${cached} aus Cache, ${failed} Fehler, ${skippedNoData} Städte ohne Daten.`);
}

main();
