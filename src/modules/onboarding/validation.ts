import { z } from "zod";
import { SLUG, RESERVED } from "@/core/tenancy/host-parser";

export const STAGES = [
  "ECDE",
  "LOWER_PRIMARY",
  "UPPER_PRIMARY",
  "JUNIOR_SCHOOL",
  "SENIOR_SCHOOL",
  "SECONDARY_844",
] as const;

export const registerSchema = z.object({
  schoolName: z.string().trim().min(3, "School name is too short").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => SLUG.test(v), "Subdomain must be 3-63 characters: letters, digits and hyphens, not starting or ending with a hyphen")
    .refine((v) => !RESERVED.has(v), "That subdomain is reserved, choose another"),
  county: z.string().trim().min(2, "County is required").max(60),
  schoolEmail: z.string().trim().toLowerCase().email("Enter a valid school email").max(120),
  phone: z.string().trim().max(20).optional(),
  stages: z.array(z.enum(STAGES)).min(1, "Select at least one school level"),
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  adminEmail: z.string().trim().toLowerCase().email("Enter a valid principal email").max(120),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export type RegisterInput = z.infer<typeof registerSchema>;
