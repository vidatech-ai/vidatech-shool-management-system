export type AccessMode =
  | "SUSPENDED"
  | "PENDING"
  | "FULL_ACCESS"
  | "GRACE_LIMITED_MODE"
  | "LOCKED_OUT";

export type SchoolAccessInput = {
  status: "PENDING_PAYMENT" | "ACTIVE" | "SUSPENDED";
  subscriptionExpiresAt: Date | null;
};

const HOUR_MS = 60 * 60 * 1000;

/**
 * Pure decision function. No database, no env, no clock of its own.
 * Blueprint Phase 2:
 *   A: suspended                         -> SUSPENDED
 *   B: now <= expiry                     -> FULL_ACCESS
 *   C: expiry < now <= expiry + grace    -> GRACE_LIMITED_MODE
 *   D: now > expiry + grace              -> LOCKED_OUT
 * Not in the blueprint (decided here):
 *   PENDING_PAYMENT                      -> PENDING
 *   ACTIVE with no expiry date           -> LOCKED_OUT (fail closed)
 */
export function getAccessMode(
  school: SchoolAccessInput,
  graceHours: number,
  now: Date = new Date(),
): AccessMode {
  if (school.status === "SUSPENDED") return "SUSPENDED";
  if (school.status === "PENDING_PAYMENT") return "PENDING";
  if (!school.subscriptionExpiresAt) return "LOCKED_OUT";

  const expiry = school.subscriptionExpiresAt.getTime();
  const t = now.getTime();
  if (t <= expiry) return "FULL_ACCESS";
  if (t <= expiry + graceHours * HOUR_MS) return "GRACE_LIMITED_MODE";
  return "LOCKED_OUT";
}
