"use client";
import { MessageCircle, Phone } from "lucide-react";
import { BUSINESS } from "@/data/business";

export default function WhatsAppFAB() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Call FAB - visible on mobile especially, but we'll show it everywhere */}
      <a
        href={`tel:${BUSINESS.contact.phone}`}
        aria-label="Call us"
        className="w-14 h-14 rounded-full bg-[#0f2d5c] hover:bg-[#1a4480] shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95 md:hidden"
        style={{ boxShadow: "0 4px 20px rgba(15, 45, 92, 0.4)" }}
      >
        <Phone size={24} />
      </a>
      {/* WhatsApp FAB */}
      <a
        href={BUSINESS.contact.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25d366] hover:bg-[#128c7e] shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ boxShadow: "0 4px 20px rgba(37,211,102,0.5)" }}
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}
