import React from 'react';
import { BUSINESS_PHONE } from '../constants';
import { motion } from 'motion/react';
import WhatsAppIcon from './WhatsAppIcon';

const WhatsAppFloating = () => {
  const whatsappLink = `https://wa.me/${BUSINESS_PHONE.replace('+', '')}?text=Hello, I want to inquire about your products.`;

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 transition-colors"
    >
      <WhatsAppIcon className="h-8 w-8" />
      <span className="absolute right-full mr-3 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-semibold shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
        Chat with us
      </span>
    </motion.a>
  );
};

export default WhatsAppFloating;
