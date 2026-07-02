import type { Metadata } from "next";
import SichtbarkeitsChecker from "@/components/SichtbarkeitsChecker";

export const metadata: Metadata = {
  title: "Kostenloser Sichtbarkeits-Check für Immobilienmakler",
  description:
    "Prüfen Sie kostenlos, wie sichtbar Ihr Maklerbüro bei Google und in KI-Assistenten wie ChatGPT, Gemini und Perplexity ist – Sofort-Check plus ausführlicher Report per E-Mail.",
  alternates: { canonical: "/sichtbarkeits-check" },
};

const CHECKS = [
  {
    icon: "🤖",
    title: "KI-Sichtbarkeit (GEO)",
    desc: "Werden Sie von ChatGPT, Gemini, Perplexity und Claude genannt, wenn jemand nach einem Makler in Ihrer Stadt fragt – oder wird die Konkurrenz zitiert?",
  },
  {
    icon: "🔍",
    title: "Technische SEO-Basis",
    desc: "Structured Data, Title/Meta, llms.txt, Sitemap, Canonical, Mobile – die Signale, die Google und KI-Systeme zum Einordnen brauchen.",
  },
  {
    icon: "✍️",
    title: "Zitierfähigkeit & Autorität",
    desc: "Sichtbare Autorschaft und zitierfähige Fakten entscheiden, ob KI Ihre Aussagen übernimmt. Wir messen beide Signale.",
  },
  {
    icon: "⚙️",
    title: "Technischer Website-Check",
    desc: "Ladezeit (Core Web Vitals), mobile Darstellung und Kontakt-Auffindbarkeit – die Basis für gute Sichtbarkeit.",
  },
];

export default function SichtbarkeitsCheckPage() {
  return (
    <div className="main">
      <section className="hero">
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div className="hero-tag" style={{ justifyContent: "center" }}>
            Kostenlos für Immobilienmakler
          </div>
          <h1 style={{ marginLeft: "auto", marginRight: "auto" }}>
            Wie sichtbar ist Ihr Maklerbüro – <em>bei Google und in KI-Suchen?</em>
          </h1>
          <p className="sub" style={{ marginLeft: "auto", marginRight: "auto" }}>
            Immer mehr Eigentümer suchen ihren Makler über Google und KI-Assistenten
            wie ChatGPT. Prüfen Sie in Sekunden Ihre technische Sichtbarkeit – und
            fordern Sie den ausführlichen KI-Sichtbarkeits-Report kostenlos an.
          </p>
        </div>

        <div style={{ maxWidth: 820, margin: "32px auto 0" }}>
          <SichtbarkeitsChecker />
        </div>
      </section>

      <section className="feature-block">
        <h2 className="reveal">Das prüfen wir für Sie</h2>
        <p className="intro reveal">
          Vier Dimensionen entscheiden darüber, ob Verkäufer Sie finden – der
          kostenlose Sofort-Check deckt die Technik ab, der ausführliche Report die
          echte KI-Zitierbarkeit.
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
        <h2>So läuft es ab</h2>
        <p className="sub-center">
          Kein Verkaufsgespräch, kein Abo – einfach eine klare Analyse.
        </p>
        <div className="how-grid">
          <div className="how-step">
            <div className="num">1</div>
            <h3>URL eingeben</h3>
            <p>Website eintragen und den kostenlosen Sofort-Check starten.</p>
          </div>
          <div className="how-step">
            <div className="num">2</div>
            <h3>Sofort-Ergebnis</h3>
            <p>Technischer Sichtbarkeits-Score mit konkreten Lücken – direkt auf der Seite.</p>
          </div>
          <div className="how-step">
            <div className="num">3</div>
            <h3>Report anfordern</h3>
            <p>Kontaktdaten angeben – wir prüfen Ihre KI-Zitierbarkeit über alle Engines.</p>
          </div>
          <div className="how-step">
            <div className="num">4</div>
            <h3>Report per E-Mail</h3>
            <p>Der ausführliche Report landet automatisch in Ihrem Postfach.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
