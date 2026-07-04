// Repariert das stadtteil-Feld aller Makler in data/cities/*.json, indem es
// die GESPEICHERTEN Adressen mit dem gefixten Parser (lib/stadtteil.ts) neu
// parst. Kein Apify-Call nötig. Danach: npm run market && npm run generate.

import fs from "node:fs";
import path from "node:path";
import { parseStadtteil } from "../lib/stadtteil";
import type { City, Makler } from "../lib/types";

const CITY_LIST_PATH = path.join(process.cwd(), "data", "city-list.json");
const CITIES_DIR = path.join(process.cwd(), "data", "cities");

function main() {
  const cities: City[] = JSON.parse(fs.readFileSync(CITY_LIST_PATH, "utf-8"));
  let changed = 0;
  let cleared = 0;
  let unchanged = 0;

  for (const city of cities) {
    const p = path.join(CITIES_DIR, `${city.slug}.json`);
    if (!fs.existsSync(p)) continue;
    const makler: Makler[] = JSON.parse(fs.readFileSync(p, "utf-8"));
    let dirty = false;

    for (const m of makler) {
      const neu = parseStadtteil(m.address, city.name);
      const alt = m.stadtteil;
      if (neu === alt) {
        unchanged++;
        continue;
      }
      if (neu) {
        console.log(`[${city.name}] ${m.name}: "${alt ?? "-"}" -> "${neu}"`);
        m.stadtteil = neu;
        changed++;
      } else {
        console.log(`[${city.name}] ${m.name}: "${alt ?? "-"}" -> (entfernt)`);
        delete m.stadtteil;
        cleared++;
      }
      dirty = true;
    }

    if (dirty) fs.writeFileSync(p, JSON.stringify(makler, null, 2), "utf-8");
  }

  console.log(`\nFertig: ${changed} korrigiert, ${cleared} entfernt, ${unchanged} unverändert.`);
}

main();
