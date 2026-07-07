"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/cotizaciones", label: "Cotizaciones" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/zonas", label: "Zonas" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Secciones del panel"
      className="-mx-4 overflow-x-auto px-4"
    >
      <div className="flex gap-1">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 border-b-2 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? "border-pink text-pink"
                  : "text-ink-soft hover:text-pink border-transparent"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
