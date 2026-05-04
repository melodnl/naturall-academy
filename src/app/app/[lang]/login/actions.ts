"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type LoginState =
  | { ok: true; message: string }
  | {
      ok: false;
      code:
        | "not_subscriber"
        | "invalid_email"
        | "send_failed"
        | "invalid_credentials"
        | "no_password_set";
      message: string;
    }
  | null;

async function getBaseUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) return siteUrl.replace(/\/+$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function ensureSubscriber(email: string) {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("subscribers")
    .select("status,email")
    .eq("email", email)
    .maybeSingle();
  return data;
}

export async function signInAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const lang = String(formData.get("lang") ?? "pt");
  const next = String(formData.get("next") ?? `/app/${lang}`);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, code: "invalid_email", message: "E-mail inválido." };
  }

  const subscriber = await ensureSubscriber(email);
  if (!subscriber) {
    return {
      ok: false,
      code: "not_subscriber",
      message: "E-mail não encontrado. Compre o acesso para entrar.",
    };
  }

  const supabase = await createSupabaseServerClient();

  // Caminho 1: usuário enviou senha → tenta login direto
  if (password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return {
        ok: false,
        code: "invalid_credentials",
        message: "E-mail ou senha incorretos.",
      };
    }
    redirect(next);
  }

  // Caminho 2: senha vazia → magic link
  const baseUrl = await getBaseUrl();
  const redirectTo = `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`;

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

// Compat: nome antigo ainda exportado caso algo importe
export const sendMagicLink = signInAction;

export async function signInWithGoogleAction(formData: FormData) {
  const lang = String(formData.get("lang") ?? "pt");
  const next = String(formData.get("next") ?? `/app/${lang}`);

  const supabase = await createSupabaseServerClient();
  const baseUrl = await getBaseUrl();
  const redirectTo = `${baseUrl}/auth/callback?next=${encodeURIComponent(next)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error || !data?.url) {
    redirect(`/app/${lang}/login?error=oauth`);
  }

  redirect(data.url);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/app/pt/login");
}
