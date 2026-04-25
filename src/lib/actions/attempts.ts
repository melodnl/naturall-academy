"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AttemptState =
  | { ok: true }
  | { ok: false; message: string }
  | null;

export async function markTried(
  _prev: AttemptState,
  formData: FormData,
): Promise<AttemptState> {
  const recipeId = Number(formData.get("recipe_id"));
  const ratingRaw = formData.get("rating");
  const rating = ratingRaw ? Number(ratingRaw) : null;
  const notes = (formData.get("notes") as string | null) || null;
  const slug = String(formData.get("slug") ?? "");
  const lang = String(formData.get("lang") ?? "pt");

  if (!recipeId) return { ok: false, message: "recipe_id ausente" };

  const supabase = await createSupabaseServerClient();
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return { ok: false, message: "Não autenticado." };

  const { error } = await supabase
    .from("recipe_attempts")
    .upsert(
      {
        user_id: u.user.id,
        recipe_id: recipeId,
        rating,
        notes,
        tried_at: new Date().toISOString(),
      },
      { onConflict: "user_id,recipe_id" },
    );

  if (error) return { ok: false, message: error.message };
  revalidatePath(`/app/${lang}/receitas/${slug}`);
  revalidatePath(`/app/${lang}`);
  revalidatePath(`/app/${lang}/conta`);
  return { ok: true };
}

export async function unmarkTried(
  _prev: AttemptState,
  formData: FormData,
): Promise<AttemptState> {
  const recipeId = Number(formData.get("recipe_id"));
  const slug = String(formData.get("slug") ?? "");
  const lang = String(formData.get("lang") ?? "pt");
  const supabase = await createSupabaseServerClient();
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return { ok: false, message: "Não autenticado." };
  const { error } = await supabase
    .from("recipe_attempts")
    .delete()
    .eq("user_id", u.user.id)
    .eq("recipe_id", recipeId);
  if (error) return { ok: false, message: error.message };
  revalidatePath(`/app/${lang}/receitas/${slug}`);
  revalidatePath(`/app/${lang}`);
  revalidatePath(`/app/${lang}/conta`);
  return { ok: true };
}
