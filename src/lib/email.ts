import { formatCOP } from "@/lib/format";

// Notificación por email a la tienda cuando entra un pedido.
// Va directo a la API de Resend (sin SDK). Si no hay RESEND_API_KEY
// configurada, se omite con warning: el pedido NUNCA falla por email.

export interface OrderEmailData {
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
}

export async function sendOrderEmail(order: OrderEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_NOTIFY_EMAIL;
  if (!apiKey || !to) {
    console.warn(
      `[email] RESEND_API_KEY u ORDER_NOTIFY_EMAIL sin configurar — no se envió notificación del pedido ${order.orderNumber}`,
    );
    return;
  }

  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:4px 12px 4px 0">${i.qty}× ${i.name}</td><td align="right">${formatCOP(i.unitPriceCop * i.qty)}</td></tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:520px">
      <h2 style="color:#E91E7A">Nuevo pedido ${order.orderNumber}</h2>
      <p><strong>${order.customerName}</strong> — ${order.phone}</p>
      <p>${order.deliveryLabel}<br/>${order.dateLabel}</p>
      ${order.cardMessage ? `<p><em>Tarjeta: «${order.cardMessage}»</em></p>` : ""}
      <table style="border-collapse:collapse">${rows}
        <tr><td style="padding:8px 12px 0 0">Domicilio</td><td align="right">${formatCOP(order.deliveryFeeCop)}</td></tr>
        <tr><td style="padding:4px 12px 0 0"><strong>Total</strong></td><td align="right"><strong>${formatCOP(order.totalCop)}</strong></td></tr>
      </table>
      <p style="color:#7D6A72;font-size:13px">Gestión del pedido: panel admin (próximamente) o WhatsApp.</p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Con Sentidos <pedidos@resend.dev>",
      to: [to],
      subject: `🎁 Pedido ${order.orderNumber} — ${order.customerName} (${formatCOP(order.totalCop)})`,
      html,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend respondió ${res.status}: ${await res.text()}`);
  }
}
