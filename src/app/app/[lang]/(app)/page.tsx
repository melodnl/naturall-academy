import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Sparkles, Sun } from "lucide-react";
import { getDictionary, hasLocale } from "../dictionaries";
import { CATEGORY_META, emojiForRecipe } from "@/lib/category-meta";
import {
  getCategoryCounts,
  getFeaturedRecipes,
  type CategorySlug,
} from "@/lib/db/recipes";

export default async function AppHome({ params }: PageProps<"/app/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  // EN-only por enquanto: outros idiomas redirecionam até traduções estarem prontas
  if (lang !== "en") redirect("/app/en");

  const dict = await getDictionary(lang);
  const [counts, featured] = await Promise.all([
    getCategoryCounts(),
    getFeaturedRecipes(lang, 5),
  ]);

  const totalRecipes = Object.values(counts).reduce((s, n) => s + n, 0);
  const tested = 0;
  const progress = totalRecipes > 0 ? Math.round((tested / totalRecipes) * 100) : 0;
  const categoriasOrdem: CategorySlug[] = ["facial", "corporal", "cabelo", "maos_pes", "labios", "outros"];

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden rounded-b-3xl bg-gradient-to-br from-[#1e3a2c] via-[#2d5240] to-[#1e3a2c] px-5 pt-12 pb-8 text-[#f0ead6]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-6 h-32 w-32 rounded-full bg-[#b8924f] blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#f0ead6] blur-3xl" />
        </div>

        <div className="relative">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#f0ead6] backdrop-blur"
              aria-label={dict.conta.titulo}
            >
              <Sun className="h-4 w-4" />
            </button>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur">
              {lang.toUpperCase()}
            </span>
          </div>

          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#b8924f]">
            <Sparkles className="h-3 w-3" />
            {dict.meta.tagline}
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
            {totalRecipes} Natural Recipes
          </h1>
          <p className="mt-2 text-sm text-[#f0ead6]/80">
            Your complete library of artisan cosmetics.
          </p>

          <Link
            href={`/app/${lang}/categorias`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b8924f] to-[#d4a96a] px-5 py-2.5 text-sm font-semibold text-[#1e3a2c] shadow-lg shadow-[#b8924f]/30 transition active:scale-95"
          >
            Start now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* PROGRESSO */}
      <section className="mx-5 -mt-5 rounded-2xl bg-white p-4 shadow-sm shadow-[#1e3a2c]/5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#1e3a2c]">Your progress</span>
          <span className="text-sm font-bold text-[#b8924f]">{progress}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1e3a2c]/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#b8924f] to-[#d4a96a]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[#6b6b6b]">
          {tested} of {totalRecipes} recipes tried
        </p>
      </section>

      {/* CATEGORIAS */}
      <section className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#1e3a2c]">
            {dict.home.todas_categorias}
          </h2>
          <Link
            href={`/app/${lang}/categorias`}
            className="text-xs font-medium text-[#b8924f]"
          >
            {dict.home.ver_tudo}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categoriasOrdem.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <Link
                key={cat}
                href={`/app/${lang}/categorias#${cat}`}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${meta.gradient} p-4 text-[#f0ead6] shadow-sm transition active:scale-95`}
              >
                <div className="text-2xl">{meta.emoji}</div>
                <div className="mt-3">
                  <div className="text-sm font-semibold">{dict.categorias[cat]}</div>
                  <div className="text-[11px] text-[#f0ead6]/70">
                    {counts[cat]} recipes
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="mt-6 px-5">
        <h2 className="mb-3 text-base font-semibold text-[#1e3a2c]">Featured</h2>
        <div className="space-y-3">
          {featured.map((r) => (
            <Link
              key={r.id}
              href={`/app/${lang}/receitas/${r.slug}`}
              className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm transition active:scale-[0.98]"
            >
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-[#f0ead6] text-2xl">
                {emojiForRecipe(r.category_slug, r.number)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-[#1e3a2c]">
                  {r.title}
                </div>
                <div className="mt-0.5 truncate text-xs text-[#6b6b6b]">
                  {r.subtitle ?? r.category_sub}
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[10px] text-[#b8924f]">
                  <span>#{r.number}</span>
                  {r.yield_text && (
                    <>
                      <span>·</span>
                      <span>{r.yield_text}</span>
                    </>
                  )}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 flex-none text-[#1e3a2c]/40" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
