import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Heart, Share2, ShieldCheck, Beaker, Calendar } from "lucide-react";
import { getDictionary, hasLocale } from "../../../dictionaries";
import { CATEGORY_META, emojiForRecipe } from "@/lib/category-meta";
import { getRecipeBySlug } from "@/lib/db/recipes";

export default async function ReceitaPage({
  params,
}: PageProps<"/app/[lang]/receitas/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  if (lang !== "en") redirect(`/app/en/receitas/${slug}`);
  const dict = await getDictionary(lang);

  const recipe = await getRecipeBySlug(slug, lang);
  if (!recipe) notFound();

  const meta = CATEGORY_META[recipe.category_slug];

  return (
    <main>
      {/* HERO */}
      <section
        className={`relative overflow-hidden rounded-b-3xl bg-gradient-to-br ${meta.gradient} px-5 pt-6 pb-12 text-[#f0ead6]`}
      >
        <div className="mb-4 flex items-center justify-between">
          <Link
            href={`/app/${lang}/categorias#${recipe.category_slug}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur"
            aria-label="back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur"
              aria-label={dict.receita.compartilhar}
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur"
              aria-label={dict.receita.favoritar}
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-20 w-20 flex-none items-center justify-center rounded-2xl bg-white/15 text-5xl backdrop-blur">
            {emojiForRecipe(recipe.category_slug, recipe.number)}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-[#f0ead6]/70">
              #{recipe.number} · {recipe.category_sub}
            </div>
            <h1 className="mt-1 text-xl font-bold leading-tight">{recipe.title}</h1>
            {recipe.subtitle && (
              <p className="mt-1 text-xs text-[#f0ead6]/70 italic">{recipe.subtitle}</p>
            )}
          </div>
        </div>

        {recipe.skin_hair && (
          <p className="mt-4 inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur">
            {recipe.skin_hair}
          </p>
        )}
      </section>

      {/* META */}
      <section className="mx-5 mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-white p-3 shadow-sm">
        <div className="flex flex-col items-center gap-1 rounded-lg p-2">
          <Beaker className="h-4 w-4 text-[#b8924f]" />
          <div className="text-[10px] text-[#6b6b6b]">Yield</div>
          <div className="text-center text-xs font-bold leading-tight text-[#1e3a2c]">
            {recipe.yield_text ?? "—"}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-lg p-2">
          <ShieldCheck className="h-4 w-4 text-[#b8924f]" />
          <div className="text-[10px] text-[#6b6b6b]">Ingredients</div>
          <div className="text-sm font-bold text-[#1e3a2c]">
            {recipe.ingredients.length}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-lg p-2">
          <Calendar className="h-4 w-4 text-[#b8924f]" />
          <div className="text-[10px] text-[#6b6b6b]">{dict.receita.validade}</div>
          <div className="text-sm font-bold text-[#1e3a2c]">
            {recipe.shelf_life_days ? `${recipe.shelf_life_days}d` : "—"}
          </div>
        </div>
      </section>

      {/* INGREDIENTES */}
      <section className="mt-6 px-5">
        <h2 className="mb-3 text-base font-semibold text-[#1e3a2c]">
          {dict.receita.ingredientes}
        </h2>
        <ul className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {recipe.ingredients.map((ing, i) => (
            <li
              key={i}
              className={`flex items-start justify-between gap-3 px-4 py-3 ${
                i > 0 ? "border-t border-[#1e3a2c]/5" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-[#1e3a2c]">{ing.name}</div>
                {ing.inci && (
                  <div className="mt-0.5 text-[10px] text-[#6b6b6b] italic">
                    {ing.inci}
                  </div>
                )}
              </div>
              <span className="flex-none text-sm font-semibold text-[#b8924f]">
                {ing.amount}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* MÉTODO */}
      <section className="mt-6 px-5">
        <h2 className="mb-3 text-base font-semibold text-[#1e3a2c]">
          {dict.receita.modo_preparo}
        </h2>
        <ol className="space-y-3">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#1e3a2c] text-xs font-bold text-[#f0ead6]">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-[#3a3a3a]">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* HOW TO USE */}
      {recipe.how_to_use && (
        <section className="mt-6 px-5">
          <h2 className="mb-3 text-base font-semibold text-[#1e3a2c]">How to use</h2>
          <p className="rounded-2xl bg-white p-4 text-sm leading-relaxed text-[#3a3a3a] shadow-sm">
            {recipe.how_to_use}
          </p>
        </section>
      )}

      {/* WARNINGS */}
      {recipe.warnings.length > 0 && (
        <section className="mt-6 px-5">
          <div className="rounded-2xl border border-[#b8924f]/30 bg-[#b8924f]/5 p-4">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#1e3a2c]">
              Warnings
            </div>
            <ul className="space-y-1.5">
              {recipe.warnings.map((w, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-xs leading-relaxed text-[#3a3a3a]"
                >
                  <span className="text-[#b8924f]">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
