import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { Variation } from '../types';
import { ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, ChevronLeft, AlertCircle } from 'lucide-react';
import { BUSINESS_PHONE } from '../constants';
import { motion } from 'motion/react';
import { cn, resolveColorSwatch } from '../lib/utils';
import { toast } from 'sonner';
import ProductCarousel from '../components/ProductCarousel';
import WhatsAppIcon from '../components/WhatsAppIcon';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, siteSettings } = useShop();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const product = products.find(p => p.id === id);
  const heroSlide = product ? siteSettings.heroSlides?.find(s => s.productId === product.id) : undefined;
  const galleryImages = product
    ? (heroSlide && !product.images.includes(heroSlide.image) ? [heroSlide.image, ...product.images] : product.images)
    : [];
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, Variation>>({});
  const [mainImage, setMainImage] = useState(heroSlide?.image || product?.images[0] || '');

  useEffect(() => {
    if (product) {
      setMainImage(heroSlide?.image || product.images[0]);
      // If there's only one type of variation, auto-select if needed?
      // Actually, user wants mandatory selection, so don't auto-select.
      setSelectedVariations({});
    }
  }, [product, heroSlide]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button onClick={() => navigate('/shop')} className="text-blue-600 font-bold hover:underline">
          Back to Shop
        </button>
      </div>
    );
  }

  // Group variations by name
  const variationGroups = product.variations?.reduce((acc, v) => {
    if (!acc[v.name]) acc[v.name] = [];
    acc[v.name].push(v);
    return acc;
  }, {} as Record<string, Variation[]>) || {};

  const variationNames = Object.keys(variationGroups);
  const allSelected = variationNames.every(name => selectedVariations[name]);

  const priceModifier = (Object.values(selectedVariations) as Variation[]).reduce((sum, v) => sum + (v.priceModifier || 0), 0);
  const currentPrice = product.price + priceModifier;
  
  // For stock, we'll take the minimum of selected variations or main stock
  const currentStock = variationNames.length > 0 && allSelected
    ? Math.min(...(Object.values(selectedVariations) as Variation[]).map(v => v.stock))
    : product.stock;

  const whatsappLink = `https://wa.me/${BUSINESS_PHONE.replace('+', '')}?text=Hello, I want to order this product: ${product.title} ${Object.entries(selectedVariations).map(([name, v]) => `(${name}: ${(v as Variation).value})`).join(' ')} (Price: ${formatPrice(currentPrice)}, Quantity: ${quantity})`;
  const inquiryLink = `https://wa.me/${BUSINESS_PHONE.replace('+', '')}?text=Hello, I have a question about this product: ${product.title}`;

  const handleAddToCart = () => {
    if (variationNames.length > 0 && !allSelected) {
      toast.error(`Please select ${variationNames.filter(n => !selectedVariations[n]).join(' and ')}`);
      return;
    }
    // We pass the all selected variations
    addToCart(product, quantity, Object.values(selectedVariations));
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold mb-8 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Image Gallery */}
        <div className="lg:w-1/2 space-y-4">
          <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner group relative">
            <motion.img 
              key={mainImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              src={mainImage} 
              alt={product.title} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          {galleryImages.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={cn(
                    "aspect-square rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white",
                    mainImage === img ? "border-blue-600 scale-95 shadow-sm" : "border-gray-100 opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">{product.category}</span>
               {product.oldPrice && (
                 <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-orange-100">Sale</span>
               )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight tracking-tight">{product.title}</h1>
            
            <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                    )}
                  />
                ))}
                <span className="text-sm font-bold text-gray-900 ml-2">{product.rating}</span>
                <span className="text-gray-400 text-xs ml-1">(12+ reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full animate-pulse", currentStock > 0 ? "bg-green-500" : "bg-red-500")} />
                <span className={cn(
                  "text-xs font-black uppercase tracking-widest",
                  currentStock > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {currentStock > 0 ? `${currentStock} ${t('stock')}` : t('outOfStock')}
                </span>
              </div>
            </div>

            <div className="flex items-baseline space-x-4 mb-10">
              <span className="text-5xl font-black text-blue-900 tracking-tighter">{formatPrice(currentPrice)}</span>
              {product.oldPrice && (
                <span className="text-2xl text-gray-300 line-through font-medium Decoration-gray-200">{formatPrice(product.oldPrice + priceModifier)}</span>
              )}
            </div>

            {variationNames.length > 0 && (
              <div className="space-y-8 mb-10">
                {variationNames.map(groupName => (
                  <div key={groupName} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-black text-gray-900 uppercase text-[10px] tracking-widest">Select {groupName}</h3>
                      {selectedVariations[groupName] && (
                        <span className="text-blue-600 font-bold text-xs">Selected: {selectedVariations[groupName].value}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {variationGroups[groupName].map((v) => {
                        const isColor = groupName.toLowerCase().includes('color');
                        return (
                          <button
                            key={v.id}
                            onClick={() => {
                              setSelectedVariations(prev => ({ ...prev, [groupName]: v }));
                            }}
                            className={cn(
                              "transition-all duration-300 relative",
                              isColor 
                                ? "w-10 h-10 rounded-full border-2 p-1" 
                                : "px-6 py-3 rounded-2xl border-2 font-black text-sm",
                              selectedVariations[groupName]?.id === v.id
                                ? "border-blue-600 scale-105 shadow-md"
                                : "border-gray-100 hover:border-gray-300"
                            )}
                            title={v.value}
                          >
                            {isColor ? (
                              <div 
                                className="w-full h-full rounded-full border border-black/5" 
                                style={{ backgroundColor: resolveColorSwatch(v.value) }}
                              />
                            ) : (
                              <span>{v.value}</span>
                            )}
                            {selectedVariations[groupName]?.id === v.id && !isColor && (
                              <div className="absolute -top-2 -right-2 bg-blue-600 text-white p-1 rounded-full shadow-lg">
                                <ShieldCheck className="h-3 w-3" />
                              </div>
                            )}
                            {isColor && selectedVariations[groupName]?.id === v.id && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-white shadow-sm" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gray-50 rounded-3xl p-6 mb-10">
               <h3 className="font-black text-gray-900 uppercase text-[10px] tracking-widest mb-4">Description</h3>
               <p className="text-gray-600 leading-relaxed text-sm">
                 {product.description}
               </p>
            </div>

            {product.specifications && (
              <div className="mb-10">
                <h3 className="font-black text-gray-900 mb-4 uppercase text-[10px] tracking-widest">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 bg-white border border-gray-100 rounded-2xl">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      <span className="text-xs font-bold text-gray-700">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center bg-gray-100 rounded-2xl overflow-hidden h-16 p-1">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-12 h-full flex items-center justify-center hover:bg-white transition-all rounded-xl text-xl font-bold"
                >-</button>
                <input 
                  type="number" 
                  value={quantity} 
                  readOnly
                  className="w-10 text-center font-black bg-transparent"
                />
                <button 
                  onClick={() => setQuantity(prev => Math.min(currentStock, prev + 1))}
                  className="w-12 h-full flex items-center justify-center hover:bg-white transition-all rounded-xl text-xl font-bold"
                >+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={currentStock === 0}
                className={cn(
                  "flex-1 font-black rounded-2xl flex items-center justify-center space-x-2 transition-all h-16 uppercase tracking-widest text-sm shadow-xl",
                  currentStock > 0 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200" 
                    : "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
                )}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{currentStock > 0 ? t('addToCart') : t('outOfStock')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all"
              >
                <WhatsAppIcon className="h-5 w-5" />
                <span>{t('orderWhatsApp')}</span>
              </a>
              <a
                href={inquiryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all"
              >
                <WhatsAppIcon className="h-5 w-5" />
                <span>{t('askProduct')}</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
            <div className="flex flex-col items-center text-center space-y-2">
              <Truck className="h-6 w-6 text-blue-600" />
              <h4 className="font-bold text-sm">Fast Delivery</h4>
              <p className="text-xs text-gray-500">24h in Kigali</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
              <h4 className="font-bold text-sm">Secure Payment</h4>
              <p className="text-xs text-gray-500">100% Protected</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <RotateCcw className="h-6 w-6 text-blue-600" />
              <h4 className="font-bold text-sm">Easy Returns</h4>
              <p className="text-xs text-gray-500">7 Days Policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
