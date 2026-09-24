"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { browserClient } from "@/lib/supabase/browser";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const { error } = await browserClient().auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    if (error) {
      setError(error.message === "Invalid login credentials" ? "Wrong email or password." : error.message);
      setBusy(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-svh place-items-center p-4">
      <div className="w-full max-w-sm rounded-card bg-paper p-8">
        <Image src="/brand/logo-full.svg" alt="SatyaSri Realtors" width={140} height={161} className="mx-auto h-auto w-[120px]" priority />
        <h1 className="mt-8 text-center text-[22px] font-light">Admin sign in</h1>
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-[13px] text-pewter">
            Email
            <input name="email" type="email" required autoComplete="username" className="field" />
          </label>
          <label className="grid gap-1.5 text-[13px] text-pewter">
            Password
            <input name="password" type="password" required autoComplete="current-password" className="field" />
          </label>
          {error ? <p role="alert" className="text-[13px] text-brand-deep">{error}</p> : null}
          <button type="submit" disabled={busy} className="btn btn-dark mt-2 w-full">
            {busy ? "Signing in…" : "Sign in"} <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
          </button>
        </form>
      </div>
    </main>
  );
}
