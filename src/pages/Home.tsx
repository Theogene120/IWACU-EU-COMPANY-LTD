import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Testimonials from '../components/Testimonials';
import { useShop } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { CATEGORIES } from '../constants';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Headphones, Star, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const Home = () => {
  const { products, categories, siteSettings } = useShop();
  const { t } = useLanguage();

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const testimonials = siteSettings.testimonials || [];

  const features = [
    { icon: <ShieldCheck className="h-8 w-8 text-blue-600" />, title: t('securePayment'), desc: "MTN MoMo, Airtel Money & Cards" },
    { icon: <Truck className="h-8 w-8 text-blue-600" />, title: t('fastDelivery'), desc: "Delivery within 24 hours in Kigali" },
    { icon: <Star className="h-8 w-8 text-blue-600" />, title: t('qualityProducts'), desc: "100% genuine and tested items" },
    { icon: <Headphones className="h-8 w-8 text-blue-600" />, title: t('support247'), desc: "We are always here to help you" },
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
            {[
              "WELCOME TO IWACU EU COMPANY LTD",
              "Shop Smart. Live Better.📞 0796606178",
              "Trust, excellence, integrity, and service",
              "Commit to the Lord whatever you do, and He will establish your plans. (Proverbs 16:3"
            ].map((brand, i) => (
              <span key={i} className="text-3xl md:text-5xl font-black text-green-200 Sentencecase tracking-tighter hover:text-blue-600 transition-colors cursor-default">
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
            <p className="text-gray-500">Explore our wide range of products</p>
          </div>
          <Link to="/shop" className="text-blue-600 font-semibold flex items-center space-x-1 hover:underline">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat}
              to={`/shop?category=${cat}`}
              className="group relative h-48 rounded-2xl overflow-hidden bg-gray-100"
            >
              <img
                src={cat === 'Electronics' ? 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400' 
                   : cat === 'Fashion' ? 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D'
                   : cat === 'Shoes' ? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'
                   : cat === 'Home Items' ? 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=400'
                   : 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400'}
                alt={cat}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-4 left-4 text-white font-bold text-lg">{cat}</span>
            </Link>
          ))}
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
                { title: "Trusted by Thousands", desc: "We have served over 10,000 happy customers across Rwanda." },
                { title: "Secure Payments", desc: "Your financial information is always protected with our secure systems." },
                { title: "Fast Delivery", desc: "We understand your urgency. Most orders are delivered same-day." }
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
              src="https://www.lbcexpress.com/assets/revamp/climg/ph/lbcrush/rush-1-m.webp"
              alt="Shopping"
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
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <button className="bg-blue-900 hover:bg-blue-950 text-white px-8 py-3 rounded-full font-bold transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
