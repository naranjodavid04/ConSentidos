import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Fotos del admin: ya vienen redimensionadas del navegador (~150-400KB
      // c/u), pero un lote de varias puede superar el 1mb por defecto.
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      // Supabase Storage: local y hosted.
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
