import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "immobilienmakler-in.com – Die bestbewerteten Immobilienmakler in 50 deutschen Städten ehrlich verglichen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#1A1A1A",
          color: "#FAF8F5",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Akzent-Kreis */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: "#C0562F",
            opacity: 0.15,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "36px",
          }}
        >
          <div style={{ width: "36px", height: "4px", background: "#C0562F" }} />
          <div
            style={{
              fontSize: "24px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#C0562F",
              fontFamily: "monospace",
            }}
          >
            Makler-Vergleich &amp; KI-Sichtbarkeit
          </div>
        </div>
        <div
          style={{
            fontSize: "76px",
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: "980px",
            display: "flex",
          }}
        >
          Die besten Immobilienmakler – ehrlich verglichen.
        </div>
        <div
          style={{
            marginTop: "28px",
            fontSize: "30px",
            color: "rgba(255,255,255,0.65)",
            display: "flex",
          }}
        >
          Echte Google-Bewertungen · 50 Städte · SEO &amp; GEO für Makler
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "52px",
            left: "80px",
            fontSize: "32px",
            fontWeight: 700,
            display: "flex",
          }}
        >
          immobilienmakler<span style={{ color: "#C0562F" }}>-in</span>.com
        </div>
      </div>
    ),
    size
  );
}
