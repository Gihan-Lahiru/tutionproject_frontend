import { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/axios';

function EyeIcon({ open }) {
  return open ? (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

const inputClass = `
  w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm
  text-slate-100 placeholder-slate-500
  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
  transition-all duration-200
`.trim();

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const presetEmail = useMemo(() => searchParams.get('email') || '', [searchParams]);

  const [email] = useState(presetEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checks = {
    minLength:  password.length >= 8,
    uppercase:  /[A-Z]/.test(password),
    lowercase:  /[a-z]/.test(password),
    number:     /[0-9]/.test(password),
    symbol:     /[^A-Za-z0-9]/.test(password),
  };
  const hasMinLength = password.length >= 6;
  const allStrong = Object.values(checks).every(Boolean);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error('Please enter the reset code.');
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
      window.dispatchEvent(new Event('auth:unauthorized'));
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please check your code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center py-12 px-4 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse [animation-delay:2s]" />

      <div className="max-w-md w-full z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Tuition Sir
            </h1>
          </Link>
          <p className="text-sm text-slate-400">Secure Learning Management System</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-1">Reset Password</h2>
              <p className="text-sm text-slate-400">Enter your reset code and set a new password.</p>
            </div>

            {/* Hidden email — sent transparently to API */}
            <input type="hidden" value={email} readOnly />

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
                placeholder="Enter reset code"
                required
                autoComplete="one-time-code"
                className={inputClass + ' font-mono tracking-widest text-center'}
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
                  autoComplete="new-password"
                  className={inputClass + ' pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Password strength panel — shows only while typing */}
            {password.length > 0 && (
              <div
                className="rounded-xl p-3 space-y-2"
                style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(99,102,241,0.2)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>
                  Password requirements
                </p>
                {[
                  { key: 'minLength', label: 'At least 8 characters' },
                  { key: 'uppercase', label: 'One uppercase letter (A–Z)' },
                  { key: 'lowercase', label: 'One lowercase letter (a–z)' },
                  { key: 'number',    label: 'One number (0–9)' },
                  { key: 'symbol',    label: 'One symbol (!@#$…)' },
                ].map(({ key, label }) => {
                  const passed = checks[key];
                  return (
                    <div key={key} className="flex items-center gap-2.5 transition-all duration-300">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{
                          background: passed ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                          border: passed ? '1.5px solid #10b981' : '1.5px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {passed ? (
                          <svg className="w-3 h-3" style={{ color: '#10b981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
                        )}
                      </span>
                      <span className="text-xs font-medium transition-colors duration-300" style={{ color: passed ? '#6ee7b7' : '#475569' }}>
                        {label}
                      </span>
                    </div>
                  );
                })}

                {/* Strength bar */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: '#475569' }}>Strength</span>
                    <span className="text-xs font-semibold" style={{
                      color: Object.values(checks).filter(Boolean).length <= 2 ? '#ef4444'
                           : Object.values(checks).filter(Boolean).length <= 3 ? '#f59e0b'
                           : Object.values(checks).filter(Boolean).length <= 4 ? '#3b82f6'
                           : '#10b981'
                    }}>
                      {Object.values(checks).filter(Boolean).length <= 2 ? 'Weak'
                       : Object.values(checks).filter(Boolean).length <= 3 ? 'Fair'
                       : Object.values(checks).filter(Boolean).length <= 4 ? 'Good'
                       : 'Strong'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${(Object.values(checks).filter(Boolean).length / 5) * 100}%`,
                        background: Object.values(checks).filter(Boolean).length <= 2 ? '#ef4444'
                                  : Object.values(checks).filter(Boolean).length <= 3 ? '#f59e0b'
                                  : Object.values(checks).filter(Boolean).length <= 4 ? '#3b82f6'
                                  : '#10b981',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Confirm New Password */}
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
                  autoComplete="new-password"
                  className={inputClass + ' pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={showConfirmPassword} />
                </button>
              </div>
            </div>

            {/* Match hint */}
            {confirmPassword.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <div className={`h-1.5 w-1.5 rounded-full transition-colors ${passwordsMatch ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className={passwordsMatch ? 'text-emerald-400' : 'text-red-400'}>
                  {passwordsMatch ? 'Passwords match ✓' : 'Passwords do not match'}
                </span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !code.trim() || !hasMinLength || !passwordsMatch}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
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

            <div className="text-center pt-2 flex items-center justify-center gap-4">
              <Link to="/forgot-password" className="text-xs text-slate-400 hover:text-slate-200 transition-colors hover:underline">
                Request new code
              </Link>
              <span className="text-slate-700">·</span>
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
