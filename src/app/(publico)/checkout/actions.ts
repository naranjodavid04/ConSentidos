"use server";

import { z } from "zod";

import { sendOrderEmail } from "@/lib/email";
import { formatCOP } from "@/lib/format";
import { site, waLink } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";

// ---------- Validación ----------

const checkoutSchema = z
  .object({
    customerName: z.string().trim().min(3, "NAME").max(120, "NAME"),
    phone: z
      .string()
      .transform((v) => v.replace(/[\s().-]/g, ""))
      .pipe(z.string().regex(/^3\d{9}$/, "PHONE")),
    deliveryMethod: z.enum(["pickup", "delivery"]),
    deliveryZoneId: z.string().uuid().optional(),
    address: z.string().trim().max(200).optional(),
    cardMessage: z.string().trim().max(300, "CARD").optional(),
    desiredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "DATE"),
    desiredTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .optional()
      .or(z.literal("")),
    items: z
      .array(
        z.object({
          productId: z.string().uuid(),
          qty: z.number().int().min(1).max(50),
        }),
      )
      .min(1, "EMPTY")
      .max(30, "TOO_MANY"),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === "delivery") {
      if (!data.deliveryZoneId) {
        ctx.addIssue({
          code: "custom",
          message: "ZONE",
          path: ["deliveryZoneId"],
        });
      }
      if (!data.address || data.address.length < 5) {
        ctx.addIssue({ code: "custom", message: "ADDRESS", path: ["address"] });
      }
    }
  });

export type CheckoutInput = z.input<typeof checkoutSchema>;

export interface OrderSummary {
  orderNumber: string;
  customerName: string;
  phone: string;
  deliveryLabel: string;
  dateLabel: string;
  cardMessage: string | null;
  items: { name: string; qty: number; unitPriceCop: number }[];
  subtotalCop: number;
  deliveryFeeCop: number;
  totalCop: number;
  whatsappUrl: string;
}

export type CreateOrderResult =
  { ok: true; order: OrderSummary } | { ok: false; error: string };

const FRIENDLY_ERRORS: Record<string, string> = {
  NAME: "Cuéntanos tu nombre completo.",
  PHONE:
    "Revisa el celular: debe ser un número colombiano de 10 dígitos (empieza por 3).",
  DATE: "Elige la fecha en que quieres entregar el detalle.",
  ZONE: "Elige el municipio para el domicilio.",
  ADDRESS: "Escribe la dirección de entrega.",
  CARD: "El mensaje de la tarjeta es muy largo (máximo 300 caracteres).",
  EMPTY: "Tu carrito está vacío.",
  TOO_MANY:
    "Son demasiados detalles para un solo pedido — escríbenos por WhatsApp y lo armamos juntos.",
};

function todayInBogota(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}

function formatDateLabel(dateISO: string, time: string | null): string {
  const date = new Date(`${dateISO}T12:00:00-05:00`);
  const dateLabel = date.toLocaleDateString("es-CO", {
    timeZone: "America/Bogota",
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  if (!time) return `${dateLabel} — hora por coordinar`;
  const [h, m] = time.split(":").map(Number);
  const timeLabel = new Date(2000, 0, 1, h, m).toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${dateLabel}, ${timeLabel}`;
}

// ---------- Acción ----------

export async function createOrder(
  input: CheckoutInput,
): Promise<CreateOrderResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    const code = parsed.error.issues[0]?.message ?? "";
    return {
      ok: false,
      error:
        FRIENDLY_ERRORS[code] ??
        "Revisa los datos del formulario e inténtalo de nuevo.",
    };
  }
  const data = parsed.data;

  if (data.desiredDate < todayInBogota()) {
    return {
      ok: false,
      error: "La fecha de entrega no puede ser en el pasado.",
    };
  }

  const supabase = createAdminClient();

  // Nombre de la zona para el resumen (la RPC valida que exista y esté activa).
  let zoneName: string | null = null;
  if (data.deliveryMethod === "delivery" && data.deliveryZoneId) {
    const { data: zone } = await supabase
      .from("delivery_zones")
      .select("municipality")
      .eq("id", data.deliveryZoneId)
      .maybeSingle();
    zoneName = zone?.municipality ?? null;
  }

  const time = data.desiredTime || null;
  const desiredDateISO = `${data.desiredDate}T${time ?? "00:00"}:00-05:00`;

  const { data: result, error } = await supabase.rpc("create_order", {
    customer: {
      customer_name: data.customerName,
      phone: data.phone,
      delivery_method: data.deliveryMethod,
      delivery_zone_id: data.deliveryZoneId ?? null,
      address: data.address ?? null,
      card_message: data.cardMessage ?? null,
      desired_date: desiredDateISO,
    },
    items: data.items.map((i) => ({ product_id: i.productId, qty: i.qty })),
  });

  if (error) {
    console.error("[checkout] create_order falló:", error.message);
    if (error.message.includes("PRODUCT_NOT_AVAILABLE")) {
      return {
        ok: false,
        error:
          "Uno de los detalles del carrito ya no está disponible. Revisa tu carrito e inténtalo de nuevo.",
      };
    }
    if (error.message.includes("ZONE_NOT_AVAILABLE")) {
      return {
        ok: false,
        error:
          "Ese municipio ya no está disponible para domicilio. Elige otro.",
      };
    }
    return {
      ok: false,
      error:
        "No pudimos registrar tu pedido. Inténtalo de nuevo o escríbenos por WhatsApp.",
    };
  }

  const rpc = result as {
    order_number: string;
    subtotal_cop: number;
    delivery_fee_cop: number;
    total_cop: number;
    items: { name: string; qty: number; unit_price_cop: number }[];
  };

  const deliveryLabel =
    data.deliveryMethod === "pickup"
      ? `Recoger en la tienda (${site.location})`
      : `Domicilio en ${zoneName ?? "tu municipio"} — ${data.address}`;
  const dateLabel = formatDateLabel(data.desiredDate, time);

  const summary: OrderSummary = {
    orderNumber: rpc.order_number,
    customerName: data.customerName,
    phone: data.phone,
    deliveryLabel,
    dateLabel,
    cardMessage: data.cardMessage || null,
    items: rpc.items.map((i) => ({
      name: i.name,
      qty: i.qty,
      unitPriceCop: i.unit_price_cop,
    })),
    subtotalCop: rpc.subtotal_cop,
    deliveryFeeCop: rpc.delivery_fee_cop,
    totalCop: rpc.total_cop,
    whatsappUrl: waLink(
      [
        `¡Hola Con Sentidos! Acabo de hacer el pedido *${rpc.order_number}* 🎁`,
        ...rpc.items.map((i) => `• ${i.qty}× ${i.name}`),
        `Entrega: ${deliveryLabel}`,
        `Fecha: ${dateLabel}`,
        `Total: ${formatCOP(rpc.total_cop)}`,
        `A nombre de: ${data.customerName}`,
      ].join("\n"),
    ),
  };

  // Email a la tienda: no bloqueante — el pedido ya quedó creado.
  try {
    await sendOrderEmail({
      orderNumber: summary.orderNumber,
      customerName: summary.customerName,
      phone: summary.phone,
      deliveryLabel,
      dateLabel,
      cardMessage: summary.cardMessage,
      items: summary.items,
      subtotalCop: summary.subtotalCop,
      deliveryFeeCop: summary.deliveryFeeCop,
      totalCop: summary.totalCop,
    });
  } catch (err) {
    console.error(
      `[checkout] email del pedido ${summary.orderNumber} falló:`,
      err,
    );
  }

  return { ok: true, order: summary };
}
