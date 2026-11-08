import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Video, DollarSign, UserPlus, Bell, Activity, ArrowRight } from 'lucide-react'
import api from '../../api/axios'

const typeConfig = {
  paper:        { icon: FileText,  bg: 'bg-blue-50 text-blue-600 border-blue-100',   label: 'Paper' },
  student:      { icon: UserPlus,  bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Student' },
  video:        { icon: Video,     bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',  label: 'Video' },
  fee:          { icon: DollarSign,bg: 'bg-amber-50 text-amber-600 border-amber-100',   label: 'Fee Payment' },
  announcement: { icon: Bell,      bg: 'bg-pink-50 text-pink-600 border-pink-100',    label: 'Announcement' },
}

function getTimeAgo(dateString) {
  if (!dateString) return 'Recently'
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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">Recent Activity</h3>
            <p className="text-xs text-slate-500 font-medium">Real-time tuition updates</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Feed</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 space-y-2.5 flex-1">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <Activity className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No recent activity</p>
            <p className="text-xs text-slate-500 mt-0.5">Events and student submissions will appear here</p>
          </div>
        ) : (
          activities.slice(0, 5).map((act, index) => {
            const config = typeConfig[act.type] || { icon: Activity, bg: 'bg-slate-50 text-slate-600 border-slate-100', label: 'Action' }
            const Icon = config.icon

            return (
              <div
                key={index}
                onClick={() => handleClick(act)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${config.bg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {act.title || act.description || act.message || `${config.label} updated`}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {getTimeAgo(act.created_at || act.timestamp || act.date)}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </div>
            )
          })
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Activity synced with MySQL database</span>
        <button
          onClick={() => navigate('/teacher/students')}
          className="font-semibold text-blue-600 hover:underline cursor-pointer"
        >
          View Students &rarr;
        </button>
      </div>
    </div>
  )
}
