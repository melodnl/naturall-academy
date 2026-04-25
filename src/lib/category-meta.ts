import type { CategorySlug } from "@/lib/db/recipes";

export const CATEGORY_META: Record<
  CategorySlug,
  { emoji: string; gradient: string }
> = {
  facial: { emoji: "✨", gradient: "from-[#1e3a2c] to-[#2d5240]" },
  corporal: { emoji: "🌿", gradient: "from-[#2d5240] to-[#1e3a2c]" },
  cabelo: { emoji: "💆", gradient: "from-[#b8924f] to-[#d4a96a]" },
  maos_pes: { emoji: "🤲", gradient: "from-[#1e3a2c] to-[#b8924f]" },
  labios: { emoji: "💋", gradient: "from-[#b8924f] to-[#1e3a2c]" },
  outros: { emoji: "🌸", gradient: "from-[#2d5240] to-[#b8924f]" },
};

// Emoji por categoria pra usar em ícones de receita (sem imagem real)
export function emojiForRecipe(category: CategorySlug, number: number): string {
  const pool: Record<CategorySlug, string[]> = {
    facial: ["🧴", "💧", "✨", "🌹", "🍵"],
    corporal: ["🌿", "🍯", "🧖", "🪻", "🥥"],
    cabelo: ["💆", "🧴", "🌾", "🍶", "🪴"],
    maos_pes: ["🤲", "🦶", "💅", "🌱", "🧴"],
    labios: ["💋", "🍓", "🍯", "🌷", "🍫"],
    outros: ["🌸", "🌼", "🪻", "💎", "🌺"],
  };
  const arr = pool[category];
  return arr[number % arr.length];
}
