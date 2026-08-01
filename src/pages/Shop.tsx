import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { cn, localize, matchesLocalizedText, getCategoryLabel } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const Shop = () => {
  const { products, categories, siteSettings } = useShop();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [priceRange, setPriceRange] = useState(5000000);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategory = searchParams.get('category') || 'All';

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products
      .filter(p => matchesLocalizedText(p.title, searchQuery))
      .slice(0, 5);
  }, [products, searchQuery]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesSearch = matchesLocalizedText(p.title, searchQuery) || matchesLocalizedText(p.description, searchQuery);
        const matchesPrice = p.price <= priceRange;
        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // newest/default
      });
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  const handleCategoryChange = (cat: string) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('shop')}</h1>
          <p className="text-gray-500">{t('showingProductsPrefix')} {filteredProducts.length} {t('showingProductsSuffix')}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 w-full sm:w-64"
            />
            
            {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                >
                  {searchSuggestions.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        navigate(`/product/${p.id}`);
                        setSearchQuery("");
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <img src={p.images[0]} alt={localize(p.title, language)} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{localize(p.title, language)}</p>
                        <p className="text-xs text-blue-600 font-bold">{formatPrice(p.price)}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors md:hidden"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>{t('filtersBtn')}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className={cn(
          "lg:w-64 space-y-10",
          showFilters ? "fixed inset-0 z-[60] bg-white p-8 overflow-y-auto" : "hidden lg:block"
        )}>
          {showFilters && (
            <div className="flex justify-between items-center mb-8 lg:hidden">
              <h2 className="text-xl font-bold">{t('filtersBtn')}</h2>
              <button onClick={() => setShowFilters(false)}><X className="h-6 w-6" /></button>
            </div>
          )}

          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">{t('categories')}</h3>
            <div className="space-y-2">
              {['All', ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    selectedCategory === cat ? "bg-blue-600 text-white font-bold" : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {cat === 'All' ? t('allCategoriesLabel') : getCategoryLabel(cat, language, siteSettings.categoryTranslations)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">{t('priceRangeTitle')}</h3>
            <input
              type="range"
              min="0"
              max="5000000"
              step="50000"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>0 RWF</span>
              <span>{formatPrice(priceRange)}</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">{t('sortByTitle')}</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="newest">{t('sortNewest')}</option>
              <option value="price-low">{t('sortPriceLow')}</option>
              <option value="price-high">{t('sortPriceHigh')}</option>
              <option value="rating">{t('sortTopRated')}</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">{t('noProductsFoundTitle')}</h3>
              <p className="text-gray-500">{t('noProductsFoundDesc')}</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPriceRange(5000000);
                  handleCategoryChange('All');
                }}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                {t('clearFiltersBtn')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
