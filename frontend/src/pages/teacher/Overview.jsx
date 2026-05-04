import { useState, useEffect } from 'react'
import { Users, BookOpen, Video, DollarSign } from 'lucide-react'
import StatCard from '../../components/Teacher/StatCard'
import RecentActivity from '../../components/Teacher/RecentActivity'
import UpcomingClasses from '../../components/Teacher/UpcomingClasses'
import api from '../../api/axios'

export default function Overview() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          value={loading ? '...' : `Rs ${Number(stats.monthlyRevenue || 0).toLocaleString()}`}
          variant="warning"
          trend={stats.trends?.revenue}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <UpcomingClasses />
        <RecentActivity />
      </div>
    </div>
  )
}
