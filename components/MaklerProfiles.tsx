"use client";

import { useEffect, useState } from "react";
import type { MaklerSummary } from "@/lib/types";

export default function MaklerProfiles({ makler }: { makler: MaklerSummary[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer rendering to after hydration so the main thread isn't blocked
    const id = requestIdleCallback(() => setMounted(true), { timeout: 500 });
    return () => cancelIdleCallback(id);
  }, []);

  if (!mounted) {
    return (
      <section className="section">
        <h2>Die Makler im Detail</h2>
        <p style={{ color: "var(--mu)" }}>Profile werden geladen…</p>
      </section>
    );
  }

  return (
    <section className="section visible">
      <h2>Die Makler im Detail</h2>
      {makler.map((m) => (
        <div
          className="makler-profile"
          key={m.slug}
          dangerouslySetInnerHTML={{ __html: m.html }}
        />
      ))}
    </section>
  );
}
