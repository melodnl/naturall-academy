"use client";

import { useState } from "react";
import { CaretRightIcon, CaretUpIcon } from "@/components/icons";

const FAQS = [
  { q: "Do I need to pay any monthly amount?", a: "No, payment is made only once." },
  {
    q: "How will I receive access?",
    a: "As soon as the purchase is completed, you will receive all access data in your email.",
  },
  {
    q: "What is the value of the material?",
    a: "Just $4.90 upfront or the Premium Package which is $6.90 upfront",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-faq-gradient py-12 px-4">
      <div className="mx-auto max-w-[900px] flex flex-col items-center">
        <h2 className="font-poppins font-extrabold text-white text-center text-[28px] sm:text-[36px] md:text-[44px] mb-8">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <div className="w-full flex flex-col gap-2">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-white/30">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 py-4 text-left text-white font-poppins text-[18px] sm:text-[22px] md:text-[25px] hover:opacity-90 transition"
                  aria-expanded={isOpen}
                >
                  {isOpen ? (
                    <CaretUpIcon className="w-4 h-4 shrink-0" />
                  ) : (
                    <CaretRightIcon className="w-3 h-4 shrink-0" />
                  )}
                  <span className="flex-1">{item.q}</span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 pb-4" : "max-h-0"
                  }`}
                >
                  <p className="text-white/90 font-poppins text-[16px] sm:text-[18px] pl-8">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
