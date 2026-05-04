import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Users } from "lucide-react"
import api from '../../api/axios'

export default function UpcomingClasses() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClasses()
  }, [])

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

  const getColorByGrade = (grade) => {
    return 'bg-primary'
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">My Classes</h3>
        <button
          onClick={() => navigate('/teacher/classes')}
          className="text-primary hover:text-primary/80 text-sm font-medium"
        >
          View All
        </button>
      </div>
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : classes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No classes found</div>
        ) : (
          classes.slice(0, 2).map((cls) => (
            <div
              key={cls.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className={`w-1 h-12 rounded-full ${getColorByGrade(cls.grade)}`} />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{cls.title}</p>
                <p className="text-sm text-gray-600">
                  {cls.subject} - Grade {cls.grade}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {cls.student_count || 0}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
