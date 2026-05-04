import { useState, useContext, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import Input from '../../components/UI/Input'
import Progress from '../../components/UI/Progress'
import { AuthContext } from '../../contexts/AuthContext'
import { FiEdit, FiLock, FiMail, FiPhone, FiUser, FiCalendar, FiVideo, FiFileText, FiBookOpen, FiClipboard, FiClock, FiCheckCircle, FiAward, FiCamera, FiDollarSign, FiSave, FiX, FiCreditCard, FiDownload, FiEye } from 'react-icons/fi'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import Cropper from 'react-easy-crop'

export default function Profile() {
  const { user, setUser } = useContext(AuthContext)

  const parseSqliteDateTimeMs = (value) => {
    if (typeof value !== 'string') return null
    const s = value.trim()
    if (!s) return null

    // Handles: YYYY-MM-DD, YYYY-MM-DD HH:mm, YYYY-MM-DD HH:mm:ss
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/)
    if (!m) return null

    const year = Number(m[1])
    const month = Number(m[2])
    const day = Number(m[3])
    const hour = Number(m[4] || 0)
    const minute = Number(m[5] || 0)
    const second = Number(m[6] || 0)

    // SQLite CURRENT_TIMESTAMP is UTC; treat this format as UTC to avoid “X hours ago” drift
    const ms = Date.UTC(year, month - 1, day, hour, minute, second)
    return Number.isNaN(ms) ? null : ms
  }

  const toValidDateMs = (...candidates) => {
    for (const candidate of candidates) {
      if (!candidate) continue
      if (candidate instanceof Date) {
        const ms = candidate.getTime()
        if (!Number.isNaN(ms)) return ms
        continue
      }

      if (typeof candidate === 'string') {
        const sqliteMs = parseSqliteDateTimeMs(candidate)
        if (sqliteMs != null) return sqliteMs
      }

      const date = new Date(candidate)
      const ms = date.getTime()
      if (!Number.isNaN(ms)) return ms
    }
    return null
  }

  const normalizeGrade = (gradeValue) => {
    if (!gradeValue) return null
    const gradeStr = String(gradeValue).trim().toLowerCase()
    if (!gradeStr) return null

    // Keep A/L as a special bucket
    if (gradeStr.includes('a/l') || gradeStr.includes('al')) return 'al'

    const gradeNum = parseInt(gradeStr.replace(/\D/g, ''), 10)
    return Number.isFinite(gradeNum) ? String(gradeNum) : gradeStr
  }

  const formatGradeLabel = (gradeValue) => {
    if (!gradeValue) return 'N/A'
    const g = String(gradeValue).trim()
    if (!g) return 'N/A'
    return g.toLowerCase().includes('grade') ? g : `Grade ${g}`
  }

  const getClassTypeName = (gradeValue) => {
    if (!gradeValue) return 'My Class'
    const gradeStr = String(gradeValue).toLowerCase().trim()
    
    if (gradeStr.includes('a/l') || gradeStr.includes('al')) return 'A/L Class'
    
    const gradeNum = parseInt(gradeStr.replace(/\D/g, ''))
    if (Number.isFinite(gradeNum)) {
      if (gradeNum >= 6 && gradeNum <= 9) return 'Junior Class'
      if (gradeNum >= 10 && gradeNum <= 11) return ''
    }
    
    return 'My Class'
  }

  const getTimeAgo = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '—'
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'week' : 'weeks'} ago`
    // For older items, show an unambiguous day/month date + time
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }
  
  // Get class fee based on grade
  const getClassFee = () => {
    const grade = user?.grade?.toLowerCase()
    if (!grade) return null
    
    if (grade.includes('a/l')) return 'Rs 2,300'
    
    const gradeNum = parseInt(grade.replace(/\D/g, ''))
    if (gradeNum >= 6 && gradeNum <= 9) return 'Rs 1,000'
    if (gradeNum >= 10 && gradeNum <= 11) return 'Rs 1,500'
    
    return null
  }

  // State for storage data
  const [videos, setVideos] = useState([])
  const [notes, setNotes] = useState([])
  const [pastPapers, setPastPapers] = useState([])
  const [assignments, setAssignments] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [courseProgress, setCourseProgress] = useState([])
  const [storageLoading, setStorageLoading] = useState(true)

  // Fetch storage data
  useEffect(() => {
    const fetchStorageData = async () => {
      try {
        const [videosRes, papersRes] = await Promise.all([
          api.get('/videos'),
          api.get('/papers')
        ])
        
        // Filter by user's grade
        const userGradeKey = normalizeGrade(user?.grade)
        const allVideos = Array.isArray(videosRes.data)
          ? videosRes.data
          : (videosRes.data?.videos || [])
        const allPapers = papersRes.data.papers || []

        const videoMatchesGrade = (video) => {
          if (!userGradeKey) return true
          return normalizeGrade(video?.grade) === userGradeKey
        }

        const paperMatchesGrade = (paper) => {
          if (!userGradeKey) return true
          return normalizeGrade(paper?.grade) === userGradeKey
        }

        setVideos(allVideos.filter(videoMatchesGrade))
        setNotes(allPapers.filter(p => p?.type === 'Note').filter(paperMatchesGrade))
        setPastPapers(allPapers.filter(p => p?.type === 'Paper').filter(paperMatchesGrade))
        
        // Build recent activity from actual data
        const activities = []
        
        // Add recent videos (up to 2 most recent)
        const recentVideos = allVideos
          .filter(videoMatchesGrade)
          .sort((a, b) => {
            const bMs = toValidDateMs(b?.created_at, b?.createdAt, b?.uploaded_at, b?.uploadedAt)
            const aMs = toValidDateMs(a?.created_at, a?.createdAt, a?.uploaded_at, a?.uploadedAt)
            return (bMs || 0) - (aMs || 0)
          })
          .slice(0, 2)
        
        recentVideos.forEach(video => {
          const dateMs = toValidDateMs(video?.created_at, video?.createdAt, video?.uploaded_at, video?.uploadedAt)
          const timeAgo = dateMs ? getTimeAgo(new Date(dateMs)) : '—'
          activities.push({
            title: `New Video: ${video.title}`,
            time: timeAgo,
            type: 'video',
            status: 'completed',
            dateMs
          })
        })
        
        // Add recent notes/past papers (up to 2 most recent)
        const recentPapers = allPapers
          .filter(paperMatchesGrade)
          .sort((a, b) => {
            const bMs = toValidDateMs(b?.uploaded_at, b?.uploadedAt, b?.created_at, b?.createdAt)
            const aMs = toValidDateMs(a?.uploaded_at, a?.uploadedAt, a?.created_at, a?.createdAt)
            return (bMs || 0) - (aMs || 0)
          })
          .slice(0, 2)
        
        recentPapers.forEach(paper => {
          const dateMs = toValidDateMs(paper?.uploaded_at, paper?.uploadedAt, paper?.created_at, paper?.createdAt)
          const timeAgo = dateMs ? getTimeAgo(new Date(dateMs)) : '—'
          const typeLabel =
            paper.type === 'Note'
              ? 'Note'
              : paper.type === 'Assignment'
                ? 'Assignment'
                : 'Paper'
          const paperTopic = String(paper.topic || paper.title || 'New material').trim()
          activities.push({
            title: `New ${typeLabel}: ${paperTopic}`,
            time: timeAgo,
            type: 'notes',
            status: 'completed',
            dateMs
          })
        })
        
        // Try to fetch payments
        try {
          const paymentsRes = await api.get('/payments/my-payments')
          const allPayments = paymentsRes.data.payments || []
          
          // Add recent payments (up to 2 most recent)
          const recentPayments = allPayments
            .sort((a, b) => {
              const bMs = toValidDateMs(b?.payment_date, b?.date, b?.created_at, b?.createdAt)
              const aMs = toValidDateMs(a?.payment_date, a?.date, a?.created_at, a?.createdAt)
              return (bMs || 0) - (aMs || 0)
            })
            .slice(0, 2)
          
          recentPayments.forEach(payment => {
            const dateMs = toValidDateMs(payment?.payment_date, payment?.date, payment?.created_at, payment?.createdAt)
            const timeAgo = dateMs ? getTimeAgo(new Date(dateMs)) : '—'
            activities.push({
              title: `Payment: Rs ${payment.amount} - ${payment.status === 'completed' ? 'Paid' : 'Pending'}`,
              time: timeAgo,
              type: 'payment',
              status: payment.status === 'completed' ? 'completed' : 'pending',
              dateMs
            })
          })
        } catch (paymentError) {
          console.log('Payments not available:', paymentError.message)
        }
        
        // Try to fetch assignments, but don't fail if endpoint doesn't work
        try {
          const assignmentsRes = await api.get('/assignments/my-assignments')
          const allAssignments = assignmentsRes.data.assignments || []
          setAssignments(allAssignments)
          
          // Add recent assignments (up to 2 most recent with due dates)
          const upcomingAssignments = allAssignments
            .filter(a => a.due_date && new Date(a.due_date) > new Date())
            .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
            .slice(0, 2)
          
          upcomingAssignments.forEach(assignment => {
            const dueDate = new Date(assignment.due_date)
            const daysUntil = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24))
            const dateMs = Number.isNaN(dueDate.getTime()) ? null : dueDate.getTime()
            activities.push({
              title: `Assignment: ${assignment.title}`,
              time: daysUntil === 0 ? 'Due today' : daysUntil === 1 ? 'Due tomorrow' : `Due in ${daysUntil} days`,
              type: 'assignment',
              status: assignment.submitted_at ? 'submitted' : 'pending',
              dateMs
            })
          })
        } catch (assignmentError) {
          console.log('Assignments not available:', assignmentError.message)
          setAssignments([]) // Set empty array if assignments feature not available
        }
        
        // Sort all activities by date (most recent first) and limit to 6
        activities.sort((a, b) => (b.dateMs || 0) - (a.dateMs || 0))
        setRecentActivity(activities.slice(0, 6))
        
        // Calculate course progress based on materials available
        const totalMaterials = allPapers.filter(paperMatchesGrade).length
        const notesCount = allPapers.filter(p => p?.type === 'Note').filter(paperMatchesGrade).length
        const papersCount = allPapers.filter(p => p?.type === 'Paper').filter(paperMatchesGrade).length
        
        const progress = []
        if (totalMaterials > 0) {
          const progressPercentage = Math.min(100, Math.round((totalMaterials / Math.max(totalMaterials, 1)) * 100))
          progress.push({
            name: "Science Progress",
            progress: progressPercentage,
            details: `${notesCount} Notes, ${papersCount} Papers`
          })
        }
        setCourseProgress(progress)
        
      } catch (error) {
        console.error('Error fetching storage data:', error)
        toast.error('Failed to load storage data')
      } finally {
        setStorageLoading(false)
      }
    }
    
    fetchStorageData()
  }, [user?.grade])

  // Dashboard data
  const stats = [
    { label: "Total Videos", value: videos.length.toString(), icon: FiVideo, color: "text-primary" },
    { label: "Notes & PDFs", value: notes.length.toString(), icon: FiFileText, color: "text-primary" },
    { label: "Papers", value: pastPapers.length.toString(), icon: FiBookOpen, color: "text-primary" },
    { label: "Assignments", value: assignments.length.toString(), icon: FiClipboard, color: "text-primary" },
  ]

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profilePic, setProfilePic] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [showCropper, setShowCropper] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [changingPassword, setChangingPassword] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please enter current and new password')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match')
      return
    }

    try {
      setChangingPassword(true)
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      toast.success('Password changed successfully')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      setProfilePic(file)
      setPreviewUrl(URL.createObjectURL(file))
      setShowCropper(true)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    }
  }

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createCroppedImage = async () => {
    try {
      const image = await createImage(previewUrl)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(new File([blob], profilePic.name, { type: profilePic.type }))
        }, profilePic.type)
      })
    } catch (error) {
      console.error('Error cropping image:', error)
      return null
    }
  }

  const handleCropDone = async () => {
    const croppedFile = await createCroppedImage()
    if (croppedFile) {
      setProfilePic(croppedFile)
      setShowCropper(false)
      
      // Automatically upload after cropping
      try {
        setLoading(true)
        const formData = new FormData()
        formData.append('profilePicture', croppedFile)
        
        const response = await api.post('/users/profile-picture', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        toast.success('Profile picture updated successfully!')
        
        // Update user context with new profile picture
        setUser({
          ...user,
          profile_picture: response.data.profile_picture
        })
        
        setProfilePic(null)
        setPreviewUrl(null)
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(error.response?.data?.message || 'Failed to upload profile picture')
      } finally {
        setLoading(false)
      }
    }
  }

  const handlePhotoUpload = async () => {
    if (!profilePic) {
      toast.error('Please select a photo first')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('profilePicture', profilePic)
      
      const response = await api.post('/users/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      toast.success('Profile picture updated successfully!')
      
      // Update user context with new profile picture
      setUser({
        ...user,
        profile_picture: response.data.profile_picture
      })
      
      setProfilePic(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload profile picture')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      const response = await api.put('/users/profile', formData)
      setUser(response.data.user)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    })
    setIsEditing(false)
  }

  const handleDownload = async (item, type) => {
    const actionToastId = toast.info('Download starts...', { autoClose: false })

    try {
      if (type === 'video') {
        // Videos open in new tab to watch
        await api.post(`/videos/${item.id}/view`)
        const openedWindow = window.open(item.video_url, '_blank')
        if (!openedWindow) {
          throw new Error('Popup blocked')
        }

        toast.update(actionToastId, {
          render: 'Download completed',
          type: 'success',
          autoClose: 3000,
          closeOnClick: true
        })
      } else {
        // Increment download count in background so the watermarked download starts faster.
        api.post(`/papers/${item.id}/download`).catch((err) => {
          console.error('Download count update error:', err)
        })
        
        // Fetch watermarked file with authentication using blob response
        const response = await api.get(`/papers/${item.id}/download`, {
          responseType: 'blob'
        })
        
        // Extract filename from Content-Disposition header or use title
        let filename = String(item.topic || item.title || 'document').trim()
        const contentDisposition = response.headers['content-disposition']
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        }
        
        // Create blob with proper type and download
        const blob = new Blob([response.data], { type: response.headers['content-type'] })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast.update(actionToastId, {
          render: 'Download completed',
          type: 'success',
          autoClose: 3000,
          closeOnClick: true
        })
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.update(actionToastId, {
        render: 'Failed to download file',
        type: 'error',
        autoClose: 3000,
        closeOnClick: true
      })
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Image Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold mb-4">Crop Your Photo</h3>
            <div className="relative h-96 bg-gray-100 rounded-lg mb-4">
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoom
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleCropDone} className="flex-1">
                Done
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCropper(false)
                  setProfilePic(null)
                  setPreviewUrl(null)
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          My Profile
        </h1>
        <p className="text-gray-600 mt-1">
          View and manage your account information
        </p>
      </div>

      {/* Header Banner */}
      <div className="relative bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold overflow-hidden shadow-xl border-4 border-white">
                {user?.profile_picture ? (
                  <img
                    src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://localhost:5000${user.profile_picture}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <FiCamera className="w-4 h-4 text-gray-600" />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                Grade {user?.grade || 'Not set'}
              </span>
            </div>
          </div>
          {!isEditing ? (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setIsEditing(true)}
            >
              <FiEdit className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <FiX className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90 border-none shadow-md" onClick={handleSaveChanges} disabled={loading}>
                <FiSave className="w-4 h-4 mr-1" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Information - Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Personal Information */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <FiUser className="w-5 h-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-gray-600">
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-gray-50">
                      <FiUser className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">{user?.name}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-gray-600">
                    Email Address
                  </label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-gray-50">
                      <FiMail className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">{user?.email}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm text-gray-600">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-gray-50">
                      <FiPhone className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">{user?.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Role</label>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-gray-50">
                    <FiUser className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-900 capitalize">{user?.role}</span>
                  </div>
                </div>
              </div>
          </CardContent>
        </Card>

        {/* Right Column - Academic Info & Security */}
        <div className="space-y-6">
          {/* Academic Information Card */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <FiAward className="w-5 h-5 text-primary" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Grade</label>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-gray-50">
                    <FiAward className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-900">{user?.grade || 'Not set'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600">Monthly Fee</label>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-gray-50">
                    <FiDollarSign className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-900">{getClassFee() || 'Contact admin'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <FiLock className="w-5 h-5 text-primary" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!showPasswordForm ? (
                <Button
                  variant="outline"
                  className="gap-2 w-full"
                  onClick={() => setShowPasswordForm(true)}
                >
                  <FiLock className="w-4 h-4" />
                  Change Password
                </Button>
              ) : (
                <div className="space-y-3">
                  <Input
                    type="password"
                    autoComplete="current-password"
                    spellCheck={false}
                    placeholder="Current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  />
                  <Input
                    type="password"
                    autoComplete="new-password"
                    spellCheck={false}
                    placeholder="New password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                  />
                  <Input
                    type="password"
                    autoComplete="new-password"
                    spellCheck={false}
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="gap-2 w-full"
                      onClick={handleChangePassword}
                      disabled={changingPassword}
                    >
                      <FiLock className="w-4 h-4" />
                      {changingPassword ? 'Changing...' : 'Update Password'}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setShowPasswordForm(false)
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      }}
                      disabled={changingPassword}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <FiDollarSign className="w-6 h-6 text-primary mb-2" />
              <p className="text-gray-600 text-xs font-medium">Monthly Class Fee</p>
              <p className="text-gray-900 text-xl font-bold mt-1">{getClassFee() || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <FiAward className="w-6 h-6 text-primary mb-2" />
              <p className="text-gray-600 text-xs font-medium">Your Grade</p>
              <p className="text-gray-900 text-xl font-bold mt-1">{formatGradeLabel(user?.grade)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <FiVideo className="w-6 h-6 text-primary mb-2" />
              <p className="text-gray-600 text-xs font-medium">Total Videos</p>
              <p className="text-gray-900 text-xl font-bold mt-1">{videos.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <FiFileText className="w-6 h-6 text-primary mb-2" />
              <p className="text-gray-600 text-xs font-medium">Notes & PDFs</p>
              <p className="text-gray-900 text-xl font-bold mt-1">{notes.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <FiBookOpen className="w-6 h-6 text-primary mb-2" />
              <p className="text-gray-600 text-xs font-medium">Papers</p>
              <p className="text-gray-900 text-xl font-bold mt-1">{pastPapers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <FiClipboard className="w-6 h-6 text-primary mb-2" />
              <p className="text-gray-600 text-xs font-medium">Assignments</p>
              <p className="text-gray-900 text-xl font-bold mt-1">{assignments.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseProgress.length > 0 ? (
              courseProgress.map((course) => (
                <div key={course.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{course.name}</span>
                      {course.details && (
                        <p className="text-xs text-gray-500 mt-0.5">{course.details}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No materials available yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 ${
                        activity.status === "pending" ? "text-gray-500" : "text-primary"
                      }`}
                    >
                      {activity.type === "payment" ? (
                        <FiDollarSign className="h-5 w-5" />
                      ) : activity.type === "video" ? (
                        <FiVideo className="h-5 w-5" />
                      ) : activity.type === "notes" ? (
                        <FiFileText className="h-5 w-5" />
                      ) : activity.status === "pending" ? (
                        <FiClock className="h-5 w-5" />
                      ) : (
                        <FiCheckCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper function to create image element from URL
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })
