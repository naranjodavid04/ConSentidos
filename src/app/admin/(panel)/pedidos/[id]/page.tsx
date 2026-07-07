import Link from "next/link";
import { notFound } from "next/navigation";

import { ConfirmButton } from "@/components/admin/confirm-button";
import { WhatsAppIcon } from "@/components/icons";
import {
  ORDER_NEXT_STEP,
  ORDER_STATUS,
  PAYMENT_STATUS,
  formatDateTime,
} from "@/lib/admin/labels";
import { formatCOP } from "@/lib/format";
import { createServerSupabase } from "@/lib/supabase/server";

import { updateOrderStatus, updatePaymentStatus } from "../actions";

export default async function AdminOrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createServerSupabase();

  const { data: order } = await supabase
    .from("orders")
    .select(
      `id, order_number, customer_name, phone, delivery_method, address,
       card_message, desired_date, status, payment_status, delivery_fee_cop,
       total_cop, created_at,
       zone:delivery_zones (municipality),
       items:order_items (id, product_name, qty, unit_price_cop)`,
    )
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const nextStep = ORDER_NEXT_STEP[order.status];
  const waCustomer = `https://wa.me/57${order.phone}?text=${encodeURIComponent(
    `¡Hola ${order.customer_name.split(" ")[0]}! Te escribimos de Con Sentidos por tu pedido ${order.order_number} 💝`,
  )}`;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/pedidos"
        className="text-ink-soft hover:text-pink text-sm"
      >
        ← Volver a pedidos
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-ink text-2xl">
          Pedido {order.order_number}
        </h1>
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
      </div>
      <p className="text-ink-soft mt-1 text-sm">
        Recibido el {formatDateTime(order.created_at)}
      </p>

      {/* Cliente y entrega */}
      <div className="border-pink-soft mt-6 rounded-(--radius-card) border bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-ink font-semibold">{order.customer_name}</p>
            <p className="text-ink-soft text-sm">{order.phone}</p>
          </div>
          <a
            href={waCustomer}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Escribirle
          </a>
        </div>
        <dl className="text-ink mt-4 space-y-2 text-sm">
          <div>
            <dt className="text-ink-soft">Entrega</dt>
            <dd>
              {order.delivery_method === "pickup"
                ? "Recogen en la tienda (La Unión)"
                : `Domicilio en ${order.zone?.municipality ?? "—"}: ${order.address}`}
            </dd>
          </div>
          <div>
            <dt className="text-ink-soft">Fecha y hora deseada</dt>
            <dd>
              {order.desired_date
                ? formatDateTime(order.desired_date).replace(
                    ", 12:00 a. m.",
                    " — hora por coordinar",
                  )
                : "Por coordinar"}
            </dd>
          </div>
          {order.card_message && (
            <div>
              <dt className="text-ink-soft">Mensaje de la tarjeta</dt>
              <dd className="border-pink-soft bg-pink-soft/30 mt-1 rounded-xl border px-4 py-3 italic">
                «{order.card_message}»
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Items */}
      <div className="border-pink-soft mt-4 rounded-(--radius-card) border bg-white p-5">
        <h2 className="font-display text-ink text-lg">Detalles del pedido</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span className="text-ink">
                {item.qty}× {item.product_name}
              </span>
              <span className="text-ink-soft">
                {formatCOP(item.unit_price_cop * item.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-pink-soft mt-3 space-y-1 border-t pt-3 text-sm">
          <p className="flex justify-between">
            <span className="text-ink-soft">Domicilio</span>
            <span className="text-ink">
              {formatCOP(order.delivery_fee_cop)}
            </span>
          </p>
          <p className="flex justify-between text-base font-semibold">
            <span className="text-ink">Total</span>
            <span className="text-pink-deep">{formatCOP(order.total_cop)}</span>
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div className="border-pink-soft mt-4 rounded-(--radius-card) border bg-white p-5">
        <h2 className="font-display text-ink text-lg">¿Qué sigue?</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {nextStep && (
            <form
              action={updateOrderStatus.bind(null, order.id, nextStep.next)}
            >
              <button
                type="submit"
                className="bg-pink hover:bg-pink-deep cursor-pointer rounded-full px-5 py-2.5 font-semibold text-white transition-colors"
              >
                {nextStep.action}
              </button>
            </form>
          )}
          {order.payment_status === "pending" && (
            <>
              <form action={updatePaymentStatus.bind(null, order.id, "paid")}>
                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Ya pagó
                </button>
              </form>
              <form action={updatePaymentStatus.bind(null, order.id, "cod")}>
                <button
                  type="submit"
                  className="border-pink-soft text-ink hover:border-pink cursor-pointer rounded-full border bg-white px-5 py-2.5 font-medium transition-colors"
                >
                  Paga al recibir
                </button>
              </form>
            </>
          )}
          {order.payment_status !== "pending" && (
            <form action={updatePaymentStatus.bind(null, order.id, "pending")}>
              <button
                type="submit"
                className="border-pink-soft text-ink-soft hover:border-pink cursor-pointer rounded-full border bg-white px-5 py-2.5 text-sm transition-colors"
              >
                Volver a «pago pendiente»
              </button>
            </form>
          )}
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <form action={updateOrderStatus.bind(null, order.id, "cancelled")}>
              <ConfirmButton
                confirmMessage={`¿Segura que quieres cancelar el pedido ${order.order_number}? Esta acción no se puede deshacer.`}
                className="cursor-pointer rounded-full border border-red-200 bg-white px-5 py-2.5 font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                Cancelar pedido
              </ConfirmButton>
            </form>
          )}
          {order.status === "cancelled" && (
            <form action={updateOrderStatus.bind(null, order.id, "received")}>
              <button
                type="submit"
                className="border-pink-soft text-ink hover:border-pink cursor-pointer rounded-full border bg-white px-5 py-2.5 font-medium transition-colors"
              >
                Reactivar como nuevo
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
