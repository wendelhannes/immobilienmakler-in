import { NextRequest, NextResponse } from "next/server";
import { sendMail, ownerEmail } from "@/lib/email";
import { createLead } from "@/lib/notion";
import { normalizeUrl } from "@/lib/audit/free-checks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

interface LeadBody {
  vorname?: string;
  nachname?: string;
  firma?: string;
  email?: string;
  telefon?: string;
  website?: string;
  consent?: boolean;
  company_url?: string; // Honeypot
  freeScore?: number;
  freeGrade?: string;
  freeDomain?: string;
}

function esc(s: string): string {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: NextRequest) {
  let body: LeadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Ungültige Anfrage." }, { status: 400 });
  }

  // Honeypot -> Fake-Erfolg, keine Verarbeitung.
  if (body.company_url && body.company_url.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const lead = {
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

  const freeInfo =
    typeof body.freeScore === "number"
      ? `<p><b>Free-Check:</b> ${body.freeScore}/100 (${esc(body.freeGrade || "")}) für ${esc(body.freeDomain || lead.website)}</p>`
      : "";

  const ownerHtml = `<h2>Neue Report-Anfrage (Sichtbarkeits-Check)</h2>
    <p><b>Name:</b> ${esc(lead.vorname)} ${esc(lead.nachname)}<br>
    <b>Firma:</b> ${esc(lead.firma)}<br>
    <b>E-Mail:</b> ${esc(lead.email)}<br>
    <b>Telefon:</b> ${esc(lead.telefon)}<br>
    <b>Website:</b> ${esc(lead.website)}</p>
    ${freeInfo}`;

  const userHtml = `<div style="font-family:Arial,sans-serif;color:#1A1A1A;line-height:1.6">
    <p>Hallo ${esc(lead.vorname)},</p>
    <p>vielen Dank für Ihre Anfrage zum ausführlichen Sichtbarkeits-Report für
    <b>${esc(lead.firma)}</b>. Wir prüfen Ihre Sichtbarkeit bei Google und in den
    KI-Suchassistenten und melden uns mit Ihrem persönlichen Report.</p>
    <p>Beste Grüße<br>Ihr Team von immobilienmakler-in.com</p>
  </div>`;

  // Lead in Notion + Mails parallel; Notion darf den Versand nicht blockieren.
  const [notionOk] = await Promise.all([
    createLead({ ...lead, score: body.freeScore, grade: body.freeGrade }),
    (async () => {
      if (ownerEmail) {
        await sendMail({
          to: ownerEmail,
          subject: `Report-Anfrage: ${lead.firma} (${lead.vorname} ${lead.nachname})`,
          html: ownerHtml,
          replyTo: lead.email,
        });
      }
    })().catch((e) => console.error("Owner-Mail fehlgeschlagen:", e)),
    sendMail({
      to: lead.email,
      subject: "Ihre Anfrage ist eingegangen – Sichtbarkeits-Report",
      html: userHtml,
    }).catch((e) => console.error("Bestätigungs-Mail fehlgeschlagen:", e)),
  ]);

  return NextResponse.json({ ok: true, notion: notionOk }, { status: 202 });
}
