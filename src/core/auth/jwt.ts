import { SignJWT, jwtVerify } from "jose";
import { env } from "@/config/env";
import type { SessionPayload } from "./session";

const key = () => new TextEncoder().encode(env.JWT_SECRET);

export const SESSION_SECONDS = 60 * 60 * 8;

export function signSession(p: SessionPayload): Promise<string> {
  return new SignJWT({ schoolId: p.schoolId, role: p.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(p.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(key());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    if (!payload.sub || typeof payload.role !== "string") return null;
    return {
      userId: payload.sub,
      schoolId: (payload.schoolId as string | null) ?? null,
      role: payload.role as SessionPayload["role"],
    };
  } catch {
    return null;
  }
}
