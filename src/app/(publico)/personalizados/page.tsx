import type { Metadata } from "next";
import Image from "next/image";

import { CorporateQuoteForm } from "./quote-form";

export const metadata: Metadata = {
  title: "Personalizados y detalles corporativos",
  description:
    "Detalles personalizados y regalos corporativos para tu equipo, clientes y proveedores. Diferentes técnicas de personalización, calidad a gran escala.",
};

const steps = [
  {
    title: "1. Cuéntanos el sentimiento",
    copy: "Qué quieres transmitir y a qué sector quieres impactar: tu equipo, tus clientes o tus proveedores.",
  },
  {
    title: "2. Te proponemos el detalle",
    copy: "Elegimos juntos la técnica de personalización y te mostramos la propuesta antes de producir.",
  },
  {
    title: "3. Producimos a escala",
    copy: "Calidad a gran escala cuidando cada detalle — el mismo cariño de un regalo, multiplicado.",
  },
];

export default function PersonalizadosPage() {
  return (
    <>
      <div className="bg-blue-soft">
        {/* Hero con la mascota real de la sub-marca */}
        <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-16 pb-12 sm:pt-20 lg:grid-cols-[1fr_18rem]">
          <div>
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
              Regalos corporativos y personalizados con diferentes técnicas.
              Elige la ocasión y nosotros nos encargamos del resto.
            </p>
            <a
              href="#cotizar"
              className="bg-blue-deep hover:bg-blue mt-8 inline-block rounded-full px-6 py-3 font-semibold text-white transition-colors"
            >
              Cotizar para mi empresa
            </a>
          </div>
          <div className="mx-auto hidden lg:block">
            <Image
              src="/brand/mascota-regalito.png"
              alt="Regalito, la mascota de Personalizados: una caja de regalo azul sonriente"
              width={288}
              height={252}
              priority
              className="rotate-2 rounded-3xl shadow-md"
            />
            <p className="font-script text-blue-deep mt-2 text-center text-xl">
              ¡Hola! Soy el regalito de Consentidos
            </p>
          </div>
        </section>

        {/* Cómo trabajamos */}
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-display text-ink text-2xl sm:text-3xl">
            Así funciona
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-(--radius-card) bg-white p-6"
              >
                <h3 className="font-display text-blue-deep text-lg">
                  {step.title}
                </h3>
                <p className="text-ink mt-2 text-sm leading-relaxed">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Formulario B2B */}
        <section
          id="cotizar"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 pb-20"
        >
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-ink text-2xl sm:text-3xl">
              Cotiza tu pedido corporativo
            </h2>
            <p className="text-ink-soft mt-2 text-sm">
              Detalles únicos para complementar tus obsequios, tus eventos de
              empresa o sorprender con un detalle exclusivo.
            </p>
            <div className="border-blue-soft mt-6 rounded-(--radius-card) border bg-white p-6">
              <CorporateQuoteForm />
            </div>
          </div>
        </section>
      </div>
      <div className="scallop text-blue-soft" aria-hidden />
    </>
  );
}
