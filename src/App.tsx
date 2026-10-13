import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { StickyAddToCartBar } from './components/StickyAddToCartBar';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

const AppContent: React.FC = () => {
  const { currentRoute, routeParams } = useApp();

  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductDetailsPage slug={routeParams.slug || ''} />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmed':
        return <OrderConfirmationPage orderId={routeParams.orderId || ''} />;
      case 'track-order':
        return <OrderTrackingPage />;
      case 'admin':
        return <AdminDashboard />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F3EFEA] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Content View */}
      <main className="flex-1 w-full pb-28 md:pb-0">
        {renderCurrentView()}
      </main>

      {/* Floating Concierge WhatsApp */}
      <FloatingWhatsApp />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Quick Search Modal */}
      <SearchModal />

      {/* Mobile Sticky Add to Cart Bar */}
      <StickyAddToCartBar />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
