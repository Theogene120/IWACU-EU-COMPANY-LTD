import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, Package, Clock, CheckCircle2, Truck, PackageCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const { orders, isLoading } = useShop();
  const { t } = useLanguage();
  const [foundOrder, setFoundOrder] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (location.state?.orderId && !isLoading) {
      const id = location.state.orderId;
      setOrderId(id);
      const order = orders.find(o => o.id.toLowerCase() === id.toLowerCase());
      setFoundOrder(order || null);
      setSearched(true);
    }
  }, [location.state, orders, isLoading]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    const order = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
    setFoundOrder(order || null);
    setSearched(true);
  };

  const statusSteps = [
    { id: 'pending', icon: <Clock className="h-6 w-6" />, label: t('pending') },
    { id: 'confirmed', icon: <CheckCircle2 className="h-6 w-6" />, label: t('confirmed') },
    { id: 'shipped', icon: <Truck className="h-6 w-6" />, label: t('shipped') },
    { id: 'delivered', icon: <PackageCheck className="h-6 w-6" />, label: t('delivered') },
  ];

  const currentStepIndex = foundOrder ? statusSteps.findIndex(s => s.id === foundOrder.status) : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('trackOrder')}</h1>
        <p className="text-gray-500">Enter your Order ID to see the current status of your delivery.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-12">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              required
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder={`${t('orderId')} (e.g. ORD-XXXXXX)`}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200"
          >
            {t('trackOrder')}
          </button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {searched && foundOrder ? (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Progress Bar */}
            <div className="relative flex justify-between items-center max-w-2xl mx-auto">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 w-full z-0" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-1000 z-0" 
                style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
              />
              
              {statusSteps.map((step, i) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                    i <= currentStepIndex ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border-2 border-gray-200 text-gray-400"
                  )}>
                    {step.icon}
                  </div>
                  <span className={cn(
                    "text-xs font-bold mt-2 uppercase tracking-wider",
                    i <= currentStepIndex ? "text-blue-600" : "text-gray-400"
                  )}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Order Info</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Order ID: <span className="font-bold text-gray-900">{foundOrder.id}</span></p>
                  <p className="text-sm text-gray-600">Date: <span className="font-bold text-gray-900">{new Date(foundOrder.createdAt).toLocaleDateString()}</span></p>
                  <p className="text-sm text-gray-600">Status: <span className="font-bold text-blue-600 uppercase">{foundOrder.status}</span></p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Delivery To</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-900 font-bold">{foundOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{foundOrder.address}</p>
                  <p className="text-sm text-gray-600">{foundOrder.phone}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button 
                onClick={() => navigate('/')}
                className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        ) : searched && (
          <motion.div
            key="not-found"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-red-50 rounded-3xl border border-red-100"
          >
            <Package className="h-12 w-12 text-red-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900">Order not found</h3>
            <p className="text-red-600">Please check your Order ID and try again.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderTracking;
