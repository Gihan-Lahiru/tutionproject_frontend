import { useState, useContext, useCallback } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { User, Edit, Lock, Mail, Phone, Calendar, Camera, Save, X, CreditCard, MapPin, Activity } from 'lucide-react'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import Cropper from 'react-easy-crop'

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (err) => reject(err))
    image.setAttribute('crossOrigin', 'anonymous')
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

  const getProfileSrc = (v) => {
    if (!v) return ''
    const s = String(v).trim()
    if (!s) return ''
    if (s.startsWith('http') || s.startsWith('data:')) return s
    return s.startsWith('/') ? `http://localhost:5000${s}` : `http://localhost:5000/${s}`
  }

  return (
    <div className="space-y-6">
      {/* Crop Modal */}
      {showCropper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4" style={{ border: '1px solid rgba(226,232,240,0.8)' }}>
            <h3 className="text-lg font-bold text-gray-900">Crop Your Photo</h3>
            <div className="relative h-64 bg-gray-150 rounded-xl overflow-hidden">
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
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}
              >
                Crop & Save
              </button>
              <button
                onClick={() => { setShowCropper(false); setProfilePic(null); setPreviewUrl(null) }}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
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
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile Settings</h1>
            <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>View and manage your account information</p>
          </div>
        </div>
      </div>

      {/* Main card wrapper */}
      <div className="rounded-2xl overflow-hidden bg-white" style={{ border: '1.5px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div className="h-28" style={{ background: 'linear-gradient(90deg, #1d4ed8, #4f46e5)' }} />

        {/* Profile Details Area */}
        <div className="px-6 pb-6 -mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div className="flex items-end gap-4 flex-wrap sm:flex-nowrap">
              <div className="relative shrink-0">
                {getProfileSrc(user?.profile_picture) ? (
                  <img
                    src={getProfileSrc(user?.profile_picture)}
                    alt={user?.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-white"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-blue-150 flex items-center justify-center shadow-md">
                    <span className="text-blue-600 text-3xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                )}
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all"
                  style={{ background: '#1e293b', border: '2.5px solid #fff' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Camera className="w-4 h-4 text-white" />
                  <input id="profile-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
              <div className="mb-2">
                <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> ID: {user?.id?.slice(0, 10)}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{user?.role || 'Teacher'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: 'rgba(59,130,246,0.08)', color: '#3b82f6' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.08)'}
                >
                  <Edit className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={loading}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}
                  >
                    <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 my-6" />

          {/* Form details */}
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-3.5 rounded-full bg-blue-600" />
                Personal Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
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
                    <div className="flex items-center gap-2.5 h-11 px-3 rounded-xl bg-gray-50 border border-transparent text-gray-900 text-sm">
                      <User className="w-4 h-4 text-gray-600" />
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
                      className="w-full rounded-xl px-3 py-2.5 text-sm border border-gray-200 outline-none bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  ) : (
                    <div className="flex items-center gap-2.5 h-11 px-3 rounded-xl bg-gray-50 border border-transparent text-gray-900 text-sm">
                      <Mail className="w-4 h-4 text-gray-600" />
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
                      placeholder="e.g., 0771234567"
                      className="w-full rounded-xl px-3 py-2.5 text-sm border border-gray-200 outline-none focus:border-blue-400"
                    />
                  ) : (
                    <div className="flex items-center gap-2.5 h-11 px-3 rounded-xl bg-gray-50 border border-transparent text-gray-900 text-sm">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span>{user?.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Member Since</label>
                  <div className="flex items-center gap-2.5 h-11 px-3 rounded-xl bg-gray-50 border border-transparent text-gray-900 text-sm">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-3.5 rounded-full bg-blue-600" />
                Contact Details
              </h3>
              <div className="space-y-1">
                <label htmlFor="address" className="text-xs font-semibold text-gray-500 uppercase">Address</label>
                {isEditing ? (
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full rounded-xl p-3 text-sm border border-gray-200 outline-none focus:border-blue-400 resize-none"
                    placeholder="Enter your address"
                  />
                ) : (
                  <div className="flex gap-2.5 p-3 rounded-xl bg-gray-50 border border-transparent text-gray-900 text-sm min-h-[70px]">
                    <MapPin className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
                    <span>{user?.address || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-3.5 rounded-full bg-blue-600" />
                Security
              </h3>
              <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 space-y-4 max-w-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-blue-600" />
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
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <Lock className="w-4 h-4" />
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
                        className="w-full rounded-xl px-3 py-2.5 text-sm border border-gray-200 bg-white outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">New Password</label>
                      <input
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full rounded-xl px-3 py-2.5 text-sm border border-gray-200 bg-white outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Re-enter new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full rounded-xl px-3 py-2.5 text-sm border border-gray-200 bg-white outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
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
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
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
  )
}
