import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  initialServices,
  initialArtists,
  initialCustomers,
  initialBookings,
  initialReviews,
  initialNotifications,
  ServiceItem,
  UserAccount,
  BookingItem,
  ReviewItem,
  NotificationItem,
} from './initialData.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  users: UserAccount[];
  services: ServiceItem[];
  bookings: BookingItem[];
  reviews: ReviewItem[];
  notifications: NotificationItem[];
}

function ensureAdminExists(users: UserAccount[]) {
  const adminEmail = (process.env.ADMIN_EMAIL || 'gkgmkg345@gmail.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Manish@35';

  const existingAdminIndex = users.findIndex((u) => u.email.toLowerCase() === adminEmail);
  if (existingAdminIndex === -1) {
    users.unshift({
      id: 'admin-glowstudio-01',
      email: adminEmail,
      passwordHash: bcrypt.hashSync(adminPassword, 10),
      name: 'Super Admin',
      phone: '+91 99999 88888',
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
  } else {
    // Ensure role is admin
    users[existingAdminIndex].role = 'admin';
  }
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure initial arrays exist
        parsed.users = parsed.users || [];
        parsed.services = parsed.services || [];
        parsed.bookings = parsed.bookings || [];
        parsed.reviews = parsed.reviews || [];
        parsed.notifications = parsed.notifications || [];
        ensureAdminExists(parsed.users);
        return parsed;
      }
    } catch (err) {
      console.error('Error loading db file, falling back to seed data:', err);
    }

    const defaultUsers: UserAccount[] = [...initialArtists, ...initialCustomers];
    ensureAdminExists(defaultUsers);

    const initialData: DatabaseSchema = {
      users: defaultUsers,
      services: [...initialServices],
      bookings: [...initialBookings],
      reviews: [...initialReviews],
      notifications: [...initialNotifications],
    };

    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing initial db file:', e);
    }

    return initialData;
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist db:', err);
    }
  }

  // --- User Operations ---
  public getUserByEmail(email: string): UserAccount | undefined {
    const cleanEmail = email.toLowerCase().trim();
    return this.data.users.find((u) => u.email.toLowerCase() === cleanEmail);
  }

  public getUserById(id: string): UserAccount | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(user: UserAccount): UserAccount {
    this.data.users.push(user);
    this.persist();
    return user;
  }

  public updateUser(id: string, updates: Partial<UserAccount>): UserAccount | undefined {
    const user = this.getUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates);
    this.persist();
    return user;
  }

  public getAllUsers(): UserAccount[] {
    return this.data.users;
  }

  public getAllArtists(): UserAccount[] {
    return this.data.users.filter((u) => u.role === 'artist');
  }

  public updateArtistStatus(id: string, status: 'approved' | 'pending' | 'rejected' | 'blocked'): UserAccount | undefined {
    const user = this.getUserById(id);
    if (!user || user.role !== 'artist') return undefined;
    user.approvalStatus = status;
    this.persist();
    return user;
  }

  // --- Services Operations ---
  public getAllServices(): ServiceItem[] {
    return this.data.services;
  }

  public getServiceById(id: string): ServiceItem | undefined {
    return this.data.services.find((s) => s.id === id);
  }

  public createService(service: ServiceItem): ServiceItem {
    this.data.services.push(service);
    this.persist();
    return service;
  }

  public updateService(id: string, updates: Partial<ServiceItem>): ServiceItem | undefined {
    const service = this.getServiceById(id);
    if (!service) return undefined;
    Object.assign(service, updates);
    this.persist();
    return service;
  }

  public deleteService(id: string): boolean {
    const idx = this.data.services.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    this.data.services.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- Bookings Operations ---
  public getAllBookings(): BookingItem[] {
    return this.data.bookings;
  }

  public getBookingsByCustomer(customerId: string): BookingItem[] {
    return this.data.bookings.filter((b) => b.customerId === customerId);
  }

  public getBookingsByArtist(artistId: string): BookingItem[] {
    return this.data.bookings.filter((b) => b.artistId === artistId);
  }

  public getBookingById(id: string): BookingItem | undefined {
    return this.data.bookings.find((b) => b.id === id);
  }

  public createBooking(booking: BookingItem): BookingItem {
    this.data.bookings.unshift(booking);
    this.persist();
    return booking;
  }

  public updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled', notes?: string): BookingItem | undefined {
    const booking = this.getBookingById(id);
    if (!booking) return undefined;
    booking.status = status;
    if (notes) booking.notes = notes;
    this.persist();
    return booking;
  }

  // --- Reviews Operations ---
  public getAllReviews(artistId?: string): ReviewItem[] {
    if (artistId) {
      return this.data.reviews.filter((r) => r.artistId === artistId);
    }
    return this.data.reviews;
  }

  public createReview(review: ReviewItem): ReviewItem {
    this.data.reviews.unshift(review);
    // Recalculate artist rating
    const artistReviews = this.data.reviews.filter((r) => r.artistId === review.artistId);
    const avg = artistReviews.reduce((sum, r) => sum + r.rating, 0) / (artistReviews.length || 1);
    const artist = this.getUserById(review.artistId);
    if (artist) {
      artist.rating = Math.round(avg * 10) / 10;
      artist.reviewCount = artistReviews.length;
    }
    this.persist();
    return review;
  }

  // --- Notifications Operations ---
  public getAllNotifications(): NotificationItem[] {
    return this.data.notifications;
  }

  public createNotification(notification: NotificationItem): NotificationItem {
    this.data.notifications.unshift(notification);
    this.persist();
    return notification;
  }

  // --- Admin Statistics ---
  public getStats() {
    const totalArtists = this.data.users.filter((u) => u.role === 'artist');
    const approvedArtists = totalArtists.filter((a) => a.approvalStatus === 'approved');
    const pendingArtists = totalArtists.filter((a) => a.approvalStatus === 'pending');
    const totalCustomers = this.data.users.filter((u) => u.role === 'customer');
    const totalBookings = this.data.bookings;
    
    const completedBookings = totalBookings.filter((b) => b.status === 'completed');
    const confirmedBookings = totalBookings.filter((b) => b.status === 'confirmed');
    const pendingBookings = totalBookings.filter((b) => b.status === 'pending');
    const cancelledBookings = totalBookings.filter((b) => b.status === 'cancelled');

    const totalRevenue = totalBookings
      .filter((b) => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    const categoryCounts: Record<string, number> = {};
    for (const b of totalBookings) {
      const srv = this.getServiceById(b.serviceId);
      const cat = srv?.category || 'other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }

    return {
      artistsCount: totalArtists.length,
      approvedArtistsCount: approvedArtists.length,
      pendingArtistsCount: pendingArtists.length,
      customersCount: totalCustomers.length,
      totalBookingsCount: totalBookings.length,
      completedBookingsCount: completedBookings.length,
      confirmedBookingsCount: confirmedBookings.length,
      pendingBookingsCount: pendingBookings.length,
      cancelledBookingsCount: cancelledBookings.length,
      totalRevenue,
      categoryCounts,
    };
  }
}

export const db = new Database();
