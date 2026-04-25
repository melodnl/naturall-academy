import Image from "next/image";

export function HeroSection() {
  return (
    <section className="bg-hero-gradient pt-5 pb-2 px-4">
      <div className="mx-auto max-w-[1140px] flex flex-col items-center text-center">
        <div className="w-full max-w-[934px] mx-auto">
          <Image
            src="/images/hero.png"
            alt="600 Natural Cosmetic Recipes"
            width={1024}
            height={1024}
            priority
            className="w-full h-auto"
          />
        </div>
        <h1 className="font-poppins font-extrabold text-white text-center text-[34px] leading-[1.05] sm:text-[44px] md:text-[60px] md:leading-[60px] tracking-[-0.1px] max-w-[830px] mt-6">
          THE POWER OF NATURAL COSMETICS: RECEIVE MORE THAN 600 RECIPES!!!
        </h1>
        <h2 className="font-poppins font-medium text-white text-center text-[18px] sm:text-[22px] md:text-[26px] leading-snug max-w-[900px] mt-6">
          Revitalize your skin with our Complete Package of over 600 NATURAL
          Cosmetic Recipes, and stop using chemicals!
        </h2>
      </div>
    </section>
  );
}
