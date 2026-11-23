import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/core/auth";

export async function GET() {
  const guard = await requireSession();
  if (!guard.ok) return guard.response;

  const user = await prisma.user.findFirst({
    where: { id: guard.session.userId, isActive: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      role: true,
      schoolId: true,
      school: { select: { slug: true, name: true, status: true } },
    },
  });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user });
}
