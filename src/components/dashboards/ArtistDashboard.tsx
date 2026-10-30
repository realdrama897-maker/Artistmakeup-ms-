import React, { useState, useEffect } from 'react';
import { Store, Calendar, CheckCircle2, XCircle, Clock, MapPin, DollarSign, ToggleLeft, ToggleRight, Sparkles, Star, Phone, MessageCircle, Edit3, Save, FileText, Search, Filter } from 'lucide-react';
import { BookingItem, ServiceItem, UserAccount } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { BookingSlip } from '../BookingSlip.tsx';

interface ArtistDashboardProps {
  services: ServiceItem[];
}

export const ArtistDashboard: React.FC<ArtistDashboardProps> = ({ services }) => {
  const { user, token, t, language, updateProfileLocally } = useAuth();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState<boolean>(user?.isAvailable ?? true);
  const [selectedBookingForSlip, setSelectedBookingForSlip] = useState<BookingItem | null>(null);
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [shopName, setShopName] = useState(user?.shopName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [address, setAddress] = useState(user?.address || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || user?.phone || '');
  const [startingPrice, setStartingPrice] = useState(user?.startingPrice || 1499);

  // Manage Services & Custom Rates
  const [artistServices, setArtistServices] = useState<{ serviceId: string; customPrice: number }[]>(
    user?.servicesOffered || []
  );

  const fetchArtistBookings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch {
      showToast('Error loading bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistBookings();
  }, [token]);

  const handleUpdateStatus = async (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast(`Appointment status updated to ${status}`, 'success');
        fetchArtistBookings();
      }
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const handleToggleAvailability = async () => {
    const nextVal = !isAvailable;
    setIsAvailable(nextVal);
    try {
      const res = await fetch('/api/artists/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAvailable: nextVal }),
      });
      if (res.ok) {
        updateProfileLocally({ isAvailable: nextVal });
        showToast(
          nextVal
            ? (language === 'hi' ? 'अब आप होम बुकिंग के लिए उपलब्ध हैं' : 'You are now online for home bookings')
            : (language === 'hi' ? 'बुकिंग उपलब्धता बंद कर दी गई है' : 'Availability paused'),
          'info'
        );
      }
    } catch {
      setIsAvailable(!nextVal);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/artists/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shopName,
          bio,
          address,
          whatsapp,
          startingPrice: Number(startingPrice),
          servicesOffered: artistServices,
        }),
      });

      if (res.ok) {
        updateProfileLocally({
          shopName,
          bio,
          address,
          whatsapp,
          startingPrice: Number(startingPrice),
          servicesOffered: artistServices,
        });
        showToast('Artist profile updated successfully!', 'success');
        setIsEditingProfile(false);
      }
    } catch {
      showToast('Failed to save profile', 'error');
    }
  };

  const handleServicePriceChange = (serviceId: string, price: number) => {
    const exists = artistServices.find((s) => s.serviceId === serviceId);
    if (exists) {
      setArtistServices(
        artistServices.map((s) =>
          s.serviceId === serviceId ? { ...s, customPrice: price } : s
        )
      );
    } else {
      setArtistServices([...artistServices, { serviceId, customPrice: price }]);
    }
  };

  const totalEarnings = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-rose-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 bg-white/10 px-3 py-1 rounded-full">
              {t.artistRole}
            </span>
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Approved Partner
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-2">
            {user?.name}
          </h1>
          <p className="text-amber-200 text-xs sm:text-sm font-semibold">
            {user?.shopName || 'MS Makeup Artist Beauty Studio'} • {user?.district}, {user?.state}
          </p>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
          <div>
            <p className="text-xs font-bold text-white">{t.toggleAvailability}</p>
            <p className="text-[10px] text-amber-200">
              {isAvailable ? 'Customers can book you' : 'Paused bookings'}
            </p>
          </div>
          <button
            onClick={handleToggleAvailability}
            className="p-1 hover:scale-110 transition-transform"
          >
            {isAvailable ? (
              <ToggleRight className="w-10 h-10 text-emerald-400" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-neutral-400" />
            )}
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs">
          <p className="text-xs text-neutral-500 font-medium">Pending Requests</p>
          <h3 className="font-serif text-2xl font-bold text-amber-600 mt-1">{pendingCount}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs">
          <p className="text-xs text-neutral-500 font-medium">Total Bookings</p>
          <h3 className="font-serif text-2xl font-bold text-neutral-900 mt-1">{bookings.length}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs">
          <p className="text-xs text-neutral-500 font-medium">{t.earningsSummary}</p>
          <h3 className="font-serif text-2xl font-bold text-emerald-700 mt-1">
            ₹{totalEarnings.toLocaleString('en-IN')}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs">
          <p className="text-xs text-neutral-500 font-medium">Client Rating</p>
          <h3 className="font-serif text-2xl font-bold text-amber-500 mt-1 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400" />
            <span>{user?.rating || 4.9}</span>
          </h3>
        </div>
      </div>

      {/* Booking Requests List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-rose-600" />
          <span>{t.bookingRequests}</span>
        </h2>

        {loading ? (
          <p className="text-sm text-neutral-400 py-8 text-center">Loading booking requests...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-neutral-500 py-8 text-center">
            {language === 'hi' ? 'कोई नया बुकिंग अनुरोध नहीं है।' : 'No customer bookings received yet.'}
          </p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-5 rounded-2xl border border-rose-100 bg-[#FFFDFD] hover:bg-white hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-400">
                      {booking.bookingNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        booking.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : booking.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.status === 'cancelled'
                          ? 'bg-neutral-100 text-neutral-500'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    {booking.serviceName}
                  </h3>

                  <p className="text-xs text-neutral-600 font-medium">
                    Customer: <span className="font-bold text-neutral-900">{booking.customerName}</span> (
                    <a href={`tel:${booking.customerPhone}`} className="text-rose-700 underline">
                      {booking.customerPhone}
                    </a>
                    )
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-neutral-700">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      {booking.date} at {booking.timeSlot}
                    </span>
                    <span className="flex items-center gap-1 text-neutral-600">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      {booking.address}, {booking.district}
                    </span>
                  </div>

                  {booking.notes && (
                    <p className="text-[11px] bg-rose-50 text-rose-900 p-2 rounded-lg italic mt-1">
                      Note from customer: "{booking.notes}"
                    </p>
                  )}
                </div>

                {/* Status Update Buttons */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-rose-50">
                  <span className="font-serif text-xl font-extrabold text-neutral-900 mr-2">
                    ₹{booking.totalAmount.toLocaleString('en-IN')}
                  </span>

                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                      >
                        {t.acceptBooking}
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold"
                      >
                        {t.rejectBooking}
                      </button>
                    </>
                  )}

                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(booking.id, 'completed')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                    >
                      {t.completeBooking}
                    </button>
                  )}

                  {/* View / Print Slip */}
                  <button
                    onClick={() => setSelectedBookingForSlip(booking)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                    title={language === 'hi' ? 'अपॉइंटमेंट रसीद देखें/प्रिंट करें' : 'View / Print appointment receipt'}
                  >
                    <FileText className="w-4 h-4 text-rose-600" />
                    <span>{language === 'hi' ? 'रसीद (Slip)' : 'Slip'}</span>
                  </button>

                  <a
                    href={`https://wa.me/${booking.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${booking.customerName}, this is ${user?.name} from MS Makeup Artist. I have received your appointment #${booking.bookingNumber} for ${booking.serviceName} on ${booking.date} at ${booking.timeSlot}!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Services & Custom Rates Editor */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-amber-600" />
              <span>{t.manageServicesRates}</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {language === 'hi'
                ? 'हर ब्यूटी काम के लिए अपनी होम सर्विस का मनचाहा रेट सेट करें (ग्राहक को यही रेट दिखेगा)'
                : 'Customize your doorstep rates for each beauty service. Customers will book at your rates.'}
            </p>
          </div>

          <button
            onClick={handleSaveProfile}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'hi' ? 'सभी रेट्स सुरक्षित करें (Save Rates)' : 'Save All Custom Rates'}</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: language === 'hi' ? 'सभी काम' : 'All Services' },
              { id: 'makeup', label: language === 'hi' ? 'मेकअप' : 'Makeup' },
              { id: 'hair', label: language === 'hi' ? 'हेयर स्टाइल' : 'Hair' },
              { id: 'skin', label: language === 'hi' ? 'स्किन व फेशियल' : 'Skin' },
              { id: 'nails', label: language === 'hi' ? 'नेल्स' : 'Nails' },
              { id: 'packages', label: language === 'hi' ? 'पैकेज' : 'Packages' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-rose-900 text-white shadow-xs'
                    : 'bg-rose-50 text-neutral-600 hover:bg-rose-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              placeholder={language === 'hi' ? 'काम खोजें...' : 'Filter services...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services
            .filter((srv) => {
              const matchCat = selectedCategory === 'all' || srv.category === selectedCategory;
              const matchQuery =
                !serviceSearch ||
                srv.nameEn.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                srv.nameHi.includes(serviceSearch);
              return matchCat && matchQuery;
            })
            .map((srv) => {
              const currentConfig = artistServices.find((s) => s.serviceId === srv.id);
              const currentPrice = currentConfig ? currentConfig.customPrice : srv.basePrice;
              const isModified = currentPrice !== srv.basePrice;

              return (
                <div
                  key={srv.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isModified
                      ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                      : 'bg-[#FFFDFD] border-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={srv.image}
                      alt={srv.nameEn}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-neutral-900 truncate">
                        {language === 'hi' ? srv.nameHi : srv.nameEn}
                      </h4>
                      <p className="text-[10px] text-neutral-400 truncate">
                        {language === 'hi' ? srv.nameEn : srv.nameHi}
                      </p>
                      <span className="text-[10px] font-semibold text-neutral-500 mt-0.5 inline-block">
                        Market Base: ₹{srv.basePrice}
                      </span>
                    </div>
                  </div>

                  {/* Rate Controls */}
                  <div className="pt-2 border-t border-rose-100/70 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wide block">
                        {language === 'hi' ? 'आपका रेट' : 'Your Rate'}
                      </span>
                      {isModified && (
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                          Custom
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleServicePriceChange(srv.id, Math.max(100, currentPrice - 100))
                        }
                        className="w-7 h-7 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center justify-center transition-colors"
                        title="Reduce ₹100"
                      >
                        -
                      </button>

                      <div className="relative w-24">
                        <span className="absolute left-2.5 top-1.5 text-xs font-bold text-neutral-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          step="50"
                          value={currentPrice}
                          onChange={(e) =>
                            handleServicePriceChange(srv.id, Math.max(0, Number(e.target.value)))
                          }
                          className="w-full pl-6 pr-2 py-1 rounded-lg bg-white border border-rose-300 text-xs font-extrabold text-neutral-900 text-right focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleServicePriceChange(srv.id, currentPrice + 100)}
                        className="w-7 h-7 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center justify-center transition-colors"
                        title="Add ₹100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Booking Slip Modal */}
      {selectedBookingForSlip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <BookingSlip
              booking={selectedBookingForSlip}
              onClose={() => setSelectedBookingForSlip(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
