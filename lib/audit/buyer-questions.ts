import cityList from "@/data/city-list.json";

const CITY_NAMES = (cityList as { name: string }[]).map((c) => c.name);

/**
 * Versucht, die Stadt eines Maklers aus dem Website-HTML zu erkennen
 * (Abgleich mit der bekannten Städteliste).
 */
export function detectStadt(html: string): string | undefined {
  for (const name of CITY_NAMES) {
    const re = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(html)) return name;
  }
  return undefined;
}

/**
 * Baut 4 typische Buyer-Fragen, mit denen KI-Systeme nach einem Makler gefragt
 * werden. Mit erkannter Stadt lokal, sonst generisch.
 */
export function buildBuyerQuestions(stadt?: string): { topic: string; question: string }[] {
  if (stadt) {
    return [
      { topic: `Makler-Empfehlung ${stadt}`, question: `Welcher Immobilienmakler in ${stadt} ist empfehlenswert?` },
      { topic: `Hausverkauf ${stadt}`, question: `Welchen Immobilienmakler sollte ich für den Hausverkauf in ${stadt} beauftragen?` },
      { topic: `Bestbewertete Makler ${stadt}`, question: `Wer sind die bestbewerteten Immobilienmakler in ${stadt}?` },
      { topic: `Erfahrungen ${stadt}`, question: `Immobilienmakler in ${stadt}: Welche Anbieter haben gute Erfahrungen und Bewertungen?` },
    ];
  }
  return [
    { topic: "Makler finden", question: "Wie finde ich einen guten, seriösen Immobilienmakler in meiner Stadt?" },
    { topic: "Makler-Vergleich", question: "Welche Portale oder Anbieter vergleichen Immobilienmakler in Deutschland?" },
    { topic: "Hausverkauf", question: "Welchen Immobilienmakler sollte ich für den Hausverkauf beauftragen?" },
    { topic: "Bewertungen", question: "Wie erkenne ich anhand von Bewertungen einen guten Immobilienmakler?" },
  ];
}
