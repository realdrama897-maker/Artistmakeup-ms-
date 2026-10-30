import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const FloatingWhatsApp: React.FC = () => {
  const { language } = useAuth();

  const msg =
    language === 'hi'
      ? 'नमस्ते MS Makeup Artist! मुझे घर पर ब्यूटी पार्लर / मेकअप आर्टिस्ट बुक करना है।'
      : 'Hello MS Makeup Artist! I want to book a home beauty parlour appointment or certified makeup artist.';

  const waUrl = `https://wa.me/918433405368?text=${encodeURIComponent(msg)}`;

  return (
    <div className="fixed bottom-6 left-6 z-40 group">
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Direct WhatsApp Chat"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full animate-ping" />
        </div>
        <span className="hidden sm:inline-block text-xs font-bold tracking-wide pr-1">
          {language === 'hi' ? 'व्हाट्सएप चैट' : 'Chat on WhatsApp'}
        </span>
      </a>
    </div>
  );
};
