import { useEffect, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { FiHome, FiBook, FiFileText, FiVideo, FiDollarSign, FiUser, FiBookOpen, FiLogOut, FiCheckCircle, FiClock, FiMenu, FiX } from 'react-icons/fi'
import Navbar from '../../components/Layout/Navbar'

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

export default function StudentDashboard() {
  const { user, logout } = useContext(AuthContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const [paymentBanner, setPaymentBanner] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const paymentParam = params.get('payment')
    const sessionFlag = sessionStorage.getItem('payment_success')
    const processingFlag = sessionStorage.getItem('payment_processing')

    if (paymentParam === 'success' || sessionFlag) {
      toast.success('Payment completed successfully!')
      setPaymentBanner('success')
      sessionStorage.removeItem('payment_success')

      // Clear processing flag if it exists
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
    // Close drawer on route changes in mobile view.
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    // Prevent background scroll when mobile drawer is open.
    if (window.innerWidth < 1024 && sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false)
      }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navbar />

      <div className="pt-20 lg:flex">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          id="student-dashboard-sidebar"
          className={`fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-72 max-w-[85vw] bg-white shadow-md flex flex-col overflow-y-auto transform transition-transform duration-200 ease-out lg:sticky lg:top-20 lg:z-20 lg:h-[calc(100vh-5rem)] lg:w-64 lg:max-w-none lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ minHeight: 'calc(100vh - 5rem)' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 lg:hidden">
            <p className="font-semibold text-gray-900">Menu</p>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col items-center gap-4">
              {user?.profile_picture ? (
                <img 
                  src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://localhost:5000${user.profile_picture}`}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-white text-3xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-600 font-medium">{user?.grade ? `Grade ${user.grade}` : 'Student'}</p>
              </div>
            </div>
          </div>
          
          <nav className="p-4 space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
          
          {/* Sign Out Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                setSidebarOpen(false)
                logout()
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              <FiLogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full flex-1 min-w-0 p-4 sm:p-6">
          <div className="mb-4 lg:hidden sticky top-24 z-20">
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-controls="student-dashboard-sidebar"
              aria-expanded={sidebarOpen}
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm"
            >
              {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              Menu
            </button>
          </div>

          {paymentBanner === 'success' && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 flex items-start gap-3">
              <FiCheckCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-semibold">Payment successful</p>
                <p className="text-sm opacity-90">Your payment is completed and saved in your payment history.</p>
              </div>
            </div>
          )}
          {paymentBanner === 'processing' && (
            <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900 flex items-start gap-3">
              <FiClock className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-semibold">Payment processing</p>
                <p className="text-sm opacity-90">Waiting for payment confirmation. Check Payment History in a moment.</p>
              </div>
            </div>
          )}
          <Routes>
            <Route index element={<StudentOverview />} />
            <Route path="dashboard" element={<Profile />} />
            <Route path="classes" element={<MyClasses />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="notes" element={<Notes />} />
            <Route path="past-papers" element={<PastPapers />} />
            <Route path="videos" element={<Videos />} />
            <Route path="payments" element={<PaymentHistory />} />
            <Route path="payments/success" element={<PaymentStatus status="success" />} />
            <Route path="payments/cancel" element={<PaymentStatus status="cancel" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
