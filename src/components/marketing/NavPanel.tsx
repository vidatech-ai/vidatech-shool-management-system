import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { NavItem } from "./nav-items";

export default function NavPanel({ item }: { item: NavItem }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-1 py-2 text-[15px] font-medium text-white/90 transition hover:text-white"
      >
        {item.label}
        {item.chevron ? <ChevronDown size={16} aria-hidden /> : null}
      </button>
      <div className="invisible absolute left-0 top-full z-50 min-w-[190px] pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="rounded-xl border border-white/10 bg-navy p-2 shadow-xl">
          {item.children?.length ? (
            item.children.map((c) => (
              <Link key={c.href} href={c.href} className="block rounded-lg px-3 py-2 text-sm text-white/90 hover:bg-white/10">
                {c.label}
              </Link>
            ))
          ) : (
            <span className="block px-3 py-2 text-sm text-white/60">Coming soon</span>
          )}
        </div>
      </div>
    </div>
  );
}
