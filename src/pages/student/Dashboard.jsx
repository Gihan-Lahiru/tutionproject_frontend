import { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { FiHome, FiBook, FiFileText, FiVideo, FiDollarSign, FiUser, FiBookOpen, FiLogOut, FiCheckCircle, FiClock, FiMenu, FiX, FiUploadCloud, FiAlertCircle, FiSettings, FiActivity, FiClipboard, FiExternalLink } from 'react-icons/fi'
import Navbar from '../../components/Layout/Navbar'
import api from '../../api/axios'
import { resolveAssetUrl, formatGradeLabel } from '../../utils/dashboardUtils'

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
import QuizzesView from './QuizzesView'
import AttendanceView from './AttendanceView'

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

  const getProfileImageSrc = (value) => resolveAssetUrl(value)

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
    { path: '/student/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/student/classes', icon: FiBook, label: 'Classes' },
    { path: '/student/notes', icon: FiFileText, label: 'Notes' },
    { path: '/student/past-papers', icon: FiBookOpen, label: 'Past Papers' },
    { path: '/student/assignments', icon: FiClipboard, label: 'Assignments' },
    { path: '/student/quizzes', icon: FiCheckCircle, label: 'Timed Quizzes' },
    { path: '/student/attendance', icon: FiActivity, label: 'Attendance & Marks' },
    { path: '/student/videos', icon: FiVideo, label: 'Video Lessons' },
    { path: '/student/payments', icon: FiDollarSign, label: 'Payments' },
    { path: '/student/profile', icon: FiUser, label: 'Profile' },
  ]

  if (user?.approvalStatus === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl">
          <div className="mx-auto w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mb-5">
            <FiClock className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Waiting for Approval</h2>
          <p className="text-slate-500 mb-6 leading-relaxed text-sm">
            Your registration has been submitted and is currently under review by Mr. Maleesha Wickramasinghe. Once approved, you will have immediate access to your classes, notes, and video lessons.
          </p>
          <button
            onClick={logout}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 transition-all cursor-pointer shadow-md"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Below navbar — fills remaining viewport (matches Navbar height h-16 md:h-20) */}
      <div className="flex flex-1 overflow-hidden mt-16 md:mt-20">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden cursor-pointer"
          />
        )}

        {/* ── Modern Clean Light Sidebar ── */}
        <aside
          id="student-dashboard-sidebar"
          className={`fixed left-0 top-16 md:top-20 z-40 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-72 max-w-[85vw] flex flex-col border-r border-slate-200/90 bg-white text-slate-700 transform transition-transform duration-300 ease-out lg:static lg:top-auto lg:z-auto lg:h-[calc(100vh-5rem)] lg:w-64 lg:max-w-none lg:translate-x-0 lg:flex-shrink-0 lg:overflow-y-auto shadow-xs ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <span className="text-white font-black text-lg tracking-wider">MW</span>
            </div>
            <div>
              <p className="text-slate-900 font-extrabold text-sm tracking-tight leading-tight">MW Tuition</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <p className="text-[11px] font-semibold text-slate-500">Student Portal</p>
              </div>
            </div>
          </div>

          {/* Profile Card in Sidebar */}
          <Link
            to="/student/profile"
            onClick={() => setSidebarOpen(false)}
            className="mx-3.5 my-3.5 rounded-xl p-3 flex items-center gap-3 bg-slate-50/80 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 transition-all duration-200 group cursor-pointer"
          >
            {getProfileImageSrc(user?.profile_picture) ? (
              <img 
                src={getProfileImageSrc(user.profile_picture)}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-xs text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm text-slate-900 truncate group-hover:text-blue-600 transition-colors">{user?.name}</p>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                {user?.grade ? formatGradeLabel(user.grade) : 'Student'}
              </p>
            </div>
            <FiSettings className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          </Link>
          
          {/* Navigation Items */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = item.path === '/student/dashboard'
                ? (location.pathname === '/student' || location.pathname === '/student/' || location.pathname === '/student/dashboard')
                : item.path === '/student/profile'
                ? (location.pathname === '/student/profile' || location.pathname === '/student/settings')
                : location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative text-sm font-semibold"
                  style={{
                    background: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#2563eb' : '#64748b',
                    border: isActive ? '1px solid #bfdbfe' : '1px solid transparent',
                  }}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
                      style={{ background: '#2563eb' }}
                    />
                  )}
                  <Icon className="w-4 h-4 shrink-0" style={{ color: isActive ? '#2563eb' : '#94a3b8' }} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
          
          {/* Bottom Area */}
          <div className="p-3 border-t border-slate-100 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <FiExternalLink className="w-4 h-4 text-slate-400" />
              <span>View Public Site</span>
            </Link>
            <button
              onClick={() => { setSidebarOpen(false); logout(); }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8 bg-slate-50">
          {/* Mobile menu trigger */}
          <div className="mb-4 lg:hidden sticky top-0 z-20">
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
              <Route path="dashboard" element={<StudentOverview />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Profile />} />
              <Route path="classes" element={<MyClasses />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="quizzes" element={<QuizzesView />} />
              <Route path="attendance" element={<AttendanceView />} />
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
