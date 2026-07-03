import type { Metadata } from "next";
import Link from "next/link";
import { ORGANIZATION, PERSON, SITE, AUTHOR_NAME, isoDate } from "@/lib/site";

export const metadata: Metadata = {
  title: "Über uns – Wer hinter dem Maklervergleich steht",
  description:
    "Wer immobilienmakler-in.com betreibt, wie das Makler-Ranking entsteht und warum Platzierungen nicht käuflich sind: Methodik, Datenquellen und der Gründer im Überblick.",
  alternates: { canonical: "/ueber-uns" },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Über immobilienmakler-in.com",
  url: `${SITE}/ueber-uns`,
  inLanguage: "de-DE",
  dateModified: isoDate(),
  mainEntity: ORGANIZATION,
  author: PERSON,
};

export default function UeberUnsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <div className="main">
        <section className="entity">
          <div className="tag">Über uns</div>
          <h1>Wer hinter immobilienmakler-in.com steht</h1>
          <p className="desc">
            Ein unabhängiger Maklervergleich auf Basis echter Google-Bewertungen –
            und eine Spezialisierung auf SEO- &amp; KI-Sichtbarkeit für
            Immobilienmakler. Hier erklären wir transparent, wer die Seite betreibt
            und wie das Ranking entsteht.
          </p>
        </section>

        <section className="section">
          <h2>Der Gründer</h2>
          <p>
            <strong>{AUTHOR_NAME}</strong> ist Gründer von immobilienmakler-in.com
            und spezialisiert auf Local SEO und Generative Engine Optimization
            (GEO) – also die Sichtbarkeit von Unternehmen in klassischen
            Suchmaschinen <em>und</em> in KI-Assistenten wie ChatGPT, Gemini und
            Perplexity. Aus dieser Arbeit ist der Maklervergleich entstanden: eine
            datenbasierte Antwort auf die Frage, die Eigentümer am häufigsten
            stellen – „Welcher Makler in meiner Stadt ist wirklich gut?"
          </p>
          <p>
            Sitz des Angebots ist Karlsruhe. Alle Inhalte werden von {AUTHOR_NAME}{" "}
            verantwortet; Kontakt siehe <Link href="/impressum">Impressum</Link>.
          </p>
        </section>

        <section className="section">
          <h2>So entsteht unser Makler-Ranking (Methodik)</h2>
          <div className="quick-answer">
            <span className="qa-label">Kurz gesagt</span>
            <p>
              Die Rangfolge in unserem Vergleich basiert ausschließlich auf
              öffentlich einsehbaren Google-Bewertungen – sortiert nach
              Sterne-Durchschnitt und Anzahl der Bewertungen. Platzierungen sind
              nicht käuflich.
            </p>
          </div>
          <p>
            Für jede der 50 Städte erheben wir regelmäßig die öffentlich
            einsehbaren Google-Profile der lokalen Maklerbüros. In den Vergleich
            aufgenommen werden Büros mit eigener Website und mindestens einer
            Bewertung. Sortiert wird streng nach zwei Kriterien:{" "}
            <strong>durchschnittliche Sternebewertung</strong> (primär) und{" "}
            <strong>Anzahl der Bewertungen</strong> (sekundär). Die
            Kurzbeschreibungen fassen die Inhalte echter Kundenbewertungen
            zusammen.
          </p>
          <p>
            <strong>Unabhängigkeit:</strong> Wir bieten Immobilienmaklern
            SEO-/GEO-Dienstleistungen an. Diese haben{" "}
            <strong>keinerlei Einfluss</strong> auf das Ranking: Ob ein Makler
            Leistungen von uns bezieht oder nicht, ändert seine Position im
            Vergleich nicht. Es gibt keine bezahlten Platzierungen, keine
            „Premium-Einträge" und keine Möglichkeit, Bewertungen zu überschreiben.
          </p>
        </section>

        <section className="section">
          <h2>Was wir für Immobilienmakler tun</h2>
          <p>
            Neben dem Vergleich unterstützen wir Maklerbüros dabei, bei Google und
            in KI-Suchassistenten gefunden zu werden – von Local SEO über
            strukturierte Daten bis zur GEO-Optimierung. Der Einstieg ist ein
            kostenloser <Link href="/sichtbarkeits-check">Sichtbarkeits-Check</Link>.
          </p>
        </section>

        <section className="final-cta reveal">
          <h2>Fragen zu Methodik oder Zusammenarbeit?</h2>
          <p>Schreiben Sie uns – wir antworten persönlich.</p>
          <div className="btn-row">
            <a href="mailto:info@immobilienmakler-in.com" className="btn-primary">
              E-Mail schreiben
            </a>
            <Link href="/sichtbarkeits-check" className="btn-ghost">
              Zum Sichtbarkeits-Check
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
