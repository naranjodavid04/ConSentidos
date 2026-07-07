// Alias de los enums de la DB. Viven aparte de database.types.ts porque
// ese archivo se regenera con `npm run db:types` y pisaría cualquier edición.
import type { Database } from "./database.types";

type Enums = Database["public"]["Enums"];

export type ProductStatus = Enums["product_status"];
export type OrderStatus = Enums["order_status"];
export type PaymentStatus = Enums["payment_status"];
export type DeliveryMethod = Enums["delivery_method"];
export type QuoteLine = Enums["quote_line"];
export type QuoteStatus = Enums["quote_status"];
