import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal: total } = useShop();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. 
          Start shopping to find the best deals!
        </p>
        <Link
          to="/shop"
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold transition-all inline-flex items-center space-x-2"
        >
          <span>Start Shopping</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-4 mb-12">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-4xl font-bold text-gray-900">{t('cart')}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="lg:flex-1 space-y-6">
          <AnimatePresence>
            {cart.map((item) => {
              const variationIds = (item.selectedVariations || []).map(v => v.id).sort();
              const itemKey = `${item.id}-${variationIds.join(',') || 'none'}`;
              const priceModifier = (item.selectedVariations || []).reduce((sum, v) => sum + (v.priceModifier || 0), 0);
              const itemPrice = item.price + priceModifier;

              return (
                <motion.div
                  key={itemKey}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                       {item.selectedVariations && item.selectedVariations.map(v => (
                         <div key={v.id} className="inline-flex items-center gap-2 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[10px] font-bold text-blue-600 uppercase">
                           <span>{v.name}:</span>
                           <span>{v.value}</span>
                         </div>
                       ))}
                       {!item.selectedVariations && item.selectedVariation && (
                          <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[10px] font-bold text-blue-600 uppercase">
                            <span>{item.selectedVariation.name}:</span>
                            <span>{item.selectedVariation.value}</span>
                          </div>
                       )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                    <p className="text-blue-600 font-bold">{formatPrice(itemPrice)}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden h-10 border border-gray-100">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1, variationIds)}
                        className="px-3 hover:bg-gray-200 transition-colors"
                      ><Minus className="h-4 w-4" /></button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1, variationIds)}
                        className="px-3 hover:bg-gray-200 transition-colors"
                      ><Plus className="h-4 w-4" /></button>
                    </div>
                    
                    <div className="text-right min-w-[120px]">
                      <p className="font-bold text-gray-900">{formatPrice(itemPrice * item.quantity)}</p>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id, variationIds)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:w-96">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600 font-semibold">Calculated at checkout</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-900">
                <span>{t('total')}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 mb-4 flex items-center justify-center space-x-2"
            >
              <span>Proceed to {t('checkout')}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <Link
              to="/shop"
              className="block w-full text-center text-gray-500 font-semibold hover:text-blue-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
