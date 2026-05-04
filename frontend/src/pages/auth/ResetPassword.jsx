import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Card from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import api from '../../api/axios'
import { toast } from 'react-toastify'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const presetEmail = useMemo(() => searchParams.get('email') || '', [searchParams])

  const [email, setEmail] = useState(presetEmail)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !code) {
      toast.error('Email and reset code are required')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', {
        email,
        code,
        newPassword,
      })
      toast.success('Password reset successful. Please login.')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-gray-600">Enter your reset code and set a new password</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="student@example.com"
              />

              <Input
                label="Reset Code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="Enter 6-digit code"
              />

              <Input
                label="New Password"
                type="password"
                autoComplete="new-password"
                spellCheck={false}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
              />

              <Input
                label="Confirm New Password"
                type="password"
                autoComplete="new-password"
                spellCheck={false}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="mr-3 text-sm text-primary hover:underline">
              Request new code
            </Link>
            <Link to="/login" className="text-sm text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
