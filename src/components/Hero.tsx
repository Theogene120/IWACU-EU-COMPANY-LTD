import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye } from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { BUSINESS_PHONE, HERO_SLIDES } from '../constants';
import { useShop } from '../context/ProductContext';
import { cn } from '../lib/utils';

const Hero = () => {
  const { siteSettings } = useShop();
  const slides = siteSettings.heroSlides && siteSettings.heroSlides.length > 0
    ? siteSettings.heroSlides
    : HERO_SLIDES;
  const [current, setCurrent] = useState(0);

  // Sync current index if slides change (e.g. deleted in admin)
  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  const [direction, setDirection] = useState(0); 
  const { language, t } = useLanguage();

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
    }, 7000); // Slower for better reading
    return () => clearInterval(timer);
  }, [slides.length]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection > 0) {
      setCurrent((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
    } else {
      setCurrent((prev) => (prev === 0 ? Math.max(0, slides.length - 1) : prev - 1));
    }
  };

  const nextSlide = () => paginate(1);
  const prevSlide = () => paginate(-1);

  const whatsappLink = `https://wa.me/${BUSINESS_PHONE.replace('+', '')}?text=Hello, I want to inquire about your products.`;

  if (!slides.length || !slides[current]) {
    return null;
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '50%' : '-50%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '30%' : '-30%',
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="relative h-[550px] md:h-[750px] w-full overflow-hidden bg-black">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 200, damping: 30, mass: 0.8 },
            opacity: { duration: 0.6 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              nextSlide();
            } else if (swipe > swipeConfidenceThreshold) {
              prevSlide();
            }
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          {/* Background Image with Ken Burns effect */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-black/20" /> {/* Extra darkening */}
          </motion.div>

          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-3xl"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>New Arrival</span>
              </motion.div>

              <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tighter leading-[0.85] uppercase">
                {slides[current].title[language]}
              </h1>
              
              <div className="h-px w-24 bg-blue-500 mb-8" />

              <p className="text-lg md:text-2xl mb-12 text-gray-300 max-w-xl font-medium leading-relaxed">
                {slides[current].subtitle[language]}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  to="/shop"
                  className="group relative bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-full font-bold flex items-center justify-center space-x-3 transition-all overflow-hidden shadow-2xl shadow-blue-900/40"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <ShoppingBag className="h-6 w-6 relative z-10" />
                  <span className="relative z-10 uppercase tracking-wide">{slides[current].cta[language]}</span>
                </Link>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 px-10 py-5 rounded-full font-bold flex items-center justify-center space-x-3 transition-all"
                >
                  <WhatsAppIcon className="h-6 w-6 text-green-400" />
                  <span className="uppercase tracking-wide">{t('orderWhatsApp')}</span>
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* View Product Button */}
      {slides[current].productId && (
        <Link
          key={slides[current].productId}
          to={`/product/${slides[current].productId}`}
          className="group absolute top-4 right-4 sm:top-6 sm:right-12 z-20 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-xl shadow-blue-900/40"
        >
          <Eye className="h-4 w-4" />
          <span className="uppercase tracking-wide">View Product</span>
        </Link>
      )}

      {/* Modern Controls */}
      <div className="absolute bottom-12 right-4 sm:right-12 flex items-center space-x-4 z-20">
        <button
          onClick={prevSlide}
          className="p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-blue-500 font-bold text-lg leading-none">{current + 1}</span>
          <div className="h-8 w-px bg-white/20 my-1" />
          <span className="text-white/50 font-bold text-xs leading-none">{slides.length}</span>
        </div>
        <button
          onClick={nextSlide}
          className="p-4 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Progress Bars */}
      <div className="absolute bottom-12 left-4 sm:left-12 flex space-x-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group py-2"
          >
            <div className={cn(
              "h-1 transition-all duration-500 rounded-full",
              current === i ? "w-12 bg-blue-600" : "w-6 bg-white/30 group-hover:bg-white/60"
            )} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
