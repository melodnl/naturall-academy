"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type OnboardingState =
  | { ok: true }
  | { ok: false; message: string }
  | null;

export async function saveOnboarding(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const skin = String(formData.get("skin_type") ?? "");
  const hair = String(formData.get("hair_type") ?? "");
  const concerns = formData.getAll("concerns").map(String).filter(Boolean);
  const lang = String(formData.get("lang") ?? "pt");

  const supabase = await createSupabaseServerClient();
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return { ok: false, message: "Não autenticado." };

  const admin = createSupabaseAdminClient();
  // Upsert por email — o webhook pode ter criado a row antes do user existir
  const email = u.user.email!;
  const { error } = await admin
    .from("subscribers")
    .update({
      user_id: u.user.id,
      skin_type: skin || null,
      hair_type: hair || null,
      concerns: concerns.length ? concerns : null,
      onboarded_at: new Date().toISOString(),
    })
    .eq("email", email);

  if (error) return { ok: false, message: error.message };

  revalidatePath(`/app/${lang}`);
  redirect(`/app/${lang}`);
}
