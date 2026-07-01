import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kostenloser Sichtbarkeits-Check für Immobilienmakler",
  description:
    "Prüfen Sie kostenlos, wie sichtbar Ihr Maklerbüro bei Google und in KI-Assistenten wie ChatGPT ist – inklusive Bewertungsanalyse, technischem Website-Check und konkreten Empfehlungen.",
  alternates: { canonical: "/sichtbarkeits-check" },
};

const MAILTO =
  "mailto:info@immobilienmakler-in.com?subject=Kostenloser%20Sichtbarkeits-Check&body=Hallo%2C%0D%0A%0D%0Aich%20m%C3%B6chte%20einen%20kostenlosen%20Sichtbarkeits-Check%20anfordern.%0D%0A%0D%0AName%3A%0D%0AMaklerb%C3%BCro%3A%0D%0AWebsite%3A%0D%0AStadt%3A%0D%0A%0D%0AVielen%20Dank%21";

const CHECKS = [
  {
    icon: "★",
    title: "Google-Bewertungsprofil",
    desc: "Wie stark ist Ihr Bewertungsprofil im Vergleich zu den Top-Maklern Ihrer Stadt – und was fehlt für Platz 1?",
  },
  {
    icon: "🤖",
    title: "Sichtbarkeit in KI-Assistenten",
    desc: "Werden Sie von ChatGPT, Gemini und Co. genannt, wenn jemand nach einem Makler in Ihrer Stadt fragt?",
  },
  {
    icon: "🔍",
    title: "Google-Auffindbarkeit",
    desc: "Wo steht Ihre Website bei den wichtigsten lokalen Suchbegriffen – und welche verschenken Sie aktuell?",
  },
  {
    icon: "⚙️",
    title: "Technischer Website-Check",
    desc: "Ladezeit, mobile Darstellung, strukturierte Daten und llms.txt – die technische Basis für Sichtbarkeit.",
  },
];

export default function SichtbarkeitsCheckPage() {
  return (
    <div className="main">
      <section className="hero">
        <div style={{ maxWidth: 720 }}>
          <div className="hero-tag">Kostenlos für Immobilienmakler</div>
          <h1>
            Wie sichtbar ist Ihr Maklerbüro – <em>bei Google und in KI-Suchen?</em>
          </h1>
          <p className="sub">
            Immer mehr Eigentümer suchen ihren Makler über Google und
            KI-Assistenten wie ChatGPT. Wer dort nicht auftaucht, verliert
            Aufträge an die Konkurrenz. Wir prüfen Ihre Sichtbarkeit kostenlos und
            zeigen Ihnen genau, wo Potenzial liegt.
          </p>
          <div className="hero-actions">
            <a href={MAILTO} className="btn-primary">
              Kostenlosen Check anfordern →
            </a>
            <Link href="/#staedte" className="btn-secondary">
              zum Maklervergleich →
            </Link>
          </div>
          <p className="hero-note">
            Kostenlos &amp; unverbindlich · Ergebnis innerhalb weniger Werktage per
            E-Mail.
          </p>
        </div>
      </section>

      <section className="feature-block">
        <h2 className="reveal">Das prüfen wir für Sie</h2>
        <p className="intro reveal">
          Vier Dimensionen entscheiden darüber, ob Verkäufer Sie finden – wir
          analysieren jede einzeln und liefern konkrete Empfehlungen.
        </p>
        <div className="feature-grid reveal">
          {CHECKS.map((c) => (
            <div className="feature-card" key={c.title}>
              <div className="f-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how reveal">
        <h2>So läuft der Check ab</h2>
        <p className="sub-center">
          Kein Verkaufsgespräch, kein Abo – einfach eine klare Analyse.
        </p>
        <div className="how-grid">
          <div className="how-step">
            <div className="num">1</div>
            <h3>Anfrage senden</h3>
            <p>Name, Maklerbüro, Website und Stadt per E-Mail an uns.</p>
          </div>
          <div className="how-step">
            <div className="num">2</div>
            <h3>Analyse</h3>
            <p>Wir prüfen Bewertungen, KI-Sichtbarkeit und Technik.</p>
          </div>
          <div className="how-step">
            <div className="num">3</div>
            <h3>Report</h3>
            <p>Sie erhalten eine verständliche Auswertung per E-Mail.</p>
          </div>
          <div className="how-step">
            <div className="num">4</div>
            <h3>Umsetzen</h3>
            <p>Mit konkreten Empfehlungen, die Sie sofort angehen können.</p>
          </div>
        </div>
      </section>

      <section className="final-cta reveal">
        <h2>Fordern Sie Ihren kostenlosen Sichtbarkeits-Check an</h2>
        <p>
          Senden Sie uns Ihre Daten – wir melden uns mit Ihrer persönlichen
          Auswertung.
        </p>
        <div className="btn-row">
          <a href={MAILTO} className="btn-primary">
            Jetzt kostenlos anfordern →
          </a>
        </div>
      </section>
    </div>
  );
}
