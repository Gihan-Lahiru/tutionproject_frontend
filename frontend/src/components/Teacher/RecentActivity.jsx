import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Video, DollarSign, UserPlus, Bell } from "lucide-react"
import api from '../../api/axios'

export default function RecentActivity() {
  const navigate = useNavigate()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

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

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const seconds = Math.floor((now - date) / 1000)
    
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} min ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'paper': return { icon: FileText, color: 'text-primary bg-gray-100' }
      case 'student': return { icon: UserPlus, color: 'text-primary bg-gray-100' }
      case 'video': return { icon: Video, color: 'text-primary bg-gray-100' }
      case 'fee': return { icon: DollarSign, color: 'text-primary bg-gray-100' }
      case 'announcement': return { icon: Bell, color: 'text-primary bg-gray-100' }
      default: return { icon: FileText, color: 'text-gray-600 bg-gray-100' }
    }
  }

  const openActivity = (activity) => {
    const classId = activity?.class_id

    if (activity.type === 'announcement' && classId) {
      navigate(`/class/${classId}?tab=announcements`)
      return
    }

    if (activity.type === 'paper') {
      if (classId) {
        navigate(`/class/${classId}?tab=papers`)
      } else {
        navigate('/teacher/papers')
      }
      return
    }

    if (activity.type === 'video') {
      if (classId) {
        navigate(`/class/${classId}?tab=videos`)
      } else {
        navigate('/teacher/videos')
      }
      return
    }

    if (activity.type === 'student') {
      navigate('/teacher/students')
      return
    }

    if (activity.type === 'fee') {
      navigate('/teacher/fees')
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No recent activity</div>
        ) : (
          activities.map((activity) => {
            const { icon: Icon, color } = getActivityIcon(activity.type)
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => openActivity(activity)}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {getTimeAgo(activity.created_at)}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
