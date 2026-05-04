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
    <div>
      <h1 className="text-3xl font-bold mb-6">My Classes</h1>

      {/* Enrolled Classes */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Enrolled Classes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">{classItem.title}</h3>
              <p className="text-sm text-gray-600 mb-1">By {classItem.teacher}</p>
              <p className="text-sm text-gray-600 mb-3">{classItem.description}</p>
              
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <FiCalendar className="mr-2" />
                {classItem.schedule}
              </div>

              <Link to={`/class/${classItem.id}`}>
                <Button className="w-full" size="sm">
                  Go to Class
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Available Classes */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Available Classes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableClasses.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">{classItem.title}</h3>
              <p className="text-sm text-gray-600 mb-1">By {classItem.teacher}</p>
              <p className="text-sm text-gray-600 mb-3">{classItem.description}</p>
              
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <FiCalendar className="mr-2" />
                {classItem.schedule}
              </div>

              <Button
                onClick={() => handleEnroll(classItem.id)}
                variant="success"
                className="w-full"
                size="sm"
              >
                Enroll Now
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
