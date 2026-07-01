import { notFound } from "next/navigation";
import { getAllSlugs, getPageData } from "@/lib/get-page-data";
import MaklerTable from "@/components/MaklerTable";
import FaqSection from "@/components/FaqSection";
import CtaSection from "@/components/CtaSection";
import RevealInit from "@/components/RevealInit";

const DOMAIN = "https://immobilienmakler-in.com";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string[] } }) {
  const page = getPageData(params.slug);
  if (!page) return {};
  return {
    title: `${page.h1} | immobilienmakler-in.com`,
    description: page.intro,
  };
}

export default function Page({ params }: { params: { slug: string[] } }) {
  const page = getPageData(params.slug);
  if (!page) notFound();

  const url = `${DOMAIN}/${page.slug.join("/")}`;

  const faqSchema =
    page.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a.replace(/<[^>]+>/g, "") },
          })),
        }
      : null;

  const itemListSchema =
    page.makler_summaries.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: page.makler_summaries.map((m, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "RealEstateAgent",
              name: m.name,
              url: m.url,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: m.rating,
                reviewCount: m.reviewsCount,
              },
            },
          })),
        }
      : null;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.h1,
    url,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: page.slug.map((_, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: `${DOMAIN}/${page.slug.slice(0, i + 1).join("/")}`,
    })),
  };

  const howToSchema =
    page.isHowTo && page.howToSteps
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: page.h1,
          step: page.howToSteps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            text: s,
          })),
        }
      : null;

  return (
    <article className="page">
      {[faqSchema, itemListSchema, webPageSchema, breadcrumbSchema, howToSchema]
        .filter(Boolean)
        .map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

      <RevealInit />

      <section className="hero reveal">
        <h1>{page.h1}</h1>
        <p>{page.intro}</p>
      </section>

      {page.isHowTo && page.howToSteps && (
        <section className="howto reveal">
          <h2>Ablauf</h2>
          <ol>
            {page.howToSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      <section className="makler-table-section reveal">
        <h2>Makler-Vergleich in {page.stadt}</h2>
        <MaklerTable makler={page.makler_summaries} />
      </section>

      {page.makler_summaries.length > 0 && (
        <section className="makler-profiles reveal">
          <h2>Bewertungen im Detail</h2>
          {page.makler_summaries.map((m) => (
            <div className="makler-profile" key={m.slug} dangerouslySetInnerHTML={{ __html: m.html }} />
          ))}
        </section>
      )}

      <FaqSection faq={page.faq} />

      <CtaSection />

      <section className="ai-copy reveal">
        <h2>KI-Zusammenfassung</h2>
        <p>{page.aiCopy}</p>
      </section>

      <section className="related-links reveal">
        <h2>Weiterführende Seiten</h2>
        <ul>
          {page.related.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </section>

      <nav className="internal-links-grid reveal">
        <h2>Alle Seiten zu {page.stadt}</h2>
        <ul>
          {page.internalLinksGrid.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <h3>Weitere Städte</h3>
        <ul>
          {page.crossCityLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
