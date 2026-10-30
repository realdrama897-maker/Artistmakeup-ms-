import React, { useState } from 'react';
import { Tag, Filter, CheckCircle2, ArrowRight, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { ServiceItem } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface RateListSectionProps {
  services: ServiceItem[];
  onSelectServiceForBooking: (service: ServiceItem) => void;
}

export const RateListSection: React.FC<RateListSectionProps> = ({
  services,
  onSelectServiceForBooking,
}) => {
  const { t, language } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = [
    { id: 'all', label: t.categoryAll },
    { id: 'makeup', label: t.categoryMakeup },
    { id: 'hair', label: t.categoryHair },
    { id: 'skin', label: t.categorySkin },
    { id: 'nails', label: t.categoryNails },
    { id: 'packages', label: t.categoryPackages },
  ];

  const filtered = services.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesPrice = s.basePrice <= maxPrice;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      s.nameEn.toLowerCase().includes(q) ||
      s.nameHi.toLowerCase().includes(q) ||
      s.descriptionEn.toLowerCase().includes(q);
    return matchesCat && matchesPrice && matchesSearch;
  });

  return (
    <section id="rate-list" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Tag className="w-3.5 h-3.5 text-rose-600" />
            <span>{language === 'hi' ? 'प्रामाणिक व पारदर्शी मूल्य' : 'Verified Transparent Pricing'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
            {t.rateListTitle}
          </h2>
          <p className="text-base sm:text-lg text-neutral-600">
            {t.rateListSubtitle}
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-[#FFF8F7] p-6 rounded-3xl border border-rose-100 shadow-sm mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category selection */}
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    selectedCategory === c.id
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-white text-neutral-700 hover:bg-rose-100/60 border border-rose-200/60'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder={t.searchServicePlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
          </div>

          {/* Budget Slider */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-rose-100 text-xs text-neutral-700">
            <div className="flex items-center gap-3 w-full sm:w-80">
              <span className="font-semibold shrink-0">
                {t.filterByPrice}: ₹{maxPrice.toLocaleString('en-IN')}
              </span>
              <input
                type="range"
                min="100"
                max="15000"
                step="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2 text-emerald-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'hi'
                  ? 'कोई हिडन चार्ज नहीं — जो रेट लिखा है, वही देना होगा।'
                  : 'Zero hidden booking fees. Inclusive of all standard taxes & disposable kit.'}
              </span>
            </div>
          </div>
        </div>

        {/* Rate Table (Desktop) & Cards (Mobile) */}
        <div className="hidden lg:block overflow-hidden rounded-3xl border border-rose-100 shadow-sm bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-rose-50/90 to-amber-50/90 border-b border-rose-100 text-xs font-bold uppercase tracking-wider text-neutral-700">
                <th className="py-4 px-6">{language === 'hi' ? 'सेवा का नाम' : 'Service Name & Image'}</th>
                <th className="py-4 px-4">{language === 'hi' ? 'कैटेगरी' : 'Category'}</th>
                <th className="py-4 px-4">{language === 'hi' ? 'समय' : 'Duration'}</th>
                <th className="py-4 px-4 text-neutral-400 line-through">{language === 'hi' ? 'सैलून मार्केट रेट' : 'Market Parlour Rate'}</th>
                <th className="py-4 px-6 font-extrabold text-rose-900">{language === 'hi' ? 'एमएस मेकअप आर्टिस्ट रेट' : 'MS Makeup Artist Best Rate'}</th>
                <th className="py-4 px-6 text-right">{language === 'hi' ? 'कार्रवाई' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50 text-sm">
              {filtered.map((service) => {
                const isHi = language === 'hi';
                const name = isHi ? service.nameHi : service.nameEn;
                const desc = isHi ? service.descriptionHi : service.descriptionEn;
                const estimatedMarketRate = Math.round(service.basePrice * 1.4);

                return (
                  <tr key={service.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={service.image}
                          alt={name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-xs border border-rose-100"
                        />
                        <div>
                          <p className="font-serif font-bold text-neutral-900">{name}</p>
                          <p className="text-xs text-neutral-500 line-clamp-1 max-w-sm mt-0.5">{desc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize text-xs font-medium bg-rose-50 text-rose-800 px-2.5 py-1 rounded-md border border-rose-100">
                        {service.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-neutral-600">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        {service.durationMinutes} min
                      </span>
                    </td>
                    <td className="py-4 px-4 text-neutral-400 line-through text-xs font-semibold">
                      ₹{estimatedMarketRate.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-lg font-extrabold text-neutral-900">
                          ₹{service.basePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                          {isHi ? 'घर पर फ्री विजिट' : 'Doorstep Visit'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onSelectServiceForBooking(service)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 shadow-sm transition-all"
                      >
                        {t.bookThisService}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((service) => {
            const isHi = language === 'hi';
            const name = isHi ? service.nameHi : service.nameEn;
            const estimatedMarketRate = Math.round(service.basePrice * 1.4);

            return (
              <div
                key={service.id}
                className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={service.image}
                    alt={name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-rose-100"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-neutral-900 text-sm">{name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-serif font-extrabold text-rose-900 text-base">
                        ₹{service.basePrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-neutral-400 line-through">
                        ₹{estimatedMarketRate}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectServiceForBooking(service)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shrink-0"
                >
                  {isHi ? 'बुक' : 'Book'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
