// Resuelve la ruta guardada en product_images.storage_path a una URL usable:
// - "/seed/..." → archivo local en /public (seeds de ejemplo)
// - "http..."   → URL absoluta
// - otro        → objeto en el bucket "media" de Supabase Storage
// Módulo sin dependencias: se usa también en client components (carrito).
export function resolveImageUrl(storagePath: string): string {
  if (storagePath.startsWith("/") || storagePath.startsWith("http")) {
    return storagePath;
  }
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${storagePath}`;
}
