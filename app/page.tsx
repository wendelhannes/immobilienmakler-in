import cityList from "@/data/city-list.json";

export default function HomePage() {
  return (
    <article className="page">
      <section className="hero reveal">
        <h1>Immobilienmakler-Vergleich für deutsche Städte</h1>
        <p>Bewertete Immobilienmakler in {cityList.length} Städten im Vergleich.</p>
      </section>
      <nav className="internal-links-grid reveal">
        <ul>
          {cityList.map((c: any) => (
            <li key={c.slug}>
              <a href={`/${c.slug}`}>Immobilienmakler {c.name}</a>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
