import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Globe, BadgeCheck, Star, Sparkles } from "lucide-react";
import { getDictionary, hasLocale, SUPPORTED_LOCALES } from "../../dictionaries";
import { getMyProfile } from "@/lib/db/profile";
import { getMyAttemptsWithRecipes } from "@/lib/db/attempts";
import { PasswordForm } from "./password-form";
import { SignOutButton } from "./sign-out-button";

export default async function ContaPage({ params }: PageProps<"/app/[lang]/conta">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const dateLocale = lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US";

  const [profile, attempts] = await Promise.all([
    getMyProfile(),
    getMyAttemptsWithRecipes(lang, 50),
  ]);

  const user = {
    email: profile?.email ?? "",
    plan: "Mega Combo",
  };

  return (
    <main className="px-5 pt-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e3a2c]">{dict.conta.titulo}</h1>
      </header>

      <section className="rounded-2xl bg-gradient-to-br from-[#1e3a2c] to-[#2d5240] p-5 text-[#f0ead6] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b8924f] text-xl font-bold text-[#1e3a2c]">
            {user.email[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{user.email}</div>
            <div className="flex items-center gap-1.5 text-xs text-[#f0ead6]/70">
              <BadgeCheck className="h-3 w-3 text-[#b8924f]" />
              {user.plan}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg bg-white/10 p-2.5 backdrop-blur">
            <div className="text-[#f0ead6]/60">{dict.conta.plano}</div>
            <div className="mt-0.5 font-semibold">{dict.conta.ativo}</div>
          </div>
          <div className="rounded-lg bg-white/10 p-2.5 backdrop-blur">
            <div className="text-[#f0ead6]/60">{dict.conta.testadas}</div>
            <div className="mt-0.5 font-semibold">{attempts.length}</div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#6b6b6b]">
            {dict.conta.minhas_receitas}
          </h2>
          <Link
            href={`/app/${lang}/onboarding`}
            className="flex items-center gap-1 text-xs font-medium text-[#b8924f]"
          >
            <Sparkles className="h-3 w-3" />
            {dict.conta.personalizar}
          </Link>
        </div>
        {attempts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1e3a2c]/15 bg-white/50 p-6 text-center">
            <p className="text-sm text-[#6b6b6b]">
              {dict.conta.vazio_testadas_pre}{" "}
              <span className="font-semibold text-[#1e3a2c]">&ldquo;{dict.conta.fiz_essa_receita}&rdquo;</span>.
            </p>
          </div>
        ) : (
          <ul className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {attempts.map((a, i) => (
              <li key={a.recipe_id} className={i > 0 ? "border-t border-[#1e3a2c]/5" : ""}>
                <Link
                  href={`/app/${lang}/receitas/${a.slug}`}
                  className="flex items-center gap-3 px-4 py-3 transition active:bg-[#f0ead6]"
                >
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[#1e3a2c]/5 text-xs font-bold text-[#1e3a2c]">
                    #{a.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-[#1e3a2c]">
                      {a.title}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-[#6b6b6b]">
                      <span>{new Date(a.tried_at).toLocaleDateString(dateLocale)}</span>
                      {a.rating && (
                        <span className="flex items-center gap-0.5 text-[#d4a96a]">
                          <Star className="h-3 w-3 fill-current" />
                          {a.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6">
        <h2 className="mb-2 px-1 text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider">
          {dict.conta.idioma}
        </h2>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {SUPPORTED_LOCALES.map((loc, i) => {
            const label = loc === "pt" ? "Português" : loc === "es" ? "Español" : "English";
            const className = `flex items-center justify-between px-4 py-3.5 transition active:bg-[#f0ead6] ${
              i > 0 ? "border-t border-[#1e3a2c]/5" : ""
            }`;

            return (
              <Link key={loc} href={`/app/${loc}/conta`} className={className}>
                <span className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-[#b8924f]" />
                  <span className="text-sm font-medium text-[#1e3a2c]">{label}</span>
                </span>
                {lang === loc && (
                  <span className="text-xs font-semibold text-[#b8924f]">✓</span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <PasswordForm dict={dict} />
          <div className="border-t border-[#1e3a2c]/5">
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-[#f0ead6]"
            >
              <Mail className="h-4 w-4 text-[#b8924f]" />
              <span className="text-sm font-medium text-[#1e3a2c]">
                {dict.conta.suporte}
              </span>
            </button>
          </div>
          <SignOutButton dict={dict} />
        </div>
      </section>
    </main>
  );
}
