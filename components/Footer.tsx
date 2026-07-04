import Link from "next/link";
import cityList from "@/data/city-list.json";
import { getAvailableCitySlugs } from "@/lib/get-page-data";

export default function Footer() {
  const availableSlugs = getAvailableCitySlugs();
  const topCities = (cityList as { name: string; slug: string }[])
    .filter((c) => availableSlugs.has(c.slug))
    .slice(0, 8);

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-cols">
          <div className="footer-brand">
            <Link href="/" className="logo">
              immobilienmakler<span>-in</span>
            </Link>
            <p>
              Der unabhängige Vergleich der bestbewerteten Immobilienmakler in
              Deutschland – auf Basis echter Google-Bewertungen.
            </p>
          </div>

          <div className="footer-col">
            <h4>Top-Städte</h4>
            {topCities.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`}>
                Immobilienmakler {c.name}
              </Link>
            ))}
            <Link href="/staedte">Alle Städte →</Link>
          </div>

          <div className="footer-col">
            <h4>Ratgeber</h4>
            <Link href="/haus-verkaufen">Haus verkaufen</Link>
            <Link href="/immobilienbewertung">Immobilienbewertung</Link>
            <Link href="/was-kostet-ein-immobilienmakler">Maklerprovision</Link>
            <Link href="/wie-finde-ich-einen-guten-immobilienmakler">Guten Makler finden</Link>
            <Link href="/ratgeber">Alle Ratgeber →</Link>
          </div>

          <div className="footer-col">
            <h4>Unternehmen</h4>
            <Link href="/seo-fuer-immobilienmakler">SEO &amp; GEO für Makler</Link>
            <Link href="/sichtbarkeits-check">Sichtbarkeits-Check</Link>
            <Link href="/ueber-uns">Über uns &amp; Methodik</Link>
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} immobilienmakler-in.com</span>
          <div className="fb-links">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
