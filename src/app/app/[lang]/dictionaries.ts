import "server-only";

const dictionaries = {
  pt: () => import("./dictionaries/pt.json").then((m) => m.default),
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export const SUPPORTED_LOCALES: Locale[] = ["pt", "es", "en"];
export const DEFAULT_LOCALE: Locale = "pt";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
