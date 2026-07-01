import type { MaklerSummary } from "@/lib/types";

export default function MaklerTable({ makler }: { makler: MaklerSummary[] }) {
  if (makler.length === 0) return null;

  return (
    <table className="makler-table">
      <thead>
        <tr>
          <th>Makler</th>
          <th>Bewertung</th>
          <th>Bewertungen</th>
          <th>Spezialisierung</th>
          <th>Stadtteil</th>
        </tr>
      </thead>
      <tbody>
        {makler.map((m) => (
          <tr key={m.slug}>
            <td>
              <a href={m.url} target="_blank" rel="noopener">
                {m.name}
              </a>
            </td>
            <td>{m.rating.toFixed(1)}★</td>
            <td>{m.reviewsCount}</td>
            <td>{m.spezialisierung}</td>
            <td>{m.stadtteil || "–"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
