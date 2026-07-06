import type { Metadata } from "next";
import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import {
  getOccasionsWithProducts,
  getProducts,
  getProductTypesWithProducts,
  type CatalogSort,
  type Occasion,
  type ProductType,
} from "@/lib/data/catalog";
import { orFallback } from "@/lib/safe";
import { waLink } from "@/lib/site";

interface SearchParams {
  ocasion?: string;
  tipo?: string;
  orden?: string;
}

const SORTS: { value: CatalogSort; param: string | null; label: string }[] = [
  { value: "recent", param: null, label: "Novedades" },
  { value: "price_asc", param: "precio-asc", label: "Menor precio" },
  { value: "price_desc", param: "precio-desc", label: "Mayor precio" },
];

function parseSort(orden?: string): CatalogSort {
  if (orden === "precio-asc") return "price_asc";
  if (orden === "precio-desc") return "price_desc";
  return "recent";
}

// Construye el href del catálogo preservando los demás filtros.
function catalogHref(params: {
  ocasion?: string;
  tipo?: string;
  orden?: string;
}): string {
  const query = new URLSearchParams();
  if (params.ocasion) query.set("ocasion", params.ocasion);
  if (params.tipo) query.set("tipo", params.tipo);
  if (params.orden) query.set("orden", params.orden);
  const qs = query.toString();
  return qs ? `/detalles?${qs}` : "/detalles";
}

export async function generateMetadata(props: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { ocasion } = await props.searchParams;
  if (ocasion) {
    const occasions = await orFallback(getOccasionsWithProducts(), []);
    const match = occasions.find((o) => o.slug === ocasion);
    if (match) {
      return {
        title: `Detalles para ${match.name}`,
        description: `Anchetas, flores y regalos para ${match.name} con domicilio en La Unión y el oriente antioqueño.`,
      };
    }
  }
  return {
    title: "Catálogo de detalles",
    description:
      "Anchetas, ramos, desayunos sorpresa y regalos personalizados con domicilio en La Unión y el oriente antioqueño.",
  };
}

export default async function CatalogPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await props.searchParams;
  const sort = parseSort(params.orden);

  const [occasions, types, products] = await Promise.all([
    orFallback<Occasion[]>(getOccasionsWithProducts(), []),
    orFallback<ProductType[]>(getProductTypesWithProducts(), []),
    orFallback(
      getProducts({ occasion: params.ocasion, type: params.tipo, sort }),
      [],
    ),
  ]);

  const activeOccasion = occasions.find((o) => o.slug === params.ocasion);
  const activeType = types.find((t) => t.slug === params.tipo);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="font-script text-pink text-2xl">Detalles</p>
      <h1 className="font-display text-ink mt-1 text-3xl font-medium sm:text-4xl">
        {activeOccasion ? `Para ${activeOccasion.name}` : "Nuestro catálogo"}
      </h1>
      <p className="text-ink-soft mt-2 max-w-prose">
        Cada detalle se arma a mano y lleva tu mensaje en la tarjeta.
      </p>

      {/* Filtro por ocasión — así compra la gente */}
      {occasions.length > 0 && (
        <nav aria-label="Filtrar por ocasión" className="mt-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href={catalogHref({ tipo: params.tipo, orden: params.orden })}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                !activeOccasion
                  ? "bg-pink text-white"
                  : "border-pink-soft text-ink hover:border-pink border bg-white"
              }`}
            >
              Todas las ocasiones
            </Link>
            {occasions.map((occasion) => (
              <Link
                key={occasion.id}
                href={catalogHref({
                  ocasion:
                    occasion.slug === params.ocasion
                      ? undefined
                      : occasion.slug,
                  tipo: params.tipo,
                  orden: params.orden,
                })}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  occasion.slug === params.ocasion
                    ? "bg-pink text-white"
                    : "border-pink-soft text-ink hover:border-pink border bg-white"
                }`}
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
        </nav>
      )}

      {/* Tipo + orden */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        {types.length > 0 && (
          <nav
            aria-label="Filtrar por tipo"
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
          >
            <Link
              href={catalogHref({
                ocasion: params.ocasion,
                orden: params.orden,
              })}
              className={
                !activeType
                  ? "text-pink font-semibold underline underline-offset-4"
                  : "text-ink-soft hover:text-pink"
              }
            >
              Todo tipo de detalle
            </Link>
            {types.map((type) => (
              <Link
                key={type.id}
                href={catalogHref({
                  ocasion: params.ocasion,
                  tipo: type.slug === params.tipo ? undefined : type.slug,
                  orden: params.orden,
                })}
                className={
                  type.slug === params.tipo
                    ? "text-pink font-semibold underline underline-offset-4"
                    : "text-ink-soft hover:text-pink"
                }
              >
                {type.name}
              </Link>
            ))}
          </nav>
        )}

        <nav
          aria-label="Ordenar"
          className="text-ink-soft flex items-center gap-3 text-sm"
        >
          <span>Ordenar:</span>
          {SORTS.map((s) => (
            <Link
              key={s.value}
              href={catalogHref({
                ocasion: params.ocasion,
                tipo: params.tipo,
                orden: s.param ?? undefined,
              })}
              className={
                sort === s.value
                  ? "text-pink font-semibold underline underline-offset-4"
                  : "hover:text-pink"
              }
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Grid */}
      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="border-pink-soft mt-12 rounded-(--radius-card) border bg-white px-6 py-12 text-center">
          <p className="font-display text-ink text-xl">
            No tenemos detalles con ese filtro por ahora
          </p>
          <p className="text-ink-soft mx-auto mt-2 max-w-md text-sm">
            Pero armamos detalles a la medida todos los días. Cuéntanos qué
            necesitas y lo hacemos realidad.
          </p>
          <a
            href={waLink(
              "¡Hola Con Sentidos! Busco un detalle que no vi en el catálogo 🎁",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink hover:bg-pink-deep mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Pedir a la medida
          </a>
        </div>
      )}
    </div>
  );
}
