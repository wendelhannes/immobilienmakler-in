import Link from "next/link";

export default function NotFound() {
  return (
    <div className="main">
      <section className="entity" style={{ borderBottom: "none" }}>
        <div className="tag">Fehler 404</div>
        <h1>Diese Seite gibt es nicht</h1>
        <p className="desc">
          Die aufgerufene Seite wurde nicht gefunden. Vielleicht suchen Sie den
          Maklervergleich für Ihre Stadt?
        </p>
        <div className="hero-actions" style={{ marginTop: 28 }}>
          <Link href="/" className="btn-primary">
            Zur Startseite
          </Link>
          <Link href="/#staedte" className="btn-secondary">
            Alle Städte ansehen →
          </Link>
        </div>
      </section>
    </div>
  );
}
