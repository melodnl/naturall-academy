import { CheckIcon } from "@/components/icons";
import { CTAButton } from "@/components/CTAButton";

const RECIPES = [
  "Recipes for Natural Bar Soaps (aloe vera, green clay, Brazil nuts, coconut, neem, herbs, saffron, etc.).",
  "Recipes for Natural Liquid Soaps (mint, calendula, saffron, giseng, argan oil, chamomile, rosemary, etc.).",
  "Natural Shampoo Recipes (herbs, argan, neem, coconut, sunflower, mint, rosemary, etc.).",
  "Natural Conditioner Recipes (green clay, rosemary, jojoba oil, coconut butter, green clay, neem, etc.).",
  "Natural Moisturizer Recipes (olive, coconut, calendula, cocoa butter, jojoba, almonds, aloe vera, etc.).",
  "Natural Exfoliating Recipes (olive, coconut, calendula, cocoa butter, jojoba, almonds, aloe vera, etc.).",
  "Recipes for Natural Facial Soaps (olive, coconut, calendula, cocoa butter, jojoba, almonds, aloe vera, etc.).",
  "Recipes for Natural Facial Scrubs (olive, coconut, calendula, cocoa butter, jojoba, almonds, aloe vera, etc.).",
  "Recipes for Natural Facial Oils (Rosehip, Chamomile, Vitamin C, Avocado, Coconut, Peppermint, etc.)..",
  "Natural Facial Sunscreen Recipes (Avocado Oil, Carrot Oil, Almond Oil, etc.).",
  "Recipes for Natural Facial Serums (Cucumber, Vitamin C, Chamomile, Pomegranate, Lemon, etc.).",
  "Natural Eye Cream Recipes (cucumber, chamomile, vitamin E, coffee, etc.).",
  "Recipes for Natural Facial Tonics (orange, tomato, mint, pomegranate, avocado, etc.).",
  "Natural Makeup Remover Recipes (coconut oil, castor oil, green tea, aloe vera, etc.).",
  "Natural Micellar Water Recipes (chamomile, cucumber, activated charcoal, lavender, vitamin c, etc.).",
  "FINALLY, THERE ARE ALREADY MORE THAN 600 NATURAL COSMETICS RECIPES, WHICH CONTINUE TO BE UPDATED PERIODICALLY!!",
];

const WHY_CARDS = [
  {
    title: "VALIDATED METHOD",
    body: "You will know exactly how to make natural cosmetics, using the benefits of herbs and plants to take care of your body. You can make natural cosmetics for your own consumption or to sell.",
  },
  {
    title: "EXCLUSIVE KNOWLEDGE",
    body: "You will have access to unique learning that cannot be found anywhere else. I reveal the ancient secrets of natural cosmetics, with the level of detail you need to use the recipes at home.",
  },
  {
    title: "PRACTICALITY!",
    body: "All recipes are quick, simple and applicable. No messing around, no wasting time. After all, we know your time is precious, right?",
  },
  {
    title: "PROFESSIONAL GROWTH",
    body: "The natural cosmetics industry in the United States is flourishing with an annual growth rate of 15%, currently valued at $5 billion, as reported by the American Organic Beauty Show",
  },
];

export function RecipesSection() {
  return (
    <section className="bg-white py-12 px-4">
      <div className="mx-auto max-w-[1140px] flex flex-col items-center">
        <h2 className="font-poppins font-extrabold text-black text-center text-[28px] sm:text-[36px] md:text-[44px] mb-8">
          WHICH RECIPES WILL I HAVE ACCESS TO?
        </h2>
        <ul className="w-full max-w-[900px] flex flex-col gap-3 mb-10">
          {RECIPES.map((r, i) => (
            <li
              key={i}
              className="flex items-start gap-3 font-poppins text-[16px] sm:text-[18px] text-black leading-snug"
            >
              <CheckIcon className="w-5 h-5 mt-1 shrink-0 text-[#24a900]" />
              <span>{r}</span>
            </li>
          ))}
        </ul>

        <CTAButton href="#COMPR" className="mb-14">
          I WANT MY RECIPES NOW
        </CTAButton>

        <h2 className="font-poppins font-extrabold text-black text-center text-[24px] sm:text-[30px] md:text-[36px] mb-10 max-w-[900px]">
          Why should you grab these 600 Natural Cosmetics Recipes right now?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full mb-10">
          {WHY_CARDS.map((c) => (
            <div key={c.title} className="flex flex-col items-center text-center px-2">
              <CheckIcon className="w-12 h-12 text-[#00ff2d] mb-4" />
              <p className="font-poppins font-bold text-[#00ff2d] text-[22px] sm:text-[25px] mb-3">
                {c.title}
              </p>
              <p className="font-poppins text-black text-[16px] sm:text-[18px] leading-snug">
                {c.body}
              </p>
            </div>
          ))}
        </div>

        <CTAButton href="#COMPR">I WANT MY RECIPES NOW</CTAButton>
      </div>
    </section>
  );
}
