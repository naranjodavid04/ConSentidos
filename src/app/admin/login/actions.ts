"use server";

import { redirect } from "next/navigation";

import { createServerSupabase } from "@/lib/supabase/server";

export interface SignInResult {
  error: string;
}

export async function signIn(
  email: string,
  password: string,
): Promise<SignInResult> {
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return {
      error:
        "Correo o contraseña incorrectos. Si no recuerdas la contraseña, escríbenos.",
    };
  }
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
