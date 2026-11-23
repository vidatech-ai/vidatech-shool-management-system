import type { ReactNode } from "react";
import { guardDashboard } from "@/core/auth/page-guard";

export default async function Layout({ children }: { children: ReactNode }) {
  await guardDashboard(["ACCOUNTANT"]);
  return <>{children}</>;
}
