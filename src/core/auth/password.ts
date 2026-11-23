import { compare, hash } from "bcryptjs";

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, 12);
}

export function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return compare(plain, hashed);
}
