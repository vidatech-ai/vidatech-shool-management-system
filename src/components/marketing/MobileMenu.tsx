import Link from "next/link";
import { Menu } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";

const row = "block rounded-lg px-3 py-2 text-white hover:bg-white/10";

export default function MobileMenu() {
  return (
    <details className="relative lg:hidden">
      <summary
        aria-label="Open menu"
        className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full text-white hover:bg-white/10 [&::-webkit-details-marker]:hidden"
      >
        <Menu size={22} />
      </summary>
      <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-white/10 bg-navy p-3 shadow-2xl">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <Link href={item.href} className={row}>{item.label}</Link>
              ) : item.children?.length ? (
                <>
                  <span className="block px-3 py-2 text-white/60">{item.label}</span>
                  {item.children.map((c) => (
                    <Link key={c.href} href={c.href} className={`${row} pl-6`}>{c.label}</Link>
                  ))}
                </>
              ) : (
                <span className="flex items-center justify-between px-3 py-2 text-white/60">
                  {item.label}
                  <span className="text-xs">Coming soon</span>
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-3 grid gap-2 border-t border-white/10 pt-3 sm:hidden">
          <Link href="/find-school" className="rounded-xl border-2 border-brand-primary px-4 py-2 text-center font-semibold text-white">Login</Link>
          <Link href="/register" className="rounded-xl bg-brand-primary px-4 py-2 text-center font-semibold text-white">Register School</Link>
        </div>
      </div>
    </details>
  );
}
