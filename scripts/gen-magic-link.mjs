import { createClient } from "@supabase/supabase-js";

const URL = "https://twmubyblsgzczifkvgof.supabase.co";
const KEY = process.env.SRK;
const EMAIL = process.argv[2] ?? "comercial.melodaniel@gmail.com";

const admin = createClient(URL, KEY, { auth: { persistSession: false } });

const { data, error } = await admin.auth.admin.generateLink({
  type: "magiclink",
  email: EMAIL,
  options: {
    redirectTo: "https://naturallacademy.com/auth/callback?next=%2Fapp%2Fpt",
  },
});

if (error) {
  console.error("ERRO:", error);
  process.exit(1);
}

console.log("Action link:", data.properties.action_link);
console.log("Verification token:", data.properties.hashed_token);
console.log("Email OTP token:", data.properties.email_otp);
console.log("Redirect to:", data.properties.redirect_to);
