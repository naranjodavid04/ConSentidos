"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";

// Los server actions son endpoints públicos: siempre verificar sesión.
async function requireAdmin() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  return supabase;
}

// "Ancheta Día del Padre" → "ancheta-dia-del-padre" (+ -2 si ya existe).
function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

async function uniqueSlug(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  name: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(name) || "detalle";
  let query = supabase.from("products").select("slug").like("slug", `${base}%`);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;
  const taken = new Set((data ?? []).map((r) => r.slug));
  if (!taken.has(base)) return base;
  for (let i = 2; ; i++) {
    if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
  }
}

const productSchema = z.object({
  name: z.string().trim().min(3, "El nombre necesita al menos 3 letras."),
  description: z.string().trim().max(1000).optional(),
  price: z.coerce
    .number()
    .int("El precio debe ser un número entero.")
    .min(1000, "El precio debe ser al menos $1.000.")
    .max(50000000, "Revisa el precio: parece demasiado alto."),
  typeId: z.string().uuid("Elige el tipo de detalle."),
  status: z.enum(["active", "sold_out", "hidden"]),
  featured: z.boolean(),
  occasionIds: z.array(z.string().uuid()),
});

export interface ProductActionResult {
  error?: string;
}

const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

async function uploadPhotos(
  productId: string,
  photos: File[],
  startPosition: number,
): Promise<string | null> {
  if (photos.length === 0) return null;
  const admin = createAdminClient();

  for (const [index, photo] of photos.entries()) {
    if (!PHOTO_TYPES.includes(photo.type)) {
      return "Una de las fotos no es una imagen válida (usa JPG o PNG).";
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return "Una de las fotos quedó muy pesada. Inténtalo de nuevo.";
    }
    const ext = photo.type === "image/png" ? "png" : "jpg";
    const path = `products/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await admin.storage
      .from("media")
      .upload(path, photo, { contentType: photo.type });
    if (uploadError) {
      console.error("[productos] upload falló:", uploadError.message);
      return "No pudimos subir una de las fotos. Inténtalo de nuevo.";
    }
    const { error: insertError } = await admin.from("product_images").insert({
      product_id: productId,
      storage_path: path,
      position: startPosition + index,
    });
    if (insertError) {
      console.error("[productos] product_images falló:", insertError.message);
      return "La foto se subió pero no se pudo guardar. Inténtalo de nuevo.";
    }
  }
  return null;
}

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    description: (formData.get("description") as string) || undefined,
    price: formData.get("price"),
    typeId: formData.get("typeId"),
    status: formData.get("status"),
    featured: formData.get("featured") === "on",
    occasionIds: formData.getAll("occasionIds").map(String),
  });
}

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/detalles");
  revalidatePath("/admin/productos");
}

export async function createProduct(
  formData: FormData,
): Promise<ProductActionResult> {
  const supabase = await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos." };
  }
  const data = parsed.data;

  const slug = await uniqueSlug(supabase, data.name);
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: data.name,
      slug,
      description: data.description ?? null,
      price_cop: data.price,
      type_id: data.typeId,
      status: data.status,
      featured: data.featured,
    })
    .select("id")
    .single();
  if (error || !product) {
    console.error("[productos] crear falló:", error?.message);
    return { error: "No pudimos guardar el producto. Inténtalo de nuevo." };
  }

  if (data.occasionIds.length > 0) {
    await supabase.from("product_occasions").insert(
      data.occasionIds.map((occasionId) => ({
        product_id: product.id,
        occasion_id: occasionId,
      })),
    );
  }

  const photos = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const photoError = await uploadPhotos(product.id, photos, 0);
  if (photoError) {
    // El producto quedó creado; la foto se puede reintentar editando.
    revalidatePublic();
    return { error: `El producto se guardó, pero: ${photoError}` };
  }

  revalidatePublic();
  redirect("/admin/productos?guardado=1");
}

export async function updateProduct(
  productId: string,
  formData: FormData,
): Promise<ProductActionResult> {
  const supabase = await requireAdmin();
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos." };
  }
  const data = parsed.data;

  const { data: current } = await supabase
    .from("products")
    .select("name, slug")
    .eq("id", productId)
    .maybeSingle();
  if (!current) return { error: "Este producto ya no existe." };

  // El slug solo cambia si cambió el nombre (los links viejos importan).
  const slug =
    current.name === data.name
      ? current.slug
      : await uniqueSlug(supabase, data.name, productId);

  const { error } = await supabase
    .from("products")
    .update({
      name: data.name,
      slug,
      description: data.description ?? null,
      price_cop: data.price,
      type_id: data.typeId,
      status: data.status,
      featured: data.featured,
    })
    .eq("id", productId);
  if (error) {
    console.error("[productos] actualizar falló:", error.message);
    return { error: "No pudimos guardar los cambios. Inténtalo de nuevo." };
  }

  await supabase.from("product_occasions").delete().eq("product_id", productId);
  if (data.occasionIds.length > 0) {
    await supabase.from("product_occasions").insert(
      data.occasionIds.map((occasionId) => ({
        product_id: productId,
        occasion_id: occasionId,
      })),
    );
  }

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);
  const photos = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);
  const photoError = await uploadPhotos(productId, photos, count ?? 0);
  if (photoError) {
    revalidatePublic();
    revalidatePath(`/detalles/${slug}`);
    return { error: `Los cambios se guardaron, pero: ${photoError}` };
  }

  revalidatePublic();
  revalidatePath(`/detalles/${slug}`);
  redirect("/admin/productos?guardado=1");
}

export async function deleteProductImage(
  productId: string,
  imageId: string,
): Promise<void> {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: image } = await admin
    .from("product_images")
    .select("storage_path")
    .eq("id", imageId)
    .eq("product_id", productId)
    .maybeSingle();
  if (!image) return;

  await admin.from("product_images").delete().eq("id", imageId);
  if (!image.storage_path.startsWith("/")) {
    await admin.storage.from("media").remove([image.storage_path]);
  }
  revalidatePublic();
  revalidatePath(`/admin/productos/${productId}`);
}

// Borrar: si el producto tiene pedidos, se oculta en vez de borrarse
// (el historial de pedidos no se toca; los items guardan snapshot).
export async function deleteProduct(productId: string): Promise<void> {
  const supabase = await requireAdmin();

  const { count } = await supabase
    .from("order_items")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if ((count ?? 0) > 0) {
    await supabase
      .from("products")
      .update({ status: "hidden" })
      .eq("id", productId);
    revalidatePublic();
    redirect("/admin/productos?aviso=oculto");
  }

  const admin = createAdminClient();
  const { data: images } = await admin
    .from("product_images")
    .select("storage_path")
    .eq("product_id", productId);

  await supabase.from("products").delete().eq("id", productId);

  const storagePaths = (images ?? [])
    .map((i) => i.storage_path)
    .filter((p) => !p.startsWith("/"));
  if (storagePaths.length > 0) {
    await admin.storage.from("media").remove(storagePaths);
  }

  revalidatePublic();
  redirect("/admin/productos?aviso=borrado");
}

// Limpia los seeds de demostración cuando el catálogo real esté cargado.
export async function deleteExampleProducts(): Promise<void> {
  const supabase = await requireAdmin();
  const { data: examples } = await supabase
    .from("products")
    .select("id")
    .eq("is_example", true);

  for (const example of examples ?? []) {
    const { count } = await supabase
      .from("order_items")
      .select("id", { count: "exact", head: true })
      .eq("product_id", example.id);
    if ((count ?? 0) > 0) {
      await supabase
        .from("products")
        .update({ status: "hidden" })
        .eq("id", example.id);
    } else {
      await supabase.from("products").delete().eq("id", example.id);
    }
  }

  revalidatePublic();
  redirect("/admin/productos?aviso=ejemplos");
}
