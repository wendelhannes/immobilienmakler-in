import Link from "next/link";
import cityList from "@/data/city-list.json";

export default function Footer() {
  const topCities = (cityList as { name: string; slug: string }[]).slice(0, 8);

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
            <Link href="/#staedte">Alle Städte →</Link>
          </div>

          <div className="footer-col">
            <h4>Ratgeber</h4>
            <Link href="/#ratgeber">Haus verkaufen</Link>
            <Link href="/#ratgeber">Immobilienbewertung</Link>
            <Link href="/#ratgeber">Maklerprovision</Link>
            <Link href="/#ratgeber">Guten Makler finden</Link>
          </div>

          <div className="footer-col">
            <h4>Rechtliches</h4>
            <Link href="/sichtbarkeits-check">Sichtbarkeits-Check</Link>
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
