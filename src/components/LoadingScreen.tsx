import React from 'react';
import { motion } from 'motion/react';
import { BUSINESS_NAME } from '../constants';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="relative flex items-center justify-center h-24 w-24">
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600"
        />
        <motion.img
          src="/logo.png"
          alt={BUSINESS_NAME}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="h-14 w-14 rounded-xl object-contain"
        />
      </div>
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="mt-6 text-sm font-semibold tracking-wide text-gray-500"
      >
        Loading {BUSINESS_NAME}...
      </motion.p>
    </div>
  );
};

export default LoadingScreen;
