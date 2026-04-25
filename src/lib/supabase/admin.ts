import { createClient } from "@supabase/supabase-js";

// Admin client — usa service_role key. NUNCA expor no client.
// Usado apenas em route handlers (webhook) e scripts de seed.
export function createSupabaseAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada");
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
