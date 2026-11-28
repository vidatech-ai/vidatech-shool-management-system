import Link from "next/link";
import { School } from "lucide-react";
import Logo from "@/components/brand/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { NAV_ITEMS } from "./nav-items";
import NavPanel from "./NavPanel";
import MobileMenu from "./MobileMenu";

export default function SiteHeader() {
  return (
    <header className="relative z-40 border-b border-white/10 bg-navy">
      <div className="flex h-[76px] items-center justify-between gap-4 px-[max(24px,6vw)]">
        <Link href="/" aria-label="VidaTech home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV_ITEMS.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className="border-b-2 border-brand-secondary py-2 text-[15px] font-medium text-brand-secondary"
              >
                {item.label}
              </Link>
            ) : (
              <NavPanel key={item.label} item={item} />
            ),
          )}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/find-school"
            className="hidden rounded-xl border-2 border-brand-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary/20 sm:block"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="hidden items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 sm:flex"
          >
            <School size={16} aria-hidden /> Register School
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
