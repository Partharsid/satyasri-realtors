"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import type { ListingRow } from "@/lib/data";
import { signOut } from "../actions";
import ListingsPanel from "./ListingsPanel";
import LeadsPanel, { type Lead } from "./LeadsPanel";
import { PostsPanel, ReviewsPanel, SettingsPanel, type Post, type ReviewRow } from "./ContentPanels";

type Tab = "leads" | "listings" | "posts" | "reviews" | "settings";

export default function AdminApp({
  email,
  listings,
  leads,
  posts,
  reviews,
  settings,
}: {
  email: string;
  listings: ListingRow[];
  leads: Lead[];
  posts: Post[];
  reviews: ReviewRow[];
  settings: Record<string, string>;
}) {
  const newLeads = leads.filter((l) => l.status === "new").length;
  const [tab, setTab] = useState<Tab>(newLeads ? "leads" : "listings");

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "leads", label: "Leads", badge: newLeads },
    { id: "listings", label: "Properties" },
    { id: "posts", label: "Journal" },
    { id: "reviews", label: "Reviews" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-20 border-b border-mist bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Image src="/brand/icon.svg" alt="" width={36} height={26} />
            <span className="text-[15px] font-medium">SatyaSri Admin</span>
          </div>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="hidden text-pewter sm:inline">{email}</span>
            <a href="/en" target="_blank" rel="noopener noreferrer" className="btn btn-outline !min-h-9 !py-2 !text-[13px]">
              View site <ExternalLink size={13} aria-hidden />
            </a>
            <form action={signOut}>
              <button className="btn btn-dark !min-h-9 !py-2 !text-[13px]">
                <LogOut size={13} aria-hidden /> Sign out
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4" aria-label="Admin sections">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              className={`relative whitespace-nowrap px-3 py-3 text-[14px] transition-colors ${tab === t.id ? "text-ink after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-brand" : "text-pewter hover:text-ink"}`}
            >
              {t.label}
              {t.badge ? <span className="ml-1.5 rounded-full bg-brand px-1.5 py-0.5 text-[11px] text-paper">{t.badge}</span> : null}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === "leads" && <LeadsPanel leads={leads} />}
        {tab === "listings" && <ListingsPanel listings={listings} />}
        {tab === "posts" && <PostsPanel posts={posts} />}
        {tab === "reviews" && <ReviewsPanel reviews={reviews} />}
        {tab === "settings" && <SettingsPanel settings={settings} />}
      </main>
    </div>
  );
}
