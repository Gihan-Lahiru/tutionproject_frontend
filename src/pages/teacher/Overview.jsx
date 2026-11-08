import { useState, useEffect, useContext } from 'react'
import { Users, BookOpen, Video, DollarSign, FileText, Activity, Plus, CheckCircle, ArrowRight, UploadCloud, Bell } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import StatCard from '../../components/Teacher/StatCard'
import RecentActivity from '../../components/Teacher/RecentActivity'
import UpcomingClasses from '../../components/Teacher/UpcomingClasses'
import api from '../../api/axios'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function Overview() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalVideos: 0,
    totalPapers: 0,
    monthlyRevenue: 0,
    trends: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await api.get('/stats/teacher-stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── Welcome Banner ── */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-800 overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-semibold mb-3 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{today}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {getGreeting()}, <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">{user?.name || 'Sir Maleesha'}</span> 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Welcome back to your central control panel. Here is the operational summary of your classes, student submissions, and fee collections for today.
            </p>
          </div>

          {/* Quick Action Pills on Header */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <Link
              to="/teacher/classes"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Class</span>
            </Link>
            <Link
              to="/teacher/papers"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold border border-white/10 transition-all cursor-pointer backdrop-blur-md"
            >
              <UploadCloud className="w-4 h-4 text-blue-400" />
              <span>Upload Paper</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Stat Cards ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            System Key Performance Indicators
          </h2>
          <span className="text-xs text-slate-400 font-medium">Auto-synced</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            icon={Users}
            title="Total Students"
            value={loading ? '...' : stats.totalStudents}
            variant="primary"
            trend={stats.trends?.students}
          />
          <StatCard
            icon={BookOpen}
            title="Active Classes"
            value={loading ? '...' : stats.totalClasses}
            variant="success"
            trend={stats.trends?.classes}
          />
          <StatCard
            icon={Video}
            title="Video Lessons"
            value={loading ? '...' : stats.totalVideos}
            variant="accent"
          />
          <StatCard
            icon={DollarSign}
            title="Monthly Revenue"
            value={loading ? '...' : `Rs. ${Number(stats.monthlyRevenue || 0).toLocaleString()}`}
            variant="warning"
            trend={stats.trends?.revenue}
          />
        </div>
      </div>

      {/* ── Quick Shortcut Navigation Bar ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Manage Classes',
            desc: 'View & update tuition batches',
            icon: BookOpen,
            color: 'text-blue-600 bg-blue-50 border-blue-100',
            href: '/teacher/classes',
          },
          {
            title: 'Review Students',
            desc: 'Approve new registrations',
            icon: Users,
            color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            href: '/teacher/students',
          },
          {
            title: 'Past & Model Papers',
            desc: 'Upload revision PDF materials',
            icon: FileText,
            color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
            href: '/teacher/papers',
          },
          {
            title: 'Fee Verification',
            desc: 'Review bank deposit slips',
            icon: DollarSign,
            color: 'text-amber-600 bg-amber-50 border-amber-100',
            href: '/teacher/fees',
          },
        ].map((item, index) => {
          const Icon = item.icon
          return (
            <Link
              key={index}
              to={item.href}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-200 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>
          )
        })}
      </div>

      {/* ── Main Operations: Classes & Activity ── */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <UpcomingClasses />
        <RecentActivity />
      </div>
    </div>
  )
}
