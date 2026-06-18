import { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const presetEmail = useMemo(() => searchParams.get('email') || '', [searchParams]);

  // Form states
  const [email, setEmail] = useState(presetEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live password checks
  const hasMinLength = password.length >= 6;
  const passwordsMatch = password && password === confirmPassword;
  const isEmailValid = email.trim().includes('@');
  const isCodeEntered = code.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailValid) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!isCodeEntered) {
      toast.error('Please enter the 6-digit reset code.');
      return;
    }

    if (!hasMinLength) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (!passwordsMatch) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/reset-password', {
        email: email.trim().toLowerCase(),
        code: code.trim(),
        password,
        confirmPassword,
      });

      toast.success(response.data?.message || 'Password reset successful! Please login.');
      // Dispatch unauthorized event to trigger login modal
      window.dispatchEvent(new Event('auth:unauthorized'));
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please check your code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-slate-955 bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Background blobs for premium glassmorphism effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse [animation-delay:2s]"></div>

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Tuition Sir
            </h1>
          </Link>
          <p className="text-sm text-slate-400">Secure Learning Management System</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:border-slate-700/80">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">Reset Password</h2>
              <p className="text-sm text-slate-400">
                Enter your recovery code and set a new password.
              </p>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-slate-955/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-250"
              />
            </div>

            {/* Reset Code */}
            <div>
              <label htmlFor="code" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Reset Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                className="w-full bg-slate-955/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-655 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-250 font-mono tracking-widest text-center"
              />
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="pass" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="pass"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full bg-slate-955/80 border border-slate-800 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-250"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPass" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPass"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full bg-slate-955/80 border border-slate-800 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-250"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Validation Hints */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${hasMinLength ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                <span className={hasMinLength ? 'text-emerald-400' : 'text-slate-500'}>Password is at least 6 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${passwordsMatch ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                <span className={passwordsMatch ? 'text-emerald-400' : 'text-slate-500'}>Passwords match</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isEmailValid || !isCodeEntered || !hasMinLength || !passwordsMatch}
              className="w-full relative flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Resetting password...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/forgot-password" className="text-xs text-slate-400 hover:text-slate-200 transition-colors mr-4 hover:underline">
                Request new code
              </Link>
              <button
                type="button"
                onClick={() => { window.dispatchEvent(new Event('auth:unauthorized')); navigate('/'); }}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors hover:underline"
              >
                Back to login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
