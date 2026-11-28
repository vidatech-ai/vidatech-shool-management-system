import Link from "next/link";
import styles from "./hq.module.css";

const LINKS = [
  { href: "/hq", label: "Dashboard" },
  { href: "/hq/schools", label: "Schools" },
  { href: "/hq/payments", label: "Payments" },
  { href: "/hq/stats", label: "Landing stats" },
];

export default function HqNav() {
  return (
    <nav className={styles.nav}>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
