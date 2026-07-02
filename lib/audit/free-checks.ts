// Kostenlose, deterministische Sichtbarkeits-Checks für eine einzelne Website.
// Reine fetch/parse-Logik – keine kostenpflichtigen APIs. Spiegelt die
// "FREE technical checks" des geo-seo-audit-Skills (robots.txt, llms.txt,
// Schema, Meta, Autorschaft, E-Mail/Telefon).

export type SignalStatus = "pass" | "warn" | "fail";

export interface Signal {
  key: string;
  label: string;
  status: SignalStatus;
  detail: string;
}

export interface FreeCheckResult {
  url: string;
  domain: string;
  score: number; // 0..100
  grade: "gut" | "ausbaufähig" | "kritisch";
  signals: Signal[];
  summary: string;
  fetchedAt: string;
}

const UA =
  "Mozilla/5.0 (compatible; immobilienmakler-in-check/1.0; +https://immobilienmakler-in.com/sichtbarkeits-check)";
const FETCH_TIMEOUT_MS = 10000;

export function normalizeUrl(input: string): { url: string; origin: string; domain: string } | null {
  let raw = input.trim();
  if (!raw) return null;
  if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
  try {
    const u = new URL(raw);
    if (!/^https?:$/.test(u.protocol)) return null;
    return { url: u.toString(), origin: u.origin, domain: u.hostname.replace(/^www\./, "") };
  } catch {
    return null;
  }
}

async function timedFetch(url: string, init?: RequestInit): Promise<Response | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "user-agent": UA, ...(init?.headers || {}) },
    });
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function exists(origin: string, path: string): Promise<{ ok: boolean; body?: string }> {
  const res = await timedFetch(origin + path);
  if (!res || !res.ok) return { ok: false };
  const body = await res.text().catch(() => "");
  // Manche Server liefern die SPA-index.html mit 200 für alles -> grobe Plausibilität
  if (body.trim().length === 0) return { ok: false };
  return { ok: true, body };
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractJsonLdTypes(html: string): string[] {
  const types: string[] = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      const json = JSON.parse(m[1].trim());
      const collect = (node: any) => {
        if (!node) return;
        if (Array.isArray(node)) return node.forEach(collect);
        if (typeof node === "object") {
          if (node["@type"]) {
            const t = node["@type"];
            (Array.isArray(t) ? t : [t]).forEach((x) => types.push(String(x)));
          }
          if (node["@graph"]) collect(node["@graph"]);
        }
      };
      collect(json);
    } catch {
      /* defekte JSON-LD ignorieren */
    }
  }
  return Array.from(new Set(types));
}

function firstMatch(html: string, re: RegExp): string | undefined {
  const m = html.match(re);
  return m ? m[1].trim() : undefined;
}

export async function runFreeChecks(input: string): Promise<FreeCheckResult | { error: string }> {
  const norm = normalizeUrl(input);
  if (!norm) return { error: "Ungültige URL." };
  const { url, origin, domain } = norm;

  const homeRes = await timedFetch(url);
  if (!homeRes) return { error: "Website nicht erreichbar (Timeout oder DNS-Fehler)." };
  const html = (await homeRes.text().catch(() => "")) || "";
  if (!homeRes.ok || html.length === 0) {
    return { error: `Website antwortete mit Status ${homeRes.status}.` };
  }

  const [robots, llms, sitemap, aitxt] = await Promise.all([
    exists(origin, "/robots.txt"),
    exists(origin, "/llms.txt"),
    exists(origin, "/sitemap.xml"),
    exists(origin, "/ai.txt"),
  ]);

  const title = firstMatch(html, /<title[^>]*>([^<]*)<\/title>/i);
  const metaDesc = firstMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const jsonLdTypes = extractJsonLdTypes(html);
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(html);
  const hasOg = /<meta[^>]+property=["']og:/i.test(html);
  const langOk = /<html[^>]+lang=/i.test(html);

  const text = stripTags(html);
  const words = text ? text.split(/\s+/).length : 0;
  const numberTokens = (text.match(/\b\d[\d.,]*\b/g) || []).length;
  const statDensity = words > 0 ? +(numberTokens / (words / 100)).toFixed(1) : 0;

  const hasAuthor =
    /rel=["']author["']/i.test(html) ||
    /itemprop=["']author["']/i.test(html) ||
    jsonLdTypes.some((t) => /Person/i.test(t)) ||
    /\b(Autor|Verfasst von|Redaktion|Über den Autor|Geschäftsführer|Inhaber)\b/i.test(text);

  const emails = Array.from(
    new Set((html.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || []).map((e) => e.toLowerCase()))
  ).filter((e) => !/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(e));
  const phones = Array.from(
    new Set(html.match(/(?:\+49|0)[\s\d/()-]{6,}\d/g) || [])
  ).map((p) => p.trim());

  const signals: Signal[] = [];
  const add = (key: string, label: string, status: SignalStatus, detail: string) =>
    signals.push({ key, label, status, detail });

  add("title", "Title-Tag", title ? (title.length >= 15 && title.length <= 65 ? "pass" : "warn") : "fail",
    title ? `„${title}" (${title.length} Zeichen)` : "Kein Title-Tag gefunden.");
  add("meta", "Meta-Description", metaDesc ? (metaDesc.length >= 70 ? "pass" : "warn") : "fail",
    metaDesc ? `${metaDesc.length} Zeichen` : "Keine Meta-Description gefunden.");
  add("h1", "H1-Überschrift", h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : "warn",
    h1Count === 1 ? "Genau eine H1 vorhanden." : `${h1Count} H1-Überschriften gefunden.`);
  add("schema", "Structured Data (Schema.org)", jsonLdTypes.length > 0 ? "pass" : "fail",
    jsonLdTypes.length > 0 ? `Typen: ${jsonLdTypes.slice(0, 6).join(", ")}` : "Kein JSON-LD gefunden – KI/Google können Inhalte schlechter einordnen.");
  add("realestate-schema", "RealEstateAgent/LocalBusiness-Schema",
    jsonLdTypes.some((t) => /RealEstateAgent|LocalBusiness|Organization/i.test(t)) ? "pass" : "warn",
    jsonLdTypes.some((t) => /RealEstateAgent|LocalBusiness|Organization/i.test(t)) ? "Lokales Business-Schema vorhanden." : "Kein LocalBusiness/RealEstateAgent-Schema – wichtig für lokale KI-Antworten.");
  add("author", "Sichtbare Autorschaft / Attribution", hasAuthor ? "pass" : "fail",
    hasAuthor ? "Autor-/Firmen-Attribution erkennbar." : "Keine sichtbare Autorschaft – KI vertraut Aussagen ohne Urheber weniger.");
  add("stat-density", "Zitierfähige Zahlen/Fakten", statDensity >= 0.8 ? "pass" : statDensity > 0 ? "warn" : "fail",
    `${statDensity} Zahlen pro 100 Wörter (${words} Wörter). Höhere Faktendichte wird häufiger von KI zitiert.`);
  add("llms", "llms.txt", llms.ok ? "pass" : "fail",
    llms.ok ? "llms.txt vorhanden – gute KI-Zugänglichkeit." : "Keine llms.txt – KI-Systemen fehlt ein kompakter Kontext.");
  add("ai", "ai.txt", aitxt.ok ? "pass" : "warn",
    aitxt.ok ? "ai.txt vorhanden." : "Keine ai.txt (optional, aber ein Plus).");
  add("robots", "robots.txt", robots.ok ? "pass" : "warn",
    robots.ok ? "robots.txt vorhanden." : "Keine robots.txt gefunden.");
  add("sitemap", "sitemap.xml", sitemap.ok ? "pass" : "warn",
    sitemap.ok ? "sitemap.xml vorhanden." : "Keine sitemap.xml – erschwert vollständige Indexierung.");
  add("viewport", "Mobile-Optimierung", hasViewport ? "pass" : "fail",
    hasViewport ? "Viewport-Meta vorhanden." : "Kein Viewport-Meta – mobil vermutlich nicht optimiert.");
  add("canonical", "Canonical-Tag", hasCanonical ? "pass" : "warn",
    hasCanonical ? "Canonical vorhanden." : "Kein Canonical – Duplicate-Content-Risiko.");
  add("og", "Open-Graph / Social-Vorschau", hasOg ? "pass" : "warn",
    hasOg ? "Open-Graph-Tags vorhanden." : "Keine Open-Graph-Tags – Vorschau beim Teilen fehlt.");
  add("contact", "Kontakt maschinenlesbar", emails.length > 0 || phones.length > 0 ? "pass" : "warn",
    `${emails.length} E-Mail(s), ${phones.length} Telefonnummer(n) im Quelltext gefunden.`);

  const passCount = signals.filter((s) => s.status === "pass").length;
  const warnCount = signals.filter((s) => s.status === "warn").length;
  const score = Math.round(((passCount + warnCount * 0.5) / signals.length) * 100);
  const grade = score >= 75 ? "gut" : score >= 50 ? "ausbaufähig" : "kritisch";

  const failing = signals.filter((s) => s.status === "fail").length;
  const summary =
    `Technischer Sichtbarkeits-Score: ${score}/100 (${grade}). ` +
    `${passCount} von ${signals.length} Signalen erfüllt, ${failing} kritische Lücken. ` +
    `Der kostenlose Check deckt die technische Basis ab – die eigentliche KI-Zitierbarkeit ` +
    `(ChatGPT, Gemini, Perplexity, Claude) prüft der ausführliche Report.`;

  return {
    url,
    domain,
    score,
    grade,
    signals,
    summary,
    fetchedAt: new Date().toISOString(),
  };
}
