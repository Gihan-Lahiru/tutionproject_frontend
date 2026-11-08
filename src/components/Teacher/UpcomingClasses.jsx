import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, BookOpen, ArrowRight, MapPin, Plus } from 'lucide-react'
import api from '../../api/axios'

export default function UpcomingClasses() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchClasses() }, [])

  const fetchClasses = async () => {
    try {
      const response = await api.get('/stats/today-classes')
      setClasses(response.data.classes || [])
    } catch (error) {
      console.error('Error fetching classes:', error)
      setClasses([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">My Classes & Batches</h3>
            <p className="text-xs text-slate-500 font-medium">Active tuition groups</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/teacher/classes')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 space-y-2.5 flex-1">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No classes registered yet</p>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">Create your first class batch to get started</p>
            <button
              onClick={() => navigate('/teacher/classes')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Class
            </button>
          </div>
        ) : (
          classes.slice(0, 4).map((cls) => (
            <div
              key={cls.id}
              onClick={() => navigate('/teacher/classes')}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {cls.grade ? (String(cls.grade).startsWith('Grade') ? cls.grade.replace('Grade ', 'G') : cls.grade) : 'G'}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    {cls.title || cls.name || `Grade ${cls.grade} Science`}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    {cls.location || cls.institute ? (
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {cls.location || cls.institute}
                      </span>
                    ) : null}
                    <span className="flex items-center gap-1 font-medium">
                      <Users className="w-3 h-3 text-slate-400" />
                      {cls.studentCount || cls.studentsCount || 0} students
                    </span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </div>
          ))
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Managing {classes.length} active tuition batches</span>
        <button
          onClick={() => navigate('/teacher/classes')}
          className="font-semibold text-blue-600 hover:underline cursor-pointer"
        >
          Manage All &rarr;
        </button>
      </div>
    </div>
  )
}
