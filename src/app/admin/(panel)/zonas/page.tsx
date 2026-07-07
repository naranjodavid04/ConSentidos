import { createServerSupabase } from "@/lib/supabase/server";

import { ZonesManager } from "./zones-manager";

export default async function AdminZonesPage() {
  const supabase = await createServerSupabase();
  const { data: zones } = await supabase
    .from("delivery_zones")
    .select("id, municipality, fee_cop, active")
    .order("municipality");

  return (
    <div>
      <h1 className="font-display text-ink text-2xl">Zonas de domicilio</h1>
      <p className="text-ink-soft mt-1 text-sm">
        Municipios donde entregas y su tarifa. «Pausar» lo quita del checkout
        sin borrarlo.
      </p>
      <ZonesManager zones={zones ?? []} />
    </div>
  );
}
