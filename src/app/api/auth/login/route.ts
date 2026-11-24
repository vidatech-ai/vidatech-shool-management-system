import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signSession, setSessionCookie } from "@/core/auth";
import { env } from "@/config/env";
import { getAccessMode } from "@/core/subscription/access-mode";

const body = z.object({
  slug: z.string().min(1),
  identifier: z.string().min(1),
  password: z.string().min(1),
});

const fail = () =>
  NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { slug, identifier, password } = parsed.data;

  const school = await prisma.school.findUnique({ where: { slug } });
  if (!school) return fail();
  const mode = getAccessMode(school, env.GRACE_HOURS);
  if (mode === "SUSPENDED" || mode === "PENDING") {
    return NextResponse.json({ error: "School portal unavailable" }, { status: 403 });
  }

  const user = await prisma.user.findFirst({
    where: {
      schoolId: school.id,
      isActive: true,
      OR: [{ email: identifier }, { phone: identifier }, { admissionNumber: identifier }],
    },
  });
  if (!user || !(await verifyPassword(password, user.passwordHash))) return fail();
  if (mode === "LOCKED_OUT" && user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "School subscription has expired. Contact your school administrator." },
      { status: 403 },
    );
  }

  const now = new Date();
  await Promise.all([
    prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: now } }),
    prisma.school.update({ where: { id: school.id }, data: { lastLoginAt: now } }),
  ]);

  await setSessionCookie(
    await signSession({ userId: user.id, schoolId: school.id, role: user.role }),
  );
  return NextResponse.json({ role: user.role });
}
