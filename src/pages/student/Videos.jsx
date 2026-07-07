import { useState, useEffect, useContext } from 'react'
import { FiPlay, FiSearch, FiVideo, FiClock } from 'react-icons/fi'
import { AuthContext } from '../../contexts/AuthContext'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function Videos() {
  const { user } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [classLocations, setClassLocations] = useState({})

  const resolveAssetUrl = (value) => {
    if (!value) return ''
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) return value
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
      day: 'numeric'
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
        console.error('Error fetching class locations for videos:', error)
        setClassLocations({})
      }
    }
    fetchClassLocations()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await api.get('/videos')
      const data = response.data
      const list = Array.isArray(data) ? data : (data?.videos || [])
      setVideos(list)
    } catch (error) {
      console.error('Error fetching videos:', error)
      if (error.response?.status === 403) {
        toast.error(error.response?.data?.message || 'Access restricted. Please clear your dues.')
      } else {
        toast.error('Failed to load videos')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleWatchVideo = (video) => {
    const actionToastId = toast.info('Opening video player...', { autoClose: false })
    const url = resolveAssetUrl(video?.videoUrl || video?.url || video?.video_url)
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
        render: 'Popups blocked. Allow popups for this site.',
        type: 'error',
        autoClose: 3000,
        closeOnClick: true
      })
      return
    }

    toast.update(actionToastId, {
      render: 'Video lessons loaded',
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
    const userInstitute = String(user?.institute || '').trim().toLowerCase()
    const videoClassLocation = String(classLocations[video.classId] || '').trim().toLowerCase()
    const matchesInstitute = !userInstitute || !video.classId || videoClassLocation === userInstitute
    return matchesSearch && matchesGrade && matchesInstitute
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#0f2240 60%,#1e293b 100%)', boxShadow: '0 8px 32px rgba(15,23,42,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>
            <FiVideo className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Video Lessons</h1>
            <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>Watch live lecture recordings, experiments, and explanation lessons</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 flex items-center" style={{ border: '1.5px solid rgba(226,232,240,0.8)' }}>
        <div className="relative w-full">
          <FiSearch className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search lessons by topic or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Videos List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-500 text-sm mt-3 font-semibold">Loading video lectures...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="rounded-2xl bg-white text-center py-16 px-4" style={{ border: '1.5px solid rgba(226,232,240,0.8)' }}>
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiVideo className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Video Lessons</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {searchQuery ? 'Adjust your search query and try again.' : 'Video guides will show up here after class uploads.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5"
              style={{ border: '1.5px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.03)'}
            >
              <div>
                {/* Thumbnail / Video Banner */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 group overflow-hidden">
                  {video.thumbnailUrl || video.thumbnail_url ? (
                    <img 
                      src={resolveAssetUrl(video.thumbnailUrl || video.thumbnail_url)} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FiVideo className="h-12 w-12 text-slate-600" />
                    </div>
                  )}
                  {/* Play Action Layer overlay */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/35 hover:bg-black/45 transition-colors cursor-pointer group"
                    onClick={() => handleWatchVideo(video)}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 text-white transition-all shadow-lg scale-100 hover:scale-110">
                      <FiPlay className="h-5 w-5 fill-current text-white translate-x-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-xxs font-bold px-2 py-0.5 rounded-full text-slate-400 bg-slate-100 inline-block mb-2">
                    {formatDateTime(video.createdAt || video.created_at || video.uploaded_at)}
                  </span>
                  <h3 className="font-bold text-slate-800 leading-snug line-clamp-2">{video.title}</h3>
                  {video.description && (
                    <p className="text-xs text-slate-400 font-medium mt-1.5 line-clamp-2">{video.description}</p>
                  )}
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <div className="border-t border-slate-100/60 my-4" />
                <button
                  onClick={() => handleWatchVideo(video)}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-sm flex items-center justify-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}
                >
                  <FiPlay className="h-3.5 w-3.5 fill-current" />
                  Watch Video
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
