import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPPORTED_LOCALES = ["pt", "es", "en"] as const;
// EN-only enquanto traduções PT/ES não estão prontas. As pages individuais
// redirecionam pt|es → en. O default aqui já manda direto pra EN pra evitar
// um redirect extra.
const DEFAULT_LOCALE = "en";

function detectLocale(request: NextRequest): string {
  const cookie = request.cookies.get("locale")?.value;
  if (cookie && (SUPPORTED_LOCALES as readonly string[]).includes(cookie)) {
    return cookie;
  }
  const accept = request.headers.get("accept-language") ?? "";
  const preferred = accept
    .split(",")
    .map((p) => p.split(";")[0].trim().toLowerCase());
  for (const lang of preferred) {
    const short = lang.split("-")[0];
    if ((SUPPORTED_LOCALES as readonly string[]).includes(short)) return short;
  }
  return DEFAULT_LOCALE;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/app" || pathname === "/app/") {
    const locale = detectLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/app/${locale}`;
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAppPath = /^\/app\/(pt|es|en)(\/.*)?$/.test(pathname);
  const isLoginPath = /^\/app\/(pt|es|en)\/login(\/.*)?$/.test(pathname);
  const devBypass = process.env.DEV_BYPASS_AUTH === "1";

  if (isAppPath && !isLoginPath && !user && !devBypass) {
    const locale = pathname.split("/")[2];
    const url = request.nextUrl.clone();
    url.pathname = `/app/${locale}/login`;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
