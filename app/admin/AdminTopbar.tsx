"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminTopbar({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="bg-[#0f2d5c] text-white py-4 px-6 shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="font-bold text-xl font-[var(--font-poppins)]">
          Satyasri <span className="text-[#C9A227]">Admin Panel</span>
        </h1>
        {userEmail && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/70 hidden sm:inline-block">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium hover:text-[#C9A227] transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}