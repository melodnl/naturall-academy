"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PasswordState =
  | { ok: true; message: string }
  | {
      ok: false;
      code: "too_short" | "mismatch" | "not_authenticated" | "update_failed";
      message: string;
    }
  | null;

export async function updatePasswordAction(
  _prev: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) {
    return {
      ok: false,
      code: "too_short",
      message: "A senha precisa ter ao menos 8 caracteres.",
    };
  }

  if (password !== confirm) {
    return {
      ok: false,
      code: "mismatch",
      message: "As senhas não coincidem.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) {
    return {
      ok: false,
      code: "not_authenticated",
      message: "Sessão expirada. Faça login novamente.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return {
      ok: false,
      code: "update_failed",
      message: "Não foi possível atualizar a senha.",
    };
  }

  return { ok: true, message: "Senha atualizada com sucesso!" };
}

export async function signOutFromAccountAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/app/en/login");
}
