import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const IMG_DIR = path.join(PUBLIC_DIR, "images");
const TEST_DIR = path.join(IMG_DIR, "testimonials");
const SEO_DIR = path.join(PUBLIC_DIR, "seo");

const ASSETS = [
  // Hero
  {
    url: "https://therecipespremium.online/wp-content/uploads/2025/01/20db0b0b-fff4-48c5-9c31-842f5861dd75.png",
    out: path.join(IMG_DIR, "hero.png"),
  },
  // Bonuses
  {
    url: "https://therecipespremium.online/wp-content/uploads/2024/12/background_removed_image_m_WuMHmQTAeLxtYUFDv59A-300x300.png",
    out: path.join(IMG_DIR, "bonus-01.png"),
  },
  {
    url: "https://therecipespremium.online/wp-content/uploads/2024/12/background_removed_image__oPc1rxxQNab_R91MPbeZA-300x300.png",
    out: path.join(IMG_DIR, "bonus-02.png"),
  },
  // Guarantee + secure-pay
  {
    url: "https://therecipespremium.online/wp-content/uploads/2024/12/Design-sem-nome-2024-01-05T204747.442-768x416.png",
    out: path.join(IMG_DIR, "guarantee-banner.png"),
  },
  {
    url: "https://therecipespremium.online/wp-content/uploads/2024/12/compra-segura-vetor-1-1.png",
    out: path.join(IMG_DIR, "compra-segura.png"),
  },
  {
    url: "https://therecipespremium.online/wp-content/uploads/2024/12/Design_sem_nome_-_2024-01-05T210117.091-removebg-preview.png",
    out: path.join(IMG_DIR, "design-misc.png"),
  },
  // 18 testimonials
  ...Array.from({ length: 18 }, (_, i) => ({
    url: `https://therecipespremium.online/wp-content/uploads/2024/12/${i + 1}-1024x1024.png`,
    out: path.join(TEST_DIR, `${i + 1}.png`),
  })),
  // Favicons (try common WP locations)
  {
    url: "https://therecipespremium.online/favicon.ico",
    out: path.join(SEO_DIR, "favicon.ico"),
    optional: true,
  },
];

async function ensureDirs() {
  for (const dir of [PUBLIC_DIR, IMG_DIR, TEST_DIR, SEO_DIR]) {
    if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  }
}

async function fetchOne({ url, out, optional }) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (optional) {
        console.log(`SKIP (${res.status}) ${url}`);
        return { ok: false, url };
      }
      throw new Error(`HTTP ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(out, buf);
    console.log(`OK   ${path.relative(PUBLIC_DIR, out)} (${(buf.length / 1024).toFixed(1)} KB)`);
    return { ok: true, url };
  } catch (err) {
    console.error(`FAIL ${url} — ${err.message}`);
    return { ok: false, url, err: err.message };
  }
}

async function batch(items, size = 4) {
  const results = [];
  for (let i = 0; i < items.length; i += size) {
    const slice = items.slice(i, i + size);
    results.push(...(await Promise.all(slice.map(fetchOne))));
  }
  return results;
}

await ensureDirs();
const results = await batch(ASSETS, 4);
const ok = results.filter((r) => r.ok).length;
const fail = results.length - ok;
console.log(`\nDone: ${ok}/${results.length} OK, ${fail} failed.`);
