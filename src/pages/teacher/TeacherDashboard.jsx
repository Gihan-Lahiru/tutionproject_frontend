import { useState, useContext, useEffect, useRef } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import {
  LayoutDashboard, BookOpen, FileText, Users, Video, DollarSign,
  Settings as SettingsIcon, LogOut, GraduationCap, ChevronLeft,
  ChevronRight, Menu, X, Bell
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#f0f4ff 0%,#f8fafc 100%)' }}>
      <div className="flex">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={`fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300 w-72 max-w-[85vw] lg:max-w-none ${sidebarW} ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
          style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)',
            boxShadow: '4px 0 32px rgba(0,0,0,0.25)',
          }}
        >
          {/* Logo / Brand */}
          <div
            className="flex items-center gap-3 px-6 py-5 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}
            >
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {!desktopCollapsed && (
              <div className="overflow-hidden">
                <p className="text-white font-bold text-base leading-tight">EduTeach</p>
                <p className="text-xs font-medium" style={{ color: '#94a3b8' }}>Teacher Portal</p>
              </div>
            )}
          </div>

          {/* Teacher profile card (Clickable Settings shortcut) */}
          {!desktopCollapsed && (
            <Link
              to="/teacher/settings"
              onClick={() => setSidebarOpen(false)}
              className="mx-4 my-4 rounded-2xl p-4 flex items-center gap-3 transition-all duration-200 hover:bg-white/10 group cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {getProfileSrc(user?.profile_picture) ? (
                <img
                  src={getProfileSrc(user?.profile_picture)}
                  alt={user?.name}
                  className="w-11 h-11 rounded-full object-cover shrink-0 group-hover:border-purple-400 transition-colors"
                  style={{ border: '2px solid #3b82f6' }}
                />
              ) : (
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-lg"
                  style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate group-hover:text-blue-400 transition-colors">{user?.name}</p>
                <p className="text-xs truncate" style={{ color: '#94a3b8' }}>{user?.email}</p>
              </div>
            </Link>
          )}

          {/* Nav section label */}
          {!desktopCollapsed && (
            <p className="px-6 text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>
              Navigation
            </p>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path ||
                (item.path === '/teacher/dashboard' && location.pathname === '/teacher')
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg,rgba(59,130,246,0.25),rgba(139,92,246,0.15))'
                      : 'transparent',
                    border: isActive ? '1px solid rgba(99,102,241,0.35)' : '1px solid transparent',
                  }}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
                      style={{ background: 'linear-gradient(180deg,#3b82f6,#8b5cf6)' }}
                    />
                  )}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)'
                        : 'rgba(255,255,255,0.06)',
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: isActive ? '#fff' : '#94a3b8' }} />
                  </div>
                  {!desktopCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span
                        className="font-medium text-sm transition-colors"
                        style={{ color: isActive ? '#e2e8f0' : '#94a3b8' }}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ background: 'linear-gradient(135deg,#ef4444,#f97316)' }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                  {desktopCollapsed && item.badge && (
                    <span
                      className="absolute top-1 right-1 w-4 h-4 text-xs font-bold rounded-full flex items-center justify-center text-white"
                      style={{ background: '#ef4444', fontSize: '10px' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Sign out */}
          <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              onClick={() => { setSidebarOpen(false); logout() }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group"
              style={{ border: '1px solid rgba(239,68,68,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(239,68,68,0.12)' }}>
                <LogOut className="w-4 h-4" style={{ color: '#f87171' }} />
              </div>
              {!desktopCollapsed && (
                <span className="font-medium text-sm" style={{ color: '#f87171' }}>Sign Out</span>
              )}
            </button>
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setDesktopCollapsed(!desktopCollapsed)}
            className="hidden lg:flex m-4 p-2 rounded-xl items-center justify-center transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#94a3b8',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            {desktopCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </aside>

        {/* ── Main Content ── */}
        <main
          className={`flex-1 transition-all duration-300 w-full ${desktopCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}
        >
          {/* Top bar */}
          <header
            className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-16"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(226,232,240,0.8)',
              boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
            }}
          >
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(prev => !prev)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>Menu</span>
            </button>

            {/* Page breadcrumb */}
            <div className="hidden lg:flex items-center gap-2">
              <GraduationCap className="w-5 h-5" style={{ color: '#3b82f6' }} />
              <span className="text-sm font-semibold" style={{ color: '#1e293b' }}>
                {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {pendingReceiptsCount > 0 && (
                <Link
                  to="/teacher/fees"
                  className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg,#ef4444,#f97316)', boxShadow: '0 2px 8px rgba(239,68,68,0.35)' }}
                >
                  <Bell className="w-4 h-4" />
                  {pendingReceiptsCount} pending
                </Link>
              )}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
              >
                {getProfileSrc(user?.profile_picture) ? (
                  <img
                    src={getProfileSrc(user?.profile_picture)}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium" style={{ color: '#1e293b' }}>
                  {user?.name?.split(' ')[0]}
                </span>
              </div>
            </div>
          </header>

          {/* Page content */}
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
