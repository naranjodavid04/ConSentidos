import Link from "next/link";

import {
  HeartIcon,
  InstagramIcon,
  MapPinIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { site, waDefault } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-16">
      {/* Remate festoneado: el sitio termina "envuelto" */}
      <div className="scallop scallop-flip text-pink-soft" aria-hidden />

      <div className="bg-pink-soft">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3">
          <div>
            <p className="font-script text-pink text-3xl">
              Con <HeartIcon className="inline h-4 w-4" /> Sentidos
            </p>
            <p className="text-ink-soft mt-1 text-sm">{site.tagline}</p>
            <p className="text-ink mt-4 flex items-start gap-2 text-sm">
              <MapPinIcon className="text-pink mt-0.5 h-4 w-4 shrink-0" />
              {site.location}
            </p>
          </div>

          <div>
            <h2 className="font-display text-ink text-lg">
              Habla con nosotros
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={waDefault}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-pink flex items-center gap-2 transition-colors"
                >
                  <WhatsAppIcon className="text-pink h-4 w-4" />
                  {site.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-pink flex items-center gap-2 transition-colors"
                >
                  <InstagramIcon className="text-pink h-4 w-4" />@
                  {site.instagram}
                </a>
              </li>
              <li>
                <Link
                  href="/detalles"
                  className="text-ink hover:text-pink flex items-center gap-2 transition-colors"
                >
                  <HeartIcon className="text-pink h-4 w-4" />
                  Ver el catálogo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-ink text-lg">
              <TruckIcon className="text-pink mr-2 inline h-4 w-4" />
              Domicilios en el oriente antioqueño
            </h2>
            <p className="text-ink-soft mt-3 text-sm leading-relaxed">
              {site.coverage.join(" · ")}
            </p>
          </div>
        </div>

        <div className="border-pink/15 border-t">
          <p className="text-ink-soft mx-auto max-w-6xl px-4 py-4 text-center text-xs">
            © {new Date().getFullYear()} {site.name} — {site.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
