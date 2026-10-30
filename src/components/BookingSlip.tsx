import React, { useRef } from 'react';
import { Sparkles, Printer, Download, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, Phone, User, FileText, X } from 'lucide-react';
import { BookingItem } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface BookingSlipProps {
  booking: BookingItem;
  onClose?: () => void;
}

export const BookingSlip: React.FC<BookingSlipProps> = ({ booking, onClose }) => {
  const { language } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);

  const defaultServiceImg =
    booking.serviceImage ||
    'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80';
  const defaultArtistAvatar =
    booking.artistAvatar ||
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MS Makeup Artist - Booking Receipt ${booking.bookingNumber}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 25px; color: #1f2937; background: #faf5f5; }
    .slip-container { max-width: 680px; margin: 0 auto; background: #ffffff; border: 2px solid #E25B78; border-radius: 24px; padding: 32px; box-shadow: 0 10px 30px rgba(226,91,120,0.12); position: relative; }
    .top-badge { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px dashed #fbcfe8; padding-bottom: 20px; margin-bottom: 24px; }
    .brand-wrap { display: flex; align-items: center; gap: 14px; }
    .brand-logo { width: 54px; height: 54px; border-radius: 16px; background: linear-gradient(135deg, #f59e0b, #e11d48, #b45309); color: #ffffff; display: flex; align-items: center; justify-content: center; font-family: Georgia, serif; font-size: 24px; font-weight: 900; box-shadow: 0 4px 12px rgba(225,29,72,0.3); border: 2px solid #fef3c7; }
    .brand-text h1 { font-family: Georgia, serif; font-size: 24px; margin: 0; color: #881337; font-weight: 800; letter-spacing: -0.5px; }
    .brand-text p { font-size: 11px; margin: 3px 0 0; color: #9f1239; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .ref-pill { background: #fff1f2; border: 1.5px solid #fecdd3; color: #be123c; padding: 6px 14px; border-radius: 30px; font-weight: 800; font-size: 13px; text-align: right; }
    .ref-pill span { display: block; font-size: 9px; color: #9f1239; text-transform: uppercase; }
    
    .hero-service-card { display: flex; gap: 18px; align-items: center; background: #fff5f6; border: 1px solid #fecdd3; border-radius: 18px; padding: 14px; margin-bottom: 22px; }
    .service-img { width: 110px; height: 95px; border-radius: 14px; object-fit: cover; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.1); shrink-0; }
    .service-info { flex: 1; }
    .service-badge { display: inline-block; background: #e11d48; color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 4px; }
    .service-title { font-family: Georgia, serif; font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 4px; }
    .service-meta { font-size: 12px; color: #4b5563; }
    .service-meta strong { color: #881337; }

    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 22px; }
    .box { background: #ffffff; border: 1.5px solid #ffe4e6; border-radius: 16px; padding: 16px; font-size: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
    .box-title { margin: 0 0 10px 0; color: #881337; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #fecdd3; padding-bottom: 6px; display: flex; align-items: center; justify-content: space-between; }
    .box p { margin: 4px 0; color: #374151; font-size: 12px; line-height: 1.4; }
    .box p strong { color: #111827; }
    .artist-chip { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
    .artist-avatar { width: 42px; height: 42px; border-radius: 12px; object-fit: cover; border: 2px solid #f59e0b; }

    .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; border-radius: 12px; overflow: hidden; border: 1px solid #ffe4e6; }
    .table th { background: #ffe4e6; text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 800; color: #881337; text-transform: uppercase; }
    .table td { padding: 12px 14px; border-bottom: 1px solid #fff1f2; background: #ffffff; }
    .table td.right { text-align: right; }
    .total-box { background: linear-gradient(135deg, #fff1f2, #fef3c7); border: 1.5px solid #fecdd3; border-radius: 14px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .total-label { font-size: 12px; font-weight: 800; color: #881337; text-transform: uppercase; }
    .total-price { font-family: Georgia, serif; font-size: 24px; font-weight: 900; color: #881337; }

    .notes-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 10px 14px; font-size: 11px; color: #92400e; margin-bottom: 20px; }
    .guarantee-bar { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #fecdd3; padding-top: 14px; font-size: 11px; color: #059669; font-weight: 700; }
    .footer-help { margin-top: 14px; text-align: center; font-size: 11px; color: #6b7280; line-height: 1.5; border-top: 1px dashed #fbcfe8; padding-top: 14px; }
    .print-btn-bar { text-align: center; margin-top: 25px; }
    .print-btn { background: #e11d48; color: #ffffff; border: none; padding: 10px 24px; border-radius: 12px; font-size: 13px; font-weight: bold; cursor: pointer; }

    @media print {
      body { background: #ffffff; padding: 0; }
      .slip-container { border: 1px solid #e11d48; box-shadow: none; max-width: 100%; padding: 20px; }
      .print-btn-bar { display: none; }
    }
  </style>
</head>
<body>
  <div class="slip-container">
    <div class="top-badge">
      <div class="brand-wrap">
        <div class="brand-logo">MS</div>
        <div class="brand-text">
          <h1>MS Makeup Artist</h1>
          <p>Ghar Baithe Beauty Parlour • Doorstep Service</p>
        </div>
      </div>
      <div class="ref-pill">
        <span>Booking Reference</span>
        #${booking.bookingNumber}
      </div>
    </div>

    <!-- Service Card with Real Photo -->
    <div class="hero-service-card">
      <img src="${defaultServiceImg}" alt="${booking.serviceName}" class="service-img" crossorigin="anonymous" referrerpolicy="no-referrer" />
      <div class="service-info">
        <span class="service-badge">Doorstep Parlour Appointment</span>
        <h3 class="service-title">${booking.serviceName}</h3>
        <div class="service-meta">
          Scheduled: <strong>${booking.date}</strong> at <strong>${booking.timeSlot}</strong><br>
          Service Location: <strong>${booking.district}, ${booking.state}</strong>
        </div>
      </div>
    </div>

    <div class="grid">
      <div class="box">
        <div class="box-title">
          <span>Customer Details (ग्राहक)</span>
          <span style="color:#059669; font-size:10px;">✓ Verified</span>
        </div>
        <p><strong>Name:</strong> ${booking.customerName}</p>
        <p><strong>Phone:</strong> ${booking.customerPhone}</p>
        <p><strong>Address:</strong> ${booking.address}</p>
        <p><strong>District:</strong> ${booking.district}, ${booking.state}</p>
      </div>

      <div class="box">
        <div class="box-title">
          <span>Assigned Artist (ब्यूटीशियन)</span>
          <span style="color:#f59e0b; font-size:10px;">★ Top Rated</span>
        </div>
        <div class="artist-chip">
          <img src="${defaultArtistAvatar}" alt="${booking.artistName}" class="artist-avatar" crossorigin="anonymous" referrerpolicy="no-referrer" />
          <div>
            <p><strong>${booking.artistName}</strong></p>
            <p style="font-size:11px; color:#6b7280;">Contact: ${booking.artistPhone}</p>
          </div>
        </div>
        <p style="margin-top:6px;"><strong>Status:</strong> <span style="color:#059669; font-weight:bold;">${booking.status.toUpperCase()}</span></p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Item / Service</th>
          <th>Sanitized Single-use Kit</th>
          <th class="right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${booking.serviceName}</strong><br><span style="font-size:10px; color:#6b7280;">Includes doorstep setup & branded cosmetics</span></td>
          <td style="color:#059669; font-weight:bold;">Included (₹0)</td>
          <td class="right" style="font-weight:bold; font-size:13px;">₹${booking.totalAmount.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td colspan="2" style="color:#059669; font-weight:600;">Home Visit & Travel Convenience Fee:</td>
          <td class="right" style="color:#059669; font-weight:bold;">FREE</td>
        </tr>
      </tbody>
    </table>

    <div class="total-box">
      <div>
        <span class="total-label">Total Payable at Home (घर पर भुगतान):</span>
        <div style="font-size:11px; color:#6b7280;">Cash / UPI accepted after complete service satisfaction</div>
      </div>
      <span class="total-price">₹${booking.totalAmount.toLocaleString('en-IN')}</span>
    </div>

    ${booking.notes ? `<div class="notes-box"><strong>Client Note:</strong> ${booking.notes}</div>` : ''}

    <div class="guarantee-bar">
      <span>✓ 100% Sealed & Sanitized Disposable Kit Guarantee</span>
      <span style="color:#881337;">MS Verified Partner</span>
    </div>

    <div class="footer-help">
      <p>Thank you for choosing <strong>MS Makeup Artist</strong>! For rescheduling, queries or immediate assistance, call 24x7 Helpline: <strong>+91 84334 05368</strong> or WhatsApp.</p>
    </div>

    <div class="print-btn-bar">
      <button onclick="window.print()" class="print-btn">🖨️ Print or Save as PDF</button>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MS-Makeup-Artist-Receipt-${booking.bookingNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-rose-200 shadow-xl max-w-xl mx-auto my-3 relative print:m-0 print:p-0 print:border-none print:shadow-none">
      {onClose && (
        <button
          onClick={onClose}
          className="print:hidden absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-rose-50"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Slip Content Header */}
      <div ref={printRef} className="space-y-4">
        {/* Brand Banner */}
        <div className="text-center pb-3 border-b-2 border-dashed border-rose-200">
          <div className="flex items-center justify-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-rose-600 to-amber-700 flex items-center justify-center text-white font-serif font-black text-sm shadow-md border-2 border-amber-200">
              MS
            </div>
            <div className="text-left">
              <h2 className="font-serif text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-rose-950 via-rose-800 to-amber-900 bg-clip-text text-transparent">
                MS Makeup Artist
              </h2>
              <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                {language === 'hi'
                  ? 'आधिकारिक बुकिंग रसीद (Official Appointment Slip)'
                  : 'Official Appointment Slip'}
              </p>
            </div>
          </div>

          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            <span>SLIP REF: #{booking.bookingNumber}</span>
          </div>

          <p className="text-[11px] text-neutral-500 mt-1">
            Helpline: <strong className="text-neutral-800">8433405368</strong> • Doorstep Parlour Service
          </p>
        </div>

        {/* Real Service Visual Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50/60 border border-rose-200">
          <img
            src={defaultServiceImg}
            alt={booking.serviceName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-white shadow-sm shrink-0"
            crossOrigin="anonymous"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[9px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
              {language === 'hi' ? 'घर बैठे सेवा' : 'Doorstep Service'}
            </span>
            <h3 className="font-serif font-bold text-neutral-900 text-sm sm:text-base truncate">
              {booking.serviceName}
            </h3>
            <p className="text-xs text-rose-700 font-semibold flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{booking.date} at {booking.timeSlot}</span>
            </p>
          </div>
        </div>

        {/* Customer & Artist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FFF9F7] border border-rose-100 space-y-1">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block border-b border-rose-100 pb-1 mb-1">
              {language === 'hi' ? 'ग्राहक विवरण (Customer)' : 'Customer Details'}
            </span>
            <p className="font-bold text-neutral-900 text-sm">{booking.customerName}</p>
            <p className="text-neutral-600 flex items-center gap-1">
              <Phone className="w-3 h-3 text-rose-500" /> {booking.customerPhone}
            </p>
            <p className="text-neutral-600 flex items-start gap-1">
              <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
              <span>{booking.address}, {booking.district}, {booking.state}</span>
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF9F7] border border-rose-100 space-y-1">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block border-b border-rose-100 pb-1 mb-1">
              {language === 'hi' ? 'आर्टिस्ट विवरण (Artist)' : 'Assigned Beauty Artist'}
            </span>
            <div className="flex items-center gap-2">
              <img
                src={defaultArtistAvatar}
                alt={booking.artistName}
                className="w-9 h-9 rounded-xl object-cover border border-amber-300 shrink-0"
                crossOrigin="anonymous"
              />
              <div className="min-w-0">
                <p className="font-bold text-neutral-900 text-xs sm:text-sm truncate">{booking.artistName}</p>
                <p className="text-neutral-500 text-[11px] flex items-center gap-1">
                  <Phone className="w-2.5 h-2.5 text-amber-600" /> {booking.artistPhone || '8433405368'}
                </p>
              </div>
            </div>
            <p className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px] pt-1">
              <CheckCircle2 className="w-3 h-3" /> Status: {booking.status.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 text-xs space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-neutral-600">Home Parlour Service Fee:</span>
            <span className="font-bold text-neutral-800">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-emerald-700 text-[11px]">
            <span>Doorstep Travel & Sanitized Kit:</span>
            <span className="font-bold">FREE (₹0)</span>
          </div>
          <div className="pt-2 border-t border-rose-200/80 flex justify-between items-center font-bold text-sm">
            <span className="text-rose-950">
              {language === 'hi' ? 'घर पर देय कुल राशि:' : 'Total Payable at Home:'}
            </span>
            <span className="font-serif text-lg text-rose-900 font-extrabold">
              ₹{booking.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {booking.notes && (
          <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900">
            <strong>Customer Instructions:</strong> {booking.notes}
          </div>
        )}

        {/* Guarantee stamp */}
        <div className="flex items-center justify-between text-[11px] pt-1 text-neutral-500">
          <div className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Sanitized Tools & Disposable Kit Guarantee</span>
          </div>
          <span className="font-serif italic text-rose-800 font-bold">MS Verified</span>
        </div>
      </div>

      {/* Action Buttons for Download and Print */}
      <div className="print:hidden flex flex-wrap items-center justify-center gap-3 pt-5 mt-4 border-t border-rose-100">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 active:scale-95 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>{language === 'hi' ? 'रसीद डाउनलोड करें (Download Slip with Images)' : 'Download Receipt Slip'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs transition-colors"
        >
          <Printer className="w-4 h-4 text-neutral-600" />
          <span>{language === 'hi' ? 'प्रिंट करें (Print)' : 'Print Slip'}</span>
        </button>
      </div>
    </div>
  );
};
