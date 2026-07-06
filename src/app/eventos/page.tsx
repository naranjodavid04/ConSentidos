import type { Metadata } from "next";

import { WhatsAppIcon } from "@/components/icons";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Eventos — Con Sentidos Event Planner",
  description:
    "Planeación, decoración y montaje de celebraciones en La Unión y el oriente antioqueño. Cotiza tu fecha con Con Sentidos Event Planner.",
};

// Landing completa (galería + formulario de cotización) llega en F4.
export default function EventosPage() {
  return (
    <>
      <section className="bg-night">
        <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-start justify-center px-4 py-20">
          <p className="font-script text-gold text-3xl sm:text-4xl">
            Con Sentidos
          </p>
          <p className="text-gold-soft mt-1 text-sm font-semibold tracking-[0.3em] uppercase">
            Event Planner
          </p>
          <h1 className="font-display mt-6 max-w-2xl text-4xl leading-tight font-medium text-white sm:text-5xl">
            Tu celebración, montada con sentido
          </h1>
          <p className="text-gold-soft mt-5 max-w-prose text-lg leading-relaxed">
            Decoramos y montamos cumpleaños, aniversarios, picnics y fechas
            especiales en el oriente antioqueño. Tú pones la ocasión, nosotros
            los detalles.
          </p>
          <a
            href={waLink(
              "¡Hola Con Sentidos! Quiero cotizar la decoración de un evento 🎉",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold text-night hover:bg-gold-soft mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Cotizar mi evento
          </a>
          <p className="text-gold-soft/80 mt-4 text-xs">
            Cuéntanos la fecha, el lugar y cuántas personas celebran — te
            respondemos con una propuesta.
          </p>
        </div>
      </section>
      <div className="scallop text-night" aria-hidden />
    </>
  );
}
