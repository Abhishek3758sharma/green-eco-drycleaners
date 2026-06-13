import { MessageCircle } from "lucide-react";
import { BUSINESS } from "@/lib/business";

export function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent("Hi! I'd like to book a pickup with Green Eco Drycleaners.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--whatsapp)] text-white shadow-soft hover:scale-110 transition-transform"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
      </span>
    </a>
  );
}
