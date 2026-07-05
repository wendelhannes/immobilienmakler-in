// Stadtteil-Erkennung aus deutschen Adressen.

// Wörter, die alleine NIE ein Stadtteil sind (Fragmente -> zweites Wort nötig).
const PREFIX_WORDS = new Set([
  "bad", "st", "st.", "sankt", "alt", "neu", "gross", "groß", "klein",
  "ober", "unter", "nieder", "hohen",
  "nördliche", "noerdliche", "nördlicher", "nördliches",
  "südliche", "suedliche", "südlicher", "südliches",
  "östliche", "oestliche", "östlicher", "östliches", "oestliches",
  "westliche", "westlicher", "westliches",
  // Farb-/Eigenschaftsadjektive als Stadtteil-Präfixe ("Weißer Hirsch", "Roter Berg")
  "weißer", "weisser", "roter", "schwarzer", "grüner", "gruener",
  "langer", "großer", "grosser", "kleiner", "alter", "neuer",
  "oberer", "unterer", "innerer", "äußerer", "aeusserer",
]);

// Generische Begriffe, die nie ein Stadtteilname sind.
const GENERIC_WORDS = new Set([
  "bezirk", "bezirke", "stadtbezirk", "stadtbezirke",
  "stadtteil", "stadtteile", "ortsteil", "ortsteile",
  "kreis", "landkreis", "umgebung", "umland",
  "deutschland", "germany", "innenstadtbereich",
  // Geographische Gattungsbegriffe (folgen oft auf Adjektiv-Demonym: "Handschuhsheimer Flur")
  "flur", "feld", "weg", "straße", "strasse", "gasse", "platz", "allee",
  "heide", "wald", "wiese", "aue", "mark", "berg", "tal",
]);

// Suffixe, die ein Wort als Genitiv-Fragment markieren ("Viewegs" → braucht zweites Wort)
const GENITIVE_SUFFIX = /s$/;

// Allow "St." with dot in address patterns like "Lübeck-St. Lorenz"
const WORD = "[A-ZÄÖÜ][a-zäöüß]+\\.?(?:-[A-ZÄÖÜa-zäöüß]+)*";

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isDemonym(word: string, stadtName: string): boolean {
  const base = stadtName.toLowerCase().replace(/ü/g, "ue").replace(/ö/g, "oe").replace(/ä/g, "ae");
  const w = word.toLowerCase().replace(/ü/g, "ue").replace(/ö/g, "oe").replace(/ä/g, "ae");
  return w.startsWith(base) && /e?r$/.test(w) && w.length <= base.length + 3;
}

// "-er" ending that looks like a German locality adjective (not a real place name)
function isLocalityAdjective(word: string): boolean {
  const w = word.toLowerCase();
  return /[a-zäöüß]er$/.test(w) && w.length >= 5;
}

export function parseStadtteil(
  address: string | undefined,
  stadtName: string
): string | undefined {
  if (!address) return undefined;

  const re = new RegExp(
    `${escapeRe(stadtName)}[-\\s]\\s*(${WORD})(?:[\\s]+(${WORD}))?`,
    "u"
  );
  const m = address.match(re);
  if (!m || !m[1]) return undefined;

  let first = m[1];
  const second = m[2];
  // Strip trailing dot captured by WORD regex (only "St." keeps it via PREFIX_WORDS)
  const firstClean = first.replace(/\.$/, "");
  const firstLc = firstClean.toLowerCase();

  if (firstLc === stadtName.toLowerCase()) return undefined;
  if (GENERIC_WORDS.has(firstLc)) return undefined;

  // Demonyms of the city name: "Lübecker" (from Lübeck)
  if (isDemonym(firstClean, stadtName)) {
    if (!second) return undefined;
    const secondLc = second.toLowerCase();
    if (GENERIC_WORDS.has(secondLc) || isDemonym(second, stadtName)) return undefined;
    return second;
  }

  // Locality adjective + generic geographic term: "Handschuhsheimer Flur" → discard
  if (isLocalityAdjective(firstClean) && second && GENERIC_WORDS.has(second.toLowerCase())) {
    return undefined;
  }

  // Präfix-Wörter brauchen zwingend ein zweites Wort ("Bad Godesberg", "Weißer Hirsch").
  if (PREFIX_WORDS.has(firstLc)) {
    if (!second) return undefined;
    const secondLc = second.toLowerCase();
    if (GENERIC_WORDS.has(secondLc) || secondLc === stadtName.toLowerCase()) {
      return undefined;
    }
    const prefix = firstLc === "st" ? "St." : firstClean;
    return `${prefix} ${second}`;
  }

  // Genitive fragments ("Viewegs") need a second word ("Viewegs Garten")
  if (GENITIVE_SUFFIX.test(firstLc) && firstClean.length <= 10 && second) {
    const secondLc = second.toLowerCase();
    if (!GENERIC_WORDS.has(secondLc)) {
      return `${firstClean} ${second}`;
    }
  }

  return firstClean;
}
