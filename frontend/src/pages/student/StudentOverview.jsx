import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card'
import { FiVideo, FiFileText, FiBookOpen, FiClipboard, FiClock, FiCheckCircle, FiMail, FiPhone, FiUser, FiAward } from 'react-icons/fi'
import Progress from '../../components/UI/Progress'
import api from '../../api/axios'

export default function StudentOverview() {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalPapers: 0,
    totalNotes: 0,
    totalAssignments: 0,
  })
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      const [statsRes, activityRes] = await Promise.all([
        api.get('/stats/student-stats'),
        api.get('/stats/student-activity'),
      ])
      setStats(statsRes.data)
      setActivities(activityRes.data.activities || [])
    } catch (error) {
      console.error('Failed to fetch student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsData = [
    { label: "Total Videos", value: loading ? "..." : stats.totalVideos, icon: FiVideo },
    { label: "Notes & PDFs", value: loading ? "..." : stats.totalNotes, icon: FiFileText },
    { label: "Papers", value: loading ? "..." : stats.totalPapers, icon: FiBookOpen },
    { label: "Assignments", value: loading ? "..." : stats.totalAssignments, icon: FiClipboard },
  ]

  const courseProgress = [
    { name: "Mathematics", progress: 75 },
    { name: "Science", progress: 60 },
    { name: "ICT", progress: 85 },
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'video':
        return FiVideo
      case 'paper':
      case 'papers':
        return FiBookOpen
      case 'notes':
        return FiFileText
      case 'assignment':
        return FiClipboard
      default:
        return FiCheckCircle
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h2>
        <p className="text-gray-600 mt-1">Here's what's happening with your classes today.</p>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>My Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary">
                <FiUser className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Full Name</p>
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary">
                <FiAward className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Grade</p>
                <p className="text-sm font-semibold text-gray-900">{user?.grade || 'Not Set'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary">
                <FiMail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary">
                <FiPhone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Contact</p>
                <p className="text-sm font-semibold text-gray-900">{user?.phone || 'Not Set'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-lg bg-gray-100 p-3 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Progress Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseProgress.map((course) => (
              <div key={course.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{course.name}</span>
                  <span className="text-sm text-gray-600">{course.progress}%</span>
                </div>
                <Progress value={course.progress} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4 text-gray-500">Loading...</div>
              ) : activities.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No recent activity</div>
              ) : (
                activities.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type)
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 text-primary">
                        <ActivityIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.status}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
