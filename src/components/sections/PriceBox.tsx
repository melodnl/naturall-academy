import { CTAButton } from "@/components/CTAButton";

export function PriceBox() {
  return (
    <section className="bg-white py-10 px-4">
      <div className="mx-auto max-w-[1140px] flex flex-col items-center text-center gap-4">
        <h2 className="font-poppins font-semibold text-black text-[24px] sm:text-[30px] md:text-[36px]">
          <span className="line-through text-black/70">LIST PRICE $97.00</span>
        </h2>
        <h2 className="font-poppins font-semibold text-black text-[22px] sm:text-[26px] md:text-[30px]">
          NOW FOR JUST
        </h2>
        <h2 className="font-poppins font-extrabold text-[#0b9b00] text-[58px] sm:text-[68px] md:text-[80px] leading-none">
          $4.90
        </h2>
        <h2 className="font-poppins font-semibold text-black text-[16px] sm:text-[18px] md:text-[20px] max-w-[760px]">
          BUT YOU NEED TO ACT QUICKLY… THIS OFFER IS FOR A LIMITED TIME
        </h2>
        <CTAButton href="#COMPR" className="mt-4">
          I WANT MY RECIPES NOW
        </CTAButton>
      </div>
    </section>
  );
}
