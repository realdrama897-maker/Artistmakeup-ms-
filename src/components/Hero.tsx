import React from 'react';
import { Sparkles, Calendar, ShieldCheck, HeartHandshake, Star, ArrowRight, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
  onJoinArtist: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onExploreServices,
  onJoinArtist,
}) => {
  const { t, language } = useAuth();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-[#FFF5F7] via-[#FFF9F6] to-white">
      {/* Subtle luxury background radial blurs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 -ml-20 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-rose-200 shadow-sm text-xs font-semibold text-rose-800">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{language === 'hi' ? 'अब पूरे भारत में उपलब्ध' : 'Doorstep Service Across India'}</span>
              <span className="text-neutral-300">•</span>
              <span className="text-amber-700 flex items-center gap-1 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.95 Rating
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-900 leading-[1.15] tracking-tight">
              {t.heroTitle}
            </h1>

            {/* Tagline highlighted in gold/rose-gold */}
            <div className="inline-block">
              <p className="font-serif text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-700 via-amber-700 to-rose-800 bg-clip-text text-transparent">
                {t.brandTagline}
              </p>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Feature Bullets with Luxury Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-rose-100 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-medium text-neutral-800">
                  {language === 'hi' ? '100% सैनिटाइज्ड डिस्पोजेबल किट' : '100% Sanitized Single-Use Kits'}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-rose-100 shadow-xs">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="text-xs font-medium text-neutral-800">
                  {language === 'hi' ? 'ओरिजिनल इंटरनेशनल ब्रांड्स' : 'Original International Brands'}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-rose-100 shadow-xs">
                <Clock className="w-5 h-5 text-rose-500 shrink-0" />
                <span className="text-xs font-medium text-neutral-800">
                  {language === 'hi' ? 'समय पर घर पहुंचने की गारंटी' : 'Guaranteed On-Time Home Arrival'}
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onOpenBooking}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-700 hover:to-amber-700 shadow-lg shadow-rose-600/30 hover:shadow-xl hover:shadow-rose-600/35 active:scale-95 transition-all duration-200"
              >
                <Calendar className="w-5 h-5" />
                <span>{t.bookNowBtn}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                onClick={onExploreServices}
                className="px-5 py-3.5 rounded-xl text-base font-semibold text-neutral-800 bg-white hover:bg-rose-50 border border-rose-200 shadow-sm hover:border-rose-300 transition-all"
              >
                {t.exploreServicesBtn}
              </button>

              <button
                onClick={onJoinArtist}
                className="px-4 py-3 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 transition-colors"
              >
                {t.becomeArtistBtn}
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 rounded-3xl blur-md opacity-40 animate-pulse" />

              {/* Main Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1000&q=85"
                  alt="Indian Bridal Makeup Artist at home"
                  className="w-full h-[440px] sm:h-[480px] object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />

                {/* Gradient Overlay for bottom text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="bg-rose-500/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
                      At-Home Parlour
                    </span>
                    <span className="bg-amber-500/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                      <Star className="w-3 h-3 fill-white" /> 4.98
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                    Royal Dulhan & HD Party Glam
                  </h3>
                  <p className="text-xs text-rose-100 mt-1">
                    {language === 'hi'
                      ? 'अनुभवी ब्यूटीशियन्स द्वारा आपके घर के आरामदायक माहौल में।'
                      : 'Styled in the comfort of your home by London & Mumbai certified artists.'}
                  </p>
                </div>
              </div>

              {/* Floating Badge: Live Booking Ticker */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-3 max-w-[260px] animate-bounce-slow">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-neutral-500 font-medium">Just Booked 4m ago</p>
                  <p className="text-xs font-bold text-neutral-900 leading-tight">
                    Bridal HD Makeup in Delhi
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold">Artist Priya assigned</p>
                </div>
              </div>

              {/* Floating Badge: Safety Guarantee */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-amber-200 flex items-center gap-2 text-xs font-bold text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Zero Travel Hassle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
