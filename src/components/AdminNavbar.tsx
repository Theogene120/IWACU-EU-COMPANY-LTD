import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Search, Shield, Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useShop } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_NAME } from '../constants';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'orders'
  | 'profit'
  | 'employees'
  | 'expenses'
  | 'analytics'
  | 'site-content'
  | 'messages'
  | 'settings';

interface AdminNavbarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

const adminTabs: { id: AdminTab; label: string }[] = [
  { id: 'overview',     label: 'Overview'     },
  { id: 'products',     label: 'Products'     },
  { id: 'orders',       label: 'Orders'       },
  { id: 'profit',       label: 'Profit'       },
  { id: 'employees',    label: 'Employees'    },
  { id: 'expenses',     label: 'Other Expenses' },
  { id: 'analytics',    label: 'Analytics'    },
  { id: 'site-content', label: 'Site Content' },
  { id: 'messages',     label: 'Messages'     },
  { id: 'settings',     label: 'Settings'     },
];

const AdminNavbar = ({ activeTab, setActiveTab }: AdminNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  // language only used for announcement bar text — no switcher in admin
  const { language } = useLanguage();
  const { siteSettings } = useShop();
  const { logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  // Overview/Profit/Employees/Other Expenses surface company money data — hidden from regular admins.
  const visibleTabs = isSuperAdmin
    ? adminTabs
    : adminTabs.filter(tab => !['overview', 'profit', 'employees', 'expenses'].includes(tab.id));

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-green-600 text-white py-2 px-4 text-center text-sm font-bold shadow-inner">
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <Truck className="h-4 w-4 shrink-0" aria-hidden="true" />
            {language === 'rw'
              ? 'KUGURUKA NI UBUNTU MU RWANDA HOSE!'
              : language === 'fr'
              ? 'LIVRAISON GRATUITE PARTOUT AU RWANDA !'
              : 'FREE DELIVERY ANYWHERE IN RWANDA!'}
            <Truck className="h-4 w-4 shrink-0" aria-hidden="true" />
          </span>
        </motion.div>
      </div>

      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">

            {/* ── LEFT: Logo + Search icon (overlay, no layout shift) ── */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 mr-8">
                {siteSettings.logoUrl ? (
                  <img
                    src={siteSettings.logoUrl}
                    alt={BUSINESS_NAME}
                    className="h-10 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <>
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-blue-900 leading-tight hidden lg:block">
                      {BUSINESS_NAME}
                    </span>
                  </>
                )}
              </Link>

              {/* Search icon — input drops down absolutely, never shifts layout */}
              <div className="hidden md:block relative">
                <button
                  onClick={openSearch}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-xl hover:bg-gray-50"
                >
                  <Search className="h-5 w-5" />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <>
                      {/* Backdrop — closes search on outside click */}
                      <div
                        className="fixed inset-0 z-[55]"
                        onClick={closeSearch}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[60] p-3"
                      >
                        <div className="relative">
                          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
                          <input
                            ref={searchRef}
                            type="text"
                            placeholder="Search admin..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Escape') closeSearch(); }}
                            className="w-full pl-9 pr-9 py-2.5 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                          <button
                            onClick={closeSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── MIDDLE: Admin tab links ──────────────────────────── */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
              {visibleTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-blue-600 whitespace-nowrap px-1',
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5'
                      : 'text-gray-600'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── RIGHT: Admin label + Logout only (no lang/currency) ── */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Link to="/admin" className="text-sm font-medium text-blue-600 hover:underline">
                  Dashboard
                </Link>
                <button onClick={() => { logout(); navigate('/', { replace: true }); }} className="p-2 text-gray-600 hover:text-red-600">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* ── MOBILE: Hamburger only ───────────────────────────── */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ──────────────────────────────────────────── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">

                {/* Mobile Search */}
                <div className="px-3 py-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search admin..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Admin Tab Links */}
                {visibleTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setIsOpen(false); }}
                    className={cn(
                      'block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:text-blue-600 hover:bg-blue-50',
                      activeTab === tab.id ? 'text-blue-600' : 'text-gray-700'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}

                {/* Logout */}
                <div className="border-t pt-2 mt-2">
                  <button
                    onClick={() => { logout(); setIsOpen(false); navigate('/', { replace: true }); }}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default AdminNavbar;
