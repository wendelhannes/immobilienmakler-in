import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "immobilienmakler-in.com",
  description: "Immobilienmakler-Vergleich für deutsche Städte",
  metadataBase: new URL("https://immobilienmakler-in.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "immobilienmakler-in.com",
    url: "https://immobilienmakler-in.com",
  };

  return (
    <html lang="de">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <header className="site-header">
          <a href="/" className="logo">
            immobilienmakler-in.com
          </a>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>&copy; {new Date().getFullYear()} immobilienmakler-in.com</p>
        </footer>
      </body>
    </html>
  );
}
