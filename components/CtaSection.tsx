import Link from "next/link";

/**
 * B2B-CTA in zwei Varianten:
 * - "full":   große CTA-Box (nur auf der B2B-Seite /seo-fuer-immobilienmakler)
 * - "banner": kompakter Einzeiler für Consumer-Seiten (Stadt/Intent/Stadtteil),
 *             damit der B2B-Upsell die Verkäufer-Persona nicht bricht (Audit-SXO).
 */
export default function CtaSection({
  variant = "full",
}: {
  variant?: "full" | "banner";
}) {
  if (variant === "banner") {
    return (
      <aside className="makler-banner reveal">
        <span>
          <strong>Sie sind Immobilienmakler?</strong> Prüfen Sie kostenlos Ihre
          Sichtbarkeit bei Google &amp; KI-Suchen.
        </span>
        <Link href="/sichtbarkeits-check" className="mb-link">
          Sichtbarkeits-Check →
        </Link>
      </aside>
    );
  }

  return (
    <section className="cta-section reveal">
      <div className="cta-box">
        <div className="cta-tag">Kostenlos starten</div>
        <h2>Ist Ihr Maklerbüro sichtbar – bei Google und in KI-Suchen?</h2>
        <p className="cta-sub">
          Immer mehr Eigentümer suchen ihren Makler über Google und
          KI-Assistenten wie ChatGPT. Prüfen Sie kostenlos, wie sichtbar Ihr
          Büro dort aktuell ist – und wo Potenzial liegt.
        </p>
        <div className="cta-includes">
          <div className="cta-inc">
            <span className="chk">✓</span> Google-Bewertungsanalyse
          </div>
          <div className="cta-inc">
            <span className="chk">✓</span> Sichtbarkeit in KI-Assistenten
          </div>
          <div className="cta-inc">
            <span className="chk">✓</span> Technischer Website-Check
          </div>
          <div className="cta-inc">
            <span className="chk">✓</span> Konkrete Handlungsempfehlungen
          </div>
        </div>
        <Link className="cta-btn" href="/sichtbarkeits-check">
          Sichtbarkeits-Check →
        </Link>
        <div className="cta-note">
          Kostenlos &amp; unverbindlich · Ergebnis per E-Mail.
        </div>
      </div>
    </section>
  );
}
