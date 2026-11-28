import { Headphones, Map as MapIcon, Settings, ShieldCheck, Smartphone, TrendingUp } from "lucide-react";

const ITEMS = [
  { icon: Settings, title: "Complete Automation", text: "Streamline all school operations", color: "text-sky-500" },
  { icon: ShieldCheck, title: "Secure & Reliable", text: "Your data, always protected", color: "text-violet-500" },
  { icon: TrendingUp, title: "Real-Time Analytics", text: "Make data-driven decisions", color: "text-emerald-500" },
  { icon: Smartphone, title: "Multi-Device Access", text: "Anytime, anywhere", color: "text-orange-500" },
  { icon: Headphones, title: "24/7 Support", text: "Always here to help", color: "text-violet-500" },
  { icon: MapIcon, title: "Kenya CBC Ready", text: "Built for our education system", color: "text-green-600" },
];

export default function FeatureStrip() {
  return (
    <section className="bg-cloud dark:bg-graphite">
      <div className="px-[max(24px,6vw)] py-5">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {ITEMS.map(({ icon: Icon, title, text, color }) => (
            <li
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-white/10 dark:bg-navy"
            >
              <Icon size={28} className={`mx-auto ${color}`} aria-hidden />
              <h3 className="mt-2 font-display text-[15px] font-bold text-navy dark:text-white">{title}</h3>
              <p className="mt-1 text-[13px] text-slate-500 dark:text-white/70">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
