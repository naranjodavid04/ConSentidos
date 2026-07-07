"use client";

import { useState, useTransition } from "react";

import { createBanner, updateBanner, type BannerActionResult } from "./actions";

export interface BannerFormData {
  id: string;
  title: string;
  subtitle: string | null;
  link: string | null;
  startsAt: string; // YYYY-MM-DD
  endsAt: string;
  active: boolean;
}

export function BannerForm({ banner }: { banner?: BannerFormData }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result: BannerActionResult = banner
        ? await updateBanner(banner.id, formData)
        : await createBanner(formData);
      if (result?.error) setError(result.error);
    });
  }

  const inputClass =
    "border-pink-soft focus:border-pink text-ink w-full rounded-xl border bg-white px-4 py-3 text-base outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4">
      <label className="block">
        <span className="text-ink mb-1 block text-sm font-medium">
          Título (lo grande)
        </span>
        <input
          name="title"
          type="text"
          required
          minLength={3}
          defaultValue={banner?.title}
          placeholder="Ej: Se acerca Amor y Amistad 💘"
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="text-ink mb-1 block text-sm font-medium">
          Texto pequeño (opcional)
        </span>
        <input
          name="subtitle"
          type="text"
          maxLength={160}
          defaultValue={banner?.subtitle ?? ""}
          placeholder="Ej: Pide con tiempo y sorprende a esa persona especial"
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="text-ink mb-1 block text-sm font-medium">
          ¿A dónde lleva al tocarlo?
        </span>
        <select
          name="link"
          defaultValue={banner?.link ?? "/detalles"}
          className={inputClass}
        >
          <option value="/detalles">Al catálogo de detalles</option>
          <option value="/eventos">A la página de Eventos</option>
          <option value="/personalizados">A la página de Personalizados</option>
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-ink mb-1 block text-sm font-medium">
            Se muestra desde
          </span>
          <input
            name="startsAt"
            type="date"
            required
            defaultValue={banner?.startsAt}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-ink mb-1 block text-sm font-medium">Hasta</span>
          <input
            name="endsAt"
            type="date"
            required
            defaultValue={banner?.endsAt}
            className={inputClass}
          />
        </label>
      </div>
      <label className="border-pink-soft has-checked:border-pink has-checked:bg-pink-soft/50 flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-colors">
        <input
          type="checkbox"
          name="active"
          defaultChecked={banner?.active ?? true}
          className="accent-pink h-4 w-4"
        />
        <span className="text-ink text-sm">
          <span className="font-medium">Activo</span> — dentro de las fechas, se
          muestra solo en la portada
        </span>
      </label>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-pink hover:bg-pink-deep cursor-pointer rounded-full px-8 py-3 font-semibold text-white transition-colors disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Guardando…" : banner ? "Guardar cambios" : "Crear banner"}
      </button>
    </form>
  );
}
