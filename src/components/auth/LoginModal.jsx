import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { FiX, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ email: '', password: '' });
      setRememberMe(false);
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password, { rememberMe });
      onClose();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex overflow-hidden relative max-h-[92vh] border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 z-20 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
        >
          <FiX className="w-5 h-5" />
        </button>
        
        {/* Left side - 3D Futuristic Glass Artwork & Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white flex-col items-center justify-between p-10 overflow-hidden select-none">
          {/* Ambient Lighting & Glows */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-sky-400/35 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl"></div>
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-300/20 rounded-full blur-2xl"></div>
          </div>

          {/* Top Brand Tag */}
          <div className="relative z-10 w-full flex items-center justify-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse"></span>
              <span>EduTeach • MW Tuition</span>
            </div>
          </div>

          {/* Center 3D Glass Artwork */}
          <div className="relative z-10 w-full flex flex-col items-center justify-center my-auto py-2">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-2xl overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="45%" stopColor="#93c5fd" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="ringGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                    <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.08" />
                  </linearGradient>
                  <linearGradient id="glassBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.10" />
                  </linearGradient>
                  <linearGradient id="sphereGrad" x1="30%" y1="20%" x2="90%" y2="90%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#93c5fd" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1e40af" stopOpacity="0.15" />
                  </linearGradient>
                  <filter id="glassBadgeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Floating Hexagonal Glass Prism (Top Right) */}
                <polygon 
                  points="255,50 280,65 280,95 255,110 230,95 230,65" 
                  fill="url(#glassBadgeGrad)" 
                  stroke="rgba(255,255,255,0.45)" 
                  strokeWidth="1.5"
                  className="opacity-80"
                  transform="rotate(10 255 80)"
                />

                {/* Floating Open Book Outline (Top Left) */}
                <g transform="translate(40, 75) rotate(-14) scale(0.95)" opacity="0.85">
                  <path d="M0,20 Q20,10 40,18 L40,48 Q20,40 0,50 Z" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
                  <path d="M40,18 Q60,10 80,20 L80,50 Q60,40 40,48 Z" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
                  <path d="M40,18 L40,48" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" />
                  <line x1="8" y1="28" x2="32" y2="25" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                  <line x1="8" y1="36" x2="32" y2="33" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                  <line x1="48" y1="25" x2="72" y2="28" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                  <line x1="48" y1="33" x2="72" y2="36" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                </g>

                {/* Large Outer Tilted Torus / Glass Ring */}
                <ellipse 
                  cx="145" cy="155" rx="105" ry="95" 
                  fill="none" 
                  stroke="url(#ringGrad1)" 
                  strokeWidth="24" 
                  strokeLinecap="round"
                  transform="rotate(-18 145 155)"
                  style={{ filter: 'drop-shadow(0 12px 24px rgba(14, 165, 233, 0.3))' }}
                />
                <ellipse 
                  cx="145" cy="155" rx="93" ry="83" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.65)" 
                  strokeWidth="1.5" 
                  transform="rotate(-18 145 155)"
                />
                <ellipse 
                  cx="145" cy="155" rx="117" ry="107" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.35)" 
                  strokeWidth="1.5" 
                  transform="rotate(-18 145 155)"
                />

                {/* Secondary Overlapping Glass Ring */}
                <ellipse 
                  cx="185" cy="145" rx="75" ry="70" 
                  fill="none" 
                  stroke="url(#ringGrad2)" 
                  strokeWidth="18" 
                  strokeLinecap="round"
                  transform="rotate(24 185 145)"
                  style={{ filter: 'drop-shadow(0 8px 18px rgba(30, 58, 138, 0.4))' }}
                />
                <ellipse 
                  cx="185" cy="145" rx="66" ry="61" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.65)" 
                  strokeWidth="1.5" 
                  transform="rotate(24 185 145)"
                />

                {/* Glass Bubble Spheres */}
                <circle cx="58" cy="190" r="16" fill="url(#sphereGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <circle cx="68" cy="78" r="8" fill="url(#sphereGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <circle cx="282" cy="220" r="10" fill="url(#sphereGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <circle cx="272" cy="168" r="5" fill="rgba(255,255,255,0.7)" />
                <circle cx="44" cy="235" r="5" fill="rgba(255,255,255,0.6)" />
                <circle cx="230" cy="255" r="7" fill="rgba(255,255,255,0.5)" />

                {/* Bottom Diagonal Glass Ring */}
                <ellipse 
                  cx="135" cy="225" rx="60" ry="40" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.25)" 
                  strokeWidth="10" 
                  transform="rotate(-10 135 225)"
                />

                {/* Center Floating Glass Squircle Badge with Graduation Cap */}
                <g transform="translate(125, 115)">
                  <rect x="0" y="0" width="70" height="70" rx="20" ry="20" fill="rgba(56, 189, 248, 0.35)" filter="url(#glassBadgeGlow)" />
                  <rect x="0" y="0" width="70" height="70" rx="20" ry="20" fill="url(#glassBadgeGrad)" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.8" />
                  
                  {/* Graduation Cap in pure white */}
                  <g transform="translate(16, 17) scale(1.6)">
                    <polygon points="12,3 23,8 12,13 1,8" fill="#ffffff" />
                    <path d="M5,10.2 L5,14.5 C5,17.5 8.1,20 12,20 C15.9,20 19,17.5 19,14.5 L19,10.2 L12,13.2 Z" fill="#ffffff" opacity="0.95" />
                    <path d="M20.5,9 L20.5,15.5 C20.5,16.5 21.5,17.5 22,18" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                  </g>
                </g>
              </svg>
            </div>

            {/* Typography matching mockup */}
            <div className="mt-4 text-center max-w-sm">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                Welcome back to EduTeach
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm mt-3 font-normal leading-relaxed">
                Empowering your learning journey with premium educational tools and expert guidance.
              </p>
            </div>
          </div>

          {/* Bottom Trust Note */}
          <div className="relative z-10 w-full text-center text-xs text-blue-200/80">
            <span>Official Student & Teacher Portal</span>
          </div>
        </div>

        {/* Right side - Login Form matching mockup */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-10 lg:p-12 relative overflow-y-auto">
          <div className="w-full max-w-sm mx-auto">
            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Sign in
              </h2>
              <p className="mt-1 text-slate-500 text-sm font-normal">
                Enter your details to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="student@example.com"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-11 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-slate-600">
                    Remember me
                  </span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm sm:text-base rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </form>

            {/* Switch to Register */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <button 
                  type="button" 
                  onClick={onSwitchToRegister}
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
                >
                  Create account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
