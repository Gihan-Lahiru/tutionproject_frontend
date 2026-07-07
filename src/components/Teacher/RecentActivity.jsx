import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Video, DollarSign, UserPlus, Bell, Activity } from 'lucide-react'
import api from '../../api/axios'

const typeConfig = {
  paper:        { icon: FileText,  bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6',  label: 'Paper' },
  student:      { icon: UserPlus,  bg: 'rgba(16,185,129,0.12)',  color: '#10b981',  label: 'Student' },
  video:        { icon: Video,     bg: 'rgba(139,92,246,0.12)',  color: '#8b5cf6',  label: 'Video' },
  fee:          { icon: DollarSign,bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b',  label: 'Fee' },
  announcement: { icon: Bell,      bg: 'rgba(236,72,153,0.12)',  color: '#ec4899',  label: 'Announcement' },
}

function getTimeAgo(dateString) {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now - date) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export default function RecentActivity() {
  const navigate = useNavigate()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchActivities() }, [])

  const fetchActivities = async () => {
    try {
      const response = await api.get('/stats/teacher-activity')
      setActivities(response.data.activities || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  const handleClick = (activity) => {
    const classId = activity?.class_id
    if (activity.type === 'announcement' && classId) return navigate(`/class/${classId}?tab=announcements`)
    if (activity.type === 'paper') return classId ? navigate(`/class/${classId}?tab=papers`) : navigate('/teacher/papers')
    if (activity.type === 'video') return classId ? navigate(`/class/${classId}?tab=videos`) : navigate('/teacher/videos')
    if (activity.type === 'student') return navigate('/teacher/students')
    if (activity.type === 'fee') return navigate('/teacher/fees')
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#fff',
        border: '1.5px solid rgba(226,232,240,0.8)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}
    >
      {/* Card header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid #f1f5f9' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(5,150,105,0.08))' }}
          >
            <Activity className="w-4 h-4" style={{ color: '#10b981' }} />
          </div>
          <h3 className="text-base font-bold" style={{ color: '#1e293b' }}>Recent Activity</h3>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
          style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          Live
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-2">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: '#f1f5f9' }} />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: '#f1f5f9' }}
            >
              <Activity className="w-6 h-6" style={{ color: '#94a3b8' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>No recent activity</p>
          </div>
        ) : (
          activities.slice(0, 6).map((activity) => {
            const cfg = typeConfig[activity.type] || typeConfig.paper
            const Icon = cfg.icon
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
                style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}
                onClick={() => handleClick(activity)}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#f1f5f9'
                  e.currentTarget.style.border = '1px solid #e2e8f0'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#f8fafc'
                  e.currentTarget.style.border = '1px solid #f1f5f9'
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: cfg.bg }}
                >
                  <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#1e293b' }}>{activity.title}</p>
                  <p className="text-xs truncate mt-0.5" style={{ color: '#64748b' }}>{activity.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className="text-xs px-2 py-0.5 rounded-md font-medium"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                  <span className="text-xs" style={{ color: '#94a3b8' }}>
                    {getTimeAgo(activity.created_at)}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
