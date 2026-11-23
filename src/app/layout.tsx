import type { ReactNode } from "react";
import "./globals.css";

export const metadata = { title: "VidaTech School Management System" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
