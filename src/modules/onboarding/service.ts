import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/core/auth";
import type { RegisterInput } from "./validation";

export const TRIAL_MAX_STUDENTS = 300;

export type RegisterResult =
  | { ok: true; slug: string }
  | { ok: false; status: number; error: string };

/**
 * Creates the trial school and its first ADMIN in one atomic write.
 * The school starts PENDING_PAYMENT (blocked everywhere) with no expiry date.
 * HQ approves it after a verification call, and the trial clock starts then.
 */
export async function registerTrialSchool(input: RegisterInput): Promise<RegisterResult> {
  const passwordHash = await hashPassword(input.password);
  try {
    const school = await prisma.school.create({
      data: {
        name: input.schoolName,
        slug: input.slug,
        county: input.county,
        email: input.schoolEmail,
        phone: input.phone,
        enabledStages: input.stages,
        status: "PENDING_PAYMENT",
        isTrial: true,
        maxStudents: TRIAL_MAX_STUDENTS,
        smsBalance: 0,
        subscriptionExpiresAt: null,
        users: {
          create: {
            role: "ADMIN",
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.adminEmail,
            passwordHash,
          },
        },
      },
      select: { slug: true },
    });
    return { ok: true, slug: school.slug };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, status: 409, error: "That subdomain is already taken, choose another" };
    }
    throw e;
  }
}
