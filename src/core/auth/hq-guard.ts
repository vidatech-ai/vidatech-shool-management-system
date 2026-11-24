import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "./verify-session";

export const HQ_LOGIN_PATH = "/hq/login";

export async function guardHq() {
  const session = await getSession();
  if (!session || session.role !== "MASTER_ADMIN" || session.schoolId !== null) {
    redirect(HQ_LOGIN_PATH);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      role: true,
      schoolId: true,
      isActive: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });
  if (!user || !user.isActive || user.role !== "MASTER_ADMIN" || user.schoolId !== null) {
    redirect(HQ_LOGIN_PATH);
  }

  return { session, user };
}
