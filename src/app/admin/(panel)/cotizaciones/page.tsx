import { QUOTE_STATUS, formatDateTime } from "@/lib/admin/labels";
import { WhatsAppIcon } from "@/components/icons";
import { formatCOP } from "@/lib/format";
import { createServerSupabase } from "@/lib/supabase/server";

import { updateQuoteStatus } from "./actions";

export default async function AdminQuotesPage() {
  const supabase = await createServerSupabase();
  const { data: quotes } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-ink text-2xl">Cotizaciones</h1>
      <p className="text-ink-soft mt-1 text-sm">
        Solicitudes de Eventos y Personalizados que llegan desde el sitio.
      </p>

      {quotes && quotes.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {quotes.map((quote) => (
            <li
              key={quote.id}
              className="border-pink-soft rounded-(--radius-card) border bg-white p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      quote.line === "events"
                        ? "bg-night text-gold"
                        : "bg-blue-soft text-ink"
                    }`}
                  >
                    {quote.line === "events" ? "Eventos" : "Corporativo"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${QUOTE_STATUS[quote.status].badge}`}
                  >
                    {QUOTE_STATUS[quote.status].label}
                  </span>
                </div>
                <span className="text-ink-soft text-xs">
                  {formatDateTime(quote.created_at)}
                </span>
              </div>

              <p className="text-ink mt-3 font-semibold">
                {quote.name} — {quote.phone}
                {quote.company ? ` · ${quote.company}` : ""}
              </p>
              <p className="text-ink-soft mt-1 text-sm">
                {[
                  quote.event_type,
                  quote.event_date &&
                    new Date(
                      `${quote.event_date}T12:00:00-05:00`,
                    ).toLocaleDateString("es-CO", {
                      day: "numeric",
                      month: "long",
                    }),
                  quote.guests && `${quote.guests} personas`,
                  quote.quantity && `${quote.quantity} unidades`,
                  quote.budget_cop &&
                    `presupuesto ${formatCOP(quote.budget_cop)}`,
                ]
                  .filter(Boolean)
                  .join(" · ") || "Sin datos adicionales"}
              </p>
              <p className="border-pink-soft bg-pink-soft/30 text-ink mt-3 rounded-xl border px-4 py-3 text-sm">
                {quote.message}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/57${quote.phone}?text=${encodeURIComponent(`¡Hola ${quote.name.split(" ")[0]}! Te escribimos de Con Sentidos por tu cotización 💝`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Responder
                </a>
                {quote.status === "new" && (
                  <form
                    action={updateQuoteStatus.bind(null, quote.id, "contacted")}
                  >
                    <button
                      type="submit"
                      className="border-pink-soft text-ink hover:border-pink cursor-pointer rounded-full border bg-white px-4 py-2 text-sm font-medium"
                    >
                      Ya la contacté
                    </button>
                  </form>
                )}
                {quote.status !== "closed" && (
                  <form
                    action={updateQuoteStatus.bind(null, quote.id, "closed")}
                  >
                    <button
                      type="submit"
                      className="border-pink-soft text-ink-soft hover:border-pink cursor-pointer rounded-full border bg-white px-4 py-2 text-sm"
                    >
                      Cerrar
                    </button>
                  </form>
                )}
                {quote.status === "closed" && (
                  <form action={updateQuoteStatus.bind(null, quote.id, "new")}>
                    <button
                      type="submit"
                      className="border-pink-soft text-ink-soft hover:border-pink cursor-pointer rounded-full border bg-white px-4 py-2 text-sm"
                    >
                      Reabrir
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-pink-soft mt-6 rounded-(--radius-card) border bg-white px-6 py-12 text-center">
          <p className="text-ink font-medium">Aún no hay cotizaciones</p>
          <p className="text-ink-soft mx-auto mt-1 max-w-sm text-sm">
            Llegarán aquí cuando los formularios de Eventos y Personalizados
            estén publicados en el sitio.
          </p>
        </div>
      )}
    </div>
  );
}
