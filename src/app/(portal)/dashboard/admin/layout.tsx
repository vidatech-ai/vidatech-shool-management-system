import type { ReactNode } from "react";
import { guardDashboard } from "@/core/auth/page-guard";
import GraceBanner from "@/components/feedback/grace-banner";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await guardDashboard(["ADMIN"]);
  return (
    <>
      <GraceBanner schoolId={session.schoolId} role="ADMIN" />
      {children}
    </>
  );
}
