"use server";

import { z } from "zod";

import { sendQuoteEmail } from "@/lib/email";
import { formatCOP } from "@/lib/format";
import { waLink } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";

// Cotizaciones de Eventos y Corporativo: el visitante no escribe en la DB
// directamente (RLS sin INSERT anon) — este action valida y usa service role.

const baseSchema = {
  name: z.string().trim().min(3, "NAME").max(120, "NAME"),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s().-]/g, ""))
    .pipe(z.string().regex(/^3\d{9}$/, "PHONE")),
  email: z.string().trim().email("EMAIL").max(160).optional().or(z.literal("")),
  message: z.string().trim().min(10, "MESSAGE").max(1500, "MESSAGE"),
};

const eventSchema = z.object({
  ...baseSchema,
  eventType: z.string().trim().min(2, "EVENT_TYPE").max(80),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  guests: z.coerce.number().int().min(1).max(5000).optional(),
});

const corporateSchema = z.object({
  ...baseSchema,
  company: z.string().trim().min(2, "COMPANY").max(160),
  quantity: z.coerce.number().int().min(1).max(100000).optional(),
  budget: z.coerce.number().int().min(0).max(500000000).optional(),
});

export type EventQuoteInput = z.input<typeof eventSchema>;
export type CorporateQuoteInput = z.input<typeof corporateSchema>;

export type QuoteResult =
  { ok: true; whatsappUrl: string } | { ok: false; error: string };

const FRIENDLY_ERRORS: Record<string, string> = {
  NAME: "Cuéntanos tu nombre.",
  PHONE:
    "Revisa el celular: debe ser un número colombiano de 10 dígitos (empieza por 3).",
  EMAIL: "Revisa el correo: parece incompleto.",
  MESSAGE: "Cuéntanos un poquito más en el mensaje (mínimo 10 letras).",
  EVENT_TYPE: "Cuéntanos qué quieres celebrar.",
  COMPANY: "Cuéntanos el nombre de tu empresa o marca.",
};

function friendly(code: string | undefined): string {
  return (
    FRIENDLY_ERRORS[code ?? ""] ??
    "Revisa los datos del formulario e inténtalo de nuevo."
  );
}

export async function createEventQuote(
  input: EventQuoteInput,
): Promise<QuoteResult> {
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: friendly(parsed.error.issues[0]?.message) };
  }
  const data = parsed.data;

  const supabase = createAdminClient();
  const { error } = await supabase.from("quotes").insert({
    line: "events",
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    event_type: data.eventType,
    event_date: data.eventDate || null,
    guests: data.guests ?? null,
    message: data.message,
  });
  if (error) {
    console.error("[cotizaciones] eventos falló:", error.message);
    return {
      ok: false,
      error:
        "No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.",
    };
  }

  const details = [
    `Evento: ${data.eventType}`,
    data.eventDate &&
      `Fecha: ${new Date(`${data.eventDate}T12:00:00-05:00`).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}`,
    data.guests && `Personas: ${data.guests}`,
  ]
    .filter(Boolean)
    .join(" · ");

  try {
    await sendQuoteEmail({
      line: "events",
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      details,
      message: data.message,
    });
  } catch (err) {
    console.error("[cotizaciones] email de eventos falló:", err);
  }

  return {
    ok: true,
    whatsappUrl: waLink(
      `¡Hola Con Sentidos! Acabo de enviar una cotización de evento (${data.eventType}) a nombre de ${data.name} 🎉`,
    ),
  };
}

export async function createCorporateQuote(
  input: CorporateQuoteInput,
): Promise<QuoteResult> {
  const parsed = corporateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: friendly(parsed.error.issues[0]?.message) };
  }
  const data = parsed.data;

  const supabase = createAdminClient();
  const { error } = await supabase.from("quotes").insert({
    line: "corporate",
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    company: data.company,
    quantity: data.quantity ?? null,
    budget_cop: data.budget ?? null,
    message: data.message,
  });
  if (error) {
    console.error("[cotizaciones] corporativo falló:", error.message);
    return {
      ok: false,
      error:
        "No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.",
    };
  }

  const details = [
    `Empresa: ${data.company}`,
    data.quantity && `Unidades: ${data.quantity}`,
    data.budget && `Presupuesto: ${formatCOP(data.budget)}`,
  ]
    .filter(Boolean)
    .join(" · ");

  try {
    await sendQuoteEmail({
      line: "corporate",
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      details,
      message: data.message,
    });
  } catch (err) {
    console.error("[cotizaciones] email corporativo falló:", err);
  }

  return {
    ok: true,
    whatsappUrl: waLink(
      `¡Hola Con Sentidos! Acabo de enviar una cotización corporativa para ${data.company} 💙`,
    ),
  };
}
