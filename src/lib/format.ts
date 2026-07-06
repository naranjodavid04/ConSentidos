// Formato de precios en pesos colombianos: 85000 → "$85.000"
export function formatCOP(value: number): string {
  return `$${new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}
