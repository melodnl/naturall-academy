import { HeroSection } from "@/components/sections/HeroSection";
import { PriceBox } from "@/components/sections/PriceBox";
import { RecipesSection } from "@/components/sections/RecipesSection";
import { BonusesSection } from "@/components/sections/BonusesSection";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { PricingSection } from "@/components/sections/PricingSection";
import { GuaranteeSection } from "@/components/sections/GuaranteeSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen">
      <HeroSection />
      <PriceBox />
      <RecipesSection />
      <BonusesSection />
      <TestimonialsCarousel />
      <PricingSection />
      <GuaranteeSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
