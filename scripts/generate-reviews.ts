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
const CITY_LIST_PATH = path.join(process.cwd(), "data", "city-list.json");
const CITIES_DIR = path.join(process.cwd(), "data", "cities");
const CACHE_DIR = path.join(process.cwd(), "cache");
const RATE_LIMIT_MS = 500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const stadtIdx = args.indexOf("--stadt");
  const limitIdx = args.indexOf("--limit");
  return {
    stadt: stadtIdx !== -1 ? args[stadtIdx + 1] : undefined,
    limit: limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : undefined,
  };
}

function buildPrompt(makler: Makler, stadtName: string): string {
  const reviewLines = makler.reviews.map((r) => `- "${r.text}" (${r.stars}★)`).join("\n");
  return `Du schreibst eine SEO-optimierte Zusammenfassung der Google-Bewertungen für einen Immobilienmakler. Schreibe 2-3 Sätze in der dritten Person.
Makler: ${makler.name}
Stadt: ${stadtName}
Bewertung: ${makler.rating} Sterne bei ${makler.reviewsCount} Bewertungen
Spezialisierung: ${makler.spezialisierung}
Echte Kundenbewertungen:
${reviewLines}

Regeln:
- Fasse die konkreten Stärken zusammen die Kunden nennen (nicht erfinden)
- Erwähne wenn möglich: Beratungsqualität, Geschwindigkeit, Erreichbarkeit, Marktkenntnis
- Verwende natürlich die Begriffe "Immobilienmakler ${stadtName}", "Erfahrungen", "Bewertungen"
- KEIN Marketing-Sprech, nur Fakten aus den Reviews
- Den Makler-Namen NICHT wiederholen (wird vom Template davor gesetzt)
- 2-3 Sätze, maximal 60 Wörter
- Nur Fließtext, keine Aufzählungen`;
}

async function generateSummary(makler: Makler, stadtName: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: buildPrompt(makler, stadtName) }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Claude API failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text) throw new Error("Leere Antwort von Claude API");
  return text;
}

async function main() {
  if (!ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY fehlt. Bitte in .env.local setzen.");
    process.exit(1);
  }

  const { stadt, limit } = parseArgs();
  const allCities: City[] = JSON.parse(fs.readFileSync(CITY_LIST_PATH, "utf-8"));
  const cities = stadt ? allCities.filter((c) => c.slug === slugify(stadt)) : allCities;

  if (cities.length === 0) {
    console.error(`Stadt "${stadt}" nicht in city-list.json gefunden.`);
    process.exit(1);
  }

  let totalGenerated = 0;
  let totalCached = 0;
  let totalSkippedNoReviews = 0;

  for (const city of cities) {
    const cityDataPath = path.join(CITIES_DIR, `${city.slug}.json`);
    if (!fs.existsSync(cityDataPath)) {
      console.log(`[${city.name}] übersprungen: keine data/cities/${city.slug}.json (erst 'npm run fetch' ausführen)`);
      continue;
    }

    const maklerList: Makler[] = JSON.parse(fs.readFileSync(cityDataPath, "utf-8"));
    const withReviews = maklerList.filter((m) => m.reviews.length > 0);
    const toProcess = limit ? withReviews.slice(0, limit) : withReviews;

    const cityCacheDir = path.join(CACHE_DIR, city.slug);
    fs.mkdirSync(cityCacheDir, { recursive: true });

    totalSkippedNoReviews += maklerList.length - withReviews.length;

    let i = 0;
    for (const makler of toProcess) {
      i++;
      const cachePath = path.join(cityCacheDir, `${makler.slug}.json`);

      if (fs.existsSync(cachePath)) {
        totalCached++;
        console.log(`[${city.name}] ${i}/${toProcess.length} Makler... ${makler.name} ✓ (Cache)`);
        continue;
      }

      try {
        const text = await generateSummary(makler, city.name);
        fs.writeFileSync(
          cachePath,
          JSON.stringify({ text, generated_at: new Date().toISOString() }, null, 2),
          "utf-8"
        );
        totalGenerated++;
        console.log(`[${city.name}] ${i}/${toProcess.length} Makler... ${makler.name} ✓`);
      } catch (err) {
        console.error(`[${city.name}] ${i}/${toProcess.length} Makler... ${makler.name} FEHLER: ${(err as Error).message}`);
      }

      await sleep(RATE_LIMIT_MS);
    }
  }

  console.log(`\nFertig: ${totalGenerated} neu generiert, ${totalCached} aus Cache, ${totalSkippedNoReviews} ohne Reviews übersprungen.`);
}

main();
