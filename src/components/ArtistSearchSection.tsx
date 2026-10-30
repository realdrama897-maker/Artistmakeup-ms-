import React, { useState, useMemo } from 'react';
import { Search, MapPin, Star, Award, Phone, MessageCircle, ArrowRight, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { UserAccount, ServiceItem } from '../types.ts';
import { INDIAN_STATES_DISTRICTS } from '../data/locations.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface ArtistSearchSectionProps {
  artists: UserAccount[];
  services: ServiceItem[];
  onSelectArtistProfile: (artist: UserAccount) => void;
  onBookArtist: (artist: UserAccount) => void;
}

export const ArtistSearchSection: React.FC<ArtistSearchSectionProps> = ({
  artists,
  services,
  onSelectArtistProfile,
  onBookArtist,
}) => {
  const { t, language } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedServiceId, setSelectedServiceId] = useState('all');
  const [minRating, setMinRating] = useState(0);

  // Available districts dynamic based on selectedState
  const availableDistricts = useMemo(() => {
    if (selectedState === 'All States') return [];
    const found = INDIAN_STATES_DISTRICTS.find((s) => s.state === selectedState);
    return found ? found.districts : [];
  }, [selectedState]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict('All Districts');
  };

  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      // Must be approved
      if (artist.approvalStatus && artist.approvalStatus !== 'approved') return false;

      // Text search
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        artist.name.toLowerCase().includes(q) ||
        (artist.shopName && artist.shopName.toLowerCase().includes(q)) ||
        (artist.district && artist.district.toLowerCase().includes(q)) ||
        (artist.bio && artist.bio.toLowerCase().includes(q));

      // State filter
      const matchesState = selectedState === 'All States' || artist.state === selectedState;

      // District filter
      const matchesDistrict =
        selectedDistrict === 'All Districts' || artist.district === selectedDistrict;

      // Service filter
      const matchesService =
        selectedServiceId === 'all' ||
        artist.servicesOffered?.some((s) => s.serviceId === selectedServiceId);

      // Rating filter
      const matchesRating = (artist.rating || 0) >= minRating;

      return matchesSearch && matchesState && matchesDistrict && matchesService && matchesRating;
    });
  }, [artists, searchQuery, selectedState, selectedDistrict, selectedServiceId, minRating]);

  return (
    <section id="artists" className="py-16 md:py-24 bg-[#FFFDFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            {language === 'hi' ? 'सत्यापित ब्यूटी पार्लर व आर्टिस्ट्स' : 'Verified Makeup Professionals'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mt-3 mb-4">
            {t.findArtistsTitle}
          </h2>
          <p className="text-base sm:text-lg text-neutral-600">
            {t.findArtistsSubtitle}
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-md shadow-rose-900/5 mb-10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchArtistPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-rose-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            {/* State Dropdown (All Indian States) */}
            <div>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-rose-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-neutral-800"
              >
                <option value="All States">
                  {language === 'hi' ? 'सभी राज्य (All States)' : 'All Indian States'}
                </option>
                {INDIAN_STATES_DISTRICTS.map((s) => (
                  <option key={s.state} value={s.state}>
                    {s.state}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic District Dropdown */}
            <div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={selectedState === 'All States'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-rose-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-neutral-800 disabled:opacity-50"
              >
                <option value="All Districts">
                  {language === 'hi' ? 'सभी जिले / शहर' : 'All Districts / Cities'}
                </option>
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Service filter */}
            <div>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-rose-100 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-neutral-800"
              >
                <option value="all">
                  {language === 'hi' ? 'सभी सेवाएं (All Services)' : 'All Services'}
                </option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {language === 'hi' ? s.nameHi : s.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Rating Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-rose-50 text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-700">
                {language === 'hi' ? 'रेटिंग:' : 'Rating:'}
              </span>
              {[0, 4.5, 4.8].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`px-3 py-1 rounded-full font-medium transition-colors ${
                    minRating === r
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {r === 0 ? (language === 'hi' ? 'सभी' : 'All') : `${r}+ ★`}
                </button>
              ))}
            </div>

            <p className="text-neutral-500">
              {filteredArtists.length}{' '}
              {language === 'hi' ? 'आर्टिस्ट्स उपलब्ध हैं' : 'certified artists ready for home service'}
            </p>
          </div>
        </div>

        {/* Artists Grid */}
        {filteredArtists.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 p-8">
            <Award className="w-12 h-12 text-rose-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-neutral-900">
              {language === 'hi' ? 'कोई आर्टिस्ट नहीं मिला' : 'No artists match your criteria'}
            </h3>
            <p className="text-sm text-neutral-500 mt-1">
              {language === 'hi'
                ? 'कृपया फ़िल्टर रीसेट करें या किसी अन्य शहर को चुनें।'
                : 'Try clearing your filters or choosing another state/district.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedState('All States');
                setSelectedDistrict('All Districts');
                setSelectedServiceId('all');
                setMinRating(0);
              }}
              className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold"
            >
              {language === 'hi' ? 'सभी आर्टिस्ट्स देखें' : 'Reset All Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtists.map((artist) => {
              const whatsappLink = `https://wa.me/${(artist.whatsapp || artist.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hello ${artist.name}, I found your profile on MS Makeup Artist and would like to book a home beauty appointment!`
              )}`;
              const callLink = `tel:${(artist.phone || '').replace(/[^0-9+]/g, '')}`;

              return (
                <div
                  key={artist.id}
                  className="bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 group"
                >
                  <div>
                    {/* Cover image & avatar header */}
                    <div className="relative h-44 bg-rose-100 overflow-hidden">
                      <img
                        src={artist.coverImage || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Availability status badge */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{t.availableNow}</span>
                      </div>

                      {/* Experience pill */}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {artist.experienceYears || 5}+ {t.yearsExp}
                      </div>

                      {/* Floating Profile Avatar */}
                      <div className="absolute -bottom-6 left-6 flex items-end gap-3">
                        <div className="w-20 h-20 rounded-2xl border-3 border-white overflow-hidden shadow-lg bg-white shrink-0">
                          <img
                            src={artist.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Artist Details */}
                    <div className="pt-8 px-6 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-serif text-lg font-bold text-neutral-900 group-hover:text-rose-700 transition-colors">
                              {artist.name}
                            </h3>
                            <span title="Verified Artist">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-rose-800">
                            {artist.shopName || 'MS Makeup Artist Certified Parlour'}
                          </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-xs font-extrabold text-amber-900">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{artist.rating || 4.9}</span>
                          <span className="text-neutral-400 font-normal">({artist.reviewCount || 45})</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 mt-2.5 text-xs text-neutral-500">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">
                          {artist.district}, {artist.state}
                        </span>
                      </div>

                      {/* Bio snippet */}
                      <p className="text-xs text-neutral-600 mt-2.5 line-clamp-2 leading-relaxed">
                        {language === 'hi' && artist.bioHi ? artist.bioHi : artist.bio}
                      </p>

                      {/* Mini portfolio thumbnails */}
                      {artist.portfolio && artist.portfolio.length > 0 && (
                        <div className="flex gap-2 mt-4 pt-3 border-t border-rose-50">
                          {artist.portfolio.slice(0, 3).map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="Portfolio work"
                              className="w-16 h-14 rounded-xl object-cover border border-rose-100/80 shadow-xs hover:scale-105 transition-transform"
                            />
                          ))}
                          {artist.portfolio.length > 3 && (
                            <div className="w-16 h-14 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[11px] font-bold text-rose-700">
                              +{artist.portfolio.length - 3}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Price badge */}
                      <div className="mt-4 pt-3 border-t border-rose-50 flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-500 block uppercase tracking-wider">
                            {t.startingFrom}
                          </span>
                          <span className="font-serif text-lg font-bold text-neutral-900">
                            ₹{(artist.startingPrice || 1499).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {language === 'hi' ? 'घर बैठे सुविधा' : 'Doorstep Ready'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="p-6 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.directWhatsApp}</span>
                      </a>

                      <a
                        href={callLink}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-neutral-600" />
                        <span>{t.callArtist}</span>
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectArtistProfile(artist)}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-neutral-800 bg-white hover:bg-rose-50 border border-rose-200 transition-all text-center"
                      >
                        {t.viewProfile}
                      </button>

                      <button
                        onClick={() => onBookArtist(artist)}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 shadow-md shadow-rose-600/20 active:scale-98 transition-all text-center flex items-center justify-center gap-1"
                      >
                        <span>{t.bookThisService}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
