"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";

import { TrashIcon } from "@/components/icons";
import { PRODUCT_STATUS } from "@/lib/admin/labels";
import { resizeImage } from "@/lib/admin/resize-image";
import type { Occasion, ProductType } from "@/lib/data/catalog";
import { resolveImageUrl } from "@/lib/images";
import type { ProductStatus } from "@/lib/supabase/enums";

import {
  createProduct,
  deleteProductImage,
  updateProduct,
  type ProductActionResult,
} from "./actions";

export interface ProductFormData {
  id: string;
  name: string;
  description: string | null;
  price_cop: number;
  type_id: string;
  status: ProductStatus;
  featured: boolean;
  occasionIds: string[];
  images: { id: string; storage_path: string }[];
}

interface Props {
  types: ProductType[];
  occasions: Occasion[];
  product?: ProductFormData;
}

interface NewPhoto {
  file: File;
  preview: string;
}

export function ProductForm({ types, occasions, product }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [newPhotos, setNewPhotos] = useState<NewPhoto[]>([]);
  const [processingPhotos, setProcessingPhotos] = useState(false);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setProcessingPhotos(true);
    try {
      const resized = await Promise.all(files.map(resizeImage));
      setNewPhotos((prev) => [
        ...prev,
        ...resized.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        })),
      ]);
    } catch {
      setError("No pudimos procesar una de las fotos. Intenta con otra.");
    } finally {
      setProcessingPhotos(false);
    }
  }

  function removeNewPhoto(preview: string) {
    setNewPhotos((prev) => {
      URL.revokeObjectURL(preview);
      return prev.filter((p) => p.preview !== preview);
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.delete("photoInput");
    for (const photo of newPhotos) {
      formData.append("photos", photo.file);
    }
    startTransition(async () => {
      const result: ProductActionResult = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);
      // Si todo sale bien, la acción redirige y no llegamos acá.
      if (result?.error) setError(result.error);
    });
  }

  const inputClass =
    "border-pink-soft focus:border-pink text-ink w-full rounded-xl border bg-white px-4 py-3 text-base outline-none transition-colors";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mt-6 max-w-2xl space-y-6"
    >
      <label className="block">
        <span className="text-ink mb-1 block text-sm font-medium">
          Nombre del detalle
        </span>
        <input
          name="name"
          type="text"
          required
          minLength={3}
          defaultValue={product?.name}
          placeholder="Ej: Ancheta Sorpresa Cumpleaños"
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="text-ink mb-1 block text-sm font-medium">
          Descripción (lo que ve el cliente)
        </span>
        <textarea
          name="description"
          rows={4}
          maxLength={1000}
          defaultValue={product?.description ?? ""}
          placeholder="Qué trae, de qué tamaño es, qué lo hace especial…"
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-ink mb-1 block text-sm font-medium">
            Precio (pesos)
          </span>
          <input
            name="price"
            type="number"
            required
            min={1000}
            step={500}
            defaultValue={product?.price_cop}
            placeholder="85000"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-ink mb-1 block text-sm font-medium">
            Tipo de detalle
          </span>
          <select
            name="typeId"
            required
            defaultValue={product?.type_id ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Elige el tipo
            </option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset>
        <legend className="text-ink text-sm font-medium">
          ¿Para qué ocasiones sirve?
        </legend>
        <p className="text-ink-soft mt-0.5 text-xs">
          Marca todas las que apliquen — así aparece en los filtros del
          catálogo.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {occasions.map((occasion) => (
            <label
              key={occasion.id}
              className="border-pink-soft has-checked:border-pink has-checked:bg-pink-soft/50 flex cursor-pointer items-center gap-1.5 rounded-full border bg-white px-3.5 py-2 text-sm transition-colors"
            >
              <input
                type="checkbox"
                name="occasionIds"
                value={occasion.id}
                defaultChecked={product?.occasionIds.includes(occasion.id)}
                className="accent-pink"
              />
              {occasion.emoji && <span aria-hidden>{occasion.emoji}</span>}
              {occasion.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-ink mb-1 block text-sm font-medium">
            ¿Cómo se muestra?
          </span>
          <select
            name="status"
            defaultValue={product?.status ?? "active"}
            className={inputClass}
          >
            {(Object.keys(PRODUCT_STATUS) as ProductStatus[]).map((status) => (
              <option key={status} value={status}>
                {PRODUCT_STATUS[status].label} — {PRODUCT_STATUS[status].help}
              </option>
            ))}
          </select>
        </label>
        <label className="border-pink-soft has-checked:border-pink has-checked:bg-pink-soft/50 flex cursor-pointer items-center gap-3 self-end rounded-xl border bg-white px-4 py-3 transition-colors">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured}
            className="accent-pink h-4 w-4"
          />
          <span className="text-ink text-sm">
            <span className="font-medium">Destacado</span> — aparece en la
            portada del sitio
          </span>
        </label>
      </div>

      {/* Fotos */}
      <fieldset>
        <legend className="text-ink text-sm font-medium">Fotos</legend>
        <p className="text-ink-soft mt-0.5 text-xs">
          La primera foto es la portada. Se ajustan solas al tamaño ideal.
        </p>

        {(product?.images.length ?? 0) > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {product!.images.map((image, i) => (
              <div key={image.id} className="relative">
                <Image
                  src={resolveImageUrl(image.storage_path)}
                  alt={`Foto ${i + 1}`}
                  width={96}
                  height={120}
                  className="border-pink-soft aspect-[4/5] rounded-xl border object-cover"
                />
                {i === 0 && (
                  <span className="bg-pink absolute bottom-1 left-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white">
                    Portada
                  </span>
                )}
                <button
                  type="button"
                  aria-label={`Quitar foto ${i + 1}`}
                  onClick={() => {
                    if (window.confirm("¿Quitar esta foto del producto?")) {
                      startTransition(() =>
                        deleteProductImage(product!.id, image.id),
                      );
                    }
                  }}
                  className="absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {newPhotos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {newPhotos.map((photo, i) => (
              <div key={photo.preview} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.preview}
                  alt={`Foto nueva ${i + 1}`}
                  className="border-pink aspect-[4/5] w-24 rounded-xl border-2 border-dashed object-cover"
                />
                <button
                  type="button"
                  aria-label={`Quitar foto nueva ${i + 1}`}
                  onClick={() => removeNewPhoto(photo.preview)}
                  className="absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="border-pink-soft hover:border-pink text-ink-soft mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-white px-4 py-6 text-sm transition-colors">
          <input
            type="file"
            name="photoInput"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handlePhotoChange}
            className="sr-only"
          />
          {processingPhotos
            ? "Preparando fotos…"
            : "📷 Toca aquí para agregar fotos"}
        </label>
      </fieldset>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending || processingPhotos}
          className="bg-pink hover:bg-pink-deep cursor-pointer rounded-full px-8 py-3 font-semibold text-white transition-colors disabled:cursor-wait disabled:opacity-60"
        >
          {pending
            ? "Guardando…"
            : product
              ? "Guardar cambios"
              : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
