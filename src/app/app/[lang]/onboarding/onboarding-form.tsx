"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveOnboarding, type OnboardingState } from "@/lib/actions/profile";
import type { Locale } from "../dictionaries";

const SKIN_OPTIONS = [
  { value: "oleosa", pt: "Oleosa", es: "Grasa", en: "Oily", emoji: "💧" },
  { value: "seca", pt: "Seca", es: "Seca", en: "Dry", emoji: "🌵" },
  { value: "mista", pt: "Mista", es: "Mixta", en: "Combination", emoji: "🔀" },
  { value: "sensivel", pt: "Sensível", es: "Sensible", en: "Sensitive", emoji: "🌸" },
  { value: "normal", pt: "Normal", es: "Normal", en: "Normal", emoji: "✨" },
  { value: "nao_sei", pt: "Não sei", es: "No sé", en: "Not sure", emoji: "🤷" },
] as const;

const HAIR_OPTIONS = [
  { value: "liso", pt: "Liso", es: "Liso", en: "Straight", emoji: "💁" },
  { value: "ondulado", pt: "Ondulado", es: "Ondulado", en: "Wavy", emoji: "🌊" },
  { value: "cacheado", pt: "Cacheado", es: "Rizado", en: "Curly", emoji: "🌀" },
  { value: "crespo", pt: "Crespo", es: "Afro", en: "Coily", emoji: "🌪️" },
  { value: "sem_cabelo", pt: "Sem cabelo", es: "Sin pelo", en: "No hair", emoji: "🪞" },
  { value: "nao_sei", pt: "Não sei", es: "No sé", en: "Not sure", emoji: "🤷" },
] as const;

const CONCERN_OPTIONS = [
  { value: "acne", pt: "Acne / oleosidade", es: "Acné / grasa", en: "Acne / oiliness" },
  { value: "hidratacao", pt: "Hidratação", es: "Hidratación", en: "Hydration" },
  { value: "antiidade", pt: "Anti-idade", es: "Antiedad", en: "Anti-aging" },
  { value: "manchas", pt: "Manchas / clareamento", es: "Manchas / aclarado", en: "Spots / brightening" },
  { value: "cabelo_seco", pt: "Cabelo seco", es: "Pelo seco", en: "Dry hair" },
  { value: "cabelo_caspa", pt: "Caspa / couro cabeludo", es: "Caspa / cuero", en: "Dandruff / scalp" },
  { value: "labios", pt: "Lábios ressecados", es: "Labios secos", en: "Dry lips" },
  { value: "maos_unhas", pt: "Mãos / unhas", es: "Manos / uñas", en: "Hands / nails" },
] as const;

type Copy = {
  skin: string;
  hair: string;
  concerns: string;
  skipButton: string;
  saveButton: string;
};

export function OnboardingForm({ lang, copy }: { lang: Locale; copy: Copy }) {
  const [state, formAction, pending] = useActionState<OnboardingState, FormData>(
    saveOnboarding,
    null,
  );
  const [skin, setSkin] = useState<string>("");
  const [hair, setHair] = useState<string>("");
  const [concerns, setConcerns] = useState<string[]>([]);

  function toggleConcern(v: string) {
    setConcerns((cs) => (cs.includes(v) ? cs.filter((c) => c !== v) : [...cs, v]));
  }

  const baseOpt =
    "flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition select-none";
  const optOff = "border-[#1e3a2c]/15 bg-white text-[#1e3a2c]";
  const optOn = "border-[#1e3a2c] bg-[#1e3a2c] text-[#f0ead6]";

  return (
    <form action={formAction} className="flex flex-col gap-7">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="skin_type" value={skin} />
      <input type="hidden" name="hair_type" value={hair} />
      {concerns.map((c) => (
        <input key={c} type="hidden" name="concerns" value={c} />
      ))}

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-[#1e3a2c]">{copy.skin}</legend>
        <div className="grid grid-cols-2 gap-2">
          {SKIN_OPTIONS.map((o) => (
            <button
              type="button"
              key={o.value}
              onClick={() => setSkin(o.value === skin ? "" : o.value)}
              className={`${baseOpt} ${skin === o.value ? optOn : optOff}`}
            >
              <span className="text-lg">{o.emoji}</span>
              <span>{o[lang]}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-[#1e3a2c]">{copy.hair}</legend>
        <div className="grid grid-cols-2 gap-2">
          {HAIR_OPTIONS.map((o) => (
            <button
              type="button"
              key={o.value}
              onClick={() => setHair(o.value === hair ? "" : o.value)}
              className={`${baseOpt} ${hair === o.value ? optOn : optOff}`}
            >
              <span className="text-lg">{o.emoji}</span>
              <span>{o[lang]}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-[#1e3a2c]">{copy.concerns}</legend>
        <div className="flex flex-wrap gap-2">
          {CONCERN_OPTIONS.map((o) => {
            const on = concerns.includes(o.value);
            return (
              <button
                type="button"
                key={o.value}
                onClick={() => toggleConcern(o.value)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition select-none ${
                  on
                    ? "border-[#1e3a2c] bg-[#1e3a2c] text-[#f0ead6]"
                    : "border-[#1e3a2c]/15 bg-white text-[#1e3a2c]"
                }`}
              >
                <span>{o[lang]}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {state && !state.ok && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{state.message}</p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-to-r from-[#3a7a5c] via-[#b8924f] to-[#d4a96a] px-5 py-3.5 font-semibold text-white shadow-lg shadow-[#b8924f]/30 transition active:scale-95 disabled:opacity-60"
        >
          {pending ? "..." : copy.saveButton}
        </button>
        <Link
          href={`/app/${lang}`}
          className="text-center text-sm text-[#6b6b6b] underline"
        >
          {copy.skipButton}
        </Link>
      </div>
    </form>
  );
}
