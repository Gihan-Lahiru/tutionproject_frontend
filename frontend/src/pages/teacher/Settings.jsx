import { useState, useContext, useCallback } from 'react'
import { Card, CardContent } from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import { AuthContext } from '../../contexts/AuthContext'
import { User, Edit, Lock, Mail, Phone, Calendar, Camera, Save, X, CreditCard } from 'lucide-react'
import api from '../../api/axios'
import { toast } from 'react-toastify'
import Cropper from 'react-easy-crop'

// Helper function for creating image from URL
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
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
        
        setUser({
          ...user,
          profile_picture: response.data.profile_picture
        })
        
        toast.success('Profile picture updated successfully!')
        setProfilePic(null)
        setPreviewUrl(null)
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(error.response?.data?.message || 'Failed to update profile picture')
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
      
      setUser({
        ...user,
        profile_picture: response.data.profile_picture
      })
      
      toast.success('Profile picture updated successfully!')
      setProfilePic(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to update profile picture')
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-7 h-7 text-blue-600" />
          Profile Settings
        </h1>
        <p className="text-gray-600 mt-1">
          View and manage your account information
        </p>
      </div>

      {/* Profile Card */}
      <Card className="border-none shadow-lg overflow-hidden">
        {/* Header with gradient */}
        <div className="h-24 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500" />

        <CardContent className="p-6 -mt-12">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
            <div className="relative">
              {user?.profile_picture ? (
                <img 
                  src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://localhost:5000${user.profile_picture}`}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <label 
                htmlFor="profile-upload" 
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {user?.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  Teacher ID: {user?.id?.slice(0, 12)}...
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {user?.role || 'Teacher'}
                </span>
              </div>
            </div>
            {!isEditing ? (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges} disabled={loading}>
                  <Save className="w-4 h-4 mr-1" />
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </div>

          {/* Upload Photo Preview */}
          {previewUrl && !showCropper && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New profile picture ready
                  </p>
                  <p className="text-xs text-gray-600">
                    Click upload to save your new photo
                  </p>
                </div>
                <Button onClick={handlePhotoUpload} disabled={loading}>
                  {loading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          )}

          <div className="border-b border-gray-200 my-6"></div>

          {/* Profile Details */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
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
                      <User className="w-4 h-4 text-gray-600" />
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
                      disabled
                    />
                  ) : (
                    <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-gray-50">
                      <Mail className="w-4 h-4 text-gray-600" />
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
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="077-1234567"
                    />
                  ) : (
                    <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-gray-50">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">
                        {user?.phone || 'Not provided'}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="joined" className="text-sm text-gray-600">
                    Member Since
                  </label>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-md bg-gray-50">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-900">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Contact Details
              </h3>
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm text-gray-600">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your address"
                  />
                ) : (
                  <div className="p-3 rounded-md bg-gray-50 min-h-[80px]">
                    <span className="text-gray-900">
                      {user?.address || 'Not provided'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Teaching Statistics */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Teaching Overview
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">16</div>
                  <div className="text-sm text-gray-600 mt-1">Total Classes</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">416</div>
                  <div className="text-sm text-gray-600 mt-1">Total Students</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">2</div>
                  <div className="text-sm text-gray-600 mt-1">Institutes</div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Security
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-600">Use current password and set a new one</p>
                  </div>
                </div>

                {!showPasswordForm ? (
                  <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(true)}>
                    Change Password
                  </Button>
                ) : (
                  <>
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
                      <Button variant="outline" size="sm" onClick={handleChangePassword} disabled={changingPassword}>
                        {changingPassword ? 'Changing...' : 'Update Password'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowPasswordForm(false)
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                        }}
                        disabled={changingPassword}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
