import { prisma } from "@/lib/prisma";
import { StatIconView } from "@/modules/landing-stats/icon-map";

async function loadStats() {
  try {
    return await prisma.landingStat.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, icon: true, value: true, label: true },
    });
  } catch (e) {
    console.error("landing stats failed to load", e);
    return [];
  }
}

export default async function HeroStats() {
  const stats = await loadStats();
  if (stats.length === 0) return null;
  return (
    <ul className="mt-9 flex flex-wrap gap-y-4">
      {stats.map((s, i) => (
        <li key={s.id} className={`flex items-center gap-3 pr-8 ${i > 0 ? "border-l border-white/20 pl-8" : ""}`}>
          <span className="text-white/90">
            <StatIconView name={s.icon} size={30} />
          </span>
          <div>
            <div className="text-xl font-bold leading-tight">{s.value}</div>
            <div className="text-sm text-white/80">{s.label}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
