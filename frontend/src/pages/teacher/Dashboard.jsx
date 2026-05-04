import { useState, useContext } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { 
  LayoutDashboard, BookOpen, Users, DollarSign, Settings as SettingsIcon,
  Menu, X, LogOut, GraduationCap, ChevronLeft, ChevronRight, Video, FileText
} from 'lucide-react'

// Sub-pages
import Overview from './Overview'
import MyClasses from './MyClasses'
import Students from './Students'
import Payments from './Payments'
import Settings from './Settings'
import Videos from './Videos'

export default function TeacherDashboard() {
  const { user, logout } = useContext(AuthContext)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()

  const navItems = [
    { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/teacher/classes', icon: BookOpen, label: 'Classes' },
    { path: '/teacher/students', icon: Users, label: 'Students' },
    { path: '/teacher/papers', icon: FileText, label: 'Papers' },
    { path: '/teacher/videos', icon: Video, label: 'Videos' },
    { path: '/teacher/payments', icon: DollarSign, label: 'Fees' },
    { path: '/teacher/settings', icon: SettingsIcon, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 z-50 flex flex-col ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          {/* Teacher Profile */}
          {sidebarOpen ? (
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col items-center gap-4">
                {user?.profile_picture ? (
                  <img 
                    src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://localhost:5000${user.profile_picture}`}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-xl"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-white text-3xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-600 font-medium">Teacher</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-gray-200 flex justify-center">
              {user?.profile_picture ? (
                <img 
                  src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://localhost:5000${user.profile_picture}`}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-gray-200">
            {sidebarOpen ? (
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={logout}
                className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="m-4 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="p-6 lg:p-8">
            <Routes>
              <Route index element={<Overview />} />
              <Route path="dashboard" element={<Overview />} />
              <Route path="classes" element={<MyClasses />} />
              <Route path="videos" element={<Videos />} />
              <Route path="students" element={<Students />} />
              <Route path="payments" element={<Payments />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}
