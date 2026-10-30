import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';
import { UserAccount, BookingItem, ServiceItem, ReviewItem, NotificationItem } from './server/initialData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'glowstudio_luxury_jwt_secret_key_2026_xyz';

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Helper to sanitize user object (never send passwordHash to client)
function sanitizeUser(user: UserAccount) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

// Authentication middleware
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'customer' | 'artist' | 'admin';
    name: string;
  };
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded as AuthRequest['user'];
    next();
  });
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access restricted to administrators only' });
  }
  next();
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Register (Customer or Artist)
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'customer',
      // Artist-specific fields:
      shopName,
      whatsapp,
      address,
      state,
      district,
      experienceYears,
      bio,
      avatar,
      coverImage,
      portfolio,
      servicesOffered,
      startingPrice,
    } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'Name, email, phone, and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = db.getUserByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userRole = role === 'admin' ? 'admin' : role === 'artist' ? 'artist' : 'customer';
    const userId = `${userRole.slice(0, 3)}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const newUser: UserAccount = {
      id: userId,
      email: cleanEmail,
      passwordHash,
      name,
      phone,
      role: userRole,
      createdAt: new Date().toISOString(),
    };

    if (role === 'artist') {
      newUser.shopName = shopName || `${name}'s Makeover Hub`;
      newUser.whatsapp = whatsapp || phone;
      newUser.address = address || '';
      newUser.state = state || 'Delhi';
      newUser.district = district || 'Central Delhi';
      newUser.experienceYears = Number(experienceYears) || 2;
      newUser.bio = bio || 'Passionate beauty artist committed to bringing parlor glam right to your doorstep.';
      newUser.avatar = avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80';
      newUser.coverImage = coverImage || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80';
      newUser.portfolio = Array.isArray(portfolio) && portfolio.length > 0 ? portfolio : [
        'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      ];
      newUser.servicesOffered = Array.isArray(servicesOffered) ? servicesOffered : [
        { serviceId: 'srv-bridal', customPrice: 8999 },
        { serviceId: 'srv-party', customPrice: 1999 },
      ];
      newUser.startingPrice = Number(startingPrice) || 1499;
      newUser.isAvailable = true;
      newUser.approvalStatus = 'approved'; // auto-approved for instant testing / demo delight
      newUser.rating = 5.0;
      newUser.reviewCount = 1;
    }

    db.createUser(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login (All 3 roles: Customer, Artist, Admin)
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = db.getUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify bcrypt password
    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // If artist is blocked
    if (user.role === 'artist' && user.approvalStatus === 'blocked') {
      return res.status(403).json({ error: 'This artist account has been suspended by administration' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Logged in successfully',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Get current logged-in user profile
app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const user = db.getUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User account not found' });
  return res.json({ user: sanitizeUser(user) });
});

// ==========================================
// ARTISTS ROUTES
// ==========================================

// Search & list artists (public)
app.get('/api/artists', (req: Request, res: Response) => {
  try {
    const { state, district, serviceId, q, maxPrice, minRating } = req.query;
    let artists = db.getAllArtists();

    // Default: only return approved artists for public search
    artists = artists.filter((a) => a.approvalStatus === 'approved');

    if (state && typeof state === 'string' && state !== 'All States') {
      artists = artists.filter((a) => a.state?.toLowerCase() === state.toLowerCase());
    }

    if (district && typeof district === 'string' && district !== 'All Districts') {
      artists = artists.filter((a) => a.district?.toLowerCase() === district.toLowerCase());
    }

    if (serviceId && typeof serviceId === 'string' && serviceId !== 'all') {
      artists = artists.filter((a) =>
        a.servicesOffered?.some((s) => s.serviceId === serviceId)
      );
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      artists = artists.filter((a) => (a.startingPrice || 0) <= Number(maxPrice));
    }

    if (minRating && !isNaN(Number(minRating))) {
      artists = artists.filter((a) => (a.rating || 0) >= Number(minRating));
    }

    if (q && typeof q === 'string') {
      const term = q.toLowerCase();
      artists = artists.filter(
        (a) =>
          a.name.toLowerCase().includes(term) ||
          a.shopName?.toLowerCase().includes(term) ||
          a.bio?.toLowerCase().includes(term) ||
          a.district?.toLowerCase().includes(term)
      );
    }

    return res.json({ artists: artists.map(sanitizeUser) });
  } catch (error) {
    console.error('Fetch artists error:', error);
    return res.status(500).json({ error: 'Failed to retrieve artists' });
  }
});

// Get artist detail by ID
app.get('/api/artists/:id', (req: Request, res: Response) => {
  const artist = db.getUserById(req.params.id);
  if (!artist || artist.role !== 'artist') {
    return res.status(404).json({ error: 'Artist not found' });
  }
  const reviews = db.getAllReviews(artist.id);
  return res.json({ artist: sanitizeUser(artist), reviews });
});

// Update Artist profile (Artist Dashboard)
app.put('/api/artists/profile', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user || (req.user.role !== 'artist' && req.user.role !== 'admin')) {
    return res.status(403).json({ error: 'Only artists or admins can update this profile' });
  }

  const artistId = req.user.role === 'admin' && req.body.artistId ? req.body.artistId : req.user.id;
  const updates = { ...req.body };
  delete updates.id;
  delete updates.passwordHash;
  delete updates.role;
  delete updates.email;

  const updated = db.updateUser(artistId, updates);
  if (!updated) return res.status(404).json({ error: 'Artist not found' });
  return res.json({ message: 'Profile updated successfully', user: sanitizeUser(updated) });
});

// ==========================================
// SERVICES ROUTES (Har Kaam ka Naam)
// ==========================================

// Get all services
app.get('/api/services', (_req: Request, res: Response) => {
  const services = db.getAllServices();
  return res.json({ services });
});

// Create service (Admin only)
app.post('/api/services', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { nameEn, nameHi, category, descriptionEn, descriptionHi, basePrice, durationMinutes, image } = req.body;
  if (!nameEn || !basePrice) {
    return res.status(400).json({ error: 'Service name and price are required' });
  }
  const newService: ServiceItem = {
    id: `srv-${Date.now().toString(36)}`,
    nameEn,
    nameHi: nameHi || nameEn,
    category: category || 'makeup',
    descriptionEn: descriptionEn || '',
    descriptionHi: descriptionHi || descriptionEn || '',
    basePrice: Number(basePrice),
    durationMinutes: Number(durationMinutes) || 60,
    image: image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  };
  db.createService(newService);
  return res.status(201).json({ message: 'Service created successfully', service: newService });
});

// Update service (Admin only)
app.put('/api/services/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const updated = db.updateService(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Service not found' });
  return res.json({ message: 'Service updated', service: updated });
});

// Delete service (Admin only)
app.delete('/api/services/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const deleted = db.deleteService(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Service not found' });
  return res.json({ message: 'Service removed' });
});

// ==========================================
// BOOKINGS ROUTES
// ==========================================

// Get bookings based on user role
app.get('/api/bookings', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.user.role === 'admin') {
    return res.json({ bookings: db.getAllBookings() });
  } else if (req.user.role === 'artist') {
    return res.json({ bookings: db.getBookingsByArtist(req.user.id) });
  } else {
    return res.json({ bookings: db.getBookingsByCustomer(req.user.id) });
  }
});

// Create booking
app.post('/api/bookings', (req: AuthRequest, res: Response) => {
  try {
    const {
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      artistId,
      serviceId,
      date,
      timeSlot,
      address,
      state,
      district,
      notes,
    } = req.body;

    if (!artistId || !serviceId || !date || !timeSlot || !address || !customerName || !customerPhone) {
      return res.status(400).json({ error: 'All booking fields (artist, service, date, time, name, phone, address) are required' });
    }

    if (!customerId) {
      return res.status(401).json({
        error: 'कृपया अपॉइंटमेंट बुक करने से पहले ग्राहक (Customer) लॉगिन या साइन अप करें। (Please login or sign up as a customer before booking)',
      });
    }

    const customer = db.getUserById(customerId);
    if (!customer || customer.role !== 'customer') {
      return res.status(401).json({
        error: 'अपॉइंटमेंट केवल ग्राहक (Customer) खाते द्वारा ही बुक किया जा सकता है। कृपया ग्राहक लॉगिन करें। (Only registered customer accounts can book appointments)',
      });
    }

    const artist = db.getUserById(artistId);
    const service = db.getServiceById(serviceId);

    if (!artist) return res.status(404).json({ error: 'Selected artist not found' });
    if (!service) return res.status(404).json({ error: 'Selected service not found' });

    // Determine custom price if artist set one, otherwise base price
    const customMatch = artist.servicesOffered?.find((s) => s.serviceId === serviceId);
    const totalAmount = customMatch?.customPrice || service.basePrice;

    const bookingId = `bkg-${Date.now().toString(36)}`;
    const bookingNumber = `MS-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: BookingItem = {
      id: bookingId,
      bookingNumber,
      customerId: customer.id,
      customerName: customerName || customer.name,
      customerPhone: customerPhone || customer.phone,
      customerEmail: customerEmail || customer.email || 'customer@msmakeupartist.in',
      artistId: artist.id,
      artistName: `${artist.name} (${artist.shopName || 'MS Makeup Artist'})`,
      artistPhone: artist.whatsapp || artist.phone || '8433405368',
      serviceId: service.id,
      serviceName: service.nameEn,
      serviceImage: service.image,
      artistAvatar: artist.avatar,
      date,
      timeSlot,
      address,
      state: state || artist.state || 'Delhi',
      district: district || artist.district || 'South Delhi',
      totalAmount,
      status: 'pending',
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    db.createBooking(newBooking);

    // Also notify
    db.createNotification({
      id: `notif-${Date.now()}`,
      title: 'New Appointment Booking!',
      message: `${newBooking.customerName} booked ${service.nameEn} with ${artist.name} for ${date} at ${timeSlot}.`,
      type: 'booking',
      createdAt: new Date().toISOString(),
      targetRole: 'all',
    });

    return res.status(201).json({
      message: 'Booking request sent successfully!',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ error: 'Failed to process appointment booking' });
  }
});

// Update booking status (accept/reject/cancel/reschedule)
app.put('/api/bookings/:id/status', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { status, notes } = req.body;
  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid booking status' });
  }

  const booking = db.getBookingById(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  // Verification: customer can only cancel their own, artist can manage their bookings, admin can manage all
  if (req.user.role === 'customer' && booking.customerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to modify this booking' });
  }
  if (req.user.role === 'artist' && booking.artistId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to modify this booking' });
  }

  const updated = db.updateBookingStatus(req.params.id, status, notes);
  return res.json({ message: `Booking status updated to ${status}`, booking: updated });
});

// ==========================================
// REVIEWS ROUTES
// ==========================================

// Get reviews (optional ?artistId=...)
app.get('/api/reviews', (req: Request, res: Response) => {
  const { artistId } = req.query;
  const reviews = db.getAllReviews(typeof artistId === 'string' ? artistId : undefined);
  return res.json({ reviews });
});

// Create review
app.post('/api/reviews', authenticateToken, (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { artistId, rating, comment, serviceName } = req.body;
  if (!artistId || !rating || !comment) {
    return res.status(400).json({ error: 'Artist, rating (1-5), and feedback comment are required' });
  }

  const newReview: ReviewItem = {
    id: `rev-${Date.now().toString(36)}`,
    artistId,
    customerId: req.user.id,
    customerName: req.user.name || 'Verified Customer',
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment,
    date: new Date().toISOString().split('T')[0],
    serviceName: serviceName || 'Parlour Service',
  };

  db.createReview(newReview);
  return res.status(201).json({ message: 'Thank you for your rating & review!', review: newReview });
});

// ==========================================
// NOTIFICATIONS ROUTES
// ==========================================

app.get('/api/notifications', (_req: Request, res: Response) => {
  const notifications = db.getAllNotifications();
  return res.json({ notifications });
});

// ==========================================
// ADMIN ROUTES (Secret Dashboard)
// ==========================================

// Admin overview stats
app.get('/api/admin/stats', authenticateToken, requireAdmin, (_req: AuthRequest, res: Response) => {
  const stats = db.getStats();
  return res.json({ stats });
});

// Admin list all users
app.get('/api/admin/users', authenticateToken, requireAdmin, (_req: AuthRequest, res: Response) => {
  const users = db.getAllUsers().map(sanitizeUser);
  return res.json({ users });
});

// Admin update artist approval status (approve / reject / block)
app.put('/api/admin/artists/:id/status', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  if (!['approved', 'pending', 'rejected', 'blocked'].includes(status)) {
    return res.status(400).json({ error: 'Invalid artist status' });
  }
  const updated = db.updateArtistStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: 'Artist not found' });
  return res.json({ message: `Artist status changed to ${status}`, artist: sanitizeUser(updated) });
});

// Admin broadcast notification
app.post('/api/admin/notifications', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  const { title, message, type = 'info', targetRole = 'all' } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required' });
  }
  const notification: NotificationItem = {
    id: `notif-${Date.now()}`,
    title,
    message,
    type,
    createdAt: new Date().toISOString(),
    targetRole,
  };
  db.createNotification(notification);
  return res.status(201).json({ message: 'Notification broadcasted', notification });
});

// Simple contact inquiry route
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, phone, email, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Name, phone, and message are required' });
  }
  // Log and save inquiry as admin notification
  db.createNotification({
    id: `notif-contact-${Date.now()}`,
    title: `Inquiry from ${name}`,
    message: `${message} (Phone: ${phone}, Email: ${email || 'N/A'})`,
    type: 'info',
    createdAt: new Date().toISOString(),
    targetRole: 'all',
  });
  return res.json({ message: 'Thank you! Our beauty consultant will call or WhatsApp you within 15 minutes.' });
});

// ==========================================
// VITE DEV SERVER / STATIC SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ GlowStudio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
