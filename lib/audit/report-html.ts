import type { FreeCheckResult } from "./free-checks";
import type { AiVisibilityResult, EngineId } from "./ai-visibility";
import type { PageSpeedResult } from "./pagespeed";

export interface ReportInput {
  lead: { vorname: string; nachname: string; firma: string; website: string };
  stadt?: string;
  free: FreeCheckResult;
  ai: AiVisibilityResult;
  pagespeed: PageSpeedResult | null;
}

const ENGINE_LABEL: Record<EngineId, string> = {
  chatgpt: "ChatGPT",
  gemini: "Gemini",
  perplexity: "Perplexity",
  claude: "Claude",
};

const RED = "#C0562F";
const INK = "#1A1A1A";
const GRN = "#2D7D46";
const MU = "#8A8A8A";
const BD = "#E5E0DB";
const WARM = "#F0EBE3";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function deriveFixes(free: FreeCheckResult, ai: AiVisibilityResult): string[] {
  const fixes: string[] = [];
  if (ai.overallCoveragePct === 0) {
    fixes.push(
      "KI-Zitierbarkeit aufbauen: Ihr Büro wird aktuell in keiner der geprüften KI-Antworten genannt. Erstveröffentlichungen mit eigenen Daten (z. B. lokale Marktzahlen) und Präsenz in zitierten Verzeichnissen sind der schnellste Hebel."
    );
  }
  const failing = free.signals.filter((s) => s.status === "fail");
  for (const s of failing) fixes.push(`${s.label}: ${s.detail}`);
  const warns = free.signals.filter((s) => s.status === "warn");
  for (const s of warns.slice(0, 3)) fixes.push(`${s.label}: ${s.detail}`);
  if (ai.citedInstead.length) {
    fixes.push(
      `In zitierten Quellen platzieren: KI verweist u. a. auf ${ai.citedInstead
        .slice(0, 4)
        .map((c) => c.domain)
        .join(", ")}. Dort gelistet/erwähnt zu werden verschiebt Empfehlungen zu Ihnen.`
    );
  }
  return fixes.slice(0, 8);
}

export function reportSubject(input: ReportInput): string {
  return `Ihr Sichtbarkeits-Report: ${input.free.score}/100 & ${input.ai.overallCoveragePct}% KI-Sichtbarkeit – ${input.lead.firma}`;
}

export function buildReportHtml(input: ReportInput): string {
  const { lead, stadt, free, ai, pagespeed } = input;
  const engines = Object.keys(ai.engineCoverage) as EngineId[];
  const cell = (mentioned: boolean, skipped: boolean) =>
    skipped
      ? `<td style="text-align:center;color:${MU};border-bottom:1px solid ${BD};padding:10px">–</td>`
      : mentioned
        ? `<td style="text-align:center;color:${GRN};font-weight:700;border-bottom:1px solid ${BD};padding:10px">✓</td>`
        : `<td style="text-align:center;color:${RED};font-weight:700;border-bottom:1px solid ${BD};padding:10px">✕</td>`;

  const matrixRows = ai.questions
    .map((q) => {
      const cells = engines
        .map((e) => {
          const r = q.perEngine.find((x) => x.engine === e)!;
          return cell(r.mentioned, r.skipped);
        })
        .join("");
      return `<tr><td style="padding:10px;border-bottom:1px solid ${BD};font-size:13px;color:${INK}">${esc(q.question)}</td>${cells}</tr>`;
    })
    .join("");

  const engineHeader = engines
    .map(
      (e) =>
        `<th style="padding:10px;border-bottom:2px solid ${INK};font-size:12px;color:${MU};text-transform:uppercase;letter-spacing:1px">${ENGINE_LABEL[e]}${ai.engineCoverage[e].skipped ? " *" : ""}</th>`
    )
    .join("");

  const citedInstead = ai.citedInstead.length
    ? ai.citedInstead
        .map(
          (c) =>
            `<span style="display:inline-block;background:${WARM};border:1px solid ${BD};border-radius:6px;padding:5px 10px;margin:0 6px 6px 0;font-size:13px;color:${INK}">${esc(c.domain)} <b style="color:${RED}">×${c.count}</b></span>`
        )
        .join("")
    : `<span style="color:${MU};font-size:14px">Keine Fremdquellen erfasst.</span>`;

  const signalsRows = free.signals
    .map((s) => {
      const color = s.status === "pass" ? GRN : s.status === "warn" ? "#B8893B" : RED;
      const ic = s.status === "pass" ? "✓" : s.status === "warn" ? "!" : "✕";
      return `<tr><td style="padding:8px 10px;border-bottom:1px solid ${BD};color:${color};font-weight:700;width:24px">${ic}</td><td style="padding:8px 10px;border-bottom:1px solid ${BD};font-size:13px"><b>${esc(s.label)}</b><br><span style="color:${MU}">${esc(s.detail)}</span></td></tr>`;
    })
    .join("");

  const fixes = deriveFixes(free, ai)
    .map(
      (f, i) =>
        `<tr><td style="padding:10px;border-bottom:1px solid ${BD};color:${RED};font-family:monospace;font-weight:700;vertical-align:top">${i + 1}</td><td style="padding:10px;border-bottom:1px solid ${BD};font-size:14px;line-height:1.6">${esc(f)}</td></tr>`
    )
    .join("");

  const psBlock = pagespeed
    ? `<p style="font-size:14px;color:${INK};margin:8px 0 0">
        Core Web Vitals (mobil): Performance <b>${pagespeed.performance ?? "–"}/100</b>,
        LCP <b>${pagespeed.lcpSeconds ?? "–"}s</b>, CLS <b>${pagespeed.cls ?? "–"}</b>.
       </p>`
    : "";

  const anyEngineActive = engines.some((e) => !ai.engineCoverage[e].skipped);

  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#F7F3EE;font-family:'DM Sans',Segoe UI,Arial,sans-serif;color:${INK}">
<div style="max-width:640px;margin:0 auto;padding:24px">

  <div style="font-family:Georgia,serif;font-size:20px;font-weight:700;margin-bottom:4px">immobilienmakler<span style="color:${RED}">-in</span></div>
  <div style="font-size:12px;color:${MU};font-family:monospace;text-transform:uppercase;letter-spacing:1px;margin-bottom:20px">Sichtbarkeits-Report</div>

  <h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.25;margin:0 0 8px">Hallo ${esc(lead.vorname)}, hier ist Ihr Report für ${esc(lead.firma)}</h1>
  <p style="font-size:15px;color:#4A4A4A;line-height:1.6;margin:0 0 24px">
    Geprüfte Website: <b>${esc(free.domain)}</b>${stadt ? ` · Region: <b>${esc(stadt)}</b>` : ""}
  </p>

  <!-- Score-Kacheln -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px"><tr>
    <td style="width:50%;padding:18px;background:#fff;border:1px solid ${BD};border-radius:12px" align="center">
      <div style="font-size:12px;color:${MU};text-transform:uppercase;letter-spacing:1px">Technischer Score</div>
      <div style="font-family:Georgia,serif;font-size:40px;font-weight:700;color:${free.score >= 75 ? GRN : free.score >= 50 ? "#B8893B" : RED}">${free.score}<span style="font-size:16px;color:${MU}">/100</span></div>
    </td>
    <td style="width:12px"></td>
    <td style="width:50%;padding:18px;background:#fff;border:1px solid ${BD};border-radius:12px" align="center">
      <div style="font-size:12px;color:${MU};text-transform:uppercase;letter-spacing:1px">KI-Sichtbarkeit</div>
      <div style="font-family:Georgia,serif;font-size:40px;font-weight:700;color:${ai.overallCoveragePct >= 25 ? GRN : RED}">${ai.overallCoveragePct}<span style="font-size:16px;color:${MU}">%</span></div>
    </td>
  </tr></table>

  <!-- Citation-Matrix -->
  <h2 style="font-family:Georgia,serif;font-size:20px;margin:0 0 6px">Wird die KI Sie empfehlen?</h2>
  <p style="font-size:14px;color:#4A4A4A;margin:0 0 12px">Pro typischer Kundenfrage – nennt die jeweilige KI Ihr Büro (✓) oder nicht (✕)?</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BD};border-radius:10px;overflow:hidden;background:#fff;margin-bottom:8px">
    <tr style="background:${WARM}"><th style="padding:10px;text-align:left;border-bottom:2px solid ${INK};font-size:12px;color:${MU};text-transform:uppercase;letter-spacing:1px">Kundenfrage</th>${engineHeader}</tr>
    ${matrixRows}
  </table>
  ${anyEngineActive ? "" : `<p style="font-size:12px;color:${MU}">* Aktuell keine KI-Engine aktiv konfiguriert – bitte API-Keys hinterlegen.</p>`}
  ${engines.some((e) => ai.engineCoverage[e].skipped) && anyEngineActive ? `<p style="font-size:12px;color:${MU}">* Engine nicht geprüft (kein API-Key hinterlegt).</p>` : ""}

  <!-- Wer wird stattdessen zitiert -->
  <h2 style="font-family:Georgia,serif;font-size:20px;margin:28px 0 6px">Wen die KI stattdessen zitiert</h2>
  <p style="font-size:14px;color:#4A4A4A;margin:0 0 12px">Diese Quellen tauchen in den KI-Antworten auf. Dort präsent zu sein, verschiebt Empfehlungen zu Ihnen.</p>
  <div>${citedInstead}</div>

  <!-- Technische Signale -->
  <h2 style="font-family:Georgia,serif;font-size:20px;margin:28px 0 6px">Technische Signale</h2>
  ${psBlock}
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BD};border-radius:10px;overflow:hidden;background:#fff;margin-top:10px">${signalsRows}</table>

  <!-- Maßnahmen -->
  <h2 style="font-family:Georgia,serif;font-size:20px;margin:28px 0 6px">Ihre wichtigsten Maßnahmen</h2>
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BD};border-radius:10px;overflow:hidden;background:#fff">${fixes}</table>

  <!-- CTA -->
  <div style="margin-top:28px;background:${INK};border-radius:12px;padding:28px;color:#FAF8F5">
    <div style="font-family:Georgia,serif;font-size:20px;font-weight:700;margin-bottom:8px">Sollen wir das für Sie umsetzen?</div>
    <p style="font-size:14px;color:rgba(255,255,255,.7);margin:0 0 16px">Wir bringen Immobilienmakler bei Google und in KI-Suchen nach vorne. Antworten Sie einfach auf diese E-Mail.</p>
    <a href="https://immobilienmakler-in.com/sichtbarkeits-check" style="display:inline-block;background:${RED};color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">Mehr erfahren</a>
  </div>

  <p style="font-size:12px;color:${MU};margin-top:24px;line-height:1.6">
    Dieser Report wurde automatisch für ${esc(lead.firma)} erstellt (Stand ${new Date().toLocaleDateString("de-DE")}).
    Datenquellen: Live-Analyse Ihrer Website sowie KI-Abfragen an ChatGPT, Gemini, Perplexity und Claude.
    immobilienmakler-in.com · <a href="https://immobilienmakler-in.com/datenschutz" style="color:${MU}">Datenschutz</a>
  </p>
</div>
</body></html>`;
}
