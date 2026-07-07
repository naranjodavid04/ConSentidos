import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { waDefault } from "@/lib/site";

// El 404 vive fuera del grupo (publico), así que trae su propio chrome.
export default function NotFound() {
  return (
    <>
      <Header />
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
        <p className="font-script text-pink text-3xl">Ay no...</p>
        <h1 className="font-display text-ink mt-3 text-3xl font-medium sm:text-4xl">
          No encontramos esta página
        </h1>
        <p className="text-ink-soft mt-3 max-w-md">
          Puede que el detalle ya no esté disponible o que el link haya
          cambiado. El catálogo completo te espera.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/detalles"
            className="bg-pink hover:bg-pink-deep rounded-full px-6 py-3 font-semibold text-white transition-colors"
          >
            Ver catálogo
          </Link>
          <a
            href={waDefault}
            target="_blank"
            rel="noopener noreferrer"
            className="border-pink text-pink hover:bg-pink-soft inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 font-semibold transition-colors"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Escríbenos
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}
