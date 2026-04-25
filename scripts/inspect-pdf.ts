// Inspeciona o PDF v3
// Uso: npx tsx scripts/inspect-pdf.ts <caminho-pdf>

import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

const PDF_PATH =
  process.argv[2] ??
  path.resolve(process.cwd(), "..", "600_recipes_naturall_academy_v3.pdf");

async function main() {
  const buffer = await fs.readFile(PDF_PATH);
  const parser = new PDFParse({ data: buffer });

  const info = await parser.getInfo();
  const text = await parser.getText();

  console.log("=== METADATA ===");
  console.log(`Path:    ${PDF_PATH}`);
  console.log(`Info:    ${JSON.stringify(info, null, 2)}`);
  const fullText = text.text ?? text;
  console.log(`Length:  ${fullText.length} chars`);

  console.log("\n=== PRIMEIROS 3000 CHARS ===");
  console.log(fullText.slice(0, 3000));

  // Procura primeira ocorrência de "Recipe 1" ou "1." começo de receita
  const idx1 = fullText.indexOf("Recipe 1");
  const idx2 = fullText.search(/\n\s*1\s*\n/);
  console.log(`\nRecipe 1 idx: ${idx1}`);
  console.log(`"1" alone idx: ${idx2}`);

  console.log("\n=== TRECHO 30000-34000 ===");
  console.log(fullText.slice(30000, 34000));

  console.log("\n=== TRECHO 60000-64000 ===");
  console.log(fullText.slice(60000, 64000));

  await parser.destroy();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
