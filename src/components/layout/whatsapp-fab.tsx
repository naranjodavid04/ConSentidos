import { WhatsAppIcon } from "@/components/icons";
import { waDefault } from "@/lib/site";

// Botón flotante de WhatsApp — presente en todas las páginas.
export function WhatsAppFab() {
  return (
    <a
      href={waDefault}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
