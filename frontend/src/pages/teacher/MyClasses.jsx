import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import Modal from '../../components/UI/Modal'
import api from '../../api/axios'
import { classesApi } from '../../api'
import { toast } from 'react-toastify'
import { FiUsers, FiClock } from 'react-icons/fi'
import { FiX } from 'react-icons/fi'

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
      setClasses(response.data.classes || [])
    } catch (error) {
      toast.error('Failed to fetch classes')
    } finally {
      setLoading(false)
    }
  }

  const normalizeGrade = (value) => String(value || '').trim()

  const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const uniqueClasses = Object.values(
    classes.reduce((acc, classItem) => {
      const grade = normalizeGrade(classItem.grade)
      const locationKey = String(classItem.location || 'main').trim().toLowerCase()
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

  const groupedByGrade = uniqueClasses.reduce((acc, classItem) => {
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

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Classes</h1>
        <p className="text-gray-600 mt-2">
          Classes are automatically created per grade with two locations when students register.
        </p>
      </div>

      {sortedGrades.length === 0 ? (
        <Card className="p-6 text-center text-gray-600">No classes available yet.</Card>
      ) : (
        <div className="space-y-8">
          {sortedGrades.map((grade) => (
            <div key={grade}>
              <h2 className="text-xl font-semibold mb-4">Grade {grade}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedByGrade[grade].map((classItem) => (
                  (() => {
                    const rawTitle = String(classItem.title || '').trim()
                    const gradePrefix = new RegExp(`^Grade\\s*${escapeRegex(String(grade))}\\s*`, 'i')
                    const cleanedTitle = rawTitle.replace(gradePrefix, '').trim() || 'Science Class'

                    return (
                  <Card key={classItem.id} className="hover:shadow-lg transition">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-1">{cleanedTitle}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-2">
                        <FiClock className="mr-2" />
                        <span>
                          {(classItem.day || 'Tuesday')} {classItem.time || '4.00pm-7.00pm'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <FiUsers className="mr-2" />
                      <span>{classItem.student_count ?? classItem.studentCount ?? 0} students</span>
                    </div>

                    <Button className="w-full" size="sm" onClick={() => setSelectedClass(classItem)}>
                      Manage Class
                    </Button>
                  </Card>
                    )
                  })()
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedClass && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 sm:p-6">
          <div className="bg-white rounded-xl w-full h-full shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{selectedClass.title || selectedClass.name}</h2>
                <p className="text-sm text-gray-600">Class Management Popup</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClass(null)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                aria-label="Close class popup"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-white">
              <p className="text-sm text-gray-700 mb-3">Quick actions for this class:</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
                <Button size="sm" onClick={() => openPortalAction('announcement')}>Post Announcement</Button>
                <Button size="sm" onClick={() => openPortalAction('assignment')}>Create Assignment</Button>
                <Button size="sm" variant="secondary" onClick={() => openPortalAction('note')}>Upload Notes</Button>
                <Button size="sm" variant="outline" onClick={() => openPortalAction('video')}>Add Video</Button>
                <Button size="sm" variant="success" onClick={() => openPortalAction('paper')}>Upload Paper</Button>
              </div>
            </div>

            <div className="flex-1 bg-gray-50">
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
                  placeholder="Type announcement for this class"
                  className="w-full border border-gray-300 rounded-lg p-3"
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeAnnouncementModal} disabled={postingAnnouncement}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={postingAnnouncement}>
                    {postingAnnouncement ? 'Posting...' : 'Post Announcement'}
                  </Button>
                </div>
              </form>
            </Modal>
          </div>
        </div>
      )}
    </div>
  )
}
