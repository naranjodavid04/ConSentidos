"use client";

import { useState, useTransition } from "react";

import { formatCOP } from "@/lib/format";

import { createZone, toggleZone, updateZoneFee } from "./actions";

export interface Zone {
  id: string;
  municipality: string;
  fee_cop: number;
  active: boolean;
}

export function ZonesManager({ zones }: { zones: Zone[] }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleFeeSubmit(zoneId: string) {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      setError(null);
      startTransition(async () => {
        const result = await updateZoneFee(zoneId, formData);
        if (result?.error) setError(result.error);
      });
    };
  }

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setError(null);
    startTransition(async () => {
      const result = await createZone(formData);
      if (result?.error) setError(result.error);
      else form.reset();
    });
  }

  const inputClass =
    "border-pink-soft focus:border-pink text-ink rounded-xl border bg-white px-3 py-2 text-sm outline-none transition-colors";

  return (
    <div className="mt-6 max-w-2xl">
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <ul className="space-y-2">
        {zones.map((zone) => (
          <li
            key={zone.id}
            className={`border-pink-soft flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 ${
              zone.active ? "bg-white" : "bg-neutral-50 opacity-70"
            }`}
          >
            <p className="text-ink min-w-32 font-medium">
              {zone.municipality}
              {!zone.active && (
                <span className="text-ink-soft block text-xs font-normal">
                  sin domicilio por ahora
                </span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <form
                onSubmit={handleFeeSubmit(zone.id)}
                className="flex items-center gap-2"
              >
                <label className="text-ink-soft text-sm">
                  Tarifa{" "}
                  <input
                    name="fee"
                    type="number"
                    min={0}
                    step={500}
                    defaultValue={zone.fee_cop}
                    className={`${inputClass} w-28`}
                    aria-label={`Tarifa para ${zone.municipality}`}
                  />
                </label>
                <button
                  type="submit"
                  disabled={pending}
                  className="border-pink-soft text-ink hover:border-pink cursor-pointer rounded-full border bg-white px-3 py-1.5 text-sm font-medium disabled:opacity-60"
                >
                  Guardar
                </button>
              </form>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(() => toggleZone(zone.id, !zone.active))
                }
                className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
                  zone.active
                    ? "text-ink-soft hover:text-red-600"
                    : "bg-pink text-white"
                }`}
              >
                {zone.active ? "Pausar" : "Activar"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <form
        onSubmit={handleCreate}
        className="border-pink-soft mt-6 flex flex-wrap items-end gap-3 rounded-(--radius-card) border bg-white p-4"
      >
        <label className="block flex-1">
          <span className="text-ink mb-1 block text-sm font-medium">
            Nuevo municipio
          </span>
          <input
            name="municipality"
            type="text"
            required
            minLength={3}
            placeholder="Ej: Guarne"
            className={`${inputClass} w-full`}
          />
        </label>
        <label className="block">
          <span className="text-ink mb-1 block text-sm font-medium">
            Tarifa
          </span>
          <input
            name="fee"
            type="number"
            required
            min={0}
            step={500}
            placeholder="15000"
            className={`${inputClass} w-28`}
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="bg-pink hover:bg-pink-deep cursor-pointer rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60"
        >
          Agregar
        </button>
      </form>

      <p className="text-ink-soft mt-3 text-xs">
        Tarifa actual de referencia:{" "}
        {zones
          .map((z) => `${z.municipality} ${formatCOP(z.fee_cop)}`)
          .join(" · ")}
      </p>
    </div>
  );
}
