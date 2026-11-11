import { useState, useContext, useEffect, useRef } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import { resolveAssetUrl, formatShortDate } from '../../utils/dashboardUtils'
import {
  LayoutDashboard, BookOpen, FileText, Users, Video, DollarSign,
  Settings as SettingsIcon, LogOut, ChevronLeft,
  ChevronRight, Menu, X, Bell, ExternalLink
} from 'lucide-react'

// Sub-pages
import Overview from './Overview'
import MyClasses from './MyClasses'
import Students from './Students'
import Papers from './Papers'
import Videos from './Videos'
import Payments from './Payments'
import SettingsPage from './Settings'

export default function TeacherDashboard() {
  const { user, logout } = useContext(AuthContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [pendingReceiptsCount, setPendingReceiptsCount] = useState(0)
  const [pendingStudentsCount, setPendingStudentsCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef(null)
  const notifiedAboutStudents = useRef(false)
  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications])

  useEffect(() => {
    const fetchPendingData = async () => {
      try {
        const [receiptsRes, studentsRes, notifRes] = await Promise.all([
          api.get('/payments/receipts/pending').catch(() => ({ data: { payments: [] } })),
          api.get('/users/students').catch(() => ({ data: { users: [] } })),
          api.get('/notifications/my-notifications').catch(() => ({ data: [] })),
        ])
        
        const rCount = (receiptsRes.data.payments || []).length
        setPendingReceiptsCount(rCount)

        const allStudents = Array.isArray(studentsRes.data) ? studentsRes.data : (studentsRes.data?.users || [])
        const pCount = allStudents.filter(s => {
          const status = String(s.approvalStatus || s.approval_status || '').toLowerCase()
          return status === 'pending' || status === 'waiting' || (status !== 'approved' && status !== 'rejected' && status !== '')
        }).length

        setPendingStudentsCount(pCount)

        const rawNotifs = Array.isArray(notifRes.data) ? notifRes.data : (notifRes.data?.notifications || [])
        const normalizedNotifs = rawNotifs.map((n) => ({
          ...n,
          unread: Boolean(n?.unread ?? Number(n?.read) === 0),
          created_at: n?.created_at || n?.createdAt,
        }))
        setNotifications(normalizedNotifs)
        setUnreadCount(normalizedNotifs.filter((n) => n.unread).length)

        if (pCount > 0 && !notifiedAboutStudents.current) {
          toast.info(`You have ${pCount} pending student registration${pCount > 1 ? 's' : ''} to review.`, {
            autoClose: 6000,
            icon: '👋'
          })
          notifiedAboutStudents.current = true
        }
      } catch (error) {
        console.error('Error fetching pending data:', error)
      }
    }
    fetchPendingData()
    const interval = setInterval(fetchPendingData, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleToggleNotifications = async () => {
    const nextOpen = !showNotifications
    setShowNotifications(nextOpen)
    if (nextOpen && unreadCount > 0) {
      setUnreadCount(0)
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
      try {
        await api.patch('/notifications/mark-read')
      } catch (error) {
        console.error('Failed to mark teacher notifications as read:', error)
      }
    }
  }

  const navItems = [
    { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/teacher/classes',   icon: BookOpen,        label: 'Classes' },
    { path: '/teacher/students',  icon: Users,           label: 'Students', badge: pendingStudentsCount > 0 ? pendingStudentsCount : null },
    { path: '/teacher/papers',    icon: FileText,        label: 'Papers' },
    { path: '/teacher/videos',    icon: Video,           label: 'Videos' },
    { path: '/teacher/fees',      icon: DollarSign,      label: 'Fees', badge: pendingReceiptsCount > 0 ? pendingReceiptsCount : null },
    { path: '/teacher/settings',  icon: SettingsIcon,    label: 'Settings' },
  ]

  const getProfileSrc = (v) => resolveAssetUrl(v)

  const sidebarW = desktopCollapsed ? 'lg:w-20' : 'lg:w-64'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden cursor-pointer"
        />
      )}

      {/* ── Clean Light Sidebar ── */}
      <aside
        className={`fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300 w-72 max-w-[85vw] lg:max-w-none ${sidebarW} ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } bg-white border-r border-slate-200/90 shadow-sm`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
          <Link to="/" className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <span className="text-white font-black text-lg tracking-wider">MW</span>
          </Link>
          {!desktopCollapsed && (
            <div className="overflow-hidden">
              <p className="text-slate-900 font-extrabold text-sm tracking-tight leading-tight">MW Tuition</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[11px] font-semibold text-slate-500">Teacher Portal</p>
              </div>
            </div>
          )}
        </div>

        {/* Teacher Profile Card */}
        {!desktopCollapsed && (
          <Link
            to="/teacher/settings"
            onClick={() => setSidebarOpen(false)}
            className="mx-3.5 my-3.5 rounded-xl p-3 flex items-center gap-3 bg-slate-50/80 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 transition-all duration-200 group cursor-pointer"
          >
            {getProfileSrc(user?.profile_picture) ? (
              <img
                src={getProfileSrc(user?.profile_picture)}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-sm bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xs">
                {user?.name?.charAt(0).toUpperCase() || 'M'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-slate-900 font-bold text-xs truncate group-hover:text-blue-600 transition-colors">
                {user?.name || 'Maleesha Wickramasinghe'}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user?.email || 'Teacher Account'}
              </p>
            </div>
          </Link>
        )}

        {/* Navigation Label */}
        {!desktopCollapsed && (
          <p className="px-5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 mt-1">
            Menu
          </p>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path ||
              (item.path === '/teacher/dashboard' && (location.pathname === '/teacher' || location.pathname === '/teacher/'))
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border border-transparent'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600" />
                )}

                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                {!desktopCollapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="text-xs truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white bg-rose-500">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {desktopCollapsed && item.badge && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center text-white bg-rose-500">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {!desktopCollapsed && (
            <Link
              to="/"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>View Public Site</span>
            </Link>
          )}

          <button
            onClick={() => { setSidebarOpen(false); logout() }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-100"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            {!desktopCollapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setDesktopCollapsed(!desktopCollapsed)}
          className="hidden lg:flex m-3 p-2 rounded-xl items-center justify-center text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80"
          aria-label="Toggle sidebar collapse"
        >
          {desktopCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* ── Main Content Area ── */}
      <main className={`flex-1 transition-all duration-300 w-full min-w-0 ${desktopCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Clean Light Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
          {/* Mobile Menu Button & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(prev => !prev)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>Menu</span>
            </button>

            {/* Breadcrumb Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Teacher Portal</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">
                {navItems.find(n => n.path === location.pathname)?.label || 'Overview'}
              </span>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {pendingReceiptsCount > 0 && (
              <Link
                to="/teacher/fees"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-xs transition-all"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{pendingReceiptsCount} Pending Fees</span>
              </Link>
            )}

            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={handleToggleNotifications}
                className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 10).map((n) => (
                        <div key={n.id} className={`p-3.5 text-xs ${n.unread ? 'bg-blue-50/60' : 'bg-white'}`}>
                          <p className="text-slate-800 font-medium leading-snug">{n.message}</p>
                          <p className="text-[11px] text-slate-400 mt-1">{formatShortDate(n.created_at)}</p>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No notifications yet
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Site</span>
            </Link>

            {/* User Profile Pill */}
            <Link
              to="/teacher/settings"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors"
            >
              {getProfileSrc(user?.profile_picture) ? (
                <img
                  src={getProfileSrc(user?.profile_picture)}
                  alt={user?.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-blue-600 to-indigo-600">
                  {user?.name?.charAt(0).toUpperCase() || 'M'}
                </div>
              )}
              <span className="text-xs font-bold text-slate-800">
                {user?.name?.split(' ')[0] || 'Teacher'}
              </span>
            </Link>
          </div>
        </header>

        {/* Subpage Container */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="dashboard" element={<Overview />} />
            <Route path="classes"   element={<MyClasses />} />
            <Route path="students"  element={<Students />} />
            <Route path="papers"    element={<Papers />} />
            <Route path="videos"    element={<Videos />} />
            <Route path="fees"      element={<Payments />} />
            <Route path="settings"  element={<SettingsPage />} />
            <Route path="profile"   element={<SettingsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
