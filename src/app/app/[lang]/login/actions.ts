"use server";

import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type LoginState =
  | { ok: true; message: string }
  | { ok: false; code: "not_subscriber" | "invalid_email" | "send_failed"; message: string }
  | null;

export async function sendMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const lang = String(formData.get("lang") ?? "pt");
  const next = String(formData.get("next") ?? `/app/${lang}`);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, code: "invalid_email", message: "E-mail inválido." };
  }

  // Verifica se o email já é assinante (foi criado pelo webhook).
  // Usa admin client porque a RLS de subscribers exige auth.uid() = user_id,
  // mas no login o usuário ainda não está autenticado.
  const admin = createSupabaseAdminClient();
  const { data: subscriber } = await admin
    .from("subscribers")
    .select("status,email")
    .eq("email", email)
    .maybeSingle();

  const supabase = await createSupabaseServerClient();

  if (!subscriber) {
    return {
      ok: false,
      code: "not_subscriber",
      message: "E-mail não encontrado. Compre o acesso para entrar.",
    };
  }

  const host = (await headers()).get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const redirectTo = `${protocol}://${host}/auth/callback?next=${encodeURIComponent(next)}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
  });

  if (error) {
    return {
      ok: false,
      code: "send_failed",
      message: "Não foi possível enviar o link. Tente novamente.",
    };
  }

  return { ok: true, message: "Link enviado! Confira sua caixa de entrada." };
}
