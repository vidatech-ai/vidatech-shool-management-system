import LoginForm from "./login-form";
import styles from "./login.module.css";

export default function Page() {
  return (
    <main className={styles.page}>
      <div className={`${styles.ring} ${styles.ring1}`} />
      <div className={`${styles.ring} ${styles.ring2}`} />
      <div className={styles.shell}>
        <section className={styles.brand}>
          <span className={styles.badge}>VidaTech HQ</span>
          <h1 className={styles.headline}>Platform control center for every school you power.</h1>
          <p className={styles.sub}>
            Restricted to the VidaTech owner. Manage schools, subscriptions and platform health from one place.
          </p>
          <ul className={styles.features}>
            <li>School directory and kill switch</li>
            <li>Paystack revenue ledger</li>
            <li>Audited support impersonation</li>
            <li>Platform-wide broadcasts</li>
          </ul>
        </section>

        <section className={styles.cardWrap}>
          <div className={styles.card}>
            <div className={styles.logo}>VidaTech HQ</div>
            <p className={styles.motto}>Master Developer Console</p>
            <h2 className={styles.title}>Sign in</h2>
            <LoginForm />
            <p className={styles.foot}>Authorized access only. All sessions are monitored.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
