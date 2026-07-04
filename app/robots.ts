import type { MetadataRoute } from "next";

// AI-Crawler bewusst und explizit erlaubt (Kern des eigenen GEO-Angebots) -
// nicht nur implizit über den Wildcard.
const AI_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/" })),
    ],
    sitemap: "https://immobilienmakler-in.com/sitemap.xml",
  };
}
