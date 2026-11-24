import { createHash } from "node:crypto";
import type { Prisma, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { AuditEvent } from "./audit-events";

export type AuditInput = {
  schoolId: string;
  actorId: string | null;
  actorRole: Role | null;
  action: AuditEvent;
  entityType?: string | null;
  entityId?: string | null;
  metadata?: Prisma.InputJsonObject | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

function stable(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value) ?? "null";
  }
  if (Array.isArray(value)) {
    return "[" + value.map(stable).join(",") + "]";
  }
  const obj = value as Record<string, unknown>;
  return (
    "{" +
    Object.keys(obj)
      .filter((k) => obj[k] !== undefined)
      .sort()
      .map((k) => JSON.stringify(k) + ":" + stable(obj[k]))
      .join(",") +
    "}"
  );
}

type HashFields = {
  schoolId: string;
  sequence: number;
  prevHash: string | null;
  actorId: string | null;
  actorRole: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  metadata: unknown;
  createdAt: Date;
};

export function computeAuditHash(f: HashFields): string {
  const payload = stable({
    schoolId: f.schoolId,
    sequence: f.sequence,
    prevHash: f.prevHash,
    actorId: f.actorId,
    actorRole: f.actorRole,
    action: f.action,
    entityType: f.entityType,
    entityId: f.entityId,
    metadata: f.metadata ?? null,
    createdAt: f.createdAt.toISOString(),
  });
  return createHash("sha256").update(payload).digest("hex");
}

/**
 * Appends one row to the school's hash chain.
 * Run it inside a transaction. If two writers pick the same sequence,
 * the unique key [schoolId, sequence] rejects one (P2002) and the caller retries.
 */
export async function appendAuditLog(tx: Prisma.TransactionClient, input: AuditInput) {
  const last = await tx.auditLog.findFirst({
    where: { schoolId: input.schoolId },
    orderBy: { sequence: "desc" },
    select: { sequence: true, hash: true },
  });

  const sequence = (last?.sequence ?? 0) + 1;
  const prevHash = last?.hash ?? null;
  const createdAt = new Date();
  const entityType = input.entityType ?? null;
  const entityId = input.entityId ?? null;

  const hash = computeAuditHash({
    schoolId: input.schoolId,
    sequence,
    prevHash,
    actorId: input.actorId,
    actorRole: input.actorRole,
    action: input.action,
    entityType,
    entityId,
    metadata: input.metadata ?? null,
    createdAt,
  });

  return tx.auditLog.create({
    data: {
      schoolId: input.schoolId,
      actorId: input.actorId,
      actorRole: input.actorRole,
      action: input.action,
      entityType,
      entityId,
      metadata: input.metadata ?? undefined,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      sequence,
      prevHash,
      hash,
      createdAt,
    },
  });
}

export async function verifyAuditChain(schoolId: string) {
  const rows = await prisma.auditLog.findMany({
    where: { schoolId },
    orderBy: { sequence: "asc" },
  });

  let prev: string | null = null;
  let expected = 1;
  for (const r of rows) {
    if (r.sequence !== expected || r.prevHash !== prev) {
      return { ok: false as const, checked: expected - 1, brokenAt: r.sequence };
    }
    const h = computeAuditHash({
      schoolId,
      sequence: r.sequence,
      prevHash: r.prevHash,
      actorId: r.actorId,
      actorRole: r.actorRole,
      action: r.action,
      entityType: r.entityType,
      entityId: r.entityId,
      metadata: r.metadata,
      createdAt: r.createdAt,
    });
    if (h !== r.hash) {
      return { ok: false as const, checked: expected - 1, brokenAt: r.sequence };
    }
    prev = r.hash;
    expected++;
  }
  return { ok: true as const, checked: rows.length };
}
