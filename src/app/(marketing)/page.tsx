import SiteHeader from "@/components/marketing/SiteHeader";
import Hero from "@/components/marketing/Hero";
import FeatureStrip from "@/components/marketing/FeatureStrip";
import DigitizeSection from "@/components/marketing/DigitizeSection";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-navy dark:text-white">
      <SiteHeader />
      <main>
        <Hero />
        <FeatureStrip />
        <DigitizeSection />
      </main>
    </div>
  );
}
