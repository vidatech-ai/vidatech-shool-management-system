import { readSessionCookie } from "./cookies";
import { verifySession } from "./jwt";
import type { SessionPayload } from "./session";

export async function getSession(): Promise<SessionPayload | null> {
  const token = await readSessionCookie();
  return token ? verifySession(token) : null;
}
