import Link from "next/link";

import { ORDER_STATUS, PAYMENT_STATUS, formatDate } from "@/lib/admin/labels";
import { formatCOP } from "@/lib/format";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabase();

  const [nuevos, preparando, cotizaciones, recientes] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "received"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "preparing"),
    supabase
      .from("quotes")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("orders")
      .select(
        "id, order_number, customer_name, desired_date, total_cop, status, payment_status",
      )
      .in("status", ["received", "preparing", "ready"])
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const cards = [
    {
      href: "/admin/pedidos",
      label: "Pedidos nuevos",
      value: nuevos.count ?? 0,
      accent: "text-pink",
    },
    {
      href: "/admin/pedidos?estado=preparing",
      label: "En preparación",
      value: preparando.count ?? 0,
      accent: "text-gold",
    },
    {
      href: "/admin/cotizaciones",
      label: "Cotizaciones nuevas",
      value: cotizaciones.count ?? 0,
      accent: "text-blue-deep",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-ink text-2xl">
        ¡Hola! Así va la tienda
      </h1>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border-pink-soft rounded-(--radius-card) border bg-white p-4 transition-shadow hover:shadow-md sm:p-5"
          >
            <p className={`font-display text-3xl font-semibold ${card.accent}`}>
              {card.value}
            </p>
            <p className="text-ink-soft mt-1 text-xs leading-tight sm:text-sm">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-ink text-lg">Pedidos por atender</h2>
        <Link
          href="/admin/productos/nuevo"
          className="bg-pink hover:bg-pink-deep rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors"
        >
          + Agregar producto
        </Link>
      </div>

      {recientes.data && recientes.data.length > 0 ? (
        <ul className="mt-4 space-y-3">
          {recientes.data.map((order) => (
            <li key={order.id}>
              <Link
                href={`/admin/pedidos/${order.id}`}
                className="border-pink-soft flex flex-wrap items-center justify-between gap-2 rounded-(--radius-card) border bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div>
                  <p className="text-ink font-semibold">
                    {order.order_number} — {order.customer_name}
                  </p>
                  <p className="text-ink-soft text-sm">
                    {order.desired_date
                      ? `Entregar: ${formatDate(order.desired_date)}`
                      : "Sin fecha acordada"}{" "}
                    · {formatCOP(order.total_cop)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${ORDER_STATUS[order.status].badge}`}
                  >
                    {ORDER_STATUS[order.status].label}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${PAYMENT_STATUS[order.payment_status].badge}`}
                  >
                    {PAYMENT_STATUS[order.payment_status].label}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-pink-soft mt-4 rounded-(--radius-card) border bg-white px-6 py-10 text-center">
          <p className="text-ink font-medium">No hay pedidos pendientes</p>
          <p className="text-ink-soft mt-1 text-sm">
            Cuando alguien haga un pedido en el sitio, aparecerá aquí.
          </p>
        </div>
      )}
    </div>
  );
}
