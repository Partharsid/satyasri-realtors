"use client";

import { useState, useEffect } from "react";
import { Share2, Heart, MessageCircle } from "lucide-react";

import type { Listing } from "@/data/listings";

export default function ListingActions({ listing }: { listing: Listing }) {
  const [isSaved, setIsSaved] = useState(false);
  const [showToast, setShowToast] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("satyasri_saved_listings") || "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSaved(saved.includes(listing.slug));
    } catch (e) {
      console.error("Local storage access denied", e);
    }
  }, [listing.slug]);

  const toggleSave = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("satyasri_saved_listings") || "[]");
      let newSaved;
      if (saved.includes(listing.slug)) {
        newSaved = saved.filter((s: string) => s !== listing.slug);
        setIsSaved(false);
        setShowToast("Removed from favorites");
      } else {
        newSaved = [...saved, listing.slug];
        setIsSaved(true);
        setShowToast("Saved to favorites");
      }
      localStorage.setItem("satyasri_saved_listings", JSON.stringify(newSaved));

      setTimeout(() => setShowToast(""), 2000);
    } catch (e) {
      console.error("Local storage error", e);
    }
  };

  const shareProperty = async () => {
    const url = window.location.href;
    const title = `${listing.title} | Satyasri Realtors`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this property: ${listing.title} for ${listing.price}`,
          url,
        });
      } catch (err) {
        console.log("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setShowToast("Link copied to clipboard");
      setTimeout(() => setShowToast(""), 2000);
    }
  };

  const whatsappMessage = `Hi, I am interested in ${listing.title} (ID: ${listing.slug}) listed at ${listing.price}. Please share more details.`;
  const whatsappUrl = `https://wa.me/919014224408?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-[#e5e0d8]">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-white bg-[#25D366] hover:bg-[#128C7E] transition-colors shadow-sm"
      >
        <MessageCircle size={18} /> WhatsApp Enquiry
      </a>

      <div className="flex gap-3">
        <button
          onClick={shareProperty}
          className="flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium border border-[#e5e0d8] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors bg-white"
        >
          <Share2 size={16} /> Share
        </button>
        <button
          onClick={toggleSave}
          className="flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium border border-[#e5e0d8] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors bg-white"
        >
          <Heart size={16} className={isSaved ? "fill-[#C9A227] text-[#C9A227]" : ""} />
          {isSaved ? "Saved" : "Favorite"}
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#0f2d5c] text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50 animate-fade-in">
          {showToast}
        </div>
      )}
    </div>
  );
}