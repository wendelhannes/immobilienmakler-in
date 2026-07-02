// Zentrale Site-/Marken-Konstanten für konsistente Attribution & Schema.

export const SITE = "https://immobilienmakler-in.com";
export const HOST = "immobilienmakler-in.com";
export const EDITOR_NAME = "Redaktion immobilienmakler-in.com";
export const RESPONSIBLE_PERSON = "Hannes Wendel";

// Wiederverwendbares Organization-Objekt (Schema.org) mit Autor/Attribution.
export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "immobilienmakler-in.com",
  url: SITE,
  description:
    "Unabhängiger Vergleich der bestbewerteten Immobilienmakler in deutschen Städten auf Basis echter Google-Bewertungen.",
  founder: { "@type": "Person", name: RESPONSIBLE_PERSON },
  knowsAbout: [
    "Immobilienmakler",
    "Immobilienbewertung",
    "Local SEO",
    "Generative Engine Optimization",
    "Immobilienverkauf",
  ],
};

const MONATE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

// "Juli 2026" – sichtbarer Aktualisierungsstempel.
export function formatUpdated(d: Date = new Date()): string {
  return `${MONATE[d.getMonth()]} ${d.getFullYear()}`;
}

// ISO-Datum (YYYY-MM-DD) für dateModified im Schema.
export function isoDate(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}
