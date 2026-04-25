import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/app/pt/login?error=auth`);
}
