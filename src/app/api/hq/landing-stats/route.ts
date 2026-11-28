import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireHqAdmin } from "@/modules/landing-stats/guard";
import { readJson } from "@/modules/landing-stats/json";
import { createStatSchema, reorderSchema } from "@/modules/landing-stats/validation";

const ORDER = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }];
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function GET() {
  const g = await requireHqAdmin();
  if (!g.ok) return g.response;
  const stats = await prisma.landingStat.findMany({ orderBy: ORDER });
  return NextResponse.json({ stats });
}

export async function POST(req: Request) {
  const g = await requireHqAdmin();
  if (!g.ok) return g.response;
  const parsed = createStatSchema.safeParse(await readJson(req));
  if (!parsed.success) return bad("Invalid stat");
  const max = await prisma.landingStat.aggregate({ _max: { sortOrder: true } });
  const stat = await prisma.landingStat.create({
    data: { ...parsed.data, sortOrder: (max._max.sortOrder ?? -1) + 1 },
  });
  return NextResponse.json({ stat }, { status: 201 });
}

export async function PUT(req: Request) {
  const g = await requireHqAdmin();
  if (!g.ok) return g.response;
  const parsed = reorderSchema.safeParse(await readJson(req));
  if (!parsed.success) return bad("Invalid order");
  const { ids } = parsed.data;
  const rows = await prisma.landingStat.findMany({ select: { id: true } });
  const have = new Set(rows.map((r) => r.id));
  if (ids.length !== have.size || new Set(ids).size !== ids.length || ids.some((i) => !have.has(i))) {
    return bad("Order must list every stat exactly once", 409);
  }
  await prisma.$transaction(
    ids.map((id, i) => prisma.landingStat.update({ where: { id }, data: { sortOrder: i } })),
  );
  return NextResponse.json({ ok: true });
}
