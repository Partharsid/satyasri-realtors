import { Phone } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { SITE } from "@/lib/site";

/** Always-reachable Call + WhatsApp buttons on phones (the header shows them on larger screens). */
export default function FloatingActions({ callLabel, whatsappLabel }: { callLabel: string; whatsappLabel: string }) {
  return (
    <div style={{ viewTransitionName: "action-bar" }} className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-mist bg-paper/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <a href={SITE.phoneHref} className="btn btn-dark w-full">
        <Phone size={16} strokeWidth={1.6} aria-hidden /> {callLabel}
      </a>
      <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
        <WhatsAppIcon size={17} /> {whatsappLabel}
      </a>
    </div>
  );
}
