"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CheckIcon, WhatsAppIcon } from "@/components/icons";
import type { OrderSummary } from "@/app/checkout/actions";
import { formatCOP } from "@/lib/format";

export default function ConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem("cs-last-order");
      if (raw) {
        setOrder(JSON.parse(raw) as OrderSummary);
        return;
      }
    } catch {
      // sessionStorage bloqueado → volvemos al inicio
    }
    router.replace("/");
  }, [router]);

  if (!order) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="text-center">
        <span className="bg-pink mx-auto flex h-14 w-14 items-center justify-center rounded-full text-white">
          <CheckIcon className="h-7 w-7" />
        </span>
        <p className="font-script text-pink mt-4 text-2xl">¡Gracias!</p>
        <h1 className="font-display text-ink mt-1 text-3xl font-medium sm:text-4xl">
          Pedido recibido
        </h1>
        <p className="text-ink mt-3">
          Tu número de pedido es{" "}
          <span className="gift-tag font-display text-pink-deep text-lg font-semibold">
            {order.orderNumber}
          </span>
        </p>
      </div>

      <div className="border-pink-soft mt-8 rounded-(--radius-card) border bg-white p-6">
        <h2 className="font-display text-ink text-lg">Resumen</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between gap-3">
              <span className="text-ink">
                {item.qty}× {item.name}
              </span>
              <span className="text-ink-soft shrink-0">
                {formatCOP(item.unitPriceCop * item.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-pink-soft mt-4 space-y-1 border-t pt-3 text-sm">
          <p className="flex justify-between">
            <span className="text-ink-soft">Domicilio</span>
            <span className="text-ink">{formatCOP(order.deliveryFeeCop)}</span>
          </p>
          <p className="flex justify-between font-semibold">
            <span className="text-ink">Total</span>
            <span className="text-pink-deep">{formatCOP(order.totalCop)}</span>
          </p>
        </div>
        <dl className="text-ink-soft mt-4 space-y-1 text-sm">
          <div>
            <dt className="sr-only">Entrega</dt>
            <dd>{order.deliveryLabel}</dd>
          </div>
          <div>
            <dt className="sr-only">Fecha</dt>
            <dd>{order.dateLabel}</dd>
          </div>
          {order.cardMessage && (
            <div>
              <dt className="sr-only">Tarjeta</dt>
              <dd>Tarjeta: «{order.cardMessage}»</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="bg-pink-soft mt-6 rounded-(--radius-card) p-6 text-center">
        <p className="text-ink font-semibold">
          Falta un paso: confirma por WhatsApp
        </p>
        <p className="text-ink-soft mx-auto mt-1 max-w-md text-sm">
          Envíanos el pedido por WhatsApp para coordinar el pago — transferencia
          o contraentrega — y confirmar la entrega.
        </p>
        <a
          href={order.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Confirmar por WhatsApp
        </a>
        <p className="text-ink-soft mt-3 text-xs">
          ¿Se te pasó? Tranquilo: también te escribiremos nosotros.
        </p>
      </div>

      <p className="mt-8 text-center">
        <Link
          href="/detalles"
          className="text-pink hover:text-pink-deep font-semibold underline underline-offset-4"
        >
          Seguir mirando el catálogo
        </Link>
      </p>
    </div>
  );
}
