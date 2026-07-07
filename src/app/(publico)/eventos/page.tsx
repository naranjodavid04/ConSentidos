import type { Metadata } from "next";
import Image from "next/image";

import { HeartIcon } from "@/components/icons";

import { EventQuoteForm } from "./quote-form";

export const metadata: Metadata = {
  title: "Eventos — Con Sentidos Event Planner",
  description:
    "Planeación, decoración y montaje de cumpleaños, aniversarios, picnics y fechas especiales en La Unión y el oriente antioqueño. Cotiza tu celebración.",
};

// Fotos reales de montajes publicadas en el Instagram de la marca.
const gallery = [
  { src: "/brand/montaje-picnic.jpg", alt: "Picnic decorado al aire libre" },
  { src: "/seed/picnic-romantico.jpg", alt: "Picnic romántico con rosas" },
  {
    src: "/seed/detalle-amor-eterno.jpg",
    alt: "Mesa decorada con rosas y globo de corazón",
  },
  {
    src: "/seed/arreglo-floral-con-globo.jpg",
    alt: "Arreglo floral con globo metalizado",
  },
];

const services = [
  {
    title: "Cumpleaños y aniversarios",
    copy: "Montamos la sorpresa completa: decoración, detalles y ese momento de abrir los ojos y no creerlo.",
  },
  {
    title: "Picnics sorpresa",
    copy: "Al aire libre o en casa: bandejas, flores, pétalos y todo listo para que tú solo llegues a disfrutar.",
  },
  {
    title: "Fechas especiales",
    copy: "Pedidas, bienvenidas, logros y celebraciones que merecen escenografía propia.",
  },
];

export default function EventosPage() {
  return (
    <>
      <div className="bg-night">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:pt-24">
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
            Decoramos y montamos celebraciones en el oriente antioqueño. Tú
            pones la ocasión, nosotros los detalles.
          </p>
          <a
            href="#cotizar"
            className="bg-gold text-night hover:bg-gold-soft mt-8 inline-block rounded-full px-6 py-3 font-semibold transition-colors"
          >
            Cotizar mi evento
          </a>
        </section>

        {/* Lo que montamos */}
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-display text-2xl text-white sm:text-3xl">
            Lo que montamos
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="border-gold/25 rounded-(--radius-card) border bg-white/5 p-6"
              >
                <HeartIcon className="text-gold h-5 w-5" />
                <h3 className="font-display text-gold-soft mt-3 text-lg">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {service.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Galería */}
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-display text-2xl text-white sm:text-3xl">
            Montajes reales
          </h2>
          <p className="text-gold-soft mt-2 text-sm">
            De nuestro Instagram{" "}
            <a
              href="https://www.instagram.com/con_sentidos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline underline-offset-4"
            >
              @con_sentidos
            </a>
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {gallery.map((photo, i) => (
              <Image
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                width={400}
                height={500}
                className={`border-gold/20 aspect-[4/5] w-full rounded-2xl border object-cover ${
                  i % 2 === 1 ? "sm:translate-y-4" : ""
                }`}
              />
            ))}
          </div>
        </section>

        {/* Formulario */}
        <section
          id="cotizar"
          className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 pb-20"
        >
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-2xl text-white sm:text-3xl">
              Cotiza tu celebración
            </h2>
            <p className="text-gold-soft mt-2 text-sm">
              Cuéntanos la fecha, el lugar y cuántas personas celebran — te
              respondemos con una propuesta.
            </p>
            <div className="mt-6">
              <EventQuoteForm />
            </div>
          </div>
        </section>
      </div>
      <div className="scallop text-night" aria-hidden />
    </>
  );
}
