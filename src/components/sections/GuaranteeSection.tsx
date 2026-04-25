import Image from "next/image";

export function GuaranteeSection() {
  return (
    <section className="bg-white py-12 px-4">
      <div className="mx-auto max-w-[1140px] flex flex-col items-center text-center gap-6">
        <Image
          src="/images/guarantee-banner.png"
          alt="7 days guarantee"
          width={768}
          height={416}
          className="w-full max-w-[360px] h-auto"
        />
        <h2 className="font-poppins font-extrabold text-black text-[26px] sm:text-[32px] md:text-[40px] leading-tight">
          Buy now and have 7 days to decide if it&apos;s for you!
        </h2>
        <p className="font-poppins text-black text-[16px] sm:text-[18px] leading-relaxed max-w-[900px]">
          If you are still unsure whether you will like our EBOOKS, I will make
          this decision much easier for you. I am so confident that these
          booklets will help you transform your life that I will give you a
          7-day guarantee and if you see that it is not for you, we will refund
          your money. All rights reserved
        </p>
      </div>
    </section>
  );
}
