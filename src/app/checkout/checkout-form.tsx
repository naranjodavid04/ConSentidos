"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { ArrowRightIcon, MapPinIcon, TruckIcon } from "@/components/icons";
import { useCart } from "@/lib/cart/cart-context";
import type { DeliveryZone } from "@/lib/data/catalog";
import { formatCOP } from "@/lib/format";

import { createOrder } from "./actions";

const CARD_MESSAGE_MAX = 300;

export function CheckoutForm({ zones }: { zones: DeliveryZone[] }) {
  const { items, hydrated, subtotalCop, clear } = useCart();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">(
    "pickup",
  );
  const [deliveryZoneId, setDeliveryZoneId] = useState("");
  const [address, setAddress] = useState("");
  const [desiredDate, setDesiredDate] = useState("");
  const [desiredTime, setDesiredTime] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Bogota",
  });
  const zone = zones.find((z) => z.id === deliveryZoneId);
  const feeCop = deliveryMethod === "delivery" ? (zone?.fee_cop ?? 0) : 0;
  const totalCop = subtotalCop + feeCop;

  if (hydrated && items.length === 0) {
    return (
      <div className="border-pink-soft mt-10 rounded-(--radius-card) border bg-white px-6 py-14 text-center">
        <p className="font-display text-ink text-xl">Tu carrito está vacío</p>
        <p className="text-ink-soft mx-auto mt-2 max-w-sm text-sm">
          Agrega un detalle del catálogo para completar tu pedido.
        </p>
        <Link
          href="/detalles"
          className="bg-pink hover:bg-pink-deep mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-colors"
        >
          Ver catálogo
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createOrder({
        customerName,
        phone,
        deliveryMethod,
        deliveryZoneId: deliveryZoneId || undefined,
        address: address || undefined,
        cardMessage: cardMessage || undefined,
        desiredDate,
        desiredTime,
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
      });
      if (result.ok) {
        try {
          window.sessionStorage.setItem(
            "cs-last-order",
            JSON.stringify(result.order),
          );
        } catch {
          // sin sessionStorage igual seguimos: la confirmación mostrará el fallback
        }
        clear();
        router.push("/confirmacion");
      } else {
        setError(result.error);
      }
    });
  }

  const inputClass =
    "border-pink-soft focus:border-pink w-full rounded-xl border bg-white px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-ink-soft/60";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]"
    >
      <div className="space-y-8">
        {/* Datos de contacto */}
        <fieldset>
          <legend className="font-display text-ink text-lg">Tus datos</legend>
          <div className="mt-3 space-y-3">
            <label className="block">
              <span className="text-ink mb-1 block text-sm font-medium">
                Nombre completo
              </span>
              <input
                type="text"
                required
                minLength={3}
                autoComplete="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-ink mb-1 block text-sm font-medium">
                Celular (WhatsApp)
              </span>
              <input
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="300 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>
        </fieldset>

        {/* Entrega */}
        <fieldset>
          <legend className="font-display text-ink text-lg">Entrega</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                deliveryMethod === "pickup"
                  ? "border-pink bg-pink-soft/40"
                  : "border-pink-soft bg-white"
              }`}
            >
              <input
                type="radio"
                name="delivery"
                checked={deliveryMethod === "pickup"}
                onChange={() => setDeliveryMethod("pickup")}
                className="accent-pink mt-1"
              />
              <span>
                <MapPinIcon className="text-pink mb-1 h-5 w-5" />
                <span className="text-ink block font-semibold">
                  Recoger en la tienda
                </span>
                <span className="text-ink-soft text-sm">
                  La Unión, Antioquia — sin costo
                </span>
              </span>
            </label>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                deliveryMethod === "delivery"
                  ? "border-pink bg-pink-soft/40"
                  : "border-pink-soft bg-white"
              }`}
            >
              <input
                type="radio"
                name="delivery"
                checked={deliveryMethod === "delivery"}
                onChange={() => setDeliveryMethod("delivery")}
                className="accent-pink mt-1"
              />
              <span>
                <TruckIcon className="text-pink mb-1 h-5 w-5" />
                <span className="text-ink block font-semibold">Domicilio</span>
                <span className="text-ink-soft text-sm">
                  Oriente antioqueño — tarifa por municipio
                </span>
              </span>
            </label>
          </div>

          {deliveryMethod === "delivery" && (
            <div className="mt-3 space-y-3">
              <label className="block">
                <span className="text-ink mb-1 block text-sm font-medium">
                  Municipio
                </span>
                <select
                  required
                  value={deliveryZoneId}
                  onChange={(e) => setDeliveryZoneId(e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Elige tu municipio
                  </option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.municipality} — {formatCOP(z.fee_cop)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-ink mb-1 block text-sm font-medium">
                  Dirección de entrega
                </span>
                <input
                  type="text"
                  required
                  minLength={5}
                  autoComplete="street-address"
                  placeholder="Calle, número, barrio, referencias"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputClass}
                />
              </label>
            </div>
          )}
        </fieldset>

        {/* Fecha y tarjeta */}
        <fieldset>
          <legend className="font-display text-ink text-lg">
            El momento especial
          </legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-ink mb-1 block text-sm font-medium">
                Fecha de entrega
              </span>
              <input
                type="date"
                required
                min={today}
                value={desiredDate}
                onChange={(e) => setDesiredDate(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-ink mb-1 block text-sm font-medium">
                Hora (opcional)
              </span>
              <input
                type="time"
                value={desiredTime}
                onChange={(e) => setDesiredTime(e.target.value)}
                className={inputClass}
              />
              <span className="text-ink-soft mt-1 block text-xs">
                Si no la eliges, la coordinamos por WhatsApp.
              </span>
            </label>
          </div>
          <label className="mt-3 block">
            <span className="text-ink mb-1 block text-sm font-medium">
              Mensaje de la tarjeta (opcional)
            </span>
            <textarea
              rows={3}
              maxLength={CARD_MESSAGE_MAX}
              placeholder="Lo escribimos a mano y va con el detalle"
              value={cardMessage}
              onChange={(e) => setCardMessage(e.target.value)}
              className={inputClass}
            />
            <span className="text-ink-soft mt-1 block text-right text-xs">
              {cardMessage.length}/{CARD_MESSAGE_MAX}
            </span>
          </label>
        </fieldset>
      </div>

      {/* Resumen */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="border-pink-soft rounded-(--radius-card) border bg-white p-5">
          <h2 className="font-display text-ink text-lg">Tu pedido</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3">
                <span className="text-ink">
                  {item.qty}× {item.name}
                </span>
                <span className="text-ink-soft shrink-0">
                  {formatCOP(item.priceCop * item.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-pink-soft mt-4 space-y-1 border-t pt-3 text-sm">
            <p className="flex justify-between">
              <span className="text-ink-soft">Subtotal</span>
              <span className="text-ink">{formatCOP(subtotalCop)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-ink-soft">Domicilio</span>
              <span className="text-ink">
                {deliveryMethod === "pickup"
                  ? "Gratis (recoges)"
                  : zone
                    ? formatCOP(feeCop)
                    : "según municipio"}
              </span>
            </p>
          </div>
          <p className="mt-4 flex items-center justify-between">
            <span className="text-ink font-semibold">Total</span>
            <span className="gift-tag font-display text-pink-deep text-xl font-semibold">
              {formatCOP(totalCop)}
            </span>
          </p>

          {error && (
            <p
              role="alert"
              aria-live="assertive"
              className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || !hydrated}
            className="bg-pink hover:bg-pink-deep mt-5 w-full cursor-pointer rounded-full px-6 py-3.5 font-semibold text-white transition-colors disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "Enviando tu pedido…" : "Hacer el pedido"}
          </button>
          <p className="text-ink-soft mt-3 text-center text-xs">
            Al confirmar te llevamos a WhatsApp para coordinar el pago:
            transferencia o contraentrega.
          </p>
        </div>
      </aside>
    </form>
  );
}
