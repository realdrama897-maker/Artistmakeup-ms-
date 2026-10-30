# GlowStudio (ग्लो स्टूडियो) — Ghar Baithe Beauty Parlour & Makeup Artist Booking

> **"Sahi Rate, Har Kaam — Beauty Parlour Ghar Par"**  
> Book verified, certified bridal & party makeup artists directly at your home. 100% single-use sanitized kits, transparent rates, and salon-grade luxury.

---

## 🌟 Key Features

### 1. 🎨 Luxury Aesthetic & Design
- **Color Palette**: Soft pink (`#FFF5F7`, `#FDE8EA`), luxury gold (`#C99E25`, `#D4AF37`), rose-gold (`#B76E79`), and warm cream.
- **Glassmorphism & Neumorphism**: Subtle backdrop blur, soft elevation shadows, and gold rim effects.
- **Typography**: Editorial elegance with `Playfair Display` serif headers and `Plus Jakarta Sans` body typography.
- **Interactive Enhancements**: Animated booking tickers, canvas confetti on appointment confirmation, image lightboxes, and smooth scrolling.

### 2. 🌐 Bilingual Support (English & हिंदी)
- Real-time language toggle button (`EN` / `हिंदी`) in the sticky navigation header.
- Complete translations for every section: Hero, 20+ Services catalog, Rate List (रेट सूची), Artist Search, Booking Modal, Testimonials, Dashboards, and Contact forms.
- Language preference safely preserved in `localStorage`.

### 3. 👥 Three Distinct User Roles (Role-Based Authentication)

#### 1️⃣ Secret Administrator Portal
- **Confidential Route**: Accessible strictly via:
  ```
  /admin-secret-panel
  # Or via URL hash:
  /#admin-secret-panel
  ```
  *(Hidden from all public navigation links, footer menus, buttons, and site search).*
- **Admin Credentials**:
  - **Email**: `gkgmkg345@gmail.com`
  - **Password**: `Manish@35`
- **Security**: Passwords are saved with salted **bcrypt** hashes and authenticated via Bearer **JWT**. Credentials never leak to frontend bundles.
- **Admin Capabilities**:
  - Approve, reject, or block registered artists and parlours.
  - View all customer appointments and status lifecycle.
  - Manage services and rate list (add, edit price/details, delete).
  - Real-time financial revenue metrics and category demand statistics.
  - Broadcast system notifications and seasonal promotions to all users.

#### 2️⃣ Artist / Parlour Partner
- **Registration**: Full Name, Shop/Salon Name, WhatsApp number, Contact Phone, Full Address, State (all Indian states), Dynamic District selector, Experience, Bio, and Services with custom rates.
- **Artist Dashboard**:
  - Toggle home visit availability (online/offline).
  - Review incoming customer appointment requests with **Accept (Confirm)** or **Reject**.
  - Mark appointments as **Completed**.
  - Edit custom pricing for all 20+ beauty services.
  - Monitor total earnings and star ratings.

#### 3️⃣ Customer
- **Registration & Login**: Name, Mobile number, Email, and Password.
- **Customer Dashboard**:
  - Search verified artists with Indian state, district, budget, and rating filters.
  - Book doorstep appointments with customized date, time slot, and special lehenga/skin instructions.
  - Track live appointment status (`Pending`, `Confirmed`, `Completed`, `Cancelled`).
  - Cancel pending bookings.
  - Submit ratings (1–5 stars) and reviews with instant artist rating recalculation.

---

## 💄 Complete Services Catalog (Har Kaam Ka Naam)

1. **Bridal Makeup (Dulhan Look)** — Traditional & HD base with waterproof finish
2. **Party & Sangeet Makeup** — Evening glamour & cocktail looks
3. **Engagement / Roka Makeup** — Soft pastel shimmer and romantic glow
4. **HD & Airbrush Makeup** — 24-hour poreless, photo-ready silicone mist
5. **Reception Makeup & Styling** — Contemporary high-glam evening look
6. **Mehendi / Henna Designing** — Rajasthani, Arabic, and bridal portrait patterns
7. **Hair Styling & Curls** — Voluminous curls, textured bridal updo, straightening
8. **Gold & Diamond Luxury Facial** — 24K gold foil infusion and deep pore cleansing
9. **Clean-up & Herbal D-Tan Bleach** — Instant tan removal and fruit pack
10. **Full Body Waxing (Rica / Chocolate)** — Painless liposoluble Italian wax
11. **Threading & Facial Hair Contouring** — Eyebrow shaping, upper lip, chin
12. **Luxury Spa Manicure & Pedicure** — Rose petal soak, scrub, and massage
13. **Nail Art & Gel Extensions** — Acrylic, chrome mirror, and 3D stones
14. **Hair Spa & Deep Keratin Nourish** — Scalp steam and frizz repair
15. **Keratin & Nanoplastia Smoothening** — 6-month mirror shine straight hair
16. **Professional Saree & Lehenga Draping** — South Indian, Gujarati, and butterfly
17. **Groom Makeup & Beard Grooming** — Camera matte correction and beard styling
18. **Complete Pre-Bridal Glow Package** — 7-day head-to-toe makeover ritual
19. **Kids & Teen Event Makeup** — Gentle mineral cosmetics for stage and weddings
20. **Eyelash Extensions & Lash Lift** — Semi-permanent silk lash extensions

---

## 🛠️ Tech Architecture

- **Frontend**: React 19, Tailwind CSS v4, Motion, Lucide React, Canvas Confetti.
- **Backend**: Node.js + Express with Vite middleware in development.
- **Authentication**: JWT tokens with 7-day expiry and `bcryptjs` password hashing.
- **Database**: Atomic JSON document store in `data/db.json` with auto-seeding.
- **WhatsApp Integration**: Direct one-tap click-to-chat links with pre-filled appointment details.
