import React from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * Floating WhatsApp contact button fixed at the bottom-right of the screen.
 */
export function WhatsAppButton() {
  const phoneNumber = "9800400463";
  const message = "Hello Om Seva Design & Build, I'd like to enquire about your services.";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-brand-green text-white rounded-full shadow-lg hover:bg-brand-green-hover hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-brand-green/30"
      aria-label="Contact Om Seva on WhatsApp"
      title="Chat with us"
    >
      <MessageCircle size={28} className="animate-pulse group-hover:scale-110 transition-transform duration-300" />

      {/* Tooltip */}
      <span className="absolute right-16 scale-0 group-hover:scale-100 bg-brand-black text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-md origin-right transition-all duration-300 whitespace-nowrap border border-brand-border/20">
        Enquire on WhatsApp
      </span>
    </a>
  );
}
