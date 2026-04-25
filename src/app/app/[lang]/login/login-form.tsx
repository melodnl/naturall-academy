"use client";

import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "./actions";
import type { Dictionary, Locale } from "../dictionaries";

export function LoginForm({
  dict,
  lang,
  next,
}: {
  dict: Dictionary;
  lang: Locale;
  next: string;
}) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    sendMagicLink,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="next" value={next} />

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-[#1e3a2c]">
          {dict.login.email}
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-lg border border-[#1e3a2c]/20 bg-white px-4 py-3 text-base outline-none focus:border-[#1e3a2c]"
          placeholder="seu@email.com"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#1e3a2c] px-4 py-3 font-semibold text-[#f0ead6] transition hover:bg-[#1e3a2c]/90 disabled:opacity-60"
      >
        {pending ? "..." : dict.login.enviar}
      </button>

      {state?.ok && (
        <p className="rounded-lg bg-[#1e3a2c]/10 p-3 text-sm text-[#1e3a2c]">
          {dict.login.enviado}
        </p>
      )}

      {state && !state.ok && state.code === "not_subscriber" && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          <p>{dict.login.erro_nao_assinante}</p>
        </div>
      )}

      {state && !state.ok && state.code !== "not_subscriber" && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          {state.message}
        </p>
      )}
    </form>
  );
}
