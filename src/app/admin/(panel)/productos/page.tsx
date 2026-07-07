import Image from "next/image";
import Link from "next/link";

import { ConfirmButton } from "@/components/admin/confirm-button";
import { PRODUCT_STATUS } from "@/lib/admin/labels";
import { formatCOP } from "@/lib/format";
import { resolveImageUrl } from "@/lib/images";
import { createServerSupabase } from "@/lib/supabase/server";

import { deleteExampleProducts } from "./actions";

const AVISOS: Record<string, string> = {
  oculto:
    "Ese producto tiene pedidos, así que lo ocultamos en vez de borrarlo. No aparece más en el sitio.",
  borrado: "Producto borrado.",
  ejemplos: "Listo, los productos de ejemplo se quitaron del catálogo.",
};

export default async function AdminProductsPage(props: {
  searchParams: Promise<{ guardado?: string; aviso?: string }>;
}) {
  const params = await props.searchParams;
  const supabase = await createServerSupabase();

  const { data: products } = await supabase
    .from("products")
    .select(
      "id, name, price_cop, status, featured, is_example, images:product_images (storage_path, position)",
    )
    .order("created_at", { ascending: false });

  const exampleCount = (products ?? []).filter((p) => p.is_example).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-ink text-2xl">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-pink hover:bg-pink-deep rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          + Agregar producto
        </Link>
      </div>

      {params.guardado && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ¡Guardado! Los cambios ya se ven en el sitio.
        </p>
      )}
      {params.aviso && AVISOS[params.aviso] && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {AVISOS[params.aviso]}
        </p>
      )}

      {exampleCount > 0 && (
        <div className="border-gold-soft mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-900">
            Hay {exampleCount} productos <strong>de ejemplo</strong> (con fotos
            de tu Instagram). Cuando cargues tu catálogo real, puedes quitarlos
            todos de una vez.
          </p>
          <form action={deleteExampleProducts}>
            <ConfirmButton
              confirmMessage={`¿Quitar los ${exampleCount} productos de ejemplo del catálogo? Los que tengan pedidos solo se ocultan.`}
              className="cursor-pointer rounded-full border border-amber-300 bg-white px-4 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100"
            >
              Quitar ejemplos
            </ConfirmButton>
          </form>
        </div>
      )}

      {products && products.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {products.map((product) => {
            const cover = [...product.images].sort(
              (a, b) => a.position - b.position,
            )[0];
            return (
              <li key={product.id}>
                <Link
                  href={`/admin/productos/${product.id}`}
                  className="border-pink-soft flex items-center gap-4 rounded-(--radius-card) border bg-white p-3 transition-shadow hover:shadow-md"
                >
                  {cover ? (
                    <Image
                      src={resolveImageUrl(cover.storage_path)}
                      alt=""
                      width={56}
                      height={70}
                      className="aspect-[4/5] shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="bg-pink-soft/40 text-ink-soft flex aspect-[4/5] w-14 shrink-0 items-center justify-center rounded-lg text-[10px]">
                      Sin foto
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-ink truncate font-semibold">
                      {product.featured && (
                        <span title="Destacado en portada" className="mr-1">
                          ⭐
                        </span>
                      )}
                      {product.name}
                    </p>
                    <p className="text-ink-soft text-sm">
                      {formatCOP(product.price_cop)}
                      {product.is_example && " · ejemplo"}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${PRODUCT_STATUS[product.status].badge}`}
                  >
                    {PRODUCT_STATUS[product.status].label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="border-pink-soft mt-6 rounded-(--radius-card) border bg-white px-6 py-12 text-center">
          <p className="text-ink font-medium">Aún no hay productos</p>
          <p className="text-ink-soft mx-auto mt-1 max-w-sm text-sm">
            Toca «Agregar producto» para crear el primero: nombre, precio, fotos
            y listo.
          </p>
        </div>
      )}
    </div>
  );
}
