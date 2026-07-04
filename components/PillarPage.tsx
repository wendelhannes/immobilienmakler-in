import Link from "next/link";
import cityList from "@/data/city-list.json";
import Breadcrumb from "@/components/Breadcrumb";
import Byline from "@/components/Byline";
import CtaSection from "@/components/CtaSection";
import { getAvailableCitySlugs } from "@/lib/get-page-data";
import { ORGANIZATION, PERSON, SITE, isoDate } from "@/lib/site";
import type { Pillar } from "@/lib/pillars";

type City = { name: string; slug: string; bundesland: string };

export default function PillarPage({ pillar }: { pillar: Pillar }) {
  const available = getAvailableCitySlugs();
  const cities = (cityList as City[]).filter((c) => available.has(c.slug));
  const url = `${SITE}/${pillar.slug}`;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: pillar.h1,
      description: pillar.description,
      inLanguage: "de-DE",
      image: `${SITE}/opengraph-image`,
      datePublished: "2026-07-02",
      dateModified: isoDate(),
      author: PERSON,
      publisher: ORGANIZATION,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: pillar.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: SITE },
        { "@type": "ListItem", position: 2, name: "Ratgeber", item: `${SITE}/ratgeber` },
        { "@type": "ListItem", position: 3, name: pillar.h1 },
      ],
    },
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      <Breadcrumb items={[{ label: "Ratgeber", href: "/ratgeber" }, { label: pillar.tag }]} />

      <article className="main">
        <header className="entity reveal">
          <div className="tag">Ratgeber · {pillar.tag}</div>
          <h1>{pillar.h1}</h1>
          <p className="desc">{pillar.description}</p>
          <Byline />
        </header>

        <div className="quick-answer reveal">
          <span className="qa-label">Kurz gesagt</span>
          <p>{pillar.quickAnswer}</p>
        </div>

        {pillar.sections.map((sec) => (
          <section className="section reveal" key={sec.h2}>
            <h2>{sec.h2}</h2>
            {sec.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}

        {pillar.steps && (
          <section className="section reveal">
            <h2>Ablauf in {pillar.steps.length} Schritten</h2>
            <ol className="howto-steps">
              {pillar.steps.map((s, i) => (
                <li key={i}>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="faq-section reveal">
          <h2>Häufige Fragen</h2>
          {pillar.faq.map((f, i) => (
            <details key={i} className="faq-item" open={i === 0}>
              <summary className="faq-q">
                <h3>{f.q}</h3>
                <span className="arr">▾</span>
              </summary>
              <div className="faq-a">{f.a}</div>
            </details>
          ))}
        </section>

        <nav className="internal-links reveal" aria-label="Städte-Varianten">
          <h2>{pillar.h1.split("–")[0].trim()} in Ihrer Stadt</h2>
          <p style={{ color: "var(--tx)", fontSize: 15, marginBottom: 18 }}>
            Alle Informationen dieser Seite gibt es mit lokalen Marktdaten und den
            bestbewerteten Maklern für jede Stadt:
          </p>
          <div className="link-grid">
            {cities.map((c) => (
              <Link key={c.slug} href={`/${c.slug}/${pillar.slug}`} className="link-item">
                {pillar.cityLinkLabel.replace("{stadt}", c.name)}
                <span className="li-arrow">→</span>
              </Link>
            ))}
          </div>
        </nav>

        <CtaSection variant="banner" />
      </article>
    </>
  );
}
