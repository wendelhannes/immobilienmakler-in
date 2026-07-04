import type { MetadataRoute } from "next";
import { getAllContentEntries } from "@/lib/get-page-data";

const DOMAIN = "https://immobilienmakler-in.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: DOMAIN, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${DOMAIN}/staedte`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${DOMAIN}/ratgeber`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Nationale Pillar-Seiten
    { url: `${DOMAIN}/haus-verkaufen`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/immobilienbewertung`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/was-kostet-ein-immobilienmakler`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/wie-finde-ich-einen-guten-immobilienmakler`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/immobilienmakler-oder-privat-verkaufen`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // B2B & Tools
    { url: `${DOMAIN}/seo-fuer-immobilienmakler`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/sichtbarkeits-check`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${DOMAIN}/ueber-uns`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    // Rechtliches (Trust-Signale, indexierbar)
    { url: `${DOMAIN}/impressum`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${DOMAIN}/datenschutz`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  // lastmod = echtes Änderungsdatum der jeweiligen Content-Datei
  // (nicht der Build-Zeitpunkt – Google ignoriert identische Timestamps).
  const contentPages: MetadataRoute.Sitemap = getAllContentEntries().map(
    ({ slug, lastModified }) => ({
      url: `${DOMAIN}/${slug.join("/")}`,
      lastModified,
      changeFrequency: "monthly",
      // Stadt-Hauptseiten (ein Slug-Segment) höher priorisieren
      priority: slug.length === 1 ? 0.9 : 0.7,
    })
  );

  return [...staticPages, ...contentPages];
}
