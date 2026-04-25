"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Search, Heart, User } from "lucide-react";
import type { Dictionary } from "@/app/app/[lang]/dictionaries";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

export function BottomNav({ lang, dict }: { lang: string; dict: Dictionary }) {
  const pathname = usePathname();
  const base = `/app/${lang}`;

  const items: Item[] = [
    { href: base, label: dict.nav.home, icon: Home },
    { href: `${base}/categorias`, label: dict.nav.categorias, icon: Grid },
    { href: `${base}/buscar`, label: dict.home.buscar.replace("...", ""), icon: Search },
    { href: `${base}/favoritas`, label: dict.nav.favoritas, icon: Heart },
    { href: `${base}/conta`, label: dict.nav.conta, icon: User },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#1e3a2c]/10 bg-white/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto w-full max-w-[480px] sm:max-w-[520px]">
        <ul className="flex items-stretch justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === base ? pathname === base : pathname?.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition ${
                  active ? "text-[#1e3a2c]" : "text-[#6b6b6b] hover:text-[#1e3a2c]"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                    active ? "bg-[#1e3a2c] text-[#f0ead6]" : ""
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
        </ul>
      </div>
    </nav>
  );
}
