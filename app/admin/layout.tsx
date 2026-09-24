import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-montserrat", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Admin — SatyaSri Realtors", template: "%s — SatyaSri Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="min-h-svh bg-mist-soft">{children}</body>
    </html>
  );
}
