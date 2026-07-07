import Link from "next/link";

import { CartBadge } from "@/components/cart/cart-badge";
import { HeartIcon, WhatsAppIcon } from "@/components/icons";
import { site, waDefault } from "@/lib/site";

// Las 3 líneas de negocio, cada una con el color de su sub-marca.
const lines = [
  { href: "/detalles", label: "Detalles", dot: "bg-pink" },
  { href: "/eventos", label: "Eventos", dot: "bg-gold" },
  { href: "/personalizados", label: "Personalizados", dot: "bg-blue" },
] as const;

export function Header() {
  return (
    <header className="border-pink-soft bg-cream/95 sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-3 pb-2 sm:pb-3">
        <Link href="/" className="group flex items-baseline gap-1.5">
          <span className="font-script text-pink text-3xl leading-none sm:text-4xl">
            Con
          </span>
          <HeartIcon className="text-pink h-4 w-4 self-center transition-transform group-hover:scale-110" />
          <span className="font-script text-pink text-3xl leading-none sm:text-4xl">
            Sentidos
          </span>
        </Link>

        <nav aria-label="Líneas" className="hidden items-center gap-6 sm:flex">
          {lines.map((line) => (
            <Link
              key={line.href}
              href={line.href}
              className="text-ink hover:text-pink flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <span
                className={`h-2 w-2 rounded-full ${line.dot}`}
                aria-hidden
              />
              {line.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <a
            href={waDefault}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink hover:bg-pink-deep flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span className="hidden md:inline">{site.whatsappDisplay}</span>
            <span className="md:hidden">Escríbenos</span>
          </a>
          <CartBadge />
        </div>
      </div>

      {/* Nav móvil: segunda fila, sin JS */}
      <nav
        aria-label="Líneas"
        className="flex items-center justify-center gap-6 px-4 pb-2.5 sm:hidden"
      >
        {lines.map((line) => (
          <Link
            key={line.href}
            href={line.href}
            className="text-ink flex items-center gap-1.5 text-sm font-medium"
          >
            <span className={`h-2 w-2 rounded-full ${line.dot}`} aria-hidden />
            {line.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
