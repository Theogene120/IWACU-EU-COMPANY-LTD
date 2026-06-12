import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Globe, User, LogOut, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useShop } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_NAME } from '../constants';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { cart, cartCount, products, siteSettings } = useShop();
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products
      .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [products, searchQuery]);

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('shop'), path: '/shop' },
    { name: t('about'), path: '/about' },
    { name: t('contact'), path: '/contact' },
    { name: t('delivery'), path: '/delivery' },
    { name: t('trackOrder'), path: '/order-tracking' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'rw', name: 'Kinyarwanda' },
  ];

  const currencies = [
    { code: 'RWF', name: 'Rwandan Franc' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-green-600 text-white py-2 px-4 text-center text-sm font-bold shadow-inner">
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {language === 'rw' ? 'KUGURURA NI UBUNTU MU RWANDA HOSE! 🚚' : 
           language === 'fr' ? 'LIVRAISON GRATUITE PARTOUT AU RWANDA ! 🚚' : 
           'FREE DELIVERY ANYWHERE IN RWANDA! 🚚'}
        </motion.div>
      </div>

      <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
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
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-blue-900 leading-tight hidden lg:block">
                    {BUSINESS_NAME}
                  </span>
                </>
              )}
            </Link>

            {/* Global Search Bar */}
            <div className="hidden md:block relative group">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                      setShowSuggestions(false);
                    }
                  }}
                  className="w-64 lg:w-80 pl-9 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && searchSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60]"
                  >
                    <div className="p-2">
                      {searchSuggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            navigate(`/product/${product.id}`);
                            setSearchQuery("");
                            setShowSuggestions(false);
                          }}
                          className="w-full flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-xl transition-colors text-left"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-10 h-10 object-cover rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{product.title}</p>
                            <p className="text-xs text-blue-600 font-bold">{product.price.toLocaleString()} RWF</p>
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                          setShowSuggestions(false);
                        }}
                        className="w-full mt-1 p-2 text-center text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  location.pathname === link.path ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                <Globe className="h-5 w-5" />
                <span className="text-sm uppercase">{language}</span>
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency Switcher */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                <Globe className="h-5 w-5" />
                <span className="text-sm uppercase">{currency}</span>
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => setCurrency(curr.code as any)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {curr.name} ({curr.code})
                  </button>
                ))}
              </div>
            </div>

            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <Link to="/admin" className="text-sm font-medium text-blue-600 hover:underline">
                  Dashboard
                </Link>
                <button onClick={logout} className="p-2 text-gray-600 hover:text-red-600">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/admin/login" className="p-2 text-gray-600 hover:text-blue-600">
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-600">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
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
                    placeholder={t('search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                        setIsOpen(false);
                      }
                    }}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t pt-2 mt-2">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Language
                </p>
                <div className="flex space-x-4 px-3 py-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "text-sm font-medium",
                        language === lang.code ? "text-blue-600" : "text-gray-600"
                      )}
                    >
                      {lang.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-2 mt-2">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Currency
                </p>
                <div className="flex space-x-4 px-3 py-2">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code as any);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "text-sm font-medium",
                        currency === curr.code ? "text-blue-600" : "text-gray-600"
                      )}
                    >
                      {curr.code}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t pt-2 mt-2">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-blue-600"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-700"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
};

export default Navbar;
