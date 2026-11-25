import type { ReactNode } from "react";
import { guardDashboard } from "@/core/auth/page-guard";
import GraceBanner from "@/components/feedback/grace-banner";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await guardDashboard(["ACCOUNTANT"]);
  return (
    <>
      <GraceBanner schoolId={session.schoolId} role="ACCOUNTANT" />
      {children}
    </>
  );
}
