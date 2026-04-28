"use client";

import { useActionState, useState } from "react";
import { signInAction, signInWithGoogleAction, type LoginState } from "./actions";
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
    signInAction,
    null,
  );
  const [usePassword, setUsePassword] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <form action={signInWithGoogleAction}>
        <input type="hidden" name="lang" value={lang} />
        <input type="hidden" name="next" value={next} />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#1e3a2c]/20 bg-white px-4 py-3 font-medium text-[#1e3a2c] transition hover:bg-[#f0ead6]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {dict.login.continuar_google}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-[#6b6b6b]">
        <div className="h-px flex-1 bg-[#1e3a2c]/10" />
        <span>{dict.login.ou}</span>
        <div className="h-px flex-1 bg-[#1e3a2c]/10" />
      </div>

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

        {usePassword && (
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[#1e3a2c]">
              {dict.login.senha}
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="rounded-lg border border-[#1e3a2c]/20 bg-white px-4 py-3 text-base outline-none focus:border-[#1e3a2c]"
              placeholder="••••••••"
            />
          </label>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#1e3a2c] px-4 py-3 font-semibold text-[#f0ead6] transition hover:bg-[#1e3a2c]/90 disabled:opacity-60"
        >
          {pending ? "..." : usePassword ? dict.login.entrar : dict.login.enviar}
        </button>

        <button
          type="button"
          onClick={() => setUsePassword((v) => !v)}
          className="text-center text-xs font-medium text-[#b8924f] hover:underline"
        >
          {usePassword ? dict.login.usar_magic_link : dict.login.usar_senha}
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

        {state && !state.ok && state.code === "invalid_credentials" && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {dict.login.erro_credenciais}
          </p>
        )}

        {state &&
          !state.ok &&
          state.code !== "not_subscriber" &&
          state.code !== "invalid_credentials" && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {state.message}
            </p>
          )}
      </form>
    </div>
  );
}
