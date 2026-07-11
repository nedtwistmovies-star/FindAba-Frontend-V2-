import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import { useOrderStore } from './store/useOrderStore';
import { useTransportStore } from './store/useTransportStore';
import { TopNavigation } from './components/layout/TopNavigation';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { AiAssistantDrawer } from './components/ai/AiAssistantDrawer';

// Pages
import { WelcomePage } from './pages/WelcomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { SearchPage } from './pages/SearchPage';
import { BusinessProfilePage } from './pages/BusinessProfilePage';
import { CommunityPage } from './pages/CommunityPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { WalletPage } from './pages/WalletPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { MessagesPage } from './pages/MessagesPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { BusinessRegistrationWizardPage } from './pages/BusinessRegistrationWizardPage';
import { BusinessOwnerPortalPage } from './pages/BusinessOwnerPortalPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { SellerOrdersPage } from './pages/SellerOrdersPage';
import { TransportPage } from './pages/TransportPage';
import { LogisticsPage } from './pages/LogisticsPage';
import { TripTrackingPage } from './pages/TripTrackingPage';
import { DriverDashboardPage } from './pages/DriverDashboardPage';
import { LogisticsDashboardPage } from './pages/LogisticsDashboardPage';
import { HospitalityPage } from './pages/HospitalityPage';
import { HotelDetailPage } from './pages/HotelDetailPage';
import { BookingWizard } from './pages/BookingWizard';
import { ManageBookingsPage } from './pages/ManageBookingsPage';
import { PropertyOwnerDashboard } from './pages/PropertyOwnerDashboard';
import { TourismPage } from './pages/TourismPage';
import { EventsPage } from './pages/EventsPage';
import { MaziKaluPage } from './pages/MaziKaluPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminBusinesses } from './pages/admin/AdminBusinesses';
import { AdminFinances } from './pages/admin/AdminFinances';
import { AdminAlerts } from './pages/admin/AdminAlerts';
import { AdminModeration } from './pages/admin/AdminModeration';
import { AdminAudit } from './pages/admin/AdminAudit';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminMarketplace } from './pages/admin/AdminMarketplace';
import { AdminTransport } from './pages/admin/AdminTransport';
import { AdminHotels } from './pages/admin/AdminHotels';
import { AdminCommunity } from './pages/admin/AdminCommunity';
import { AdminAI } from './pages/admin/AdminAI';
import { AdminSettings } from './pages/admin/AdminSettings';

import { ErrorBoundary } from './components/common/ErrorBoundary';

import { motion, AnimatePresence } from 'motion/react';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAiDrawerOpen } = useStore();
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
        <TopNavigation />
        <div className="flex-1 flex max-w-7xl mx-auto w-full">
          <Sidebar />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 overflow-x-hidden">
            {children}
          </main>
        </div>
        <BottomNavigation />
        <AnimatePresence>
          {isAiDrawerOpen && <AiAssistantDrawer />}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
};

export default function App() {
  const { theme, checkSession, user, isAuthenticated, fetchWalletData, fetchNotifications, isCheckingSession } = useStore();
  const { fetchOrders } = useOrderStore();
  const { fetchUserTransportData } = useTransportStore();

  React.useEffect(() => {
    checkSession();
  }, [checkSession]);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders(user.id);
      fetchUserTransportData(user.id);
      fetchWalletData(user.id);
      fetchNotifications(user.id);
    }
  }, [isAuthenticated, user, fetchOrders, fetchUserTransportData, fetchWalletData, fetchNotifications]);

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (isCheckingSession) {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center z-50">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-[#0B7A3B] to-emerald-400 flex items-center justify-center font-black text-zinc-950 text-4xl shadow-2xl shadow-emerald-500/20 mb-8"
        >
          FA
        </motion.div>
        <div className="w-48 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-full h-full bg-[#0B7A3B]"
          />
        </div>
        <p className="mt-6 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">Initializing FindAba OS</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public & Auth Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* App OS Routes wrapped in AppLayout */}
        <Route path="/home" element={<AppLayout><HomePage /></AppLayout>} />
        <Route path="/discover" element={<AppLayout><DiscoverPage /></AppLayout>} />
        <Route path="/search" element={<AppLayout><SearchPage /></AppLayout>} />
        <Route path="/business/:id" element={<AppLayout><BusinessProfilePage /></AppLayout>} />
        <Route path="/community" element={<AppLayout><CommunityPage /></AppLayout>} />
        <Route path="/marketplace" element={<AppLayout><MarketplacePage /></AppLayout>} />
        <Route path="/wallet" element={<AppLayout><WalletPage /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
        <Route path="/notifications" element={<AppLayout><NotificationsPage /></AppLayout>} />
        <Route path="/messages" element={<AppLayout><MessagesPage /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/businesses" element={<AdminBusinesses />} />
        <Route path="/admin/marketplace" element={<AdminMarketplace />} />
        <Route path="/admin/transport" element={<AdminTransport />} />
        <Route path="/admin/hotels" element={<AdminHotels />} />
        <Route path="/admin/community" element={<AdminCommunity />} />
        <Route path="/admin/ai" element={<AdminAI />} />
        <Route path="/admin/finances" element={<AdminFinances />} />
        <Route path="/admin/moderation" element={<AdminModeration />} />
        <Route path="/admin/alerts" element={<AdminAlerts />} />
        <Route path="/admin/audit" element={<AdminAudit />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/register-business" element={<BusinessRegistrationWizardPage />} />
        <Route path="/business-dashboard" element={<BusinessOwnerPortalPage />} />
        <Route path="/checkout" element={<AppLayout><CheckoutPage /></AppLayout>} />
        <Route path="/orders" element={<AppLayout><OrdersPage /></AppLayout>} />
        <Route path="/seller/orders" element={<AppLayout><SellerOrdersPage /></AppLayout>} />
        <Route path="/transport" element={<AppLayout><TransportPage /></AppLayout>} />
        <Route path="/logistics" element={<AppLayout><LogisticsPage /></AppLayout>} />
        <Route path="/transport/tracking/:id" element={<AppLayout><TripTrackingPage /></AppLayout>} />
        <Route path="/driver/dashboard" element={<AppLayout><DriverDashboardPage /></AppLayout>} />
        <Route path="/logistics/dashboard" element={<AppLayout><LogisticsDashboardPage /></AppLayout>} />
        <Route path="/hospitality" element={<AppLayout><HospitalityPage /></AppLayout>} />
        <Route path="/hospitality/:id" element={<AppLayout><HotelDetailPage /></AppLayout>} />
        <Route path="/hospitality/book/:hotelId/:roomId" element={<AppLayout><BookingWizard /></AppLayout>} />
        <Route path="/hospitality/bookings" element={<AppLayout><ManageBookingsPage /></AppLayout>} />
        <Route path="/hospitality/dashboard" element={<AppLayout><PropertyOwnerDashboard /></AppLayout>} />
        <Route path="/tourism" element={<AppLayout><TourismPage /></AppLayout>} />
        <Route path="/events" element={<AppLayout><EventsPage /></AppLayout>} />
        <Route path="/mazi-kalu" element={<AppLayout><MaziKaluPage /></AppLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
