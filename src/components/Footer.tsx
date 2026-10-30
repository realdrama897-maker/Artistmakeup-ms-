import React from 'react';
import { Sparkles, Phone, Mail, MapPin, ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const topServices = [
    'Bridal Makeup (Dulhan Look)',
    'HD & Airbrush Makeup',
    'Party & Sangeet Makeup',
    'Mehendi / Henna Design',
    'Gold & Diamond Facial',
    'Keratin Nanoplastia Smoothening',
    'Luxury Spa Mani-Pedi',
    'Saree & Lehenga Draping',
    'Full Body Waxing & Clean-up',
    'Complete Pre-Bridal Glow Package',
  ];

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-rose-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-rose-600 to-amber-700 flex items-center justify-center text-white shadow-lg border border-amber-300/40">
                <span className="font-serif font-black text-lg text-white">MS</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-white tracking-tight">
                  MS Makeup Artist
                </span>
                <span className="block text-[10px] text-amber-300 font-semibold uppercase tracking-wider">
                  Professional Home Parlour Network
                </span>
              </div>
            </div>

            <p className="text-xs text-rose-400 font-semibold tracking-wide">
              {t.brandTagline}
            </p>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {language === 'hi'
                ? 'भारत का सबसे भरोसेमंद घर बैठे ब्यूटी पार्लर प्लेटफॉर्म। 1500+ वेरिफाइड आर्टिस्ट्स, 100% सैनिटाइज्ड डिस्पोजेबल किट्स और पारदर्शी रेट्स।'
                : "India's premier doorstep beauty parlour booking network. Verified makeup artists, 100% sealed disposable kits, and certified premium cosmetics delivered to your home."}
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Money-back Quality Guarantee</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-4 tracking-wide uppercase">
              {language === 'hi' ? 'नेविगेशन' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-rose-400 transition-colors"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-rose-400 transition-colors"
                >
                  {t.navServices}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('rate-list')}
                  className="hover:text-rose-400 transition-colors"
                >
                  {t.navRateList}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('artists')}
                  className="hover:text-rose-400 transition-colors"
                >
                  {t.navArtists}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-rose-400 transition-colors"
                >
                  {t.navHowItWorks}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-rose-400 transition-colors"
                >
                  {t.navGallery}
                </button>
              </li>
            </ul>
          </div>

          {/* Har Kaam List */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-4 tracking-wide uppercase">
              {language === 'hi' ? 'पॉपुलर सेवाएं' : 'Top Services'}
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              {topServices.slice(0, 6).map((srv, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onNavigate('services')}
                    className="hover:text-rose-400 transition-colors text-left"
                  >
                    {srv}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-4 tracking-wide uppercase">
              {language === 'hi' ? 'संपर्क व केंद्र' : 'Helpline & Hub'}
            </h4>
            <ul className="space-y-3 text-xs text-neutral-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <a href="tel:+918433405368" className="hover:text-white transition-colors">
                  +91 84334 05368
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <a href="mailto:support@msmakeupartist.in" className="hover:text-white transition-colors">
                  support@msmakeupartist.in
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>Delhi NCR, Mumbai, Jaipur, Pune, Bengaluru & Chandigarh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © {new Date().getFullYear()} MS Makeup Artist Technologies Pvt. Ltd. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-neutral-400 cursor-pointer">Hygiene Standards</span>
            <span className="hover:text-neutral-400 cursor-pointer">Terms of Service</span>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors flex items-center gap-1"
              title="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
