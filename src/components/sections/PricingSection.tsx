import { CheckCircleIcon } from "@/components/icons";
import { CTAButton } from "@/components/CTAButton";

const BASIC_FEATURES = ["600 cosmetic recipes"];

const MEGA_FEATURES = [
  "Natural Cosmetics Package: + 600 Recipes",
  "+50 Natural Facial Mask Recipes for All Skin Types",
  "+70 Recipes for Natural Products for Nails and Cuticles",
  "+100 Natural Deodorant Recipes",
  "+150 Natural Perfume Recipes",
  "+200 Natural Insect Repellent Recipes",
  "Bonus #1: 50 Recipes from the Men's Line (Beard and Mustache)",
  "Bonus #2: Cosmetics Cost and Sales Price Spreadsheet",
  "Complete Step by Step",
  "6 Exclusive Bonuses",
  "IMMEDIATE access (no monthly fee)",
  "Unconditional 7-day guarantee",
];

const BASIC_HREF =
  "https://therecipespremium.online/upgrade/?utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=&xcod=jLj69dc72477c0b2c51dc11df81hQwK21wXxRhQwK21wXxRhQwK21wXxRhQwK21wXxR&sck=jLj69dc72477c0b2c51dc11df81hQwK21wXxRhQwK21wXxRhQwK21wXxRhQwK21wXxR";
const MEGA_HREF =
  "https://pay.hotmart.com/D89688031A?checkoutMode=10&bid=1704557148757&utm_source=organic&utm_campaign=&utm_medium=&utm_content=&utm_term=&xcod=jLj69dc72477c0b2c51dc11df81hQwK21wXxRhQwK21wXxRhQwK21wXxRhQwK21wXxR&sck=jLj69dc72477c0b2c51dc11df81hQwK21wXxRhQwK21wXxRhQwK21wXxRhQwK21wXxR";

export function PricingSection() {
  return (
    <section id="COMPR" className="bg-black py-16 px-4">
      <div className="mx-auto max-w-[1140px] flex flex-col items-center">
        <h2 className="font-poppins font-extrabold text-white text-center text-[28px] sm:text-[36px] md:text-[44px] mb-3">
          CHOOSE THE BEST OPTION FOR YOU!
        </h2>
        <p className="text-white text-center mb-10 font-poppins">
          <strong>(RELEASED FOR A SHORT TIME)</strong>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          {/* Basic Plan */}
          <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center max-w-[465px] mx-auto w-full">
            <h3 className="font-poppins font-bold text-black text-[28px] sm:text-[32px] mb-6">
              Basic Plan
            </h3>
            <div className="mb-6">
              <span className="font-poppins font-bold text-black text-[36px] align-top">$</span>
              <span className="font-poppins font-extrabold text-black text-[64px] sm:text-[72px] leading-none">
                4,90
              </span>
            </div>
            <ul className="w-full flex flex-col gap-3 mb-8">
              {BASIC_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 font-poppins text-black text-[18px]"
                >
                  <CheckCircleIcon className="w-5 h-5 text-[#24a900] shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <CTAButton href={BASIC_HREF} external className="mb-6">
              I WANT TO START NOW
            </CTAButton>
            <p className="font-poppins text-black/80 text-[14px] leading-snug">
              But before you buy… we have one that can present you with an EVEN
              MORE advantageous plan for you! RECEIVE THE SUSTAINABLE BEAUTY
              MEGA COMBO! WITH VARIOUS COURSES AND MORE BONUSES FOR AN
              EXCLUSIVE PROMOTION ⬇️⬇️⬇️⬇️⬇️
            </p>
          </div>

          {/* Mega Combo */}
          <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center max-w-[600px] mx-auto w-full border-4 border-[#24a900] relative">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#24a900] text-white font-poppins font-bold text-[14px] px-4 py-1 rounded-full uppercase tracking-wide">
              BEST SELLER
            </span>
            <h3 className="font-poppins font-semibold text-black text-[26px] sm:text-[32px] md:text-[38px] leading-tight mb-4 mt-2">
              SUSTAINABLE BEAUTY MEGA COMBO
            </h3>
            <p className="font-poppins font-semibold text-black/60 line-through text-[24px] sm:text-[28px] mb-1">
              $147.00
            </p>
            <p className="font-poppins font-bold text-black text-[20px] sm:text-[24px] mb-1">
              FOR ONLY
            </p>
            <p className="font-poppins font-extrabold text-[#24a900] text-[44px] sm:text-[56px] md:text-[64px] leading-none mb-6">
              $ 6.90
            </p>

            <ul className="w-full flex flex-col gap-3 mb-6 text-left">
              {MEGA_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 font-poppins text-black text-[15px] sm:text-[17px]"
                >
                  <CheckCircleIcon className="w-5 h-5 mt-1 text-[#24a900] shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <h4 className="font-poppins font-extrabold text-black text-[20px] sm:text-[24px] mb-5 uppercase">
              BUT YOU NEED TO ACT FAST...
            </h4>
            <CTAButton href={MEGA_HREF} variant="mega" external className="mb-4">
              YES, I WANT THIS SUPER OFFER!
            </CTAButton>
            <h4 className="font-poppins font-bold text-[#24a900] text-[16px] sm:text-[18px] uppercase">
              LAST SPOTS AVAILABLE!
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
}
