import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'
import Card from '../../components/UI/Card'
import { toast } from 'react-toastify'
import api from '../../api/axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
      toast.success('Password reset code sent to your email!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset code')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset code to <strong>{email}</strong>
          </p>
          <Link to={`/reset-password?email=${encodeURIComponent(email)}`}>
            <Button className="w-full">Continue to Reset Password</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-gray-600">
            Enter your email to receive a reset code
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="student@example.com"
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
