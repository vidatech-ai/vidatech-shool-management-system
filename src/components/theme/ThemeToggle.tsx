"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="grid h-10 w-10 place-items-center rounded-full text-white/90 transition hover:bg-white/10"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
