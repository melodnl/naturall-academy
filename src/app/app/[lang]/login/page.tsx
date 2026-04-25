import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  params,
  searchParams,
}: PageProps<"/app/[lang]/login">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : `/app/${lang}`;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <header className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#b8924f]">
          {dict.meta.tagline}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#1e3a2c]">
          {dict.meta.title}
        </h1>
      </header>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#1e3a2c]">
          {dict.login.titulo}
        </h2>
        <p className="mt-1 mb-5 text-sm text-[#6b6b6b]">
          {dict.login.subtitulo}
        </p>
        <LoginForm dict={dict} lang={lang} next={next} />
      </section>
    </main>
  );
}
