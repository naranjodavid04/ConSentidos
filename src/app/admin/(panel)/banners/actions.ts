"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createServerSupabase } from "@/lib/supabase/server";

const bannerSchema = z
  .object({
    title: z.string().trim().min(3, "El título necesita al menos 3 letras."),
    subtitle: z.string().trim().max(160).optional(),
    link: z.string().trim().optional(),
    startsAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Elige la fecha de inicio."),
    endsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elige la fecha de fin."),
    active: z.boolean(),
  })
  .refine((d) => d.endsAt >= d.startsAt, {
    message: "La fecha de fin debe ser después del inicio.",
    path: ["endsAt"],
  });

export interface BannerActionResult {
  error?: string;
}

function parseForm(formData: FormData) {
  return bannerSchema.safeParse({
    title: formData.get("title"),
    subtitle: (formData.get("subtitle") as string) || undefined,
    link: (formData.get("link") as string) || undefined,
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    active: formData.get("active") === "on",
  });
}

function toRow(data: z.output<typeof bannerSchema>) {
  return {
    title: data.title,
    subtitle: data.subtitle ?? null,
    link: data.link || null,
    // Vigencia en hora de Colombia: desde el inicio del día hasta el final.
    starts_at: `${data.startsAt}T00:00:00-05:00`,
    ends_at: `${data.endsAt}T23:59:59-05:00`,
    active: data.active,
  };
}

function revalidateBanners() {
  revalidatePath("/");
  revalidatePath("/admin/banners");
}

export async function createBanner(
  formData: FormData,
): Promise<BannerActionResult> {
  const supabase = await createServerSupabase();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos." };
  }
  const { error } = await supabase.from("banners").insert(toRow(parsed.data));
  if (error) {
    console.error("[banners] crear falló:", error.message);
    return { error: "No pudimos guardar el banner. Inténtalo de nuevo." };
  }
  revalidateBanners();
  redirect("/admin/banners?guardado=1");
}

export async function updateBanner(
  bannerId: string,
  formData: FormData,
): Promise<BannerActionResult> {
  const supabase = await createServerSupabase();
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos." };
  }
  const { error } = await supabase
    .from("banners")
    .update(toRow(parsed.data))
    .eq("id", bannerId);
  if (error) {
    console.error("[banners] actualizar falló:", error.message);
    return { error: "No pudimos guardar los cambios. Inténtalo de nuevo." };
  }
  revalidateBanners();
  redirect("/admin/banners?guardado=1");
}

export async function deleteBanner(bannerId: string): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.from("banners").delete().eq("id", bannerId);
  revalidateBanners();
  redirect("/admin/banners?aviso=borrado");
}
