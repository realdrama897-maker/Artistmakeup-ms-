import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const TestimonialsSection: React.FC = () => {
  const { t, language } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sunita Aggarwal & Daughter Ria',
      city: 'Delhi NCR (South Ex)',
      service: 'Royal Bridal HD Dulhan Package',
      rating: 5,
      date: 'Wedding Season 2026',
      review:
        'Priya did my daughter’s bridal makeup and it was utterly breathtaking! No heaviness, stayed fresh throughout the 10-hour wedding rituals. The artist brought her own lights and sanitized kit directly to our home. Saved us all the salon madness!',
      reviewHi:
        'प्रिया जी ने मेरी बेटी का दुल्हन मेकअप किया जो वाकई अद्भुत था! 10 घंटे के फेरों और शादी की रस्मों में भी मेकअप बिल्कुल फ्रेश रहा। वे अपनी लाइट्स और सैनिटाइज्ड किट घर लेकर आईं। सैलून की भागदौड़ से बच गए!',
      image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 2,
      name: 'Rhea Mehra',
      city: 'Pune (Koregaon Park)',
      service: 'Party & Cocktail Makeover',
      rating: 5,
      date: 'October 2026',
      review:
        'Booked Ananya Verma for my sister’s sangeet evening. She arrived 15 minutes before time, prepped my skin so beautifully, and created the exact glass-skin look I showed her on Pinterest. Everyone at the party kept asking for her contact!',
      reviewHi:
        'बहन के संगीत के लिए अनन्या वर्मा को बुक किया था। वे समय से 15 मिनट पहले पहुंच गईं, स्किन को बहुत अच्छे से प्रेप किया और हूबहू वही लुक दिया जो मैंने पिंटरेस्ट पर देखा था!',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 3,
      name: 'Kavita & Vikram Rathore',
      city: 'Jaipur (Johari Bazaar)',
      service: 'Bridal Henna & Rajputana Draping',
      rating: 5,
      date: 'September 2026',
      review:
        'Meera ji is a true gem! Her organic henna gave an extraordinarily deep mahogany stain and her traditional poshak draping was pin-perfect. Having a parlour experience at home made the wedding week stress-free.',
      reviewHi:
        'मीरा जी का काम बेमिसाल है! उनकी ऑर्गेनिक मेहंदी का रंग बहुत गहरा आया और पोशाक ड्रेपिंग बिल्कुल परफेक्ट थी। घर पर पार्लर की सुविधा से शादी का हफ्ता बहुत सुकून भरा रहा।',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#FFFDFC] to-[#FFF5F7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            {language === 'hi' ? 'असली ग्राहक प्रतिक्रियाएं' : 'Client Testimonials'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mt-3 mb-4">
            {t.testimonialsTitle}
          </h2>
          <p className="text-base sm:text-lg text-neutral-600">
            {t.testimonialsSubtitle}
          </p>
        </div>

        {/* Featured Testimonial Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-rose-100 relative">
          <Quote className="w-16 h-16 text-rose-100 absolute top-6 right-8 -z-0" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Avatar Column */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-rose-200 overflow-hidden shadow-lg mb-3">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-serif text-lg font-bold text-neutral-900">{current.name}</h4>
              <p className="text-xs text-neutral-500">{current.city}</p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Home Booking</span>
              </div>
            </div>

            {/* Content Column */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-xs font-bold text-neutral-500">{current.date}</span>
              </div>

              <span className="inline-block text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1 rounded-md border border-rose-100">
                {current.service}
              </span>

              <p className="text-base sm:text-lg text-neutral-700 font-serif italic leading-relaxed">
                "{language === 'hi' ? current.reviewHi : current.review}"
              </p>
            </div>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-rose-50">
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    currentIndex === i ? 'w-8 bg-rose-600' : 'w-2.5 bg-rose-200 hover:bg-rose-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-rose-200 flex items-center justify-center text-neutral-700 hover:bg-rose-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 shadow-md transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
