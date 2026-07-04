import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllSlugs, getPageData } from "@/lib/get-page-data";
import type { PageData } from "@/lib/types";
import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";
import MaklerTable from "@/components/MaklerTable";
import FaqSection from "@/components/FaqSection";
import CtaSection from "@/components/CtaSection";
import Byline from "@/components/Byline";
import { ORGANIZATION, PERSON, isoDate, formatUpdated } from "@/lib/site";
import {
  getCityFacts,
  buildMarktStats,
  buildMarktlageText,
  buildLocalFaq,
} from "@/lib/local-facts";

const DOMAIN = "https://immobilienmakler-in.com";

// Datengetriebener, pro Stadt einzigartiger Überblick (Stat-Density + Anti-Duplicate).
function buildMarktueberblick(page: PageData): string | null {
  const m = page.makler_summaries;
  if (m.length === 0) return null;
  const totalReviews = m.reduce((sum, x) => sum + (x.reviewsCount || 0), 0);
  const avg = m.reduce((sum, x) => sum + (x.rating || 0), 0) / m.length;
  const avgStr = avg.toFixed(1).replace(".", ",");
  const top = m[0];
  const topRating = top.rating.toFixed(1).replace(".", ",");
  return (
    `Für ${page.stadt} haben wir ${m.length} Immobilienmakler anhand von insgesamt ` +
    `${totalReviews.toLocaleString("de-DE")} Google-Bewertungen ausgewertet. ` +
    `Der Bewertungsschnitt der gelisteten Büros liegt bei ${avgStr} von 5 Sternen. ` +
    `Am besten bewertet ist aktuell ${top.name} mit ${topRating} Sternen aus ` +
    `${top.reviewsCount.toLocaleString("de-DE")} Bewertungen.`
  );
}

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
  const marktueberblick = buildMarktueberblick(page);

  const isHauptseite = page.pageType === "hauptseite";
  const facts = getCityFacts(page.stadtSlug);
  const stats = buildMarktStats(page.makler_summaries);
  const marktlage = isHauptseite && facts && stats ? buildMarktlageText(facts, stats) : null;
  const localFaq = facts ? buildLocalFaq(facts, page.pageType) : [];
  const allFaq = [...page.faq, ...localFaq];

  const faqSchema =
    allFaq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: allFaq.map((item) => ({
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
    dateModified: isoDate(),
    lastReviewed: isoDate(),
    isPartOf: { "@id": `${DOMAIN}/#website` },
    author: PERSON,
    publisher: ORGANIZATION,
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

  // Article statt HowTo: Google hat HowTo-Rich-Results 09/2023 eingestellt.
  // Die sichtbaren Schritte bleiben, das Schema wird als Article ausgezeichnet.
  const articleSchema = !isHauptseite
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: page.h1,
        description: page.intro,
        inLanguage: "de-DE",
        image: `${DOMAIN}/opengraph-image`,
        datePublished: page.generatedAt || isoDate(),
        dateModified: isoDate(),
        author: PERSON,
        publisher: ORGANIZATION,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      }
    : null;

  const schemas = [
    faqSchema,
    itemListSchema,
    webPageSchema,
    breadcrumbSchema,
    articleSchema,
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
          <Byline />
        </header>

        {/* ── MARKTÜBERBLICK (Answer-Capsule, pro Stadt einzigartig) ── */}
        {marktueberblick && (
          <div className="quick-answer reveal">
            <span className="qa-label">Überblick {page.stadt}</span>
            <p>{marktueberblick}</p>
          </div>
        )}

        {/* ── LOKALE FAKTEN (nur Hauptseite: einzigartige Marktdaten) ── */}
        {isHauptseite && facts && stats && (
          <section className="section reveal">
            <h2>Marktlage in {page.stadt}</h2>
            <div className="fact-grid">
              <div className="fact-card">
                <div className="fc-label">Einwohner</div>
                <div className="fc-value">{facts.einwohner.toLocaleString("de-DE")}</div>
                <div className="fc-context">{facts.bundesland}</div>
              </div>
              {facts.taxRate != null && (
                <div className="fact-card">
                  <div className="fc-label">Grunderwerbsteuer</div>
                  <div className="fc-value">
                    {facts.taxRate.toLocaleString("de-DE", { minimumFractionDigits: 1 })} %
                  </div>
                  <div className="fc-context">Satz in {facts.bundesland}</div>
                </div>
              )}
              <div className="fact-card">
                <div className="fc-label">Makler im Vergleich</div>
                <div className="fc-value">{stats.count}</div>
                <div className="fc-context">nach Google-Bewertung gerankt</div>
              </div>
              <div className="fact-card">
                <div className="fc-label">Bewertungen</div>
                <div className="fc-value">{stats.totalReviews.toLocaleString("de-DE")}</div>
                <div className="fc-context">Ø {stats.avgRating} von 5 Sternen</div>
              </div>
            </div>
            {(page.marktText || marktlage) && (
              <div style={{ marginTop: 20 }}>
                {(page.marktText || marktlage)!
                  .split(/\n\n+/)
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </div>
            )}
          </section>
        )}

        {/* ── LOKALER MARKTKONTEXT (Intent- & Stadtteil-Seiten, einzigartig) ── */}
        {!isHauptseite && page.marktText && (
          <section className="section reveal">
            <h2>
              {page.pageType === "stadtteil" && page.stadtteil
                ? `Der Markt in ${page.stadt}-${page.stadtteil}`
                : `Der Immobilienmarkt in ${page.stadt}`}
            </h2>
            {page.marktText.split(/\n\n+/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </section>
        )}

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
            <p style={{ fontSize: 13, color: "var(--mu)", marginTop: 12 }}>
              Bewertungen laut Google, Stand: {formatUpdated()}. Unabhängigkeit:
              Die Rangfolge basiert ausschließlich auf öffentlich einsehbaren
              Google-Bewertungen. Platzierungen sind nicht käuflich und unabhängig
              davon, ob ein Makler Leistungen von uns bezieht.{" "}
              <Link href="/ueber-uns">Mehr zur Methodik →</Link>
            </p>
          </section>
        )}

        {/* ── PROFILE (nur Hauptseite + Stadtteil; Intent-Seiten verlinken
               stattdessen — Guide soll kein verkürzter Directory-Rerun sein) ── */}
        {page.makler_summaries.length > 0 &&
          (isHauptseite || page.pageType === "stadtteil" ? (
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
          ) : (
            <section className="section reveal">
              <p>
                Ausführliche Profile aller bewerteten Maklerbüros mit
                Kunden-Feedback finden Sie im{" "}
                <Link href={`/${page.stadtSlug}`}>
                  vollständigen Makler-Vergleich {page.stadt}
                </Link>
                .
              </p>
            </section>
          ))}

        {/* ── FAQ (Content + lokale Daten-FAQ) ── */}
        <FaqSection faq={allFaq} />

        {/* ── B2B-Touchpoint (kompakt, bricht Consumer-Persona nicht) ── */}
        <CtaSection variant="banner" />

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
