import type { MetadataRoute } from "next";

import { getProducts } from "@/lib/data/catalog";
import { orFallback } from "@/lib/safe";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await orFallback(getProducts(), []);

  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/detalles`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/eventos`, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${BASE}/personalizados`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...products.map((product) => ({
      url: `${BASE}/detalles/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
