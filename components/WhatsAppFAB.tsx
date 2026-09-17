"use client";
import { MessageCircle } from "lucide-react";
import { BUSINESS } from "@/data/business";

export default function WhatsAppFAB() {
  return (
    <a
      href={BUSINESS.contact.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95"
      style={{ boxShadow: "0 4px 20px rgba(37,211,102,0.5)" }}
    >
      <MessageCircle size={28} />
    </a>
  );
}
