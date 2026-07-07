import Image from "next/image";
import Link from "next/link";

import type { CatalogProduct } from "@/lib/data/catalog";
import { formatCOP } from "@/lib/format";
import { resolveImageUrl } from "@/lib/images";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const cover = product.images[0];
  const soldOut = product.status === "sold_out";

  return (
    <Link
      href={`/detalles/${product.slug}`}
      className="group border-pink-soft flex flex-col overflow-hidden rounded-(--radius-card) border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="bg-pink-soft/40 relative aspect-[4/5] overflow-hidden">
        {cover ? (
          <Image
            src={resolveImageUrl(cover.storage_path)}
            alt={cover.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
              soldOut ? "opacity-60 saturate-50" : ""
            }`}
          />
        ) : (
          <div className="text-ink-soft flex h-full items-center justify-center text-sm">
            Foto en camino
          </div>
        )}
        {soldOut && (
          <span className="bg-ink text-cream absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-ink group-hover:text-pink text-base leading-snug">
          {product.name}
        </h3>
        {product.occasions.length > 0 && (
          <p className="text-ink-soft text-xs">
            {product.occasions.map((o) => o.name).join(" · ")}
          </p>
        )}
        <p className="mt-auto pt-1">
          <span className="gift-tag text-pink-deep text-sm font-semibold">
            {formatCOP(product.price_cop)}
          </span>
        </p>
      </div>
    </Link>
  );
}
