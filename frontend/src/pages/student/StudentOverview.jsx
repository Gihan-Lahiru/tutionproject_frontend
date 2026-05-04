import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card'
import { FiVideo, FiFileText, FiBookOpen, FiClipboard, FiClock, FiCheckCircle, FiMail, FiPhone, FiUser, FiAward } from 'react-icons/fi'
import Progress from '../../components/UI/Progress'

export default function StudentOverview() {
  const { user } = useContext(AuthContext)

  const stats = [
    { label: "Total Videos", value: "48", icon: FiVideo },
    { label: "Notes & PDFs", value: "32", icon: FiFileText },
    { label: "Papers", value: "15", icon: FiBookOpen },
    { label: "Assignments", value: "8", icon: FiClipboard },
  ]

  const recentActivity = [
    { title: "Completed: Algebra Basics", time: "2 hours ago", type: "video", status: "completed" },
    { title: "Uploaded: Math Homework 5", time: "1 day ago", type: "assignment", status: "submitted" },
    { title: "Downloaded: Science Notes Chapter 3", time: "2 days ago", type: "notes", status: "completed" },
    { title: "Due Soon: English Essay", time: "Due in 2 days", type: "assignment", status: "pending" },
  ]

  const courseProgress = [
    { name: "Mathematics", progress: 75 },
    { name: "Science", progress: 60 },
    { name: "ICT", progress: 85 },
  ]

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
        {stats.map((stat) => {
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
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 ${
                      activity.status === "pending" ? "text-gray-500" : "text-primary"
                    }`}
                  >
                    {activity.status === "pending" ? (
                      <FiClock className="h-5 w-5" />
                    ) : (
                      <FiCheckCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
