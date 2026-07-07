"use server";

import { revalidatePath } from "next/cache";

import type { OrderStatus, PaymentStatus } from "@/lib/supabase/enums";
import { createServerSupabase } from "@/lib/supabase/server";

const ORDER_STATUSES: OrderStatus[] = [
  "received",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "cod"];

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  if (!ORDER_STATUSES.includes(status)) throw new Error("Estado inválido");
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  if (error) throw error;
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin");
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
): Promise<void> {
  if (!PAYMENT_STATUSES.includes(paymentStatus))
    throw new Error("Estado de pago inválido");
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus })
    .eq("id", orderId);
  if (error) throw error;
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${orderId}`);
}
