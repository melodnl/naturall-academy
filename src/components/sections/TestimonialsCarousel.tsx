"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

const SLIDES = Array.from({ length: 18 }, (_, i) => `/images/testimonials/${i + 1}.png`);

export function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    setSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => setSnaps(emblaApi.scrollSnapList()));
    onSelect();
  }, [emblaApi]);

  return (
    <section className="bg-black py-12 px-4">
      <h2 className="font-poppins font-extrabold text-white text-center text-[24px] sm:text-[30px] md:text-[40px] mb-10 max-w-[1100px] mx-auto leading-tight">
        WHAT OUR MEMBERS SAY WHEN THEY JOIN THE NATURAL COSMETICS TEAM
      </h2>

      <div className="relative max-w-[1140px] mx-auto">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {SLIDES.map((src, i) => (
              <div
                key={i}
                className="basis-full sm:basis-1/2 md:basis-1/3 shrink-0 grow-0 px-3"
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={src}
                    alt={`Testimonial ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          aria-label="Slide anterior"
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          aria-label="Próximo slide"
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-8 flex-wrap max-w-[600px] mx-auto">
        {snaps.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir para o slide ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === selected ? "bg-white w-6" : "bg-white/40 w-2"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
