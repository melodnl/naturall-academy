import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { CATEGORY_META, emojiForRecipe } from "@/lib/category-meta";
import {
  getCategoryCounts,
  getRecipesByCategory,
  type CategorySlug,
} from "@/lib/db/recipes";

export default async function CategoriasPage({
  params,
}: PageProps<"/app/[lang]/categorias">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  if (lang !== "en") redirect("/app/en/categorias");
  const dict = await getDictionary(lang);

  const categoriasOrdem: CategorySlug[] = [
    "facial",
    "corporal",
    "cabelo",
    "maos_pes",
    "labios",
    "outros",
  ];

  const [counts, ...buckets] = await Promise.all([
    getCategoryCounts(),
    ...categoriasOrdem.map((c) => getRecipesByCategory(c, lang, 12)),
  ]);

  return (
    <main className="px-5 pt-8">
      <header className="mb-5">
        <p className="text-xs uppercase tracking-[0.25em] text-[#b8924f]">
          {dict.meta.tagline}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-[#1e3a2c]">
          {dict.nav.categorias}
        </h1>
      </header>

      <div className="space-y-6">
        {categoriasOrdem.map((cat, idx) => {
          const meta = CATEGORY_META[cat];
          const recipesInCat = buckets[idx];
          return (
            <section key={cat} id={cat}>
              <div
                className={`mb-3 flex items-center gap-3 rounded-2xl bg-gradient-to-br ${meta.gradient} p-4 text-[#f0ead6]`}
              >
                <div className="text-3xl">{meta.emoji}</div>
                <div>
                  <div className="text-base font-semibold">
                    {dict.categorias[cat]}
                  </div>
                  <div className="text-xs text-[#f0ead6]/70">
                    {counts[cat]} recipes
                  </div>
                </div>
              </div>

              {recipesInCat.length > 0 && (
                <div className="space-y-2">
                  {recipesInCat.map((r) => (
                    <Link
                      key={r.id}
                      href={`/app/${lang}/receitas/${r.slug}`}
                      className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition active:scale-[0.98]"
                    >
                      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-[#f0ead6] text-xl">
                        {emojiForRecipe(r.category_slug, r.number)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-[#1e3a2c]">
                          {r.title}
                        </div>
                        <div className="text-[11px] text-[#6b6b6b]">
                          #{r.number} · {r.category_sub}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {counts[cat] > recipesInCat.length && (
                    <Link
                      href={`/app/${lang}/buscar?cat=${cat}`}
                      className="block rounded-xl border border-[#1e3a2c]/15 bg-white/50 p-3 text-center text-xs font-medium text-[#1e3a2c]"
                    >
                      View all {counts[cat]} {dict.categorias[cat].toLowerCase()} recipes →
                    </Link>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
