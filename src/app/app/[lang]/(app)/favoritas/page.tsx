import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { getDictionary, hasLocale } from "../../dictionaries";

export default async function FavoritasPage({
  params,
}: PageProps<"/app/[lang]/favoritas">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  if (lang !== "en") redirect("/app/en/favoritas");
  const dict = await getDictionary(lang);

  // TODO: ler favoritos do banco quando auth real estiver ligado
  const faves: { id: number; slug: string; title: string; subtitle: string; image_emoji: string }[] = [];

  return (
    <main className="px-5 pt-8">
      <header className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b8924f]/15">
          <Heart className="h-5 w-5 fill-[#b8924f] text-[#b8924f]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1e3a2c]">{dict.favoritas.titulo}</h1>
      </header>

      {faves.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center">
          <Heart className="mx-auto h-10 w-10 text-[#1e3a2c]/20" />
          <p className="mt-3 text-sm text-[#6b6b6b]">{dict.favoritas.vazio}</p>
          <Link
            href={`/app/${lang}/categorias`}
            className="mt-4 inline-block rounded-full bg-[#1e3a2c] px-4 py-2 text-xs font-semibold text-[#f0ead6]"
          >
            {dict.favoritas.explorar}
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {faves.map((r) => (
            <Link
              key={r.id}
              href={`/app/${lang}/receitas/${r.slug}`}
              className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-[#f0ead6] text-xl">
                {r.image_emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-[#1e3a2c]">
                  {r.title}
                </div>
                <div className="truncate text-[11px] text-[#6b6b6b]">
                  {r.subtitle}
                </div>
              </div>
              <Heart className="h-4 w-4 fill-[#b8924f] text-[#b8924f]" />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
