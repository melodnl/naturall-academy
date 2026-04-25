// Extrai 600 receitas do PDF v3 → JSON estruturado.
// Uso: npx tsx scripts/extract-recipes.ts
// Saída: scripts/data/recipes-en.json

import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

const PDF_PATH = path.resolve(
  process.cwd(),
  "..",
  "600_recipes_naturall_academy_v3.pdf",
);
const OUT_PATH = path.resolve(process.cwd(), "scripts", "data", "recipes-en.json");

// Mapeamento das sub-categorias do PDF → 6 categorias do app
// Será preenchido após primeira extração; por enquanto agrupa por palavra-chave
function mapCategory(sub: string): {
  app: "facial" | "corporal" | "cabelo" | "maos_pes" | "labios" | "outros";
  sub: string;
} {
  const s = sub.toLowerCase();
  let app: "facial" | "corporal" | "cabelo" | "maos_pes" | "labios" | "outros";
  // ordem importa: hair > lip > hand/foot > facial/eye/anti-aging > body > men's
  if (s.includes("hair") || s.includes("scalp") || s.includes("shampoo") || s.includes("conditioner"))
    app = "cabelo";
  else if (s.includes("lip")) app = "labios";
  else if (s.includes("hand") || s.includes("foot") || s.includes("nail"))
    app = "maos_pes";
  else if (
    s.includes("facial") ||
    s.includes("face") ||
    s.includes("eye") ||
    s.includes("anti-aging") ||
    s.includes("anti aging")
  )
    app = "facial";
  else if (s.includes("men")) app = "outros"; // grooming masculino vira "outros" (ou pode ser corporal)
  else if (
    s.includes("body") ||
    s.includes("bath") ||
    s.includes("shower") ||
    s.includes("scrub") ||
    s.includes("deodor")
  )
    app = "corporal";
  else app = "outros";
  return { app, sub };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type Ingredient = { name: string; inci: string | null; amount: string };

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
  ingredients: Ingredient[];
  method: string[];
  how_to_use: string;
  warnings: string[];
};

function parseRecipeBlock(block: string): Recipe | null {
  // header: "RECIPE N° XXX · <subcategoria>"
  const headerMatch = block.match(/RECIPE N°\s*(\d+)\s*·\s*([^\n]+)/);
  if (!headerMatch) return null;

  const number = parseInt(headerMatch[1], 10);
  const sub = headerMatch[2].trim();

  // Após o header, próximas linhas: título, subtítulo, meta-line
  const afterHeader = block.slice(headerMatch[0].length).trim();
  const lines = afterHeader.split("\n").map((l) => l.trim());

  const title = lines[0] ?? "";
  const subtitle = lines[1] ?? "";

  // meta-line: "Yield: ... · Shelf life: ... · Skin/Hair: ..."
  const metaLine = lines[2] ?? "";
  const yieldMatch = metaLine.match(/Yield:\s*([^·]+?)(?:·|$)/);
  const shelfMatch = metaLine.match(/Shelf life:\s*([^·]+?)(?:·|$)/);
  const skinMatch = metaLine.match(/Skin\/Hair:\s*([^·\n]+?)(?:·|\n|$)/);

  // Seções
  const ingrIdx = block.indexOf("INGREDIENTS");
  const methIdx = block.indexOf("METHOD");
  const howIdx = block.indexOf("HOW TO USE");
  const warnIdx = block.indexOf("WARNINGS");
  if (ingrIdx < 0 || methIdx < 0) return null;

  const ingrText = block.slice(ingrIdx + "INGREDIENTS".length, methIdx).trim();
  const methText = block
    .slice(methIdx + "METHOD".length, howIdx > 0 ? howIdx : block.length)
    .trim();
  const howText =
    howIdx > 0
      ? block
          .slice(howIdx + "HOW TO USE".length, warnIdx > 0 ? warnIdx : block.length)
          .trim()
      : "";
  const warnText = warnIdx > 0 ? block.slice(warnIdx + "WARNINGS".length).trim() : "";

  // Limpa ruído de footer/header de página
  const stripPageNoise = (s: string) =>
    s
      .replace(/-- \d+ of \d+ --/g, "")
      .replace(
        /NATURALL ACADEMY · 600 Recipes for Natural Cosmetics professional edition/g,
        "",
      )
      .replace(/—\s*\d+\s*—\s*science · nature · care naturallacademy\.com/g, "")
      .trim();

  const ingrCleaned = stripPageNoise(ingrText);
  const methCleaned = stripPageNoise(methText);
  const howCleaned = stripPageNoise(howText);
  const warnCleaned = stripPageNoise(warnText);

  // Parse ingredientes: "Nome (INCI) quantidade"
  // pode quebrar linha no meio. Estratégia: cada ingrediente termina com algo tipo "Xg" ou "X ml" ou "X drops" ou "X fl oz)"
  const ingredients: Ingredient[] = [];
  // Junta linhas por agrupamento: nova entrada começa com letra maiúscula que NÃO seja continuação parentesizada
  const rawIngrLines = ingrCleaned
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  let buf = "";
  const flush = () => {
    if (!buf) return;
    const trimmed = buf.trim();
    // Estratégia robusta: balancear parênteses pra encontrar o último grupo INCI,
    // depois separar quantidade pelo último marcador numérico ou "drops".
    let nameStr = trimmed;
    let inci: string | null = null;
    let amount = "";

    // Procura quantidade no final: aceita "<num> <unit>" ou "<num> drops" no fim,
    // possivelmente com parênteses (ex: "94.8 ml (3.21 fl oz)") ou plain "3 drops".
    const qtyRegex =
      /\s+(\d[\d.,]*\s*(?:g|ml|kg|oz|drops?|fl\s*oz|%)\b(?:\s*\(\s*[^)]+\))?(?:\s*\(\s*[^)]+\))?)\s*$/i;
    const qtyMatch = trimmed.match(qtyRegex);
    if (qtyMatch) {
      amount = qtyMatch[1].trim();
      nameStr = trimmed.slice(0, qtyMatch.index).trim();
    }

    // Agora extrai INCI: ÚLTIMO parêntese balanceado em nameStr
    if (nameStr.endsWith(")")) {
      // Caminha de trás pra frente contando parênteses
      let depth = 0;
      let start = -1;
      for (let i = nameStr.length - 1; i >= 0; i--) {
        const ch = nameStr[i];
        if (ch === ")") depth++;
        else if (ch === "(") {
          depth--;
          if (depth === 0) {
            start = i;
            break;
          }
        }
      }
      if (start >= 0) {
        inci = nameStr.slice(start + 1, nameStr.length - 1).trim();
        nameStr = nameStr.slice(0, start).trim();
      }
    }

    ingredients.push({ name: nameStr, inci, amount });
    buf = "";
  };
  // Concatena tudo como uma string e split pelos pontos onde uma quantidade fecha
  // a entrada (gramas/ml/drops opcionalmente seguidos de "(... fl oz)")
  const joined = rawIngrLines.join(" ").replace(/\s+/g, " ");
  const splitRegex =
    /(\d[\d.,]*\s*(?:g|ml|kg|oz|drops?|fl\s*oz|%)\b(?:\s*\(\s*[^)]+\))?(?:\s*\(\s*[^)]+\))?)/gi;
  let lastEnd = 0;
  let m: RegExpExecArray | null;
  while ((m = splitRegex.exec(joined)) !== null) {
    const end = m.index + m[0].length;
    buf = joined.slice(lastEnd, end).trim();
    flush();
    lastEnd = end;
  }
  // descarta resto não capturado (geralmente vazio ou ruído)
  buf = "";

  // Parse method: linhas começando com "1.", "2.", ...
  const method: string[] = [];
  const methLines = methCleaned.split(/\n/).map((l) => l.trim()).filter(Boolean);
  let stepBuf = "";
  for (const line of methLines) {
    if (/^\d+\.\s/.test(line)) {
      if (stepBuf) method.push(stepBuf.trim());
      stepBuf = line.replace(/^\d+\.\s*/, "");
    } else {
      stepBuf += " " + line;
    }
  }
  if (stepBuf) method.push(stepBuf.trim());

  // Parse warnings: linhas começando com "—"
  const warnings = warnCleaned
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith("—"))
    .map((l) => l.replace(/^—\s*/, ""))
    .filter(
      (l) =>
        !/^(naturall academy|naturallacademy\.com|science · nature)/i.test(l),
    );

  const cat = mapCategory(sub);

  return {
    number,
    slug: `${String(number).padStart(3, "0")}-${slugify(title)}`,
    category_app: cat.app,
    category_sub: cat.sub,
    title,
    subtitle,
    yield: yieldMatch?.[1].trim() ?? null,
    shelf_life: shelfMatch?.[1].trim() ?? null,
    skin_hair: skinMatch?.[1].trim() ?? null,
    ingredients,
    method,
    how_to_use: howCleaned.replace(/\s+/g, " ").trim(),
    warnings,
  };
}

async function main() {
  const buffer = await fs.readFile(PDF_PATH);
  const parser = new PDFParse({ data: buffer });
  const text = await parser.getText();
  const fullText: string = text.text ?? text;

  // Quebra o texto em blocos por "RECIPE N°"
  const parts = fullText.split(/(?=RECIPE N°\s*\d+)/);
  const recipes: Recipe[] = [];
  for (const part of parts) {
    if (!part.includes("RECIPE N°")) continue;
    const r = parseRecipeBlock(part);
    if (r) recipes.push(r);
  }

  // Salva JSON
  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, JSON.stringify(recipes, null, 2));

  // Estatísticas
  const bySub = new Map<string, number>();
  const byApp = new Map<string, number>();
  for (const r of recipes) {
    bySub.set(r.category_sub, (bySub.get(r.category_sub) ?? 0) + 1);
    byApp.set(r.category_app, (byApp.get(r.category_app) ?? 0) + 1);
  }

  console.log(`✓ Extraídas ${recipes.length} receitas`);
  console.log(`✓ Salvo em: ${OUT_PATH}\n`);

  console.log("=== POR SUB-CATEGORIA (PDF) ===");
  for (const [k, v] of [...bySub.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${v.toString().padStart(3)} · ${k}`);
  }

  console.log("\n=== POR CATEGORIA DO APP ===");
  for (const [k, v] of [...byApp.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${v.toString().padStart(3)} · ${k}`);
  }

  console.log("\n=== AMOSTRA: receita #1 ===");
  console.log(JSON.stringify(recipes[0], null, 2));

  console.log("\n=== AMOSTRA: receita #300 ===");
  console.log(JSON.stringify(recipes[299], null, 2));

  console.log("\n=== AMOSTRA: receita #600 ===");
  console.log(JSON.stringify(recipes[599], null, 2));

  await parser.destroy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
