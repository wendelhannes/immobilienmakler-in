import Link from "next/link";
import cityList from "@/data/city-list.json";
import CtaSection from "@/components/CtaSection";
import Byline from "@/components/Byline";
import { getAvailableCitySlugs } from "@/lib/get-page-data";

type City = { name: string; slug: string; bundesland: string; einwohner: number };

// Nur Städte mit tatsächlich generiertem Content anzeigen (keine 404-Links).
const availableSlugs = getAvailableCitySlugs();
const cities = (cityList as City[]).filter((c) => availableSlugs.has(c.slug));

/* ── Leistungen: SEO & GEO für Immobilienmakler ── */
const LEISTUNGEN = [
  {
    icon: "🔍",
    title: "Local SEO & Google-Ranking",
    desc: "Wir bringen Ihr Maklerbüro bei Google und im lokalen Map-Pack nach oben – für Suchbegriffe wie „Immobilienmakler + Ihre Stadt“, mit denen Eigentümer aktiv nach einem Makler suchen.",
  },
  {
    icon: "🤖",
    title: "GEO – Sichtbarkeit in KI-Suchen",
    desc: "Immer mehr Verkäufer fragen ChatGPT, Gemini oder Perplexity: „Welcher Makler in meiner Stadt ist gut?“. Wir sorgen dafür, dass Ihr Büro in diesen Antworten genannt und zitiert wird.",
  },
  {
    icon: "⭐",
    title: "Bewertungs- & Reputationsaufbau",
    desc: "Google-Bewertungen sind der stärkste lokale Ranking- und Vertrauensfaktor. Wir bauen ein System auf, das kontinuierlich echte Bewertungen generiert und Ihr Profil stärkt.",
  },
  {
    icon: "⚙️",
    title: "Technische Website-Optimierung",
    desc: "Core Web Vitals, mobile Darstellung, strukturierte Daten (Schema.org) und eine llms.txt – die technische Basis, damit Google und KI-Systeme Ihre Seite korrekt verstehen.",
  },
  {
    icon: "📝",
    title: "Lokale Inhalte & Landingpages",
    desc: "Stadt- und stadtteilbezogene Seiten, die genau die Fragen Ihrer Zielgruppe beantworten – so werden Sie zur relevanten Antwort für Mensch und Maschine.",
  },
  {
    icon: "📊",
    title: "Monitoring & Reporting",
    desc: "Sie sehen schwarz auf weiß, wie sich Ihre Sichtbarkeit bei Google und in KI-Assistenten entwickelt – mit klaren, verständlichen Reportings statt Zahlensalat.",
  },
];

/* ── FAQ für Makler (SEO/GEO) ── */
const MAKLER_FAQ = [
  {
    q: "Was ist der Unterschied zwischen SEO und GEO?",
    a: "SEO (Search Engine Optimization) sorgt dafür, dass Ihre Website bei Google & Co. möglichst weit oben rankt. GEO (Generative Engine Optimization) sorgt dafür, dass generative KI-Systeme wie ChatGPT, Google Gemini oder Perplexity Ihr Maklerbüro in ihren Antworten nennen und als Quelle zitieren. Beides zahlt auf dasselbe Ziel ein: gefunden werden, wenn jemand einen Makler sucht.",
  },
  {
    q: "Warum ist GEO für Immobilienmakler gerade jetzt wichtig?",
    a: "Ein wachsender Teil der Suchanfragen läuft nicht mehr über die klassische Google-Ergebnisliste, sondern über KI-Assistenten, die eine fertige Antwort liefern. Wer dort nicht auftaucht, existiert für diese Nutzer nicht – unabhängig davon, wie gut das klassische Google-Ranking ist. Wer früh optimiert, sichert sich diese Sichtbarkeit, solange die Konkurrenz noch schläft.",
  },
  {
    q: "Wie läuft die Zusammenarbeit ab?",
    a: "Am Anfang steht der kostenlose SEO/GEO-Check: Wir analysieren Ihre aktuelle Sichtbarkeit bei Google und in KI-Suchen und zeigen konkrete Potenziale auf. Auf dieser Basis besprechen wir, welche Hebel für Ihr Büro am meisten bringen – ganz ohne Verpflichtung.",
  },
  {
    q: "Für welche Makler lohnt sich das?",
    a: "Für alle Maklerbüros, die lokal Aufträge gewinnen wollen – vom Einzelmakler bis zum regionalen Büro. Besonders lohnend ist es dort, wo mehrere Makler um dieselben Eigentümer konkurrieren und Sichtbarkeit über den Auftrag entscheidet.",
  },
  {
    q: "Was kostet der Sichtbarkeits-Check?",
    a: "Der erste Sichtbarkeits-Check ist kostenlos und unverbindlich. Sie erhalten eine verständliche Auswertung Ihrer Google- und KI-Sichtbarkeit inklusive konkreter Handlungsempfehlungen per E-Mail.",
  },
];

/* ── Ratgeber (für Eigentümer) ── */
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

/* ── FAQ für Eigentümer (Vergleich) ── */
const NUTZER_FAQ = [
  {
    q: "Wie werden die Immobilienmakler bewertet?",
    a: "Unsere Rangfolge basiert ausschließlich auf öffentlich einsehbaren Google-Bewertungen: der durchschnittlichen Sternebewertung und der Anzahl abgegebener Bewertungen. So entsteht ein transparenter, nachvollziehbarer Vergleich ohne bezahlte Platzierungen.",
  },
  {
    q: "Ist die Nutzung des Maklervergleichs kostenlos?",
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
  title: { absolute: "SEO & GEO für Immobilienmakler | Sichtbarkeits-Check" },
  description:
    "Alle Immobilienmakler in Deutschland im Vergleich nach Städten + Ratgeber. SEO & GEO-Optimierung für Immobilienmakler und kostenloser SEO/GEO-Checker",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const topCity = cities[0];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...MAKLER_FAQ, ...NUTZER_FAQ].map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "immobilienmakler-in.com – SEO & GEO für Immobilienmakler",
    url: "https://immobilienmakler-in.com",
    serviceType: [
      "Suchmaschinenoptimierung (SEO)",
      "Generative Engine Optimization (GEO)",
      "Local SEO für Immobilienmakler",
    ],
    areaServed: "DE",
    description:
      "SEO- und GEO-Optimierung für Immobilienmakler: mehr Sichtbarkeit bei Google und in KI-Suchassistenten wie ChatGPT, Gemini und Perplexity.",
    provider: { "@id": "https://immobilienmakler-in.com/#organization" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* ══════════════════════════════════════════════════
          TEIL 1 — FÜR IMMOBILIENMAKLER (SEO/GEO-Pitch)
          ══════════════════════════════════════════════════ */}

      <div className="main">
        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-inner">
            <div>
              <div className="hero-tag">SEO &amp; GEO für Immobilienmakler</div>
              <h1>
                Werden Sie gefunden – von Eigentümern, Google <em>und KI-Suchen</em>
              </h1>
              <p className="sub">
                Ihre nächsten Verkäufer googeln Sie – oder fragen ChatGPT nach
                einem guten Makler in Ihrer Stadt. Wir machen Ihr Maklerbüro dort
                sichtbar, wo diese Entscheidungen fallen: an der Spitze der lokalen
                Google-Ergebnisse und in den Antworten der KI-Assistenten.
              </p>
              <div className="hero-actions">
                <Link href="/sichtbarkeits-check" className="btn-primary">
                  Kostenlosen SEO/GEO-Check starten
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 10h10m-4-4l4 4-4 4" />
                  </svg>
                </Link>
                <Link href="#leistungen" className="btn-secondary">
                  Was wir tun →
                </Link>
              </div>
              <p className="hero-note">
                Kostenlose Erstanalyse &middot; unverbindlich &middot; Google- &amp;
                KI-Sichtbarkeit in einem Report
              </p>
              <Byline />
            </div>

            {/* KI-Antwort-Visual */}
            <div className="hero-visual">
              <div className="rank-card reveal">
                <div className="rank-badge">Von KI zitiert</div>
                <div className="rc-head">
                  ChatGPT · „Guter Immobilienmakler in {topCity.name}?"
                </div>
                <div className="rank-row top">
                  <div className="rank-pos">1</div>
                  <div className="rank-name">Ihr Maklerbüro</div>
                  <div className="rank-stars">★ 5,0 · 295</div>
                </div>
                <div className="rank-row">
                  <div className="rank-pos">2</div>
                  <div className="rank-name">Wettbewerber A</div>
                  <div className="rank-stars">★ 4,7 · 142</div>
                </div>
                <div className="rank-row">
                  <div className="rank-pos">3</div>
                  <div className="rank-name">Wettbewerber B</div>
                  <div className="rank-stars">★ 4,6 · 98</div>
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
              <div className="t-num">2 Kanäle</div>
              <div className="t-label">Google-Suche &amp; KI-Assistenten</div>
            </div>
            <div className="trust-item">
              <div className="t-num">0 €</div>
              <div className="t-label">für Ihre Erstanalyse</div>
            </div>
            <div className="trust-item">
              <div className="t-num">6 Hebel</div>
              <div className="t-label">von Local SEO bis GEO</div>
            </div>
            <div className="trust-item">
              <div className="t-num">100 % lokal</div>
              <div className="t-label">auf Ihre Stadt ausgerichtet</div>
            </div>
          </div>
        </div>
      </div>

      <div className="main">
        {/* ── PROBLEM (Makler) ── */}
        <section className="problem reveal">
          <div className="tag">Das Sichtbarkeits-Problem</div>
          <h2>Ihre besten Kunden suchen aktiv nach einem Makler – und finden die Konkurrenz</h2>
          <p className="intro">
            Der Immobilienverkauf beginnt heute mit einer Suche. Wer dort nicht
            auftaucht, wird nicht angefragt – ganz gleich, wie gut die Arbeit ist.
          </p>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="num">Map-Pack</div>
              <h3>Nur 3 Plätze bei Google</h3>
              <p>
                Im lokalen Kartenausschnitt zeigt Google nur eine Handvoll Makler.
                Wer nicht darunter ist, bekommt einen Bruchteil der Anfragen.
              </p>
            </div>
            <div className="problem-card">
              <div className="num">KI</div>
              <h3>ChatGPT nennt Sie nicht</h3>
              <p>
                KI-Assistenten geben eine einzige, fertige Empfehlung. Sind Sie
                nicht in den Trainings- und Zitierquellen, existieren Sie für diese
                Nutzer schlicht nicht.
              </p>
            </div>
            <div className="problem-card">
              <div className="num">⚙️</div>
              <h3>Website technisch unsichtbar</h3>
              <p>
                Ohne strukturierte Daten, saubere Technik und lokale Inhalte können
                weder Google noch KI Ihre Seite richtig einordnen – Sie verschenken
                Ranking-Potenzial.
              </p>
            </div>
          </div>
        </section>

        {/* ── LEISTUNGEN ── */}
        <section className="feature-block reveal" id="leistungen">
          <h2>Was wir für Immobilienmakler tun</h2>
          <p className="intro">
            Wir verbinden klassisches Local SEO mit moderner GEO-Optimierung – damit
            Sie an jedem Punkt sichtbar sind, an dem Eigentümer heute nach einem
            Makler suchen. Sechs Hebel, ein Ziel: mehr qualifizierte Anfragen aus
            Ihrer Region.
          </p>
          <div className="feature-grid">
            {LEISTUNGEN.map((l) => (
              <div className="feature-card" key={l.title}>
                <div className="f-icon">{l.icon}</div>
                <h3>{l.title}</h3>
                <p>{l.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── GEO ERKLÄRT ── */}
        <section className="section reveal" style={{ borderTop: "1px solid var(--bd)" }}>
          <h2>SEO bringt Sie nach oben. GEO bringt Sie in die KI-Antwort.</h2>
          <div className="quick-answer">
            <span className="qa-label">Kurz gesagt</span>
            <p>
              GEO (Generative Engine Optimization) ist die Optimierung dafür, von
              KI-Assistenten wie ChatGPT, Gemini und Perplexity als Empfehlung
              genannt und zitiert zu werden – so, wie SEO die Optimierung für die
              klassische Google-Ergebnisliste ist.
            </p>
          </div>
          <p>
            Jahrelang bedeutete „online gefunden werden" vor allem eines: bei Google
            möglichst weit oben stehen. Das gilt weiterhin – die lokale Suche nach
            „Immobilienmakler + Stadt" ist für Makler der wichtigste Anfragen-Kanal.
            Doch das Suchverhalten verschiebt sich. Immer mehr Menschen stellen ihre
            Frage direkt einem KI-Assistenten und bekommen <strong>eine</strong>{" "}
            zusammengefasste Empfehlung, statt zehn blaue Links zu vergleichen.
          </p>
          <p>
            Für Immobilienmakler heißt das: Es reicht nicht mehr, nur bei Google gut
            zu ranken. Sie müssen auch die Quelle sein, aus der die KI ihre Antwort
            zieht. Genau hier setzt GEO an – mit strukturierten Daten, zitierfähigen
            Inhalten, einem starken Bewertungsprofil und einer technischen Basis,
            die Maschinen eindeutig verstehen. Wer beides kombiniert, ist doppelt
            abgesichert: sichtbar in der klassischen Suche <em>und</em> in der
            KI-Suche von morgen.
          </p>
        </section>

        {/* ── SO ARBEITEN WIR ── */}
        <section className="how reveal">
          <h2>So arbeiten wir</h2>
          <p className="sub-center">
            Klarer Ablauf, messbare Sichtbarkeit – der Einstieg ist kostenlos.
          </p>
          <div className="how-grid">
            <div className="how-step">
              <div className="num">1</div>
              <h3>Kostenloser Check</h3>
              <p>Analyse Ihrer Google- und KI-Sichtbarkeit inkl. Empfehlungen.</p>
            </div>
            <div className="how-step">
              <div className="num">2</div>
              <h3>Strategie</h3>
              <p>Wir priorisieren die Hebel mit dem größten Effekt für Ihr Büro.</p>
            </div>
            <div className="how-step">
              <div className="num">3</div>
              <h3>Umsetzung</h3>
              <p>Local SEO, GEO, Technik und Content – Schritt für Schritt.</p>
            </div>
            <div className="how-step">
              <div className="num">4</div>
              <h3>Monitoring</h3>
              <p>Verständliche Reportings zeigen Ihre Sichtbarkeits-Entwicklung.</p>
            </div>
          </div>
        </section>

        {/* ── CTA: SEO/GEO-Checker ── */}
        <CtaSection />

        {/* ── FAQ (Makler) ── */}
        <section className="faq-section reveal">
          <h2>Häufige Fragen zu SEO &amp; GEO für Makler</h2>
          {MAKLER_FAQ.map((f, i) => (
            <details key={i} className="faq-item" open={i === 0}>
              <summary className="faq-q">
                {f.q}
                <span className="arr">▾</span>
              </summary>
              <div className="faq-a">{f.a}</div>
            </details>
          ))}
        </section>
      </div>

      {/* ══════════════════════════════════════════════════
          TEIL 2 — FÜR EIGENTÜMER & VERKÄUFER (Maklervergleich)
          ══════════════════════════════════════════════════ */}

      <div className="main">
        <section className="entity" style={{ borderTop: "1px solid var(--bd)" }}>
          <div className="tag">Für Eigentümer &amp; Verkäufer</div>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 14, maxWidth: 720 }}>
            Sie wollen selbst verkaufen? Vergleichen Sie die besten Makler Ihrer Stadt
          </h2>
          <p className="desc">
            Neben der Optimierung für Makler betreiben wir einen unabhängigen
            Maklervergleich auf Basis echter Google-Bewertungen – kostenlos und
            ohne bezahlte Platzierungen. Ob ein Makler unsere Leistungen nutzt, hat
            keinen Einfluss auf sein Ranking.{" "}
            <Link href="/ueber-uns">So entsteht unser Ranking →</Link>
          </p>
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

        {/* ── FAQ (Eigentümer) ── */}
        <section className="faq-section reveal" style={{ borderBottom: "none" }}>
          <h2>Häufige Fragen zum Maklervergleich</h2>
          {NUTZER_FAQ.map((f, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-q">
                {f.q}
                <span className="arr">▾</span>
              </summary>
              <div className="faq-a">{f.a}</div>
            </details>
          ))}
        </section>
      </div>
    </>
  );
}
