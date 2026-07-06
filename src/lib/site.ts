// Datos del negocio usados en todo el sitio.

export const site = {
  name: "Con Sentidos",
  tagline: "Regalitos desde el corazón",
  description:
    "Detalles, anchetas, desayunos sorpresa y regalos personalizados en La Unión, Antioquia. Domicilios en todo el oriente antioqueño.",
  whatsappNumber: "573126610058",
  whatsappDisplay: "312 661 0058",
  instagram: "con_sentidos",
  instagramUrl: "https://www.instagram.com/con_sentidos",
  location: "La Unión, Antioquia",
  coverage: [
    "La Unión",
    "La Ceja",
    "El Retiro",
    "El Carmen de Viboral",
    "Rionegro",
    "Marinilla",
  ],
} as const;

// Link de WhatsApp con mensaje pre-armado.
export function waLink(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const waDefault = waLink(
  "¡Hola Con Sentidos! Quiero hacer sentir a alguien especial 💝",
);
