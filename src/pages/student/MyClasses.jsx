import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import { classesApi } from '../../api'
import { FiUsers, FiCalendar } from 'react-icons/fi'
import { AuthContext } from '../../contexts/AuthContext'

export default function MyClasses() {
  const { user } = useContext(AuthContext)
  const [classes, setClasses] = useState([])
  const [availableClasses, setAvailableClasses] = useState([])

  useEffect(() => {
    fetchClasses()
  }, [user])

  const fetchClasses = async () => {
    try {
      // Extract grade number from user grade (e.g., "Grade 10" -> "10")
      const userGrade = user?.grade?.replace(/\D/g, '') || ''
      
      // All mock classes
      const allEnrolledClasses = [
        {
          id: 1,
          title: 'Grade 10 Mathematics',
          teacher: 'Mr. John Smith',
          grade: '10',
          description: 'Advanced mathematics covering Algebra, Geometry, and Trigonometry',
          schedule: 'Mon, Wed, Fri - 4:00 PM',
        },
        {
          id: 2,
          title: 'Grade 10 Science',
          teacher: 'Ms. Sarah Johnson',
          grade: '10',
          description: 'Physics, Chemistry, and Biology - Complete O/L Science syllabus',
          schedule: 'Tue, Thu - 3:00 PM',
        },
        {
          id: 3,
          title: 'Grade 11 Chemistry',
          teacher: 'Mr. Maleesha Wickramasinghe',
          grade: '11',
          description: 'A/L Chemistry - Physical, Organic and Inorganic Chemistry',
          schedule: 'Sat, Sun - 9:00 AM',
        },
        {
          id: 4,
          title: 'Grade 11 Physics',
          teacher: 'Dr. David Wilson',
          grade: '11',
          description: 'A/L Physics covering Mechanics, Electricity and Modern Physics',
          schedule: 'Tue, Thu, Sat - 5:00 PM',
        },
        {
          id: 8,
          title: 'Grade 9 Mathematics',
          teacher: 'Mr. Peter Anderson',
          grade: '9',
          description: 'Foundation mathematics for Grade 9 students',
          schedule: 'Mon, Wed - 3:00 PM',
        },
        {
          id: 9,
          title: 'Grade 9 Science',
          teacher: 'Mrs. Jane Williams',
          grade: '9',
          description: 'General Science for Grade 9 - Introduction to Physics, Chemistry & Biology',
          schedule: 'Tue, Thu - 2:00 PM',
        },
      ]

      const allAvailableClasses = [
        {
          id: 5,
          title: 'Grade 10 English',
          teacher: 'Mrs. Emily Brown',
          grade: '10',
          description: 'English language and literature for O/L examination',
          schedule: 'Sat - 10:00 AM',
        },
        {
          id: 6,
          title: 'Grade 12 Combined Maths',
          teacher: 'Mr. Robert Taylor',
          grade: '12',
          description: 'A/L Combined Mathematics - Pure and Applied Mathematics',
          schedule: 'Sun - 2:00 PM',
        },
        {
          id: 7,
          title: 'Grade 11 Biology',
          teacher: 'Dr. Lisa Anderson',
          grade: '11',
          description: 'A/L Biology covering all units with practical sessions',
          schedule: 'Mon, Wed, Fri - 6:00 PM',
        },
        {
          id: 10,
          title: 'Grade 10 ICT',
          teacher: 'Mr. Michael Chen',
          grade: '10',
          description: 'Information and Communication Technology for O/L',
          schedule: 'Fri - 4:00 PM',
        },
        {
          id: 11,
          title: 'Grade 9 English',
          teacher: 'Mrs. Rachel Green',
          grade: '9',
          description: 'English language skills for Grade 9',
          schedule: 'Sat - 9:00 AM',
        },
      ]

      // Filter classes by user's grade
      const filteredEnrolled = userGrade 
        ? allEnrolledClasses.filter(c => c.grade === userGrade)
        : allEnrolledClasses

      const filteredAvailable = userGrade
        ? allAvailableClasses.filter(c => c.grade === userGrade)
        : allAvailableClasses

      setClasses(filteredEnrolled)
      setAvailableClasses(filteredAvailable)
    } catch (error) {
      console.error('Failed to fetch classes:', error)
    }
  }

  const handleEnroll = async (classId) => {
    try {
      await classesApi.enroll(classId)
      fetchClasses()
    } catch (error) {
      console.error('Failed to enroll:', error)
    }
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
            <p className="text-sm text-slate-500 mt-0.5">Explore enrolled tuition classes and available syllabus modules.</p>
          </div>
        </div>
      </div>

      {/* Enrolled Classes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Enrolled Classes</h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {classes.length} {classes.length === 1 ? 'Class' : 'Classes'}
          </span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                    Grade {classItem.grade}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{classItem.title}</h3>
                <p className="text-xs font-medium text-slate-500 mb-2">Teacher: {classItem.teacher}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{classItem.description}</p>
              </div>
              
              <div>
                <div className="flex items-center text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <FiCalendar className="mr-2 text-blue-500 shrink-0" />
                  <span>{classItem.schedule}</span>
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
      </section>

      {/* Available Classes */}
      {availableClasses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Available Classes</h2>
            <span className="text-xs text-slate-500">Other Grades</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      Grade {classItem.grade}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{classItem.title}</h3>
                  <p className="text-xs font-medium text-slate-500 mb-2">Teacher: {classItem.teacher}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{classItem.description}</p>
                </div>
                
                <div>
                  <div className="flex items-center text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <FiCalendar className="mr-2 text-slate-400 shrink-0" />
                    <span>{classItem.schedule}</span>
                  </div>

                  <button
                    onClick={() => handleEnroll(classItem.id)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
