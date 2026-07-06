import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen OG de marca para links compartidos (WhatsApp/Instagram).
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#FFF9F5",
        border: "24px solid #F9D9E7",
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontStyle: "italic",
          fontWeight: 700,
          color: "#E91E7A",
          display: "flex",
        }}
      >
        Con ♥ Sentidos
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 40,
          color: "#43323A",
          display: "flex",
        }}
      >
        {site.tagline}
      </div>
      <div
        style={{
          marginTop: 40,
          fontSize: 28,
          color: "#7D6A72",
          display: "flex",
        }}
      >
        Detalles con domicilio en el oriente antioqueño
      </div>
    </div>,
    size,
  );
}
