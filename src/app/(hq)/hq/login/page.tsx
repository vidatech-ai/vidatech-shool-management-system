import { Poppins } from "next/font/google";
import LoginForm from "./login-form";
import styles from "./login.module.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export default function Page() {
  return (
    <main className={`${styles.page} ${poppins.className}`}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <LoginForm />
        <p className={styles.foot}>VidaTech HQ. Authorized access only.</p>
      </div>
    </main>
  );
}
