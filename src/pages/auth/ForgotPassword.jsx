import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Email address is required.');
      return;
    }
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      setSent(true);
      toast.success('Recovery link sent successfully if the email exists!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send recovery link.');
    } finally {
      setLoading(false);
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
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-400 mb-6 border border-emerald-500/20">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mb-3">Check Your Inbox</h3>
              <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                If <strong>{email}</strong> is registered on our platform, you will receive a secure 6-digit password reset code shortly.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg shadow-blue-500/20 transition-all duration-200"
                >
                  Continue to Reset Password
                </button>
                <button
                  onClick={() => setSent(false)}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all duration-200"
                >
                  Resend Code
                </button>
                <button
                  onClick={() => { window.dispatchEvent(new Event('auth:unauthorized')); navigate('/'); }}
                  className="w-full text-sm text-slate-400 hover:text-slate-200 transition-colors py-2"
                >
                  Back to sign in
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Recover Password</h2>
                <p className="text-sm text-slate-400">
                  Enter your registered email address below, and we'll send you instructions to reset your password.
                </p>
              </div>

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
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-250"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending link...
                  </span>
                ) : (
                  'Send Recovery Link'
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { window.dispatchEvent(new Event('auth:unauthorized')); navigate('/'); }}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors hover:underline"
                >
                  Back to login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
