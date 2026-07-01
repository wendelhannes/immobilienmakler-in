import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="cta-section reveal">
      <div className="cta-box">
        <div className="cta-tag">Für Immobilienmakler</div>
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
          Sichtbarkeit jetzt prüfen →
        </Link>
        <div className="cta-note">
          Kostenlos &amp; unverbindlich · Ergebnis per E-Mail.
        </div>
      </div>
    </section>
  );
}
