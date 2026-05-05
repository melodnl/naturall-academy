// Webhook Hotmart 2.0.0 — recebe eventos de compra/cancelamento e ativa/bloqueia subscriber.
// Configurar na Hotmart (Ferramentas → Webhook):
//   URL: https://naturallacademy.com/api/webhook/hotmart
//   Versao: 2.0.0
//   Eventos: PURCHASE_APPROVED, PURCHASE_REFUNDED, PURCHASE_CHARGEBACK,
//            PURCHASE_CANCELED, SUBSCRIPTION_CANCELLATION
// Validacao: Hotmart envia o HOTTOK no header X-Hotmart-Hottok.

import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type HotmartEvent =
  | "PURCHASE_APPROVED"
  | "PURCHASE_COMPLETE"
  | "PURCHASE_REFUNDED"
  | "PURCHASE_CHARGEBACK"
  | "PURCHASE_CANCELED"
  | "PURCHASE_BILLET_PRINTED"
  | "PURCHASE_DELAYED"
  | "PURCHASE_PROTEST"
  | "PURCHASE_EXPIRED"
  | "SUBSCRIPTION_CANCELLATION"
  | "SWITCH_PLAN"
  | "UPDATE_SUBSCRIPTION_CHARGE_DATE";

type HotmartPayload = {
  id?: string;
  event: HotmartEvent;
  version?: string;
  data: {
    buyer?: {
      email?: string;
      name?: string;
      checkout_phone?: string;
      language?: string;
      custom_fields?: Record<string, string> | { name: string; value: string }[];
    };
    subscriber?: {
      email?: string;
      name?: string;
      code?: string;
    };
    customer?: { email?: string; name?: string };
    purchase?: {
      transaction?: string;
      order_date?: number;
      approved_date?: number;
      status?: string;
      offer?: { code?: string };
      subscription?: {
        plan?: { name?: string };
        subscriber?: { code?: string };
        date_next_charge?: number;
      };
    };
    product?: { id?: number; name?: string };
    subscription?: {
      plan?: { name?: string };
      status?: string;
      date_next_charge?: number;
    };
  };
};

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

function verifyHottok(req: NextRequest): boolean {
  const secret = process.env.HOTMART_WEBHOOK_HOTTOK;
  if (!secret) return false;
  const hottok =
    req.headers.get("x-hotmart-hottok") ??
    req.headers.get("X-Hotmart-Hottok") ??
    req.nextUrl.searchParams.get("hottok") ??
    "";
  if (!hottok) return false;
  return constantTimeEqual(hottok, secret);
}

function planNameToSlug(name?: string): "basico" | "mega" | null {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes("mega") || n.includes("combo") || n.includes("complete") || n.includes("vip")) return "mega";
  if (n.includes("basic") || n.includes("básic") || n.includes("essencial")) return "basico";
  return null;
}

// Mapeia product_id Hotmart → locale. Cada produto é vendido para um idioma específico
// (campanhas segmentadas por idioma), então o product_id é a fonte mais confiável.
const HOTMART_PRODUCT_LOCALE: Record<number, "pt" | "es" | "en"> = {
  7626592: "en",
  7678320: "es",
  7678129: "pt",
};

function detectLocale(payload: HotmartPayload): "pt" | "es" | "en" | null {
  // 1) Product ID (fonte canônica — cada produto = um idioma)
  const pid = payload.data.product?.id;
  if (pid && HOTMART_PRODUCT_LOCALE[pid]) return HOTMART_PRODUCT_LOCALE[pid];

  // 2) Idioma do checkout (Hotmart marketplace)
  const lang = payload.data.buyer?.language?.toLowerCase() ?? "";
  if (lang.startsWith("pt")) return "pt";
  if (lang.startsWith("es")) return "es";
  if (lang.startsWith("en")) return "en";

  // 3) Custom field "idioma"/"language" (caso configurado no checkout)
  const cf = payload.data.buyer?.custom_fields;
  const fields: Record<string, string> = {};
  if (Array.isArray(cf)) {
    for (const { name, value } of cf) fields[name.toLowerCase()] = String(value).toLowerCase();
  } else if (cf) {
    for (const [k, v] of Object.entries(cf)) fields[k.toLowerCase()] = String(v).toLowerCase();
  }
  const fieldVal = fields["idioma"] ?? fields["language"] ?? fields["lang"] ?? "";
  if (fieldVal.startsWith("pt") || fieldVal.includes("portug")) return "pt";
  if (fieldVal.startsWith("es") || fieldVal.includes("español") || fieldVal.includes("espanhol")) return "es";
  if (fieldVal.startsWith("en") || fieldVal.includes("ingles") || fieldVal.includes("english")) return "en";

  return null;
}

function tsToIso(t?: number): string | null {
  if (!t) return null;
  // Hotmart envia em ms. Normaliza pra ISO.
  const ms = t > 1e12 ? t : t * 1000;
  return new Date(ms).toISOString();
}

export async function POST(req: NextRequest) {
  if (!verifyHottok(req)) {
    return NextResponse.json({ error: "invalid hottok" }, { status: 401 });
  }

  let payload: HotmartPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const email = (
    payload.data.buyer?.email ??
    payload.data.subscriber?.email ??
    payload.data.customer?.email ??
    ""
  )
    .trim()
    .toLowerCase();
  const event = payload.event;
  if (!email || !event) {
    console.warn("[hotmart webhook] missing email/event", { event, keys: Object.keys(payload.data ?? {}) });
    return NextResponse.json(
      { error: "missing email or event", event, data_keys: Object.keys(payload.data ?? {}) },
      { status: 400 },
    );
  }

  const supabase = createSupabaseAdminClient();

  const planName =
    payload.data.purchase?.subscription?.plan?.name ??
    payload.data.subscription?.plan?.name ??
    payload.data.product?.name;
  const plan = planNameToSlug(planName);
  const orderId =
    payload.data.purchase?.transaction ??
    payload.data.purchase?.subscription?.subscriber?.code ??
    null;
  const expiresAt =
    tsToIso(payload.data.purchase?.subscription?.date_next_charge) ??
    tsToIso(payload.data.subscription?.date_next_charge);
  const locale = detectLocale(payload);

  const baseUpsert: Record<string, unknown> = {
    email,
    source: "hotmart",
    external_order_id: orderId,
    plan,
    updated_at: new Date().toISOString(),
  };
  if (locale) baseUpsert.preferred_locale = locale;

  let status: string;
  const extra: Record<string, unknown> = {};

  switch (event) {
    case "PURCHASE_APPROVED":
    case "PURCHASE_COMPLETE":
      status = "active";
      if (expiresAt) extra.expires_at = expiresAt;
      break;
    case "SUBSCRIPTION_CANCELLATION":
    case "PURCHASE_CANCELED":
      status = "canceled";
      if (expiresAt) extra.expires_at = expiresAt;
      break;
    case "PURCHASE_DELAYED":
    case "PURCHASE_EXPIRED":
      status = "expired";
      break;
    case "PURCHASE_REFUNDED":
      status = "refunded";
      extra.expires_at = new Date().toISOString();
      break;
    case "PURCHASE_CHARGEBACK":
    case "PURCHASE_PROTEST":
      status = "chargeback";
      extra.expires_at = new Date().toISOString();
      break;
    case "SWITCH_PLAN":
      status = "active";
      if (expiresAt) extra.expires_at = expiresAt;
      break;
    case "UPDATE_SUBSCRIPTION_CHARGE_DATE":
      // So atualiza expires_at, mantem status
      if (expiresAt) {
        const { error } = await supabase
          .from("subscribers")
          .update({ expires_at: expiresAt, updated_at: new Date().toISOString() })
          .eq("email", email);
        if (error) {
          console.error("[hotmart webhook] update charge date:", error);
        }
      }
      return NextResponse.json({ ok: true, event, email });
    default:
      // Eventos que nao tratamos (ex: PURCHASE_BILLET_PRINTED) — apenas confirma
      return NextResponse.json({ ok: true, ignored: event });
  }

  const { error } = await supabase
    .from("subscribers")
    .upsert({ ...baseUpsert, status, ...extra }, { onConflict: "email" });

  if (error) {
    console.error("[hotmart webhook] upsert error:", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, email, event, status, locale });
}

// Health check
export async function GET() {
  return NextResponse.json({ ok: true, name: "hotmart webhook" });
}
