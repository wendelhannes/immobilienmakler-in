import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { PILLARS } from "@/lib/pillars";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ratgeber: Hausverkauf, Bewertung & Maklerkosten",
  description:
    "Alle Ratgeber rund um den Immobilienverkauf: Hausverkauf Schritt für Schritt, Immobilienbewertung, Maklerprovision, Maklerwahl und Makler vs. Privatverkauf.",
  alternates: { canonical: "/ratgeber" },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Immobilien-Ratgeber",
  url: `${SITE}/ratgeber`,
  inLanguage: "de-DE",
  isPartOf: { "@id": `${SITE}/#website` },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: PILLARS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.h1,
      url: `${SITE}/${p.slug}`,
    })),
  },
};

export default function RatgeberPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <Breadcrumb items={[{ label: "Ratgeber" }]} />

      <div className="main">
        <header className="entity reveal">
          <div className="tag">Ratgeber</div>
          <h1>Ratgeber rund um den Immobilienverkauf</h1>
          <p className="desc">
            Die wichtigsten Themen vor dem Verkauf, verständlich erklärt – jeweils
            als nationaler Überblick und mit lokalen Varianten für 50 deutsche
            Städte inklusive Maklervergleich.
          </p>
        </header>

        <section className="topics" style={{ margin: "40px 0" }}>
          <div className="topic-grid reveal">
            {PILLARS.map((p) => (
              <Link key={p.slug} href={`/${p.slug}`} className="topic-card">
                <div className="tc-tag">{p.tag}</div>
                <h3>{p.h1}</h3>
                <p>{p.description}</p>
                <span className="arrow">→ Zum Ratgeber</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="internal-links reveal">
          <h2>Lieber direkt zur Stadt?</h2>
          <p style={{ color: "var(--tx)", fontSize: 15, marginBottom: 18 }}>
            Jeder Ratgeber existiert auch mit lokalen Marktdaten und
            Maklervergleich für Ihre Stadt.
          </p>
          <Link href="/staedte" className="btn-primary">
            Alle {""}Städte ansehen →
          </Link>
        </section>
      </div>
    </>
  );
}
