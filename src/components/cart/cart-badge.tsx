"use client";

import Link from "next/link";

import { BagIcon } from "@/components/icons";
import { useCart } from "@/lib/cart/cart-context";

// Icono del carrito en el header con contador de items.
export function CartBadge() {
  const { count, hydrated } = useCart();

  return (
    <Link
      href="/carrito"
      aria-label={
        hydrated && count > 0 ? `Carrito, ${count} detalles` : "Carrito"
      }
      className="text-ink hover:text-pink relative inline-flex h-10 w-10 items-center justify-center transition-colors"
    >
      <BagIcon className="h-6 w-6" />
      {hydrated && count > 0 && (
        <span className="bg-pink absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
