import type { Role } from "@prisma/client";

export type SessionPayload = {
  userId: string;
  schoolId: string | null;
  role: Role;
};
