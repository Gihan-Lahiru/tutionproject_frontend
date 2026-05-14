import { useState, useEffect, useContext } from 'react'
import { Card, CardContent } from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import Badge from '../../components/UI/Badge'
import { FiDownload, FiFileText, FiCheckSquare, FiSearch } from 'react-icons/fi'
import { AuthContext } from '../../contexts/AuthContext'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function PastPapers() {
  const { user } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState("")
  const [papers, setPapers] = useState([])
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
    fetchPapers()
  }, [])

  const fetchPapers = async () => {
    try {
      const response = await api.get('/papers?type=Paper')
      setPapers(response.data.papers || [])
    } catch (error) {
      console.error('Error fetching papers:', error)
      toast.error('Failed to load papers')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (paper) => {
    const downloadToastId = toast.info('Download starts...', { autoClose: false })

    try {
      // Update download count in background so watermark download can start immediately.
      api.post(`/papers/${paper.id}/download`).catch((err) => {
        console.error('Download count update error:', err)
      })

      const extensionByMime = {
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/vnd.ms-powerpoint': 'ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
        'text/plain': 'txt',
        'image/png': 'png',
        'image/jpeg': 'jpg',
      }

      const downloadFromResponse = (response) => {
        const contentType = (response.headers['content-type'] || 'application/octet-stream')
          .split(';')[0]
          .trim()
          .toLowerCase()
        const blob = new Blob([response.data], { type: contentType || 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url

        let filename = (paper.topic || paper.title || 'paper').trim()
        const contentDisposition = response.headers['content-disposition']
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        } else {
          const hasExt = /\.[a-z0-9]{2,6}$/i.test(filename)
          if (!hasExt) {
            const guessedExt = extensionByMime[contentType]
            if (guessedExt) filename = `${filename}.${guessedExt}`
          }
        }

        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        // Delay revoking the object URL to avoid race conditions in some browsers
        setTimeout(() => window.URL.revokeObjectURL(url), 5000)
      }

      try {
        const response = await api.get(`/papers/${paper.id}/download`, {
          responseType: 'arraybuffer'
        })
        downloadFromResponse(response)
      } catch (watermarkError) {
        // Non-PDF files cannot be watermarked; fallback to direct file download.
        console.warn('Watermark download failed, using direct file:', watermarkError)
        const fallbackResponse = await api.get(`/papers/${paper.id}/file`, {
          responseType: 'arraybuffer'
        })
        downloadFromResponse(fallbackResponse)
      }

      toast.update(downloadToastId, {
        render: 'Download completed',
        type: 'success',
        autoClose: 3000,
        closeOnClick: true
      })
      
      // Refresh list in background (non-blocking)
      fetchPapers()
    } catch (error) {
      console.error('Download error:', error)
      toast.update(downloadToastId, {
        render: 'Failed to download paper',
        type: 'error',
        autoClose: 3000,
        closeOnClick: true
      })
    }
  }

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      (paper.title && paper.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (paper.topic && paper.topic.toLowerCase().includes(searchQuery.toLowerCase()))

    // Handle both "10" and "Grade 10" formats
    const matchesUserGrade = !user?.grade || 
      paper.grade === user.grade || 
      paper.grade === `Grade ${user.grade}` ||
      paper.grade === `grade ${user.grade}`

    return matchesSearch && matchesUserGrade
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Papers</h2>
        <p className="text-gray-600 mt-1">Access exam papers and answer sheets</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Papers List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading papers...</p>
        </div>
      ) : filteredPapers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FiFileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No papers found</h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Try adjusting your search'
                : 'No papers available yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPapers.map((paper) => (
            <Card key={paper.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center gap-4 p-4">
                {paper.thumbnail_url ? (
                  <img
                    src={paper.thumbnail_url}
                    alt={(paper.topic || paper.title || 'Paper preview').trim()}
                    className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                    <FiFileText className="h-6 w-6" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{(paper.topic || paper.title || 'Untitled Paper').trim()}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 flex-wrap">
                    {paper.topic && <Badge variant="secondary">{paper.topic}</Badge>}
                    {paper.thumbnail_url && (
                      <Badge variant="success" className="flex items-center gap-1">
                        <FiCheckSquare className="h-3 w-3" />
                        <span>Preview</span>
                      </Badge>
                    )}
                    <span>{paper.downloads || 0} downloads</span>
                    <span className="hidden md:inline">•</span>
                    <span className="hidden md:inline">{formatDateTime(paper.uploaded_at || paper.created_at)}</span>
                  </div>
                </div>

                <Button className="flex-shrink-0" onClick={() => handleDownload(paper)}>
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
