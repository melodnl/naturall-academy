import { notFound } from "next/navigation";
import { hasLocale, SUPPORTED_LOCALES } from "./dictionaries";

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export default async function AppLocaleLayout({
  children,
  params,
}: LayoutProps<"/app/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <div className="min-h-screen bg-[#f0ead6] text-[#3a3a3a]">{children}</div>;
}
