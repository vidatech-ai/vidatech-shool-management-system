import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paystack";
import { activateFromCharge } from "@/modules/billing";

export async function POST(req: Request) {
  const rawBody = await req.text();
  if (!verifyWebhookSignature(rawBody, req.headers.get("x-paystack-signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    event?: string;
    data?: { reference?: unknown; amount?: unknown; currency?: unknown; status?: unknown };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (event.event !== "charge.success" || event.data?.status !== "success") {
    return NextResponse.json({ received: true, ignored: true });
  }

  const { reference, amount, currency } = event.data;
  if (typeof reference !== "string" || typeof amount !== "number" || typeof currency !== "string") {
    return NextResponse.json({ error: "Malformed charge" }, { status: 400 });
  }

  try {
    const result = await activateFromCharge({
      reference,
      amountMinor: amount,
      currency,
      raw: event,
    });
    console.log("paystack webhook", reference, result);
    return NextResponse.json({ received: true, result });
  } catch (e) {
    console.error("paystack webhook failed", reference, e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
