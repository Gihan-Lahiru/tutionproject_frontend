import { useState, useEffect, useContext, useMemo } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import Modal from '../../components/UI/Modal'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import { FiVideo, FiBell, FiUsers } from 'react-icons/fi'

export default function ClassPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [classData, setClassData] = useState(null)
  const [activeTab, setActiveTab] = useState('announcements')
  const [announcements, setAnnouncements] = useState([])
  const [assignments, setAssignments] = useState([])
  const [notes, setNotes] = useState([])
  const [videos, setVideos] = useState([])
  const [papers, setPapers] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [saving, setSaving] = useState(false)

  const [announcementMessage, setAnnouncementMessage] = useState('')
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', due_date: '', attachment_url: '' })
  const [noteForm, setNoteForm] = useState({ title: '', file_url: '', file_type: 'application/pdf' })
  const [videoForm, setVideoForm] = useState({ title: '', url: '', description: '' })
  const [paperForm, setPaperForm] = useState({ title: '', topic: '', type: 'Paper', file: null, thumbnail: null })

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin'

  useEffect(() => {
    fetchAllClassData()
  }, [id])

  useEffect(() => {
    const quickAction = location.state?.quickAction
    if (!quickAction || !isTeacher) return

    const tabByAction = {
      announcement: 'announcements',
      assignment: 'assignments',
      note: 'notes',
      video: 'videos',
      paper: 'papers',
    }

    if (!tabByAction[quickAction]) return

    setActiveTab(tabByAction[quickAction])
    openTeacherAction(quickAction)

    // Clear location state so refresh/back does not auto-open the same action again.
    navigate(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navigate, isTeacher])

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab')
    const allowedTabs = ['announcements', 'assignments', 'notes', 'videos', 'papers', 'students']
    if (!tab || !allowedTabs.includes(tab)) return
    setActiveTab(tab)
  }, [location.search])

  const fetchAllClassData = async () => {
    try {
      setLoading(true)

      const [classRes, announcementsRes, assignmentsRes, notesRes, videosRes, studentsRes, papersRes] = await Promise.all([
        api.get(`/classes/${id}`),
        api.get(`/classes/${id}/announcements`).catch(() => ({ data: { announcements: [] } })),
        api.get(`/assignments/class/${id}`).catch(() => ({ data: { assignments: [] } })),
        api.get(`/notes/class/${id}`).catch(() => ({ data: { notes: [] } })),
        api.get(`/videos/class/${id}`).catch(() => ({ data: [] })),
        api.get(`/classes/${id}/students`).catch(() => ({ data: { students: [] } })),
        api.get(`/papers?classId=${encodeURIComponent(id)}&type=Paper`).catch(() => ({ data: { papers: [] } })),
      ])

      setClassData(classRes?.data?.class || null)
      setAnnouncements(announcementsRes?.data?.announcements || [])
      setAssignments(assignmentsRes?.data?.assignments || [])
      setNotes(notesRes?.data?.notes || [])
      setVideos(videosRes?.data || [])
      setStudents(studentsRes?.data?.students || [])
      setPapers(papersRes?.data?.papers || [])
    } catch (error) {
      console.error('Failed to load class data:', error)
      toast.error('Failed to load class data')
    } finally {
      setLoading(false)
    }
  }

  const classFeeText = useMemo(() => {
    const rawGrade = String(classData?.grade || '').trim()
    const normalizedGrade = rawGrade.replace(/^grade\s+/i, '').trim()
    const fee = Number(classData?.fee)
    if (normalizedGrade === '6' && (!Number.isFinite(fee) || fee <= 0)) {
      return 'Rs 1,000'
    }
    if (!Number.isFinite(fee) || fee <= 0) return 'Not set'
    return `Rs ${fee.toLocaleString()}`
  }, [classData])

  const classTimeText = useMemo(() => {
    const day = String(classData?.day || '').trim()
    const time = String(classData?.time || '').trim()
    if (day && time) return `${day} ${time}`
    if (time) return time
    if (day) return day
    return 'Not set'
  }, [classData])

  const openTeacherAction = (type) => {
    setModalType(type)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalType('')
  }

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault()
    if (!announcementMessage.trim()) {
      toast.error('Announcement message is required')
      return
    }

    try {
      setSaving(true)
      await api.post(`/classes/${id}/announcements`, { message: announcementMessage.trim() })
      toast.success('Announcement posted successfully')
      setAnnouncementMessage('')
      closeModal()
      fetchAllClassData()
    } catch (error) {
      console.error('Create announcement error:', error)
      toast.error(error?.response?.data?.message || 'Failed to post announcement')
    } finally {
      setSaving(false)
    }
  }

  const handleCreateAssignment = async (e) => {
    e.preventDefault()
    if (!assignmentForm.title.trim()) {
      toast.error('Assignment title is required')
      return
    }

    try {
      setSaving(true)
      await api.post(`/assignments/class/${id}`, {
        title: assignmentForm.title.trim(),
        description: assignmentForm.description.trim() || null,
        due_date: assignmentForm.due_date || null,
        attachment_url: assignmentForm.attachment_url.trim() || null,
      })
      toast.success('Assignment created successfully')
      setAssignmentForm({ title: '', description: '', due_date: '', attachment_url: '' })
      closeModal()
      fetchAllClassData()
    } catch (error) {
      console.error('Create assignment error:', error)
      toast.error(error?.response?.data?.message || 'Failed to create assignment')
    } finally {
      setSaving(false)
    }
  }

  const handleCreateNote = async (e) => {
    e.preventDefault()
    if (!noteForm.title.trim() || !noteForm.file_url.trim()) {
      toast.error('Note title and file URL are required')
      return
    }

    try {
      setSaving(true)
      await api.post(`/notes/class/${id}`, {
        title: noteForm.title.trim(),
        file_url: noteForm.file_url.trim(),
        file_type: noteForm.file_type.trim() || 'application/pdf',
      })
      toast.success('Note uploaded successfully')
      setNoteForm({ title: '', file_url: '', file_type: 'application/pdf' })
      closeModal()
      fetchAllClassData()
    } catch (error) {
      console.error('Create note error:', error)
      toast.error(error?.response?.data?.message || 'Failed to upload note')
    } finally {
      setSaving(false)
    }
  }

  const handleCreateVideo = async (e) => {
    e.preventDefault()
    if (!videoForm.title.trim() || !videoForm.url.trim()) {
      toast.error('Video title and URL are required')
      return
    }

    try {
      setSaving(true)
      await api.post(`/videos/class/${id}`, {
        title: videoForm.title.trim(),
        url: videoForm.url.trim(),
        description: videoForm.description.trim() || null,
      })
      toast.success('Video added successfully')
      setVideoForm({ title: '', url: '', description: '' })
      closeModal()
      fetchAllClassData()
    } catch (error) {
      console.error('Create video error:', error)
      toast.error(error?.response?.data?.message || 'Failed to add video')
    } finally {
      setSaving(false)
    }
  }

  const handleUploadPaper = async (e) => {
    e.preventDefault()
    if (!paperForm.title.trim() || !paperForm.file) {
      toast.error('Paper title and file are required')
      return
    }

    try {
      setSaving(true)
      const formData = new FormData()
      formData.append('title', paperForm.title.trim())
      formData.append('topic', paperForm.topic.trim())
      formData.append('grade', classData?.grade || '')
      formData.append('type', paperForm.type)
      formData.append('class_id', String(id))
      formData.append('file', paperForm.file)
      if (paperForm.thumbnail) {
        formData.append('thumbnail', paperForm.thumbnail)
      }

      await api.post('/papers/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success('Paper uploaded successfully')
      setPaperForm({ title: '', topic: '', type: 'Paper', file: null, thumbnail: null })
      closeModal()
      fetchAllClassData()
    } catch (error) {
      console.error('Upload paper error:', error)
      toast.error(error?.response?.data?.message || 'Failed to upload paper')
    } finally {
      setSaving(false)
    }
  }

  const renderTeacherModal = () => {
    if (!modalOpen) return null

    if (modalType === 'announcement') {
      return (
        <Modal isOpen={modalOpen} onClose={closeModal} title="Post Announcement">
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <textarea
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              rows={5}
              placeholder="Type announcement for this class"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Posting...' : 'Post Announcement'}</Button>
            </div>
          </form>
        </Modal>
      )
    }

    if (modalType === 'assignment') {
      return (
        <Modal isOpen={modalOpen} onClose={closeModal} title="Create Assignment">
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <input
              value={assignmentForm.title}
              onChange={(e) => setAssignmentForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Assignment title"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <textarea
              value={assignmentForm.description}
              onChange={(e) => setAssignmentForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Assignment description"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <input
              type="datetime-local"
              value={assignmentForm.due_date}
              onChange={(e) => setAssignmentForm((prev) => ({ ...prev, due_date: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <input
              value={assignmentForm.attachment_url}
              onChange={(e) => setAssignmentForm((prev) => ({ ...prev, attachment_url: e.target.value }))}
              placeholder="Attachment URL (optional)"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create Assignment'}</Button>
            </div>
          </form>
        </Modal>
      )
    }

    if (modalType === 'note') {
      return (
        <Modal isOpen={modalOpen} onClose={closeModal} title="Upload Note">
          <form onSubmit={handleCreateNote} className="space-y-4">
            <input
              value={noteForm.title}
              onChange={(e) => setNoteForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Note title"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <input
              value={noteForm.file_url}
              onChange={(e) => setNoteForm((prev) => ({ ...prev, file_url: e.target.value }))}
              placeholder="File URL"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <input
              value={noteForm.file_type}
              onChange={(e) => setNoteForm((prev) => ({ ...prev, file_type: e.target.value }))}
              placeholder="File Type"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Uploading...' : 'Upload Note'}</Button>
            </div>
          </form>
        </Modal>
      )
    }

    if (modalType === 'video') {
      return (
        <Modal isOpen={modalOpen} onClose={closeModal} title="Add Video">
          <form onSubmit={handleCreateVideo} className="space-y-4">
            <input
              value={videoForm.title}
              onChange={(e) => setVideoForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Video title"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <input
              value={videoForm.url}
              onChange={(e) => setVideoForm((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="Video URL"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <textarea
              value={videoForm.description}
              onChange={(e) => setVideoForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              placeholder="Description"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Adding...' : 'Add Video'}</Button>
            </div>
          </form>
        </Modal>
      )
    }

    if (modalType === 'paper') {
      return (
        <Modal isOpen={modalOpen} onClose={closeModal} title="Upload Paper">
          <form onSubmit={handleUploadPaper} className="space-y-4">
            <input
              value={paperForm.title}
              onChange={(e) => setPaperForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Paper title"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <input
              value={paperForm.topic}
              onChange={(e) => setPaperForm((prev) => ({ ...prev, topic: e.target.value }))}
              placeholder="Topic (optional)"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <div>
              <label className="block text-sm text-gray-700 mb-1">Paper file</label>
              <input
                type="file"
                onChange={(e) => setPaperForm((prev) => ({ ...prev, file: e.target.files?.[0] || null }))}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Thumbnail (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPaperForm((prev) => ({ ...prev, thumbnail: e.target.files?.[0] || null }))}
                className="w-full border border-gray-300 rounded-lg p-3"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Uploading...' : 'Upload Paper'}</Button>
            </div>
          </form>
        </Modal>
      )
    }

    return null
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading class...</div>
  }

  if (!classData) {
    return <div className="min-h-screen flex items-center justify-center">Class not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 gap-4 text-sm sm:text-base">
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <p className="opacity-80">Class Time</p>
              <p className="font-semibold">{classTimeText}</p>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <p className="opacity-80">Class Fee</p>
              <p className="font-semibold">{classFeeText}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 border-b">
          <div className="flex flex-wrap gap-6">
            {['announcements', 'assignments', 'notes', 'videos', 'papers', 'students'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-2 font-medium capitalize ${
                  activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {activeTab === 'announcements' && <AnnouncementsTab announcements={announcements} />}
          {activeTab === 'assignments' && <AssignmentsTab assignments={assignments} isTeacher={isTeacher} />}
          {activeTab === 'notes' && <NotesTab notes={notes} />}
          {activeTab === 'videos' && <VideosTab videos={videos} />}
          {activeTab === 'papers' && <PapersTab papers={papers} />}
          {activeTab === 'students' && <StudentsTab students={students} />}
        </div>
      </div>

      {renderTeacherModal()}
    </div>
  )
}

function EmptyState({ message }) {
  return <Card className="text-center py-8 text-gray-600">{message}</Card>
}

function AnnouncementsTab({ announcements }) {
  if (!announcements.length) return <EmptyState message="No announcements yet" />

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card key={announcement.id}>
          <div className="flex items-start space-x-4">
            <div className="bg-primary text-white p-3 rounded-full">
              <FiBell size={20} />
            </div>
            <div className="flex-1">
              <p className="text-gray-700">{announcement.message || announcement.content || '-'}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(announcement.created_at).toLocaleString()}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function AssignmentsTab({ assignments, isTeacher }) {
  if (!assignments.length) return <EmptyState message="No assignments yet" />

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id}>
          <h3 className="text-xl font-bold mb-2">{assignment.title}</h3>
          <p className="text-gray-700 mb-3">{assignment.description || '-'}</p>
          <p className="text-sm text-gray-600">Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : '-'}</p>
          {!isTeacher && <Button className="mt-3" size="sm">Submit Assignment</Button>}
        </Card>
      ))}
    </div>
  )
}

function NotesTab({ notes }) {
  if (!notes.length) return <EmptyState message="No notes uploaded yet" />

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {notes.map((note) => (
        <Card key={note.id}>
          <h3 className="font-bold mb-2">{note.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{note.file_type || 'Document'}</p>
          <Button size="sm" variant="outline">Download</Button>
        </Card>
      ))}
    </div>
  )
}

function VideosTab({ videos }) {
  if (!videos.length) return <EmptyState message="No videos available yet" />

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {videos.map((video) => (
        <Card key={video.id}>
          <div className="bg-gray-200 h-40 rounded-lg mb-3 flex items-center justify-center">
            <FiVideo size={48} className="text-gray-400" />
          </div>
          <h3 className="font-bold mb-2">{video.title}</h3>
          <Button size="sm" className="w-full">Watch Now</Button>
        </Card>
      ))}
    </div>
  )
}

function PapersTab({ papers }) {
  if (!papers.length) return <EmptyState message="No papers available for this class" />

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {papers.map((paper) => (
        <Card key={paper.id}>
          <h3 className="font-bold mb-2">{paper.topic || paper.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{paper.type || 'Paper'}</p>
          <Button size="sm" variant="outline">Download</Button>
        </Card>
      ))}
    </div>
  )
}

function StudentsTab({ students }) {
  if (!students.length) return <EmptyState message="No students found in this class" />

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {students.map((student) => (
        <Card key={student.id}>
          <div className="flex items-start gap-3">
            <div className="bg-gray-100 rounded-full p-2">
              <FiUsers className="text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{student.name}</p>
              <p className="text-sm text-gray-600">{student.email}</p>
              <p className="text-xs text-gray-500 mt-1">Grade: {student.grade || '-'}</p>
              <p className="text-xs text-gray-500">Institute: {student.institute || '-'}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
