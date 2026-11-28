import { Bell, BookOpen, FileText, GraduationCap, LayoutDashboard, Settings, TrendingUp, Users, Wallet } from "lucide-react";
import Logo from "@/components/brand/Logo";
import PerformanceChart from "./PerformanceChart";
import RecentActivities from "./RecentActivities";

const MENU = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Students" },
  { icon: GraduationCap, label: "Teachers" },
  { icon: BookOpen, label: "Academics" },
  { icon: Wallet, label: "Finance" },
  { icon: FileText, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

const CARDS = [
  { icon: Users, value: "2,450", label: "Total Students", bg: "from-sky-500 to-blue-600" },
  { icon: GraduationCap, value: "124", label: "Teachers", bg: "from-emerald-500 to-green-600" },
  { icon: TrendingUp, value: "98%", label: "Attendance", bg: "from-indigo-500 to-violet-600" },
];

/* Decorative picture of the product. The numbers are sample values, not real data. */
export default function DashboardMockup() {
  return (
    <div aria-hidden="true" className="flex overflow-hidden rounded-2xl border-4 border-brand-primary/80 bg-white shadow-2xl shadow-brand-primary/20">
      <aside className="hidden w-36 shrink-0 bg-navy p-3 text-white sm:block">
        <Logo width={110} />
        <ul className="mt-4 space-y-1">
          {MENU.map(({ icon: Icon, label, active }) => (
            <li
              key={label}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] ${active ? "bg-brand-primary" : "text-white/80"}`}
            >
              <Icon size={12} /> {label}
            </li>
          ))}
        </ul>
      </aside>
      <div className="min-w-0 flex-1 bg-slate-50 p-4 text-slate-800">
        <div className="flex items-center justify-end gap-3 text-[10px]">
          <Bell size={14} className="text-brand-primary" />
          <span className="grid h-5 w-5 place-items-center rounded-full bg-slate-300 text-[9px] font-bold">P</span>
          Principal
        </div>
        <h3 className="mt-1 font-display text-sm font-bold">School Dashboard</h3>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {CARDS.map(({ icon: Icon, value, label, bg }) => (
            <div key={label} className={`rounded-lg bg-gradient-to-br ${bg} p-3 text-white`}>
              <Icon size={16} />
              <div className="mt-1 text-lg font-bold leading-none">{value}</div>
              <div className="mt-1 text-[9px] opacity-90">{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-5">
          <div className="md:col-span-3"><PerformanceChart /></div>
          <div className="md:col-span-2"><RecentActivities /></div>
        </div>
      </div>
    </div>
  );
}
