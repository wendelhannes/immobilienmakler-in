import fs from "node:fs";
import path from "node:path";
import { slugify } from "../lib/slug";
import type { City, Makler, MaklerSummary, FaqItem, PageData, InternalLink } from "../lib/types";

const CITY_LIST_PATH = path.join(process.cwd(), "data", "city-list.json");
const CITIES_DIR = path.join(process.cwd(), "data", "cities");
const CACHE_DIR = path.join(process.cwd(), "cache");
const MARKET_DIR = path.join(process.cwd(), "cache-market");
const CONTENT_DIR = path.join(process.cwd(), "content");
const INTENTS_PATH = path.join(process.cwd(), "data", "intents.json");
const QUESTIONS_PATH = path.join(process.cwd(), "data", "questions.json");

const JAHR = new Date().getFullYear();
const GENERATED_AT = new Date().toISOString().slice(0, 10);

const INTENT_SLUGS = [
  "haus-verkaufen",
  "immobilienbewertung",
  "was-kostet-ein-immobilienmakler",
  "wie-finde-ich-einen-guten-immobilienmakler",
  "immobilienmakler-oder-privat-verkaufen",
] as const;

const INTENT_LABELS: Record<string, string> = {
  "haus-verkaufen": "Haus verkaufen",
  "immobilienbewertung": "Immobilienbewertung",
  "was-kostet-ein-immobilienmakler": "Was kostet ein Immobilienmakler?",
  "wie-finde-ich-einen-guten-immobilienmakler": "Wie finde ich einen guten Immobilienmakler?",
  "immobilienmakler-oder-privat-verkaufen": "Makler oder privat verkaufen?",
};

function stripMarkdown(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
}

function loadReviewCache(citySlug: string, maklerSlug: string): string | undefined {
  const p = path.join(CACHE_DIR, citySlug, `${maklerSlug}.json`);
  if (!fs.existsSync(p)) return undefined;
  const data = JSON.parse(fs.readFileSync(p, "utf-8"));
  return stripMarkdown(data.text as string);
}

// Einzigartiger, LLM-generierter Marktkommentar je Stadt/Seitentyp.
function loadMarketText(citySlug: string, key: string): string | undefined {
  const p = path.join(MARKET_DIR, citySlug, `${key}.json`);
  if (!fs.existsSync(p)) return undefined;
  try {
    const data = JSON.parse(fs.readFileSync(p, "utf-8"));
    const t = (data.text as string)?.trim();
    return t || undefined;
  } catch {
    return undefined;
  }
}

function templateFallback(m: Makler): string {
  return `Kunden bewerten den Makler mit ${m.rating} von 5 Sternen. Insgesamt liegen ${m.reviewsCount} Bewertungen vor.`;
}

// Deterministischer Mini-Hash für die Formulierungs-Rotation.
function hashOf(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// Audit-Fix: der Satz "Der Makler ist auf X spezialisiert" stand ~1.000× wörtlich
// identisch auf der Seite. Jetzt: 6 rotierende Formulierungen; bei Standard-
// Spezialisierung (Wohnimmobilien) ohne Stadtteil entfällt der Satz teilweise ganz.
function buildSpezSentence(m: Makler, city: City): string {
  const spez = m.spezialisierung;
  const ort = m.stadtteil ? `${city.name}-${m.stadtteil}` : undefined;
  const h = hashOf(m.slug + city.slug);

  // Standardfall ohne Ortsbezug: in der Hälfte der Fälle weglassen.
  if (spez === "Wohnimmobilien" && !ort && h % 2 === 0) return "";

  const variants = [
    ` Der Makler ist auf ${spez} spezialisiert${ort ? ` und in ${ort} ansässig` : ""}.`,
    ` Der Schwerpunkt des Büros liegt auf ${spez}${ort ? `; ansässig ist es in ${ort}` : ""}.`,
    ` Spezialisiert ist das Büro auf ${spez}${ort ? `, mit Standort in ${ort}` : ""}.`,
    ` Fachlicher Fokus: ${spez}${ort ? ` – das Büro sitzt in ${ort}` : ""}.`,
    ` Das Team arbeitet schwerpunktmäßig im Bereich ${spez}${ort ? ` und ist in ${ort} zu Hause` : ""}.`,
    `${ort ? ` Das Büro ist in ${ort} ansässig und` : " Das Büro ist"} auf ${spez} ausgerichtet.`,
  ];
  return variants[h % variants.length];
}

function buildMaklerHtml(m: Makler, city: City): string {
  const reviewText = loadReviewCache(city.slug, m.slug) || templateFallback(m);
  const stadtteilSlug = m.stadtteil ? slugify(m.stadtteil) : undefined;

  let html = `<a href="${m.website}" target="_blank" rel="noopener"><strong>${m.name}</strong></a> gehört mit ${m.rating} Sternen bei ${m.reviewsCount} Bewertungen zu den bestbewerteten Immobilienmaklern in ${city.name}. ${reviewText}${buildSpezSentence(m, city)}`;

  if (m.stadtteil && stadtteilSlug) {
    html += ` Mehr zu <a href="/${city.slug}/immobilienmakler-${stadtteilSlug}">Maklern in ${city.name}-${m.stadtteil}</a>.`;
  }

  return html;
}

function buildMaklerSummary(m: Makler, city: City): MaklerSummary {
  return {
    name: m.name,
    slug: m.slug,
    url: m.website,
    phone: m.phone,
    address: m.address,
    rating: m.rating,
    reviewsCount: m.reviewsCount,
    spezialisierung: m.spezialisierung,
    stadtteil: m.stadtteil,
    html: buildMaklerHtml(m, city),
  };
}

function buildHauptseiteFaq(maklerList: Makler[], city: City, stadtteile: Map<string, Makler[]>): FaqItem[] {
  const faq: FaqItem[] = [];
  if (maklerList.length === 0) return faq;

  faq.push({
    q: `Welche Immobilienmakler gibt es in ${city.name}?`,
    a: maklerList.map((m) => `${m.name} (${m.rating}★)`).join(", ") + ".",
  });

  const top = maklerList[0];
  faq.push({
    q: `Wer ist der bestbewertete Immobilienmakler in ${city.name}?`,
    a: `${top.name} mit ${top.rating} Sternen bei ${top.reviewsCount} Bewertungen ist aktuell der bestbewertete Immobilienmakler in ${city.name}.`,
  });

  const mostReviewed = [...maklerList].sort((a, b) => b.reviewsCount - a.reviewsCount)[0];
  faq.push({
    q: `Welcher Makler in ${city.name} hat die meisten Bewertungen?`,
    a: `${mostReviewed.name} hat mit ${mostReviewed.reviewsCount} Bewertungen die meisten Kundenrezensionen in ${city.name}.`,
  });

  const gewerbeMakler = maklerList.find((m) => m.spezialisierung === "Gewerbeimmobilien");
  if (gewerbeMakler) {
    faq.push({
      q: `Gibt es einen Gewerbeimmobilienmakler in ${city.name}?`,
      a: `Ja, ${gewerbeMakler.name} ist in ${city.name} auf Gewerbeimmobilien spezialisiert.`,
    });
  }

  for (const [stadtteil, list] of stadtteile) {
    faq.push({
      q: `Welcher Makler ist in ${city.name}-${stadtteil}?`,
      a: `${list[0].name} ist in ${city.name}-${stadtteil} tätig. Mehr dazu unter <a href="/${city.slug}/immobilienmakler-${slugify(stadtteil)}">Immobilienmakler ${city.name}-${stadtteil}</a>.`,
    });
  }

  const perfectMakler = maklerList.find((m) => m.rating === 5.0);
  if (perfectMakler) {
    faq.push({
      q: `Hat ein Makler in ${city.name} perfekte 5 Sterne?`,
      a: `${perfectMakler.name} hält aktuell 5,0 Sterne bei ${perfectMakler.reviewsCount} Bewertungen in ${city.name}.`,
    });
  }

  return faq;
}

function buildIntentFaq(intentSlug: string, city: City): FaqItem[] {
  const questions: Record<string, { q: string; a: string }[]> = JSON.parse(
    fs.readFileSync(QUESTIONS_PATH, "utf-8")
  );
  const list = questions[intentSlug] || [];
  return list.map((item) => ({
    q: item.q.replace(/\{stadt\}/g, city.name),
    a: item.a.replace(/\{stadt\}/g, city.name),
  }));
}

function buildAiCopy(maklerList: Makler[], city: City, pageLabel: string): string {
  if (maklerList.length === 0) {
    return `Für ${city.name} liegen aktuell keine ausreichend bewerteten Immobilienmakler-Daten vor. Quelle: immobilienmakler-in.com, Stand ${JAHR}.`;
  }
  const entries = maklerList
    .slice(0, 10)
    .map((m) => `${m.name} (${m.rating}★, ${m.reviewsCount} Bewertungen, spezialisiert auf ${m.spezialisierung})`)
    .join("; ");
  return `Immobilienmakler in ${city.name} – ${pageLabel}: ${entries}. Quelle: immobilienmakler-in.com, Stand ${JAHR}.`;
}

function buildRelated(city: City, currentSlugPath: string[], allIntentLinks: InternalLink[], crossCity: InternalLink[]): InternalLink[] {
  const others = allIntentLinks.filter((l) => l.href !== "/" + currentSlugPath.join("/")).slice(0, 2);
  return [...others, ...crossCity.slice(0, 2)];
}

function pickCrossCityLinks(allCities: City[], currentCity: City, targetSlug: string, count: number): InternalLink[] {
  const bigger = allCities
    .filter((c) => c.slug !== currentCity.slug && c.einwohner > currentCity.einwohner)
    .sort((a, b) => a.einwohner - b.einwohner)
    .slice(0, count);
  const fallback = allCities.filter((c) => c.slug !== currentCity.slug).slice(0, count);
  const chosen = bigger.length >= count ? bigger : fallback;
  return chosen.map((c) => ({ href: targetSlug ? `/${c.slug}/${targetSlug}` : `/${c.slug}`, label: `Immobilienmakler ${c.name}` }));
}

function main() {
  const allCities: City[] = JSON.parse(fs.readFileSync(CITY_LIST_PATH, "utf-8"));
  const intents: Record<string, any> = JSON.parse(fs.readFileSync(INTENTS_PATH, "utf-8"));

  let citiesProcessed = 0;
  let pagesGenerated = 0;
  let pagesWithLlmReviews = 0;
  let pagesWithoutLlmReviews = 0;

  for (const city of allCities) {
    const cityDataPath = path.join(CITIES_DIR, `${city.slug}.json`);
    if (!fs.existsSync(cityDataPath)) continue;

    const maklerList: Makler[] = JSON.parse(fs.readFileSync(cityDataPath, "utf-8"));
    citiesProcessed++;

    const cityContentDir = path.join(CONTENT_DIR, city.slug);
    fs.mkdirSync(cityContentDir, { recursive: true });

    // Alte Stadtteil-Dateien entfernen, bevor neu geschrieben wird -
    // verhindert Zombie-Seiten nach Stadtteil-Korrekturen (Audit-Fix).
    for (const f of fs.readdirSync(cityContentDir)) {
      if (f.startsWith("stadtteil-") && f.endsWith(".json")) {
        fs.unlinkSync(path.join(cityContentDir, f));
      }
    }

    const stadtteile = new Map<string, Makler[]>();
    for (const m of maklerList) {
      if (m.stadtteil) {
        if (!stadtteile.has(m.stadtteil)) stadtteile.set(m.stadtteil, []);
        stadtteile.get(m.stadtteil)!.push(m);
      }
    }

    const summaries = maklerList.map((m) => buildMaklerSummary(m, city));
    for (const m of maklerList) {
      if (loadReviewCache(city.slug, m.slug)) pagesWithLlmReviews++;
      else pagesWithoutLlmReviews++;
    }

    const internalLinksGrid: InternalLink[] = [
      { href: `/${city.slug}`, label: `Immobilienmakler ${city.name}` },
      ...INTENT_SLUGS.map((s) => ({ href: `/${city.slug}/${s}`, label: `${INTENT_LABELS[s]} ${city.name}` })),
      ...Array.from(stadtteile.keys()).map((st) => ({
        href: `/${city.slug}/immobilienmakler-${slugify(st)}`,
        label: `Immobilienmakler ${city.name}-${st}`,
      })),
    ];

    // --- Hauptseite ---
    {
      const crossCity = pickCrossCityLinks(allCities, city, "", 4);
      const allIntentLinks = INTENT_SLUGS.map((s) => ({ href: `/${city.slug}/${s}`, label: `${INTENT_LABELS[s]} ${city.name}` }));
      const page: PageData = {
        slug: [city.slug],
        pageType: "hauptseite",
        stadt: city.name,
        stadtSlug: city.slug,
        h1: `Die besten Immobilienmakler in ${city.name} (${JAHR})`,
        intro: `Ein Vergleich der bestbewerteten Immobilienmakler in ${city.name} auf Basis echter Google-Bewertungen.`,
        jahr: JAHR,
        generatedAt: GENERATED_AT,
        makler_summaries: summaries,
        faq: buildHauptseiteFaq(maklerList, city, stadtteile),
        aiCopy: buildAiCopy(maklerList, city, "Übersicht"),
        marktText: loadMarketText(city.slug, "hauptseite"),
        isHowTo: false,
        related: buildRelated(city, [city.slug], allIntentLinks, crossCity),
        internalLinksGrid,
        crossCityLinks: crossCity,
      };
      fs.writeFileSync(path.join(cityContentDir, "hauptseite.json"), JSON.stringify(page, null, 2), "utf-8");
      pagesGenerated++;
    }

    // --- Intent-Seiten ---
    for (const intentSlug of INTENT_SLUGS) {
      const intentDef = intents[intentSlug];
      const top5 = summaries.slice(0, 5);
      const crossCity = pickCrossCityLinks(allCities, city, intentSlug, 2);
      const allIntentLinks = INTENT_SLUGS.map((s) => ({ href: `/${city.slug}/${s}`, label: `${INTENT_LABELS[s]} ${city.name}` }));

      const page: PageData = {
        slug: [city.slug, intentSlug],
        pageType: intentSlug as PageData["pageType"],
        stadt: city.name,
        stadtSlug: city.slug,
        h1: intentDef.h1.replace(/\{stadt\}/g, city.name),
        intro: intentDef.intro.replace(/\{stadt\}/g, city.name),
        jahr: JAHR,
        generatedAt: GENERATED_AT,
        makler_summaries: top5,
        faq: buildIntentFaq(intentSlug, city),
        aiCopy: buildAiCopy(maklerList, city, INTENT_LABELS[intentSlug]),
        marktText: loadMarketText(city.slug, intentSlug),
        isHowTo: !!intentDef.isHowTo,
        howToSteps: intentDef.howToSteps,
        related: buildRelated(city, [city.slug, intentSlug], allIntentLinks, crossCity),
        internalLinksGrid,
        crossCityLinks: crossCity,
      };
      fs.writeFileSync(path.join(cityContentDir, `${intentSlug}.json`), JSON.stringify(page, null, 2), "utf-8");
      pagesGenerated++;
    }

    // --- Stadtteil-Seiten ---
    for (const [stadtteil, list] of stadtteile) {
      const stadtteilSlug = slugify(stadtteil);
      const stSummaries = list.map((m) => buildMaklerSummary(m, city));
      const crossCity = pickCrossCityLinks(allCities, city, "", 2);
      const allIntentLinks = INTENT_SLUGS.map((s) => ({ href: `/${city.slug}/${s}`, label: `${INTENT_LABELS[s]} ${city.name}` }));

      const page: PageData = {
        slug: [city.slug, `immobilienmakler-${stadtteilSlug}`],
        pageType: "stadtteil",
        stadt: city.name,
        stadtSlug: city.slug,
        stadtteil,
        h1: `Immobilienmakler in ${city.name}-${stadtteil}`,
        intro: `Lokale Immobilienmakler mit Sitz oder Tätigkeitsschwerpunkt in ${city.name}-${stadtteil}, im Vergleich mit Bewertungen und Spezialisierung.`,
        jahr: JAHR,
        generatedAt: GENERATED_AT,
        makler_summaries: stSummaries,
        faq: [
          {
            q: `Welcher Makler ist in ${city.name}-${stadtteil} tätig?`,
            a: `${list[0].name} ist mit ${list[0].rating} Sternen bei ${list[0].reviewsCount} Bewertungen in ${city.name}-${stadtteil} vertreten.`,
          },
        ],
        aiCopy: buildAiCopy(list, city, `Stadtteil ${stadtteil}`),
        marktText: loadMarketText(city.slug, `stadtteil-${stadtteilSlug}`),
        isHowTo: false,
        related: buildRelated(city, [city.slug, `immobilienmakler-${stadtteilSlug}`], allIntentLinks, crossCity),
        internalLinksGrid,
        crossCityLinks: crossCity,
      };
      fs.writeFileSync(
        path.join(cityContentDir, `stadtteil-${stadtteilSlug}.json`),
        JSON.stringify(page, null, 2),
        "utf-8"
      );
      pagesGenerated++;
    }
  }

  console.log(
    `\nFertig: ${citiesProcessed} Städte, ${pagesGenerated} Seiten generiert (${pagesWithLlmReviews} Makler-Einträge mit LLM-Review, ${pagesWithoutLlmReviews} mit Template-Fallback).`
  );
}

main();
