import { NextResponse } from "next/server";
import { env } from "@/config/env";
import { registerSchema, registerTrialSchool } from "@/modules/onboarding";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  try {
    const result = await registerTrialSchool(parsed.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });

    const loginPath =
      process.env.NEXT_PUBLIC_ROUTING_MODE === "SUBDOMAIN"
        ? `https://${result.slug}.${env.NEXT_PUBLIC_ROOT_DOMAIN}/login`
        : `/s/${result.slug}/login`;
    return NextResponse.json({ slug: result.slug, loginPath, trialDays: env.TRIAL_DAYS }, { status: 201 });
  } catch (e) {
    console.error("register failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Could not create the school, try again" }, { status: 500 });
  }
}
