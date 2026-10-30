import React from 'react';
import { Users, CalendarCheck, Star, MapPin, Sparkles, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const StatsSection: React.FC = () => {
  const { t, language } = useAuth();

  const stats = [
    {
      id: 'artists',
      icon: Users,
      value: t.statArtistsCount,
      label: t.statArtists,
      sublabel: language === 'hi' ? 'सत्यापित व प्रशिक्षित' : 'Vetted & Background Checked',
      color: 'from-rose-500 to-rose-600',
    },
    {
      id: 'bookings',
      icon: CalendarCheck,
      value: t.statBookingsCount,
      label: t.statBookings,
      sublabel: language === 'hi' ? 'सफलतापूर्वक पूर्ण' : 'Successful Home Makeovers',
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 'rating',
      icon: Star,
      value: t.statRatingVal,
      label: t.statRating,
      sublabel: language === 'hi' ? 'हजारों दुल्हनों का भरोसा' : 'Based on 32,000+ Reviews',
      color: 'from-amber-400 to-yellow-600',
    },
    {
      id: 'cities',
      icon: MapPin,
      value: t.statCitiesCount,
      label: t.statCities,
      sublabel: language === 'hi' ? 'सभी प्रमुख शहर व जिले' : 'Metros & Tier 1/2 Hubs',
      color: 'from-rose-600 to-amber-600',
    },
  ];

  return (
    <section className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-950/5 border border-rose-100/80">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-rose-100">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`flex flex-col items-center text-center ${
                  idx > 0 && idx % 2 === 0 ? 'pt-6 lg:pt-0' : idx % 2 !== 0 ? 'pt-0' : ''
                } lg:px-4`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md mb-3`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  {item.value}
                </h4>
                <p className="text-sm font-semibold text-rose-900 mt-0.5">{item.label}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">{item.sublabel}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
