// E-Mail-Versand via Resend (REST, keine SDK-Dependency).
// Dry-Run (AUDIT_DRY_RUN=1 oder fehlender RESEND_API_KEY): kein Versand,
// nur Log – für Tests ohne Kosten/Zustellung.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || "immobilienmakler-in.com <check@immobilienmakler-in.com>";
const OWNER_EMAIL = process.env.REPORT_OWNER_EMAIL;

export const isDryRun = process.env.AUDIT_DRY_RUN === "1" || !RESEND_API_KEY;

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

async function resendSend(args: SendArgs & { bcc?: string }): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: args.to,
      bcc: args.bcc,
      subject: args.subject,
      html: args.html,
      reply_to: args.replyTo,
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Resend error ${res.status}: ${t}`);
  }
}

/** Generischer, dry-run-fähiger Versand (eine Adresse, optional BCC/Reply-To). */
export async function sendMail(args: SendArgs & { bcc?: string }): Promise<{ dryRun: boolean }> {
  if (isDryRun) {
    console.log(`[DRY-RUN] Mail an ${args.to} · Betreff: ${args.subject} · ${args.html.length} Bytes`);
    return { dryRun: true };
  }
  await resendSend(args);
  return { dryRun: false };
}

export const emailConfigured = !isDryRun;
export const ownerEmail = OWNER_EMAIL;

/** Sendet den Report an den Nutzer (+ optional Lead-BCC an den Betreiber). */
export async function sendReport(args: SendArgs): Promise<{ dryRun: boolean }> {
  if (isDryRun) {
    console.log(`[DRY-RUN] Report an ${args.to} · Betreff: ${args.subject} · ${args.html.length} Bytes HTML`);
    return { dryRun: true };
  }
  await resendSend({ ...args, bcc: OWNER_EMAIL });
  return { dryRun: false };
}

/** Kurze Lead-Benachrichtigung an den Betreiber (falls kein BCC gewünscht). */
export async function notifyLead(lead: {
  vorname: string;
  nachname: string;
  firma: string;
  email: string;
  telefon: string;
  website: string;
}): Promise<void> {
  if (isDryRun || !OWNER_EMAIL) {
    console.log(`[DRY-RUN/Lead] ${lead.vorname} ${lead.nachname} · ${lead.firma} · ${lead.email} · ${lead.telefon}`);
    return;
  }
  const html = `<h2>Neuer Sichtbarkeits-Check-Lead</h2>
    <p><b>Name:</b> ${lead.vorname} ${lead.nachname}<br>
    <b>Firma:</b> ${lead.firma}<br>
    <b>E-Mail:</b> ${lead.email}<br>
    <b>Telefon:</b> ${lead.telefon}<br>
    <b>Website:</b> ${lead.website}</p>`;
  await resendSend({
    to: OWNER_EMAIL,
    subject: `Neuer Lead: ${lead.firma} (${lead.vorname} ${lead.nachname})`,
    html,
    replyTo: lead.email,
  });
}
