import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FiX, FiMail, FiUser, FiPhone, FiLock, FiEye, FiEyeOff, FiCheck, FiArrowRight, FiCheckCircle, FiBookOpen, FiMapPin } from 'react-icons/fi';
import authBg from '../../assets/auth_bg.png';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      {/* Modal Container */}
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex overflow-hidden relative max-h-[94vh] border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs"
        >
          <FiX className="w-5 h-5" />
        </button>
        
        {/* Left side - Visual & Branding */}
        <div className="hidden lg:flex lg:w-5/12 relative bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white flex-col justify-between p-10 overflow-hidden">
          {/* Background Illustration & Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img 
              src={authBg} 
              alt="Tuition Class Background" 
              className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-blue-950/60 to-slate-950/80"></div>
            {/* Ambient Glows */}
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"></div>
          </div>

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20">
                <span className="text-white font-black text-lg tracking-wider">MW</span>
              </div>
              <div className="leading-tight">
                <span className="block font-extrabold text-white text-base tracking-tight">
                  Maleesha Wickramasinghe
                </span>
                <span className="block text-xs font-medium text-blue-300">
                  Tuition Classes
                </span>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="relative z-10 my-auto py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>New Student Enrollment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3 leading-snug">
              Start Your Journey to <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Academic Excellence</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-6">
              Join hundreds of students preparing for O/L Science & A/L Chemistry with island & district-ranked results.
            </p>

            {/* Feature Pills */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <FiCheck className="w-3 h-3" />
                </div>
                <span>Physical & Interactive Zoom Classes</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <FiCheck className="w-3 h-3" />
                </div>
                <span>Theory, MCQs & Structured Revision</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <FiCheck className="w-3 h-3" />
                </div>
                <span>Individual Mentoring & Doubt Support</span>
              </div>
            </div>
          </div>

          {/* Bottom Badge */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Prebhashi (Hettipola) & Focus (Hadungamuwa)</span>
          </div>
        </div>

        {/* Right side - Register Form */}
        <div className="w-full lg:w-7/12 flex flex-col justify-center p-6 sm:p-10 relative overflow-y-auto max-h-[92vh]">
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2.5 border border-blue-100">
                <span>Registration</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {submitted ? 'Request Received' : 'Create Account'}
              </h2>
              <p className="mt-1 text-slate-500 text-xs sm:text-sm">
                {submitted ? 'Waiting for teacher verification' : 'Fill in your details to register for tuition classes'}
              </p>
            </div>

            {submitted ? (
              /* Success / Pending Approval State */
              <div className="py-8 text-center space-y-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <FiCheckCircle className="w-10 h-10 text-emerald-600 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Registration Submitted Successfully!
                  </h3>
                  <p className="mt-2 text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you! Your account request has been forwarded to Mr. Maleesha Wickramasinghe. Once approved, you will be able to sign in immediately.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                >
                  Proceed to Sign in
                </button>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleRegister} className="space-y-3.5">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <FiMail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="student@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 text-sm placeholder-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* Name & Phone in 2 Columns */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <FiUser className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 text-slate-800 text-sm placeholder-slate-400 transition-all ${
                          errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600'
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <FiPhone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="07xxxxxxxx"
                        className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 text-slate-800 text-sm placeholder-slate-400 transition-all ${
                          errors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Grade & Institute in 2 Columns */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Grade <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <FiBookOpen className="w-4 h-4" />
                      </div>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-8 py-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 text-slate-800 text-sm transition-all appearance-none cursor-pointer ${
                          errors.grade ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600'
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
                    </div>
                    {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Institute <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <FiMapPin className="w-4 h-4" />
                      </div>
                      <select
                        name="institute"
                        value={formData.institute}
                        onChange={handleChange}
                        required
                        className={`w-full pl-10 pr-8 py-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 text-slate-800 text-sm transition-all appearance-none cursor-pointer ${
                          errors.institute ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600'
                        }`}
                      >
                        <option value="">Select Institute</option>
                        <option value="Prebhashi Hettipola">Prebhashi - Hettipola</option>
                        <option value="Focus Hadungamuwa">Focus - Hadungamuwa</option>
                      </select>
                    </div>
                    {errors.institute && <p className="text-red-500 text-xs mt-1">{errors.institute}</p>}
                  </div>
                </div>

                {/* Password & Confirm Password in 2 Columns */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <FiLock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="6+ characters"
                        className={`w-full pl-9 pr-9 py-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 text-slate-800 text-sm placeholder-slate-400 transition-all ${
                          errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Confirm <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <FiLock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Re-enter password"
                        className={`w-full pl-9 pr-9 py-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 text-slate-800 text-sm placeholder-slate-400 transition-all ${
                          errors.confirmPassword ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-600'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <FiEyeOff className="w-3.5 h-3.5" /> : <FiEye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 sm:py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-3"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Switch to Login */}
                <div className="pt-3 border-t border-slate-100 text-center">
                  <p className="text-xs sm:text-sm text-slate-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors"
                    >
                      Sign in here
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
