"use client";

import { useActionState, useState } from "react";
import { KeyRound } from "lucide-react";
import { updatePasswordAction, type PasswordState } from "./actions";
import type { Dictionary } from "../../dictionaries";

export function PasswordForm({ dict }: { dict: Dictionary }) {
  const [state, formAction, pending] = useActionState<PasswordState, FormData>(
    updatePasswordAction,
    null,
  );
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-[#f0ead6]"
      >
        <KeyRound className="h-4 w-4 text-[#b8924f]" />
        <span className="text-sm font-medium text-[#1e3a2c]">
          {dict.conta.definir_senha}
        </span>
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-[#b8924f]" />
        <span className="text-sm font-semibold text-[#1e3a2c]">
          {dict.conta.definir_senha}
        </span>
      </div>

      <input
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        placeholder={dict.conta.nova_senha}
        className="rounded-lg border border-[#1e3a2c]/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1e3a2c]"
      />
      <input
        name="confirm"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        placeholder={dict.conta.confirmar_senha}
        className="rounded-lg border border-[#1e3a2c]/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1e3a2c]"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-lg bg-[#1e3a2c] px-4 py-2.5 text-sm font-semibold text-[#f0ead6] transition hover:bg-[#1e3a2c]/90 disabled:opacity-60"
        >
          {pending ? "..." : dict.conta.salvar}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-[#1e3a2c]/20 px-4 py-2.5 text-sm font-medium text-[#1e3a2c]"
        >
          {dict.conta.cancelar}
        </button>
      </div>

      {state?.ok && (
        <p className="rounded-lg bg-[#1e3a2c]/10 p-2.5 text-xs text-[#1e3a2c]">
          {state.message}
        </p>
      )}
      {state && !state.ok && (
        <p className="rounded-lg bg-red-50 p-2.5 text-xs text-red-800">
          {state.message}
        </p>
      )}
    </form>
  );
}
