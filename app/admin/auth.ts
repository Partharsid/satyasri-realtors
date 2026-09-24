import "server-only";
import { redirect } from "next/navigation";
import { sessionClient } from "@/lib/supabase/clients";

/**
 * Resolve the signed-in admin. Being authenticated is not enough — the email
 * must be in `public.admins` (checked by the `is_admin()` SQL function).
 */
export async function requireAdmin() {
  const supabase = await sessionClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");
  const { data: ok } = await supabase.rpc("is_admin");
  return { supabase, user: data.user, isAdmin: ok === true };
}
