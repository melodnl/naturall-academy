import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Locale } from "@/app/app/[lang]/dictionaries";
import {
  translateCategorySub,
  translateSkinHair,
  translateYieldText,
} from "@/lib/recipe-i18n";

export type CategorySlug =
  | "facial"
  | "corporal"
  | "cabelo"
  | "maos_pes"
  | "labios"
  | "outros";

export type Ingredient = { name: string; inci: string | null; amount: string };

export type RecipeListItem = {
  id: number;
  slug: string;
  number: number;
  category_slug: CategorySlug;
  category_sub: string | null;
  yield_text: string | null;
  shelf_life_days: number | null;
  title: string;
  subtitle: string | null;
};

export type RecipeFull = RecipeListItem & {
  skin_hair: string | null;
  ingredients: Ingredient[];
  steps: string[];
  how_to_use: string | null;
  warnings: string[];
};

const CATEGORY_BY_ID: Record<number, CategorySlug> = {
  1: "facial",
  2: "corporal",
  3: "cabelo",
  4: "maos_pes",
  5: "labios",
  6: "outros",
};

type RawRecipe = {
  id: number;
  slug: string;
  number: number;
  category_id: number | null;
  category_sub: string | null;
  yield_text: string | null;
  shelf_life_days: number | null;
  skin_hair: string | null;
  recipe_translations: {
    title: string;
    subtitle: string | null;
    ingredients: Ingredient[];
    steps: string[];
    how_to_use: string | null;
    warnings: string[];
  }[];
};

function pickTranslation(r: RawRecipe) {
  return r.recipe_translations[0];
}

export async function getCategoryCounts(): Promise<Record<CategorySlug, number>> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("recipes").select("category_id");
  const counts: Record<CategorySlug, number> = {
    facial: 0,
    corporal: 0,
    cabelo: 0,
    maos_pes: 0,
    labios: 0,
    outros: 0,
  };
  for (const r of data ?? []) {
    const slug = CATEGORY_BY_ID[r.category_id ?? 6];
    if (slug) counts[slug]++;
  }
  return counts;
}

export async function getRecipesByCategory(
  category: CategorySlug,
  locale: Locale,
  limit = 20,
): Promise<RecipeListItem[]> {
  const supabase = await createSupabaseServerClient();
  const catId = Object.entries(CATEGORY_BY_ID).find(([, v]) => v === category)?.[0];
  if (!catId) return [];

  const { data } = await supabase
    .from("recipes")
    .select(
      `id, slug, number, category_id, category_sub, yield_text, shelf_life_days,
       recipe_translations!inner ( title, subtitle, ingredients, steps, how_to_use, warnings )`,
    )
    .eq("category_id", parseInt(catId, 10))
    .eq("recipe_translations.locale", locale)
    .order("number", { ascending: true })
    .limit(limit);

  return (data ?? []).map((r) => {
    const tr = pickTranslation(r as unknown as RawRecipe);
    return {
      id: r.id,
      slug: r.slug,
      number: r.number,
      category_slug: CATEGORY_BY_ID[r.category_id ?? 6],
      category_sub: translateCategorySub(r.category_sub, locale),
      yield_text: translateYieldText(r.yield_text, locale),
      shelf_life_days: r.shelf_life_days,
      title: tr?.title ?? "",
      subtitle: tr?.subtitle ?? null,
    };
  });
}

const CONCERN_TO_CATEGORY: Record<string, CategorySlug[]> = {
  acne: ["facial"],
  hidratacao: ["facial", "corporal"],
  antiidade: ["facial"],
  manchas: ["facial"],
  cabelo_seco: ["cabelo"],
  cabelo_caspa: ["cabelo"],
  labios: ["labios"],
  maos_unhas: ["maos_pes"],
};

const CATEGORY_ID_BY_SLUG: Record<CategorySlug, number> = {
  facial: 1,
  corporal: 2,
  cabelo: 3,
  maos_pes: 4,
  labios: 5,
  outros: 6,
};

export async function getRecommendedRecipes(
  concerns: string[] | null,
  locale: Locale,
  limit = 5,
): Promise<RecipeListItem[]> {
  const cats = new Set<CategorySlug>();
  for (const c of concerns ?? []) {
    for (const cat of CONCERN_TO_CATEGORY[c] ?? []) cats.add(cat);
  }
  if (cats.size === 0) return getFeaturedRecipes(locale, limit);

  const supabase = await createSupabaseServerClient();
  const catIds = [...cats].map((slug) => CATEGORY_ID_BY_SLUG[slug]);
  const { data } = await supabase
    .from("recipes")
    .select(
      `id, slug, number, category_id, category_sub, yield_text, shelf_life_days,
       recipe_translations!inner ( title, subtitle, ingredients, steps, how_to_use, warnings )`,
    )
    .in("category_id", catIds)
    .eq("recipe_translations.locale", locale)
    .order("number", { ascending: true })
    .limit(limit);

  return (data ?? []).map((r) => {
    const tr = pickTranslation(r as unknown as RawRecipe);
    return {
      id: r.id,
      slug: r.slug,
      number: r.number,
      category_slug: CATEGORY_BY_ID[r.category_id ?? 6],
      category_sub: translateCategorySub(r.category_sub, locale),
      yield_text: translateYieldText(r.yield_text, locale),
      shelf_life_days: r.shelf_life_days,
      title: tr?.title ?? "",
      subtitle: tr?.subtitle ?? null,
    };
  });
}

export async function getFeaturedRecipes(
  locale: Locale,
  limit = 5,
): Promise<RecipeListItem[]> {
  const supabase = await createSupabaseServerClient();
  // Pega 1 receita de cada categoria (variedade no destaque)
  const { data } = await supabase
    .from("recipes")
    .select(
      `id, slug, number, category_id, category_sub, yield_text, shelf_life_days,
       recipe_translations!inner ( title, subtitle, ingredients, steps, how_to_use, warnings )`,
    )
    .eq("recipe_translations.locale", locale)
    .in("number", [1, 51, 101, 151, 201, 301])
    .order("number", { ascending: true })
    .limit(limit);

  return (data ?? []).map((r) => {
    const tr = pickTranslation(r as unknown as RawRecipe);
    return {
      id: r.id,
      slug: r.slug,
      number: r.number,
      category_slug: CATEGORY_BY_ID[r.category_id ?? 6],
      category_sub: translateCategorySub(r.category_sub, locale),
      yield_text: translateYieldText(r.yield_text, locale),
      shelf_life_days: r.shelf_life_days,
      title: tr?.title ?? "",
      subtitle: tr?.subtitle ?? null,
    };
  });
}

export async function getRecipeBySlug(
  slug: string,
  locale: Locale,
): Promise<RecipeFull | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("recipes")
    .select(
      `id, slug, number, category_id, category_sub, yield_text, shelf_life_days, skin_hair,
       recipe_translations!inner ( title, subtitle, ingredients, steps, how_to_use, warnings )`,
    )
    .eq("slug", slug)
    .eq("recipe_translations.locale", locale)
    .maybeSingle();

  if (!data) return null;
  const r = data as unknown as RawRecipe;
  const tr = pickTranslation(r);
  return {
    id: r.id,
    slug: r.slug,
    number: r.number,
    category_slug: CATEGORY_BY_ID[r.category_id ?? 6],
    category_sub: translateCategorySub(r.category_sub, locale),
    yield_text: translateYieldText(r.yield_text, locale),
    shelf_life_days: r.shelf_life_days,
    skin_hair: translateSkinHair(r.skin_hair, locale),
    title: tr?.title ?? "",
    subtitle: tr?.subtitle ?? null,
    ingredients: tr?.ingredients ?? [],
    steps: tr?.steps ?? [],
    how_to_use: tr?.how_to_use ?? null,
    warnings: tr?.warnings ?? [],
  };
}

export async function searchRecipes(
  q: string,
  locale: Locale,
  category?: CategorySlug,
  limit = 50,
): Promise<RecipeListItem[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("recipes")
    .select(
      `id, slug, number, category_id, category_sub, yield_text, shelf_life_days,
       recipe_translations!inner ( title, subtitle, ingredients, steps, how_to_use, warnings )`,
    )
    .eq("recipe_translations.locale", locale)
    .order("number", { ascending: true })
    .limit(limit);

  if (q) {
    query = query.ilike("recipe_translations.title", `%${q}%`);
  }

  if (category) {
    const catId = Object.entries(CATEGORY_BY_ID).find(([, v]) => v === category)?.[0];
    if (catId) query = query.eq("category_id", parseInt(catId, 10));
  }

  const { data } = await query;
  return (data ?? []).map((r) => {
    const tr = pickTranslation(r as unknown as RawRecipe);
    return {
      id: r.id,
      slug: r.slug,
      number: r.number,
      category_slug: CATEGORY_BY_ID[r.category_id ?? 6],
      category_sub: translateCategorySub(r.category_sub, locale),
      yield_text: translateYieldText(r.yield_text, locale),
      shelf_life_days: r.shelf_life_days,
      title: tr?.title ?? "",
      subtitle: tr?.subtitle ?? null,
    };
  });
}
