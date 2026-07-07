import Link from "next/link";
import { notFound } from "next/navigation";

import { ConfirmButton } from "@/components/admin/confirm-button";
import { createServerSupabase } from "@/lib/supabase/server";

import { deleteProduct } from "../actions";
import { ProductForm } from "../product-form";

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createServerSupabase();

  const [{ data: product }, { data: types }, { data: occasions }] =
    await Promise.all([
      supabase
        .from("products")
        .select(
          `id, name, description, price_cop, type_id, status, featured,
           occasions:product_occasions (occasion_id),
           images:product_images (id, storage_path, position)`,
        )
        .eq("id", id)
        .maybeSingle(),
      supabase.from("product_types").select("*").order("position"),
      supabase.from("occasions").select("*").order("position"),
    ]);

  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/productos"
        className="text-ink-soft hover:text-pink text-sm"
      >
        ← Volver a productos
      </Link>
      <h1 className="font-display text-ink mt-3 text-2xl">{product.name}</h1>

      <ProductForm
        types={types ?? []}
        occasions={occasions ?? []}
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          price_cop: product.price_cop,
          type_id: product.type_id,
          status: product.status,
          featured: product.featured,
          occasionIds: product.occasions.map((o) => o.occasion_id),
          images: [...product.images].sort((a, b) => a.position - b.position),
        }}
      />

      <div className="mt-10 max-w-2xl border-t border-red-100 pt-6">
        <form action={deleteProduct.bind(null, product.id)}>
          <ConfirmButton
            confirmMessage={`¿Segura que quieres borrar "${product.name}"? Si tiene pedidos, solo se ocultará del sitio.`}
            className="cursor-pointer rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Borrar este producto
          </ConfirmButton>
        </form>
      </div>
    </div>
  );
}
