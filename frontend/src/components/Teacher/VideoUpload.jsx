import { useState, useEffect } from "react"
import { Upload, Video as VideoIcon, X, Image as ImageIcon } from "lucide-react"
import api from '../../api/axios'
import { toast } from 'react-toastify'

const normalizeGradeValue = (gradeValue) => {
  const raw = String(gradeValue || '').trim()
  if (!raw) return ''
  const digits = raw.match(/\d+/)?.[0]
  return digits || raw
}

export default function VideoUpload({ onUploadSuccess, classContext = null }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    grade: normalizeGradeValue(classContext?.grade),
    subject: 'Science',
    description: ''
  })

  useEffect(() => {
    if (!classContext?.grade) return
    setFormData((prev) => ({
      ...prev,
      grade: normalizeGradeValue(classContext.grade),
    }))
  }, [classContext])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
    }
  }, [thumbnailPreview])

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Thumbnail must be smaller than 5MB')
      e.target.value = ''
      return
    }

    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
    setThumbnail(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const removeThumbnail = () => {
    setThumbnail(null)
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview)
      setThumbnailPreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.url || !formData.grade) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setUploading(true)
      const payload = new FormData()
      payload.append('title', formData.title)
      payload.append('url', formData.url)
      payload.append('grade', formData.grade)
      payload.append('subject', formData.subject)
      payload.append('description', formData.description)
      if (thumbnail) payload.append('thumbnail', thumbnail)

      if (classContext?.id) {
        await api.post(`/videos/class/${classContext.id}`, payload)
      } else {
        await api.post('/videos', payload)
      }
      
      toast.success('Video uploaded successfully!')
      setFormData({
        title: '',
        url: '',
        grade: '',
        subject: 'Science',
        description: ''
      })
      removeThumbnail()
      
      if (onUploadSuccess) onUploadSuccess()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload video')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Video</h3>
      <p className="text-sm text-gray-600 mb-4">Add a new video lesson (YouTube, Vimeo, or direct link)</p>
      {classContext && (
        <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-800">
          Upload target class: {classContext.title}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Newton's Laws of Motion"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Supports YouTube, Vimeo, or direct video links
          </p>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail Image (Optional)
          </label>
          {thumbnailPreview ? (
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                aria-label="Remove thumbnail"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-colors">
              <ImageIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Choose Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Grade and Subject */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade <span className="text-red-500">*</span>
            </label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              disabled={!!classContext}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select grade</option>
              {[6, 7, 8, 9, 10, 11, 12, 13].map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Science"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of the video content..."
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  )
}
