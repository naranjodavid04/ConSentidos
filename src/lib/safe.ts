// Si una consulta a Supabase falla (DB caída, red), las páginas públicas
// degradan con gracia en vez de tumbar el render.
export async function orFallback<T>(
  promise: Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}
