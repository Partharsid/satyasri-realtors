import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = { title: "Page not found — SatyaSri Realtors", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="grid min-h-svh place-items-center bg-char p-6 text-paper">
        <main className="max-w-lg">
          <p className="label !text-mist/70">404</p>
          <h1 className="heading-lg mt-3">This page doesn&apos;t exist.</h1>
          <p className="mt-5 text-mist/80">Browse available properties or call us on +91 90142 24408.</p>
          <Link href="/en" className="btn mt-8 bg-paper text-ink hover:bg-mist">SatyaSri Realtors — Home</Link>
        </main>
      </body>
    </html>
  );
}
