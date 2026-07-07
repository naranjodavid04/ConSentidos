// Etiquetas y colores del panel — todo en español, cero jerga.
import type {
  OrderStatus,
  PaymentStatus,
  ProductStatus,
  QuoteStatus,
} from "@/lib/supabase/enums";

export const ORDER_STATUS: Record<
  OrderStatus,
  { label: string; badge: string }
> = {
  received: { label: "Nuevo", badge: "bg-pink text-white" },
  preparing: { label: "En preparación", badge: "bg-gold-soft text-ink" },
  ready: { label: "Listo para entregar", badge: "bg-blue-soft text-ink" },
  delivered: { label: "Entregado", badge: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelado", badge: "bg-neutral-200 text-neutral-600" },
};

// El siguiente paso natural de cada estado (los botones grandes del detalle).
export const ORDER_NEXT_STEP: Partial<
  Record<OrderStatus, { next: OrderStatus; action: string }>
> = {
  received: { next: "preparing", action: "Empezar a preparar" },
  preparing: { next: "ready", action: "Marcar como listo" },
  ready: { next: "delivered", action: "Marcar como entregado" },
};

export const PAYMENT_STATUS: Record<
  PaymentStatus,
  { label: string; badge: string }
> = {
  pending: { label: "Pago pendiente", badge: "bg-amber-100 text-amber-800" },
  paid: { label: "Pagado", badge: "bg-emerald-100 text-emerald-800" },
  cod: { label: "Paga al recibir", badge: "bg-blue-soft text-ink" },
};

export const PRODUCT_STATUS: Record<
  ProductStatus,
  { label: string; help: string; badge: string }
> = {
  active: {
    label: "Activo",
    help: "Se ve en el catálogo y se puede pedir",
    badge: "bg-emerald-100 text-emerald-800",
  },
  sold_out: {
    label: "Agotado",
    help: "Se ve en el catálogo pero no se puede pedir",
    badge: "bg-amber-100 text-amber-800",
  },
  hidden: {
    label: "Oculto",
    help: "No aparece en el sitio",
    badge: "bg-neutral-200 text-neutral-600",
  },
};

export const QUOTE_STATUS: Record<
  QuoteStatus,
  { label: string; badge: string }
> = {
  new: { label: "Nueva", badge: "bg-pink text-white" },
  contacted: { label: "Contactada", badge: "bg-gold-soft text-ink" },
  closed: { label: "Cerrada", badge: "bg-neutral-200 text-neutral-600" },
};

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    timeZone: "America/Bogota",
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
