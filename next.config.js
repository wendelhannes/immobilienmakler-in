/** @type {import('next').NextConfig} */

// Bekannte fabrizierte/trunkierte Stadtteil-URLs (Audit-Befund) -> 301 auf
// die jeweilige Stadt-Hauptseite. Die Content-Dateien werden von der
// Pipeline nicht mehr erzeugt; Redirects erhalten evtl. vorhandene Signale.
const JUNK_DISTRICT_REDIRECTS = [
  ["berlin", "immobilienmakler-bezirk"],
  ["duesseldorf", "immobilienmakler-stadtbezirk"],
  ["essen", "immobilienmakler-stadtbezirk"],
  ["essen", "immobilienmakler-stadtbezirke"],
  ["bonn", "immobilienmakler-bad"],
  ["kassel", "immobilienmakler-bad"],
  ["stuttgart", "immobilienmakler-bad"],
  ["luebeck", "immobilienmakler-st"],
  ["potsdam", "immobilienmakler-noerdliche"],
  ["potsdam", "immobilienmakler-westliche"],
  ["braunschweig", "immobilienmakler-oestliches"],
].map(([stadt, teil]) => ({
  source: `/${stadt}/${teil}`,
  destination: `/${stadt}`,
  permanent: true,
}));

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com",
      "font-src 'self'",
      "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.analytics.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },

  // Kanonischer Host: www -> Hauptdomain (301). Behebt Duplicate-Content-
  // Cluster, doppelte Title-Tags und Canonical-Mismatch (AI-Visibility-Audit).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.immobilienmakler-in.com" }],
        destination: "https://immobilienmakler-in.com/:path*",
        permanent: true,
      },
      ...JUNK_DISTRICT_REDIRECTS,
    ];
  },
};

module.exports = nextConfig;
