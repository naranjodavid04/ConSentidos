import Link from "next/link";

import { createServerSupabase } from "@/lib/supabase/server";

import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const supabase = await createServerSupabase();
  const [{ data: types }, { data: occasions }] = await Promise.all([
    supabase.from("product_types").select("*").order("position"),
    supabase.from("occasions").select("*").order("position"),
  ]);

  return (
    <div>
      <Link
        href="/admin/productos"
        className="text-ink-soft hover:text-pink text-sm"
      >
        ← Volver a productos
      </Link>
      <h1 className="font-display text-ink mt-3 text-2xl">Nuevo producto</h1>
      <ProductForm types={types ?? []} occasions={occasions ?? []} />
    </div>
  );
}
