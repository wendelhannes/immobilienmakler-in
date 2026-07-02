/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
    ];
  },
};

module.exports = nextConfig;
