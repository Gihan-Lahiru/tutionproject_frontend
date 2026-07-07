import { useState, useEffect, useContext } from 'react'
import { Users, BookOpen, Video, DollarSign, FileText, Activity } from 'lucide-react'
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
    <div className="space-y-8">

      {/* ── Header ── */}
      <div
        className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#1e293b 100%)',
          boxShadow: '0 8px 32px rgba(15,23,42,0.25)',
        }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: '#94a3b8' }}>{today}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Teacher'} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            Here's what's happening in your classes today.
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl self-start sm:self-auto"
          style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}
        >
          <Activity className="w-4 h-4" style={{ color: '#60a5fa' }} />
          <span className="text-sm font-semibold" style={{ color: '#60a5fa' }}>Live Dashboard</span>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#94a3b8' }}>
          Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            title="Total Students"
            value={loading ? '—' : stats.totalStudents}
            variant="primary"
            trend={stats.trends?.students}
          />
          <StatCard
            icon={BookOpen}
            title="Active Classes"
            value={loading ? '—' : stats.totalClasses}
            variant="success"
            trend={stats.trends?.classes}
          />
          <StatCard
            icon={Video}
            title="Video Lessons"
            value={loading ? '—' : stats.totalVideos}
            variant="accent"
          />
          <StatCard
            icon={DollarSign}
            title="Monthly Revenue"
            value={loading ? '—' : `Rs ${Number(stats.monthlyRevenue || 0).toLocaleString()}`}
            variant="warning"
            trend={stats.trends?.revenue}
          />
        </div>
      </div>

      {/* ── Second Row ── */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#94a3b8' }}>
          Details
        </h2>
        <div className="grid lg:grid-cols-2 gap-6">
          <UpcomingClasses />
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
