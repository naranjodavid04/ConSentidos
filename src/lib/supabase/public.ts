import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

// Cliente anónimo para lectura pública desde Server Components.
// RLS limita lo visible: productos no ocultos, banners vigentes, zonas activas.
// El cliente autenticado del admin (cookies) llega en F3 con @supabase/ssr.
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
