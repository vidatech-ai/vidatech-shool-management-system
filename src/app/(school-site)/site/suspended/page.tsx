import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { env } from "@/config/env";
import { getAccessMode } from "@/core/subscription/access-mode";

export default async function Page() {
  const slug = (await headers()).get("x-school-slug");
  if (!slug) notFound();

  const school = await prisma.school.findUnique({
    where: { slug },
    select: { name: true, status: true, subscriptionExpiresAt: true },
  });
  if (!school) notFound();

  const base = process.env.NEXT_PUBLIC_ROUTING_MODE === "SUBDOMAIN" ? "" : `/s/${slug}`;
  const mode = getAccessMode(school, env.GRACE_HOURS);

  let title = "Portal available";
  let message = "This portal is currently available.";
  if (mode === "SUSPENDED") {
    title = "Portal Suspended";
    message = "Portal Suspended: Contact VidaTech Support.";
  } else if (mode === "PENDING") {
    title = "Portal not yet active";
    message = "This portal is not active yet. If you recently registered, VidaTech will call you to verify your school before it opens.";
  } else if (mode === "LOCKED_OUT") {
    title = "Subscription expired";
    message = "Access to this portal is locked. Please contact your school administrator.";
  }

  return (
    <main style={{ maxWidth: 520, margin: "20vh auto", padding: 24, textAlign: "center" }}>
      <h1>{title}</h1>
      <p>{school.name}</p>
      <p>{message}</p>
      {mode === "FULL_ACCESS" || mode === "GRACE_LIMITED_MODE" ? (
        <p>
          <a href={`${base}/login`}>Go to login</a>
        </p>
      ) : null}
    </main>
  );
}
