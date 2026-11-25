import { NextResponse } from "next/server";
import { Prisma, type Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession, hashPassword } from "@/core/auth";
import { requireActiveSubscription } from "@/core/guard/with-subscription-guard";

const CREATABLE: Role[] = ["TEACHER", "STUDENT", "PARENT", "SUPPORT_STAFF", "ACCOUNTANT"];

async function studentCapResponse(schoolId: string): Promise<NextResponse | null> {
  try {
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { maxStudents: true },
    });
    if (school?.maxStudents == null) return null;
    const current = await prisma.user.count({
      where: { schoolId, role: "STUDENT", isActive: true },
    });
    if (current >= school.maxStudents) {
      return NextResponse.json(
        { error: `Trial limit reached: ${school.maxStudents} students. Subscribe to add more.` },
        { status: 403 },
      );
    }
    return null;
  } catch (e) {
    console.error("student cap check failed", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { error: "Could not verify the student limit, try again" },
      { status: 503 },
    );
  }
}

export async function GET() {
  const guard = await requireSession(["ADMIN", "SUPPORT_STAFF"]);
  if (!guard.ok) return guard.response;
  const { session } = guard;

  const sub = await requireActiveSubscription(session);
  if (!sub.ok) return sub.response;

  const users = await prisma.user.findMany({
    where: { schoolId: session.schoolId! },
    select: {
      id: true,
      role: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      admissionNumber: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const guard = await requireSession(["ADMIN"]);
  if (!guard.ok) return guard.response;
  const { session } = guard;

  const sub = await requireActiveSubscription(session, { restricted: true });
  if (!sub.ok) return sub.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const b = (body ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const role = b.role as Role;
  const firstName = str(b.firstName);
  const lastName = str(b.lastName);
  const email = str(b.email) || null;
  const phone = str(b.phone) || null;
  const admissionNumber = str(b.admissionNumber) || null;
  const password = typeof b.password === "string" ? b.password : "";

  if (!CREATABLE.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (!firstName || !lastName) {
    return NextResponse.json({ error: "First and last name are required" }, { status: 400 });
  }
  if (!email && !phone && !admissionNumber) {
    return NextResponse.json({ error: "Provide an email, phone or admission number" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  if (role === "STUDENT") {
    const capBlock = await studentCapResponse(session.schoolId!);
    if (capBlock) return capBlock;
  }

  try {
    const user = await prisma.user.create({
      data: {
        schoolId: session.schoolId!,
        role,
        firstName,
        lastName,
        email,
        phone,
        admissionNumber,
        passwordHash: await hashPassword(password),
      },
      select: { id: true, role: true, firstName: true, lastName: true },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "A user with those details already exists" }, { status: 409 });
    }
    console.error("create user failed", e);
    return NextResponse.json({ error: "Could not create the user, try again" }, { status: 500 });
  }
}
