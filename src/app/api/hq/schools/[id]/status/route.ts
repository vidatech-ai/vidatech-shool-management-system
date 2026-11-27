import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/core/auth/guards";
import { appendAuditLog, AuditEvents } from "@/core/audit";
import { env } from "@/config/env";

type Ctx = { params: Promise<{ id: string }> };

type Outcome =
  | { kind: "notfound" }
  | { kind: "conflict"; message: string }
  | { kind: "done"; status: "ACTIVE" | "SUSPENDED" };

export async function POST(req: Request, ctx: Ctx) {
  const guard = await requireSession(["MASTER_ADMIN"]);
  if (!guard.ok) return guard.response;
  const { session } = guard;
  if (session.schoolId !== null) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const actor = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true, schoolId: true, isActive: true },
  });
  if (!actor || !actor.isActive || actor.role !== "MASTER_ADMIN" || actor.schoolId !== null) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const b = (body ?? {}) as { action?: unknown; reason?: unknown };
  const action = b.action;
  if (action !== "SUSPEND" && action !== "REACTIVATE" && action !== "APPROVE") {
    return NextResponse.json({ error: "Action must be SUSPEND, REACTIVATE or APPROVE" }, { status: 400 });
  }
  const reason = typeof b.reason === "string" ? b.reason.trim() : "";
  if (action === "SUSPEND" && (reason.length < 5 || reason.length > 500)) {
    return NextResponse.json(
      { error: "A reason of 5 to 500 characters is required to suspend a school" },
      { status: 400 },
    );
  }

  const forwarded = req.headers.get("x-forwarded-for");
  const ipAddress = forwarded ? forwarded.split(",")[0].trim() : null;
  const userAgent = req.headers.get("user-agent");

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const outcome = await prisma.$transaction<Outcome>(async (tx) => {
        const school = await tx.school.findUnique({
          where: { id },
          select: { id: true, status: true, isTrial: true },
        });
        if (!school) return { kind: "notfound" };

        if (action === "APPROVE") {
          if (school.status !== "PENDING_PAYMENT" || !school.isTrial) {
            return { kind: "conflict", message: "Only a pending trial signup can be approved" };
          }
          const trialEndsAt = new Date(Date.now() + env.TRIAL_DAYS * 86_400_000);
          const upd = await tx.school.updateMany({
            where: { id, status: "PENDING_PAYMENT", isTrial: true },
            data: { status: "ACTIVE", subscriptionExpiresAt: trialEndsAt },
          });
          if (upd.count !== 1) return { kind: "conflict", message: "School status changed, refresh and try again" };
          await appendAuditLog(tx, {
            schoolId: id,
            actorId: actor.id,
            actorRole: "MASTER_ADMIN",
            action: AuditEvents.SCHOOL_APPROVED,
            entityType: "School",
            entityId: id,
            metadata: {
              previousStatus: "PENDING_PAYMENT",
              newStatus: "ACTIVE",
              trialDays: env.TRIAL_DAYS,
              trialEndsAt: trialEndsAt.toISOString(),
            },
            ipAddress,
            userAgent,
          });
          return { kind: "done", status: "ACTIVE" };
        }

        if (action === "SUSPEND") {
          if (school.status !== "ACTIVE") {
            return { kind: "conflict", message: `School is ${school.status}, only an ACTIVE school can be suspended` };
          }
          const upd = await tx.school.updateMany({
            where: { id, status: "ACTIVE" },
            data: { status: "SUSPENDED", suspendedAt: new Date(), suspendedReason: reason },
          });
          if (upd.count !== 1) return { kind: "conflict", message: "School status changed, refresh and try again" };
          await appendAuditLog(tx, {
            schoolId: id,
            actorId: actor.id,
            actorRole: "MASTER_ADMIN",
            action: AuditEvents.SCHOOL_SUSPENDED,
            entityType: "School",
            entityId: id,
            metadata: { reason, previousStatus: "ACTIVE", newStatus: "SUSPENDED" },
            ipAddress,
            userAgent,
          });
          return { kind: "done", status: "SUSPENDED" };
        }

        if (school.status !== "SUSPENDED") {
          return { kind: "conflict", message: `School is ${school.status}, only a SUSPENDED school can be reactivated` };
        }
        const upd = await tx.school.updateMany({
          where: { id, status: "SUSPENDED" },
          data: { status: "ACTIVE", suspendedAt: null, suspendedReason: null },
        });
        if (upd.count !== 1) return { kind: "conflict", message: "School status changed, refresh and try again" };
        await appendAuditLog(tx, {
          schoolId: id,
          actorId: actor.id,
          actorRole: "MASTER_ADMIN",
          action: AuditEvents.SCHOOL_REACTIVATED,
          entityType: "School",
          entityId: id,
          metadata: { previousStatus: "SUSPENDED", newStatus: "ACTIVE", ...(reason ? { note: reason } : {}) },
          ipAddress,
          userAgent,
        });
        return { kind: "done", status: "ACTIVE" };
      });

      if (outcome.kind === "notfound") {
        return NextResponse.json({ error: "School not found" }, { status: 404 });
      }
      if (outcome.kind === "conflict") {
        return NextResponse.json({ error: outcome.message }, { status: 409 });
      }
      return NextResponse.json({ ok: true, status: outcome.status });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002" && attempt < 3) {
        continue;
      }
      console.error("hq school status change failed", e);
      return NextResponse.json({ error: "Could not update the school, try again" }, { status: 500 });
    }
  }
  return NextResponse.json({ error: "Could not update the school, try again" }, { status: 503 });
}
