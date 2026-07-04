import type { Metadata } from "next";
import { Newsreader, DM_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RevealInit from "@/components/RevealInit";
import { ORGANIZATION, PERSON } from "@/lib/site";
import "./globals.css";

// Font-Payload getrimmt (Audit: Fonts > 50 % des Seitengewichts):
// Serif nur 400+700 (genutzt: 700 Headlines, 400/italic em), Mono nur 400.
const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

const SITE = "https://immobilienmakler-in.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Immobilienmakler-Vergleich: Die besten Makler in 50 Städten",
    template: "%s | immobilienmakler-in.com",
  },
  description:
    "Die bestbewerteten Immobilienmakler in 50 deutschen Städten im Vergleich – auf Basis echter Google-Bewertungen, ohne bezahlte Platzierungen.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "immobilienmakler-in.com",
    url: SITE,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    ORGANIZATION,
    PERSON,
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      name: "immobilienmakler-in.com",
      url: SITE,
      inLanguage: "de-DE",
      publisher: { "@id": `${SITE}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de-DE"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <RevealInit />
        <header>
          <Navbar />
        </header>
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
