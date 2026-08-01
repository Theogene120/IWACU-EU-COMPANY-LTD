import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ProductContext';
import { Package, Clock, CheckCircle, Truck, PackageCheck, ChevronRight, Search, User } from 'lucide-react';
import { cn, localize } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { BUSINESS_PHONE } from '../constants';

const Account = () => {
  const { orders } = useShop();
  const { t, language } = useLanguage();
  const [phone, setPhone] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const customerOrders = orders.filter(o => o.phone === phone);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-black text-blue-900 mb-2">{t('customerAccountTitle')}</h1>
            <p className="text-gray-500 text-sm">{t('customerAccountDesc')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('phoneNumber')}</label>
              <input
                type="tel"
                required
                placeholder={t('phonePlaceholderExample')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all transform active:scale-95"
            >
              {t('viewMyOrdersBtn')}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const activeOrder = orders.find(o => o.id === selectedOrder);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-blue-600 h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold">
                {phone.substring(0, 2)}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">{t('customerLabel')}</p>
                <p className="font-black text-blue-900">{phone}</p>
              </div>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="w-full py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              {t('logoutBtn')}
            </button>
          </div>

          <div className="bg-blue-900 p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
            <h3 className="font-bold mb-2">{t('needHelpTitle')}</h3>
            <p className="text-sm text-blue-200 mb-4">{t('needHelpDesc')}</p>
            <a href={`tel:${BUSINESS_PHONE}`} className="block w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-center text-sm font-bold transition-colors">
              {t('callSupportBtn')}
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-blue-900">{t('orderHistoryTitle')}</h2>
            <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
              {customerOrders.length} {t('ordersCountSuffix')}
            </span>
          </div>

          {customerOrders.length === 0 ? (
            <div className="bg-white p-20 rounded-3xl shadow-sm border border-gray-100 text-center">
              <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('noOrdersTitle')}</h3>
              <p className="text-gray-500 mb-8">{t('noOrdersDesc')}</p>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">
                {t('startShoppingBtn')}
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {customerOrders.map((order) => (
                <motion.div
                  key={order.id}
                  layoutId={order.id}
                  onClick={() => setSelectedOrder(order.id)}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center",
                        order.status === 'pending' && "bg-orange-100 text-orange-600",
                        order.status === 'confirmed' && "bg-blue-100 text-blue-600",
                        order.status === 'shipped' && "bg-purple-100 text-purple-600",
                        order.status === 'delivered' && "bg-green-100 text-green-600"
                      )}>
                        {order.status === 'pending' && <Clock className="h-6 w-6" />}
                        {order.status === 'confirmed' && <CheckCircle className="h-6 w-6" />}
                        {order.status === 'shipped' && <Truck className="h-6 w-6" />}
                        {order.status === 'delivered' && <PackageCheck className="h-6 w-6" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">{t('orderHashPrefix')}{order.id}</p>
                        <p className="font-black text-blue-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-8">
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase">{t('total')}</p>
                        <p className="font-black text-blue-900">{order.total.toLocaleString()} RWF</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && activeOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div>
                  <h2 className="text-2xl font-black text-blue-900">{t('orderDetailsTitle')}</h2>
                  <p className="text-sm text-gray-500">{t('orderHashPrefix')}{activeOrder.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white rounded-xl transition-colors"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Status Stepper */}
                <div className="flex justify-between items-center relative">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 -z-10" />
                  {[
                    { id: 'pending', icon: Clock, label: t('pending') },
                    { id: 'confirmed', icon: CheckCircle, label: t('confirmed') },
                    { id: 'shipped', icon: Truck, label: t('shipped') },
                    { id: 'delivered', icon: PackageCheck, label: t('delivered') }
                  ].map((step, idx) => {
                    const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
                    const currentIdx = statuses.indexOf(activeOrder.status);
                    const isCompleted = idx <= currentIdx;
                    const isActive = idx === currentIdx;

                    return (
                      <div key={step.id} className="flex flex-col items-center gap-2">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-500",
                          isCompleted ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border-2 border-gray-100 text-gray-300"
                        )}>
                          <step.icon className="h-5 w-5" />
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-wider",
                          isActive ? "text-blue-600" : "text-gray-400"
                        )}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('itemsOrderedTitle')}</h3>
                  <div className="space-y-3">
                    {activeOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center space-x-4">
                          <img src={item.images[0]} alt={localize(item.title, language)} className="w-12 h-12 object-cover rounded-lg" referrerPolicy="no-referrer" />
                          <div>
                            <p className="font-bold text-blue-900">{localize(item.title, language)}</p>
                            <p className="text-xs text-gray-500">{t('qtyLabel')} {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-blue-900">{(item.price * item.quantity).toLocaleString()} RWF</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('address')}</h3>
                    <p className="text-sm font-bold text-blue-900 leading-relaxed">{activeOrder.address}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('orderTotalTitle')}</h3>
                    <p className="text-2xl font-black text-blue-600">{activeOrder.total.toLocaleString()} RWF</p>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">{activeOrder.paymentMethod.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={() => window.print()}
                  className="w-full py-4 bg-white border border-gray-200 text-blue-900 rounded-2xl font-black shadow-sm hover:bg-gray-50 transition-all"
                >
                  {t('printInvoiceBtn')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default Account;
