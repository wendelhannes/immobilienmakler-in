import type { Metadata } from "next";
import Link from "next/link";
import cityList from "@/data/city-list.json";
import Breadcrumb from "@/components/Breadcrumb";
import { getAvailableCitySlugs } from "@/lib/get-page-data";
import { SITE } from "@/lib/site";

type City = { name: string; slug: string; bundesland: string; einwohner: number };

const available = getAvailableCitySlugs();
const cities = (cityList as City[]).filter((c) => available.has(c.slug));

export const metadata: Metadata = {
  title: { absolute: `Alle Städte: Immobilienmakler-Vergleich in ${cities.length} Städten` },
  description: `Immobilienmakler-Vergleich für ${cities.length} deutsche Städte – von Berlin bis Darmstadt. Jede Stadt mit Ranking nach echten Google-Bewertungen und lokalen Ratgebern.`,
  alternates: { canonical: "/staedte" },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Immobilienmakler nach Stadt",
  url: `${SITE}/staedte`,
  inLanguage: "de-DE",
  isPartOf: { "@id": `${SITE}/#website` },
  about: "Immobilienmakler-Vergleich in deutschen Städten",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: cities.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Immobilienmakler ${c.name}`,
      url: `${SITE}/${c.slug}`,
    })),
  },
};

// Nach Bundesland gruppieren für scanbare Struktur
function groupByBundesland(list: City[]): Map<string, City[]> {
  const map = new Map<string, City[]>();
  for (const c of list) {
    if (!map.has(c.bundesland)) map.set(c.bundesland, []);
    map.get(c.bundesland)!.push(c);
  }
  return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0], "de")));
}

export default function StaedtePage() {
  const grouped = groupByBundesland(cities);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <Breadcrumb items={[{ label: "Städte" }]} />

      <div className="main">
        <header className="entity reveal">
          <div className="tag">Städte-Übersicht</div>
          <h1>Immobilienmakler-Vergleich in {cities.length} deutschen Städten</h1>
          <p className="desc">
            Wählen Sie Ihre Stadt: Für jede Stadt vergleichen wir die lokalen
            Maklerbüros anhand echter Google-Bewertungen – ergänzt um Ratgeber zu
            Hausverkauf, Bewertung und Maklerkosten.
          </p>
        </header>

        {[...grouped.entries()].map(([bundesland, list]) => (
          <section className="city-block" key={bundesland} style={{ margin: "40px 0" }}>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              {bundesland}
            </h2>
            <div className="city-grid">
              {list.map((c) => (
                <Link key={c.slug} href={`/${c.slug}`} className="city-card">
                  <span>
                    <span className="cc-name">{c.name}</span>
                    <br />
                    <span className="cc-meta">
                      {c.einwohner.toLocaleString("de-DE")} Einwohner
                    </span>
                  </span>
                  <span className="cc-arrow">→</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
