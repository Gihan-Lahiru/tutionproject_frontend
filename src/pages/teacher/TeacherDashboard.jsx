import { useState, useContext, useEffect, useRef } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import api from '../../api/axios'
import { toast } from 'react-toastify'
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
  const notifiedAboutStudents = useRef(false)
  const location = useLocation()

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const fetchPendingData = async () => {
      try {
        const [receiptsRes, studentsRes] = await Promise.all([
          api.get('/payments/receipts/pending').catch(() => ({ data: { payments: [] } })),
          api.get('/users/students').catch(() => ({ data: { users: [] } }))
        ])
        
        const rCount = (receiptsRes.data.payments || []).length
        setPendingReceiptsCount(rCount)

        const allStudents = Array.isArray(studentsRes.data) ? studentsRes.data : (studentsRes.data?.users || [])
        const pCount = allStudents.filter(s => {
          const status = String(s.approvalStatus || s.approval_status || '').toLowerCase()
          return status === 'pending' || status === 'waiting' || (status !== 'approved' && status !== 'rejected' && status !== '')
        }).length

        setPendingStudentsCount(pCount)

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

  const navItems = [
    { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/teacher/classes',   icon: BookOpen,        label: 'Classes' },
    { path: '/teacher/students',  icon: Users,           label: 'Students', badge: pendingStudentsCount > 0 ? pendingStudentsCount : null },
    { path: '/teacher/papers',    icon: FileText,        label: 'Papers' },
    { path: '/teacher/videos',    icon: Video,           label: 'Videos' },
    { path: '/teacher/fees',      icon: DollarSign,      label: 'Fees', badge: pendingReceiptsCount > 0 ? pendingReceiptsCount : null },
    { path: '/teacher/settings',  icon: SettingsIcon,    label: 'Settings' },
  ]

  const getProfileSrc = (v) => {
    if (!v) return ''
    const s = String(v).trim()
    if (!s) return ''
    if (s.startsWith('http') || s.startsWith('data:')) return s
    return s.startsWith('/') ? `http://localhost:5000${s}` : `http://localhost:5000/${s}`
  }

  const sidebarW = desktopCollapsed ? 'lg:w-20' : 'lg:w-64'

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden cursor-pointer"
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={`fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300 w-72 max-w-[85vw] lg:max-w-none ${sidebarW} ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } bg-slate-950 border-r border-slate-800/80 shadow-2xl shadow-black/40`}
        >
          {/* Logo / Brand Header */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/80">
            <Link to="/" className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-400 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <span className="text-white font-black text-lg tracking-wider">MW</span>
            </Link>
            {!desktopCollapsed && (
              <div className="overflow-hidden">
                <p className="text-white font-extrabold text-sm tracking-tight leading-tight">MW Tuition</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <p className="text-[11px] font-medium text-slate-400">Teacher Portal</p>
                </div>
              </div>
            )}
          </div>

          {/* Teacher Profile Quick Card */}
          {!desktopCollapsed && (
            <Link
              to="/teacher/settings"
              onClick={() => setSidebarOpen(false)}
              className="mx-3.5 my-3.5 rounded-xl p-3 flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/30 transition-all duration-200 group cursor-pointer"
            >
              {getProfileSrc(user?.profile_picture) ? (
                <img
                  src={getProfileSrc(user?.profile_picture)}
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-blue-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-sm bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'M'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-xs truncate group-hover:text-blue-400 transition-colors">
                  {user?.name || 'Maleesha Wickramasinghe'}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.email || 'Teacher Account'}
                </p>
              </div>
            </Link>
          )}

          {/* Navigation Label */}
          {!desktopCollapsed && (
            <p className="px-5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 mt-1">
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
                      ? 'bg-blue-600/15 text-white font-bold border border-blue-500/25 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium border border-transparent'
                  }`}
                >
                  {/* Left Active Indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-500" />
                  )}

                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 group-hover:text-white'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {!desktopCollapsed && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="text-xs truncate font-medium">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white bg-rose-500 animate-pulse">
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

          {/* Bottom Actions: View Public Site & Sign Out */}
          <div className="p-3 border-t border-slate-800/80 space-y-2">
            {!desktopCollapsed && (
              <Link
                to="/"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span>View Public Site</span>
              </Link>
            )}

            <button
              onClick={() => { setSidebarOpen(false); logout() }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              {!desktopCollapsed && <span>Sign Out</span>}
            </button>
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setDesktopCollapsed(!desktopCollapsed)}
            className="hidden lg:flex m-3 p-2 rounded-xl items-center justify-center text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5"
            aria-label="Toggle sidebar collapse"
          >
            {desktopCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </aside>

        {/* ── Main Content Area ── */}
        <main className={`flex-1 transition-all duration-300 w-full min-w-0 ${desktopCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          {/* Top Header Bar */}
          <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
            {/* Mobile Menu Trigger */}
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
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="text-slate-400">Teacher Portal</span>
                <span>/</span>
                <span className="text-blue-600 font-bold">
                  {navItems.find(n => n.path === location.pathname)?.label || 'Overview'}
                </span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {pendingReceiptsCount > 0 && (
                <Link
                  to="/teacher/fees"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-sm transition-all"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{pendingReceiptsCount} Pending Fees</span>
                </Link>
              )}

              <Link
                to="/"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Public Site</span>
              </Link>

              {/* User Pill */}
              <Link
                to="/teacher/settings"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 transition-colors"
              >
                {getProfileSrc(user?.profile_picture) ? (
                  <img
                    src={getProfileSrc(user?.profile_picture)}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover"
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

          {/* Subpage Content */}
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
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}
