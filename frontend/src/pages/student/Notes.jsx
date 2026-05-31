import { useState, useEffect, useContext } from 'react'
import { Card, CardContent } from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import Badge from '../../components/UI/Badge'
import { FiSearch, FiDownload, FiFileText } from 'react-icons/fi'
import { AuthContext } from '../../contexts/AuthContext'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function Notes() {
  const { user } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState("")
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [classLocations, setClassLocations] = useState({})

  const resolveAssetUrl = (value) => {
    if (!value) return ''
    if (value.startsWith('http://') || value.startsWith('https://')) return value
    if (value.startsWith('/')) return value
    return `/${value}`
  }

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
    fetchNotes()
  }, [])

  useEffect(() => {
    const fetchClassLocations = async () => {
      try {
        const response = await api.get('/classes')
        const classList = Array.isArray(response.data) ? response.data : (response.data?.classes || [])
        const nextMap = classList.reduce((acc, classItem) => {
          if (classItem?.id) acc[classItem.id] = String(classItem.location || '').trim().toLowerCase()
          return acc
        }, {})
        setClassLocations(nextMap)
      } catch (error) {
        console.error('Error fetching class locations for notes:', error)
        setClassLocations({})
      }
    }

    fetchClassLocations()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await api.get('/papers?type=Note')
      const nextNotes = Array.isArray(response.data)
        ? response.data
        : (response.data?.papers || [])
      setNotes(nextNotes)
    } catch (error) {
      console.error('Error fetching notes:', error)

      if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || 'Access restricted. Please clear your dues.')
        setLoading(false)
        return
      }

      try {
        const localResponse = await fetch('/storage/notes.json', { cache: 'no-store' })
        if (!localResponse.ok) throw new Error(`Failed to load local notes: ${localResponse.status}`)
        const localData = await localResponse.json()
        const localNotes = Array.isArray(localData?.notes) ? localData.notes : []
        setNotes(localNotes.map((item) => ({ ...item, __local: true })))
        if (localNotes.length > 0) {
          toast.info('Loaded notes from frontend storage')
        }
      } catch (localError) {
        console.error('Error loading local notes:', localError)
        toast.error('Failed to load notes')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (note) => {
    if (note.__local && note.fileUrl) {
      const link = document.createElement('a')
      link.href = resolveAssetUrl(note.fileUrl)
      link.download = `${(note.topic || note.title || 'note').trim()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Download completed')
      return
    }

    const downloadToastId = toast.info('Download starts...', { autoClose: false })

    try {
      // Update download count in background so watermark download can start immediately.
      api.post(`/papers/${note.id}/download`).catch((err) => {
        console.error('Download count update error:', err)
      })

      const response = await api.get(`/papers/${note.id}/download`, {
        responseType: 'blob'
      })
      
      // Create download link
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      let filename = `${(note.topic || note.title || 'note').trim()}.pdf`
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
      
      // Refresh notes in background (non-blocking)
      fetchNotes()
    } catch (error) {
      console.error('Download error:', error)
      toast.update(downloadToastId, {
        render: 'Failed to download note',
        type: 'error',
        autoClose: 3000,
        closeOnClick: true
      })
    }
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (note.topic && note.topic.toLowerCase().includes(searchQuery.toLowerCase()))
    // Handle both "10" and "Grade 10" formats
    const matchesGrade = !user?.grade || 
      note.grade === user.grade || 
      note.grade === `Grade ${user.grade}` ||
      note.grade === `grade ${user.grade}`
    const userInstitute = String(user?.institute || '').trim().toLowerCase()
    const noteClassLocation = String(classLocations[note.classId] || '').trim().toLowerCase()
    const matchesInstitute = !userInstitute || !note.classId || noteClassLocation === userInstitute
    return matchesSearch && matchesGrade && matchesInstitute
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Notes & PDFs</h2>
        <p className="text-gray-600 mt-1">Download all your learning materials</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading notes...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FiFileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try adjusting your search'
                : 'No notes available yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 flex-shrink-0">
                  <FiFileText className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{(note.topic || note.title || 'Untitled Note').trim()}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 flex-wrap">
                    {note.topic && <Badge variant="secondary">{note.topic}</Badge>}
                    <span>{note.downloads || 0} downloads</span>
                    <span className="hidden md:inline">•</span>
                    <span className="hidden md:inline">{formatDateTime(note.uploaded_at || note.created_at)}</span>
                  </div>
                </div>
                <Button onClick={() => handleDownload(note)} className="flex-shrink-0">
                  <FiDownload className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
