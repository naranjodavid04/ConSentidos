"use server";

import { revalidatePath } from "next/cache";

import type { QuoteStatus } from "@/lib/supabase/enums";
import { createServerSupabase } from "@/lib/supabase/server";

const QUOTE_STATUSES: QuoteStatus[] = ["new", "contacted", "closed"];

export async function updateQuoteStatus(
  quoteId: string,
  status: QuoteStatus,
): Promise<void> {
  if (!QUOTE_STATUSES.includes(status)) throw new Error("Estado inválido");
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("quotes")
    .update({ status })
    .eq("id", quoteId);
  if (error) throw error;
  revalidatePath("/admin/cotizaciones");
  revalidatePath("/admin");
}
