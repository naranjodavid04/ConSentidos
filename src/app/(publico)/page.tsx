import Image from "next/image";
import Link from "next/link";

import {
  ArrowRightIcon,
  HeartIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import {
  getCurrentBanner,
  getFeaturedProducts,
  type Banner,
  type CatalogProduct,
} from "@/lib/data/catalog";
import { orFallback } from "@/lib/safe";
import { site, waDefault } from "@/lib/site";
import { resolveImageUrl } from "@/lib/images";

export const revalidate = 300;

export default async function HomePage() {
  const [banner, featured] = await Promise.all([
    orFallback<Banner | null>(getCurrentBanner(), null),
    orFallback<CatalogProduct[]>(getFeaturedProducts(8), []),
  ]);

  const collage = featured.filter((p) => p.images.length > 0).slice(0, 3);

  return (
    <>
      {banner && (
        <section aria-label="Temporada" className="bg-pink text-white">
          <Link
            href={banner.link ?? "/detalles"}
            className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-center text-sm"
          >
            <span className="font-semibold">{banner.title}</span>
            {banner.subtitle && (
              <span className="opacity-90">{banner.subtitle}</span>
            )}
            <ArrowRightIcon className="h-4 w-4 shrink-0" />
          </Link>
        </section>
      )}

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:pt-16 lg:grid-cols-2">
        <div>
          <p className="font-script text-pink text-2xl sm:text-3xl">
            {site.tagline}
          </p>
          <h1 className="font-display text-ink mt-3 text-4xl leading-tight font-medium sm:text-5xl">
            ¿Hacemos sentir a alguien especial hoy?
          </h1>
          <p className="text-ink-soft mt-5 max-w-prose text-lg leading-relaxed">
            Anchetas, desayunos sorpresa, flores y detalles personalizados,
            armados a mano en {site.location} y entregados en todo el oriente
            antioqueño.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/detalles"
              className="bg-pink hover:bg-pink-deep inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-sm transition-colors"
            >
              Ver catálogo
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <a
              href={waDefault}
              target="_blank"
              rel="noopener noreferrer"
              className="border-pink text-pink hover:bg-pink-soft inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 font-semibold transition-colors"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Pedir por WhatsApp
            </a>
          </div>
        </div>

        {collage.length > 0 && (
          <div className="mx-auto flex max-w-md items-center justify-center">
            {collage.map((product, i) => (
              <Link
                key={product.id}
                href={`/detalles/${product.slug}`}
                className={`relative block w-36 shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-lg transition-transform hover:z-10 hover:scale-105 sm:w-44 ${
                  i === 0
                    ? "z-[2] -rotate-6"
                    : i === 1
                      ? "z-[3] translate-y-4"
                      : "z-[1] -translate-x-2 rotate-6"
                } ${i > 0 ? "-ml-8" : ""}`}
              >
                <Image
                  src={resolveImageUrl(product.images[0].storage_path)}
                  alt={product.name}
                  width={352}
                  height={440}
                  priority
                  className="aspect-[4/5] object-cover"
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Las 3 líneas */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-display text-ink text-2xl sm:text-3xl">
          Tres formas de dar amor
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link
            href="/detalles"
            className="group bg-pink-soft rounded-(--radius-card) p-6 transition-shadow hover:shadow-md"
          >
            <p className="font-script text-pink text-2xl">Detalles</p>
            <p className="text-ink mt-2 text-sm leading-relaxed">
              Anchetas, flores, desayunos y sorpresas para cada ocasión. Pide
              directo del catálogo.
            </p>
            <span className="text-pink mt-4 inline-flex items-center gap-1 text-sm font-semibold">
              Ver catálogo
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/eventos"
            className="group bg-night rounded-(--radius-card) p-6 transition-shadow hover:shadow-md"
          >
            <p className="font-script text-gold text-2xl">Eventos</p>
            <p className="text-gold-soft mt-2 text-sm leading-relaxed">
              Decoración y montaje de celebraciones con Con Sentidos Event
              Planner. Cotiza tu fecha.
            </p>
            <span className="text-gold mt-4 inline-flex items-center gap-1 text-sm font-semibold">
              Cotizar evento
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/personalizados"
            className="group bg-blue-soft rounded-(--radius-card) p-6 transition-shadow hover:shadow-md"
          >
            <p className="font-script text-blue-deep text-2xl">
              Personalizados
            </p>
            <p className="text-ink mt-2 text-sm leading-relaxed">
              Detalles corporativos y personalizados para tu equipo, clientes y
              proveedores.
            </p>
            <span className="text-blue-deep mt-4 inline-flex items-center gap-1 text-sm font-semibold">
              Cotizar pedido
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* Destacados */}
      {featured.length > 0 && (
        <section className="bg-white/60 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-ink text-2xl sm:text-3xl">
                Los favoritos
              </h2>
              <Link
                href="/detalles"
                className="text-pink hover:text-pink-deep inline-flex shrink-0 items-center gap-1 text-sm font-semibold"
              >
                Ver todo
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featured.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cómo funciona */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-ink text-2xl sm:text-3xl">
          Así de fácil
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div className="border-pink-soft rounded-(--radius-card) border bg-white p-6">
            <HeartIcon className="text-pink h-6 w-6" />
            <h3 className="font-display text-ink mt-3 text-lg">
              1. Escoge el detalle
            </h3>
            <p className="text-ink-soft mt-1 text-sm leading-relaxed">
              Filtra por ocasión en el catálogo o cuéntanos tu idea por
              WhatsApp.
            </p>
          </div>
          <div className="border-pink-soft rounded-(--radius-card) border bg-white p-6">
            <WhatsAppIcon className="text-pink h-6 w-6" />
            <h3 className="font-display text-ink mt-3 text-lg">
              2. Personalízalo
            </h3>
            <p className="text-ink-soft mt-1 text-sm leading-relaxed">
              Dinos el mensaje de la tarjeta y la fecha y hora en que quieres
              entregarlo.
            </p>
          </div>
          <div className="border-pink-soft rounded-(--radius-card) border bg-white p-6">
            <TruckIcon className="text-pink h-6 w-6" />
            <h3 className="font-display text-ink mt-3 text-lg">
              3. Lo llevamos
            </h3>
            <p className="text-ink-soft mt-1 text-sm leading-relaxed">
              Recoge en {site.location} o te lo llevamos a domicilio en{" "}
              {site.coverage.slice(1).join(", ")} y más.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
