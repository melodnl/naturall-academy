import { notFound } from "next/navigation";
import { hasLocale } from "../dictionaries";
import { OnboardingForm } from "./onboarding-form";

const COPY = {
  pt: {
    tagline: "personalize sua experiência",
    title: "Conte um pouco sobre você",
    subtitle: "3 perguntas rápidas pra recomendar receitas que combinam com você.",
    skin: "Qual seu tipo de pele?",
    hair: "Qual seu tipo de cabelo?",
    concerns: "O que você mais quer cuidar agora?",
    skipButton: "Pular por enquanto",
    saveButton: "Salvar e começar",
  },
  es: {
    tagline: "personaliza tu experiencia",
    title: "Cuéntanos un poco sobre ti",
    subtitle: "3 preguntas rápidas para recomendarte recetas a tu medida.",
    skin: "¿Cuál es tu tipo de piel?",
    hair: "¿Cuál es tu tipo de cabello?",
    concerns: "¿Qué quieres cuidar ahora?",
    skipButton: "Saltar por ahora",
    saveButton: "Guardar y empezar",
  },
  en: {
    tagline: "personalize your experience",
    title: "Tell us a bit about you",
    subtitle: "3 quick questions so we can recommend recipes that fit you.",
    skin: "What's your skin type?",
    hair: "What's your hair type?",
    concerns: "What do you want to focus on now?",
    skipButton: "Skip for now",
    saveButton: "Save and start",
  },
} as const;

export default async function OnboardingPage({ params }: PageProps<"/app/[lang]/onboarding">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const copy = COPY[lang];

  return (
    <main className="mx-auto max-w-md px-5 pt-10 pb-16">
      <header className="mb-7 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#b8924f]">
          {copy.tagline}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#1e3a2c]">{copy.title}</h1>
        <p className="mt-2 text-sm text-[#6b6b6b]">{copy.subtitle}</p>
      </header>
      <OnboardingForm lang={lang} copy={copy} />
    </main>
  );
}
