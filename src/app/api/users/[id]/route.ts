import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/core/auth";
import { requireActiveSubscription } from "@/core/guard/with-subscription-guard";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const guard = await requireSession(["ADMIN"]);
  if (!guard.ok) return guard.response;
  const { session } = guard;
  if (!session.schoolId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const schoolId = session.schoolId;

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const isActive = ((body ?? {}) as { isActive?: unknown }).isActive;
  if (typeof isActive !== "boolean") {
    return NextResponse.json({ error: "isActive must be true or false" }, { status: 400 });
  }

  // Reactivating is treated like adding a user: blocked during the grace period.
  const sub = await requireActiveSubscription(session, { restricted: isActive });
  if (!sub.ok) return sub.response;

  try {
    const actor = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true, schoolId: true, isActive: true },
    });
    if (!actor || !actor.isActive || actor.role !== "ADMIN" || actor.schoolId !== schoolId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const target = await prisma.user.findFirst({
      where: { id, schoolId },
      select: { id: true, role: true, isActive: true },
    });
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (target.id === session.userId) {
      return NextResponse.json({ error: "You cannot change your own status" }, { status: 400 });
    }
    if (target.role === "ADMIN") {
      return NextResponse.json(
        { error: "Admin accounts cannot be deactivated or reactivated here" },
        { status: 403 },
      );
    }
    if (target.isActive === isActive) {
      return NextResponse.json({
        ok: true,
        changed: false,
        user: { id: target.id, role: target.role, isActive: target.isActive },
      });
    }

    if (isActive && target.role === "STUDENT") {
      const school = await prisma.school.findUnique({
        where: { id: schoolId },
        select: { maxStudents: true },
      });
      if (school?.maxStudents != null) {
        const current = await prisma.user.count({
          where: { schoolId, role: "STUDENT", isActive: true },
        });
        if (current >= school.maxStudents) {
          return NextResponse.json(
            { error: `Trial limit reached: ${school.maxStudents} students. Subscribe to add more.` },
            { status: 403 },
          );
        }
      }
    }

    const upd = await prisma.user.updateMany({
      where: { id, schoolId, isActive: !isActive },
      data: { isActive },
    });
    if (upd.count !== 1) {
      return NextResponse.json({ error: "User status changed, refresh and try again" }, { status: 409 });
    }
    return NextResponse.json({
      ok: true,
      changed: true,
      user: { id: target.id, role: target.role, isActive },
    });
  } catch (e) {
    console.error("update user status failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not update the user, try again" }, { status: 500 });
  }
}
