import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import FloatingActions from './components/FloatingActions';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import { HomeSkeleton } from './components/LoadingSkeleton';
import Navbar from './components/Navbar';
import QuickViewModal from './components/QuickViewModal';
import SearchModal from './components/SearchModal';
import StoreOverlays from './components/StoreOverlays';
import CartDrawer from './components/layout/CartDrawer';
import MobileDock from './components/layout/MobileDock';
import { useStore } from './context/StoreContext';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const AccountPage = lazy(() => import('./pages/account/AccountPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  const { trackEvent } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent({
      type: 'page_view',
      path: pathname,
      sessionId: 'sayan-trendz-web',
    });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-luxe-ivory font-body text-luxe-charcoal">
      <ScrollToTop />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-12%] top-0 h-80 w-80 rounded-full bg-luxe-blush/50 blur-3xl" />
        <div className="absolute right-[-8%] top-1/3 h-96 w-96 rounded-full bg-luxe-sand/50 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-white/60 blur-3xl" />
      </div>

      <AnnouncementBar />
      <Navbar />

      <Suspense fallback={<HomeSkeleton />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>

      <Footer />
      <CartDrawer />
      <FloatingActions />
      <MobileDock />
      <QuickViewModal />
      <LoginModal />
      <SearchModal />
      <StoreOverlays />
    </div>
  );
}
