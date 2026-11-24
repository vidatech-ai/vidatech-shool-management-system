import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { env } from "@/config/env";
import { initializeTransaction } from "@/lib/paystack";

const DAY_MS = 86_400_000;
const CURRENCY = "KES";

export function priceMinor(): number {
  return env.SUBSCRIPTION_PRICE_KES * 100;
}

export function checkoutCallbackUrl(slug: string): string {
  if (process.env.NEXT_PUBLIC_ROUTING_MODE === "SUBDOMAIN") {
    return `https://${slug}.${env.NEXT_PUBLIC_ROOT_DOMAIN}/billing`;
  }
  return `${env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "")}/s/${slug}/billing`;
}

export async function startCheckout(schoolId: string): Promise<{ url: string }> {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    select: { id: true, slug: true, email: true },
  });
  if (!school) throw new Error("School not found");

  const reference = `vt-${randomUUID()}`;
  const payment = await prisma.subscriptionPayment.create({
    data: {
      schoolId: school.id,
      reference,
      amountMinor: priceMinor(),
      currency: CURRENCY,
      periodDays: env.SUBSCRIPTION_DAYS,
    },
  });

  try {
    const { authorizationUrl } = await initializeTransaction({
      email: school.email,
      amountMinor: payment.amountMinor,
      currency: CURRENCY,
      reference,
      callbackUrl: checkoutCallbackUrl(school.slug),
      metadata: { schoolId: school.id, kind: "subscription" },
    });
    return { url: authorizationUrl };
  } catch (e) {
    await prisma.subscriptionPayment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
    throw e;
  }
}

export type VerifiedCharge = {
  reference: string;
  amountMinor: number;
  currency: string;
  raw: unknown;
};

export type ActivationResult =
  | "ACTIVATED"
  | "ALREADY_PROCESSED"
  | "UNKNOWN_REFERENCE"
  | "MISMATCH";

/** Call only after the webhook signature has been verified. */
export async function activateFromCharge(c: VerifiedCharge): Promise<ActivationResult> {
  const raw = c.raw as Prisma.InputJsonValue;
  return prisma.$transaction(
    async (tx): Promise<ActivationResult> => {
      const payment = await tx.subscriptionPayment.findUnique({
        where: { reference: c.reference },
      });
      if (!payment) return "UNKNOWN_REFERENCE";
      if (payment.status !== "PENDING") return "ALREADY_PROCESSED";

      if (payment.amountMinor !== c.amountMinor || payment.currency !== c.currency) {
        await tx.subscriptionPayment.update({
          where: { id: payment.id },
          data: { status: "FAILED", rawPayload: raw },
        });
        return "MISMATCH";
      }

      const claimed = await tx.subscriptionPayment.updateMany({
        where: { id: payment.id, status: "PENDING" },
        data: { status: "SUCCESS", paidAt: new Date(), rawPayload: raw },
      });
      if (claimed.count !== 1) return "ALREADY_PROCESSED";

      const school = await tx.school.findUnique({
        where: { id: payment.schoolId },
        select: { status: true, subscriptionExpiresAt: true },
      });
      if (!school) throw new Error("School missing for payment " + payment.id);

      const base = Math.max(Date.now(), school.subscriptionExpiresAt?.getTime() ?? 0);
      await tx.school.update({
        where: { id: payment.schoolId },
        data: {
          subscriptionExpiresAt: new Date(base + payment.periodDays * DAY_MS),
          isTrial: false,
          maxStudents: null,
          status: school.status === "PENDING_PAYMENT" ? "ACTIVE" : school.status,
        },
      });
      return "ACTIVATED";
    },
    { maxWait: 10_000, timeout: 20_000 },
  );
}
