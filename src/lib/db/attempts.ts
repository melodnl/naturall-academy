import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Attempt = {
  recipe_id: number;
  rating: number | null;
  notes: string | null;
  tried_at: string;
};

export async function getMyAttemptCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return 0;
  const { count } = await supabase
    .from("recipe_attempts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", u.user.id);
  return count ?? 0;
}

export async function getMyAttemptForRecipe(recipeId: number): Promise<Attempt | null> {
  const supabase = await createSupabaseServerClient();
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  const { data } = await supabase
    .from("recipe_attempts")
    .select("recipe_id, rating, notes, tried_at")
    .eq("user_id", u.user.id)
    .eq("recipe_id", recipeId)
    .maybeSingle();
  return (data as Attempt | null) ?? null;
}

export type AttemptWithRecipe = Attempt & {
  slug: string;
  number: number;
  title: string;
};

export async function getMyAttemptsWithRecipes(locale: string, limit = 50): Promise<AttemptWithRecipe[]> {
  const supabase = await createSupabaseServerClient();
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const { data } = await supabase
    .from("recipe_attempts")
    .select(
      `recipe_id, rating, notes, tried_at,
       recipes!inner ( slug, number,
         recipe_translations!inner ( title, locale )
       )`,
    )
    .eq("user_id", u.user.id)
    .eq("recipes.recipe_translations.locale", locale)
    .order("tried_at", { ascending: false })
    .limit(limit);

  type Row = Attempt & {
    recipes: {
      slug: string;
      number: number;
      recipe_translations: { title: string }[];
    };
  };
  return ((data ?? []) as unknown as Row[]).map((r) => ({
    recipe_id: r.recipe_id,
    rating: r.rating,
    notes: r.notes,
    tried_at: r.tried_at,
    slug: r.recipes.slug,
    number: r.recipes.number,
    title: r.recipes.recipe_translations[0]?.title ?? "",
  }));
}
