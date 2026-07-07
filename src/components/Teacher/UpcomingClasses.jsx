import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, BookOpen, ArrowRight } from 'lucide-react'
import api from '../../api/axios'

const gradeColors = [
  'linear-gradient(135deg, #3b82f6, #1d4ed8)', // Blue
  'linear-gradient(135deg, #6366f1, #4f46e5)', // Indigo
]

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
            style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.15),rgba(99,102,241,0.08))' }}
          >
            <BookOpen className="w-4 h-4" style={{ color: '#3b82f6' }} />
          </div>
          <h3 className="text-base font-bold" style={{ color: '#1e293b' }}>My Classes</h3>
        </div>
        <button
          onClick={() => navigate('/teacher/classes')}
          className="flex items-center gap-1 text-sm font-semibold transition-all px-3 py-1.5 rounded-lg"
          style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.08)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.08)'}
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: '#f1f5f9' }} />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: '#f1f5f9' }}
            >
              <BookOpen className="w-6 h-6" style={{ color: '#94a3b8' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>No classes found</p>
          </div>
        ) : (
          classes.slice(0, 4).map((cls, idx) => (
            <div
              key={cls.id}
              className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200"
              style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f1f5f9'
                e.currentTarget.style.border = '1px solid #e2e8f0'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#f8fafc'
                e.currentTarget.style.border = '1px solid #f1f5f9'
              }}
              onClick={() => navigate('/teacher/classes')}
            >
              {/* Grade badge */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm"
                style={{ background: gradeColors[idx % gradeColors.length], boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
              >
                {cls.grade || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: '#1e293b' }}>{cls.title}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: '#64748b' }}>{cls.subject} · Grade {cls.grade}</p>
              </div>
              <div
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0"
                style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}
              >
                <Users className="w-3.5 h-3.5" />
                {cls.student_count || 0}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
