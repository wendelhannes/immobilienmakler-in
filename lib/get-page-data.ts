import fs from "node:fs";
import path from "node:path";
import type { PageData } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function fileToSlug(citySlug: string, fileName: string): string[] {
  const base = fileName.replace(/\.json$/, "");
  if (base === "hauptseite") return [citySlug];
  if (base.startsWith("stadtteil-")) {
    const stadtteilSlug = base.replace("stadtteil-", "");
    return [citySlug, `immobilienmakler-${stadtteilSlug}`];
  }
  return [citySlug, base];
}

function slugToFile(citySlug: string, rest: string[]): string {
  if (rest.length === 0) return "hauptseite.json";
  const [intentOrStadtteil] = rest;
  if (intentOrStadtteil.startsWith("immobilienmakler-")) {
    const stadtteilSlug = intentOrStadtteil.replace("immobilienmakler-", "");
    return `stadtteil-${stadtteilSlug}.json`;
  }
  return `${intentOrStadtteil}.json`;
}

// Slugs aller Städte, die tatsächlich generierten Content haben.
// Verhindert, dass Startseite/Footer auf noch nicht erzeugte Städte verlinken.
export function getAvailableCitySlugs(): Set<string> {
  if (!fs.existsSync(CONTENT_DIR)) return new Set();
  return new Set(
    fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => fs.statSync(path.join(CONTENT_DIR, f)).isDirectory())
  );
}

export function getAllSlugs(): string[][] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const slugs: string[][] = [];
  for (const citySlug of fs.readdirSync(CONTENT_DIR)) {
    const cityDir = path.join(CONTENT_DIR, citySlug);
    if (!fs.statSync(cityDir).isDirectory()) continue;
    for (const fileName of fs.readdirSync(cityDir)) {
      if (!fileName.endsWith(".json")) continue;
      slugs.push(fileToSlug(citySlug, fileName));
    }
  }
  return slugs;
}

export function getPageData(slug: string[]): PageData | null {
  if (slug.length === 0) return null;
  const [citySlug, ...rest] = slug;
  const fileName = slugToFile(citySlug, rest);
  const filePath = path.join(CONTENT_DIR, citySlug, fileName);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as PageData;
}
