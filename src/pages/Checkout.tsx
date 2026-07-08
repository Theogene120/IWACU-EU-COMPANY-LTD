import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { Order, PaymentMethod, PaymentStatus } from '../types';
import { BANK_DETAILS, BUSINESS_PHONE, RWANDA_LOCATIONS, DISTRICT_DELIVERY_FEES, MOMO_DETAILS, AIRTEL_DETAILS, calcDeliveryFee } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  Smartphone,
  Truck,
  CarFront,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Globe,
  ChevronDown,
  MapPin,
  Clock
} from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartTotal: subtotal, clearCart, addOrder, products } = useShop();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    country: 'Rwanda',
    province: '',
    district: '',
    address: '',
    momoNumber: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('momo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [finalTotal, setFinalTotal] = useState(0);
  const [error, setError] = useState('');
  const [selectedZone, setSelectedZone] = useState<{ price: number; time: string; zone?: string } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (cart.length === 0 && !isSuccess) {
      navigate('/shop');
    }
  }, [cart, navigate, isSuccess]);

  // Delivery calculation logic — distance-based for Rwanda, flat 25000 international
  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      if (formData.country === 'Rwanda') {
        if (formData.district && DISTRICT_DELIVERY_FEES[formData.district]) {
          const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
          const price = calcDeliveryFee(formData.district, totalQuantity);
          setSelectedZone({
            zone: formData.district,
            price,
            time: DISTRICT_DELIVERY_FEES[formData.district].time,
          });
        } else {
          setSelectedZone(null);
        }
      } else if (formData.country) {
        setSelectedZone({ zone: "International", price: 25000, time: "5-10 Days" });
      } else {
        setSelectedZone(null);
      }
      setIsCalculating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.country, formData.province, formData.district, cart]);

  const deliveryFee = selectedZone?.price || 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset dependent fields
      ...(name === 'country' ? { province: '', district: '' } : {}),
      ...(name === 'province' ? { district: '' } : {})
    }));
    setError('');
  };

  const validatePhone = (phone: string) => {
    return /^07[8,9,2,3]\d{7}$/.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone || !formData.country) {
      setError('Please fill in all required shipping details.');
      return;
    }

    if (formData.country === 'Rwanda' && (!formData.province || !formData.district)) {
      setError('Please select your Province and District.');
      return;
    }

    if (paymentMethod === 'cod' && formData.province !== 'Kigali City') {
      setError('Only Kigali is allowed to pay for this service, and then your order will arrive. If you need help, write to us.');
      return;
    }

    if (paymentMethod === 'momo' && !validatePhone(formData.momoNumber)) {
      setError('Please enter a valid Rwanda Mobile Money number (e.g., 078xxxxxxx).');
      return;
    }

    // Stock consistency check
    const inconsistencies = cart.filter(item => {
      const product = products.find(p => p.id === item.id);
      return !product;
    });

    if (inconsistencies.length > 0) {
      setError('Some items in your cart are no longer available. Please review your cart.');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Simulate order processing for 2 seconds
    setTimeout(() => {
      let status: PaymentStatus = 'Pending';
      if (paymentMethod === 'card') status = 'Paid';
      if (paymentMethod === 'cod') status = 'Pending - Cash on Delivery';
      if (paymentMethod === 'bank_transfer') status = 'Waiting for Bank Transfer';
      if (paymentMethod === 'momo') status = 'Waiting Confirmation';
      
      finalizeOrder(status);
    }, 2000);
  };

  const finalizeOrder = (paymentStatus: PaymentStatus, transactionId?: string) => {
    const newOrderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const fullAddress = [formData.address, formData.district, formData.province, formData.country]
      .filter(Boolean)
      .join(', ');

    const order: Order = {
      id: newOrderId,
      customerName: formData.name,
      phone: formData.phone,
      address: fullAddress,
      items: [...cart],
      total,
      deliveryFee,
      status: 'pending',
      paymentMethod,
      paymentStatus,
      paymentMessage,
      transactionId: transactionId || (paymentMethod === 'card' ? `TXN-${Math.random().toString(36).substr(2, 12).toUpperCase()}` : undefined),
      payerPhone: paymentMethod === 'momo' ? formData.momoNumber : undefined,
      receiverPhone: paymentMethod === 'momo' ? '0782021871' : undefined,
      paymentDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    setOrderId(newOrderId);
    setFinalTotal(total);
    setIsProcessing(false);
    setIsSuccess(true);
    clearCart();
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gray-50 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Main Success Card */}
          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 mb-8">
            <div className="bg-blue-600 p-10 text-center text-white relative">
              <div className="absolute top-4 right-4 bg-white/20 px-4 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                ORDER: {orderId}
              </div>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Order Received!</h2>
              <p className="text-blue-100 font-medium">Please complete your payment to finalize your order.</p>
            </div>

            <div className="p-8 md:p-12">
              <div className="mb-10 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                  How to Pay
                </h3>
                <div className="bg-blue-50 text-blue-700 px-6 py-4 rounded-2xl inline-block font-bold text-lg">
                  Total Amount: {formatPrice(finalTotal)}
                </div>
              </div>

              <div className="space-y-8">
                {/* Mobile Money Instructions */}
                {(paymentMethod === 'momo' || paymentMethod === 'whatsapp') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* MTN MoMo */}
                    <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-white shadow-sm">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <h4 className="font-black text-gray-900 uppercase tracking-wide">MTN Mobile Money</h4>
                      </div>
                      <ul className="text-sm space-y-3 text-gray-700 mb-6">
                        <li className="flex gap-2">
                          <span className="bg-yellow-400 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                          <span>Dial <strong>*182*1*1#</strong></span>
                        </li>
                        <li className="flex gap-2">
                          <span className="bg-yellow-400 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                          <span>Enter Number: <strong>{MOMO_DETAILS.number}</strong></span>
                        </li>
                        <li className="flex gap-2">
                          <span className="bg-yellow-400 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                          <span>Enter Amount: <strong>{formatPrice(finalTotal)}</strong></span>
                        </li>
                        <li className="flex gap-2">
                          <span className="bg-yellow-400 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                          <span>Verify Name: <strong>{MOMO_DETAILS.name}</strong></span>
                        </li>
                        <li className="flex gap-2 text-blue-600 font-bold">
                          <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">5</span>
                          <span>Use Order Code <strong>{orderId}</strong> as Reference</span>
                        </li>
                      </ul>
                    </div>

                    {/* Airtel Money */}
                    <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <h4 className="font-black text-gray-900 uppercase tracking-wide">Airtel Money</h4>
                      </div>
                      <ul className="text-sm space-y-3 text-gray-700 mb-6">
                        <li className="flex gap-2">
                          <span className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                          <span>Dial <strong>*182#</strong> then choose Airtel</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                          <span>Transfer to: <strong>{AIRTEL_DETAILS.number}</strong></span>
                        </li>
                        <li className="flex gap-2">
                          <span className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                          <span>Enter Amount: <strong>{formatPrice(finalTotal)}</strong></span>
                        </li>
                        <li className="flex gap-2">
                          <span className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                          <span>Verify Name: <strong>{AIRTEL_DETAILS.name}</strong></span>
                        </li>
                        <li className="flex gap-2 text-blue-600 font-bold">
                          <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">5</span>
                          <span>Use Order Code <strong>{orderId}</strong> as Reference</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Instructions */}
                {(paymentMethod === 'bank_transfer' || paymentMethod === 'card') && (
                  <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Building2 className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-tight">Bank Transfer</h4>
                        <p className="text-xs text-gray-500 font-bold">Equity Bank Rwanda</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                         <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Account Holder</p>
                            <p className="text-lg font-bold text-gray-900">{BANK_DETAILS.accountName}</p>
                         </div>
                         <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Account Number</p>
                            <p className="text-xl font-black text-blue-600 tracking-wider font-mono">{BANK_DETAILS.accountNumber}</p>
                         </div>
                       </div>
                       <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
                          <p className="text-xs text-gray-500 italic leading-relaxed">
                            "Please ensure you include the order code <strong>{orderId}</strong> in the bank transfer description to help us process your order faster."
                          </p>
                       </div>
                    </div>
                  </div>
                )}

                {/* COD Instructions */}
                {paymentMethod === 'cod' && (
                  <div className="bg-green-50 p-8 rounded-3xl border border-green-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white">
                        <Truck className="w-6 h-6" />
                      </div>
                      <h4 className="font-black text-green-900 uppercase tracking-wide">Cash on Delivery</h4>
                    </div>
                    <p className="text-sm text-green-800 leading-relaxed">
                      Our delivery team will contact you once they are near your location. 
                      Please have the exact amount of <strong>{formatPrice(finalTotal)}</strong> ready in cash or available on your Mobile Money phone.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Support Footer */}
            <div className="bg-gray-50 p-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shadow-sm border border-green-100">
                    <WhatsAppIcon className="w-6 h-6 text-green-500" />
                 </div>
                 <div className="text-left">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Need Help?</p>
                   <a href={`https://wa.me/${BUSINESS_PHONE.replace('+', '')}?text=Help with Order ${orderId}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">
                     WhatsApp us: {BUSINESS_PHONE}
                   </a>
                 </div>
               </div>
               
               <div className="flex gap-3">
                 <button 
                   onClick={() => navigate('/order-tracking', { state: { orderId } })}
                   className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg"
                 >
                   Track Order
                 </button>
                 <button 
                   onClick={() => navigate('/')}
                   className="px-6 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
                 >
                   Home
                 </button>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Shipping & Payment */}
          <div className="space-y-8">
            {/* Shipping Info */}
            <section className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Truck className="text-blue-600" />
                Shipping Information
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="078xxxxxxx"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <hr className="border-gray-100" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Country */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Country
                    </label>
                    <div className="relative">
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl appearance-none focus:ring-2 focus:ring-blue-600 outline-none"
                      >
                        <option value="Rwanda">Rwanda</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Burundi">Burundi</option>
                        <option value="DRC">DRC</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Province (Rwanda Only) */}
                  {formData.country === 'Rwanda' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Province</label>
                      <div className="relative">
                        <select
                          name="province"
                          value={formData.province}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl appearance-none focus:ring-2 focus:ring-blue-600 outline-none"
                        >
                          <option value="">Select Province</option>
                          {Object.keys(RWANDA_LOCATIONS).map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {/* District (Rwanda Only) */}
                  {formData.country === 'Rwanda' && formData.province && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">District</label>
                      <div className="relative">
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl appearance-none focus:ring-2 focus:ring-blue-600 outline-none"
                        >
                          <option value="">Select District</option>
                          {RWANDA_LOCATIONS[formData.province as keyof typeof RWANDA_LOCATIONS].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  <div className={formData.country === 'Rwanda' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address / Landmark (Optional)</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. KN 2 Rd, Downtown Building"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method Selection */}
            <section className="bg-white rounded-3xl shadow-sm p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="text-blue-600" />
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { id: 'momo', label: 'Mobile Money', icon: <Smartphone /> },
                  { id: 'card', label: 'Debit/Credit Card', icon: <CreditCard /> },
                  { id: 'cod', label: 'Cash on Delivery', icon: <CarFront /> },
                  { id: 'bank_transfer', label: 'Bank Transfer', icon: <Building2 /> },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                      paymentMethod === method.id
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-100 hover:border-blue-200'
                    }`}
                  >
                    <div className={paymentMethod === method.id ? 'text-blue-600' : 'text-gray-400'}>
                      {method.icon}
                    </div>
                    <span className="font-bold text-sm">{method.label}</span>
                  </button>
                ))}
              </div>

              {/* Payment Method Details */}
              <AnimatePresence mode="wait">
                {paymentMethod === 'momo' && (
                  <motion.div
                    key="momo"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-3">
                      <AlertCircle className="text-yellow-600 flex-shrink-0" />
                      <p className="text-xs text-yellow-800">
                        Enter your Mobile Money number. You will receive a prompt on your phone to confirm the payment.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">MoMo Number</label>
                      <input
                        type="tel"
                        name="momoNumber"
                        value={formData.momoNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="078xxxxxxx"
                      />
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'card' && (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <motion.div
                    key="bank"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-4"
                  >
                    <h4 className="font-bold text-blue-900">Bank Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Bank:</span>
                        <span className="font-bold">{BANK_DETAILS.bank}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Account Name:</span>
                        <span className="font-bold">{BANK_DETAILS.accountName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Account Number:</span>
                        <span className="font-bold font-mono">{BANK_DETAILS.accountNumber}</span>
                      </div>
                    </div>
                    <p className="text-xs text-blue-800 italic">
                      * Please use your Name or Phone Number as the transfer reference.
                    </p>
                  </motion.div>
                )}

                {paymentMethod === 'cod' && (
                  <motion.div
                    key="cod"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-sm text-gray-600">
                        You will pay for your order in cash or via MoMo when it is delivered to your doorstep.
                      </p>
                    </div>
                    {formData.province !== 'Kigali City' && (
                      <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3">
                        <AlertCircle className="text-orange-600 flex-shrink-0" />
                        <div className="space-y-2">
                          <p className="text-xs text-orange-800 font-bold">
                            Restricted Service
                          </p>
                          <p className="text-[10px] text-orange-700 leading-relaxed">
                            Only Kigali is allowed to pay for this service, and then your order will arrive. 
                            If you need help, <a href={`https://wa.me/${BUSINESS_PHONE.replace('+', '')}`} className="underline font-bold" target="_blank" rel="noreferrer">write to us</a>.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="space-y-8">
            <section className="bg-white rounded-3xl shadow-sm p-8 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.images[0]} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-blue-600">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-6 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span className="flex items-center gap-1">
                    Delivery Fee
                    {isCalculating && <Loader2 className="w-3 h-3 animate-spin" />}
                  </span>
                  <AnimatePresence mode="wait">
                    {selectedZone ? (
                      <motion.div
                        key="fee"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-right"
                      >
                        {deliveryFee === 0 ? (
                          <span className="text-green-600 font-black tracking-wider uppercase text-sm">FREE</span>
                        ) : (
                          <span className="text-blue-600 font-bold">{formatPrice(deliveryFee)}</span>
                        )}
                        <p className="text-[10px] text-gray-400 flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" /> {selectedZone.time}
                        </p>
                      </motion.div>
                    ) : (
                      <span className="text-xs text-orange-500 font-medium italic">Select location</span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex justify-between text-2xl font-black text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 1.1, color: '#2563eb' }}
                    animate={{ scale: 1, color: '#111827' }}
                  >
                    {formatPrice(total)}
                  </motion.span>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || isCalculating}
                className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                  isProcessing || isCalculating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                }`}
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{paymentMethod === 'momo' ? (paymentMessage || 'Initiating...') : 'Processing...'}</span>
                    </div>
                    {paymentMethod === 'momo' && (
                      <p className="text-[10px] text-blue-100 font-medium">Please do not refresh this page</p>
                    )}
                  </div>
                ) : (
                  <>
                    {paymentMethod === 'momo' ? 'Pay Now' : (paymentMethod === 'card' ? `Pay ${formatPrice(total)}` : 'Place Order')}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                Secure SSL Encrypted Payment
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
