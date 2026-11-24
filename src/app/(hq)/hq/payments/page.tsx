import Link from "next/link";
import { guardHq } from "@/core/auth/hq-guard";
import styles from "../hq.module.css";

export default async function Page() {
  await guardHq();
  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.top}>
          <span className={styles.brand}>VidaTech HQ</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/hq">Dashboard</Link>
          <Link href="/hq/schools">Schools</Link>
          <Link href="/hq/payments">Payments</Link>
        </nav>
        <h1 className={styles.title}>Payments</h1>
        <p className={styles.note}>The Paystack revenue ledger is built after the school directory.</p>
      </div>
    </main>
  );
}
