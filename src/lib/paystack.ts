import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/config/env";

const API = "https://api.paystack.co";

export type InitializeInput = {
  email: string;
  amountMinor: number;
  currency: string;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

export async function initializeTransaction(
  input: InitializeInput,
): Promise<{ authorizationUrl: string; reference: string }> {
  const res = await fetch(`${API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountMinor,
      currency: input.currency,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => null)) as {
    status?: boolean;
    message?: string;
    data?: { authorization_url?: string; reference?: string };
  } | null;
  if (!res.ok || !json?.status || !json.data?.authorization_url) {
    throw new Error(`Paystack initialize failed: ${json?.message ?? res.status}`);
  }
  return {
    authorizationUrl: json.data.authorization_url,
    reference: json.data.reference ?? input.reference,
  };
}

/** HMAC-SHA512 of the raw request body with the secret key, compared in constant time. */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = createHmac("sha512", env.PAYSTACK_SECRET_KEY).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
