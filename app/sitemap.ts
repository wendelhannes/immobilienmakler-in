import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/get-page-data";

const DOMAIN = "https://immobilienmakler-in.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    url: `${DOMAIN}/${slug.join("/")}`,
    lastModified: new Date(),
  }));
}
