import { useState, useEffect, useContext } from 'react'
import { Card, CardContent } from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import { FiPlay, FiClock, FiCheckCircle, FiSearch } from 'react-icons/fi'
import { AuthContext } from '../../contexts/AuthContext'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function Videos() {
  const { user } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState([])
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

  const normalizeGradeKey = (value) => {
    if (value == null) return null
    const str = String(value)
    const digits = str.match(/\d+/)?.[0]
    return digits || str.trim() || null
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await api.get('/videos')
      const data = response.data
      const list = Array.isArray(data) ? data : (data?.videos || [])
      setVideos(list)
    } catch (error) {
      console.error('Error fetching videos:', error)
      toast.error('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  const handleWatchVideo = (video) => {
    const actionToastId = toast.info('Download starts...', { autoClose: false })
    const url = video?.url || video?.video_url
    if (!url) {
      toast.update(actionToastId, {
        render: 'Failed to open video',
        type: 'error',
        autoClose: 3000,
        closeOnClick: true
      })
      return
    }

    const openedWindow = window.open(url, '_blank')
    if (!openedWindow) {
      toast.update(actionToastId, {
        render: 'Failed to open video',
        type: 'error',
        autoClose: 3000,
        closeOnClick: true
      })
      return
    }

    toast.update(actionToastId, {
      render: 'Download completed',
      type: 'success',
      autoClose: 3000,
      closeOnClick: true
    })
  }

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const userGradeKey = normalizeGradeKey(user?.grade)
    const videoGradeKey = normalizeGradeKey(video?.grade)
    const matchesGrade = !userGradeKey || !videoGradeKey || videoGradeKey === userGradeKey
    return matchesSearch && matchesGrade
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Video Lessons</h2>
        <p className="text-gray-600 mt-1">Watch all your lessons</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Videos Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading videos...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FiPlay className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try a different search term' : 'No videos available yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-video bg-gradient-to-br from-blue-500 to-purple-600">
                {video.thumbnail_url ? (
                  <img 
                    src={video.thumbnail_url} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiPlay className="h-16 w-16 text-white/50" />
                  </div>
                )}
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer group"
                  onClick={() => handleWatchVideo(video)}
                >
                  <div className="rounded-full bg-blue-600 p-3 group-hover:scale-110 transition-transform">
                    <FiPlay className="h-6 w-6 text-white fill-current" />
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                {video.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{video.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>{formatDateTime(video.created_at || video.uploaded_at)}</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleWatchVideo(video)}
                >
                  <FiPlay className="h-4 w-4 mr-2" />
                  Watch Video
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
