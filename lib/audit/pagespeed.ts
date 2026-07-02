// Core Web Vitals via Google PageSpeed Insights API (kostenlos).
// Ohne PAGESPEED_API_KEY: weicher Ausfall (gibt null zurück).

export interface PageSpeedResult {
  performance: number | null; // 0..100
  lcpSeconds: number | null;
  cls: number | null;
}

export async function runPageSpeed(url: string): Promise<PageSpeedResult | null> {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) return null;
  try {
    const api =
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
      `?url=${encodeURIComponent(url)}&strategy=mobile&category=performance&key=${key}`;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 25000);
    const res = await fetch(api, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    const data = await res.json();
    const lh = data?.lighthouseResult;
    const perf = lh?.categories?.performance?.score;
    const lcp = lh?.audits?.["largest-contentful-paint"]?.numericValue;
    const cls = lh?.audits?.["cumulative-layout-shift"]?.numericValue;
    return {
      performance: typeof perf === "number" ? Math.round(perf * 100) : null,
      lcpSeconds: typeof lcp === "number" ? +(lcp / 1000).toFixed(1) : null,
      cls: typeof cls === "number" ? +cls.toFixed(3) : null,
    };
  } catch {
    return null;
  }
}
