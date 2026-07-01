import fs from "node:fs";
import path from "node:path";
import { slugify } from "../lib/slug";
import type { City, Makler, Review } from "../lib/types";

const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  for (const line of fs.readFileSync(envLocalPath, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const APIFY_TOKEN = process.env.APIFY_TOKEN;
const CITY_LIST_PATH = path.join(process.cwd(), "data", "city-list.json");
const CITIES_DIR = path.join(process.cwd(), "data", "cities");
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const RATE_LIMIT_MS = 3000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const stadtIdx = args.indexOf("--stadt");
  const stadt = stadtIdx !== -1 ? args[stadtIdx + 1] : undefined;
  return { stadt };
}

// Matches the district segment in a German address, e.g.
// "Musterstraße 12, 76133 Karlsruhe-Innenstadt" -> "Innenstadt"
// "Hauptstr. 5, 76131 Karlsruhe" -> undefined (no district)
function parseStadtteil(address: string | undefined, stadtName: string): string | undefined {
  if (!address) return undefined;
  const cityDashMatch = address.match(new RegExp(`${stadtName}[-\\s]?([A-ZÄÖÜ][a-zäöüß]+)`, "u"));
  if (cityDashMatch && cityDashMatch[1] && cityDashMatch[1].toLowerCase() !== stadtName.toLowerCase()) {
    return cityDashMatch[1];
  }
  return undefined;
}

function isRelevantCategory(categoryName: string | undefined): boolean {
  if (!categoryName) return true;
  const c = categoryName.toLowerCase();
  return c.includes("immobil") || c.includes("real estate") || c.includes("makler");
}

function guessSpezialisierung(categoryName: string | undefined): string {
  if (!categoryName) return "Wohnimmobilien";
  const c = categoryName.toLowerCase();
  if (c.includes("gewerbe") || c.includes("commercial")) return "Gewerbeimmobilien";
  if (c.includes("miet") || c.includes("rental")) return "Vermietung";
  if (c.includes("neubau")) return "Neubau";
  return "Wohnimmobilien";
}

async function fetchCity(city: City): Promise<Makler[]> {
  const query = `Immobilienmakler in ${city.name}`;
  const url = `https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      searchStringsArray: [query],
      maxCrawledPlacesPerSearch: 30,
      language: "de",
      maxReviews: 10,
    }),
  });

  if (!res.ok) {
    throw new Error(`Apify request failed for ${city.name}: ${res.status} ${res.statusText}`);
  }

  const items: any[] = await res.json();

  const makler: Makler[] = items
    .filter((item) => item.website && typeof item.totalScore === "number" && item.totalScore > 0)
    .filter((item) => isRelevantCategory(item.categoryName) || true)
    .map((item) => {
      const reviews: Review[] = (item.reviews || []).slice(0, 10).map((r: any) => ({
        text: r.text || r.textTranslated || "",
        stars: r.stars || 0,
        publishedAtDate: r.publishedAtDate,
      })).filter((r: Review) => r.text.trim().length > 0);

      return {
        name: item.title,
        slug: slugify(item.title),
        website: item.website,
        phone: item.phone,
        address: item.address,
        rating: item.totalScore,
        reviewsCount: item.reviewsCount || 0,
        categoryName: item.categoryName,
        placeId: item.placeId,
        mapsUrl: item.url,
        stadtteil: parseStadtteil(item.address, city.name),
        spezialisierung: guessSpezialisierung(item.categoryName),
        reviews,
      };
    });

  makler.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);

  return makler;
}

async function main() {
  if (!APIFY_TOKEN) {
    console.error("APIFY_TOKEN fehlt. Bitte in .env.local setzen.");
    process.exit(1);
  }

  const { stadt } = parseArgs();
  const allCities: City[] = JSON.parse(fs.readFileSync(CITY_LIST_PATH, "utf-8"));
  const cities = stadt ? allCities.filter((c) => c.slug === slugify(stadt)) : allCities;

  if (cities.length === 0) {
    console.error(`Stadt "${stadt}" nicht in city-list.json gefunden.`);
    process.exit(1);
  }

  fs.mkdirSync(CITIES_DIR, { recursive: true });

  let totalMakler = 0;
  let totalWithReviews = 0;
  let processed = 0;

  for (const city of cities) {
    processed++;
    const outPath = path.join(CITIES_DIR, `${city.slug}.json`);

    if (fs.existsSync(outPath)) {
      const stat = fs.statSync(outPath);
      if (Date.now() - stat.mtimeMs < CACHE_MAX_AGE_MS) {
        console.log(`[${processed}/${cities.length}] ${city.name}... übersprungen (Cache < 7 Tage)`);
        continue;
      }
    }

    try {
      const makler = await fetchCity(city);
      fs.writeFileSync(outPath, JSON.stringify(makler, null, 2), "utf-8");
      totalMakler += makler.length;
      totalWithReviews += makler.filter((m) => m.reviews.length > 0).length;
      console.log(`[${processed}/${cities.length}] ${city.name}... ${makler.length} Makler gefunden`);
    } catch (err) {
      console.error(`[${processed}/${cities.length}] ${city.name}... FEHLER: ${(err as Error).message}`);
    }

    if (processed < cities.length) {
      await sleep(RATE_LIMIT_MS);
    }
  }

  console.log(`\nFertig: ${cities.length} Städte verarbeitet, ${totalMakler} Makler total, ${totalWithReviews} mit Reviews.`);
}

main();
