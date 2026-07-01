import type { FaqItem } from "@/lib/types";

export default function FaqSection({ faq }: { faq: FaqItem[] }) {
  if (faq.length === 0) return null;

  return (
    <section className="faq-section reveal">
      <h2>Häufige Fragen</h2>
      {faq.map((item, i) => (
        <details key={i} className="faq-item">
          <summary>{item.q}</summary>
          <div dangerouslySetInnerHTML={{ __html: item.a }} />
        </details>
      ))}
    </section>
  );
}
