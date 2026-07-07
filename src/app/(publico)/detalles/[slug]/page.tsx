import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { TruckIcon, WhatsAppIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import {
  getActiveZones,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/catalog";
import { formatCOP } from "@/lib/format";
import { orFallback } from "@/lib/safe";
import { site, waLink } from "@/lib/site";
import { resolveImageUrl } from "@/lib/images";

export const revalidate = 300;

interface Params {
  slug: string;
}

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await orFallback(getProductBySlug(slug), null);
  if (!product) return { title: "Detalle no encontrado" };

  return {
    title: product.name,
    description:
      product.description ??
      `${product.name} — detalles con domicilio en La Unión y el oriente antioqueño.`,
    openGraph: product.images[0]
      ? { images: [{ url: resolveImageUrl(product.images[0].storage_path) }] }
      : undefined,
  };
}

export default async function ProductPage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const product = await orFallback(getProductBySlug(slug), null);
  if (!product || product.status === "hidden") notFound();

  const [related, zones] = await Promise.all([
    orFallback(getRelatedProducts(product), []),
    orFallback(getActiveZones(), []),
  ]);

  const soldOut = product.status === "sold_out";
  const orderMessage = soldOut
    ? `¡Hola Con Sentidos! ¿Cuándo vuelve a estar disponible "${product.name}"?`
    : `¡Hola Con Sentidos! Quiero pedir "${product.name}" (${formatCOP(product.price_cop)}) 🎁`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav aria-label="Ruta" className="text-ink-soft text-sm">
        <Link href="/detalles" className="hover:text-pink">
          Catálogo
        </Link>
        {product.type && (
          <>
            {" / "}
            <Link
              href={`/detalles?tipo=${product.type.slug}`}
              className="hover:text-pink"
            >
              {product.type.name}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Galería con scroll-snap, sin JS */}
        <div>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-(--radius-card)">
            {product.images.length > 0 ? (
              product.images.map((image, i) => (
                <div
                  key={image.id}
                  className="border-pink-soft relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden rounded-(--radius-card) border bg-white"
                >
                  <Image
                    src={resolveImageUrl(image.storage_path)}
                    alt={image.alt ?? product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    // Solo la portada compite por ancho de banda inicial.
                    priority={i === 0}
                    fetchPriority={i === 0 ? "high" : undefined}
                    className={`object-cover ${soldOut ? "opacity-70 saturate-50" : ""}`}
                  />
                </div>
              ))
            ) : (
              <div className="border-pink-soft bg-pink-soft/40 text-ink-soft flex aspect-[4/5] w-full items-center justify-center rounded-(--radius-card) border">
                Foto en camino
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <p className="text-ink-soft mt-2 text-center text-xs">
              Desliza para ver más fotos
            </p>
          )}
        </div>

        {/* Info */}
        <div>
          {soldOut && (
            <span className="bg-ink text-cream inline-block rounded-full px-3 py-1 text-xs font-semibold">
              Agotado por ahora
            </span>
          )}
          <h1 className="font-display text-ink mt-2 text-3xl font-medium sm:text-4xl">
            {product.name}
          </h1>

          {product.occasions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {product.occasions.map((occasion) => (
                <Link
                  key={occasion.id}
                  href={`/detalles?ocasion=${occasion.slug}`}
                  className="border-pink-soft text-ink hover:border-pink hover:text-pink rounded-full border bg-white px-3.5 py-2 text-xs font-medium transition-colors"
                >
                  {occasion.emoji && (
                    <span className="mr-1" aria-hidden>
                      {occasion.emoji}
                    </span>
                  )}
                  {occasion.name}
                </Link>
              ))}
            </div>
          )}

          <p className="mt-6">
            <span className="gift-tag font-display text-pink-deep text-2xl font-semibold">
              {formatCOP(product.price_cop)}
            </span>
          </p>

          {product.description && (
            <p className="text-ink mt-6 max-w-prose leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="mt-8 space-y-3">
            {!soldOut && (
              <AddToCartButton
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  priceCop: product.price_cop,
                  imagePath: product.images[0]?.storage_path ?? null,
                }}
              />
            )}
            <a
              href={waLink(orderMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={
                soldOut
                  ? "bg-pink hover:bg-pink-deep inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-sm transition-colors"
                  : "border-pink text-pink hover:bg-pink-soft inline-flex items-center gap-2 rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-colors"
              }
            >
              <WhatsAppIcon className="h-4 w-4" />
              {soldOut
                ? "Preguntar disponibilidad"
                : "Prefiero pedir por WhatsApp"}
            </a>
          </div>

          {/* Entrega */}
          <div className="border-pink-soft mt-8 rounded-(--radius-card) border bg-white p-5">
            <h2 className="text-ink flex items-center gap-2 font-semibold">
              <TruckIcon className="text-pink h-5 w-5" />
              Entrega
            </h2>
            <p className="text-ink-soft mt-2 text-sm leading-relaxed">
              Recoge gratis en {site.location} o pide domicilio
              {zones.length > 0 ? ":" : " en el oriente antioqueño."}
            </p>
            {zones.length > 0 && (
              <ul className="text-ink mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {zones.map((zone) => (
                  <li key={zone.id} className="flex justify-between gap-2">
                    <span>{zone.municipality}</span>
                    <span className="text-ink-soft">
                      {formatCOP(zone.fee_cop)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-ink-soft mt-3 text-xs">
              Cuéntanos la fecha y hora en que quieres entregarlo y el mensaje
              de la tarjeta.
            </p>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-ink text-2xl">
            También te puede gustar
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
