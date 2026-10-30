import React from 'react';
import { Search, CalendarHeart, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface HowItWorksProps {
  onOpenBooking: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenBooking }) => {
  const { t, language } = useAuth();

  const steps = [
    {
      num: '01',
      title: t.step1Title,
      desc: t.step1Desc,
      icon: Search,
      bg: 'bg-rose-50',
      iconBg: 'from-rose-500 to-rose-600',
      border: 'border-rose-200',
    },
    {
      num: '02',
      title: t.step2Title,
      desc: t.step2Desc,
      icon: CalendarHeart,
      bg: 'bg-amber-50',
      iconBg: 'from-amber-500 to-amber-600',
      border: 'border-amber-200',
    },
    {
      num: '03',
      title: t.step3Title,
      desc: t.step3Desc,
      icon: Sparkles,
      bg: 'bg-rose-50',
      iconBg: 'from-rose-600 to-amber-600',
      border: 'border-rose-200',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            {language === 'hi' ? 'सरल प्रक्रिया' : 'Simple 3 Steps'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-3 mb-4">
            {t.howItWorksTitle}
          </h2>
          <p className="text-base sm:text-lg text-neutral-600">
            {t.howItWorksSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector lines on desktop */}
          <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-rose-200 via-amber-200 to-rose-200 -translate-y-8 -z-0" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`relative z-10 p-8 rounded-3xl ${step.bg} border ${step.border} shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.iconBg} text-white flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="font-serif text-3xl font-extrabold text-neutral-300">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-neutral-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-black/5 flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>
                    {language === 'hi' ? 'सैलून जाने और घंटों इंतजार करने से मुक्ति' : 'Zero salon waiting time'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA banner below */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenBooking}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 shadow-lg shadow-rose-600/20 hover:scale-105 active:scale-95 transition-all"
          >
            <CalendarHeart className="w-5 h-5" />
            <span>{language === 'hi' ? 'अभी घर पर अपॉइंटमेंट बुक करें' : 'Experience Ghar Par Parlour Today'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
