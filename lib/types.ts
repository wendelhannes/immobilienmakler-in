export interface City {
  name: string;
  slug: string;
  bundesland: string;
  einwohner: number;
}

export interface Review {
  text: string;
  stars: number;
  publishedAtDate?: string;
}

export interface Makler {
  name: string;
  slug: string;
  website: string;
  phone?: string;
  address?: string;
  rating: number;
  reviewsCount: number;
  categoryName?: string;
  placeId: string;
  mapsUrl?: string;
  stadtteil?: string;
  spezialisierung: string;
  reviews: Review[];
}

export interface MaklerSummary {
  name: string;
  slug: string;
  url: string;
  phone?: string;
  address?: string;
  rating: number;
  reviewsCount: number;
  spezialisierung: string;
  stadtteil?: string;
  html: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface InternalLink {
  href: string;
  label: string;
}

export interface PageData {
  slug: string[];
  pageType:
    | "hauptseite"
    | "haus-verkaufen"
    | "immobilienbewertung"
    | "was-kostet-ein-immobilienmakler"
    | "wie-finde-ich-einen-guten-immobilienmakler"
    | "immobilienmakler-oder-privat-verkaufen"
    | "stadtteil";
  stadt: string;
  stadtSlug: string;
  stadtteil?: string;
  h1: string;
  intro: string;
  jahr: number;
  makler_summaries: MaklerSummary[];
  faq: FaqItem[];
  aiCopy: string;
  marktText?: string;
  generatedAt?: string; // ISO-Datum der Content-Generierung (datePublished)
  isHowTo: boolean;
  howToSteps?: string[];
  related: InternalLink[];
  internalLinksGrid: InternalLink[];
  crossCityLinks: InternalLink[];
}
