import { useState, useContext, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { 
  LayoutDashboard, BookOpen, FileText, Users, Video, DollarSign, Settings as SettingsIcon,
  LogOut, GraduationCap, ChevronLeft, ChevronRight, Menu, X
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
  const location = useLocation()

  useEffect(() => {
    // Auto-close mobile drawer after navigation.
    setSidebarOpen(false)
  }, [location.pathname])

  const navItems = [
    { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/teacher/classes', icon: BookOpen, label: 'Classes' },
    { path: '/teacher/students', icon: Users, label: 'Students' },
    { path: '/teacher/papers', icon: FileText, label: 'Papers' },
    { path: '/teacher/videos', icon: Video, label: 'Videos' },
    { path: '/teacher/fees', icon: DollarSign, label: 'Fees' },
    { path: '/teacher/settings', icon: SettingsIcon, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 z-50 flex flex-col w-72 max-w-[85vw] lg:max-w-none ${desktopCollapsed ? 'lg:w-20' : 'lg:w-64'} ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!desktopCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">EduTeach</h1>
                <p className="text-xs text-gray-500">Teacher Portal</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!desktopCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* User Info */}
          {!desktopCollapsed && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                {user?.profile_picture ? (
                  <img 
                    src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://localhost:5000${user.profile_picture}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSidebarOpen(false)
                  logout()
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut size={18} />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          )}

          {/* Collapse Button */}
          <button
            onClick={() => setDesktopCollapsed(!desktopCollapsed)}
            className="m-4 hidden lg:flex p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors items-center justify-center"
          >
            {desktopCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 w-full ${desktopCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-4 lg:hidden">
              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm"
              >
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                Menu
              </button>
            </div>
            <Routes>
              <Route index element={<Overview />} />
              <Route path="dashboard" element={<Overview />} />
              <Route path="classes" element={<MyClasses />} />
              <Route path="students" element={<Students />} />
              <Route path="papers" element={<Papers />} />
              <Route path="videos" element={<Videos />} />
              <Route path="fees" element={<Payments />} />
              <Route path="settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}
