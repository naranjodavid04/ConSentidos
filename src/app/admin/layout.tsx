import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Panel de la tienda",
    template: "%s · Panel Con Sentidos",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
