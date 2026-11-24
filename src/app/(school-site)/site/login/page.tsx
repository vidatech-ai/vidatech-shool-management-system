import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { env } from "@/config/env";
import { getAccessMode } from "@/core/subscription/access-mode";
import LoginForm from "./login-form";
import styles from "./login.module.css";

export default async function Page() {
  const slug = (await headers()).get("x-school-slug");
  if (!slug) notFound();

  const school = await prisma.school.findUnique({
    where: { slug },
    select: { name: true, motto: true, logoUrl: true, status: true, subscriptionExpiresAt: true },
  });
  if (!school) notFound();

  const base = process.env.NEXT_PUBLIC_ROUTING_MODE === "SUBDOMAIN" ? "" : `/s/${slug}`;
  const mode = getAccessMode(school, env.GRACE_HOURS);
  if (mode === "SUSPENDED" || mode === "PENDING") redirect(`${base}/suspended`);

  return (
    <main className={styles.page}>
      <div className={`${styles.ring} ${styles.ring1}`} />
      <div className={`${styles.ring} ${styles.ring2}`} />
      <div className={`${styles.ring} ${styles.ring3}`} />
      <div className={styles.shell}>
        <section className={styles.brand}>
          <span className={styles.badge}>VidaTech School Management</span>
          <h1 className={styles.headline}>One secure portal for every role in your school.</h1>
          <p className={styles.sub}>
            Attendance, assessments, fees and messaging, built for Kenya CBC and 8-4-4 schools.
          </p>
          <ul className={styles.roles}>
            <li>Admin</li>
            <li>Teacher</li>
            <li>Student</li>
            <li>Parent</li>
            <li>Accountant</li>
            <li>Support Staff</li>
          </ul>
        </section>

        <section className={styles.cardWrap}>
          <div className={styles.card}>
            <div className={styles.logo}>
              {school.logoUrl ? (
                <img src={school.logoUrl} alt={school.name} className={styles.logoImg} />
              ) : (
                <span>{school.name}</span>
              )}
            </div>
            {school.motto ? <p className={styles.motto}>{school.motto}</p> : null}
            <h2 className={styles.title}>Login</h2>
            <LoginForm slug={slug} base={base} />
            <p className={styles.foot}>
              Powered by VidaTech. <a href="/register">Register your school</a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
