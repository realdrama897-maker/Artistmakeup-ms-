import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, AlertCircle, Star, Phone, MessageCircle, ArrowRight, FileText, Download } from 'lucide-react';
import { BookingItem, ServiceItem, UserAccount } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { BookingSlip } from '../BookingSlip.tsx';

interface CustomerDashboardProps {
  onBookNewService: () => void;
  onExploreArtists: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onBookNewService,
  onExploreArtists,
}) => {
  const { user, token, t, language } = useAuth();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<BookingItem | null>(null);
  const [selectedBookingForSlip, setSelectedBookingForSlip] = useState<BookingItem | null>(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBookings = async () => {
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
    fetchBookings();
  }, [token]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm(language === 'hi' ? 'क्या आप इस अपॉइंटमेंट को रद्द करना चाहते हैं?' : 'Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (res.ok) {
        showToast(language === 'hi' ? 'अपॉइंटमेंट रद्द कर दिया गया' : 'Booking cancelled successfully', 'info');
        fetchBookings();
      }
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReview || !commentText) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          artistId: selectedBookingForReview.artistId,
          rating: ratingVal,
          comment: commentText,
          serviceName: selectedBookingForReview.serviceName,
        }),
      });

      if (res.ok) {
        showToast(language === 'hi' ? 'रिव्यू दर्ज किया गया! धन्यवाद।' : 'Review posted! Thank you.', 'success');
        setReviewModalOpen(false);
        setCommentText('');
      } else {
        showToast('Failed to post review', 'error');
      }
    } catch {
      showToast('Error submitting review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-rose-900 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 bg-white/10 px-3 py-1 rounded-full">
            {t.customerRole}
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-2">
            {language === 'hi' ? 'नमस्ते,' : 'Welcome,'} {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 mt-1">
            {user?.phone} • {user?.email}
          </p>
        </div>

        <button
          onClick={onBookNewService}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-rose-900 font-bold text-xs sm:text-sm shadow-md hover:bg-rose-50 transition-colors"
        >
          <Calendar className="w-4 h-4 text-rose-600" />
          <span>{t.bookNowBtn}</span>
        </button>
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-600" />
            <span>{t.myBookings}</span>
          </h2>
          <span className="text-xs font-semibold text-neutral-500">
            {bookings.length} {language === 'hi' ? 'कुल ऑर्डर्स' : 'Total Appointments'}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-neutral-400 text-sm">
            Loading your bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-neutral-500 text-sm">
              {language === 'hi' ? 'आपके पास अभी कोई एक्टिव अपॉइंटमेंट नहीं है।' : "You haven't booked any home parlour appointments yet."}
            </p>
            <button
              onClick={onBookNewService}
              className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors"
            >
              {language === 'hi' ? 'पहली सेवा बुक करें' : 'Book Your First Service'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const statusColors = {
                pending: 'bg-amber-50 text-amber-800 border-amber-200',
                confirmed: 'bg-blue-50 text-blue-800 border-blue-200',
                completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                cancelled: 'bg-neutral-100 text-neutral-500 border-neutral-200',
              };

              const statusLabels = {
                pending: t.statusPending,
                confirmed: t.statusConfirmed,
                completed: t.statusCompleted,
                cancelled: t.statusCancelled,
              };

              return (
                <div
                  key={booking.id}
                  className="p-5 rounded-2xl border border-rose-100 bg-[#FFFDFD] hover:bg-white hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-400">
                        {booking.bookingNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          statusColors[booking.status]
                        }`}
                      >
                        {statusLabels[booking.status]}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-neutral-900">
                      {booking.serviceName}
                    </h3>

                    <p className="text-xs font-semibold text-rose-700">
                      Artist: {booking.artistName}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        {booking.date} at {booking.timeSlot}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        {booking.district}, {booking.state}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex flex-col md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-rose-50">
                    <span className="font-serif text-xl font-extrabold text-neutral-900">
                      ₹{booking.totalAmount.toLocaleString('en-IN')}
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* View / Download Slip */}
                      <button
                        onClick={() => setSelectedBookingForSlip(booking)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                        title={language === 'hi' ? 'बुकिंग रसीद डाउनलोड या प्रिंट करें' : 'View or download official booking receipt'}
                      >
                        <FileText className="w-3.5 h-3.5 text-rose-600" />
                        <span>{language === 'hi' ? 'रसीद (Slip)' : 'Slip / Receipt'}</span>
                      </button>

                      {/* WhatsApp contact */}
                      <a
                        href={`https://api.whatsapp.com/send?phone=${((booking.artistPhone || '8433405368').replace(/\D/g, '')).length === 10 ? '91' + (booking.artistPhone || '8433405368').replace(/\D/g, '') : (booking.artistPhone || '8433405368').replace(/\D/g, '')}&text=${encodeURIComponent(
                          `Namaste! Regarding my MS Makeup Artist appointment #${booking.bookingNumber} for ${booking.serviceName} on ${booking.date} at ${booking.timeSlot}. Helpline: 8433405368.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>

                      {/* Cancel if pending */}
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                        >
                          {t.cancelBookingBtn}
                        </button>
                      )}

                      {/* Rate if completed */}
                      {booking.status === 'completed' && (
                        <button
                          onClick={() => {
                            setSelectedBookingForReview(booking);
                            setReviewModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5 fill-white" />
                          <span>{t.rateExperienceBtn}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && selectedBookingForReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4">
            <h3 className="font-serif text-xl font-bold text-neutral-900">
              {t.rateExperienceBtn}
            </h3>
            <p className="text-xs text-neutral-600">
              Review for {selectedBookingForReview.artistName} ({selectedBookingForReview.serviceName})
            </p>

            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRatingVal(s)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      s <= ratingVal ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Your Feedback Comment
              </label>
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="How was the punctuality, hygiene kit, and makeover finish?"
                className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-xs sm:text-sm"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReviewSubmit}
                disabled={submittingReview}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                {submittingReview ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}

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
