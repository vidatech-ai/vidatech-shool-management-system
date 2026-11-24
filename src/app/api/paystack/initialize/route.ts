import { NextResponse } from "next/server";
import { requireSession } from "@/core/auth";
import { requireActiveSubscription } from "@/core/guard/with-subscription-guard";
import { startCheckout } from "@/modules/billing";

export async function POST() {
  const guard = await requireSession(["ADMIN"]);
  if (!guard.ok) return guard.response;
  const { session } = guard;

  const sub = await requireActiveSubscription(session, { billing: true });
  if (!sub.ok) return sub.response;

  try {
    const { url } = await startCheckout(session.schoolId!);
    return NextResponse.json({ url });
  } catch (e) {
    console.error("paystack initialize failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not start payment, try again" }, { status: 502 });
  }
}
