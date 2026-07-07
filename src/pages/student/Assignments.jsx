import { useState, useContext, useEffect } from 'react'
import Progress from '../../components/UI/Progress'
import { FiClock, FiCheckCircle, FiCalendar, FiDownload, FiClipboard, FiSmile, FiBookOpen } from 'react-icons/fi'
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
      day: 'numeric'
    })
  }

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const [assignmentsResponse, paperAssignmentsResponse] = await Promise.all([
        api.get('/assignments/my-assignments').catch(() => ({ data: { assignments: [] } })),
        api.get('/papers?type=Assignment').catch(() => ({ data: [] })),
      ])

      const fetchedAssignments = (assignmentsResponse.data.assignments || []).map(a => ({
        ...a,
        source: 'assignment',
        status: a.submitted_at ? 'submitted' : 'pending'
      }))

      const paperItems = Array.isArray(paperAssignmentsResponse.data)
        ? paperAssignmentsResponse.data
        : (paperAssignmentsResponse.data?.papers || [])

      const paperAssignments = paperItems.map((item) => ({
        id: item.id,
        title: item.topic || item.title || 'Assignment',
        description: `Uploaded assignment material (${item.grade || 'All Grades'})`,
        due_date: item.createdAt || item.created_at || new Date().toISOString(),
        submitted_at: null,
        marks: null,
        attachment_url: item.fileUrl || null,
        source: 'paper-assignment',
        status: 'pending',
      }))

      setAssignments([...paperAssignments, ...fetchedAssignments])
    } catch (error) {
      console.error('Error fetching assignments:', error)
      toast.error('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadAttachment = async (assignment) => {
    const downloadToastId = toast.info('Download starts...', { autoClose: false })
    try {
      if (!assignment?.attachment_url) {
        throw new Error('No attachment available')
      }
      const downloadPath = assignment.source === 'paper-assignment'
        ? `/papers/${assignment.id}/download`
        : `/assignments/${assignment.id}/download`
      const response = await api.get(downloadPath, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      let filename = `${String(assignment.title || 'assignment').trim().replace(/[\\/:*?"<>|]/g, '-') || 'assignment'}.pdf`
      const contentDisposition = response.headers['content-disposition']
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/)
        if (filenameMatch) filename = filenameMatch[1]
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
      console.error('Assignment attachment download error:', error)
      try {
        const fallbackLink = document.createElement('a')
        fallbackLink.href = assignment.source === 'paper-assignment'
          ? `${api.defaults.baseURL}/papers/${assignment.id}/file`
          : assignment?.attachment_url
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
      } catch {
        toast.update(downloadToastId, {
          render: 'Failed to download assignment',
          type: 'error',
          autoClose: 3000,
          closeOnClick: true
        })
      }
    }
  }

  const openCount = assignments.filter((a) => a.status !== "submitted").length
  const submittedCount = assignments.filter((a) => a.status === "submitted").length
  const completionRate = assignments.length > 0 ? (submittedCount / assignments.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#0f2240 60%,#1e293b 100%)', boxShadow: '0 8px 32px rgba(15,23,42,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>
            <FiClipboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Assignments</h1>
            <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>Submit worksheets, complete home-work assignments and track scores</p>
          </div>
        </div>
      </div>

      {/* Overview Block */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <FiClock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Pending Assignments</p>
            <p className="text-2xl font-bold text-slate-800">{openCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <FiCheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider">Completed Tasks</p>
            <p className="text-2xl font-bold text-slate-800">{submittedCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-center gap-1.5">
          <div className="flex justify-between items-center text-xxs font-bold text-slate-400 uppercase tracking-wider">
            <span>Overall Completion</span>
            <span className="text-blue-600 font-bold">{completionRate.toFixed(0)}%</span>
          </div>
          <Progress value={completionRate} className="h-2 bg-slate-100" />
        </div>
      </div>

      {/* Assignments List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-500 text-sm mt-3 font-semibold">Loading assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="rounded-2xl bg-white text-center py-16 px-4" style={{ border: '1.5px solid rgba(226,232,240,0.8)' }}>
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiClipboard className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Assignments Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Homework and grading reports will be listed here. Check back soon.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5"
              style={{ border: '1.5px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className={`text-xxs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    assignment.status === 'submitted' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {assignment.status === 'submitted' ? 'Submitted' : 'Pending'}
                  </span>
                  <span className="text-xxs font-bold px-2 py-0.5 rounded-full text-slate-400 bg-slate-100">
                    Due: {formatDateTime(assignment.dueDate || assignment.due_date)}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 leading-snug line-clamp-2">{assignment.title}</h3>
                {assignment.description && (
                  <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-2">{assignment.description}</p>
                )}
              </div>

              <div className="border-t border-slate-100/60 my-4" />

              <div className="flex items-center justify-between gap-3 flex-wrap">
                {assignment.marks ? (
                  <span className="text-xs text-slate-400 font-bold uppercase">
                    Score: <span className="text-emerald-500 text-sm font-extrabold">{assignment.marks}</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-medium italic">Pending grade</span>
                )}

                <div className="flex items-center gap-2">
                  {assignment.attachment_url && (
                    <button
                      onClick={() => handleDownloadAttachment(assignment)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
                    >
                      <FiDownload className="h-3.5 w-3.5" />
                      Attachment
                    </button>
                  )}
                  {assignment.status === 'submitted' && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100">
                      <FiCheckCircle className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
