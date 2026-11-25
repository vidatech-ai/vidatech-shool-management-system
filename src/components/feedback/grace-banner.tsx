import { prisma } from "@/lib/prisma";
import { env } from "@/config/env";
import { getAccessMode } from "@/core/subscription/access-mode";

const HOUR_MS = 60 * 60 * 1000;

export default async function GraceBanner({
  schoolId,
  role,
}: {
  schoolId: string | null;
  role: "ADMIN" | "ACCOUNTANT";
}) {
  if (!schoolId) return null;
  try {
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { slug: true, status: true, subscriptionExpiresAt: true },
    });
    if (!school || !school.subscriptionExpiresAt) return null;
    if (getAccessMode(school, env.GRACE_HOURS) !== "GRACE_LIMITED_MODE") return null;

    const lockoutAt = school.subscriptionExpiresAt.getTime() + env.GRACE_HOURS * HOUR_MS;
    const hoursLeft = Math.max(1, Math.ceil((lockoutAt - Date.now()) / HOUR_MS));
    const base = process.env.NEXT_PUBLIC_ROUTING_MODE === "SUBDOMAIN" ? "" : `/s/${school.slug}`;

    return (
      <div
        role="alert"
        style={{
          background: "#b91c1c",
          color: "#fff",
          padding: "12px 16px",
          fontFamily: "system-ui, sans-serif",
          fontSize: 15,
          textAlign: "center",
        }}
      >
        Your subscription has expired. Limited access ends in about {hoursLeft} hour
        {hoursLeft === 1 ? "" : "s"}, then the portal locks.{" "}
        {role === "ADMIN" ? (
          <a href={`${base}/billing`} style={{ color: "#fff", fontWeight: 700, textDecoration: "underline" }}>
            Renew now
          </a>
        ) : (
          <strong>Please ask the school administrator to renew.</strong>
        )}
      </div>
    );
  } catch (e) {
    console.error("grace banner failed", e instanceof Error ? e.message : e);
    return null;
  }
}
