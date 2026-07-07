"use client";

import { useState, useTransition } from "react";

import { CheckIcon, WhatsAppIcon } from "@/components/icons";

import { createCorporateQuote } from "../quote-actions";

export function CorporateQuoteForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createCorporateQuote({
        name,
        phone,
        email,
        company,
        quantity: quantity ? Number(quantity) : undefined,
        budget: budget ? Number(budget) : undefined,
        message,
      });
      if (result.ok) setWhatsappUrl(result.whatsappUrl);
      else setError(result.error);
    });
  }

  if (whatsappUrl) {
    return (
      <div className="border-blue rounded-(--radius-card) border bg-white p-8 text-center">
        <span className="bg-blue-deep mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white">
          <CheckIcon className="h-6 w-6" />
        </span>
        <p className="font-display text-ink mt-4 text-2xl">
          ¡Recibimos tu solicitud!
        </p>
        <p className="text-ink-soft mx-auto mt-2 max-w-sm text-sm">
          Te contactamos muy pronto con la propuesta. Si quieres adelantar la
          conversación, escríbenos ya mismo:
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-deep hover:bg-blue mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-colors"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Hablar por WhatsApp
        </a>
      </div>
    );
  }

  const inputClass =
    "border-blue-soft focus:border-blue-deep text-ink w-full rounded-xl border bg-white px-4 py-3 text-base outline-none transition-colors placeholder:text-ink-soft/60";
  const labelClass = "text-ink mb-1 block text-sm font-medium";

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
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Empresa o marca</span>
          <input
            type="text"
            required
            minLength={2}
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputClass}
          />
        </label>
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
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>¿Cuántas unidades? (aprox.)</span>
          <input
            type="number"
            min={1}
            placeholder="Ej: 50"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Presupuesto en pesos (opcional)</span>
          <input
            type="number"
            min={0}
            step={50000}
            placeholder="Ej: 2000000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>
      <label className="block">
        <span className={labelClass}>Cuéntanos qué necesitas</span>
        <textarea
          required
          minLength={10}
          maxLength={1500}
          rows={4}
          placeholder="La ocasión, el sentimiento que quieres transmitir, para cuándo lo necesitas…"
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
        className="bg-blue-deep hover:bg-blue w-full cursor-pointer rounded-full px-8 py-3.5 font-semibold text-white transition-colors disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Enviando…" : "Pedir mi cotización"}
      </button>
      <p className="text-ink-soft text-xs">
        Sin compromiso: te respondemos con propuesta y muestra de técnica.
      </p>
    </form>
  );
}
