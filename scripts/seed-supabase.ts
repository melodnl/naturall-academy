// Seed das 600 receitas no Supabase usando service_role key.
// Lê scripts/data/recipes-en.json e insere em batches.
// Uso: npx tsx scripts/seed-supabase.ts

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ENV_PATH = path.resolve(process.cwd(), ".env.local");

async function loadEnv() {
  const txt = await fs.readFile(ENV_PATH, "utf-8");
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  }
}

type Recipe = {
  number: number;
  slug: string;
  category_app: string;
  category_sub: string;
  title: string;
  subtitle: string;
  yield: string | null;
  shelf_life: string | null;
  skin_hair: string | null;
  ingredients: { name: string; inci: string | null; amount: string }[];
  method: string[];
  how_to_use: string;
  warnings: string[];
};

const CAT_ID: Record<string, number> = {
  facial: 1,
  corporal: 2,
  cabelo: 3,
  maos_pes: 4,
  labios: 5,
  outros: 6,
};

function shelfLifeDays(text: string | null): number | null {
  if (!text) return null;
  const m = text.match(/(\d+)\s*(year|month|week|day)/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  const u = m[2].toLowerCase();
  return u.startsWith("year") ? n * 365 : u.startsWith("month") ? n * 30 : u.startsWith("week") ? n * 7 : n;
}

async function main() {
  await loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY não está em .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const recipes: Recipe[] = JSON.parse(
    await fs.readFile(path.resolve(process.cwd(), "scripts", "data", "recipes-en.json"), "utf-8"),
  );

  console.log(`Inserindo ${recipes.length} receitas...\n`);

  const BATCH = 50;
  let inserted = 0;
  for (let i = 0; i < recipes.length; i += BATCH) {
    const slice = recipes.slice(i, i + BATCH);

    // 1. Upsert recipes
    const recipeRows = slice.map((r) => ({
      number: r.number,
      slug: r.slug,
      category_id: CAT_ID[r.category_app] ?? 6,
      category_sub: r.category_sub,
      yield_text: r.yield,
      skin_hair: r.skin_hair,
      shelf_life_days: shelfLifeDays(r.shelf_life),
    }));

    const { data: recipeData, error: e1 } = await supabase
      .from("recipes")
      .upsert(recipeRows, { onConflict: "number" })
      .select("id, number");

    if (e1) {
      console.error(`❌ Batch ${i / BATCH + 1} (recipes):`, e1);
      process.exit(1);
    }

    const idByNumber = new Map(recipeData!.map((r) => [r.number, r.id]));

    // 2. Upsert translations (locale='en')
    const trRows = slice.map((r) => ({
      recipe_id: idByNumber.get(r.number)!,
      locale: "en",
      title: r.title,
      subtitle: r.subtitle,
      ingredients: r.ingredients,
      steps: r.method,
      how_to_use: r.how_to_use,
      warnings: r.warnings,
    }));

    const { error: e2 } = await supabase
      .from("recipe_translations")
      .upsert(trRows, { onConflict: "recipe_id,locale" });

    if (e2) {
      console.error(`❌ Batch ${i / BATCH + 1} (translations):`, e2);
      process.exit(1);
    }

    inserted += slice.length;
    console.log(`✓ ${inserted}/${recipes.length}`);
  }

  // Sanity check
  const { count: rCount } = await supabase
    .from("recipes")
    .select("*", { count: "exact", head: true });
  const { count: tCount } = await supabase
    .from("recipe_translations")
    .select("*", { count: "exact", head: true })
    .eq("locale", "en");

  console.log(`\n✅ Banco: ${rCount} receitas, ${tCount} traduções EN`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
