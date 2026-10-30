import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ToastProvider, useToast } from './context/ToastContext.tsx';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { StatsSection } from './components/StatsSection.tsx';
import { HowItWorks } from './components/HowItWorks.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { RateListSection } from './components/RateListSection.tsx';
import { ArtistSearchSection } from './components/ArtistSearchSection.tsx';
import { ArtistProfileModal } from './components/ArtistProfileModal.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { TestimonialsSection } from './components/TestimonialsSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CustomerDashboard } from './components/dashboards/CustomerDashboard.tsx';
import { ArtistDashboard } from './components/dashboards/ArtistDashboard.tsx';
import { AdminSecretPanel } from './components/admin/AdminSecretPanel.tsx';
import { ServiceItem, UserAccount, ReviewItem } from './types.ts';

function MainApp() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [artists, setArtists] = useState<UserAccount[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState<'customer' | 'artist' | 'admin'>('customer');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  const [selectedArtistForProfile, setSelectedArtistForProfile] = useState<UserAccount | null>(null);
  const [bookingArtist, setBookingArtist] = useState<UserAccount | null>(null);
  const [bookingServiceId, setBookingServiceId] = useState<string | null>(null);

  // Secret Admin Route Detection (/admin-secret-panel or #admin-secret-panel)
  const [isAdminSecretRoute, setIsAdminSecretRoute] = useState<boolean>(() => {
    return (
      window.location.pathname.includes('/admin-secret-panel') ||
      window.location.hash.includes('admin-secret-panel')
    );
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const isSecret =
        window.location.pathname.includes('/admin-secret-panel') ||
        window.location.hash.includes('admin-secret-panel');
      setIsAdminSecretRoute(isSecret);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [resServices, resArtists, resReviews] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/artists'),
        fetch('/api/reviews'),
      ]);

      if (resServices.ok) {
        const d = await resServices.json();
        setServices(d.services || []);
      }
      if (resArtists.ok) {
        const d = await resArtists.json();
        setArtists(d.artists || []);
      }
      if (resReviews.ok) {
        const d = await resReviews.json();
        setReviews(d.reviews || []);
      }
    } catch (err) {
      console.warn('Initial data load notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenBooking = (artist?: UserAccount, serviceId?: string) => {
    setBookingArtist(artist || null);
    setBookingServiceId(serviceId || null);
    setBookingModalOpen(true);
  };

  const handleOpenAuth = (role: 'customer' | 'artist' | 'admin' = 'customer', mode: 'login' | 'register' = 'login') => {
    setAuthInitialRole(role);
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  // If secret admin route is requested, render Admin Secret Panel directly!
  if (isAdminSecretRoute || activeTab === 'admin-panel') {
    return (
      <div className="min-h-screen bg-neutral-950 font-sans">
        <AdminSecretPanel services={services} onRefreshServices={fetchData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFB] text-neutral-800 font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAuth={handleOpenAuth}
      />

      <main className="flex-1">
        {/* Conditional Tab Views or Landing Page */}
        {activeTab === 'customer-dashboard' ? (
          <CustomerDashboard
            onBookNewService={() => handleOpenBooking()}
            onExploreArtists={() => {
              setActiveTab('artists');
              const el = document.getElementById('artists');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        ) : activeTab === 'artist-dashboard' ? (
          <ArtistDashboard services={services} />
        ) : (
          /* Normal Multi-section Landing / Flow */
          <>
            <Hero
              onOpenBooking={() => handleOpenBooking()}
              onExploreServices={() => {
                setActiveTab('services');
                const el = document.getElementById('services');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onJoinArtist={() => handleOpenAuth('artist', 'register')}
            />

            <StatsSection />

            <HowItWorks onOpenBooking={() => handleOpenBooking()} />

            <ServicesSection
              services={services}
              onSelectServiceForBooking={(srv) => handleOpenBooking(undefined, srv.id)}
              onViewRateList={() => {
                setActiveTab('rate-list');
                const el = document.getElementById('rate-list');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <RateListSection
              services={services}
              onSelectServiceForBooking={(srv) => handleOpenBooking(undefined, srv.id)}
            />

            <ArtistSearchSection
              artists={artists}
              services={services}
              onSelectArtistProfile={(artist) => setSelectedArtistForProfile(artist)}
              onBookArtist={(artist) => handleOpenBooking(artist)}
            />

            <GallerySection />

            <TestimonialsSection />

            <ContactSection />
          </>
        )}
      </main>

      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          const el = document.getElementById(tab);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Floating WhatsApp Quick Action */}
      <FloatingWhatsApp />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        artists={artists}
        services={services}
        preselectedArtist={bookingArtist}
        preselectedServiceId={bookingServiceId}
        onOpenAuth={handleOpenAuth}
        onBookingSuccess={() => {
          fetchData();
        }}
      />

      {/* Artist Profile Modal */}
      <ArtistProfileModal
        artist={selectedArtistForProfile}
        services={services}
        reviews={reviews}
        onClose={() => setSelectedArtistForProfile(null)}
        onBookNow={(artist, srvId) => {
          setSelectedArtistForProfile(null);
          handleOpenBooking(artist, srvId);
        }}
      />

      {/* Customer & Artist Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authInitialRole}
        initialMode={authInitialMode}
        services={services}
        onSuccessRedirect={(userRole) => {
          if (userRole === 'artist') setActiveTab('artist-dashboard');
          else if (userRole === 'customer') setActiveTab('customer-dashboard');
          else if (userRole === 'admin') setActiveTab('admin-panel');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}
