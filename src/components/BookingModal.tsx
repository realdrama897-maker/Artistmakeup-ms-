import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Phone, Mail, Sparkles, CheckCircle2, MessageCircle, ArrowRight, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount, ServiceItem, BookingItem } from '../types.ts';
import { INDIAN_STATES_DISTRICTS } from '../data/locations.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { BookingSlip } from './BookingSlip.tsx';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  artists: UserAccount[];
  services: ServiceItem[];
  preselectedArtist?: UserAccount | null;
  preselectedServiceId?: string | null;
  onBookingSuccess?: (booking: BookingItem) => void;
  onOpenAuth?: (role: 'customer' | 'artist' | 'admin', mode: 'login' | 'register') => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  artists,
  services,
  preselectedArtist,
  preselectedServiceId,
  onBookingSuccess,
  onOpenAuth,
}) => {
  const { user, t, language } = useAuth();
  const { showToast } = useToast();

  const [selectedArtistId, setSelectedArtistId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('11:00 AM');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [state, setState] = useState<string>('Delhi NCR');
  const [district, setDistrict] = useState<string>('South Delhi');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<BookingItem | null>(null);

  // Time slots available for home bookings
  const timeSlots = [
    '08:30 AM',
    '10:30 AM',
    '01:00 PM',
    '03:30 PM',
    '05:30 PM',
    '07:30 PM',
  ];

  // Sync preselected data when modal opens
  useEffect(() => {
    if (preselectedArtist) {
      setSelectedArtistId(preselectedArtist.id);
      if (preselectedArtist.state) setState(preselectedArtist.state);
      if (preselectedArtist.district) setDistrict(preselectedArtist.district);
    } else if (artists.length > 0 && !selectedArtistId) {
      setSelectedArtistId(artists[0].id);
    }

    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }

    if (user && user.role === 'customer') {
      setCustomerName(user.name || '');
      setCustomerPhone(user.phone || '');
      setCustomerEmail(user.email || '');
      if (user.address) setAddress(user.address);
      if (user.state) setState(user.state);
      if (user.district) setDistrict(user.district);
    }

    // Default date: tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
    setCreatedBooking(null);
  }, [isOpen, preselectedArtist, preselectedServiceId, artists, services, user]);

  if (!isOpen) return null;

  const currentArtist = artists.find((a) => a.id === selectedArtistId);
  const currentService = services.find((s) => s.id === selectedServiceId);

  // Calculate price based on artist's custom rate or base service price
  const customPricing = currentArtist?.servicesOffered?.find((s) => s.serviceId === selectedServiceId);
  const finalPrice = customPricing?.customPrice || currentService?.basePrice || 1999;

  // Available districts for the current state
  const stateDistricts = INDIAN_STATES_DISTRICTS.find((s) => s.state === state)?.districts || [];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT AUTHENTICATION GATE CHECK: User must be signed in as customer
    if (!user || user.role !== 'customer') {
      showToast(
        language === 'hi'
          ? 'अपॉइंटमेंट बुक करने के लिए कृपया पहले ग्राहक (Customer) लॉगिन या साइन अप करें!'
          : 'Please log in or sign up as a Customer before booking an appointment!',
        'error'
      );
      if (onOpenAuth) onOpenAuth('customer', 'login');
      return;
    }

    if (!selectedArtistId || !selectedServiceId || !date || !timeSlot || !customerName || !customerPhone || !address) {
      showToast(
        language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please fill all required booking fields',
        'error'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerId: user.id,
        customerName,
        customerPhone,
        customerEmail: customerEmail || user.email,
        artistId: selectedArtistId,
        serviceId: selectedServiceId,
        date,
        timeSlot,
        address,
        state,
        district,
        notes,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('glowstudio_token') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to submit booking', 'error');
        setIsSubmitting(false);
        return;
      }

      // Confetti burst
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E25B78', '#D4AF37', '#B76E79', '#FFD700', '#10B981'],
      });

      // Compute target WhatsApp number with standard India country code 91
      const rawTarget = (currentArtist?.whatsapp || currentArtist?.phone || data.booking.artistPhone || '8433405368').replace(/\D/g, '');
      const cleanTargetPhone = rawTarget.length === 10 ? `91${rawTarget}` : rawTarget;

      const waMsg = `✨ *MS Makeup Artist - नई ब्यूटी पार्लर अपॉइंटमेंट!* ✨
----------------------------------------
📌 *बुकिंग संदर्भ (Ref):* #${data.booking.bookingNumber}
👤 *ग्राहक का नाम:* ${customerName}
📞 *ग्राहक फोन:* ${customerPhone}
💄 *सेवा (Service):* ${currentService ? (language === 'hi' ? currentService.nameHi : currentService.nameEn) : data.booking.serviceName}
📅 *तारीख (Date):* ${date}
⏰ *समय (Time Slot):* ${timeSlot}
📍 *घर का पता (Home Address):* ${address}, ${district}, ${state}
💰 *कुल राशि (Total):* ₹${data.booking.totalAmount} (Home Visit Included)
📝 *ग्राहक निर्देश (Notes):* ${notes || 'None'}
----------------------------------------
📞 *MS Helpline:* +91 84334 05368
🌐 *Ghar Baithe Beauty Parlour Service*`;

      const artistWaUrl = `https://api.whatsapp.com/send?phone=${cleanTargetPhone}&text=${encodeURIComponent(waMsg)}`;
      try {
        window.open(artistWaUrl, '_blank');
      } catch (err) {
        console.warn('Popup blocked by browser, user can click WhatsApp button');
      }

      setCreatedBooking(data.booking);
      showToast(t.bookingSuccessTitle, 'success');
      if (onBookingSuccess) onBookingSuccess(data.booking);
    } catch (err: any) {
      showToast(err.message || 'Error creating booking', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getArtistWhatsAppUrl = () => {
    if (!createdBooking) return '';
    const rawTarget = (createdBooking.artistPhone || currentArtist?.whatsapp || currentArtist?.phone || '8433405368').replace(/\D/g, '');
    const cleanPhone = rawTarget.length === 10 ? `91${rawTarget}` : rawTarget;

    const msg = `✨ *MS Makeup Artist - अपॉइंटमेंट विवरण (Booking Details)* ✨
----------------------------------------
📌 *बुकिंग संख्या:* #${createdBooking.bookingNumber}
👤 *ग्राहक:* ${createdBooking.customerName} (${createdBooking.customerPhone})
💄 *सेवा:* ${createdBooking.serviceName}
📅 *तारीख व समय:* ${createdBooking.date} at ${createdBooking.timeSlot}
📍 *स्थान (Doorstep):* ${createdBooking.address}, ${createdBooking.district}, ${createdBooking.state}
💰 *राशि:* ₹${createdBooking.totalAmount}
📝 *नोट्स:* ${createdBooking.notes || 'None'}
----------------------------------------
📞 *हेल्पलाइन:* 8433405368`;

    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
  };

  // CHECK: If user is not logged in or not a customer, render the authentication required gate!
  const isCustomerLoggedIn = user && user.role === 'customer';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-rose-100 relative">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-rose-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-600 to-amber-700 flex items-center justify-center text-white font-serif font-black text-sm shadow-md border-2 border-amber-200">
              MS
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-neutral-900">
                {t.bookAppointmentTitle}
              </h2>
              <p className="text-xs text-rose-700 font-medium">
                MS Makeup Artist • Helpline: 8433405368
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-rose-50 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {createdBooking ? (
            /* Success confirmation & Downloadable Booking Slip */
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-neutral-900">
                  {t.bookingSuccessTitle}
                </h3>
                <p className="text-xs text-neutral-600 max-w-md mx-auto mt-1 leading-relaxed">
                  {language === 'hi'
                    ? 'आपकी अपॉइंटमेंट सफलतापूर्वक दर्ज हो गई है और आर्टिस्ट के व्हाट्सएप पर संदेश भेज दिया गया है। नीचे से रसीद (Slip) डाउनलोड करें।'
                    : 'Your appointment is registered and booking details sent to the artist on WhatsApp. Download your official slip with images below.'}
                </p>
              </div>

              {/* Direct WhatsApp to Artist Button with 1-click */}
              <div className="flex justify-center">
                <a
                  href={getArtistWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>
                    {language === 'hi'
                      ? '📲 आर्टिस्ट के व्हाट्सएप पर सीधे संदेश भेजें'
                      : '📲 Send Details to Artist on WhatsApp'}
                  </span>
                </a>
              </div>

              {/* Luxury Printable & Downloadable Booking Receipt Slip with Images */}
              <BookingSlip booking={createdBooking} />

              <div className="text-center pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition-colors"
                >
                  {t.closeBtn}
                </button>
              </div>
            </div>
          ) : !isCustomerLoggedIn ? (
            /* AUTHENTICATION GATE: Shown when user is not logged in as a Customer */
            <div className="py-6 px-4 text-center space-y-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-100 via-rose-50 to-amber-100 border-2 border-rose-200 text-rose-700 flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                  {language === 'hi'
                    ? 'अपॉइंटमेंट के लिए ग्राहक लॉगिन आवश्यक है'
                    : 'Customer Sign In Required to Book'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {language === 'hi'
                    ? 'घर बैठे ब्यूटी पार्लर सर्विस बुक करने के लिए कृपया पहले अपने ग्राहक (Customer) खाते में लॉगिन या साइन अप करें।'
                    : 'To ensure confirmed doorstep beauty parlour service and safety, please sign in or register as a customer before placing an appointment.'}
                </p>
              </div>

              {user && user.role !== 'customer' && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-2 text-left max-w-md mx-auto">
                  <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                  <span>
                    {language === 'hi'
                      ? `आप वर्तमान में ${user.role === 'artist' ? 'ब्यूटी आर्टिस्ट' : 'एडमिन'} खाते में लॉगिन हैं। अपॉइंटमेंट बुक करने के लिए ग्राहक खाता चुनें।`
                      : `You are currently logged in as ${user.role}. Please log in with a Customer account to book.`}
                  </span>
                </div>
              )}

              {/* Login / Sign Up Action Options */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenAuth) onOpenAuth('customer', 'login');
                  }}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white shadow-md shadow-rose-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{language === 'hi' ? 'ग्राहक लॉगिन (Login)' : 'Customer Sign In'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenAuth) onOpenAuth('customer', 'register');
                  }}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4 text-rose-700" />
                  <span>{language === 'hi' ? 'नया ग्राहक खाता बनाएं' : 'Customer Sign Up'}</span>
                </button>
              </div>

              {/* Artist notice link */}
              <div className="pt-4 border-t border-rose-100 text-xs text-neutral-500">
                <span>{language === 'hi' ? 'क्या आप ब्यूटीशियन / पार्लर पार्टनर हैं?' : 'Are you a beauty professional?'} </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenAuth) onOpenAuth('artist', 'register');
                  }}
                  className="font-bold text-amber-800 hover:underline"
                >
                  {language === 'hi' ? 'आर्टिस्ट रजिस्ट्रेशन करें (Artist Join)' : 'Join as Artist Partner'}
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form - Only accessible to authenticated Customers */
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              {/* Customer verified badge */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {language === 'hi' ? 'लॉगिन ग्राहक:' : 'Logged in Customer:'}{' '}
                    <strong>{user.name}</strong> ({user.phone})
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                  Verified
                </span>
              </div>

              {/* Artist & Service Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    1. {t.selectArtist} *
                  </label>
                  <select
                    value={selectedArtistId}
                    onChange={(e) => setSelectedArtistId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-rose-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-rose-500/20"
                    required
                  >
                    {artists.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.shopName || a.district}) - {a.rating || 4.9}★
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    2. {t.selectService} *
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-rose-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-rose-500/20"
                    required
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {language === 'hi' ? s.nameHi : s.nameEn} (₹{s.basePrice})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    3. {t.appointmentDate} *
                  </label>
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-rose-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-rose-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    4. {t.appointmentTime} *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-rose-200 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-rose-500/20"
                    required
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="pt-2 border-t border-rose-100">
                <h4 className="font-serif text-sm font-bold text-neutral-900 mb-3">
                  5. {language === 'hi' ? 'ग्राहक व होम डिलीवरी विवरण' : 'Customer & Doorstep Details'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      {t.yourFullName} *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Pooja Gupta"
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-xs sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      {t.yourPhone} *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>

                {/* State & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      {t.stateLabel}
                    </label>
                    <select
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        const firstDist = INDIAN_STATES_DISTRICTS.find(
                          (s) => s.state === e.target.value
                        )?.districts[0];
                        if (firstDist) setDistrict(firstDist);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-xs"
                    >
                      {INDIAN_STATES_DISTRICTS.map((s) => (
                        <option key={s.state} value={s.state}>
                          {s.state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      {t.districtLabel}
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-xs"
                    >
                      {stateDistricts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-3.5">
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    {t.yourAddress} (Ghar Ka Pata) *
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Flat 302, Palm Heights, Main Market Road, Saket"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-xs sm:text-sm"
                    required
                  />
                </div>

                {/* Special instructions */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    {t.specialNotes}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Red bridal lehenga, sensitive skin, need natural glowing eye look"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Total Summary Price Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider block">
                    {t.totalToPay}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl font-extrabold text-neutral-900">
                      ₹{finalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded">
                      {language === 'hi' ? 'घर पर फ्री विजिट शामिल' : 'Zero Travel Fee'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 shadow-md shadow-rose-600/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Booking & WhatsApp...' : t.confirmBookingBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
