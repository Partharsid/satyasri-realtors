"use client";

import type { ReactNode } from "react";
import { Heart } from "lucide-react";
import { useSaved } from "./saved-store";
import { WhatsAppIcon } from "./icons";
import { whatsappLink } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

type Card = { slug: string; title: string; url: string; node: ReactNode };

export default function SavedList({ cards, t }: { cards: Card[]; t: Dictionary["saved"] }) {
  const saved = useSaved();
  const mine = cards.filter((c) => saved.includes(c.slug));

  if (!mine.length) {
    return (
      <div className="rounded-card bg-mist-soft p-8 md:p-12">
        <Heart size={28} strokeWidth={1.3} className="text-brand" aria-hidden />
        <p className="mt-4 max-w-[560px] text-[17px]">{t.empty}</p>
      </div>
    );
  }

  const message = [t.whatsappMessage, ...mine.map((c) => `• ${c.title} — ${c.url}`)].join("\n");

  return (
    <>
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-[14px] text-pewter">{t.note}</p>
        <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp self-start">
          <WhatsAppIcon size={17} /> {t.enquireAll}
        </a>
      </div>
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {mine.map((c) => (
          <div key={c.slug}>{c.node}</div>
        ))}
      </div>
    </>
  );
}
