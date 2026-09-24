"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export default function ShareButton({ title, url, labels }: { title: string; url: string; labels: { share: string; copied: string } }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if ((err as DOMException).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(labels.share, url);
    }
  }

  return (
    <button type="button" onClick={share} className="btn btn-outline" aria-live="polite">
      {copied ? <Check size={16} strokeWidth={1.6} aria-hidden /> : <Share2 size={16} strokeWidth={1.6} aria-hidden />}
      {copied ? labels.copied : labels.share}
    </button>
  );
}
