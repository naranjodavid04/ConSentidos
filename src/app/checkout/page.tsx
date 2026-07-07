import type { Metadata } from "next";

import { getActiveZones } from "@/lib/data/catalog";
import { orFallback } from "@/lib/safe";

import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Completar pedido",
  robots: { index: false },
};

// Las tarifas por municipio se administran en la DB — refrescar cada 5 min.
export const revalidate = 300;

export default async function CheckoutPage() {
  const zones = await orFallback(getActiveZones(), []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="font-script text-pink text-2xl">Ya casi</p>
      <h1 className="font-display text-ink mt-1 text-3xl font-medium sm:text-4xl">
        Completar pedido
      </h1>
      <p className="text-ink-soft mt-2 max-w-prose">
        Cuéntanos para quién es y cuándo lo entregamos. El pago se coordina por
        WhatsApp al confirmar: transferencia o contraentrega.
      </p>
      <CheckoutForm zones={zones} />
    </div>
  );
}
