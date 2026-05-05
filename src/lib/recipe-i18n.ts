import type { Locale } from "@/app/app/[lang]/dictionaries";

const CATEGORY_SUB: Record<string, { pt: string; es: string }> = {
  "Anti-Aging Treatments": { pt: "Tratamentos Anti-idade", es: "Tratamientos Antiedad" },
  "Body Butters & Lotions": { pt: "Manteigas & Loções Corporais", es: "Mantecas y Lociones Corporales" },
  "Body Scrubs": { pt: "Esfoliantes Corporais", es: "Exfoliantes Corporales" },
  "Eye Care": { pt: "Cuidados com os Olhos", es: "Cuidado de Ojos" },
  "Facial Cleansers": { pt: "Limpadores Faciais", es: "Limpiadores Faciales" },
  "Facial Masks": { pt: "Máscaras Faciais", es: "Mascarillas Faciales" },
  "Facial Moisturizers": { pt: "Hidratantes Faciais", es: "Hidratantes Faciales" },
  "Facial Serums": { pt: "Séruns Faciais", es: "Sérums Faciales" },
  "Facial Toners & Mists": { pt: "Tônicos & Brumas Faciais", es: "Tónicos y Brumas Faciales" },
  "Hair Conditioners & Masks": { pt: "Condicionadores & Máscaras Capilares", es: "Acondicionadores y Mascarillas Capilares" },
  "Hand & Foot Care": { pt: "Cuidados com Mãos & Pés", es: "Cuidado de Manos y Pies" },
  "Lip Balms & Scrubs": { pt: "Bálsamos & Esfoliantes Labiais", es: "Bálsamos y Exfoliantes Labiales" },
  "Men's Grooming": { pt: "Cuidados Masculinos", es: "Cuidado Masculino" },
  "Natural Deodorants": { pt: "Desodorantes Naturais", es: "Desodorantes Naturales" },
  "Natural Shampoos": { pt: "Shampoos Naturais", es: "Champús Naturales" },
};

const SKIN_HAIR: Record<string, { pt: string; es: string }> = {
  "All — lip care": { pt: "Todos — cuidado labial", es: "Todos — cuidado labial" },
  "All beard types": { pt: "Todos os tipos de barba", es: "Todos los tipos de barba" },
  "All body skin": { pt: "Todas as peles corporais", es: "Todas las pieles corporales" },
  "All hair types": { pt: "Todos os tipos de cabelo", es: "Todos los tipos de cabello" },
  "All skin": { pt: "Todas as peles", es: "Todas las pieles" },
  "All skin types": { pt: "Todos os tipos de pele", es: "Todos los tipos de piel" },
  "All skin types — delicate eye area": { pt: "Todos os tipos de pele — área dos olhos", es: "Todos los tipos de piel — zona de los ojos" },
  "Baking-soda-sensitive": { pt: "Sensível a bicarbonato", es: "Sensible al bicarbonato" },
  "Coarse beard": { pt: "Barba grossa", es: "Barba gruesa" },
  "Color-treated": { pt: "Cabelo com química", es: "Cabello con tinte" },
  "Combination": { pt: "Mista", es: "Mixta" },
  "Cracked heels": { pt: "Calcanhares rachados", es: "Talones agrietados" },
  "Curly / coily": { pt: "Cacheado / crespo", es: "Rizado / afro" },
  "Dry / damaged": { pt: "Seco / danificado", es: "Seco / dañado" },
  "Dry / damaged hair": { pt: "Cabelo seco / danificado", es: "Cabello seco / dañado" },
  "Dry / dehydrated": { pt: "Seco / desidratado", es: "Seco / deshidratado" },
  "Dry / rough": { pt: "Seco / áspero", es: "Seco / áspero" },
  "Dry / very dry": { pt: "Seco / muito seco", es: "Seco / muy seco" },
  "Dull /": { pt: "Sem viço", es: "Apagada" },
  "Dull / dehydrated": { pt: "Sem viço / desidratada", es: "Apagada / deshidratada" },
  "Dull / tired": { pt: "Sem viço / cansada", es: "Apagada / cansada" },
  "Fine hair": { pt: "Cabelo fino", es: "Cabello fino" },
  "First signs of aging": { pt: "Primeiros sinais de idade", es: "Primeros signos de edad" },
  "Mature": { pt: "Madura", es: "Madura" },
  "Mature body skin": { pt: "Pele corporal madura", es: "Piel corporal madura" },
  "Mature skin": { pt: "Pele madura", es: "Piel madura" },
  "Normal": { pt: "Normal", es: "Normal" },
  "Normal to dry": { pt: "Normal a seca", es: "Normal a seca" },
  "Oily /": { pt: "Oleosa", es: "Grasa" },
  "Oily / combination": { pt: "Oleosa / mista", es: "Grasa / mixta" },
  "Oily scalp": { pt: "Couro cabeludo oleoso", es: "Cuero cabelludo graso" },
  "Sensitive": { pt: "Sensível", es: "Sensible" },
  "Sensitive scalp": { pt: "Couro cabeludo sensível", es: "Cuero cabelludo sensible" },
  "Sensitive skin": { pt: "Pele sensível", es: "Piel sensible" },
  "Sensitive underarms": { pt: "Axilas sensíveis", es: "Axilas sensibles" },
  "Very dry hands / feet": { pt: "Mãos / pés muito secos", es: "Manos / pies muy secos" },
};

export function translateCategorySub(value: string | null, locale: Locale): string | null {
  if (!value) return value;
  if (locale === "en") return value;
  return CATEGORY_SUB[value]?.[locale] ?? value;
}

export function translateSkinHair(value: string | null, locale: Locale): string | null {
  if (!value) return value;
  if (locale === "en") return value;
  return SKIN_HAIR[value]?.[locale] ?? value;
}

export function translateYieldText(value: string | null, locale: Locale): string | null {
  if (!value) return value;
  if (locale === "en") return value;
  // "100 ml (3.4 fl oz)" → "100 ml (3,4 fl oz)" in pt/es uses comma
  // "87 g (3.07 oz) dry blend" → translate "dry blend"
  let v = value;
  if (locale === "pt") {
    v = v.replace(/dry blend/gi, "mistura seca");
  } else if (locale === "es") {
    v = v.replace(/dry blend/gi, "mezcla seca");
  }
  return v;
}
