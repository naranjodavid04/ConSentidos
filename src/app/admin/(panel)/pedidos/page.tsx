import Link from "next/link";

import { ORDER_STATUS, PAYMENT_STATUS, formatDate } from "@/lib/admin/labels";
import { formatCOP } from "@/lib/format";
import type { OrderStatus } from "@/lib/supabase/enums";
import { createServerSupabase } from "@/lib/supabase/server";

const TABS: { estado: OrderStatus; label: string }[] = [
  { estado: "received", label: "Nuevos" },
  { estado: "preparing", label: "En preparación" },
  { estado: "ready", label: "Listos" },
  { estado: "delivered", label: "Entregados" },
  { estado: "cancelled", label: "Cancelados" },
];

const EMPTY_MESSAGES: Record<OrderStatus, string> = {
  received:
    "No hay pedidos nuevos. Cuando alguien compre en el sitio, llegará aquí.",
  preparing:
    "Nada en preparación. Los pedidos nuevos pasan aquí cuando empieces a armarlos.",
  ready: "Nada listo para entregar todavía.",
  delivered: "Aún no hay pedidos entregados.",
  cancelled: "No hay pedidos cancelados. ¡Mejor así!",
};

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const params = await props.searchParams;
  const estado: OrderStatus = TABS.some((t) => t.estado === params.estado)
    ? (params.estado as OrderStatus)
    : "received";

  const supabase = await createServerSupabase();

  const [{ data: orders }, counts] = await Promise.all([
    supabase
      .from("orders")
      .select(
        "id, order_number, customer_name, phone, delivery_method, desired_date, total_cop, status, payment_status, created_at",
      )
      .eq("status", estado)
      .order("desired_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false }),
    Promise.all(
      TABS.map((t) =>
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("status", t.estado),
      ),
    ),
  ]);

  return (
    <div>
      <h1 className="font-display text-ink text-2xl">Pedidos</h1>

      <div className="-mx-4 mt-4 overflow-x-auto px-4">
        <div className="flex gap-2">
          {TABS.map((tab, i) => {
            const count = counts[i].count ?? 0;
            const active = tab.estado === estado;
            return (
              <Link
                key={tab.estado}
                href={`/admin/pedidos?estado=${tab.estado}`}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-pink text-white"
                    : "border-pink-soft text-ink hover:border-pink border bg-white"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`ml-1.5 text-xs font-bold ${active ? "text-white/80" : "text-pink"}`}
                  >
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {orders && orders.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/admin/pedidos/${order.id}`}
                className="border-pink-soft flex flex-wrap items-center justify-between gap-2 rounded-(--radius-card) border bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div>
                  <p className="text-ink font-semibold">
                    {order.order_number} — {order.customer_name}
                  </p>
                  <p className="text-ink-soft mt-0.5 text-sm">
                    {order.desired_date
                      ? `Entregar: ${formatDate(order.desired_date)}`
                      : "Sin fecha acordada"}
                    {" · "}
                    {order.delivery_method === "pickup"
                      ? "Recogen en tienda"
                      : "Domicilio"}
                    {" · "}
                    {formatCOP(order.total_cop)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${PAYMENT_STATUS[order.payment_status].badge}`}
                >
                  {PAYMENT_STATUS[order.payment_status].label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-pink-soft mt-6 rounded-(--radius-card) border bg-white px-6 py-12 text-center">
          <p className="text-ink font-medium">
            {ORDER_STATUS[estado].label}: nada por aquí
          </p>
          <p className="text-ink-soft mx-auto mt-1 max-w-sm text-sm">
            {EMPTY_MESSAGES[estado]}
          </p>
        </div>
      )}
    </div>
  );
}
