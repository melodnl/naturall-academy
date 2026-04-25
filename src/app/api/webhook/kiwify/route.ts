// Webhook Kiwify — recebe eventos de compra/cancelamento e ativa/bloqueia subscriber.
// Configurar na Kiwify: URL https://naturallacademy.com/api/webhook/kiwify
// Adicionar query string ?token=<KIWIFY_WEBHOOK_TOKEN> OU header de assinatura.
//
// Eventos cobertos (Kiwify):
//  - order_approved        → ativa
//  - subscription_renewed  → renova
//  - subscription_canceled → marca como canceled (mantém acesso até expires_at)
//  - subscription_late     → marca como expired
//  - chargeback / refund   → bloqueia imediatamente

import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type KiwifyEvent =
  | "order_approved"
  | "order_refunded"
  | "chargeback"
  | "subscription_renewed"
  | "subscription_canceled"
  | "subscription_late";

type KiwifyPayload = {
  webhook_event_type: KiwifyEvent;
  order_id?: string;
  Customer?: { email?: string; full_name?: string; first_name?: string };
  Subscription?: {
    next_payment?: string;
    plan?: { name?: string };
  };
  Product?: { product_name?: string; product_id?: string };
  approved_date?: string;
};

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

function verifySignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.KIWIFY_WEBHOOK_SECRET;
  if (!secret) return false;

  // Modo 1: token via query string (Kiwify oferece esse)
  const queryToken = req.nextUrl.searchParams.get("token");
  if (queryToken) {
    return constantTimeEqual(queryToken, secret);
  }

  // Modo 2: header com HMAC SHA1 (alternativo)
  const headerSig = req.headers.get("x-kiwify-signature") ?? "";
  if (headerSig) {
    const expected = crypto
      .createHmac("sha1", secret)
      .update(rawBody)
      .digest("hex");
    return constantTimeEqual(headerSig, expected);
  }

  return false;
}

function planNameToSlug(name?: string): "basico" | "mega" | null {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes("mega") || n.includes("combo") || n.includes("complete")) return "mega";
  if (n.includes("basic") || n.includes("básic")) return "basico";
  return null;
}

export async function POST(req: NextRequest) {
  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  if (!verifySignature(req, rawBody)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: KiwifyPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const email = payload.Customer?.email?.trim().toLowerCase();
  const event = payload.webhook_event_type;
  if (!email || !event) {
    return NextResponse.json({ error: "missing email or event" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const expiresAt = payload.Subscription?.next_payment ?? null;
  const plan = planNameToSlug(payload.Subscription?.plan?.name ?? payload.Product?.product_name);
  const orderId = payload.order_id ?? null;

  const baseUpsert = {
    email,
    source: "kiwify",
    external_order_id: orderId,
    plan,
    updated_at: new Date().toISOString(),
  };

  let status: string;
  let extra: Record<string, unknown> = {};
  switch (event) {
    case "order_approved":
    case "subscription_renewed":
      status = "active";
      extra = { expires_at: expiresAt };
      break;
    case "subscription_canceled":
      // Mantém ativo até expires_at; só marca como canceled
      status = "canceled";
      extra = { expires_at: expiresAt };
      break;
    case "subscription_late":
      status = "expired";
      break;
    case "order_refunded":
      status = "refunded";
      extra = { expires_at: new Date().toISOString() };
      break;
    case "chargeback":
      status = "chargeback";
      extra = { expires_at: new Date().toISOString() };
      break;
    default:
      // Evento que não tratamos — registra mas não muda status
      return NextResponse.json({ ok: true, ignored: event });
  }

  const { error } = await supabase
    .from("subscribers")
    .upsert({ ...baseUpsert, status, ...extra }, { onConflict: "email" });

  if (error) {
    console.error("[kiwify webhook] upsert error:", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, email, event, status });
}

// Health check pra Kiwify validar URL
export async function GET() {
  return NextResponse.json({ ok: true, name: "kiwify webhook" });
}
