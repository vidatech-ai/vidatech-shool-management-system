import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/core/auth/guards";

export type HqGuard = { ok: true } | { ok: false; response: NextResponse };

const forbidden = (): HqGuard => ({
  ok: false,
  response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
});

export async function requireHqAdmin(): Promise<HqGuard> {
  const guard = await requireSession(["MASTER_ADMIN"]);
  if (!guard.ok) return { ok: false, response: guard.response };
  if (guard.session.schoolId !== null) return forbidden();

  const actor = await prisma.user.findUnique({
    where: { id: guard.session.userId },
    select: { role: true, schoolId: true, isActive: true },
  });
  if (!actor || !actor.isActive || actor.role !== "MASTER_ADMIN" || actor.schoolId !== null) {
    return forbidden();
  }
  return { ok: true };
}
