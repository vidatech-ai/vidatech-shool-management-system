import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const SLUG = "alliancehigh";
const ADMIN_EMAIL = "admin@alliancehigh.test";
const ADMIN_PASSWORD = "Admin@12345";
const STUDENT_ADMISSION = "1001";
const STUDENT_PASSWORD = "Student@12345";

async function upsertUser(
  schoolId: string,
  where: { email?: string; admissionNumber?: string },
  data: {
    role: Role;
    firstName: string;
    lastName: string;
    email?: string;
    admissionNumber?: string;
    password: string;
  },
) {
  const passwordHash = await hash(data.password, 12);
  const existing = await prisma.user.findFirst({ where: { schoolId, ...where } });
  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash, isActive: true },
    });
  }
  return prisma.user.create({
    data: {
      schoolId,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      admissionNumber: data.admissionNumber,
      passwordHash,
    },
  });
}

async function seedMasterAdmin() {
  const email = process.env.HQ_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.HQ_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("HQ master admin skipped: set HQ_ADMIN_EMAIL and HQ_ADMIN_PASSWORD in .env");
    return;
  }
  if (password.length < 10) {
    throw new Error("HQ_ADMIN_PASSWORD must be at least 10 characters");
  }

  const passwordHash = await hash(password, 12);
  const existing = await prisma.user.findFirst({
    where: {
      role: "MASTER_ADMIN",
      schoolId: null,
      email: { equals: email, mode: "insensitive" },
    },
  });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash, isActive: true, email },
    });
  } else {
    await prisma.user.create({
      data: {
        schoolId: null,
        role: "MASTER_ADMIN",
        firstName: "VidaTech",
        lastName: "HQ Admin",
        email,
        passwordHash,
      },
    });
  }
  console.log("Seeded HQ master admin:", email);
}

async function main() {
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);

  const school = await prisma.school.upsert({
    where: { slug: SLUG },
    update: { status: "ACTIVE", subscriptionExpiresAt: expires },
    create: {
      name: "Alliance High School",
      slug: SLUG,
      status: "ACTIVE",
      county: "Kiambu",
      email: "info@alliancehigh.test",
      phone: "0700000000",
      enabledStages: ["SENIOR_SCHOOL", "SECONDARY_844"],
      subscriptionExpiresAt: expires,
    },
  });

  const classes = [
    { name: "Grade 10", stage: "SENIOR_SCHOOL" as const, sortOrder: 1 },
    { name: "Grade 11", stage: "SENIOR_SCHOOL" as const, sortOrder: 2 },
    { name: "Grade 12", stage: "SENIOR_SCHOOL" as const, sortOrder: 3 },
    { name: "Form 3", stage: "SECONDARY_844" as const, sortOrder: 4 },
    { name: "Form 4", stage: "SECONDARY_844" as const, sortOrder: 5 },
  ];
  for (const c of classes) {
    const found = await prisma.schoolClass.findFirst({
      where: { schoolId: school.id, name: c.name },
    });
    if (!found) await prisma.schoolClass.create({ data: { schoolId: school.id, ...c } });
  }

  const term = await prisma.term.findFirst({
    where: { schoolId: school.id, academicYear: 2026, number: 3 },
  });
  if (!term) {
    await prisma.term.create({
      data: {
        schoolId: school.id,
        academicYear: 2026,
        number: 3,
        name: "Term 3 2026",
        startDate: new Date("2026-08-24"),
        endDate: new Date("2026-11-27"),
        isCurrent: true,
      },
    });
  }

  await upsertUser(
    school.id,
    { email: ADMIN_EMAIL },
    {
      role: "ADMIN",
      firstName: "Demo",
      lastName: "Principal",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    },
  );

  await upsertUser(
    school.id,
    { admissionNumber: STUDENT_ADMISSION },
    {
      role: "STUDENT",
      firstName: "Demo",
      lastName: "Student",
      admissionNumber: STUDENT_ADMISSION,
      password: STUDENT_PASSWORD,
    },
  );

  await seedMasterAdmin();

  console.log("Seeded school:", school.slug, "status:", school.status);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
