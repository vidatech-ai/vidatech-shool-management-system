import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "./verify-session";
import { env } from "@/config/env";
import { getAccessMode } from "@/core/subscription/access-mode";

const HOME: Partial<Record<Role, string>> = {
  ADMIN: "/dashboard/admin",
  TEACHER: "/dashboard/teacher",
  STUDENT: "/dashboard/student",
  PARENT: "/dashboard/parent",
  ACCOUNTANT: "/dashboard/accountant",
  SUPPORT_STAFF: "/dashboard/staff",
};

function base(slug: string): string {
  return process.env.NEXT_PUBLIC_ROUTING_MODE === "SUBDOMAIN" ? "" : `/s/${slug}`;
}

export async function guardDashboard(allowed?: Role[]) {
  const slug = (await headers()).get("x-school-slug");
  if (!slug) redirect("/");
  const b = base(slug);

  const session = await getSession();
  if (!session) redirect(`${b}/login`);

  const school = await prisma.school.findUnique({
    where: { slug },
    select: { id: true, status: true, subscriptionExpiresAt: true },
  });
  if (!school || school.id !== session.schoolId) redirect(`${b}/login`);
  const mode = getAccessMode(school, env.GRACE_HOURS);
  if (mode === "SUSPENDED" || mode === "PENDING") redirect(`${b}/suspended`);
  if (mode === "LOCKED_OUT") {
    if (session.role === "ADMIN") redirect(`${b}/billing`);
    redirect(`${b}/suspended`);
  }

  if (allowed && !allowed.includes(session.role)) {
    const home = HOME[session.role];
    redirect(home ? `${b}${home}` : `${b}/login`);
  }
  return session;
}
