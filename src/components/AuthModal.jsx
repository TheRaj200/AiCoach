import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, KeyRound, ArrowRight, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { api } from '../config/api';

export const AuthModal = ({ isOpen, onClose, initialTab = 'login', onAuthSuccess }) => {
  const [tab, setTab] = useState(initialTab); // 'login' | 'register'
  const [step, setStep] = useState('form'); // 'form' | 'otp' (for registration)

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState(null);
  const [otpInfo, setOtpInfo] = useState(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleReset = (newTab) => {
    setTab(newTab);
    setStep('form');
    setError(null);
    setOtpInfo(null);
    setOtp('');
    setCooldown(0);
  };

  // Step 1: Submit Registration Form to send OTP
  const handleRegisterSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.requestOtp({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      setOtpInfo(res.message || `Verification code sent to ${email}`);
      setStep('otp');
      setCooldown(30);
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (isResending || cooldown > 0) return;
    setIsResending(true);
    setError(null);
    try {
      const res = await api.resendOtp({
        email: email.trim(),
        name: name.trim(),
        password,
      });
      setOtpInfo(res.message || `A fresh 6-digit code was sent to ${email}`);
      setCooldown(30);
    } catch (err) {
      setError(err.message || 'Failed to resend verification code');
    } finally {
      setIsResending(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the full 6-digit verification code');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await api.verifyOtp({
        email: email.trim(),
        otp: otp.trim(),
      });
      onAuthSuccess(result.user, result.token);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  // Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await api.login({
        email: email.trim(),
        password,
      });
      onAuthSuccess(result.user, result.token);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="surface-card w-full max-w-md rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl border border-white/[0.1] relative animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white">Ai<span className="text-blue-400">Coach</span></span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Account
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {tab === 'login' ? 'Sign in to access your saved interview reports' : 'Create an account to save session progress and history'}
          </p>
        </div>

        {/* Tab Switcher (when not in OTP step) */}
        {step !== 'otp' && (
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-medium">
            <button
              type="button"
              onClick={() => handleReset('login')}
              className={`py-2 rounded-lg transition ${
                tab === 'login'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleReset('register')}
              className={`py-2 rounded-lg transition ${
                tab === 'register'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register (OTP)
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/[0.08] border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            {error.toLowerCase().includes('already exists') && tab === 'register' && (
              <button
                type="button"
                onClick={() => handleReset('login')}
                className="shrink-0 underline font-bold text-white hover:text-cyan-300 text-[11px] ml-2"
              >
                Sign In →
              </button>
            )}
          </div>
        )}

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Register Step 1: Form */}
        {tab === 'register' && step === 'form' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Email Address (for OTP)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send 6-Digit OTP</span>
                  <KeyRound className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Register Step 2: OTP Verification */}
        {tab === 'register' && step === 'otp' && (
          <form onSubmit={handleOtpVerify} className="space-y-4">
            
            <div className="p-3 rounded-lg bg-blue-500/[0.08] border border-blue-500/20 text-blue-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>{otpInfo || `Verification code sent to ${email}.`}</span>
            </div>

            <div className="space-y-1.5 text-center">
              <label className="text-xs font-semibold text-slate-200">Enter 6-Digit Code</label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full py-3 text-center tracking-[12px] text-xl font-bold rounded-lg bg-white/[0.04] border border-white/[0.1] text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-2.5 rounded-lg font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-40"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify Code & Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-slate-400 hover:text-white transition"
              >
                ← Back to details
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || isResending || cooldown > 0}
                className="text-cyan-400 hover:text-cyan-300 transition disabled:text-slate-500 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : cooldown > 0 ? (
                  <span>Resend in {cooldown}s</span>
                ) : (
                  <span>Resend code</span>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
