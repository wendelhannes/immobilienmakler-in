// Zentrale Site-/Marken-Konstanten für konsistente Attribution & Schema.

export const SITE = "https://immobilienmakler-in.com";
export const HOST = "immobilienmakler-in.com";
export const BRAND_NAME = "Immobilienmakler-in";
export const AUTHOR_NAME = "Hannes Wendel";
export const CONTACT_EMAIL = "info@immobilienmakler-in.com";

// Person-Entität des Gründers (E-E-A-T / Entity-Aufbau).
// sameAs-Profile (LinkedIn etc.) können hier ergänzt werden.
export const PERSON = {
  "@type": "Person",
  "@id": `${SITE}/#hannes-wendel`,
  name: AUTHOR_NAME,
  jobTitle: "Gründer",
  url: `${SITE}/ueber-uns`,
  worksFor: { "@id": `${SITE}/#organization` },
  knowsAbout: [
    "Local SEO",
    "Generative Engine Optimization (GEO)",
    "Immobilienmarketing",
    "KI-Sichtbarkeit",
  ],
};

// Wiederverwendbares Organization-Objekt (Schema.org) mit Autor/Attribution.
export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: BRAND_NAME,
  alternateName: HOST,
  url: SITE,
  logo: {
    "@type": "ImageObject",
    url: `${SITE}/icon`,
    width: 512,
    height: 512,
  },
  email: CONTACT_EMAIL,
  description:
    "Unabhängiger Vergleich der bestbewerteten Immobilienmakler in deutschen Städten auf Basis echter Google-Bewertungen.",
  founder: { "@id": `${SITE}/#hannes-wendel` },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Uhlandstraße 42",
    postalCode: "76135",
    addressLocality: "Karlsruhe",
    addressCountry: "DE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: CONTACT_EMAIL,
    availableLanguage: "de",
  },
  sameAs: [],
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
