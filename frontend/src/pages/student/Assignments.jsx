import { useState, useContext, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import Badge from '../../components/UI/Badge'
import Progress from '../../components/UI/Progress'
import { FiClock, FiCheckCircle, FiCalendar, FiDownload } from 'react-icons/fi'
import { AuthContext } from '../../contexts/AuthContext'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function Assignments() {
  const { user } = useContext(AuthContext)
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  const parseAppDate = (value) => {
    if (!value) return null
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value

    const raw = String(value).trim()
    if (!raw) return null

    const sqliteMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/)
    if (sqliteMatch) {
      const [, y, m, d, hh = '00', mm = '00', ss = '00'] = sqliteMatch
      const parsed = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss))
      return Number.isNaN(parsed.getTime()) ? null : parsed
    }

    const parsed = new Date(raw)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const formatDateTime = (value) => {
    const parsed = parseAppDate(value)
    if (!parsed) return 'Date unavailable'
    return parsed.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments/my-assignments')
      const fetchedAssignments = (response.data.assignments || []).map(a => ({
        ...a,
        status: a.submitted_at ? 'submitted' : 'pending'
      }))
      setAssignments(fetchedAssignments)
    } catch (error) {
      console.error('Error fetching assignments:', error)
      toast.error('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "success"
      default:
        return "warning"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return <FiCheckCircle className="h-4 w-4" />
      default:
        return <FiClock className="h-4 w-4" />
    }
  }

  const openCount = assignments.filter((a) => a.status !== "submitted").length
  const submittedCount = assignments.filter((a) => a.status === "submitted").length
  const completionRate = (submittedCount / assignments.length) * 100

  const handleDownloadAttachment = async (assignment) => {
    const downloadToastId = toast.info('Download starts...', { autoClose: false })

    try {
      if (!assignment?.attachment_url) {
        throw new Error('No attachment available')
      }

      const response = await api.get(`/assignments/${assignment.id}/download`, {
        responseType: 'blob'
      })

      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/pdf'
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      let filename = `${String(assignment.title || 'assignment').trim().replace(/[\\/:*?"<>|]/g, '-') || 'assignment'}.pdf`
      const contentDisposition = response.headers['content-disposition']
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.update(downloadToastId, {
        render: 'Download completed',
        type: 'success',
        autoClose: 3000,
        closeOnClick: true
      })
    } catch (error) {
      // Some providers block cross-origin blob reads; fallback to direct open.
      console.error('Assignment attachment download error:', error)
      try {
        const fallbackLink = document.createElement('a')
        fallbackLink.href = assignment?.attachment_url
        fallbackLink.target = '_blank'
        fallbackLink.rel = 'noopener noreferrer'
        document.body.appendChild(fallbackLink)
        fallbackLink.click()
        document.body.removeChild(fallbackLink)

        toast.update(downloadToastId, {
          render: 'Opened attachment in a new tab',
          type: 'info',
          autoClose: 3000,
          closeOnClick: true
        })
      } catch (_fallbackError) {
        toast.update(downloadToastId, {
          render: 'Failed to download assignment',
          type: 'error',
          autoClose: 3000,
          closeOnClick: true
        })
      }
    }
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
              <p className="text-3xl font-bold text-blue-600">{openCount}</p>
              <p className="text-sm text-gray-600">Open</p>
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
      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">Loading assignments...</div>
          </CardContent>
        </Card>
      ) : assignments.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">No assignments available</div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 min-w-0">
                    {assignment.status === "submitted" && (
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant={getStatusColor(assignment.status)} className="flex items-center gap-1">
                          {getStatusIcon(assignment.status)}
                          <span className="capitalize">{assignment.status}</span>
                        </Badge>
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900 truncate">{assignment.title}</h3>
                    {assignment.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{assignment.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 flex-wrap">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="h-4 w-4" />
                        <span>Due: {formatDateTime(assignment.due_date)}</span>
                      </div>
                      {assignment.marks && (
                        <>
                          <span>•</span>
                          <span>Your Marks: <span className="font-semibold text-green-600">{assignment.marks}</span></span>
                        </>
                      )}
                      {assignment.submitted_at && (
                        <>
                          <span className="hidden md:inline">•</span>
                          <span className="hidden md:inline">Submitted: {formatDateTime(assignment.submitted_at)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap md:justify-end">
                    {assignment.status === "submitted" && (
                      <Button variant="outline">View Submission</Button>
                    )}
                    {assignment.attachment_url && (
                      <Button variant="outline" onClick={() => handleDownloadAttachment(assignment)}>
                        <FiDownload className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
