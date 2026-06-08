import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import Badge from '../../components/UI/Badge'
import Progress from '../../components/UI/Progress'
import { FiUpload, FiClock, FiCheckCircle, FiAlertCircle, FiCalendar } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function Assignments() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "Algebra Problem Set 5",
      subject: "Mathematics",
      dueDate: "2024-01-20",
      status: "pending",
      description: "Solve problems 1-20 from chapter 5. Show all working.",
      totalMarks: 50,
    },
    {
      id: 2,
      title: "Science Lab Report",
      subject: "Science",
      dueDate: "2024-01-18",
      status: "submitted",
      description: "Write a detailed report on the plant cell experiment.",
      totalMarks: 40,
    },
    {
      id: 3,
      title: "Python Project",
      subject: "ICT",
      dueDate: "2024-01-25",
      status: "pending",
      description: "Create a simple calculator program using Python.",
      totalMarks: 60,
    },
    {
      id: 4,
      title: "Geometry Worksheet",
      subject: "Mathematics",
      dueDate: "2024-01-15",
      status: "late",
      description: "Complete the geometry exercises on angles and triangles.",
      totalMarks: 30,
    },
    {
      id: 5,
      title: "Chemistry Quiz Prep",
      subject: "Science",
      dueDate: "2024-01-22",
      status: "pending",
      description: "Prepare answers for the chemical reactions quiz.",
      totalMarks: 25,
    },
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "success"
      case "late":
        return "destructive"
      default:
        return "warning"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return <FiCheckCircle className="h-4 w-4" />
      case "late":
        return <FiAlertCircle className="h-4 w-4" />
      default:
        return <FiClock className="h-4 w-4" />
    }
  }

  const pendingCount = assignments.filter((a) => a.status === "pending").length
  const submittedCount = assignments.filter((a) => a.status === "submitted").length
  const completionRate = (submittedCount / assignments.length) * 100

  const handleUploadAnswer = (assignment) => {
    toast.info(`Upload answer feature for "${assignment.title}" coming soon!`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Assignments</h2>
        <p className="text-gray-600 mt-1">Track and submit your homework</p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{pendingCount}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{submittedCount}</p>
              <p className="text-sm text-gray-600">Submitted</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{assignments.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Completion Rate</span>
              <span className="text-sm text-gray-600">{completionRate.toFixed(0)}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{assignment.subject}</Badge>
                    <Badge variant={getStatusColor(assignment.status)} className="flex items-center gap-1">
                      {getStatusIcon(assignment.status)}
                      <span className="capitalize">{assignment.status}</span>
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-2">{assignment.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCalendar className="h-4 w-4" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-gray-600">
                    Total Marks: <span className="font-semibold text-gray-900">{assignment.totalMarks}</span>
                  </div>
                </div>
                {assignment.status !== "submitted" && (
                  <Button onClick={() => handleUploadAnswer(assignment)}>
                    <FiUpload className="h-4 w-4 mr-2" />
                    Upload Answer
                  </Button>
                )}
                {assignment.status === "submitted" && (
                  <Button variant="outline">View Submission</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
