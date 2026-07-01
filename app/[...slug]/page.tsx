import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSlugs, getPageData } from "@/lib/get-page-data";
import type { PageData } from "@/lib/types";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import MaklerTable from "@/components/MaklerTable";
import FaqSection from "@/components/FaqSection";
import CtaSection from "@/components/CtaSection";

const DOMAIN = "https://immobilienmakler-in.com";

const SUBPAGE_LABEL: Record<string, string> = {
  "haus-verkaufen": "Haus verkaufen",
  immobilienbewertung: "Immobilienbewertung",
  "was-kostet-ein-immobilienmakler": "Maklerkosten",
  "wie-finde-ich-einen-guten-immobilienmakler": "Makler finden",
  "immobilienmakler-oder-privat-verkaufen": "Makler oder privat",
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Metadata {
  const page = getPageData(params.slug);
  if (!page) return {};
  const path = `/${page.slug.join("/")}`;
  return {
    title: page.h1,
    description: page.intro,
    alternates: { canonical: path },
    openGraph: {
      title: page.h1,
      description: page.intro,
      url: `${DOMAIN}${path}`,
      type: "article",
    },
  };
}

function buildCrumbs(page: PageData): Crumb[] {
  const crumbs: Crumb[] = [];
  const cityHref = `/${page.stadtSlug}`;
  const isCityHome = page.slug.length === 1;

  crumbs.push({
    label: page.stadt,
    href: isCityHome ? undefined : cityHref,
  });

  if (!isCityHome) {
    const last = page.slug[page.slug.length - 1];
    let label = SUBPAGE_LABEL[last];
    if (!label && page.stadtteil) label = page.stadtteil;
    if (!label) label = last.replace(/-/g, " ");
    crumbs.push({ label });
  }

  return crumbs;
}

export default function Page({ params }: { params: { slug: string[] } }) {
  const page = getPageData(params.slug);
  if (!page) notFound();

  const path = `/${page.slug.join("/")}`;
  const url = `${DOMAIN}${path}`;
  const crumbs = buildCrumbs(page);

  const faqSchema =
    page.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a.replace(/<[^>]+>/g, ""),
            },
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
              areaServed: page.stadt,
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
    description: page.intro,
    url,
    inLanguage: "de-DE",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Start", item: DOMAIN },
      ...crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.label,
        ...(c.href ? { item: `${DOMAIN}${c.href}` } : {}),
      })),
    ],
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

  const schemas = [
    faqSchema,
    itemListSchema,
    webPageSchema,
    breadcrumbSchema,
    howToSchema,
  ].filter(Boolean);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Breadcrumb items={crumbs} />

      <article className="main">
        {/* ── HEADER ── */}
        <header className="entity reveal">
          <div className="tag">Makler-Vergleich {page.jahr}</div>
          <h1>{page.h1}</h1>
          <p className="desc">{page.intro}</p>
        </header>

        {/* ── HOWTO ── */}
        {page.isHowTo && page.howToSteps && (
          <section className="section reveal">
            <h2>Ablauf in {page.howToSteps.length} Schritten</h2>
            <ol className="howto-steps">
              {page.howToSteps.map((step, i) => (
                <li key={i}>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ── MAKLER-TABELLE ── */}
        {page.makler_summaries.length > 0 && (
          <section className="section reveal">
            <h2>Makler-Vergleich in {page.stadt}</h2>
            <p>
              Rangfolge nach durchschnittlicher Google-Bewertung und Anzahl der
              Bewertungen. Ein Klick auf den Namen öffnet die Website des Maklers.
            </p>
            <MaklerTable makler={page.makler_summaries} />
          </section>
        )}

        {/* ── PROFILE ── */}
        {page.makler_summaries.length > 0 && (
          <section className="section reveal">
            <h2>Die Makler im Detail</h2>
            {page.makler_summaries.map((m) => (
              <div
                className="makler-profile"
                key={m.slug}
                dangerouslySetInnerHTML={{ __html: m.html }}
              />
            ))}
          </section>
        )}

        {/* ── FAQ ── */}
        <FaqSection faq={page.faq} />

        {/* ── CTA ── */}
        <CtaSection />

        {/* ── AI COPY (GEO) ── */}
        {page.aiCopy && (
          <section className="ai-copy reveal">
            <div className="label">Zusammenfassung für KI-Systeme</div>
            <div className="ai-block">
              <p>{page.aiCopy}</p>
            </div>
          </section>
        )}

        {/* ── WEITERFÜHRENDE SEITEN ── */}
        {page.related.length > 0 && (
          <section className="internal-links reveal">
            <h2>Weiterführende Seiten</h2>
            <div className="link-grid">
              {page.related.map((link) => (
                <Link key={link.href} href={link.href} className="link-item">
                  {link.label}
                  <span className="li-arrow">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── ALLE SEITEN + STÄDTE ── */}
        <nav className="internal-links reveal" aria-label="Interne Verlinkung">
          <h2>Alle Seiten zu {page.stadt}</h2>
          <div className="link-grid">
            {page.internalLinksGrid.map((link) => (
              <Link key={link.href} href={link.href} className="link-item">
                {link.label}
                <span className="li-arrow">→</span>
              </Link>
            ))}
          </div>

          {page.crossCityLinks.length > 0 && (
            <>
              <h3>Weitere Städte</h3>
              <div className="link-grid">
                {page.crossCityLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="link-item">
                    {link.label}
                    <span className="li-arrow">→</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </nav>
      </article>
    </>
  );
}
