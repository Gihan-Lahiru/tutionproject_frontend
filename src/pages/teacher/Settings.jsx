import { useState, useContext, useCallback } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import {
  User, Edit3, Lock, Mail, Phone, Calendar, Camera, Save, X,
  MapPin, ShieldCheck, Key, Eye, EyeOff, CheckCircle2, AlertCircle
} from 'lucide-react'
import api from '../../api/axios'
import { toast } from 'react-toastify'
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

export default function Settings() {
  const { user, setUser } = useContext(AuthContext)

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
    phone: user?.phone || '',
    address: user?.address || ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const [changingPassword, setChangingPassword] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

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
      try {
        setLoading(true)
        const data = new FormData()
        data.append('profilePicture', croppedFile)
        const response = await api.post('/users/profile-picture', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setUser({ ...user, profile_picture: response.data.profile_picture })
        toast.success('Profile picture updated successfully!')
        setProfilePic(null)
        setPreviewUrl(null)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update profile picture')
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
      phone: user?.phone || '',
      address: user?.address || ''
    })
    setIsEditing(false)
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please enter both current and new password')
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirmation do not match')
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

  const getProfileSrc = (v) => {
    if (!v) return ''
    const s = String(v).trim()
    if (!s) return ''
    if (s.startsWith('http') || s.startsWith('data:')) return s
    const backendOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '')
    return s.startsWith('/') ? `${backendOrigin}${s}` : `${backendOrigin}/${s}`
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Photo Cropping Modal ── */}
      {showCropper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Crop Profile Picture</h3>
              <button
                onClick={() => { setShowCropper(false); setProfilePic(null); setPreviewUrl(null) }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative h-64 bg-slate-100 rounded-2xl overflow-hidden">
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
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Zoom Scale</label>
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
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => { setShowCropper(false); setProfilePic(null); setPreviewUrl(null) }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCropDone}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-xs">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Account & Profile Settings</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your personal teacher information, contact details, and account security.</p>
          </div>
        </div>
      </div>

      {/* ── Main Teacher Profile Card ── */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            {/* Avatar with Camera Trigger */}
            <div className="relative shrink-0 group">
              {getProfileSrc(user?.profile_picture) ? (
                <img
                  src={getProfileSrc(user?.profile_picture)}
                  alt={user?.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'M'}
                </div>
              )}
              <label
                htmlFor="profile-upload"
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer shadow-md transition-all hover:scale-105 border-2 border-white"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
                <input id="profile-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            {/* Teacher Info */}
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user?.name || 'Maleesha Wickramasinghe'}</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {user?.role === 'teacher' ? 'Teacher / Instructor' : (user?.role || 'Teacher')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {user?.email || 'maleesha123@gmail.com'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                O/L Science & A/L Chemistry Instructor · Prebhashi & Focus
              </p>
            </div>
          </div>

          {/* Edit / Save Actions */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Form Fields ── */}
        <div className="pt-6 space-y-8 max-w-4xl">
          {/* Section: Personal Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-4 rounded-full bg-blue-600"></span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Personal Information</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                {isEditing ? (
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 text-sm">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-semibold">{user?.name || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 text-sm">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold truncate">{user?.email || 'Not provided'}</span>
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    Verified
                  </span>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="07xxxxxxxx"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 text-sm">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-semibold">{user?.phone || '071 439 0924'}</span>
                  </div>
                )}
              </div>

              {/* Member Since */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Member Since
                </label>
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 text-sm">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Active Instructor'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Contact & Institute Address */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-4 rounded-full bg-blue-600"></span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Institute & Location</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Physical Teaching Centers / Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter location or institute addresses..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-none"
                />
              ) : (
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">{user?.address || 'Wellawaya Town, Sri Lanka'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Classes conducted at Prebhashi (Hettipola) & Focus (Hadungamuwa)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Security & Password Management */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-4 rounded-full bg-blue-600"></span>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Security & Access</h3>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Password Management</h4>
                    <p className="text-xs text-slate-500 font-medium">Keep your teacher login credentials secure with regular updates.</p>
                  </div>
                </div>

                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-blue-600 bg-white hover:bg-blue-50 border border-blue-200 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Change Password</span>
                  </button>
                )}
              </div>

              {/* Password Change Form */}
              {showPasswordForm && (
                <div className="pt-4 border-t border-slate-200/80 space-y-4 max-w-lg">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        placeholder="Enter your current password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        placeholder="Minimum 6 characters"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        placeholder="Re-enter new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 pt-2">
                    <button
                      onClick={() => {
                        setShowPasswordForm(false)
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      }}
                      disabled={changingPassword}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={changingPassword}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {changingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
