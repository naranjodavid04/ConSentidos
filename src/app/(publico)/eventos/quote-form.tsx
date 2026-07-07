"use client";

import { useState, useTransition } from "react";

import { CheckIcon, WhatsAppIcon } from "@/components/icons";

import { createEventQuote } from "../quote-actions";

const EVENT_TYPES = [
  "Cumpleaños",
  "Aniversario",
  "Picnic sorpresa",
  "Decoración de una fecha especial",
  "Otra celebración",
];

export function EventQuoteForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guests, setGuests] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Bogota",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createEventQuote({
        name,
        phone,
        email,
        eventType,
        eventDate,
        guests: guests ? Number(guests) : undefined,
        message,
      });
      if (result.ok) setWhatsappUrl(result.whatsappUrl);
      else setError(result.error);
    });
  }

  if (whatsappUrl) {
    return (
      <div className="border-gold/30 rounded-(--radius-card) border bg-white/5 p-8 text-center">
        <span className="bg-gold text-night mx-auto flex h-12 w-12 items-center justify-center rounded-full">
          <CheckIcon className="h-6 w-6" />
        </span>
        <p className="font-display mt-4 text-2xl text-white">
          ¡Recibimos tu solicitud!
        </p>
        <p className="text-gold-soft mx-auto mt-2 max-w-sm text-sm">
          Te contactamos muy pronto con la propuesta. Si quieres adelantar la
          conversación, escríbenos ya mismo:
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gold text-night hover:bg-gold-soft mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Hablar por WhatsApp
        </a>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-gold/30 bg-white px-4 py-3 text-base text-ink outline-none transition-colors focus:border-gold placeholder:text-ink-soft/60";
  const labelClass = "mb-1 block text-sm font-medium text-gold-soft";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Tu nombre</span>
          <input
            type="text"
            required
            minLength={3}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Celular (WhatsApp)</span>
          <input
            type="tel"
            required
            inputMode="tel"
            placeholder="300 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>
      <label className="block">
        <span className={labelClass}>Correo (opcional)</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block sm:col-span-1">
          <span className={labelClass}>¿Qué celebras?</span>
          <select
            required
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Elige
            </option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Fecha (si ya la tienes)</span>
          <input
            type="date"
            min={today}
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>¿Cuántas personas?</span>
          <input
            type="number"
            min={1}
            max={5000}
            placeholder="Ej: 20"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>
      <label className="block">
        <span className={labelClass}>Cuéntanos tu idea</span>
        <textarea
          required
          minLength={10}
          maxLength={1500}
          rows={4}
          placeholder="El lugar, el estilo que sueñas, colores, a quién celebras…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
        />
      </label>

      {error && (
        <p
          role="alert"
          aria-live="assertive"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-gold text-night hover:bg-gold-soft w-full cursor-pointer rounded-full px-8 py-3.5 font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Enviando…" : "Pedir mi cotización"}
      </button>
      <p className="text-gold-soft/70 text-xs">
        Sin compromiso: te respondemos con una propuesta y tú decides.
      </p>
    </form>
  );
}
