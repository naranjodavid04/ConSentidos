"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { BagIcon, CheckIcon } from "@/components/icons";
import { useCart } from "@/lib/cart/cart-context";

interface Props {
  product: {
    id: string;
    slug: string;
    name: string;
    priceCop: number;
    imagePath: string | null;
  };
}

export function AddToCartButton({ product }: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceCop: product.priceCop,
      imagePath: product.imagePath,
    });
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 4000);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleAdd}
        className="bg-pink hover:bg-pink-deep inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-sm transition-colors"
      >
        {added ? (
          <>
            <CheckIcon className="h-5 w-5" />
            Agregado
          </>
        ) : (
          <>
            <BagIcon className="h-5 w-5" />
            Agregar al carrito
          </>
        )}
      </button>
      {added && (
        <Link
          href="/carrito"
          className="text-pink hover:text-pink-deep font-semibold underline underline-offset-4"
        >
          Ver carrito
        </Link>
      )}
    </div>
  );
}
