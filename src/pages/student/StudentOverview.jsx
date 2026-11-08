import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import { 
  FiVideo, 
  FiFileText, 
  FiBookOpen, 
  FiClipboard, 
  FiClock, 
  FiCheckCircle, 
  FiMail, 
  FiPhone, 
  FiUser, 
  FiAward, 
  FiAlertCircle, 
  FiAlertTriangle,
  FiArrowRight,
  FiPlay,
  FiDownload,
  FiDollarSign,
  FiMapPin
} from 'react-icons/fi'
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
      setStats(statsRes.data || {})
      setActivities(activityRes.data?.activities || [])
    } catch (error) {
      console.error('Failed to fetch student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsData = [
    { 
      label: "Video Lessons", 
      value: loading ? "..." : stats.totalVideos, 
      icon: FiVideo,
      link: "/student/videos",
      color: "text-purple-600 bg-purple-50 border-purple-100",
      accent: "#9333ea"
    },
    { 
      label: "Notes & PDFs", 
      value: loading ? "..." : stats.totalNotes, 
      icon: FiFileText,
      link: "/student/notes",
      color: "text-blue-600 bg-blue-50 border-blue-100",
      accent: "#2563eb"
    },
    { 
      label: "Past Papers", 
      value: loading ? "..." : stats.totalPapers, 
      icon: FiBookOpen,
      link: "/student/past-papers",
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      accent: "#4f46e5"
    },
    { 
      label: "Assignments", 
      value: loading ? "..." : stats.totalAssignments, 
      icon: FiClipboard,
      link: "/student/assignments",
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      accent: "#059669"
    },
  ]

  const courseProgress = [
    { name: "Science Syllabus Coverage", progress: 85, color: "bg-blue-600" },
    { name: "Model Paper Submissions", progress: 65, color: "bg-indigo-600" },
    { name: "Recorded Video Revisions", progress: 78, color: "bg-purple-600" },
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

  const getProfileImageSrc = (value) => {
    if (!value) return ''
    const raw = String(value).trim()
    if (!raw) return ''
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
      return raw
    }
    const backendOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')
    return raw.startsWith('/') ? `${backendOrigin}${raw}` : `${backendOrigin}/${raw}`
  }

  return (
    <div className="space-y-6">
      {/* ── Welcome Banner Card ── */}
      <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            {getProfileImageSrc(user?.profile_picture) ? (
              <img
                src={getProfileImageSrc(user?.profile_picture)}
                alt={user?.name}
                className="w-16 h-16 rounded-2xl object-cover shrink-0 border-2 border-white shadow-md shadow-blue-500/10"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 text-white font-extrabold text-2xl">
                {user?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
            )}
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-1">
                <span>MW Student Portal</span>
                <span>•</span>
                <span>{user?.grade ? (String(user.grade).toLowerCase().startsWith('grade') ? user.grade : `Grade ${user.grade}`) : 'Science Student'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Access your syllabus materials, video lessons, and test papers below.
              </p>
            </div>
          </div>

          {/* Payment Status Pill */}
          {user?.paymentStatus && (
            <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
              <span className="text-xs font-medium text-slate-500">Monthly Tuition Status</span>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border shadow-xs ${
                user.paymentStatus === 'paid' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : user.paymentStatus === 'pending_verification' 
                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                  : user.paymentStatus === 'rejected' 
                  ? 'bg-rose-50 text-rose-800 border-rose-200' 
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  user.paymentStatus === 'paid' ? 'bg-emerald-500' :
                  user.paymentStatus === 'pending_verification' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span>
                  {user.paymentStatus === 'paid' ? 'Tuition Paid (Full Access)' :
                   user.paymentStatus === 'pending_verification' ? 'Receipt Under Review' :
                   user.paymentStatus === 'rejected' ? 'Receipt Rejected' : 'Payment Overdue'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expiration or Review Alert */}
      {user?.role === 'student' && user?.paymentStatus !== 'paid' && user?.createdAt && (() => {
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysSinceRegistration = (Date.now() - new Date(user.createdAt).getTime()) / msPerDay;
        const daysLeft = Math.ceil(14 - daysSinceRegistration);
        
        let banner = null;
        if (user.paymentStatus === 'pending_verification') {
          banner = { type: 'warning', message: 'Your payment receipt has been submitted and is waiting for teacher approval.' };
        } else if (user.paymentStatus === 'rejected') {
          banner = { type: 'error', message: 'Your payment receipt was rejected. Please review and upload a valid receipt in the Payments tab.' };
        } else if (daysLeft > 0 && daysLeft <= 3) {
          banner = { type: 'warning', message: `Your payment window expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Please complete your tuition fee to avoid access restrictions.` };
        } else if (daysLeft <= 0) {
          banner = { type: 'error', message: 'Your monthly tuition fee is overdue. Please upload your receipt in Payments to unlock materials.' };
        }

        if (banner) {
          return (
            <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 border shadow-xs ${
              banner.type === 'error' ? 'bg-rose-50 text-rose-900 border-rose-200' : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="mt-0.5 shrink-0">
                  {banner.type === 'error' ? <FiAlertCircle className="w-5 h-5 text-rose-600" /> : <FiAlertTriangle className="w-5 h-5 text-amber-600" />}
                </div>
                <p className="font-semibold text-sm">{banner.message}</p>
              </div>
              <Link
                to="/student/payments"
                className="shrink-0 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-xs"
              >
                Go to Payments
              </Link>
            </div>
          );
        }
        return null;
      })()}

      {/* ── Quick Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all">
                  <FiArrowRight className="w-4 h-4" />
                </span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Student Information Bar ── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Student Information</h2>
          <Link to="/student/dashboard" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Edit Profile
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <FiUser className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Full Name</p>
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <FiAward className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Grade Level</p>
              <p className="text-sm font-bold text-slate-800 truncate">{user?.grade ? `Grade ${user.grade}` : 'Not Set'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <FiMail className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email Address</p>
              <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <FiPhone className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Contact Number</p>
              <p className="text-sm font-bold text-slate-800 truncate">{user?.phone || 'Not Set'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-Column Activity & Progress ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Course Progress */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">Academic Progress</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Active Term
            </span>
          </div>
          <div className="space-y-4">
            {courseProgress.map((course) => (
              <div key={course.name} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-800">{course.name}</span>
                  <span className="text-xs font-extrabold text-blue-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${course.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-slate-900">Recent Updates</h2>
            <span className="text-xs text-slate-400">Class Activity</span>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-slate-400 text-sm">Loading activity...</div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                <p>No recent activity yet.</p>
                <p className="text-xs text-slate-400 mt-1">Uploaded notes and papers will appear here.</p>
              </div>
            ) : (
              activities.slice(0, 4).map((activity, index) => {
                const ActivityIcon = getActivityIcon(activity.type)
                return (
                  <div key={index} className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <ActivityIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 truncate">{activity.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{activity.status}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
