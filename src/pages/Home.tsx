import React, { useState } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Testimonials from '../components/Testimonials';
import { useShop } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORIES } from '../constants';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, Star, ArrowRight, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { getCategoryLabel } from '../lib/utils';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

const Home = () => {
  const { products, categories, siteSettings } = useShop();
  const { t, language } = useLanguage();

  const SUBSCRIPTION_TYPES = [
    { value: 'advertise', label: t('subscribeAdvertise') },
    { value: 'partner', label: t('subscribePartner') },
    { value: 'agent', label: t('subscribeAgent') },
  ];
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleOpenSubscribeModal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribeModalOpen(true);
  };

  const handleConfirmSubscribe = async (type: string) => {
    setIsSubscribing(true);
    try {
      const res = await fetch(`${API_BASE}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmail, type }),
      });
      if (!res.ok) throw new Error('Request failed');
      toast.success(t('subscribeSuccess'));
      setSubscribeEmail('');
      setIsSubscribeModalOpen(false);
    } catch (error) {
      toast.error(t('subscribeError'));
    } finally {
      setIsSubscribing(false);
    }
  };

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const testimonials = siteSettings.testimonials || [];

  const features = [
    { icon: <ShieldCheck className="h-8 w-8 text-blue-600" />, title: t('securePayment'), desc: t('featureSecureDesc') },
    { icon: <Truck className="h-8 w-8 text-blue-600" />, title: t('fastDelivery'), desc: t('featureDeliveryDesc') },
    { icon: <Star className="h-8 w-8 text-blue-600" />, title: t('qualityProducts'), desc: t('featureQualityDesc') },
    { icon: <Headphones className="h-8 w-8 text-blue-600" />, title: t('support247'), desc: t('featureSupportDesc') },
  ];

  return (
    <div className="space-y-20 pb-20">
      <Hero />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4"
            >
              <div className="bg-blue-50 p-4 rounded-full">{f.icon}</div>
              <h3 className="font-bold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Brands Marquee */}
      <section className="bg-white py-12 border-y border-gray-100 overflow-hidden">
        <div className="flex marquee-container relative">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ 
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              }
            }}
            className="flex whitespace-nowrap space-x-12 px-6"
          >
            {([
              t('marqueeWelcome'),
              <span key="phone" className="inline-flex items-center gap-3">{t('marqueeTagline')} <PhoneCall className="h-[0.85em] w-[0.85em]" /> 0796606178</span>,
              t('marqueeValues'),
              t('marqueeVerse'),
            ] as React.ReactNode[]).map((brand, i) => (
              <span key={i} className="text-3xl md:text-5xl font-black text-blue-400 tracking-tighter hover:text-blue-600 transition-colors cursor-default inline-flex items-center">
                {brand}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('categories')}</h2>
            <p className="text-gray-500">{t('exploreCategoriesDesc')}</p>
          </div>
          <Link to="/shop" className="text-blue-600 font-semibold flex items-center space-x-1 hover:underline">
            <span>{t('viewAll')}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => {
            const catImage = products.find(p => p.category === cat && p.images?.length)?.images?.[0];
            return (
              <Link
                key={cat}
                to={`/shop?category=${cat}`}
                className="group relative h-48 rounded-2xl overflow-hidden bg-gray-100"
              >
                {catImage ? (
                  <img
                    src={catImage}
                    alt={getCategoryLabel(cat, language, siteSettings.categoryTranslations)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 transition-transform duration-500 group-hover:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white font-bold text-lg">{getCategoryLabel(cat, language, siteSettings.categoryTranslations)}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('featured')}</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-900 rounded-3xl overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center space-y-8">
            <h2 className="text-4xl font-bold text-white">{t('whyChooseUs')}?</h2>
            <div className="space-y-6">
              {[
                { title: t('whyTrustedTitle'), desc: t('whyTrustedDesc') },
                { title: t('securePaymentsTitle'), desc: t('whySecureDesc') },
                { title: t('fastDelivery'), desc: t('whyDeliveryDesc') }
              ].map((item, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-6 w-6 rounded-full bg-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-bold text-lg">{item.title}</h4>
                    <p className="text-blue-100 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 h-80 lg:h-auto">
            <img
              src="client.jpeg"
              alt={t('shoppingAlt')}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight uppercase">{t('testimonials')}</h2>
          <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full" />
        </div>
        <Testimonials testimonials={testimonials} />
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-200 rounded-3xl p-12 text-center text-black space-y-6">
          <h2 className="text-3xl font-bold">{t('newsletter')}</h2>
          <p className="text-black max-w-2xl mx-auto">
            {t('newsletterDesc')}
          </p>
          <form onSubmit={handleOpenSubscribeModal} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none border border-black"
              required
            />
            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-950 text-white px-8 py-3 rounded-full font-bold transition-colors"
            >
              {t('subscribe')}
            </button>
          </form>
        </div>
      </section>

      {/* Subscription Type Modal */}
      {isSubscribeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => !isSubscribing && setIsSubscribeModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 w-full max-w-sm space-y-6 text-center"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900">{t('subscribeModalTitle')}</h3>
              <p className="text-sm text-gray-500 mt-1">{t('subscribeModalDesc')}</p>
            </div>
            <div className="space-y-3">
              {SUBSCRIPTION_TYPES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  disabled={isSubscribing}
                  onClick={() => handleConfirmSubscribe(opt.value)}
                  className="w-full px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-800 hover:border-blue-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={isSubscribing}
              onClick={() => setIsSubscribeModalOpen(false)}
              className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              {t('cancel')}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
