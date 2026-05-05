// Webhook Lowify — recebe eventos de venda e ativa/bloqueia subscriber.
// Configurar na Lowify (Webhooks → Novo Webhook):
//   URL: https://naturallacademy.com/api/webhook/lowify?token=<LOWIFY_WEBHOOK_TOKEN>
//   Produto: NaturallAcademy APP
//   Eventos: Venda Aprovada (e os demais que você for habilitando)
//
// Lowify não oferece header de assinatura nativo, então autenticamos via
// token na query string (mesmo modo opcional da Kiwify).

import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type LowifyEvent =
  | "sale.paid"
  | "sale.refunded"
  | "sale.chargeback"
  | "sale.canceled"
  | "subscription.canceled"
  | "subscription.late";

type LowifyPayload = {
  event: LowifyEvent;
  sale_id?: string;
  timestamp?: string;
  product?: { id?: number; name?: string };
  customer?: { name?: string; email?: string; phone?: string };
  subscription?: { next_payment?: string; plan?: { name?: string } };
};

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

function verifyToken(req: NextRequest): boolean {
  const secret = process.env.LOWIFY_WEBHOOK_TOKEN;
  if (!secret) return false;
  const token = req.nextUrl.searchParams.get("token") ?? "";
  if (!token) return false;
  return constantTimeEqual(token, secret);
}

function planNameToSlug(name?: string): "basico" | "mega" | null {
  if (!name) return null;
  const n = name.toLowerCase();
  if (n.includes("mega") || n.includes("combo") || n.includes("complete")) return "mega";
  if (n.includes("basic") || n.includes("básic") || n.includes("essencial")) return "basico";
  return null;
}

export async function POST(req: NextRequest) {
  if (!verifyToken(req)) {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  let payload: LowifyPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const email = payload.customer?.email?.trim().toLowerCase();
  const event = payload.event;
  if (!email || !event) {
    return NextResponse.json({ error: "missing email or event" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const expiresAt = payload.subscription?.next_payment ?? null;
  const plan = planNameToSlug(payload.subscription?.plan?.name ?? payload.product?.name);
  const orderId = payload.sale_id ?? null;

  // Lowify só vende o produto PT (Brasil), então preferred_locale é fixo.
  const baseUpsert = {
    email,
    source: "lowify",
    external_order_id: orderId,
    plan,
    preferred_locale: "pt" as const,
    updated_at: new Date().toISOString(),
  };

  let status: string;
  const extra: Record<string, unknown> = {};
  switch (event) {
    case "sale.paid":
      status = "active";
      if (expiresAt) extra.expires_at = expiresAt;
      break;
    case "subscription.canceled":
    case "sale.canceled":
      status = "canceled";
      if (expiresAt) extra.expires_at = expiresAt;
      break;
    case "subscription.late":
      status = "expired";
      break;
    case "sale.refunded":
      status = "refunded";
      extra.expires_at = new Date().toISOString();
      break;
    case "sale.chargeback":
      status = "chargeback";
      extra.expires_at = new Date().toISOString();
      break;
    default:
      return NextResponse.json({ ok: true, ignored: event });
  }

  const { error } = await supabase
    .from("subscribers")
    .upsert({ ...baseUpsert, status, ...extra }, { onConflict: "email" });

  if (error) {
    console.error("[lowify webhook] upsert error:", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, email, event, status });
}

// Health check pra Lowify validar URL
export async function GET() {
  return NextResponse.json({ ok: true, name: "lowify webhook" });
}
