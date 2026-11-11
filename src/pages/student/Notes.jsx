import { useState, useEffect, useContext } from 'react'
import { Card, CardContent } from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import { FiSearch, FiDownload, FiFileText } from 'react-icons/fi'
import { AuthContext } from '../../contexts/AuthContext'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import { gradesMatch, institutesMatch, resolveAssetUrl } from '../../utils/dashboardUtils'

export default function Notes() {
  const { user } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState("")
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [classLocations, setClassLocations] = useState({})

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
      const nextNotes = Array.isArray(response.data) ? response.data : (response.data?.papers || [])
      setNotes(nextNotes)
    } catch (error) {
      console.error('Error fetching notes:', error)
      if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || 'Access restricted. Please clear your dues.')
      } else {
        toast.error('Failed to load notes')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (note) => {
    const downloadToastId = toast.info('Download starts...', { autoClose: false })
    try {
      api.post(`/papers/${note.id}/download`).catch((err) => {
        console.error('Download count update error:', err)
      })
      const response = await api.get(`/papers/${note.id}/download`, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      let filename = `${(note.topic || note.title || 'note').trim()}.pdf`
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
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch = !q ||
      String(note.title || '').toLowerCase().includes(q) ||
      String(note.topic || '').toLowerCase().includes(q)
    const matchesGrade = gradesMatch(note.grade, user?.grade)
    const matchesInstitute = !note.classId || institutesMatch(classLocations[note.classId], user?.institute)
    return matchesSearch && matchesGrade && matchesInstitute
  })

  return (
    <div className="space-y-6">
      {/* Page Header - Clean Light Design */}
      <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-xs">
            <FiFileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Notes & PDFs</h1>
            <p className="text-sm text-slate-500 mt-0.5">Download syllabus notes, theory summaries, and study guides.</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 flex items-center" style={{ border: '1.5px solid rgba(226,232,240,0.8)' }}>
        <div className="relative w-full">
          <FiSearch className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes by topic or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Notes List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-500 text-sm mt-3 font-semibold">Loading notes...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="rounded-2xl bg-white text-center py-16 px-4" style={{ border: '1.5px solid rgba(226,232,240,0.8)' }}>
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiFileText className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Notes Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {searchQuery ? 'Adjust your search query and try again.' : 'Lecure notes will appear here once uploaded.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5"
              style={{ border: '1.5px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.03)'}
            >
              {/* Thumbnail */}
              {note.thumbnailUrl || note.thumbnail_url ? (
                <div className="w-full h-48 sm:h-52 overflow-hidden bg-slate-50 flex items-center justify-center p-2 border-b border-slate-100">
                  <img
                    src={resolveAssetUrl(note.thumbnailUrl || note.thumbnail_url)}
                    alt={note.title}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-full h-44 flex items-center justify-center border-b border-slate-100" style={{ background: 'linear-gradient(135deg,#f3e8ff,#e0e7ff)' }}>
                  <FiFileText className="h-12 w-12 text-purple-400" />
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  {formatDateTime(note.createdAt || note.uploaded_at || note.created_at)}
                </span>
                <h3 className="font-bold text-slate-800 leading-snug line-clamp-2 text-sm mb-1">{note.title}</h3>
                {note.topic && note.topic.trim().toLowerCase() !== note.title?.trim().toLowerCase() && (
                  <span className="inline-block text-[10px] font-bold text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md mt-0.5 w-fit">
                    {note.topic}
                  </span>
                )}

                <div className="border-t border-slate-100/80 my-3 mt-auto pt-3 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
                    {note.downloads || 0} {(note.downloads || 0) === 1 ? 'download' : 'downloads'}
                  </span>
                  <button
                    onClick={() => handleDownload(note)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-xs shrink-0 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.92'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <FiDownload className="h-3.5 w-3.5 shrink-0" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
