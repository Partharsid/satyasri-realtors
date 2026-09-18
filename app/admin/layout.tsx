import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminTopbar from "./AdminTopbar";

export const metadata: Metadata = {
  title: "Admin Panel | Satyasri Realtors",
  description: "Secure admin dashboard for managing properties and leads.",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div className="min-h-screen bg-[#f8f7f4] pt-20">
      <AdminTopbar userEmail={user?.email} />
      <div className="container mx-auto py-8 px-4 sm:px-6">
        {children}
      </div>
    </div>
  );
}