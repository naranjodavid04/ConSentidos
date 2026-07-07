"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icons";
import { useCart } from "@/lib/cart/cart-context";
import { formatCOP } from "@/lib/format";
import { resolveImageUrl } from "@/lib/images";

export default function CartPage() {
  const { items, hydrated, subtotalCop, setQty, remove } = useCart();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="font-script text-pink text-2xl">Tu carrito</p>
      <h1 className="font-display text-ink mt-1 text-3xl font-medium sm:text-4xl">
        Detalles por regalar
      </h1>

      {!hydrated ? null : items.length === 0 ? (
        <div className="border-pink-soft mt-10 rounded-(--radius-card) border bg-white px-6 py-14 text-center">
          <p className="font-display text-ink text-xl">Tu carrito está vacío</p>
          <p className="text-ink-soft mx-auto mt-2 max-w-sm text-sm">
            Alguien especial está esperando un detalle tuyo. El catálogo está
            lleno de ideas.
          </p>
          <Link
            href="/detalles"
            className="bg-pink hover:bg-pink-deep mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-colors"
          >
            Ver catálogo
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-8 space-y-4">
            {items.map((item) => (
              <li
                key={item.productId}
                className="border-pink-soft flex gap-4 rounded-(--radius-card) border bg-white p-4"
              >
                <Link
                  href={`/detalles/${item.slug}`}
                  className="relative block h-24 w-20 shrink-0 overflow-hidden rounded-xl"
                >
                  {item.imagePath ? (
                    <Image
                      src={resolveImageUrl(item.imagePath)}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="bg-pink-soft/40 text-ink-soft flex h-full items-center justify-center text-xs">
                      Sin foto
                    </span>
                  )}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/detalles/${item.slug}`}
                      className="font-display text-ink hover:text-pink leading-snug"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      aria-label={`Quitar ${item.name}`}
                      className="text-ink-soft hover:text-pink -m-2 cursor-pointer p-2 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-ink-soft mt-0.5 text-sm">
                    {formatCOP(item.priceCop)} c/u
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                    <div className="border-pink-soft flex items-center rounded-full border">
                      <button
                        type="button"
                        onClick={() => setQty(item.productId, item.qty - 1)}
                        aria-label="Restar uno"
                        className="text-ink hover:text-pink flex h-9 w-9 cursor-pointer items-center justify-center"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span
                        aria-live="polite"
                        className="text-ink min-w-6 text-center text-sm font-semibold"
                      >
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(item.productId, item.qty + 1)}
                        aria-label="Sumar uno"
                        className="text-ink hover:text-pink flex h-9 w-9 cursor-pointer items-center justify-center"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-ink font-semibold">
                      {formatCOP(item.priceCop * item.qty)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-pink-soft mt-6 rounded-(--radius-card) border bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-ink">Subtotal</span>
              <span className="gift-tag font-display text-pink-deep text-xl font-semibold">
                {formatCOP(subtotalCop)}
              </span>
            </div>
            <p className="text-ink-soft mt-3 text-sm">
              El domicilio se calcula en el siguiente paso según tu municipio.
              Recoger en La Unión no tiene costo.
            </p>
            <Link
              href="/checkout"
              className="bg-pink hover:bg-pink-deep mt-5 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-semibold text-white transition-colors"
            >
              Completar pedido
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/detalles"
              className="text-ink-soft hover:text-pink mt-3 block text-center text-sm"
            >
              Seguir mirando el catálogo
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
