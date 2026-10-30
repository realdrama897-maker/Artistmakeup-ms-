import React, { useState } from 'react';
import { Sparkles, Calendar, User, LogOut, Menu, X, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenAuth: (initialRole?: 'customer' | 'artist' | 'admin', mode?: 'login' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  onOpenAuth,
}) => {
  const { user, logout, language, setLanguage, t } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'services', label: t.navServices },
    { id: 'rate-list', label: t.navRateList },
    { id: 'artists', label: t.navArtists },
    { id: 'how-it-works', label: t.navHowItWorks },
    { id: 'gallery', label: t.navGallery },
    { id: 'contact', label: t.navContact },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100 transition-all duration-300">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-rose-50 text-xs py-1.5 px-4 font-medium text-center flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span className="font-semibold text-amber-200">
            {language === 'hi' ? 'शादी व पार्टी सीजन ऑफर:' : 'Wedding & Festive Season:'}
          </span>{' '}
          {language === 'hi'
            ? 'घर बैठे ब्यूटी पार्लर पर पाएं 15% छूट! हाइजेनिक किट के साथ।'
            : 'Get flat 15% off on Bridal & Pre-Bridal home bookings! 100% Sanitized kits.'}
        </span>
        <span className="hidden md:inline-block text-rose-300">|</span>
        <a
          href="tel:+918433405368"
          className="hidden md:flex items-center gap-1.5 text-amber-200 hover:text-white transition-colors font-bold"
        >
          <PhoneCall className="w-3.5 h-3.5" /> Helpline: 8433405368
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* MS Makeup Artist Brand Logo */}
          <button
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-rose-600 to-amber-700 flex items-center justify-center shadow-lg shadow-rose-600/25 group-hover:scale-105 transition-transform duration-300 border-2 border-amber-200/80">
              <span className="font-serif font-extrabold text-xl text-white tracking-tighter drop-shadow-md">
                MS
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-200 absolute -top-1.5 -right-1.5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-extrabold tracking-tight bg-gradient-to-r from-rose-950 via-rose-800 to-amber-900 bg-clip-text text-transparent">
                  MS Makeup Artist
                </span>
                <span className="bg-gradient-to-r from-amber-100 to-rose-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300 uppercase tracking-wider shadow-2xs">
                  Official
                </span>
              </div>
              <p className="text-[11px] font-semibold text-rose-700/90 tracking-wide">
                {t.brandTagline} • Helpline: 8433405368
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'text-rose-700 bg-rose-50 font-semibold'
                    : 'text-neutral-700 hover:text-rose-600 hover:bg-rose-50/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-rose-50/80 p-0.5 rounded-full border border-rose-200/60 text-xs font-semibold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'en'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-rose-700'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === 'hi'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-rose-700'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* User Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (user.role === 'admin') setActiveTab('admin-panel');
                    else if (user.role === 'artist') setActiveTab('artist-dashboard');
                    else setActiveTab('customer-dashboard');
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-xs">
                    <p className="font-semibold text-neutral-800 leading-tight truncate max-w-[100px]">
                      {user.name}
                    </p>
                    <span className="text-[10px] text-rose-600 font-medium capitalize">
                      {user.role}
                    </span>
                  </div>
                </button>
                <button
                  onClick={logout}
                  title={t.navLogout}
                  className="p-2 rounded-xl text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('customer', 'login')}
                  className="px-3 py-1.5 text-xs font-bold text-neutral-800 hover:text-rose-700 bg-rose-50/80 hover:bg-rose-100/80 rounded-xl transition-all border border-rose-200/80 shadow-2xs"
                >
                  {language === 'hi' ? '👤 ग्राहक लॉगिन' : '👤 Customer Login'}
                </button>
                <button
                  onClick={() => onOpenAuth('artist', 'register')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-100 to-amber-200/90 hover:from-amber-200 hover:to-amber-300 transition-all border border-amber-300 shadow-2xs"
                >
                  {language === 'hi' ? '✨ आर्टिस्ट रजिस्ट्रेशन' : '✨ Artist Sign Up'}
                </button>
              </div>
            )}

            {/* Primary CTA Book Button */}
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-700 hover:to-amber-700 shadow-md shadow-rose-600/25 hover:shadow-lg hover:shadow-rose-600/30 active:scale-95 transition-all duration-200"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">{t.bookNowBtn}</span>
              <span className="sm:hidden font-semibold">{language === 'hi' ? 'बुक करें' : 'Book'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-rose-100 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-rose-100">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-2 text-left rounded-lg text-sm font-medium ${
                  activeTab === item.id
                    ? 'text-rose-700 bg-rose-50 font-bold'
                    : 'text-neutral-700 hover:bg-rose-50/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {!user && (
            <div className="pt-2 flex flex-col gap-2">
              <div className="text-xs font-bold text-neutral-400 px-1">
                {language === 'hi' ? 'लॉगिन एवं रजिस्ट्रेशन विकल्प:' : 'Account Sign In & Sign Up:'}
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('customer', 'login');
                }}
                className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-800 font-bold text-xs hover:bg-rose-50 transition-colors text-left px-3 flex items-center justify-between"
              >
                <span>👤 {language === 'hi' ? 'ग्राहक लॉगिन / साइन अप' : 'Customer Login / Sign Up'}</span>
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold">Book Doorstep</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('artist', 'register');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/90 border border-amber-300 text-amber-950 font-bold text-xs hover:bg-amber-100 transition-colors text-left px-3 flex items-center justify-between"
              >
                <span>✨ {language === 'hi' ? 'आर्टिस्ट / पार्लर रजिस्ट्रेशन' : 'Join as Artist / Parlour'}</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">Earn With Us</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
