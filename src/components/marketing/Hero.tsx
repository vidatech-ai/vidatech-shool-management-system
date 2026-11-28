import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Rocket } from "lucide-react";
import HeroStats from "./HeroStats";
import HeroPhoto from "./HeroPhoto";
import KenyaFlag from "./KenyaFlag";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_30%,rgba(8,126,188,0.45),transparent_60%)]"
        aria-hidden
      />
      <HeroPhoto />
      <div className="relative px-[max(24px,6vw)] py-10 md:flex md:min-h-[34vw] md:items-center md:py-12">
        <div className="max-w-[640px] md:max-w-[46vw]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm">
            <KenyaFlag /> Kenya’s Premier School Management System
          </span>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-[clamp(3rem,4.2vw,6.5rem)]">
            One Platform.
            <br />
            Every School.
            <br />
            <span className="text-brand-secondary">Infinite Possibilities.</span>
          </h1>
          <p className="mt-5 max-w-[560px] text-lg text-white/90 md:max-w-[36vw] md:text-[clamp(1.125rem,1.15vw,1.75rem)] md:leading-relaxed">
            VidaTech is a powerful, multi-tenant school management system designed for Kenya’s CBC and 8-4-4 education system.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-7 py-3.5 font-semibold shadow-lg shadow-brand-primary/30 transition hover:brightness-110"
            >
              <Rocket size={18} aria-hidden /> Register Your School <ArrowRight size={18} aria-hidden />
            </Link>
            <button
              type="button"
              disabled
              title="Coming soon"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 font-semibold text-white/90 opacity-80"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full border border-white/70">
                <Play size={11} fill="currentColor" aria-hidden />
              </span>
              Watch Demo
              <span className="ml-1 rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium">Coming soon</span>
            </button>
          </div>
          <HeroStats />
        </div>
      </div>
    </section>
  );
}
