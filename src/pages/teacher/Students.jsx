import StudentTable from '../../components/Teacher/StudentTable'

export default function Students() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-600 mt-1">Manage all your students in one place</p>
      </div>

      <StudentTable />
    </div>
  )
}
