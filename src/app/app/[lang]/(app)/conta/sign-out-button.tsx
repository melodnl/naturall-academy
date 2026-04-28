"use client";

import { LogOut } from "lucide-react";
import { signOutFromAccountAction } from "./actions";
import type { Dictionary } from "../../dictionaries";

export function SignOutButton({ dict }: { dict: Dictionary }) {
  return (
    <form action={signOutFromAccountAction}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 border-t border-[#1e3a2c]/5 px-4 py-3.5 text-left text-red-700 transition active:bg-red-50"
      >
        <LogOut className="h-4 w-4" />
        <span className="text-sm font-medium">{dict.conta.sair}</span>
      </button>
    </form>
  );
}
