import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { classesApi } from '../../api'
import { FiUsers, FiCalendar, FiMapPin, FiBookOpen } from 'react-icons/fi'
import { AuthContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import { extractArray, formatGradeLabel, gradesMatch, institutesMatch } from '../../utils/dashboardUtils'

export default function MyClasses() {
  const { user } = useContext(AuthContext)
  const [classes, setClasses] = useState([])
  const [availableClasses, setAvailableClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrollingId, setEnrollingId] = useState(null)

  useEffect(() => {
    fetchClasses()
  }, [user?.id, user?.grade, user?.institute, user?.tuitionClass])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const response = await classesApi.getAll()
      const allClasses = extractArray(response.data, 'classes').filter((c) => {
        const g = String(c?.grade || '').trim()
        return g !== '1'
      })

      const enrolledList = []
      const availableList = []

      for (const classItem of allClasses) {
        const inRoster = Array.isArray(classItem.students) && classItem.students.some((s) => String(s?.id) === String(user?.id))
        const assignedTuitionClass = user?.tuitionClass && String(user.tuitionClass) === String(classItem.id)
        const gradeMatches = gradesMatch(classItem.grade, user?.grade)
        const locationMatches = !classItem.location || !user?.institute || institutesMatch(classItem.location, user?.institute)

        if (inRoster || assignedTuitionClass || (user?.grade && gradeMatches && locationMatches)) {
          enrolledList.push(classItem)
        } else if (!user?.grade || gradeMatches) {
          availableList.push(classItem)
        }
      }

      setClasses(enrolledList)
      setAvailableClasses(availableList)
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      toast.error('Failed to load classes')
      setClasses([])
      setAvailableClasses([])
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (classId) => {
    try {
      setEnrollingId(classId)
      const res = await classesApi.enroll(classId)
      toast.success(res.data?.message || 'Enrolled in class successfully')
      await fetchClasses()
    } catch (error) {
      console.error('Failed to enroll:', error)
      toast.error(error.response?.data?.message || 'Failed to enroll in class')
    } finally {
      setEnrollingId(null)
    }
  }

  const formatSchedule = (c) => {
    const day = String(c?.day || '').trim()
    const time = String(c?.time || '').trim()
    if (day && time) return `${day} • ${time}`
    if (time) return time
    if (day) return day
    return 'Schedule announced in class'
  }

  return (
    <div className="space-y-8">
      {/* Page Header - Clean Light Design */}
      <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-xs">
            <FiUsers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Classes</h1>
            <p className="text-sm text-slate-500 mt-0.5">Access your enrolled tuition batches and syllabus modules.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-500 text-sm mt-3 font-semibold">Loading your classes...</p>
        </div>
      ) : (
        <>
          {/* Enrolled Classes */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Your Classes</h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {classes.length} {classes.length === 1 ? 'Batch' : 'Batches'}
              </span>
            </div>

            {classes.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 border border-slate-200/90 text-center text-slate-500">
                <FiBookOpen className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <p className="font-semibold text-slate-700">No active batches assigned for your grade yet</p>
                <p className="text-xs text-slate-400 mt-1">Classes created by your teacher for your grade and institute will appear here.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                          {formatGradeLabel(classItem.grade)}
                        </span>
                        {classItem.location && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                            <FiMapPin className="w-3 h-3 text-slate-400" />
                            {classItem.location}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {classItem.title || classItem.name || classItem.subject || 'Tuition Class'}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mb-2">
                        Teacher: {classItem.teacher?.name || 'Mr. Maleesha Wickramasinghe'}
                      </p>
                      {classItem.description && (
                        <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">{classItem.description}</p>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <FiCalendar className="mr-2 text-blue-500 shrink-0" />
                        <span>{formatSchedule(classItem)}</span>
                      </div>

                      <Link to={`/class/${classItem.id}`}>
                        <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer">
                          Go to Class
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Other Available Classes */}
          {availableClasses.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Available Classes</h2>
                <span className="text-xs text-slate-500">Other Institutes / Batches</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableClasses.map((classItem) => (
                  <div
                    key={classItem.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
                          {formatGradeLabel(classItem.grade)}
                        </span>
                        {classItem.location && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                            <FiMapPin className="w-3 h-3 text-slate-400" />
                            {classItem.location}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        {classItem.title || classItem.name || classItem.subject || 'Tuition Class'}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mb-2">
                        Teacher: {classItem.teacher?.name || 'Mr. Maleesha Wickramasinghe'}
                      </p>
                      {classItem.description && (
                        <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">{classItem.description}</p>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <FiCalendar className="mr-2 text-slate-400 shrink-0" />
                        <span>{formatSchedule(classItem)}</span>
                      </div>

                      <button
                        onClick={() => handleEnroll(classItem.id)}
                        disabled={enrollingId === classItem.id}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {enrollingId === classItem.id ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
