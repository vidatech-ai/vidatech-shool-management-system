import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireHqAdmin } from "@/modules/landing-stats/guard";
import { readJson } from "@/modules/landing-stats/json";
import { updateStatSchema } from "@/modules/landing-stats/validation";

type Ctx = { params: Promise<{ id: string }> };
const notFound = () => NextResponse.json({ error: "Stat not found" }, { status: 404 });
const isMissing = (e: unknown) => e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025";

export async function PATCH(req: Request, ctx: Ctx) {
  const g = await requireHqAdmin();
  if (!g.ok) return g.response;
  const parsed = updateStatSchema.safeParse(await readJson(req));
  if (!parsed.success) return NextResponse.json({ error: "Invalid stat" }, { status: 400 });
  const { id } = await ctx.params;
  try {
    const stat = await prisma.landingStat.update({ where: { id }, data: parsed.data });
    return NextResponse.json({ stat });
  } catch (e) {
    if (isMissing(e)) return notFound();
    throw e;
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const g = await requireHqAdmin();
  if (!g.ok) return g.response;
  const { id } = await ctx.params;
  try {
    await prisma.landingStat.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (isMissing(e)) return notFound();
    throw e;
  }
}
