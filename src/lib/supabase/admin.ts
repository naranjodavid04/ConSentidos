import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

// Cliente con service role: SOLO para Server Actions / código de servidor.
// Omite RLS — jamás importarlo desde un client component.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno",
    );
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
