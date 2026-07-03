import type { MetadataRoute } from "next";
import { getAllContentEntries } from "@/lib/get-page-data";

const DOMAIN = "https://immobilienmakler-in.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: DOMAIN, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${DOMAIN}/sichtbarkeits-check`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${DOMAIN}/ueber-uns`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
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
