import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Content tags used for on-demand revalidation from /admin. */
export const TAGS = {
  listings: "listings",
  blog: "blog",
  reviews: "reviews",
  settings: "settings",
} as const;

/**
 * Anonymous, cookie-free client for public pages. Every request is cached by
 * the Next.js data cache under `tag` and refreshed when /admin saves, with a
 * 10-minute safety net.
 */
export function publicClient(tag: string) {
  return createClient(URL, ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 600, tags: [tag] } }),
    },
  });
}

/** Service-role client — bypasses RLS. Server-only; used for inserting leads. */
export function serviceClient() {
  return createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}

/** Cookie-bound client acting as the signed-in admin (RLS applies). */
export async function sessionClient() {
  const cookieStore = await cookies();
  return createServerClient(URL, ANON, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component — the proxy refreshes the session instead.
        }
      },
    },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}
