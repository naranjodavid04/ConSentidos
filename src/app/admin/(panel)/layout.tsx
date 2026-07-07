import Link from "next/link";
import { redirect } from "next/navigation";

import { HeartIcon } from "@/components/icons";
import { createServerSupabase } from "@/lib/supabase/server";

import { signOut } from "../login/actions";
import { AdminNav } from "./admin-nav";

// Shell del panel: header propio + nav de secciones. El middleware ya
// protege /admin, este chequeo es el cinturón además de las tirantas.
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen">
      <header className="border-pink-soft bg-cream/95 sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/admin" className="flex items-baseline gap-1.5">
            <span className="font-script text-pink text-2xl leading-none">
              Con
            </span>
            <HeartIcon className="text-pink h-3.5 w-3.5 self-center" />
            <span className="font-script text-pink text-2xl leading-none">
              Sentidos
            </span>
            <span className="text-ink-soft ml-2 hidden text-sm sm:inline">
              · Panel de la tienda
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-ink-soft hover:text-pink text-sm"
            >
              Ver el sitio
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="border-pink-soft text-ink hover:border-pink hover:text-pink cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4">
          <AdminNav />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
