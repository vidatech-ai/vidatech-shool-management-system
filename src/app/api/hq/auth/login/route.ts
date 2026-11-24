import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, signSession, setSessionCookie } from "@/core/auth";

const body = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

const fail = () =>
  NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= hashPassword("vidatech-hq-dummy-password"));

export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const identifier = parsed.data.identifier.trim();
  const { password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: {
      role: "MASTER_ADMIN",
      schoolId: null,
      isActive: true,
      email: { equals: identifier, mode: "insensitive" },
    },
  });

  if (!user) {
    await verifyPassword(password, await getDummyHash());
    return fail();
  }
  if (!(await verifyPassword(password, user.passwordHash))) return fail();

  if (user.twoFactorEnabled) {
    return NextResponse.json(
      { error: "Two-factor verification is required but not available yet" },
      { status: 403 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await setSessionCookie(
    await signSession({ userId: user.id, schoolId: null, role: user.role }),
  );
  return NextResponse.json({ role: user.role });
}
