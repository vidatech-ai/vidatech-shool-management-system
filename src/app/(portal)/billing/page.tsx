import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { env } from "@/config/env";
import { getSession } from "@/core/auth";
import { getAccessMode } from "@/core/subscription/access-mode";
import PayButton from "./pay-button";

function base(slug: string): string {
  return process.env.NEXT_PUBLIC_ROUTING_MODE === "SUBDOMAIN" ? "" : `/s/${slug}`;
}

function fmt(d: Date | null): string {
  if (!d) return "Not set";
  return d.toLocaleString("en-KE", { timeZone: "Africa/Nairobi", dateStyle: "long", timeStyle: "short" });
}

export default async function Page() {
  const slug = (await headers()).get("x-school-slug");
  if (!slug) redirect("/");
  const b = base(slug);

  const session = await getSession();
  if (!session) redirect(`${b}/login`);

  const school = await prisma.school.findUnique({
    where: { slug },
    select: { id: true, name: true, status: true, subscriptionExpiresAt: true, isTrial: true },
  });
  if (!school || school.id !== session.schoolId) redirect(`${b}/login`);

  const mode = getAccessMode(school, env.GRACE_HOURS);
  if (mode === "SUSPENDED" || mode === "PENDING") redirect(`${b}/suspended`);

  const wrap = { maxWidth: 560, margin: "48px auto", padding: "0 16px", fontFamily: "system-ui, sans-serif" } as const;

  if (session.role !== "ADMIN") {
    return (
      <main style={wrap}>
        <h1>Subscription</h1>
        <p>Only the school administrator can manage billing. Please contact your administrator.</p>
      </main>
    );
  }

  const headline =
    mode === "FULL_ACCESS"
      ? school.isTrial
        ? "Free trial active"
        : "Subscription active"
      : mode === "GRACE_LIMITED_MODE"
        ? `Subscription expired: limited access for ${env.GRACE_HOURS} hours`
        : "Subscription expired: access locked";

  const color = mode === "FULL_ACCESS" ? "#15803d" : "#b91c1c";

  return (
    <main style={wrap}>
      <h1>{school.name}</h1>
      <h2 style={{ color }}>{headline}</h2>
      <p>
        {mode === "FULL_ACCESS" ? "Expires" : "Expired"}: <strong>{fmt(school.subscriptionExpiresAt)}</strong>
      </p>
      <p>
        Renewal: <strong>KES {env.SUBSCRIPTION_PRICE_KES.toLocaleString("en-KE")}</strong> for {env.SUBSCRIPTION_DAYS} days.
        Days left on your current plan are kept.
      </p>
      <PayButton label={`Pay KES ${env.SUBSCRIPTION_PRICE_KES.toLocaleString("en-KE")} now`} />
      <p style={{ marginTop: 24, color: "#475569", fontSize: 14 }}>
        Already paid? Your plan updates within a minute. Refresh this page if the status has not changed.
      </p>
    </main>
  );
}
