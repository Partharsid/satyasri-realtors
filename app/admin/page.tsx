import AdminApp from "./ui/AdminApp";
import { requireAdmin } from "./auth";
import { signOut } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { supabase, user, isAdmin } = await requireAdmin();

  if (!isAdmin) {
    return (
      <main className="grid min-h-svh place-items-center p-4">
        <div className="max-w-md rounded-card bg-paper p-8">
          <h1 className="text-[22px] font-light">Not authorised</h1>
          <p className="mt-3 text-pewter">
            {user.email} is signed in but isn&apos;t on the admin list. Ask the site owner to add this email to the
            <code className="mx-1 rounded bg-mist px-1">admins</code>table.
          </p>
          <form action={signOut} className="mt-6">
            <button className="btn btn-dark">Sign out</button>
          </form>
        </div>
      </main>
    );
  }

  const [listings, leads, posts, reviews, settings] = await Promise.all([
    supabase.from("listings").select("*").order("sort_order").order("created_at", { ascending: false }),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(500),
    supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
    supabase.from("reviews").select("*").order("sort_order"),
    supabase.from("settings").select("key,value"),
  ]);

  return (
    <AdminApp
      email={user.email ?? ""}
      listings={listings.data ?? []}
      leads={leads.data ?? []}
      posts={posts.data ?? []}
      reviews={reviews.data ?? []}
      settings={Object.fromEntries((settings.data ?? []).map((r) => [r.key, r.value]))}
    />
  );
}
