import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Calendar, DollarSign, Bell, Plus, Check, Ban, X, Trash2, Edit, AlertCircle, BarChart3, TrendingUp, Sparkles, Lock, Mail, ArrowRight, FileText, Search } from 'lucide-react';
import { UserAccount, BookingItem, ServiceItem, AdminStats, NotificationItem } from '../../types.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { BookingSlip } from '../BookingSlip.tsx';

interface AdminSecretPanelProps {
  services: ServiceItem[];
  onRefreshServices: () => void;
}

export const AdminSecretPanel: React.FC<AdminSecretPanelProps> = ({
  services,
  onRefreshServices,
}) => {
  const { user, token, login, logout, t, language } = useAuth();
  const { showToast } = useToast();

  // Secret login state if not already logged in as admin
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin tabs: overview, artists, customers, bookings, services, notifications
  const [activeTab, setActiveTab] = useState<'overview' | 'artists' | 'bookings' | 'services' | 'notifications'>('overview');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);
  const [allBookings, setAllBookings] = useState<BookingItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBookingForSlip, setSelectedBookingForSlip] = useState<BookingItem | null>(null);
  const [serviceSearch, setServiceSearch] = useState('');

  // Add/Edit service modal state
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({
    nameEn: '',
    nameHi: '',
    category: 'makeup' as 'makeup' | 'hair' | 'skin' | 'nails' | 'packages',
    descriptionEn: '',
    descriptionHi: '',
    basePrice: 1999,
    durationMinutes: 60,
    image: '',
  });

  // Broadcast notification state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'info' | 'booking' | 'alert' | 'success'>('info');

  const isAdmin = user && user.role === 'admin';

  const fetchAdminData = async () => {
    if (!token || !isAdmin) return;
    setLoading(true);
    try {
      const [resStats, resUsers, resBookings, resNotifs] = await Promise.all([
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/notifications'),
      ]);

      if (resStats.ok) {
        const d = await resStats.json();
        setStats(d.stats);
      }
      if (resUsers.ok) {
        const d = await resUsers.json();
        setAllUsers(d.users || []);
      }
      if (resBookings.ok) {
        const d = await resBookings.json();
        setAllBookings(d.bookings || []);
      }
      if (resNotifs.ok) {
        const d = await resNotifs.json();
        setNotifications(d.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin, token]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const res = await login(adminEmail, adminPassword);
      if (res.success && res.user?.role === 'admin') {
        showToast('Authorized: Welcome to MS Makeup Artist Master Administration', 'success');
      } else {
        showToast(res.error || 'Access Denied: Invalid credentials or insufficient privileges', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUpdateArtistStatus = async (artistId: string, status: 'approved' | 'rejected' | 'blocked') => {
    try {
      const res = await fetch(`/api/admin/artists/${artistId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast(`Artist status updated to ${status}`, 'success');
        fetchAdminData();
      }
    } catch {
      showToast('Status update failed', 'error');
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingServiceId ? `/api/services/${editingServiceId}` : '/api/services';
      const method = editingServiceId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceForm),
      });

      if (res.ok) {
        showToast(editingServiceId ? 'Service updated successfully' : 'New service created', 'success');
        setServiceModalOpen(false);
        setEditingServiceId(null);
        onRefreshServices();
        fetchAdminData();
      } else {
        showToast('Service action failed', 'error');
      }
    } catch {
      showToast('Error saving service', 'error');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm('Delete this service from master rate list?')) return;
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('Service deleted', 'info');
        onRefreshServices();
        fetchAdminData();
      }
    } catch {
      showToast('Failed to delete service', 'error');
    }
  };

  const handleBroadcastNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: notifTitle,
          message: notifMessage,
          type: notifType,
          targetRole: 'all',
        }),
      });
      if (res.ok) {
        showToast('Broadcast notification pushed to all users!', 'success');
        setNotifTitle('');
        setNotifMessage('');
        fetchAdminData();
      }
    } catch {
      showToast('Broadcast failed', 'error');
    }
  };

  // If not logged in as Admin, show secret admin login gate
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-neutral-950 text-white">
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl max-w-md w-full shadow-2xl relative space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white mx-auto shadow-lg">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
              MS Makeup Artist Admin Authentication
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Confidential internal gateway for MS Makeup Artist platform control
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="gkgmkg345@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                Admin Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl font-bold text-sm text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoggingIn ? 'Authenticating...' : 'Access Secret Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-neutral-500 text-center">
            Zero credentials transmitted in client bundles. Authenticated with salted bcrypt hashing.
          </p>
        </div>
      </div>
    );
  }

  const artists = allUsers.filter((u) => u.role === 'artist');
  const customers = allUsers.filter((u) => u.role === 'customer');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Admin Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              Super Admin Control
            </span>
            <span className="text-xs text-neutral-400">Authenticated via Secure JWT</span>
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-white mt-1">
            MS Makeup Artist Master Operations Panel
          </h1>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-300 transition-colors"
        >
          Exit Admin Console
        </button>
      </div>

      {/* Admin Nav Tabs */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
        {[
          { id: 'overview', label: 'Overview & Analytics', icon: BarChart3 },
          { id: 'artists', label: `Artists & Salons (${artists.length})`, icon: Users },
          { id: 'bookings', label: `All Bookings (${allBookings.length})`, icon: Calendar },
          { id: 'services', label: `Rate List & Services (${services.length})`, icon: DollarSign },
          { id: 'notifications', label: 'Broadcast Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                <span className="text-xs text-neutral-400 font-medium">Total Platform Volume</span>
                <h3 className="font-serif text-3xl font-extrabold text-amber-400 mt-2">
                  ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                  Completed & confirmed revenue
                </span>
              </div>

              <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                <span className="text-xs text-neutral-400 font-medium">Active Bookings</span>
                <h3 className="font-serif text-3xl font-extrabold text-white mt-2">
                  {stats?.totalBookingsCount || 0}
                </h3>
                <span className="text-[11px] text-neutral-400 block mt-1">
                  {stats?.confirmedBookingsCount || 0} confirmed, {stats?.pendingBookingsCount || 0} pending
                </span>
              </div>

              <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                <span className="text-xs text-neutral-400 font-medium">Registered Artists</span>
                <h3 className="font-serif text-3xl font-extrabold text-white mt-2">
                  {artists.length}
                </h3>
                <span className="text-[11px] text-amber-300 block mt-1">
                  {stats?.approvedArtistsCount || 0} approved for doorstep visits
                </span>
              </div>

              <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800">
                <span className="text-xs text-neutral-400 font-medium">Registered Clients</span>
                <h3 className="font-serif text-3xl font-extrabold text-white mt-2">
                  {customers.length}
                </h3>
                <span className="text-[11px] text-neutral-400 block mt-1">
                  Across 85+ Indian cities & districts
                </span>
              </div>
            </div>

            {/* Quick action cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800">
                <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Popular Demand by Category</span>
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats?.categoryCounts || {}).map(([cat, count]) => (
                    <div key={cat} className="flex items-center justify-between text-xs py-2 border-b border-neutral-800">
                      <span className="capitalize font-semibold text-neutral-300">{cat}</span>
                      <span className="font-bold text-amber-400">{count} bookings</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-900 p-6 rounded-3xl border border-neutral-800">
                <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-rose-400" />
                  <span>Recent Broadcasts & Alerts</span>
                </h3>
                <div className="space-y-3 max-h-56 overflow-y-auto">
                  {notifications.slice(0, 5).map((n) => (
                    <div key={n.id} className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/50 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-white">{n.title}</span>
                        <span className="text-[10px] text-neutral-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-neutral-300 text-[11px]">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ARTISTS MANAGEMENT TAB */}
        {activeTab === 'artists' && (
          <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 space-y-4">
            <h2 className="font-serif text-xl font-bold text-white mb-4">
              Artists & Beauty Salons ({artists.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-800/80 text-neutral-400 uppercase font-bold tracking-wider border-b border-neutral-700">
                    <th className="py-3 px-4">Artist / Parlour</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Exp & Rating</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {artists.map((artist) => (
                    <tr key={artist.id} className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={artist.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{artist.name}</p>
                            <p className="text-[11px] text-amber-300">{artist.shopName || 'Freelance MUA'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        <p>{artist.phone}</p>
                        <p className="text-[10px] text-neutral-500">{artist.email}</p>
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        {artist.district}, {artist.state}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-amber-400 font-bold">{artist.rating || 4.9}★</span>
                        <span className="text-neutral-500 text-[10px] ml-1">({artist.experienceYears || 5} yrs)</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            artist.approvalStatus === 'approved'
                              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                              : artist.approvalStatus === 'blocked'
                              ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
                              : 'bg-amber-900/60 text-amber-300 border border-amber-700'
                          }`}
                        >
                          {artist.approvalStatus || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {artist.approvalStatus !== 'approved' && (
                          <button
                            onClick={() => handleUpdateArtistStatus(artist.id, 'approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                          >
                            Approve
                          </button>
                        )}
                        {artist.approvalStatus !== 'blocked' && (
                          <button
                            onClick={() => handleUpdateArtistStatus(artist.id, 'blocked')}
                            className="px-2.5 py-1 rounded-lg bg-rose-900 hover:bg-rose-800 text-rose-200 font-bold border border-rose-700"
                          >
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BOOKINGS MANAGEMENT TAB */}
        {activeTab === 'bookings' && (
          <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 space-y-4">
            <h2 className="font-serif text-xl font-bold text-white mb-4">
              All Customer Appointments ({allBookings.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-800/80 text-neutral-400 uppercase font-bold tracking-wider border-b border-neutral-700">
                    <th className="py-3 px-4">Ref #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Artist Assigned</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Slot</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {allBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-mono text-amber-300 font-bold">{b.bookingNumber}</td>
                      <td className="py-3 px-4 text-white">
                        <p className="font-bold">{b.customerName}</p>
                        <p className="text-[10px] text-neutral-400">{b.customerPhone}</p>
                      </td>
                      <td className="py-3 px-4 text-neutral-300">{b.artistName}</td>
                      <td className="py-3 px-4 font-medium text-white">{b.serviceName}</td>
                      <td className="py-3 px-4 text-neutral-300">
                        {b.date} ({b.timeSlot})
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            b.status === 'completed'
                              ? 'bg-emerald-900/60 text-emerald-300'
                              : b.status === 'confirmed'
                              ? 'bg-blue-900/60 text-blue-300'
                              : b.status === 'cancelled'
                              ? 'bg-neutral-800 text-neutral-400'
                              : 'bg-amber-900/60 text-amber-300'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedBookingForSlip(b)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-amber-400 hover:text-neutral-950 text-amber-300 border border-neutral-700 text-[11px] font-bold flex items-center gap-1 transition-all"
                          title="View / Print Official Booking Slip"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Slip</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SERVICES MANAGEMENT & RATE LIST TAB */}
        {activeTab === 'services' && (
          <div className="bg-neutral-900 rounded-3xl p-6 border border-neutral-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-amber-400" />
                  <span>Master Services & Rate List ({services.length})</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Admin Master Control: Edit base rates, names, categories, or add/delete any beauty service.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingServiceId(null);
                  setServiceForm({
                    nameEn: '',
                    nameHi: '',
                    category: 'makeup',
                    descriptionEn: '',
                    descriptionHi: '',
                    basePrice: 1999,
                    durationMinutes: 60,
                    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
                  });
                  setServiceModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-md shadow-amber-400/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service (नया काम जोड़ें)</span>
              </button>
            </div>

            {/* Filter and search */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="Search service name or rate..."
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services
                .filter(
                  (srv) =>
                    !serviceSearch ||
                    srv.nameEn.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                    srv.nameHi.includes(serviceSearch) ||
                    String(srv.basePrice).includes(serviceSearch)
                )
                .map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-neutral-800/80 p-4 rounded-2xl border border-neutral-700/60 flex flex-col justify-between gap-3 hover:border-amber-400/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={srv.image}
                        alt={srv.nameEn}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-neutral-700"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-neutral-700/60 text-amber-300 inline-block mb-1">
                          {srv.category}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-white truncate">{srv.nameEn}</h4>
                        <p className="text-[11px] text-amber-300 truncate">{srv.nameHi}</p>
                        <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                          {srv.descriptionEn}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-700/50">
                      <div>
                        <span className="text-[10px] text-neutral-400 block">Current Base Rate</span>
                        <span className="font-serif font-extrabold text-lg text-amber-400">
                          ₹{srv.basePrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingServiceId(srv.id);
                            setServiceForm({
                              nameEn: srv.nameEn,
                              nameHi: srv.nameHi,
                              category: srv.category,
                              descriptionEn: srv.descriptionEn,
                              descriptionHi: srv.descriptionHi,
                              basePrice: srv.basePrice,
                              durationMinutes: srv.durationMinutes,
                              image: srv.image,
                            });
                            setServiceModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-neutral-950 font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Rate</span>
                        </button>
                        <button
                          onClick={() => handleDeleteService(srv.id)}
                          className="p-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-900 text-rose-300 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-800 max-w-2xl mx-auto space-y-6">
            <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400" />
              <span>Broadcast Notice to All Users & Artists</span>
            </h2>

            <form onSubmit={handleBroadcastNotification} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Notification Title *
                </label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="e.g. Wedding Season 20% Cashback Offer"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Message Details *
                </label>
                <textarea
                  rows={3}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="Enter message details that will appear across customer and artist dashboard banners..."
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Notice Type
                  </label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white"
                  >
                    <option value="info">Information (Blue)</option>
                    <option value="success">Success / Offer (Green)</option>
                    <option value="alert">Alert / Advisory (Red)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
              >
                Broadcast Notice Now
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Add / Edit Service Modal */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-3xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
              <h3 className="font-serif text-lg font-bold text-white">
                {editingServiceId ? 'Edit Beauty Service' : 'Add New Service (Har Kaam)'}
              </h3>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Name (English)</label>
                <input
                  type="text"
                  value={serviceForm.nameEn}
                  onChange={(e) => setServiceForm({ ...serviceForm, nameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Name (Hindi)</label>
                <input
                  type="text"
                  value={serviceForm.nameHi}
                  onChange={(e) => setServiceForm({ ...serviceForm, nameHi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Category</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                  >
                    <option value="makeup">Makeup</option>
                    <option value="hair">Hair</option>
                    <option value="skin">Skin</option>
                    <option value="nails">Nails</option>
                    <option value="packages">Packages</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={serviceForm.basePrice}
                    onChange={(e) => setServiceForm({ ...serviceForm, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={serviceForm.image}
                  onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={serviceForm.descriptionEn}
                  onChange={(e) => setServiceForm({ ...serviceForm, descriptionEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-bold hover:bg-amber-300"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Slip Modal */}
      {selectedBookingForSlip && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
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
