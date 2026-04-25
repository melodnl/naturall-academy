import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SkinType = "oleosa" | "seca" | "mista" | "sensivel" | "normal" | "nao_sei";
export type HairType = "liso" | "ondulado" | "cacheado" | "crespo" | "sem_cabelo" | "nao_sei";

export type Profile = {
  email: string;
  skin_type: SkinType | null;
  hair_type: HairType | null;
  concerns: string[] | null;
  onboarded_at: string | null;
};

export async function getMyProfile(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return null;
  const { data } = await supabase
    .from("subscribers")
    .select("email, skin_type, hair_type, concerns, onboarded_at")
    .eq("user_id", u.user.id)
    .maybeSingle();
  if (data) return data as Profile;
  // Pode existir subscriber pelo email sem user_id ainda (caso webhook anterior ao cadastro)
  if (u.user.email) {
    const { data: byEmail } = await supabase
      .from("subscribers")
      .select("email, skin_type, hair_type, concerns, onboarded_at")
      .eq("email", u.user.email)
      .maybeSingle();
    return (byEmail as Profile | null) ?? null;
  }
  return null;
}
