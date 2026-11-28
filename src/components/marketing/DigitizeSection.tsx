import { ArrowRight, Check } from "lucide-react";
import DashboardMockup from "./DashboardMockup";

const POINTS = [
  "Kenya CBC & 8-4-4 Curriculum Support",
  "Secure Paystack Subscription Engine",
  "Fully Customizable for Every School",
];

export default function DigitizeSection() {
  return (
    <section className="bg-gradient-to-br from-cloud to-sky-100 dark:from-navy dark:to-graphite">
      <div className="grid items-center gap-10 px-[max(24px,6vw)] py-14 lg:grid-cols-2">
        <div>
          <p className="border-l-4 border-brand-primary pl-3 text-sm font-bold uppercase tracking-wider text-brand-primary">
            The Ultimate School Management Solution
          </p>
          <h2 className="mt-4 font-display text-5xl md:text-[clamp(2.5rem,3.1vw,4.5rem)] font-extrabold tracking-tight text-navy dark:text-white">
            Digitize. Manage. <span className="text-brand-primary">Grow.</span>
          </h2>
          <p className="mt-4 max-w-[520px] text-lg text-slate-600 dark:text-white/80">
            From admissions to reports, attendance to payments — VidaTech brings everything together in one powerful platform.
          </p>
          <ul className="mt-5 space-y-2">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 font-medium text-navy dark:text-white">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-primary text-white">
                  <Check size={13} strokeWidth={3} aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <button
            type="button"
            disabled
            title="Coming soon"
            className="mt-7 inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-brand-primary px-7 py-3.5 font-semibold text-white opacity-80"
          >
            Explore All Features <ArrowRight size={18} aria-hidden />
            <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">Coming soon</span>
          </button>
        </div>
        <DashboardMockup />
      </div>
    </section>
  );
}
