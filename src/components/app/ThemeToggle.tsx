"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

const TOGGLE_LABEL: Record<string, { light: string; dark: string }> = {
  pt: { light: "Mudar para modo claro", dark: "Mudar para modo escuro" },
  es: { light: "Cambiar a modo claro", dark: "Cambiar a modo oscuro" },
  en: { light: "Switch to light mode", dark: "Switch to dark mode" },
};

export function ThemeToggle({
  className = "",
  lang = "pt",
}: {
  className?: string;
  lang?: string;
}) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  const labels = TOGGLE_LABEL[lang] ?? TOGGLE_LABEL.pt;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? labels.light : labels.dark}
      className={
        className ||
        "flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#f0ead6] backdrop-blur transition active:scale-95"
      }
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
