import Link from "next/link";
import { notFound } from "next/navigation";

import { createServerSupabase } from "@/lib/supabase/server";

import { BannerForm } from "../banner-form";

// timestamptz → YYYY-MM-DD en hora de Colombia (para el input date).
function toDateInput(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    timeZone: "America/Bogota",
  });
}

export default async function EditBannerPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createServerSupabase();
  const { data: banner } = await supabase
    .from("banners")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!banner) notFound();

  return (
    <div>
      <Link
        href="/admin/banners"
        className="text-ink-soft hover:text-pink text-sm"
      >
        ← Volver a banners
      </Link>
      <h1 className="font-display text-ink mt-3 text-2xl">Editar banner</h1>
      <BannerForm
        banner={{
          id: banner.id,
          title: banner.title,
          subtitle: banner.subtitle,
          link: banner.link,
          startsAt: toDateInput(banner.starts_at),
          endsAt: toDateInput(banner.ends_at),
          active: banner.active,
        }}
      />
    </div>
  );
}
