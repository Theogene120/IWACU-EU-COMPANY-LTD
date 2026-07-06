import React, { useState, useMemo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Globe, LogOut, Search, ChevronDown, Check} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useShop } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_NAME } from '../constants';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { cartCount, products, siteSettings } = useShop();
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products
      .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [products, searchQuery]);

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setShowSuggestions(false);
  };

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
    { code: 'RWF', name: 'Rwandan Franc',  flag: '🇷🇼' },
    { code: 'USD', name: 'US Dollar',       flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro',            flag: '🇪🇺' },
    { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪' },
  ];

  const currentLangName = languages.find(l => l.code === language)?.name ?? 'English';
  const currentCurrency = currencies.find(c => c.code === currency)!;

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-green-600 text-white py-2 px-4 text-center text-sm font-bold shadow-inner">
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {/* <Truck className="h-4 w-4 shrink-0" aria-hidden="true" /> */}
            {language === 'rw' ? 'IBICURUZWA BYIZA UBUZIMA BWIZA' :
             language === 'fr' ? 'SIMPLIFIEZ VOTRE VIE AVEC DES PRODUETS DE QUALITE' :
             'MAKE LIFE EASY WITH QUALITY PRODUCT'}
            {/* <Truck className="h-4 w-4 shrink-0" aria-hidden="true" /> */}
          </span>
        </motion.div>
      </div>

      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">

            {/* ── LEFT: Logo + Search ── */}
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

              {/* Search icon — overlay, no layout shift */}
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
                      <div className="fixed inset-0 z-[55]" onClick={closeSearch} />
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
                            placeholder={t('search')}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') closeSearch();
                              if (e.key === 'Enter' && searchQuery.trim()) {
                                navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
                                closeSearch();
                              }
                            }}
                            className="w-full pl-9 pr-9 py-2.5 bg-gray-50 rounded-xl border border-gray-100 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                          <button
                            onClick={closeSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <AnimatePresence>
                          {showSuggestions && searchSuggestions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="mt-2 space-y-1"
                            >
                              {searchSuggestions.map((product) => (
                                <button
                                  key={product.id}
                                  onClick={() => {
                                    navigate(`/product/${product.id}`);
                                    closeSearch();
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
                                  closeSearch();
                                }}
                                className="w-full mt-1 p-2 text-center text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                              >
                                View all results for "{searchQuery}"
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── MIDDLE: Nav links ── */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-blue-600',
                    location.pathname === link.path
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* ── RIGHT: Language, Currency, Cart, Admin ── */}
            <div className="hidden md:flex items-center space-x-2">

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(v => !v)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                    langOpen
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  )}
                >
                  <Globe className="h-4 w-4 shrink-0" />
                  <span>{currentLangName}</span>
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', langOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <>
                      <div className="fixed inset-0 z-[45]" onClick={() => setLangOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-gray-100 shadow-xl z-[50] py-1 overflow-hidden"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => { setLanguage(lang.code as any); setLangOpen(false); }}
                            className={cn(
                              'flex items-center w-full px-4 py-2.5 text-sm transition-colors',
                              language === lang.code
                                ? 'text-blue-600 bg-blue-50 font-semibold'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                            )}
                          >
                            {lang.name}
                            {language === lang.code && (
                              <Check className="h-3.5 w-3.5 ml-auto shrink-0" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Currency Switcher */}
              <div className="relative">
                <button
                  onClick={() => setCurrOpen(v => !v)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                    currOpen
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  )}
                >
                  <span>{currentCurrency.flag}</span>
                  <span>{currentCurrency.code}</span>
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', currOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {currOpen && (
                    <>
                      <div className="fixed inset-0 z-[45]" onClick={() => setCurrOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-gray-100 shadow-xl z-[50] py-1 overflow-hidden"
                      >
                        {currencies.map((curr) => (
                          <button
                            key={curr.code}
                            onClick={() => { setCurrency(curr.code as any); setCurrOpen(false); }}
                            className={cn(
                              'flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors',
                              currency === curr.code
                                ? 'text-blue-600 bg-blue-50 font-semibold'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                            )}
                          >
                            <span className="text-base">{curr.flag}</span>
                            <span>{curr.code}</span>
                            {currency === curr.code && (
                              <Check className="h-3.5 w-3.5 ml-auto shrink-0" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 rounded-xl hover:bg-gray-50 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAdmin && (
                <div className="flex items-center space-x-1">
                  <Link to="/admin" className="text-sm font-medium text-blue-600 hover:underline px-2 py-2">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="p-2 text-gray-600 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* ── MOBILE: Cart + Hamburger ── */}
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

        {/* ── Mobile Menu ── */}
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

                {/* Mobile Language Selector */}
                <div className="border-t pt-3 mt-2 px-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Language
                  </p>
                  <div className="space-y-0.5">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code as any); setIsOpen(false); }}
                        className={cn(
                          'flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                          language === lang.code
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        <Globe className="h-4 w-4 mr-2.5 shrink-0 text-gray-400" />
                        {lang.name}
                        {language === lang.code && (
                          <Check className="h-4 w-4 ml-auto shrink-0 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Currency Selector */}
                <div className="border-t pt-3 mt-2 px-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Currency
                  </p>
                  <div className="space-y-0.5">
                    {currencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => { setCurrency(curr.code as any); setIsOpen(false); }}
                        className={cn(
                          'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                          currency === curr.code
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        <span className="text-base">{curr.flag}</span>
                        <span>{curr.code}</span>
                        {currency === curr.code && (
                          <Check className="h-4 w-4 ml-auto shrink-0 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {isAdmin && (
                  <div className="border-t pt-2 mt-2">
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-blue-600"
                    >
                      Admin Dashboard
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
