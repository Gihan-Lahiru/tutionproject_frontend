import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../../components/UI/Modal'
import api from '../../api/axios'
import { classesApi } from '../../api'
import { toast } from 'react-toastify'
import { Users, Clock, BookOpen, X, Megaphone, Video, FileText, StickyNote, ClipboardList } from 'lucide-react'

export default function MyClasses() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState(null)
  const [activePopupTab, setActivePopupTab] = useState('announcements')
  const [iframeReloadSeed, setIframeReloadSeed] = useState(0)
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false)
  const [announcementMessage, setAnnouncementMessage] = useState('')
  const [postingAnnouncement, setPostingAnnouncement] = useState(false)

  const openPortalAction = (action) => {
    if (!selectedClass) return

    if (action === 'announcement') {
      setActivePopupTab('announcements')
      setAnnouncementModalOpen(true)
      return
    }

    const targetPath = action === 'video' ? '/teacher/videos' : '/teacher/papers'
    navigate(targetPath, {
      state: {
        classContext: {
          id: selectedClass.id,
          title: selectedClass.title || selectedClass.name || `Class ${selectedClass.id}`,
          grade: selectedClass.grade,
            location: selectedClass.location || selectedClass.institute || '',
            institute: selectedClass.institute || selectedClass.location || '',
        },
        quickAction: action,
      },
    })
    setSelectedClass(null)
  }

  const closeAnnouncementModal = () => {
    if (postingAnnouncement) return
    setAnnouncementModalOpen(false)
    setAnnouncementMessage('')
  }

  const handlePostAnnouncement = async (e) => {
    e.preventDefault()
    if (!selectedClass?.id) return

    const message = announcementMessage.trim()
    if (!message) {
      toast.error('Announcement message is required')
      return
    }

    try {
      setPostingAnnouncement(true)
      await api.post(`/classes/${selectedClass.id}/announcements`, { message })
      toast.success('Announcement posted successfully')
      closeAnnouncementModal()
      setActivePopupTab('announcements')
      setIframeReloadSeed((prev) => prev + 1)
    } catch (error) {
      console.error('Post announcement error:', error)
      toast.error(error?.response?.data?.message || 'Failed to post announcement')
    } finally {
      setPostingAnnouncement(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await classesApi.getAll()
      const payload = response.data
      const classList = Array.isArray(payload) ? payload : (payload?.classes || [])
      setClasses(classList)
    } catch (error) {
      toast.error('Failed to fetch classes')
      setClasses([])
    } finally {
      setLoading(false)
    }
  }

  const normalizeGrade = (value) => String(value || '').trim()

  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const uniqueClasses = Object.values(
    classes.reduce((acc, classItem) => {
      const grade = normalizeGrade(classItem.grade)
      const locationKey = String(classItem.location || classItem.institute || '').trim().toLowerCase() || 'unknown'
      const key = `${grade}::${locationKey}`

      if (!acc[key]) {
        acc[key] = classItem
        return acc
      }

      const prevTime = new Date(acc[key].created_at || 0).getTime()
      const currTime = new Date(classItem.created_at || 0).getTime()
      if (currTime > prevTime) {
        acc[key] = classItem
      }

      return acc
    }, {})
  )

  const preferredClasses = (() => {
    const hiddenGrades = new Set(['1'])
    const visibleClasses = uniqueClasses.filter((classItem) => {
      const grade = normalizeGrade(classItem.grade)
      const hasRealLocation = String(classItem.location || classItem.institute || '').trim()

      if (grade === '6' && !hasRealLocation) {
        return false
      }

      return !hiddenGrades.has(grade)
    })

    const byGrade = visibleClasses.reduce((acc, classItem) => {
      const grade = normalizeGrade(classItem.grade) || 'unknown'
      if (!acc[grade]) acc[grade] = []
      acc[grade].push(classItem)
      return acc
    }, {})

    return Object.values(byGrade).flatMap((gradeClasses) => {
      const withLocation = gradeClasses.filter((entry) => String(entry.location || entry.institute || '').trim())
      return withLocation.length >= 2 ? withLocation : gradeClasses
    })
  })()

  const groupedByGrade = preferredClasses.reduce((acc, classItem) => {
    const grade = String(classItem.grade || 'Unknown')
    if (!acc[grade]) acc[grade] = []
    acc[grade].push(classItem)
    return acc
  }, {})

  const sortedGrades = Object.keys(groupedByGrade).sort((a, b) => {
    const numA = Number(a)
    const numB = Number(b)
    const bothNumeric = Number.isFinite(numA) && Number.isFinite(numB)
    if (bothNumeric) return numA - numB
    return a.localeCompare(b)
  })

  const normalizeGradeLabel = (grade) => {
    const normalized = String(grade || '').trim()
    if (!normalized) return ''
    return normalized.replace(/^grade\s*/i, '').trim()
  }

  const formatGradeLabel = (grade) => {
    const normalized = normalizeGradeLabel(grade)
    if (!normalized || normalized === '1') return ''
    return `Grade ${normalized}`
  }

  const gradeColors = [
    'linear-gradient(135deg, #3b82f6, #1d4ed8)', // Blue
    'linear-gradient(135deg, #6366f1, #4f46e5)', // Indigo
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl p-6 sm:p-8 animate-pulse" style={{ background: '#e2e8f0', height: '120px' }} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="rounded-2xl animate-pulse" style={{ background: '#f1f5f9', height: '180px' }} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#0f2040 60%,#1e293b 100%)', boxShadow: '0 8px 32px rgba(15,23,42,0.2)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">My Classes</h1>
              <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>Classes are grouped by grade and location.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl self-start sm:self-auto" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
            <BookOpen className="w-4 h-4" style={{ color: '#60a5fa' }} />
            <span className="text-sm font-bold" style={{ color: '#60a5fa' }}>{preferredClasses.length} Classes</span>
          </div>
        </div>
      </div>

      {sortedGrades.length === 0 ? (
        <div className="rounded-2xl flex flex-col items-center justify-center py-16 gap-3" style={{ background: '#fff', border: '1.5px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#f1f5f9' }}>
            <BookOpen className="w-7 h-7" style={{ color: '#94a3b8' }} />
          </div>
          <p className="font-semibold" style={{ color: '#64748b' }}>No classes available yet.</p>
          <p className="text-sm" style={{ color: '#94a3b8' }}>Classes are created automatically when students enrol.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedGrades.map((grade, gi) => (
            <div key={grade}>
              {formatGradeLabel(grade) && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-6 rounded-full" style={{ background: gradeColors[gi % gradeColors.length] }} />
                  <h2 className="text-lg font-bold" style={{ color: '#1e293b' }}>{formatGradeLabel(grade)}</h2>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#f1f5f9', color: '#64748b' }}>{groupedByGrade[grade].length} class{groupedByGrade[grade].length !== 1 ? 'es' : ''}</span>
                </div>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {groupedByGrade[grade].map((classItem, idx) => {
                  const rawTitle = String(classItem.title || classItem.name || classItem.subject || '').trim()
                  const normalizedGrade = normalizeGradeLabel(grade)
                  const gradePattern = new RegExp(`(?:^|\\s)Grade\\s*${escapeRegex(normalizedGrade)}(?:\\s|$)`, 'ig')
                  const cleanedTitle = rawTitle.replace(gradePattern, ' ').replace(/\s+/g, ' ').trim() || 'Science Class'
                  const instituteName = String(classItem.institute || classItem.location || '').trim() || 'Class Location'
                  const locationLabel = String(classItem.location || '').trim()
                  const studentCount = classItem.student_count ?? classItem.studentCount ?? (Array.isArray(classItem.students) ? classItem.students.length : 0)
                  const color = gradeColors[(gi + idx) % gradeColors.length]

                  return (
                    <div
                      key={classItem.id}
                      className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                      style={{ background: '#fff', border: '1.5px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'}
                    >
                      {/* Card top accent bar */}
                      <div className="h-1.5 w-full" style={{ background: color }} />
                      <div className="p-5">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm" style={{ background: color, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                            {normalizeGradeLabel(grade)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base leading-tight" style={{ color: '#1e293b' }}>{instituteName}</h3>
                            <p className="text-sm mt-0.5 truncate" style={{ color: '#64748b' }}>{cleanedTitle}</p>
                            {locationLabel && <p className="text-xs mt-0.5 font-medium capitalize" style={{ color: '#3b82f6' }}>{locationLabel}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#64748b' }}>
                            <Users className="w-3.5 h-3.5" />
                            <span>{studentCount} students</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#64748b' }}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>{classItem.day || 'Tue'} · {classItem.time || '4:00pm'}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedClass(classItem)}
                          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                          style={{ background: color, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          Manage Class
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedClass && (
        <div className="fixed inset-0 z-50 p-4 sm:p-6" style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl w-full h-full shadow-2xl overflow-hidden flex flex-col" style={{ border: '1.5px solid rgba(226,232,240,0.8)' }}>
            <div className="flex items-center justify-between px-4 sm:px-6 py-4" style={{ borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(90deg,#f8fafc,#fff)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}>
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold" style={{ color: '#1e293b' }}>
                    {selectedClass.title || selectedClass.name}
                    {selectedClass.location && <span className="ml-2 text-sm font-medium" style={{ color: '#3b82f6' }}>({selectedClass.location})</span>}
                  </h2>
                  <p className="text-xs" style={{ color: '#94a3b8' }}>Class Management</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all"
                style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#64748b' }}
                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                aria-label="Close class popup"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-3" style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Post Announcement', action: 'announcement', icon: Megaphone, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
                  { label: 'Create Assignment', action: 'assignment', icon: ClipboardList, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                  { label: 'Upload Notes', action: 'note', icon: StickyNote, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
                  { label: 'Add Video', action: 'video', icon: Video, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
                  { label: 'Upload Paper', action: 'paper', icon: FileText, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
                ].map(({ label, action, icon: Icon, color, bg }) => (
                  <button
                    key={action}
                    onClick={() => openPortalAction(action)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: bg, color, border: `1px solid ${color}30` }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1" style={{ background: '#f8fafc' }}>
              <iframe
                key={`${selectedClass.id}-${iframeReloadSeed}`}
                src={`/class/${selectedClass.id}?tab=${encodeURIComponent(activePopupTab)}`}
                title={`Manage class ${selectedClass.id}`}
                className="w-full h-full border-0"
              />
            </div>

            <Modal
              isOpen={announcementModalOpen}
              onClose={closeAnnouncementModal}
              title="Post Announcement"
            >
              <form onSubmit={handlePostAnnouncement} className="space-y-4">
                <textarea
                  value={announcementMessage}
                  onChange={(e) => setAnnouncementMessage(e.target.value)}
                  rows={5}
                  placeholder="Type announcement for this class..."
                  className="w-full rounded-xl p-3 text-sm outline-none resize-none transition-all"
                  style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#1e293b' }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={closeAnnouncementModal} disabled={postingAnnouncement}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: '#f1f5f9', color: '#475569', border: '1.5px solid #e2e8f0' }}
                  >Cancel</button>
                  <button type="submit" disabled={postingAnnouncement}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', opacity: postingAnnouncement ? 0.7 : 1 }}
                  >{postingAnnouncement ? 'Posting...' : 'Post Announcement'}</button>
                </div>
              </form>
            </Modal>
          </div>
        </div>
      )}
    </div>
  )
}
