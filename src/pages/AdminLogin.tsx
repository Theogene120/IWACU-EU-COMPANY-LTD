import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Lock, AlertCircle, Info } from 'lucide-react';
import { BUSINESS_NAME } from '../constants';
import { motion } from 'motion/react';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showForgotInfo, setShowForgotInfo] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-gray-100"
      >
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
            <ShoppingCart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{BUSINESS_NAME}</h1>
          <p className="text-gray-500">Admin Dashboard Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Admin Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowForgotInfo(false)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                placeholder="Enter admin password"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center space-x-2 text-sm font-medium"
            >
              <AlertCircle className="h-5 w-5" />
              <span>Invalid password. Please try again.</span>
            </motion.div>
          )}

          {showForgotInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-blue-50 text-blue-800 p-4 rounded-xl text-xs space-y-2"
            >
              <p className="font-bold flex items-center gap-1">
                <Info className="h-3 w-3" /> Password Recovery
              </p>
              <p>To reset your admin password, please contact technical support or the CEO <span className="font-bold">MANIRAKIZA Emmanuel</span> at <span className="font-bold">+250 780 707 472</span>.</p>
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
          >
            Login to Dashboard
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setShowForgotInfo(!showForgotInfo)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Forgotten password?
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default AdminLogin;
