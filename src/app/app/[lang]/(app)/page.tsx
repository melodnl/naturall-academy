import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import { getDictionary, hasLocale } from "../dictionaries";
import { CATEGORY_META, emojiForRecipe } from "@/lib/category-meta";
import {
  getCategoryCounts,
  getRecommendedRecipes,
  type CategorySlug,
} from "@/lib/db/recipes";
import { getMyAttemptCount } from "@/lib/db/attempts";
import { getMyProfile } from "@/lib/db/profile";

export default async function AppHome({ params }: PageProps<"/app/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  // EN-only por enquanto: outros idiomas redirecionam até traduções estarem prontas
  if (lang !== "en") redirect("/app/en");

  const dict = await getDictionary(lang);
  const profile = await getMyProfile();
  const [counts, featured, tested] = await Promise.all([
    getCategoryCounts(),
    getRecommendedRecipes(profile?.concerns ?? null, lang, 5),
    getMyAttemptCount(),
  ]);
  const personalized = (profile?.concerns?.length ?? 0) > 0;

  const totalRecipes = Object.values(counts).reduce((s, n) => s + n, 0);
  const progress = totalRecipes > 0 ? Math.round((tested / totalRecipes) * 100) : 0;
  const categoriasOrdem: CategorySlug[] = ["facial", "corporal", "cabelo", "maos_pes", "labios", "outros"];

  return (
    <main>
      {/* HERO */}
      <section
        className="relative flex min-h-[78vh] flex-col overflow-hidden rounded-b-[2rem] px-6 pt-10 pb-10 text-[#f0ead6]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(15,36,25,0.45) 0%, rgba(15,36,25,0.78) 55%, rgba(15,36,25,0.96) 100%), url('/images/hero2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-[#b8924f] blur-3xl" />
          <div className="absolute bottom-10 left-0 h-72 w-72 rounded-full bg-[#3a7a5c] blur-3xl" />
        </div>

        <div className="relative flex items-center justify-between">
          <ThemeToggle />
          <span className="sr-only">{dict.conta.titulo}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur">
            {lang.toUpperCase()}
          </span>
        </div>

        <div className="relative mt-auto">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4a96a]">
            <Sparkles className="h-3 w-3" />
            {dict.meta.tagline}
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.05] sm:text-5xl">
            {totalRecipes} Natural<br />Recipes
          </h1>
          <p className="mt-3 max-w-sm text-base leading-relaxed text-[#f0ead6]/85">
            Your complete library of artisan cosmetics. 600+ recipes, ingredients and step-by-step.
          </p>

          <Link
            href={`/app/${lang}/categorias`}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3a7a5c] via-[#b8924f] to-[#d4a96a] px-7 py-3.5 text-base font-semibold text-white shadow-xl shadow-[#b8924f]/40 transition active:scale-95"
          >
            Start now
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* PROGRESSO */}
      <section className="mx-5 mt-5 rounded-2xl bg-white p-4 shadow-sm shadow-[#1e3a2c]/5">
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

      {/* DESTAQUES / RECOMENDADAS */}
      <section className="mt-6 px-5">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-base font-semibold text-[#1e3a2c]">
            {personalized ? "Recommended for you" : "Featured"}
          </h2>
          {personalized && (
            <span className="rounded-full bg-[#3a7a5c]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#3a7a5c]">
              ✨ Match
            </span>
          )}
        </div>
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
