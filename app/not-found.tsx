import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center">
      <div className="text-center text-white px-4">
        <p className="text-8xl font-bold font-[var(--font-poppins)] mb-4 opacity-30">404</p>
        <h1 className="text-2xl sm:text-3xl font-bold font-[var(--font-poppins)] mb-3">
          Page Not Found
        </h1>
        <p className="text-white/70 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <Home size={16} /> Go Home
          </Link>
          <Link href="/listings" className="btn-outline-white">
            <Search size={16} /> Browse Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
