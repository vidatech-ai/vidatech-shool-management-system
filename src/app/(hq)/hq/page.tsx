import { prisma } from "@/lib/prisma";
import { guardHq } from "@/core/auth/hq-guard";
import styles from "./hq.module.css";
import HqNav from "./hq-nav";

export default async function Page() {
  const { user } = await guardHq();

  const [total, active, suspended] = await Promise.all([
    prisma.school.count(),
    prisma.school.count({ where: { status: "ACTIVE" } }),
    prisma.school.count({ where: { status: "SUSPENDED" } }),
  ]);

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.top}>
          <span className={styles.brand}>VidaTech HQ</span>
          <span className={styles.who}>
            {user.firstName} {user.lastName} ({user.email})
          </span>
        </div>
        <HqNav />
        <h1 className={styles.title}>Platform overview</h1>
        <div className={styles.grid}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{total}</div>
            <div className={styles.statLabel}>Registered schools</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{active}</div>
            <div className={styles.statLabel}>Active</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{suspended}</div>
            <div className={styles.statLabel}>Suspended</div>
          </div>
        </div>
      </div>
    </main>
  );
}
