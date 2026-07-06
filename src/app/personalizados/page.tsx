import type { Metadata } from "next";

import { WhatsAppIcon } from "@/components/icons";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Personalizados y detalles corporativos",
  description:
    "Detalles personalizados y regalos corporativos para tu equipo, clientes y proveedores. Diferentes técnicas de personalización, calidad a gran escala.",
};

// Landing completa (casos + formulario B2B) llega en F4.
export default function PersonalizadosPage() {
  return (
    <>
      <section className="bg-blue-soft">
        <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-start justify-center px-4 py-20">
          <p className="font-script text-blue-deep text-3xl sm:text-4xl">
            Personalizados
          </p>
          <p className="text-ink-soft mt-1 text-sm font-medium">
            by Con Sentidos
          </p>
          <h1 className="font-display text-ink mt-6 max-w-2xl text-4xl leading-tight font-medium sm:text-5xl">
            Detalles que impactan a tu equipo y a tus clientes
          </h1>
          <p className="text-ink mt-5 max-w-prose text-lg leading-relaxed">
            Regalos corporativos y personalizados con diferentes técnicas,
            cuidando cada detalle a gran escala. Elige la ocasión y nosotros nos
            encargamos del resto.
          </p>
          <a
            href={waLink(
              "¡Hola Con Sentidos! Quiero cotizar detalles personalizados para mi empresa 💙",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-deep hover:bg-blue mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-colors"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Cotizar para mi empresa
          </a>
          <p className="text-ink-soft mt-4 text-xs">
            Cuéntanos qué sentimiento quieres transmitir, cuántas unidades
            necesitas y para cuándo.
          </p>
        </div>
      </section>
      <div className="scallop text-blue-soft" aria-hidden />
    </>
  );
}
