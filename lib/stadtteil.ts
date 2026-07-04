// Stadtteil-Erkennung aus deutschen Adressen.
// Fix für den Audit-Befund "fabrizierte/trunkierte Stadtteil-Slugs":
//  - generische Begriffe (Bezirk, Stadtbezirk, ...) werden verworfen
//  - Präfix-Wörter (Bad, St., Nördliche, ...) erzwingen ein zweites Wort
//    ("Bad Godesberg" statt "Bad", "Nördliche Innenstadt" statt "Nördliche")

// Wörter, die alleine NIE ein Stadtteil sind (Fragmente -> zweites Wort nötig).
const PREFIX_WORDS = new Set([
  "bad", "st", "st.", "sankt", "alt", "neu", "gross", "groß", "klein",
  "ober", "unter", "nieder", "hohen",
  "nördliche", "noerdliche", "nördlicher", "nördliches",
  "südliche", "suedliche", "südlicher", "südliches",
  "östliche", "oestliche", "östlicher", "östliches", "oestliches",
  "westliche", "westlicher", "westliches",
]);

// Generische Begriffe, die nie ein Stadtteilname sind.
const GENERIC_WORDS = new Set([
  "bezirk", "bezirke", "stadtbezirk", "stadtbezirke",
  "stadtteil", "stadtteile", "ortsteil", "ortsteile",
  "kreis", "landkreis", "umgebung", "umland",
  "deutschland", "germany", "innenstadtbereich",
]);

const WORD = "[A-ZÄÖÜ][a-zäöüß]+(?:-[A-ZÄÖÜa-zäöüß]+)*";

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extrahiert den Stadtteil aus einer Adresse wie
 * "Musterstraße 12, 76133 Karlsruhe-Innenstadt" -> "Innenstadt"
 * "Godesberger Allee 1, 53175 Bonn-Bad Godesberg" -> "Bad Godesberg"
 * "Hauptstr. 5, 76131 Karlsruhe" -> undefined
 */
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

  const first = m[1];
  const second = m[2];
  const firstLc = first.toLowerCase();

  if (firstLc === stadtName.toLowerCase()) return undefined;
  if (GENERIC_WORDS.has(firstLc)) return undefined;

  // Präfix-Wörter brauchen zwingend ein zweites Wort ("Bad Godesberg").
  if (PREFIX_WORDS.has(firstLc)) {
    if (!second) return undefined;
    const secondLc = second.toLowerCase();
    if (GENERIC_WORDS.has(secondLc) || secondLc === stadtName.toLowerCase()) {
      return undefined;
    }
    // "St" -> "St." normalisieren
    const prefix = firstLc === "st" ? "St." : first;
    return `${prefix} ${second}`;
  }

  return first;
}
