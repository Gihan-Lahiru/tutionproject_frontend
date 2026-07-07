import { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { FiHome, FiBook, FiFileText, FiVideo, FiDollarSign, FiUser, FiBookOpen, FiLogOut, FiCheckCircle, FiClock, FiMenu, FiX, FiUploadCloud, FiAlertCircle, FiSettings, FiActivity } from 'react-icons/fi'
import Navbar from '../../components/Layout/Navbar'
import api from '../../api/axios'

// Sub-pages
import StudentOverview from './StudentOverview'
import MyClasses from './MyClasses'
import Assignments from './Assignments'
import Notes from './Notes'
import Videos from './Videos'
import PaymentHistory from './PaymentHistory'
import Profile from './Profile'
import PastPapers from './PastPapers'
import PaymentStatus from './PaymentStatus'

// ── Payment Notice Banner ────────────────────────────────────────────────────
function PaymentNoticeBanner({ user }) {
  const [expanded, setExpanded] = useState(false)
  const [file, setFile] = useState(null)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isPending = user?.paymentStatus === 'pending_verification'
  const isRejected = user?.paymentStatus === 'rejected'

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) { toast.error('Please select a receipt file'); return }
    setSubmitting(true)
    const formData = new FormData()
    formData.append('receipt', file)
    if (note) formData.append('note', note)
    try {
      await api.post('/payments/upload-receipt', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Receipt uploaded! Waiting for teacher approval.')
      setTimeout(() => window.location.reload(), 1500)
    } catch {
      toast.error('Failed to upload receipt')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="mb-6 rounded-2xl overflow-hidden"
      style={{
        border: isPending
          ? '1.5px solid rgba(245,158,11,0.3)'
          : isRejected
          ? '1.5px solid rgba(239,68,68,0.3)'
          : '1.5px solid rgba(239,68,68,0.3)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}
    >
      {/* Banner header */}
      <div
        className="flex items-center justify-between p-4 sm:p-5"
        style={{
          background: isPending
            ? 'linear-gradient(135deg,rgba(245,158,11,0.1),rgba(251,191,36,0.06))'
            : isRejected
            ? 'linear-gradient(135deg,rgba(239,68,68,0.1),rgba(248,113,113,0.06))'
            : 'linear-gradient(135deg,rgba(239,68,68,0.1),rgba(248,113,113,0.06))',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: isPending ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
            }}
          >
            {isPending
              ? <FiClock className="w-5 h-5" style={{ color: '#f59e0b' }} />
              : <FiAlertCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
            }
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: isPending ? '#92400e' : '#991b1b' }}>
              {isPending
                ? 'Receipt submitted — waiting for teacher approval'
                : isRejected
                ? 'Payment receipt was rejected — please re-upload'
                : 'Payment overdue — notes & videos locked for this month'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: isPending ? '#b45309' : '#b91c1c' }}>
              {isPending
                ? 'Your receipt has been received. Once approved, full access is restored.'
                : 'Upload your payment receipt to restore full access.'}
            </p>
          </div>
        </div>
        {!isPending && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all"
            style={{
              background: isRejected ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.12)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            <FiUploadCloud className="w-4 h-4" />
            {expanded ? 'Hide' : 'Upload Receipt'}
          </button>
        )}
      </div>

      {/* Expandable upload form */}
      {expanded && !isPending && (
        <div className="p-4 sm:p-5 bg-white" style={{ borderTop: '1px solid rgba(239,68,68,0.12)' }}>
          <form onSubmit={handleUpload} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Receipt Image / PDF</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Note (optional)</label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Paid for July..."
                className="w-full rounded-xl px-3 py-2 text-sm border border-gray-200 outline-none focus:border-blue-400"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !file}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}
            >
              <FiUploadCloud />
              {submitting ? 'Uploading...' : 'Submit Receipt'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

// ── Locked Content Placeholder ───────────────────────────────────────────────
function LockedContent() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,rgba(239,68,68,0.12),rgba(248,113,113,0.08))', border: '1.5px solid rgba(239,68,68,0.2)' }}
      >
        <svg className="w-8 h-8" style={{ color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <div className="text-center">
        <p className="font-bold text-lg" style={{ color: '#1e293b' }}>Content locked for this month</p>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>Upload your payment receipt to restore access to notes, videos, and papers.</p>
      </div>
    </div>
  )
}

// ── Student Dashboard ────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const { user, logout } = useContext(AuthContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const [paymentBanner, setPaymentBanner] = useState(null)

  const getProfileImageSrc = (value) => {
    if (!value) return ''
    const raw = String(value).trim()
    if (!raw) return ''
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
      return raw
    }
    const backendOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')
    return raw.startsWith('/') ? `${backendOrigin}${raw}` : `${backendOrigin}/${raw}`
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const paymentParam = params.get('payment')
    const sessionFlag = sessionStorage.getItem('payment_success')
    const processingFlag = sessionStorage.getItem('payment_processing')

    if (paymentParam === 'success' || sessionFlag) {
      toast.success('Payment completed successfully!')
      setPaymentBanner('success')
      sessionStorage.removeItem('payment_success')
      sessionStorage.removeItem('payment_processing')
      if (paymentParam) {
        window.history.replaceState(null, '', location.pathname)
      }
      const t = setTimeout(() => setPaymentBanner(null), 8000)
      return () => clearTimeout(t)
    }

    if (paymentParam === 'processing' || processingFlag) {
      toast.info('Payment received. Waiting for confirmation…')
      setPaymentBanner('processing')
      sessionStorage.removeItem('payment_processing')
      if (paymentParam) {
        window.history.replaceState(null, '', location.pathname)
      }
      const t = setTimeout(() => setPaymentBanner(null), 10000)
      return () => clearTimeout(t)
    }
  }, [location.pathname, location.search])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (window.innerWidth < 1024 && sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false)
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const navItems = [
    { path: '/student/dashboard', icon: FiUser, label: 'Profile' },
    { path: '/student/notes', icon: FiFileText, label: 'Notes' },
    { path: '/student/past-papers', icon: FiBookOpen, label: 'Papers' },
    { path: '/student/assignments', icon: FiFileText, label: 'Assignments' },
    { path: '/student/videos', icon: FiVideo, label: 'Video Lessons' },
    { path: '/student/payments', icon: FiDollarSign, label: 'Payments' },
  ]

  if (user?.approvalStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
          <div className="mx-auto w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mb-6">
            <FiClock className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Waiting for Approval</h2>
          <p className="text-slate-400 mb-8 leading-relaxed text-sm">
            Your registration has been submitted and is currently under review. Please wait until sir confirms your account to access the classes and dashboard.
          </p>
          <button
            onClick={logout}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-95 transition-all"
          >
            Log Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-20 lg:flex min-h-screen">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          id="student-dashboard-sidebar"
          className={`fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-72 max-w-[85vw] flex flex-col border-r border-slate-200 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-out lg:sticky lg:top-20 lg:z-20 lg:w-64 lg:max-w-none lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Profile card with direct clickable settings shortcut */}
          <Link
            to="/student/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="p-6 border-b border-slate-800/60 flex items-center gap-3 hover:bg-slate-800/40 transition-all duration-200 group cursor-pointer"
          >
            {getProfileImageSrc(user?.profile_picture) ? (
              <img 
                src={getProfileImageSrc(user.profile_picture)}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover shrink-0 group-hover:border-purple-400 transition-colors"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                <span className="text-white text-base font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm text-slate-100 truncate group-hover:text-blue-400 transition-colors">{user?.name}</p>
              <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                {user?.grade
                  ? (String(user.grade).toLowerCase().startsWith('grade') ? user.grade : `Grade ${user.grade}`)
                  : 'Student'}
              </p>
            </div>
            <FiSettings className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-slate-300 transition-colors" />
          </Link>
          
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg,rgba(59,130,246,0.2),rgba(99,102,241,0.1))'
                      : 'transparent',
                    border: isActive ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                    color: isActive ? '#fff' : '#94a3b8'
                  }}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full"
                      style={{ background: 'linear-gradient(180deg,#3b82f6,#6366f1)' }}
                    />
                  )}
                  <Icon className="w-5 h-5 shrink-0" style={{ color: isActive ? '#3b82f6' : '#64748b' }} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </Link>
              )
            })}
          </nav>
          
          <div className="p-4 border-t border-slate-800/60">
            <button
              onClick={() => { setSidebarOpen(false); logout(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
            >
              <FiLogOut className="w-5 h-5 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="w-full flex-1 min-w-0 p-4 sm:p-6 lg:p-8 bg-slate-50">
          {/* Mobile menu trigger */}
          <div className="mb-4 lg:hidden sticky top-24 z-20">
            <button
              type="button"
              onClick={() => setSidebarOpen(prev => !prev)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
            >
              {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              Menu
            </button>
          </div>

          {paymentBanner === 'success' && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-emerald-800 flex items-start gap-3 shadow-sm">
              <FiCheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-bold text-sm">Payment successful</p>
                <p className="text-xs opacity-90 mt-0.5">Your payment is completed and saved in your payment history.</p>
              </div>
            </div>
          )}
          {paymentBanner === 'processing' && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-amber-900 flex items-start gap-3 shadow-sm">
              <FiClock className="h-5 w-5 mt-0.5 shrink-0 text-amber-600" />
              <div>
                <p className="font-bold text-sm">Payment processing</p>
                <p className="text-xs opacity-90 mt-0.5">Waiting for payment confirmation. Check Payment History in a moment.</p>
              </div>
            </div>
          )}

          {user?.dashboardAccess === false && <PaymentNoticeBanner user={user} />}

          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<StudentOverview />} />
              <Route path="dashboard" element={<Profile />} />
              <Route path="classes" element={<MyClasses />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="notes" element={user?.dashboardAccess === false ? <LockedContent /> : <Notes />} />
              <Route path="past-papers" element={user?.dashboardAccess === false ? <LockedContent /> : <PastPapers />} />
              <Route path="videos" element={user?.dashboardAccess === false ? <LockedContent /> : <Videos />} />
              <Route path="payments" element={<PaymentHistory />} />
              <Route path="payments/success" element={<PaymentStatus status="success" />} />
              <Route path="payments/cancel" element={<PaymentStatus status="cancel" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}
