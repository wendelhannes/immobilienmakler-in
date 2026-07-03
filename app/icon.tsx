import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// Quadratisches Marken-Icon: dient als Favicon UND als Schema.org-Logo
// (referenziert als https://immobilienmakler-in.com/icon).
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A1A1A",
          borderRadius: "96px",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: "300px",
            fontWeight: 700,
            color: "#FAF8F5",
            display: "flex",
            lineHeight: 1,
          }}
        >
          i<span style={{ color: "#C0562F" }}>m</span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "88px",
            width: "180px",
            height: "14px",
            background: "#C0562F",
            borderRadius: "7px",
          }}
        />
      </div>
    ),
    size
  );
}
