import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export const FloatingWhatsApp: React.FC = () => {
  const { settings, language } = useApp();

  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const greeting = language === 'bn'
    ? encodeURIComponent('আসসালামু আলাইকুম ভ্যালুর। আমি আতর ও পারফিউমের বিষয়ে জানতে চাই।')
    : encodeURIComponent('Hello VELLURE, I would like to inquire about your luxury attars and fragrances.');

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${greeting}`;

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', {
      source: 'floating_widget',
      language,
      url: window.location.pathname,
      targetNumber: cleanNumber,
    });
  };

  return (
    <aside aria-label="Support chat" className="fixed bottom-32 md:bottom-8 right-4 md:right-8 z-40 animate-subtle-float hover:[animation-play-state:paused]">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        className="relative flex items-center gap-2.5 bg-[#1F2C24] hover:bg-[#25382B] text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 hover:border-emerald-400 py-2.5 px-4 rounded-full shadow-[0_4px_25px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_30px_rgba(16,185,129,0.35)] transition-all duration-300 hover:scale-105 group"
        aria-label="Chat on WhatsApp with VELLURE Concierge"
      >
        {/* Subtle idle pulsing ambient aura */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm animate-pulse pointer-events-none group-hover:opacity-40 transition-opacity" />

        {/* Subtle gentle ripple ring */}
        <span className="absolute inset-0 rounded-full border border-emerald-400/30 animate-[ping_3.5s_cubic-bezier(0,0,0.2,1)_infinite] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse ring-2 ring-[#1F2C24]" />
        </div>

        <span className="relative z-10 text-xs font-semibold tracking-wide">
          {language === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট' : 'Concierge WhatsApp'}
        </span>
      </a>
    </aside>
  );

};
