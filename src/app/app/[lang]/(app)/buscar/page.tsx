import Link from "next/link";
import { notFound } from "next/navigation";
import { Search } from "lucide-react";
import { getDictionary, hasLocale } from "../../dictionaries";
import { CATEGORY_META, emojiForRecipe } from "@/lib/category-meta";
import { searchRecipes, type CategorySlug } from "@/lib/db/recipes";

const CATEGORIES_ORDER: CategorySlug[] = [
  "facial",
  "corporal",
  "cabelo",
  "maos_pes",
  "labios",
  "outros",
];

function isCategorySlug(s: string): s is CategorySlug {
  return (CATEGORIES_ORDER as string[]).includes(s);
}

export default async function BuscarPage({
  params,
  searchParams,
}: PageProps<"/app/[lang]/buscar">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim();
  const catParam = typeof sp.cat === "string" ? sp.cat : "";
  const cat: CategorySlug | undefined = isCategorySlug(catParam) ? catParam : undefined;

  const results = await searchRecipes(q, lang, cat, 50);

  return (
    <main className="px-5 pt-8">
      <h1 className="mb-4 text-2xl font-bold text-[#1e3a2c]">
        {dict.nav.receitas}
      </h1>

      <form className="relative mb-4" action={`/app/${lang}/buscar`} method="get">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#1e3a2c]/50" />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={dict.home.buscar}
          className="w-full rounded-full border border-[#1e3a2c]/15 bg-white py-3 pr-4 pl-10 text-sm outline-none focus:border-[#1e3a2c]"
        />
        {cat && <input type="hidden" name="cat" value={cat} />}
      </form>

      <div className="-mx-5 mb-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
        <Link
          href={`/app/${lang}/buscar${q ? `?q=${encodeURIComponent(q)}` : ""}`}
          className={`flex-none rounded-full px-4 py-1.5 text-xs font-medium transition ${
            !cat
              ? "bg-[#1e3a2c] text-[#f0ead6]"
              : "bg-white text-[#1e3a2c] border border-[#1e3a2c]/15"
          }`}
        >
          {dict.home.todas_categorias}
        </Link>
        {CATEGORIES_ORDER.map((c) => (
          <Link
            key={c}
            href={`/app/${lang}/buscar?cat=${c}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`flex-none rounded-full px-4 py-1.5 text-xs font-medium transition ${
              cat === c
                ? "bg-[#1e3a2c] text-[#f0ead6]"
                : "bg-white text-[#1e3a2c] border border-[#1e3a2c]/15"
            }`}
          >
            {CATEGORY_META[c].emoji} {dict.categorias[c]}
          </Link>
        ))}
      </div>

      <div className="mb-3 text-xs text-[#6b6b6b]">
        {results.length} {results.length === 1 ? dict.buscar.result_singular : dict.buscar.result_plural}
        {q && <span> {dict.buscar.for_query} &quot;{q}&quot;</span>}
      </div>

      {results.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-center text-sm text-[#6b6b6b]">
          {dict.buscar.none_found}
        </p>
      ) : (
        <div className="space-y-2">
          {results.map((r) => (
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
                <div className="truncate text-[11px] text-[#6b6b6b]">
                  #{r.number} · {r.category_sub}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
