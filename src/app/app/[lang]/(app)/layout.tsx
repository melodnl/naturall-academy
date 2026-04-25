import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { BottomNav } from "@/components/app/BottomNav";

export default async function AuthedLayout({
  children,
  params,
}: LayoutProps<"/app/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-[#f0ead6] text-[#3a3a3a]">
      {/* Conteúdo: full-width no mobile, centralizado em desktop */}
      <div className="mx-auto w-full max-w-[480px] pb-24 sm:max-w-[520px]">
        {children}
      </div>
      <BottomNav lang={lang} dict={dict} />
    </div>
  );
}
