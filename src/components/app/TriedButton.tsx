"use client";

import { useActionState, useState } from "react";
import { Check, Star, X } from "lucide-react";
import { markTried, unmarkTried, type AttemptState } from "@/lib/actions/attempts";

const COPY = {
  pt: {
    notTried: "Já fiz essa receita",
    tried: "Feita",
    modalTitle: "Como foi?",
    modalSub: "Sua nota e observações ajudam a personalizar futuras recomendações.",
    rating: "Nota",
    notes: "Observações (opcional)",
    notesPh: "O que rendeu, o que mudaria...",
    save: "Salvar",
    remove: "Remover",
    cancel: "Cancelar",
  },
  es: {
    notTried: "Ya hice esta receta",
    tried: "Hecha",
    modalTitle: "¿Cómo fue?",
    modalSub: "Tu nota y notas ayudan a personalizar recomendaciones futuras.",
    rating: "Puntuación",
    notes: "Notas (opcional)",
    notesPh: "Qué rindió, qué cambiarías...",
    save: "Guardar",
    remove: "Quitar",
    cancel: "Cancelar",
  },
  en: {
    notTried: "I made this recipe",
    tried: "Tried",
    modalTitle: "How did it go?",
    modalSub: "Your rating and notes help personalize future recommendations.",
    rating: "Rating",
    notes: "Notes (optional)",
    notesPh: "What worked, what you'd change...",
    save: "Save",
    remove: "Remove",
    cancel: "Cancel",
  },
} as const;

type Lang = keyof typeof COPY;

export function TriedButton({
  lang,
  recipeId,
  slug,
  initial,
}: {
  lang: Lang;
  recipeId: number;
  slug: string;
  initial: { rating: number | null; notes: string | null } | null;
}) {
  const copy = COPY[lang];
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(initial?.rating ?? 0);
  const [notes, setNotes] = useState<string>(initial?.notes ?? "");
  const [, saveAction, saving] = useActionState<AttemptState, FormData>(markTried, null);
  const [, removeAction, removing] = useActionState<AttemptState, FormData>(unmarkTried, null);

  const tried = !!initial;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition active:scale-95 ${
          tried
            ? "bg-[#1e3a2c] text-[#f0ead6]"
            : "border border-[#1e3a2c]/20 bg-white text-[#1e3a2c] hover:bg-[#1e3a2c]/5"
        }`}
      >
        <Check className="h-4 w-4" />
        {tried ? copy.tried : copy.notTried}
        {tried && initial?.rating ? (
          <span className="ml-1 flex items-center gap-0.5 text-[#d4a96a]">
            <Star className="h-3 w-3 fill-current" />
            {initial.rating}
          </span>
        ) : null}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1e3a2c]">{copy.modalTitle}</h3>
                <p className="mt-1 text-xs text-[#6b6b6b]">{copy.modalSub}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e3a2c]/5"
                aria-label={copy.cancel}
              >
                <X className="h-4 w-4 text-[#1e3a2c]" />
              </button>
            </div>

            <form action={saveAction} className="flex flex-col gap-4">
              <input type="hidden" name="recipe_id" value={recipeId} />
              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="lang" value={lang} />
              <input type="hidden" name="rating" value={rating || ""} />

              <div>
                <div className="mb-1.5 text-xs font-semibold text-[#1e3a2c]">{copy.rating}</div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n === rating ? 0 : n)}
                      className="flex h-10 w-10 items-center justify-center rounded-full transition active:scale-90"
                    >
                      <Star
                        className={`h-7 w-7 transition ${
                          n <= rating
                            ? "fill-[#d4a96a] text-[#d4a96a]"
                            : "text-[#1e3a2c]/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-[#1e3a2c]">{copy.notes}</span>
                <textarea
                  name="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={copy.notesPh}
                  className="rounded-xl border border-[#1e3a2c]/15 bg-white p-3 text-sm outline-none focus:border-[#1e3a2c]"
                />
              </label>

              <div className="mt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-full bg-gradient-to-r from-[#3a7a5c] via-[#b8924f] to-[#d4a96a] px-5 py-3 font-semibold text-white shadow-md shadow-[#b8924f]/30 transition active:scale-95 disabled:opacity-60"
                >
                  {saving ? "..." : copy.save}
                </button>
                {tried && (
                  <button
                    type="submit"
                    formAction={removeAction}
                    disabled={removing}
                    className="rounded-full border border-red-300 px-5 py-3 text-sm font-semibold text-red-700 transition active:scale-95 disabled:opacity-60"
                  >
                    {removing ? "..." : copy.remove}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
