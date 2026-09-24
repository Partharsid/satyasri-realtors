"use client";

import { Heart } from "lucide-react";
import { toggleSaved, useSaved } from "./saved-store";

export default function SaveButton({
  slug,
  labels,
  variant = "icon",
}: {
  slug: string;
  labels: { save: string; saved: string };
  variant?: "icon" | "pill";
}) {
  const saved = useSaved().includes(slug);
  const label = saved ? labels.saved : labels.save;

  if (variant === "pill") {
    return (
      <button type="button" onClick={() => toggleSaved(slug)} aria-pressed={saved} className="btn btn-outline">
        <Heart size={16} strokeWidth={1.6} aria-hidden className={saved ? "fill-brand text-brand" : ""} />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(slug);
      }}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className="grid size-10 place-items-center rounded-full bg-paper/90 text-ink backdrop-blur transition-colors hover:bg-paper"
    >
      <Heart size={17} strokeWidth={1.6} aria-hidden className={saved ? "fill-brand text-brand" : ""} />
    </button>
  );
}
