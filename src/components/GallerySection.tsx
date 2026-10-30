import React, { useState } from 'react';
import { Camera, Sparkles, X, Heart, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const GallerySection: React.FC = () => {
  const { t, language } = useAuth();
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const galleryItems = [
    {
      title: 'Royal Marwari Bridal Dulhan',
      titleHi: 'शाही मारवाड़ी दुल्हन श्रृंगार',
      tag: 'Bridal HD',
      image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Sangeet & Cocktail Evening Glow',
      titleHi: 'संगीत व कॉकटेल इवनिंग ग्लैम',
      tag: 'Party Glam',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Intricate Bridal Arabic Henna',
      titleHi: 'अरेबिक व राजस्थानी दुल्हन मेहंदी',
      tag: 'Mehendi Art',
      image: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Textured Floral Mogra Bridal Braid',
      titleHi: 'मोगरा गजरा व फ्लोरल ब्राइडल चोटी',
      tag: 'Hair Styling',
      image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: '24K Gold Luxury Skin Polish',
      titleHi: '24K गोल्ड फेशियल व स्किन पॉलिशिंग',
      tag: 'Skin Ritual',
      image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Indian Bridal Red & Gold Nail Extensions',
      titleHi: 'दुल्हन लाल व गोल्डन 3D नेल एक्सटेंशन',
      tag: 'Nail Art',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  return (
    <section id="gallery" className="py-16 md:py-24 bg-[#FFFDFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {language === 'hi' ? 'वास्तविक कार्य गैलरी' : 'Real Transformations'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mt-3 mb-4">
            {t.galleryTitle}
          </h2>
          <p className="text-base sm:text-lg text-neutral-600">
            {t.gallerySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => {
            const title = language === 'hi' ? item.titleHi : item.title;
            return (
              <div
                key={idx}
                onClick={() => setActivePhoto(item.image)}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-rose-100"
              >
                <img
                  src={item.image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-rose-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {item.tag}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-serif text-lg font-bold leading-tight group-hover:text-amber-300 transition-colors">
                    {title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-rose-200 mt-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Click to view HD</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox preview */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={activePhoto}
              alt="Gallery preview"
              className="max-w-full max-h-[85vh] rounded-3xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute -top-12 right-0 text-white font-bold text-sm bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full backdrop-blur-md"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
