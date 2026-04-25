// Lê recipes-en.json e gera SQL de seed em batches.
// Saída: scripts/data/seed-batch-NN.sql

import fs from "node:fs/promises";
import path from "node:path";

const IN = path.resolve(process.cwd(), "scripts", "data", "recipes-en.json");
const OUT_DIR = path.resolve(process.cwd(), "scripts", "data");
const BATCH_SIZE = 100;

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

function sql(s: string | null | undefined): string {
  if (s == null) return "NULL";
  return `'${s.replace(/'/g, "''")}'`;
}

function jsonbLit(v: unknown): string {
  return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
}

function shelfLifeDays(text: string | null): string {
  if (!text) return "NULL";
  const m = text.match(/(\d+)\s*(year|month|week|day)/i);
  if (!m) return "NULL";
  const n = parseInt(m[1], 10);
  const u = m[2].toLowerCase();
  const days = u.startsWith("year") ? n * 365 : u.startsWith("month") ? n * 30 : u.startsWith("week") ? n * 7 : n;
  return String(days);
}

async function main() {
  const recipes: Recipe[] = JSON.parse(await fs.readFile(IN, "utf-8"));

  // Categoria slug → id (1-6) já está seedado: facial=1, corporal=2, cabelo=3, maos_pes=4, labios=5, outros=6
  const catId: Record<string, number> = {
    facial: 1,
    corporal: 2,
    cabelo: 3,
    maos_pes: 4,
    labios: 5,
    outros: 6,
  };

  let batchIdx = 0;
  for (let i = 0; i < recipes.length; i += BATCH_SIZE) {
    const batch = recipes.slice(i, i + BATCH_SIZE);
    const lines: string[] = [];
    lines.push("-- batch " + (batchIdx + 1));
    lines.push("begin;");

    // INSERT recipes
    const recipeValues = batch
      .map(
        (r) =>
          `(${r.number}, ${sql(r.slug)}, ${sql(r.category_sub)}, ${catId[r.category_app] ?? 6}, ${sql(
            r.yield,
          )}, ${sql(r.skin_hair)}, ${shelfLifeDays(r.shelf_life)}, NULL, NULL, NULL)`,
      )
      .join(",\n  ");
    lines.push(
      `insert into public.recipes (number, slug, category_sub, category_id, yield_text, skin_hair, shelf_life_days, difficulty, time_minutes, preservative) values\n  ${recipeValues}\non conflict (number) do update set
    slug = excluded.slug,
    category_sub = excluded.category_sub,
    category_id = excluded.category_id,
    yield_text = excluded.yield_text,
    skin_hair = excluded.skin_hair,
    shelf_life_days = excluded.shelf_life_days;`,
    );

    // INSERT translations (locale='en') — depende do recipes.id que mapeamos por number
    const trValues = batch
      .map(
        (r) =>
          `((select id from public.recipes where number = ${r.number}), 'en', ${sql(r.title)}, NULL, ${sql(
            r.subtitle,
          )}, ${jsonbLit(r.ingredients)}, ${jsonbLit(r.method)}, ${sql(r.how_to_use)}, ${jsonbLit(
            r.warnings,
          )})`,
      )
      .join(",\n  ");
    lines.push(
      `insert into public.recipe_translations (recipe_id, locale, title, description, subtitle, ingredients, steps, how_to_use, warnings) values\n  ${trValues}\non conflict (recipe_id, locale) do update set
    title = excluded.title,
    subtitle = excluded.subtitle,
    ingredients = excluded.ingredients,
    steps = excluded.steps,
    how_to_use = excluded.how_to_use,
    warnings = excluded.warnings;`,
    );

    lines.push("commit;");

    const filename = `seed-batch-${String(batchIdx + 1).padStart(2, "0")}.sql`;
    await fs.writeFile(path.join(OUT_DIR, filename), lines.join("\n"));
    console.log(`✓ ${filename} (${batch.length} receitas, ${lines.join("\n").length} chars)`);
    batchIdx++;
  }

  console.log(`\nTotal: ${batchIdx} arquivos batch para ${recipes.length} receitas.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
