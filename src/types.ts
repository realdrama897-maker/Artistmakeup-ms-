export type Language = 'en' | 'hi';

export type UserRole = 'customer' | 'artist' | 'admin';

export interface ServiceItem {
  id: string;
  nameEn: string;
  nameHi: string;
  category: 'makeup' | 'hair' | 'skin' | 'nails' | 'packages';
  descriptionEn: string;
  descriptionHi: string;
  basePrice: number;
  durationMinutes: number;
  image: string;
  popular?: boolean;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  // Artist fields
  shopName?: string;
  whatsapp?: string;
  address?: string;
  state?: string;
  district?: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  bioHi?: string;
  experienceYears?: number;
  isAvailable?: boolean;
  approvalStatus?: 'approved' | 'pending' | 'rejected' | 'blocked';
  rating?: number;
  reviewCount?: number;
  startingPrice?: number;
  portfolio?: string[];
  servicesOffered?: { serviceId: string; customPrice: number }[];
  instagramHandle?: string;
}

export interface BookingItem {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  artistId: string;
  artistName: string;
  artistPhone: string;
  serviceId: string;
  serviceName: string;
  serviceImage?: string;
  artistAvatar?: string;
  date: string;
  timeSlot: string;
  address: string;
  state: string;
  district: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  artistId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  serviceName: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'booking' | 'alert' | 'success';
  createdAt: string;
  targetRole?: 'all' | 'customer' | 'artist';
}

export interface AdminStats {
  artistsCount: number;
  approvedArtistsCount: number;
  pendingArtistsCount: number;
  customersCount: number;
  totalBookingsCount: number;
  completedBookingsCount: number;
  confirmedBookingsCount: number;
  pendingBookingsCount: number;
  cancelledBookingsCount: number;
  totalRevenue: number;
  categoryCounts: Record<string, number>;
}
