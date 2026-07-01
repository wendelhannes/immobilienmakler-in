import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/get-page-data";

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
  ];

  const contentPages: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${DOMAIN}/${slug.join("/")}`,
    lastModified: now,
    changeFrequency: "monthly",
    // Stadt-Hauptseiten (ein Slug-Segment) höher priorisieren
    priority: slug.length === 1 ? 0.9 : 0.7,
  }));

  return [...staticPages, ...contentPages];
}
