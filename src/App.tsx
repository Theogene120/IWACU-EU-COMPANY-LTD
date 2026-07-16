import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider, useShop } from './context/ProductContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { Toaster } from 'sonner';
import PageTracker from './components/PageTracker';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';

// Layouts
import UserLayout from './components/UserLayout';

// User-facing pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import About from './pages/About';
import Delivery from './pages/Delivery';
import OrderTracking from './pages/OrderTracking';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Account from './pages/Account';

// Admin pages (no user layout)
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function AppRoutes() {
  const { isLoading } = useShop();

  if (isLoading) return <LoadingScreen />;

  return (
    <Router>
      <PageTracker />
      <ScrollToTop />
      <Toaster position="top-right" richColors />
      <Routes>

        {/* ── User-facing pages ─────────────────────────────────
            All wrapped in UserLayout which renders:
            Navbar → page content → Footer + floating buttons      */}
        <Route element={<UserLayout />}>
          <Route path="/"               element={<Home />} />
          <Route path="/shop"           element={<Shop />} />
          <Route path="/product/:id"    element={<ProductDetail />} />
          <Route path="/cart"           element={<Cart />} />
          <Route path="/checkout"       element={<Checkout />} />
          <Route path="/contact"        element={<Contact />} />
          <Route path="/about"          element={<About />} />
          <Route path="/delivery"       element={<Delivery />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/account"        element={<Account />} />
          <Route path="/privacy"        element={<PrivacyPolicy />} />
          <Route path="/terms"          element={<Terms />} />
        </Route>

        {/* ── Admin pages ───────────────────────────────────────
            Completely independent — no user Navbar or Footer.
            AdminDashboard contains its own AdminNavbar + sidebar. */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin"       element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AuthProvider>
          <ShopProvider>
            <AppRoutes />
          </ShopProvider>
        </AuthProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}
