import React, { useState } from 'react';
import { X, Star, MapPin, Award, MessageCircle, Phone, Calendar, CheckCircle2, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { UserAccount, ServiceItem, ReviewItem } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface ArtistProfileModalProps {
  artist: UserAccount | null;
  services: ServiceItem[];
  reviews: ReviewItem[];
  onClose: () => void;
  onBookNow: (artist: UserAccount, preselectedServiceId?: string) => void;
}

export const ArtistProfileModal: React.FC<ArtistProfileModalProps> = ({
  artist,
  services,
  reviews,
  onClose,
  onBookNow,
}) => {
  const { t, language } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!artist) return null;

  const artistReviews = reviews.filter((r) => r.artistId === artist.id);
  const whatsappLink = `https://wa.me/${(artist.whatsapp || artist.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hello ${artist.name}, I viewed your MS Makeup Artist profile and want to discuss booking an at-home appointment!`
  )}`;
  const callLink = `tel:${(artist.phone || '').replace(/[^0-9+]/g, '')}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-rose-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md text-neutral-600 hover:text-rose-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Header */}
        <div className="relative h-60 sm:h-72 bg-rose-100">
          <img
            src={artist.coverImage || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80'}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Floating Profile Details on Cover */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
                <img
                  src={artist.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold">{artist.name}</h2>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                </div>
                <p className="text-amber-300 text-sm font-semibold">
                  {artist.shopName || 'MS Makeup Artist Certified Parlour'}
                </p>
                <p className="text-xs text-rose-100 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{artist.district}, {artist.state}</span>
                </p>
              </div>
            </div>

            {/* Quick rating & experience badge */}
            <div className="flex items-center gap-3">
              <div className="bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-300 font-bold text-base">
                  <Star className="w-4 h-4 fill-amber-300" />
                  <span>{artist.rating || 4.9}</span>
                </div>
                <span className="text-[10px] text-neutral-300">
                  {artist.reviewCount || 45} {t.reviewsCount}
                </span>
              </div>
              <div className="bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-center">
                <p className="font-bold text-base text-white">{artist.experienceYears || 5}+ yrs</p>
                <span className="text-[10px] text-neutral-300">{t.experienceBadge}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Action Call/WhatsApp/Book Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                {language === 'hi' ? 'घर बैठे अपॉइंटमेंट रेट' : 'Doorstep Starting Price'}
              </span>
              <span className="font-serif text-2xl font-extrabold text-neutral-900">
                ₹{(artist.startingPrice || 1499).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>{t.directWhatsApp}</span>
              </a>

              <a
                href={callLink}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <Phone className="w-4 h-4 text-neutral-600" />
                <span>{t.callArtist}</span>
              </a>

              <button
                onClick={() => onBookNow(artist)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 shadow-md shadow-rose-600/25 active:scale-95 transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.bookThisService}</span>
              </button>
            </div>
          </div>

          {/* About / Bio */}
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900 mb-2">
              {t.aboutArtist}
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {language === 'hi' && artist.bioHi ? artist.bioHi : artist.bio}
            </p>
            {artist.address && (
              <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>
                  {t.salonAddress}: {artist.address}, {artist.district}, {artist.state}
                </span>
              </p>
            )}
          </div>

          {/* Portfolio Gallery */}
          {artist.portfolio && artist.portfolio.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-rose-600" />
                  <span>{t.portfolioTitle}</span>
                </h3>
                <span className="text-xs text-neutral-500">
                  {artist.portfolio.length} {language === 'hi' ? 'फोटो' : 'makeover photos'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {artist.portfolio.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className="relative group h-36 rounded-2xl overflow-hidden cursor-pointer bg-neutral-100 border border-rose-100 shadow-xs"
                  >
                    <img
                      src={imgUrl}
                      alt={`Work sample ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                      Click to Expand
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services & Custom Rates Table */}
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900 mb-4">
              {t.servicesOfferedTitle}
            </h3>

            <div className="space-y-3">
              {(artist.servicesOffered && artist.servicesOffered.length > 0
                ? artist.servicesOffered
                : services.slice(0, 5).map((s) => ({ serviceId: s.id, customPrice: s.basePrice }))
              ).map((item) => {
                const srv = services.find((s) => s.id === item.serviceId);
                if (!srv) return null;
                const isHi = language === 'hi';
                const name = isHi ? srv.nameHi : srv.nameEn;

                return (
                  <div
                    key={item.serviceId}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 hover:bg-rose-50/50 border border-rose-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={srv.image}
                        alt={name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-rose-100"
                      />
                      <div>
                        <h4 className="font-serif font-bold text-neutral-900 text-sm">{name}</h4>
                        <span className="text-[11px] text-neutral-500">
                          {srv.durationMinutes} min • {srv.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-serif text-base font-extrabold text-neutral-900">
                          ₹{item.customPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <button
                        onClick={() => onBookNow(artist, item.serviceId)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
                      >
                        {isHi ? 'बुक करें' : 'Book'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Client Reviews */}
          <div>
            <h3 className="font-serif text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>{t.clientReviewsTitle} ({artistReviews.length})</span>
            </h3>

            {artistReviews.length === 0 ? (
              <p className="text-sm text-neutral-500 italic">
                {language === 'hi' ? 'अभी तक कोई समीक्षा नहीं आई है।' : 'No reviews posted yet.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {artistReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-white border border-rose-100 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-neutral-900">{rev.customerName}</p>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded">
                      {rev.serviceName}
                    </span>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <span className="text-[10px] text-neutral-400 block">{rev.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white font-bold text-sm bg-white/20 px-3 py-1 rounded-full"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
