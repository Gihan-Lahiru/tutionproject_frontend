import { useState, useEffect } from 'react'
import { Play, Eye, Clock, Trash2 } from "lucide-react"
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function VideoLibrary({ refreshTrigger }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [refreshTrigger])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await api.get('/videos')
      setVideos(response.data || [])
    } catch (error) {
      console.error('Error fetching videos:', error)
      toast.error('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return
    }

    try {
      await api.delete(`/videos/${id}`)
      toast.success('Video deleted successfully')
      fetchVideos()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete video')
    }
  }

  const openVideo = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Video Library</h3>
        <span className="text-sm text-gray-500">{videos.length} videos</span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading videos...</div>
        ) : videos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No videos uploaded yet. Upload your first video!
          </div>
        ) : (
          videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors shrink-0">
                  <Play className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{video.title}</p>
                  <p className="text-sm text-gray-600">
                    Grade {video.grade} - {video.subject || 'Science'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openVideo(video.url)}
                  className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                  title="Play video"
                >
                  <Play className="w-4 h-4 text-purple-600" />
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete video"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
