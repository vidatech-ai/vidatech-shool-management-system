import { prisma } from "@/lib/prisma";
import { guardHq } from "@/core/auth/hq-guard";
import hq from "../hq.module.css";
import HqNav from "../hq-nav";
import s from "./schools.module.css";
import SchoolActions from "./school-actions";

const STAFF_ROLES = ["ADMIN", "TEACHER", "ACCOUNTANT", "SUPPORT_STAFF"];

function day(d: Date | null) {
  return d ? d.toISOString().slice(0, 10) : "-";
}

export default async function Page() {
  await guardHq();

  const [schools, groups] = await Promise.all([
    prisma.school.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        county: true,
        phone: true,
        isTrial: true,
        status: true,
        lastLoginAt: true,
        subscriptionExpiresAt: true,
        suspendedAt: true,
        suspendedReason: true,
      },
    }),
    prisma.user.groupBy({
      by: ["schoolId", "role"],
      where: { schoolId: { not: null } },
      _count: { _all: true },
    }),
  ]);

  const counts = new Map<string, { students: number; staff: number }>();
  for (const g of groups) {
    if (!g.schoolId) continue;
    const c = counts.get(g.schoolId) ?? { students: 0, staff: 0 };
    if (g.role === "STUDENT") c.students += g._count._all;
    else if (STAFF_ROLES.includes(g.role)) c.staff += g._count._all;
    counts.set(g.schoolId, c);
  }

  const now = new Date();

  return (
    <main className={hq.page}>
      <div className={s.wrap}>
        <div className={hq.top}>
          <span className={hq.brand}>VidaTech HQ</span>
        </div>
        <HqNav />
        <h1 className={hq.title}>Schools</h1>

        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>School</th>
                <th>County</th>
                <th>Status</th>
                <th>Students</th>
                <th>Staff</th>
                <th>Last login</th>
                <th>Expires</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schools.length === 0 ? (
                <tr>
                  <td colSpan={8} className={s.empty}>
                    No schools registered yet.
                  </td>
                </tr>
              ) : (
                schools.map((sc) => {
                  const c = counts.get(sc.id) ?? { students: 0, staff: 0 };
                  const expired =
                    sc.subscriptionExpiresAt !== null && sc.subscriptionExpiresAt < now;
                  const pill =
                    sc.status === "ACTIVE"
                      ? s.pillActive
                      : sc.status === "SUSPENDED"
                        ? s.pillSuspended
                        : s.pillPending;
                  return (
                    <tr key={sc.id}>
                      <td>
                        <div className={s.name}>{sc.name}</div>
                        <div className={s.slug}>{sc.slug}</div>
                        {sc.phone ? <div className={s.slug}>{sc.phone}</div> : null}
                      </td>
                      <td>{sc.county ?? "-"}</td>
                      <td>
                        <span className={`${s.pill} ${pill}`}>{sc.status === "PENDING_PAYMENT" && sc.isTrial ? "AWAITING APPROVAL" : sc.status.replace("_", " ")}</span>
                        {sc.status === "SUSPENDED" ? (
                          <div className={s.reason}>
                            {day(sc.suspendedAt)}: {sc.suspendedReason ?? "no reason recorded"}
                          </div>
                        ) : null}
                      </td>
                      <td>{c.students}</td>
                      <td>{c.staff}</td>
                      <td>{day(sc.lastLoginAt)}</td>
                      <td className={expired ? s.expired : undefined}>
                        {day(sc.subscriptionExpiresAt)}
                      </td>
                      <td>
                        <SchoolActions id={sc.id} name={sc.name} status={sc.status} isTrial={sc.isTrial} phone={sc.phone} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
