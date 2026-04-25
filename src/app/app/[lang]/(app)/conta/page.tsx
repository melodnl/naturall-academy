import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Mail, Globe, LogOut, BadgeCheck } from "lucide-react";
import { getDictionary, hasLocale, SUPPORTED_LOCALES } from "../../dictionaries";

export default async function ContaPage({ params }: PageProps<"/app/[lang]/conta">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  if (lang !== "en") redirect("/app/en/conta");
  const dict = await getDictionary(lang);

  // Mock — sair de verdade vai vir junto com auth real
  const user = {
    email: "comercial.melodaniel@gmail.com",
    plan: "Mega Combo",
    status: "active" as const,
    expires_at: "2027-04-25",
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
            <div className="text-[#f0ead6]/60">{dict.conta.renova_em}</div>
            <div className="mt-0.5 font-semibold">{user.expires_at}</div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 px-1 text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider">
          {dict.conta.idioma}
        </h2>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {SUPPORTED_LOCALES.map((loc, i) => {
            const available = loc === "en";
            const label = loc === "pt" ? "Português" : loc === "es" ? "Español" : "English";
            const inner = (
              <span className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-[#b8924f]" />
                <span className="text-sm font-medium text-[#1e3a2c]">{label}</span>
                {!available && (
                  <span className="rounded-full bg-[#b8924f]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#b8924f]">
                    soon
                  </span>
                )}
              </span>
            );
            const className = `flex items-center justify-between px-4 py-3.5 ${
              available ? "transition active:bg-[#f0ead6]" : "opacity-60 cursor-not-allowed"
            } ${i > 0 ? "border-t border-[#1e3a2c]/5" : ""}`;

            return available ? (
              <Link key={loc} href={`/app/${loc}/conta`} className={className}>
                {inner}
                {lang === loc && (
                  <span className="text-xs font-semibold text-[#b8924f]">✓</span>
                )}
              </Link>
            ) : (
              <div key={loc} className={className} aria-disabled="true">
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-[#f0ead6]"
          >
            <Mail className="h-4 w-4 text-[#b8924f]" />
            <span className="text-sm font-medium text-[#1e3a2c]">
              {lang === "pt" ? "Suporte" : lang === "es" ? "Soporte" : "Support"}
            </span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-3 border-t border-[#1e3a2c]/5 px-4 py-3.5 text-left text-red-700 transition active:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">{dict.conta.sair}</span>
          </button>
        </div>
      </section>
    </main>
  );
}
