import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';

export const ContactSection: React.FC = () => {
  const { t, language } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      showToast(language === 'hi' ? 'कृपया नाम, फोन व संदेश भरें' : 'Please provide name, phone and message', 'error');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, message }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Inquiry submitted!', 'success');
        setName('');
        setPhone('');
        setEmail('');
        setMessage('');
      } else {
        showToast(data.error || 'Failed to submit', 'error');
      }
    } catch {
      showToast('Connection error', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const whatsappDirect = `https://wa.me/918433405368?text=${encodeURIComponent(
    'Hello MS Makeup Artist Team! I want consultation regarding bridal/party makeup and parlour booking at my home.'
  )}`;

  return (
    <section id="contact" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {language === 'hi' ? 'सहयोग व सहायता' : 'Help & Inquiries'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mt-3 mb-4">
            {t.contactTitle}
          </h2>
          <p className="text-base sm:text-lg text-neutral-600">
            {t.contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left info box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-rose-900 via-rose-800 to-amber-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? '24/7 ब्राइडल सहायता' : '24/7 Dedicated Support'}</span>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3">{t.helpdeskTitle}</h3>
              <p className="text-sm text-rose-100 leading-relaxed">
                {language === 'hi'
                  ? 'शादी के लिए बल्क बुकिंग, परिवार के सदस्यों का मेकअप या आर्टिस्ट रजिस्ट्रेशन में सहायता के लिए तुरंत संपर्क करें।'
                  : 'Get instant answers for bridal packages, group bookings, or join as an independent beauty artist.'}
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <a
                href="tel:+918433405368"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 transition-colors"
              >
                <Phone className="w-5 h-5 text-amber-300 shrink-0" />
                <div>
                  <p className="text-xs text-rose-200">Customer Helpline</p>
                  <p className="font-bold text-white text-base">8433405368</p>
                </div>
              </a>

              <a
                href={whatsappDirect}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-600/40 border border-emerald-400/40 hover:bg-emerald-600/50 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-emerald-300 shrink-0" />
                <div>
                  <p className="text-xs text-emerald-200">Official WhatsApp</p>
                  <p className="font-bold text-white text-sm">Chat Instantly on WhatsApp</p>
                </div>
              </a>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/10">
                <MapPin className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-rose-200">Headquarters & Hubs</p>
                  <p className="text-xs text-white leading-relaxed">{t.helpdeskAddress}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-rose-200">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Response time: Under 15 minutes</span>
            </div>
          </div>

          {/* Right inquiry form */}
          <div className="lg:col-span-7 bg-[#FFF9F7] p-8 sm:p-10 rounded-3xl border border-rose-100 shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-6">
              {language === 'hi' ? 'हमें अपना संदेश भेजें' : 'Send an Instant Message'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    {t.contactFormName} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Radhika Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    {t.contactFormPhone} *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  {t.contactFormEmail}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="radhika@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  {t.contactFormMessage} *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your event, wedding date, or parlour services needed at home..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-700 hover:to-amber-700 shadow-md shadow-rose-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'Sending...' : t.sendInquiryBtn}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
