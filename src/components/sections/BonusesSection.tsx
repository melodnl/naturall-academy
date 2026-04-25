import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";

const BONUSES = [
  {
    title: "BONUS 01: +50 Cosmetic Recipes from the Men's Line (Beard and Mustache)",
    image: "/images/bonus-01.png",
    paragraphs: [
      "A book with recipes carefully formulated to maintain the health and well-being of men's beards and mustaches.",
      "The recipes are easy to prepare and do not require special equipment. These natural cosmetics are effective and long-lasting, helping to maintain the beauty and shine of men's beards and mustaches for much longer.",
    ],
  },
  {
    title: "BONUS 02: Cost Organization and Cosmetic Sales Price Spreadsheet",
    image: "/images/bonus-02.png",
    paragraphs: [
      "It is a fundamental tool for anyone who wants to sell natural cosmetics.",
      "The spreadsheet makes it easy to calculate the costs and sales price of your products, in addition to helping you analyze prices and profitability.",
    ],
  },
];

export function BonusesSection() {
  return (
    <>
      <section className="bg-black py-5 px-4">
        <h2 className="font-poppins font-extrabold text-white text-center text-[28px] sm:text-[36px] md:text-[44px]">
          YOU WILL ALSO RECEIVE...
        </h2>
      </section>

      <section className="bg-white py-12 px-4">
        <div className="mx-auto max-w-[1140px] flex flex-col items-center">
          <h2 className="font-poppins font-extrabold text-black text-center text-[24px] sm:text-[30px] md:text-[36px] mb-10 max-w-[900px]">
            Acting now you will receive free of charge + 2 SUPER BONUS.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full mb-10">
            {BONUSES.map((b) => (
              <div
                key={b.title}
                className="flex flex-col items-center text-center px-2"
              >
                <Image
                  src={b.image}
                  alt={b.title}
                  width={300}
                  height={300}
                  className="w-[240px] h-auto mb-6"
                />
                <h3 className="font-poppins font-bold text-black text-[22px] sm:text-[26px] md:text-[28px] leading-tight mb-4">
                  {b.title}
                </h3>
                {b.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="font-poppins text-black text-[16px] sm:text-[18px] leading-snug mb-3"
                  >
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <CTAButton href="#COMPR">I WANT MY RECIPES NOW</CTAButton>
        </div>
      </section>
    </>
  );
}
