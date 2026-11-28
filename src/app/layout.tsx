import type { ReactNode } from "react";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata = { title: "VidaTech School Management System" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${manrope.variable} ${inter.variable}`}>
      <body className="font-sans antialiased"><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
