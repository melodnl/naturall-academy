import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function localizedNext(next: string, locale: "pt" | "es" | "en"): string {
  return next.replace(/^\/app\/(pt|es|en)(?=\/|$)/, `/app/${locale}`);
}

function asLocale(v: string | null | undefined): "pt" | "es" | "en" | null {
  return v === "pt" || v === "es" || v === "en" ? v : null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app/pt";

  // Atrás de proxy reverso o request.url pode vir com host interno (127.0.0.1).
  // NEXT_PUBLIC_SITE_URL fixa a base canônica em produção.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const origin = siteUrl
    ? siteUrl.replace(/\/+$/, "")
    : (() => {
        const host =
          request.headers.get("x-forwarded-host") ??
          request.headers.get("host") ??
          "localhost:3000";
        const proto =
          request.headers.get("x-forwarded-proto") ??
          (host.startsWith("localhost") ? "http" : "https");
        return `${proto}://${host}`;
      })();

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let target = next;
      if (user?.email) {
        const admin = createSupabaseAdminClient();
        const { data: sub } = await admin
          .from("subscribers")
          .select("preferred_locale")
          .eq("email", user.email.toLowerCase())
          .maybeSingle();
        const loc = asLocale(sub?.preferred_locale);
        if (loc) target = localizedNext(next, loc);
      }
      return NextResponse.redirect(`${origin}${target}`);
    }
  }

  return NextResponse.redirect(`${origin}/app/pt/login?error=auth`);
}
