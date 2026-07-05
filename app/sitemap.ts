import type { MetadataRoute } from "next";
import { getAllContentEntries } from "@/lib/get-page-data";

const DOMAIN = "https://immobilienmakler-in.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // Stable lastmod for static pages — only update when content actually changes.
  const staticPages: MetadataRoute.Sitemap = [
    { url: DOMAIN, lastModified: "2025-07-05", changeFrequency: "weekly", priority: 1 },
    { url: `${DOMAIN}/staedte`, lastModified: "2025-07-05", changeFrequency: "weekly", priority: 0.9 },
    { url: `${DOMAIN}/ratgeber`, lastModified: "2025-07-05", changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/haus-verkaufen`, lastModified: "2025-07-05", changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/immobilienbewertung`, lastModified: "2025-07-05", changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/was-kostet-ein-immobilienmakler`, lastModified: "2025-07-05", changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/wie-finde-ich-einen-guten-immobilienmakler`, lastModified: "2025-07-05", changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/immobilienmakler-oder-privat-verkaufen`, lastModified: "2025-07-05", changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/seo-fuer-immobilienmakler`, lastModified: "2025-07-05", changeFrequency: "monthly", priority: 0.8 },
    { url: `${DOMAIN}/sichtbarkeits-check`, lastModified: "2025-07-05", changeFrequency: "monthly", priority: 0.7 },
    { url: `${DOMAIN}/ueber-uns`, lastModified: "2025-07-05", changeFrequency: "monthly", priority: 0.5 },
  ];

  const contentPages: MetadataRoute.Sitemap = getAllContentEntries().map(
    ({ slug, lastModified }) => ({
      url: `${DOMAIN}/${slug.join("/")}`,
      lastModified,
      changeFrequency: "monthly",
      priority: slug.length === 1 ? 0.9 : 0.7,
    })
  );

  return [...staticPages, ...contentPages];
}
