import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/admin/login");
  }

  // Fetch from Supabase
  const { data: dbListings } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminDashboardClient initialListings={dbListings || []} initialLeads={leads || []} />;
}