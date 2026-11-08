import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FiX, FiEye, FiEyeOff } from 'react-icons/fi';

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    grade: '',
    institute: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setSubmitted(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setFormData({
        name: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        grade: '',
        institute: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (formData.password.length < 6) newErrors.password = 'Must be at least 6 characters';
    if (!formData.grade) newErrors.grade = 'Please select your grade';
    if (!formData.institute) newErrors.institute = 'Please select your institute';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registrationData } = formData;
      const userData = { ...registrationData, email };
      
      await api.post('/auth/register', userData);
      setSubmitted(true);
      toast.info('Registration submitted successfully. Please wait until your teacher approves your account.');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex overflow-hidden relative max-h-[94vh] border border-white/20"
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
        <div className="hidden lg:flex lg:w-5/12 relative bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 text-white flex-col items-center justify-between p-10 overflow-hidden select-none">
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
              <span>EduTeach • Student Registration</span>
            </div>
          </div>

          {/* Center 3D Glass Artwork */}
          <div className="relative z-10 w-full flex flex-col items-center justify-center my-auto py-2">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-2xl overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="regRingGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="45%" stopColor="#93c5fd" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="regRingGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                    <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.08" />
                  </linearGradient>
                  <linearGradient id="regGlassBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.10" />
                  </linearGradient>
                  <linearGradient id="regSphereGrad" x1="30%" y1="20%" x2="90%" y2="90%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#93c5fd" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1e40af" stopOpacity="0.15" />
                  </linearGradient>
                  <filter id="regGlassBadgeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Floating Hexagon */}
                <polygon 
                  points="255,50 280,65 280,95 255,110 230,95 230,65" 
                  fill="url(#regGlassBadgeGrad)" 
                  stroke="rgba(255,255,255,0.45)" 
                  strokeWidth="1.5"
                  className="opacity-80"
                  transform="rotate(10 255 80)"
                />

                {/* Floating Book Outline */}
                <g transform="translate(40, 75) rotate(-14) scale(0.95)" opacity="0.85">
                  <path d="M0,20 Q20,10 40,18 L40,48 Q20,40 0,50 Z" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
                  <path d="M40,18 Q60,10 80,20 L80,50 Q60,40 40,48 Z" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
                  <path d="M40,18 L40,48" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" />
                </g>

                {/* Large Ring */}
                <ellipse 
                  cx="145" cy="155" rx="105" ry="95" 
                  fill="none" 
                  stroke="url(#regRingGrad1)" 
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

                {/* Secondary Ring */}
                <ellipse 
                  cx="185" cy="145" rx="75" ry="70" 
                  fill="none" 
                  stroke="url(#regRingGrad2)" 
                  strokeWidth="18" 
                  strokeLinecap="round"
                  transform="rotate(24 185 145)"
                  style={{ filter: 'drop-shadow(0 8px 18px rgba(30, 58, 138, 0.4))' }}
                />

                {/* Bubbles */}
                <circle cx="58" cy="190" r="16" fill="url(#regSphereGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <circle cx="282" cy="220" r="10" fill="url(#regSphereGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <circle cx="44" cy="235" r="5" fill="rgba(255,255,255,0.6)" />

                {/* Center Badge with Graduation Cap */}
                <g transform="translate(125, 115)">
                  <rect x="0" y="0" width="70" height="70" rx="20" ry="20" fill="rgba(56, 189, 248, 0.35)" filter="url(#regGlassBadgeGlow)" />
                  <rect x="0" y="0" width="70" height="70" rx="20" ry="20" fill="url(#regGlassBadgeGrad)" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.8" />
                  
                  <g transform="translate(16, 17) scale(1.6)">
                    <polygon points="12,3 23,8 12,13 1,8" fill="#ffffff" />
                    <path d="M5,10.2 L5,14.5 C5,17.5 8.1,20 12,20 C15.9,20 19,17.5 19,14.5 L19,10.2 L12,13.2 Z" fill="#ffffff" opacity="0.95" />
                    <path d="M20.5,9 L20.5,15.5 C20.5,16.5 21.5,17.5 22,18" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
                  </g>
                </g>
              </svg>
            </div>

            {/* Typography */}
            <div className="mt-4 text-center max-w-sm">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                Join EduTeach
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm mt-3 font-normal leading-relaxed">
                Empowering your learning journey with premium educational tools and expert guidance.
              </p>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="relative z-10 w-full text-center text-xs text-blue-200/80">
            <span>Fast, direct approval by your teacher</span>
          </div>
        </div>

        {/* Right side - Form Container */}
        <div className="w-full lg:w-7/12 flex flex-col justify-center p-6 sm:p-10 relative overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Create account
              </h2>
              <p className="mt-1 text-slate-500 text-sm font-normal">
                Enter your details to create your student account
              </p>
            </div>

            {submitted ? (
              /* Success Confirmation */
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-200">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Registration Submitted!
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you! Your registration has been sent to your teacher for approval. Once approved, you can sign in directly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer mt-4"
                >
                  Proceed to Sign in
                </button>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleRegister} className="space-y-3.5">
                {/* Full Name & Email in 2 Columns */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className={`w-full px-4 py-2.5 sm:py-3 bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="student@example.com"
                      className="w-full px-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Phone & Grade in 2 Columns */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="0712345678"
                      className={`w-full px-4 py-2.5 sm:py-3 bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Grade
                    </label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2.5 sm:py-3 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                        errors.grade ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                    >
                      <option value="">Select Grade</option>
                      <option value="6">Grade 6</option>
                      <option value="7">Grade 7</option>
                      <option value="8">Grade 8</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                      <option value="11">Grade 11</option>
                      <option value="A/L">A/L Chemistry</option>
                    </select>
                    {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
                  </div>
                </div>

                {/* Institute Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Institute / Location
                  </label>
                  <select
                    name="institute"
                    value={formData.institute}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2.5 sm:py-3 bg-white border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                      errors.institute ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  >
                    <option value="">Select Institute</option>
                    <option value="Prebhashi Hettipola">Prebhashi - Hettipola</option>
                    <option value="Focus Hadungamuwa">Focus - Hadungamuwa</option>
                  </select>
                  {errors.institute && <p className="text-red-500 text-xs mt-1">{errors.institute}</p>}
                </div>

                {/* Password & Confirm Password in 2 Columns */}
                <div className="grid sm:grid-cols-2 gap-3">
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
                        placeholder="6+ characters"
                        className={`w-full px-4 py-2.5 sm:py-3 pr-10 bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Re-enter password"
                        className={`w-full px-4 py-2.5 sm:py-3 pr-10 bg-white border rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.confirmPassword ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm sm:text-base rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-3"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <span>Create account</span>
                  )}
                </button>

                {/* Switch to Login */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
