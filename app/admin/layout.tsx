import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Satyasri Realtors",
  description: "Secure admin dashboard for managing properties and leads.",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f7f4] pt-20">
      <div className="bg-[#0f2d5c] text-white py-4 px-6 shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-bold text-xl font-[var(--font-poppins)]">
            Satyasri <span className="text-[#C9A227]">Admin Panel</span>
          </h1>
          <button className="text-sm font-medium hover:text-[#C9A227] transition-colors">Logout</button>
        </div>
      </div>
      <div className="container mx-auto py-8">
        {children}
      </div>
    </div>
  );
}