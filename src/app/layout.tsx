import type { Metadata } from "next";
import { Dancing_Script, Epilogue, Fraunces } from "next/font/google";

import { CartProvider } from "@/lib/cart/cart-context";
import { site } from "@/lib/site";

import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
});

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: `${site.name} — Detalles y regalos en La Unión, Antioquia`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${fraunces.variable} ${epilogue.variable} ${dancing.variable} grain min-h-screen antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
