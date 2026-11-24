import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { env } from "@/config/env";
import type { SessionPayload } from "@/core/auth";
import { getAccessMode, type AccessMode } from "@/core/subscription/access-mode";

export type SubscriptionGuardResult =
  | { ok: true; mode: AccessMode }
  | { ok: false; response: NextResponse };

export type SubscriptionGuardOptions = {
  /** Billing endpoints stay reachable in LOCKED_OUT (blueprint: 402 for all non-billing endpoints). */
  billing?: boolean;
  /** Report cards, adding users, bulk SMS, printing receipts: blocked in GRACE_LIMITED_MODE (403). */
  restricted?: boolean;
};

/**
 * Server-side subscription check. The school comes from the verified session,
 * never from anything the client sends.
 */
export async function requireActiveSubscription(
  session: SessionPayload,
  options: SubscriptionGuardOptions = {},
): Promise<SubscriptionGuardResult> {
  if (!session.schoolId) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  const school = await prisma.school.findUnique({
    where: { id: session.schoolId },
    select: { status: true, subscriptionExpiresAt: true },
  });
  if (!school) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  const mode = getAccessMode(school, env.GRACE_HOURS);

  if (mode === "SUSPENDED" || mode === "PENDING") {
    return {
      ok: false,
      response: NextResponse.json({ error: "School portal unavailable" }, { status: 403 }),
    };
  }
  if (mode === "LOCKED_OUT" && !options.billing) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Subscription expired. Payment required." }, { status: 402 }),
    };
  }
  if (mode === "GRACE_LIMITED_MODE" && options.restricted) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Action unavailable during the subscription grace period." },
        { status: 403 },
      ),
    };
  }
  return { ok: true, mode };
}
