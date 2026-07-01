import Link from "next/link";
import cityList from "@/data/city-list.json";

type City = { name: string; slug: string; bundesland: string; einwohner: number };
const cities = cityList as City[];

const RATGEBER = [
  {
    slug: "haus-verkaufen",
    tag: "Verkauf",
    title: "Haus verkaufen – Ablauf & Kosten",
    desc: "Vom Wertgutachten bis zum Notartermin: der komplette Verkaufsprozess Schritt für Schritt.",
  },
  {
    slug: "immobilienbewertung",
    tag: "Bewertung",
    title: "Immobilienbewertung",
    desc: "Kostenlose Maklerbewertung oder gerichtsfestes Gutachten – wann sich was lohnt.",
  },
  {
    slug: "was-kostet-ein-immobilienmakler",
    tag: "Kosten",
    title: "Was kostet ein Makler?",
    desc: "Maklerprovision, gesetzliche Teilung zwischen Käufer und Verkäufer und typische Sätze.",
  },
  {
    slug: "wie-finde-ich-einen-guten-immobilienmakler",
    tag: "Auswahl",
    title: "Guten Makler finden",
    desc: "Woran Sie einen seriösen Makler erkennen und welche Bewertungen wirklich zählen.",
  },
  {
    slug: "immobilienmakler-oder-privat-verkaufen",
    tag: "Entscheidung",
    title: "Makler oder privat verkaufen?",
    desc: "Zeit, Marktkenntnis und Verhandlungssicherheit im ehrlichen Vergleich.",
  },
];

const HOME_FAQ = [
  {
    q: "Wie werden die Immobilienmakler bewertet?",
    a: "Unsere Rangfolge basiert ausschließlich auf öffentlich einsehbaren Google-Bewertungen: der durchschnittlichen Sternebewertung und der Anzahl abgegebener Bewertungen. So entsteht ein transparenter, nachvollziehbarer Vergleich ohne bezahlte Platzierungen.",
  },
  {
    q: "Ist die Nutzung von immobilienmakler-in.com kostenlos?",
    a: "Ja. Der Vergleich und alle Ratgeber sind für Eigentümer und Verkaufsinteressierte vollständig kostenlos und unverbindlich.",
  },
  {
    q: "Für welche Städte gibt es einen Maklervergleich?",
    a: `Aktuell vergleichen wir Immobilienmakler in ${cities.length} deutschen Städten – darunter Berlin, Hamburg, München, Köln und Frankfurt. Weitere Städte kommen laufend hinzu.`,
  },
  {
    q: "Wie aktuell sind die Bewertungen?",
    a: "Die Makler-Daten und Google-Bewertungen werden regelmäßig aktualisiert, damit der Vergleich den aktuellen Stand widerspiegelt.",
  },
];

export const metadata = {
  description:
    "Die bestbewerteten Immobilienmakler in deutschen Städten im Vergleich – auf Basis echter Google-Bewertungen. Plus Ratgeber zu Hausverkauf, Immobilienbewertung und Maklerprovision.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const topCity = cities[0];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="main">
        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-inner">
            <div>
              <div className="hero-tag">Unabhängiger Maklervergleich</div>
              <h1>
                Die besten Immobilienmakler Ihrer Stadt – <em>ehrlich verglichen</em>
              </h1>
              <p className="sub">
                Wer sein Haus oder seine Wohnung verkaufen will, braucht einen
                Makler, dem er vertrauen kann. Wir ranken die bestbewerteten
                Immobilienmakler in {cities.length} deutschen Städten – allein auf
                Basis echter Google-Bewertungen.
              </p>
              <div className="hero-actions">
                <Link href="#staedte" className="btn-primary">
                  Stadt auswählen
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 10h10m-4-4l4 4-4 4" />
                  </svg>
                </Link>
                <Link href="#ratgeber" className="btn-secondary">
                  oder zum Ratgeber →
                </Link>
              </div>
              <p className="hero-note">
                100 % kostenlos &middot; keine bezahlten Platzierungen &middot; echte
                Google-Bewertungen
              </p>
            </div>

            {/* Ranking-Visual */}
            <div className="hero-visual">
              <div className="rank-card reveal">
                <div className="rank-badge">Top bewertet</div>
                <div className="rc-head">Makler-Ranking · {topCity.name}</div>
                <div className="rank-row top">
                  <div className="rank-pos">1</div>
                  <div className="rank-name">Immobilienkontor {topCity.name}</div>
                  <div className="rank-stars">★ 5,0 · 295</div>
                </div>
                <div className="rank-row">
                  <div className="rank-pos">2</div>
                  <div className="rank-name">{topCity.name} First Immobilien</div>
                  <div className="rank-stars">★ 5,0 · 232</div>
                </div>
                <div className="rank-row">
                  <div className="rank-pos">3</div>
                  <div className="rank-name">Wohnwert Makler</div>
                  <div className="rank-stars">★ 4,9 · 188</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── TRUST BAR ── */}
      <div className="trust-bar">
        <div className="container">
          <div className="trust-inner reveal">
            <div className="trust-item">
              <div className="t-num">{cities.length}</div>
              <div className="t-label">Städte im Vergleich</div>
            </div>
            <div className="trust-item">
              <div className="t-num">100 %</div>
              <div className="t-label">echte Google-Bewertungen</div>
            </div>
            <div className="trust-item">
              <div className="t-num">0 €</div>
              <div className="t-label">für Eigentümer</div>
            </div>
            <div className="trust-item">
              <div className="t-num">5 min</div>
              <div className="t-label">bis zum passenden Makler</div>
            </div>
          </div>
        </div>
      </div>

      <div className="main">
        {/* ── PROBLEM ── */}
        <section className="problem reveal">
          <div className="tag">Warum die Maklerwahl so schwer ist</div>
          <h2>Beim Immobilienverkauf entscheidet der falsche Makler über zehntausende Euro</h2>
          <p className="intro">
            Ein Verkauf ist für die meisten Menschen die größte Transaktion ihres
            Lebens. Trotzdem ist der Markt für Eigentümer kaum zu durchschauen.
          </p>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="num">1.000+</div>
              <h3>Makler pro Großstadt</h3>
              <p>
                Allein in jeder Metropole buhlen hunderte Anbieter um Ihren Auftrag.
                Wer wirklich gute Arbeit leistet, ist von außen kaum erkennbar.
              </p>
            </div>
            <div className="problem-card">
              <div className="num">7 %</div>
              <h3>Provision stehen im Raum</h3>
              <p>
                Bei der Provision geht es schnell um fünfstellige Beträge. Ein
                schlechter Makler kostet Sie doppelt: bei Provision und Verkaufspreis.
              </p>
            </div>
            <div className="problem-card">
              <div className="num">?</div>
              <h3>Werbung statt Substanz</h3>
              <p>
                Wer bei Google oben steht, hat oft nur das größere Werbebudget – nicht
                die besseren Bewertungen. Anzeigen sagen nichts über Qualität aus.
              </p>
            </div>
          </div>
        </section>

        {/* ── LÖSUNG ── */}
        <section className="feature-block reveal">
          <h2>Ein Vergleich, der auf Fakten beruht</h2>
          <p className="intro">
            Wir werten für jede Stadt die öffentlich einsehbaren Google-Bewertungen
            aller relevanten Maklerbüros aus und stellen sie transparent gegenüber.
          </p>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="f-icon">★</div>
              <h3>Echte Bewertungen statt Werbung</h3>
              <p>
                Die Rangfolge basiert auf Sterne-Durchschnitt und Bewertungsanzahl bei
                Google – nicht auf bezahlten Platzierungen.
              </p>
            </div>
            <div className="feature-card">
              <div className="f-icon">📍</div>
              <h3>Lokal statt allgemein</h3>
              <p>
                Für jede Stadt und ihre Stadtteile finden Sie die Makler, die genau
                dort Immobilien verkaufen und den Markt kennen.
              </p>
            </div>
            <div className="feature-card">
              <div className="f-icon">📖</div>
              <h3>Ratgeber, die weiterhelfen</h3>
              <p>
                Von der Immobilienbewertung bis zur Provision: klare Antworten auf die
                Fragen, die vor jedem Verkauf entstehen.
              </p>
            </div>
          </div>
        </section>

        {/* ── SO FUNKTIONIERT ES ── */}
        <section className="how reveal">
          <h2>In vier Schritten zum passenden Makler</h2>
          <p className="sub-center">
            Kein Anmelden, keine Datenweitergabe – Sie behalten die Kontrolle.
          </p>
          <div className="how-grid">
            <div className="how-step">
              <div className="num">1</div>
              <h3>Stadt wählen</h3>
              <p>Wählen Sie Ihre Stadt aus der Übersicht.</p>
            </div>
            <div className="how-step">
              <div className="num">2</div>
              <h3>Makler vergleichen</h3>
              <p>Sehen Sie das Ranking nach echten Google-Bewertungen.</p>
            </div>
            <div className="how-step">
              <div className="num">3</div>
              <h3>Ratgeber lesen</h3>
              <p>Informieren Sie sich zu Ablauf, Kosten und Bewertung.</p>
            </div>
            <div className="how-step">
              <div className="num">4</div>
              <h3>Kontakt aufnehmen</h3>
              <p>Wenden Sie sich direkt an den Makler Ihrer Wahl.</p>
            </div>
          </div>
        </section>

        {/* ── STÄDTE ── */}
        <section className="city-block" id="staedte">
          <h2 className="reveal">Immobilienmakler nach Stadt</h2>
          <p className="intro reveal">
            Wählen Sie Ihre Stadt und sehen Sie sofort die bestbewerteten Makler vor
            Ort.
          </p>
          <div className="city-grid reveal">
            {cities.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} className="city-card">
                <span>
                  <span className="cc-name">{c.name}</span>
                  <br />
                  <span className="cc-meta">{c.bundesland}</span>
                </span>
                <span className="cc-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── RATGEBER ── */}
        <section className="topics" id="ratgeber">
          <h2 className="reveal">Ratgeber rund um den Immobilienverkauf</h2>
          <p className="intro reveal">
            Die wichtigsten Themen verständlich erklärt – hier am Beispiel{" "}
            {topCity.name}, verfügbar für jede Stadt.
          </p>
          <div className="topic-grid reveal">
            {RATGEBER.map((t) => (
              <Link
                key={t.slug}
                href={`/${topCity.slug}/${t.slug}`}
                className="topic-card"
              >
                <div className="tc-tag">{t.tag}</div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                <span className="arrow">→ Zum Ratgeber</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="faq-section reveal">
          <h2>Häufige Fragen</h2>
          {HOME_FAQ.map((f, i) => (
            <details key={i} className="faq-item" open={i === 0}>
              <summary className="faq-q">
                {f.q}
                <span className="arr">▾</span>
              </summary>
              <div className="faq-a">{f.a}</div>
            </details>
          ))}
        </section>

        {/* ── FINAL CTA (für Makler) ── */}
        <section className="final-cta reveal">
          <h2>Sie sind selbst Immobilienmakler?</h2>
          <p>
            Prüfen Sie kostenlos, wie sichtbar Ihr Maklerbüro bei Google und in
            KI-Suchassistenten wie ChatGPT aktuell ist.
          </p>
          <div className="btn-row">
            <Link href="/sichtbarkeits-check" className="btn-primary">
              Sichtbarkeit jetzt prüfen →
            </Link>
            <Link href="#staedte" className="btn-ghost">
              Zum Maklervergleich
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
