"use client";

import { useState, useTransition } from "react";

import { HeartIcon } from "@/components/icons";

import { signIn } from "./actions";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signIn(email, password);
      // Si el login funciona, signIn redirige y nunca llegamos acá.
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="border-pink-soft w-full max-w-sm rounded-(--radius-card) border bg-white p-8">
        <p className="font-script text-pink text-center text-3xl">
          Con <HeartIcon className="inline h-4 w-4" /> Sentidos
        </p>
        <h1 className="font-display text-ink mt-2 text-center text-xl">
          Panel de la tienda
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-ink mb-1 block text-sm font-medium">
              Correo
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-pink-soft focus:border-pink text-ink w-full rounded-xl border bg-white px-4 py-3 text-base transition-colors outline-none"
            />
          </label>
          <label className="block">
            <span className="text-ink mb-1 block text-sm font-medium">
              Contraseña
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-pink-soft focus:border-pink text-ink w-full rounded-xl border bg-white px-4 py-3 text-base transition-colors outline-none"
            />
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
            className="bg-pink hover:bg-pink-deep w-full cursor-pointer rounded-full px-6 py-3 font-semibold text-white transition-colors disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>
        <p className="text-ink-soft mt-4 text-center text-xs">
          Solo para el equipo de Con Sentidos.
        </p>
      </div>
    </div>
  );
}
