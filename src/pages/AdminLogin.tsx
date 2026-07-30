import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Lock, AlertCircle, Mail, KeyRound, CheckCircle } from 'lucide-react';
import { BUSINESS_NAME } from '../constants';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import PasswordInput from '../components/PasswordInput';

// API base URL — set VITE_API_URL in .env for production; empty string works with the dev proxy.
const API_BASE = import.meta.env.VITE_API_URL ?? '';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Forgot-password flow state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [resettable, setResettable] = useState(true);
  const [sendingCode, setSendingCode] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetting, setResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);
    if (success) {
      navigate('/admin');
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  const handleSendCode = async () => {
    if (!forgotEmail) {
      toast.error('Enter your email first');
      return;
    }
    setSendingCode(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/request-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send verification code');
      setCodeSent(true);
      setResettable(!!data.resettable);
      if (data.resettable) {
        toast.success('Verification code sent to the company email');
      } else {
        toast.success('Request sent to the super admin');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to send verification code');
    } finally {
      setSendingCode(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setResetting(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      toast.success('Password reset successfully. Please log in.');
      setShowForgot(false);
      setCodeSent(false);
      setForgotEmail('');
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setResetting(false);
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

        {!showForgot ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    placeholder="Enter admin email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Admin Password</label>
                <PasswordInput
                  icon={Lock}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="Enter admin password"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center space-x-2 text-sm font-medium"
                >
                  <AlertCircle className="h-5 w-5" />
                  <span>Invalid email or password. Please try again.</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-60"
              >
                {submitting ? 'Logging in...' : 'Login to Dashboard'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setForgotEmail(email); setShowForgot(true); }}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgotten password?
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-xs space-y-1">
              <p className="font-bold flex items-center gap-1">
                <Mail className="h-3 w-3" /> Password Reset
              </p>
              <p>Enter your email — a verification notice will be sent to the company address.</p>
            </div>

            {!codeSent ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      required
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      placeholder="Enter your admin email"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSendCode}
                  disabled={sendingCode}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-60"
                >
                  {sendingCode ? 'Sending...' : 'Send Reset Request'}
                </button>
              </div>
            ) : !resettable ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-xl text-sm flex items-start gap-3">
                <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <p>Your request has been sent to the company email. Only the super admin can reset your password — ask them to do it from the dashboard's Manage Admins section.</p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Verification Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      required
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      placeholder="6-digit code"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">New Password</label>
                  <PasswordInput
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                  <PasswordInput
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resetting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-60"
                >
                  {resetting ? 'Resetting...' : 'Reset Password'}
                </button>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={sendingCode}
                  className="w-full text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {sendingCode ? 'Sending...' : 'Resend code'}
                </button>
              </form>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  setShowForgot(false);
                  setCodeSent(false);
                  setResettable(true);
                  setForgotEmail('');
                  setCode('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Back to login
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLogin;
