// E-Mail-Versand via Resend (REST, keine SDK-Dependency).
// Dry-Run (AUDIT_DRY_RUN=1 oder fehlender RESEND_API_KEY): kein Versand, nur Log.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM =
  process.env.RESEND_FROM || "immobilienmakler-in.com <check@immobilienmakler-in.com>";
const OWNER_EMAIL = process.env.REPORT_OWNER_EMAIL;

export const isDryRun = process.env.AUDIT_DRY_RUN === "1" || !RESEND_API_KEY;
export const ownerEmail = OWNER_EMAIL;

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  bcc?: string;
}

/** Generischer, dry-run-fähiger Versand. */
export async function sendMail(args: SendArgs): Promise<{ dryRun: boolean }> {
  if (isDryRun) {
    console.log(`[DRY-RUN] Mail an ${args.to} · Betreff: ${args.subject} · ${args.html.length} Bytes`);
    return { dryRun: true };
  }
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
  return { dryRun: false };
}
