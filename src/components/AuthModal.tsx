import React, { useState, useEffect } from 'react';
import { X, User, Lock, Mail, Phone, MapPin, Store, Sparkles, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { INDIAN_STATES_DISTRICTS } from '../data/locations.ts';
import { ServiceItem } from '../types.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'customer' | 'artist' | 'admin';
  initialMode?: 'login' | 'register';
  services: ServiceItem[];
  onSuccessRedirect?: (role: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'customer',
  initialMode = 'login',
  services,
  onSuccessRedirect,
}) => {
  const { login, register, t, language } = useAuth();
  const { showToast } = useToast();

  const [role, setRole] = useState<'customer' | 'artist' | 'admin'>(initialRole);
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Artist specific fields
  const [shopName, setShopName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('Delhi NCR');
  const [district, setDistrict] = useState('South Delhi');
  const [experienceYears, setExperienceYears] = useState(3);
  const [startingPrice, setStartingPrice] = useState(1499);
  const [bio, setBio] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([
    'srv-bridal',
    'srv-party',
  ]);

  // Admin specific fields
  const [adminSecurityKey, setAdminSecurityKey] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRole(initialRole);
    setMode(initialMode);
  }, [initialRole, initialMode, isOpen]);

  if (!isOpen) return null;

  const currentDistricts =
    INDIAN_STATES_DISTRICTS.find((s) => s.state === state)?.districts || [];

  const handleServiceToggle = (srvId: string) => {
    if (selectedServiceIds.includes(srvId)) {
      setSelectedServiceIds(selectedServiceIds.filter((id) => id !== srvId));
    } else {
      setSelectedServiceIds([...selectedServiceIds, srvId]);
    }
  };

  const handleFillAdminDemo = () => {
    setEmail('gkgmkg345@gmail.com');
    setPassword('Manish@35');
    showToast('Admin credentials filled!', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success && res.user) {
          showToast(`Welcome back, ${res.user.name}!`, 'success');
          onClose();
          if (onSuccessRedirect) onSuccessRedirect(res.user.role);
        } else {
          showToast(res.error || 'Login failed', 'error');
        }
      } else {
        // Register flow for Customer, Artist, or Admin
        const servicesOffered = selectedServiceIds.map((id) => {
          const s = services.find((item) => item.id === id);
          return { serviceId: id, customPrice: s?.basePrice || 1499 };
        });

        const payload: any = {
          name: name || (role === 'admin' ? 'Master Admin' : 'User'),
          email,
          password,
          phone: phone || '+91 99999 88888',
          role,
        };

        if (role === 'artist') {
          payload.shopName = shopName || `${name} Makeovers`;
          payload.whatsapp = whatsapp || phone;
          payload.address = address;
          payload.state = state;
          payload.district = district;
          payload.experienceYears = Number(experienceYears);
          payload.startingPrice = Number(startingPrice);
          payload.bio = bio;
          payload.servicesOffered = servicesOffered;
        }

        if (role === 'admin') {
          payload.adminSecurityKey = adminSecurityKey;
        }

        const res = await register(payload);
        if (res.success && res.user) {
          showToast(
            role === 'admin'
              ? 'Administrator account initialized successfully!'
              : role === 'artist'
              ? 'Artist parlour account created! You can now accept client bookings.'
              : 'Customer account created! Welcome to MS Makeup Artist.',
            'success'
          );
          onClose();
          if (onSuccessRedirect) onSuccessRedirect(res.user.role);
        } else {
          showToast(res.error || 'Registration failed', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-rose-100 relative">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-rose-100 flex items-center justify-between z-10">
          <div>
            <h2 className="font-serif text-xl font-bold text-neutral-900">
              {mode === 'login' ? t.loginTitle : t.registerTitle}
            </h2>
            <p className="text-xs text-rose-700 font-medium">
              {role === 'admin'
                ? (language === 'hi' ? 'एडमिन पोर्टल (Master Control)' : 'Administrator Master Portal')
                : role === 'artist'
                ? (language === 'hi' ? 'ब्यूटी आर्टिस्ट व पार्लर पोर्टल' : 'Beauty Artist / Parlour Partner')
                : (language === 'hi' ? 'ग्राहक पोर्टल (Doorstep Booking)' : 'Customer Portal (Home Booking)')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-rose-50 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 ROLE SELECTOR TABS (Customer, Artist, Admin) */}
        <div className="px-6 pt-5">
          <div className="text-center mb-2">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              {language === 'hi' ? '3 लॉगिन / साइन अप विकल्प:' : 'Select Account Type:'}
            </span>
          </div>

          <div className="grid grid-cols-3 p-1.5 bg-rose-50/80 rounded-2xl border border-rose-100 gap-1">
            {/* 1. Customer */}
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                role === 'customer'
                  ? 'bg-white text-rose-900 shadow-md scale-102 border border-rose-100'
                  : 'text-neutral-600 hover:text-rose-700'
              }`}
            >
              <User className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{language === 'hi' ? '1. ग्राहक (User)' : '1. Customer'}</span>
            </button>

            {/* 2. Artist */}
            <button
              type="button"
              onClick={() => setRole('artist')}
              className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                role === 'artist'
                  ? 'bg-white text-amber-900 shadow-md scale-102 border border-amber-100'
                  : 'text-neutral-600 hover:text-amber-800'
              }`}
            >
              <Store className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{language === 'hi' ? '2. आर्टिस्ट' : '2. Artist'}</span>
            </button>

            {/* 3. Admin */}
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                role === 'admin'
                  ? 'bg-neutral-900 text-amber-300 shadow-md scale-102'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{language === 'hi' ? '3. एडमिन' : '3. Admin'}</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Admin Helper Hint */}
          {role === 'admin' && (
            <div className="p-3.5 rounded-2xl bg-neutral-900 text-neutral-200 border border-neutral-800 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {language === 'hi'
                    ? 'एडमिन मास्टर क्रेडेंशियल्स उपलब्ध हैं'
                    : 'Master Admin Access Panel'}
                </span>
              </div>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={handleFillAdminDemo}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 text-neutral-950 font-bold text-[10px] hover:bg-amber-300"
                >
                  {language === 'hi' ? 'ऑटो भरें' : 'Fill Master Admin'}
                </button>
              )}
            </div>
          )}

          {mode === 'register' && (
            <>
              {/* Name field */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {t.nameLabel} *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    role === 'admin'
                      ? 'Administrator Name'
                      : role === 'artist'
                      ? 'e.g. Priya Sharma'
                      : 'e.g. Pooja Gupta'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-rose-200 text-sm focus:ring-2 focus:ring-rose-500/20"
                  required
                />
              </div>

              {/* Phone field */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {t.phoneLabel} *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-rose-200 text-sm focus:ring-2 focus:ring-rose-500/20"
                  required
                />
              </div>

              {/* Artist additional fields */}
              {role === 'artist' && (
                <div className="space-y-4 pt-2 border-t border-rose-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        {t.shopNameLabel} *
                      </label>
                      <input
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="e.g. Glamour Queen Parlour"
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        {t.whatsappLabel} *
                      </label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* State & District dynamic dropdowns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        {t.stateLabel} *
                      </label>
                      <select
                        value={state}
                        onChange={(e) => {
                          setState(e.target.value);
                          const firstD = INDIAN_STATES_DISTRICTS.find(
                            (s) => s.state === e.target.value
                          )?.districts[0];
                          if (firstD) setDistrict(firstD);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-xs sm:text-sm font-medium"
                      >
                        {INDIAN_STATES_DISTRICTS.map((s) => (
                          <option key={s.state} value={s.state}>
                            {s.state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        {t.districtLabel} *
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-xs sm:text-sm font-medium"
                      >
                        {currentDistricts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      {t.fullAddressLabel} *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Shop/Studio address, Market area, Landmark"
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        {t.experienceLabel}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        {language === 'hi' ? 'शुरुआती रेट (₹)' : 'Starting Rate (₹)'}
                      </label>
                      <input
                        type="number"
                        min="299"
                        max="50000"
                        value={startingPrice}
                        onChange={(e) => setStartingPrice(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      {t.bioLabel}
                    </label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Bridal specialist, 500+ happy clients, certified by VLCC..."
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-rose-200 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Services offered checkboxes */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-2">
                      {language === 'hi' ? 'आप कौन-सी सेवाएं प्रदान करते हैं?' : 'Services you offer at doorstep:'}
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-neutral-50 rounded-xl border border-rose-100 text-xs">
                      {services.map((srv) => (
                        <label
                          key={srv.id}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={selectedServiceIds.includes(srv.id)}
                            onChange={() => handleServiceToggle(srv.id)}
                            className="rounded accent-rose-600"
                          />
                          <span className="truncate">
                            {language === 'hi' ? srv.nameHi : srv.nameEn}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Admin specific sign up key */}
              {role === 'admin' && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Admin Authorization Passkey (Optional)
                  </label>
                  <input
                    type="text"
                    value={adminSecurityKey}
                    onChange={(e) => setAdminSecurityKey(e.target.value)}
                    placeholder="Enter admin passkey (e.g. Manish@35 or leave blank for root)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-sm"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {t.emailLabel} *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-rose-200 text-sm focus:ring-2 focus:ring-rose-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {t.passwordLabel} *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-rose-200 text-sm focus:ring-2 focus:ring-rose-500/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-bold text-sm shadow-md active:scale-98 transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2 ${
              role === 'admin'
                ? 'bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-neutral-700'
                : 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white shadow-rose-600/25'
            }`}
          >
            <span>
              {isLoading
                ? 'Processing...'
                : mode === 'login'
                ? `${t.submitLogin} (${role === 'admin' ? 'Admin' : role === 'artist' ? 'Artist' : 'User'})`
                : `${t.submitRegister} (${role === 'admin' ? 'Admin' : role === 'artist' ? 'Artist' : 'User'})`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer switch between login & signup */}
        <div className="px-6 py-4 bg-rose-50/50 border-t border-rose-100 text-center text-xs text-neutral-600">
          {mode === 'login' ? (
            <p>
              {t.noAccount}{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-rose-700 hover:underline"
              >
                {language === 'hi' ? 'साइन अप करें (Sign Up Here)' : 'Sign Up Here'}
              </button>
            </p>
          ) : (
            <p>
              {t.alreadyAccount}{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-rose-700 hover:underline"
              >
                {language === 'hi' ? 'लॉगिन करें (Login Here)' : 'Login Here'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
