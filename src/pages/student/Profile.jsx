import { useState, useEffect, useContext, useCallback } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/AuthContext'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import Progress from '../../components/UI/Progress'
import { FiUser, FiMail, FiPhone, FiAward, FiDollarSign, FiClock, FiCheckCircle, FiBookOpen, FiFileText, FiVideo, FiClipboard, FiCamera, FiEdit, FiX, FiSave, FiLock, FiLogOut } from 'react-icons/fi'
import api from '../../api/axios'
import Cropper from 'react-easy-crop'

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (err) => reject(err))
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      image.setAttribute('crossOrigin', 'anonymous')
    }
    image.src = url
  })

export default function Profile() {
  const { user, setUser } = useContext(AuthContext)
  
  // Storage states
  const [videos, setVideos] = useState([])
  const [notes, setNotes] = useState([])
  const [pastPapers, setPastPapers] = useState([])
  const [assignments, setAssignments] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [courseProgress, setCourseProgress] = useState([])
  const [storageLoading, setStorageLoading] = useState(true)

  // Edit / Form states
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

  // Helper date parsing
  const toValidDateMs = (...dateStrings) => {
    for (const d of dateStrings) {
      if (d) {
        const ms = new Date(d).getTime()
        if (!Number.isNaN(ms)) return ms
      }
    }
    return null
  }

  const getTimeAgo = (date) => {
    const diffMs = Date.now() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
    return date.toLocaleDateString()
  }

  const normalizeGrade = (grade) => {
    return String(grade || '').trim().replace(/^grade\s*/i, '').trim().toLowerCase()
  }

  const formatGradeLabel = (grade) => {
    const norm = normalizeGrade(grade)
    if (!norm) return 'Not set'
    return norm.startsWith('grade') ? norm : `Grade ${norm.toUpperCase()}`
  }

  const getClassFee = () => {
    const grade = normalizeGrade(user?.grade)
    if (!grade) return null
    if (grade.includes('a/l')) return 'Rs 2,300'
    const num = parseInt(grade.replace(/\D/g, ''))
    if (num >= 6 && num <= 9) return 'Rs 1,000'
    if (num >= 10 && num <= 11) return 'Rs 1,500'
    return null
  }

  // Load backend details
  useEffect(() => {
    const fetchStorageData = async () => {
      try {
        const [videosRes, papersRes] = await Promise.all([
          api.get('/videos').catch(() => ({ data: { videos: [] } })),
          api.get('/papers').catch(() => ({ data: { papers: [] } }))
        ])
        
        const userGradeKey = normalizeGrade(user?.grade)
        const allVideos = Array.isArray(videosRes.data) ? videosRes.data : (videosRes.data?.videos || [])
        const allPapers = papersRes.data.papers || []

        const videoMatchesGrade = (v) => !userGradeKey || normalizeGrade(v?.grade) === userGradeKey
        const paperMatchesGrade = (p) => !userGradeKey || normalizeGrade(p?.grade) === userGradeKey

        setVideos(allVideos.filter(videoMatchesGrade))
        setNotes(allPapers.filter(p => p?.type === 'Note').filter(paperMatchesGrade))
        setPastPapers(allPapers.filter(p => p?.type === 'Paper').filter(paperMatchesGrade))

        const activities = []

        // Videos
        allVideos.filter(videoMatchesGrade).slice(0, 2).forEach(video => {
          const ms = toValidDateMs(video.created_at, video.createdAt)
          activities.push({
            title: `New Video: ${video.title}`,
            time: ms ? getTimeAgo(new Date(ms)) : '—',
            type: 'video',
            dateMs: ms
          })
        })

        // Papers / Notes
        allPapers.filter(paperMatchesGrade).slice(0, 2).forEach(paper => {
          const ms = toValidDateMs(paper.uploaded_at, paper.uploadedAt)
          activities.push({
            title: `New ${paper.type || 'Material'}: ${paper.title || paper.topic}`,
            time: ms ? getTimeAgo(new Date(ms)) : '—',
            type: 'notes',
            dateMs: ms
          })
        })

        // Payments
        try {
          const paymentsRes = await api.get('/payments/my-payments')
          const allPayments = paymentsRes.data.payments || []
          allPayments.slice(0, 2).forEach(p => {
            const ms = toValidDateMs(p.payment_date, p.date, p.createdAt)
            activities.push({
              title: `Payment: Rs ${p.amount} (${p.status === 'completed' ? 'Paid' : 'Pending'})`,
              time: ms ? getTimeAgo(new Date(ms)) : '—',
              type: 'payment',
              dateMs: ms
            })
          })
        } catch {}

        // Sort & slice activities
        activities.sort((a, b) => (b.dateMs || 0) - (a.dateMs || 0))
        setRecentActivity(activities.slice(0, 5))

        // Progress mock calculation
        const totalMat = allPapers.filter(paperMatchesGrade).length
        if (totalMat > 0) {
          setCourseProgress([{
            name: 'Science curriculum progress',
            progress: 100,
            details: 'All class syllabus materials unlocked'
          }])
        }
      } catch (err) {
        if (err?.response?.status >= 500) {
          toast.error('Failed to load dashboard data')
        }
      } finally {
        setStorageLoading(false)
      }
    }
    fetchStorageData()
  }, [user?.grade])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
    } catch {
      return null
    }
  }

  const handleCropDone = async () => {
    const croppedFile = await createCroppedImage()
    if (croppedFile) {
      setProfilePic(croppedFile)
      setShowCropper(false)
      try {
        setLoading(true)
        const data = new FormData()
        data.append('profilePicture', croppedFile)
        const response = await api.post('/users/profile-picture', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Profile picture updated successfully!')
        setUser({ ...user, profile_picture: response.data.profile_picture })
        setProfilePic(null)
        setPreviewUrl(null)
      } catch {
        toast.error('Failed to upload profile picture')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      const response = await api.put('/users/profile', formData)
      setUser(response.data.user)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch {
      toast.error('Failed to update profile')
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

  const getProfileImageSrc = (value) => {
    if (!value) return ''
    const raw = String(value).trim()
    if (!raw) return ''
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) return raw
    const backendOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')
    return raw.startsWith('/') ? `${backendOrigin}${raw}` : `${backendOrigin}/${raw}`
  }

  return (
    <div className="space-y-6">
      {/* Crop Modal */}
      {showCropper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Crop Your Photo</h3>
            <div className="relative h-64 bg-gray-100 rounded-xl overflow-hidden">
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
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Zoom</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCropDone}
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                Crop & Save
              </button>
              <button
                onClick={() => { setShowCropper(false); setProfilePic(null); setPreviewUrl(null) }}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all bg-slate-100 text-slate-700 border border-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#0f2240 60%,#1e293b 100%)', boxShadow: '0 8px 32px rgba(15,23,42,0.2)' }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>
            <FiUser className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">My Profile</h1>
            <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>View and manage your account information</p>
          </div>
        </div>
      </div>

      {/* Card Wrapper */}
      <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1.5px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div className="h-28" style={{ background: 'linear-gradient(90deg,#3b82f6,#6366f1)' }} />

        {/* Profile Card Header */}
        <div className="px-6 pb-6 -mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="flex items-end gap-4 flex-wrap sm:flex-nowrap">
              <div className="relative shrink-0">
                {getProfileImageSrc(user?.profile_picture) ? (
                  <img
                    src={getProfileImageSrc(user?.profile_picture)}
                    alt={user?.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-white"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center shadow-md">
                    <span className="text-blue-600 text-3xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all hover:scale-105"
                  style={{ background: '#1e293b', border: '2.5px solid #fff' }}
                >
                  <FiCamera className="w-4 h-4 text-white" />
                  <input id="profile-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
              <div className="mb-2">
                <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><FiUser className="w-3.5 h-3.5" /> ID: {user?.id?.slice(0, 10)}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>{formatGradeLabel(user?.grade)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6' }}
                >
                  <FiEdit className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    <FiX className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={loading}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}
                  >
                    <FiSave className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 my-6" />

          {/* Two Column Layout details */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 rounded-full bg-blue-600" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                    {isEditing ? (
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-xl px-3 py-2.5 text-sm border border-gray-200 outline-none focus:border-blue-400"
                      />
                    ) : (
                      <div className="flex items-center gap-2.5 h-11 px-3 rounded-xl bg-slate-50 text-gray-900 text-sm">
                        <FiUser className="w-4 h-4 text-gray-500" />
                        <span>{user?.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                    {isEditing ? (
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                        className="w-full rounded-xl px-3 py-2.5 text-sm border border-gray-200 bg-slate-100 text-gray-500 cursor-not-allowed"
                      />
                    ) : (
                      <div className="flex items-center gap-2.5 h-11 px-3 rounded-xl bg-slate-50 text-gray-900 text-sm">
                        <FiMail className="w-4 h-4 text-gray-500" />
                        <span>{user?.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-xs font-semibold text-gray-500 uppercase">Phone Number</label>
                    {isEditing ? (
                      <input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 0771234567"
                        className="w-full rounded-xl px-3 py-2.5 text-sm border border-gray-200 outline-none focus:border-blue-400"
                      />
                    ) : (
                      <div className="flex items-center gap-2.5 h-11 px-3 rounded-xl bg-slate-50 text-gray-900 text-sm">
                        <FiPhone className="w-4 h-4 text-gray-500" />
                        <span>{user?.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Academic details */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 rounded-full bg-blue-600" />
                  Academic Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Grade</label>
                    <div className="flex items-center gap-2.5 h-11 px-3 rounded-xl bg-slate-50 text-gray-900 text-sm">
                      <FiAward className="w-4 h-4 text-gray-500" />
                      <span>{formatGradeLabel(user?.grade)}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Institute</label>
                    <div className="flex items-center gap-2.5 h-11 px-3 rounded-xl bg-slate-50 text-gray-900 text-sm">
                      <FiUser className="w-4 h-4 text-gray-500" />
                      <span>{user?.institute || 'Not provided'}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Monthly Fee</label>
                    <div className="flex items-center gap-2.5 h-11 px-3 rounded-xl bg-slate-50 text-gray-900 text-sm">
                      <FiDollarSign className="w-4 h-4 text-gray-500" />
                      <span>{getClassFee() || 'Contact admin'}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Joined On</label>
                    <div className="flex items-center gap-2.5 h-11 px-3 rounded-xl bg-slate-50 text-gray-900 text-sm">
                      <FiClock className="w-4 h-4 text-gray-500" />
                      <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password update panel */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 rounded-full bg-blue-600" />
                  Security
                </h3>
                <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-4 max-w-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                      <FiLock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-950">Password Management</p>
                      <p className="text-xs text-gray-500 font-medium">Update your password to keep your account secure</p>
                    </div>
                  </div>

                  {!showPasswordForm ? (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                      style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.1),rgba(99,102,241,0.06))', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}
                    >
                      <FiLock className="w-4 h-4" />
                      Change Password
                    </button>
                  ) : (
                    <div className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Current Password</label>
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full rounded-xl px-3 py-2.5 text-sm border border-slate-200 bg-white outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">New Password</label>
                        <input
                          type="password"
                          placeholder="Minimum 6 characters"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                          className="w-full rounded-xl px-3 py-2.5 text-sm border border-slate-200 bg-white outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Confirm New Password</label>
                        <input
                          type="password"
                          placeholder="Re-enter new password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full rounded-xl px-3 py-2.5 text-sm border border-slate-200 bg-white outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={handleChangePassword}
                          disabled={changingPassword}
                          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm"
                          style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}
                        >
                          {changingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                        <button
                          onClick={() => {
                            setShowPasswordForm(false)
                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                          }}
                          disabled={changingPassword}
                          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all bg-slate-250 text-slate-700 border border-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Class Fee", value: getClassFee() || 'N/A', icon: FiDollarSign },
          { label: "Your Grade", value: formatGradeLabel(user?.grade), icon: FiAward },
          { label: "Institute", value: user?.institute || 'Not set', icon: FiUser },
          { label: "Total Videos", value: videos.length.toString(), icon: FiVideo },
          { label: "Notes & PDFs", value: notes.length.toString(), icon: FiFileText },
          { label: "Papers", value: pastPapers.length.toString(), icon: FiBookOpen }
        ].map((s, idx) => (
          <div key={idx} className="rounded-2xl p-4 bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-28">
            <s.icon className="w-6 h-6 text-blue-500 shrink-0" />
            <div>
              <p className="text-slate-400 text-xxs font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-slate-800 text-lg font-bold truncate mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress & Activities Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900">Course Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {courseProgress.length > 0 ? (
              courseProgress.map((course) => (
                <div key={course.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-bold text-slate-800">{course.name}</span>
                      {course.details && <p className="text-xs text-slate-400 font-medium mt-0.5">{course.details}</p>}
                    </div>
                    <span className="text-sm font-bold text-blue-600">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2 bg-slate-100" />
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No curriculum material available yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 text-slate-500 border border-slate-150 shrink-0">
                      {activity.type === "payment" ? (
                        <FiDollarSign className="h-4.5 w-4.5 text-emerald-500" />
                      ) : activity.type === "video" ? (
                        <FiVideo className="h-4.5 w-4.5 text-indigo-500" />
                      ) : (
                        <FiFileText className="h-4.5 w-4.5 text-blue-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 truncate">{activity.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No recent activity logs</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
