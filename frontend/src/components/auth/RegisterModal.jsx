import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FiX } from 'react-icons/fi';
import Input from '../UI/Input';
import Button from '../UI/Button';

import authBg from '../../assets/auth_bg.png';

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
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
      setFormData({
        name: '',
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
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.grade) newErrors.grade = 'Please select a grade';
    if (!formData.institute) newErrors.institute = 'Please select an institute';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden relative max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
        >
          <FiX size={20} />
        </button>
        
        {/* Left side - Image & Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={authBg} 
              alt="EduTeach Background" 
              className="w-full h-full object-cover opacity-90 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent"></div>
          </div>
          <div className="relative z-10 p-10 text-white text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30 shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4 tracking-tight leading-tight">Start Your Journey</h1>
            <p className="text-base text-blue-100/90 leading-relaxed font-light">
              Join thousands of students and get access to premium resources and personalized tuition.
            </p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 relative overflow-y-auto">
          <div className="absolute inset-0 lg:hidden z-0">
             <img src={authBg} alt="" className="w-full h-full object-cover opacity-10" />
             <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
          </div>

          <div className="w-full max-w-sm relative z-10 mx-auto">
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
              <p className="mt-2 text-gray-500 text-sm">{submitted ? 'Waiting for approval' : 'Join our classes today'}</p>
            </div>

            {submitted ? (
              <div className="py-6 text-center space-y-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center border-4 border-amber-100 shadow-inner">
                  <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M4.93 19h14.14a2 2 0 001.73-3L14.73 5a2 2 0 00-3.46 0L3.2 16a2 2 0 001.73 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Registration submitted successfully</h3>
                  <p className="mt-2 text-gray-600 text-sm">Please wait until your teacher approves your account.</p>
                </div>
                <Button type="button" className="w-full py-3 mt-2" onClick={onSwitchToLogin}>
                  Go to Login
                </Button>
              </div>
            ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <Input label="Email Address" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="student@example.com" className="bg-gray-50/50" />
              <Input label="Full Name" type="text" name="name" value={formData.name} onChange={handleChange} error={errors.name} required placeholder="John Doe" className="bg-gray-50/50" />
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade <span className="text-red-500">*</span>
                  </label>
                  <select name="grade" value={formData.grade} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" required>
                    <option value="">Select</option>
                    <option value="6">Grade 6</option>
                    <option value="7">Grade 7</option>
                    <option value="8">Grade 8</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="A/L">A/L Class</option>
                  </select>
                  {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institute <span className="text-red-500">*</span>
                  </label>
                  <select name="institute" value={formData.institute} onChange={handleChange} className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" required>
                    <option value="">Select</option>
                    <option value="Prebhashi Hettipola">Prebhashi</option>
                    <option value="Focus Hadungamuwa">Focus</option>
                  </select>
                  {errors.institute && <p className="text-red-500 text-xs mt-1">{errors.institute}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} required placeholder="6+ chars" className="bg-gray-50/50" />
                <Input label="Confirm" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required placeholder="Re-enter" className="bg-gray-50/50" />
              </div>

              <Button type="submit" className="w-full py-3 mt-2 font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-200" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>

              <div className="mt-6 border-t border-gray-200 text-center pt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button type="button" onClick={onSwitchToLogin} className="font-semibold text-primary hover:text-primary/80 transition-colors">
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