import type { MaklerSummary } from "@/lib/types";

function formatRating(rating: number): string {
  return rating.toFixed(1).replace(".", ",");
}

export default function MaklerTable({ makler }: { makler: MaklerSummary[] }) {
  if (makler.length === 0) return null;

  return (
    <div className="table-wrap">
      <table className="makler-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Immobilienmakler</th>
            <th>Bewertung</th>
            <th>Anzahl</th>
            <th>Stadtteil</th>
          </tr>
        </thead>
        <tbody>
          {makler.map((m, i) => (
            <tr key={m.slug}>
              <td className="mt-rank">{i + 1}</td>
              <td className="mt-name">
                <a href={m.url} target="_blank" rel="noopener nofollow">
                  {m.name}
                </a>
              </td>
              <td className="mt-rating">★ {formatRating(m.rating)}</td>
              <td className="mt-count">{m.reviewsCount}</td>
              <td>{m.stadtteil || "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
