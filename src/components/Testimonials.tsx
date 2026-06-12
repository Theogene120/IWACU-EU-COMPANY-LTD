import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '../types';
import { cn } from '../lib/utils';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection > 0) {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    } else {
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    }
  };

  if (!testimonials || testimonials.length === 0) return null;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  const current = testimonials[currentIndex];

  return (
    <div className="relative overflow-hidden py-10">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="bg-white rounded-[2.5rem] p-8 md:p-14 shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left"
          >
            <div className="relative flex-shrink-0">
              <div className="absolute -top-4 -left-4 bg-blue-600 p-3 rounded-2xl shadow-lg z-10 text-white">
                <Quote className="h-6 w-6" />
              </div>
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                <img 
                  src={current.image || `https://ui-avatars.com/api/?name=${current.name}&background=random`} 
                  alt={current.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex justify-center md:justify-start gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-5 w-5", 
                      i < current.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                    )} 
                  />
                ))}
              </div>

              <p className="text-lg md:text-xl text-gray-700 italic leading-relaxed font-medium">
                "{current.message}"
              </p>

              <div>
                <h4 className="text-xl font-bold text-gray-900">{current.name}</h4>
                {current.location && (
                  <p className="text-sm text-blue-600 font-bold uppercase tracking-wider">{current.location}</p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex justify-center md:justify-start mt-8 space-x-4">
          <button 
            onClick={() => paginate(-1)}
            className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={() => paginate(1)}
            className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-10 gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className={cn(
                "h-1.5 transition-all duration-300 rounded-full",
                currentIndex === i ? "w-8 bg-blue-600" : "w-4 bg-gray-200 hover:bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
