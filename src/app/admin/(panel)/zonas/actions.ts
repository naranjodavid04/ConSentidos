"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { createServerSupabase } from "@/lib/supabase/server";

const zoneSchema = z.object({
  municipality: z
    .string()
    .trim()
    .min(3, "Escribe el nombre del municipio.")
    .max(60),
  fee: z.coerce
    .number()
    .int()
    .min(0, "La tarifa no puede ser negativa.")
    .max(200000, "Revisa la tarifa: parece demasiado alta."),
});

export interface ZoneActionResult {
  error?: string;
}

function revalidateZones() {
  revalidateTag("public-data");
  revalidatePath("/admin/zonas");
  revalidatePath("/checkout");
  revalidatePath("/detalles");
}

export async function createZone(
  formData: FormData,
): Promise<ZoneActionResult> {
  const supabase = await createServerSupabase();
  const parsed = zoneSchema.safeParse({
    municipality: formData.get("municipality"),
    fee: formData.get("fee"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa los datos." };
  }
  const { error } = await supabase.from("delivery_zones").insert({
    municipality: parsed.data.municipality,
    fee_cop: parsed.data.fee,
    active: true,
  });
  if (error) {
    if (error.code === "23505") {
      return { error: "Ese municipio ya existe en la lista." };
    }
    console.error("[zonas] crear falló:", error.message);
    return { error: "No pudimos guardar la zona. Inténtalo de nuevo." };
  }
  revalidateZones();
  return {};
}

export async function updateZoneFee(
  zoneId: string,
  formData: FormData,
): Promise<ZoneActionResult> {
  const supabase = await createServerSupabase();
  const fee = zoneSchema.shape.fee.safeParse(formData.get("fee"));
  if (!fee.success) {
    return { error: fee.error.issues[0]?.message ?? "Revisa la tarifa." };
  }
  const { error } = await supabase
    .from("delivery_zones")
    .update({ fee_cop: fee.data })
    .eq("id", zoneId);
  if (error) {
    console.error("[zonas] tarifa falló:", error.message);
    return { error: "No pudimos guardar la tarifa." };
  }
  revalidateZones();
  return {};
}

export async function toggleZone(
  zoneId: string,
  active: boolean,
): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.from("delivery_zones").update({ active }).eq("id", zoneId);
  revalidateZones();
}
