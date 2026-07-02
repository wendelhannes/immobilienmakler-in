import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { reserveEmail, releaseEmail, rateLimit } from "@/lib/kv";
import { runFreeChecks, normalizeUrl } from "@/lib/audit/free-checks";
import { detectStadt, buildBuyerQuestions } from "@/lib/audit/buyer-questions";
import { checkAiVisibility } from "@/lib/audit/ai-visibility";
import { runPageSpeed } from "@/lib/audit/pagespeed";
import { buildReportHtml, reportSubject } from "@/lib/audit/report-html";
import { sendReport } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface Lead {
  vorname: string;
  nachname: string;
  firma: string;
  email: string;
  telefon: string;
  website: string;
}

function clientIp(req: NextRequest): string {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
}

const UA = "Mozilla/5.0 (compatible; immobilienmakler-in-check/1.0)";

async function generateAndSend(lead: Lead) {
  const norm = normalizeUrl(lead.website);
  const url = norm?.url || lead.website;

  try {
    const free = await runFreeChecks(url);
    if ("error" in free) {
      // Website nicht analysierbar -> Slot freigeben (Retry möglich) + kurze Notiz.
      await releaseEmail(lead.email);
      await sendReport({
        to: lead.email,
        subject: "Wir konnten Ihre Website nicht analysieren",
        html: `<p>Hallo ${lead.vorname},</p><p>leider konnten wir <b>${lead.website}</b> nicht erreichen (${free.error}). Bitte prüfen Sie die Adresse und fordern Sie den Report erneut an.</p><p>immobilienmakler-in.com</p>`,
      });
      return;
    }

    // Stadt aus dem HTML ableiten (für lokale Buyer-Fragen).
    let stadt: string | undefined;
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      const r = await fetch(url, { headers: { "user-agent": UA }, signal: ctrl.signal });
      clearTimeout(t);
      stadt = detectStadt(await r.text());
    } catch {
      /* Stadt bleibt undefiniert -> generische Fragen */
    }

    const questions = buildBuyerQuestions(stadt);
    const [ai, pagespeed] = await Promise.all([
      checkAiVisibility({ domain: free.domain, firma: lead.firma }, questions),
      runPageSpeed(url),
    ]);

    const reportInput = { lead, stadt, free, ai, pagespeed };
    await sendReport({
      to: lead.email,
      subject: reportSubject(reportInput),
      html: buildReportHtml(reportInput),
    });
  } catch (err) {
    console.error("Report-Generierung fehlgeschlagen:", err);
    await releaseEmail(lead.email); // Slot freigeben, damit Retry möglich ist
  }
}

export async function POST(req: NextRequest) {
  let body: Partial<Lead> & { consent?: boolean; company_url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Honeypot: von Bots ausgefülltes verstecktes Feld -> Fake-Erfolg, keine Verarbeitung.
  if (body.company_url && body.company_url.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const lead: Lead = {
    vorname: (body.vorname || "").trim(),
    nachname: (body.nachname || "").trim(),
    firma: (body.firma || "").trim(),
    email: (body.email || "").trim().toLowerCase(),
    telefon: (body.telefon || "").trim(),
    website: (body.website || "").trim(),
  };

  if (!lead.vorname || !lead.nachname || !lead.firma || !lead.telefon) {
    return NextResponse.json({ message: "Bitte alle Felder ausfüllen." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) {
    return NextResponse.json({ message: "Bitte eine gültige E-Mail-Adresse angeben." }, { status: 400 });
  }
  if (!normalizeUrl(lead.website)) {
    return NextResponse.json({ message: "Bitte eine gültige Website angeben." }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json({ message: "Bitte der Datenverarbeitung zustimmen." }, { status: 400 });
  }

  // IP-Rate-Limit: max. 5 In-depth-Anfragen pro IP und Tag.
  const ipOk = await rateLimit("indepth", clientIp(req), 5, 60 * 60 * 24);
  if (!ipOk) {
    return NextResponse.json(
      { message: "Zu viele Anfragen von dieser Verbindung. Bitte versuchen Sie es morgen erneut." },
      { status: 429 }
    );
  }

  // Dedup: 1 Report pro E-Mail (atomar reserviert VOR der teuren KI-Prüfung).
  const reserved = await reserveEmail(lead.email);
  if (!reserved) {
    return NextResponse.json(
      { message: "Für diese E-Mail-Adresse wurde bereits ein Report erstellt. Pro Adresse ist ein kostenloser Report möglich." },
      { status: 409 }
    );
  }

  // Sofort antworten, Report im Hintergrund erzeugen + versenden.
  waitUntil(generateAndSend(lead));

  return NextResponse.json({ ok: true, message: "Report wird erstellt und per E-Mail zugestellt." }, { status: 202 });
}
