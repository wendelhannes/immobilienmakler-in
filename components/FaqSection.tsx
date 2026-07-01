import type { FaqItem } from "@/lib/types";

export default function FaqSection({ faq }: { faq: FaqItem[] }) {
  if (faq.length === 0) return null;

  return (
    <section className="faq-section reveal">
      <h2>Häufige Fragen</h2>
      {faq.map((item, i) => (
        <details key={i} className="faq-item" open={i === 0}>
          <summary className="faq-q">
            {item.q}
            <span className="arr">▾</span>
          </summary>
          <div className="faq-a" dangerouslySetInnerHTML={{ __html: item.a }} />
        </details>
      ))}
    </section>
  );
}
