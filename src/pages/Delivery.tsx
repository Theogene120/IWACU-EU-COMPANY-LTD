import React, { useState, useEffect } from 'react';
import { Truck, Clock, MapPin, Phone, PhoneCall, ShieldCheck, Info, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { DISTRICT_DELIVERY_FEES, BUSINESS_PHONE, RWANDA_LOCATIONS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import WhatsAppIcon from '../components/WhatsAppIcon';

const Delivery: React.FC = () => {
  const { t } = useLanguage();
  const [country, setCountry] = useState('Rwanda');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [selectedZone, setSelectedZone] = useState<{ price: number; time: string; zone?: string } | null>(null);

  useEffect(() => {
    if (country === 'Rwanda') {
      if (district && DISTRICT_DELIVERY_FEES[district]) {
        const zoneData = DISTRICT_DELIVERY_FEES[district];
        setSelectedZone({
          zone: district,
          price: zoneData.price,
          time: zoneData.time
        });
      } else {
        setSelectedZone(null);
      }
    } else {
      // For other countries, maybe a flat fee or placeholder
      setSelectedZone({ zone: "International", price: 25000, time: "5-10 Days" });
    }
  }, [country, province, district]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
    setProvince('');
    setDistrict('');
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvince(e.target.value);
    setDistrict('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('delivery')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Great News! We now offer <span className="text-green-600 font-bold">FREE DELIVERY</span> on all orders inside Kigali! <Truck className="inline h-5 w-5 text-green-600 align-middle" aria-hidden="true" />
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Location Selector */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2">
                <MapPin className="text-blue-600" />
                Delivery Fee Calculator
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Country */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Country
                  </label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={handleCountryChange}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl appearance-none focus:ring-2 focus:ring-blue-600 outline-none"
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
                {country === 'Rwanda' && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Province</label>
                    <div className="relative">
                      <select
                        value={province}
                        onChange={handleProvinceChange}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl appearance-none focus:ring-2 focus:ring-blue-600 outline-none"
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
                {country === 'Rwanda' && province && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">District</label>
                    <div className="relative">
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl appearance-none focus:ring-2 focus:ring-blue-600 outline-none"
                      >
                        <option value="">Select District</option>
                        {RWANDA_LOCATIONS[province as keyof typeof RWANDA_LOCATIONS].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {selectedZone ? (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-8 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                          <Truck className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-blue-100 text-sm font-bold uppercase tracking-wider">Estimated Delivery</p>
                          <h3 className="text-2xl font-bold">{selectedZone.time}</h3>
                        </div>
                      </div>
                      <div className="h-px w-full md:h-12 md:w-px bg-white/20" />
                      <div className="text-center md:text-right">
                        <p className="text-blue-100 text-sm font-bold uppercase tracking-wider">Shipping Cost</p>
                        <h3 className="text-4xl font-black">{selectedZone.price.toLocaleString()} RWF</h3>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-blue-50 text-sm">
                      <Info className="w-5 h-5" />
                      <p>Delivery to {district || province || country}. Rates are subject to change based on order size.</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-12 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Please select your location to see shipping details</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Truck className="text-orange-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Express Delivery</h3>
                <p className="text-gray-600">Need it faster? Contact us for express delivery options within Kigali for urgent orders.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Safe Handling</h3>
                <p className="text-gray-600">All items are carefully packed and handled to ensure they reach you in perfect condition.</p>
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-6">Logistics Support</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <PhoneCall className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Call for Delivery Info</p>
                    <p className="font-bold">{BUSINESS_PHONE}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <WhatsAppIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp Logistics</p>
                    <p className="font-bold">{BUSINESS_PHONE}</p>
                  </div>
                </div>
              </div>
              <hr className="my-6 border-gray-100" />
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900">Working Hours:</p>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Mon - Sat:</span>
                  <span>8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Sunday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-8 rounded-2xl border border-green-100">
              <div className="flex items-center gap-3 text-green-900 mb-2">
                <Truck className="w-6 h-6" />
                <h4 className="font-bold">Free Delivery in Kigali</h4>
              </div>
              <p className="text-sm text-green-800 font-medium">To celebrate our community, we have removed shipping fees for all orders delivered within Kigali City. Orders outside Kigali are charged a distance-based delivery fee.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
