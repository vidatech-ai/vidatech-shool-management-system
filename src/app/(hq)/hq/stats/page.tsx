import { prisma } from "@/lib/prisma";
import { guardHq } from "@/core/auth/hq-guard";
import hq from "../hq.module.css";
import HqNav from "../hq-nav";
import StatsManager from "./stats-manager";

export default async function Page() {
  await guardHq();
  const rows = await prisma.landingStat.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true, icon: true, value: true, label: true },
  });

  return (
    <main className={hq.page}>
      <div className={hq.wrap}>
        <div className={hq.top}>
          <span className={hq.brand}>VidaTech HQ</span>
        </div>
        <HqNav />
        <h1 className={hq.title}>Landing page stats</h1>
        <p className={hq.note}>Add, edit, reorder or delete the stats shown on the landing page. Changes save immediately.</p>
        <StatsManager initial={rows} />
      </div>
    </main>
  );
}
