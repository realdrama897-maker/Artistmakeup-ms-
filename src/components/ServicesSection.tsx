import React, { useState } from 'react';
import { Sparkles, Clock, ArrowRight, Check, Heart, ShieldCheck } from 'lucide-react';
import { ServiceItem } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForBooking: (service: ServiceItem) => void;
  onViewRateList: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForBooking,
  onViewRateList,
}) => {
  const { t, language } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: t.categoryAll },
    { id: 'makeup', label: t.categoryMakeup },
    { id: 'hair', label: t.categoryHair },
    { id: 'skin', label: t.categorySkin },
    { id: 'nails', label: t.categoryNails },
    { id: 'packages', label: t.categoryPackages },
  ];

  const filteredServices = services.filter((srv) => {
    const matchesCategory = activeCategory === 'all' || srv.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      srv.nameEn.toLowerCase().includes(q) ||
      srv.nameHi.toLowerCase().includes(q) ||
      srv.descriptionEn.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="services" className="py-16 md:py-24 bg-[#FFF9F7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200">
            {language === 'hi' ? 'हर काम का नाम' : 'Complete Service Catalog'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mt-3 mb-4">
            {t.servicesTitle}
          </h2>
          <p className="text-base sm:text-lg text-neutral-600">
            {t.servicesSubtitle}
          </p>
        </div>

        {/* Category Filter Pills & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 scale-105'
                    : 'bg-white text-neutral-700 hover:bg-rose-50 border border-rose-100 hover:border-rose-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchServicePlaceholder}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 shadow-xs"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => {
            const isHindi = language === 'hi';
            const name = isHindi ? service.nameHi : service.nameEn;
            const desc = isHindi ? service.descriptionHi : service.descriptionEn;

            return (
              <div
                key={service.id}
                className="group bg-white rounded-3xl overflow-hidden border border-rose-100/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-52 w-full overflow-hidden bg-rose-50">
                    <img
                      src={service.image}
                      alt={name}
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Popular Pill */}
                    {service.popular && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{t.popularBadge}</span>
                      </div>
                    )}

                    {/* Category tag */}
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-rose-900 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {service.category}
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{service.durationMinutes} min</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-bold text-neutral-900 group-hover:text-rose-700 transition-colors line-clamp-1">
                      {name}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                      {desc}
                    </p>

                    <div className="mt-4 pt-3 border-t border-rose-50 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-500 block uppercase tracking-wider">
                          {t.startingFrom}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-serif text-xl font-extrabold text-neutral-900">
                            ₹{service.basePrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                            {language === 'hi' ? 'सैलून से 30% सस्ता' : 'Save 30%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => onSelectServiceForBooking(service)}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 shadow-md shadow-rose-600/20 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{t.bookThisService}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center">
          <button
            onClick={onViewRateList}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-rose-200 text-rose-900 font-bold text-sm shadow-sm hover:shadow-md hover:bg-rose-50 transition-all"
          >
            <span>{t.viewAllServices}</span>
            <ArrowRight className="w-4 h-4 text-rose-600" />
          </button>
        </div>
      </div>
    </section>
  );
};
