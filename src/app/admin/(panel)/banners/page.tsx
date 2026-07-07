import Link from "next/link";

import { ConfirmButton } from "@/components/admin/confirm-button";
import { createServerSupabase } from "@/lib/supabase/server";

import { deleteBanner } from "./actions";

function bannerState(banner: {
  active: boolean;
  starts_at: string;
  ends_at: string;
}): { label: string; badge: string } {
  if (!banner.active)
    return { label: "Apagado", badge: "bg-neutral-200 text-neutral-600" };
  const now = new Date().toISOString();
  if (now < banner.starts_at)
    return { label: "Programado", badge: "bg-blue-soft text-ink" };
  if (now > banner.ends_at)
    return { label: "Vencido", badge: "bg-neutral-200 text-neutral-600" };
  return { label: "Visible ahora", badge: "bg-emerald-100 text-emerald-800" };
}

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    timeZone: "America/Bogota",
    day: "numeric",
    month: "short",
  });
}

export default async function AdminBannersPage(props: {
  searchParams: Promise<{ guardado?: string; aviso?: string }>;
}) {
  const params = await props.searchParams;
  const supabase = await createServerSupabase();
  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("starts_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-ink text-2xl">
            Banners de temporada
          </h1>
          <p className="text-ink-soft mt-1 text-sm">
            La cinta que aparece arriba de la portada. Se prende y apaga sola
            según las fechas.
          </p>
        </div>
        <Link
          href="/admin/banners/nuevo"
          className="bg-pink hover:bg-pink-deep rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          + Nuevo banner
        </Link>
      </div>

      {params.guardado && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ¡Guardado!
        </p>
      )}
      {params.aviso === "borrado" && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Banner borrado.
        </p>
      )}

      {banners && banners.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {banners.map((banner) => {
            const state = bannerState(banner);
            return (
              <li
                key={banner.id}
                className="border-pink-soft flex flex-wrap items-center justify-between gap-3 rounded-(--radius-card) border bg-white p-4"
              >
                <div className="min-w-0">
                  <p className="text-ink font-semibold">{banner.title}</p>
                  <p className="text-ink-soft text-sm">
                    {fmt(banner.starts_at)} → {fmt(banner.ends_at)}
                    {banner.subtitle ? ` · ${banner.subtitle}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${state.badge}`}
                  >
                    {state.label}
                  </span>
                  <Link
                    href={`/admin/banners/${banner.id}`}
                    className="border-pink-soft text-ink hover:border-pink rounded-full border bg-white px-4 py-1.5 text-sm font-medium"
                  >
                    Editar
                  </Link>
                  <form action={deleteBanner.bind(null, banner.id)}>
                    <ConfirmButton
                      confirmMessage={`¿Borrar el banner "${banner.title}"?`}
                      className="cursor-pointer rounded-full border border-red-200 bg-white px-4 py-1.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      Borrar
                    </ConfirmButton>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="border-pink-soft mt-6 rounded-(--radius-card) border bg-white px-6 py-12 text-center">
          <p className="text-ink font-medium">No hay banners</p>
          <p className="text-ink-soft mx-auto mt-1 max-w-sm text-sm">
            Crea uno para anunciar la próxima temporada (Día de la Madre, Amor y
            Amistad, Navidad…). Se activa y desactiva solo por fechas.
          </p>
        </div>
      )}
    </div>
  );
}
