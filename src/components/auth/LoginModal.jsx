import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { toast } from 'react-toastify';
import { FiX } from 'react-icons/fi';

import authBg from '../../assets/auth_bg.png';

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Prevent aggressive browser autofill on page load
  const [emailReadOnly, setEmailReadOnly] = useState(true);
  const [passwordReadOnly, setPasswordReadOnly] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setFormData({ email: '', password: '' });
      setRememberMe(false);
      setEmailReadOnly(true);
      setPasswordReadOnly(true);
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
      // Error toast is already displayed by AuthContext
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            <h1 className="text-3xl font-bold mb-4 tracking-tight leading-tight">
              Welcome back to EduTeach
            </h1>
            <p className="text-base text-blue-100/90 leading-relaxed font-light">
              Empowering your learning journey with premium educational tools and expert guidance.
            </p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 relative overflow-y-auto">
          <div className="absolute inset-0 lg:hidden z-0">
             <img src={authBg} alt="" className="w-full h-full object-cover opacity-10" />
             <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
          </div>

          <div className="w-full max-w-sm relative z-10 mx-auto">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Sign in</h2>
              <p className="mt-2 text-gray-500 text-sm">Enter your details to access your account</p>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setEmailReadOnly(false)}
                readOnly={emailReadOnly}
                required
                placeholder="student@example.com"
                className="bg-gray-50/50"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordReadOnly(false)}
                readOnly={passwordReadOnly}
                required
                placeholder="Enter your password"
                className="bg-gray-50/50"
              />

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className="w-4 h-4 border-2 border-gray-300 rounded peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-colors">
                      <svg className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  type="button" 
                  onClick={onSwitchToRegister}
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
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